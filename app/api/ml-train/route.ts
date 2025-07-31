import { NextRequest, NextResponse } from 'next/server'
import { mlModelManager, type TrainingData } from '@/lib/ml-models'
import { MLTrainingDataGenerator } from '@/lib/ml-training-data'
import { getServerSession } from 'next-auth'
import { authOptions } from '../auth/[...nextauth]/route'

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { modelType, dataSize = 1000, useRealisticData = true } = await request.json()

    if (!modelType || !['learning-style', 'performance', 'recommendation', 'all'].includes(modelType)) {
      return NextResponse.json({ error: 'Invalid model type' }, { status: 400 })
    }

    let trainingData: TrainingData[keyof TrainingData] | TrainingData
    const results: Array<{ model: string; modelType: string; version: string; lastTrained: Date; accuracy: number; isActive: boolean }> = []

    if (modelType === 'all') {
      // Train all models
      trainingData = useRealisticData 
        ? MLTrainingDataGenerator.generateRealisticTrainingData(dataSize)
        : MLTrainingDataGenerator.generateCompleteTrainingData(dataSize)

      // Train each model
      if (trainingData.learningStyle) {
        const result = await mlModelManager.retrainModel('learning-style', trainingData.learningStyle)
        results.push({ model: 'learning-style', ...result })
      }

      if (trainingData.performance) {
        const result = await mlModelManager.retrainModel('performance', trainingData.performance)
        results.push({ model: 'performance', ...result })
      }

      if (trainingData.recommendations) {
        const result = await mlModelManager.retrainModel('recommendation', trainingData.recommendations)
        results.push({ model: 'recommendation', ...result })
      }
    } else {
      // Train specific model
      switch (modelType) {
        case 'learning-style':
          trainingData = useRealisticData 
            ? MLTrainingDataGenerator.generateRealisticTrainingData(dataSize).learningStyle
            : MLTrainingDataGenerator.generateLearningStyleTrainingData(dataSize)
          break
        case 'performance':
          trainingData = useRealisticData 
            ? MLTrainingDataGenerator.generateRealisticTrainingData(dataSize).performance
            : MLTrainingDataGenerator.generatePerformanceTrainingData(dataSize)
          break
        case 'recommendation':
          trainingData = useRealisticData 
            ? MLTrainingDataGenerator.generateRealisticTrainingData(dataSize).recommendations
            : MLTrainingDataGenerator.generateRecommendationTrainingData(dataSize)
          break
      }

      const result = await mlModelManager.retrainModel(modelType, trainingData as TrainingData[keyof TrainingData])
      results.push({ model: modelType, ...result })
    }

    // Get updated metrics
    const metrics = mlModelManager.getModelMetrics()
    const overallAccuracy = mlModelManager.getOverallAccuracy()

    return NextResponse.json({
      success: true,
      message: `Successfully trained ${modelType === 'all' ? 'all models' : modelType} model`,
      results,
      metrics,
      overallAccuracy,
      metadata: {
        trainedAt: new Date().toISOString(),
        dataSize,
        useRealisticData,
        totalModels: results.length
      }
    })

  } catch (error) {
    console.error('Error training ML models:', error)
    return NextResponse.json(
      { error: 'Failed to train models' },
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

    // Get current model status
    const allModels = mlModelManager.getAllModels()
    const metrics = mlModelManager.getModelMetrics()
    const overallAccuracy = mlModelManager.getOverallAccuracy()

    return NextResponse.json({
      success: true,
      models: allModels,
      metrics,
      overallAccuracy,
      metadata: {
        generatedAt: new Date().toISOString(),
        totalModels: allModels.length,
        trainingStatus: 'ready'
      }
    })

  } catch (error) {
    console.error('Error fetching training status:', error)
    return NextResponse.json(
      { error: 'Failed to fetch training status' },
      { status: 500 }
    )
  }
} 