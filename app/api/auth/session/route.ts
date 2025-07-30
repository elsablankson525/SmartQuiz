import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.email) {
      console.log("Session API: No active session found");
      return NextResponse.json({ error: "No active session" }, { status: 401 });
    }

    console.log("Session API: Found session for user:", session.user.email);

    // For JWT strategy, we don't need to check the database
    // The session is already validated by NextAuth
    return NextResponse.json({
      success: true,
      session: {
        user: {
          id: session.user.id,
          name: session.user.name,
          email: session.user.email,
          image: session.user.image
        },
        expires: new Date(Date.now() + 60 * 60 * 1000) // 1 hour from now
      }
    });

  } catch (error) {
    console.error("Error in session API:", error);
    return NextResponse.json({ 
      success: false, 
      error: "Failed to get session" 
    }, { status: 500 });
  }
}

export async function PUT(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    const { rememberMe } = await request.json();
    
    if (!session?.user?.email) {
      return NextResponse.json({ error: "No active session" }, { status: 401 });
    }

    // For JWT strategy, we can't easily extend the session duration
    // The session duration is controlled by the JWT token expiration
    console.log("Session API: Session extension requested for user:", session.user.email);
    console.log("Session API: Remember me:", rememberMe);

    return NextResponse.json({
      success: true,
      message: "Session extension not supported with JWT strategy"
    });

  } catch (error) {
    console.error("Error updating session:", error);
    return NextResponse.json({ 
      success: false, 
      error: "Failed to update session" 
    }, { status: 500 });
  }
} 