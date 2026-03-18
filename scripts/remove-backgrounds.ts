import 'dotenv/config';
import { v2 as cloudinary } from 'cloudinary';
import { PrismaClient } from '@prisma/client';
import { Pool } from 'pg';
import { PrismaPg } from '@prisma/adapter-pg';

// Cloudinary Configuration
cloudinary.config({
  cloud_name: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Database Configuration
const connectionString = process.env.DATABASE_URL;
if (!connectionString) {
  throw new Error('DATABASE_URL is not defined in .env');
}

const pool = new Pool({ connectionString });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

/**
 * Extracts public_id from a Cloudinary URL
 * Example: https://res.cloudinary.com/demo/image/upload/v12345/folder/image.jpg -> folder/image
 */
function getPublicIdFromUrl(url: string): string | null {
  if (!url.includes('res.cloudinary.com')) return null;
  
  const parts = url.split('/upload/');
  if (parts.length !== 2) return null;
  
  // Remove version (v12345678) if present and file extension
  const pathParts = parts[1].split('/');
  if (pathParts[0].startsWith('v') && pathParts.length > 1) {
    pathParts.shift();
  }
  
  const fileName = pathParts.join('/');
  return fileName.substring(0, fileName.lastIndexOf('.'));
}

async function removeBackgrounds() {
  try {
    console.log('--- Đang lấy danh sách ảnh từ database ---');
    const images = await prisma.productImage.findMany({
      select: { imageURL: true }
    });

    const publicIds = images
      .map(img => getPublicIdFromUrl(img.imageURL))
      .filter((id): id is string => id !== null);

    const uniquePublicIds = Array.from(new Set(publicIds));
    console.log(`Tìm thấy ${uniquePublicIds.length} ảnh duy nhất cần xử lý.`);

    console.log('--- Bắt đầu gửi yêu cầu xóa nền lên Cloudinary (Async) ---');
    console.log('Lưu ý: Yêu cầu này sẽ được xử lý ngầm trên Cloudinary.');

    for (const id of uniquePublicIds) {
      console.log(`   [QUEUE] Gửi yêu cầu cho: ${id}`);
      
      try {
        await new Promise((resolve) => {
          cloudinary.uploader.explicit(id, {
            type: "upload",
            eager: [{ background_removal: "cloudinary_ai" }],
            eager_async: true
          }, (error, _result) => {
            if (error) {
              console.error(`      [ERR] Lỗi khi xử lý ${id}:`, error.message);
            } else {
              console.log(`      [SENT] Yêu cầu đã được gửi thành công.`);
            }
            resolve(null);
          });
        });
      } catch (err) {
        console.error(`      [CRITICAL] Lỗi không xác định cho ${id}:`, err);
      }
    }

    console.log('--- Hoàn tất gửi yêu cầu cho tất cả các ảnh ---');

    console.log(`\n=== ĐÃ GỬI TẤT CẢ YÊU CẦU. CLOUDINARY SẼ XỬ LÝ NGẦM ===`);
  } catch (error) {
    console.error(`[CRITICAL] Lỗi hệ thống:`, error);
  } finally {
    await prisma.$disconnect();
    await pool.end();
  }
}

removeBackgrounds();
