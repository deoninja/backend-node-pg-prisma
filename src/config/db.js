import pkg from '@prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';
import pg from 'pg';
import 'dotenv/config';

const { PrismaClient } = pkg;
const { Pool } = pg;

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});
const adapter = new PrismaPg(pool);

const prisma = new PrismaClient({
  adapter,
  log:
    process.env.NODE_ENV === 'development'
      ? ['query', 'info', 'warn', 'error']
      : ['warn', 'error'],
});

const connectDb = async () => {
  try {
    await prisma.$connect();
    console.log('Connected to the database');
  } catch (error) {
    console.error(`Error connecting to the database: ${error.message}`);
    process.exit(1);
  }
};

const disconnectDb = async () => {
  await prisma.$disconnect();
};

export { prisma, connectDb, disconnectDb };
