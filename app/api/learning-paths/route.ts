import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { Prisma } from "@prisma/client"

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url)
    const category = searchParams.get("category")
    const difficulty = searchParams.get("difficulty")
    const search = searchParams.get("search")
    const userId = searchParams.get("userId")

    // Build query
    const where: Prisma.LearningPathWhereInput = {}
    if (category && category !== "All") where.category = category
    if (difficulty && difficulty !== "All") where.difficulty = difficulty
    if (search) {
      where.OR = [
        { title: { contains: search, mode: "insensitive" } },
        { description: { contains: search, mode: "insensitive" } },
        { skills: { hasSome: [search] } },
      ]
    }

    const paths = await prisma.learningPath.findMany({ where })

    // Fetch milestones for each path
    const pathIds = paths.map((p) => p.id)
    const allMilestones = await prisma.milestone.findMany({ where: { learningPathId: { in: pathIds } } })
    // Group milestones by pathId
    const milestonesByPath: Record<string, Prisma.MilestoneGetPayload<Record<string, never>>[]> = {}
    allMilestones.forEach(m => {
      if (!milestonesByPath[m.learningPathId]) milestonesByPath[m.learningPathId] = []
      milestonesByPath[m.learningPathId].push(m)
    })

    // If userId is provided, fetch user quiz results for progress tracking
    let userQuizResults: Prisma.QuizResultGetPayload<Record<string, never>>[] = []
    if (userId) {
      // Find user by email first
      const user = await prisma.user.findUnique({ where: { email: userId } })
      if (user) {
        userQuizResults = await prisma.quizResult.findMany({ where: { userId: user.id } })
      }
    }

    // Format response with milestones and progress
    const result = paths.map(path => {
      const milestones = (milestonesByPath[path.id] || []).map(milestone => {
        // Calculate completion for this milestone
        let isCompleted = false
        let completedAt = null
        if (userQuizResults.length && milestone.quizTopics.length) {
          // Find all quiz results matching any topic in milestone.quizTopics
          const relevantQuizzes = userQuizResults.filter(qr =>
            milestone.quizTopics.some((topic: string) => qr.category.includes(topic))
          )
          if (relevantQuizzes.length) {
            const avgScore = relevantQuizzes.reduce((sum, qr) => sum + (qr.score / qr.totalQuestions) * 100, 0) / relevantQuizzes.length
            if (avgScore >= milestone.requiredScore) {
              isCompleted = true
              completedAt = relevantQuizzes[0].date
            }
          }
        }
        return { ...milestone, isCompleted, completedAt }
      })
      const completedCount = milestones.filter(m => m.isCompleted).length
      const progress = milestones.length ? Math.round((completedCount / milestones.length) * 100) : 0
      return {
        ...path,
        milestones,
        progress,
      }
    })

    return NextResponse.json({ learningPaths: result })
  } catch {
    return NextResponse.json({ error: "Failed to fetch learning paths" }, { status: 500 })
  }
}

// New endpoint to get unique difficulties
export async function GET_DIFFICULTIES() {
  try {
    const difficulties = await prisma.learningPath.findMany({
      select: { difficulty: true },
      distinct: ['difficulty'],
    });
    const uniqueDifficulties = difficulties.map(d => d.difficulty).filter(Boolean);
    return NextResponse.json({ difficulties: uniqueDifficulties });
  } catch {
    return NextResponse.json({ error: "Failed to fetch difficulties" }, { status: 500 });
  }
} 