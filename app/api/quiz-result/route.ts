import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

export async function POST(req: Request) {
  try {
    const body = await req.json()
    const { userId, category, difficulty, score, totalQuestions, timeSpent, date, questionsAnswered } = body
    if (!userId || !category || !difficulty || score == null || !totalQuestions || timeSpent == null || !date) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }
    const result = await prisma.quizResult.create({
      data: {
        userId,
        category,
        difficulty,
        score,
        totalQuestions,
        timeSpent,
        date: new Date(date),
        questionsAnswered: questionsAnswered ? JSON.stringify(questionsAnswered) : undefined,
      },
    })
    return NextResponse.json({ success: true, result })
  } catch (error) {
    return NextResponse.json({ error: "Failed to save quiz result" }, { status: 500 })
  }
} 