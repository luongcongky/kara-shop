import 'dotenv/config';
import { Pool } from 'pg';
import fs from 'fs';
import path from 'path';

const connectionString = process.env.DATABASE_URL;

if (!connectionString) {
  throw new Error('DATABASE_URL is not defined in .env');
}

async function main() {
  const pool = new Pool({ connectionString: connectionString! });

  console.log('🔍 Starting Schema Introspection...');
  console.log(`   Database: ${connectionString!.includes('supabase') ? 'Supabase' : 'Local'}\n`);

  try {
    // Get all tables
    const tables = await pool.query(`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'ecommerce' 
      AND table_type = 'BASE TABLE'
      ORDER BY table_name;
    `);

    console.log(`📊 Found ${tables.rows.length} tables\n`);

    let ddl = `-- Database Schema Export\n`;
    ddl += `-- Generated: ${new Date().toISOString()}\n`;
    ddl += `-- Schema: ecommerce\n\n`;
    ddl += `CREATE SCHEMA IF NOT EXISTS "ecommerce";\n\n`;

    // For each table, get CREATE TABLE statement
    for (const { table_name } of tables.rows) {
      console.log(`   Introspecting: ${table_name}...`);

      // Get columns
      const columns = await pool.query(`
        SELECT 
          column_name,
          data_type,
          character_maximum_length,
          is_nullable,
          column_default
        FROM information_schema.columns
        WHERE table_schema = 'ecommerce'
        AND table_name = $1
        ORDER BY ordinal_position;
      `, [table_name]);

      ddl += `-- Table: ${table_name}\n`;
      ddl += `CREATE TABLE IF NOT EXISTS "ecommerce"."${table_name}" (\n`;

      const columnDefs = columns.rows.map(col => {
        let def = `  "${col.column_name}" ${col.data_type}`;
        
        if (col.character_maximum_length) {
          def += `(${col.character_maximum_length})`;
        }
        
        if (col.column_default) {
          def += ` DEFAULT ${col.column_default}`;
        }
        
        if (col.is_nullable === 'NO') {
          def += ' NOT NULL';
        }
        
        return def;
      });

      ddl += columnDefs.join(',\n');
      ddl += `\n);\n\n`;

      // Get indexes
      const indexes = await pool.query(`
        SELECT indexname, indexdef
        FROM pg_indexes
        WHERE schemaname = 'ecommerce'
        AND tablename = $1;
      `, [table_name]);

      if (indexes.rows.length > 0) {
        ddl += `-- Indexes for ${table_name}\n`;
        indexes.rows.forEach(idx => {
          ddl += `${idx.indexdef};\n`;
        });
        ddl += '\n';
      }
    }

    // Get foreign keys
    const foreignKeys = await pool.query(`
      SELECT
        tc.table_name,
        tc.constraint_name,
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
        AND tc.table_schema = 'ecommerce'
      ORDER BY tc.table_name;
    `);

    if (foreignKeys.rows.length > 0) {
      ddl += `-- Foreign Key Constraints\n`;
      foreignKeys.rows.forEach(fk => {
        ddl += `ALTER TABLE "ecommerce"."${fk.table_name}" `;
        ddl += `ADD CONSTRAINT "${fk.constraint_name}" `;
        ddl += `FOREIGN KEY ("${fk.column_name}") `;
        ddl += `REFERENCES "ecommerce"."${fk.foreign_table_name}" ("${fk.foreign_column_name}");\n`;
      });
      ddl += '\n';
    }

    // Save to file
    const targetDir = path.join(process.cwd(), 'prisma', 'data');
    if (!fs.existsSync(targetDir)) {
      fs.mkdirSync(targetDir, { recursive: true });
    }

    const targetPath = path.join(targetDir, 'schema-structure.sql');
    fs.writeFileSync(targetPath, ddl);

    console.log(`\n✅ Schema introspection complete!`);
    console.log(`   📁 File: ${targetPath}`);
    console.log(`   📊 Tables: ${tables.rows.length}`);
    console.log(`   🔗 Foreign Keys: ${foreignKeys.rows.length}`);

  } catch (error) {
    console.error('❌ Introspection failed:', error);
    throw error;
  } finally {
    await pool.end();
  }
}

main();
