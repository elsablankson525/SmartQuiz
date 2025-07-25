import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url)
    const search = searchParams.get("search")
    const where: any = {}
    if (search) {
      where.OR = [
        { id: search },
        { name: { contains: search, mode: "insensitive" } },
        { description: { contains: search, mode: "insensitive" } },
        { topics: { hasSome: [search] } },
      ]
    }
    const subjects = await prisma.subject.findMany({ where })
    return NextResponse.json({ subjects })
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch subjects" }, { status: 500 })
  }
} 