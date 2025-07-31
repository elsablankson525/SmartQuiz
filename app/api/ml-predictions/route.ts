import { NextRequest, NextResponse } from 'next/server'
import { mlModelManager } from '@/lib/ml-models'
import { prisma } from '@/lib/prisma'
import { getServerSession } from 'next-auth'
import { authOptions } from '../auth/[...nextauth]/route'
import '@/lib/init-server' // Initialize continuous learning system
import type { LearningResource } from '@/lib/types'

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { quizResultId, questions, resources } = await request.json()

    if (!quizResultId) {
      return NextResponse.json({ error: 'Quiz result ID is required' }, { status: 400 })
    }

    // Fetch quiz result
    const quizResult = await prisma.quizResult.findUnique({
      where: { id: quizResultId }
    })

    if (!quizResult) {
      return NextResponse.json({ error: 'Quiz result not found' }, { status: 404 })
    }

    // Verify ownership
    if (quizResult.userId !== session.user.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Fetch user history
    const userHistory = await prisma.quizResult.findMany({
      where: { userId: session.user.id },
      orderBy: { date: 'desc' },
      take: 20
    })

    // Fetch learning resources if provided
    let learningResources: LearningResource[] = []
    if (resources && resources.length > 0) {
      const dbResources = await prisma.learningResource.findMany({
        where: {
          id: { in: resources }
        }
      })
      learningResources = dbResources.map(resource => ({
        ...resource,
        relevanceScore: 0, // Default value since not in DB
        estimatedTime: 0, // Default value since not in DB
        tags: [], // Default value since not in DB
        learningOutcomes: [], // Default value since not in DB
        aiReasoning: '', // Default value since not in DB
        personalizedTips: '' // Default value since not in DB
      })) as LearningResource[]
    }

    // Parse questionsAnswered if it exists
    let parsedQuestions: Array<{
      question: string
      userAnswer: string
      correctAnswer: string
      isCorrect: boolean
      topic?: string
    }> = []
    if (quizResult.questionsAnswered) {
      try {
        parsedQuestions = JSON.parse(quizResult.questionsAnswered as string)
      } catch (error) {
        console.warn('Failed to parse questionsAnswered:', error)
      }
    }

    // Parse questionsAnswered for user history
    const parsedUserHistory = userHistory.map(history => {
      let parsedHistoryQuestions: Array<{
        question: string
        userAnswer: string
        correctAnswer: string
        isCorrect: boolean
        topic?: string
      }> = []
      if (history.questionsAnswered) {
        try {
          parsedHistoryQuestions = JSON.parse(history.questionsAnswered as string)
        } catch (error) {
          console.warn('Failed to parse history questionsAnswered:', error)
        }
      }
      return {
        ...history,
        questionsAnswered: parsedHistoryQuestions
      }
    })

    // Generate ML predictions
    const predictions = await mlModelManager.predict(
      {
        ...quizResult,
        questionsAnswered: parsedQuestions
      },
      questions || [],
      parsedUserHistory,
      learningResources
    )

    return NextResponse.json({
      success: true,
      predictions,
      metadata: {
        generatedAt: new Date().toISOString(),
        modelVersion: '1.0.0',
        confidence: predictions.confidence
      }
    })

  } catch (error) {
    console.error('Error generating ML predictions:', error)
    return NextResponse.json(
      { error: 'Failed to generate predictions' },
      { status: 500 }
    )
  }
}

export async function GET(_request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Get model metrics
    const metrics = mlModelManager.getModelMetrics()
    const overallAccuracy = mlModelManager.getOverallAccuracy()
    const allModels = mlModelManager.getAllModels()

    return NextResponse.json({
      success: true,
      metrics,
      overallAccuracy,
      models: allModels,
      metadata: {
        generatedAt: new Date().toISOString(),
        totalModels: allModels.length
      }
    })

  } catch (error) {
    console.error('Error fetching ML model metrics:', error)
    return NextResponse.json(
      { error: 'Failed to fetch model metrics' },
      { status: 500 }
    )
  }
} 