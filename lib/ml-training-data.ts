import type { TrainingData } from './ml-models'

export class MLTrainingDataGenerator {
  /**
   * Generate synthetic training data for learning style classification
   */
  static generateLearningStyleTrainingData(count: number = 1000): TrainingData['learningStyle'] {
    const trainingData: TrainingData['learningStyle'] = []
    const styles = ['visual', 'auditory', 'kinesthetic', 'reading', 'mixed'] as const

    for (let i = 0; i < count; i++) {
      const style = styles[Math.floor(Math.random() * styles.length)]
      const features = this.generateLearningStyleFeatures(style)
      
      trainingData.push({
        features,
        label: style
      })
    }

    return trainingData
  }

  /**
   * Generate synthetic training data for performance prediction
   */
  static generatePerformanceTrainingData(count: number = 1000): TrainingData['performance'] {
    const trainingData: TrainingData['performance'] = []

    for (let i = 0; i < count; i++) {
      const features = this.generatePerformanceFeatures()
      const actualScore = this.predictScoreFromFeatures(features)
      
      trainingData.push({
        features,
        actualScore
      })
    }

    return trainingData
  }

  /**
   * Generate synthetic training data for recommendation ranking
   */
  static generateRecommendationTrainingData(count: number = 1000): TrainingData['recommendations'] {
    const trainingData: TrainingData['recommendations'] = []

    for (let i = 0; i < count; i++) {
      const features = this.generateRecommendationFeatures()
      const relevanceScore = this.calculateRelevanceScore(features)
      const userFeedback = this.simulateUserFeedback(relevanceScore)
      
      trainingData.push({
        features,
        relevanceScore,
        userFeedback
      })
    }

    return trainingData
  }

  /**
   * Generate complete training dataset
   */
  static generateCompleteTrainingData(count: number = 1000): TrainingData {
    return {
      learningStyle: this.generateLearningStyleTrainingData(count),
      performance: this.generatePerformanceTrainingData(count),
      recommendations: this.generateRecommendationTrainingData(count)
    }
  }

  private static generateLearningStyleFeatures(style: string): Record<string, number> {
    const features: Record<string, number> = {}

    switch (style) {
      case 'visual':
        features.avgTimePerQuestion = 45 + Math.random() * 30 // Fast responses
        features.timeConsistency = 0.8 + Math.random() * 0.2 // High consistency
        features.speedAccuracy = 0.7 + Math.random() * 0.3 // Good speed-accuracy balance
        features.accuracy = 0.75 + Math.random() * 0.2 // Good accuracy
        features.performanceTrend = 0.1 + Math.random() * 0.2 // Positive trend
        features.difficultyHandling = 0.6 + Math.random() * 0.3 // Moderate difficulty handling
        break

      case 'auditory':
        features.avgTimePerQuestion = 60 + Math.random() * 40 // Medium responses
        features.timeConsistency = 0.7 + Math.random() * 0.2 // Good consistency
        features.speedAccuracy = 0.8 + Math.random() * 0.2 // Excellent balance
        features.accuracy = 0.8 + Math.random() * 0.15 // High accuracy
        features.performanceTrend = 0.15 + Math.random() * 0.15 // Strong positive trend
        features.difficultyHandling = 0.7 + Math.random() * 0.25 // Good difficulty handling
        break

      case 'kinesthetic':
        features.avgTimePerQuestion = 80 + Math.random() * 50 // Slower responses
        features.timeConsistency = 0.6 + Math.random() * 0.3 // Variable consistency
        features.speedAccuracy = 0.6 + Math.random() * 0.3 // Moderate balance
        features.accuracy = 0.65 + Math.random() * 0.25 // Moderate accuracy
        features.performanceTrend = 0.05 + Math.random() * 0.2 // Slight positive trend
        features.difficultyHandling = 0.5 + Math.random() * 0.3 // Variable difficulty handling
        break

      case 'reading':
        features.avgTimePerQuestion = 90 + Math.random() * 60 // Slow, careful responses
        features.timeConsistency = 0.8 + Math.random() * 0.15 // High consistency
        features.speedAccuracy = 0.75 + Math.random() * 0.2 // Good balance
        features.accuracy = 0.85 + Math.random() * 0.1 // Very high accuracy
        features.performanceTrend = 0.1 + Math.random() * 0.15 // Positive trend
        features.difficultyHandling = 0.8 + Math.random() * 0.15 // Excellent difficulty handling
        break

      case 'mixed':
        features.avgTimePerQuestion = 65 + Math.random() * 40 // Variable responses
        features.timeConsistency = 0.7 + Math.random() * 0.25 // Good consistency
        features.speedAccuracy = 0.75 + Math.random() * 0.2 // Good balance
        features.accuracy = 0.75 + Math.random() * 0.2 // Good accuracy
        features.performanceTrend = 0.1 + Math.random() * 0.2 // Positive trend
        features.difficultyHandling = 0.65 + Math.random() * 0.25 // Good difficulty handling
        break
    }

    return features
  }

