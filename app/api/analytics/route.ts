import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { calculatePerformanceMetrics } from "@/lib/analytics"
import type { QuizResult } from "@/lib/types"

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url)
    const userId = searchParams.get("userId")
    const timeRange = searchParams.get("timeRange") || "30d"
    if (!userId) {
      return NextResponse.json({ error: "Missing userId" }, { status: 400 })
    }

    // Calculate date range
    let fromDate: Date | undefined
    const now = new Date()
    if (timeRange !== "all") {
      const days = parseInt(timeRange.replace("d", ""), 10)
      fromDate = new Date(now.getTime() - days * 24 * 60 * 60 * 1000)
    }

    // Fetch quiz results for user in range
    const where: any = { userId }
    if (fromDate) where.date = { gte: fromDate }
    const quizResultsRaw = await prisma.quizResult.findMany({ where })
    const quizResults = quizResultsRaw.map(q => ({
      ...q,
      questionsAnswered: Array.isArray(q.questionsAnswered)
        ? q.questionsAnswered
        : (typeof q.questionsAnswered === 'string' ? JSON.parse(q.questionsAnswered) : [])
    }))

    // Compute analytics
    const metrics = calculatePerformanceMetrics(quizResults)

    // Format recent activity (last 5 quizzes)
    const recentActivity = (quizResults as QuizResult[]).slice(-5).reverse().map((q: QuizResult) => ({
      date: q.date.toISOString().split("T")[0],
      subject: q.category,
      score: Math.round((q.score / q.totalQuestions) * 100),
      time: `${Math.round(q.timeSpent / 60)}m`,
    }))

    // Compute dynamic achievements
    const achievements = []
    if (metrics.totalQuizzes >= 100) {
      achievements.push({ id: 1, title: "Quiz Master", description: "Completed 100+ quizzes", icon: "🏆", earned: true })
    } else {
      achievements.push({ id: 1, title: "Quiz Master", description: "Completed 100+ quizzes", icon: "🏆", earned: false })
    }
    if (metrics.streakDays >= 30) {
      achievements.push({ id: 2, title: "Streak Champion", description: "30-day learning streak", icon: "🔥", earned: true })
    } else {
      achievements.push({ id: 2, title: "Streak Champion", description: "30-day learning streak", icon: "🔥", earned: false })
    }
    const subjectExpert = metrics.categoryBreakdown.find(c => c.averageScore >= 90)
    achievements.push({ id: 3, title: "Subject Expert", description: "90%+ average in a subject", icon: "🎯", earned: !!subjectExpert })
    // Speed Learner: 10+ quizzes in one day
    const dayCounts: Record<string, number> = {}
    quizResults.forEach((q: QuizResult) => {
      const day = q.date.toISOString().split("T")[0]
      dayCounts[day] = (dayCounts[day] || 0) + 1
    })
    const speedLearner = Object.values(dayCounts).some(count => count >= 10)
    achievements.push({ id: 4, title: "Speed Learner", description: "Complete 10 quizzes in one day", icon: "⚡", earned: speedLearner })

    // Format response to match frontend
    const response = {
      totalQuizzes: metrics.totalQuizzes,
      averageScore: Math.round(metrics.averageScore),
      timeSpent: `${Math.round(metrics.totalTimeSpent / 3600 * 10) / 10}h`,
      streak: metrics.streakDays,
      improvement: Math.round(metrics.improvementRate * 10) / 10,
      strongSubjects: metrics.categoryBreakdown.slice(0, 3).map(c => c.category),
      weakSubjects: metrics.categoryBreakdown.slice(-2).map(c => c.category),
      recentActivity,
      achievements,
    }

    return NextResponse.json({ analytics: response })
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch analytics" }, { status: 500 })
  }
} 