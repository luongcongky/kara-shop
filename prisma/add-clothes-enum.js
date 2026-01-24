const { PrismaClient } = require('@prisma/client');
const { Pool } = require('pg');
const { PrismaPg } = require('@prisma/adapter-pg');
require('dotenv/config');

const connectionString = process.env.DATABASE_URL || "postgresql://postgres:123456@localhost:5432/postgres?schema=ecommerce";
const pool = new Pool({ connectionString });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

async function main() {
  console.log('Adding CLOTHES to CollectionType enum...');
  
  try {
    await prisma.$executeRaw`ALTER TYPE "ecommerce"."CollectionType" ADD VALUE IF NOT EXISTS 'CLOTHES'`;
    console.log('Successfully added CLOTHES to CollectionType enum');
  } catch (error) {
    console.error('Error adding CLOTHES:', error);
    // If the value already exists, this is fine
    if (error.message && error.message.includes('already exists')) {
      console.log('CLOTHES already exists in enum, skipping');
    } else {
      throw error;
    }
  }
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
