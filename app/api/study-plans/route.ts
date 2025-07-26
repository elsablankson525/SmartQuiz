import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { RuleBasedEngine } from "@/lib/rule-based-engine"

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const category = searchParams.get("category")
    const difficulty = searchParams.get("difficulty")
    const userId = searchParams.get("userId")
    const performanceLevel = searchParams.get("performanceLevel") // 'excellent', 'good', 'average', 'needs_improvement'

    if (!category) {
      return NextResponse.json(
        { error: "Category parameter is required" },
        { status: 400 }
      )
    }

    // Map category names to database category names
    const categoryMapping: Record<string, string> = {
      "computer-science": "Computer Science",
      "health": "Health & Medicine",
      "business": "Business",
      "law": "Law",
      "psychology": "Psychology",
      "mathematics": "Mathematics",
      "engineering": "Engineering",
      "arts-humanities": "Arts & Humanities",
      "natural-sciences": "Natural Sciences",
      "social-sciences": "Social Sciences",
      "technology": "Technology"
    }

    const dbCategory = categoryMapping[category] || category

    // If userId is provided, generate personalized study plan
    if (userId) {
      const personalizedPlan = await generatePersonalizedStudyPlan(
        userId,
        dbCategory,
        difficulty,
        performanceLevel
      )
      return NextResponse.json(personalizedPlan)
    }

    // Build the query - only use category since StudyPlan doesn't have difficulty field
    const whereClause: any = {
      category: dbCategory
    }

    // Fetch study plans
    const studyPlans = await prisma.studyPlan.findMany({
      where: whereClause,
      orderBy: [
        { week: 'asc' }
      ]
    })

    return NextResponse.json({
      success: true,
      studyPlans: studyPlans,
      category: dbCategory,
      difficulty: difficulty || "all",
      note: difficulty ? `Difficulty filter '${difficulty}' ignored - StudyPlan model doesn't support difficulty filtering` : null
    })

  } catch (error) {
    console.error("Error fetching study plans:", error)
    return NextResponse.json(
      { error: "Failed to fetch study plans" },
      { status: 500 }
    )
  }
}

// Generate personalized study plan based on user performance
async function generatePersonalizedStudyPlan(
  userId: string,
  category: string,
  difficulty: string | null,
  performanceLevel: string | null
) {
  try {
    // Look up the user by email
    const user = await prisma.user.findUnique({
      where: { email: userId }
    })

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 })
    }

    // Get user's quiz history for this category
    const userHistory = await prisma.quizResult.findMany({
      where: { 
        userId: user.id,
        category: category
      },
      orderBy: { date: 'desc' },
      take: 10
    })

    // Calculate performance metrics
    const performanceMetrics = calculatePerformanceMetrics(userHistory)
    
    // Determine learner type based on performance
    const learnerType = determineLearnerType(performanceMetrics, performanceLevel)
    
    // Get weak areas from recent quiz results
    const weakAreas = await identifyWeakAreas(user.id, category)
    
    // Generate personalized study plan
    const personalizedPlan = await createPersonalizedStudyPlan(
      category,
      difficulty,
      learnerType,
      performanceMetrics,
      weakAreas
    )

    return NextResponse.json({
      success: true,
      studyPlan: personalizedPlan,
      performanceMetrics,
      learnerType,
      weakAreas,
      category,
      difficulty: difficulty || "adaptive",
      totalWeeks: personalizedPlan.length,
      estimatedTotalTime: personalizedPlan.reduce((sum, week) => sum + week.estimatedTime, 0)
    })

  } catch (error) {
    console.error("Error generating personalized study plan:", error)
    return NextResponse.json(
      { error: "Failed to generate personalized study plan" },
      { status: 500 }
    )
  }
}

