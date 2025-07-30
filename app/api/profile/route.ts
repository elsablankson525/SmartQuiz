import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { calculatePerformanceMetrics } from "@/lib/analytics"
import type { QuizResult } from "@/lib/types"

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url)
    const userId = searchParams.get("userId")
    
    if (!userId || !userId.trim()) {
      return NextResponse.json({ error: "Missing or invalid userId" }, { status: 400 })
    }

    // Find user by email
    const user = await prisma.user.findUnique({ where: { email: userId.trim() } })
    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 })
    }

    // Fetch all quiz results for user
    const quizResultsRaw = await prisma.quizResult.findMany({ where: { userId: user.id } })
    const quizResults = quizResultsRaw.map(q => ({
      ...q,
      questionsAnswered: Array.isArray(q.questionsAnswered)
        ? q.questionsAnswered
        : (typeof q.questionsAnswered === 'string' ? JSON.parse(q.questionsAnswered) : [])
    }))
    const metrics = calculatePerformanceMetrics(quizResults as QuizResult[])

    // Recent quizzes (last 5)
    const recentQuizzes = quizResults.slice(-5).reverse().map((q: QuizResult) => ({
      id: q.id,
      category: q.category,
      score: q.score,
      total: q.totalQuestions,
      date: q.date.toISOString(),
    }))

    // Full quiz history (all quizzes, most recent first)
    const quizHistory = quizResults.slice().reverse().map((q: QuizResult) => ({
      id: q.id,
      category: q.category,
      score: q.score,
      total: q.totalQuestions,
      date: q.date.toISOString(),
      difficulty: q.difficulty,
      timeSpent: q.timeSpent,
      questionsAnswered: q.questionsAnswered,
    }))

    // Category performance
    const categoryPerformance = metrics.categoryBreakdown.map(c => ({
      category: c.category,
      score: Math.round(c.averageScore),
    }))

    // Compute badges/achievements (fetch all possible badges and determine which are earned)
    const allBadges = await prisma.achievement.findMany({ select: { title: true } });
    const badgeTitles = allBadges.map(b => b.title);
    const earnedBadges: string[] = [];
    // Quiz Master: 100+ quizzes
    if (metrics.totalQuizzes >= 100 && badgeTitles.includes('Quiz Master')) earnedBadges.push('Quiz Master');
    // Streak Champion: 30+ day streak
    if (metrics.streakDays >= 30 && badgeTitles.includes('Streak Champion')) earnedBadges.push('Streak Champion');
    // Subject Expert: 90%+ in any category
    if (metrics.categoryBreakdown.find(c => c.averageScore >= 90) && badgeTitles.includes('Subject Expert')) earnedBadges.push('Subject Expert');
    // Speed Learner: 10+ quizzes in one day
    const dayCounts: Record<string, number> = {};
    quizResults.forEach((q: QuizResult) => {
      const day = q.date.toISOString().split('T')[0];
      dayCounts[day] = (dayCounts[day] || 0) + 1;
    });
    if (Object.values(dayCounts).some(count => count >= 10) && badgeTitles.includes('Speed Learner')) earnedBadges.push('Speed Learner');
    // Add more badge logic as needed
    // Compose response
    const profile = {
      name: user.name,
      email: user.email,
      joinDate: user.createdAt ? user.createdAt.toLocaleDateString('en-US', { year: 'numeric', month: 'short' }) : '',
      totalScore: metrics.totalQuizzes * 10, // Example: 10 points per quiz
      quizzesTaken: metrics.totalQuizzes,
      averageScore: Math.round(metrics.averageScore),
      badges: earnedBadges,
      availableBadges: badgeTitles,
      recentQuizzes,
      categoryPerformance,
      quizHistory,
    }
    return NextResponse.json({ 
      success: true,
      profile 
    })
  } catch (error) {
    console.error("Profile error:", error)
    return NextResponse.json({ error: "Failed to fetch profile" }, { status: 500 })
  }
} 