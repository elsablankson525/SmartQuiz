export interface Question {
  question: string
  options: string[]
  correctAnswer: string
  topic?: string // Added for better categorization
  difficulty?: string // Added for difficulty tracking
}

export interface EnhancedQuestion extends Question {
  explanation: string
  category: string
  difficulty: string
  topic: string
  source?: string
  relatedConcepts?: string[]
}

export interface User {
  id: string
  name: string
  email: string
  image?: string
  score: number
  quizzesTaken: number
  createdAt: Date // Added for profile route
  learningPreferences?: {
    preferredDifficulty: string
    favoriteCategories: string[]
    learningStyle: "visual" | "reading" | "practice" | "mixed"
  }
}

export interface QuizResult {
  id: string
  userId: string
  category: string
  difficulty: string
  score: number
  totalQuestions: number
  timeSpent: number
  date: Date
  questionsAnswered?: {
    question: string
    userAnswer: string
    correctAnswer: string
    isCorrect: boolean
    topic?: string
  }[]
}

export interface LearningPath {
  id: string
  title: string
  description: string
  category: string
  difficulty: string
  duration?: string
  modules?: number
  enrolled?: number
  rating?: number
  progress?: number
  color?: string
  icon?: string
  skills: string[]
  instructor?: string
  isPopular?: boolean
  createdAt: Date
  updatedAt: Date
  milestones: Milestone[]
}

// ===== RECOMMENDATION SYSTEM TYPES =====

// Core recommendation interfaces
export interface LearningResource {
  id: string
  title: string
  type: 'video' | 'article' | 'course' | 'practice' | 'book' | 'interactive'
  url: string
  difficulty: string
  relevanceScore: number
  estimatedTime: number // minutes
  description: string
  tags: string[]
  category: string
  topic: string
  readTime?: string
  duration?: string
  provider?: string
  rating?: number
  language?: string
  isFree?: boolean
  certification?: boolean
  thumbnail?: string
  channelTitle?: string
  viewCount?: number
  aiReasoning?: string
  learningOutcomes?: string[]
  personalizedTips?: string
}

export interface StudyPlanItem {
  week: number
  focus: string
  activities: string[]
  estimatedHours: number
  resources: string[]
  milestones: string[]
  prerequisites?: string[]
  goals?: string[]
}

export interface PathRecommendation {
  path: LearningPath
  reason: string
  matchScore: number
  estimatedCompletionTime: string
  prerequisites: string[]
}

export interface Milestone {
  id: string
  title: string
  description: string
  type: 'quiz' | 'assignment' | 'project' | 'certification'
  difficulty: string
  estimatedTime: number
  prerequisites: string[]
  rewards?: {
    points: number
    badges: string[]
  }
  completed?: boolean
  completedAt?: Date
}

// Performance and analytics interfaces
export interface PerformanceMetrics {
  score: number
  percentage: number
  level: 'excellent' | 'good' | 'needs_improvement'
  timeSpent: number
  timeEfficiency: 'fast' | 'optimal' | 'slow'
  avgTimePerQuestion: number
  accuracy: number
}

export interface AnalyticsData {
  overallScore: number
  categoryPerformance: Record<string, number>
  difficultyProgression: string[]
  learningTrend: 'improving' | 'declining' | 'stable'
  timeSpentAnalysis: {
    averageTimePerQuestion: number
    timeEfficiency: 'fast' | 'optimal' | 'slow'
    improvementSuggestions: string[]
  }
  topicMastery: Record<string, number>
  skillGaps: string[]
  strengths: string[]
}

