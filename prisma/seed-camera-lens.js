const { PrismaClient, CollectionType } = require('@prisma/client');
const { Pool } = require('pg');
const { PrismaPg } = require('@prisma/adapter-pg');
require('dotenv/config');

const connectionString = process.env.DATABASE_URL || "postgresql://postgres:123456@localhost:5432/postgres?schema=ecommerce";
const pool = new Pool({ connectionString });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

const cameraRootId = 200;
const lensRootId = 201;

async function main() {
  console.log('Seeding Camera and Lens collections...');

  // 1. Create Root Collections
  // Camera
  await prisma.collection.upsert({
    where: { id: cameraRootId },
    update: {},
    create: {
      id: cameraRootId,
      name: 'Máy Ảnh',
      slug: 'may-anh',
      types: [CollectionType.CAMERA],
      useYn: true,
    },
  });
  console.log('Upserted Camera Root');

  // Lens
  await prisma.collection.upsert({
    where: { id: lensRootId },
    update: {},
    create: {
      id: lensRootId,
      name: 'Ống Kính',
      slug: 'ong-kinh',
      types: [CollectionType.LENS],
      useYn: true,
    },
  });
  console.log('Upserted Lens Root');

  // 2. Create Camera Sub-collections
  const cameraSubs = [
    { name: 'Máy Ảnh Mirrorless', slug: 'may-anh-mirrorless' },
    { name: 'Máy Ảnh Compact', slug: 'may-anh-compact' },
    { name: 'Máy Ảnh Instax', slug: 'may-anh-instax' },
    { name: 'Máy Ảnh Medium Format', slug: 'may-anh-medium-format' },
    { name: 'Máy Ảnh Film', slug: 'may-anh-film' },
  ];

  for (const sub of cameraSubs) {
    await prisma.collection.upsert({
      where: { slug: sub.slug },
      update: {
        parentId: cameraRootId,
        types: [CollectionType.CAMERA],
      },
      create: {
        name: sub.name,
        slug: sub.slug,
        parentId: cameraRootId,
        types: [CollectionType.CAMERA],
        useYn: true,
      },
    });
  }
  console.log(`Upserted ${cameraSubs.length} camera sub-collections.`);

  // 3. Create Lens Sub-collections
  const lensSubs = [
    { name: 'Ống Kính DSLR', slug: 'ong-kinh-dslr' },
    { name: 'Ống Kính Mirrorless', slug: 'ong-kinh-mirrorless' },
    { name: 'Ống Kính Cinema', slug: 'ong-kinh-cinema' },
    { name: 'Ống Kính Medium Format', slug: 'ong-kinh-medium-format' },
  ];

  for (const sub of lensSubs) {
    await prisma.collection.upsert({
      where: { slug: sub.slug },
      update: {
        parentId: lensRootId,
        types: [CollectionType.LENS],
      },
      create: {
        name: sub.name,
        slug: sub.slug,
        parentId: lensRootId,
        types: [CollectionType.LENS],
        useYn: true,
      },
    });
  }
  console.log(`Upserted ${lensSubs.length} lens sub-collections.`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
