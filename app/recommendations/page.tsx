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
  const [recommendations, setRecommendations] = useState<RecommendationsData | null>(null);
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
        if (!response.ok) {
          const errorData = await response.json().catch(() => ({}));
          throw new Error(errorData.error || `HTTP ${response.status}: Failed to fetch recommendations`);
        }
        
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
                {recommendations?.recommendations?.nextQuizSuggestion ? (
                  <div className="flex items-center justify-between p-4 rounded-lg border hover:bg-muted/50 transition-colors">
                    <div className="flex-1">
                      <h3 className="font-medium">{recommendations.recommendations.nextQuizSuggestion.category}</h3>
                      <div className="flex items-center gap-2 mt-1">
                        <Badge variant="outline" className="text-xs">{recommendations.recommendations.nextQuizSuggestion.category}</Badge>
                        <Badge variant="secondary" className="text-xs">{recommendations.recommendations.nextQuizSuggestion.difficulty}</Badge>
                        <span className="text-xs text-muted-foreground">• Confidence: {Math.round(recommendations.recommendations.nextQuizSuggestion.confidence * 100)}%</span>
                      </div>
                      <p className="text-sm text-muted-foreground mt-2">{recommendations.recommendations.nextQuizSuggestion.reason}</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="text-right">
                        <p className="text-sm font-medium">{Math.round(recommendations.recommendations.nextQuizSuggestion.confidence * 100)}%</p>
                        <p className="text-xs text-muted-foreground">Confidence</p>
                      </div>
                      <Button size="sm">
                        <ArrowRight className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                ) : (
                  <div className="text-center py-8 text-muted-foreground">
                    <Target className="h-8 w-8 mx-auto mb-2" />
                    <p>No quiz recommendations available</p>
                  </div>
                )}
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
                <div className="text-center py-8 text-muted-foreground">
                  <BookOpen className="h-8 w-8 mx-auto mb-2" />
                  <p>Learning paths coming soon</p>
                  <p className="text-sm">We&apos;re working on personalized learning paths based on your performance</p>
                </div>
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
                {recommendations?.recommendations?.recommendedResources && recommendations.recommendations.recommendedResources.length > 0 ? (
                  recommendations.recommendations.recommendedResources.map((resource, index) => (
                    <div key={index} className="flex items-center justify-between p-4 rounded-lg border hover:bg-muted/50 transition-colors">
                      <div className="flex-1">
                        <h3 className="font-medium">{resource.title}</h3>
                        <div className="flex items-center gap-2 mt-1">
                          <Badge variant="outline" className="text-xs">{resource.type}</Badge>
                          <Badge variant="secondary" className="text-xs">{resource.difficulty}</Badge>
                        </div>
                        <p className="text-sm text-muted-foreground mt-2">{resource.description}</p>
                      </div>
                      <Button size="sm" variant="outline" asChild>
                        <a href={resource.url} target="_blank" rel="noopener noreferrer">
                          View
                        </a>
                      </Button>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-8 text-muted-foreground">
                    <Star className="h-8 w-8 mx-auto mb-2" />
                    <p>No resources recommended yet</p>
                    <p className="text-sm">Complete more quizzes to get personalized resource recommendations</p>
                  </div>
                )}
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
                {recommendations?.recommendations?.strongAreas && recommendations.recommendations.strongAreas.length > 0 && (
                  <div className="p-4 rounded-lg bg-green-50 dark:bg-green-900/20">
                    <h3 className="font-medium text-green-800 dark:text-green-200">Strengths</h3>
                    <ul className="text-sm text-green-700 dark:text-green-300 mt-1 list-disc list-inside">
                      {recommendations.recommendations.strongAreas.map((area, index) => (
                        <li key={index}>{area}</li>
                      ))}
                    </ul>
                  </div>
                )}
                {recommendations?.recommendations?.weakAreas && recommendations.recommendations.weakAreas.length > 0 && (
                  <div className="p-4 rounded-lg bg-yellow-50 dark:bg-yellow-900/20">
                    <h3 className="font-medium text-yellow-800 dark:text-yellow-200">Areas for Improvement</h3>
                    <ul className="text-sm text-yellow-700 dark:text-yellow-300 mt-1 list-disc list-inside">
                      {recommendations.recommendations.weakAreas.map((area, index) => (
                        <li key={index}>{area}</li>
                      ))}
                    </ul>
                  </div>
                )}
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