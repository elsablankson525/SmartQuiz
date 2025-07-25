import type { QuizResult, Question } from "./types"
import { RuleBasedEngine } from "./rule-based-engine"
import { prisma } from "@/lib/prisma"
import { recommendLearningPaths } from "./learning-paths"
import type { StudyPlanItem } from "./rule-based-engine"

export interface LearningResource {
  id: string
  title: string
  type: "video" | "article" | "practice" | "tutorial" | "course" | "book" | "interactive" | "podcast"
  url: string
  difficulty: "beginner" | "intermediate" | "advanced"
  category: string
  topic: string
  description: string
  duration?: string
  readTime?: string
  provider: string
  rating: number
  tags: string[]
  prerequisites?: string[]
  language: string
  isFree: boolean
  certification?: boolean
}

export interface PersonalizedRecommendation {
  weakAreas: string[]
  strongAreas: string[]
  recommendedResources: LearningResource[]
  nextQuizSuggestion: {
    category: string
    difficulty: string
    reason: string
  }
  pathRecommendations?: { path: any; reason: string; matchScore: number }[]
  studyPlan?: StudyPlanItem[]
}

// Replace LearningResource interface with the one from lib/learning-resources.ts
export async function getLearningResources(category: string): Promise<LearningResource[]> {
  // Fetch from DB
  const dbResources = await prisma.learningResource.findMany({ where: { category } })
  // Map DB results to LearningResource interface
  return dbResources.map((r: any) => ({
    id: r.id,
    title: r.title,
    type: ([
      "video",
      "article",
      "practice",
      "tutorial",
      "course",
      "book",
      "interactive",
      "podcast",
    ].includes(r.type)
      ? r.type
      : "article") as LearningResource["type"],
    url: r.url,
    difficulty:
      r.difficulty === "beginner" || r.difficulty === "intermediate" || r.difficulty === "advanced"
        ? r.difficulty
        : "beginner",
    category: r.category || category,
    topic: r.topic || "general",
    description: r.description || "",
    duration: r.duration || undefined,
    readTime: r.readTime || undefined,
    provider: r.provider || "Unknown",
    rating: typeof r.rating === "number" ? r.rating : 0,
    tags: Array.isArray(r.tags) ? r.tags : [],
    prerequisites: Array.isArray(r.prerequisites) ? r.prerequisites : [],
    language: r.language || "English",
    isFree: typeof r.isFree === "boolean" ? r.isFree : true,
    certification: typeof r.certification === "boolean" ? r.certification : false,
  }))
}

// Update the generatePersonalizedRecommendations function
export async function generatePersonalizedRecommendations(
  quizResult: QuizResult,
  questions: Question[],
  userHistory?: QuizResult[],
  learnerType: 'slow' | 'inBetween' | 'fast' = 'inBetween',
): Promise<PersonalizedRecommendation> {
  // Helper to infer topic from quizResult
  function inferTopicFromQuizResult(qr: QuizResult): string {
    // Find most common topic in questionsAnswered
    if (qr.questionsAnswered && qr.questionsAnswered.length > 0) {
      const topicCounts: Record<string, number> = {}
      for (const q of qr.questionsAnswered) {
        if (q.topic) {
          topicCounts[q.topic] = (topicCounts[q.topic] || 0) + 1
        }
      }
      const sorted = Object.entries(topicCounts).sort((a, b) => b[1] - a[1])
      if (sorted.length > 0) return sorted[0][0]
    }
    // Fallback to category
    return qr.category
  }
  try {
    // Try AI-powered recommendations first
    const aiRecommendations = await generateAIRecommendations(quizResult, questions, userHistory)
    // Add learning path recommendations
    const pathRecs = await recommendLearningPaths(userHistory || [quizResult], { categories: [quizResult.category], difficulty: quizResult.difficulty })
    // Add study plan using new logic
    const topic = inferTopicFromQuizResult(quizResult)
    const studyPlan: StudyPlanItem[] = RuleBasedEngine.getStudyPlanForSubjectAndLearnerType(topic, learnerType)
    return {
      ...aiRecommendations,
      pathRecommendations: pathRecs,
      studyPlan,
    }
  } catch (error) {
    console.error("AI recommendations failed, falling back to rule-based system:", error)

    // Fallback to rule-based system
    const history = userHistory || [quizResult]
    const ruleBasedRecs = await RuleBasedEngine.generateRecommendations(history, quizResult.category)
    // Add learning path recommendations
    const pathRecs = await recommendLearningPaths(history, { categories: [quizResult.category], difficulty: quizResult.difficulty })
    // Add study plan using new logic
    const topic = inferTopicFromQuizResult(quizResult)
    const studyPlan: StudyPlanItem[] = RuleBasedEngine.getStudyPlanForSubjectAndLearnerType(topic, learnerType)
    return {
      weakAreas: inferWeakAreas(quizResult),
      strongAreas: inferStrongAreas(quizResult),
      recommendedResources: ruleBasedRecs.resources
        .filter((r: any) => ["video", "article", "practice", "tutorial", "course", "book", "interactive", "podcast"].includes(r.type))
        .map((r: any) => ({
          id: r.id,
          title: r.title,
          type: r.type,
          url: r.url,
          difficulty: r.difficulty,
          category: r.category,
          topic: r.topic,
          description: r.description,
          duration: r.duration,
          readTime: r.readTime,
          provider: r.provider,
          rating: r.rating,
          tags: r.tags,
          prerequisites: r.prerequisites,
          language: r.language,
          isFree: r.isFree,
          certification: r.certification,
        })),
      nextQuizSuggestion: ruleBasedRecs.nextQuizSuggestion,
      pathRecommendations: pathRecs,
      studyPlan,
    }
  }
}

