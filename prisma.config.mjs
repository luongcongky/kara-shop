
import { defineConfig } from '@prisma/config';
import 'dotenv/config';

const dbUrl = process.env.DATABASE_URL || process.env.POSTGRES_PRISMA_URL || process.env.POSTGRES_URL;

if (!dbUrl) {
  throw new Error('DATABASE_URL, POSTGRES_PRISMA_URL, or POSTGRES_URL is not defined in the environment. Please check your Vercel Project Settings.');
}

export default defineConfig({
  schema: 'prisma/schema.prisma',
  datasource: {
    url: dbUrl,
  },
});
