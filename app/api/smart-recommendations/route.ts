import { NextResponse } from "next/server"
import { unifiedRecommendationEngine } from "@/lib/unified-recommendation-engine"
import { RuleBasedEngine, getFallbackRecommendations } from "@/lib/rule-based-engine"
import { prisma } from "@/lib/prisma"
import type { QuizResult, Question } from "@/lib/types"

export async function POST(req: Request) {
  let body: any = null
  
  try {
    body = await req.json()
    const { 
      userId, 
      quizResult, 
      questions, 
      learnerType = 'inBetween',
      includeAnalytics = true,
      includeStudyPlan = true,
      includeLearningPaths = true
    } = body
    
    if (!userId || !quizResult) {
      return NextResponse.json({ 
        error: "Missing required fields: userId and quizResult" 
      }, { status: 400 })
    }

    // Look up the user by email (since frontend sends email as userId)
    const user = await prisma.user.findUnique({
      where: { email: userId }
    })

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 })
    }

    // Get user's comprehensive quiz history for better recommendations
    const userHistory = await prisma.quizResult.findMany({
      where: { userId: user.id },
      orderBy: { date: 'desc' },
      take: 20 // Get last 20 quiz results for better analysis
    })

    // Convert database results to QuizResult format
    const formattedHistory: QuizResult[] = userHistory.map(result => ({
      id: result.id,
      userId: result.userId,
      category: result.category,
      difficulty: result.difficulty,
      score: result.score,
      totalQuestions: result.totalQuestions,
      timeSpent: result.timeSpent,
      date: result.date,
      questionsAnswered: result.questionsAnswered ? JSON.parse(result.questionsAnswered as string) : undefined
    }))

    // Calculate performance metrics for the current quiz
    const currentQuizMetrics = calculateCurrentQuizMetrics(quizResult, questions)
    
    // Identify weak areas from current quiz
    const weakAreas = identifyWeakAreasFromQuiz(questions)
    
    // Identify strong areas from current quiz
    const strongAreas = identifyStrongAreasFromQuiz(questions)

    // Generate comprehensive unified recommendations
    const recommendations = await unifiedRecommendationEngine.generateUnifiedRecommendations(
      quizResult,
      questions || [],
      formattedHistory,
      {
        id: user.id,
        name: user.name || '',
        email: user.email || '',
        image: user.image || undefined,
        score: user.totalScore,
        quizzesTaken: formattedHistory.length,
        createdAt: user.createdAt,
        learningPreferences: undefined
      },
      learnerType
    )

    // Generate personalized recommendations based on performance
    const personalizedRecommendations = await generatePersonalizedRecommendations(
      user,
      quizResult,
      formattedHistory,
      currentQuizMetrics,
      weakAreas,
      strongAreas
    )

    // Generate specific next quiz suggestions
    const nextQuizSuggestions = generateNextQuizSuggestions(
      quizResult,
      currentQuizMetrics,
      weakAreas,
      strongAreas,
      formattedHistory
    )

    // Generate category-specific insights
    const categoryInsights = generateCategoryInsights(
      quizResult.category,
      currentQuizMetrics,
      weakAreas,
      strongAreas
    )

    // Prepare response based on requested features
    const response: any = {
      success: true,
      recommendations: {
        ...recommendations,
        personalizedRecommendations,
        nextQuizSuggestions,
        categoryInsights
      },
      performanceAnalysis: {
        currentQuiz: currentQuizMetrics,
        weakAreas,
        strongAreas,
        improvementSuggestions: generateImprovementSuggestions(currentQuizMetrics, weakAreas)
      },
      userHistory: formattedHistory.length,
      timestamp: new Date().toISOString()
    }

    // Add optional features based on request
    if (includeAnalytics) {
      response.performanceAnalytics = recommendations.performanceAnalytics
      response.personalizedInsights = recommendations.personalizedInsights
      response.adaptiveRecommendations = recommendations.adaptiveRecommendations
    }

    if (includeStudyPlan) {
      response.studyPlan = recommendations.studyPlan
    }

    if (includeLearningPaths) {
      response.pathRecommendations = recommendations.pathRecommendations
    }

    return NextResponse.json(response)

  } catch (error) {
    console.error("Error generating smart recommendations:", error)
    
    // Fallback to rule-based recommendations
    try {
      const fallbackRecommendations = await getFallbackRecommendations([], body?.quizResult?.category)
      return NextResponse.json({
        success: true,
        recommendations: fallbackRecommendations,
        note: "Using fallback recommendations due to error in main system"
      })
    } catch (fallbackError) {
      console.error("Fallback recommendations also failed:", fallbackError)
      return NextResponse.json({ 
        error: "Failed to generate recommendations",
        details: error instanceof Error ? error.message : "Unknown error"
      }, { status: 500 })
    }
  }
}

