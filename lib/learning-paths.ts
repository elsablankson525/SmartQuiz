import type { LearningResource } from "./learning-resources"
import type { QuizResult } from "./types"
import { prisma } from "@/lib/prisma"

export interface LearningPath {
  id: string
  title: string
  description: string
  category: string
  difficulty: "beginner" | "intermediate" | "advanced"
  estimatedDuration: string
  prerequisites: string[]
  milestones: Milestone[]
  resources: LearningResource[]
  progress: number
  isActive: boolean
  createdAt: Date
  updatedAt: Date
}

export interface Milestone {
  id: string
  title: string
  description: string
  requiredScore: number
  quizTopics: string[]
  resources: string[] // Resource IDs
  isCompleted: boolean
  completedAt?: Date
}

export interface PathRecommendation {
  path: LearningPath
  reason: string
  matchScore: number
}

// Remove learningPaths and replace with DB fetch
export async function getLearningPaths() {
  return await prisma.learningPath.findMany({ include: { milestones: true } })
}

export async function recommendLearningPaths(
  userHistory: QuizResult[],
  userPreferences?: { categories: string[]; difficulty: string },
): Promise<PathRecommendation[]> {
  const recommendations: PathRecommendation[] = []
  const categoryPerformance = new Map<string, { averageScore: number; count: number }>()
  userHistory.forEach((quiz) => {
    const current = categoryPerformance.get(quiz.category) || { averageScore: 0, count: 0 }
    const newAverage =
      (current.averageScore * current.count + (quiz.score / quiz.totalQuestions) * 100) / (current.count + 1)
    categoryPerformance.set(quiz.category, {
      averageScore: newAverage,
      count: current.count + 1,
    })
  })
  const learningPaths = await getLearningPaths()
  learningPaths.forEach((path: any) => {
    let matchScore = 0
    let reason = ""
    const categoryPerf = categoryPerformance.get(path.category)
    if (categoryPerf) {
      matchScore += 30
      if (categoryPerf.averageScore < 70) {
        matchScore += 20
        reason = `You could benefit from structured learning in ${path.category}`
      } else {
        reason = `Build on your ${path.category} knowledge with advanced concepts`
      }
    } else if (userPreferences?.categories.includes(path.category)) {
      matchScore += 25
      reason = `Matches your interest in ${path.category}`
    }
    if (userPreferences?.difficulty === path.difficulty) {
      matchScore += 15
    }
    if (path.prerequisites.length === 0 && userHistory.length < 5) {
      matchScore += 10
      reason += " - Perfect for beginners"
    }
    if (matchScore > 20) {
      recommendations.push({
        path,
        reason,
        matchScore,
      })
    }
  })
  return recommendations.sort((a, b) => b.matchScore - a.matchScore).slice(0, 3)
}

export async function updatePathProgress(pathId: string, quizResults: QuizResult[]): Promise<LearningPath | null> {
  const learningPaths = await getLearningPaths()
  const path = learningPaths.find((p: any) => p.id === pathId)
  if (!path) return null
  let completedMilestones = 0
  path.milestones.forEach((milestone: any) => {
    if (!milestone.isCompleted) {
      const relevantQuizzes = quizResults.filter((quiz) =>
        milestone.quizTopics.some((topic: string) => quiz.category.includes(topic)),
      )
      if (relevantQuizzes.length > 0) {
        const averageScore =
          relevantQuizzes.reduce((sum, quiz) => sum + (quiz.score / quiz.totalQuestions) * 100, 0) /
          relevantQuizzes.length
        if (averageScore >= milestone.requiredScore) {
          milestone.isCompleted = true
          milestone.completedAt = new Date()
        }
      }
    }
    if (milestone.isCompleted) {
      completedMilestones++
    }
  })
  const progress = (completedMilestones / path.milestones.length) * 100
  const estimatedDuration = path.duration || ""
  const prerequisites = path.skills || []
  // Import getResourcesByCategory at the top if not already
  // import { getResourcesByCategory } from "./learning-resources"
  const { getResourcesByCategory } = await import("./learning-resources")
  const resources = getResourcesByCategory(path.category)
  const isActive = true // Or set based on your logic or DB field
  return {
    id: path.id,
    title: path.title,
    description: path.description,
    category: path.category,
    difficulty: path.difficulty as "beginner" | "intermediate" | "advanced",
    estimatedDuration,
    prerequisites,
    milestones: path.milestones.map((m: any) => ({
      ...m,
      completedAt: m.completedAt === null ? undefined : m.completedAt,
    })),
    resources,
    progress,
    isActive,
    createdAt: path.createdAt,
    updatedAt: new Date(),
  }
}
