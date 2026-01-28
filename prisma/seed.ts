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
    console.log('   Dump has banners:', dumpData.banners ? dumpData.banners.length : 0);

    // Cleanup Step: Ensure perfect sync by removing existing data before seeding
    console.log('\n🗑️  Cleaning up existing database for a fresh sync...');
    await prisma.productImage.deleteMany();
    await prisma.productAttribute.deleteMany();
    await prisma.productReview.deleteMany();
    await prisma.productInclusion.deleteMany();
    await prisma.productCollection.deleteMany();
    await prisma.banner.deleteMany();
    await prisma.flashSale.deleteMany(); // Added cleanup for flash sales
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
      const maxId = Math.max(...dumpData.products.map((p: any) => p.id));
      await prisma.$executeRawUnsafe(`ALTER SEQUENCE "ecommerce"."Product_id_seq" RESTART WITH ${maxId + 1}`);
      console.log(`   Reset Product sequence to ${maxId + 1}`);
    }

    // 4. Seed Banners
    console.log('\n--- 4. Seeding Banners ---');
    if (dumpData.banners && dumpData.banners.length > 0) {
      for (const banner of dumpData.banners) {
        await prisma.banner.upsert({
          where: { id: banner.id },
          update: {
            title: banner.title,
            subtitle: banner.subtitle,
            discount: banner.discount,
            imageUrl: banner.imageUrl,
            linkUrl: banner.linkUrl,
            bgColor: banner.bgColor,
            textColor: banner.textColor,
            buttonColor: banner.buttonColor,
            type: banner.type,
            order: banner.order,
            active: banner.active,
            productId: banner.productId,
            createdAt: banner.createdAt ? new Date(banner.createdAt) : new Date(),
            updatedAt: banner.updatedAt ? new Date(banner.updatedAt) : new Date(),
          },
          create: {
            id: banner.id,
            title: banner.title,
            subtitle: banner.subtitle,
            discount: banner.discount,
            imageUrl: banner.imageUrl,
            linkUrl: banner.linkUrl,
            bgColor: banner.bgColor,
            textColor: banner.textColor,
            buttonColor: banner.buttonColor,
            type: banner.type,
            order: banner.order,
            active: banner.active,
            productId: banner.productId,
            createdAt: banner.createdAt ? new Date(banner.createdAt) : new Date(),
            updatedAt: banner.updatedAt ? new Date(banner.updatedAt) : new Date(),
          },
        });
      }
      console.log(`✅ Seeded ${dumpData.banners.length} banners.`);
      
      const maxId = Math.max(...dumpData.banners.map((b: any) => b.id));
      await prisma.$executeRawUnsafe(`ALTER SEQUENCE "ecommerce"."Banner_id_seq" RESTART WITH ${maxId + 1}`);
      console.log(`   Reset Banner sequence to ${maxId + 1}`);
    } else {
      // Fallback: Create initial banners if no dump data exists
      console.log('   Creating initial fallback banners...');
      const fallbackBanners = [
        {
          id: 1,
          title: 'Sony Alpha A6400',
          subtitle: 'Mirrorless Camera with E 18-135mm Lens',
          discount: 'Giảm giá 15%',
          imageUrl: '/camera_sample_ulxm5p.png',
          bgColor: 'bg-zinc-900',
          textColor: 'text-white',
          buttonColor: 'bg-orange-500',
          type: 'HERO',
          order: 1,
          productId: 83,
        },
        {
          id: 2,
          title: 'Canon EOS R8',
          subtitle: 'The Lightest Full-Frame Camera',
          discount: 'Đặc quyền Nhà báo',
          imageUrl: '/camera_sample_ulxm5p.png',
          bgColor: 'bg-white',
          textColor: 'text-black',
          buttonColor: 'bg-blue-600',
          type: 'HERO',
          order: 2,
          productId: 83,
        },
        {
          id: 3,
          title: 'Fujifilm X-T5',
          subtitle: 'Photography First. Retro Style.',
          discount: 'Hàng mới về',
          imageUrl: '/camera_sample_ulxm5p.png',
          bgColor: 'bg-zinc-100',
          textColor: 'text-black',
          buttonColor: 'bg-zinc-800',
          type: 'HERO',
          order: 3,
          productId: 83,
        },
        // Promotion Banners
        {
          id: 4,
          title: 'Premium Sony Collection',
          subtitle: 'New arrivals',
          discount: 'Get it now',
          imageUrl: '/assets/promo-banner-1.webp',
          bgColor: 'bg-zinc-900',
          textColor: 'text-white',
          buttonColor: 'bg-orange-500',
          type: 'PROMOTION',
          order: 1,
          productId: 83,
        },
        {
          id: 5,
          title: 'Studio Gear Specials',
          subtitle: 'Limited time',
          discount: 'Shop now',
          imageUrl: '/assets/promo-banner-4.webp',
          bgColor: 'bg-zinc-100',
          textColor: 'text-black',
          buttonColor: 'bg-zinc-900',
          type: 'PROMOTION',
          order: 2,
          productId: 83,
        },
        {
          id: 6,
          title: 'Explore More',
          subtitle: 'Lens',
          discount: 'View',
          imageUrl: '/assets/promo-banner-2.webp',
          bgColor: 'bg-zinc-50',
          textColor: 'text-black',
          buttonColor: 'bg-zinc-800',
          type: 'PROMOTION',
          order: 3,
          productId: 83,
        },
        {
          id: 7,
          title: 'Flash Deals',
          subtitle: 'Daily',
          discount: 'Discover',
          imageUrl: '/assets/promo-banner-3.webp',
          bgColor: 'bg-zinc-50',
          textColor: 'text-black',
          buttonColor: 'bg-zinc-800',
          type: 'PROMOTION',
          order: 4,
          productId: 83,
        }
      ];

      for (const b of fallbackBanners) {
        await prisma.banner.upsert({
          where: { id: b.id },
          update: b,
          create: b,
        });
      }
      console.log(`✅ Seeded ${fallbackBanners.length} fallback banners.`);
    }

    // 5. Seed Flash Sales
    console.log('\n--- 5. Seeding Flash Sales ---');
    const flashSales = [
      {
        id: 1,
        productId: 83,
        salePrice: 12900000,
        totalSlots: 5,
        soldSlots: 2,
        endTime: new Date(Date.now() + 1000 * 60 * 60 * 24), // 24 hours from now
        badge: 'journalistPrivilege',
      },
      {
        id: 2,
        productId: 84,
        salePrice: 65000000,
        totalSlots: 3,
        soldSlots: 0,
        endTime: new Date(Date.now() + 1000 * 60 * 60 * 24),
        badge: 'dealerPrice',
      },
    ];

    for (const fs of flashSales) {
      await prisma.flashSale.upsert({
        where: { id: fs.id },
        update: fs,
        create: fs,
      });
    }
    console.log(`✅ Seeded ${flashSales.length} flash sales.`);
    
    if (flashSales.length > 0) {
      const maxId = Math.max(...flashSales.map((fs: any) => fs.id));
      await prisma.$executeRawUnsafe(`ALTER SEQUENCE "ecommerce"."FlashSale_id_seq" RESTART WITH ${maxId + 1}`);
      console.log(`   Reset FlashSale sequence to ${maxId + 1}`);
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
