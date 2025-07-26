"use client";

import { useState, useEffect } from "react"
import { useSession } from "next-auth/react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { 
  Brain, 
  Target, 
  TrendingUp, 
  Clock, 
  BookOpen, 
  GraduationCap,
  ArrowLeft,
  BarChart3,
  Lightbulb,
  Star,
  Users,
  Calendar,
  Zap,
  CheckCircle,
  AlertCircle
} from "lucide-react"
import { SmartRecommendationPanel } from "@/components/smart-recommendation-panel"

export default function RecommendationsPage() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [learningProfile, setLearningProfile] = useState<any>(null)
  const [recommendations, setRecommendations] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null)

  useEffect(() => {
    async function fetchData() {
      if (!session?.user?.email) return
      
      setLoading(true)
      setError(null)
      
      try {
        // Fetch learning profile and recommendations
        const [profileRes, recsRes] = await Promise.all([
          fetch(`/api/smart-recommendations?userId=${encodeURIComponent(session.user.email)}`),
          fetch(`/api/smart-recommendations?userId=${encodeURIComponent(session.user.email)}`)
        ])

        if (profileRes.ok) {
          const profileData = await profileRes.json()
          setLearningProfile(profileData.learningProfile)
        }

        if (recsRes.ok) {
          const recsData = await recsRes.json()
          setRecommendations(recsData)
        }
      } catch (err) {
        console.error("Failed to fetch recommendations data:", err)
        setError("Failed to load recommendations")
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [session])

  const handleStartQuiz = (category: string, difficulty: string) => {
    router.push(`/quiz/play?category=${category}&difficulty=${difficulty}&count=10&time=60`)
  }

  const handleViewResource = (resource: any) => {
    if (resource.url) {
      window.open(resource.url, '_blank')
    }
  }

  const handleViewLearningPath = (path: any) => {
    router.push(`/learning-paths?path=${path.id}`)
  }

  const handleCategorySelect = async (category: string) => {
    if (!session?.user?.email) return
    
    setSelectedCategory(category)
    try {
      const res = await fetch(`/api/smart-recommendations?userId=${encodeURIComponent(session.user.email)}&category=${category}`)
      if (res.ok) {
        const data = await res.json()
        setRecommendations(data)
      }
    } catch (err) {
      console.error("Failed to fetch category recommendations:", err)
    }
  }

  if (status === "loading") {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
          <p>Loading recommendations...</p>
        </div>
      </div>
    )
  }

  if (status === "unauthenticated") {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-4">Please log in</h2>
          <p className="text-muted-foreground mb-4">You need to be logged in to view your recommendations</p>
          <Link href="/login">
            <Button>Go to Login</Button>
          </Link>
        </div>
      </div>
    )
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <Brain className="h-12 w-12 text-primary mx-auto mb-4 animate-pulse" />
          <p>Loading your personalized recommendations...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <AlertCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
          <h2 className="text-2xl font-bold mb-2">Error</h2>
          <p className="text-muted-foreground mb-4">{error}</p>
          <Button onClick={() => window.location.reload()}>Try Again</Button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/60">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Link href="/dashboard" className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors">
                <ArrowLeft className="h-4 w-4" />
                Back to Dashboard
              </Link>
              <div className="h-6 w-px bg-border"></div>
              <div className="flex items-center gap-2">
                <Brain className="h-6 w-6 text-blue-600" />
                <h1 className="text-xl font-semibold">Smart Recommendations</h1>
              </div>
            </div>
            <Button onClick={() => router.push("/quiz/new")}>
              Take New Quiz
            </Button>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        {/* Learning Profile Overview */}
        {learningProfile && (
          <div className="mb-8">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BarChart3 className="h-5 w-5 text-blue-600" />
                  Your Learning Profile
                </CardTitle>
                <CardDescription>
                  AI-generated insights about your learning journey and performance
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                  <div className="text-center">
                    <div className="text-3xl font-bold text-blue-600 mb-2">
                      {learningProfile.experienceLevel}
                    </div>
                    <p className="text-sm text-muted-foreground">Experience Level</p>
                  </div>
                  
                  <div className="text-center">
                    <div className="text-3xl font-bold text-green-600 mb-2">
                      {learningProfile.averageScore}%
                    </div>
                    <p className="text-sm text-muted-foreground">Average Score</p>
                  </div>
                  
                  <div className="text-center">
                    <div className="text-3xl font-bold text-purple-600 mb-2">
                      {learningProfile.totalQuizzes}
                    </div>
                    <p className="text-sm text-muted-foreground">Quizzes Taken</p>
                  </div>
                  
                  <div className="text-center">
                    <div className="flex items-center justify-center gap-2 mb-2">
                      <TrendingUp className={`h-6 w-6 ${
                        learningProfile.learningTrend === 'improving' ? 'text-green-500' :
                        learningProfile.learningTrend === 'declining' ? 'text-red-500' : 'text-yellow-500'
                      }`} />
                      <span className="text-2xl font-bold capitalize">
                        {learningProfile.learningTrend}
                      </span>
                    </div>
                    <p className="text-sm text-muted-foreground">Learning Trend</p>
                  </div>
                </div>

                {/* Strengths and Weaknesses */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
                  <div>
                    <h4 className="font-semibold mb-3 flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-green-500" />
                      Your Strengths
                    </h4>
                    {learningProfile.strengths && learningProfile.strengths.length > 0 ? (
                      <div className="flex flex-wrap gap-2">
                        {learningProfile.strengths.map((strength: string, index: number) => (
                          <Badge key={index} variant="default">
                            {strength}
                          </Badge>
                        ))}
                      </div>
                    ) : (
                      <p className="text-sm text-muted-foreground">Keep practicing to build your strengths!</p>
                    )}
                  </div>
                  
                  <div>
                    <h4 className="font-semibold mb-3 flex items-center gap-2">
                      <AlertCircle className="h-4 w-4 text-orange-500" />
                      Areas to Improve
                    </h4>
                    {learningProfile.weaknesses && learningProfile.weaknesses.length > 0 ? (
                      <div className="flex flex-wrap gap-2">
                        {learningProfile.weaknesses.map((weakness: string, index: number) => (
                          <Badge key={index} variant="secondary">
                            {weakness}
                          </Badge>
                        ))}
                      </div>
                    ) : (
                      <p className="text-sm text-muted-foreground">Great job! No major weaknesses identified.</p>
                    )}
                  </div>
                </div>

                {/* Recommended Focus */}
                {learningProfile.recommendedFocus && (
                  <div className="mt-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
                    <h4 className="font-semibold mb-2 flex items-center gap-2">
                      <Lightbulb className="h-4 w-4 text-blue-600" />
                      Recommended Focus
                    </h4>
                    <p className="text-sm text-blue-800">{learningProfile.recommendedFocus}</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        )}

        {/* Category Selection */}
        {learningProfile?.preferredCategories && learningProfile.preferredCategories.length > 0 && (
          <div className="mb-8">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Target className="h-5 w-5 text-green-600" />
                  Explore by Category
                </CardTitle>
                <CardDescription>
                  Get specialized recommendations for specific subjects
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-3">
                  <Button
                    variant={selectedCategory === null ? "default" : "outline"}
                    onClick={() => handleCategorySelect('')}
                  >
                    All Categories
                  </Button>
                  {learningProfile.preferredCategories.map((category: string) => (
                    <Button
                      key={category}
                      variant={selectedCategory === category ? "default" : "outline"}
                      onClick={() => handleCategorySelect(category)}
                    >
                      {category}
                    </Button>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Smart Recommendations */}
        {recommendations && (
          <div className="mb-8">
            <div className="text-center mb-6">
              <h2 className="text-2xl font-bold mb-2">Personalized Recommendations</h2>
              <p className="text-muted-foreground">
                {selectedCategory 
                  ? `Specialized recommendations for ${selectedCategory}`
                  : "AI-powered insights to accelerate your learning journey"
                }
              </p>
            </div>
            
            <SmartRecommendationPanel 
              recommendations={recommendations}
              onStartQuiz={handleStartQuiz}
              onViewResource={handleViewResource}
              onViewLearningPath={handleViewLearningPath}
            />
          </div>
        )}

        {/* Quick Actions */}
        <div className="grid md:grid-cols-3 gap-6">
          <Card className="cursor-pointer hover:shadow-lg transition-all" onClick={() => router.push("/quiz/new")}>
            <CardContent className="p-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="p-2 bg-blue-100 rounded-lg">
                  <Brain className="h-5 w-5 text-blue-600" />
                </div>
                <h3 className="font-semibold">Take a Quiz</h3>
              </div>
              <p className="text-sm text-muted-foreground mb-4">
                Challenge yourself with a new quiz based on your recommendations
              </p>
              <Button size="sm" className="w-full">
                Start Quiz
              </Button>
            </CardContent>
          </Card>

          <Card className="cursor-pointer hover:shadow-lg transition-all" onClick={() => router.push("/subjects")}>
            <CardContent className="p-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="p-2 bg-green-100 rounded-lg">
                  <BookOpen className="h-5 w-5 text-green-600" />
                </div>
                <h3 className="font-semibold">Explore Subjects</h3>
              </div>
              <p className="text-sm text-muted-foreground mb-4">
                Discover new topics and expand your knowledge base
              </p>
              <Button size="sm" variant="outline" className="w-full">
                Browse Subjects
              </Button>
            </CardContent>
          </Card>

          <Card className="cursor-pointer hover:shadow-lg transition-all" onClick={() => router.push("/learning-paths")}>
            <CardContent className="p-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="p-2 bg-purple-100 rounded-lg">
                  <GraduationCap className="h-5 w-5 text-purple-600" />
                </div>
                <h3 className="font-semibold">Learning Paths</h3>
              </div>
              <p className="text-sm text-muted-foreground mb-4">
                Follow structured learning paths to master specific topics
              </p>
              <Button size="sm" variant="outline" className="w-full">
                View Paths
              </Button>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  )
} 