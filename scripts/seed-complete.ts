import 'dotenv/config';
import { PrismaClient } from '@prisma/client';
import { Pool } from 'pg';
import { PrismaPg } from '@prisma/adapter-pg';
import fs from 'fs';
import path from 'path';

const connectionString = process.env.DATABASE_URL;

if (!connectionString) {
  throw new Error('DATABASE_URL is not defined in .env');
}

interface DumpData {
  metadata: {
    exportedAt: string;
    source: string;
    schema: string;
    tableCount: number;
    exportOrder: string[];
  };
  sequences: Record<string, number>;
  data: Record<string, unknown[]>;
}

function loadCompleteDump(): DumpData | null {
  const dumpPath = path.join(process.cwd(), 'prisma', 'data', 'complete-db-dump.json');
  console.log('   📂 Loading complete dump from:', dumpPath);
  
  if (fs.existsSync(dumpPath)) {
    const data = fs.readFileSync(dumpPath, 'utf8');
    return JSON.parse(data);
  }
  
  return null;
}

async function main() {
  const pool = new Pool({ connectionString: connectionString! });
  const adapter = new PrismaPg(pool);
  const prisma = new PrismaClient({ adapter });

  console.log('🌱 Starting Complete Database Seed...');
  console.log(`   Target: ${connectionString!.includes('supabase') ? 'Supabase' : 'Local'}\n`);

  const dumpData = loadCompleteDump();

  if (!dumpData) {
    console.error('❌ No complete dump file found!');
    console.log('   Please run: npm run db:dump-complete');
    process.exit(1);
  }

  console.log(`📦 Dump metadata:`);
  console.log(`   Exported: ${dumpData.metadata.exportedAt}`);
  console.log(`   Source: ${dumpData.metadata.source}`);
  console.log(`   Tables: ${dumpData.metadata.tableCount}`);
  console.log(`   Total rows: ${Object.values(dumpData.data).reduce((sum, rows) => sum + rows.length, 0)}`);

  try {
    // Step 1: Disable foreign key checks temporarily for clean import
    console.log('\n🔓 Temporarily disabling foreign key constraints...');
    await pool.query('SET session_replication_role = replica;');

    // Step 2: Clean existing data in reverse order
    console.log('\n🗑️  Cleaning existing data...');
    const reverseOrder = [...dumpData.metadata.exportOrder].reverse();
    
    for (const tableName of reverseOrder) {
      try {
        const result = await pool.query(`DELETE FROM "ecommerce"."${tableName}"`);
        console.log(`   ✓ Cleared ${tableName}: ${result.rowCount} rows deleted`);
      } catch (error) {
        const err = error as Error;
        console.log(`   ⚠ Could not clear ${tableName}: ${err.message}`);
      }
    }

    // Step 3: Import data in correct dependency order
    console.log('\n💾 Importing data in dependency order...');
    
    for (const tableName of dumpData.metadata.exportOrder) {
      const rows = dumpData.data[tableName];
      
      if (!rows || rows.length === 0) {
        console.log(`   ○ ${tableName}: No data to import`);
        continue;
      }

      try {
        // Get column names from first row
        const columns = Object.keys(rows[0] as Record<string, unknown>);
        
        // Build INSERT query
        const columnList = columns.map(c => `"${c}"`).join(', ');
        const placeholders = rows.map((_, rowIndex) => {
          const valuePlaceholders = columns.map((_, colIndex) => 
            `$${rowIndex * columns.length + colIndex + 1}`
          ).join(', ');
          return `(${valuePlaceholders})`;
        }).join(', ');

        // Flatten all values
        const values = rows.flatMap(row => columns.map(col => (row as Record<string, unknown>)[col]));

        const insertQuery = `
          INSERT INTO "ecommerce"."${tableName}" (${columnList})
          VALUES ${placeholders}
        `;

        await pool.query(insertQuery, values);
        console.log(`   ✓ ${tableName}: ${rows.length} rows imported`);

      } catch (error) {
        const err = error as Error;
        console.error(`   ✗ ${tableName}: Import failed - ${err.message}`);
        // Continue with other tables
      }
    }

    // Step 4: Reset sequences
    console.log('\n🔄 Resetting sequences...');
    
    for (const [tableName, lastValue] of Object.entries(dumpData.sequences)) {
      try {
        await pool.query(`
          SELECT setval('"ecommerce"."${tableName}_id_seq"', $1, true);
        `, [lastValue]);
        console.log(`   ✓ ${tableName}_id_seq: Reset to ${lastValue}`);
      } catch (error) {
        const err = error as Error;
        console.log(`   ⚠ ${tableName}_id_seq: ${err.message}`);
      }
    }

    // Step 5: Re-enable foreign key checks
    console.log('\n🔒 Re-enabling foreign key constraints...');
    await pool.query('SET session_replication_role = DEFAULT;');

    // Step 6: Verify data integrity
    console.log('\n✅ Verifying import...');
    
    for (const tableName of dumpData.metadata.exportOrder) {
      const result = await pool.query(`SELECT COUNT(*) FROM "ecommerce"."${tableName}"`);
      const expectedCount = dumpData.data[tableName]?.length || 0;
      const actualCount = parseInt(result.rows[0].count);
      
      if (actualCount === expectedCount) {
        console.log(`   ✓ ${tableName}: ${actualCount} rows (matches dump)`);
      } else {
        console.log(`   ⚠ ${tableName}: ${actualCount} rows (expected ${expectedCount})`);
      }
    }

    console.log('\n🏁 Complete Database Seed Finished!');
    console.log(`   All ${dumpData.metadata.tableCount} tables processed.`);

  } catch (error) {
    console.error('\n❌ Seed failed:', error);
    
    // Make sure to re-enable constraints even on error
    try {
      await pool.query('SET session_replication_role = DEFAULT;');
    } catch (e) {
      // Ignore
    }
    
    throw error;
  } finally {
    await prisma.$disconnect();
    await pool.end();
  }
}

main()
  .catch((e) => {
    console.error('❌ Fatal error during seeding:', e);
    process.exit(1);
  });