// AI and ML specific interfaces
export interface AIAnalysis {
  learningPattern: {
    primaryStyle: 'visual' | 'auditory' | 'kinesthetic' | 'reading' | 'mixed'
    secondaryStyle: 'visual' | 'auditory' | 'kinesthetic' | 'reading' | 'mixed'
    confidence: number
    evidence: string[]
  }
  cognitiveLoad: {
    currentLoad: 'low' | 'medium' | 'high'
    optimalSessionLength: number
    breakSchedule: number[]
    recommendations: string[]
  }
  motivationLevel: {
    level: 'high' | 'medium' | 'low'
    factors: string[]
    strategies: string[]
  }
  attentionSpan: {
    averageMinutes: number
    peakHours: string[]
    recommendations: string[]
  }
}

export interface AIPredictions {
  nextQuizPrediction: {
    expectedScore: number
    confidence: number
    keyFactors: string[]
    riskFactors: string[]
  }
  masteryTimeline: {
    estimatedDays: number
    milestones: Array<{
      day: number
      milestone: string
      confidence: number
    }>
  }
  riskAssessment: {
    struggleRisk: number
    dropoutRisk: number
    mitigationStrategies: string[]
  }
}

export interface AIRecommendations {
  immediateActions: Array<{
    action: string
    priority: 'high' | 'medium' | 'low'
    impact: number
    timeRequired: number
    reasoning: string
    geminiReasoning?: string
  }>
  personalizedResources: LearningResource[]
  adaptiveLearningPath: {
    currentPhase: string
    nextPhase: string
    phases: Array<{
      name: string
      duration: number
      objectives: string[]
      resources: string[]
      assessment: string
    }>
  }
  skillDevelopment: {
    strengths: Array<{
      skill: string
      level: number
      evidence: string[]
      recommendations: string[]
    }>
    weaknesses: Array<{
      skill: string
      level: number
      impact: number
      improvementPlan: string[]
      estimatedTime: number
    }>
    emergingSkills: Array<{
      skill: string
      potential: number
      developmentPath: string[]
    }>
  }
  geminiInsights?: {
    learningInsights: string
    motivationalTips: string[]
    studyStrategies: string[]
    encouragement: string
    nextSteps: string
  }
}

export interface CollaborativeInsights {
  similarLearners: Array<{
    similarityScore: number
    sharedCharacteristics: string[]
    successfulStrategies: string[]
    commonChallenges: string[]
  }>
  communityTrends: {
    trendingTopics: string[]
    popularResources: string[]
    emergingSkills: string[]
    successPatterns: string[]
  }
  peerRecommendations: Array<{
    source: 'similar_learner' | 'expert' | 'community'
    recommendation: string
    confidence: number
    reasoning: string
  }>
}

export interface AIModelInfo {
  model: string
  confidence: number
  features: string[]
  accuracy?: number
  precision?: number
  recall?: number
}

export interface AIModels {
  learningStyleClassifier: AIModelInfo
  performancePredictor: AIModelInfo
  recommendationEngine: AIModelInfo
  mlLearningStyleClassifier?: AIModelInfo
  mlPerformancePredictor?: AIModelInfo
  mlRecommendationRanker?: AIModelInfo
}

// User context and metadata
export interface UserContext {
  totalQuizzes: number
  averageScore: number
  bestSubject: string
  weakestSubject: string
  learningStreak: number
  lastActive: string
}

export interface RecommendationMetadata {
  generatedAt: string
  engines: string[]
  version: string
  confidence: number
  processingTime?: number
  dataPoints?: number
}

// YouTube specific interfaces
export interface YouTubeVideo {
  id: string
  title: string
  url: string
  duration: string
  relevanceScore: number
  difficulty: string
  learningStyle: string
  aiReasoning: string
  thumbnail?: string
  channelTitle?: string
  viewCount?: number
  description?: string
  tags?: string[]
}

// Study plan interfaces
export interface StudyPlanPhase {
  name: string
  duration: number // days
  objectives: string[]
  resources: string[]
  assessment: string
  mlOptimized?: boolean
}

export interface StudyPlan {
  currentPhase: string
  nextPhase: string
  phases: StudyPlanPhase[]
  progress: number
  estimatedCompletion: string
  mlEnhancements?: {
    optimizedPhases: number
    confidence: number
    expectedOutcome: string
  }
}

