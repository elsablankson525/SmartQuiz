import { prisma } from "./prisma";

export async function initializeServer() {
  try {
    // Test database connection
    await prisma.$connect();
    console.log("✅ Database connected successfully");

    // Clear any stale sessions (optional - can be commented out if not needed)
    // await clearStaleSessions();
    
    console.log("✅ Server initialized successfully");
  } catch (error) {
    console.error("❌ Server initialization failed:", error);
    throw error;
  }
}

async function clearStaleSessions() {
  try {
    // Clear expired sessions from database
    const result = await prisma.session.deleteMany({
      where: {
        expires: {
          lt: new Date()
        }
      }
    });
    
    if (result.count > 0) {
      console.log(`🧹 Cleared ${result.count} expired sessions`);
    }
  } catch (error) {
    console.error("Error clearing stale sessions:", error);
  }
}

// Export for use in other files
export { clearStaleSessions }; 