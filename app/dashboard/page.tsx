"use client";
export const dynamic = "force-dynamic";

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { useSession } from "next-auth/react"
import { Button } from "@/components/ui/button"
import { GraduationCap, BookOpen, Brain, Target, TrendingUp } from "lucide-react"
import { AnalyticsDashboard } from "@/components/analytics-dashboard"
import { SmartRecommendationPanel } from "@/components/smart-recommendation-panel"

const timeRanges = ["7d", "30d", "90d", "all"]

export default function DashboardPage() {
  const { data: session, status } = useSession();
  const router = useRouter()
  const [selectedTimeRange, setSelectedTimeRange] = useState("30d")
  const [dashboardData, setDashboardData] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [recommendations, setRecommendations] = useState<any>(null)
  const [loadingRecommendations, setLoadingRecommendations] = useState(false)

  useEffect(() => {
    async function fetchDashboard() {
      if (!session || !session.user || !session.user.email) {
        return;
      }
      
      setLoading(true)
      setError(null)
      try {
        const res = await fetch(`/api/analytics?userId=${encodeURIComponent(session.user.email)}&timeRange=${selectedTimeRange}`)
        if (!res.ok) throw new Error("Failed to fetch dashboard data")
        const data = await res.json()
        setDashboardData(data.analytics)
      } catch (err) {
        setError("Could not load dashboard. Please try again later.")
      } finally {
        setLoading(false)
      }
    }
    fetchDashboard()
  }, [session, selectedTimeRange])

  // Fetch smart recommendations
  useEffect(() => {
    async function fetchRecommendations() {
      if (!session || !session.user || !session.user.email) {
        return;
      }
      
      setLoadingRecommendations(true)
      try {
        const res = await fetch(`/api/smart-recommendations?userId=${encodeURIComponent(session.user.email)}`)
        if (res.ok) {
          const data = await res.json()
          setRecommendations(data)
        }
      } catch (err) {
        console.error("Failed to fetch recommendations:", err)
      } finally {
        setLoadingRecommendations(false)
      }
    }
    fetchRecommendations()
  }, [session])

  if (status === "loading") {
    return <div className="flex justify-center items-center min-h-screen">Checking authentication...</div>;
  }
  
  if (status === "unauthenticated" || !session) {
    return (
      <div className="flex flex-col justify-center items-center min-h-screen">
        <div className="text-red-500 mb-4">Please log in to view your dashboard.</div>
        <div className="mt-4">
          <Link href="/login">
            <Button>Go to Login</Button>
          </Link>
        </div>
      </div>
    );
  }
  
  if (loading) {
    return <div className="flex justify-center items-center min-h-screen">Loading dashboard...</div>;
  }
  if (error) {
    return <div className="flex justify-center items-center min-h-screen text-red-500">{error}</div>;
  }
  if (!dashboardData) return null

  const handleTakeQuiz = () => {
    router.push("/quiz/new")
  }

  const handleViewSubjects = () => {
    router.push("/subjects")
  }

  const handleStartRecommendedQuiz = (category: string, difficulty: string) => {
    router.push(`/quiz/play?category=${category}&difficulty=${difficulty}&count=10&time=60`)
  }

  const handleViewResource = (resource: any) => {
    // Open resource in new tab or handle navigation
    if (resource.url) {
      window.open(resource.url, '_blank')
    }
  }

  const handleViewLearningPath = (path: any) => {
    // Navigate to learning path or handle path viewing
    router.push(`/learning-paths?path=${path.id}`)
  }

  return (
    <div className="min-h-screen bg-background">
      <main className="container mx-auto px-4 py-8">
        {/* Hero Section */}
        <div className="text-center mb-8">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            Welcome to your <span className="text-primary">Dashboard</span>
          </h1>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Get a snapshot of your learning journey, achievements, and personalized recommendations
          </p>
        </div>

        {/* Time Range Selector */}
        <div className="flex justify-center mb-8">
          <div className="flex gap-2 p-1 bg-muted rounded-lg">
            {timeRanges.map((range) => (
              <Button
                key={range}
                variant={selectedTimeRange === range ? "default" : "ghost"}
                size="sm"
                onClick={() => setSelectedTimeRange(range)}
              >
                {range === "all" ? "All Time" : range.toUpperCase()}
              </Button>
            ))}
          </div>
        </div>

        {/* Analytics Dashboard */}
        <AnalyticsDashboard data={dashboardData} timeRange={selectedTimeRange} />

        {/* Smart Recommendations Section */}
        <div className="mt-12 mb-8">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold mb-2 flex items-center justify-center gap-2">
              <Brain className="h-8 w-8 text-blue-600" />
              Smart Recommendations
            </h2>
            <p className="text-lg text-muted-foreground">
              AI-powered insights to accelerate your learning journey
            </p>
          </div>

          {loadingRecommendations ? (
            <div className="flex justify-center items-center py-12">
              <div className="flex items-center gap-3">
                <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary"></div>
                <span className="text-muted-foreground">Loading personalized recommendations...</span>
              </div>
            </div>
          ) : recommendations ? (
            <div className="max-w-6xl mx-auto">
              <SmartRecommendationPanel 
                recommendations={recommendations}
                onStartQuiz={handleStartRecommendedQuiz}
                onViewResource={handleViewResource}
                onViewLearningPath={handleViewLearningPath}
                className="mb-8"
              />
            </div>
          ) : (
            <div className="text-center py-12">
              <Target className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-xl font-semibold mb-2">No Recommendations Yet</h3>
              <p className="text-muted-foreground mb-4">
                Take your first quiz to get personalized recommendations
              </p>
              <Button onClick={handleTakeQuiz}>
                Take Your First Quiz
              </Button>
            </div>
          )}
        </div>

        {/* Action Cards */}
        <div className="grid md:grid-cols-3 gap-6 mt-8">
          <div className="learning-card cursor-pointer hover:shadow-lg transition-all" onClick={handleTakeQuiz}>
            <div className="p-6 border rounded-lg bg-card">
              <div className="flex items-center gap-2 mb-4">
                <Brain className="h-5 w-5 text-primary" />
                <h3 className="text-lg font-semibold">Continue Learning</h3>
              </div>
              <p className="text-muted-foreground mb-4">
                Take a quiz in your weakest subjects to improve your overall performance
              </p>
              <Button className="w-full" onClick={handleTakeQuiz}>
                Take Quiz
              </Button>
            </div>
          </div>

          <div className="learning-card cursor-pointer hover:shadow-lg transition-all">
            <div className="p-6 border rounded-lg bg-card">
              <div className="flex items-center gap-2 mb-4">
                <BookOpen className="h-5 w-5 text-accent" />
                <h3 className="text-lg font-semibold">Explore New Subjects</h3>
              </div>
              <p className="text-muted-foreground mb-4">Discover new topics and expand your knowledge across different domains</p>
              <Button variant="outline" className="w-full bg-transparent" onClick={handleViewSubjects}>
                View Subjects
              </Button>
            </div>
          </div>

          <div className="learning-card cursor-pointer hover:shadow-lg transition-all" onClick={() => router.push("/recommendations")}>
            <div className="p-6 border rounded-lg bg-card">
              <div className="flex items-center gap-2 mb-4">
                <Target className="h-5 w-5 text-green-600" />
                <h3 className="text-lg font-semibold">View Recommendations</h3>
              </div>
              <p className="text-muted-foreground mb-4">Get detailed insights and personalized learning recommendations</p>
              <Button variant="outline" className="w-full bg-transparent">
                View Details
              </Button>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
} 