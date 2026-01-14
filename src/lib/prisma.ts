import { PrismaClient } from "@prisma/client";

/**
 * Prisma Client instance for database interaction.
 * Uses a singleton pattern to prevent multiple instances in development.
 */

declare global {
  var prisma: PrismaClient | undefined;
}

let prisma: PrismaClient;

if (process.env.NODE_ENV === "production") {
  prisma = new PrismaClient();
} else {
  if (!global.prisma) {
    global.prisma = new PrismaClient();
  }
  prisma = global.prisma;
}

export default prisma;
