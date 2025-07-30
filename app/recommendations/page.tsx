"use client";

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  Brain, 
  Target, 
  TrendingUp, 
  BookOpen, 
  Clock, 
  Star,
  ArrowRight,
  Loader2
} from "lucide-react";
import Link from "next/link";

// Define interface for recommendations data
interface RecommendationsData {
  success: boolean;
  recommendations?: {
    weakAreas: string[];
    strongAreas: string[];
    nextQuizSuggestion: {
      category: string;
      difficulty: string;
      reason: string;
      confidence: number;
    };
    recommendedResources: Array<{
      id: string;
      title: string;
      type: string;
      url: string;
      difficulty: string;
      description: string;
    }>;
  };
  error?: string;
}

export default function RecommendationsPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [, setRecommendations] = useState<RecommendationsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Redirect if not authenticated
  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/login");
    }
  }, [status, router]);

  // Fetch recommendations
  useEffect(() => {
    async function fetchRecommendations() {
      if (status !== "authenticated" || !session?.user?.email) return;
      
      setLoading(true);
      setError(null);
      
      try {
        const response = await fetch(`/api/recommendations?userId=${encodeURIComponent(session.user.email)}`);
        if (!response.ok) throw new Error("Failed to fetch recommendations");
        
        const data = await response.json();
        setRecommendations(data);
      } catch (err) {
        setError("Could not load recommendations. Please try again later.");
        console.error("Error fetching recommendations:", err);
      } finally {
        setLoading(false);
      }
    }

    fetchRecommendations();
  }, [session, status]);

  if (status === "loading") {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  if (status === "unauthenticated") {
    return null; // Will redirect
  }

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-8">
            <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4" />
            <h1 className="text-3xl font-bold mb-2">Loading Recommendations</h1>
            <p className="text-muted-foreground">Analyzing your learning patterns...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-6xl mx-auto text-center">
          <div className="text-red-500 mb-4">
            <Brain className="h-16 w-16 mx-auto mb-4" />
            <h1 className="text-2xl font-bold mb-2">Error Loading Recommendations</h1>
            <p className="text-muted-foreground">{error}</p>
          </div>
          <Button onClick={() => window.location.reload()}>
            Try Again
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-2 mb-4">
            <Brain className="h-8 w-8 text-primary" />
            <h1 className="text-3xl font-bold">Smart Recommendations</h1>
          </div>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Personalized learning recommendations based on your performance and preferences
          </p>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center gap-3">
                <Target className="h-8 w-8 text-blue-500" />
                <div>
                  <p className="text-2xl font-bold">12</p>
                  <p className="text-sm text-muted-foreground">Recommended Quizzes</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center gap-3">
                <BookOpen className="h-8 w-8 text-green-500" />
                <div>
                  <p className="text-2xl font-bold">8</p>
                  <p className="text-sm text-muted-foreground">Learning Paths</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center gap-3">
                <TrendingUp className="h-8 w-8 text-purple-500" />
                <div>
                  <p className="text-2xl font-bold">85%</p>
                  <p className="text-sm text-muted-foreground">Success Rate</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center gap-3">
                <Clock className="h-8 w-8 text-orange-500" />
                <div>
                  <p className="text-2xl font-bold">2.5h</p>
                  <p className="text-sm text-muted-foreground">Study Time</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Recommendations Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Quiz Recommendations */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Target className="h-5 w-5" />
                Recommended Quizzes
              </CardTitle>
              <CardDescription>
                Quizzes tailored to your current skill level and learning goals
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {[
                  {
                    title: "JavaScript Fundamentals",
                    difficulty: "Intermediate",
                    estimatedTime: "15 min",
                    score: "85%",
                    category: "Programming"
                  },
                  {
                    title: "React Hooks Deep Dive",
                    difficulty: "Advanced",
                    estimatedTime: "20 min",
                    score: "78%",
                    category: "Web Development"
                  },
                  {
                    title: "Data Structures & Algorithms",
                    difficulty: "Intermediate",
                    estimatedTime: "25 min",
                    score: "92%",
                    category: "Computer Science"
                  }
                ].map((quiz, index) => (
                  <div key={index} className="flex items-center justify-between p-4 rounded-lg border hover:bg-muted/50 transition-colors">
                    <div className="flex-1">
                      <h3 className="font-medium">{quiz.title}</h3>
                      <div className="flex items-center gap-2 mt-1">
                        <Badge variant="outline" className="text-xs">{quiz.category}</Badge>
                        <Badge variant="secondary" className="text-xs">{quiz.difficulty}</Badge>
                        <span className="text-xs text-muted-foreground">• {quiz.estimatedTime}</span>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="text-right">
                        <p className="text-sm font-medium">{quiz.score}</p>
                        <p className="text-xs text-muted-foreground">Predicted</p>
                      </div>
                      <Button size="sm">
                        <ArrowRight className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Learning Paths */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BookOpen className="h-5 w-5" />
                Learning Paths
              </CardTitle>
              <CardDescription>
                Structured learning journeys to master specific topics
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {[
                  {
                    title: "Full-Stack Web Development",
                    progress: 65,
                    modules: 12,
                    completed: 8,
                    difficulty: "Intermediate"
                  },
                  {
                    title: "Machine Learning Basics",
                    progress: 30,
                    modules: 8,
                    completed: 2,
                    difficulty: "Advanced"
                  },
                  {
                    title: "Database Design",
                    progress: 90,
                    modules: 6,
                    completed: 5,
                    difficulty: "Intermediate"
                  }
                ].map((path, index) => (
                  <div key={index} className="p-4 rounded-lg border hover:bg-muted/50 transition-colors">
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="font-medium">{path.title}</h3>
                      <Badge variant="outline" className="text-xs">{path.difficulty}</Badge>
                    </div>
                    <div className="flex items-center gap-2 mb-2">
                      <div className="flex-1 bg-muted rounded-full h-2">
                        <div 
                          className="bg-primary h-2 rounded-full transition-all" 
                          style={{ width: `${path.progress}%` }}
                        ></div>
                      </div>
                      <span className="text-sm text-muted-foreground">{path.progress}%</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-muted-foreground">
                        {path.completed}/{path.modules} modules completed
                      </span>
                      <Button size="sm" variant="outline">
                        Continue
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Study Resources */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Star className="h-5 w-5" />
                Recommended Resources
              </CardTitle>
              <CardDescription>
                High-quality learning materials to supplement your studies
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {[
                  {
                    title: "JavaScript: The Definitive Guide",
                    type: "Book",
                    rating: 4.8,
                    duration: "12 hours"
                  },
                  {
                    title: "React Tutorial for Beginners",
                    type: "Video Course",
                    rating: 4.9,
                    duration: "6 hours"
                  },
                  {
                    title: "Data Structures in Python",
                    type: "Interactive Course",
                    rating: 4.7,
                    duration: "8 hours"
                  }
                ].map((resource, index) => (
                  <div key={index} className="flex items-center justify-between p-4 rounded-lg border hover:bg-muted/50 transition-colors">
                    <div className="flex-1">
                      <h3 className="font-medium">{resource.title}</h3>
                      <div className="flex items-center gap-2 mt-1">
                        <Badge variant="outline" className="text-xs">{resource.type}</Badge>
                        <div className="flex items-center gap-1">
                          <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                          <span className="text-xs">{resource.rating}</span>
                        </div>
                        <span className="text-xs text-muted-foreground">• {resource.duration}</span>
                      </div>
                    </div>
                    <Button size="sm" variant="outline">
                      View
                    </Button>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Performance Insights */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="h-5 w-5" />
                Performance Insights
              </CardTitle>
              <CardDescription>
                Analysis of your learning patterns and improvement areas
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="p-4 rounded-lg bg-green-50 dark:bg-green-900/20">
                  <h3 className="font-medium text-green-800 dark:text-green-200">Strengths</h3>
                  <p className="text-sm text-green-700 dark:text-green-300 mt-1">
                    You excel in JavaScript and React concepts. Consider taking advanced courses in these areas.
                  </p>
                </div>
                <div className="p-4 rounded-lg bg-yellow-50 dark:bg-yellow-900/20">
                  <h3 className="font-medium text-yellow-800 dark:text-yellow-200">Areas for Improvement</h3>
                  <p className="text-sm text-yellow-700 dark:text-yellow-300 mt-1">
                    Focus on data structures and algorithms to strengthen your problem-solving skills.
                  </p>
                </div>
                <div className="p-4 rounded-lg bg-blue-50 dark:bg-blue-900/20">
                  <h3 className="font-medium text-blue-800 dark:text-blue-200">Learning Style</h3>
                  <p className="text-sm text-blue-700 dark:text-blue-300 mt-1">
                    You learn best through hands-on practice. Interactive exercises are recommended.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Action Buttons */}
        <div className="text-center mt-8">
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/quiz/new">
              <Button size="lg" className="gap-2">
                <Target className="h-5 w-5" />
                Start Recommended Quiz
              </Button>
            </Link>
            <Link href="/learning-paths">
              <Button size="lg" variant="outline" className="gap-2">
                <BookOpen className="h-5 w-5" />
                Explore Learning Paths
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
} 