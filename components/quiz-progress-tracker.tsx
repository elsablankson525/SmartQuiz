'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Progress } from '@/components/ui/progress'
import { Badge } from '@/components/ui/badge'
import { 
  CheckCircle, 
  XCircle, 
  Clock, 
  Target, 
  TrendingUp, 
  BarChart3,
  Zap,
  Award
} from 'lucide-react'
import { cn } from '@/lib/utils'

interface Question {
  id: string
  text: string
  isCorrect?: boolean
  timeSpent?: number
  difficulty?: string
}

interface QuizProgressTrackerProps {
  totalQuestions: number
  currentQuestion: number
  answeredQuestions: Question[]
  timeSpent: number
  className?: string
  showDetailedStats?: boolean
}

export default function QuizProgressTracker({
  totalQuestions,
  currentQuestion,
  answeredQuestions,
  timeSpent,
  className,
  showDetailedStats = true
}: QuizProgressTrackerProps) {
  const [stats, setStats] = useState({
    correct: 0,
    incorrect: 0,
    accuracy: 0,
    averageTime: 0,
    streak: 0,
    currentStreak: 0
  })

  useEffect(() => {
    const correct = answeredQuestions.filter(q => q.isCorrect).length
    const incorrect = answeredQuestions.filter(q => q.isCorrect === false).length
    const accuracy = answeredQuestions.length > 0 ? (correct / answeredQuestions.length) * 100 : 0
    
    // Calculate average time per question
    const totalTimeSpent = answeredQuestions.reduce((sum, q) => sum + (q.timeSpent || 0), 0)
    const averageTime = answeredQuestions.length > 0 ? totalTimeSpent / answeredQuestions.length : 0

    // Calculate current streak
    let currentStreak = 0
    for (let i = answeredQuestions.length - 1; i >= 0; i--) {
      if (answeredQuestions[i].isCorrect) {
        currentStreak++
      } else {
        break
      }
    }

    // Calculate longest streak
    let longestStreak = 0
    let tempStreak = 0
    answeredQuestions.forEach(q => {
      if (q.isCorrect) {
        tempStreak++
        longestStreak = Math.max(longestStreak, tempStreak)
      } else {
        tempStreak = 0
      }
    })

    setStats({
      correct,
      incorrect,
      accuracy,
      averageTime,
      streak: longestStreak,
      currentStreak
    })
  }, [answeredQuestions])

  const progress = (currentQuestion / totalQuestions) * 100
  const answeredProgress = (answeredQuestions.length / totalQuestions) * 100

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = Math.floor(seconds % 60)
    return `${mins}:${secs.toString().padStart(2, '0')}`
  }

  const getAccuracyColor = (accuracy: number) => {
    if (accuracy >= 80) return 'text-green-500'
    if (accuracy >= 60) return 'text-yellow-500'
    return 'text-red-500'
  }

  const getPerformanceBadge = () => {
    if (stats.accuracy >= 90) return { text: 'Excellent', color: 'bg-green-100 text-green-800' }
    if (stats.accuracy >= 80) return { text: 'Good', color: 'bg-blue-100 text-blue-800' }
    if (stats.accuracy >= 70) return { text: 'Fair', color: 'bg-yellow-100 text-yellow-800' }
    return { text: 'Needs Improvement', color: 'bg-red-100 text-red-800' }
  }

  const performanceBadge = getPerformanceBadge()

  return (
    <div className={cn("space-y-4", className)}>
      {/* Main Progress Card */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-lg flex items-center gap-2">
            <BarChart3 className="h-5 w-5" />
            Quiz Progress
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Progress Bars */}
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span>Question Progress</span>
              <span>{currentQuestion} / {totalQuestions}</span>
            </div>
            <Progress value={progress} className="h-2" />
          </div>

          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span>Answered Questions</span>
              <span>{answeredQuestions.length} / {totalQuestions}</span>
            </div>
            <Progress value={answeredProgress} className="h-2" />
          </div>

          {/* Quick Stats */}
          <div className="grid grid-cols-2 gap-4 pt-2">
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600">{stats.correct}</div>
              <div className="text-xs text-muted-foreground">Correct</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-red-600">{stats.incorrect}</div>
              <div className="text-xs text-muted-foreground">Incorrect</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Performance Stats */}
      {showDetailedStats && (
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-lg flex items-center gap-2">
              <TrendingUp className="h-5 w-5" />
              Performance Stats
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Accuracy */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Target className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm">Accuracy</span>
              </div>
              <div className="flex items-center gap-2">
                <span className={cn("text-lg font-bold", getAccuracyColor(stats.accuracy))}>
                  {stats.accuracy.toFixed(1)}%
                </span>
                <Badge className={performanceBadge.color}>
                  {performanceBadge.text}
                </Badge>
              </div>
            </div>

            {/* Average Time */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Clock className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm">Avg. Time/Question</span>
              </div>
              <span className="text-lg font-bold">{formatTime(stats.averageTime)}</span>
            </div>

            {/* Streaks */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Zap className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm">Current Streak</span>
              </div>
              <span className="text-lg font-bold text-orange-600">{stats.currentStreak}</span>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Award className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm">Longest Streak</span>
              </div>
              <span className="text-lg font-bold text-purple-600">{stats.streak}</span>
            </div>

            {/* Total Time */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Clock className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm">Total Time</span>
              </div>
              <span className="text-lg font-bold">{formatTime(timeSpent)}</span>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Recent Answers */}
      {showDetailedStats && answeredQuestions.length > 0 && (
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-lg">Recent Answers</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {answeredQuestions.slice(-5).reverse().map((question) => (
                <div key={question.id} className="flex items-center justify-between p-2 rounded-lg bg-muted/50">
                  <div className="flex items-center gap-2">
                    {question.isCorrect ? (
                      <CheckCircle className="h-4 w-4 text-green-500" />
                    ) : (
                      <XCircle className="h-4 w-4 text-red-500" />
                    )}
                    <span className="text-sm truncate max-w-[200px]">
                      {question.text}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    {question.timeSpent && (
                      <span className="text-xs text-muted-foreground">
                        {formatTime(question.timeSpent)}
                      </span>
                    )}
                    {question.difficulty && (
                      <Badge variant="outline" className="text-xs">
                        {question.difficulty}
                      </Badge>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
} 