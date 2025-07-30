import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const difficulties = await prisma.learningPath.findMany({
      select: { difficulty: true },
      distinct: ["difficulty"],
    });
    const uniqueDifficulties = difficulties.map((d) => d.difficulty).filter(Boolean);
    return NextResponse.json({ difficulties: uniqueDifficulties });
      } catch {
    return NextResponse.json({ error: "Failed to fetch difficulties" }, { status: 500 });
  }
} 