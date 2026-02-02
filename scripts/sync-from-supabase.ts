import 'dotenv/config';
import { PrismaClient } from '@prisma/client';
import { Pool } from 'pg';
import { PrismaPg } from '@prisma/adapter-pg';
import fs from 'fs';
import path from 'path';
import * as readline from 'readline';

interface TableInfo {
  table_name: string;
}

interface ColumnInfo {
  column_name: string;
  data_type: string;
  is_nullable: string;
}

interface ForeignKeyInfo {
  table_name: string;
  column_name: string;
  foreign_table_name: string;
  foreign_column_name: string;
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

// Helper function for topological sort
function visit(
  tableName: string,
  dependencies: Map<string, Set<string>>,
  visited: Set<string>,
  visiting: Set<string>,
  exportOrder: string[]
) {
  if (visited.has(tableName)) return;
  if (visiting.has(tableName)) {
    // Circular dependency - just continue
    return;
  }

  visiting.add(tableName);
  const deps = dependencies.get(tableName) || new Set();
  deps.forEach(dep => visit(dep, dependencies, visited, visiting, exportOrder));
  visiting.delete(tableName);
  visited.add(tableName);
  exportOrder.push(tableName);
}

// Function to ask user for confirmation
function askQuestion(query: string): Promise<string> {
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  });

  return new Promise(resolve => rl.question(query, ans => {
    rl.close();
    resolve(ans);
  }));
}

async function exportFromSupabase(supabaseUrl: string): Promise<DumpData> {
  const pool = new Pool({ connectionString: supabaseUrl });
  const adapter = new PrismaPg(pool);
  const prisma = new PrismaClient({ adapter });

  console.log('\n📥 STEP 1: Exporting data from Supabase...');
  console.log('   Using introspection to discover all tables...\n');

  try {
    // Discover all tables in the ecommerce schema
    const tables = await pool.query<TableInfo>(`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'ecommerce' 
      AND table_type = 'BASE TABLE'
      ORDER BY table_name;
    `);

    console.log(`📊 Found ${tables.rows.length} tables in Supabase:` );
    tables.rows.forEach(t => console.log(`   - ${t.table_name}`));

    // Get foreign key relationships
    const foreignKeys = await pool.query<ForeignKeyInfo>(`
      SELECT
        tc.table_name,
        kcu.column_name,
        ccu.table_name AS foreign_table_name,
        ccu.column_name AS foreign_column_name
      FROM information_schema.table_constraints AS tc
      JOIN information_schema.key_column_usage AS kcu
        ON tc.constraint_name = kcu.constraint_name
        AND tc.table_schema = kcu.table_schema
      JOIN information_schema.constraint_column_usage AS ccu
        ON ccu.constraint_name = tc.constraint_name
        AND ccu.table_schema = tc.table_schema
      WHERE tc.constraint_type = 'FOREIGN KEY'
        AND tc.table_schema = 'ecommerce';
    `);

    console.log(`\n🔗 Found ${foreignKeys.rows.length} foreign key relationships`);

    // Build dependency graph
    const dependencies = new Map<string, Set<string>>();
    tables.rows.forEach(t => dependencies.set(t.table_name, new Set()));

    foreignKeys.rows.forEach(fk => {
      if (fk.table_name !== fk.foreign_table_name) {
        dependencies.get(fk.table_name)?.add(fk.foreign_table_name);
      }
    });

    // Topological sort
    const exportOrder: string[] = [];
    const visited = new Set<string>();
    const visiting = new Set<string>();

    tables.rows.forEach(t => visit(t.table_name, dependencies, visited, visiting, exportOrder));

    console.log('\n📋 Export order (respecting dependencies):');
    exportOrder.forEach((t, i) => console.log(`   ${i + 1}. ${t}`));

    // Export data from all tables
    const allData: Record<string, unknown[]> = {};
    const sequences: Record<string, number> = {};

    console.log('\n💾 Exporting data from all tables...');

    for (const tableName of exportOrder) {
      try {
        const result = await pool.query(`SELECT * FROM "ecommerce"."${tableName}"`);
        allData[tableName] = result.rows;
        
        console.log(`   ✓ ${tableName}: ${result.rows.length} rows`);

        // Get sequence value if table has an id column
        const columns = await pool.query<ColumnInfo>(`
          SELECT column_name, data_type 
          FROM information_schema.columns 
          WHERE table_schema = 'ecommerce' 
          AND table_name = $1
          AND column_name = 'id';
        `, [tableName]);

        if (columns.rows.length > 0) {
          try {
            const seqResult = await pool.query(`
              SELECT last_value 
              FROM "ecommerce"."${tableName}_id_seq";
            `);
            if (seqResult.rows.length > 0) {
              sequences[tableName] = seqResult.rows[0].last_value;
            }
          } catch (e) {
            // Sequence might not exist, that's okay
          }
        }
      } catch (error) {
        console.error(`   ✗ Error exporting ${tableName}:`, error);
      }
    }

    const dump: DumpData = {
      metadata: {
        exportedAt: new Date().toISOString(),
        source: 'supabase',
        schema: 'ecommerce',
        tableCount: tables.rows.length,
        exportOrder: exportOrder,
      },
      sequences: sequences,
      data: allData,
    };

    console.log(`\n✅ Export from Supabase completed!`);
    console.log(`   📊 Tables: ${tables.rows.length}`);
    console.log(`   📝 Total rows: ${Object.values(allData).reduce((sum, rows) => sum + rows.length, 0)}`);

    return dump;

  } finally {
    await prisma.$disconnect();
    await pool.end();
  }
}

