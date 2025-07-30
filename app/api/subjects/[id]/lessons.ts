import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

export async function GET(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id: subjectId } = await params
    const lessons = await prisma.lesson.findMany({
      where: { subjectId },
      orderBy: { order: 'asc' }
    })
    return NextResponse.json({ lessons })
  } catch (error) {
    console.error('Error fetching lessons:', error)
    return NextResponse.json({ error: "Failed to fetch lessons" }, { status: 500 })
  }
} 