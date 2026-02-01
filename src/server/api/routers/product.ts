import { z } from 'zod';
import {
  CollectionType,
  Prisma,
  ProductColor,
} from '@prisma/client';
import { publicProcedure, createTRPCRouter, adminProcedure } from '../trpc';
import { defaultCollectionSelect } from './collection';

const defaultProductSelect = Prisma.validator<Prisma.ProductSelect>()({
  id: true,
  name: true,
  description: true,
  price: true,
  originalPrice: true,
  rate: true,
  published: true,
  images: {
    select: {
      imageURL: true,
      imageBlur: true,
    },
  },
  types: true,
  colors: true,
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
        colors: z.nativeEnum(ProductColor).array().optional(),
      })
    )
    .query(async ({ input, ctx }) => {
      const {
        types = 'CAMERA',
        slug,
        page = 1,
        rate = 0,
        price,
        desc,
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
        select: {
          id: true,
          name: true,
          description: true,
          price: true,
          originalPrice: true,
          rate: true,
          published: true,
          colors: true,
          types: true,
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
  adminAll: adminProcedure.query(async ({ ctx }) => {
    return ctx.prisma.product.findMany({
      select: {
        ...defaultProductSelect,
        images: true,
      },
      orderBy: { id: 'desc' },
    });
  }),
  create: adminProcedure
    .input(
      z.object({
        name: z.string(),
        description: z.string(),
        price: z.number(),
        originalPrice: z.number().optional(),
        rate: z.number().default(5),
        published: z.boolean().default(false),
        types: z.nativeEnum(CollectionType).array(),
        colors: z.nativeEnum(ProductColor).array(),
        collectionIds: z.number().array().optional(),
        images: z.array(z.object({
          imageURL: z.string(),
          imageBlur: z.string().default(''),
        })).optional(),
        inclusions: z.array(z.object({
          itemName: z.string(),
        })).optional(),
        attributes: z.array(z.object({
          attributeName: z.string(),
          attributeValue: z.string(),
          groupName: z.string().optional(),
        })).optional(),
      })
    )
    .mutation(async ({ input, ctx }) => {
      const { collectionIds, images, inclusions, attributes, ...data } = input;
      return ctx.prisma.product.create({
        data: {
          ...data,
          collections: collectionIds
            ? {
                create: collectionIds.map(id => ({
                  collectionId: id,
                })),
              }
            : undefined,
          images: images
            ? {
                create: images,
              }
            : undefined,
          inclusions: inclusions
            ? {
                create: inclusions,
              }
            : undefined,
          attributes: attributes
            ? {
                create: attributes,
              }
            : undefined,
        },
      });
    }),
  update: adminProcedure
    .input(
      z.object({
        id: z.number(),
        name: z.string().optional(),
        description: z.string().optional(),
        price: z.number().optional(),
        originalPrice: z.number().optional(),
        rate: z.number().optional(),
        published: z.boolean().optional(),
        types: z.nativeEnum(CollectionType).array().optional(),
        colors: z.nativeEnum(ProductColor).array().optional(),
        collectionIds: z.number().array().optional(),
        images: z.array(z.object({
          id: z.number().optional(),
          imageURL: z.string(),
          imageBlur: z.string().default(''),
        })).optional(),
        inclusions: z.array(z.object({
          id: z.number().optional(),
          itemName: z.string(),
        })).optional(),
        attributes: z.array(z.object({
          id: z.number().optional(),
          attributeName: z.string(),
          attributeValue: z.string(),
          groupName: z.string().optional(),
        })).optional(),
      })
    )
    .mutation(async ({ input, ctx }) => {
      const { id, collectionIds, images, inclusions, attributes, types, colors, ...data } = input;

      // Update collections if provided
      if (collectionIds) {
        await ctx.prisma.productCollection.deleteMany({
          where: { productId: id },
        });
      }
      
      // Update images if provided
      if (images) {
        await ctx.prisma.productImage.deleteMany({
          where: { productId: id },
        });
      }

      // Update inclusions if provided
      if (inclusions) {
        await ctx.prisma.productInclusion.deleteMany({
          where: { productId: id },
        });
      }

      // Update attributes if provided
      if (attributes) {
        await ctx.prisma.productAttribute.deleteMany({
          where: { productId: id },
        });
      }

      return ctx.prisma.product.update({
        where: { id },
        data: {
          ...data,
          types: types ? { set: types } : undefined,
          colors: colors ? { set: colors } : undefined,
          collections: collectionIds
            ? {
                create: collectionIds.map(cId => ({
                  collectionId: cId,
                })),
              }
            : undefined,
          images: images
            ? {
                create: images.map(({ ...img }) => img),
              }
            : undefined,
          inclusions: inclusions
            ? {
                // eslint-disable-next-line @typescript-eslint/no-unused-vars
                create: inclusions.map(({ id: _id, ...inc }) => inc),
              }
            : undefined,
          attributes: attributes
            ? {
                // eslint-disable-next-line @typescript-eslint/no-unused-vars
                create: attributes.map(({ id: _id, ...attr }) => attr),
              }
            : undefined,
        },
      });
    }),
  duplicate: adminProcedure
    .input(z.object({ id: z.number() }))
    .mutation(async ({ input, ctx }) => {
      const { id } = input;
      const product = await ctx.prisma.product.findUnique({
        where: { id },
        include: {
          images: true,
          attributes: true,
          inclusions: true,
          collections: true,
        },
      });

      if (!product) {
        throw new Error('Sản phẩm không tồn tại');
      }

      const {
        images,
        attributes,
        inclusions,
        collections,
        name,
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        id: _id,
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        createdAt: _ca,
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        updatedAt: _ua,
        ...data
      } = product;

      return ctx.prisma.product.create({
        data: {
          ...data,
          name: `Copy of ${name}`,
          published: false,
          images: {
            create: images.map((img) => ({
              imageURL: img.imageURL,
              imageBlur: img.imageBlur,
            })),
          },
          attributes: {
            create: attributes.map((attr) => ({
              attributeName: attr.attributeName,
              attributeValue: attr.attributeValue,
              groupName: attr.groupName,
            })),
          },
          inclusions: {
            create: inclusions.map((inc) => ({
              itemName: inc.itemName,
            })),
          },
          collections: {
            create: collections.map((c) => ({
              collectionId: c.collectionId,
            })),
          },
        },
      });
    }),
  delete: adminProcedure
    .input(z.object({ id: z.number() }))
    .mutation(async ({ input, ctx }) => {
      const { id } = input;
      // Cascade delete might be handled by Prisma if relations are defined that way,
      // but let's be explicit if needed or rely on referential integrity.
      // Based on schema, ProductCollection, ProductImage etc have productId.
      
      // Delete dependent records first to avoid foreign key constraints if not cascading
      await ctx.prisma.productCollection.deleteMany({ where: { productId: id } });
      await ctx.prisma.productImage.deleteMany({ where: { productId: id } });
      await ctx.prisma.productAttribute.deleteMany({ where: { productId: id } });
      await ctx.prisma.productReview.deleteMany({ where: { productId: id } });
      await ctx.prisma.productInclusion.deleteMany({ where: { productId: id } });

      return ctx.prisma.product.delete({
        where: { id },
      });
    }),

  deleteImageRecord: adminProcedure
    .input(z.object({ imageUrl: z.string() }))
    .mutation(async ({ ctx, input }) => {
      return ctx.prisma.productImage.deleteMany({
        where: { imageURL: input.imageUrl },
      });
    }),

  addImageRecord: adminProcedure
    .input(z.object({
      productId: z.number(),
      imageURL: z.string(),
      imageBlur: z.string().optional().default(''),
    }))
    .mutation(async ({ ctx, input }) => {
      const { productId, imageURL, imageBlur } = input;
      return ctx.prisma.productImage.create({
        data: {
          productId,
          imageURL,
          imageBlur,
        },
      });
    }),

  getProductsByIds: publicProcedure
    .input(z.object({ ids: z.array(z.number()) }))
    .query(async ({ input, ctx }) => {
      const { ids } = input;
      if (ids.length === 0) return [];
      
      return ctx.prisma.product.findMany({
        where: {
          id: { in: ids },
        },
        select: {
            ...defaultProductSelect,
            attributes: true,
        },
      });
    }),
});
