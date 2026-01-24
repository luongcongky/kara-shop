const { PrismaClient } = require('@prisma/client');
const { Pool } = require('pg');
const { PrismaPg } = require('@prisma/adapter-pg');
require('dotenv/config');

const connectionString = process.env.DATABASE_URL || "postgresql://postgres:123456@localhost:5432/postgres?schema=ecommerce";
const pool = new Pool({ connectionString });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

async function main() {
  console.log('Simulating exact API call for /products/camera\n');
  
  // Exact same logic as product router
  const types = 'CAMERA';
  const slug = undefined;
  const page = 1;
  const rate = 0;
  const gte = 0;
  const lte = 1000000;
  const sizes = [];
  const colors = [];
  
  const take = 12;
  const skip = take * (page - 1);
  
  const where = {
    types: { hasSome: [types] },
    published: true,
    rate: rate ? { gte: rate } : undefined,
    price: { gte, lte },
    sizes: sizes.length > 0 ? { hasSome: sizes } : undefined,
    colors: colors.length > 0 ? { hasSome: colors } : undefined,
  };
  
  console.log('WHERE clause:', JSON.stringify(where, null, 2));
  console.log('');
  
  const [products, totalCount] = await prisma.$transaction([
    prisma.product.findMany({
      select: {
        id: true,
        name: true,
        price: true,
        rate: true,
        types: true,
        published: true,
        images: {
          select: {
            imageURL: true,
            imageBlur: true,
          },
        },
        collection: {
          select: {
            id: true,
            name: true,
            slug: true,
          },
        },
      },
      where,
      orderBy: { id: 'asc' },
      take,
      skip,
    }),
    prisma.product.count({ where }),
  ]);
  
  console.log(`Total count: ${totalCount}`);
  console.log(`Returned products: ${products.length}\n`);
  
  products.forEach((p, i) => {
    console.log(`${i + 1}. ${p.name}`);
    console.log(`   Price: ${p.price.toLocaleString('vi-VN')} VND`);
    console.log(`   Rate: ${p.rate}`);
    console.log(`   Types: ${JSON.stringify(p.types)}`);
    console.log(`   Published: ${p.published}`);
    console.log(`   Images: ${p.images.length}`);
    console.log(`   Collection: ${p.collection.name} (${p.collection.slug})`);
    console.log('');
  });
}

main()
  .catch(console.error)
  .finally(async () => {
    await prisma.$disconnect();
    await pool.end();
  });
