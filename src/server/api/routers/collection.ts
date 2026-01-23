import { createTRPCRouter, publicProcedure } from '../trpc';
import { Prisma } from '@prisma/client';

export const defaultCollectionSelect =
  Prisma.validator<Prisma.CollectionSelect>()({
    id: true,
    name: true,
    slug: true,
    types: true,
    parentId: true,
    children: {
      where: {
        useYn: true,
      },
      select: {
        id: true,
        name: true,
        slug: true,
        types: true,
      },
    },
  });

export const collectionRouter = createTRPCRouter({
  all: publicProcedure.query(
    async ({ ctx }) =>
      await ctx.prisma.collection.findMany({
        select: defaultCollectionSelect,
        where: {
          OR: [{ parentId: null }, { parentId: 0 }],
          useYn: true,
        },
        orderBy: { id: 'asc' },
      })
  ),
});
