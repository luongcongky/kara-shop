
import { defineConfig } from '@prisma/config';
import 'dotenv/config';

const isLocal = process.env.DB_PROVIDER === 'LOCAL';

const dbUrl = isLocal 
  ? process.env.DATABASE_URL_LOCAL 
  : (process.env.DATABASE_URL_SUPABASE || process.env.DATABASE_URL || process.env.POSTGRES_PRISMA_URL || process.env.POSTGRES_URL);

const directUrl = isLocal 
  ? undefined 
  : (process.env.DIRECT_URL_SUPABASE || process.env.DIRECT_URL || process.env.POSTGRES_URL_NON_POOLING);

if (!dbUrl) {
  throw new Error('DATABASE_URL, POSTGRES_PRISMA_URL, or POSTGRES_URL is not defined in the environment. Please check your Vercel Project Settings.');
}

export default defineConfig({
  schema: 'prisma/schema.prisma',
  migrations: {
    seed: 'tsx prisma/seed.ts',
  },
  datasource: {
    url: dbUrl,
    directUrl: directUrl,
  },
});
