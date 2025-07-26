import type { QuizResult, Question, User } from "./types"
import { prisma } from "@/lib/prisma"
import { RuleBasedEngine } from "./rule-based-engine"
import { recommendLearningPaths } from "./learning-paths"
import type { StudyPlanItem } from "./rule-based-engine"

export interface SmartQuizRecommendation {
  // Core recommendations
  weakAreas: string[]
  strongAreas: string[]
  recommendedResources: LearningResource[]
  nextQuizSuggestion: {
    category: string
    difficulty: string
    reason: string
    confidence: number
  }
  
  // Learning paths and study plans
  pathRecommendations: PathRecommendation[]
  studyPlan: StudyPlanItem[]
  
  // Advanced analytics
  performanceAnalytics: {
    overallScore: number
    categoryPerformance: Record<string, number>
    difficultyProgression: string[]
    learningTrend: "improving" | "declining" | "stable"
    timeSpentAnalysis: {
      averageTimePerQuestion: number
      timeEfficiency: "fast" | "optimal" | "slow"
    }
    topicMastery: Record<string, number>
  }
  
  // Personalized insights
  personalizedInsights: {
    learningStyle: "visual" | "reading" | "practice" | "mixed"
    recommendedStudyTime: number // hours per week
    focusAreas: string[]
    suggestedPace: "slow" | "moderate" | "fast"
  }
  
  // Adaptive features
  adaptiveRecommendations: {
    difficultyAdjustment: "increase" | "maintain" | "decrease"
    nextTopics: string[]
    skillGaps: string[]
    readinessForNextLevel: boolean
  }
}

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
  relevanceScore?: number
}

export interface PathRecommendation {
  path: any
  reason: string
  matchScore: number
  estimatedCompletionTime: string
  prerequisites: string[]
}

export interface UserLearningProfile {
  userId: string
  preferredCategories: string[]
  learningStyle: "visual" | "reading" | "practice" | "mixed"
  studyTimePerWeek: number
  goals: string[]
  currentLevel: Record<string, "beginner" | "intermediate" | "advanced">
  strengths: string[]
  weaknesses: string[]
  lastActive: Date
}

export class SmartQuizRecommendationEngine {
  private static instance: SmartQuizRecommendationEngine
  private userProfiles: Map<string, UserLearningProfile> = new Map()

  static getInstance(): SmartQuizRecommendationEngine {
    if (!SmartQuizRecommendationEngine.instance) {
      SmartQuizRecommendationEngine.instance = new SmartQuizRecommendationEngine()
    }
    return SmartQuizRecommendationEngine.instance
  }

  /**
   * Main recommendation generation method
   */
  async generateSmartRecommendations(
    quizResult: QuizResult,
    questions: Question[],
    userHistory: QuizResult[] = [],
    user?: User,
    learnerType: 'slow' | 'inBetween' | 'fast' = 'inBetween'
  ): Promise<SmartQuizRecommendation> {
    try {
      // Try AI-powered recommendations first
      const aiRecommendations = await this.generateAIRecommendations(
        quizResult,
        questions,
        userHistory,
        user
      )
      
      // Add learning path recommendations
      const pathRecs = await this.generateLearningPathRecommendations(
        userHistory,
        quizResult.category,
        quizResult.difficulty
      )
      
      // Generate study plan
      const studyPlan = await this.generatePersonalizedStudyPlan(
        quizResult,
        userHistory,
        learnerType
      )
      
      // Generate performance analytics
      const performanceAnalytics = this.analyzePerformance(
        quizResult,
        questions,
        userHistory
      )
      
      // Generate personalized insights
      const personalizedInsights = await this.generatePersonalizedInsights(
        userHistory,
        performanceAnalytics,
        user
      )
      
      // Generate adaptive recommendations
      const adaptiveRecommendations = this.generateAdaptiveRecommendations(
        quizResult,
        userHistory,
        performanceAnalytics
      )

      return {
        weakAreas: aiRecommendations.weakAreas || [],
        strongAreas: aiRecommendations.strongAreas || [],
        recommendedResources: aiRecommendations.recommendedResources || [],
        nextQuizSuggestion: aiRecommendations.nextQuizSuggestion || {
          category: quizResult.category,
          difficulty: quizResult.difficulty,
          reason: "Continue practicing in this area",
          confidence: 0.5
        },
        pathRecommendations: pathRecs,
        studyPlan,
        performanceAnalytics,
        personalizedInsights,
        adaptiveRecommendations,
      }
    } catch (error) {
      console.error("AI recommendations failed, falling back to rule-based system:", error)
      return await this.generateFallbackRecommendations(
        quizResult,
        questions,
        userHistory,
        learnerType
      )
    }
  }

