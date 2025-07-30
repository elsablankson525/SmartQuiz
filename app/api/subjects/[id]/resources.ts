import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

export async function GET(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id: subjectId } = await params
    const resources = await prisma.resource.findMany({
      where: { subjectId },
      orderBy: { id: 'desc' }
    })
    return NextResponse.json({ resources })
  } catch (error) {
    console.error('Error fetching resources:', error)
    return NextResponse.json({ error: "Failed to fetch resources" }, { status: 500 })
  }
} 