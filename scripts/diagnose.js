const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  console.log('--- Diagnosis ---');
  
  const c87 = await prisma.collection.findUnique({
    where: { id: 87 },
    include: { products: { include: { product: true } } }
  });
  
  if (!c87) {
    console.log('Collection 87 not found!');
  } else {
    console.log(`Collection 87 found: ${c87.name} (${c87.slug})`);
    console.log(`Products in collection 87: ${c87.products.length}`);
    c87.products.forEach(pc => {
        console.log(` - Product ${pc.product.id}: ${pc.product.name} (Published: ${pc.product.published}, Types: ${pc.product.types})`);
    });
  }

  const c88 = await prisma.collection.findUnique({
    where: { id: 88 },
    include: { products: { include: { product: true } } }
  });
  
  if (!c88) {
    console.log('Collection 88 not found!');
  } else {
    console.log(`Collection 88 found: ${c88.name} (${c88.slug})`);
    console.log(`Products in collection 88: ${c88.products.length}`);
  }

  const p83 = await prisma.product.findUnique({
    where: { id: 83 },
    include: { collections: { include: { collection: true } } }
  });

  if (p83) {
      console.log(`Product 83 found: ${p83.name}`);
      console.log(`Collections for product 83: ${p83.collections.map(c => c.collection.id).join(', ')}`);
  } else {
      console.log('Product 83 not found!');
  }

  await prisma.$disconnect();
}

main().catch(console.error);
