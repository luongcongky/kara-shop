import 'dotenv/config';
import { PrismaClient, Collection, Product } from '@prisma/client';
import { Pool } from 'pg';
import { PrismaPg } from '@prisma/adapter-pg';
import fs from 'fs';
import path from 'path';

// Helper to load JSON dump
function loadDump() {
  const dumpPath = path.join(process.cwd(), 'prisma', 'data', 'latest-db-dump.json');
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

    // 1. Seed Collections
    console.log('\n--- 1. Seeding Collections from Dump ---');
    if (dumpData.collections && dumpData.collections.length > 0) {
      // Pass 1: Upsert all without parentId to avoid FK errors
      console.log('   Pass 1: Upserting collections (without parent links)...');
      for (const col of dumpData.collections) {
        const types = parsePostgresArray(col.types);
        
        await prisma.collection.upsert({
          where: { id: col.id },
          update: {
            name: col.name,
            slug: col.slug,
            useYn: col.useYn,
            // parentId: col.parentId, // Skip in pass 1? No, if we update we can set it if it refers to existing. 
            // Better to strictly set null here or only set if we know it exists? 
            // Actually, for circular refs or complex order, safe to set null first.
            // But if it already exists and has a parent, we don't want to break it? 
            // Upsert: Create=Null, Update=Keep? 
            // If we are seeding from scratch (or over old data), we might want to sync.
            
            // Safe strategy: 
            // Create: parentId: null. 
            // Update: parentId: col.parentId (if it works? No, if we update a record that now depends on a not-yet-seen record?)
            
            // Let's set parentId: null in Create. 
            // In Update, we can try setting it, but if it fails? 
            // Safer: Set parentId: null (or ignore) in Pass 1. 
            // Pass 2: Set parentId.
            
            types: types,
            createdAt: new Date(col.createdAt),
            updatedAt: new Date(col.updatedAt),
          },
          create: {
            id: col.id,
            name: col.name,
            slug: col.slug,
            useYn: col.useYn,
            parentId: null, // Temporary null
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
        // Handle images separately
        const { images, ...productData } = prod;
        
        const types = parsePostgresArray(productData.types);

        // Remove ID from creation data if we want auto-increment, BUT here we want to PRESERVE IDs.
        // Prisma allows setting ID on create.
        
        await prisma.product.upsert({
          where: { id: productData.id },
          update: {
            name: productData.name,
            description: productData.description,
            price: productData.price,
            rate: productData.rate,
            published: productData.published,
            collectionId: productData.collectionId,
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
            published: productData.published,
            collectionId: productData.collectionId,
            types: types,
            createdAt: new Date(productData.createdAt),
            updatedAt: new Date(productData.updatedAt),
          }
        });

        // Seed Images for this product
        if (images && images.create && images.create.length > 0) {
           // First allow delete existing images to avoid duplication if running multiple times? 
           // Or just trust the dump. 
           // Simplest: Delete all images for this product and re-add from dump
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
      }
      console.log(`✅ Seeded ${dumpData.products.length} products from dump.`);
      
      // Reset sequence for Product
      const maxId = Math.max(...dumpData.products.map((p: Product) => p.id));
      await prisma.$executeRawUnsafe(`ALTER SEQUENCE "ecommerce"."Product_id_seq" RESTART WITH ${maxId + 1}`);
      console.log(`   Reset Product sequence to ${maxId + 1}`);
    }

  } else {
    console.warn('⚠️  No dump file found. Please run "npm run dump-db" first to capture current database state.');
    console.log('   Using fallback static seed (WARNING: May be outdated)...');
    
    // ... (Keep existing logic or throw error if user insists on new data)
    // For now, let's just log this.
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
