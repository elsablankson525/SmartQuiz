import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { RuleBasedEngine, getFallbackRecommendations } from "@/lib/rule-based-engine"
import type { QuizResult } from "@/lib/types"

export async function POST(req: Request) {
  try {
    const body = await req.json()
    const { userId, category, difficulty, score, totalQuestions, timeSpent, date, questionsAnswered } = body
    
    // Validate required fields
    if (!userId || !category || !difficulty || score == null || !totalQuestions || timeSpent == null || !date) {
      return NextResponse.json({ 
        error: "Missing required fields: userId, category, difficulty, score, totalQuestions, timeSpent, date" 
      }, { status: 400 })
    }

    // Validate score and totalQuestions
    if (score < 0 || totalQuestions <= 0 || score > totalQuestions) {
      return NextResponse.json({ 
        error: "Invalid score or totalQuestions values" 
      }, { status: 400 })
    }

    // Look up the user by email (since frontend sends email as userId)
    const user = await prisma.user.findUnique({
      where: { email: userId }
    })

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 })
    }

    // Calculate performance metrics
    const percentageScore = (score / totalQuestions) * 100
    const performanceLevel = getPerformanceLevel(percentageScore)
    const timePerQuestion = timeSpent / totalQuestions

    // Save quiz result
    const result = await prisma.quizResult.create({
      data: {
        userId: user.id, // Use the actual user ID, not email
        category,
        difficulty,
        score,
        totalQuestions,
        timeSpent,
        date: new Date(date),
        questionsAnswered: questionsAnswered ? JSON.stringify(questionsAnswered) : undefined,
      },
    })

    // Get user's quiz history for personalized recommendations
    const userHistory = await prisma.quizResult.findMany({
      where: { userId: user.id },
      orderBy: { date: 'desc' },
      take: 20
    })

    // Generate personalized recommendations based on performance
    const personalizedRecommendations = await generatePersonalizedRecommendations(
      user,
      result,
      userHistory,
      questionsAnswered,
      percentageScore,
      performanceLevel
    )

    // Generate personalized study plan
    const personalizedStudyPlan = await generatePersonalizedStudyPlan(
      category,
      difficulty,
      percentageScore,
      performanceLevel,
      questionsAnswered
    )

    // Generate personalized learning resources
    const personalizedResources = await generatePersonalizedResources(
      category,
      difficulty,
      percentageScore,
      performanceLevel,
      questionsAnswered
    )

    // Update user's total score
    await prisma.user.update({
      where: { id: user.id },
      data: { totalScore: user.totalScore + score }
    })

    return NextResponse.json({ 
      success: true, 
      result,
      personalizedRecommendations,
      personalizedStudyPlan,
      personalizedResources,
      performanceMetrics: {
        percentageScore,
        performanceLevel,
        timePerQuestion,
        category,
        difficulty
      }
    })
  } catch (error) {
    console.error("Error saving quiz result:", error)
    return NextResponse.json({ error: "Failed to save quiz result" }, { status: 500 })
  }
}

// Helper function to determine performance level
function getPerformanceLevel(percentageScore: number): 'excellent' | 'good' | 'average' | 'needs_improvement' {
  if (percentageScore >= 90) return 'excellent'
  if (percentageScore >= 75) return 'good'
  if (percentageScore >= 60) return 'average'
  return 'needs_improvement'
}

