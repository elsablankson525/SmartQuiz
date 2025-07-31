import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { Prisma } from "@prisma/client"

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url)
    const category = searchParams.get("category")
    const topic = searchParams.get("topic")
    const difficulty = searchParams.get("difficulty")
    const count = parseInt(searchParams.get("count") || "10", 10)
    const random = searchParams.get("random") === "true"

    // Validate count parameter
    if (count <= 0 || count > 50) {
      return NextResponse.json({ 
        error: "Count must be between 1 and 50" 
      }, { status: 400 })
    }

    const where: Prisma.QuizQuestionWhereInput = {}
    
    // Handle category filtering
    if (category && category.trim()) {
      console.log("Filtering by category:", category);
      where.category = category.trim()
    }
    
    // Handle topic filtering
    if (topic && topic.trim()) {
      where.topic = topic.trim()
    }
    
    // Handle difficulty filtering
    if (difficulty && difficulty.trim()) {
      where.difficulty = difficulty.trim()
    }

    let questions = await prisma.quizQuestion.findMany({ 
      where
    })
    
    console.log("Found questions:", questions.length);
    console.log("Where clause:", JSON.stringify(where, null, 2));

    // Shuffle if random=true
    if (random) {
      for (let i = questions.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1))
        ;[questions[i], questions[j]] = [questions[j], questions[i]]
      }
    }
    
    // Limit to requested count
    questions = questions.slice(0, count)

    // Format response
    const result = questions.map((q) => ({
      id: q.id,
      question: q.question,
      options: q.options,
      correctAnswer: q.correctAnswer, // Include correct answer for validation
      difficulty: q.difficulty,
      topic: q.topic,
      explanation: q.explanation,
      relatedConcepts: q.relatedConcepts,
      category: q.category, // Include category name in response
    }))

    return NextResponse.json({ 
      success: true,
      questions: result,
      total: result.length
    })
  } catch (error) {
    console.error("Error fetching quiz questions:", error)
    return NextResponse.json({ error: "Failed to fetch quiz questions" }, { status: 500 })
  }
} 