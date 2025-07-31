export interface YouTubeVideo {
  id: string
  title: string
  description: string
  thumbnail: string
  channelTitle: string
  publishedAt: string
  duration: string
  viewCount: number
  likeCount: number
  relevanceScore: number
  difficulty: "beginner" | "intermediate" | "advanced"
  category: string
  tags: string[]
  url: string
}

export interface YouTubeSearchParams {
  query: string
  maxResults?: number
  difficulty?: "beginner" | "intermediate" | "advanced"
  category?: string
  duration?: "short" | "medium" | "long" // short: <4min, medium: 4-20min, long: >20min
  language?: string
}

export class YouTubeService {
  private static instance: YouTubeService
  private apiKey: string
  private baseUrl = "https://www.googleapis.com/youtube/v3"

  private constructor() {
    this.apiKey = process.env.YOUTUBE_API_KEY || ""
    if (!this.apiKey) {
      console.warn("YouTube API key not found. YouTube video recommendations will be disabled.")
    }
  }

  static getInstance(): YouTubeService {
    if (!YouTubeService.instance) {
      YouTubeService.instance = new YouTubeService()
    }
    return YouTubeService.instance
  }

  /**
   * Search for educational videos on YouTube
   */
  async searchEducationalVideos(params: YouTubeSearchParams): Promise<YouTubeVideo[]> {
    if (!this.apiKey) {
      console.warn("YouTube API key not available")
      return []
    }

    try {
      const searchQuery = this.buildSearchQuery(params)
      const searchUrl = `${this.baseUrl}/search?part=snippet&q=${encodeURIComponent(searchQuery)}&type=video&maxResults=${params.maxResults || 10}&key=${this.apiKey}&videoDuration=${this.getDurationParam(params.duration)}&relevanceLanguage=${params.language || 'en'}&order=relevance`

      const searchResponse = await fetch(searchUrl)
      
      if (!searchResponse.ok) {
        console.error(`YouTube API error: ${searchResponse.status} ${searchResponse.statusText}`)
        return []
      }
      
      const searchData = await searchResponse.json()

      if (!searchData.items || searchData.error) {
        console.error("YouTube search error:", searchData.error)
        return []
      }

      // Get video details including duration and statistics
      const videoIds = searchData.items.map((item: { id?: { videoId?: string } }) => {
        if (item.id && typeof item.id === 'object' && 'videoId' in item.id) {
          return item.id.videoId as string;
        }
        return null;
      }).filter(Boolean).join(',')
      const detailsUrl = `${this.baseUrl}/videos?part=contentDetails,statistics,snippet&id=${videoIds}&key=${this.apiKey}`

      const detailsResponse = await fetch(detailsUrl)
      
      if (!detailsResponse.ok) {
        console.error(`YouTube API details error: ${detailsResponse.status} ${detailsResponse.statusText}`)
        return []
      }
      
      const detailsData = await detailsResponse.json()

      if (!detailsData.items) {
        return []
      }

      // Combine search and details data
      const videos: YouTubeVideo[] = detailsData.items.map((video: {
        id: string;
        contentDetails: { duration: string };
        statistics: { viewCount: string; likeCount: string };
        snippet: {
          title: string;
          description: string;
          thumbnails: { high?: { url: string }; medium?: { url: string } };
          channelTitle: string;
          publishedAt: string;
          tags?: string[];
        };
      }) => {
        const duration = this.parseDuration(video.contentDetails.duration)
        const viewCount = parseInt(video.statistics.viewCount) || 0
        const likeCount = parseInt(video.statistics.likeCount) || 0

        return {
          id: video.id,
          title: video.snippet.title,
          description: video.snippet.description,
          thumbnail: video.snippet.thumbnails.high?.url || video.snippet.thumbnails.medium?.url,
          channelTitle: video.snippet.channelTitle,
          publishedAt: video.snippet.publishedAt,
          duration,
          viewCount,
          likeCount,
          relevanceScore: this.calculateRelevanceScore(params, duration, viewCount, likeCount),
          difficulty: this.estimateDifficulty(params.query, video.snippet.title, video.snippet.description),
          category: params.category || "general",
          tags: video.snippet.tags || [],
          url: `https://www.youtube.com/watch?v=${video.id}`
        }
      })

      // Sort by relevance score
      return videos.sort((a, b) => b.relevanceScore - a.relevanceScore)

    } catch (error) {
      console.error("Error searching YouTube videos:", error)
      return []
    }
  }

