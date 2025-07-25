"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { BookOpen, Video, FileText, Code, TrendingUp, TrendingDown, Minus, ExternalLink } from "lucide-react"
import type { PersonalizedRecommendation, LearningResource } from "@/lib/recommendation-engine"

interface RecommendationPanelProps {
  recommendations: PersonalizedRecommendation
  progressTrend?: {
    trend: "improving" | "declining" | "stable"
    averageScore: number
    recentPerformance: number
  }
}

export function RecommendationPanel({ recommendations, progressTrend }: RecommendationPanelProps) {
  const router = useRouter()
  const [openingResource, setOpeningResource] = useState<string | null>(null)

  const getResourceIcon = (type: LearningResource["type"]) => {
    switch (type) {
      case "video":
        return <Video className="h-4 w-4" />
      case "article":
        return <FileText className="h-4 w-4" />
      case "practice":
        return <Code className="h-4 w-4" />
      case "tutorial":
        return <BookOpen className="h-4 w-4" />
      default:
        return <BookOpen className="h-4 w-4" />
    }
  }

  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case "improving":
        return <TrendingUp className="h-4 w-4 text-green-500" />
      case "declining":
        return <TrendingDown className="h-4 w-4 text-red-500" />
      default:
        return <Minus className="h-4 w-4 text-gray-500" />
    }
  }

  const handleResourceClick = async (resource: LearningResource) => {
    setOpeningResource(resource.id)

    // Simulate opening resource
    await new Promise((resolve) => setTimeout(resolve, 500))

    // In a real app, this would track the resource access
    console.log("Opening resource:", resource.title)

    // Open resource in new tab
    window.open(resource.url, "_blank")

    setOpeningResource(null)
  }

  const handleTakeRecommendedQuiz = () => {
    const { category, difficulty } = recommendations.nextQuizSuggestion
    router.push(`/quiz/new?category=${category}&difficulty=${difficulty}`)
  }

  return (
    <div className="space-y-6">
      {/* Progress Trend */}
      {progressTrend && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              {getTrendIcon(progressTrend.trend)}
              Your Learning Progress
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <p className="text-muted-foreground">Overall Average</p>
                <p className="text-2xl font-bold">{Math.round(progressTrend.averageScore)}%</p>
              </div>
              <div>
                <p className="text-muted-foreground">Recent Performance</p>
                <p className="text-2xl font-bold">{Math.round(progressTrend.recentPerformance)}%</p>
              </div>
            </div>
            <p className="text-sm text-muted-foreground mt-2">
              {progressTrend.trend === "improving" && "Great job! You're showing consistent improvement."}
              {progressTrend.trend === "declining" && "Consider reviewing fundamentals to get back on track."}
              {progressTrend.trend === "stable" && "You're maintaining steady performance."}
            </p>
          </CardContent>
        </Card>
      )}

      {/* Performance Analysis */}
      <Card>
        <CardHeader>
          <CardTitle>Performance Analysis</CardTitle>
          <CardDescription>Based on your recent quiz results</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {recommendations.strongAreas.length > 0 && (
            <div>
              <h4 className="font-medium text-green-700 dark:text-green-400 mb-2">Strong Areas</h4>
              <div className="flex flex-wrap gap-2">
                {recommendations.strongAreas.map((area) => (
                  <Badge
                    key={area}
                    variant="secondary"
                    className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"
                  >
                    {area}
                  </Badge>
                ))}
              </div>
            </div>
          )}

          {recommendations.weakAreas.length > 0 && (
            <div>
              <h4 className="font-medium text-amber-700 dark:text-amber-400 mb-2">Areas for Improvement</h4>
              <div className="flex flex-wrap gap-2">
                {recommendations.weakAreas.map((area) => (
                  <Badge
                    key={area}
                    variant="secondary"
                    className="bg-amber-100 text-amber-800 dark:bg-amber-900 dark:text-amber-200"
                  >
                    {area}
                  </Badge>
                ))}
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Recommended Resources */}
      <Card>
        <CardHeader>
          <CardTitle>Recommended Learning Resources</CardTitle>
          <CardDescription>Personalized resources to help you improve</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {recommendations.recommendedResources.map((resource) => (
              <div key={resource.id} className="flex items-start gap-3 p-3 rounded-lg bg-muted/50">
                <div className="flex-shrink-0 w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                  {getResourceIcon(resource.type)}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <h4 className="font-medium">{resource.title}</h4>
                      <p className="text-sm text-muted-foreground">{resource.description}</p>
                      <div className="flex items-center gap-2 mt-1">
                        <Badge variant="outline" className="text-xs">
                          {resource.type}
                        </Badge>
                        <Badge variant="outline" className="text-xs capitalize">
                          {resource.difficulty}
                        </Badge>
                        {resource.duration && (
                          <span className="text-xs text-muted-foreground">{resource.duration}</span>
                        )}
                        {resource.readTime && (
                          <span className="text-xs text-muted-foreground">{resource.readTime}</span>
                        )}
                      </div>
                    </div>
                    <Button
                      size="sm"
                      variant="ghost"
                      className="flex-shrink-0"
                      onClick={() => handleResourceClick(resource)}
                      disabled={openingResource === resource.id}
                    >
                      {openingResource === resource.id ? "Opening..." : <ExternalLink className="h-4 w-4" />}
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Next Quiz Suggestion */}
      <Card>
        <CardHeader>
          <CardTitle>Recommended Next Quiz</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <Badge className="capitalize">{recommendations.nextQuizSuggestion.category}</Badge>
              <Badge variant="outline" className="capitalize">
                {recommendations.nextQuizSuggestion.difficulty}
              </Badge>
            </div>
            <p className="text-sm text-muted-foreground">{recommendations.nextQuizSuggestion.reason}</p>
            <Button className="w-full" onClick={handleTakeRecommendedQuiz}>
              Take Recommended Quiz
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
