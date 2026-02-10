import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  const collection95 = await prisma.collection.findUnique({
    where: { id: 95 },
    include: { parent: true }
  });
  console.log('Collection 95:', JSON.stringify(collection95, null, 2));

  const collection300 = await prisma.collection.findUnique({
    where: { id: 300 },
    include: { children: true }
  });
  console.log('Collection 300:', JSON.stringify(collection300, null, 2));

  const phuKien = await prisma.collection.findFirst({
    where: { slug: 'phu-kien' }
  });
  console.log('Phu Kien Collection:', JSON.stringify(phuKien, null, 2));

  const productsIn95 = await prisma.product.findMany({
    where: {
      collections: {
        some: {
          collectionId: 95
        }
      }
    },
    select: {
      id: true,
      name: true,
      types: true,
      published: true
    }
  });
  console.log('Products in Collection 95:', JSON.stringify(productsIn95, null, 2));
}

main()
  .catch(e => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
