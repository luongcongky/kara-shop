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

const pool = new Pool({ connectionString });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

const PRODUCT_JSON_PATH = path.join(process.cwd(), 'src', 'data', 'imported-products.json');

async function importCollections() {
  try {
    const productsData = JSON.parse(fs.readFileSync(PRODUCT_JSON_PATH, 'utf-8'));
    console.log(`--- Đã tải ${productsData.length} sản phẩm từ JSON ---`);

    let totalCreated = 0;
    let totalSkipped = 0;

    for (const data of productsData) {
      if (!data.collections || !Array.isArray(data.collections)) {
        totalSkipped++;
        continue;
      }

      // Check if product exists in DB
      const dbProduct = await prisma.product.findUnique({
        where: { id: data.id },
      });

      if (!dbProduct) {
        console.warn(`[WARN] Product ID ${data.id} (${data.name}) not found in database. Skipping.`);
        totalSkipped++;
        continue;
      }

      console.log(`[UPDATING] Collections for: ${data.name} (ID: ${data.id})`);

      for (const collectionId of data.collections) {
        try {
          await prisma.productCollection.upsert({
            where: {
              productId_collectionId: {
                productId: data.id,
                collectionId: collectionId,
              },
            },
            create: {
              productId: data.id,
              collectionId: collectionId,
            },
            update: {}, // No fields to update in the join table
          });
          totalCreated++;
        } catch (colError) {
          console.error(`   [X] Lỗi khi thêm collection ${collectionId} cho sản phẩm ${data.id}:`, colError instanceof Error ? colError.message : colError);
        }
      }
    }

    console.log(`\n=== HOÀN THÀNH ===`);
    console.log(`- Tổng số bản ghi ProductCollection đã xử lý: ${totalCreated}`);
    console.log(`- Số sản phẩm bỏ quả (không có collections hoặc không tìm thấy): ${totalSkipped}`);
  } catch (error) {
    console.error(`[CRITICAL] Lỗi:`, error);
  } finally {
    await prisma.$disconnect();
    await pool.end();
  }
}

importCollections();
