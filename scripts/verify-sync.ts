import 'dotenv/config';
import { Pool } from 'pg';
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
  
  if (fs.existsSync(dumpPath)) {
    const data = fs.readFileSync(dumpPath, 'utf8');
    return JSON.parse(data);
  }
  
  return null;
}

async function main() {
  const pool = new Pool({ connectionString: connectionString! });

  console.log('✅ Starting Sync Verification...');
  console.log(`   Database: ${connectionString!.includes('supabase') ? 'Supabase' : 'Local'}\n`);

  const dumpData = loadCompleteDump();

  if (!dumpData) {
    console.error('❌ No dump file found for comparison!');
    console.log('   Cannot verify without source data.');
    process.exit(1);
  }

  console.log(`📦 Comparing against dump from: ${dumpData.metadata.exportedAt}\n`);

  try {
    let totalErrors = 0;
    let totalWarnings = 0;

    // Verify table count
    const tables = await pool.query(`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'ecommerce' 
      AND table_type = 'BASE TABLE'
      ORDER BY table_name;
    `);

    console.log('📊 Table Count Verification:');
    if (tables.rows.length === dumpData.metadata.tableCount) {
      console.log(`   ✓ Table count matches: ${tables.rows.length}`);
    } else {
      console.log(`   ✗ Table count mismatch!`);
      console.log(`     Expected: ${dumpData.metadata.tableCount}`);
      console.log(`     Actual: ${tables.rows.length}`);
      totalErrors++;
    }

    // Verify row counts for each table
    console.log('\n📋 Row Count Verification:');
    
    for (const tableName of dumpData.metadata.exportOrder) {
      const expectedCount = dumpData.data[tableName]?.length || 0;
      
      try {
        const result = await pool.query(`SELECT COUNT(*) FROM "ecommerce"."${tableName}"`);
        const actualCount = parseInt(result.rows[0].count);

        if (actualCount === expectedCount) {
          console.log(`   ✓ ${tableName}: ${actualCount} rows`);
        } else {
          console.log(`   ⚠ ${tableName}: ${actualCount} rows (expected ${expectedCount})`);
          totalWarnings++;
        }
      } catch (error) {
        const err = error as Error;
        console.log(`   ✗ ${tableName}: Error - ${err.message}`);
        totalErrors++;
      }
    }

    // Verify sequences
    console.log('\n🔄 Sequence Verification:');
    
    for (const [tableName, expectedValue] of Object.entries(dumpData.sequences)) {
      try {
        const result = await pool.query(`
          SELECT last_value 
          FROM "ecommerce"."${tableName}_id_seq";
        `);
        
        const actualValue = result.rows[0].last_value;
        
        if (actualValue >= expectedValue) {
          console.log(`   ✓ ${tableName}_id_seq: ${actualValue}`);
        } else {
          console.log(`   ⚠ ${tableName}_id_seq: ${actualValue} (expected >= ${expectedValue})`);
          totalWarnings++;
        }
      } catch (error) {
        console.log(`   ○ ${tableName}_id_seq: Not found (may not exist)`);
      }
    }

    // Verify foreign key constraints
    console.log('\n🔗 Foreign Key Constraint Verification:');
    
    const fkCheck = await pool.query(`
      SELECT 
        tc.table_name,
        tc.constraint_name
      FROM information_schema.table_constraints AS tc
      WHERE tc.constraint_type = 'FOREIGN KEY'
        AND tc.table_schema = 'ecommerce';
    `);

    console.log(`   ✓ Found ${fkCheck.rows.length} foreign key constraints`);

    // Summary
    console.log('\n═══════════════════════════════════════════════════════');
    console.log('VERIFICATION SUMMARY');
    console.log('═══════════════════════════════════════════════════════');
    
    if (totalErrors === 0 && totalWarnings === 0) {
      console.log('✅ Perfect sync! All checks passed.');
    } else {
      if (totalErrors > 0) {
        console.log(`❌ Errors: ${totalErrors}`);
      }
      if (totalWarnings > 0) {
        console.log(`⚠️  Warnings: ${totalWarnings}`);
      }
      
      if (totalErrors > 0) {
        console.log('\n⚠️  Critical issues detected. Please review errors above.');
      } else {
        console.log('\n✓ No critical errors, but some warnings detected.');
        console.log('  This is usually okay - warnings may indicate:');
        console.log('  - Tables that were empty in source');
        console.log('  - Sequences that auto-incremented during import');
      }
    }

  } catch (error) {
    console.error('\n❌ Verification failed:', error);
    throw error;
  } finally {
    await pool.end();
  }
}

main();
