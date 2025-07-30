import { GoogleGenerativeAI } from '@google/generative-ai'

// AI Provider Types
export type AIProvider = 'gemini' | 'deepseek' | 'groq' | 'xai'

export interface AIResponse {
  text: string
  provider: AIProvider
  model: string
  tokensUsed?: number
  responseTime: number
}

export interface AIServiceConfig {
  provider: AIProvider
  apiKey: string
  model: string
  maxTokens?: number
  temperature?: number
}

export class MultiAIService {
  private static instance: MultiAIService
  private providers: Map<AIProvider, AIServiceConfig> = new Map()
  private currentProvider: AIProvider = 'gemini'
  private fallbackOrder: AIProvider[] = ['gemini', 'deepseek', 'groq', 'xai']
  private geminiService: GoogleGenerativeAI | null = null

  static getInstance(): MultiAIService {
    if (!MultiAIService.instance) {
      MultiAIService.instance = new MultiAIService()
    }
    return MultiAIService.instance
  }

  constructor() {
    this.initializeProviders()
  }

  /**
   * Initialize all available AI providers
   */
  private initializeProviders(): void {
    // Initialize Gemini
    if (process.env.GOOGLE_AI_API_KEY) {
      this.providers.set('gemini', {
        provider: 'gemini',
        apiKey: process.env.GOOGLE_AI_API_KEY,
        model: 'gemini-1.5-flash',
        maxTokens: 4096,
        temperature: 0.7
      })
      this.geminiService = new GoogleGenerativeAI(process.env.GOOGLE_AI_API_KEY)
    }

    // Initialize DeepSeek
    if (process.env.DEEPSEEK_API_KEY) {
      this.providers.set('deepseek', {
        provider: 'deepseek',
        apiKey: process.env.DEEPSEEK_API_KEY,
        model: 'deepseek-chat',
        maxTokens: 4096,
        temperature: 0.7
      })
    }

    // Initialize Groq
    if (process.env.GROQ_API_KEY) {
      this.providers.set('groq', {
        provider: 'groq',
        apiKey: process.env.GROQ_API_KEY,
        model: 'llama3-8b-8192',
        maxTokens: 4096,
        temperature: 0.7
      })
    }

    // Initialize XAI
    if (process.env.XAI_API_KEY) {
      this.providers.set('xai', {
        provider: 'xai',
        apiKey: process.env.XAI_API_KEY,
        model: 'grok-beta',
        maxTokens: 4096,
        temperature: 0.7
      })
    }

    // Set initial provider based on availability
    this.setOptimalProvider()
  }

  /**
   * Set the optimal provider based on availability and performance
   */
  private setOptimalProvider(): void {
    for (const provider of this.fallbackOrder) {
      if (this.providers.has(provider)) {
        this.currentProvider = provider
        break
      }
    }
  }

  /**
   * Get current provider
   */
  getCurrentProvider(): AIProvider {
    return this.currentProvider
  }

  /**
   * Get available providers
   */
  getAvailableProviders(): AIProvider[] {
    return Array.from(this.providers.keys())
  }

  /**
   * Switch to a specific provider
   */
  switchProvider(provider: AIProvider): boolean {
    if (this.providers.has(provider)) {
      this.currentProvider = provider
      return true
    }
    return false
  }

  /**
   * Generate content using the current provider with automatic fallback
   */
  async generateContent(prompt: string, options?: {
    provider?: AIProvider
    maxTokens?: number
    temperature?: number
  }): Promise<AIResponse> {
    const startTime = Date.now()
    const targetProvider = options?.provider || this.currentProvider
    const providersToTry = this.getFallbackOrder(targetProvider)

    for (const provider of providersToTry) {
      try {
        const response = await this.generateWithProvider(provider, prompt, options)
        return {
          ...response,
          responseTime: Date.now() - startTime
        }
      } catch (error) {
        console.warn(`Failed to generate content with ${provider}:`, error)
        continue
      }
    }

    throw new Error('All AI providers failed to generate content')
  }

