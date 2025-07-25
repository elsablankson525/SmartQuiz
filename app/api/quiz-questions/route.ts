import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url)
    const category = searchParams.get("category")
    const difficulty = searchParams.get("difficulty")
    const count = parseInt(searchParams.get("count") || "10", 10)
    const random = searchParams.get("random") === "true"

    const where: any = {}
    if (category) where.category = category
    if (difficulty) where.difficulty = difficulty

    let questions = await prisma.quizQuestion.findMany({ where })

    // Shuffle if random=true
    if (random) {
      for (let i = questions.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1))
        ;[questions[i], questions[j]] = [questions[j], questions[i]]
      }
    }
    questions = questions.slice(0, count)

    // Format response
    const result = questions.map((q: any) => ({
      id: q.id,
      question: q.question,
      options: q.options,
      difficulty: q.difficulty,
      topic: q.topic,
      explanation: q.explanation,
      relatedConcepts: q.relatedConcepts,
      // correctAnswer: q.correctAnswer, // Optionally omit for security
    }))

    return NextResponse.json({ questions: result })
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch quiz questions" }, { status: 500 })
  }
} 