// Calculate detailed metrics for the current quiz
function calculateCurrentQuizMetrics(quizResult: any, questions: any[]) {
  const percentageScore = (quizResult.score / quizResult.totalQuestions) * 100
  const timePerQuestion = quizResult.timeSpent / quizResult.totalQuestions
  
  // Analyze question difficulty distribution
  const difficultyDistribution = questions.reduce((acc: any, question: any) => {
    const difficulty = question.difficulty || 'intermediate'
    acc[difficulty] = (acc[difficulty] || 0) + 1
    return acc
  }, {})

  // Analyze topic performance
  const topicPerformance = questions.reduce((acc: any, question: any) => {
    const topic = question.topic || 'general'
    if (!acc[topic]) {
      acc[topic] = { correct: 0, total: 0, avgTime: 0 }
    }
    acc[topic].total++
    if (question.isCorrect) {
      acc[topic].correct++
    }
    acc[topic].avgTime += question.timeSpent || 0
    return acc
  }, {})

  // Calculate average time per topic
  Object.keys(topicPerformance).forEach(topic => {
    topicPerformance[topic].avgTime = topicPerformance[topic].avgTime / topicPerformance[topic].total
    topicPerformance[topic].percentage = (topicPerformance[topic].correct / topicPerformance[topic].total) * 100
  })

  return {
    percentageScore,
    timePerQuestion,
    difficultyDistribution,
    topicPerformance,
    performanceLevel: getPerformanceLevel(percentageScore),
    timeEfficiency: getTimeEfficiency(timePerQuestion),
    overallAssessment: getOverallAssessment(percentageScore, timePerQuestion)
  }
}

// Identify weak areas from current quiz
function identifyWeakAreasFromQuiz(questions: any[]): string[] {
  if (!questions || questions.length === 0) return []
  
  const topicPerformance: Record<string, { correct: number; total: number }> = {}
  
  questions.forEach(question => {
    const topic = question.topic || 'general'
    if (!topicPerformance[topic]) {
      topicPerformance[topic] = { correct: 0, total: 0 }
    }
    topicPerformance[topic].total++
    if (question.isCorrect) {
      topicPerformance[topic].correct++
    }
  })

  // Find topics with less than 60% accuracy
  const weakAreas = Object.entries(topicPerformance)
    .filter(([topic, performance]) => {
      const percentage = (performance.correct / performance.total) * 100
      return percentage < 60 && performance.total >= 2 // At least 2 questions to be considered
    })
    .sort(([, a], [, b]) => {
      const aPercentage = (a.correct / a.total) * 100
      const bPercentage = (b.correct / b.total) * 100
      return aPercentage - bPercentage
    })
    .map(([topic]) => topic)
    .slice(0, 5) // Top 5 weak areas

  return weakAreas
}

// Identify strong areas from current quiz
function identifyStrongAreasFromQuiz(questions: any[]): string[] {
  if (!questions || questions.length === 0) return []
  
  const topicPerformance: Record<string, { correct: number; total: number }> = {}
  
  questions.forEach(question => {
    const topic = question.topic || 'general'
    if (!topicPerformance[topic]) {
      topicPerformance[topic] = { correct: 0, total: 0 }
    }
    topicPerformance[topic].total++
    if (question.isCorrect) {
      topicPerformance[topic].correct++
    }
  })

  // Find topics with more than 80% accuracy
  const strongAreas = Object.entries(topicPerformance)
    .filter(([topic, performance]) => {
      const percentage = (performance.correct / performance.total) * 100
      return percentage >= 80 && performance.total >= 2 // At least 2 questions to be considered
    })
    .sort(([, a], [, b]) => {
      const aPercentage = (a.correct / a.total) * 100
      const bPercentage = (b.correct / b.total) * 100
      return bPercentage - aPercentage
    })
    .map(([topic]) => topic)
    .slice(0, 3) // Top 3 strong areas

  return strongAreas
}

