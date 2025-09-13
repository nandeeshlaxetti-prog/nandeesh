import { PrismaClient } from '@prisma/client'

// Singleton PrismaClient instance
let prisma: PrismaClient | null = null

export function getPrismaClient(): PrismaClient {
  if (!prisma) {
    prisma = new PrismaClient({
      datasources: {
        db: {
          url: process.env.DATABASE_URL || 'file:./dev.db',
        },
      },
    })
  }
  return prisma
}

// Export the singleton instance
export const db = getPrismaClient()

// Export PrismaClient type for type safety
export type { PrismaClient } from '@prisma/client'
