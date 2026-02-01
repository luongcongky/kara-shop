import { z } from 'zod';
import { createTRPCRouter, protectedProcedure } from '../trpc';

export const wishlistRouter = createTRPCRouter({
  getWishlist: protectedProcedure.query(async ({ ctx }) => {
    return ctx.prisma.wishlistItem.findMany({
      where: { userId: ctx.session.user.id },
      include: {
        product: {
          include: {
            images: true,
            collections: {
              include: {
                collection: true,
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

  toggleWishlist: protectedProcedure
    .input(z.object({ productId: z.number() }))
    .mutation(async ({ ctx, input }) => {
      const { productId } = input;
      const userId = ctx.session.user.id;

      const existingItem = await ctx.prisma.wishlistItem.findUnique({
        where: {
          userId_productId: {
            userId,
            productId,
          },
        },
      });

      if (existingItem) {
        await ctx.prisma.wishlistItem.delete({
          where: { id: existingItem.id },
        });
        return { action: 'removed', productId };
      }

      await ctx.prisma.wishlistItem.create({
        data: {
          userId,
          productId,
        },
      });
      return { action: 'added', productId };
    }),

  syncWishlist: protectedProcedure
    .input(z.array(z.number()))
    .mutation(async ({ ctx, input }) => {
      const userId = ctx.session.user.id;

      for (const productId of input) {
        const existingItem = await ctx.prisma.wishlistItem.findUnique({
          where: {
            userId_productId: {
              userId,
              productId,
            },
          },
        });

        if (!existingItem) {
          await ctx.prisma.wishlistItem.create({
            data: {
              userId,
              productId,
            },
          });
        }
      }

      return ctx.prisma.wishlistItem.findMany({
        where: { userId },
        include: {
          product: {
            include: {
              images: true,
              collections: {
                include: {
                  collection: true,
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
});
