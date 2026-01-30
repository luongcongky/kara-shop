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

async function main() {
  const pool = new Pool({ connectionString: connectionString! });
  const adapter = new PrismaPg(pool);
  const prisma = new PrismaClient({ adapter });

  console.log('🔍 Starting Complete Database Export...');
  console.log('   Using introspection to discover all tables...\n');

  try {
    // Step 1: Discover all tables in the ecommerce schema
    const tables = await pool.query<TableInfo>(`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'ecommerce' 
      AND table_type = 'BASE TABLE'
      ORDER BY table_name;
    `);

    console.log(`📊 Found ${tables.rows.length} tables in schema 'ecommerce':`);
    tables.rows.forEach(t => console.log(`   - ${t.table_name}`));

    // Step 2: Get foreign key relationships to determine export order
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

    // Step 3: Build dependency graph and determine export order
    const dependencies = new Map<string, Set<string>>();
    tables.rows.forEach(t => dependencies.set(t.table_name, new Set()));

    foreignKeys.rows.forEach(fk => {
      if (fk.table_name !== fk.foreign_table_name) {
        dependencies.get(fk.table_name)?.add(fk.foreign_table_name);
      }
    });

    // Topological sort to get correct export order
    const exportOrder: string[] = [];
    const visited = new Set<string>();
    const visiting = new Set<string>();

    tables.rows.forEach(t => visit(t.table_name, dependencies, visited, visiting, exportOrder));

    console.log('\n📋 Export order (respecting dependencies):');
    exportOrder.forEach((t, i) => console.log(`   ${i + 1}. ${t}`));

    // Step 4: Export data from all tables
    const allData: Record<string, unknown[]> = {};
    const sequences: Record<string, number> = {};

    console.log('\n💾 Exporting data from all tables...');

    for (const tableName of exportOrder) {
      try {
        // Get all data from table
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

    // Step 5: Create comprehensive dump
    const dump = {
      metadata: {
        exportedAt: new Date().toISOString(),
        source: connectionString!.includes('supabase') ? 'supabase' : 'local',
        schema: 'ecommerce',
        tableCount: tables.rows.length,
        exportOrder: exportOrder,
      },
      sequences: sequences,
      data: allData,
    };

    // Step 6: Save to file
    const targetDir = path.join(process.cwd(), 'prisma', 'data');
    if (!fs.existsSync(targetDir)) {
      fs.mkdirSync(targetDir, { recursive: true });
    }

    const targetPath = path.join(targetDir, 'complete-db-dump.json');
    fs.writeFileSync(targetPath, JSON.stringify(dump, null, 2));

    console.log(`\n✅ Complete database exported successfully!`);
    console.log(`   📁 File: ${targetPath}`);
    console.log(`   📊 Tables: ${tables.rows.length}`);
    console.log(`   📝 Total rows: ${Object.values(allData).reduce((sum, rows) => sum + rows.length, 0)}`);
    
  } catch (error) {
    console.error('❌ Export failed:', error);
    throw error;
  } finally {
    await prisma.$disconnect();
    await pool.end();
  }
}

main();
