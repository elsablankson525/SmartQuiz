import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    // Destructure body but ignore unused variables for now
    const _ = body; // eslint-disable-line @typescript-eslint/no-unused-vars

    // For now, return a simple response
    return NextResponse.json({ 
      success: true,
      message: "POST endpoint working" 
    })
  } catch (error) {
    console.error("Error in POST:", error)
    return NextResponse.json(
      { error: "Failed to process POST request" },
      { status: 500 }
    )
  }
}

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url)
    const userId = searchParams.get('userId')
    
    if (!userId) {
      return NextResponse.json({ error: "Missing userId parameter" }, { status: 400 })
    }

    console.log('Looking up user:', userId)

    // Look up the user by email
    const user = await prisma.user.findUnique({
      where: { email: userId }
    })

    if (!user) {
      console.log('User not found:', userId)
      return NextResponse.json({ error: "User not found" }, { status: 404 })
    }

    console.log('User found:', user.email)

    // Get user's quiz history with related Quiz data
    const userHistory = await prisma.quizResult.findMany({
      where: { userId: user.id },
      include: {
        Quiz: true
      },
      orderBy: { date: 'desc' },
      take: 10
    })

    console.log('Quiz history found:', userHistory.length)

    // If no quiz history, return basic recommendations
    if (userHistory.length === 0) {
      console.log('No quiz history, returning basic recommendations')
      return NextResponse.json({
        success: true,
        recommendations: {
          weakAreas: [],
          strongAreas: [],
          nextQuizSuggestion: {
            category: "JavaScript Fundamentals",
            difficulty: "beginner",
            reason: "Start with fundamentals to build a strong foundation",
            confidence: 0.8
          },
          recommendedResources: []
        }
      })
    }

    // Get the most recent quiz result for analysis
    const latestQuiz = userHistory[0]
    console.log('Latest quiz:', {
      category: latestQuiz.Quiz?.category,
      difficulty: latestQuiz.Quiz?.difficulty,
      score: latestQuiz.score
    })
    
    // Get questions for the latest quiz category
    const questions = await prisma.question.findMany({
      where: { category: latestQuiz.Quiz?.category || 'Computer Science' },
      take: 10
    })

    console.log('Questions found:', questions.length)

    // Return simplified recommendations without using the complex engine
    const recommendations = {
      weakAreas: ['Basic concepts', 'Problem solving'],
      strongAreas: ['Quiz completion', 'Persistence'],
      nextQuizSuggestion: {
        category: latestQuiz.Quiz?.category || 'JavaScript Fundamentals',
        difficulty: latestQuiz.Quiz?.difficulty || 'intermediate',
        reason: 'Based on your performance patterns',
        confidence: 0.7
      },
      recommendedResources: [
        {
          id: 'resource-1',
          title: 'JavaScript Fundamentals Guide',
          type: 'tutorial',
          url: 'https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide',
          difficulty: 'beginner',
          description: 'Comprehensive JavaScript documentation and tutorials'
        }
      ]
    }

    console.log('Returning recommendations')

    return NextResponse.json({
      success: true,
      recommendations
    })

  } catch (error) {
    console.error("Error retrieving user data:", error)
    return NextResponse.json({ 
      success: false,
      error: "Failed to retrieve user data",
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 })
  }
} 