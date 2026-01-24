import { PrismaClient } from '@prisma/client';
import { Pool } from 'pg';
import { PrismaPg } from '@prisma/adapter-pg';
import * as dotenv from 'dotenv';

dotenv.config();

const pool = new Pool({ connectionString: process.env.DATABASE_URL });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

async function main() {
  const total = await prisma.productImage.count();
  const cloudImages = await prisma.productImage.count({
    where: {
      imageURL: {
        contains: 'res.cloudinary.com',
      },
    },
  });

  const localImages = await prisma.productImage.count({
    where: {
      imageURL: {
        startsWith: '/assets',
      },
    },
  });
  
  const vjshopImages = await prisma.productImage.count({
      where: {
          imageURL: {
              contains: 'vjshop.vn',
          }
      }
  });

  console.log('\n📊 Image Storage Statistics:');
  console.log(`   ☁️  Cloudinary: ${cloudImages}`);
  console.log(`   📁 Local Assets: ${localImages}`);
  console.log(`   🌐 External (VJShop): ${vjshopImages}`);
  console.log(`   ------------------`);
  console.log(`   📦 Total: ${total}`);

  // List 5 sample cloud images
  if (cloudImages > 0) {
      console.log('\n🔍 Sample Cloudinary Images:');
      const samples = await prisma.productImage.findMany({
          where: { imageURL: { contains: 'res.cloudinary.com' } },
          take: 5
      });
      samples.forEach(s => console.log(`   - ${s.imageURL}`));
  }

  await prisma.$disconnect();
  await pool.end();
}

main();
