"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { useSession } from "next-auth/react"
import { AnalyticsDashboard } from "@/components/analytics-dashboard";

export default function AnalyticsPage() {
  const { data: session } = useSession();
  const [selectedTimeRange, setSelectedTimeRange] = useState("30d")
  const [analyticsData, setAnalyticsData] = useState<{
    totalQuizzes: number;
    averageScore: number;
    timeSpent: string;
    streak: number;
    improvement: number;
    strongSubjects: string[];
    weakSubjects: string[];
    recentActivity: Array<{
      date: string;
      subject: string;
      score: number;
      time: string;
    }>;
    achievements: Array<{
      id: string;
      title: string;
      description: string;
      icon: string;
      earned: boolean;
    }>;
    categoryBreakdown: Array<{
      category: string;
      count: number;
      average: number;
    }>;
    weeklyProgress: Array<{
      week: string;
      quizzes: number;
      average: number;
    }>;
    difficultyProgression: Array<{
      difficulty: string;
      count: number;
      average: number;
    }>;
  } | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function fetchAnalytics() {
      if (!session || !session.user) return
      setLoading(true)
      setError(null)
      try {
        let userIdParam = ""
        if ("id" in session.user && session.user.id) {
          userIdParam = session.user.id
        } else if (session.user.email) {
          userIdParam = session.user.email
        } else {
          throw new Error("No user identifier found")
        }
        
        const res = await fetch(`/api/analytics?userId=${encodeURIComponent(userIdParam)}&timeRange=${selectedTimeRange}`)
        if (!res.ok) throw new Error("Failed to fetch analytics")
        const data = await res.json()
        setAnalyticsData(data.analytics)
      } catch {
        setError("Could not load analytics. Please try again later.")
      } finally {
        setLoading(false)
      }
    }
    fetchAnalytics()
  }, [session, selectedTimeRange])

  if (loading) return <div className="flex justify-center items-center min-h-screen">Loading analytics...</div>
  if (error) return <div className="flex justify-center items-center min-h-screen text-red-500">{error}</div>
  if (!analyticsData) return null

  return (
    <div className="min-h-screen bg-background">
      {/* Removed custom header and nav to avoid duplicate navbar. Use global Navbar only. */}
      <main className="container mx-auto px-4 py-8">
        <div className="text-center mb-8">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            Your <span className="text-primary">SmartQuiz</span> Analytics
          </h1>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Track your learning progress, identify strengths and weaknesses, and optimize your study strategy
          </p>
        </div>
        {/* Time Range Selector */}
        <div className="flex justify-center mb-8">
          <div className="flex gap-2 p-1 bg-muted rounded-lg">
            {["7d", "30d", "90d", "all"].map((range) => (
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
        <AnalyticsDashboard data={analyticsData} timeRange={selectedTimeRange} />
      </main>
    </div>
  )
}