// ML model interfaces
export interface MLModelPredictions {
  learningStyle: {
    style: 'visual' | 'auditory' | 'kinesthetic' | 'reading' | 'mixed'
    confidence: number
    probabilities: Record<string, number>
    reasoning: string[]
  }
  performance: {
    expectedScore: number
    confidence: number
    riskFactors: string[]
    improvementSuggestions: string[]
    confidenceInterval: { lower: number; upper: number }
  }
  recommendations: Array<{
    resourceId: string
    relevanceScore: number
    confidence: number
    reasoning: string
    expectedOutcome: string
    rank: number
  }>
}

export interface MLModelMetrics {
  learningStyle: {
    accuracy: number
    trainingDataSize: number
    lastUpdated: string
    modelType: string
  }
  performance: {
    accuracy: number
    trainingDataSize: number
    lastUpdated: string
    modelType: string
  }
  recommendations: {
    precision: number
    recall: number
    trainingDataSize: number
    lastUpdated: string
    modelType: string
  }
}

// Type guards for safe property access
export function isLearningResource(obj: unknown): obj is LearningResource {
  return (
    typeof obj === 'object' &&
    obj !== null &&
    'id' in obj &&
    'title' in obj &&
    'type' in obj &&
    'url' in obj
  )
}

export function isPathRecommendation(obj: unknown): obj is PathRecommendation {
  return (
    typeof obj === 'object' &&
    obj !== null &&
    'path' in obj &&
    'reason' in obj &&
    'matchScore' in obj
  )
}

export function isStudyPlanItem(obj: unknown): obj is StudyPlanItem {
  return (
    typeof obj === 'object' &&
    obj !== null &&
    'week' in obj &&
    'focus' in obj &&
    'activities' in obj
  )
}

export function isPerformanceMetrics(obj: unknown): obj is PerformanceMetrics {
  return (
    typeof obj === 'object' &&
    obj !== null &&
    'score' in obj &&
    'percentage' in obj &&
    'level' in obj
  )
}

export function isAnalyticsData(obj: unknown): obj is AnalyticsData {
  return (
    typeof obj === 'object' &&
    obj !== null &&
    'overallScore' in obj &&
    'categoryPerformance' in obj &&
    'learningTrend' in obj
  )
}

export function isAIAnalysis(obj: unknown): obj is AIAnalysis {
  return (
    typeof obj === 'object' &&
    obj !== null &&
    'learningPattern' in obj &&
    'cognitiveLoad' in obj
  )
}

export function isAIPredictions(obj: unknown): obj is AIPredictions {
  return (
    typeof obj === 'object' &&
    obj !== null &&
    'nextQuizPrediction' in obj &&
    'masteryTimeline' in obj
  )
}

export function isAIRecommendations(obj: unknown): obj is AIRecommendations {
  return (
    typeof obj === 'object' &&
    obj !== null &&
    'immediateActions' in obj &&
    'personalizedResources' in obj
  )
}

export function isCollaborativeInsights(obj: unknown): obj is CollaborativeInsights {
  return (
    typeof obj === 'object' &&
    obj !== null &&
    'similarLearners' in obj &&
    'communityTrends' in obj
  )
}

export function isAIModels(obj: unknown): obj is AIModels {
  return (
    typeof obj === 'object' &&
    obj !== null &&
    'learningStyleClassifier' in obj &&
    'performancePredictor' in obj
  )
}

export function isMLModelPredictions(obj: unknown): obj is MLModelPredictions {
  return (
    typeof obj === 'object' &&
    obj !== null &&
    'learningStyle' in obj &&
    'performance' in obj &&
    'recommendations' in obj
  )
}

// NextAuth module augmentation to add id to session.user
import { DefaultSession } from "next-auth";
declare module "next-auth" {
  interface Session {
    user?: {
      id?: string;
      rememberMe?: boolean;
    } & DefaultSession["user"];
  }
}
