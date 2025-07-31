"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { PageLoadingSpinner } from "@/components/loading-spinner";
import { useAuth } from "@/hooks/use-auth";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";

import { 
  BarChart3, 
  BookOpen, 
  Target, 
  Trophy, 
  TrendingUp, 
  Clock, 
  Star,
  Users,
  Award,
  Calendar,
  Zap,
  Brain,
  ArrowRight,
  Play,
  BookMarked,
  GraduationCap,
  Activity
} from "lucide-react";
import Link from "next/link";
import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";

// Define proper types for dashboard recommendations
interface DashboardRecommendation {
  id: string;
  title: string;
  description: string;
  type: string;
  category: string;
  difficulty: string;
  estimatedTime: string;
  priority: number;
  icon: string;
  action: string;
  url: string;
}

// Import types from the recommendation engine
import type { Recommendation as EngineRecommendation } from "@/lib/recommendation-engine";

// Removed unused interfaces NextQuizSuggestion, RecommendedResource, PathRecommendation

// Removed unused interface RecommendationData

// Smart Recommendations Component - Uses the recommendation-engine.ts
function SmartRecommendationsSection({ userId }: { userId: string }) {
  const [recommendations, setRecommendations] = useState<DashboardRecommendation[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();



  const transformRecommendations = useCallback((engineRecommendation: EngineRecommendation): DashboardRecommendation[] => {
    const transformed: DashboardRecommendation[] = [];

    // Add weak areas as focus recommendations
    if (engineRecommendation.weakAreas && engineRecommendation.weakAreas.length > 0) {
      engineRecommendation.weakAreas.slice(0, 2).forEach((area, index) => {
        transformed.push({
          id: `weak-area-${index}`,
          title: `Focus on ${area}`,
          description: `Improve your understanding of ${area} concepts`,
          difficulty: 'Intermediate',
          estimatedTime: '30-45 min',
          type: 'focus',
          category: "general",
          priority: 1, // High priority for weak areas
          icon: "🎯",
          action: "Study",
          url: `/subjects?focus=${encodeURIComponent(area)}`
        });
      });
    }

    // Add learning resources
    if (engineRecommendation.resources && engineRecommendation.resources.length > 0) {
      engineRecommendation.resources.slice(0, 2).forEach((resource, index) => {
        transformed.push({
          id: `resource-${index}`,
          title: resource.title,
          description: resource.description || 'Recommended learning resource',
          difficulty: resource.difficulty || 'Intermediate',
          estimatedTime: `${resource.estimatedTime || 30} min`,
          type: 'resource',
          category: resource.category || "technology",
          priority: 2, // Medium priority for resources
          icon: "📚",
          action: "Learn More",
          url: resource.url
        });
      });
    }

    // Add learning path recommendations
    if (engineRecommendation.pathRecommendations && engineRecommendation.pathRecommendations.length > 0) {
      engineRecommendation.pathRecommendations.slice(0, 1).forEach((pathRec, index) => {
        const path = pathRec.path;
        if (path) {
          transformed.push({
            id: `path-${index}`,
            title: path.title,
            description: path.description || 'Recommended learning path',
            difficulty: path.difficulty || 'Intermediate',
            estimatedTime: path.duration || '2-3 hours',
            type: 'learning_path',
            category: path.category || "technology",
            priority: 3, // Lower priority for learning paths
            icon: "📚",
            action: "Explore Path",
            url: "/learning-paths"
          });
        }
      });
    }

    // Add AI recommendations if available
    if (engineRecommendation.aiRecommendations) {
      const aiRecs = engineRecommendation.aiRecommendations;
      
      // Add immediate actions
      if (aiRecs.immediateActions && aiRecs.immediateActions.length > 0) {
        aiRecs.immediateActions.slice(0, 2).forEach((action, index) => {
          transformed.push({
            id: `ai-action-${index}`,
            title: action.action,
            description: action.reasoning || 'AI-recommended action',
            difficulty: 'Beginner',
            estimatedTime: `${action.timeRequired} min`,
            type: 'action',
            category: "general",
            priority: action.priority === 'high' ? 1 : 2,
            icon: "🤖",
            action: "Start",
            url: "/quiz/new"
          });
        });
      }

      // Add skill development recommendations
      if (aiRecs.skillDevelopment && aiRecs.skillDevelopment.weaknesses.length > 0) {
        aiRecs.skillDevelopment.weaknesses.slice(0, 1).forEach((weakness, index) => {
          transformed.push({
            id: `skill-${index}`,
            title: `Improve ${weakness.skill}`,
            description: `Focus on developing ${weakness.skill} skills`,
            difficulty: 'Intermediate',
            estimatedTime: `${weakness.estimatedTime} days`,
            type: 'skill',
            category: "general",
            priority: 2,
            icon: "🧠",
            action: "Develop",
            url: "/subjects"
          });
        });
      }
    }

    // Add study plan recommendations
    if (engineRecommendation.studyPlan && engineRecommendation.studyPlan.length > 0) {
      const nextWeek = engineRecommendation.studyPlan[0];
      transformed.push({
        id: 'study-plan',
        title: `Week ${nextWeek.week}: ${nextWeek.focus}`,
        description: `Focus on ${nextWeek.focus} with ${nextWeek.estimatedHours} hours of study`,
        difficulty: 'Intermediate',
        estimatedTime: `${nextWeek.estimatedHours} hours`,
        type: 'study_plan',
        category: "general",
        priority: 2,
        icon: "📅",
        action: "View Plan",
        url: "/study-plans"
      });
    }

    return transformed.length > 0 ? transformed : getFallbackRecommendations();
  }, []);

  const fetchRecommendations = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      // Try to get user's recent quiz history first
      const historyResponse = await fetch(`/api/recommendations?userId=${userId}`);
      if (!historyResponse.ok) {
        console.log('History API failed, using fallback recommendations');
        setRecommendations(getFallbackRecommendations());
        return;
      }
      const historyData = await historyResponse.json();

      console.log('History data:', historyData);
      if (historyData.success && historyData.recentQuizzes && historyData.recentQuizzes.length > 0) {
        // Use the most recent quiz result to generate recommendations
        const recentQuiz = historyData.recentQuizzes[0];
        console.log('Using recent quiz for recommendations:', recentQuiz);
        
        // Use the new unified recommendations endpoint
        const response = await fetch('/api/recommendations', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            currentQuizResult: {
              id: "dashboard-analysis",
              userId: userId,
              category: recentQuiz.category,
              difficulty: recentQuiz.difficulty,
              score: recentQuiz.score,
              totalQuestions: recentQuiz.totalQuestions,
              timeSpent: 0,
              date: new Date(),
              questionsAnswered: []
            },
            questions: [],
            userQuizHistory: historyData.recentQuizzes,
            user: { id: userId },
            learnerType: 'inBetween'
          }),
        });

        if (response.ok) {
          const data = await response.json();
          console.log('Smart recommendations API response:', data);
          if (data.recommendations) {
            // Transform recommendations into a format suitable for the dashboard
            const transformedRecs = transformRecommendations(data.recommendations);
            console.log('Transformed recommendations:', transformedRecs);
            setRecommendations(transformedRecs);
          } else {
            throw new Error('No recommendations data received');
          }
        } else {
          throw new Error('Failed to fetch recommendations');
        }
      } else {
        console.log('No recent quizzes found, using fallback recommendations');
        // Fallback to static recommendations if no quiz history
        setRecommendations(getFallbackRecommendations());
      }
    } catch (err) {
      console.error('Error fetching recommendations:', err);
      console.error('Error details:', {
        message: err instanceof Error ? err.message : 'Unknown error',
        stack: err instanceof Error ? err.stack : undefined
      });
      setError(err instanceof Error ? err.message : 'Failed to fetch recommendations');
      // Fallback to static recommendations
      setRecommendations(getFallbackRecommendations());
    } finally {
      setLoading(false);
    }
  }, [userId, transformRecommendations]);

  useEffect(() => {
    fetchRecommendations();
  }, [fetchRecommendations]);

  const getFallbackRecommendations = (): DashboardRecommendation[] => [
    {
      id: "1",
      title: "Advanced JavaScript",
      description: "Master ES6+ features and modern JavaScript patterns",
      difficulty: "Intermediate",
      estimatedTime: "2-3 hours",
      type: "quiz",
      category: "technology",
      priority: 1,
      icon: "🎯",
      action: "Take Quiz",
      url: "/quiz/new"
    },
    {
      id: "2",
      title: "React Hooks Deep Dive",
      description: "Learn advanced React patterns and best practices",
      difficulty: "Advanced",
      estimatedTime: "3-4 hours",
      type: "learning_path",
      category: "technology",
      priority: 3,
      icon: "📚",
      action: "Explore Path",
      url: "/learning-paths"
    },
    {
      id: "3",
      title: "Data Structures & Algorithms",
      description: "Essential computer science concepts",
      difficulty: "Intermediate",
      estimatedTime: "4-5 hours",
      type: "subject",
      category: "technology",
      priority: 2,
      icon: "🧠",
      action: "Learn More",
      url: "/subjects"
    }
  ];

  const handleStart = (rec: DashboardRecommendation) => {
    if (rec.type === 'quiz') {
      // Navigate to quiz with specific category and difficulty
      router.push(rec.url);
    } else if (rec.type === 'learning_path') {
      // Navigate to learning paths
      router.push(rec.url);
    } else if (rec.type === 'subject') {
      // Navigate to subjects
      router.push(rec.url);
    } else if (rec.type === 'resource' && rec.url) {
      // Open resource in new tab
      window.open(rec.url, '_blank');
    } else if (rec.type === 'focus') {
      // Navigate to subjects with focus parameter
      router.push(rec.url);
    } else if (rec.type === 'action') {
      // Navigate to quiz or appropriate action
      router.push(rec.url);
    } else if (rec.type === 'skill') {
      // Navigate to subjects for skill development
      router.push(rec.url);
    } else if (rec.type === 'study_plan') {
      // Navigate to study plans
      router.push(rec.url);
    } else {
      // Default fallback
      router.push('/quiz/new');
    }
  };

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Brain className="h-5 w-5" />
            Smart Recommendations
          </CardTitle>
          <CardDescription>Personalized suggestions based on your learning pattern</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
            <span className="ml-2 text-muted-foreground">Loading recommendations...</span>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Brain className="h-5 w-5" />
            Smart Recommendations
          </CardTitle>
          <CardDescription>Personalized suggestions based on your learning pattern</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-center py-4 text-muted-foreground">
            <p>Unable to load personalized recommendations</p>
            <Button 
              variant="outline" 
              size="sm" 
              onClick={fetchRecommendations}
              className="mt-2"
            >
              Try Again
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Brain className="h-5 w-5" />
          Smart Recommendations
        </CardTitle>
        <CardDescription>Personalized suggestions based on your learning pattern</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {recommendations.map((rec) => (
            <div key={rec.id} className="p-4 border rounded-lg hover:bg-muted/50 transition-colors">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <h4 className="font-medium">{rec.title}</h4>
                  <p className="text-sm text-muted-foreground mt-1">{rec.description}</p>
                  <div className="flex items-center gap-4 mt-2">
                    <Badge variant="outline" className="text-xs">
                      {rec.difficulty}
                    </Badge>
                    <span className="text-xs text-muted-foreground">
                      ⏱️ {rec.estimatedTime}
                    </span>
                    {rec.priority === 1 && (
                      <Badge variant="default" className="text-xs bg-blue-600">
                        Recommended
                      </Badge>
                    )}
                  </div>
                </div>
                <Button 
                  size="sm" 
                  variant="outline"
                  onClick={() => handleStart(rec)}
                  className="ml-4"
                >
                  <Play className="h-4 w-4 mr-1" />
                  {rec.action}
                </Button>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}

export default function DashboardPage() {
  const { isLoading, user } = useAuth("/login");

  // Show loading state only during initial load
  if (isLoading) {
    return <PageLoadingSpinner />;
  }

  // Don't render if not authenticated
  if (!user) {
    return null;
  }

  // Static data for better performance
  const recentActivity = [
    {
      id: 1,
      type: "quiz_completed",
      title: "JavaScript Fundamentals",
      score: 85,
      time: "2 hours ago",
      icon: "🎯",
      color: "text-green-600"
    },
    {
      id: 2,
      type: "lesson_started",
      title: "React Fundamentals",
      progress: 30,
      time: "1 day ago",
      icon: "📚",
      color: "text-blue-600"
    },
    {
      id: 3,
      type: "achievement",
      title: "Python Master Badge",
      time: "3 days ago",
      icon: "🏆",
      color: "text-purple-600"
    }
  ];

  const topSubjects = [
    { name: "Computer Science", progress: 75, quizzes: 12, score: 920 },
    { name: "Mathematics", progress: 60, quizzes: 8, score: 780 },
    { name: "Physics", progress: 45, quizzes: 6, score: 650 }
  ];

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Welcome Section */}
      <div className="mb-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">Welcome back, {user.name || user.email}!</h1>
            <p className="text-muted-foreground">Here&apos;s your learning progress and insights</p>
          </div>
          <div className="flex items-center gap-2">
            <Badge variant="secondary" className="flex items-center gap-1">
              <Star className="h-3 w-3" />
              Level 5 Learner
            </Badge>
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Score</CardTitle>
            <Trophy className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">2,350</div>
            <p className="text-xs text-muted-foreground">
              +180 from last week
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Quizzes Completed</CardTitle>
            <BookOpen className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">47</div>
            <p className="text-xs text-muted-foreground">
              +8 this week
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Study Time</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">28.5h</div>
            <p className="text-xs text-muted-foreground">
              +5.2h from last week
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Streak</CardTitle>
            <Zap className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">12 days</div>
            <p className="text-xs text-muted-foreground">
              Keep it up!
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column - Activity & Progress */}
        <div className="lg:col-span-2 space-y-8">
          {/* Recent Activity */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Activity className="h-5 w-5" />
                Recent Activity
              </CardTitle>
              <CardDescription>Your latest learning activities and achievements</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {recentActivity.map((activity) => (
                  <div key={activity.id} className="flex items-center space-x-4 p-3 rounded-lg border">
                    <div className="text-2xl">{activity.icon}</div>
                    <div className="flex-1">
                      <p className="text-sm font-medium">{activity.title}</p>
                      <p className="text-xs text-muted-foreground">{activity.time}</p>
                    </div>
                    {activity.score && (
                      <Badge variant="outline" className={activity.color}>
                        {activity.score}%
                      </Badge>
                    )}
                    {activity.progress && (
                      <div className="flex items-center gap-2">
                        <Progress value={activity.progress} className="w-20" />
                        <span className="text-xs text-muted-foreground">{activity.progress}%</span>
                      </div>
                    )}
                    {activity.type === "achievement" && (
                      <Badge variant="secondary" className="text-purple-600">
                        Achievement
                      </Badge>
                    )}
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Top Subjects */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BookMarked className="h-5 w-5" />
                Top Subjects
              </CardTitle>
              <CardDescription>Your progress across different subjects</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {topSubjects.map((subject, index) => (
                  <div key={index} className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium">{subject.name}</span>
                      <span className="text-sm text-muted-foreground">{subject.score} pts</span>
                    </div>
                    <div className="flex items-center gap-4">
                      <Progress value={subject.progress} className="flex-1" />
                      <span className="text-xs text-muted-foreground">{subject.quizzes} quizzes</span>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Smart Recommendations */}
          <SmartRecommendationsSection userId={user.email || ''} />
        </div>

        {/* Right Column - Quick Actions & Stats */}
        <div className="space-y-8">
          {/* Quick Actions */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Target className="h-5 w-5" />
                Quick Actions
              </CardTitle>
              <CardDescription>Continue your learning journey</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <Link href="/quiz/new">
                  <Button className="w-full justify-start">
                    <Play className="mr-2 h-4 w-4" />
                    Take Quiz
                    <ArrowRight className="ml-auto h-4 w-4" />
                  </Button>
                </Link>
                <Link href="/subjects">
                  <Button className="w-full justify-start" variant="outline">
                    <BookOpen className="mr-2 h-4 w-4" />
                    Browse Subjects
                    <ArrowRight className="ml-auto h-4 w-4" />
                  </Button>
                </Link>
                <Link href="/learning-paths">
                  <Button className="w-full justify-start" variant="outline">
                    <GraduationCap className="mr-2 h-4 w-4" />
                    Learning Paths
                    <ArrowRight className="ml-auto h-4 w-4" />
                  </Button>
                </Link>
                <Link href="/recommendations">
                  <Button className="w-full justify-start" variant="outline">
                    <TrendingUp className="mr-2 h-4 w-4" />
                    Get Recommendations
                    <ArrowRight className="ml-auto h-4 w-4" />
                  </Button>
                </Link>
                <Link href="/analytics">
                  <Button className="w-full justify-start" variant="outline">
                    <BarChart3 className="mr-2 h-4 w-4" />
                    View Analytics
                    <ArrowRight className="ml-auto h-4 w-4" />
                  </Button>
                </Link>
                <Link href="/leaderboard">
                  <Button className="w-full justify-start" variant="outline">
                    <Users className="mr-2 h-4 w-4" />
                    Community Leaderboard
                    <ArrowRight className="ml-auto h-4 w-4" />
                  </Button>
                </Link>
                <Link href="/profile">
                  <Button className="w-full justify-start" variant="outline">
                    <Award className="mr-2 h-4 w-4" />
                    View Profile
                    <ArrowRight className="ml-auto h-4 w-4" />
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>

          {/* Weekly Progress */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Calendar className="h-5 w-5" />
                Weekly Progress
              </CardTitle>
              <CardDescription>This week&apos;s learning achievements</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm">Quizzes Completed</span>
                  <span className="text-sm font-medium">8/12</span>
                </div>
                <Progress value={67} />
                
                <div className="flex items-center justify-between">
                  <span className="text-sm">Study Hours</span>
                  <span className="text-sm font-medium">5.2/8h</span>
                </div>
                <Progress value={65} />
                
                <div className="flex items-center justify-between">
                  <span className="text-sm">Score Improvement</span>
                  <span className="text-sm font-medium">+180 pts</span>
                </div>
                <div className="h-2 bg-muted rounded-full">
                  <div className="h-2 bg-green-500 rounded-full w-3/4"></div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Achievements */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Award className="h-5 w-5" />
                Recent Achievements
              </CardTitle>
              <CardDescription>Your latest badges and accomplishments</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex items-center gap-3 p-2 rounded-lg bg-gradient-to-r from-yellow-50 to-orange-50">
                  <div className="text-2xl">🏆</div>
                  <div>
                    <p className="text-sm font-medium">Quiz Master</p>
                    <p className="text-xs text-muted-foreground">Completed 50 quizzes</p>
                  </div>
                </div>
                <div className="flex items-center gap-3 p-2 rounded-lg bg-gradient-to-r from-blue-50 to-purple-50">
                  <div className="text-2xl">⭐</div>
                  <div>
                    <p className="text-sm font-medium">Streak Champion</p>
                    <p className="text-xs text-muted-foreground">10-day learning streak</p>
                  </div>
                </div>
                <div className="flex items-center gap-3 p-2 rounded-lg bg-gradient-to-r from-green-50 to-teal-50">
                  <div className="text-2xl">🎯</div>
                  <div>
                    <p className="text-sm font-medium">Perfect Score</p>
                    <p className="text-xs text-muted-foreground">100% on JavaScript Quiz</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>


        </div>
      </div>
    </div>
  );
} 