// Generate personalized recommendations based on performance
async function generatePersonalizedRecommendations(
  user: any,
  quizResult: any,
  userHistory: QuizResult[],
  currentQuizMetrics: any,
  weakAreas: string[],
  strongAreas: string[]
) {
  const recommendations = {
    immediateActions: generateImmediateActions(currentQuizMetrics, weakAreas),
    learningFocus: generateLearningFocus(weakAreas, strongAreas, currentQuizMetrics),
    practiceStrategy: generatePracticeStrategy(currentQuizMetrics, weakAreas),
    timeManagement: generateTimeManagement(currentQuizMetrics),
    confidenceBuilding: generateConfidenceBuilding(currentQuizMetrics, strongAreas)
  }

  return recommendations
}

// Generate next quiz suggestions
function generateNextQuizSuggestions(
  quizResult: any,
  currentQuizMetrics: any,
  weakAreas: string[],
  strongAreas: string[],
  userHistory: QuizResult[]
) {
  const suggestions = []

  // Suggestion 1: Focus on weak areas
  if (weakAreas.length > 0) {
    suggestions.push({
      type: 'weak_area_focus',
      category: quizResult.category,
      difficulty: getAppropriateDifficulty(currentQuizMetrics.percentageScore),
      reason: `Focus on improving ${weakAreas[0]} and ${weakAreas[1] || weakAreas[0]}`,
      priority: 'high',
      estimatedTime: 15
    })
  }

  // Suggestion 2: Advance in strong areas
  if (strongAreas.length > 0 && currentQuizMetrics.percentageScore >= 75) {
    suggestions.push({
      type: 'advance_strong_areas',
      category: quizResult.category,
      difficulty: getNextDifficulty(quizResult.difficulty),
      reason: `Build on your strength in ${strongAreas[0]}`,
      priority: 'medium',
      estimatedTime: 10
    })
  }

  // Suggestion 3: Try different category if performing well
  if (currentQuizMetrics.percentageScore >= 85) {
    const otherCategories = getOtherCategories(quizResult.category, userHistory)
    if (otherCategories.length > 0) {
      suggestions.push({
        type: 'explore_new_category',
        category: otherCategories[0],
        difficulty: 'beginner',
        reason: 'Explore new subject area to broaden your knowledge',
        priority: 'low',
        estimatedTime: 12
      })
    }
  }

  // Suggestion 4: Review fundamentals if struggling
  if (currentQuizMetrics.percentageScore < 50) {
    suggestions.push({
      type: 'review_fundamentals',
      category: quizResult.category,
      difficulty: 'beginner',
      reason: 'Review basic concepts to build a stronger foundation',
      priority: 'high',
      estimatedTime: 20
    })
  }

  return suggestions
}

// Generate category-specific insights
function generateCategoryInsights(
  category: string,
  currentQuizMetrics: any,
  weakAreas: string[],
  strongAreas: string[]
) {
  const insights: {
    category: string;
    performanceSummary: string;
    keyInsights: string[];
    improvementAreas: string[];
    strengths: string[];
    categorySpecificAdvice: string;
  } = {
    category: category,
    performanceSummary: getCategoryPerformanceSummary(currentQuizMetrics),
    keyInsights: [],
    improvementAreas: weakAreas,
    strengths: strongAreas,
    categorySpecificAdvice: getCategorySpecificAdvice(category, currentQuizMetrics)
  }

  // Add key insights based on performance
  if (currentQuizMetrics.percentageScore < 60) {
    insights.keyInsights.push('Focus on understanding fundamental concepts before advancing')
  } else if (currentQuizMetrics.percentageScore >= 90) {
    insights.keyInsights.push('Consider exploring advanced topics or helping others learn')
  }

  if (currentQuizMetrics.timeEfficiency === 'needs_improvement') {
    insights.keyInsights.push('Work on improving time management and speed')
  }

  if (weakAreas.length > 0) {
    insights.keyInsights.push(`Prioritize practice in: ${weakAreas.slice(0, 2).join(', ')}`)
  }

  return insights
}