// Calculate performance metrics from quiz history
function calculatePerformanceMetrics(quizHistory: any[]) {
  if (quizHistory.length === 0) {
    return {
      averageScore: 0,
      totalQuizzes: 0,
      recentTrend: 'stable',
      consistency: 'unknown',
      timeEfficiency: 'unknown'
    }
  }

  const scores = quizHistory.map(quiz => (quiz.score / quiz.totalQuestions) * 100)
  const averageScore = scores.reduce((sum, score) => sum + score, 0) / scores.length
  
  // Calculate recent trend (last 3 quizzes vs previous 3)
  const recentScores = scores.slice(0, 3)
  const previousScores = scores.slice(3, 6)
  
  let recentTrend = 'stable'
  if (recentScores.length > 0 && previousScores.length > 0) {
    const recentAvg = recentScores.reduce((sum, score) => sum + score, 0) / recentScores.length
    const previousAvg = previousScores.reduce((sum, score) => sum + score, 0) / previousScores.length
    
    if (recentAvg > previousAvg + 5) recentTrend = 'improving'
    else if (recentAvg < previousAvg - 5) recentTrend = 'declining'
  }

  // Calculate consistency (standard deviation)
  const variance = scores.reduce((sum, score) => sum + Math.pow(score - averageScore, 2), 0) / scores.length
  const stdDev = Math.sqrt(variance)
  const consistency = stdDev < 10 ? 'high' : stdDev < 20 ? 'medium' : 'low'

  // Calculate time efficiency
  const avgTimePerQuestion = quizHistory.reduce((sum, quiz) => 
    sum + (quiz.timeSpent / quiz.totalQuestions), 0) / quizHistory.length
  const timeEfficiency = avgTimePerQuestion < 60 ? 'excellent' : 
                        avgTimePerQuestion < 120 ? 'good' : 'needs_improvement'

  return {
    averageScore: Math.round(averageScore * 10) / 10,
    totalQuizzes: quizHistory.length,
    recentTrend,
    consistency,
    timeEfficiency
  }
}

// Determine learner type based on performance
function determineLearnerType(performanceMetrics: any, performanceLevel: string | null): 'slow' | 'inBetween' | 'fast' {
  if (performanceLevel) {
    if (performanceLevel === 'excellent') return 'fast'
    if (performanceLevel === 'needs_improvement') return 'slow'
    return 'inBetween'
  }

  // Determine based on performance metrics
  if (performanceMetrics.averageScore >= 85 && performanceMetrics.timeEfficiency === 'excellent') {
    return 'fast'
  } else if (performanceMetrics.averageScore < 60 || performanceMetrics.timeEfficiency === 'needs_improvement') {
    return 'slow'
  }
  return 'inBetween'
}

// Identify weak areas from recent quiz results
async function identifyWeakAreas(userId: string, category: string): Promise<string[]> {
  try {
    // Get recent quiz results with question details
    const recentQuizzes = await prisma.quizResult.findMany({
      where: { 
        userId,
        category
      },
      orderBy: { date: 'desc' },
      take: 5
    })

    const weakAreas: string[] = []
    
    // Analyze questions answered to identify weak areas
    for (const quiz of recentQuizzes) {
      if (quiz.questionsAnswered) {
        const questions = JSON.parse(quiz.questionsAnswered as string)
        const incorrectQuestions = questions.filter((q: any) => !q.isCorrect)
        
        incorrectQuestions.forEach((q: any) => {
          if (q.topic && !weakAreas.includes(q.topic)) {
            weakAreas.push(q.topic)
          }
        })
      }
    }

    return weakAreas.slice(0, 5) // Return top 5 weak areas
  } catch (error) {
    console.error("Error identifying weak areas:", error)
    return []
  }
}

// Create personalized study plan
async function createPersonalizedStudyPlan(
  category: string,
  difficulty: string | null,
  learnerType: 'slow' | 'inBetween' | 'fast',
  performanceMetrics: any,
  weakAreas: string[]
) {
  // Get base study plan from rule-based engine
  const basePlan = RuleBasedEngine.getStudyPlanForSubjectAndLearnerType(
    category.toLowerCase().replace(/\s+/g, '-'),
    learnerType
  )

  // Enhance plan with performance-specific modifications
  const enhancedPlan = basePlan.map((week, index) => {
    const enhancedWeek = {
      ...week,
      priority: getWeekPriority(index, performanceMetrics),
      estimatedTime: getEstimatedTime(learnerType, week.focus),
      difficultyAdjustment: getDifficultyAdjustment(performanceMetrics, difficulty),
      focus: enhanceFocusWithWeakAreas(week.focus, weakAreas),
      goals: enhanceGoalsWithPerformance(week.goals, performanceMetrics),
      resources: enhanceResourcesWithWeakAreas(week.resources, weakAreas),
      quizTopics: enhanceQuizTopicsWithWeakAreas(week.quizTopics, weakAreas)
    }

    return enhancedWeek
  })

  // Add additional weeks for weak areas if needed
  if (weakAreas.length > 0 && performanceMetrics.averageScore < 70) {
    const weakAreaWeeks = createWeakAreaFocusWeeks(weakAreas, category)
    enhancedPlan.push(...weakAreaWeeks)
  }

  return enhancedPlan
}