// Generate personalized recommendations based on quiz performance
async function generatePersonalizedRecommendations(
  user: any,
  currentQuiz: any,
  userHistory: any[],
  questionsAnswered: any,
  percentageScore: number,
  performanceLevel: string
) {
  try {
    // Convert history to QuizResult format
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

    // Use rule-based engine for personalized recommendations
    const recommendations = await RuleBasedEngine.generateRecommendations(
      formattedHistory,
      currentQuiz.category,
      {
        difficulty: currentQuiz.difficulty,
        timeAvailable: 10, // Default 10 hours per week
        goals: getGoalsBasedOnPerformance(percentageScore, performanceLevel)
      }
    )

    // Enhance recommendations with performance-specific insights
    const enhancedRecommendations = {
      ...recommendations,
      performanceInsights: {
        score: percentageScore,
        level: performanceLevel,
        strengths: getStrengthsFromQuestions(questionsAnswered),
        weaknesses: getWeaknessesFromQuestions(questionsAnswered),
        nextSteps: getNextStepsBasedOnPerformance(percentageScore, performanceLevel, currentQuiz.difficulty),
        timeAnalysis: analyzeTimePerformance(currentQuiz.timeSpent, currentQuiz.totalQuestions)
      },
      categorySpecificAdvice: getCategorySpecificAdvice(currentQuiz.category, percentageScore, performanceLevel)
    }

    return enhancedRecommendations
  } catch (error) {
    console.error("Error generating personalized recommendations:", error)
    // Fallback to basic recommendations
    return await getFallbackRecommendations([], currentQuiz.category)
  }
}

// Generate personalized study plan based on performance
async function generatePersonalizedStudyPlan(
  category: string,
  difficulty: string,
  percentageScore: number,
  performanceLevel: string,
  questionsAnswered: any
) {
  try {
    // Get existing study plans for the category
    const existingPlans = await prisma.studyPlan.findMany({
      where: { category },
      orderBy: { week: 'asc' }
    })

    // Determine learner type based on performance
    const learnerType = getLearnerType(percentageScore, performanceLevel)
    
    // Get rule-based study plan
    const ruleBasedPlan = RuleBasedEngine.getStudyPlanForSubjectAndLearnerType(
      category.toLowerCase().replace(/\s+/g, '-'),
      learnerType
    )

    // Enhance with performance-specific modifications
    const enhancedPlan = ruleBasedPlan.map((week, index) => ({
      ...week,
      focus: enhanceFocusBasedOnPerformance(week.focus, percentageScore, performanceLevel),
      goals: enhanceGoalsBasedOnPerformance(week.goals, percentageScore, performanceLevel),
      priority: getWeekPriority(index, percentageScore, performanceLevel),
      estimatedTime: getEstimatedTime(learnerType, week.focus),
      difficultyAdjustment: getDifficultyAdjustment(percentageScore, difficulty)
    }))

    return {
      studyPlan: enhancedPlan,
      learnerType,
      performanceLevel,
      category,
      difficulty,
      totalWeeks: enhancedPlan.length,
      estimatedTotalTime: enhancedPlan.reduce((sum, week) => sum + week.estimatedTime, 0)
    }
  } catch (error) {
    console.error("Error generating personalized study plan:", error)
    return {
      studyPlan: [{
        week: 1,
        focus: "Getting Started",
        resources: [],
        quizTopics: [category],
        goals: ["Begin learning journey"],
        priority: "high",
        estimatedTime: 5,
        difficultyAdjustment: "maintain"
      }],
      learnerType: "inBetween",
      performanceLevel,
      category,
      difficulty,
      totalWeeks: 1,
      estimatedTotalTime: 5
    }
  }
}