// Helper functions
function getPerformanceLevel(percentageScore: number): 'excellent' | 'good' | 'average' | 'needs_improvement' {
  if (percentageScore >= 90) return 'excellent'
  if (percentageScore >= 75) return 'good'
  if (percentageScore >= 60) return 'average'
  return 'needs_improvement'
}

function getTimeEfficiency(timePerQuestion: number): 'excellent' | 'good' | 'needs_improvement' {
  if (timePerQuestion < 60) return 'excellent'
  if (timePerQuestion < 120) return 'good'
  return 'needs_improvement'
}

function getOverallAssessment(percentageScore: number, timePerQuestion: number): string {
  if (percentageScore >= 90 && timePerQuestion < 60) {
    return 'Outstanding performance with excellent efficiency'
  } else if (percentageScore >= 75) {
    return 'Good performance with room for improvement'
  } else if (percentageScore >= 60) {
    return 'Average performance - focus on understanding'
  } else {
    return 'Needs improvement - review fundamentals'
  }
}

function generateImmediateActions(currentQuizMetrics: any, weakAreas: string[]): string[] {
  const actions = []
  
  if (weakAreas.length > 0) {
    actions.push(`Review concepts related to: ${weakAreas.slice(0, 2).join(', ')}`)
  }
  
  if (currentQuizMetrics.timeEfficiency === 'needs_improvement') {
    actions.push('Practice similar questions to improve speed')
  }
  
  if (currentQuizMetrics.percentageScore < 60) {
    actions.push('Revisit fundamental concepts in this category')
  }
  
  return actions
}

function generateLearningFocus(weakAreas: string[], strongAreas: string[], currentQuizMetrics: any): string[] {
  const focus = []
  
  if (weakAreas.length > 0) {
    focus.push(`Primary focus: Strengthen ${weakAreas[0]}`)
  }
  
  if (strongAreas.length > 0) {
    focus.push(`Secondary focus: Advance in ${strongAreas[0]}`)
  }
  
  if (currentQuizMetrics.percentageScore < 70) {
    focus.push('Build confidence with easier problems first')
  }
  
  return focus
}

function generatePracticeStrategy(currentQuizMetrics: any, weakAreas: string[]): string[] {
  const strategy = []
  
  if (weakAreas.length > 0) {
    strategy.push(`Dedicate 70% of practice time to ${weakAreas[0]}`)
  }
  
  if (currentQuizMetrics.timeEfficiency === 'needs_improvement') {
    strategy.push('Practice with time limits to improve speed')
  }
  
  if (currentQuizMetrics.percentageScore < 60) {
    strategy.push('Start with basic problems and gradually increase difficulty')
  }
  
  return strategy
}

function generateTimeManagement(currentQuizMetrics: any): string[] {
  const timeTips = []
  
  if (currentQuizMetrics.timeEfficiency === 'needs_improvement') {
    timeTips.push('Allocate 30 seconds for easy questions, 60 seconds for medium, 90 seconds for hard')
    timeTips.push('Skip difficult questions and return to them later')
  }
  
  if (currentQuizMetrics.timePerQuestion > 120) {
    timeTips.push('Practice reading questions more quickly')
    timeTips.push('Work on mental math and quick calculations')
  }
  
  return timeTips
}

function generateConfidenceBuilding(currentQuizMetrics: any, strongAreas: string[]): string[] {
  const confidenceTips = []
  
  if (strongAreas.length > 0) {
    confidenceTips.push(`Remember your strength in ${strongAreas[0]} - you can do this!`)
  }
  
  if (currentQuizMetrics.percentageScore >= 60) {
    confidenceTips.push('You\'re making good progress - keep practicing consistently')
  }
  
  confidenceTips.push('Focus on learning from mistakes rather than dwelling on them')
  
  return confidenceTips
}

function getAppropriateDifficulty(percentageScore: number): string {
  if (percentageScore >= 85) return 'advanced'
  if (percentageScore >= 70) return 'intermediate'
  return 'beginner'
}

