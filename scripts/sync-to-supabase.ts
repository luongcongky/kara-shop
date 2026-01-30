import 'dotenv/config';
import { exec } from 'child_process';
import { promisify } from 'util';
import * as readline from 'readline';

const execAsync = promisify(exec);

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

function question(query: string): Promise<string> {
  return new Promise(resolve => rl.question(query, resolve));
}

async function runCommand(command: string, description: string) {
  console.log(`\n${description}...`);
  try {
    const { stdout, stderr } = await execAsync(command);
    if (stdout) console.log(stdout);
    if (stderr) console.error(stderr);
    return true;
  } catch (error) {
    const err = error as Error;
    console.error(`❌ Failed: ${err.message}`);
    return false;
  }
}

async function main() {
  console.log('🚀 Database Sync to Supabase\n');
  console.log('This script will:');
  console.log('  1. Export complete local database (schema + data)');
  console.log('  2. Switch to Supabase connection');
  console.log('  3. Apply schema structure');
  console.log('  4. Import all data');
  console.log('  5. Verify sync completeness\n');

  // Check current DATABASE_URL
  const currentUrl = process.env.DATABASE_URL || '';
  const isSupabase = currentUrl.includes('supabase');

  if (isSupabase) {
    console.log('⚠️  WARNING: DATABASE_URL is currently pointing to Supabase!');
    console.log('   This script expects to export from LOCAL database first.\n');
    
    const answer = await question('Do you want to continue anyway? (yes/no): ');
    if (answer.toLowerCase() !== 'yes') {
      console.log('Aborted.');
      rl.close();
      return;
    }
  } else {
    console.log('✓ DATABASE_URL is pointing to local database\n');
  }

  // Step 1: Export from local
  console.log('═══════════════════════════════════════════════════════');
  console.log('STEP 1: Export Local Database');
  console.log('═══════════════════════════════════════════════════════');
  
  const exportSuccess = await runCommand(
    'tsx scripts/dump-db-complete.ts',
    '📤 Exporting complete database'
  );

  if (!exportSuccess) {
    console.log('\n❌ Export failed. Aborting sync.');
    rl.close();
    return;
  }

  const introspectSuccess = await runCommand(
    'tsx scripts/introspect-schema.ts',
    '🔍 Introspecting schema structure'
  );

  if (!introspectSuccess) {
    console.log('\n❌ Schema introspection failed. Aborting sync.');
    rl.close();
    return;
  }

  // Step 2: Confirm switch to Supabase
  console.log('\n═══════════════════════════════════════════════════════');
  console.log('STEP 2: Switch to Supabase');
  console.log('═══════════════════════════════════════════════════════');
  console.log('\n⚠️  IMPORTANT: You must now manually update .env file:');
  console.log('   1. Change DATABASE_URL to Supabase (port 6543)');
  console.log('   2. Change DIRECT_URL to Supabase (port 5432)');
  console.log('\nExample:');
  console.log('DATABASE_URL="postgresql://postgres.[id]:[password]@aws-0-ap-southeast-1.pooler.supabase.com:6543/postgres"');
  console.log('DIRECT_URL="postgresql://postgres.[id]:[password]@aws-0-ap-southeast-1.pooler.supabase.com:5432/postgres"\n');

  const switched = await question('Have you updated .env to point to Supabase? (yes/no): ');
  if (switched.toLowerCase() !== 'yes') {
    console.log('\nPlease update .env and run this script again.');
    rl.close();
    return;
  }

  // Step 3: Apply schema to Supabase
  console.log('\n═══════════════════════════════════════════════════════');
  console.log('STEP 3: Apply Schema to Supabase');
  console.log('═══════════════════════════════════════════════════════');
  
  console.log('\n⚠️  This will modify Supabase schema!');
  const confirmSchema = await question('Continue with schema migration? (yes/no): ');
  
  if (confirmSchema.toLowerCase() !== 'yes') {
    console.log('Aborted.');
    rl.close();
    return;
  }

  const migrateSuccess = await runCommand(
    'npx prisma db push --accept-data-loss',
    '🔄 Pushing schema to Supabase'
  );

  if (!migrateSuccess) {
    console.log('\n⚠️  Schema push failed. You may need to:');
    console.log('   - Check DIRECT_URL is correct');
    console.log('   - Manually clean Supabase database');
    console.log('   - Run: npx prisma migrate deploy');
    
    const continueAnyway = await question('\nContinue with data import anyway? (yes/no): ');
    if (continueAnyway.toLowerCase() !== 'yes') {
      rl.close();
      return;
    }
  }

  // Step 4: Import data
  console.log('\n═══════════════════════════════════════════════════════');
  console.log('STEP 4: Import Data to Supabase');
  console.log('═══════════════════════════════════════════════════════');
  
  console.log('\n⚠️  This will REPLACE all data in Supabase!');
  const confirmData = await question('Continue with data import? (yes/no): ');
  
  if (confirmData.toLowerCase() !== 'yes') {
    console.log('Aborted.');
    rl.close();
    return;
  }

  const seedSuccess = await runCommand(
    'tsx scripts/seed-complete.ts',
    '💾 Importing all data'
  );

  if (!seedSuccess) {
    console.log('\n❌ Data import failed. Check logs above for details.');
    rl.close();
    return;
  }

  // Step 5: Verify
  console.log('\n═══════════════════════════════════════════════════════');
  console.log('STEP 5: Verify Sync');
  console.log('═══════════════════════════════════════════════════════');
  
  await runCommand(
    'tsx scripts/verify-sync.ts',
    '✅ Verifying data integrity'
  );

  console.log('\n🎉 Database sync completed!');
  console.log('\nNext steps:');
  console.log('  - Test your application with Supabase');
  console.log('  - Verify critical data manually');
  console.log('  - Update .env back to local if needed\n');

  rl.close();
}

main().catch(error => {
  console.error('Fatal error:', error);
  rl.close();
  process.exit(1);
});
