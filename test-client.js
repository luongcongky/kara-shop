console.log('Starting test...');
try {
  const { PrismaClient } = require('@prisma/client');
  console.log('Loaded PrismaClient class');
  const prisma = new PrismaClient({
  datasources: {
    db: {
      url: "postgresql://postgres:123456@localhost:5432/postgres?schema=ecommerce",
    },
  },
});
  console.log('Instantiated PrismaClient');
  prisma.$connect().then(() => {
     console.log('Connected successfully');
     return prisma.$disconnect();
  }).catch(e => {
     console.error('Connection failed:', e);
  });
} catch (e) {
  console.error('Crash:', e);
}
