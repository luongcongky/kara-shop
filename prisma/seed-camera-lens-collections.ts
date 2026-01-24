const { PrismaClient, CollectionType } = require('@prisma/client');
require('dotenv/config');

const prismaSeed = new PrismaClient();

const cameraRootId = 200;
const lensRootId = 201;

async function main() {
  console.log('Seeding Camera and Lens collections...');

  // 1. Create Root Collections
  const cameraRoot = await prismaSeed.collection.upsert({
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
  console.log('Upserted Camera Root:', cameraRoot.name);

  const lensRoot = await prismaSeed.collection.upsert({
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
  console.log('Upserted Lens Root:', lensRoot.name);

  // 2. Create Camera Sub-collections
  const cameraSubs = [
    { name: 'Máy Ảnh Mirrorless', slug: 'may-anh-mirrorless' },
    { name: 'Máy Ảnh Compact', slug: 'may-anh-compact' },
    { name: 'Máy Ảnh Instax', slug: 'may-anh-instax' },
    { name: 'Máy Ảnh Medium Format', slug: 'may-anh-medium-format' },
    { name: 'Máy Ảnh Film', slug: 'may-anh-film' },
  ];

  for (const sub of cameraSubs) {
    await prismaSeed.collection.upsert({
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
    await prismaSeed.collection.upsert({
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
    await prismaSeed.$disconnect();
  });
