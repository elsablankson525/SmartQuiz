import { prisma } from "./prisma"
import { multiAIService } from "./multi-ai-service"
import { RuleBasedEngine } from "./rule-based-engine"
import { youtubeService } from "./youtube-service"
import type {
  QuizResult,
  Question,
  User,
  LearningResource,
  StudyPlanItem,
  PathRecommendation,
  PerformanceMetrics,
  AIAnalysis,
  AIPredictions,
  AIRecommendations,
  CollaborativeInsights,
  YouTubeVideo
} from "./types"

// Core recommendation interface
export interface Recommendation {
  weakAreas: string[]
  strongAreas: string[]
  resources: LearningResource[]
  studyPlan: StudyPlanItem[]
  pathRecommendations: PathRecommendation[]
  performanceAnalytics: PerformanceMetrics
  aiAnalysis?: AIAnalysis
  aiPredictions?: AIPredictions
  aiRecommendations?: AIRecommendations
  collaborativeInsights?: CollaborativeInsights
  youtubeVideos?: YouTubeVideo[]
  metadata: {
    generatedAt: string
    version: string
    confidence: number
    processingTime: number
    fallbackMode?: boolean
    recommendationType?: 'ai-powered' | 'rule-based'
  }
}

export class RecommendationEngine {
  private static instance: RecommendationEngine

  private constructor() {}

  static getInstance(): RecommendationEngine {
    if (!RecommendationEngine.instance) {
      RecommendationEngine.instance = new RecommendationEngine()
    }
    return RecommendationEngine.instance
  }

  /**
   * Main recommendation generation method
   */
  async generateRecommendations(
    quizResult: QuizResult,
    questions: Question[],
    userHistory: QuizResult[] = [],
    user?: User,
    learnerType: 'slow' | 'inBetween' | 'fast' = 'inBetween'
  ): Promise<Recommendation> {
    const startTime = Date.now()
    let fallbackMode = false

    try {
      // Analyze performance
      const performanceAnalytics = this.analyzePerformance(quizResult, questions, userHistory)
      
      // Identify weak and strong areas
      const weakAreas = this.identifyWeakAreas(quizResult, questions)
      const strongAreas = this.identifyStrongAreas(quizResult, questions)
      
      // Get learning resources
      const resources = await this.getLearningResources(quizResult.category, weakAreas)
      
      // Generate study plan
      const studyPlan = this.generateStudyPlan(quizResult, weakAreas, learnerType)
      
      // Get learning path recommendations
      const pathRecommendations = await this.getLearningPathRecommendations(
        userHistory,
        quizResult.category,
        quizResult.difficulty
      )
      
      // Get YouTube videos (with error handling)
      let youtubeVideos: YouTubeVideo[] = []
      try {
        youtubeVideos = await this.getYouTubeVideos(quizResult.category, weakAreas)
      } catch (error) {
        console.warn("YouTube API failed, skipping video recommendations:", error)
      }
      
      // Generate AI analysis (with fallback)
      let aiAnalysis: AIAnalysis | undefined
      try {
        aiAnalysis = await this.generateAIAnalysis(quizResult, userHistory, performanceAnalytics)
      } catch (error) {
        console.warn("AI analysis failed, using fallback:", error)
        aiAnalysis = this.getFallbackAIAnalysis(quizResult, userHistory, performanceAnalytics)
        fallbackMode = true
      }
      
      // Generate AI predictions (rule-based fallback)
      const aiPredictions = this.generateAIPredictions(quizResult, userHistory, performanceAnalytics)
      
      // Generate AI recommendations (with fallback)
      let aiRecommendations: AIRecommendations | undefined
      try {
        aiRecommendations = await this.generateAIRecommendations(quizResult, weakAreas, resources)
      } catch (error) {
        console.warn("AI recommendations failed, using fallback:", error)
        aiRecommendations = this.getFallbackAIRecommendations(quizResult, weakAreas, resources)
        fallbackMode = true
      }
      
      // Generate collaborative insights (with fallback)
      let collaborativeInsights: CollaborativeInsights | undefined
      try {
        collaborativeInsights = await this.generateCollaborativeInsights(userHistory, quizResult.category)
      } catch (error) {
        console.warn("Collaborative insights failed, using fallback:", error)
        collaborativeInsights = this.getFallbackCollaborativeInsights(userHistory, quizResult.category)
        fallbackMode = true
      }

      const processingTime = Date.now() - startTime

      return {
        weakAreas,
        strongAreas,
        resources,
        studyPlan,
        pathRecommendations,
        performanceAnalytics,
        aiAnalysis,
        aiPredictions,
        aiRecommendations,
        collaborativeInsights,
        youtubeVideos,
        metadata: {
          generatedAt: new Date().toISOString(),
          version: "1.0.0",
          confidence: this.calculateConfidence(performanceAnalytics, userHistory.length),
          processingTime,
          fallbackMode,
          recommendationType: fallbackMode ? 'rule-based' : 'ai-powered'
        }
      }
    } catch (error) {
      console.error("Error generating recommendations:", error)
      return this.generateFallbackRecommendations(quizResult, questions)
    }
  }

  /**
   * Analyze quiz performance
   */
  private analyzePerformance(
    quizResult: QuizResult,
    _questions: Question[],
    userHistory: QuizResult[]
  ): PerformanceMetrics {
    const percentage = (quizResult.score / quizResult.totalQuestions) * 100
    const avgTimePerQuestion = quizResult.timeSpent / quizResult.totalQuestions
    const accuracy = quizResult.score / quizResult.totalQuestions

    // Determine level
    let level: 'excellent' | 'good' | 'needs_improvement'
    if (percentage >= 80) level = 'excellent'
    else if (percentage >= 60) level = 'good'
    else level = 'needs_improvement'

    // Determine time efficiency
    let timeEfficiency: 'fast' | 'optimal' | 'slow'
    const avgTime = userHistory.length > 0 
      ? userHistory.reduce((sum, result) => sum + result.timeSpent / result.totalQuestions, 0) / userHistory.length
      : 60 // Default 60 seconds per question
    
    if (avgTimePerQuestion < avgTime * 0.8) timeEfficiency = 'fast'
    else if (avgTimePerQuestion > avgTime * 1.2) timeEfficiency = 'slow'
    else timeEfficiency = 'optimal'

    return {
      score: quizResult.score,
      percentage,
      level,
      timeSpent: quizResult.timeSpent,
      timeEfficiency,
      avgTimePerQuestion,
      accuracy
    }
  }

