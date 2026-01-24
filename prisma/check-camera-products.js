const { PrismaClient } = require('@prisma/client');
const { Pool } = require('pg');
const { PrismaPg } = require('@prisma/adapter-pg');
require('dotenv/config');

const connectionString = process.env.DATABASE_URL || "postgresql://postgres:123456@localhost:5432/postgres?schema=ecommerce";
const pool = new Pool({ connectionString });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

async function main() {
  console.log('Checking camera products...\n');
  
  const products = await prisma.product.findMany({
    where: {
      types: {
        has: 'CAMERA'
      }
    },
    take: 5,
    select: {
      id: true,
      name: true,
      types: true,
      collection: {
        select: {
          name: true,
          slug: true
        }
      }
    }
  });
  
  console.log(`Found ${products.length} camera products:`);
  products.forEach(p => {
    console.log(`- ${p.name}`);
    console.log(`  Types: ${p.types}`);
    console.log(`  Collection: ${p.collection.name} (${p.collection.slug})\n`);
  });
}

main()
  .catch(console.error)
  .finally(async () => {
    await prisma.$disconnect();
    await pool.end();
  });
