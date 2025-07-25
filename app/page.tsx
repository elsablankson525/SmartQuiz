"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { GraduationCap, Brain, BarChart3, Target, BookOpen, TrendingUp } from "lucide-react"
import { useSession } from "next-auth/react"

export default function Home() {
  const router = useRouter()
  const { data: session, status } = useSession();
  const [isLoading, setIsLoading] = useState(false)

  // Add redirect for authenticated users
  if (status === "loading") {
    return <div className="flex justify-center items-center min-h-screen">Loading...</div>;
  }

  // Redirect on client only
  if (typeof window !== "undefined" && session && session.user) {
    // This block is just for SSR safety, but we'll use useEffect below for best practice
  }

  // Use useEffect for client-side redirect
  useEffect(() => {
    if (session && session.user) {
      router.push("/dashboard");
    }
  }, [session, router]);

  if (session && session.user) {
    return <div className="flex justify-center items-center min-h-screen">Redirecting to dashboard...</div>;
  }

  const handleStartLearning = async () => {
    setIsLoading(true)
    // Simulate loading
    await new Promise((resolve) => setTimeout(resolve, 500))
    router.push("/quiz/new")
  }

  const handleExploreSubjects = () => {
    router.push("/subjects")
  }

  const handleStartQuiz = () => {
    router.push("/quiz/new")
  }

  const handleExplorePaths = () => {
    router.push("/learning-paths")
  }

  const handleSubjectClick = (category: string) => {
    router.push(`/quiz/new?category=${category}`)
  }

  const handleGetStarted = () => {
    router.push("/signup")
  }

  const handleSignIn = () => {
    router.push("/login")
  }

  return (
    <div className="min-h-screen flex flex-col">
      <main className="flex-1">
        {/* Hero Section */}
        <section className="relative py-20 md:py-32 overflow-hidden">
          <div className="absolute inset-0 analytics-gradient opacity-5" />
          <div className="container mx-auto px-4 flex flex-col md:flex-row items-center gap-12">
            <div className="md:w-1/2 space-y-6">
              <h1 className="text-4xl md:text-6xl font-bold leading-tight">
                Smart Learning with <span className="text-primary">SmartQuiz</span> AI
              </h1>
              <p className="text-lg text-muted-foreground">
                Master any subject with AI-powered quizzes, adaptive learning paths, and detailed analytics. From
                computer science to health, business to law - your personalized learning journey starts here.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 pt-4">
                <Button size="lg" className="gap-2" onClick={handleStartLearning} disabled={isLoading}>
                  <Brain className="h-5 w-5" />
                  {isLoading ? "Starting..." : "Start Learning"}
                </Button>
                <Button size="lg" variant="outline" onClick={handleExploreSubjects}>
                  Explore Subjects
                </Button>
              </div>
            </div>
            <div className="md:w-1/2 relative">
              <div className="relative w-full h-[400px] bg-gradient-to-br from-primary/10 to-accent/10 rounded-2xl overflow-hidden">
                <div className="absolute top-10 left-10 w-48 h-32 bg-white rounded-lg shadow-lg p-4 rotate-3">
                  <div className="h-3 w-32 bg-primary/20 rounded mb-2"></div>
                  <div className="h-2 w-28 bg-primary/20 rounded mb-3"></div>
                  <div className="space-y-1">
                    <div className="h-2 w-full bg-accent/30 rounded"></div>
                    <div className="h-2 w-full bg-accent/30 rounded"></div>
                    <div className="h-2 w-3/4 bg-accent/30 rounded"></div>
                  </div>
                </div>
                <div className="absolute bottom-10 right-10 w-40 h-40 bg-white rounded-lg shadow-lg p-4 -rotate-6">
                  <div className="flex items-center justify-center h-full">
                    <div className="text-center">
                      <div className="text-2xl font-bold text-primary">85%</div>
                      <div className="text-xs text-muted-foreground">Average Score</div>
                      <TrendingUp className="h-6 w-6 text-green-500 mx-auto mt-2" />
                    </div>
                  </div>
                </div>
                <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-32 h-32 bg-white rounded-full shadow-lg flex items-center justify-center">
                  <GraduationCap className="h-16 w-16 text-primary" />
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section className="py-20 bg-muted/30">
          <div className="container mx-auto px-4">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold mb-4">Why Choose SmartQuiz?</h2>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                Advanced AI technology meets personalized education to create the most effective learning experience
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-8">
              <Card className="learning-card cursor-pointer hover:shadow-lg transition-all" onClick={handleStartQuiz}>
                <CardHeader>
                  <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                    <Brain className="h-6 w-6 text-primary" />
                  </div>
                  <CardTitle>AI-Powered Quizzes</CardTitle>
                  <CardDescription>
                    Adaptive questions that adjust to your learning pace and identify knowledge gaps
                  </CardDescription>
                </CardHeader>
              </Card>

              <Card
                className="learning-card cursor-pointer hover:shadow-lg transition-all"
                onClick={handleExplorePaths}
              >
                <CardHeader>
                  <div className="h-12 w-12 rounded-full bg-accent/10 flex items-center justify-center mb-4">
                    <Target className="h-6 w-6 text-accent" />
                  </div>
                  <CardTitle>Personalized Paths</CardTitle>
                  <CardDescription>
                    Custom learning journeys based on your goals, performance, and interests
                  </CardDescription>
                </CardHeader>
              </Card>

              <Card
                className="learning-card cursor-pointer hover:shadow-lg transition-all"
                onClick={() => router.push("/analytics")}
              >
                <CardHeader>
                  <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                    <BarChart3 className="h-6 w-6 text-primary" />
                  </div>
                  <CardTitle>Advanced Analytics</CardTitle>
                  <CardDescription>
                    Detailed insights into your learning progress with actionable recommendations
                  </CardDescription>
                </CardHeader>
              </Card>
            </div>
          </div>
        </section>

        {/* Subjects Section */}
        <section className="py-20">
          <div className="container mx-auto px-4">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold mb-4">Explore Subject Areas</h2>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                Master knowledge across multiple disciplines with expert-curated content and SmartQuiz AI
              </p>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
              {[
                {
                  name: "Computer Science",
                  icon: "💻",
                  color: "bg-blue-100 text-blue-700 dark:bg-blue-900/20 dark:text-blue-300",
                  category: "computer-science",
                },
                {
                  name: "Health & Medicine",
                  icon: "🏥",
                  color: "bg-green-100 text-green-700 dark:bg-green-900/20 dark:text-green-300",
                  category: "health",
                },
                {
                  name: "Business",
                  icon: "💼",
                  color: "bg-purple-100 text-purple-700 dark:bg-purple-900/20 dark:text-purple-300",
                  category: "business",
                },
                {
                  name: "Law",
                  icon: "⚖️",
                  color: "bg-amber-100 text-amber-700 dark:bg-amber-900/20 dark:text-amber-300",
                  category: "law",
                },
                {
                  name: "Psychology",
                  icon: "🧠",
                  color: "bg-pink-100 text-pink-700 dark:bg-pink-900/20 dark:text-pink-300",
                  category: "psychology",
                },
                {
                  name: "Mathematics",
                  icon: "📊",
                  color: "bg-indigo-100 text-indigo-700 dark:bg-indigo-900/20 dark:text-indigo-300",
                  category: "mathematics",
                },
              ].map((subject) => (
                <Card
                  key={subject.name}
                  className="learning-card text-center hover:shadow-md transition-all cursor-pointer group"
                  onClick={() => handleSubjectClick(subject.category)}
                >
                  <CardContent className="p-6">
                    <div
                      className={`w-16 h-16 rounded-full ${subject.color} flex items-center justify-center mx-auto mb-3 text-2xl group-hover:scale-110 transition-transform`}
                    >
                      {subject.icon}
                    </div>
                    <h3 className="font-medium group-hover:text-primary transition-colors">{subject.name}</h3>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* Stats Section */}
        <section className="py-20 bg-primary text-primary-foreground">
          <div className="container mx-auto px-4">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold mb-4">SmartQuiz by the Numbers</h2>
              <p className="text-primary-foreground/80 text-lg">Join our growing community of learners</p>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
              <div className="group cursor-pointer" onClick={() => router.push("/leaderboard")}>
                <div className="text-4xl font-bold mb-2 group-hover:scale-110 transition-transform">10K+</div>
                <div className="text-primary-foreground/80">Active Learners</div>
              </div>
              <div className="group cursor-pointer" onClick={() => router.push("/analytics")}>
                <div className="text-4xl font-bold mb-2 group-hover:scale-110 transition-transform">50K+</div>
                <div className="text-primary-foreground/80">Quizzes Completed</div>
              </div>
              <div className="group cursor-pointer" onClick={() => router.push("/subjects")}>
                <div className="text-4xl font-bold mb-2 group-hover:scale-110 transition-transform">95%</div>
                <div className="text-primary-foreground/80">Improvement Rate</div>
              </div>
              <div className="group cursor-pointer">
                <div className="text-4xl font-bold mb-2 group-hover:scale-110 transition-transform">24/7</div>
                <div className="text-primary-foreground/80">AI Support</div>
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-20">
          <div className="container mx-auto px-4 text-center">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Ready to Transform Your Learning with SmartQuiz?</h2>
            <p className="text-xl mb-8 max-w-2xl mx-auto text-muted-foreground">
              Join thousands of learners who are achieving their goals with personalized, AI-powered education
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" className="gap-2" onClick={handleStartQuiz}>
                <Brain className="h-5 w-5" />
                Start Your First Quiz
              </Button>
              <Button size="lg" variant="outline" className="gap-2 bg-transparent" onClick={handleExplorePaths}>
                <BookOpen className="h-5 w-5" />
                Explore Learning Paths
              </Button>
            </div>
          </div>
        </section>
      </main>

      <footer className="bg-muted/30 border-t py-12">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <GraduationCap className="h-6 w-6 text-primary" />
                <span className="text-xl font-bold">SmartQuiz</span>
              </div>
              <p className="text-muted-foreground text-sm">
                Empowering learners worldwide with intelligent, personalized education technology and AI-powered
                learning paths.
              </p>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Platform</h4>
              <div className="space-y-2 text-sm">
                <button
                  onClick={() => router.push("/subjects")}
                  className="block text-muted-foreground hover:text-primary text-left transition-colors"
                >
                  Subjects
                </button>
                <button
                  onClick={() => router.push("/learning-paths")}
                  className="block text-muted-foreground hover:text-primary text-left transition-colors"
                >
                  Learning Paths
                </button>
                <button
                  onClick={() => router.push("/analytics")}
                  className="block text-muted-foreground hover:text-primary text-left transition-colors"
                >
                  Analytics
                </button>
              </div>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Community</h4>
              <div className="space-y-2 text-sm">
                <button
                  onClick={() => router.push("/leaderboard")}
                  className="block text-muted-foreground hover:text-primary text-left transition-colors"
                >
                  Leaderboard
                </button>
                <button
                  onClick={() => alert("SmartQuiz Forums coming soon! Connect with fellow learners.")}
                  className="block text-muted-foreground hover:text-primary text-left transition-colors"
                >
                  Forums
                </button>
                <button
                  onClick={() => alert("SmartQuiz Study Groups coming soon! Collaborate and learn together.")}
                  className="block text-muted-foreground hover:text-primary text-left transition-colors"
                >
                  Study Groups
                </button>
              </div>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Support</h4>
              <div className="space-y-2 text-sm">
                <button
                  onClick={() => alert("SmartQuiz Help Center: Contact support@smartquiz.com for assistance")}
                  className="block text-muted-foreground hover:text-primary text-left transition-colors"
                >
                  Help Center
                </button>
                <button
                  onClick={() => alert("Contact SmartQuiz: support@smartquiz.com")}
                  className="block text-muted-foreground hover:text-primary text-left transition-colors"
                >
                  Contact Us
                </button>
                <button
                  onClick={() => alert("SmartQuiz Privacy Policy: We protect your learning data and privacy")}
                  className="block text-muted-foreground hover:text-primary text-left transition-colors"
                >
                  Privacy Policy
                </button>
              </div>
            </div>
          </div>
          <div className="mt-8 pt-8 border-t text-center text-muted-foreground text-sm">
            &copy; {new Date().getFullYear()} SmartQuiz. All rights reserved. Powered by AI for smarter learning.
          </div>
        </div>
      </footer>
    </div>
  )
}
