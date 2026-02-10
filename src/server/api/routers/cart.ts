import { z } from 'zod';
import { createTRPCRouter, protectedProcedure } from '../trpc';

export const cartRouter = createTRPCRouter({
  getCart: protectedProcedure.query(async ({ ctx }) => {
    return ctx.prisma.cartItem.findMany({
      where: { userId: ctx.session.user.id },
      include: {
        product: {
          include: {
            images: true,
          },
        },
      },
    });
  }),

  addItem: protectedProcedure
    .input(
      z.object({
        productId: z.number(),
        quantity: z.number().min(1).default(1),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const { productId, quantity } = input;
      const userId = ctx.session.user.id;

      const existingItem = await ctx.prisma.cartItem.findUnique({
        where: {
          userId_productId: {
            userId,
            productId,
          },
        },
      });

      if (existingItem) {
        return ctx.prisma.cartItem.update({
          where: { id: existingItem.id },
          data: { quantity: existingItem.quantity + quantity },
        });
      }

      return ctx.prisma.cartItem.create({
        data: {
          userId,
          productId,
          quantity,
        },
      });
    }),

  updateQuantity: protectedProcedure
    .input(
      z.object({
        productId: z.number(),
        quantity: z.number().min(0),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const { productId, quantity } = input;
      const userId = ctx.session.user.id;

      if (quantity === 0) {
        return ctx.prisma.cartItem.delete({
          where: {
            userId_productId: {
              userId,
              productId,
            },
          },
        });
      }

      return ctx.prisma.cartItem.update({
        where: {
          userId_productId: {
            userId,
            productId,
          },
        },
        data: { quantity },
      });
    }),

  removeItem: protectedProcedure
    .input(z.object({ productId: z.number() }))
    .mutation(async ({ ctx, input }) => {
      return ctx.prisma.cartItem.delete({
        where: {
          userId_productId: {
            userId: ctx.session.user.id,
            productId: input.productId,
          },
        },
      });
    }),

  syncCart: protectedProcedure
    .input(
      z.array(
        z.object({
          productId: z.number(),
          quantity: z.number().min(1),
        })
      )
    )
    .mutation(async ({ ctx, input }) => {
      const userId = ctx.session.user.id;

      // Simple sync logic: for each item in guest cart, 
      // upsert it into the user's database cart.
      // If item exists, we add quantities. 
      // Alternatively, we could replace, but adding seems more user-friendly.

      for (const item of input) {
        const existingItem = await ctx.prisma.cartItem.findUnique({
          where: {
            userId_productId: {
              userId,
              productId: item.productId,
            },
          },
        });

        if (existingItem) {
          await ctx.prisma.cartItem.update({
            where: { id: existingItem.id },
            data: { quantity: existingItem.quantity + item.quantity },
          });
        } else {
          await ctx.prisma.cartItem.create({
            data: {
              userId,
              productId: item.productId,
              quantity: item.quantity,
            },
          });
        }
      }

      return ctx.prisma.cartItem.findMany({
        where: { userId },
        include: {
          product: {
            include: {
              images: true,
            },
          },
        },
      });
    }),
});
