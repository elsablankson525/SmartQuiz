import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "../[...nextauth]/route";

export async function POST(_request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (session) {
      // Clear any server-side session data if needed
      // For now, NextAuth handles this automatically
    }
    
    // Return success response
    return NextResponse.json({ 
      success: true, 
      message: "Session cleared successfully" 
    });
  } catch (error) {
    console.error("Signout error:", error);
    return NextResponse.json(
      { success: false, message: "Error clearing session" },
      { status: 500 }
    );
  }
} 