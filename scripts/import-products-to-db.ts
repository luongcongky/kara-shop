import 'dotenv/config';
import { PrismaClient, CollectionType } from '@prisma/client';
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

interface Specification {
  groupName: string;
  item: string;
  value: string;
}

async function importProducts() {
  try {
    const productsData = JSON.parse(fs.readFileSync(PRODUCT_JSON_PATH, 'utf-8'));
    console.log(`--- Đã tải ${productsData.length} sản phẩm từ JSON ---`);

    for (const data of productsData) {
      try {
        console.log(`\n[IMPORTING] ${data.name}...`);

        // 1. Map CollectionType
        let types: CollectionType[] = [CollectionType.OTHERS];
        if (data.type === 'Máy Ảnh' || (data.type && data.type.includes('ALPHA - NEX'))) types = [CollectionType.CAMERA];
        else if (data.type === 'Ông Kính') types = [CollectionType.LENS];
        else if (data.type === 'Phụ kiện') types = [CollectionType.OTHERS];

        // 2. Insert/Update Product
        const product = await prisma.product.upsert({
          where: { id: data.id },
          update: {
            name: data.name,
            price: data.price,
            originalPrice: data.listed_price,
            description: data.description || data.name,
            published: true,
            rate: 5.0,
            types: { set: types },
          },
          create: {
            id: data.id,
            name: data.name,
            price: data.price,
            originalPrice: data.listed_price,
            description: data.description || data.name,
            published: true,
            rate: 5.0,
            types: types,
          },
        });

        // 3. Xử lý Specifications -> ProductAttribute
        if (data.specification) {
          try {
            const specs = JSON.parse(data.specification);
            
            await prisma.productAttribute.deleteMany({
              where: { productId: product.id }
            });

            if (Array.isArray(specs)) {
              const attributeData = (specs as Specification[]).map((s) => ({
                productId: product.id,
                groupName: s.groupName,
                attributeName: s.item,
                attributeValue: s.value
              }));

              await prisma.productAttribute.createMany({
                data: attributeData
              });
              console.log(`   [OK] Đã import ${attributeData.length} thuộc tính.`);
            }
          } catch (e) {
            console.error(`   [X] Lỗi parse specification cho ${data.name}:`, e instanceof Error ? e.message : e);
          }
        }

        console.log(`   [SUCCESS] Product ID: ${product.id}`);
      } catch (innerError) {
        console.error(`   [X] Lỗi khi xử lý sản phẩm ${data.name}:`, innerError);
      }
    }

    console.log(`\n=== HOÀN THÀNH IMPORT ===`);
  } catch (error) {
    console.error(`[CRITICAL] Lỗi:`, error);
  } finally {
    await prisma.$disconnect();
    await pool.end();
  }
}

importProducts();