  /**
   * Identify weak areas based on incorrect answers
   */
  private identifyWeakAreas(quizResult: QuizResult, _questions: Question[]): string[] {
    if (!quizResult.questionsAnswered) return []

    const incorrectTopics = quizResult.questionsAnswered
      .filter(q => !q.isCorrect)
      .map(q => q.topic || 'General')
      .filter(Boolean)

    // Count frequency and return most common weak areas
    const topicCounts = incorrectTopics.reduce((acc, topic) => {
      acc[topic] = (acc[topic] || 0) + 1
      return acc
    }, {} as Record<string, number>)

    return Object.entries(topicCounts)
      .sort(([,a], [,b]) => b - a)
      .slice(0, 3)
      .map(([topic]) => topic)
  }

  /**
   * Identify strong areas based on correct answers
   */
  private identifyStrongAreas(quizResult: QuizResult, _questions: Question[]): string[] {
    if (!quizResult.questionsAnswered) return []

    const correctTopics = quizResult.questionsAnswered
      .filter(q => q.isCorrect)
      .map(q => q.topic || 'General')
      .filter(Boolean)

    const topicCounts = correctTopics.reduce((acc, topic) => {
      acc[topic] = (acc[topic] || 0) + 1
      return acc
    }, {} as Record<string, number>)

    return Object.entries(topicCounts)
      .sort(([,a], [,b]) => b - a)
      .slice(0, 3)
      .map(([topic]) => topic)
  }

  /**
   * Get learning resources from database
   */
  private async getLearningResources(category: string, weakAreas: string[]): Promise<LearningResource[]> {
    try {
      const resources = await prisma.learningResource.findMany({
        where: {
          OR: [
            { category },
            { topic: { in: weakAreas } }
          ]
        },
        take: 10,
        orderBy: { rating: 'desc' }
      })

      return resources.map(resource => ({
        id: resource.id,
        title: resource.title,
        type: resource.type as LearningResource['type'],
        url: resource.url,
        difficulty: resource.difficulty,
        relevanceScore: resource.rating || 0.5,
        estimatedTime: 30, // Default 30 minutes
        description: resource.description,
        tags: resource.tags,
        category: resource.category,
        topic: resource.topic,
        readTime: resource.readTime || undefined,
        duration: resource.duration || undefined,
        provider: resource.provider || undefined,
        rating: resource.rating || undefined,
        language: resource.language || undefined,
        isFree: resource.isFree || undefined,
        certification: resource.certification || undefined
      }))
    } catch (error) {
      console.error("Error fetching learning resources:", error)
      return []
    }
  }

  /**
   * Generate personalized study plan
   */
  private generateStudyPlan(
    quizResult: QuizResult,
    weakAreas: string[],
    learnerType: 'slow' | 'inBetween' | 'fast'
  ): StudyPlanItem[] {
    const baseHours = learnerType === 'slow' ? 8 : learnerType === 'fast' ? 4 : 6
    
    return weakAreas.map((area, index) => ({
      week: index + 1,
      focus: area,
      activities: [
        `Review ${area} fundamentals`,
        `Practice ${area} problems`,
        `Take ${area} assessment`
      ],
      estimatedHours: baseHours,
      resources: [`${area} tutorial`, `${area} practice set`],
      milestones: [`Complete ${area} basics`, `Score 80%+ on ${area} quiz`],
      prerequisites: index > 0 ? [weakAreas[index - 1]] : undefined,
      goals: [`Master ${area} concepts`, `Apply ${area} knowledge`]
    }))
  }

  /**
   * Get learning path recommendations
   */
  private async getLearningPathRecommendations(
    userHistory: QuizResult[],
    category: string,
    difficulty: string
  ): Promise<PathRecommendation[]> {
    try {
      const paths = await prisma.learningPath.findMany({
        where: {
          category,
          difficulty
        },
        take: 5,
        orderBy: { rating: 'desc' }
      })

      return paths.map(path => ({
        path: {
          id: path.id,
          title: path.title,
          description: path.description,
          category: path.category,
          difficulty: path.difficulty,
          duration: path.duration || undefined,
          modules: path.modules || undefined,
          enrolled: path.enrolled || undefined,
          rating: path.rating || undefined,
          progress: path.progress || undefined,
          color: path.color || undefined,
          icon: path.icon || undefined,
          skills: path.skills,
          instructor: path.instructor || undefined,
          isPopular: path.isPopular || undefined,
          createdAt: path.createdAt,
          updatedAt: path.updatedAt,
          milestones: [] // Will be populated separately if needed
        },
        reason: `Recommended based on your ${category} performance`,
        matchScore: 0.85,
        estimatedCompletionTime: path.duration || "4 weeks",
        prerequisites: []
      }))
    } catch (error) {
      console.error("Error fetching learning paths:", error)
      return []
    }
  }

  /**
   * Get YouTube videos using the YouTube service
   */
  private async getYouTubeVideos(category: string, weakAreas: string[]): Promise<YouTubeVideo[]> {
    try {
      // Check if YouTube API is available
      const apiStatus = await youtubeService.getApiStatus()
      if (!apiStatus.available) {
        console.warn("YouTube API not available, skipping video recommendations")
        return []
      }

      const allVideos: Array<{ id: string; title: string; url: string; duration: string; relevanceScore: number; difficulty: string; thumbnail: string; channelTitle: string; viewCount: number; description: string; tags: string[] }> = []
      
      // Get videos for the main category
      const categoryVideos = await youtubeService.getSubjectVideos(
        category, 
        'beginner', // Default to beginner, could be made dynamic based on user level
        3
      )
      allVideos.push(...categoryVideos)

      // Get videos for weak areas (top 2 weak areas to avoid too many requests)
      const topWeakAreas = weakAreas.slice(0, 2)
      for (const weakArea of topWeakAreas) {
        const weakAreaVideos = await youtubeService.getTopicVideos(
          weakArea,
          'visual', // Default learning style, could be personalized
          2
        )
        allVideos.push(...weakAreaVideos)
      }

      // Remove duplicates and sort by relevance score
      const uniqueVideos = this.removeDuplicateVideos(allVideos)
      
      // Map to the expected YouTubeVideo type with required properties
      const mappedVideos: YouTubeVideo[] = uniqueVideos.slice(0, 8).map(video => ({
        id: video.id,
        title: video.title,
        url: video.url,
        duration: video.duration,
        relevanceScore: video.relevanceScore,
        difficulty: video.difficulty,
        learningStyle: this.determineLearningStyle(video, weakAreas),
        aiReasoning: this.generateAIReasoning(video, category, weakAreas),
        thumbnail: video.thumbnail,
        channelTitle: video.channelTitle,
        viewCount: video.viewCount,
        description: video.description,
        tags: video.tags
      }))

      return mappedVideos

    } catch (error) {
      console.error("Error fetching YouTube videos:", error)
      return []
    }
  }

