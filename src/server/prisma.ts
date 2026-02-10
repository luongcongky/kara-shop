/**
 * Instantiates a single instance PrismaClient and save it on the global object.
 * @link https://www.prisma.io/docs/support/help-articles/nextjs-prisma-client-dev-practices
 */
import { PrismaClient } from '@prisma/client';
import { env } from '@/env/server.mjs';

// Extend PrismaClient to include custom properties
interface ExtendedPrismaClient extends PrismaClient {
  _queryListenerAttached?: boolean;
}

declare global {
  // allow global `var` declarations
  // eslint-disable-next-line no-var
  var prisma: ExtendedPrismaClient | undefined;
}

import { Pool } from 'pg';
import { PrismaPg } from '@prisma/adapter-pg';

const connectionString = env.DATABASE_URL;

const pool = new Pool({ connectionString });
const adapter = new PrismaPg(pool);

const isDev = env.NODE_ENV === 'development';

export const prisma =
  global.prisma ||
  new PrismaClient({
    adapter,
    log: isDev
      ? [
          { emit: 'event', level: 'query' },
          { emit: 'stdout', level: 'error' },
          { emit: 'stdout', level: 'warn' },
        ]
      : ['error'],
  });

if (isDev && !(prisma as ExtendedPrismaClient)._queryListenerAttached) {
  (prisma as ExtendedPrismaClient)._queryListenerAttached = true;
  prisma.$on('query', (e: { query: string; params: string; duration: number }) => {
    console.log('Query: ' + e.query);
    console.log('Params: ' + e.params);
    console.log('Duration: ' + e.duration + 'ms');
  });
}

if (env.NODE_ENV !== 'production') global.prisma = prisma;

// Force reload after schema update (v3 - verified thumbnail)

// trigger reload v4