  /**
   * Generate content with a specific provider
   */
  private async generateWithProvider(
    provider: AIProvider,
    prompt: string,
    options?: {
      maxTokens?: number
      temperature?: number
    }
  ): Promise<Omit<AIResponse, 'responseTime'>> {
    const config = this.providers.get(provider)
    if (!config) {
      throw new Error(`Provider ${provider} not configured`)
    }

    switch (provider) {
      case 'gemini':
        return this.generateWithGemini(prompt, options)
      case 'deepseek':
        return this.generateWithDeepSeek(prompt, options)
      case 'groq':
        return this.generateWithGroq(prompt, options)
      case 'xai':
        return this.generateWithXAI(prompt, options)
      default:
        throw new Error(`Unsupported provider: ${provider}`)
    }
  }

  /**
   * Generate content with Gemini
   */
  private async generateWithGemini(
    prompt: string,
    options?: {
      maxTokens?: number
      temperature?: number
    }
  ): Promise<Omit<AIResponse, 'responseTime'>> {
    if (!this.geminiService) {
      throw new Error('Gemini service not initialized')
    }

    const model = this.geminiService.getGenerativeModel({
      model: 'gemini-1.5-flash',
      generationConfig: {
        maxOutputTokens: options?.maxTokens || 4096,
        temperature: options?.temperature || 0.7,
      },
    })

    const result = await model.generateContent(prompt)
    const response = await result.response
    const text = response.text()

    return {
      text,
      provider: 'gemini',
      model: 'gemini-1.5-flash',
      tokensUsed: result.response.usageMetadata?.totalTokenCount
    }
  }

