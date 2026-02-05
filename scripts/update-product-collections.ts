import 'dotenv/config';
import { PrismaClient, CollectionType } from '@prisma/client';
import { Pool } from 'pg';
import { PrismaPg } from '@prisma/adapter-pg';

const connectionString = process.env.DATABASE_URL;
if (!connectionString) {
  throw new Error('DATABASE_URL is not defined in .env');
}

const pool = new Pool({ connectionString });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

async function updateProductCollections() {
  try {
    const targetCollectionId = 96;

    // 1. Kiểm tra collection có tồn tại không
    const collection = await prisma.collection.findUnique({
      where: { id: targetCollectionId }
    });

    if (!collection) {
      console.error(`[ERROR] Không tìm thấy Collection với ID = ${targetCollectionId}`);
      return;
    }

    console.log(`[START] Đang cập nhật sản phẩm vào collection: ${collection.name} (ID: ${targetCollectionId})`);

    // 2. Tìm tất cả sản phẩm có type CAMERA
    const cameraProducts = await prisma.product.findMany({
      where: {
        types: {
          has: CollectionType.CAMERA
        }
      },
      select: {
        id: true,
        name: true
      }
    });

    console.log(`[INFO] Tìm thấy ${cameraProducts.length} sản phẩm loại CAMERA.`);

    let successCount = 0;
    let skipCount = 0;

    for (const product of cameraProducts) {
      try {
        // Sử dụng upsert để tránh lỗi trùng lặp nếu đã tồn tại mapping
        await prisma.productCollection.upsert({
          where: {
            productId_collectionId: {
              productId: product.id,
              collectionId: targetCollectionId
            }
          },
          update: {}, // Không cần cập nhật gì nếu đã tồn tại
          create: {
            productId: product.id,
            collectionId: targetCollectionId
          }
        });
        successCount++;
        if (successCount % 10 === 0) {
          console.log(`   [PROGRESS] Đã xử lý ${successCount}/${cameraProducts.length} sản phẩm...`);
        }
      } catch (err) {
        console.error(`   [X] Lỗi khi mapping sản phẩm ${product.name} (ID: ${product.id}):`, err);
      }
    }

    console.log(`\n=== HOÀN THÀNH ===`);
    console.log(`- Đã cập nhật thành công: ${successCount}`);
    console.log(`- Bị lỗi: ${cameraProducts.length - successCount}`);

  } catch (error) {
    console.error(`[CRITICAL] Lỗi hệ thống:`, error);
  } finally {
    await prisma.$disconnect();
    await pool.end();
  }
}

updateProductCollections();
