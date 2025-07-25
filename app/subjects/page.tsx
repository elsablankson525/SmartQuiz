"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { GraduationCap, Search, BookOpen, Users, Clock, Star, ArrowRight } from "lucide-react"

function SubjectsSkeleton() {
  return (
    <div className="min-h-screen bg-background animate-pulse">
      <div className="text-center mb-12 pt-12">
        <div className="h-8 w-64 bg-gray-200 rounded mx-auto mb-4" />
        <div className="h-6 w-96 bg-gray-200 rounded mx-auto mb-8" />
        <div className="relative max-w-md mx-auto mb-8">
          <div className="h-10 w-full bg-gray-200 rounded" />
        </div>
      </div>
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 px-4">
        {[...Array(6)].map((_, i) => (
          <div key={i} className="rounded-xl bg-gray-200 h-64" />
        ))}
      </div>
    </div>
  )
}

export default function SubjectsPage() {
  const router = useRouter()
  const [searchTerm, setSearchTerm] = useState("")
  const [loadingSubject, setLoadingSubject] = useState<string | null>(null)
  const [subjects, setSubjects] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function fetchSubjects() {
      setLoading(true)
      setError(null)
      try {
        const params = new URLSearchParams()
        if (searchTerm) params.append("search", searchTerm)
        const res = await fetch(`/api/subjects?${params.toString()}`)
        if (!res.ok) throw new Error("Failed to fetch subjects")
        const data = await res.json()
        setSubjects(data.subjects)
        console.log('Fetched subjects:', (data.subjects as any[]).map((s: any) => ({ id: s.id, name: s.name })))
      } catch (err) {
        setError("Could not load subjects. Please try again later.")
      } finally {
        setLoading(false)
      }
    }
    fetchSubjects()
  }, [searchTerm])

  if (loading) return <SubjectsSkeleton />
  if (error) return <div className="flex justify-center items-center min-h-screen text-red-500">{error}</div>

  const filteredSubjects = subjects.filter(
    (subject) =>
      subject.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      subject.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      subject.topics.some((topic: string) => topic.toLowerCase().includes(searchTerm.toLowerCase())),
  )

  const handleStartLearning = async (subjectId: string) => {
    setLoadingSubject(subjectId)
    // Simulate loading
    await new Promise((resolve) => setTimeout(resolve, 800))
    router.push(`/subjects/${subjectId}`)
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
      <main className="container mx-auto px-4 py-8">
        {/* Hero Section */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            Explore <span className="text-primary">SmartQuiz</span> Subjects
          </h1>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto mb-8">
            Dive deep into your favorite subjects with AI-powered quizzes, comprehensive resources, and personalized
            learning paths
          </p>

          {/* Search Bar */}
          <div className="relative max-w-md mx-auto">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
            <Input
              placeholder="Search subjects or topics..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>

        {/* Subjects Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredSubjects.map((subject) => (
            <Card
              key={subject.id}
              className={`learning-card hover:shadow-lg transition-all ${subject.borderColor} border-2`}
            >
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div
                    className={`w-12 h-12 rounded-full ${subject.color} flex items-center justify-center text-2xl mb-4`}
                  >
                    {subject.icon}
                  </div>
                  <div className="flex items-center gap-1">
                    <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                    <span className="text-sm font-medium">{subject.rating}</span>
                  </div>
                </div>
                <CardTitle className="text-xl truncate w-full max-w-full" title={subject.name}>{subject.name}</CardTitle>
                <CardDescription className="text-sm line-clamp-2 break-words text-ellipsis w-full max-w-full overflow-hidden" style={{display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical'}} title={subject.description}>{subject.description}</CardDescription>
              </CardHeader>

              <CardContent className="space-y-4">
                {/* Stats */}
                <div className="grid grid-cols-3 gap-4 text-center text-sm">
                  <div>
                    <div className="flex items-center justify-center gap-1 text-muted-foreground">
                      <BookOpen className="h-3 w-3" />
                      <span>{subject.quizzes}</span>
                    </div>
                    <div className="text-xs text-muted-foreground">Quizzes</div>
                  </div>
                  <div>
                    <div className="flex items-center justify-center gap-1 text-muted-foreground">
                      <Users className="h-3 w-3" />
                      <span>{subject.learners.toLocaleString()}</span>
                    </div>
                    <div className="text-xs text-muted-foreground">Learners</div>
                  </div>
                  <div>
                    <div className="flex items-center justify-center gap-1 text-muted-foreground">
                      <Clock className="h-3 w-3" />
                      <span>{subject.avgTime}</span>
                    </div>
                    <div className="text-xs text-muted-foreground">Avg Time</div>
                  </div>
                </div>

                {/* Difficulty Badge */}
                <div className="flex justify-center">
                  <Badge className={getDifficultyColor(subject.difficulty)}>{subject.difficulty}</Badge>
                </div>

                {/* Topics */}
                <div>
                  <h4 className="text-sm font-medium mb-2">Popular Topics:</h4>
                  <div className="flex flex-wrap gap-1">
                    {subject.topics.slice(0, 4).map((topic: string) => (
                      <Badge key={topic} variant="secondary" className="text-xs">
                        {topic}
                      </Badge>
                    ))}
                    {subject.topics.length > 4 && (
                      <Badge variant="secondary" className="text-xs">
                        +{subject.topics.length - 4} more
                      </Badge>
                    )}
                  </div>
                </div>

                {/* Action Button */}
                <Button
                  className="w-full gap-2"
                  onClick={() => handleStartLearning(subject.id)}
                  disabled={loadingSubject === subject.id}
                >
                  {loadingSubject === subject.id ? (
                    "Starting..."
                  ) : (
                    <>
                      Start Learning
                      <ArrowRight className="h-4 w-4" />
                    </>
                  )}
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* No Results */}
        {filteredSubjects.length === 0 && (
          <div className="text-center py-12">
            <div className="text-6xl mb-4">🔍</div>
            <h3 className="text-xl font-semibold mb-2">No subjects found</h3>
            <p className="text-muted-foreground mb-4">
              Try adjusting your search terms or explore our available subjects
            </p>
            <Button onClick={() => setSearchTerm("")}>Clear Search</Button>
          </div>
        )}

        {/* CTA Section */}
        <section className="mt-16 text-center bg-muted/30 rounded-2xl p-8">
          <h2 className="text-2xl font-bold mb-4">Can't find what you're looking for?</h2>
          <p className="text-muted-foreground mb-6">
            SmartQuiz is constantly expanding. Request new subjects or suggest improvements to existing ones.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button onClick={() => alert("Subject request feature coming soon!")}>Request New Subject</Button>
            <Button variant="outline" onClick={() => router.push("/")}>
              Back to Home
            </Button>
          </div>
        </section>
      </main>
    </div>
  )
}