  /**
   * Get subject-specific educational videos
   */
  async getSubjectVideos(subject: string, difficulty: string, maxResults: number = 5): Promise<YouTubeVideo[]> {
    const subjectQueries = this.getSubjectQueries(subject, difficulty)
    
    const allVideos: YouTubeVideo[] = []
    
    for (const query of subjectQueries) {
      const videos = await this.searchEducationalVideos({
        query,
        maxResults: Math.ceil(maxResults / subjectQueries.length),
        difficulty: difficulty as "beginner" | "intermediate" | "advanced",
        category: subject,
        duration: "medium"
      })
      allVideos.push(...videos)
    }

    // Remove duplicates and sort by relevance
    const uniqueVideos = this.removeDuplicateVideos(allVideos)
    return uniqueVideos.slice(0, maxResults)
  }

  /**
   * Get videos for specific learning topics
   */
  async getTopicVideos(topic: string, learningStyle: string, maxResults: number = 3): Promise<YouTubeVideo[]> {
    const styleQueries = this.getLearningStyleQueries(topic, learningStyle)
    
    const videos = await this.searchEducationalVideos({
      query: styleQueries[0], // Use primary query
      maxResults,
      category: topic,
      duration: learningStyle === "visual" ? "medium" : "short"
    })

    return videos
  }

  /**
   * Build search query based on parameters
   */
  private buildSearchQuery(params: YouTubeSearchParams): string {
    let query = params.query

    // Add educational context
    if (!query.includes("tutorial") && !query.includes("course") && !query.includes("lesson")) {
      query += " tutorial"
    }

    // Add difficulty context
    if (params.difficulty === "beginner") {
      query += " for beginners"
    } else if (params.difficulty === "advanced") {
      query += " advanced"
    }

    // Add educational channel boosters
    query += " (Khan Academy OR MIT OR Stanford OR Harvard OR Coursera OR edX)"

    return query
  }

  /**
   * Get duration parameter for YouTube API
   */
  private getDurationParam(duration?: string): string {
    switch (duration) {
      case "short": return "short" // <4 minutes
      case "long": return "long" // >20 minutes
      default: return "medium" // 4-20 minutes
    }
  }

  /**
   * Parse YouTube duration format (PT4M13S) to readable format
   */
  private parseDuration(duration: string): string {
    const match = duration.match(/PT(?:(\d+)H)?(?:(\d+)M)?(?:(\d+)S)?/)
    if (!match) return "0:00"

    const hours = parseInt(match[1]) || 0
    const minutes = parseInt(match[2]) || 0
    const seconds = parseInt(match[3]) || 0

    if (hours > 0) {
      return `${hours}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`
    } else {
      return `${minutes}:${seconds.toString().padStart(2, '0')}`
    }
  }

  /**
   * Calculate relevance score for a video
   */
  private calculateRelevanceScore(params: YouTubeSearchParams, duration: string, viewCount: number, likeCount: number): number {
    let score = 0.5 // Base score

    // Duration scoring
    const durationMinutes = this.durationToMinutes(duration)
    if (params.duration === "short" && durationMinutes <= 4) score += 0.2
    else if (params.duration === "medium" && durationMinutes > 4 && durationMinutes <= 20) score += 0.2
    else if (params.duration === "long" && durationMinutes > 20) score += 0.2

    // Popularity scoring (normalized)
    const normalizedViews = Math.min(viewCount / 100000, 1) // Cap at 100k views
    score += normalizedViews * 0.2

    // Engagement scoring
    const engagementRate = viewCount > 0 ? likeCount / viewCount : 0
    score += Math.min(engagementRate * 100, 0.1) // Cap engagement bonus

    return Math.min(score, 1.0)
  }

  /**
   * Convert duration string to minutes
   */
  private durationToMinutes(duration: string): number {
    const parts = duration.split(':').map(Number)
    if (parts.length === 2) {
      return parts[0] + parts[1] / 60
    } else if (parts.length === 3) {
      return parts[0] * 60 + parts[1] + parts[2] / 60
    }
    return 0
  }

