import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

export async function GET(
  request: Request,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await context.params
    const { searchParams } = new URL(request.url)
    const userId = searchParams.get("userId")
    
    if (!userId) {
      return NextResponse.json({ error: "userId parameter is required" }, { status: 400 })
    }

    // Validate subject exists
    const subject = await prisma.subject.findUnique({
      where: { id }
    })
    
    if (!subject) {
      return NextResponse.json({ error: "Subject not found" }, { status: 404 })
    }

    // Find user by email
    const user = await prisma.user.findUnique({
      where: { email: userId }
    })
    
    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 })
    }

    // Get user's lesson progress for this subject
    const progress = await prisma.userLessonProgress.findMany({
      where: { 
        userId: user.id,
        subjectId: id
      },
      include: {
        lesson: {
          select: {
            id: true,
            title: true,
            type: true,
            order: true
          }
        }
      },
      orderBy: {
        completedAt: 'desc'
      }
    })

    const completedLessonIds = progress.map(p => p.lesson.id)

    return NextResponse.json({ 
      success: true,
      completedLessonIds,
      totalLessons: progress.length,
      progress: progress
    })
  } catch (error) {
    console.error("Error fetching progress:", error)
    return NextResponse.json({ error: "Failed to fetch progress" }, { status: 500 })
  }
}

export async function POST(
  request: Request,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await context.params
    const body = await request.json()
    const { lessonId, userId } = body

    if (!lessonId || !userId) {
      return NextResponse.json({ 
        error: "lessonId and userId are required" 
      }, { status: 400 })
    }

    // Validate subject exists
    const subject = await prisma.subject.findUnique({
      where: { id }
    })
    
    if (!subject) {
      return NextResponse.json({ error: "Subject not found" }, { status: 404 })
    }

    // Find user by email
    const user = await prisma.user.findUnique({
      where: { email: userId }
    })
    
    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 })
    }

    // Validate lesson exists and belongs to this subject
    const lesson = await prisma.lesson.findFirst({
      where: { 
        id: lessonId,
        subjectId: id
      }
    })
    
    if (!lesson) {
      return NextResponse.json({ error: "Lesson not found" }, { status: 404 })
    }

    // Mark lesson as completed (upsert to avoid duplicates)
    const progress = await prisma.userLessonProgress.upsert({
      where: {
        userId_lessonId: {
          userId: user.id,
          lessonId: lessonId
        }
      },
      update: {
        completedAt: new Date()
      },
      create: {
        userId: user.id,
        subjectId: id,
        lessonId: lessonId,
        completedAt: new Date()
      }
    })

    return NextResponse.json({ 
      success: true,
      progress 
    })
  } catch (error) {
    console.error("Error updating progress:", error)
    return NextResponse.json({ error: "Failed to update progress" }, { status: 500 })
  }
} 