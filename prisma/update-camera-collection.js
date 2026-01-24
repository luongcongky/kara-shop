const { PrismaClient } = require('@prisma/client');
const { Pool } = require('pg');
const { PrismaPg } = require('@prisma/adapter-pg');
require('dotenv/config');

const connectionString = process.env.DATABASE_URL || "postgresql://postgres:123456@localhost:5432/postgres?schema=ecommerce";
const pool = new Pool({ connectionString });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

async function main() {
  console.log('Updating camera products to use correct collection...\n');
  
  // Find the "Máy Ảnh Mirrorless" collection
  const mirrorlessCollection = await prisma.collection.findUnique({
    where: { slug: 'may-anh-mirrorless' }
  });
  
  if (!mirrorlessCollection) {
    console.log('❌ Collection "may-anh-mirrorless" not found. Please run seed-camera-lens.js first.');
    return;
  }
  
  console.log(`✓ Found collection: ${mirrorlessCollection.name} (ID: ${mirrorlessCollection.id})\n`);
  
  // Update all camera products to use this collection
  const result = await prisma.product.updateMany({
    where: {
      types: {
        has: 'CAMERA'
      }
    },
    data: {
      collectionId: mirrorlessCollection.id
    }
  });
  
  console.log(`✓ Updated ${result.count} camera products to use "${mirrorlessCollection.name}" collection`);
}

main()
  .catch(console.error)
  .finally(async () => {
    await prisma.$disconnect();
    await pool.end();
  });
