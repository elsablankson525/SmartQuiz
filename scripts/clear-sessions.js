import { PrismaClient } from '@prisma/client';
import { config } from 'dotenv';
import path from 'path';

// Load environment variables from .env.local
config({ path: path.resolve(process.cwd(), '.env.local') });

const prisma = new PrismaClient();

async function clearAllSessions() {
  try {
    console.log('Clearing all sessions...');
    
    // Clear all sessions from the database
    const result = await prisma.session.deleteMany({});
    
    console.log(`Cleared ${result.count} sessions from database`);
    console.log('All users will need to log in again');
    
  } catch (error) {
    console.error('Error clearing sessions:', error);
  } finally {
    await prisma.$disconnect();
  }
}

clearAllSessions(); 