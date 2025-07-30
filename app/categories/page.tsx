"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Brain } from "lucide-react"
import { useEffect, useState } from "react"
import { Progress } from "@/components/ui/progress"
import { Checkbox } from "@/components/ui/checkbox"
import { useSession } from "next-auth/react"

// Define proper types
interface Category {
  id: string
  name: string
  description: string
  color: string
  icon: string
  iconColor: string
  questionCount: number
}

interface LearningPath {
  id: string
  category: string
  title: string
  description: string
  difficulty: string
  duration: string
  progress: number
  milestones: Array<{
    id: string
    title: string
    isCompleted: boolean
  }>
}

function CategoriesSkeleton() {
  return (
    <div className="min-h-screen flex flex-col animate-pulse">
      {/* Removed header to avoid duplicate navbar */}
      <main className="flex-1 py-12">
        <div className="container mx-auto px-4">
          <div className="h-8 w-64 bg-gray-200 rounded mx-auto mb-4" />
          <div className="h-6 w-96 bg-gray-200 rounded mx-auto mb-8" />
          <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {[...Array(8)].map((_, i) => (
              <div key={i} className="rounded-xl bg-gray-200 h-56" />
            ))}
          </div>
        </div>
      </main>
    </div>
  )
}

export default function CategoriesPage() {
  const [categories, setCategories] = useState<Category[]>([])
  const [learningPaths, setLearningPaths] = useState<LearningPath[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const { data: session } = useSession()

  useEffect(() => {
    async function fetchCategoriesAndPaths() {
      setLoading(true)
      setError(null)
      try {
        const res = await fetch("/api/categories")
        if (!res.ok) throw new Error("Failed to fetch categories")
        const data = await res.json()
        setCategories(data.categories)
        // Fetch learning paths for all categories
        let userIdParam = ""
        if (session && session.user) {
          if ("id" in session.user && session.user.id) {
            userIdParam = `?userId=${session.user.id}`
          } else if (session.user.email) {
            userIdParam = `?userId=${session.user.email}`
          }
        }
        const lpRes = await fetch(`/api/learning-paths${userIdParam}`)
        if (!lpRes.ok) throw new Error("Failed to fetch learning paths")
        const lpData = await lpRes.json()
        setLearningPaths(lpData.learningPaths)
      } catch {
        setError("Could not load categories or learning paths. Please try again later.")
      } finally {
        setLoading(false)
      }
    }
    fetchCategoriesAndPaths()
  }, [session])

  if (loading) return <CategoriesSkeleton />
  if (error) return <div className="flex justify-center items-center min-h-screen text-red-500">{error}</div>

  // Helper to get learning path for a category
  function getLearningPathForCategory(categoryName: string) {
    return learningPaths.find((lp: LearningPath) => lp.category === categoryName)
  }

  return (
    <div className="min-h-screen flex flex-col">
      {/* Removed local header to avoid duplicate headers */}

      <main className="flex-1 py-12">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {categories.map((category) => {
              const learningPath = getLearningPathForCategory(category.name)
              return (
                <Card key={category.id} className="overflow-hidden hover:shadow-md transition-shadow">
                  <CardHeader className={`${category.color}`}>
                    <div className="flex justify-between items-start">
                      <span className={`h-8 w-8 ${category.iconColor} text-2xl flex items-center justify-center`}>
                        {category.icon || "📚"}
                      </span>
                      <Badge variant="secondary">{category.questionCount}+ Questions</Badge>
                    </div>
                    <CardTitle className="mt-4 truncate text-lg md:text-xl" title={category.name}>{category.name}</CardTitle>
                    <CardDescription className="text-foreground/70 line-clamp-2 overflow-hidden" style={{display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical'}} title={category.description}>{category.description}</CardDescription>
                  </CardHeader>
                  <CardContent className="pt-6">
                    <div className="flex flex-wrap gap-2 mb-2">
                      <Badge variant="outline">Easy</Badge>
                      <Badge variant="outline">Medium</Badge>
                      <Badge variant="outline">Hard</Badge>
                    </div>
                    {/* Learning Path Progress */}
                    {learningPath && (
                      <div className="mt-2">
                        <div className="flex items-center justify-between mb-1">
                          <span className="text-xs font-semibold">Learning Path Progress</span>
                          <span className="text-xs">{learningPath.progress}%</span>
                        </div>
                        <Progress value={learningPath.progress} className="h-2" />
                        <ul className="mt-2 space-y-1">
                          {learningPath.milestones.map((ms: { id: string; title: string; isCompleted: boolean }) => (
                            <li key={ms.id} className="flex items-center gap-2 text-xs">
                              <Checkbox checked={ms.isCompleted} disabled />
                              <span className={ms.isCompleted ? "line-through text-muted-foreground" : ""}>{ms.title}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </CardContent>
                  <CardFooter>
                    <Link href={`/quiz/new?category=${category.id}`} className="w-full">
                      <Button className="w-full">Start Quiz</Button>
                    </Link>
                  </CardFooter>
                </Card>
              )
            })}
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
