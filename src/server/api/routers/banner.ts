import { z } from 'zod';
import { createTRPCRouter, publicProcedure, protectedProcedure } from '../trpc';

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

  getAllAdmin: protectedProcedure
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

  create: protectedProcedure
    .input(
      z.object({
        title: z.string(),
        subtitle: z.string().optional(),
        discount: z.string().optional(),
        imageUrl: z.string(),
        linkUrl: z.string().optional(),
        bgColor: z.string().default('bg-white'),
        textColor: z.string().default('text-black'),
        buttonColor: z.string().default('bg-orange-500'),
        type: z.string().default('HERO'),
        order: z.number().default(0),
        productId: z.number().optional(),
      })
    )
    .mutation(async ({ input, ctx }) => {
      return ctx.prisma.banner.create({
        data: input,
      });
    }),

  update: protectedProcedure
    .input(
      z.object({
        id: z.number(),
        title: z.string().optional(),
        subtitle: z.string().optional(),
        discount: z.string().optional(),
        imageUrl: z.string().optional(),
        linkUrl: z.string().optional(),
        bgColor: z.string().optional(),
        textColor: z.string().optional(),
        buttonColor: z.string().optional(),
        active: z.boolean().optional(),
        order: z.number().optional(),
        productId: z.number().optional(),
      })
    )
    .mutation(async ({ input, ctx }) => {
      const { id, ...data } = input;
      return ctx.prisma.banner.update({
        where: { id },
        data,
      });
    }),

  delete: protectedProcedure
    .input(z.object({ id: z.number() }))
    .mutation(async ({ input, ctx }) => {
      return ctx.prisma.banner.delete({
        where: { id: input.id },
      });
    }),

  updateOrder: protectedProcedure
    .input(
      z.object({
        banners: z.array(
          z.object({
            id: z.number(),
            order: z.number(),
          })
        ),
      })
    )
    .mutation(async ({ input, ctx }) => {
      const updates = input.banners.map((banner) =>
        ctx.prisma.banner.update({
          where: { id: banner.id },
          data: { order: banner.order },
        })
      );
      return Promise.all(updates);
    }),
});

