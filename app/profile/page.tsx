"use client"

import { useSession } from "next-auth/react"
import { useEffect, useState, useRef } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Brain, User, BarChart3, Trophy, Calendar, ArrowUpRight } from "lucide-react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Tooltip } from "@/components/ui/tooltip"
import { TooltipProvider, TooltipTrigger, TooltipContent } from "@/components/ui/tooltip"

function AnimatedNumber({ value }: { value: number }) {
  const [display, setDisplay] = useState(0)
  const ref = useRef<number>(0)
  useEffect(() => {
    ref.current = 0
    const step = Math.ceil(value / 30) || 1
    const interval = setInterval(() => {
      ref.current += step
      if (ref.current >= value) {
        setDisplay(value)
        clearInterval(interval)
      } else {
        setDisplay(ref.current)
      }
    }, 10)
    return () => clearInterval(interval)
  }, [value])
  return <span>{display.toLocaleString()}</span>
}

// Add this skeleton component at the top of the file
function ProfileSkeleton() {
  return (
    <div className="min-h-screen flex flex-col animate-pulse">
      <header className="border-b">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <div className="flex items-center gap-2">
            <div className="h-8 w-8 bg-gray-200 rounded-full" />
            <div className="h-6 w-32 bg-gray-200 rounded" />
          </div>
          <div className="flex gap-2">
            <div className="h-8 w-20 bg-gray-200 rounded" />
          </div>
        </div>
      </header>
      <main className="flex-1 py-12 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="max-w-5xl mx-auto">
            <div className="bg-card rounded-xl p-6 shadow-sm mb-8 flex flex-col md:flex-row gap-6 items-center md:items-start">
              <div className="w-24 h-24 rounded-full bg-gray-200" />
              <div className="flex-1 space-y-4">
                <div className="h-8 w-40 bg-gray-200 rounded" />
                <div className="h-4 w-32 bg-gray-200 rounded" />
                <div className="flex gap-2 mt-4">
                  <div className="h-6 w-24 bg-gray-200 rounded" />
                  <div className="h-6 w-24 bg-gray-200 rounded" />
                  <div className="h-6 w-24 bg-gray-200 rounded" />
                </div>
              </div>
              <div className="flex gap-2">
                <div className="h-10 w-32 bg-gray-200 rounded" />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4 mb-8">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="h-24 bg-gray-200 rounded" />
              ))}
            </div>
            <div className="h-48 bg-gray-200 rounded mb-8" />
            <div className="h-48 bg-gray-200 rounded mb-8" />
          </div>
        </div>
      </main>
    </div>
  )
}

export type ProfileData = {
  name: string;
  email: string;
  joinDate: string;
  totalScore: number;
  quizzesTaken: number;
  averageScore: number;
  badges: string[];
  availableBadges: string[];
  recentQuizzes: Array<{
    id: string;
    category: string;
    score: number;
    total: number;
    date: string;
  }>;
  categoryPerformance: Array<{
    category: string;
    score: number;
  }>;
  quizHistory: Array<{
    id: string;
    category: string;
    score: number;
    total: number;
    date: string;
    difficulty: string;
    timeSpent: number;
    questionsAnswered: any;
  }>;
};

