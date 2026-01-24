import { PrismaClient } from '@prisma/client';
import { Pool } from 'pg';
import { PrismaPg } from '@prisma/adapter-pg';
import { vjshopCameraProducts } from './data/vjshop-cameras';

// Load environment variables
import * as dotenv from 'dotenv';
dotenv.config();

const connectionString = process.env.DATABASE_URL;

if (!connectionString) {
  throw new Error('DATABASE_URL is not defined in environment variables');
}

const pool = new Pool({ connectionString });
const adapter = new PrismaPg(pool);

const prisma = new PrismaClient({ 
  adapter,
  log: ['error', 'warn'],
});

async function main() {
  console.log('🚀 Bắt đầu import dữ liệu camera từ VJShop...');

  // Tìm hoặc tạo collection "Camera"
  let cameraCollection = await prisma.collection.findFirst({
    where: { slug: 'camera' },
  });

  if (!cameraCollection) {
    console.log('📁 Tạo collection "Camera"...');
    cameraCollection = await prisma.collection.create({
      data: {
        name: 'Camera',
        slug: 'camera',
        useYn: true,
        parentId: null,
      },
    });
    console.log(`✅ Đã tạo collection: ${cameraCollection.name} (ID: ${cameraCollection.id})`);
  } else {
    console.log(`✅ Tìm thấy collection: ${cameraCollection.name} (ID: ${cameraCollection.id})`);
  }

  // Import từng sản phẩm
  let successCount = 0;
  let errorCount = 0;

  for (const productData of vjshopCameraProducts) {
    try {
      // Kiểm tra xem sản phẩm đã tồn tại chưa (dựa vào tên)
      const existingProduct = await prisma.product.findFirst({
        where: { name: productData.name },
      });

      if (existingProduct) {
        console.log(`⏭️  Bỏ qua (đã tồn tại): ${productData.name}`);
        continue;
      }

      // Tạo sản phẩm mới
      const product = await prisma.product.create({
        data: {
          name: productData.name,
          description: productData.description,
          price: productData.price,
          rate: 4.5, // Đánh giá mặc định
          published: true,
          types: ['CAMERA'], // Thêm collection type
          collectionId: cameraCollection.id,
          images: {
            create: [
              {
                imageURL: productData.imageUrl,
                imageBlur: productData.imageUrl, // Tạm thời dùng URL gốc, có thể generate blur sau
              },
            ],
          },
        },
        include: {
          images: true,
        },
      });

      successCount++;
      console.log(`✅ [${successCount}/${vjshopCameraProducts.length}] Đã thêm: ${product.name}`);
    } catch (error) {
      errorCount++;
      console.error(`❌ Lỗi khi thêm sản phẩm "${productData.name}":`, error);
    }
  }

  console.log('\n📊 Kết quả:');
  console.log(`   ✅ Thành công: ${successCount} sản phẩm`);
  console.log(`   ❌ Lỗi: ${errorCount} sản phẩm`);
  console.log(`   📦 Tổng cộng: ${vjshopCameraProducts.length} sản phẩm`);
}

main()
  .catch((e) => {
    console.error('❌ Lỗi:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
    await pool.end();
  });