  /**
   * Estimate video difficulty based on title and description
   */
  private estimateDifficulty(query: string, title: string, description: string): "beginner" | "intermediate" | "advanced" {
    const text = `${query} ${title} ${description}`.toLowerCase()
    
    const beginnerKeywords = ['beginner', 'basic', 'introduction', 'fundamentals', 'start', 'first', 'simple', 'easy']
    const advancedKeywords = ['advanced', 'expert', 'master', 'complex', 'deep dive', 'professional', 'senior']
    
    const beginnerCount = beginnerKeywords.filter(keyword => text.includes(keyword)).length
    const advancedCount = advancedKeywords.filter(keyword => text.includes(keyword)).length
    
    if (advancedCount > beginnerCount) return "advanced"
    if (beginnerCount > advancedCount) return "beginner"
    return "intermediate"
  }

  /**
   * Get subject-specific search queries
   */
  private getSubjectQueries(subject: string, difficulty: string): string[] {
    const subjectMap: Record<string, Record<string, string[]>> = {
      "computer-science": {
        beginner: [
          "programming basics",
          "coding for beginners",
          "computer science fundamentals",
          "introduction to programming"
        ],
        intermediate: [
          "intermediate programming",
          "software development",
          "data structures algorithms",
          "object oriented programming"
        ],
        advanced: [
          "advanced programming",
          "software architecture",
          "system design",
          "machine learning"
        ]
      },
      "mathematics": {
        beginner: [
          "math basics",
          "algebra fundamentals",
          "mathematics for beginners",
          "basic arithmetic"
        ],
        intermediate: [
          "intermediate mathematics",
          "calculus basics",
          "statistics fundamentals",
          "geometry concepts"
        ],
        advanced: [
          "advanced mathematics",
          "calculus advanced",
          "linear algebra",
          "mathematical proofs"
        ]
      },
      "science": {
        beginner: [
          "science basics",
          "scientific method",
          "physics fundamentals",
          "chemistry basics"
        ],
        intermediate: [
          "intermediate science",
          "laboratory techniques",
          "scientific research",
          "experimental design"
        ],
        advanced: [
          "advanced science",
          "research methodology",
          "scientific analysis",
          "laboratory research"
        ]
      },
      "business": {
        beginner: [
          "business basics",
          "entrepreneurship fundamentals",
          "business management",
          "marketing basics"
        ],
        intermediate: [
          "intermediate business",
          "business strategy",
          "financial management",
          "organizational behavior"
        ],
        advanced: [
          "advanced business",
          "business analytics",
          "strategic management",
          "international business"
        ]
      }
    }

    return subjectMap[subject]?.[difficulty] || [`${subject} ${difficulty}`]
  }

  /**
   * Get learning style specific queries
   */
  private getLearningStyleQueries(topic: string, learningStyle: string): string[] {
    const styleQueries: Record<string, string[]> = {
      visual: [
        `${topic} visual tutorial`,
        `${topic} diagrams`,
        `${topic} visual learning`,
        `${topic} step by step visual`
      ],
      auditory: [
        `${topic} audio tutorial`,
        `${topic} lecture`,
        `${topic} explanation`,
        `${topic} discussion`
      ],
      kinesthetic: [
        `${topic} hands on tutorial`,
        `${topic} practical examples`,
        `${topic} interactive tutorial`,
        `${topic} practice exercises`
      ],
      reading: [
        `${topic} comprehensive guide`,
        `${topic} detailed explanation`,
        `${topic} textbook style`,
        `${topic} in depth tutorial`
      ]
    }

    return styleQueries[learningStyle] || [`${topic} tutorial`]
  }

  /**
   * Remove duplicate videos based on video ID
   */
  private removeDuplicateVideos(videos: YouTubeVideo[]): YouTubeVideo[] {
    const seen = new Set<string>()
    return videos.filter(video => {
      if (seen.has(video.id)) {
        return false
      }
      seen.add(video.id)
      return true
    })
  }

  /**
   * Check if YouTube API is available
   */
  isAvailable(): boolean {
    return !!this.apiKey
  }

  /**
   * Get API status
   */
  async getApiStatus(): Promise<{ available: boolean; error?: string }> {
    if (!this.apiKey) {
      return { available: false, error: "API key not configured" }
    }

    try {
      const testUrl = `${this.baseUrl}/search?part=snippet&q=test&maxResults=1&key=${this.apiKey}`
      const response = await fetch(testUrl)
      const data = await response.json()

      if (data.error) {
        return { available: false, error: data.error.message }
      }

      return { available: true }
    } catch {
      return { available: false, error: "API request failed" }
    }
  }
}

// Export singleton instance
export const youtubeService = YouTubeService.getInstance() 