// Helper functions for personalization
function getWeekPriority(index: number, performanceMetrics: any): 'high' | 'medium' | 'low' {
  if (index === 0) return 'high' // First week is always high priority
  
  if (performanceMetrics.recentTrend === 'declining') {
    return index <= 2 ? 'high' : 'medium'
  }
  
  if (performanceMetrics.averageScore < 60) {
    return index <= 3 ? 'high' : 'medium'
  }
  
  return 'medium'
}

function getEstimatedTime(learnerType: string, focus: string): number {
  const baseTime = 5 // hours per week
  
  if (learnerType === 'slow') {
    return Math.round(baseTime * 1.5)
  } else if (learnerType === 'fast') {
    return Math.round(baseTime * 0.7)
  }
  
  return baseTime
}

function getDifficultyAdjustment(performanceMetrics: any, difficulty: string | null): string {
  if (performanceMetrics.averageScore >= 85) {
    return 'increase'
  } else if (performanceMetrics.averageScore < 50) {
    return 'decrease'
  }
  return 'maintain'
}

function enhanceFocusWithWeakAreas(focus: string, weakAreas: string[]): string {
  if (weakAreas.length === 0) return focus
  
  const weakAreaFocus = weakAreas.slice(0, 2).join(', ')
  return `${focus} (Focus on: ${weakAreaFocus})`
}

function enhanceGoalsWithPerformance(goals: string[], performanceMetrics: any): string[] {
  const enhancedGoals = [...goals]
  
  if (performanceMetrics.averageScore < 60) {
    enhancedGoals.push('Build confidence with fundamental concepts')
  }
  
  if (performanceMetrics.timeEfficiency === 'needs_improvement') {
    enhancedGoals.push('Improve time management and speed')
  }
  
  if (performanceMetrics.consistency === 'low') {
    enhancedGoals.push('Work on consistency and reliability')
  }
  
  return enhancedGoals
}

function enhanceResourcesWithWeakAreas(resources: string[], weakAreas: string[]): string[] {
  // Add specific resources for weak areas
  const weakAreaResources = weakAreas.map(area => `${area}-focused-resource`)
  return [...resources, ...weakAreaResources]
}

function enhanceQuizTopicsWithWeakAreas(quizTopics: string[], weakAreas: string[]): string[] {
  // Prioritize weak areas in quiz topics
  return [...weakAreas, ...quizTopics.filter(topic => !weakAreas.includes(topic))]
}

function createWeakAreaFocusWeeks(weakAreas: string[], category: string) {
  return weakAreas.map((area, index) => ({
    week: 100 + index, // Use high numbers to indicate additional weeks
    focus: `Focus on ${area}`,
    resources: [`${area}-comprehensive-resource`, `${area}-practice-exercises`],
    quizTopics: [area],
    goals: [`Master ${area} concepts`, `Improve ${area} problem-solving skills`],
    priority: 'high' as const,
    estimatedTime: 8,
    difficultyAdjustment: 'maintain' as const
  }))
}

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { category, week, focus, resources, quizTopics, goals } = body

    if (!category || !week || !focus) {
      return NextResponse.json(
        { error: "Category, week, and focus are required" },
        { status: 400 }
      )
    }

    const studyPlan = await prisma.studyPlan.create({
      data: {
        category,
        week,
        focus,
        resources: resources || [],
        quizTopics: quizTopics || [],
        goals: goals || []
      }
    })

    return NextResponse.json({
      success: true,
      studyPlan
    })

  } catch (error) {
    console.error("Error creating study plan:", error)
    return NextResponse.json(
      { error: "Failed to create study plan" },
      { status: 500 }
    )
  }
} 