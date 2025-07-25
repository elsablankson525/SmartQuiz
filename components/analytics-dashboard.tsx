"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { TrendingUp, TrendingDown, Clock, Target, Award, Calendar } from "lucide-react"
import type { PerformanceMetrics } from "@/lib/analytics"

interface AnalyticsDashboardProps {
  metrics: PerformanceMetrics
}

export function AnalyticsDashboard({ metrics }: AnalyticsDashboardProps) {
  const formatTime = (minutes: number) => {
    const hours = Math.floor(minutes / 60)
    const mins = minutes % 60
    return hours > 0 ? `${hours}h ${mins}m` : `${mins}m`
  }

  return (
    <div className="space-y-6">
      {/* Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Quizzes</CardTitle>
            <Target className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{metrics.totalQuizzes}</div>
            <p className="text-xs text-muted-foreground">{metrics.streakDays} day learning streak</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Average Score</CardTitle>
            <Award className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{Math.round(metrics.averageScore)}%</div>
            <div className="flex items-center text-xs text-muted-foreground">
              {metrics.improvementRate > 0 ? (
                <TrendingUp className="h-3 w-3 text-green-500 mr-1" />
              ) : (
                <TrendingDown className="h-3 w-3 text-red-500 mr-1" />
              )}
              {Math.abs(metrics.improvementRate).toFixed(1)}% trend
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Study Time</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatTime(metrics.totalTimeSpent)}</div>
            <p className="text-xs text-muted-foreground">
              {formatTime(Math.round(metrics.totalTimeSpent / metrics.totalQuizzes))} avg per quiz
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Strongest Subject</CardTitle>
            <TrendingUp className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-lg font-bold capitalize">{metrics.strongestCategory}</div>
            <p className="text-xs text-muted-foreground">Weakest: {metrics.weakestCategory}</p>
          </CardContent>
        </Card>
      </div>

      {/* Category Performance */}
      <Card>
        <CardHeader>
          <CardTitle>Subject Performance</CardTitle>
          <CardDescription>Your performance across different subjects</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {metrics.categoryBreakdown.map((category) => (
              <div key={category.category} className="space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="font-medium capitalize">{category.category}</span>
                    <Badge
                      variant={
                        category.trend === "improving"
                          ? "default"
                          : category.trend === "declining"
                            ? "destructive"
                            : "secondary"
                      }
                      className="text-xs"
                    >
                      {category.trend}
                    </Badge>
                  </div>
                  <div className="text-sm text-muted-foreground">
                    {Math.round(category.averageScore)}% • {category.quizzesTaken} quizzes
                  </div>
                </div>
                <Progress value={category.averageScore} className="h-2" />
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Weekly Progress Chart */}
      <Card>
        <CardHeader>
          <CardTitle>Weekly Progress</CardTitle>
          <CardDescription>Your learning activity over time</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {metrics.weeklyProgress.slice(-8).map((week) => (
              <div key={week.week} className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm font-medium">{week.week}</span>
                </div>
                <div className="flex items-center gap-4 text-sm">
                  <span>{week.quizzesTaken} quizzes</span>
                  <span>{Math.round(week.averageScore)}% avg</span>
                  <span>{formatTime(week.timeSpent)}</span>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Difficulty Progression */}
      <Card>
        <CardHeader>
          <CardTitle>Difficulty Progression</CardTitle>
          <CardDescription>How you perform at different difficulty levels</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {["beginner", "intermediate", "advanced"].map((difficulty) => {
              const difficultyData = metrics.difficultyProgression.filter((d) => d.difficulty === difficulty)
              const avgScore =
                difficultyData.length > 0
                  ? difficultyData.reduce((sum, d) => sum + d.averageScore, 0) / difficultyData.length
                  : 0
              const totalCount = difficultyData.reduce((sum, d) => sum + d.count, 0)

              return (
                <div key={difficulty} className="text-center p-4 rounded-lg bg-muted/50">
                  <h4 className="font-medium capitalize mb-2">{difficulty}</h4>
                  <div className="text-2xl font-bold mb-1">{Math.round(avgScore)}%</div>
                  <div className="text-sm text-muted-foreground">{totalCount} quizzes</div>
                  <Progress value={avgScore} className="mt-2 h-2" />
                </div>
              )
            })}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
