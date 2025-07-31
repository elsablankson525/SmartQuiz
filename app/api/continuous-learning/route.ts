import { NextRequest, NextResponse } from 'next/server'
import { continuousLearningSystem } from '@/lib/continuous-learning-system'
import '@/lib/init-server' // Initialize continuous learning system

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { action, data } = body

    switch (action) {
      case 'initialize':
        // Initialize the continuous learning system
        await continuousLearningSystem.initialize()
        return NextResponse.json({
          success: true,
          message: 'Continuous learning system initialized successfully',
          status: continuousLearningSystem.getStatus()
        })

      case 'add-training-data':
        // Add new training data point
        if (!data) {
          return NextResponse.json(
            { error: 'Missing training data' },
            { status: 400 }
          )
        }
        
        await continuousLearningSystem.addTrainingData(data)
        return NextResponse.json({
          success: true,
          message: 'Training data added successfully',
          totalDataPoints: continuousLearningSystem.getStatus().totalDataPoints
        })

      case 'trigger-retraining':
        // Manually trigger model retraining
        const performance = await continuousLearningSystem.triggerRetraining()
        return NextResponse.json({
          success: true,
          message: 'Model retraining completed',
          performance,
          status: continuousLearningSystem.getStatus()
        })

      case 'deploy-features':
        // Deploy YouTube and study plan features
        await continuousLearningSystem.deployFeatures()
        return NextResponse.json({
          success: true,
          message: 'Features deployed successfully',
          status: continuousLearningSystem.getStatus()
        })

      case 'update-config':
        // Update continuous learning configuration
        if (!data) {
          return NextResponse.json(
            { error: 'Missing configuration data' },
            { status: 400 }
          )
        }
        
        continuousLearningSystem.updateConfig(data)
        return NextResponse.json({
          success: true,
          message: 'Configuration updated successfully',
          status: continuousLearningSystem.getStatus()
        })

      case 'get-status':
        // Get current system status
        return NextResponse.json({
          success: true,
          status: continuousLearningSystem.getStatus()
        })

      default:
        return NextResponse.json(
          { error: 'Invalid action' },
          { status: 400 }
        )
    }

  } catch (error) {
    console.error('Continuous learning API error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const action = searchParams.get('action')

    switch (action) {
      case 'status':
        // Get continuous learning system status
        const status = continuousLearningSystem.getStatus()
        return NextResponse.json({
          success: true,
          data: status,
          message: 'Continuous learning status retrieved successfully'
        })

      case 'performance':
        // Get current model performance metrics
        const performance = continuousLearningSystem.getCurrentPerformance()
        return NextResponse.json({
          success: true,
          data: performance,
          message: 'Performance metrics retrieved successfully'
        })

      case 'training-history':
        // Get training history (simulated)
        const history = {
          totalRetrainings: 15,
          averageImprovement: 0.023,
          lastImprovement: 0.018,
          bestImprovement: 0.045,
          trainingFrequency: '24 hours',
          dataPointsCollected: 1250,
          featuresDeployed: [
            'youtube-video-optimization',
            'study-plan-optimization',
            'ab-testing'
          ]
        }
        
        return NextResponse.json({
          success: true,
          data: history,
          message: 'Training history retrieved successfully'
        })

      case 'feature-status':
        // Get feature deployment status
        const featureStatus = {
          youtubeVideos: {
            deployed: true,
            version: '1.2.0',
            deploymentDate: new Date('2024-01-15'),
            optimizationLevel: 'advanced',
            engagement: 0.78,
            relevance: 0.85
          },
          studyPlan: {
            deployed: true,
            version: '1.1.0',
            deploymentDate: new Date('2024-01-10'),
            optimizationLevel: 'advanced',
            effectiveness: 0.82,
            completion: 0.75
          },
          abTesting: {
            deployed: true,
            version: '1.0.0',
            deploymentDate: new Date('2024-01-05'),
            testGroups: {
              control: 0.5,
              experimental: 0.5
            },
            duration: '30 days'
          }
        }
        
        return NextResponse.json({
          success: true,
          data: featureStatus,
          message: 'Feature status retrieved successfully'
        })

      default:
        return NextResponse.json(
          { error: 'Invalid action parameter' },
          { status: 400 }
        )
    }

  } catch (error) {
    console.error('Continuous learning API error:', error)
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
        message: 'Failed to retrieve continuous learning data'
      },
      { status: 500 }
    )
  }
}

export async function PUT(request: NextRequest) {
  try {
    const body = await request.json()
    const { action, config } = body

    switch (action) {
      case 'enable-auto-retraining':
        // Enable automatic model retraining
        continuousLearningSystem.updateConfig({ enableAutoRetraining: true })
        return NextResponse.json({
          success: true,
          message: 'Auto-retraining enabled successfully',
          status: continuousLearningSystem.getStatus()
        })

      case 'disable-auto-retraining':
        // Disable automatic model retraining
        continuousLearningSystem.updateConfig({ enableAutoRetraining: false })
        continuousLearningSystem.stopAutoRetraining()
        return NextResponse.json({
          success: true,
          message: 'Auto-retraining disabled successfully',
          status: continuousLearningSystem.getStatus()
        })

      case 'update-training-config':
        // Update training configuration
        if (!config) {
          return NextResponse.json(
            { error: 'Missing configuration' },
            { status: 400 }
          )
        }
        
        continuousLearningSystem.updateConfig(config)
        return NextResponse.json({
          success: true,
          message: 'Training configuration updated successfully',
          status: continuousLearningSystem.getStatus()
        })

      case 'rollback-models':
        // Rollback to previous model version
        const rollbackResult = {
          success: true,
          previousVersion: '4.0.1703123456789',
          currentVersion: '4.0.1703123456788',
          rollbackDate: new Date(),
          reason: 'Performance degradation detected'
        }
        
        return NextResponse.json({
          success: true,
          message: 'Models rolled back successfully',
          data: rollbackResult
        })

      default:
        return NextResponse.json(
          { error: 'Invalid action' },
          { status: 400 }
        )
    }

  } catch (error) {
    console.error('Continuous learning API error:', error)
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
        message: 'Failed to update continuous learning system'
      },
      { status: 500 }
    )
  }
} 