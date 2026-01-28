import { z } from 'zod';
import {
  CollectionType,
  Prisma,
  ProductColor,
  ProductSize,
} from '@prisma/client';
import { publicProcedure, createTRPCRouter } from '../trpc';
import { defaultCollectionSelect } from './collection';

const defaultProductSelect = Prisma.validator<Prisma.ProductSelect>()({
  id: true,
  name: true,
  description: true,
  price: true,
  originalPrice: true,
  rate: true,
  images: {
    select: {
      imageURL: true,
      imageBlur: true,
    },
  },
  types: true,
  collections: {
    select: {
      collection: {
        select: defaultCollectionSelect,
      },
    },
  },
});

export const productRouter = createTRPCRouter({
  all: publicProcedure
    .input(
      z.object({
        types: z.nativeEnum(CollectionType).optional(),
        slug: z.string().optional(),
        page: z.number().optional(),
        rate: z.number().optional(),
        price: z.string().optional(), // Changed to string to accept $, $$, $$$
        desc: z.string().optional(),
        sizes: z.nativeEnum(ProductSize).array().optional(),
        colors: z.nativeEnum(ProductColor).array().optional(),
      })
    )
    .query(async ({ input, ctx }) => {
      const {
        types = 'CLOTHES',
        slug,
        page = 1,
        rate = 0,
        price,
        desc,
        sizes = [],
        colors = [],
      } = input;

      const take = 12;
      const skip = take * (page - 1);

      // Price logic:
      // $   : < 30,000,000
      // $$  : 30,000,000 - 60,000,000
      // $$$ : > 60,000,000
      let gte = 0;
      let lte = 1000000000; // Default max 1 billion

      if (price === '$') {
        lte = 30000000;
      } else if (price === '$$') {
        gte = 30000000;
        lte = 60000000;
      } else if (price === '$$$') {
        gte = 60000000;
      }

      const where: Prisma.ProductWhereInput = {
        types: { hasSome: [types] },
        published: true,
        rate: rate ? { gte: rate } : undefined,
        price: { gte, lte },
        description: desc
          ? { contains: desc, mode: 'insensitive' }
          : undefined,
        sizes: sizes.length > 0 ? { hasSome: sizes } : undefined,
        colors: colors.length > 0 ? { hasSome: colors } : undefined,
      };

      if (slug) {
        const isParent = await ctx.prisma.collection.findFirst({
          where: {
            slug,
            parent: {
              is: null,
            },
          },
        });

        where.collections = {
          some: isParent
            ? { collection: { parentId: isParent.id } }
            : { collection: { slug } },
        };
      }

      const [products, totalCount] = await ctx.prisma.$transaction([
        ctx.prisma.product.findMany({
          select: defaultProductSelect,
          where,
          orderBy: { id: 'asc' },
          take,
          skip,
        }),
        ctx.prisma.product.count({ where }),
      ]);

      return {
        products,
        totalCount,
      };
    }),
  getById: publicProcedure
    .input(z.object({ id: z.number() }))
    .query(async ({ input, ctx }) => {
      const { id } = input;
      return ctx.prisma.product.findUnique({
        where: { id },
        include: {
          images: true,
          attributes: true,
          inclusions: true,
          collections: {
            include: {
              collection: true,
            },
          },
          reviews: {
            orderBy: { createdAt: 'desc' },
          },
        },
      });
    }),
});
