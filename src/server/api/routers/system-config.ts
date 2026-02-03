import { z } from "zod";
import { createTRPCRouter, adminProcedure, publicProcedure } from "../trpc";

export const systemConfigRouter = createTRPCRouter({
  getAll: publicProcedure.query(async ({ ctx }) => {
    return ctx.prisma.systemConfig.findMany();
  }),

  getByKey: publicProcedure
    .input(z.object({ key: z.string() }))
    .query(async ({ ctx, input }) => {
      return ctx.prisma.systemConfig.findUnique({
        where: { key: input.key },
      });
    }),

  update: adminProcedure
    .input(z.object({
      key: z.string(),
      value: z.string(),
      type: z.string().optional(),
    }))
    .mutation(async ({ ctx, input }) => {
      const { key, value, type } = input;
      return ctx.prisma.systemConfig.upsert({
        where: { key },
        update: { value, type },
        create: { key, value, type: type || 'text' },
      });
    }),

  updateMany: adminProcedure
    .input(z.array(z.object({
        key: z.string(),
        value: z.string(),
    })))
    .mutation(async ({ ctx, input }) => {
        const promises = input.map(item => 
            ctx.prisma.systemConfig.upsert({
                where: { key: item.key },
                update: { value: item.value },
                create: { key: item.key, value: item.value },
            })
        );
        return Promise.all(promises);
    }),
});