  /**
   * Remove duplicate videos based on video ID
   */
  private removeDuplicateVideos(videos: Array<{ id: string; title: string; url: string; duration: string; relevanceScore: number; difficulty: string; thumbnail: string; channelTitle: string; viewCount: number; description: string; tags: string[] }>): Array<{ id: string; title: string; url: string; duration: string; relevanceScore: number; difficulty: string; thumbnail: string; channelTitle: string; viewCount: number; description: string; tags: string[] }> {
    const seen = new Set<string>()
    return videos.filter(video => {
      if (seen.has(video.id)) {
        return false
      }
      seen.add(video.id)
      return true
    })
  }

  /**
   * Determine learning style based on video content and weak areas
   */
  private determineLearningStyle(video: { title: string; description?: string }, _weakAreas: string[]): string {
    // Analyze video title and description for learning style indicators
    const title = video.title.toLowerCase()
    const description = video.description?.toLowerCase() || ''
    const combinedText = `${title} ${description}`

    if (combinedText.includes('visual') || combinedText.includes('diagram') || combinedText.includes('chart')) {
      return 'visual'
    } else if (combinedText.includes('audio') || combinedText.includes('podcast') || combinedText.includes('lecture')) {
      return 'auditory'
    } else if (combinedText.includes('practice') || combinedText.includes('exercise') || combinedText.includes('hands-on')) {
      return 'kinesthetic'
    } else if (combinedText.includes('tutorial') || combinedText.includes('guide') || combinedText.includes('step-by-step')) {
      return 'reading'
    } else {
      return 'mixed'
    }
  }

  /**
   * Generate AI reasoning for video recommendation
   */
  private generateAIReasoning(video: { title: string; description?: string; viewCount: number; relevanceScore: number }, category: string, weakAreas: string[]): string {
    const reasons = []
    
    // Category relevance
    reasons.push(`Relevant to ${category} category`)
    
    // Weak area targeting
    if (weakAreas.length > 0) {
      const matchingWeakAreas = weakAreas.filter(area => 
        video.title.toLowerCase().includes(area.toLowerCase()) ||
        video.description?.toLowerCase().includes(area.toLowerCase())
      )
      if (matchingWeakAreas.length > 0) {
        reasons.push(`Addresses weak areas: ${matchingWeakAreas.join(', ')}`)
      }
    }
    
    // Video quality indicators
    if (video.viewCount > 10000) {
      reasons.push('Popular and well-received content')
    }
    if (video.relevanceScore > 0.7) {
      reasons.push('High relevance score')
    }
    
    return reasons.join('. ') + '.'
  }