export default function ProfilePage() {
  const { data: session } = useSession();
  console.log("SESSION:", session); // Debug: log session
  const [activeTab, setActiveTab] = useState<'overview' | 'history' | 'achievements'>("overview")
  const [profile, setProfile] = useState<ProfileData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [globalRank, setGlobalRank] = useState<number | null>(null)

  useEffect(() => {
    async function fetchProfile() {
      if (!session || !session.user || !session.user.email) return
      setLoading(true)
      setError(null)
      try {
        const res = await fetch(`/api/profile?userId=${encodeURIComponent(session.user.email)}`)
        console.log("/api/profile response status:", res.status); // Debug: log status
        const data = await res.json()
        console.log("/api/profile response data:", data); // Debug: log data
        if (!res.ok) throw new Error("Failed to fetch profile")
        setProfile(data.profile)
      } catch (err) {
        setError("Could not load profile. Please try again later.")
      } finally {
        setLoading(false)
      }
    }
    fetchProfile()
  }, [session])

  // Fetch leaderboard and find user's rank
  useEffect(() => {
    async function fetchRank() {
      if (!session || !session.user || !session.user.email) return
      try {
        // Fetch a large enough leaderboard to include the user (or paginate in a real app)
        const res = await fetch(`/api/leaderboard?limit=1000&timeframe=all-time`)
        if (!res.ok) return
        const data = await res.json()
        const leaderboard = data.leaderboard || []
        const userEntry = leaderboard.find((entry: any) => session.user && entry.userId === session.user.email)
        setGlobalRank(userEntry ? userEntry.rank : null)
      } catch {
        setGlobalRank(null)
      }
    }
    fetchRank()
  }, [session])

  if (loading) return <ProfileSkeleton />
  if (error) return <div className="flex justify-center items-center min-h-screen text-red-500">{error}</div>
  if (!profile) return null

  // Add a subject icon map
  const subjectIcons: Record<string, string> = {
    Science: "🔬",
    History: "📜",
    Technology: "💻",
    Geography: "🌍",
    Entertainment: "🎬",
    Mathematics: "📊",
    Business: "💼",
    Law: "⚖️",
    Psychology: "🧠",
    Health: "🏥",
  }

  return (
    <div className="min-h-screen flex flex-col">
      <header className="border-b">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <div className="flex items-center gap-2">
            <Link href="/">
              <div className="flex items-center gap-2">
                <Brain className="h-8 w-8 text-primary" />
                <h1 className="text-2xl font-bold">SmartQuiz</h1>
              </div>
            </Link>
          </div>
          <nav className="hidden md:flex gap-6">
            <Link href="/" className="font-medium hover:text-primary">
              Home
            </Link>
            <Link href="/categories" className="font-medium hover:text-primary">
              Categories
            </Link>
            <Link href="/leaderboard" className="font-medium hover:text-primary">
              Leaderboard
            </Link>
            <Link href="/profile" className="font-medium text-primary">
              Profile
            </Link>
          </nav>
          <div className="flex gap-2">
            <Button variant="outline">Logout</Button>
          </div>
        </div>
      </header>

      <main className="flex-1 py-12 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="max-w-5xl mx-auto">
            {/* Profile Header */}
            <div className="bg-card rounded-xl p-6 shadow-sm mb-8 flex flex-col md:flex-row gap-6 items-center md:items-start">
              <div className="w-24 h-24 rounded-full bg-primary/10 flex items-center justify-center">
                <Avatar className="w-24 h-24">
                  <AvatarImage src={session?.user?.image || undefined} alt={profile.name} />
                  <AvatarFallback>
                    {profile.name
                      ?.split(" ")
                      .map((n: string) => n[0])
                      .join("")}
                  </AvatarFallback>
                </Avatar>
              </div>
              <div className="flex-1 text-center md:text-left">
                <h1 className="text-3xl font-bold">{profile.name}</h1>
                <p className="text-muted-foreground">{profile.email}</p>
                <div className="flex flex-wrap gap-2 mt-4 justify-center md:justify-start">
                  <Badge variant="outline" className="gap-1">
                    <Calendar className="h-3 w-3" />
                    Joined {profile.joinDate}
                  </Badge>
                  <Badge variant="outline" className="gap-1">
                    <Trophy className="h-3 w-3" />
                    {profile.totalScore.toLocaleString()} points
                  </Badge>
                  <Badge variant="outline" className="gap-1">
                    <BarChart3 className="h-3 w-3" />
                    {profile.quizzesTaken} quizzes
                  </Badge>
                </div>
              </div>
              <div className="flex gap-2">
                <Link href="/quiz/new">
                  <Button>Start New Quiz</Button>
                </Link>
              </div>
            </div>

            {/* Profile Tabs */}
            <div className="flex border-b mb-8">
              <button
                className={`px-4 py-2 font-medium ${
                  activeTab === "overview" ? "border-b-2 border-primary text-primary" : "text-muted-foreground"
                }`}
                onClick={() => setActiveTab("overview")}
              >
                Overview
              </button>
              <button
                className={`px-4 py-2 font-medium ${
                  activeTab === "history" ? "border-b-2 border-primary text-primary" : "text-muted-foreground"
                }`}
                onClick={() => setActiveTab("history")}
              >
                Quiz History
              </button>
              <button
                className={`px-4 py-2 font-medium ${
                  activeTab === "achievements" ? "border-b-2 border-primary text-primary" : "text-muted-foreground"
                }`}
                onClick={() => setActiveTab("achievements")}
              >
                Achievements
              </button>
            </div>

            {/* Tab Content */}
            {activeTab === "overview" && (
              <div className="grid md:grid-cols-2 gap-8">
                {/* Stats Cards */}
                <div className="grid grid-cols-2 gap-4">
                  <Card>
                    <CardHeader className="pb-2 flex flex-row items-center gap-2 bg-blue-50 dark:bg-blue-900/20 rounded-t-lg">
                      <Trophy className="h-5 w-5 text-blue-500" />
                      <CardTitle className="text-sm font-medium text-muted-foreground">Total Score</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="text-3xl font-bold"><AnimatedNumber value={profile.totalScore} /></div>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardHeader className="pb-2 flex flex-row items-center gap-2 bg-green-50 dark:bg-green-900/20 rounded-t-lg">
                      <BarChart3 className="h-5 w-5 text-green-500" />
                      <CardTitle className="text-sm font-medium text-muted-foreground">Quizzes Taken</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="text-3xl font-bold"><AnimatedNumber value={profile.quizzesTaken} /></div>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardHeader className="pb-2 flex flex-row items-center gap-2 bg-yellow-50 dark:bg-yellow-900/20 rounded-t-lg">
                      <Brain className="h-5 w-5 text-yellow-500" />
                      <CardTitle className="text-sm font-medium text-muted-foreground">Average Score</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="text-3xl font-bold"><AnimatedNumber value={profile.averageScore} />%</div>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardHeader className="pb-2 flex flex-row items-center gap-2 bg-purple-50 dark:bg-purple-900/20 rounded-t-lg">
                      <User className="h-5 w-5 text-purple-500" />
                      <CardTitle className="text-sm font-medium text-muted-foreground">Global Rank</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="text-3xl font-bold">{globalRank ? `#${globalRank}` : "Unranked"}</div>
                    </CardContent>
                  </Card>
                </div>

                {/* Category Performance */}
                <Card>
                  <CardHeader>
                    <CardTitle>Category Performance</CardTitle>
                    <CardDescription>Your average scores by category</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <TooltipProvider>
                      <div className="space-y-4">
                        {profile.categoryPerformance.map((category: any) => {
                          // Color: green for high, yellow for mid, red for low
                          let barColor = "bg-green-500"
                          if (category.score < 70) barColor = "bg-yellow-500"
                          if (category.score < 50) barColor = "bg-red-500"
                          return (
                            <Tooltip key={category.category}>
                              <TooltipTrigger asChild>
                                <div>
                                  <div className="flex justify-between mb-1">
                                    <span className="text-sm font-medium">{category.category}</span>
                                    <span className="text-sm font-medium">{category.score}%</span>
                                  </div>
                                  <div className="w-full bg-muted rounded-full h-2.5">
                                    <div
                                      className={`${barColor} h-2.5 rounded-full transition-all`}
                                      style={{ width: `${category.score}%` }}
                                    ></div>
                                  </div>
                                </div>
                              </TooltipTrigger>
                              <TooltipContent>
                                <span>Average Score: {category.score}%</span>
                              </TooltipContent>
                            </Tooltip>
                          )
                        })}
                      </div>
                    </TooltipProvider>
                  </CardContent>
                </Card>

                {/* Recent Quizzes */}
                <Card className="md:col-span-2">
                  <CardHeader>
                    <div className="flex justify-between items-center">
                      <CardTitle>Recent Quizzes</CardTitle>
                      <Link href="/profile/history">
                        <Button variant="ghost" size="sm" className="gap-1">
                          View All
                          <ArrowUpRight className="h-4 w-4" />
                        </Button>
                      </Link>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {profile.recentQuizzes.map((quiz: any) => {
                        const percent = Math.round((quiz.score / quiz.total) * 100)
                        let badgeColor = "bg-green-100 text-green-800"
                        let badgeText = "Great!"
                        if (percent < 70) { badgeColor = "bg-yellow-100 text-yellow-800"; badgeText = "Keep Going" }
                        if (percent < 50) { badgeColor = "bg-red-100 text-red-800"; badgeText = "Needs Practice" }
                        return (
                          <div key={quiz.id} className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                            <div className="flex items-center gap-3">
                              <span className="text-2xl">{subjectIcons[quiz.category] || "📚"}</span>
                              <div>
                                <p className="font-medium">{quiz.category}</p>
                                <p className="text-sm text-muted-foreground">
                                  {new Date(quiz.date).toLocaleDateString("en-US", { year: "numeric", month: "short", day: "numeric" })}
                                </p>
                              </div>
                            </div>
                            <div className="text-right">
                              <p className="font-bold">{quiz.score}/{quiz.total}</p>
                              <p className="text-sm text-muted-foreground">{percent}%</p>
                              <span className={`inline-block mt-1 px-2 py-0.5 rounded-full text-xs font-semibold ${badgeColor}`}>{badgeText}</span>
                            </div>
                          </div>
                        )
                      })}
                    </div>
                  </CardContent>
                </Card>

                {/* Badges */}
                <Card className="md:col-span-2">
                  <CardHeader>
                    <CardTitle>Achievements</CardTitle>
                    <CardDescription>Badges you've earned through quizzing</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="flex flex-wrap gap-2">
                      {profile.badges.map((badge: string) => (
                        <Badge key={badge} variant="secondary" className="px-3 py-1">
                          {badge}
                        </Badge>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </div>
            )}

            {activeTab === "history" && (
              <Card>
                <CardHeader>
                  <CardTitle>Quiz History</CardTitle>
                  <CardDescription>All quizzes you've taken</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {profile.quizHistory.map((quiz: any, index: number) => (
                      <div
                        key={`${quiz.id}-${index}`}
                        className="flex items-center justify-between p-4 bg-muted/50 rounded-lg"
                      >
                        <div>
                          <p className="font-medium">{quiz.category}</p>
                          <p className="text-sm text-muted-foreground">
                            {new Date(quiz.date).toLocaleDateString("en-US", {
                              year: "numeric",
                              month: "short",
                              day: "numeric",
                            })}
                          </p>
                          <p className="text-xs text-muted-foreground">Difficulty: {quiz.difficulty}</p>
                        </div>
                        <div className="flex items-center gap-4">
                          <div className="text-right">
                            <p className="font-bold">
                              {quiz.score}/{quiz.total}
                            </p>
                            <p className="text-sm text-muted-foreground">
                              {Math.round((quiz.score / quiz.total) * 100)}%
                            </p>
                            <p className="text-xs text-muted-foreground">Time: {quiz.timeSpent}s</p>
                          </div>
                          <Link href={`/quiz/results/${quiz.id}`}>
                            <Button variant="outline" size="sm">
                              View Details
                            </Button>
                          </Link>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
                <CardFooter className="flex justify-center">
                  {/* Optionally add pagination here if needed */}
                </CardFooter>
              </Card>
            )}

            {activeTab === "achievements" && (
              <div className="grid md:grid-cols-2 gap-8">
                <Card>
                  <CardHeader>
                    <CardTitle>Earned Badges</CardTitle>
                    <CardDescription>Achievements you've unlocked</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <TooltipProvider>
                      <div className="grid grid-cols-2 gap-4">
                        {profile.availableBadges.map((badge: string) => (
                          <Tooltip key={badge}>
                            <TooltipTrigger asChild>
                              <div className={`bg-muted/50 rounded-lg p-4 text-center flex flex-col items-center ${profile.badges.includes(badge) ? '' : 'opacity-60 grayscale'}`}>
                                <div className={`w-16 h-16 rounded-full flex items-center justify-center mb-3 text-3xl ${profile.badges.includes(badge) ? 'bg-primary/10' : 'bg-muted'}`}>
                                  <Trophy className={`h-8 w-8 ${profile.badges.includes(badge) ? 'text-primary' : 'text-muted-foreground'}`} />
                                </div>
                                <p className="font-medium text-base">{badge}</p>
                                <p className="text-xs text-muted-foreground mt-1">{profile.badges.includes(badge) ? 'Earned' : 'Not yet earned'}</p>
                              </div>
                            </TooltipTrigger>
                            <TooltipContent>
                              <span>{badge} - {profile.badges.includes(badge) ? 'Achievement unlocked!' : 'Unlock this achievement by completing the requirements.'}</span>
                            </TooltipContent>
                          </Tooltip>
                        ))}
                      </div>
                    </TooltipProvider>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader>
                    <CardTitle>Available Badges</CardTitle>
                    <CardDescription>Achievements to unlock</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-2 gap-4">
                      {profile.availableBadges.map((badge: string) => (
                        <div key={badge} className={`bg-muted/50 rounded-lg p-4 text-center ${profile.badges.includes(badge) ? '' : 'opacity-60'}`}>
                          <div className={`w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-3 ${profile.badges.includes(badge) ? 'bg-primary/10' : 'bg-muted'}`}>
                            <Trophy className={`h-6 w-6 ${profile.badges.includes(badge) ? 'text-primary' : 'text-muted-foreground'}`} />
                          </div>
                          <p className="font-medium">{badge}</p>
                          <p className="text-xs text-muted-foreground mt-1">{profile.badges.includes(badge) ? 'Earned' : 'Not yet earned'}</p>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </div>
            )}
          </div>
        </div>
      </main>

      <footer className="bg-muted/30 border-t py-8">
        <div className="container mx-auto px-4 text-center">
          <div className="flex items-center justify-center gap-2 mb-4">
            <Brain className="h-6 w-6 text-primary" />
            <span className="text-xl font-bold">SmartQuiz</span>
          </div>
          <p className="text-muted-foreground text-sm">
            &copy; {new Date().getFullYear()} SmartQuiz. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  )
}
