import { NextRequest, NextResponse } from 'next/server'
import { continuousLearningSystem } from '@/lib/continuous-learning-system'
import '@/lib/init-server' // Initialize continuous learning system

export async function GET(_request: NextRequest) {
  try {
    // Get system status
    const status = continuousLearningSystem.getStatus()
    
    // Test adding training data
    const testDataPoint = {
      id: `test-${Date.now()}`,
      timestamp: new Date(),
      quizResult: {
        id: 'test-quiz',
        userId: 'test-user',
        quizId: 'test-quiz-id',
        score: 85,
        totalQuestions: 10,
        timeSpent: 1200,
        date: new Date(),
        questionsAnswered: []
      },
      questions: [
        {
          id: 'q1',
          question: 'What is machine learning?',
          options: ['A type of computer', 'A programming language', 'A subset of AI', 'A database'],
          correctAnswer: 'A subset of AI',
          explanation: 'Machine learning is a subset of artificial intelligence.',
          difficulty: 'medium',
          topic: 'AI/ML'
        }
      ],
      userHistory: [],
      mlPredictions: {
        learningStyle: {
          style: 'visual' as const,
          confidence: 0.85,
          probabilities: { visual: 0.85, auditory: 0.1, kinesthetic: 0.05 },
          reasoning: ['User prefers visual content']
        },
        performance: {
          expectedScore: 85,
          confidence: 0.8,
          riskFactors: ['Time pressure'],
          improvementSuggestions: ['Practice more'],
          confidenceInterval: { lower: 80, upper: 90 }
        },
        confidence: 0.8
      },
      actualLearningStyle: 'visual',
      actualPerformance: 85,
      userFeedback: 4,
      recommendationEngagement: 0.8
    }

    // Add test data
    await continuousLearningSystem.addTrainingData(testDataPoint)
    
    return NextResponse.json({
      success: true,
      message: 'Continuous learning system test completed',
      status,
      testDataAdded: true,
      dataPoints: status.totalDataPoints
    })

  } catch (error) {
    console.error('Test failed:', error)
    return NextResponse.json(
      { error: 'Test failed', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    )
  }
} 