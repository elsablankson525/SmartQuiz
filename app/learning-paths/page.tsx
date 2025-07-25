"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Progress } from "@/components/ui/progress"
import { GraduationCap, Search, BookOpen, Clock, Users, Star, Play, Filter, ArrowRight } from "lucide-react"
import { useSession } from "next-auth/react"
import { useEffect } from "react"
import type { LearningPath } from "@/lib/types"

export default function LearningPathsPage() {
  const { data: session } = useSession();
  const router = useRouter()
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("All")
  const [selectedDifficulty, setSelectedDifficulty] = useState("All")
  const [loadingPath, setLoadingPath] = useState<string | null>(null)
  const [learningPaths, setLearningPaths] = useState<LearningPath[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function fetchPaths() {
      setLoading(true)
      setError(null)
      try {
        const params = new URLSearchParams()
        if (selectedCategory !== "All") params.append("category", selectedCategory)
        if (selectedDifficulty !== "All") params.append("difficulty", selectedDifficulty)
        if (searchTerm) params.append("search", searchTerm)
        if (session?.user?.email) params.append("userId", session.user.email)
        const res = await fetch(`/api/learning-paths?${params.toString()}`)
        if (!res.ok) throw new Error("Failed to fetch learning paths")
        const data = await res.json()
        setLearningPaths(data.learningPaths)
      } catch (err) {
        setError("Could not load learning paths. Please try again later.")
      } finally {
        setLoading(false)
      }
    }
    fetchPaths()
  }, [selectedCategory, selectedDifficulty, searchTerm, session])

  if (loading) return <div className="flex justify-center items-center min-h-screen">Loading learning paths...</div>
  if (error) return <div className="flex justify-center items-center min-h-screen text-red-500">{error}</div>

  const filteredPaths = learningPaths.filter((path) => {
    const matchesSearch =
      path.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      path.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      path.skills.some((skill: string) => skill.toLowerCase().includes(searchTerm.toLowerCase()))

    const matchesCategory = selectedCategory === "All" || path.category === selectedCategory
    const matchesDifficulty = selectedDifficulty === "All" || path.difficulty === selectedDifficulty

    return matchesSearch && matchesCategory && matchesDifficulty
  })

  const handleStartPath = async (pathId: string) => {
    setLoadingPath(pathId)
    // Simulate loading
    await new Promise((resolve) => setTimeout(resolve, 1000))
    router.push(`/quiz/new?path=${pathId}`)
  }

  const handleContinuePath = async (pathId: string) => {
    setLoadingPath(pathId)
    // Simulate loading
    await new Promise((resolve) => setTimeout(resolve, 800))
    router.push(`/quiz/play?path=${pathId}`)
  }

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case "Beginner":
        return "bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-300"
      case "Intermediate":
        return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-300"
      case "Advanced":
        return "bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-300"
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-300"
    }
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Removed custom header to avoid duplicate navbar */}

      <main className="container mx-auto px-4 py-8">
        {/* Hero Section */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            <span className="text-primary">SmartQuiz</span> Learning Paths
          </h1>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto mb-8">
            Structured learning journeys designed by AI to take you from beginner to expert in your chosen field
          </p>
        </div>

        {/* Search and Filters */}
        <div className="mb-8 space-y-4">
          <div className="relative max-w-md mx-auto">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
            <Input
              placeholder="Search learning paths..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>

          <div className="flex flex-wrap gap-4 justify-center">
            <div className="flex items-center gap-2">
              <Filter className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm font-medium">Category:</span>
              <div className="flex gap-1">
                {["All", "Computer Science", "Business", "Health", "Law", "Psychology"].map((category) => (
                  <Button
                    key={category}
                    variant={selectedCategory === category ? "default" : "outline"}
                    size="sm"
                    onClick={() => setSelectedCategory(category)}
                  >
                    {category}
                  </Button>
                ))}
              </div>
            </div>

            <div className="flex items-center gap-2">
              <span className="text-sm font-medium">Difficulty:</span>
              <div className="flex gap-1">
                {["All", "Beginner", "Intermediate", "Advanced"].map((difficulty) => (
                  <Button
                    key={difficulty}
                    variant={selectedDifficulty === difficulty ? "default" : "outline"}
                    size="sm"
                    onClick={() => setSelectedDifficulty(difficulty)}
                  >
                    {difficulty}
                  </Button>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Learning Paths Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredPaths.map((path) => (
            <Card key={path.id} className="learning-card hover:shadow-lg transition-all">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div
                    className={`w-12 h-12 rounded-full ${path.color} flex items-center justify-center text-2xl mb-4`}
                  >
                    {path.icon}
                  </div>
                  <div className="flex items-center gap-2">
                    {path.isPopular && (
                      <Badge className="bg-orange-100 text-orange-800 dark:bg-orange-900/20 dark:text-orange-300">
                        Popular
                      </Badge>
                    )}
                    <div className="flex items-center gap-1">
                      <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                      <span className="text-sm font-medium">{path.rating}</span>
                    </div>
                  </div>
                </div>
                <CardTitle className="text-xl">{path.title}</CardTitle>
                <CardDescription>{path.description}</CardDescription>
              </CardHeader>

              <CardContent className="space-y-4">
                {/* Progress Bar (if enrolled) */}
                {(path.progress ?? 0) > 0 && (
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Progress</span>
                      <span>{path.progress}%</span>
                    </div>
                    <Progress value={path.progress} className="h-2" />
                  </div>
                )}

                {/* Stats */}
                <div className="grid grid-cols-3 gap-4 text-center text-sm">
                  <div>
                    <div className="flex items-center justify-center gap-1 text-muted-foreground">
                      <BookOpen className="h-3 w-3" />
                      <span>{path.modules}</span>
                    </div>
                    <div className="text-xs text-muted-foreground">Modules</div>
                  </div>
                  <div>
                    <div className="flex items-center justify-center gap-1 text-muted-foreground">
                      <Clock className="h-3 w-3" />
                      <span>{path.duration}</span>
                    </div>
                    <div className="text-xs text-muted-foreground">Duration</div>
                  </div>
                  <div>
                    <div className="flex items-center justify-center gap-1 text-muted-foreground">
                      <Users className="h-3 w-3" />
                      <span>{(path.enrolled ?? 0).toLocaleString()}</span>
                    </div>
                    <div className="text-xs text-muted-foreground">Enrolled</div>
                  </div>
                </div>

                {/* Difficulty and Category */}
                <div className="flex justify-between items-center">
                  <Badge className={getDifficultyColor(path.difficulty)}>{path.difficulty}</Badge>
                  <Badge variant="secondary">{path.category}</Badge>
                </div>

                {/* Skills */}
                <div>
                  <h4 className="text-sm font-medium mb-2">Skills you'll learn:</h4>
                  <div className="flex flex-wrap gap-1">
                    {path.skills.slice(0, 3).map((skill: string) => (
                      <Badge key={skill} variant="outline" className="text-xs">
                        {skill}
                      </Badge>
                    ))}
                    {path.skills.length > 3 && (
                      <Badge variant="outline" className="text-xs">
                        +{path.skills.length - 3} more
                      </Badge>
                    )}
                  </div>
                </div>

                {/* Action Button */}
                {(path.progress ?? 0) > 0 ? (
                  <Button
                    className="w-full gap-2"
                    onClick={() => handleContinuePath(path.id)}
                    disabled={loadingPath === path.id}
                  >
                    {loadingPath === path.id ? (
                      "Loading..."
                    ) : (
                      <>
                        <Play className="h-4 w-4" />
                        Continue Learning
                      </>
                    )}
                  </Button>
                ) : (
                  <Button
                    className="w-full gap-2"
                    onClick={() => handleStartPath(path.id)}
                    disabled={loadingPath === path.id}
                  >
                    {loadingPath === path.id ? (
                      "Starting..."
                    ) : (
                      <>
                        Start Path
                        <ArrowRight className="h-4 w-4" />
                      </>
                    )}
                  </Button>
                )}
              </CardContent>
            </Card>
          ))}
        </div>

        {/* No Results */}
        {filteredPaths.length === 0 && (
          <div className="text-center py-12">
            <div className="text-6xl mb-4">🎯</div>
            <h3 className="text-xl font-semibold mb-2">No learning paths found</h3>
            <p className="text-muted-foreground mb-4">Try adjusting your search terms or filters</p>
            <Button
              onClick={() => {
                setSearchTerm("")
                setSelectedCategory("All")
                setSelectedDifficulty("All")
              }}
            >
              Clear Filters
            </Button>
          </div>
        )}

        {/* CTA Section */}
        <section className="mt-16 text-center bg-muted/30 rounded-2xl p-8">
          <h2 className="text-2xl font-bold mb-4">Create Your Own Learning Path</h2>
          <p className="text-muted-foreground mb-6">
            SmartQuiz AI can create personalized learning paths based on your goals and current knowledge level.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button onClick={() => router.push("/quiz/new")}>Start Assessment</Button>
            <Button variant="outline" onClick={() => router.push("/subjects")}>
              Browse Subjects
            </Button>
          </div>
        </section>
      </main>
    </div>
  )
}
