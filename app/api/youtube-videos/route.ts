import { NextRequest, NextResponse } from 'next/server'
import { youtubeService } from '@/lib/youtube-service'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const subject = searchParams.get('subject') || 'computer-science'
    const difficulty = searchParams.get('difficulty') || 'beginner'
    const maxResults = parseInt(searchParams.get('maxResults') || '5')
    const topic = searchParams.get('topic') || ''
    const learningStyle = searchParams.get('learningStyle') || 'visual'

    // Check if YouTube API is available
    const apiStatus = await youtubeService.getApiStatus()
    if (!apiStatus.available) {
      return NextResponse.json({
        success: false,
        error: apiStatus.error || 'YouTube API not available',
        videos: []
      })
    }

    let videos = []

    if (topic) {
      // Get topic-specific videos
      videos = await youtubeService.getTopicVideos(topic, learningStyle, maxResults)
    } else {
      // Get subject-specific videos
      videos = await youtubeService.getSubjectVideos(subject, difficulty, maxResults)
    }

    return NextResponse.json({
      success: true,
      videos,
      apiStatus,
      query: {
        subject,
        difficulty,
        topic,
        learningStyle,
        maxResults
      }
    })

  } catch (error) {
    console.error('Error fetching YouTube videos:', error)
    return NextResponse.json({
      success: false,
      error: 'Failed to fetch YouTube videos',
      videos: []
    }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { query, maxResults = 5, difficulty, category, duration, language } = body

    if (!query) {
      return NextResponse.json({
        success: false,
        error: 'Query parameter is required'
      }, { status: 400 })
    }

    // Check if YouTube API is available
    const apiStatus = await youtubeService.getApiStatus()
    if (!apiStatus.available) {
      return NextResponse.json({
        success: false,
        error: apiStatus.error || 'YouTube API not available',
        videos: []
      })
    }

    const videos = await youtubeService.searchEducationalVideos({
      query,
      maxResults,
      difficulty,
      category,
      duration,
      language
    })

    return NextResponse.json({
      success: true,
      videos,
      apiStatus,
      query: {
        query,
        maxResults,
        difficulty,
        category,
        duration,
        language
      }
    })

  } catch (error) {
    console.error('Error searching YouTube videos:', error)
    return NextResponse.json({
      success: false,
      error: 'Failed to search YouTube videos',
      videos: []
    }, { status: 500 })
  }
} 