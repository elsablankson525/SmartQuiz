import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { Prisma } from "@prisma/client"

export async function GET(
  request: Request,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await context.params
    
    // Validate category exists
    const category = await prisma.category.findUnique({
      where: { id }
    })
    
    if (!category) {
      return NextResponse.json({ error: "Category not found" }, { status: 404 })
    }

    // Fetch learning resources from LearningResource table for this category
    const learningResources = await prisma.learningResource.findMany({
      where: { category: category.name },
      orderBy: { rating: 'desc' },
      take: 10
    })

    // Format resources for response
    const formattedResources = learningResources.map((resource: Prisma.LearningResourceGetPayload<Record<string, never>>) => ({
      id: resource.id,
      title: resource.title,
      type: resource.type,
      url: resource.url,
      description: resource.description,
      difficulty: resource.difficulty,
      provider: resource.provider,
      rating: resource.rating,
      isFree: resource.isFree,
      certification: resource.certification
    }))

    return NextResponse.json({ 
      success: true,
      resources: formattedResources || [],
      category: category.name,
      categoryId: category.id
    })
  } catch (error) {
    console.error("Error fetching category resources:", error)
    return NextResponse.json({ error: "Failed to fetch resources" }, { status: 500 })
  }
} 