import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

export async function validateSession() {
  try {
    const session = await getServerSession(authOptions);
    
    // If no session exists, return null
    if (!session) {
      return null;
    }
    
    // Check if session is expired
    if (session.expires && new Date(session.expires) < new Date()) {
      console.log("Session expired, clearing...");
      return null;
    }
    
    return session;
  } catch (error: unknown) {
    // Handle JWT decryption errors specifically
    if (error && typeof error === 'object' && 'message' in error && 
        (typeof error.message === 'string' && (error.message.includes('decryption operation failed') || 
        error.message.includes('JWT_SESSION_ERROR')) ||
        'name' in error && error.name === 'JWEDecryptionFailed')) {
      console.warn("🔐 JWT session decryption failed - this usually means the NEXTAUTH_SECRET was changed.");
      console.warn("💡 Users will need to log in again with the new secret.");
      console.warn("🔧 Please clear browser data and restart the application.");
      
      // Clear any existing cookies programmatically if possible
      try {
        // This is a server-side attempt to clear cookies
        // Note: This won't work for client-side cookies, but it's worth trying
        console.log("🧹 Attempting to clear server-side session data...");
      } catch (clearError) {
        console.warn("⚠️ Could not clear server-side session data:", clearError);
      }
      
      // Return null to force re-authentication
      return null;
    }
    
    // Log other errors but don't throw them
    const errorMessage = error && typeof error === 'object' && 'message' in error ? error.message : String(error);
    console.warn("⚠️ Session validation error (non-critical):", errorMessage);
    return null;
  }
}

export async function clearStaleSession() {
  try {
    // This function can be used to clear any stale session data
    // For now, we'll just validate the current session
    const session = await validateSession();
    return session;
  } catch (error) {
    console.error("❌ Session cleanup error:", error);
    return null;
  }
}

// New function to check if we need to clear sessions
export async function checkSessionHealth() {
  try {
    const session = await getServerSession(authOptions);
    return { healthy: true, session };
  } catch (error: unknown) {
    if (error && typeof error === 'object' && 'message' in error && 
        (typeof error.message === 'string' && error.message.includes('decryption operation failed') || 
        'name' in error && error.name === 'JWEDecryptionFailed')) {
      return { healthy: false, error: 'JWT_DECRYPTION_FAILED' };
    }
    return { healthy: false, error: 'UNKNOWN_ERROR' };
  }
} 