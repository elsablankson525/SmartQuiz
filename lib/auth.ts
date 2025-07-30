import { getServerSession } from "next-auth/next"
import { authOptions } from "../app/api/auth/[...nextauth]/route"
import { NextRequest } from "next/server"
import { cookies } from "next/headers"
import * as jwt from "jsonwebtoken"
import { prisma } from "./prisma"

export async function getSession() {
  try {
    // Validate environment variables
    if (!process.env.NEXTAUTH_SECRET) {
      console.error("NEXTAUTH_SECRET is not set");
      return null;
    }
    
    if (!process.env.NEXTAUTH_URL) {
      console.error("NEXTAUTH_URL is not set");
      return null;
    }
    
    const session = await getServerSession(authOptions)
    return session
  } catch (error) {
    console.error("Error getting session:", error);
    return null;
  }
}

export async function getCurrentUser() {
  try {
    const session = await getSession()
    return session?.user
  } catch (error) {
    console.error("Error getting current user:", error);
    return null;
  }
}

export async function getUserFromRequest(_request: NextRequest) {
  try {
    // First try to get user from NextAuth session
    const session = await getSession()
    if (session?.user) {
      return session.user
    }

    // If no NextAuth session, try to get from custom JWT token
    const cookieStore = await cookies()
    const authToken = cookieStore.get('auth-token')?.value

    if (authToken) {
      try {
        const decoded = jwt.verify(authToken, process.env.JWT_SECRET || 'fallback-secret') as Record<string, unknown>
        if (decoded.userId) {
          // Get user from database
          const user = await prisma.user.findUnique({
            where: { id: decoded.userId as string }
          })
          return user
        }
      } catch (jwtError) {
        console.error("JWT verification failed:", jwtError)
      }
    }

    return null
  } catch (error) {
    console.error("Error getting user from request:", error)
    return null
  }
}

export function validateAuthConfig() {
  const requiredEnvVars = ['NEXTAUTH_SECRET', 'NEXTAUTH_URL']
  
  const missingVars = requiredEnvVars.filter((varName: string) => !process.env[varName]);
  
  if (missingVars.length > 0) {
    console.error(`Missing required environment variables: ${missingVars.join(', ')}`);
    return false;
  }
  
  // Validate NEXTAUTH_URL format
  try {
    const url = new URL(process.env.NEXTAUTH_URL!);
    if (!url.protocol || !url.hostname) {
      console.error("Invalid NEXTAUTH_URL format");
      return false;
    }
  } catch (error) {
    console.error("Invalid NEXTAUTH_URL:", error);
    return false;
  }
  
  return true;
} 