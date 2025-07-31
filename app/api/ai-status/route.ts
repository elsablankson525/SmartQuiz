import { NextRequest, NextResponse } from 'next/server'
import { MultiAIService } from '@/lib/multi-ai-service'

export async function GET(_request: NextRequest) {
  try {
    const aiService = MultiAIService.getInstance()
    
    // Get provider stats
    const providerStats = aiService.getProviderStats()
    
    // Test all providers
    const testResults = await aiService.testProviders()
    
    // Get current provider
    const currentProvider = aiService.getCurrentProvider()
    
    // Get available providers
    const availableProviders = aiService.getAvailableProviders()
    
    return NextResponse.json({
      status: 'success',
      data: {
        currentProvider,
        availableProviders,
        providerStats,
        testResults,
        timestamp: new Date().toISOString()
      }
    })
  } catch (error) {
    console.error('Error checking AI status:', error)
    return NextResponse.json(
      {
        status: 'error',
        message: 'Failed to check AI service status',
        error: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    )
  }
} 