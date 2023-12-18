import { PrismaClient } from '@prisma/client';

declare global {
  var prisma: PrismaClient | undefined;
}

export const db = globalThis.prisma || new PrismaClient();

if (!globalThis.prisma) {
  globalThis.prisma = db;
}
// if (process.env.NODE_ENV !== 'production') globalThis.prisma = prisma;