// Generate personalized learning resources based on performance
async function generatePersonalizedResources(
  category: string,
  difficulty: string,
  percentageScore: number,
  performanceLevel: string,
  questionsAnswered: any
) {
  try {
    // Get learning resources from database
    const resources = await prisma.learningResource.findMany({
      where: { category },
      orderBy: { rating: 'desc' }
    })

    // Filter and prioritize resources based on performance
    const filteredResources = resources.filter(resource => {
      // For low performers, focus on fundamental resources
      if (performanceLevel === 'needs_improvement') {
        return resource.difficulty === 'beginner' || resource.difficulty === 'intermediate'
      }
      // For high performers, include advanced resources
      if (performanceLevel === 'excellent') {
        return resource.difficulty === 'intermediate' || resource.difficulty === 'advanced'
      }
      // For average performers, focus on intermediate
      return resource.difficulty === 'intermediate'
    })

    // Get weak areas from questions to recommend specific resources
    const weakAreas = getWeaknessesFromQuestions(questionsAnswered)
    
    // Prioritize resources that match weak areas
    const prioritizedResources = filteredResources.map(resource => ({
      ...resource,
      relevanceScore: calculateResourceRelevance(resource, weakAreas, performanceLevel),
      recommendedFor: getRecommendationReason(resource, performanceLevel, weakAreas)
    })).sort((a, b) => b.relevanceScore - a.relevanceScore)

    return {
      resources: prioritizedResources.slice(0, 8), // Return top 8 most relevant
      weakAreas,
      performanceLevel,
      category,
      difficulty,
      totalResources: prioritizedResources.length
    }
  } catch (error) {
    console.error("Error generating personalized resources:", error)
    return {
      resources: [],
      weakAreas: [],
      performanceLevel,
      category,
      difficulty,
      totalResources: 0
    }
  }
}

// Helper functions for personalization
function getGoalsBasedOnPerformance(percentageScore: number, performanceLevel: string): string[] {
  if (performanceLevel === 'excellent') {
    return ['Master advanced concepts', 'Explore specialized topics', 'Achieve expert level']
  } else if (performanceLevel === 'good') {
    return ['Strengthen fundamentals', 'Practice advanced problems', 'Build consistency']
  } else if (performanceLevel === 'average') {
    return ['Review basic concepts', 'Practice regularly', 'Improve understanding']
  } else {
    return ['Master fundamentals', 'Build confidence', 'Practice basic problems']
  }
}

function getStrengthsFromQuestions(questionsAnswered: any): string[] {
  if (!questionsAnswered) return []
  
  const correctAnswers = questionsAnswered.filter((q: any) => q.isCorrect)
  const topics = correctAnswers.map((q: any) => q.topic).filter(Boolean)
  
  // Count topic frequency
  const topicCount = topics.reduce((acc: any, topic: string) => {
    acc[topic] = (acc[topic] || 0) + 1
    return acc
  }, {})
  
  return Object.entries(topicCount)
    .sort(([, a], [, b]) => (b as number) - (a as number))
    .slice(0, 3)
    .map(([topic]) => topic)
}

function getWeaknessesFromQuestions(questionsAnswered: any): string[] {
  if (!questionsAnswered) return []
  
  const incorrectAnswers = questionsAnswered.filter((q: any) => !q.isCorrect)
  const topics = incorrectAnswers.map((q: any) => q.topic).filter(Boolean)
  
  // Count topic frequency
  const topicCount = topics.reduce((acc: any, topic: string) => {
    acc[topic] = (acc[topic] || 0) + 1
    return acc
  }, {})
  
  return Object.entries(topicCount)
    .sort(([, a], [, b]) => (b as number) - (a as number))
    .slice(0, 3)
    .map(([topic]) => topic)
}

function getNextStepsBasedOnPerformance(percentageScore: number, performanceLevel: string, currentDifficulty: string): string[] {
  if (performanceLevel === 'excellent') {
    return [
      'Try advanced difficulty quizzes',
      'Explore specialized topics in this category',
      'Help others by explaining concepts'
    ]
  } else if (performanceLevel === 'good') {
    return [
      'Practice more intermediate problems',
      'Review concepts you found challenging',
      'Try the next difficulty level'
    ]
  } else if (performanceLevel === 'average') {
    return [
      'Review fundamental concepts',
      'Practice basic problems regularly',
      'Focus on understanding rather than speed'
    ]
  } else {
    return [
      'Start with beginner-level content',
      'Build confidence with easier problems',
      'Focus on core concepts'
    ]
  }
}

