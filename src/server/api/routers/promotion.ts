import { z } from 'zod';
import { createTRPCRouter, publicProcedure, protectedProcedure } from '../trpc';

export const promotionRouter = createTRPCRouter({
  getAll: publicProcedure.query(async ({ ctx }) => {
    return ctx.prisma.promotion.findMany({
      where: {
        active: true,
      },
      orderBy: {
        order: 'asc',
      },
    });
  }),

  getAllAdmin: protectedProcedure.query(async ({ ctx }) => {
    return ctx.prisma.promotion.findMany({
      orderBy: {
        order: 'asc',
      },
    });
  }),

  create: protectedProcedure
    .input(
      z.object({
        title: z.string(),
        subtitle: z.string(),
        description: z.string(),
        imageUrl: z.string(),
        linkUrl: z.string(),
        badge: z.string(),
        color: z.string().default('from-blue-600 to-indigo-700'),
        order: z.number().default(0),
      })
    )
    .mutation(async ({ input, ctx }) => {
      return ctx.prisma.promotion.create({
        data: input,
      });
    }),

  update: protectedProcedure
    .input(
      z.object({
        id: z.number(),
        title: z.string().optional(),
        subtitle: z.string().optional(),
        description: z.string().optional(),
        imageUrl: z.string().optional(),
        linkUrl: z.string().optional(),
        badge: z.string().optional(),
        color: z.string().optional(),
        active: z.boolean().optional(),
        order: z.number().optional(),
      })
    )
    .mutation(async ({ input, ctx }) => {
      const { id, ...data } = input;
      return ctx.prisma.promotion.update({
        where: { id },
        data,
      });
    }),

  delete: protectedProcedure
    .input(z.object({ id: z.number() }))
    .mutation(async ({ input, ctx }) => {
      return ctx.prisma.promotion.delete({
        where: { id: input.id },
      });
    }),

  updateOrder: protectedProcedure
    .input(
      z.object({
        promotions: z.array(
          z.object({
            id: z.number(),
            order: z.number(),
          })
        ),
      })
    )
    .mutation(async ({ input, ctx }) => {
      const updates = input.promotions.map((promotion) =>
        ctx.prisma.promotion.update({
          where: { id: promotion.id },
          data: { order: promotion.order },
        })
      );
      return Promise.all(updates);
    }),
});
