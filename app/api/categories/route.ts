import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import type { Prisma } from "@prisma/client"

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url)
    const search = searchParams.get("search")
    const where: Prisma.SubjectWhereInput = {}
    
    if (search && search.trim()) {
      where.OR = [
        { name: { contains: search.trim(), mode: "insensitive" } },
        { description: { contains: search.trim(), mode: "insensitive" } },
      ]
    }
    
    const categories = await prisma.subject.findMany({ 
      where,
      orderBy: { name: 'asc' }
    })
    
    return NextResponse.json({ 
      success: true,
      categories: categories || []
    })
  } catch (error) {
    console.error("Categories error:", error)
    return NextResponse.json({ error: "Failed to fetch categories" }, { status: 500 })
  }
} 