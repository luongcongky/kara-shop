import { PrismaClient } from '@prisma/client';
import { Pool } from 'pg';
import { PrismaPg } from '@prisma/adapter-pg';
import * as dotenv from 'dotenv';

dotenv.config();

const pool = new Pool({ connectionString: process.env.DATABASE_URL });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

async function main() {
  const count = await prisma.product.count({
    where: { collection: { slug: 'camera' } },
  });

  const products = await prisma.product.findMany({
    where: { collection: { slug: 'camera' } },
    take: 5,
    include: { images: true },
  });

  console.log(`\n📊 Tổng số sản phẩm camera: ${count}`);
  console.log('\n📸 Mẫu sản phẩm:');
  products.forEach((p) => {
    console.log(`   - ${p.name}`);
    console.log(`     💰 Giá: ${p.price.toLocaleString('vi-VN')} VND`);
    console.log(`     🖼️  Hình ảnh: ${p.images.length} ảnh`);
  });

  await prisma.$disconnect();
  await pool.end();
}

main();
