import { PrismaClient } from '../lib/generated/prisma';
import { withAccelerate } from '@prisma/extension-accelerate';

const prismaClient = new PrismaClient().$extends(withAccelerate());


const globalForPrisma = globalThis as unknown as {
  prisma?: typeof prismaClient;
};

export const prisma = globalForPrisma.prisma ?? prismaClient;

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma;