function getNextDifficulty(currentDifficulty: string): string {
  const difficulties = ['beginner', 'intermediate', 'advanced']
  const currentIndex = difficulties.indexOf(currentDifficulty)
  return currentIndex < difficulties.length - 1 ? difficulties[currentIndex + 1] : currentDifficulty
}

function getOtherCategories(currentCategory: string, userHistory: QuizResult[]): string[] {
  const allCategories = ['computer-science', 'mathematics', 'health', 'business', 'law', 'psychology', 'engineering', 'arts-humanities', 'natural-sciences', 'social-sciences', 'technology']
  const usedCategories = new Set(userHistory.map(quiz => quiz.category))
  return allCategories.filter(cat => cat !== currentCategory && !usedCategories.has(cat))
}

function getCategoryPerformanceSummary(currentQuizMetrics: any): string {
  if (currentQuizMetrics.percentageScore >= 90) {
    return 'Exceptional performance - you\'re mastering this category!'
  } else if (currentQuizMetrics.percentageScore >= 75) {
    return 'Strong performance - you have a solid understanding'
  } else if (currentQuizMetrics.percentageScore >= 60) {
    return 'Good performance - continue practicing to improve'
  } else {
    return 'Needs improvement - focus on building fundamentals'
  }
}

function getCategorySpecificAdvice(category: string, currentQuizMetrics: any): string {
  const adviceMap: Record<string, Record<string, string>> = {
    'computer-science': {
      excellent: 'Consider contributing to open source projects or teaching others',
      good: 'Practice coding challenges and build small projects',
      average: 'Focus on understanding algorithms and data structures',
      needs_improvement: 'Start with basic programming concepts and syntax'
    },
    'mathematics': {
      excellent: 'Explore advanced mathematical concepts and proofs',
      good: 'Practice problem-solving techniques and proofs',
      average: 'Focus on understanding fundamental concepts',
      needs_improvement: 'Build strong foundation in basic mathematics'
    }
    // Add more categories as needed
  }
  
  return adviceMap[category]?.[currentQuizMetrics.performanceLevel] || 
         'Continue practicing and focus on areas where you can improve'
}

function generateImprovementSuggestions(currentQuizMetrics: any, weakAreas: string[]): string[] {
  const suggestions = []
  
  if (weakAreas.length > 0) {
    suggestions.push(`Focus on improving: ${weakAreas.slice(0, 2).join(', ')}`)
  }
  
  if (currentQuizMetrics.timeEfficiency === 'needs_improvement') {
    suggestions.push('Practice with time limits to improve speed')
  }
  
  if (currentQuizMetrics.percentageScore < 70) {
    suggestions.push('Review fundamental concepts before advancing')
  }
  
  return suggestions
}

// GET endpoint for retrieving user's learning profile and recommendations
export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url)
    const userId = searchParams.get("userId")
    const category = searchParams.get("category")
    const difficulty = searchParams.get("difficulty")

    if (!userId) {
      return NextResponse.json({ 
        error: "Missing required parameter: userId" 
      }, { status: 400 })
    }

    // Look up the user
    const user = await prisma.user.findUnique({
      where: { email: userId }
    })

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 })
    }

    // Get user's quiz history
    const userHistory = await prisma.quizResult.findMany({
      where: { userId: user.id },
      orderBy: { date: 'desc' },
      take: 50 // Get more history for comprehensive analysis
    })

    const formattedHistory: QuizResult[] = userHistory.map(result => ({
      id: result.id,
      userId: result.userId,
      category: result.category,
      difficulty: result.difficulty,
      score: result.score,
      totalQuestions: result.totalQuestions,
      timeSpent: result.timeSpent,
      date: result.date,
      questionsAnswered: result.questionsAnswered ? JSON.parse(result.questionsAnswered as string) : undefined
    }))

    // Generate learning profile and insights
    const learningProfile = await generateLearningProfile(user, formattedHistory)
    
    // Generate category-specific recommendations if requested
    let categoryRecommendations = null
    if (category) {
      const mockQuizResult: QuizResult = {
        id: "mock",
        userId: user.id,
        category: category,
        difficulty: difficulty || "intermediate",
        score: 0,
        totalQuestions: 1,
        timeSpent: 0,
        date: new Date(),
        questionsAnswered: []
      }

      categoryRecommendations = await unifiedRecommendationEngine.generateUnifiedRecommendations(
        mockQuizResult,
        [],
        formattedHistory,
        {
          id: user.id,
          name: user.name || '',
          email: user.email || '',
          image: user.image || undefined,
          score: user.totalScore,
          quizzesTaken: formattedHistory.length,
          createdAt: user.createdAt,
          learningPreferences: undefined
        },
        'inBetween'
      )
    }

    return NextResponse.json({
      success: true,
      learningProfile,
      categoryRecommendations,
      totalQuizzes: formattedHistory.length,
      lastActive: formattedHistory[0]?.date || null
    })

  } catch (error) {
    console.error("Error retrieving learning profile:", error)
    return NextResponse.json({ 
      error: "Failed to retrieve learning profile",
      details: error instanceof Error ? error.message : "Unknown error"
    }, { status: 500 })
  }
}

