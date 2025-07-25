import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url)
    const timeframe = searchParams.get("timeframe")
    const limit = parseInt(searchParams.get("limit") || "0", 10)
    const offset = parseInt(searchParams.get("offset") || "0", 10)

    // Build query
    const where = timeframe ? { timeframe } : undefined
    const entries = await prisma.leaderboardEntry.findMany({
      where,
      orderBy: [{ rank: "asc" }],
    })

    // Pagination
    const paginated = limit > 0 ? entries.slice(offset, offset + limit) : entries

    return NextResponse.json({ leaderboard: paginated })
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch leaderboard" }, { status: 500 })
  }
} 