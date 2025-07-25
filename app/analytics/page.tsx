"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import {
  GraduationCap,
  TrendingUp,
  TrendingDown,
  Target,
  Clock,
  Award,
  BookOpen,
  Brain,
  BarChart3,
  Calendar,
} from "lucide-react"
import { useSession } from "next-auth/react"
import { AnalyticsDashboard } from "@/components/analytics-dashboard";

const timeRanges = ["7d", "30d", "90d", "all"]

export default function AnalyticsPage() {
  const { data: session } = useSession();
  const router = useRouter()
  const [selectedTimeRange, setSelectedTimeRange] = useState("30d")
  const [analyticsData, setAnalyticsData] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function fetchAnalytics() {
      if (!session || !session.user || !session.user.email) return
      setLoading(true)
      setError(null)
      try {
        const res = await fetch(`/api/analytics?userId=${encodeURIComponent(session.user.email)}&timeRange=${selectedTimeRange}`)
        if (!res.ok) throw new Error("Failed to fetch analytics")
        const data = await res.json()
        setAnalyticsData(data.analytics)
      } catch (err) {
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

  // Map analyticsData to PerformanceMetrics for AnalyticsDashboard
  const metrics = {
    totalQuizzes: analyticsData.totalQuizzes,
    averageScore: analyticsData.averageScore,
    totalTimeSpent: parseFloat(analyticsData.timeSpent) * 60, // convert hours to minutes
    strongestCategory: analyticsData.strongSubjects?.[0] || "",
    weakestCategory: analyticsData.weakSubjects?.[0] || "",
    improvementRate: analyticsData.improvement,
    streakDays: analyticsData.streak,
    categoryBreakdown: analyticsData.categoryBreakdown || [],
    weeklyProgress: analyticsData.weeklyProgress || [],
    difficultyProgression: analyticsData.difficultyProgression || [],
  };

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
        <AnalyticsDashboard metrics={metrics} />
      </main>
    </div>
  )
}
