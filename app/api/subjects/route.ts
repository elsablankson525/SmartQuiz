import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url)
    const search = searchParams.get("search")
    const where: any = {}
    
    if (search && search.trim()) {
      where.OR = [
        { id: search.trim() },
        { name: { contains: search.trim(), mode: "insensitive" } },
        { description: { contains: search.trim(), mode: "insensitive" } },
        { topics: { hasSome: [search.trim()] } },
      ]
    }
    
    const subjects = await prisma.subject.findMany({ 
      where,
      orderBy: { name: 'asc' }
    })
    
    return NextResponse.json({ 
      success: true,
      subjects: subjects || []
    })
  } catch (error) {
    console.error("Subjects error:", error)
    return NextResponse.json({ error: "Failed to fetch subjects" }, { status: 500 })
  }
} 