import { z } from 'zod';
import { createTRPCRouter, publicProcedure, protectedProcedure } from '../trpc';

export const flashSaleRouter = createTRPCRouter({
  getActive: publicProcedure.query(async ({ ctx }) => {
    try {
      if (!ctx.prisma.flashSale) {
        console.error('Prisma model "flashSale" is missing. Available models:', Object.keys(ctx.prisma).filter(k => !k.startsWith('$')));
        throw new Error('FlashSale model not found in Prisma client');
      }
      return await ctx.prisma.flashSale.findMany({
        where: {
          active: true,
          endTime: {
            gt: new Date(),
          },
        },
        include: {
          product: {
            select: {
              id: true,
              name: true,
              price: true,
              images: {
                select: {
                  imageURL: true,
                },
              },
            },
          },
        },
        orderBy: {
          createdAt: 'desc',
        },
      });
    } catch (error) {
      console.error('Error in flashSale.getActive:', error);
      throw error;
    }
  }),

  getAll: protectedProcedure.query(async ({ ctx }) => {
    return ctx.prisma.flashSale.findMany({
      include: {
        product: {
          select: {
            id: true,
            name: true,
            price: true,
            images: {
              select: {
                imageURL: true,
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

  create: protectedProcedure
    .input(
      z.object({
        productId: z.number(),
        salePrice: z.number(),
        totalSlots: z.number(),
        soldSlots: z.number().default(0),
        endTime: z.date(),
        badge: z.string().optional(),
      })
    )
    .mutation(async ({ input, ctx }) => {
      return ctx.prisma.flashSale.create({
        data: input,
      });
    }),

  update: protectedProcedure
    .input(
      z.object({
        id: z.number(),
        productId: z.number().optional(),
        salePrice: z.number().optional(),
        totalSlots: z.number().optional(),
        soldSlots: z.number().optional(),
        endTime: z.date().optional(),
        active: z.boolean().optional(),
        badge: z.string().optional(),
      })
    )
    .mutation(async ({ input, ctx }) => {
      const { id, ...data } = input;
      return ctx.prisma.flashSale.update({
        where: { id },
        data,
      });
    }),

  delete: protectedProcedure
    .input(z.object({ id: z.number() }))
    .mutation(async ({ input, ctx }) => {
      return ctx.prisma.flashSale.delete({
        where: { id: input.id },
      });
    }),
});

