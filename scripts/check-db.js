const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  try {
    const products = await prisma.product.findMany({
      where: {
        collections: {
          some: {
            collectionId: { in: [87, 88] }
          }
        }
      },
      select: {
          id: true,
          name: true,
          types: true
      }
    });
    console.log('Products:', JSON.stringify(products, null, 2));

  } catch (err) {
    console.error('ERROR:', err);
  } finally {
    await prisma.$disconnect();
  }
}

main();
