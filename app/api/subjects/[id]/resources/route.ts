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

    // Fetch resources for this subject
    const resources = await prisma.resource.findMany({
      where: { subjectId: id },
      select: {
        id: true,
        title: true,
        type: true,
        url: true,
        description: true
      }
    })

    return NextResponse.json({ 
      success: true,
      resources: resources || []
    })
  } catch (error) {
    console.error("Error fetching resources:", error)
    return NextResponse.json({ error: "Failed to fetch resources" }, { status: 500 })
  }
}

export async function POST(
  request: Request,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await context.params
    const body = await request.json()
    const { title, type, url, description } = body

    if (!title || !type || !url) {
      return NextResponse.json({ 
        error: "Title, type, and url are required" 
      }, { status: 400 })
    }

    // Validate subject exists
    const subject = await prisma.subject.findUnique({
      where: { id }
    })
    
    if (!subject) {
      return NextResponse.json({ error: "Subject not found" }, { status: 404 })
    }

    const resource = await prisma.resource.create({
      data: {
        subjectId: id,
        title,
        type,
        url,
        description: description || ""
      }
    })

    return NextResponse.json({ 
      success: true,
      resource 
    }, { status: 201 })
  } catch (error) {
    console.error("Error creating resource:", error)
    return NextResponse.json({ error: "Failed to create resource" }, { status: 500 })
  }
} 