function analyzeTimePerformance(timeSpent: number, totalQuestions: number): any {
  const avgTimePerQuestion = timeSpent / totalQuestions
  const timeAnalysis = {
    avgTimePerQuestion,
    timeEfficiency: avgTimePerQuestion < 60 ? 'excellent' : avgTimePerQuestion < 120 ? 'good' : 'needs_improvement',
    recommendation: avgTimePerQuestion < 60 ? 'You\'re working efficiently' : 
                   avgTimePerQuestion < 120 ? 'Good pace, keep it up' : 
                   'Consider practicing to improve speed'
  }
  return timeAnalysis
}

function getCategorySpecificAdvice(category: string, percentageScore: number, performanceLevel: string): string {
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
  
  return adviceMap[category]?.[performanceLevel] || 
         'Continue practicing and focus on areas where you can improve'
}

function getLearnerType(percentageScore: number, performanceLevel: string): 'slow' | 'inBetween' | 'fast' {
  if (performanceLevel === 'excellent') return 'fast'
  if (performanceLevel === 'needs_improvement') return 'slow'
  return 'inBetween'
}

function enhanceFocusBasedOnPerformance(focus: string, percentageScore: number, performanceLevel: string): string {
  if (performanceLevel === 'needs_improvement') {
    return `Review and Master: ${focus}`
  } else if (performanceLevel === 'excellent') {
    return `Advanced: ${focus}`
  }
  return focus
}

function enhanceGoalsBasedOnPerformance(goals: string[], percentageScore: number, performanceLevel: string): string[] {
  if (performanceLevel === 'needs_improvement') {
    return goals.map(goal => `Master: ${goal}`)
  } else if (performanceLevel === 'excellent') {
    return goals.map(goal => `Advanced: ${goal}`)
  }
  return goals
}

function getWeekPriority(index: number, percentageScore: number, performanceLevel: string): 'high' | 'medium' | 'low' {
  if (performanceLevel === 'needs_improvement' && index === 0) return 'high'
  if (performanceLevel === 'excellent' && index === 0) return 'high'
  return 'medium'
}

function getEstimatedTime(learnerType: string, focus: string): number {
  const baseTime = 5 // hours
  if (learnerType === 'slow') return baseTime * 1.5
  if (learnerType === 'fast') return baseTime * 0.7
  return baseTime
}

function getDifficultyAdjustment(percentageScore: number, currentDifficulty: string): string {
  if (percentageScore >= 90) return 'increase'
  if (percentageScore < 50) return 'decrease'
  return 'maintain'
}

function calculateResourceRelevance(resource: any, weakAreas: string[], performanceLevel: string): number {
  let score = 0
  
  // Base score from rating
  score += (resource.rating || 0) * 10
  
  // Bonus for matching weak areas
  if (weakAreas.some(area => 
    resource.title.toLowerCase().includes(area.toLowerCase()) ||
    resource.topic.toLowerCase().includes(area.toLowerCase())
  )) {
    score += 50
  }
  
  // Bonus for appropriate difficulty
  if (performanceLevel === 'needs_improvement' && resource.difficulty === 'beginner') {
    score += 30
  } else if (performanceLevel === 'excellent' && resource.difficulty === 'advanced') {
    score += 30
  }
  
  return score
}

function getRecommendationReason(resource: any, performanceLevel: string, weakAreas: string[]): string {
  if (weakAreas.some(area => 
    resource.title.toLowerCase().includes(area.toLowerCase()) ||
    resource.topic.toLowerCase().includes(area.toLowerCase())
  )) {
    return 'Addresses your weak areas'
  }
  
  if (performanceLevel === 'needs_improvement' && resource.difficulty === 'beginner') {
    return 'Perfect for building fundamentals'
  }
  
  if (performanceLevel === 'excellent' && resource.difficulty === 'advanced') {
    return 'Challenges you to advance further'
  }
  
  return 'Well-rated resource for your level'
} 