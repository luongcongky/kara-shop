import { createTRPCRouter, publicProcedure } from '../trpc';

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
});
