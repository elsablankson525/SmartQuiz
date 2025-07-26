"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { TrendingUp, TrendingDown, Target, Clock, Award, BookOpen, Brain, BarChart3, Calendar } from "lucide-react"

interface AnalyticsData {
  totalQuizzes: number
  averageScore: number
  timeSpent: string
  streak: number
  improvement: number
  strongSubjects: string[]
  weakSubjects: string[]
  recentActivity: Array<{
    date: string
    subject: string
    score: number
    time: string
  }>
  achievements: Array<{
    id: string
    title: string
    description: string
    icon: string
    earned: boolean
  }>
  categoryBreakdown: Array<{
    category: string
    count: number
    average: number
  }>
  weeklyProgress: Array<{
    week: string
    quizzes: number
    average: number
  }>
  difficultyProgression: Array<{
    difficulty: string
    count: number
    average: number
  }>
}

interface AnalyticsDashboardProps {
  data: AnalyticsData
  timeRange: string
}

export function AnalyticsDashboard({ data, timeRange }: AnalyticsDashboardProps) {
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
    <div className="space-y-8">
      {/* Key Metrics */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-6 text-center">
            <div className="flex items-center justify-center w-12 h-12 rounded-full bg-primary/10 mx-auto mb-3">
              <BookOpen className="h-6 w-6 text-primary" />
            </div>
            <div className="text-2xl font-bold">{data.totalQuizzes}</div>
            <div className="text-sm text-muted-foreground">Quizzes Completed</div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6 text-center">
            <div className="flex items-center justify-center w-12 h-12 rounded-full bg-accent/10 mx-auto mb-3">
              <Target className="h-6 w-6 text-accent" />
            </div>
            <div className="text-2xl font-bold">{data.averageScore}%</div>
            <div className="text-sm text-muted-foreground">Average Score</div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6 text-center">
            <div className="flex items-center justify-center w-12 h-12 rounded-full bg-blue-100 mx-auto mb-3">
              <Clock className="h-6 w-6 text-blue-600" />
            </div>
            <div className="text-2xl font-bold">{data.timeSpent}</div>
            <div className="text-sm text-muted-foreground">Time Spent</div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6 text-center">
            <div className="flex items-center justify-center w-12 h-12 rounded-full bg-orange-100 mx-auto mb-3">
              <Award className="h-6 w-6 text-orange-600" />
            </div>
            <div className="text-2xl font-bold">{data.streak}</div>
            <div className="text-sm text-muted-foreground">Day Streak</div>
          </CardContent>
        </Card>
      </div>

      {/* Performance Overview & Recent Activity */}
      <div className="grid md:grid-cols-2 gap-6">
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
                {getImprovementIcon(data.improvement)}
                <span className="font-semibold">+{data.improvement}%</span>
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
                {data.strongSubjects.map((subject) => (
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
                {data.weakSubjects.map((subject) => (
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
              {data.recentActivity.map((activity, index) => (
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

      {/* Category Breakdown */}
      {data.categoryBreakdown.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BarChart3 className="h-5 w-5" />
              Category Performance
            </CardTitle>
            <CardDescription>
              Your performance across different subject categories
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {data.categoryBreakdown.map((category) => (
                <div key={category.category} className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-3 h-3 rounded-full bg-primary"></div>
                    <span className="font-medium">{category.category}</span>
                    <Badge variant="secondary">{category.count} quizzes</Badge>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className={`font-semibold ${getScoreColor(category.average)}`}>
                      {category.average}%
                    </span>
                    <Progress value={category.average} className="w-20 h-2" />
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Weekly Progress */}
      {data.weeklyProgress.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calendar className="h-5 w-5" />
              Weekly Progress
            </CardTitle>
            <CardDescription>
              Your activity and performance over the last 4 weeks
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {data.weeklyProgress.map((week) => (
                <div key={week.week} className="text-center p-4 bg-muted/30 rounded-lg">
                  <div className="text-sm font-medium text-muted-foreground">{week.week}</div>
                  <div className="text-2xl font-bold mt-1">{week.quizzes}</div>
                  <div className="text-xs text-muted-foreground">quizzes</div>
                  {week.quizzes > 0 && (
                    <div className={`text-sm font-semibold mt-1 ${getScoreColor(week.average)}`}>
                      {week.average}% avg
                    </div>
                  )}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Difficulty Progression */}
      {data.difficultyProgression.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Target className="h-5 w-5" />
              Difficulty Progression
            </CardTitle>
            <CardDescription>
              How you perform across different difficulty levels
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {data.difficultyProgression.map((difficulty) => (
                <div key={difficulty.difficulty} className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Badge variant="outline" className="capitalize">
                      {difficulty.difficulty}
                    </Badge>
                    <span className="text-sm text-muted-foreground">
                      {difficulty.count} attempts
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className={`font-semibold ${getScoreColor(difficulty.average)}`}>
                      {difficulty.average}%
                    </span>
                    <Progress value={difficulty.average} className="w-20 h-2" />
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Achievements */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Award className="h-5 w-5" />
            Achievements
          </CardTitle>
          <CardDescription>
            Unlock badges and rewards as you progress through your learning journey
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {data.achievements.map((achievement) => (
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

      {/* Recommendations */}
      <Card>
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
                Spend more time on {data.weakSubjects.join(" and ")} to improve your overall score by an
                estimated 12%.
              </p>
            </div>

            <div className="p-4 bg-green-50 dark:bg-green-900/20 rounded-lg border border-green-200 dark:border-green-800">
              <h4 className="font-medium text-green-900 dark:text-green-100 mb-2">🎯 Maintain Your Streak</h4>
              <p className="text-sm text-green-800 dark:text-green-200">
                You're on a {data.streak}-day streak! Take a quick 5-minute quiz daily to maintain momentum.
              </p>
            </div>

            <div className="p-4 bg-purple-50 dark:bg-purple-900/20 rounded-lg border border-purple-200 dark:border-purple-800">
              <h4 className="font-medium text-purple-900 dark:text-purple-100 mb-2">🚀 Challenge Yourself</h4>
              <p className="text-sm text-purple-800 dark:text-purple-200">
                Try advanced topics in your strong subjects ({data.strongSubjects[0] || "your best subject"}) to unlock new
                achievements.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
