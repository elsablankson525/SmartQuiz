import type { QuizResult } from "./types"

export interface PerformanceMetrics {
  totalQuizzes: number
  averageScore: number
  totalTimeSpent: number
  strongestCategory: string
  weakestCategory: string
  improvementRate: number
  streakDays: number
  categoryBreakdown: CategoryPerformance[]
  weeklyProgress: WeeklyProgress[]
  difficultyProgression: DifficultyProgression[]
}

export interface CategoryPerformance {
  category: string
  averageScore: number
  quizzesTaken: number
  timeSpent: number
  lastQuizDate: Date
  trend: "improving" | "declining" | "stable"
}

export interface WeeklyProgress {
  week: string
  quizzesTaken: number
  averageScore: number
  timeSpent: number
}

export interface DifficultyProgression {
  difficulty: string
  category: string
  averageScore: number
  count: number
}

export function calculatePerformanceMetrics(quizHistory: QuizResult[]): PerformanceMetrics {
  if (quizHistory.length === 0) {
    return {
      totalQuizzes: 0,
      averageScore: 0,
      totalTimeSpent: 0,
      strongestCategory: "",
      weakestCategory: "",
      improvementRate: 0,
      streakDays: 0,
      categoryBreakdown: [],
      weeklyProgress: [],
      difficultyProgression: [],
    }
  }

  const totalQuizzes = quizHistory.length
  const totalTimeSpent = quizHistory.reduce((sum, quiz) => sum + (quiz.timeSpent || 0), 0)
  const averageScore =
    quizHistory.reduce((sum, quiz) => sum + (quiz.score / quiz.totalQuestions) * 100, 0) / totalQuizzes

  // Category breakdown
  const categoryMap = new Map<string, QuizResult[]>()
  quizHistory.forEach((quiz) => {
    const category = quiz.category || 'Unknown'
    if (!categoryMap.has(category)) {
      categoryMap.set(category, [])
    }
    categoryMap.get(category)!.push(quiz)
  })

  const categoryBreakdown: CategoryPerformance[] = Array.from(categoryMap.entries()).map(([category, quizzes]) => {
    const categoryAverage =
      quizzes.reduce((sum, quiz) => sum + (quiz.score / quiz.totalQuestions) * 100, 0) / quizzes.length
    const categoryTimeSpent = quizzes.reduce((sum, quiz) => sum + (quiz.timeSpent || 0), 0)
    const lastQuizDate = new Date(Math.max(...quizzes.map((q) => q.date.getTime())))

    // Calculate trend (simple comparison of first half vs second half)
    const midpoint = Math.floor(quizzes.length / 2)
    const firstHalf = quizzes.slice(0, midpoint)
    const secondHalf = quizzes.slice(midpoint)

    let trend: "improving" | "declining" | "stable" = "stable"
    if (firstHalf.length > 0 && secondHalf.length > 0) {
      const firstHalfAvg =
        firstHalf.reduce((sum, quiz) => sum + (quiz.score / quiz.totalQuestions) * 100, 0) / firstHalf.length
      const secondHalfAvg =
        secondHalf.reduce((sum, quiz) => sum + (quiz.score / quiz.totalQuestions) * 100, 0) / secondHalf.length

      if (secondHalfAvg > firstHalfAvg + 5) trend = "improving"
      else if (secondHalfAvg < firstHalfAvg - 5) trend = "declining"
    }

    return {
      category,
      averageScore: categoryAverage,
      quizzesTaken: quizzes.length,
      timeSpent: categoryTimeSpent,
      lastQuizDate,
      trend,
    }
  })

  const strongestCategory = categoryBreakdown.reduce((best, current) =>
    current.averageScore > best.averageScore ? current : best,
  ).category

  const weakestCategory = categoryBreakdown.reduce((worst, current) =>
    current.averageScore < worst.averageScore ? current : worst,
  ).category

  // Weekly progress
  const weeklyMap = new Map<string, QuizResult[]>()
  quizHistory.forEach((quiz) => {
    const weekKey = getWeekKey(quiz.date)
    if (!weeklyMap.has(weekKey)) {
      weeklyMap.set(weekKey, [])
    }
    weeklyMap.get(weekKey)!.push(quiz)
  })

  const weeklyProgress: WeeklyProgress[] = Array.from(weeklyMap.entries()).map(([week, quizzes]) => ({
    week,
    quizzesTaken: quizzes.length,
    averageScore: quizzes.reduce((sum, quiz) => sum + (quiz.score / quiz.totalQuestions) * 100, 0) / quizzes.length,
    timeSpent: quizzes.reduce((sum, quiz) => sum + (quiz.timeSpent || 0), 0),
  }))

  // Difficulty progression
  const difficultyMap = new Map<string, QuizResult[]>()
  quizHistory.forEach((quiz) => {
    const category = quiz.category || 'Unknown'
    const difficulty = quiz.difficulty || 'Unknown'
    const key = `${category}-${difficulty}`
    if (!difficultyMap.has(key)) {
      difficultyMap.set(key, [])
    }
    difficultyMap.get(key)!.push(quiz)
  })

  const difficultyProgression: DifficultyProgression[] = Array.from(difficultyMap.entries()).map(([key, quizzes]) => {
    const [category, difficulty] = key.split("-")
    return {
      difficulty,
      category,
      averageScore: quizzes.reduce((sum, quiz) => sum + (quiz.score / quiz.totalQuestions) * 100, 0) / quizzes.length,
      count: quizzes.length,
    }
  })

  // Calculate improvement rate (simple linear trend)
  const improvementRate = calculateImprovementRate(quizHistory)

  // Calculate streak days (simplified)
  const streakDays = calculateStreakDays(quizHistory)

  return {
    totalQuizzes,
    averageScore,
    totalTimeSpent,
    strongestCategory,
    weakestCategory,
    improvementRate,
    streakDays,
    categoryBreakdown,
    weeklyProgress,
    difficultyProgression,
  }
}

function getWeekKey(date: Date): string {
  const year = date.getFullYear()
  const week = Math.ceil(((date.getTime() - new Date(year, 0, 1).getTime()) / 86400000 + 1) / 7)
  return `${year}-W${week}`
}

function calculateImprovementRate(quizHistory: QuizResult[]): number {
  if (quizHistory.length < 2) return 0

  const scores = quizHistory.map((quiz) => (quiz.score / quiz.totalQuestions) * 100)
  const firstScore = scores[0]
  const lastScore = scores[scores.length - 1]

  return ((lastScore - firstScore) / quizHistory.length) * 100
}

function calculateStreakDays(quizHistory: QuizResult[]): number {
  // Simplified streak calculation
  const uniqueDates = [...new Set(quizHistory.map((quiz) => quiz.date.toDateString()))]
  return uniqueDates.length
}
