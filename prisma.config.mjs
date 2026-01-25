
import { defineConfig } from '@prisma/config';
import 'dotenv/config';

const dbUrl = process.env.DATABASE_URL;
const directUrl = process.env.DIRECT_URL;

// Prisma CLI often needs the direct URL for migrations (DDL)
// We detect if it's the CLI by looking at command line arguments or environment
const isCLI = process.argv.some((arg) => arg.includes('prisma')) || process.env.npm_lifecycle_event?.includes('migrate');

if (!dbUrl) {
  throw new Error('DATABASE_URL is not defined in the environment.');
}

export default defineConfig({
  schema: 'prisma/schema.prisma',
  migrations: {
    seed: 'tsx prisma/seed.ts',
  },
  datasource: {
    url: (isCLI && directUrl) ? directUrl : dbUrl,
    directUrl: directUrl,
  },
});
