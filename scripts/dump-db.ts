import 'dotenv/config';
import { PrismaClient } from '@prisma/client';
import { Pool } from 'pg';
import { PrismaPg } from '@prisma/adapter-pg';
import fs from 'fs';
import path from 'path';

const connectionString = process.env.DATABASE_URL;

if (!connectionString) {
  throw new Error('DATABASE_URL is not defined in .env');
}

async function main() {
  const pool = new Pool({ connectionString });
  const adapter = new PrismaPg(pool);
  const prisma = new PrismaClient({ adapter });

  console.log('🔍 Starting Database Export...');

  try {
    const allCollections = await prisma.collection.findMany();
    const allProducts = await prisma.product.findMany({
      include: {
        images: true,
        attributes: true,
        reviews: true,
        inclusions: true,
      }
    });

    const dump = {
      generatedAt: new Date().toISOString(),
      collections: allCollections,
      products: allProducts.map((p) => ({
        ...p,
        images: {
          create: p.images.map(img => ({
            imageURL: img.imageURL,
            imageBlur: img.imageBlur
          }))
        },
      })),
    };

    const targetDir = path.join(process.cwd(), 'prisma', 'data');
    if (!fs.existsSync(targetDir)) {
      fs.mkdirSync(targetDir, { recursive: true });
    }

    const targetPath = path.join(targetDir, 'latest-db-dump.json');
    fs.writeFileSync(targetPath, JSON.stringify(dump, null, 2));

    console.log(`✅ Database exported successfully to: ${targetPath}`);
    console.log(`📊 Exported: ${dump.collections.length} collections, ${dump.products.length} products.`);
    
  } catch (error) {
    console.error('❌ Export failed:', error);
  } finally {
    await prisma.$disconnect();
    await pool.end();
  }
}

main();
