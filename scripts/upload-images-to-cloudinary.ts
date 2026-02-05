import 'dotenv/config';
import { v2 as cloudinary } from 'cloudinary';
import { PrismaClient } from '@prisma/client';
import { Pool } from 'pg';
import { PrismaPg } from '@prisma/adapter-pg';
import fs from 'fs';
import path from 'path';

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

const PRODUCT_JSON_PATH = path.join(process.cwd(), 'src', 'data', 'imported-products.json');
const DOWNLOAD_BASE_PATH = path.join(process.cwd(), 'downloads', 'products');

async function uploadImagesToCloudinary() {
  try {
    const productsData = JSON.parse(fs.readFileSync(PRODUCT_JSON_PATH, 'utf-8'));
    console.log(`--- Đã tải ${productsData.length} sản phẩm từ JSON ---`);

    for (const productData of productsData) {
      const productId = productData.id;
      const productName = productData.name;
      const folderName = productData.link.split('/').pop() || 'unknown';
      const localFolderPath = path.join(DOWNLOAD_BASE_PATH, folderName);

      if (!fs.existsSync(localFolderPath)) {
        console.log(`[SKIP] Không tìm thấy thư mục ảnh cho: ${productName} (${localFolderPath})`);
        continue;
      }

      const files = fs.readdirSync(localFolderPath).filter(file => 
        ['.jpg', '.jpeg', '.png', '.webp', '.avif'].includes(path.extname(file).toLowerCase())
      );

      if (files.length === 0) {
        console.log(`[SKIP] Thư mục ảnh trống: ${productName}`);
        continue;
      }

      console.log(`\n[PROCESSING] Uploading images for: ${productName} (${files.length} ảnh)`);

      // 1. Xóa ảnh cũ trong DB của sản phẩm này (để sync sạch)
      await prisma.productImage.deleteMany({
        where: { productId: productId }
      });

      // 2. Upload từng file lên Cloudinary
      for (const file of files) {
        const filePath = path.join(localFolderPath, file);
        try {
          const result = await cloudinary.uploader.upload(filePath, {
            folder: `kara-shop/products/${productName}`, // Dùng tên sản phẩm làm thư mục trên Cloudinary
            use_filename: true,
            unique_filename: true,
          });

          console.log(`   [OK] Upload thành công: ${file} -> ${result.secure_url}`);

          // 3. Lưu vào database
          await prisma.productImage.create({
            data: {
              productId: productId,
              imageURL: result.secure_url,
              imageBlur: result.secure_url, // Tạm thời dùng cùng URL cho blur
            }
          });
        } catch (uploadError) {
          console.error(`   [X] Lỗi upload file ${file}:`, uploadError instanceof Error ? uploadError.message : uploadError);
        }
      }

      console.log(`[DONE] Hoàn tất xử lý sản phẩm: ${productName}`);
    }

    console.log(`\n=== TẤT CẢ ĐÃ HOÀN TẤT ===`);
  } catch (error) {
    console.error(`[CRITICAL] Lỗi hệ thống:`, error);
  } finally {
    await prisma.$disconnect();
    await pool.end();
  }
}

uploadImagesToCloudinary();
