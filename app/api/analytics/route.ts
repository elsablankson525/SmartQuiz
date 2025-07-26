import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url)
    const userId = searchParams.get("userId")
    const timeRange = searchParams.get("timeRange") || "30d"
    
    if (!userId) {
      return NextResponse.json({ error: "Missing userId" }, { status: 400 })
    }

    // Find user by ID or email
    let user = null
    
    if (userId.includes('@')) {
      // If userId contains @, treat as email
      user = await prisma.user.findUnique({ where: { email: userId } })
    } else {
      // Otherwise treat as user ID
      user = await prisma.user.findUnique({ where: { id: userId } })
    }
    
    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 })
    }

    // Calculate date range based on timeRange
    const now = new Date()
    let startDate = new Date()
    
    switch (timeRange) {
      case "7d":
        startDate.setDate(now.getDate() - 7)
        break
      case "30d":
        startDate.setDate(now.getDate() - 30)
        break
      case "90d":
        startDate.setDate(now.getDate() - 90)
        break
      case "all":
        startDate = new Date(0) // Beginning of time
        break
      default:
        startDate.setDate(now.getDate() - 30)
    }

    // Fetch quiz results for user within the time range
    const quizResults = await prisma.quizResult.findMany({ 
      where: { 
        userId: user.id,
        date: {
          gte: startDate
        }
      },
      orderBy: { date: 'desc' }
    })

    // Calculate analytics
    const totalQuizzes = quizResults.length
    const averageScore = totalQuizzes > 0 
      ? Math.round(quizResults.reduce((sum, q) => sum + (q.score / q.totalQuestions) * 100, 0) / totalQuizzes)
      : 0
    
    const totalTimeSpent = totalQuizzes > 0 
      ? quizResults.reduce((sum, q) => sum + q.timeSpent, 0)
      : 0
    
    const timeSpentFormatted = totalTimeSpent > 0 
      ? `${Math.round(totalTimeSpent / 3600 * 10) / 10}h`
      : "0h"

    // Calculate streak (simplified - consecutive days with quiz activity)
    let streak = 0
    if (totalQuizzes > 0) {
      const today = new Date()
      today.setHours(0, 0, 0, 0)
      let currentDate = new Date(today)
      
      for (let i = 0; i < 30; i++) { // Check last 30 days
        const hasActivity = quizResults.some(q => {
          const quizDate = new Date(q.date)
          quizDate.setHours(0, 0, 0, 0)
          return quizDate.getTime() === currentDate.getTime()
        })
        
        if (hasActivity) {
          streak++
        } else {
          break
        }
        
        currentDate.setDate(currentDate.getDate() - 1)
      }
    }

    // Calculate improvement (comparing first half vs second half of results)
    let improvement = 0
    if (totalQuizzes >= 4) {
      const midPoint = Math.floor(totalQuizzes / 2)
      const firstHalf = quizResults.slice(midPoint)
      const secondHalf = quizResults.slice(0, midPoint)
      
      const firstHalfAvg = firstHalf.reduce((sum, q) => sum + (q.score / q.totalQuestions) * 100, 0) / firstHalf.length
      const secondHalfAvg = secondHalf.reduce((sum, q) => sum + (q.score / q.totalQuestions) * 100, 0) / secondHalf.length
      
      improvement = Math.round(secondHalfAvg - firstHalfAvg)
    }

    // Calculate strong and weak subjects
    const subjectScores: { [key: string]: number[] } = {}
    quizResults.forEach(q => {
      if (!subjectScores[q.category]) {
        subjectScores[q.category] = []
      }
      subjectScores[q.category].push((q.score / q.totalQuestions) * 100)
    })

    const subjectAverages = Object.entries(subjectScores).map(([subject, scores]) => ({
      subject,
      average: scores.reduce((sum, score) => sum + score, 0) / scores.length
    })).sort((a, b) => b.average - a.average)

    const strongSubjects = subjectAverages.slice(0, 3).map(s => s.subject)
    const weakSubjects = subjectAverages.slice(-3).map(s => s.subject)

    // Recent activity
    const recentActivity = quizResults.slice(0, 5).map(q => ({
      date: q.date.toISOString().split("T")[0],
      subject: q.category,
      score: Math.round((q.score / q.totalQuestions) * 100),
      time: `${Math.round(q.timeSpent / 60)}m`,
    }))

    // Get user achievements
    const achievements = await prisma.achievement.findMany({
      where: { userId: user.id },
      select: {
        id: true,
        title: true,
        description: true,
        icon: true,
        earned: true
      }
    })

    // If no achievements found, create some default ones
    if (achievements.length === 0) {
      const defaultAchievements = [
        { title: 'Quiz Master', description: 'Completed 100+ quizzes', icon: '🏆', earned: totalQuizzes >= 100 },
        { title: 'Streak Champion', description: '30-day learning streak', icon: '🔥', earned: streak >= 30 },
        { title: 'Subject Expert', description: 'Achieved 90%+ in a category', icon: '🎓', earned: averageScore >= 90 },
        { title: 'Speed Learner', description: '10+ quizzes in one day', icon: '⚡', earned: false },
        { title: 'Geography Pro', description: 'Excelled in Geography quizzes', icon: '🌍', earned: false },
        { title: 'Music Maestro', description: 'Excelled in Music quizzes', icon: '🎵', earned: false },
        { title: 'Entertainment Guru', description: 'Excelled in Entertainment quizzes', icon: '🎬', earned: false },
        { title: '100 Quizzes', description: 'Completed 100 quizzes', icon: '💯', earned: totalQuizzes >= 100 },
      ]
      
      // Create achievements for this user
      for (const achievement of defaultAchievements) {
        await prisma.achievement.create({
          data: {
            ...achievement,
            userId: user.id
          }
        })
      }
      
      // Fetch the newly created achievements
      const newAchievements = await prisma.achievement.findMany({
        where: { userId: user.id },
        select: {
          id: true,
          title: true,
          description: true,
          icon: true,
          earned: true
        }
      })
      achievements.push(...newAchievements)
    }

    // Category breakdown
    const categoryBreakdown = Object.entries(subjectScores).map(([category, scores]) => ({
      category,
      count: scores.length,
      average: Math.round(scores.reduce((sum, score) => sum + score, 0) / scores.length)
    }))

    // Weekly progress (last 4 weeks)
    const weeklyProgress = []
    for (let i = 3; i >= 0; i--) {
      const weekStart = new Date()
      weekStart.setDate(weekStart.getDate() - (i * 7))
      weekStart.setHours(0, 0, 0, 0)
      
      const weekEnd = new Date(weekStart)
      weekEnd.setDate(weekEnd.getDate() + 7)
      
      const weekQuizzes = quizResults.filter(q => {
        const quizDate = new Date(q.date)
        return quizDate >= weekStart && quizDate < weekEnd
      })
      
      weeklyProgress.push({
        week: `Week ${4 - i}`,
        quizzes: weekQuizzes.length,
        average: weekQuizzes.length > 0 
          ? Math.round(weekQuizzes.reduce((sum, q) => sum + (q.score / q.totalQuestions) * 100, 0) / weekQuizzes.length)
          : 0
      })
    }

    // Difficulty progression
    const difficultyData = quizResults.reduce((acc, q) => {
      if (!acc[q.difficulty]) {
        acc[q.difficulty] = { count: 0, totalScore: 0 }
      }
      acc[q.difficulty].count++
      acc[q.difficulty].totalScore += (q.score / q.totalQuestions) * 100
      return acc
    }, {} as { [key: string]: { count: number, totalScore: number } })

    const difficultyProgression = Object.entries(difficultyData).map(([difficulty, data]) => ({
      difficulty,
      count: data.count,
      average: Math.round(data.totalScore / data.count)
    }))

    const response = {
      totalQuizzes,
      averageScore,
      timeSpent: timeSpentFormatted,
      streak,
      improvement,
      strongSubjects,
      weakSubjects,
      recentActivity,
      achievements,
      categoryBreakdown,
      weeklyProgress,
      difficultyProgression,
    }

    return NextResponse.json({ analytics: response })
  } catch (error) {
    console.error("Analytics error:", error)
    return NextResponse.json({ error: "Failed to fetch analytics" }, { status: 500 })
  }
} 