  private static generatePerformanceFeatures(): Record<string, number> {
    const features: Record<string, number> = {}

    // Current performance
    features.currentScore = 0.3 + Math.random() * 0.7 // 30-100%
    features.currentTime = 30 + Math.random() * 120 // 30-150 seconds per question

    // Historical performance
    features.avgRecentScore = 0.4 + Math.random() * 0.5 // 40-90%
    features.scoreVariance = Math.random() * 0.3 // 0-30% variance
    features.scoreTrend = -0.2 + Math.random() * 0.4 // -20% to +20% trend

    // Time-based features
    features.avgRecentTime = 40 + Math.random() * 100 // 40-140 seconds
    features.timeEfficiency = 0.5 + Math.random() * 1.0 // 0.5-1.5 efficiency

    return features
  }

  private static generateRecommendationFeatures(): Record<string, number> {
    const features: Record<string, number> = {}

    // Content relevance
    features.categoryMatch = Math.random() > 0.3 ? 1 : 0 // 70% chance of match
    features.topicRelevance = Math.random() * 1.0 // 0-100% relevance
    features.difficultyMatch = Math.random() * 1.0 // 0-100% difficulty match

    // User preferences
    features.userPerformance = 0.3 + Math.random() * 0.7 // 30-100% performance
    features.userExperience = Math.random() * 1.0 // 0-100% experience level
    features.learningStyle = Math.random() * 1.0 // 0-100% style preference

    // Resource quality
    features.resourceRating = 0.3 + Math.random() * 0.7 // 0.3-1.0 rating
    features.resourcePopularity = Math.random() * 1.0 // 0-100% popularity
    features.resourceType = 1 + Math.floor(Math.random() * 6) // 1-6 resource types

    return features
  }

  private static predictScoreFromFeatures(features: Record<string, number>): number {
    // Simple linear model for score prediction
    let predictedScore = 50 // Base score

    // Add contributions from features
    predictedScore += features.currentScore * 20
    predictedScore += features.avgRecentScore * 15
    predictedScore += (1 - features.scoreVariance) * 10
    predictedScore += features.scoreTrend * 50
    predictedScore += (1 - features.timeEfficiency) * 5

    // Add some noise
    predictedScore += (Math.random() - 0.5) * 20

    return Math.max(0, Math.min(100, predictedScore))
  }

  private static calculateRelevanceScore(features: Record<string, number>): number {
    // Weighted combination of features
    let relevanceScore = 0

    relevanceScore += features.categoryMatch * 0.3
    relevanceScore += features.topicRelevance * 0.25
    relevanceScore += features.difficultyMatch * 0.2
    relevanceScore += features.resourceRating * 0.15
    relevanceScore += features.userExperience * 0.1

    return Math.max(0, Math.min(1, relevanceScore))
  }

  private static simulateUserFeedback(relevanceScore: number): number {
    // Simulate user feedback based on relevance score with some noise
    const baseFeedback = relevanceScore
    const noise = (Math.random() - 0.5) * 0.3
    const feedback = Math.max(0, Math.min(1, baseFeedback + noise))
    
    return feedback
  }

  /**
   * Generate realistic training data based on actual patterns
   */
  static generateRealisticTrainingData(count: number = 1000): TrainingData {
    const trainingData: TrainingData = {
      learningStyle: [],
      performance: [],
      recommendations: []
    }

    // Generate correlated data
    for (let i = 0; i < count; i++) {
      // Generate a realistic user profile
      const userProfile = this.generateUserProfile()
      
      // Generate learning style data
      const learningStyleFeatures = this.generateLearningStyleFeatures(userProfile.style)
      trainingData.learningStyle!.push({
        features: learningStyleFeatures,
        label: userProfile.style
      })

      // Generate performance data
      const performanceFeatures = this.generateRealisticPerformanceFeatures(userProfile)
      const actualScore = this.predictRealisticScore(performanceFeatures, userProfile)
      trainingData.performance!.push({
        features: performanceFeatures,
        actualScore
      })

      // Generate recommendation data
      const recommendationFeatures = this.generateRealisticRecommendationFeatures(userProfile)
      const relevanceScore = this.calculateRealisticRelevance(recommendationFeatures, userProfile)
      const userFeedback = this.simulateRealisticFeedback(relevanceScore, userProfile)
      trainingData.recommendations!.push({
        features: recommendationFeatures,
        relevanceScore,
        userFeedback
      })
    }

    return trainingData
  }

