import 'dotenv/config';
import { PrismaClient, Collection, Product } from '@prisma/client';
import { Pool } from 'pg';
import { PrismaPg } from '@prisma/adapter-pg';
import fs from 'fs';
import path from 'path';

// Helper to load JSON dump
function loadDump() {
  const dumpPath = path.join(process.cwd(), 'prisma', 'data', 'latest-db-dump.json');
  console.log('   📂 Loading dump from:', dumpPath);
  if (fs.existsSync(dumpPath)) {
    const data = fs.readFileSync(dumpPath, 'utf8');
    return JSON.parse(data);
  }
  return null;
}

const connectionString = process.env.DATABASE_URL;

if (!connectionString) {
  throw new Error('No valid database connection string found for current environment.');
}

const pool = new Pool({ connectionString });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function parsePostgresArray(value: string | string[] | unknown): any {
  if (Array.isArray(value)) return value;
  if (typeof value === 'string' && value.startsWith('{') && value.endsWith('}')) {
     const inner = value.substring(1, value.length - 1);
     if (!inner) return [];
     return inner.split(',').map(s => s.trim());
  }
  return value;
}

async function main() {
  console.log('🌱 Starting Master Database Seed...');

  const dumpData = loadDump();

  if (dumpData) {
    console.log(`\n📦 Found recent database dump (generated at ${dumpData.generatedAt}).`);
    console.log('   Using dump data to seed database...');

    // Cleanup Step: Ensure perfect sync by removing existing data before seeding
    console.log('\n🗑️  Cleaning up existing database for a fresh sync...');
    await prisma.productImage.deleteMany();
    await prisma.productAttribute.deleteMany();
    await prisma.productReview.deleteMany();
    await prisma.productInclusion.deleteMany();
    await prisma.productCollection.deleteMany(); // Added cleanup for junction table
    await prisma.product.deleteMany();
    await prisma.collection.deleteMany();
    console.log('✅ Cleanup completed.');

    // 1. Seed Collections
    console.log('\n--- 1. Seeding Collections from Dump ---');
    if (dumpData.collections && dumpData.collections.length > 0) {
      console.log('   Pass 1: Upserting collections (without parent links)...');
      for (const col of dumpData.collections) {
        const types = parsePostgresArray(col.types);
        
        await prisma.collection.upsert({
          where: { id: col.id },
          update: {
            name: col.name,
            slug: col.slug,
            useYn: col.useYn,
            types: types,
            createdAt: new Date(col.createdAt),
            updatedAt: new Date(col.updatedAt),
          },
          create: {
            id: col.id,
            name: col.name,
            slug: col.slug,
            useYn: col.useYn,
            parentId: null,
            types: types,
            createdAt: new Date(col.createdAt),
            updatedAt: new Date(col.updatedAt),
          },
        });
      }

      // Pass 2: Link parents
      console.log('   Pass 2: Linking parent collections...');
      for (const col of dumpData.collections) {
        if (col.parentId) {
           await prisma.collection.update({
             where: { id: col.id },
             data: { parentId: col.parentId }
           });
        }
      }
      console.log(`✅ Seeded ${dumpData.collections.length} collections from dump.`);
      
      // Reset sequence for Collection
      const maxId = Math.max(...dumpData.collections.map((c: Collection) => c.id));
      await prisma.$executeRawUnsafe(`ALTER SEQUENCE "ecommerce"."Collection_id_seq" RESTART WITH ${maxId + 1}`);
      console.log(`   Reset Collection sequence to ${maxId + 1}`);
    }

    // 2. Seed Products
    console.log('\n--- 2. Seeding Products from Dump ---');
    if (dumpData.products && dumpData.products.length > 0) {
      for (const prod of dumpData.products) {
        console.log(`   📦 Processing Product [${prod.id}]: ${prod.name}`);
        // Handle images separately
        const { images, ...productData } = prod;
        
        const types = parsePostgresArray(productData.types);

        await prisma.product.upsert({
          where: { id: productData.id },
          update: {
            name: productData.name,
            description: productData.description,
            price: productData.price,
            originalPrice: productData.originalPrice,
            rate: productData.rate,
            published: productData.published,
            collections: prod.collections && prod.collections.length > 0 ? {
              deleteMany: {},
              create: prod.collections.map((c: any) => ({
                collectionId: c.collectionId,
              })),
            } : undefined,
            types: types,
            createdAt: new Date(productData.createdAt),
            updatedAt: new Date(productData.updatedAt),
          },
          create: {
            id: productData.id,
            name: productData.name,
            description: productData.description,
            price: productData.price,
            rate: productData.rate,
            originalPrice: productData.originalPrice,
            published: productData.published,
            collections: prod.collections && prod.collections.length > 0 ? {
              create: prod.collections.map((c: any) => ({
                collectionId: c.collectionId,
              })),
            } : undefined,
            types: types,
            createdAt: new Date(productData.createdAt),
            updatedAt: new Date(productData.updatedAt),
          }
        });

        // Seed Images for this product
        if (images && images.create && images.create.length > 0) {
           await prisma.productImage.deleteMany({ where: { productId: productData.id } });
           for (const img of images.create) {
             await prisma.productImage.create({
               data: {
                 imageURL: img.imageURL,
                 imageBlur: img.imageBlur,
                 productId: productData.id
               }
             });
           }
        }

        // 3. Seed Attributes, Reviews, Inclusions from absolute dump persistence
        if (prod.attributes && prod.attributes.length > 0) {
            await prisma.productAttribute.deleteMany({ where: { productId: productData.id } });
            if (productData.id === 83) {
                console.log(`   🔎 Debugging ID 83 attributes: Found ${prod.attributes.length} attributes.`);
            }
            for (const attr of prod.attributes) {
                if (productData.id === 83) {
                    console.log(`      - Seeding ID 83: ${attr.attributeName} -> Group: [${attr.groupName}]`);
                }
                await prisma.productAttribute.create({
                    data: {
                        groupName: attr.groupName,
                        attributeName: attr.attributeName,
                        attributeValue: attr.attributeValue,
                        productId: productData.id,
                        createdAt: attr.createdAt ? new Date(attr.createdAt) : new Date(),
                        updatedAt: attr.updatedAt ? new Date(attr.updatedAt) : new Date(),
                    }
                });
            }
        }

        if (prod.reviews && prod.reviews.length > 0) {
            await prisma.productReview.deleteMany({ where: { productId: productData.id } });
            for (const rev of prod.reviews) {
                await prisma.productReview.create({
                    data: {
                        userName: rev.userName,
                        rating: rev.rating,
                        comment: rev.comment,
                        productId: productData.id,
                        createdAt: new Date(rev.createdAt),
                        updatedAt: new Date(rev.updatedAt),
                    }
                });
            }
        }

        if (prod.inclusions && prod.inclusions.length > 0) {
            await prisma.productInclusion.deleteMany({ where: { productId: productData.id } });
            for (const inc of prod.inclusions) {
                await prisma.productInclusion.create({
                    data: {
                        itemName: inc.itemName,
                        productId: productData.id,
                        createdAt: new Date(inc.createdAt),
                        updatedAt: new Date(inc.updatedAt),
                    }
                });
            }
        }
      }
      console.log(`✅ Seeded ${dumpData.products.length} products (with nested details) from dump.`);
      
      // Reset sequence for Product
      const maxId = Math.max(...dumpData.products.map((p: Product) => p.id));
      await prisma.$executeRawUnsafe(`ALTER SEQUENCE "ecommerce"."Product_id_seq" RESTART WITH ${maxId + 1}`);
      console.log(`   Reset Product sequence to ${maxId + 1}`);
    }

  } else {
    console.warn('⚠️  No dump file found. Please run "npm run dump-db" first to capture current database state.');
    console.log('   Using fallback static seed (WARNING: May be outdated)...');
  }

  console.log('\n🏁 Master Seed Completed!');
}

main()
  .catch((e) => {
    console.error('❌ Error during seeding:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
