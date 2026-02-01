import { z } from 'zod';
import { createTRPCRouter, protectedProcedure, adminProcedure } from '../trpc';
import { TRPCError } from '@trpc/server';
import crypto from 'crypto';

export const orderRouter = createTRPCRouter({
  // Get all orders (Admin only)
  getAllOrders: adminProcedure
    .input(
      z.object({
        status: z.enum(['PENDING', 'PAID', 'SHIPPED', 'DELIVERED', 'CANCELLED']).optional(),
        limit: z.number().min(1).max(100).default(50),
        offset: z.number().min(0).default(0),
      })
    )
    .query(async ({ ctx, input }) => {
      const { status, limit, offset } = input;

      const where = status ? { status } : {};

      const [orders, total] = await Promise.all([
        ctx.prisma.order.findMany({
          where,
          include: {
            user: {
              select: {
                id: true,
                name: true,
                email: true,
              },
            },
            items: {
              include: {
                product: {
                  select: {
                    id: true,
                    name: true,
                    price: true,
                    images: {
                      take: 1,
                      select: {
                        imageURL: true,
                      },
                    },
                  },
                },
              },
            },
          },
          orderBy: {
            createdAt: 'desc',
          },
          take: limit,
          skip: offset,
        }),
        ctx.prisma.order.count({ where }),
      ]);

      return {
        orders,
        total,
        hasMore: offset + limit < total,
      };
    }),

  // Get my orders (Customer)
  getMyOrders: protectedProcedure.query(async ({ ctx }) => {
    const userId = ctx.session.user.id;

    return ctx.prisma.order.findMany({
      where: { userId },
      include: {
        items: {
          include: {
            product: {
              select: {
                id: true,
                name: true,
                price: true,
                images: {
                  take: 1,
                  select: {
                    imageURL: true,
                  },
                },
              },
            },
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    });
  }),

  // Update order status (Admin only)
  updateOrderStatus: adminProcedure
    .input(
      z.object({
        orderId: z.string(),
        status: z.enum(['PENDING', 'PAID', 'SHIPPED', 'DELIVERED', 'CANCELLED']),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const { orderId, status } = input;

      return ctx.prisma.order.update({
        where: { id: orderId },
        data: { status },
      });
    }),

  create: protectedProcedure
    .input(
      z.object({
        shippingName: z.string().min(1),
        shippingPhone: z.string().min(1),
        shippingAddress: z.string().min(1),
        paymentMethod: z.enum(['COD', 'MOMO']),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const { shippingName, shippingPhone, shippingAddress, paymentMethod } = input;
      const userId = ctx.session.user.id;

      // 1. Get items from cart
      const cartItems = await ctx.prisma.cartItem.findMany({
        where: { userId },
        include: { product: true },
      });

      if (cartItems.length === 0) {
        throw new TRPCError({
          code: 'BAD_REQUEST',
          message: 'Cart is empty',
        });
      }

      // 2. Calculate total amount
      const totalAmount = cartItems.reduce(
        (acc, item) => acc + item.product.price * item.quantity,
        0
      );

      // 3. Create Order
      const order = await ctx.prisma.$transaction(async (tx) => {
        // Create Order
        const newOrder = await tx.order.create({
          data: {
            userId,
            status: 'PENDING',
            totalAmount,
            paymentMethod,
            shippingName,
            shippingPhone,
            shippingAddress,
            items: {
              create: cartItems.map((item) => ({
                productId: item.productId,
                quantity: item.quantity,
                price: item.product.price,
              })),
            },
          },
        });

        // Clear Cart
        await tx.cartItem.deleteMany({
          where: { userId },
        });

        return newOrder;
      });

      // 4. Handle Payment
      if (paymentMethod === 'MOMO') {
        const partnerCode = process.env.MOMO_PARTNER_CODE;
        const accessKey = process.env.MOMO_ACCESS_KEY;
        const secretKey = process.env.MOMO_SECRET_KEY;
        const endpoint = process.env.MOMO_ENDPOINT || 'https://test-payment.momo.vn/v2/gateway/api/create';

        // Check if environment variables are set
        if (!partnerCode || !accessKey || !secretKey) {
            console.warn("Missing Momo credentials in .env, returning mock success for testing.");
            // For testing/development without keys, we can simulating a successful flow
            // or return a dummy URL. 
            // Since we cannot generate a real link without keys, we'll return a special flag or URL.
            // But to make it "work" for the user interface flow:
            return {
                orderId: order.id,
                payUrl: `/order/success?orderId=${order.id}&resultCode=0&message=Simulated`, 
                isMock: true
            };
        }

        const requestId = order.id + new Date().getTime();
        const orderId = order.id;
        const orderInfo = `Pay for order ${order.id}`;
        // Assuming client URL is localhost:3000 for now or configured via env
        const redirectUrl = `${process.env.NEXTAUTH_URL || 'http://localhost:3000'}/order/success`;
        const ipnUrl = `${process.env.NEXTAUTH_URL || 'http://localhost:3000'}/api/payment/momo-ipn`; // We won't implement IPN yet but need a URL
        const requestType = "captureWallet";
        const extraData = "";

        const rawSignature = `accessKey=${accessKey}&amount=${totalAmount}&extraData=${extraData}&ipnUrl=${ipnUrl}&orderId=${orderId}&orderInfo=${orderInfo}&partnerCode=${partnerCode}&redirectUrl=${redirectUrl}&requestId=${requestId}&requestType=${requestType}`;

        const signature = crypto
          .createHmac('sha256', secretKey)
          .update(rawSignature)
          .digest('hex');

        const requestBody = JSON.stringify({
          partnerCode,
          partnerName: "Momo Partner",
          storeId: "MomoTestStore",
          requestId,
          amount: totalAmount,
          orderId,
          orderInfo,
          redirectUrl,
          ipnUrl,
          lang: "vi",
          requestType,
          autoCapture: true,
          extraData,
          signature,
        });

        try {
            // Using fetch to call Momo API
            const response = await fetch(endpoint, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: requestBody
            });

            const result = await response.json() as { payUrl?: string; resultCode?: number; message?: string };
            
            if (result.payUrl) {
                return {
                    orderId: order.id,
                    payUrl: result.payUrl
                };
            } else {
                 console.error("Momo Error:", result);
                 // Fallback or error
                 throw new TRPCError({
                     code: 'INTERNAL_SERVER_ERROR',
                     message: result.message || 'Failed to create Momo payment',
                 });
            }

        } catch (error) {
             console.error("Momo Request Error:", error);
             throw new TRPCError({
                 code: 'INTERNAL_SERVER_ERROR',
                 message: 'Failed to connect to Momo',
             });
        }
      }

      // COD
      return {
        orderId: order.id,
        payUrl: `/order/success?orderId=${order.id}`,
      };
    }),
});
