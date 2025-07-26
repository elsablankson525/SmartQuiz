"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { useRouter, useSearchParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { 
  GraduationCap, 
  Clock, 
  ArrowRight, 
  CheckCircle, 
  XCircle, 
  Brain, 
  Trophy, 
  Target,
  BookOpen,
  Calendar,
  Users,
  Star,
  ExternalLink,
  BookMarked,
  Lightbulb,
  TrendingUp,
  AlertCircle,
  Zap,
  BarChart3
} from "lucide-react"
// Remove import { generateQuestions } from "@/lib/quiz-generator"

import { SmartRecommendationPanel } from "@/components/smart-recommendation-panel"
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
  const [userAnswers, setUserAnswers] = useState<Array<{question: string, userAnswer: string | null, correctAnswer: string, isCorrect: boolean}>>([])
  const [userQuizHistory, setUserQuizHistory] = useState<any[]>([])
  const [loadingRecommendations, setLoadingRecommendations] = useState(false)
  const [subjectResources, setSubjectResources] = useState<any[]>([])
  const [studyPlans, setStudyPlans] = useState<any[]>([])
  const [loadingResources, setLoadingResources] = useState(false)
  const [activeTab, setActiveTab] = useState('overview')

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

    // Track user answer
    setUserAnswers(prev => [...prev, {
      question: currentQuestion.question,
      userAnswer: finalAnswer,
      correctAnswer: currentQuestion.correctAnswer,
      isCorrect: isCorrect
    }])

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
      engineering: "Engineering",
      "arts-humanities": "Arts & Humanities",
      "natural-sciences": "Natural Sciences",
      "social-sciences": "Social Sciences",
      technology: "Technology",
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
      engineering: "🛠️",
      "arts-humanities": "🎨",
      "natural-sciences": "🔬",
      "social-sciences": "🌍",
      technology: "🤖",
    }
    return iconMap[cat] || "📚"
  }

  // Fetch user quiz history when session is available
  useEffect(() => {
    if (session?.user?.email) {
      const fetchUserHistory = async () => {
        try {
          const res = await fetch(`/api/user-quiz-history?userId=${encodeURIComponent(session.user!.email!)}`)
          if (res.ok) {
            const data = await res.json()
            setUserQuizHistory(data.quizHistory || [])
          }
        } catch (error) {
          // Silently handle error - not critical for quiz functionality
        }
      }
      fetchUserHistory()
    }
  }, [session])

  // Load subject resources and study plans
  const loadSubjectResourcesAndStudyPlans = async () => {
    setLoadingResources(true)
    try {
      // Fetch resources for the subject
      const resourcesRes = await fetch(`/api/subjects/${category}/resources`)
      if (resourcesRes.ok) {
        const resourcesData = await resourcesRes.json()
        setSubjectResources(resourcesData.resources || [])
      }

      // Fetch study plans for the category and difficulty
      const studyPlansRes = await fetch(`/api/study-plans?category=${category}&difficulty=${difficulty}`)
      if (studyPlansRes.ok) {
        const studyPlansData = await studyPlansRes.json()
        setStudyPlans(studyPlansData.studyPlans || [])
      }
    } catch (error) {
      console.error("Failed to load resources and study plans:", error)
    } finally {
      setLoadingResources(false)
    }
  }

  // Save quiz result and generate recommendations when quiz is completed
  useEffect(() => {
    if (
      quizCompleted &&
      session &&
      session.user &&
      typeof session.user.email === "string" &&
      session.user.email
    ) {
      const userEmail = session.user.email;
      
      const saveResultAndGenerateRecommendations = async () => {
        try {
          // Save quiz result
          const saveRes = await fetch("/api/quiz-result", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              userId: userEmail,
              category,
              difficulty,
              score,
              totalQuestions: questions.length,
              timeSpent: 0,
              date: new Date().toISOString(),
              questionsAnswered: userAnswers,
            }),
          })

          if (saveRes.ok) {
            // Load resources and study plans
            await loadSubjectResourcesAndStudyPlans()

            // Generate recommendations with real data
            setLoadingRecommendations(true)
            
            // Create current quiz result object with proper type handling
            const currentQuizResult = {
              id: "current-quiz",
              userId: userEmail,
              category,
              difficulty,
              score,
              totalQuestions: questions.length,
              timeSpent: 0,
              date: new Date(),
              questionsAnswered: userAnswers.map(answer => ({
                question: answer.question,
                userAnswer: answer.userAnswer || "", // Convert null to empty string
                correctAnswer: answer.correctAnswer,
                isCorrect: answer.isCorrect,
              })),
            }

            // Generate smart recommendations using the new API
            const recsResponse = await fetch("/api/smart-recommendations", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                userId: userEmail,
                quizResult: currentQuizResult,
                questions,
                learnerType: 'inBetween',
                includeAnalytics: true,
                includeStudyPlan: true,
                includeLearningPaths: true
              }),
            })

            if (recsResponse.ok) {
              const data = await recsResponse.json()
              
              setRecommendations(data)
              setShowRecommendations(true)
              setLoadingRecommendations(false)
            }
          }
        } catch (error) {
          console.error("Error saving result or generating recommendations:", error)
          setLoadingRecommendations(false)
        }
      }
      
      saveResultAndGenerateRecommendations()
    }
  }, [quizCompleted, session, category, difficulty, score, userAnswers, userQuizHistory])

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
            <div className="max-w-4xl mx-auto">
              {/* Quiz Results Card */}
              <Card className="overflow-hidden mb-8">
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
                  {loadingRecommendations && (
                    <div className="w-full text-center py-4">
                      <div className="flex items-center justify-center gap-2">
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-primary"></div>
                        <span className="text-sm text-muted-foreground">Generating personalized recommendations...</span>
                      </div>
                    </div>
                  )}
                </CardFooter>
              </Card>

              {/* Comprehensive Learning Resources and Study Plans */}
              <Card className="mb-8">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <BookOpen className="h-6 w-6 text-blue-600" />
                    Learning Resources & Study Plans
                  </CardTitle>
                  <p className="text-muted-foreground">
                    Comprehensive resources and structured study plans for {getCategoryDisplayName(category)}
                  </p>
                </CardHeader>
                <CardContent>
                  <Tabs value={activeTab} onValueChange={setActiveTab}>
                    <TabsList className="grid w-full grid-cols-3">
                      <TabsTrigger value="overview">Overview</TabsTrigger>
                      <TabsTrigger value="resources">Resources</TabsTrigger>
                      <TabsTrigger value="study-plan">Study Plan</TabsTrigger>
                    </TabsList>

                    <TabsContent value="overview" className="space-y-6">
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <Card>
                          <CardHeader className="pb-3">
                            <CardTitle className="text-sm font-medium flex items-center gap-2">
                              <BookOpen className="h-4 w-4 text-blue-500" />
                              Available Resources
                            </CardTitle>
                          </CardHeader>
                          <CardContent>
                            <p className="text-2xl font-bold">{subjectResources.length}</p>
                            <p className="text-sm text-muted-foreground">High-quality learning materials</p>
                          </CardContent>
                        </Card>

                        <Card>
                          <CardHeader className="pb-3">
                            <CardTitle className="text-sm font-medium flex items-center gap-2">
                              <BookMarked className="h-4 w-4 text-green-500" />
                              Study Plans
                            </CardTitle>
                          </CardHeader>
                          <CardContent>
                            <p className="text-2xl font-bold">{studyPlans.length}</p>
                            <p className="text-sm text-muted-foreground">Structured learning paths</p>
                          </CardContent>
                        </Card>

                        <Card>
                          <CardHeader className="pb-3">
                            <CardTitle className="text-sm font-medium flex items-center gap-2">
                              <Target className="h-4 w-4 text-purple-500" />
                              Your Level
                            </CardTitle>
                          </CardHeader>
                          <CardContent>
                            <Badge variant="outline" className="capitalize text-lg">
                              {difficulty}
                            </Badge>
                            <p className="text-sm text-muted-foreground mt-2">Current difficulty level</p>
                          </CardContent>
                        </Card>
                      </div>

                      <Card>
                        <CardHeader>
                          <CardTitle className="text-lg flex items-center gap-2">
                            <Lightbulb className="h-5 w-5 text-yellow-600" />
                            Quick Start Guide
                          </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="space-y-2">
                              <h4 className="font-medium">For Beginners</h4>
                              <ul className="text-sm text-muted-foreground space-y-1">
                                <li>• Start with fundamental concepts</li>
                                <li>• Focus on basic terminology</li>
                                <li>• Complete practice exercises</li>
                              </ul>
                            </div>
                            <div className="space-y-2">
                              <h4 className="font-medium">For Advanced Learners</h4>
                              <ul className="text-sm text-muted-foreground space-y-1">
                                <li>• Dive into complex topics</li>
                                <li>• Explore advanced resources</li>
                                <li>• Challenge with difficult problems</li>
                              </ul>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    </TabsContent>

                    <TabsContent value="resources" className="space-y-6">
                      {loadingResources ? (
                        <div className="text-center py-8">
                          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
                          <p className="text-muted-foreground">Loading resources...</p>
                        </div>
                      ) : subjectResources.length > 0 ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          {subjectResources.map((resource, index) => (
                            <Card key={index} className="hover:shadow-md transition-shadow">
                              <CardHeader className="pb-3">
                                <div className="flex items-start justify-between">
                                  <div className="flex-1">
                                    <CardTitle className="text-base">{resource.title}</CardTitle>
                                    <p className="text-sm text-muted-foreground mt-1">{resource.description}</p>
                                  </div>
                                  <div className="flex items-center gap-2 ml-4">
                                    <Badge variant="outline" className="capitalize">
                                      {resource.type}
                                    </Badge>
                                  </div>
                                </div>
                              </CardHeader>
                              <CardContent className="pt-0">
                                <div className="flex items-center justify-between text-sm text-muted-foreground mb-3">
                                  <span>{resource.provider || 'SmartQuiz'}</span>
                                  {resource.rating > 0 && (
                                    <div className="flex items-center gap-1">
                                      <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                                      <span>{resource.rating.toFixed(1)}</span>
                                    </div>
                                  )}
                                </div>
                                <Button 
                                  variant="outline" 
                                  size="sm" 
                                  className="w-full"
                                  onClick={() => window.open(resource.url, '_blank')}
                                >
                                  <ExternalLink className="h-4 w-4 mr-2" />
                                  View Resource
                                </Button>
                              </CardContent>
                            </Card>
                          ))}
                        </div>
                      ) : (
                        <div className="text-center py-8">
                          <BookOpen className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                          <p className="text-muted-foreground">No resources available for this subject</p>
                        </div>
                      )}
                    </TabsContent>

                    <TabsContent value="study-plan" className="space-y-6">
                      {loadingResources ? (
                        <div className="text-center py-8">
                          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
                          <p className="text-muted-foreground">Loading study plans...</p>
                        </div>
                      ) : studyPlans.length > 0 ? (
                        <div className="space-y-4">
                          {studyPlans.map((plan, index) => (
                            <Card key={index}>
                              <CardHeader>
                                <div className="flex items-center justify-between">
                                  <CardTitle className="text-lg">Week {plan.week}</CardTitle>
                                  <Badge variant="outline">{plan.focus}</Badge>
                                </div>
                              </CardHeader>
                              <CardContent className="space-y-4">
                                <div>
                                  <h4 className="font-medium mb-2">Focus Area</h4>
                                  <p className="text-sm text-muted-foreground">{plan.focus}</p>
                                </div>

                                {plan.goals && plan.goals.length > 0 && (
                                  <div>
                                    <h4 className="font-medium mb-2">Learning Goals</h4>
                                    <ul className="text-sm text-muted-foreground space-y-1">
                                      {plan.goals.map((goal: string, goalIndex: number) => (
                                        <li key={goalIndex} className="flex items-center gap-2">
                                          <div className="h-1.5 w-1.5 rounded-full bg-muted-foreground" />
                                          {goal}
                                        </li>
                                      ))}
                                    </ul>
                                  </div>
                                )}

                                {plan.quizTopics && plan.quizTopics.length > 0 && (
                                  <div>
                                    <h4 className="font-medium mb-2">Quiz Topics</h4>
                                    <div className="flex flex-wrap gap-2">
                                      {plan.quizTopics.map((topic: string, topicIndex: number) => (
                                        <Badge key={topicIndex} variant="secondary">
                                          {topic}
                                        </Badge>
                                      ))}
                                    </div>
                                  </div>
                                )}

                                {plan.resources && plan.resources.length > 0 && (
                                  <div>
                                    <h4 className="font-medium mb-2">Recommended Resources</h4>
                                    <div className="flex flex-wrap gap-2">
                                      {plan.resources.map((resource: string, resourceIndex: number) => (
                                        <Badge key={resourceIndex} variant="outline">
                                          {resource}
                                        </Badge>
                                      ))}
                                    </div>
                                  </div>
                                )}
                              </CardContent>
                            </Card>
                          ))}
                        </div>
                      ) : (
                        <div className="text-center py-8">
                          <BookMarked className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                          <p className="text-muted-foreground">No study plans available for this subject</p>
                        </div>
                      )}
                    </TabsContent>
                  </Tabs>
                </CardContent>
              </Card>

              {/* Smart Recommendations */}
              {showRecommendations && recommendations && (
                <div className="mb-8">
                  <div className="mb-6 text-center">
                    <h2 className="text-2xl font-bold mb-2">Your Personalized Recommendations</h2>
                    <p className="text-muted-foreground">
                      Based on your quiz performance and learning history, here are AI-powered recommendations to help you improve:
                    </p>
                  </div>
                  <SmartRecommendationPanel 
                    recommendations={recommendations} 
                    onStartQuiz={(category, difficulty) => {
                      router.push(`/quiz/play?category=${category}&difficulty=${difficulty}&count=10&time=60`)
                    }}
                  />
                </div>
              )}
            </div>
          </div>
        </main>
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
