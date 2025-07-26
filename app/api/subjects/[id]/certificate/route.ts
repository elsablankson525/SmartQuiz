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

    // Get user's certificate for this subject
    const certificate = await prisma.userCertificate.findUnique({
      where: {
        userId_subjectId: {
          userId: user.id,
          subjectId: id
        }
      }
    })

    return NextResponse.json({ 
      success: true,
      certificate: certificate || null
    })
  } catch (error) {
    console.error("Error fetching certificate:", error)
    return NextResponse.json({ error: "Failed to fetch certificate" }, { status: 500 })
  }
}

export async function POST(
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

    // Check if all lessons are completed
    const totalLessons = await prisma.lesson.count({
      where: { subjectId: id }
    })

    const completedLessons = await prisma.userLessonProgress.count({
      where: { 
        userId: user.id,
        subjectId: id
      }
    })

    if (completedLessons < totalLessons) {
      return NextResponse.json({ 
        error: "All lessons must be completed before issuing certificate",
        completed: completedLessons,
        total: totalLessons
      }, { status: 400 })
    }

    // Check if certificate already exists
    const existingCertificate = await prisma.userCertificate.findUnique({
      where: {
        userId_subjectId: {
          userId: user.id,
          subjectId: id
        }
      }
    })

    if (existingCertificate) {
      return NextResponse.json({ 
        success: true,
        certificate: existingCertificate,
        message: "Certificate already exists"
      })
    }

    // Create certificate
    const certificate = await prisma.userCertificate.create({
      data: {
        userId: user.id,
        subjectId: id,
        issuedAt: new Date(),
        certificateUrl: `/certificates/${user.id}/${id}.pdf` // Placeholder URL
      }
    })

    return NextResponse.json({ 
      success: true,
      certificate,
      message: "Certificate issued successfully"
    }, { status: 201 })
  } catch (error) {
    console.error("Error creating certificate:", error)
    return NextResponse.json({ error: "Failed to create certificate" }, { status: 500 })
  }
} 