// Helper function to generate learning profile
async function generateLearningProfile(user: any, history: QuizResult[]) {
  if (history.length === 0) {
    return {
      experienceLevel: "beginner",
      preferredCategories: [],
      averageScore: 0,
      totalQuizzes: 0,
      learningTrend: "stable",
      strengths: [],
      weaknesses: [],
      recommendedFocus: "Start with fundamentals in any category"
    }
  }

  // Calculate average score
  const averageScore = history.reduce((sum, quiz) => 
    sum + (quiz.score / quiz.totalQuestions) * 100, 0
  ) / history.length

  // Analyze category performance
  const categoryPerformance: Record<string, number> = {}
  history.forEach(quiz => {
    if (!categoryPerformance[quiz.category]) {
      categoryPerformance[quiz.category] = 0
    }
    categoryPerformance[quiz.category] += (quiz.score / quiz.totalQuestions) * 100
  })

  // Get preferred categories (top 3 by performance)
  const preferredCategories = Object.entries(categoryPerformance)
    .sort(([, a], [, b]) => b - a)
    .slice(0, 3)
    .map(([category]) => category)

  // Determine experience level
  let experienceLevel: "beginner" | "intermediate" | "advanced" = "beginner"
  if (history.length > 10 && averageScore > 75) experienceLevel = "advanced"
  else if (history.length > 5 && averageScore > 60) experienceLevel = "intermediate"

  // Analyze learning trend
  const recentQuizzes = history.slice(0, 5)
  const olderQuizzes = history.slice(5, 10)
  
  let learningTrend: "improving" | "declining" | "stable" = "stable"
  if (recentQuizzes.length > 0 && olderQuizzes.length > 0) {
    const recentAvg = recentQuizzes.reduce((sum, quiz) => 
      sum + (quiz.score / quiz.totalQuestions) * 100, 0
    ) / recentQuizzes.length
    
    const olderAvg = olderQuizzes.reduce((sum, quiz) => 
      sum + (quiz.score / quiz.totalQuestions) * 100, 0
    ) / olderQuizzes.length
    
    if (recentAvg > olderAvg + 5) learningTrend = "improving"
    else if (recentAvg < olderAvg - 5) learningTrend = "declining"
  }

  // Identify strengths and weaknesses
  const strengths: string[] = []
  const weaknesses: string[] = []
  
  Object.entries(categoryPerformance).forEach(([category, totalScore]) => {
    const avgScore = totalScore / history.filter(q => q.category === category).length
    if (avgScore > 80) strengths.push(category)
    else if (avgScore < 60) weaknesses.push(category)
  })

  // Generate recommended focus
  let recommendedFocus = "Continue practicing in your preferred categories"
  if (weaknesses.length > 0) {
    recommendedFocus = `Focus on improving in: ${weaknesses.slice(0, 2).join(", ")}`
  } else if (strengths.length > 0) {
    recommendedFocus = `Advance your expertise in: ${strengths.slice(0, 2).join(", ")}`
  }

  return {
    experienceLevel,
    preferredCategories,
    averageScore: Math.round(averageScore * 10) / 10,
    totalQuizzes: history.length,
    learningTrend,
    strengths,
    weaknesses,
    recommendedFocus,
    categoryPerformance
  }
} 