
import { defineConfig } from '@prisma/config';
import 'dotenv/config';

const dbUrl = process.env.DATABASE_URL;
const directUrl = process.env.DIRECT_URL;

if (!dbUrl) {
  throw new Error('DATABASE_URL is not defined in the environment.');
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