  /**
   * AI-powered recommendation generation
   */
  private async generateAIRecommendations(
    quizResult: QuizResult,
    questions: Question[],
    userHistory: QuizResult[],
    user?: User
  ): Promise<Partial<SmartQuizRecommendation>> {
    const { category, difficulty, score, totalQuestions } = quizResult
    const percentage = (score / totalQuestions) * 100

    // Analyze weak and strong areas based on performance
    const { weakAreas, strongAreas } = this.analyzeWeakAndStrongAreas(
      quizResult,
      questions,
      percentage
    )

    // Get recommended resources
    const recommendedResources = await this.getRecommendedResources(
      category,
      weakAreas,
      strongAreas,
      percentage
    )

    // Generate next quiz suggestion with confidence
    const nextQuizSuggestion = this.generateNextQuizSuggestion(
      quizResult,
      userHistory,
      percentage
    )

    return {
      weakAreas,
      strongAreas,
      recommendedResources,
      nextQuizSuggestion,
    }
  }

  /**
   * Analyze weak and strong areas based on quiz performance
   */
  private analyzeWeakAndStrongAreas(
    quizResult: QuizResult,
    questions: Question[],
    percentage: number
  ): { weakAreas: string[]; strongAreas: string[] } {
    const weakAreas: string[] = []
    const strongAreas: string[] = []

    // Analyze performance by topic
    const topicPerformance = this.analyzeTopicPerformance(quizResult, questions)

    // Determine weak and strong areas based on performance
    if (percentage < 50) {
      weakAreas.push("fundamentals", "basic concepts")
      // Add specific weak topics
      Object.entries(topicPerformance)
        .filter(([, score]) => score < 50)
        .forEach(([topic]) => weakAreas.push(topic))
    } else if (percentage < 70) {
      weakAreas.push("intermediate concepts")
      strongAreas.push("fundamentals")
      // Add specific topics
      Object.entries(topicPerformance).forEach(([topic, score]) => {
        if (score < 60) weakAreas.push(topic)
        else if (score > 80) strongAreas.push(topic)
      })
    } else if (percentage < 90) {
      weakAreas.push("advanced concepts")
      strongAreas.push("fundamentals", "intermediate concepts")
      // Add specific topics
      Object.entries(topicPerformance).forEach(([topic, score]) => {
        if (score < 70) weakAreas.push(topic)
        else if (score > 85) strongAreas.push(topic)
      })
    } else {
      strongAreas.push("fundamentals", "intermediate concepts", "advanced concepts")
      // Add specific strong topics
      Object.entries(topicPerformance)
        .filter(([, score]) => score > 80)
        .forEach(([topic]) => strongAreas.push(topic))
    }

    return { weakAreas, strongAreas }
  }

  /**
   * Analyze performance by topic
   */
  private analyzeTopicPerformance(quizResult: QuizResult, questions: Question[]): Record<string, number> {
    const topicScores: Record<string, { correct: number; total: number }> = {}

    if (quizResult.questionsAnswered) {
      quizResult.questionsAnswered.forEach((answered, index) => {
        const question = questions[index]
        const topic = question.topic || "general"
        
        if (!topicScores[topic]) {
          topicScores[topic] = { correct: 0, total: 0 }
        }
        
        topicScores[topic].total++
        if (answered.isCorrect) {
          topicScores[topic].correct++
        }
      })
    }

    // Calculate percentage for each topic
    const topicPerformance: Record<string, number> = {}
    Object.entries(topicScores).forEach(([topic, scores]) => {
      topicPerformance[topic] = (scores.correct / scores.total) * 100
    })

    return topicPerformance
  }

