import type { Question } from "./types"
import { prisma } from "@/lib/prisma"

// Enhanced Question interface with explanations
export interface EnhancedQuestion extends Question {
  explanation: string
  category: string
  difficulty: string
  topic: string
  source?: string
  relatedConcepts?: string[]
}

// Remove comprehensiveQuestions and replace with DB fetch
export async function getQuizQuestions(category: string, difficulty: string): Promise<EnhancedQuestion[]> {
  // Fetch questions with their category relation
  const questions = await prisma.quizQuestion.findMany({
    where: {
      difficulty,
      category: { name: category },
    },
    include: {
      category: true,
    },
  });

  // Map DB results to EnhancedQuestion
  return questions.map((q) => ({
    id: q.id,
    question: q.question,
    options: q.options,
    correctAnswer: q.correctAnswer,
    explanation: q.explanation ?? "No explanation provided.",
    category: q.category?.name ?? category, // fallback to input if missing
    difficulty: q.difficulty,
    topic: q.topic ?? "General",
    source: undefined, // Not present in DB
    relatedConcepts: q.relatedConcepts ?? [],
  }));
}

// Function to generate questions using AI with fallback to comprehensive database
export async function generateQuestions(
  category: string,
  difficulty: string,
  count: number,
): Promise<EnhancedQuestion[]> {
  try {
    // First, try to get questions from our comprehensive database
    const availableQuestions = await getQuizQuestions(category, difficulty)

    if (availableQuestions.length >= count) {
      // Shuffle and return the requested number of questions
      return shuffleArray(availableQuestions).slice(0, count)
    }

    // If we don't have enough questions, supplement with generated ones
    const existingCount = availableQuestions.length
    const neededCount = count - existingCount

    // In a real implementation, this would call the AI API
    // For now, we'll return what we have and fill with similar questions
    const supplementaryQuestions = await generateSupplementaryQuestions(category, difficulty, neededCount)

    return [...availableQuestions, ...supplementaryQuestions].slice(0, count)
  } catch (error) {
    console.error("Error generating questions:", error)
    // Fallback to available questions
    const availableQuestions = await getQuizQuestions(category, difficulty)
    return shuffleArray(availableQuestions).slice(0, Math.min(count, availableQuestions.length))
  }
}

// Generate supplementary questions when database is insufficient
async function generateSupplementaryQuestions(category: string, difficulty: string, count: number): Promise<EnhancedQuestion[]> {
  const baseQuestions = await getQuizQuestions(category, difficulty)
  const supplementary: EnhancedQuestion[] = []

  for (let i = 0; i < count && i < baseQuestions.length; i++) {
    const baseQuestion = baseQuestions[i % baseQuestions.length]
    supplementary.push({
      ...baseQuestion,
      question: `${baseQuestion.question} (Variation ${i + 1})`,
      difficulty: difficulty,
    })
  }

  return supplementary
}

// Helper function to shuffle an array
function shuffleArray<T>(array: T[]): T[] {
  const newArray = [...array]
  for (let i = newArray.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[newArray[i], newArray[j]] = [newArray[j], newArray[i]]
  }
  return newArray
}

// Get questions by topic
export async function getQuestionsByTopic(category: string, topic: string, count = 10): Promise<EnhancedQuestion[]> {
  const categoryQuestions = await getQuizQuestions(category, "all") // Assuming "all" for topic filtering
  const topicQuestions = categoryQuestions.filter((q: EnhancedQuestion) => q.topic === topic)
  return shuffleArray(topicQuestions).slice(0, count)
}

// Get questions by difficulty
export async function getQuestionsByDifficulty(category: string, difficulty: string, count = 10): Promise<EnhancedQuestion[]> {
  const categoryQuestions = await getQuizQuestions(category, difficulty)
  return shuffleArray(categoryQuestions).slice(0, count)
}
