import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url)
    const timeframe = searchParams.get("timeframe")
    const limit = parseInt(searchParams.get("limit") || "0", 10)
    const offset = parseInt(searchParams.get("offset") || "0", 10)

    // Validate parameters
    if (limit < 0 || offset < 0) {
      return NextResponse.json({ error: "Invalid limit or offset parameters" }, { status: 400 })
    }

    // Build query
    const where = timeframe ? { timeframe } : undefined
    const entries = await prisma.leaderboardEntry.findMany({
      where,
      orderBy: [{ rank: "asc" }],
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
            image: true
          }
        }
      }
    })

    // Pagination
    const paginated = limit > 0 ? entries.slice(offset, offset + limit) : entries

    return NextResponse.json({ 
      success: true,
      leaderboard: paginated,
      total: entries.length,
      hasMore: limit > 0 ? offset + limit < entries.length : false
    })
  } catch (error) {
    console.error("Leaderboard error:", error)
    return NextResponse.json({ error: "Failed to fetch leaderboard" }, { status: 500 })
  }
} 