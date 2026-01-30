import 'dotenv/config';
import { PrismaClient } from '@prisma/client';
import { Pool } from 'pg';
import { PrismaPg } from '@prisma/adapter-pg';

const connectionString = process.env.DATABASE_URL;

async function main() {
  const pool = new Pool({ connectionString: connectionString! });
  const adapter = new PrismaPg(pool);
  const prisma = new PrismaClient({ adapter });

  console.log('🔍 Final Verification of Supabase Banner Data...\n');

  try {
    const banners = await prisma.banner.findMany({
      orderBy: { id: 'asc' }
    });

    console.log(`📊 Current Banners in Supabase: ${banners.length}\n`);
    
    banners.forEach((banner, index) => {
      console.log(`[${index + 1}] ID: ${banner.id} | Title: ${banner.title} | Type: ${banner.type} | Active: ${banner.active}`);
    });

    const heroCount = banners.filter(b => b.type === 'HERO').length;
    console.log(`\n📈 HERO Count: ${heroCount}`);
    
    if (heroCount === 2) {
      console.log('\n✅ SUCCESS: Now matches Local (2 HERO banners).');
    } else {
      console.log(`\n❌ ERROR: Still showing ${heroCount} HERO banners instead of 2.`);
    }

  } catch (error) {
    console.error('❌ Error during verification:', error);
  } finally {
    await prisma.$disconnect();
    await pool.end();
  }
}

main();
