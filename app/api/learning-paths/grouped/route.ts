import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    // Fetch all learning paths
    const paths = await prisma.learningPath.findMany();

    // Group by category and difficulty, collect topics
    const grouped: Record<string, Record<string, Set<string>>> = {};
    for (const path of paths) {
      const category = path.category;
      const difficulty = path.difficulty;
      if (!grouped[category]) grouped[category] = {};
      if (!grouped[category][difficulty]) grouped[category][difficulty] = new Set();
      // Add the category as a topic since milestones don't exist in DB
      grouped[category][difficulty].add(path.category);
    }
    // Convert sets to arrays for JSON serialization
    const result: Record<string, Record<string, string[]>> = {};
    for (const category in grouped) {
      result[category] = {};
      for (const difficulty in grouped[category]) {
        result[category][difficulty] = Array.from(grouped[category][difficulty]);
      }
    }
    return NextResponse.json({ grouped: result });
      } catch {
    return NextResponse.json({ error: "Failed to group learning paths" }, { status: 500 });
  }
} 