// Original AI recommendation logic (renamed)
async function generateAIRecommendations(
  quizResult: QuizResult,
  questions: Question[],
  userHistory?: QuizResult[],
): Promise<PersonalizedRecommendation> {
  const { category, difficulty, score, totalQuestions } = quizResult
  const percentage = (score / totalQuestions) * 100

  // ... existing AI recommendation logic ...

  // Your existing implementation here
  const weakAreas: string[] = []
  const strongAreas: string[] = []

  if (percentage < 50) {
    weakAreas.push("fundamentals", "basic concepts")
  } else if (percentage < 70) {
    weakAreas.push("intermediate concepts")
    strongAreas.push("fundamentals")
  } else if (percentage < 90) {
    weakAreas.push("advanced concepts")
    strongAreas.push("fundamentals", "intermediate concepts")
  } else {
    strongAreas.push("fundamentals", "intermediate concepts", "advanced concepts")
  }

  const categoryResources = await getLearningResources(category)
  let recommendedResources: LearningResource[] = []

  if (percentage < 60) {
    recommendedResources = categoryResources.filter((r) => r.difficulty === "beginner").slice(0, 3)
  } else if (percentage < 80) {
    recommendedResources = [
      ...categoryResources.filter((r) => r.difficulty === "beginner").slice(0, 1),
      ...categoryResources.filter((r) => r.difficulty === "intermediate").slice(0, 2),
    ]
  } else {
    recommendedResources = categoryResources
      .filter((r) => r.difficulty === "advanced" || r.difficulty === "intermediate")
      .slice(0, 3)
  }

  let nextQuizSuggestion: PersonalizedRecommendation["nextQuizSuggestion"]

  if (percentage < 50) {
    nextQuizSuggestion = {
      category: category,
      difficulty: "easy",
      reason: "Focus on fundamentals to build a strong foundation",
    }
  } else if (percentage < 70) {
    nextQuizSuggestion = {
      category: category,
      difficulty: difficulty,
      reason: "Practice more at your current level to improve consistency",
    }
  } else if (percentage >= 90) {
    const nextDifficulty = difficulty === "easy" ? "medium" : difficulty === "medium" ? "hard" : "hard"
    nextQuizSuggestion = {
      category: category,
      difficulty: nextDifficulty,
      reason: "Challenge yourself with harder questions to continue growing",
    }
  } else {
    nextQuizSuggestion = {
      category: category,
      difficulty: difficulty === "easy" ? "medium" : difficulty,
      reason: "You're ready for the next level of difficulty",
    }
  }

  return {
    weakAreas,
    strongAreas,
    recommendedResources,
    nextQuizSuggestion,
  }
}

// Helper functions for rule-based fallback
function inferWeakAreas(quizResult: QuizResult): string[] {
  const percentage = (quizResult.score / quizResult.totalQuestions) * 100
  if (percentage < 50) return ["fundamentals", "basic concepts"]
  if (percentage < 70) return ["intermediate concepts"]
  if (percentage < 90) return ["advanced concepts"]
  return []
}

function inferStrongAreas(quizResult: QuizResult): string[] {
  const percentage = (quizResult.score / quizResult.totalQuestions) * 100
  if (percentage >= 90) return ["fundamentals", "intermediate concepts", "advanced concepts"]
  if (percentage >= 70) return ["fundamentals", "intermediate concepts"]
  if (percentage >= 50) return ["fundamentals"]
  return []
}

// Track learning progress over time
export function analyzeProgressTrend(userHistory: QuizResult[]): {
  trend: "improving" | "declining" | "stable"
  averageScore: number
  recentPerformance: number
} {
  if (userHistory.length < 2) {
    return {
      trend: "stable",
      averageScore: userHistory[0]?.score || 0,
      recentPerformance: userHistory[0]?.score || 0,
    }
  }

  const scores = userHistory.map((result) => (result.score / result.totalQuestions) * 100)
  const averageScore = scores.reduce((sum, score) => sum + score, 0) / scores.length

  // Compare recent performance (last 3 quizzes) with overall average
  const recentScores = scores.slice(-3)
  const recentPerformance = recentScores.reduce((sum, score) => sum + score, 0) / recentScores.length

  let trend: "improving" | "declining" | "stable" = "stable"

  if (recentPerformance > averageScore + 5) {
    trend = "improving"
  } else if (recentPerformance < averageScore - 5) {
    trend = "declining"
  }

  return {
    trend,
    averageScore,
    recentPerformance,
  }
}
