
import { PrismaClient, CollectionType } from '@prisma/client';

const prisma = new PrismaClient();

async function check() {
  const type = CollectionType.CAMERA;
  const take = 20;

  const bestSellers = await prisma.orderItem.groupBy({
    by: ['productId'],
    where: {
      product: {
        published: true,
        types: { has: type },
      },
    },
    _sum: {
      quantity: true,
    },
    orderBy: {
      _sum: {
        quantity: 'desc',
      },
    },
    take,
  });

  console.log('Best Sellers count from OrderItems:', bestSellers.length);

  const productsCount = await prisma.product.count({
    where: {
      published: true,
      types: { has: type },
    },
  });

  console.log('Total published products for CAMERA:', productsCount);
  
  if (bestSellers.length > 0) {
      console.log('Best selling product IDs:', bestSellers.map(b => b.productId));
  }
}

check().catch(console.error).finally(() => prisma.$disconnect());
