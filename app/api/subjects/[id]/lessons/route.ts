import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

export async function GET(
  request: Request,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await context.params
    
    // Validate subject exists
    const subject = await prisma.subject.findUnique({
      where: { id }
    })
    
    if (!subject) {
      return NextResponse.json({ error: "Subject not found" }, { status: 404 })
    }

    // Fetch lessons for this subject
    const lessons = await prisma.lesson.findMany({
      where: { subjectId: id },
      orderBy: { order: 'asc' },
      select: {
        id: true,
        title: true,
        content: true,
        type: true,
        duration: true,
        order: true,
        isFree: true
      }
    })

    return NextResponse.json({ 
      success: true,
      lessons: lessons || []
    })
  } catch (error) {
    console.error("Error fetching lessons:", error)
    return NextResponse.json({ error: "Failed to fetch lessons" }, { status: 500 })
  }
}

export async function POST(
  request: Request,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await context.params
    const body = await request.json()
    const { title, content, type, duration, order } = body

    if (!title || !content || !type) {
      return NextResponse.json({ 
        error: "Title, content, and type are required" 
      }, { status: 400 })
    }

    // Validate subject exists
    const subject = await prisma.subject.findUnique({
      where: { id }
    })
    
    if (!subject) {
      return NextResponse.json({ error: "Subject not found" }, { status: 404 })
    }

    const lesson = await prisma.lesson.create({
      data: {
        subjectId: id,
        title,
        content,
        type,
        duration: duration || "",
        order: order || 0
      }
    })

    return NextResponse.json({ 
      success: true,
      lesson 
    }, { status: 201 })
  } catch (error) {
    console.error("Error creating lesson:", error)
    return NextResponse.json({ error: "Failed to create lesson" }, { status: 500 })
  }
} 