  /**
   * Get recommended learning resources
   */
  private async getRecommendedResources(
    category: string,
    weakAreas: string[],
    strongAreas: string[],
    percentage: number
  ): Promise<LearningResource[]> {
    // Fetch resources from database
    let dbCategory = category
    if (category === 'computer-science') {
      dbCategory = 'Computer Science'
    }

    const dbResources = await prisma.learningResource.findMany({
      where: { category: dbCategory }
    })

    // Map to LearningResource interface
    const resources: LearningResource[] = dbResources.map((r: any) => ({
      id: r.id,
      title: r.title,
      type: this.validateResourceType(r.type),
      url: r.url,
      difficulty: this.validateDifficulty(r.difficulty),
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

    // Filter and rank resources based on performance and weak areas
    let recommendedResources: LearningResource[] = []

    if (percentage < 60) {
      // Focus on fundamentals and weak areas
      recommendedResources = resources
        .filter(r => r.difficulty === "beginner")
        .filter(r => weakAreas.some(area => 
          r.topic.toLowerCase().includes(area.toLowerCase()) ||
          r.title.toLowerCase().includes(area.toLowerCase())
        ))
        .slice(0, 3)
    } else if (percentage < 80) {
      // Mix of current level and next level
      const currentLevel = percentage < 70 ? "beginner" : "intermediate"
      const nextLevel = percentage < 70 ? "intermediate" : "advanced"
      
      recommendedResources = [
        ...resources.filter(r => r.difficulty === currentLevel).slice(0, 2),
        ...resources.filter(r => r.difficulty === nextLevel).slice(0, 1)
      ]
    } else {
      // Focus on advanced topics and strong areas
      recommendedResources = resources
        .filter(r => r.difficulty === "advanced" || r.difficulty === "intermediate")
        .filter(r => strongAreas.some(area => 
          r.topic.toLowerCase().includes(area.toLowerCase()) ||
          r.title.toLowerCase().includes(area.toLowerCase())
        ))
        .slice(0, 3)
    }

    // Add relevance scores
    recommendedResources = recommendedResources.map(resource => ({
      ...resource,
      relevanceScore: this.calculateRelevanceScore(resource, weakAreas, strongAreas, percentage)
    }))

    // Sort by relevance score
    return recommendedResources.sort((a, b) => 
      (b.relevanceScore || 0) - (a.relevanceScore || 0)
    )
  }

  /**
   * Calculate relevance score for a resource
   */
  private calculateRelevanceScore(
    resource: LearningResource,
    weakAreas: string[],
    strongAreas: string[],
    percentage: number
  ): number {
    let score = 0

    // Base score from rating
    score += resource.rating * 10

    // Bonus for addressing weak areas
    const weakAreaMatch = weakAreas.some(area => 
      resource.topic.toLowerCase().includes(area.toLowerCase()) ||
      resource.title.toLowerCase().includes(area.toLowerCase())
    )
    if (weakAreaMatch) score += 30

    // Bonus for building on strong areas
    const strongAreaMatch = strongAreas.some(area => 
      resource.topic.toLowerCase().includes(area.toLowerCase()) ||
      resource.title.toLowerCase().includes(area.toLowerCase())
    )
    if (strongAreaMatch) score += 20

    // Difficulty appropriateness
    if (percentage < 60 && resource.difficulty === "beginner") score += 15
    else if (percentage >= 60 && percentage < 80 && resource.difficulty === "intermediate") score += 15
    else if (percentage >= 80 && resource.difficulty === "advanced") score += 15

    return score
  }

  /**
   * Generate next quiz suggestion with confidence
   */
  private generateNextQuizSuggestion(
    quizResult: QuizResult,
    userHistory: QuizResult[],
    percentage: number
  ): SmartQuizRecommendation["nextQuizSuggestion"] {
    let difficulty = quizResult.difficulty
    let reason = ""
    let confidence = 0.8

    if (percentage < 50) {
      difficulty = "beginner"
      reason = "Focus on fundamentals to build a strong foundation"
      confidence = 0.9
    } else if (percentage < 70) {
      reason = "Practice more at your current level to improve consistency"
      confidence = 0.7
    } else if (percentage >= 90) {
      difficulty = this.getNextDifficulty(quizResult.difficulty)
      reason = "Challenge yourself with harder questions to continue growing"
      confidence = 0.85
    } else {
      difficulty = this.getNextDifficulty(quizResult.difficulty)
      reason = "You're ready for the next level of difficulty"
      confidence = 0.75
    }

    // Consider user history for more accurate suggestions
    if (userHistory.length > 0) {
      const recentPerformance = this.analyzeRecentPerformance(userHistory)
      if (recentPerformance.trend === "declining") {
        difficulty = this.getPreviousDifficulty(difficulty)
        reason = "Recent performance suggests focusing on current level"
        confidence = 0.9
      } else if (recentPerformance.trend === "improving") {
        confidence += 0.1
      }
    }

    return {
      category: quizResult.category,
      difficulty,
      reason,
      confidence: Math.min(confidence, 1.0)
    }
  }

  /**
   * Generate learning path recommendations
   */
  private async generateLearningPathRecommendations(
    userHistory: QuizResult[],
    category: string,
    difficulty: string
  ): Promise<PathRecommendation[]> {
    try {
      const pathRecs = await recommendLearningPaths(
        userHistory,
        { categories: [category], difficulty }
      )

      return pathRecs.map(rec => ({
        ...rec,
        estimatedCompletionTime: this.estimateCompletionTime(rec.path, userHistory),
        prerequisites: this.extractPrerequisites(rec.path)
      }))
    } catch (error) {
      console.error("Error generating learning path recommendations:", error)
      return []
    }
  }

  /**
   * Generate personalized study plan
   */
  private async generatePersonalizedStudyPlan(
    quizResult: QuizResult,
    userHistory: QuizResult[],
    learnerType: 'slow' | 'inBetween' | 'fast'
  ): Promise<StudyPlanItem[]> {
    const topic = this.inferTopicFromQuizResult(quizResult)
    
    try {
      return RuleBasedEngine.getStudyPlanForSubjectAndLearnerType(topic, learnerType)
    } catch (error) {
      console.error("Error generating study plan:", error)
      return this.generateFallbackStudyPlan(quizResult.category, learnerType)
    }
  }

  /**
   * Generate performance analytics
   */
  private analyzePerformance(
    quizResult: QuizResult,
    questions: Question[],
    userHistory: QuizResult[]
  ): SmartQuizRecommendation["performanceAnalytics"] {
    const overallScore = (quizResult.score / quizResult.totalQuestions) * 100
    
    // Analyze category performance
    const categoryPerformance = this.analyzeCategoryPerformance(userHistory)
    
    // Analyze difficulty progression
    const difficultyProgression = this.analyzeDifficultyProgression(userHistory)
    
    // Analyze learning trend
    const learningTrend = this.analyzeLearningTrend(userHistory)
    
    // Analyze time spent
    const timeSpentAnalysis = this.analyzeTimeSpent(quizResult, questions)
    
    // Analyze topic mastery
    const topicMastery = this.analyzeTopicMastery(quizResult, questions)

    return {
      overallScore,
      categoryPerformance,
      difficultyProgression,
      learningTrend,
      timeSpentAnalysis,
      topicMastery
    }
  }

  /**
   * Generate personalized insights
   */
  private async generatePersonalizedInsights(
    userHistory: QuizResult[],
    performanceAnalytics: SmartQuizRecommendation["performanceAnalytics"],
    user?: User
  ): Promise<SmartQuizRecommendation["personalizedInsights"]> {
    // Determine learning style based on performance patterns
    const learningStyle = this.determineLearningStyle(userHistory, performanceAnalytics)
    
    // Calculate recommended study time
    const recommendedStudyTime = this.calculateRecommendedStudyTime(userHistory, performanceAnalytics)
    
    // Identify focus areas
    const focusAreas = this.identifyFocusAreas(performanceAnalytics)
    
    // Determine suggested pace
    const suggestedPace = this.determineSuggestedPace(userHistory, performanceAnalytics)

    return {
      learningStyle,
      recommendedStudyTime,
      focusAreas,
      suggestedPace
    }
  }

  /**
   * Generate adaptive recommendations
   */
  private generateAdaptiveRecommendations(
    quizResult: QuizResult,
    userHistory: QuizResult[],
    performanceAnalytics: SmartQuizRecommendation["performanceAnalytics"]
  ): SmartQuizRecommendation["adaptiveRecommendations"] {
    const percentage = (quizResult.score / quizResult.totalQuestions) * 100
    
    // Determine difficulty adjustment
    let difficultyAdjustment: "increase" | "maintain" | "decrease" = "maintain"
    if (percentage >= 85) difficultyAdjustment = "increase"
    else if (percentage < 50) difficultyAdjustment = "decrease"
    
    // Identify next topics
    const nextTopics = this.identifyNextTopics(quizResult, userHistory)
    
    // Identify skill gaps
    const skillGaps = this.identifySkillGaps(performanceAnalytics)
    
    // Determine readiness for next level
    const readinessForNextLevel = this.determineReadinessForNextLevel(
      quizResult,
      userHistory,
      performanceAnalytics
    )

    return {
      difficultyAdjustment,
      nextTopics,
      skillGaps,
      readinessForNextLevel
    }
  }

  /**
   * Generate fallback recommendations using rule-based system
   */
  private async generateFallbackRecommendations(
    quizResult: QuizResult,
    questions: Question[],
    userHistory: QuizResult[],
    learnerType: 'slow' | 'inBetween' | 'fast'
  ): Promise<SmartQuizRecommendation> {
    try {
      const ruleBasedRecs = await RuleBasedEngine.generateRecommendations(
        userHistory,
        quizResult.category
      )

      const pathRecs = await this.generateLearningPathRecommendations(
        userHistory,
        quizResult.category,
        quizResult.difficulty
      )

      const studyPlan = await this.generatePersonalizedStudyPlan(
        quizResult,
        userHistory,
        learnerType
      )

      const performanceAnalytics = this.analyzePerformance(
        quizResult,
        questions,
        userHistory
      )

      const personalizedInsights = await this.generatePersonalizedInsights(
        userHistory,
        performanceAnalytics
      )

      const adaptiveRecommendations = this.generateAdaptiveRecommendations(
        quizResult,
        userHistory,
        performanceAnalytics
      )

      return {
        weakAreas: this.inferWeakAreas(quizResult),
        strongAreas: this.inferStrongAreas(quizResult),
        recommendedResources: ruleBasedRecs.resources.map(this.mapResourceToLearningResource),
        nextQuizSuggestion: {
          ...ruleBasedRecs.nextQuizSuggestion,
          confidence: 0.7
        },
        pathRecommendations: pathRecs,
        studyPlan,
        performanceAnalytics,
        personalizedInsights,
        adaptiveRecommendations
      }
    } catch (error) {
      console.error("Rule-based engine failed, using basic fallback:", error)
      return this.generateBasicFallbackRecommendations(quizResult, learnerType)
    }
  }

  // Helper methods
  private validateResourceType(type: string): LearningResource["type"] {
    const validTypes = ["video", "article", "practice", "tutorial", "course", "book", "interactive", "podcast"]
    return validTypes.includes(type) ? type as LearningResource["type"] : "article"
  }

  private validateDifficulty(difficulty: string): LearningResource["difficulty"] {
    const validDifficulties = ["beginner", "intermediate", "advanced"]
    return validDifficulties.includes(difficulty) ? difficulty as LearningResource["difficulty"] : "beginner"
  }

  private getNextDifficulty(current: string): string {
    const levels = ["beginner", "intermediate", "advanced"]
    const currentIndex = levels.indexOf(current)
    return currentIndex < levels.length - 1 ? levels[currentIndex + 1] : current
  }

  private getPreviousDifficulty(current: string): string {
    const levels = ["beginner", "intermediate", "advanced"]
    const currentIndex = levels.indexOf(current)
    return currentIndex > 0 ? levels[currentIndex - 1] : current
  }

  private inferTopicFromQuizResult(quizResult: QuizResult): string {
    if (quizResult.questionsAnswered && quizResult.questionsAnswered.length > 0) {
      const topicCounts: Record<string, number> = {}
      for (const q of quizResult.questionsAnswered) {
        if (q.topic) {
          topicCounts[q.topic] = (topicCounts[q.topic] || 0) + 1
        }
      }
      const sorted = Object.entries(topicCounts).sort((a, b) => b[1] - a[1])
      if (sorted.length > 0) return sorted[0][0]
    }
    return quizResult.category
  }

  private analyzeCategoryPerformance(history: QuizResult[]): Record<string, number> {
    const performance: Record<string, { totalScore: number; count: number }> = {}
    
    history.forEach(quiz => {
      const score = (quiz.score / quiz.totalQuestions) * 100
      if (!performance[quiz.category]) {
        performance[quiz.category] = { totalScore: 0, count: 0 }
      }
      performance[quiz.category].totalScore += score
      performance[quiz.category].count++
    })

    const result: Record<string, number> = {}
    Object.entries(performance).forEach(([category, data]) => {
      result[category] = data.totalScore / data.count
    })

    return result
  }

  private analyzeDifficultyProgression(history: QuizResult[]): string[] {
    return history
      .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
      .map(quiz => quiz.difficulty)
  }

  private analyzeLearningTrend(history: QuizResult[]): "improving" | "declining" | "stable" {
    if (history.length < 2) return "stable"
    
    const scores = history.map(result => (result.score / result.totalQuestions) * 100)
    const recentScores = scores.slice(-3)
    const earlierScores = scores.slice(0, -3)
    
    if (earlierScores.length === 0) return "stable"
    
    const recentAvg = recentScores.reduce((sum, score) => sum + score, 0) / recentScores.length
    const earlierAvg = earlierScores.reduce((sum, score) => sum + score, 0) / earlierScores.length
    
    if (recentAvg > earlierAvg + 5) return "improving"
    if (recentAvg < earlierAvg - 5) return "declining"
    return "stable"
  }

  private analyzeTimeSpent(
    quizResult: QuizResult,
    questions: Question[]
  ): { averageTimePerQuestion: number; timeEfficiency: "fast" | "optimal" | "slow" } {
    const averageTimePerQuestion = quizResult.timeSpent / quizResult.totalQuestions
    
    let timeEfficiency: "fast" | "optimal" | "slow" = "optimal"
    if (averageTimePerQuestion < 30) timeEfficiency = "fast"
    else if (averageTimePerQuestion > 90) timeEfficiency = "slow"
    
    return { averageTimePerQuestion, timeEfficiency }
  }

  private analyzeTopicMastery(
    quizResult: QuizResult,
    questions: Question[]
  ): Record<string, number> {
    return this.analyzeTopicPerformance(quizResult, questions)
  }

  private analyzeRecentPerformance(history: QuizResult[]): { trend: "improving" | "declining" | "stable" } {
    return { trend: this.analyzeLearningTrend(history) }
  }

  private estimateCompletionTime(path: any, userHistory: QuizResult[]): string {
    // Simple estimation based on user's average pace
    const avgTimePerQuiz = userHistory.length > 0 
      ? userHistory.reduce((sum, quiz) => sum + quiz.timeSpent, 0) / userHistory.length
      : 600 // Default 10 minutes
    
    const estimatedWeeks = Math.ceil((path.modules || 12) / 3) // Assume 3 modules per week
    return `${estimatedWeeks} weeks`
  }

  private extractPrerequisites(path: any): string[] {
    return path.skills || []
  }

  private generateFallbackStudyPlan(category: string, learnerType: 'slow' | 'inBetween' | 'fast'): StudyPlanItem[] {
    return [
      {
        week: 1,
        focus: `Getting Started with ${category}`,
        resources: [],
        quizTopics: ["fundamentals"],
        goals: ["Begin learning journey"]
      }
    ]
  }

  private determineLearningStyle(
    userHistory: QuizResult[],
    performanceAnalytics: SmartQuizRecommendation["performanceAnalytics"]
  ): "visual" | "reading" | "practice" | "mixed" {
    // Simple heuristic based on performance patterns
    if (performanceAnalytics.timeSpentAnalysis.timeEfficiency === "fast") return "visual"
    if (performanceAnalytics.overallScore > 80) return "practice"
    return "mixed"
  }

  private calculateRecommendedStudyTime(
    userHistory: QuizResult[],
    performanceAnalytics: SmartQuizRecommendation["performanceAnalytics"]
  ): number {
    // Base recommendation: 5 hours per week
    let baseTime = 5
    
    // Adjust based on performance
    if (performanceAnalytics.overallScore < 60) baseTime += 2
    if (performanceAnalytics.learningTrend === "declining") baseTime += 1
    
    return Math.min(baseTime, 15) // Cap at 15 hours per week
  }

  private identifyFocusAreas(
    performanceAnalytics: SmartQuizRecommendation["performanceAnalytics"]
  ): string[] {
    const focusAreas: string[] = []
    
    // Add areas with low performance
    Object.entries(performanceAnalytics.categoryPerformance)
      .filter(([, score]) => score < 70)
      .forEach(([category]) => focusAreas.push(category))
    
    // Add weak topics
    Object.entries(performanceAnalytics.topicMastery)
      .filter(([, score]) => score < 60)
      .forEach(([topic]) => focusAreas.push(topic))
    
    return focusAreas.slice(0, 3) // Limit to top 3
  }

  private determineSuggestedPace(
    userHistory: QuizResult[],
    performanceAnalytics: SmartQuizRecommendation["performanceAnalytics"]
  ): "slow" | "moderate" | "fast" {
    if (performanceAnalytics.learningTrend === "declining") return "slow"
    if (performanceAnalytics.overallScore > 85) return "fast"
    return "moderate"
  }

  private identifyNextTopics(
    quizResult: QuizResult,
    userHistory: QuizResult[]
  ): string[] {
    // Simple implementation - could be enhanced with topic progression logic
    const currentTopics = new Set<string>()
    if (quizResult.questionsAnswered) {
      quizResult.questionsAnswered.forEach(q => {
        if (q.topic) currentTopics.add(q.topic)
      })
    }
    
    // Return some common next topics (this could be more sophisticated)
    return ["advanced concepts", "practical applications", "real-world scenarios"]
  }

  private identifySkillGaps(
    performanceAnalytics: SmartQuizRecommendation["performanceAnalytics"]
  ): string[] {
    const gaps: string[] = []
    
    // Identify gaps based on topic mastery
    Object.entries(performanceAnalytics.topicMastery)
      .filter(([, score]) => score < 70)
      .forEach(([topic]) => gaps.push(topic))
    
    return gaps.slice(0, 3) // Limit to top 3
  }

  private determineReadinessForNextLevel(
    quizResult: QuizResult,
    userHistory: QuizResult[],
    performanceAnalytics: SmartQuizRecommendation["performanceAnalytics"]
  ): boolean {
    const percentage = (quizResult.score / quizResult.totalQuestions) * 100
    
    // Ready if:
    // 1. Current performance is high
    // 2. Learning trend is improving
    // 3. Time efficiency is good
    return (
      percentage >= 80 &&
      performanceAnalytics.learningTrend === "improving" &&
      performanceAnalytics.timeSpentAnalysis.timeEfficiency !== "slow"
    )
  }

  private inferWeakAreas(quizResult: QuizResult): string[] {
    const percentage = (quizResult.score / quizResult.totalQuestions) * 100
    if (percentage < 50) return ["fundamentals", "basic concepts"]
    if (percentage < 70) return ["intermediate concepts"]
    if (percentage < 90) return ["advanced concepts"]
    return []
  }

  private inferStrongAreas(quizResult: QuizResult): string[] {
    const percentage = (quizResult.score / quizResult.totalQuestions) * 100
    if (percentage >= 90) return ["fundamentals", "intermediate concepts", "advanced concepts"]
    if (percentage >= 70) return ["fundamentals", "intermediate concepts"]
    if (percentage >= 50) return ["fundamentals"]
    return []
  }

  private mapResourceToLearningResource(resource: any): LearningResource {
    return {
      id: resource.id,
      title: resource.title,
      type: this.validateResourceType(resource.type),
      url: resource.url,
      difficulty: this.validateDifficulty(resource.difficulty),
      category: resource.category,
      topic: resource.topic,
      description: resource.description,
      duration: resource.duration,
      readTime: resource.readTime,
      provider: resource.provider,
      rating: resource.rating,
      tags: resource.tags,
      prerequisites: resource.prerequisites,
      language: resource.language,
      isFree: resource.isFree,
      certification: resource.certification,
    }
  }

  private generateBasicFallbackRecommendations(
    quizResult: QuizResult,
    learnerType: 'slow' | 'inBetween' | 'fast'
  ): SmartQuizRecommendation {
    return {
      weakAreas: this.inferWeakAreas(quizResult),
      strongAreas: this.inferStrongAreas(quizResult),
      recommendedResources: [],
      nextQuizSuggestion: {
        category: quizResult.category,
        difficulty: "beginner",
        reason: "Start with fundamentals",
        confidence: 0.5
      },
      pathRecommendations: [],
      studyPlan: this.generateFallbackStudyPlan(quizResult.category, learnerType),
      performanceAnalytics: {
        overallScore: (quizResult.score / quizResult.totalQuestions) * 100,
        categoryPerformance: {},
        difficultyProgression: [],
        learningTrend: "stable",
        timeSpentAnalysis: {
          averageTimePerQuestion: quizResult.timeSpent / quizResult.totalQuestions,
          timeEfficiency: "optimal"
        },
        topicMastery: {}
      },
      personalizedInsights: {
        learningStyle: "mixed",
        recommendedStudyTime: 5,
        focusAreas: [],
        suggestedPace: "moderate"
      },
      adaptiveRecommendations: {
        difficultyAdjustment: "maintain",
        nextTopics: [],
        skillGaps: [],
        readinessForNextLevel: false
      }
    }
  }
}

// Export singleton instance
export const smartQuizRecommendationEngine = SmartQuizRecommendationEngine.getInstance() 