async function importToLocal(localUrl: string, dumpData: DumpData): Promise<void> {
  const pool = new Pool({ connectionString: localUrl });
  const adapter = new PrismaPg(pool);
  const prisma = new PrismaClient({ adapter });

  console.log('\n📤 STEP 2: Importing data to Local database...');

  try {
    // Disable foreign key checks
    console.log('\n🔓 Temporarily disabling foreign key constraints...');
    await pool.query('SET session_replication_role = replica;');

    // Clean existing data in reverse order
    console.log('\n🗑️  Cleaning existing data in local database...');
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

    // Import data in correct dependency order
    console.log('\n💾 Importing data in dependency order...');
    
    for (const tableName of dumpData.metadata.exportOrder) {
      const rows = dumpData.data[tableName];
      
      if (!rows || rows.length === 0) {
        console.log(`   ○ ${tableName}: No data to import`);
        continue;
      }

      try {
        // Get existing columns for this table
        const schemaResult = await pool.query(`
          SELECT column_name 
          FROM information_schema.columns 
          WHERE table_schema = 'ecommerce' AND table_name = $1
        `, [tableName]);
        
        const existingColumns = schemaResult.rows.map(r => r.column_name);
        
        // Filter rows to only include existing columns
        const dumpColumns = Object.keys(rows[0] as Record<string, unknown>);
        const columns = dumpColumns.filter(c => existingColumns.includes(c));
        
        if (columns.length === 0) {
          console.log(`   ○ ${tableName}: No matching columns to import`);
          continue;
        }

        if (columns.length < dumpColumns.length) {
          console.log(`   ⚠ ${tableName}: Skipping ${dumpColumns.length - columns.length} columns not present in schema`);
        }
        
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
      }
    }

    // Reset sequences
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

    // Re-enable foreign key checks
    console.log('\n🔒 Re-enabling foreign key constraints...');
    await pool.query('SET session_replication_role = DEFAULT;');

    // Verify data integrity
    console.log('\n✅ Verifying import...');
    
    for (const tableName of dumpData.metadata.exportOrder) {
      const result = await pool.query(`SELECT COUNT(*) FROM "ecommerce"."${tableName}"`);
      const expectedCount = dumpData.data[tableName]?.length || 0;
      const actualCount = parseInt(result.rows[0].count);
      
      if (actualCount === expectedCount) {
        console.log(`   ✓ ${tableName}: ${actualCount} rows (matches Supabase)`);
      } else {
        console.log(`   ⚠ ${tableName}: ${actualCount} rows (expected ${expectedCount})`);
      }
    }

    console.log('\n🏁 Import to Local database completed!');

  } catch (error) {
    console.error('\n❌ Import failed:', error);
    
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

async function main() {
  console.log('🔄 ========================================');
  console.log('   SYNC DATA FROM SUPABASE TO LOCAL');
  console.log('   ========================================\n');

  // Read .env file
  const envPath = path.join(process.cwd(), '.env');
  if (!fs.existsSync(envPath)) {
    console.error('❌ .env file not found!');
    process.exit(1);
  }

  const envContent = fs.readFileSync(envPath, 'utf8');
  const lines = envContent.split('\n');

  // Find DATABASE_URL lines
  let supabaseUrl = '';
  let localUrl = '';
  let currentUrl = '';

  for (const line of lines) {
    if (line.trim().startsWith('DATABASE_URL=')) {
      currentUrl = line.split('=')[1]?.trim().replace(/['"]/g, '') || '';
      if (currentUrl.includes('supabase')) {
        supabaseUrl = currentUrl;
      } else {
        localUrl = currentUrl;
      }
    }
    // Also check for commented lines
    if (line.trim().startsWith('#') && line.includes('DATABASE_URL=')) {
      const url = line.split('DATABASE_URL=')[1]?.trim().replace(/['"]/g, '') || '';
      if (url.includes('supabase')) {
        supabaseUrl = url;
      } else if (url.includes('localhost') || url.includes('127.0.0.1')) {
        localUrl = url;
      }
    }
  }

  console.log('📋 Configuration detected:');
  console.log(`   Supabase URL: ${supabaseUrl ? '✓ Found' : '✗ Not found'}`);
  console.log(`   Local URL: ${localUrl ? '✓ Found' : '✗ Not found'}`);
  console.log(`   Current active: ${currentUrl.includes('supabase') ? 'Supabase' : 'Local'}\n`);

  if (!supabaseUrl) {
    console.error('❌ Supabase DATABASE_URL not found in .env file!');
    console.log('   Please add your Supabase connection string to .env');
    console.log('   Example: DATABASE_URL="postgresql://postgres.[id]:[password]@...supabase.com:6543/postgres"');
    process.exit(1);
  }

  if (!localUrl) {
    console.error('❌ Local DATABASE_URL not found in .env file!');
    console.log('   Please add your local PostgreSQL connection string to .env');
    console.log('   Example: DATABASE_URL="postgresql://postgres:password@localhost:5432/kara_shop"');
    process.exit(1);
  }

  // Warning
  console.log('⚠️  WARNING: This will DELETE ALL DATA in your local database!');
  console.log('   and replace it with data from Supabase.\n');

  const answer = await askQuestion('   Do you want to continue? (yes/no): ');
  
  if (answer.toLowerCase() !== 'yes' && answer.toLowerCase() !== 'y') {
    console.log('\n❌ Sync cancelled by user.');
    process.exit(0);
  }

  try {
    // Step 1: Export from Supabase
    const dumpData = await exportFromSupabase(supabaseUrl);

    // Save dump to file for backup
    const targetDir = path.join(process.cwd(), 'prisma', 'data');
    if (!fs.existsSync(targetDir)) {
      fs.mkdirSync(targetDir, { recursive: true });
    }

    const dumpPath = path.join(targetDir, 'supabase-backup.json');
    fs.writeFileSync(dumpPath, JSON.stringify(dumpData, null, 2));
    console.log(`\n💾 Backup saved to: ${dumpPath}`);

    // Step 2: Import to Local
    await importToLocal(localUrl, dumpData);

    console.log('\n✅ ========================================');
    console.log('   SYNC COMPLETED SUCCESSFULLY!');
    console.log('   ========================================');
    console.log(`\n   📊 Total tables synced: ${dumpData.metadata.tableCount}`);
    console.log(`   📝 Total rows synced: ${Object.values(dumpData.data).reduce((sum, rows) => sum + rows.length, 0)}`);
    console.log(`   💾 Backup file: ${dumpPath}\n`);

  } catch (error) {
    console.error('\n❌ ========================================');
    console.error('   SYNC FAILED!');
    console.error('   ========================================\n');
    console.error(error);
    process.exit(1);
  }
}

main();
