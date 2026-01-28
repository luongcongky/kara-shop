import { z } from 'zod';
import { createTRPCRouter, publicProcedure } from '../trpc';

export const bannerRouter = createTRPCRouter({
  getAll: publicProcedure
    .input(
      z.object({
        type: z.string().optional(),
      })
    )
    .query(async ({ input, ctx }) => {
      const { type = 'HERO' } = input;
      return ctx.prisma.banner.findMany({
        where: {
          type,
          active: true,
        },
        orderBy: {
          order: 'asc',
        },
        include: {
          product: {
            select: {
              id: true,
              name: true,
            },
          },
        },
      });
    }),
});