  private static generateUserProfile() {
    const styles = ['visual', 'auditory', 'kinesthetic', 'reading', 'mixed'] as const
    const style = styles[Math.floor(Math.random() * styles.length)]
    
    return {
      style,
      skillLevel: Math.random() * 1.0, // 0-1 skill level
      consistency: 0.5 + Math.random() * 0.5, // 0.5-1.0 consistency
      learningSpeed: 0.3 + Math.random() * 0.7, // 0.3-1.0 learning speed
      motivation: 0.4 + Math.random() * 0.6 // 0.4-1.0 motivation
    }
  }

  private static generateRealisticPerformanceFeatures(profile: { skillLevel: number; learningSpeed: number; consistency: number; motivation: number }): Record<string, number> {
    const features: Record<string, number> = {}

    // Base performance influenced by skill level
    features.currentScore = profile.skillLevel * 0.8 + Math.random() * 0.2
    features.currentTime = (1 - profile.learningSpeed) * 120 + Math.random() * 60

    // Historical performance influenced by consistency
    features.avgRecentScore = profile.skillLevel * 0.7 + profile.consistency * 0.2 + Math.random() * 0.1
    features.scoreVariance = (1 - profile.consistency) * 0.4 + Math.random() * 0.1
    features.scoreTrend = profile.motivation * 0.3 + (Math.random() - 0.5) * 0.2

    // Time efficiency
    features.avgRecentTime = (1 - profile.learningSpeed) * 100 + Math.random() * 50
    features.timeEfficiency = profile.consistency * 0.8 + Math.random() * 0.2

    return features
  }

  private static generateRealisticRecommendationFeatures(profile: { skillLevel: number; motivation: number }): Record<string, number> {
    const features: Record<string, number> = {}

    // Content relevance based on skill level and learning style
    features.categoryMatch = Math.random() > 0.2 ? 1 : 0
    features.topicRelevance = profile.skillLevel * 0.6 + Math.random() * 0.4
    features.difficultyMatch = Math.max(0, Math.min(1, profile.skillLevel + (Math.random() - 0.5) * 0.4))

    // User preferences
    features.userPerformance = profile.skillLevel * 0.8 + Math.random() * 0.2
    features.userExperience = profile.skillLevel * 0.7 + Math.random() * 0.3
    features.learningStyle = Math.random() * 1.0

    // Resource quality
    features.resourceRating = 0.4 + Math.random() * 0.6
    features.resourcePopularity = Math.random() * 1.0
    features.resourceType = 1 + Math.floor(Math.random() * 6)

    return features
  }

  private static predictRealisticScore(features: Record<string, number>, profile: { motivation: number }): number {
    let predictedScore = 40 // Base score

    predictedScore += features.currentScore * 30
    predictedScore += features.avgRecentScore * 20
    predictedScore += (1 - features.scoreVariance) * 10
    predictedScore += features.scoreTrend * 30
    predictedScore += profile.motivation * 10

    // Add realistic noise
    predictedScore += (Math.random() - 0.5) * 15

    return Math.max(0, Math.min(100, predictedScore))
  }

  private static calculateRealisticRelevance(features: Record<string, number>, profile: { motivation: number }): number {
    let relevanceScore = 0

    relevanceScore += features.categoryMatch * 0.25
    relevanceScore += features.topicRelevance * 0.3
    relevanceScore += features.difficultyMatch * 0.25
    relevanceScore += features.resourceRating * 0.1
    relevanceScore += profile.motivation * 0.1

    return Math.max(0, Math.min(1, relevanceScore))
  }

  private static simulateRealisticFeedback(relevanceScore: number, profile: { motivation: number }): number {
    const baseFeedback = relevanceScore * 0.8 + profile.motivation * 0.2
    const noise = (Math.random() - 0.5) * 0.2
    const feedback = Math.max(0, Math.min(1, baseFeedback + noise))
    
    return feedback
  }
} 