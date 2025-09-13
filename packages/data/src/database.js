"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.db = void 0;
exports.getPrismaClient = getPrismaClient;
const client_1 = require("@prisma/client");
// Singleton PrismaClient instance
let prisma = null;
function getPrismaClient() {
    if (!prisma) {
        prisma = new client_1.PrismaClient({
            datasources: {
                db: {
                    url: process.env.DATABASE_URL || 'file:./dev.db',
                },
            },
        });
    }
    return prisma;
}
// Export the singleton instance
exports.db = getPrismaClient();
