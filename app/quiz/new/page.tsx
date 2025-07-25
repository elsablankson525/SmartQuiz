"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { useRouter, useSearchParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { GraduationCap, ArrowRight, Clock, BarChart3, Brain } from "lucide-react"

// This page is personalised at runtime – skip static generation
export const dynamic = "force-dynamic"

type Category = {
  id: string;
  name: string;
  icon?: string;
  description?: string;
};

export default function NewQuizPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const preselectedCategory = searchParams.get("category")

  const [selectedCategory, setSelectedCategory] = useState(preselectedCategory || "")
  const [selectedDifficulty, setSelectedDifficulty] = useState("medium")
  const [selectedQuestionCount, setSelectedQuestionCount] = useState(10)
  const [selectedTimeLimit, setSelectedTimeLimit] = useState(60)
  const [categories, setCategories] = useState<Category[]>([]);

  useEffect(() => {
    fetch('/api/categories').then(res => res.json()).then(data => setCategories(data.categories))
  }, [])

  const difficulties = [
    { id: "beginner", name: "Beginner", description: "Basic concepts and fundamentals" },
    { id: "intermediate", name: "Intermediate", description: "Moderate complexity and application" },
    { id: "advanced", name: "Advanced", description: "Complex topics and expert-level content" },
    { id: "adaptive", name: "Adaptive", description: "AI adjusts difficulty based on performance" },
  ]

  const questionCounts = [5, 10, 15, 20]
  const timeLimits = [30, 60, 90, 120, 0] // 0 means no time limit

  const startQuiz = () => {
    if (!selectedCategory) {
      alert("Please select a subject before starting the quiz")
      return
    }

    console.log("Starting SmartQuiz quiz with:", {
      category: selectedCategory,
      difficulty: selectedDifficulty,
      count: selectedQuestionCount,
      time: selectedTimeLimit,
    })

    router.push(
      `/quiz/play?category=${selectedCategory}&difficulty=${selectedDifficulty}&count=${selectedQuestionCount}&time=${selectedTimeLimit}`,
    )
  }

  return (
    <div className="min-h-screen flex flex-col">
      {/* Removed custom header to avoid duplicate navbar */}

      <main className="flex-1 py-12 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-8">
              <h1 className="text-4xl font-bold mb-4">Create Your SmartQuiz Quiz</h1>
              <p className="text-lg text-muted-foreground">
                Choose your subject, difficulty, and preferences for a personalized learning experience
              </p>
            </div>

            <Card className="mb-8">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Brain className="h-5 w-5" />
                  Select Subject
                </CardTitle>
                <CardDescription>Choose the subject area you want to focus on</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {categories.map((category) => (
                    <Button
                      key={category.id}
                      variant={selectedCategory === category.id ? "default" : "outline"}
                      className="h-auto py-6 flex flex-col gap-3 text-left"
                      onClick={() => setSelectedCategory(category.id)}
                    >
                      <div className="flex items-center gap-3 w-full">
                        <span className="text-2xl">{category.icon}</span>
                        <div className="flex-1">
                          <div className="font-semibold">{category.name}</div>
                          <div className="text-xs text-muted-foreground font-normal">{category.description}</div>
                        </div>
                      </div>
                    </Button>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card className="mb-8">
              <CardHeader>
                <CardTitle>Select Difficulty Level</CardTitle>
                <CardDescription>Choose how challenging you want your quiz to be</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                  {difficulties.map((difficulty) => (
                    <Button
                      key={difficulty.id}
                      variant={selectedDifficulty === difficulty.id ? "default" : "outline"}
                      className="h-auto py-4 flex flex-col gap-2 justify-start items-start text-left min-h-[100px] w-full max-w-full overflow-hidden"
                      onClick={() => setSelectedDifficulty(difficulty.id)}
                    >
                      <span className="font-bold text-sm md:text-base w-full max-w-full truncate" title={difficulty.name}>{difficulty.name}</span>
                      <span className="text-xs font-normal text-muted-foreground line-clamp-2 break-words text-ellipsis w-full max-w-full overflow-hidden" style={{display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical'}} title={difficulty.description}>{difficulty.description}</span>
                    </Button>
                  ))}
                </div>
              </CardContent>
            </Card>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <BarChart3 className="h-5 w-5" />
                    Number of Questions
                  </CardTitle>
                  <CardDescription>How many questions would you like?</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 gap-2">
                    {questionCounts.map((count) => (
                      <Button
                        key={count}
                        variant={selectedQuestionCount === count ? "default" : "outline"}
                        onClick={() => setSelectedQuestionCount(count)}
                      >
                        {count} Questions
                      </Button>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Clock className="h-5 w-5" />
                    Time Limit
                  </CardTitle>
                  <CardDescription>Set your preferred time limit</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 gap-2">
                    {timeLimits.map((time) => (
                      <Button
                        key={time}
                        variant={selectedTimeLimit === time ? "default" : "outline"}
                        onClick={() => setSelectedTimeLimit(time)}
                        className="text-sm"
                      >
                        {time === 0 ? "No Limit" : `${time} seconds`}
                      </Button>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Selected Category Preview */}
            {selectedCategory && (
              <Card className="mb-8 border-primary/20 bg-primary/5">
                <CardContent className="pt-6">
                  <div className="flex items-center gap-4">
                    <div className="text-4xl">{categories.find((c) => c.id === selectedCategory)?.icon}</div>
                    <div>
                      <h3 className="text-lg font-semibold">
                        Ready to start your {categories.find((c) => c.id === selectedCategory)?.name} quiz?
                      </h3>
                      <p className="text-sm text-muted-foreground">
                        {selectedQuestionCount} questions • {selectedDifficulty} difficulty •
                        {selectedTimeLimit === 0 ? " No time limit" : ` ${selectedTimeLimit} seconds`}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

            <div className="flex justify-center">
              <Button size="lg" className="gap-2 px-8" onClick={startQuiz} disabled={!selectedCategory}>
                Start SmartQuiz Quiz
                <ArrowRight className="h-5 w-5" />
              </Button>
            </div>
          </div>
        </div>
      </main>

      <footer className="bg-muted/30 border-t py-8">
        <div className="container mx-auto px-4 text-center">
          <div className="flex items-center justify-center gap-2 mb-4">
            <GraduationCap className="h-6 w-6 text-primary" />
            <span className="text-xl font-bold">SmartQuiz</span>
          </div>
          <p className="text-muted-foreground text-sm">
            &copy; {new Date().getFullYear()} SmartQuiz. Empowering learners with AI-powered education.
          </p>
        </div>
      </footer>
    </div>
  )
}
