import { prisma } from "../lib/prisma";

export const connecteDB = async () => {
    try {
       await prisma.$connect();
       console.log('Connected to database');
    } catch (error) {
       await prisma.$disconnect();
       console.error('Error connecting to database:', error);
       process.exit(1);
    }
}