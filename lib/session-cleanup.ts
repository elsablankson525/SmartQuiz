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
      return null;
    }
    
    return session;
  } catch (error) {
    console.error("Session validation error:", error);
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
    console.error("Session cleanup error:", error);
    return null;
  }
} 