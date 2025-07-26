import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { unifiedRecommendationEngine } from "@/lib/unified-recommendation-engine"

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { currentQuizResult, questions, userQuizHistory } = body

    // Generate recommendations using the unified engine
    const recommendations = await unifiedRecommendationEngine.generatePersonalizedRecommendations(
      currentQuizResult,
      questions,
      userQuizHistory
    )

    return NextResponse.json({ recommendations })
  } catch (error) {
    console.error("Error generating recommendations:", error)
    return NextResponse.json(
      { error: "Failed to generate recommendations" },
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

    // Look up the user by email
    const user = await prisma.user.findUnique({
      where: { email: userId }
    })

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 })
    }

    // Get user's quiz history
    const userHistory = await prisma.quizResult.findMany({
      where: { userId: user.id },
      orderBy: { date: 'desc' },
      take: 10
    })

    // Convert database results to QuizResult format
    const formattedHistory = userHistory.map(result => ({
      id: result.id,
      userId: result.userId,
      category: result.category,
      difficulty: result.difficulty,
      score: result.score,
      totalQuestions: result.totalQuestions,
      timeSpent: result.timeSpent,
      date: result.date,
      questionsAnswered: result.questionsAnswered ? JSON.parse(result.questionsAnswered as string) : undefined
    }))

    // Analyze performance trends using unified engine
    const performanceAnalysis = unifiedRecommendationEngine.analyzeProgressTrend(formattedHistory)

    return NextResponse.json({
      success: true,
      userHistory: userHistory.length,
      performanceAnalysis,
      recentQuizzes: userHistory.slice(0, 5).map(result => ({
        category: result.category,
        difficulty: result.difficulty,
        score: result.score,
        totalQuestions: result.totalQuestions,
        date: result.date
      }))
    })

  } catch (error) {
    console.error("Error retrieving user data:", error)
    return NextResponse.json({ error: "Failed to retrieve user data" }, { status: 500 })
  }
} 