  /**
   * Generate content with DeepSeek
   */
  private async generateWithDeepSeek(
    prompt: string,
    options?: {
      maxTokens?: number
      temperature?: number
    }
  ): Promise<Omit<AIResponse, 'responseTime'>> {
    const config = this.providers.get('deepseek')
    if (!config) {
      throw new Error('DeepSeek not configured')
    }

    const response = await fetch('https://api.deepseek.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${config.apiKey}`
      },
      body: JSON.stringify({
        model: config.model,
        messages: [
          {
            role: 'user',
            content: prompt
          }
        ],
        max_tokens: options?.maxTokens || config.maxTokens,
        temperature: options?.temperature || config.temperature,
        stream: false
      })
    })

    if (!response.ok) {
      throw new Error(`DeepSeek API error: ${response.status} ${response.statusText}`)
    }

    const data = await response.json()
    const text = data.choices[0]?.message?.content || ''

    return {
      text,
      provider: 'deepseek',
      model: config.model,
      tokensUsed: data.usage?.total_tokens
    }
  }

  /**
   * Generate content with Groq
   */
  private async generateWithGroq(
    prompt: string,
    options?: {
      maxTokens?: number
      temperature?: number
    }
  ): Promise<Omit<AIResponse, 'responseTime'>> {
    const config = this.providers.get('groq')
    if (!config) {
      throw new Error('Groq not configured')
    }

    const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${config.apiKey}`
      },
      body: JSON.stringify({
        model: config.model,
        messages: [
          {
            role: 'user',
            content: prompt
          }
        ],
        max_tokens: options?.maxTokens || config.maxTokens,
        temperature: options?.temperature || config.temperature,
        stream: false
      })
    })

    if (!response.ok) {
      throw new Error(`Groq API error: ${response.status} ${response.statusText}`)
    }

    const data = await response.json()
    const text = data.choices[0]?.message?.content || ''

    return {
      text,
      provider: 'groq',
      model: config.model,
      tokensUsed: data.usage?.total_tokens
    }
  }

  /**
   * Generate content with XAI (Grok)
   */
  private async generateWithXAI(
    prompt: string,
    options?: {
      maxTokens?: number
      temperature?: number
    }
  ): Promise<Omit<AIResponse, 'responseTime'>> {
    const config = this.providers.get('xai')
    if (!config) {
      throw new Error('XAI not configured')
    }

    // Note: XAI API endpoint may vary based on their current implementation
    // This is a placeholder implementation
    const response = await fetch('https://api.x.ai/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${config.apiKey}`
      },
      body: JSON.stringify({
        model: config.model,
        messages: [
          {
            role: 'user',
            content: prompt
          }
        ],
        max_tokens: options?.maxTokens || config.maxTokens,
        temperature: options?.temperature || config.temperature,
        stream: false
      })
    })

    if (!response.ok) {
      throw new Error(`XAI API error: ${response.status} ${response.statusText}`)
    }

    const data = await response.json()
    const text = data.choices[0]?.message?.content || ''

    return {
      text,
      provider: 'xai',
      model: config.model,
      tokensUsed: data.usage?.total_tokens
    }
  }

  /**
   * Get fallback order starting from the specified provider
   */
  private getFallbackOrder(startProvider: AIProvider): AIProvider[] {
    const startIndex = this.fallbackOrder.indexOf(startProvider)
    if (startIndex === -1) {
      return this.fallbackOrder
    }

    const ordered = [
      ...this.fallbackOrder.slice(startIndex),
      ...this.fallbackOrder.slice(0, startIndex)
    ]

    // Filter to only include available providers
    return ordered.filter(provider => this.providers.has(provider))
  }

  /**
   * Get provider statistics
   */
  getProviderStats(): Record<AIProvider, {
    available: boolean
    model: string
    maxTokens: number
    temperature: number
  }> {
    const stats: Partial<Record<AIProvider, {
      available: boolean
      model: string
      maxTokens: number
      temperature: number
    }>> = {}
    
    for (const provider of this.fallbackOrder) {
      const config = this.providers.get(provider)
      stats[provider] = {
        available: !!config,
        model: config?.model || 'N/A',
        maxTokens: config?.maxTokens || 0,
        temperature: config?.temperature || 0
      }
    }

    return stats as Record<AIProvider, {
      available: boolean
      model: string
      maxTokens: number
      temperature: number
    }>
  }

  /**
   * Test all available providers
   */
  async testProviders(): Promise<Record<AIProvider, {
    success: boolean
    responseTime: number
    error?: string
  }>> {
    const testPrompt = 'Hello, this is a test message. Please respond with "Test successful."'
    const results: Partial<Record<AIProvider, {
      success: boolean
      responseTime: number
      error?: string
    }>> = {}

    for (const provider of this.getAvailableProviders()) {
      const startTime = Date.now()
      try {
        await this.generateWithProvider(provider, testPrompt)
        results[provider] = {
          success: true,
          responseTime: Date.now() - startTime
        }
      } catch (error) {
        results[provider] = {
          success: false,
          responseTime: Date.now() - startTime,
          error: error instanceof Error ? error.message : 'Unknown error'
        }
      }
    }

    return results as Record<AIProvider, {
      success: boolean
      responseTime: number
      error?: string
    }>
  }

  /**
   * Rotate to next available provider
   */
  rotateProvider(): AIProvider {
    const availableProviders = this.getAvailableProviders()
    const currentIndex = availableProviders.indexOf(this.currentProvider)
    const nextIndex = (currentIndex + 1) % availableProviders.length
    this.currentProvider = availableProviders[nextIndex]
    return this.currentProvider
  }

  /**
   * Get provider with best performance (lowest response time)
   */
  async getBestPerformingProvider(): Promise<AIProvider> {
    const testResults = await this.testProviders()
    let bestProvider: AIProvider = this.currentProvider
    let bestTime = Infinity

    for (const [provider, result] of Object.entries(testResults)) {
      if (result.success && result.responseTime < bestTime) {
        bestTime = result.responseTime
        bestProvider = provider as AIProvider
      }
    }

    return bestProvider
  }
}

// Export singleton instance
export const multiAIService = MultiAIService.getInstance() 