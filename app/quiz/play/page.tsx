"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { useRouter, useSearchParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { GraduationCap, Clock, ArrowRight, CheckCircle, XCircle, Brain, Trophy, Target } from "lucide-react"
// Remove import { generateQuestions } from "@/lib/quiz-generator"
import { generatePersonalizedRecommendations } from "@/lib/recommendation-engine"
import { RecommendationPanel } from "@/components/recommendation-panel"
import { useSession } from "next-auth/react"

import type { EnhancedQuestion } from "@/lib/quiz-generator"

// This page relies on client-side search params – don't prerender
export const dynamic = "force-dynamic"

export default function PlayQuizPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const { data: session } = useSession();

  const category = searchParams.get("category") || "computer-science"
  const difficulty = searchParams.get("difficulty") || "intermediate"
  const count = Number.parseInt(searchParams.get("count") || "10", 10)
  const timeLimit = Number.parseInt(searchParams.get("time") || "60", 10)

  const [questions, setQuestions] = useState<EnhancedQuestion[]>([])
  const [showExplanation, setShowExplanation] = useState(false)
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0)
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null)
  const [isAnswerSubmitted, setIsAnswerSubmitted] = useState(false)
  const [score, setScore] = useState(0)
  const [timeRemaining, setTimeRemaining] = useState(timeLimit)
  const [quizCompleted, setQuizCompleted] = useState(false)
  const [loading, setLoading] = useState(true)
  const [recommendations, setRecommendations] = useState<any>(null)
  const [showRecommendations, setShowRecommendations] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // Generate questions on component mount
  useEffect(() => {
    const loadQuestions = async () => {
      setLoading(true)
      setError(null)
      try {
        const params = new URLSearchParams()
        params.append("category", category)
        params.append("difficulty", difficulty)
        params.append("count", String(count))
        params.append("random", "true")
        const res = await fetch(`/api/quiz-questions?${params.toString()}`)
        if (!res.ok) throw new Error("Failed to fetch quiz questions")
        const data = await res.json()
        setQuestions(data.questions)
      } catch (error) {
        setError("Could not load quiz questions. Please try again later.")
        setQuestions([])
      } finally {
        setLoading(false)
      }
    }

    loadQuestions()
  }, [category, difficulty, count])

  // Timer effect
  useEffect(() => {
    if (loading || quizCompleted || !timeLimit) return

    const timer = setInterval(() => {
      setTimeRemaining((prev) => {
        if (prev <= 1) {
          clearInterval(timer)
          if (!isAnswerSubmitted) {
            handleAnswerSubmit(null)
          }
          return 0
        }
        return prev - 1
      })
    }, 1000)

    return () => clearInterval(timer)
  }, [loading, quizCompleted, timeLimit, isAnswerSubmitted])

  const currentQuestion = questions[currentQuestionIndex]

  const handleAnswerSelect = (answer: string) => {
    if (isAnswerSubmitted) return
    setSelectedAnswer(answer)
  }

  const handleAnswerSubmit = (answer: string | null) => {
    if (isAnswerSubmitted || !currentQuestion) return

    const finalAnswer = answer || selectedAnswer
    const isCorrect = finalAnswer === currentQuestion.correctAnswer

    if (isCorrect) {
      setScore((prev) => prev + 1)
    }

    setIsAnswerSubmitted(true)
    setShowExplanation(true)

    // Move to next question after showing explanation
    setTimeout(() => {
      if (currentQuestionIndex < questions.length - 1) {
        setCurrentQuestionIndex((prev) => prev + 1)
        setSelectedAnswer(null)
        setIsAnswerSubmitted(false)
        setShowExplanation(false)
        setTimeRemaining(timeLimit)
      } else {
        setQuizCompleted(true)
      }
    }, 4000) // Show explanation for 4 seconds
  }

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins}:${secs.toString().padStart(2, "0")}`
  }

  const getCategoryDisplayName = (cat: string) => {
    const categoryMap: Record<string, string> = {
      "computer-science": "Computer Science",
      health: "Health & Medicine",
      business: "Business",
      law: "Law",
      psychology: "Psychology",
      mathematics: "Mathematics",
    }
    return categoryMap[cat] || cat
  }

  const getCategoryIcon = (cat: string) => {
    const iconMap: Record<string, string> = {
      "computer-science": "💻",
      health: "🏥",
      business: "💼",
      law: "⚖️",
      psychology: "🧠",
      mathematics: "📊",
    }
    return iconMap[cat] || "📚"
  }

  useEffect(() => {
    if (
      quizCompleted &&
      session &&
      session.user &&
      typeof session.user.email === "string" &&
      session.user.email
    ) {
      const userEmail = session.user.email;
      const saveResult = async () => {
        await fetch("/api/quiz-result", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            userId: userEmail, // Use email as userId
            category,
            difficulty,
            score,
            totalQuestions: questions.length,
            timeSpent: 0,
            date: new Date().toISOString(),
            questionsAnswered: questions.map((q, i) => ({
              question: q.question,
              userAnswer: null, // You can update this if you track user answers
              correctAnswer: q.correctAnswer,
              isCorrect: null, // You can update this if you track correctness
              topic: q.topic,
            })),
          }),
        })
      }
      saveResult()
    }
  }, [quizCompleted, session, category, difficulty, score, questions])

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col">
        <header className="border-b bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/60">
          <div className="container mx-auto px-4 py-4 flex justify-between items-center">
            <Link href="/" className="flex items-center gap-2">
              <GraduationCap className="h-8 w-8 text-primary" />
              <h1 className="text-2xl font-bold">SmartQuiz</h1>
            </Link>
          </div>
        </header>

        <main className="flex-1 flex items-center justify-center bg-muted/30">
          <div className="text-center">
            <div className="text-6xl mb-4">{getCategoryIcon(category)}</div>
            <GraduationCap className="h-16 w-16 text-primary mx-auto animate-pulse mb-4" />
            <h2 className="text-2xl font-bold mb-2">Preparing Your SmartQuiz Quiz...</h2>
            <p className="text-muted-foreground">
              Loading {count} {getCategoryDisplayName(category)} questions at {difficulty} level
            </p>
          </div>
        </main>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen flex flex-col">
        <header className="border-b bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/60">
          <div className="container mx-auto px-4 py-4 flex justify-between items-center">
            <Link href="/" className="flex items-center gap-2">
              <GraduationCap className="h-8 w-8 text-primary" />
              <h1 className="text-2xl font-bold">SmartQuiz</h1>
            </Link>
          </div>
        </header>
        <main className="flex-1 flex items-center justify-center bg-muted/30">
          <div className="text-center max-w-md">
            <div className="text-6xl mb-4">😔</div>
            <h2 className="text-2xl font-bold mb-4">{error}</h2>
            <Button onClick={() => router.push("/quiz/new")}>Try Again</Button>
          </div>
        </main>
      </div>
    )
  }

  if (questions.length === 0) {
    return (
      <div className="min-h-screen flex flex-col">
        <header className="border-b bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/60">
          <div className="container mx-auto px-4 py-4 flex justify-between items-center">
            <Link href="/" className="flex items-center gap-2">
              <GraduationCap className="h-8 w-8 text-primary" />
              <h1 className="text-2xl font-bold">SmartQuiz</h1>
            </Link>
          </div>
        </header>

        <main className="flex-1 flex items-center justify-center bg-muted/30">
          <div className="text-center max-w-md">
            <div className="text-6xl mb-4">😔</div>
            <h2 className="text-2xl font-bold mb-4">No Questions Available</h2>
            <p className="text-muted-foreground mb-6">
              We couldn't find questions for {getCategoryDisplayName(category)} at {difficulty} level. Please try a
              different subject or difficulty.
            </p>
            <Button onClick={() => router.push("/quiz/new")}>Choose Different Options</Button>
          </div>
        </main>
      </div>
    )
  }

  if (quizCompleted) {
    const percentage = Math.round((score / questions.length) * 100)

    return (
      <div className="min-h-screen flex flex-col">
        <header className="border-b bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/60">
          <div className="container mx-auto px-4 py-4 flex justify-between items-center">
            <Link href="/" className="flex items-center gap-2">
              <GraduationCap className="h-8 w-8 text-primary" />
              <h1 className="text-2xl font-bold">SmartQuiz</h1>
            </Link>
          </div>
        </header>

        <main className="flex-1 py-12 bg-muted/30">
          <div className="container mx-auto px-4">
            <div className="max-w-2xl mx-auto">
              <Card className="overflow-hidden">
                <div className="bg-primary h-2" style={{ width: `${percentage}%` }}></div>
                <CardHeader className="text-center">
                  <div className="text-4xl mb-4">{getCategoryIcon(category)}</div>
                  <CardTitle className="text-3xl">SmartQuiz Quiz Completed!</CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="flex justify-center">
                    {percentage >= 80 ? (
                      <div className="h-24 w-24 rounded-full bg-green-100 flex items-center justify-center">
                        <Trophy className="h-12 w-12 text-green-500" />
                      </div>
                    ) : percentage >= 60 ? (
                      <div className="h-24 w-24 rounded-full bg-blue-100 flex items-center justify-center">
                        <Target className="h-12 w-12 text-blue-500" />
                      </div>
                    ) : (
                      <div className="h-24 w-24 rounded-full bg-amber-100 flex items-center justify-center">
                        <Brain className="h-12 w-12 text-amber-500" />
                      </div>
                    )}
                  </div>

                  <div className="text-center">
                    <h3 className="text-2xl font-bold">Your Score</h3>
                    <p className="text-5xl font-bold my-4">
                      {score} / {questions.length}
                      <span className="text-lg text-muted-foreground ml-2">({percentage}%)</span>
                    </p>
                    <p className="text-muted-foreground">
                      {percentage >= 90
                        ? "Outstanding! You're mastering this subject!"
                        : percentage >= 80
                          ? "Excellent work! You have strong knowledge!"
                          : percentage >= 70
                            ? "Good job! You're on the right track!"
                            : percentage >= 60
                              ? "Not bad! Keep studying to improve!"
                              : "Keep practicing! Every expert was once a beginner!"}
                    </p>
                  </div>

                  <div className="border rounded-lg p-4 bg-muted/30">
                    <h4 className="font-semibold mb-2">Quiz Summary</h4>
                    <div className="grid grid-cols-2 gap-2 text-sm">
                      <div>Subject:</div>
                      <div className="font-medium">{getCategoryDisplayName(category)}</div>
                      <div>Difficulty:</div>
                      <div className="font-medium capitalize">{difficulty}</div>
                      <div>Questions:</div>
                      <div className="font-medium">{questions.length}</div>
                      <div>Time Limit:</div>
                      <div className="font-medium">{timeLimit ? `${timeLimit} seconds` : "No limit"}</div>
                    </div>
                  </div>
                </CardContent>
                <CardFooter className="flex flex-col gap-4">
                  <div className="flex flex-col sm:flex-row gap-4 w-full">
                    <Button
                      variant="outline"
                      className="w-full sm:w-auto bg-transparent"
                      onClick={() => router.push("/quiz/new")}
                    >
                      Take Another Quiz
                    </Button>
                    <Button className="w-full sm:w-auto" onClick={() => router.push("/")}>
                      Back to Home
                    </Button>
                  </div>
                  <Button
                    variant="secondary"
                    className="w-full"
                    onClick={() => {
                      const mockQuizResult = {
                        id: "quiz-" + Date.now(),
                        userId: "user-1",
                        category,
                        difficulty,
                        score,
                        totalQuestions: questions.length,
                        timeSpent: 0,
                        date: new Date(),
                      }
                      const recs = generatePersonalizedRecommendations(mockQuizResult, questions)
                      setRecommendations(recs)
                      setShowRecommendations(true)
                    }}
                  >
                    View Personalized Recommendations
                  </Button>
                </CardFooter>
              </Card>
            </div>
          </div>
        </main>

        {showRecommendations && recommendations && (
          <div className="container mx-auto px-4 pb-12">
            <div className="max-w-2xl mx-auto">
              <RecommendationPanel recommendations={recommendations} />
            </div>
          </div>
        )}
      </div>
    )
  }

  return (
    <div className="min-h-screen flex flex-col">
      <header className="border-b bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/60">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <Link href="/" className="flex items-center gap-2">
            <GraduationCap className="h-8 w-8 text-primary" />
            <h1 className="text-2xl font-bold">SmartQuiz</h1>
          </Link>
          <div className="flex items-center gap-4">
            <Badge variant="outline" className="gap-1">
              <span className="text-lg">{getCategoryIcon(category)}</span>
              <span>{getCategoryDisplayName(category)}</span>
            </Badge>
            <Badge variant="outline" className="capitalize">
              {difficulty}
            </Badge>
          </div>
        </div>
      </header>

      <main className="flex-1 py-12 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto">
            <div className="flex justify-between items-center mb-6">
              <div>
                <span className="text-sm text-muted-foreground">Question</span>
                <h2 className="text-xl font-bold">
                  {currentQuestionIndex + 1} of {questions.length}
                </h2>
              </div>
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2">
                  <span className="text-sm text-muted-foreground">Score:</span>
                  <Badge variant="secondary">{score}</Badge>
                </div>
                {timeLimit > 0 && (
                  <div className="flex items-center gap-2">
                    <Clock className="h-4 w-4 text-muted-foreground" />
                    <span className={`font-mono ${timeRemaining < 10 ? "text-destructive animate-pulse" : ""}`}>
                      {formatTime(timeRemaining)}
                    </span>
                  </div>
                )}
              </div>
            </div>

            <Progress value={((currentQuestionIndex + 1) / questions.length) * 100} className="mb-8" />

            {currentQuestion && (
              <Card className="mb-8">
                <CardHeader>
                  <CardTitle className="text-xl">{currentQuestion.question}</CardTitle>
                  {currentQuestion.topic && (
                    <div className="flex items-center gap-2">
                      <Badge variant="outline" className="text-xs">
                        {currentQuestion.topic}
                      </Badge>
                      <Badge variant="outline" className="text-xs capitalize">
                        {currentQuestion.difficulty}
                      </Badge>
                    </div>
                  )}
                </CardHeader>
                <CardContent>
                  <div className="grid gap-4">
                    {currentQuestion.options.map((option) => {
                      const isSelected = selectedAnswer === option
                      const isCorrect = isAnswerSubmitted && option === currentQuestion.correctAnswer
                      const isWrong = isAnswerSubmitted && isSelected && option !== currentQuestion.correctAnswer

                      return (
                        <Button
                          key={option}
                          variant={isSelected ? "default" : "outline"}
                          className={`h-auto py-4 px-6 justify-start text-left ${
                            isCorrect
                              ? "bg-green-500 hover:bg-green-500 text-white"
                              : isWrong
                                ? "bg-red-500 hover:bg-red-500 text-white"
                                : ""
                          }`}
                          onClick={() => handleAnswerSelect(option)}
                          disabled={isAnswerSubmitted}
                        >
                          <div className="flex items-center gap-2 w-full">
                            <span className="flex-1">{option}</span>
                            {isCorrect && <CheckCircle className="h-5 w-5" />}
                            {isWrong && <XCircle className="h-5 w-5" />}
                          </div>
                        </Button>
                      )
                    })}
                  </div>
                  {showExplanation && currentQuestion.explanation && (
                    <div className="mt-6 p-4 rounded-lg bg-muted/50 border-l-4 border-primary">
                      <h4 className="font-semibold mb-2 flex items-center gap-2">
                        <Brain className="h-4 w-4" />
                        Explanation
                      </h4>
                      <p className="text-sm text-muted-foreground mb-2">{currentQuestion.explanation}</p>
                      {currentQuestion.relatedConcepts && (
                        <div className="flex flex-wrap gap-1 mt-2">
                          <span className="text-xs text-muted-foreground">Related concepts:</span>
                          {currentQuestion.relatedConcepts.map((concept) => (
                            <Badge key={concept} variant="outline" className="text-xs">
                              {concept}
                            </Badge>
                          ))}
                        </div>
                      )}
                    </div>
                  )}
                </CardContent>
                <CardFooter>
                  <Button
                    className="w-full gap-2"
                    onClick={() => handleAnswerSubmit(selectedAnswer)}
                    disabled={!selectedAnswer || isAnswerSubmitted}
                  >
                    {isAnswerSubmitted ? "Next Question" : "Submit Answer"}
                    <ArrowRight className="h-5 w-5" />
                  </Button>
                </CardFooter>
              </Card>
            )}
          </div>
        </div>
      </main>
    </div>
  )
}