  /**
   * Generate AI analysis
   */
  private async generateAIAnalysis(
    quizResult: QuizResult,
    userHistory: QuizResult[],
    performanceAnalytics: PerformanceMetrics
  ): Promise<AIAnalysis> {
    try {
      // Use multi-AI service for sophisticated analysis
      const prompt = `
        Analyze this student's learning patterns and provide cognitive insights:
        
        Performance Data:
        - Recent Score: ${quizResult.score}/${quizResult.totalQuestions}
        - Time Spent: ${quizResult.timeSpent} seconds
        - Average Time per Question: ${(quizResult.timeSpent / quizResult.totalQuestions).toFixed(1)} seconds
        - Historical Performance: ${userHistory.length} previous quizzes
        
        Performance Analytics:
        - Accuracy: ${(performanceAnalytics.accuracy * 100).toFixed(1)}%
        - Time Efficiency: ${performanceAnalytics.timeEfficiency}
        - Average Time per Question: ${performanceAnalytics.avgTimePerQuestion.toFixed(1)} seconds
        
        Please provide analysis in this exact JSON format:
        {
          "learningPattern": {
            "primaryStyle": "visual|auditory|kinesthetic|reading|mixed",
            "secondaryStyle": "visual|auditory|kinesthetic|reading|mixed",
            "confidence": 0.85,
            "evidence": ["evidence1", "evidence2"]
          },
          "cognitiveLoad": {
            "currentLoad": "low|medium|high",
            "optimalSessionLength": 45,
            "breakSchedule": [15, 30, 45],
            "recommendations": ["rec1", "rec2"]
          },
          "motivationLevel": {
            "level": "low|medium|high",
            "factors": ["factor1", "factor2"],
            "strategies": ["strategy1", "strategy2"]
          },
          "attentionSpan": {
            "averageMinutes": 25,
            "peakHours": ["9:00 AM", "2:00 PM"],
            "recommendations": ["rec1", "rec2"]
          }
        }
        
        Base your analysis on:
        1. Time patterns and consistency
        2. Performance trends
        3. Cognitive load indicators
        4. Learning style preferences
      `;

      const aiResponse = await multiAIService.generateContent(prompt);
      
      // Try to parse JSON from the response
      const jsonMatch = aiResponse.text.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        const parsed = JSON.parse(jsonMatch[0]);
        return {
          learningPattern: {
            primaryStyle: parsed.learningPattern?.primaryStyle || 'mixed',
            secondaryStyle: parsed.learningPattern?.secondaryStyle || 'mixed',
            confidence: parsed.learningPattern?.confidence || 0.75,
            evidence: parsed.learningPattern?.evidence || ['Performance analysis', 'Time patterns']
          },
          cognitiveLoad: {
            currentLoad: parsed.cognitiveLoad?.currentLoad || 'medium',
            optimalSessionLength: parsed.cognitiveLoad?.optimalSessionLength || 45,
            breakSchedule: parsed.cognitiveLoad?.breakSchedule || [15, 30, 45],
            recommendations: parsed.cognitiveLoad?.recommendations || ['Take a break', 'Review fundamentals']
          },
          motivationLevel: {
            level: parsed.motivationLevel?.level || 'medium',
            factors: parsed.motivationLevel?.factors || ['Consistent participation'],
            strategies: parsed.motivationLevel?.strategies || ['Set clear goals', 'Break down complex tasks']
          },
          attentionSpan: {
            averageMinutes: parsed.attentionSpan?.averageMinutes || 25,
            peakHours: parsed.attentionSpan?.peakHours || ['9:00 AM', '2:00 PM'],
            recommendations: parsed.attentionSpan?.recommendations || ['Take short breaks', 'Focus on one task at a time']
          }
        };
      }
      
      // Fallback to static analysis
      return this.getFallbackAIAnalysis(quizResult, userHistory, performanceAnalytics);
      
    } catch (error) {
      console.error("Error generating AI analysis:", error);
      return this.getFallbackAIAnalysis(quizResult, userHistory, performanceAnalytics);
    }
  }

  /**
   * Fallback AI analysis when AI service is unavailable
   */
  private getFallbackAIAnalysis(
    quizResult: QuizResult,
    userHistory: QuizResult[],
    _performanceAnalytics: PerformanceMetrics
  ): AIAnalysis {
    const avgTimePerQuestion = quizResult.timeSpent / quizResult.totalQuestions;
    const score = quizResult.score / quizResult.totalQuestions;
    
    // Determine learning style based on patterns
    let primaryStyle: "visual" | "auditory" | "kinesthetic" | "reading" | "mixed" = 'mixed';
    if (avgTimePerQuestion < 30) primaryStyle = 'visual';
    else if (avgTimePerQuestion > 60) primaryStyle = 'reading';
    
    // Determine cognitive load
    let currentLoad: "low" | "medium" | "high" = 'medium';
    if (score > 0.8) currentLoad = 'low';
    else if (score < 0.5) currentLoad = 'high';
    
    // Determine motivation level
    let motivationLevel: "low" | "medium" | "high" = 'medium';
    if (userHistory.length > 5) motivationLevel = 'high';
    else if (userHistory.length < 2) motivationLevel = 'low';
    
    return {
      learningPattern: {
        primaryStyle,
        secondaryStyle: 'mixed',
        confidence: 0.75,
        evidence: ['Time analysis', 'Performance patterns']
      },
      cognitiveLoad: {
        currentLoad,
        optimalSessionLength: currentLoad === 'high' ? 30 : currentLoad === 'low' ? 60 : 45,
        breakSchedule: currentLoad === 'high' ? [15, 30] : [15, 30, 45],
        recommendations: currentLoad === 'high' ? ['Take a break', 'Simplify tasks'] : ['Set clear goals', 'Break down complex tasks']
      },
      motivationLevel: {
        level: motivationLevel,
        factors: ['Quiz participation', 'Performance consistency'],
        strategies: ['Set clear goals', 'Break down complex tasks']
      },
      attentionSpan: {
        averageMinutes: currentLoad === 'high' ? 20 : currentLoad === 'low' ? 35 : 25,
        peakHours: currentLoad === 'high' ? ['9:00 AM', '2:00 PM'] : ['9:00 AM', '2:00 PM'],
        recommendations: currentLoad === 'high' ? ['Take short breaks', 'Focus on one task at a time'] : ['Take short breaks', 'Focus on one task at a time']
      }
    };
  }

  /**
   * Generate AI predictions
   */
  private generateAIPredictions(
    quizResult: QuizResult,
    userHistory: QuizResult[],
    performanceAnalytics: PerformanceMetrics
  ): AIPredictions {
    const recentScores = userHistory.slice(-5).map(result => result.score / result.totalQuestions)
    const avgRecentScore = recentScores.length > 0 ? recentScores.reduce((a, b) => a + b, 0) / recentScores.length : 0.5
    
    const expectedScore = Math.min(1, avgRecentScore + 0.1) // Slight improvement expected
    const confidence = Math.max(0.5, 1 - Math.abs(expectedScore - performanceAnalytics.accuracy))

    return {
      nextQuizPrediction: {
        expectedScore: expectedScore * 100,
        confidence,
        keyFactors: ['Recent performance trend', 'Study consistency'],
        riskFactors: ['Time pressure', 'Complex topics']
      },
      masteryTimeline: {
        estimatedDays: 30,
        milestones: [
          { day: 7, milestone: 'Basic concepts mastered', confidence: 0.8 },
          { day: 15, milestone: 'Intermediate skills developed', confidence: 0.7 },
          { day: 30, milestone: 'Advanced proficiency achieved', confidence: 0.6 }
        ]
      },
      riskAssessment: {
        struggleRisk: performanceAnalytics.percentage < 60 ? 0.7 : 0.3,
        dropoutRisk: 0.2,
        mitigationStrategies: ['Regular practice', 'Seek help early', 'Break down complex topics']
      }
    }
  }

  /**
   * Generate AI recommendations
   */
  private async generateAIRecommendations(
    quizResult: QuizResult,
    weakAreas: string[],
    resources: LearningResource[]
  ): Promise<AIRecommendations> {
    // Generate Gemini insights based on performance
    const geminiInsights = await this.generateGeminiInsights(quizResult, weakAreas, resources);

    return {
      immediateActions: [
        {
          action: `Focus on ${weakAreas[0] || 'key concepts'}`,
          priority: 'high',
          impact: 0.8,
          timeRequired: 30,
          reasoning: 'Addressing weak areas first will improve overall performance'
        },
        {
          action: 'Review recent quiz questions',
          priority: 'medium',
          impact: 0.6,
          timeRequired: 15,
          reasoning: 'Understanding mistakes helps prevent repetition'
        }
      ],
      personalizedResources: resources.slice(0, 5),
      adaptiveLearningPath: {
        currentPhase: 'Assessment',
        nextPhase: 'Practice',
        phases: [
          {
            name: 'Assessment',
            duration: 1,
            objectives: ['Identify weak areas', 'Set learning goals'],
            resources: ['Diagnostic quiz', 'Self-assessment'],
            assessment: 'Quiz performance analysis'
          },
          {
            name: 'Practice',
            duration: 7,
            objectives: ['Practice weak areas', 'Build confidence'],
            resources: ['Practice questions', 'Tutorial videos'],
            assessment: 'Progress quiz'
          },
          {
            name: 'Mastery',
            duration: 14,
            objectives: ['Achieve proficiency', 'Apply knowledge'],
            resources: ['Advanced problems', 'Real-world applications'],
            assessment: 'Final assessment'
          }
        ]
      },
      skillDevelopment: {
        strengths: [
          {
            skill: 'Problem solving',
            level: 0.8,
            evidence: ['Consistent performance', 'Good time management'],
            recommendations: ['Tackle advanced problems', 'Help others learn']
          }
        ],
        weaknesses: weakAreas.map(area => ({
          skill: area,
          level: 0.4,
          impact: 0.7,
          improvementPlan: [`Study ${area} fundamentals`, `Practice ${area} problems`],
          estimatedTime: 7
        })),
        emergingSkills: [
          {
            skill: 'Critical thinking',
            potential: 0.9,
            developmentPath: ['Analyze problems', 'Evaluate solutions', 'Apply logic']
          }
        ]
      },
      geminiInsights
    }
  }

  /**
   * Generate Gemini insights for personalized learning guidance
   */
  private async generateGeminiInsights(
    quizResult: QuizResult,
    weakAreas: string[],
    resources: LearningResource[]
  ) {
    const score = quizResult.score;
    const totalQuestions = quizResult.totalQuestions;
    const percentage = (score / totalQuestions) * 100;
    
    try {
      // Use multi-AI service to generate personalized insights
      const prompt = `
        As an AI tutor, analyze this student's performance and provide personalized learning guidance:
        
        Quiz Performance:
        - Subject: ${quizResult.category}
        - Score: ${score}/${totalQuestions} (${percentage.toFixed(1)}%)
        - Weak Areas: ${weakAreas.join(', ')}
        - Time Spent: ${quizResult.timeSpent} seconds
        
        Available Resources: ${resources.slice(0, 3).map(r => r.title).join(', ')}
        
        Please provide personalized insights in this exact JSON format:
        {
          "learningInsights": "Detailed analysis of performance and learning patterns",
          "motivationalTips": ["tip1", "tip2", "tip3"],
          "studyStrategies": ["strategy1", "strategy2", "strategy3"],
          "encouragement": "Motivational message",
          "nextSteps": "Specific next actions to take"
        }
        
        Make the insights:
        1. Personalized to their performance level
        2. Actionable and specific
        3. Encouraging but realistic
        4. Focused on their weak areas
      `;

      const aiResponse = await multiAIService.generateContent(prompt);
      
      // Try to parse JSON from the response
      const jsonMatch = aiResponse.text.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        const parsed = JSON.parse(jsonMatch[0]);
        return {
          learningInsights: parsed.learningInsights || this.getFallbackLearningInsights(percentage, quizResult.category, weakAreas),
          motivationalTips: parsed.motivationalTips || this.getFallbackMotivationalTips(percentage),
          studyStrategies: parsed.studyStrategies || this.getFallbackStudyStrategies(percentage),
          encouragement: parsed.encouragement || this.getFallbackEncouragement(percentage),
          nextSteps: parsed.nextSteps || this.getFallbackNextSteps(percentage, weakAreas)
        };
      }
      
      // Fallback to static responses if AI parsing fails
      return this.getFallbackGeminiInsights(percentage, quizResult.category, weakAreas);
      
    } catch (error) {
      console.error("Error generating AI insights:", error);
      // Fallback to static responses
      return this.getFallbackGeminiInsights(percentage, quizResult.category, weakAreas);
    }
  }

  /**
   * Fallback method for generating insights when AI service is unavailable
   */
  private getFallbackGeminiInsights(percentage: number, category: string, weakAreas: string[]) {
    return {
      learningInsights: this.getFallbackLearningInsights(percentage, category, weakAreas),
      motivationalTips: this.getFallbackMotivationalTips(percentage),
      studyStrategies: this.getFallbackStudyStrategies(percentage),
      encouragement: this.getFallbackEncouragement(percentage),
      nextSteps: this.getFallbackNextSteps(percentage, weakAreas)
    };
  }

  private getFallbackLearningInsights(percentage: number, category: string, weakAreas: string[]): string {
    if (percentage >= 80) {
      return `Excellent performance! You've demonstrated strong understanding of ${category}. Your consistent high scores indicate solid foundational knowledge. Consider exploring advanced topics to further challenge yourself.`;
    } else if (percentage >= 60) {
      return `Good performance with room for improvement. You understand the core concepts but may need more practice in specific areas. Focus on ${weakAreas.join(', ')} to strengthen your foundation.`;
    } else {
      return `Don't worry - learning is a journey! Your current performance shows areas for growth. Focus on understanding the basics of ${weakAreas.join(', ')} before moving to more complex topics.`;
    }
  }

  private getFallbackMotivationalTips(percentage: number): string[] {
    if (percentage >= 80) {
      return [
        "Keep up the excellent work! Your dedication is paying off.",
        "You're ready to tackle more challenging material.",
        "Consider helping others learn - teaching reinforces your own knowledge."
      ];
    } else if (percentage >= 60) {
      return [
        "You're making good progress! Every mistake is a learning opportunity.",
        "Focus on understanding rather than memorizing.",
        "Break down complex problems into smaller steps."
      ];
    } else {
      return [
        "Every expert was once a beginner. Keep going!",
        "Focus on progress, not perfection.",
        "Ask for help when needed - it's a sign of strength."
      ];
    }
  }

  private getFallbackStudyStrategies(percentage: number): string[] {
    if (percentage >= 80) {
      return [
        "Focus on advanced problem-solving techniques",
        "Explore real-world applications of concepts",
        "Practice time management for complex problems"
      ];
    } else if (percentage >= 60) {
      return [
        "Review fundamental concepts regularly",
        "Practice with similar problems to build confidence",
        "Use spaced repetition for better retention"
      ];
    } else {
      return [
        "Start with fundamental concepts",
        "Use visual aids and examples",
        "Practice regularly with simpler problems first"
      ];
    }
  }

  private getFallbackEncouragement(percentage: number): string {
    if (percentage >= 80) {
      return "You're on the path to mastery!";
    } else if (percentage >= 60) {
      return "You're building a strong foundation!";
    } else {
      return "You have the potential to succeed!";
    }
  }

  private getFallbackNextSteps(percentage: number, _weakAreas: string[]): string {
    if (percentage >= 80) {
      return "Consider taking advanced level quizzes or exploring related subjects.";
    } else if (percentage >= 60) {
      return "Focus on your weak areas and take practice quizzes regularly.";
    } else {
      return "Start with beginner-level materials and build up gradually.";
    }
  }

  /**
   * Fallback method for AI recommendations when AI service is unavailable
   */
  private getFallbackAIRecommendations(
    quizResult: QuizResult,
    weakAreas: string[],
    resources: LearningResource[]
  ): AIRecommendations {
    const percentage = (quizResult.score / quizResult.totalQuestions) * 100;
    
    return {
      immediateActions: [
        {
          action: `Focus on ${weakAreas[0] || 'fundamental concepts'}`,
          priority: 'high' as const,
          impact: 0.8,
          timeRequired: 30,
          reasoning: `Based on your performance in ${quizResult.category}`
        }
      ],
      personalizedResources: resources.slice(0, 3),
      adaptiveLearningPath: {
        currentPhase: percentage >= 80 ? 'advanced' : percentage >= 60 ? 'intermediate' : 'beginner',
        nextPhase: percentage >= 80 ? 'expert' : percentage >= 60 ? 'advanced' : 'intermediate',
        phases: [
          {
            name: 'Foundation',
            duration: 7,
            objectives: ['Understand basic concepts', 'Build confidence'],
            resources: ['Video tutorials', 'Practice quizzes'],
            assessment: 'Basic comprehension quiz'
          }
        ]
      },
      skillDevelopment: {
        strengths: [
          {
            skill: 'Problem solving',
            level: Math.min(5, Math.max(1, Math.floor(percentage / 20))),
            evidence: ['Consistent performance'],
            recommendations: ['Continue practicing']
          }
        ],
        weaknesses: weakAreas.map(area => ({
          skill: area,
          level: Math.max(1, Math.floor(percentage / 20)),
          impact: 0.7,
          improvementPlan: ['Review fundamentals', 'Practice regularly'],
          estimatedTime: 60
        })),
        emergingSkills: []
      },
      geminiInsights: {
        learningInsights: this.getFallbackLearningInsights(percentage, quizResult.category, weakAreas),
        motivationalTips: this.getFallbackMotivationalTips(percentage),
        studyStrategies: this.getFallbackStudyStrategies(percentage),
        encouragement: this.getFallbackEncouragement(percentage),
        nextSteps: this.getFallbackNextSteps(percentage, weakAreas)
      }
    };
  }

  /**
   * Fallback method for collaborative insights when AI service is unavailable
   */
  private getFallbackCollaborativeInsights(
    userHistory: QuizResult[],
    category: string
  ): CollaborativeInsights {
    // const recentResults = userHistory
    //   .filter(result => result.category === category)
    //   .slice(-5);
    
    // Calculate average score (unused but kept for potential future use)
    // const avgScore = recentResults.length > 0 
    //   ? recentResults.reduce((sum, result) => sum + (result.score / result.totalQuestions), 0) / recentResults.length
    //   : 0;
    
    return {
      similarLearners: [
        {
          similarityScore: 0.85,
          sharedCharacteristics: ['Similar performance level', 'Same subject interest'],
          successfulStrategies: ['Regular practice', 'Concept review'],
          commonChallenges: ['Time management', 'Complex topics']
        }
      ],
      communityTrends: {
        trendingTopics: [category],
        popularResources: ['Video tutorials', 'Practice quizzes'],
        emergingSkills: ['Problem solving', 'Critical thinking'],
        successPatterns: ['Consistent practice', 'Active learning']
      },
      peerRecommendations: [
        {
          source: 'similar_learner' as const,
          recommendation: 'Focus on understanding concepts before memorizing',
          confidence: 0.8,
          reasoning: 'Based on successful learners in your category'
        }
      ]
    };
  }

  /**
   * Generate collaborative insights
   */
  private async generateCollaborativeInsights(
    userHistory: QuizResult[],
    category: string
  ): Promise<CollaborativeInsights> {
    try {
      // Get similar learners (simplified)
      const lastScore = userHistory.length > 0 ? userHistory[userHistory.length - 1]?.score : 5;
      const validScore = typeof lastScore === 'number' && !isNaN(lastScore) ? lastScore : 5;
      
      const similarLearners = await prisma.quizResult.findMany({
        where: {
          category,
          score: {
            gte: Math.max(0, validScore - 2),
            lte: Math.min(10, validScore + 2)
          }
        },
        take: 10,
        include: { user: true }
      })

      return {
        similarLearners: similarLearners.slice(0, 3).map(_result => ({
          similarityScore: 0.85,
          sharedCharacteristics: ['Similar performance level', 'Same subject interest'],
          successfulStrategies: ['Regular practice', 'Concept review'],
          commonChallenges: ['Time management', 'Complex topics']
        })),
        communityTrends: {
          trendingTopics: [category, 'Problem solving', 'Critical thinking'],
          popularResources: ['Video tutorials', 'Practice quizzes', 'Study guides'],
          emergingSkills: ['Data analysis', 'Logical reasoning'],
          successPatterns: ['Consistent practice', 'Active learning', 'Peer collaboration']
        },
        peerRecommendations: [
          {
            source: 'similar_learner',
            recommendation: 'Focus on understanding concepts before memorizing',
            confidence: 0.8,
            reasoning: 'Based on successful learners in your category'
          }
        ]
      }
    } catch (error) {
      console.error("Error generating collaborative insights:", error)
      return {
        similarLearners: [],
        communityTrends: {
          trendingTopics: [],
          popularResources: [],
          emergingSkills: [],
          successPatterns: []
        },
        peerRecommendations: []
      }
    }
  }

  /**
   * Calculate confidence score
   */
  private calculateConfidence(performanceAnalytics: PerformanceMetrics, historyLength: number): number {
    const performanceConfidence = performanceAnalytics.percentage / 100
    const historyConfidence = Math.min(1, historyLength / 10)
    return (performanceConfidence + historyConfidence) / 2
  }

  /**
   * Generate fallback recommendations using rule-based engine
   */
  private async generateFallbackRecommendations(quizResult: QuizResult, _questions: Question[]): Promise<Recommendation> {
    try {
      // Use rule-based engine as fallback
      const ruleBasedRecommendations = await RuleBasedEngine.generateRecommendations(
        [], // Empty history for fallback
        quizResult.category,
        {
          difficulty: quizResult.difficulty || 'intermediate',
          timeAvailable: 10, // Default 10 hours
          goals: ['Improve understanding', 'Practice regularly']
        }
      )

      // Convert rule-based recommendations to main recommendation format
      return {
        weakAreas: ruleBasedRecommendations.weakAreas,
        strongAreas: ruleBasedRecommendations.strongAreas,
        resources: ruleBasedRecommendations.recommendedResources,
        studyPlan: ruleBasedRecommendations.studyPlan,
        pathRecommendations: [],
        performanceAnalytics: {
          score: quizResult.score,
          percentage: (quizResult.score / quizResult.totalQuestions) * 100,
          level: (quizResult.score / quizResult.totalQuestions) >= 0.8 ? 'excellent' : 
                 (quizResult.score / quizResult.totalQuestions) >= 0.6 ? 'good' : 'needs_improvement',
          timeSpent: quizResult.timeSpent,
          timeEfficiency: 'optimal',
          avgTimePerQuestion: quizResult.timeSpent / quizResult.totalQuestions,
          accuracy: quizResult.score / quizResult.totalQuestions
        },
        aiAnalysis: {
          learningPattern: {
            primaryStyle: 'mixed',
            secondaryStyle: 'mixed',
            confidence: 0.5,
            evidence: ['Fallback analysis', 'Basic performance metrics']
          },
          cognitiveLoad: {
            currentLoad: 'medium',
            optimalSessionLength: 45,
            breakSchedule: [15, 30, 45],
            recommendations: ['Take regular breaks', 'Review fundamentals']
          },
          motivationLevel: {
            level: 'medium',
            factors: ['Quiz participation'],
            strategies: ['Set clear goals', 'Practice regularly']
          },
          attentionSpan: {
            averageMinutes: 25,
            peakHours: ['9:00 AM', '2:00 PM'],
            recommendations: ['Take short breaks', 'Focus on one task at a time']
          }
        },
        aiPredictions: {
          nextQuizPrediction: {
            expectedScore: (quizResult.score / quizResult.totalQuestions) * 100,
            confidence: 0.6,
            keyFactors: ['Current performance', 'Basic analysis'],
            riskFactors: ['Limited data', 'Fallback mode']
          },
          masteryTimeline: {
            estimatedDays: 30,
            milestones: [
              { day: 7, milestone: 'Basic concepts review', confidence: 0.7 },
              { day: 15, milestone: 'Practice and improvement', confidence: 0.6 },
              { day: 30, milestone: 'Mastery assessment', confidence: 0.5 }
            ]
          },
          riskAssessment: {
            struggleRisk: 0.4,
            dropoutRisk: 0.2,
            mitigationStrategies: ['Regular practice', 'Seek help when needed', 'Break down complex topics']
          }
        },
        aiRecommendations: {
          immediateActions: [
            {
              action: 'Review basic concepts',
              priority: 'high',
              impact: 0.7,
              timeRequired: 30,
              reasoning: 'Strengthen foundational knowledge'
            }
          ],
          personalizedResources: ruleBasedRecommendations.recommendedResources,
          adaptiveLearningPath: {
            currentPhase: 'Assessment',
            nextPhase: 'Practice',
            phases: [
              {
                name: 'Assessment',
                duration: 1,
                objectives: ['Identify weak areas', 'Set learning goals'],
                resources: ['Diagnostic quiz', 'Self-assessment'],
                assessment: 'Quiz performance analysis'
              },
              {
                name: 'Practice',
                duration: 7,
                objectives: ['Practice weak areas', 'Build confidence'],
                resources: ['Practice questions', 'Tutorial videos'],
                assessment: 'Progress quiz'
              },
              {
                name: 'Mastery',
                duration: 14,
                objectives: ['Achieve proficiency', 'Apply knowledge'],
                resources: ['Advanced problems', 'Real-world applications'],
                assessment: 'Final assessment'
              }
            ]
          },
          skillDevelopment: {
            strengths: [],
            weaknesses: ruleBasedRecommendations.weakAreas.map(area => ({
              skill: area,
              level: 0.4,
              impact: 0.7,
              improvementPlan: [`Study ${area} fundamentals`, `Practice ${area} problems`],
              estimatedTime: 7
            })),
            emergingSkills: []
          },
          geminiInsights: {
            learningInsights: ruleBasedRecommendations.categorySpecificAdvice,
            motivationalTips: ['Keep practicing regularly', 'Focus on understanding concepts'],
            studyStrategies: ['Review fundamentals', 'Practice with similar problems'],
            encouragement: 'You can improve with consistent practice!',
            nextSteps: 'Start with basic concepts and build up gradually.'
          }
        },
        collaborativeInsights: {
          similarLearners: [],
          communityTrends: {
            trendingTopics: [quizResult.category],
            popularResources: ['Video tutorials', 'Practice quizzes'],
            emergingSkills: ['Problem solving', 'Critical thinking'],
            successPatterns: ['Regular practice', 'Active learning']
          },
          peerRecommendations: []
        },
        youtubeVideos: [],
        metadata: {
          generatedAt: new Date().toISOString(),
          version: "1.0.0",
          confidence: 0.6,
          processingTime: 0,
          fallbackMode: true
        }
      }
    } catch (error) {
      console.error("Error in rule-based fallback:", error)
      // Ultimate fallback with minimal data
      return {
        weakAreas: ['General concepts'],
        strongAreas: [],
        resources: [],
        studyPlan: [
          {
            week: 1,
            focus: 'General review',
            activities: ['Review basic concepts', 'Practice problems'],
            estimatedHours: 6,
            resources: ['Textbook', 'Online tutorials'],
            milestones: ['Complete review', 'Take practice quiz']
          }
        ],
        pathRecommendations: [],
        performanceAnalytics: {
          score: quizResult.score,
          percentage: (quizResult.score / quizResult.totalQuestions) * 100,
          level: 'needs_improvement',
          timeSpent: quizResult.timeSpent,
          timeEfficiency: 'optimal',
          avgTimePerQuestion: quizResult.timeSpent / quizResult.totalQuestions,
          accuracy: quizResult.score / quizResult.totalQuestions
        },
        metadata: {
          generatedAt: new Date().toISOString(),
          version: "1.0.0",
          confidence: 0.5,
          processingTime: 0,
          fallbackMode: true
        }
      }
    }
  }

  /**
   * Generate rule-based recommendations explicitly (alternative to AI-powered recommendations)
   */
  async generateRuleBasedRecommendations(
    quizResult: QuizResult,
    userHistory: QuizResult[] = [],
    options: {
      difficulty?: string
      timeAvailable?: number
      goals?: string[]
    } = {}
  ): Promise<Recommendation> {
    const startTime = Date.now()

    try {
      // Use rule-based engine for recommendations
      const ruleBasedRecommendations = await RuleBasedEngine.generateRecommendations(
        userHistory,
        quizResult.category,
        {
          difficulty: options.difficulty || quizResult.difficulty || 'intermediate',
          timeAvailable: options.timeAvailable || 10,
          goals: options.goals || ['Improve understanding', 'Practice regularly']
        }
      )

      // Convert to main recommendation format
      const recommendation: Recommendation = {
        weakAreas: ruleBasedRecommendations.weakAreas,
        strongAreas: ruleBasedRecommendations.strongAreas,
        resources: ruleBasedRecommendations.recommendedResources,
        studyPlan: ruleBasedRecommendations.studyPlan,
        pathRecommendations: [],
        performanceAnalytics: {
          score: quizResult.score,
          percentage: (quizResult.score / quizResult.totalQuestions) * 100,
          level: (quizResult.score / quizResult.totalQuestions) >= 0.8 ? 'excellent' : 
                 (quizResult.score / quizResult.totalQuestions) >= 0.6 ? 'good' : 'needs_improvement',
          timeSpent: quizResult.timeSpent,
          timeEfficiency: 'optimal',
          avgTimePerQuestion: quizResult.timeSpent / quizResult.totalQuestions,
          accuracy: quizResult.score / quizResult.totalQuestions
        },
        aiAnalysis: {
          learningPattern: {
            primaryStyle: 'mixed',
            secondaryStyle: 'mixed',
            confidence: 0.7,
            evidence: ['Rule-based analysis', 'Performance patterns']
          },
          cognitiveLoad: {
            currentLoad: 'medium',
            optimalSessionLength: 45,
            breakSchedule: [15, 30, 45],
            recommendations: ['Take regular breaks', 'Review fundamentals']
          },
          motivationLevel: {
            level: 'medium',
            factors: ['Quiz participation', 'Performance consistency'],
            strategies: ['Set clear goals', 'Practice regularly']
          },
          attentionSpan: {
            averageMinutes: 25,
            peakHours: ['9:00 AM', '2:00 PM'],
            recommendations: ['Take short breaks', 'Focus on one task at a time']
          }
        },
        aiPredictions: {
          nextQuizPrediction: {
            expectedScore: (quizResult.score / quizResult.totalQuestions) * 100,
            confidence: 0.75,
            keyFactors: ['Current performance', 'Rule-based analysis'],
            riskFactors: ['Limited data', 'Rule-based predictions']
          },
          masteryTimeline: {
            estimatedDays: 30,
            milestones: [
              { day: 7, milestone: 'Basic concepts review', confidence: 0.8 },
              { day: 15, milestone: 'Practice and improvement', confidence: 0.7 },
              { day: 30, milestone: 'Mastery assessment', confidence: 0.6 }
            ]
          },
          riskAssessment: {
            struggleRisk: 0.3,
            dropoutRisk: 0.15,
            mitigationStrategies: ['Regular practice', 'Seek help when needed', 'Follow study plan']
          }
        },
        aiRecommendations: {
          immediateActions: [
            {
              action: 'Focus on weak areas',
              priority: 'high',
              impact: 0.8,
              timeRequired: 30,
              reasoning: 'Addressing weak areas will improve overall performance'
            }
          ],
          personalizedResources: ruleBasedRecommendations.recommendedResources,
          adaptiveLearningPath: {
            currentPhase: 'Assessment',
            nextPhase: 'Practice',
            phases: [
              {
                name: 'Assessment',
                duration: 1,
                objectives: ['Identify weak areas', 'Set learning goals'],
                resources: ['Diagnostic quiz', 'Self-assessment'],
                assessment: 'Quiz performance analysis'
              },
              {
                name: 'Practice',
                duration: 7,
                objectives: ['Practice weak areas', 'Build confidence'],
                resources: ['Practice questions', 'Tutorial videos'],
                assessment: 'Progress quiz'
              },
              {
                name: 'Mastery',
                duration: 14,
                objectives: ['Achieve proficiency', 'Apply knowledge'],
                resources: ['Advanced problems', 'Real-world applications'],
                assessment: 'Final assessment'
              }
            ]
          },
          skillDevelopment: {
            strengths: ruleBasedRecommendations.strongAreas.map(area => ({
              skill: area,
              level: 0.8,
              evidence: ['Consistent performance', 'Good understanding'],
              recommendations: ['Build on strengths', 'Help others learn']
            })),
            weaknesses: ruleBasedRecommendations.weakAreas.map(area => ({
              skill: area,
              level: 0.4,
              impact: 0.7,
              improvementPlan: [`Study ${area} fundamentals`, `Practice ${area} problems`],
              estimatedTime: 7
            })),
            emergingSkills: []
          },
          geminiInsights: {
            learningInsights: ruleBasedRecommendations.categorySpecificAdvice,
            motivationalTips: ['Keep practicing regularly', 'Focus on understanding concepts'],
            studyStrategies: ['Review fundamentals', 'Practice with similar problems'],
            encouragement: 'You can improve with consistent practice!',
            nextSteps: 'Follow the recommended study plan and focus on weak areas.'
          }
        },
        collaborativeInsights: {
          similarLearners: [],
          communityTrends: {
            trendingTopics: [quizResult.category],
            popularResources: ['Video tutorials', 'Practice quizzes'],
            emergingSkills: ['Problem solving', 'Critical thinking'],
            successPatterns: ['Regular practice', 'Active learning']
          },
          peerRecommendations: []
        },
        youtubeVideos: [],
        metadata: {
          generatedAt: new Date().toISOString(),
          version: "1.0.0",
          confidence: 0.75,
          processingTime: Date.now() - startTime,
          recommendationType: 'rule-based'
        }
      }

      return recommendation

    } catch (error) {
      console.error("Error generating rule-based recommendations:", error)
      // Fallback to basic recommendations
      return this.generateFallbackRecommendations(quizResult, [])
    }
  }
}

// Export singleton instance
export const recommendationEngine = RecommendationEngine.getInstance()

// Export convenience functions for backward compatibility
export const generatePersonalizedRecommendations = recommendationEngine.generateRecommendations.bind(recommendationEngine) 