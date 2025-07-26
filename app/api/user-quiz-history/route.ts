import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url)
    const userId = searchParams.get("userId")
    
    if (!userId || !userId.trim()) {
      return NextResponse.json({ error: "Missing or invalid userId" }, { status: 400 })
    }

    // Look up the user by email (since frontend sends email as userId)
    const user = await prisma.user.findUnique({
      where: { email: userId.trim() }
    })

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 })
    }

    // Fetch all quiz results for the user
    const quizResults = await prisma.quizResult.findMany({
      where: { userId: user.id },
      orderBy: { date: 'desc' },
      select: {
        id: true,
        category: true,
        difficulty: true,
        score: true,
        totalQuestions: true,
        timeSpent: true,
        date: true,
        questionsAnswered: true,
      }
    })

    // Parse questionsAnswered JSON if it exists
    const formattedResults = quizResults.map(result => ({
      ...result,
      questionsAnswered: result.questionsAnswered 
        ? (typeof result.questionsAnswered === 'string' 
            ? JSON.parse(result.questionsAnswered) 
            : result.questionsAnswered)
        : []
    }))

    return NextResponse.json({ 
      success: true, 
      quizHistory: formattedResults 
    })
  } catch (error) {
    console.error("Error fetching user quiz history:", error)
    return NextResponse.json({ error: "Failed to fetch quiz history" }, { status: 500 })
  }
} 