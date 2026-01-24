const { PrismaClient } = require('@prisma/client');
const { Pool } = require('pg');
const { PrismaPg } = require('@prisma/adapter-pg');
require('dotenv/config');

const connectionString = process.env.DATABASE_URL || "postgresql://postgres:123456@localhost:5432/postgres?schema=ecommerce";
const pool = new Pool({ connectionString });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

async function main() {
  console.log('Testing query that /products/camera would make...\n');
  
  // This simulates what the page does
  const types = 'CAMERA';
  const slug = undefined; // No slug when accessing /products/camera
  
  const where = {
    types: { hasSome: [types] },
    published: true,
  };
  
  console.log('Query WHERE clause:', JSON.stringify(where, null, 2));
  
  const products = await prisma.product.findMany({
    where,
    take: 5,
    select: {
      id: true,
      name: true,
      types: true,
      published: true,
      collection: {
        select: {
          name: true,
          slug: true,
          parentId: true
        }
      }
    }
  });
  
  console.log(`\nFound ${products.length} products:\n`);
  products.forEach(p => {
    console.log(`- ${p.name}`);
    console.log(`  Published: ${p.published}`);
    console.log(`  Types: ${JSON.stringify(p.types)}`);
    console.log(`  Collection: ${p.collection.name} (${p.collection.slug}, parentId: ${p.collection.parentId})\n`);
  });
  
  // Also check total count
  const total = await prisma.product.count({ where });
  console.log(`Total camera products: ${total}`);
}

main()
  .catch(console.error)
  .finally(async () => {
    await prisma.$disconnect();
    await pool.end();
  });
