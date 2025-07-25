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

  const currentData = analyticsData

  const handleTakeQuiz = () => {
    router.push("/quiz/new")
  }

  const handleViewSubjects = () => {
    router.push("/subjects")
  }

  const getScoreColor = (score: number) => {
    if (score >= 90) return "text-green-600"
    if (score >= 80) return "text-blue-600"
    if (score >= 70) return "text-yellow-600"
    return "text-red-600"
  }

  const getImprovementIcon = (improvement: number) => {
    return improvement > 0 ? (
      <TrendingUp className="h-4 w-4 text-green-600" />
    ) : (
      <TrendingDown className="h-4 w-4 text-red-600" />
    )
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/60 sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <Link href="/" className="flex items-center gap-2">
            <GraduationCap className="h-8 w-8 text-primary" />
            <h1 className="text-2xl font-bold">SmartQuiz</h1>
          </Link>
          <nav className="hidden md:flex gap-6">
            <Link href="/" className="font-medium hover:text-primary transition-colors">
              Home
            </Link>
            <Link href="/subjects" className="font-medium hover:text-primary transition-colors">
              Subjects
            </Link>
            <Link href="/learning-paths" className="font-medium hover:text-primary transition-colors">
              Learning Paths
            </Link>
            <Link href="/analytics" className="font-medium text-primary">
              Analytics
            </Link>
            <Link href="/leaderboard" className="font-medium hover:text-primary transition-colors">
              Community
            </Link>
          </nav>
          <div className="flex gap-2">
            <Link href="/login">
              <Button variant="outline">Sign In</Button>
            </Link>
            <Link href="/signup">
              <Button>Get Started</Button>
            </Link>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        {/* Hero Section */}
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

        {/* Key Metrics */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <Card>
            <CardContent className="p-6 text-center">
              <div className="flex items-center justify-center w-12 h-12 rounded-full bg-primary/10 mx-auto mb-3">
                <BookOpen className="h-6 w-6 text-primary" />
              </div>
              <div className="text-2xl font-bold">{currentData.totalQuizzes}</div>
              <div className="text-sm text-muted-foreground">Quizzes Completed</div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6 text-center">
              <div className="flex items-center justify-center w-12 h-12 rounded-full bg-accent/10 mx-auto mb-3">
                <Target className="h-6 w-6 text-accent" />
              </div>
              <div className="text-2xl font-bold">{currentData.averageScore}%</div>
              <div className="text-sm text-muted-foreground">Average Score</div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6 text-center">
              <div className="flex items-center justify-center w-12 h-12 rounded-full bg-blue-100 mx-auto mb-3">
                <Clock className="h-6 w-6 text-blue-600" />
              </div>
              <div className="text-2xl font-bold">{currentData.timeSpent}</div>
              <div className="text-sm text-muted-foreground">Time Spent</div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6 text-center">
              <div className="flex items-center justify-center w-12 h-12 rounded-full bg-orange-100 mx-auto mb-3">
                <Award className="h-6 w-6 text-orange-600" />
              </div>
              <div className="text-2xl font-bold">{currentData.streak}</div>
              <div className="text-sm text-muted-foreground">Day Streak</div>
            </CardContent>
          </Card>
        </div>

        {/* Performance Overview */}
        <div className="grid md:grid-cols-2 gap-6 mb-8">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Brain className="h-5 w-5" />
                Performance Overview
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <span>Overall Improvement</span>
                <div className="flex items-center gap-2">
                  {getImprovementIcon(currentData.improvement)}
                  <span className="font-semibold">+{currentData.improvement}%</span>
                </div>
              </div>

              <div>
                <div className="flex justify-between text-sm mb-2">
                  <span>Progress to Next Level</span>
                  <span>78%</span>
                </div>
                <Progress value={78} className="h-2" />
              </div>

              <div className="pt-4">
                <h4 className="font-medium mb-2">Strong Subjects</h4>
                <div className="flex flex-wrap gap-2">
                  {currentData.strongSubjects.map((subject: any) => (
                    <Badge
                      key={subject}
                      className="bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-300"
                    >
                      {subject}
                    </Badge>
                  ))}
                </div>
              </div>

              <div>
                <h4 className="font-medium mb-2">Areas for Improvement</h4>
                <div className="flex flex-wrap gap-2">
                  {currentData.weakSubjects.map((subject: any) => (
                    <Badge key={subject} className="bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-300">
                      {subject}
                    </Badge>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BarChart3 className="h-5 w-5" />
                Recent Activity
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {currentData.recentActivity.map((activity: any, index: number) => (
                  <div key={index} className="flex items-center justify-between p-3 bg-muted/30 rounded-lg">
                    <div>
                      <div className="font-medium">{activity.subject}</div>
                      <div className="text-sm text-muted-foreground flex items-center gap-2">
                        <Calendar className="h-3 w-3" />
                        {activity.date}
                        <Clock className="h-3 w-3" />
                        {activity.time}
                      </div>
                    </div>
                    <div className={`text-lg font-bold ${getScoreColor(activity.score)}`}>{activity.score}%</div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Achievements */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Award className="h-5 w-5" />
              Achievements
            </CardTitle>
            <CardDescription>
              Unlock badges and rewards as you progress through your SmartQuiz learning journey
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {currentData.achievements.map((achievement: any) => (
                <div
                  key={achievement.id}
                  className={`p-4 rounded-lg border-2 text-center transition-all ${
                    achievement.earned
                      ? "border-primary bg-primary/5 hover:bg-primary/10"
                      : "border-muted bg-muted/30 opacity-60"
                  }`}
                >
                  <div className="text-3xl mb-2">{achievement.icon}</div>
                  <div className="font-medium text-sm">{achievement.title}</div>
                  <div className="text-xs text-muted-foreground mt-1">{achievement.description}</div>
                  {achievement.earned && (
                    <Badge className="mt-2 bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-300">
                      Earned
                    </Badge>
                  )}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Action Cards */}
        <div className="grid md:grid-cols-2 gap-6">
          <Card className="learning-card cursor-pointer hover:shadow-lg transition-all" onClick={handleTakeQuiz}>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Brain className="h-5 w-5 text-primary" />
                Continue Learning
              </CardTitle>
              <CardDescription>
                Take a quiz in your weakest subjects to improve your overall performance
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button className="w-full" onClick={handleTakeQuiz}>
                Take Quiz
              </Button>
            </CardContent>
          </Card>

          <Card className="learning-card cursor-pointer hover:shadow-lg transition-all" onClick={handleViewSubjects}>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BookOpen className="h-5 w-5 text-accent" />
                Explore New Subjects
              </CardTitle>
              <CardDescription>Discover new topics and expand your knowledge across different domains</CardDescription>
            </CardHeader>
            <CardContent>
              <Button variant="outline" className="w-full bg-transparent" onClick={handleViewSubjects}>
                View Subjects
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Recommendations */}
        <Card className="mt-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Target className="h-5 w-5" />
              SmartQuiz AI Recommendations
            </CardTitle>
            <CardDescription>Personalized suggestions to optimize your learning journey</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800">
                <h4 className="font-medium text-blue-900 dark:text-blue-100 mb-2">📚 Focus on Weak Areas</h4>
                <p className="text-sm text-blue-800 dark:text-blue-200">
                  Spend more time on {currentData.weakSubjects.join(" and ")} to improve your overall score by an
                  estimated 12%.
                </p>
              </div>

              <div className="p-4 bg-green-50 dark:bg-green-900/20 rounded-lg border border-green-200 dark:border-green-800">
                <h4 className="font-medium text-green-900 dark:text-green-100 mb-2">🎯 Maintain Your Streak</h4>
                <p className="text-sm text-green-800 dark:text-green-200">
                  You're on a {currentData.streak}-day streak! Take a quick 5-minute quiz daily to maintain momentum.
                </p>
              </div>

              <div className="p-4 bg-purple-50 dark:bg-purple-900/20 rounded-lg border border-purple-200 dark:border-purple-800">
                <h4 className="font-medium text-purple-900 dark:text-purple-100 mb-2">🚀 Challenge Yourself</h4>
                <p className="text-sm text-purple-800 dark:text-purple-200">
                  Try advanced topics in your strong subjects ({currentData.strongSubjects[0]}) to unlock new
                  achievements.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  )
}
