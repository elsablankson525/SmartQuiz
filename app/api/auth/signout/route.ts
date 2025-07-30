import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { prisma } from "@/lib/prisma";

export async function POST() {
  try {
    const session = await getServerSession(authOptions);
    
    if (session?.user?.email) {
      // Find and delete the user's session from the database
      await prisma.session.deleteMany({
        where: {
          user: {
            email: session.user.email
          }
        }
      });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error during sign out:", error);
    return NextResponse.json({ error: "Failed to sign out" }, { status: 500 });
  }
} 