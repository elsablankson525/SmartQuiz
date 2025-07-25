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
  milestones: any[] // You may want to type this more strictly
}

// NextAuth module augmentation to add id to session.user
import { DefaultSession } from "next-auth";
declare module "next-auth" {
  interface Session {
    user?: {
      id?: string;
    } & DefaultSession["user"];
  }
}
