import { PrismaClient, CollectionType } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('Seeding New & Trending collections (Slug-based)...');
  
  // 1. Fix Sequence Drift (Common cause of Unique Key violation on ID in Postgres)
  // We attempt to reset the sequence to MAX(id) + 1.
  try {
    const maxIdResult = await prisma.$queryRaw`SELECT MAX(id) as max_id FROM "ecommerce"."Collection"`;
    // @ts-expect-error - queryRaw returns unknown type, we know the structure
    const maxId = maxIdResult[0].max_id || 0;
    console.log(`Max ID is ${maxId}. Resetting sequence...`);
    
    // Attempt with schema prefix
    try {
        await prisma.$executeRawUnsafe(`ALTER SEQUENCE "ecommerce"."Collection_id_seq" RESTART WITH ${maxId + 1}`);
        console.log('Sequence "ecommerce"."Collection_id_seq" reset.');
    } catch {
        // Fallback for some setups
        await prisma.$executeRawUnsafe(`ALTER SEQUENCE "Collection_id_seq" RESTART WITH ${maxId + 1}`);
        console.log('Sequence "Collection_id_seq" reset.');
    }
  } catch (err) {
    console.warn('Could not reset sequence (might be permission issue), attempting seed anyway...', err);
  }

  // 1b. Clean up potential conflicts by slug
  try {
    const existingSlug = await prisma.collection.findUnique({
      where: { slug: 'new-and-trending-root' },
    });
    if (existingSlug) {
      // If we found it, we can just use it, or delete it if we want fresh start.
      // Let's use it to minimize ID churn.
      console.log(`Found existing Root by slug: ${existingSlug.id}`);
    }
  } catch (err) {
    console.warn('Error checking existing slug', err);
  }

  // 2. Upsert Root Collection
  // We identify it by unique slug.
  const trendingParent = await prisma.collection.upsert({
    where: { slug: 'new-and-trending-root' },
    update: {
      name: 'New & Trending Root',
      parentId: null, // It is a root
      useYn: true,
      types: [CollectionType.CLOTHES, CollectionType.CLOTHES],
    },
    create: {
      name: 'New & Trending Root',
      slug: 'new-and-trending-root',
      parentId: null,
      useYn: true,
      types: [CollectionType.CLOTHES, CollectionType.CLOTHES],
    },
  });

  console.log(`Trending Root ID: ${trendingParent.id}`);

  const subItems = [
    { name: 'New Arrivals', slug: 'new-arrivals' },
    { name: 'Best Sellers', slug: 'best-sellers' },
    { name: 'Only at Kara', slug: 'only-at-kara' },
    { name: 'Members Exclusives', slug: 'members-exclusives' },
    { name: 'Release Dates', slug: 'release-dates' },
    { name: 'Fall Collection', slug: 'fall-collection' },
    { name: 'Vintage 70s Collection', slug: 'vintage-70s' },
    { name: 'Pharrell Premium Basics', slug: 'pharrell-basics' },
  ];

  for (const item of subItems) {
    // Check if slug exists to avoid unique constraint if we didn't use upsert properly? 
    // upsert is safe.
    const child = await prisma.collection.upsert({
      where: { slug: item.slug },
      update: {
        parentId: trendingParent.id, // Link to the real ID
        useYn: true,
        types: [CollectionType.CLOTHES, CollectionType.CLOTHES],
      },
      create: {
        name: item.name,
        slug: item.slug,
        parentId: trendingParent.id,
        useYn: true,
        types: [CollectionType.CLOTHES, CollectionType.CLOTHES],
      },
    });
    console.log(` - Upserted child: ${child.name}`);
  }

  console.log('Seeding completed.');
}

main()
  .catch((e) => {
    console.error('ERROR SEEDING:', JSON.stringify(e, null, 2));
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
