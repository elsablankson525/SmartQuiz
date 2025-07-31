'use client';

import React, { useState, useEffect, useCallback } from 'react';
import Image from 'next/image';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { 
  Loader2, 
  Brain, 
  Target, 
  TrendingUp, 
  Clock, 
  Star, 
  CheckCircle, 
  AlertCircle,
  Play,
  Calendar,
  Users,
  Trophy,
  Zap,
  BookMarked,
  Award,
  ExternalLink,
  Activity,
  Cpu,
  Sparkles,
  Eye,
  Heart,
  BookOpen
} from 'lucide-react';

interface AdvancedAIRecommendation {
  aiAnalysis: {
    learningPattern: {
      primaryStyle: "visual" | "auditory" | "kinesthetic" | "reading" | "mixed"
      secondaryStyle: "visual" | "auditory" | "kinesthetic" | "reading" | "mixed"
      confidence: number
      evidence: string[]
    }
    cognitiveProfile: {
      attentionSpan: number
      optimalSessionLength: number
      cognitiveLoad: "low" | "medium" | "high"
      memoryRetention: number
      processingSpeed: "slow" | "average" | "fast"
    }
    behavioralPatterns: {
      studyTimePreference: "morning" | "afternoon" | "evening" | "night"
      sessionFrequency: "daily" | "weekly" | "sporadic"
      completionRate: number
      timeEfficiency: "low" | "medium" | "high"
      motivationLevel: "low" | "medium" | "high"
    }
  }
  predictions: {
    nextQuizPerformance: {
      expectedScore: number
      confidence: number
      keyFactors: string[]
      riskFactors: string[]
    }
    masteryTimeline: {
      estimatedDays: number
      milestones: Array<{
        day: number
        milestone: string
        confidence: number
        prerequisites: string[]
      }>
    }
  }
  recommendations: {
    immediateActions: Array<{
      action: string
      priority: "high" | "medium" | "low"
      impact: number
      timeRequired: number
      reasoning: string
      geminiReasoning?: string
    }>
    personalizedResources: Array<{
      title: string
      type: "video" | "article" | "course" | "practice" | "book" | "interactive"
      url: string
      difficulty: string
      relevanceScore: number
      estimatedTime: number
      aiReasoning: string
      learningOutcomes: string[]
      personalizedTips?: string
      thumbnail?: string
      channelTitle?: string
      viewCount?: number
      duration?: string
    }>
    geminiInsights?: {
      learningInsights: string
      motivationalTips: string[]
      studyStrategies: string[]
      encouragement: string
      nextSteps: string
    }
  }
  collaborativeInsights: {
    similarLearners: Array<{
      similarityScore: number
      sharedCharacteristics: string[]
      successfulStrategies: string[]
      commonChallenges: string[]
    }>
    communityTrends: {
      trendingTopics: string[]
      popularResources: string[]
      emergingSkills: string[]
      successPatterns: string[]
    }
  }
  aiModels: {
    learningStyleClassifier: {
      model: string
      confidence: number
      features: string[]
    }
    performancePredictor: {
      model: string
      accuracy: number
      features: string[]
    }
    recommendationEngine: {
      model: string
      precision: number
      recall: number
    }
  }
  metadata: {
    generatedAt: string
    processingTime: number
    dataPoints: number
    confidence: number
    version: string
  }
}

interface AdvancedAIRecommendationPanelProps {
  userId: string;
  quizResult: Record<string, unknown>;
  questions: Record<string, unknown>[];
  userHistory?: Record<string, unknown>[];
  learnerType?: 'slow' | 'inBetween' | 'fast';
  onResourceClick?: (resource: Record<string, unknown>) => void;
}

export function AdvancedAIRecommendationPanel({
  userId,
  quizResult,
  questions,
  userHistory = [],
  learnerType = 'inBetween',
  onResourceClick
}: AdvancedAIRecommendationPanelProps) {
  const [recommendations, setRecommendations] = useState<AdvancedAIRecommendation | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState('ai-analysis');

  const fetchAdvancedAIRecommendations = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      // Use the new unified recommendations endpoint
      const response = await fetch('/api/recommendations', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          currentQuizResult: quizResult,
          questions,
          userQuizHistory: userHistory,
          user: { id: userId },
          learnerType
        }),
      });

      if (!response.ok) {
        throw new Error(`Failed to fetch advanced AI recommendations: ${response.statusText}`);
      }

      const data = await response.json();
      // The API returns { recommendations: Recommendation }, so we need to extract it
      const recommendationData = data.recommendations || data;
      
      // Debug logging
      console.log('Recommendation data:', recommendationData);
      console.log('Resources:', recommendationData.resources);
      console.log('YouTube videos:', recommendationData.youtubeVideos);
      
      // Transform the data to match the expected interface
      const transformedData: AdvancedAIRecommendation = {
        aiAnalysis: {
          learningPattern: {
            primaryStyle: recommendationData.aiAnalysis?.learningPattern?.primaryStyle || 'mixed',
            secondaryStyle: recommendationData.aiAnalysis?.learningPattern?.secondaryStyle || 'mixed',
            confidence: recommendationData.aiAnalysis?.learningPattern?.confidence || 0.75,
            evidence: recommendationData.aiAnalysis?.learningPattern?.evidence || []
          },
          cognitiveProfile: {
            attentionSpan: recommendationData.aiAnalysis?.attentionSpan?.averageMinutes || 25,
            optimalSessionLength: recommendationData.aiAnalysis?.cognitiveLoad?.optimalSessionLength || 45,
            cognitiveLoad: recommendationData.aiAnalysis?.cognitiveLoad?.currentLoad || 'medium',
            memoryRetention: 0.8, // Default value
            processingSpeed: 'average' // Default value
          },
          behavioralPatterns: {
            studyTimePreference: 'afternoon', // Default value
            sessionFrequency: 'daily', // Default value
            completionRate: 0.85, // Default value
            timeEfficiency: recommendationData.performanceAnalytics?.timeEfficiency || 'optimal',
            motivationLevel: recommendationData.aiAnalysis?.motivationLevel?.level || 'medium'
          }
        },
        predictions: {
          nextQuizPerformance: {
            expectedScore: recommendationData.aiPredictions?.nextQuizPrediction?.expectedScore || 75,
            confidence: recommendationData.aiPredictions?.nextQuizPrediction?.confidence || 0.7,
            keyFactors: recommendationData.aiPredictions?.nextQuizPrediction?.keyFactors || [],
            riskFactors: recommendationData.aiPredictions?.nextQuizPrediction?.riskFactors || []
          },
          masteryTimeline: {
            estimatedDays: recommendationData.aiPredictions?.masteryTimeline?.estimatedDays || 30,
            milestones: recommendationData.aiPredictions?.masteryTimeline?.milestones?.map((m: { day: number; milestone: string; confidence: number; prerequisites: string[] }) => ({
              day: m.day,
              milestone: m.milestone,
              confidence: m.confidence,
              prerequisites: []
            })) || []
          }
        },
        recommendations: {
          immediateActions: recommendationData.aiRecommendations?.immediateActions || [],
          personalizedResources: [
            ...(recommendationData.resources || []).map((resource: Record<string, unknown>) => ({
              title: String(resource.title || ''),
              type: String(resource.type || ''),
              url: String(resource.url || ''),
              difficulty: String(resource.difficulty || ''),
              relevanceScore: Number(resource.relevanceScore) || 0.8,
              estimatedTime: Number(resource.estimatedTime) || 30,
              aiReasoning: `Recommended based on your performance in ${quizResult.category} and identified weak areas. This ${String(resource.type || '')} resource will help you improve your understanding of ${String(resource.topic || 'key concepts')}.`,
              learningOutcomes: [
                `Master ${String(resource.topic || 'fundamental concepts')}`,
                `Apply knowledge to solve problems`,
                `Build confidence in ${quizResult.category}`
              ],
              personalizedTips: `Focus on understanding the core concepts before moving to advanced topics. Take notes and practice regularly.`,
              thumbnail: String(resource.type || '') === 'video' ? undefined : undefined,
              channelTitle: String(resource.provider || ''),
              viewCount: undefined,
              duration: String(resource.duration || resource.readTime || '')
            })),
            ...(recommendationData.youtubeVideos || []).map((video: Record<string, unknown>) => ({
              title: String(video.title || ''),
              type: 'video' as const,
              url: String(video.url || ''),
              difficulty: String(video.difficulty || ''),
              relevanceScore: Number(video.relevanceScore) || 0.8,
              estimatedTime: parseInt(String(video.duration || '0')) || 30,
              aiReasoning: String(video.aiReasoning || `This video tutorial will help you understand ${String(video.title || '')} and improve your ${quizResult.category} skills.`),
              learningOutcomes: [
                `Learn from visual explanations`,
                `Understand practical applications`,
                `Reinforce key concepts`
              ],
              personalizedTips: `Watch actively, take notes, and pause to practice concepts.`,
              thumbnail: String(video.thumbnail || ''),
              channelTitle: String(video.channelTitle || ''),
              viewCount: Number(video.viewCount) || undefined,
              duration: String(video.duration || '')
            }))
          ],
          geminiInsights: recommendationData.aiRecommendations?.geminiInsights
        },
        collaborativeInsights: {
          similarLearners: recommendationData.collaborativeInsights?.similarLearners || [],
          communityTrends: {
            trendingTopics: recommendationData.collaborativeInsights?.communityTrends?.trendingTopics || [],
            popularResources: recommendationData.collaborativeInsights?.communityTrends?.popularResources || [],
            emergingSkills: recommendationData.collaborativeInsights?.communityTrends?.emergingSkills || [],
            successPatterns: recommendationData.collaborativeInsights?.communityTrends?.successPatterns || []
          }
        },
        aiModels: {
          learningStyleClassifier: {
            model: 'ML-Classifier-v1',
            confidence: 0.85,
            features: ['response_time', 'accuracy', 'learning_patterns']
          },
          performancePredictor: {
            model: 'ML-Predictor-v1',
            accuracy: 0.78,
            features: ['historical_performance', 'study_patterns', 'quiz_results']
          },
          recommendationEngine: {
            model: 'ML-Recommender-v1',
            precision: 0.82,
            recall: 0.79
          }
        },
        metadata: {
          generatedAt: recommendationData.metadata?.generatedAt || new Date().toISOString(),
          processingTime: recommendationData.metadata?.processingTime || 0,
          dataPoints: userHistory.length,
          confidence: recommendationData.metadata?.confidence || 0.75,
          version: recommendationData.metadata?.version || '1.0.0'
        }
      };
      
      setRecommendations(transformedData);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch advanced AI recommendations');
    } finally {
      setLoading(false);
    }
  }, [userId, quizResult, questions, userHistory, learnerType]);

  useEffect(() => {
    fetchAdvancedAIRecommendations();
  }, [fetchAdvancedAIRecommendations]);

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'text-red-600 bg-red-50 border-red-200 dark:bg-red-950/20 dark:text-red-400 dark:border-red-800';
      case 'medium': return 'text-yellow-600 bg-yellow-50 border-yellow-200 dark:bg-yellow-950/20 dark:text-yellow-400 dark:border-yellow-800';
      case 'low': return 'text-green-600 bg-green-50 border-green-200 dark:bg-green-950/20 dark:text-green-400 dark:border-green-800';
      default: return 'text-gray-600 bg-gray-50 border-gray-200 dark:bg-gray-950/20 dark:text-gray-400 dark:border-gray-800';
    }
  };

  const getLearningStyleIcon = (style: string) => {
    switch (style) {
      case 'visual': return <Eye className="h-4 w-4" />;
      case 'auditory': return <Play className="h-4 w-4" />;
      case 'kinesthetic': return <Activity className="h-4 w-4" />;
      case 'reading': return <BookMarked className="h-4 w-4" />;
      default: return <Brain className="h-4 w-4" />;
    }
  };

  const getResourceIcon = (type: string) => {
    switch (type) {
      case 'video': return <Play className="h-4 w-4" />;
      case 'article': return <BookMarked className="h-4 w-4" />;
      case 'course': return <BookMarked className="h-4 w-4" />;
      case 'practice': return <Target className="h-4 w-4" />;
      case 'book': return <BookMarked className="h-4 w-4" />;
      case 'interactive': return <Zap className="h-4 w-4" />;
      default: return <BookMarked className="h-4 w-4" />;
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4" />
          <p className="text-lg font-medium">Advanced AI Analysis in Progress</p>
          <p className="text-sm text-muted-foreground">Analyzing learning patterns and generating insights...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <Alert variant="destructive">
        <AlertCircle className="h-4 w-4" />
        <AlertDescription>{error}</AlertDescription>
      </Alert>
    );
  }

  if (!recommendations) {
    return (
      <Alert>
        <AlertCircle className="h-4 w-4" />
        <AlertDescription>No advanced AI recommendations available</AlertDescription>
      </Alert>
    );
  }

  // Safety check for required nested properties
  if (!recommendations.aiAnalysis?.learningPattern?.confidence) {
    return (
      <Alert>
        <AlertCircle className="h-4 w-4" />
        <AlertDescription>Incomplete AI analysis data. Please try again.</AlertDescription>
      </Alert>
    );
  }

  return (
    <div className="space-y-6">
      {/* Enhanced Header */}
      <div className="flex items-center justify-between bg-gradient-to-r from-purple-50 to-pink-50 dark:from-purple-950/20 dark:to-pink-950/20 p-6 rounded-lg border-2 border-purple-100 dark:border-purple-900/30">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100">Advanced AI Analysis</h2>
                     <p className="text-muted-foreground mt-1">
             ML-Powered Insights • Confidence: {((recommendations.metadata?.confidence || 0.75) * 100).toFixed(1)}% • 
             Processing Time: {recommendations.metadata?.processingTime || 0}ms
           </p>
         </div>
         <div className="flex items-center gap-3">
           <div className="text-right">
             <div className="text-2xl font-bold text-purple-600">
               {(recommendations.predictions?.nextQuizPerformance?.expectedScore || 75).toFixed(0)}%
             </div>
             <div className="text-xs text-muted-foreground">Predicted Score</div>
           </div>
           <Badge variant="outline" className="border-purple-200 text-purple-700 dark:border-purple-800 dark:text-purple-300">
             <Sparkles className="h-4 w-4 mr-1" />
             AI v{recommendations.metadata?.version || '1.0.0'}
           </Badge>
         </div>
      </div>

      {/* Main Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-5 bg-gray-100 dark:bg-gray-800 p-1 rounded-lg">
          <TabsTrigger value="ai-analysis" className="flex items-center gap-2 data-[state=active]:bg-white dark:data-[state=active]:bg-gray-700">
            <Brain className="h-4 w-4" />
            AI Analysis
          </TabsTrigger>
          <TabsTrigger value="predictions" className="flex items-center gap-2 data-[state=active]:bg-white dark:data-[state=active]:bg-gray-700">
            <TrendingUp className="h-4 w-4" />
            Predictions
          </TabsTrigger>
          <TabsTrigger value="recommendations" className="flex items-center gap-2 data-[state=active]:bg-white dark:data-[state=active]:bg-gray-700">
            <Target className="h-4 w-4" />
            Actions
          </TabsTrigger>
          <TabsTrigger value="collaborative" className="flex items-center gap-2 data-[state=active]:bg-white dark:data-[state=active]:bg-gray-700">
            <Users className="h-4 w-4" />
            Community
          </TabsTrigger>
          <TabsTrigger value="gemini-insights" className="flex items-center gap-2 data-[state=active]:bg-white dark:data-[state=active]:bg-gray-700">
            <Sparkles className="h-4 w-4" />
            AI Insights
          </TabsTrigger>
        </TabsList>

        {/* AI Analysis Tab */}
        <TabsContent value="ai-analysis" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Learning Pattern */}
            <Card className="border-2 border-blue-100 dark:border-blue-900/30">
              <CardHeader className="bg-gradient-to-r from-blue-50 to-blue-100 dark:from-blue-950/20 dark:to-blue-900/20">
                <CardTitle className="flex items-center gap-2 text-blue-700 dark:text-blue-300">
                  <Brain className="h-5 w-5" />
                  Learning Pattern
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-6">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="font-medium">Primary Style:</span>
                                         <Badge variant="outline" className="flex items-center gap-1 bg-blue-50 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300">
                       {getLearningStyleIcon(recommendations.aiAnalysis?.learningPattern?.primaryStyle || 'mixed')}
                       <span className="capitalize">{recommendations.aiAnalysis?.learningPattern?.primaryStyle || 'mixed'}</span>
                     </Badge>
                   </div>
                   <div className="flex items-center justify-between">
                     <span className="font-medium">Confidence:</span>
                     <div className="flex items-center gap-2">
                       <Progress value={(recommendations.aiAnalysis?.learningPattern?.confidence || 0.75) * 100} className="w-20 h-2" />
                       <span className="text-sm font-medium">{((recommendations.aiAnalysis?.learningPattern?.confidence || 0.75) * 100).toFixed(1)}%</span>
                     </div>
                   </div>
                </div>
              </CardContent>
            </Card>

            {/* Cognitive Profile */}
            <Card className="border-2 border-purple-100 dark:border-purple-900/30">
              <CardHeader className="bg-gradient-to-r from-purple-50 to-purple-100 dark:from-purple-950/20 dark:to-purple-900/20">
                <CardTitle className="flex items-center gap-2 text-purple-700 dark:text-purple-300">
                  <Cpu className="h-5 w-5" />
                  Cognitive Profile
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-6">
                <div className="space-y-4">
                                     <div className="flex items-center justify-between">
                     <span className="font-medium">Attention Span:</span>
                     <span className="text-sm font-bold text-purple-600">{recommendations.aiAnalysis?.cognitiveProfile?.attentionSpan || 25} min</span>
                   </div>
                   <div className="flex items-center justify-between">
                     <span className="font-medium">Cognitive Load:</span>
                     <Badge variant="outline" className={`capitalize ${
                       (recommendations.aiAnalysis?.cognitiveProfile?.cognitiveLoad || 'medium') === 'high' ? 'text-red-600 bg-red-50 border-red-200' :
                       (recommendations.aiAnalysis?.cognitiveProfile?.cognitiveLoad || 'medium') === 'medium' ? 'text-yellow-600 bg-yellow-50 border-yellow-200' :
                       'text-green-600 bg-green-50 border-green-200'
                     }`}>
                       {recommendations.aiAnalysis?.cognitiveProfile?.cognitiveLoad || 'medium'}
                     </Badge>
                   </div>
                   <div className="flex items-center justify-between">
                     <span className="font-medium">Memory Retention:</span>
                     <div className="flex items-center gap-2">
                       <Progress value={(recommendations.aiAnalysis?.cognitiveProfile?.memoryRetention || 0.8) * 100} className="w-20 h-2" />
                       <span className="text-sm font-medium">{((recommendations.aiAnalysis?.cognitiveProfile?.memoryRetention || 0.8) * 100).toFixed(1)}%</span>
                     </div>
                   </div>
                </div>
              </CardContent>
            </Card>

            {/* Behavioral Patterns */}
            <Card className="border-2 border-pink-100 dark:border-pink-900/30">
              <CardHeader className="bg-gradient-to-r from-pink-50 to-pink-100 dark:from-pink-950/20 dark:to-pink-900/20">
                <CardTitle className="flex items-center gap-2 text-pink-700 dark:text-pink-300">
                  <Activity className="h-5 w-5" />
                  Behavioral Patterns
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-6">
                <div className="space-y-4">
                                     <div className="flex items-center justify-between">
                     <span className="font-medium">Study Time:</span>
                     <Badge variant="outline" className="capitalize bg-pink-50 text-pink-700 dark:bg-pink-900/30 dark:text-pink-300">
                       {recommendations.aiAnalysis?.behavioralPatterns?.studyTimePreference || 'afternoon'}
                     </Badge>
                   </div>
                   <div className="flex items-center justify-between">
                     <span className="font-medium">Completion Rate:</span>
                     <div className="flex items-center gap-2">
                       <Progress value={(recommendations.aiAnalysis?.behavioralPatterns?.completionRate || 0.85) * 100} className="w-20 h-2" />
                       <span className="text-sm font-medium">{((recommendations.aiAnalysis?.behavioralPatterns?.completionRate || 0.85) * 100).toFixed(1)}%</span>
                     </div>
                   </div>
                   <div className="flex items-center justify-between">
                     <span className="font-medium">Motivation:</span>
                     <Badge variant="outline" className={`capitalize ${
                       (recommendations.aiAnalysis?.behavioralPatterns?.motivationLevel || 'medium') === 'high' ? 'text-green-600 bg-green-50 border-green-200' :
                       (recommendations.aiAnalysis?.behavioralPatterns?.motivationLevel || 'medium') === 'medium' ? 'text-yellow-600 bg-yellow-50 border-yellow-200' :
                       'text-red-600 bg-red-50 border-red-200'
                     }`}>
                       {recommendations.aiAnalysis?.behavioralPatterns?.motivationLevel || 'medium'}
                     </Badge>
                   </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Predictions Tab */}
        <TabsContent value="predictions" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Next Quiz Performance */}
            <Card className="border-2 border-green-100 dark:border-green-900/30">
              <CardHeader className="bg-gradient-to-r from-green-50 to-green-100 dark:from-green-950/20 dark:to-green-900/20">
                <CardTitle className="flex items-center gap-2 text-green-700 dark:text-green-300">
                  <TrendingUp className="h-5 w-5" />
                  Performance Prediction
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-6">
                <div className="space-y-4">
                                     <div className="text-center">
                     <div className="text-3xl font-bold text-green-600">
                       {(recommendations.predictions?.nextQuizPerformance?.expectedScore || 75).toFixed(0)}%
                     </div>
                     <div className="text-sm text-muted-foreground">Expected Score</div>
                   </div>
                   <div className="flex items-center justify-between">
                     <span className="font-medium">Confidence:</span>
                     <div className="flex items-center gap-2">
                       <Progress value={(recommendations.predictions?.nextQuizPerformance?.confidence || 0.7) * 100} className="w-20 h-2" />
                       <span className="text-sm font-medium">{((recommendations.predictions?.nextQuizPerformance?.confidence || 0.7) * 100).toFixed(1)}%</span>
                     </div>
                   </div>
                   <div>
                     <h4 className="font-medium mb-2">Key Factors:</h4>
                     <div className="space-y-1">
                       {(recommendations.predictions?.nextQuizPerformance?.keyFactors || []).map((factor, index) => (
                         <div key={index} className="flex items-center gap-2 text-sm">
                           <CheckCircle className="h-3 w-3 text-green-600" />
                           <span>{factor}</span>
                         </div>
                       ))}
                     </div>
                   </div>
                </div>
              </CardContent>
            </Card>

            {/* Mastery Timeline */}
            <Card className="border-2 border-blue-100 dark:border-blue-900/30">
              <CardHeader className="bg-gradient-to-r from-blue-50 to-blue-100 dark:from-blue-950/20 dark:to-blue-900/20">
                <CardTitle className="flex items-center gap-2 text-blue-700 dark:text-blue-300">
                  <Calendar className="h-5 w-5" />
                  Mastery Timeline
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-6">
                <div className="space-y-4">
                                     <div className="text-center">
                     <div className="text-3xl font-bold text-blue-600">
                       {recommendations.predictions?.masteryTimeline?.estimatedDays || 30}
                     </div>
                     <div className="text-sm text-muted-foreground">Days to Mastery</div>
                   </div>
                   <div className="space-y-3">
                     {(recommendations.predictions?.masteryTimeline?.milestones || []).map((milestone, index) => (
                       <div key={index} className="border rounded-lg p-3">
                         <div className="flex items-center justify-between mb-2">
                           <h4 className="font-medium">Day {milestone.day}</h4>
                           <Badge variant="outline" className="text-xs">
                             {(milestone.confidence * 100).toFixed(0)}%
                           </Badge>
                         </div>
                         <p className="text-sm text-muted-foreground">{milestone.milestone}</p>
                       </div>
                     ))}
                   </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Recommendations Tab */}
        <TabsContent value="recommendations" className="space-y-6">
          {/* Immediate Actions */}
          <Card className="border-2 border-orange-100 dark:border-orange-900/30">
            <CardHeader className="bg-gradient-to-r from-orange-50 to-orange-100 dark:from-orange-950/20 dark:to-orange-900/20">
              <CardTitle className="flex items-center gap-2 text-orange-700 dark:text-orange-300">
                <Zap className="h-5 w-5" />
                Immediate Actions
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-6">
                             <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                 {(recommendations.recommendations?.immediateActions || []).map((action, index) => (
                  <div key={index} className={`border-2 rounded-lg p-4 ${getPriorityColor(action.priority)}`}>
                    <div className="flex items-start justify-between mb-2">
                      <h4 className="font-medium">{action.action}</h4>
                      <Badge variant="outline" className="capitalize">
                        {action.priority}
                      </Badge>
                    </div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm">Impact:</span>
                      <div className="flex items-center gap-2">
                        <Progress value={action.impact * 100} className="w-16 h-2" />
                        <span className="text-sm font-medium">{(action.impact * 100).toFixed(0)}%</span>
                      </div>
                    </div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm">Time Required:</span>
                      <span className="text-sm font-medium">{action.timeRequired} min</span>
                    </div>
                    <p className="text-sm text-muted-foreground">{action.reasoning}</p>
                    {action.geminiReasoning && (
                      <div className="mt-2 p-2 bg-purple-50 dark:bg-purple-950/20 rounded border-l-2 border-purple-200 dark:border-purple-800">
                        <p className="text-xs text-purple-700 dark:text-purple-300 font-medium mb-1">
                          🤖 AI Analysis:
                        </p>
                        <p className="text-xs text-purple-600 dark:text-purple-400">
                          {action.geminiReasoning}
                        </p>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Personalized Resources */}
          <Card className="border-2 border-indigo-100 dark:border-indigo-900/30">
            <CardHeader className="bg-gradient-to-r from-indigo-50 to-indigo-100 dark:from-indigo-950/20 dark:to-indigo-900/20">
              <CardTitle className="flex items-center gap-2 text-indigo-700 dark:text-indigo-300">
                <BookMarked className="h-5 w-5" />
                AI-Recommended Resources
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-6">
              <div className="space-y-4">
                {recommendations.recommendations?.personalizedResources && recommendations.recommendations.personalizedResources.length > 0 ? (
                  recommendations.recommendations.personalizedResources.map((resource, index) => (
                  <div key={index} className="border-2 border-indigo-100 dark:border-indigo-800 rounded-lg p-4 hover:border-indigo-200 dark:hover:border-indigo-700 transition-all duration-200 group">
                    <div className="flex items-start justify-between">
                      <div className="flex items-start gap-4">
                        {/* Enhanced thumbnail for YouTube videos */}
                        {resource.type === 'video' && resource.url?.includes('youtube.com') && resource.thumbnail ? (
                          <div className="flex-shrink-0 w-24 h-16 rounded-lg overflow-hidden border border-gray-200 dark:border-gray-700 relative">
                            <Image 
                              src={resource.thumbnail} 
                              alt={resource.title}
                              width={96}
                              height={64}
                              className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                            />
                            <div className="absolute inset-0 bg-black bg-opacity-20 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                              <Play className="h-6 w-6 text-white" />
                            </div>
                          </div>
                        ) : (
                          <div className="flex-shrink-0 w-12 h-12 bg-gradient-to-br from-indigo-100 to-indigo-200 dark:from-indigo-900/30 dark:to-indigo-800/30 rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform">
                            {getResourceIcon(resource.type)}
                          </div>
                        )}
                        <div className="flex-1">
                          <h4 className="font-semibold text-gray-900 dark:text-gray-100 group-hover:text-indigo-700 dark:group-hover:text-indigo-300 transition-colors">
                            {resource.title}
                          </h4>
                          
                          {/* YouTube-specific metadata */}
                          {resource.type === 'video' && resource.url?.includes('youtube.com') && (
                            <div className="flex items-center gap-2 mt-1 text-sm text-muted-foreground">
                              {resource.channelTitle && (
                                <span className="flex items-center gap-1">
                                  <Users className="h-3 w-3" />
                                  {resource.channelTitle}
                                </span>
                              )}
                              {resource.viewCount && (
                                <span className="flex items-center gap-1">
                                  <Eye className="h-3 w-3" />
                                  {resource.viewCount > 1000000 
                                    ? `${(resource.viewCount / 1000000).toFixed(1)}M views`
                                    : resource.viewCount > 1000 
                                    ? `${(resource.viewCount / 1000).toFixed(1)}K views`
                                    : `${resource.viewCount} views`
                                  }
                                </span>
                              )}
                              {resource.duration && (
                                <span className="flex items-center gap-1">
                                  <Clock className="h-3 w-3" />
                                  {resource.duration}
                                </span>
                              )}
                            </div>
                          )}
                          
                          <p className="text-sm text-muted-foreground mt-2 leading-relaxed">
                            {resource.aiReasoning}
                          </p>
                          
                          {/* Learning outcomes */}
                          {resource.learningOutcomes && resource.learningOutcomes.length > 0 && (
                            <div className="mt-3 space-y-1">
                              <p className="text-xs font-medium text-indigo-600 dark:text-indigo-400">
                                🎯 Learning Outcomes:
                              </p>
                              <div className="space-y-1">
                                {resource.learningOutcomes.slice(0, 2).map((outcome, idx) => (
                                  <div key={idx} className="flex items-center gap-2 text-xs text-muted-foreground">
                                    <CheckCircle className="h-2 w-2 text-green-600" />
                                    <span>{outcome}</span>
                                  </div>
                                ))}
                              </div>
                            </div>
                          )}
                          
                          {resource.personalizedTips && (
                            <div className="mt-3 p-2 bg-indigo-50 dark:bg-indigo-950/20 rounded border-l-2 border-indigo-200 dark:border-indigo-800">
                              <p className="text-xs text-indigo-700 dark:text-indigo-300 font-medium mb-1">
                                💡 AI Tips:
                              </p>
                              <p className="text-xs text-indigo-600 dark:text-indigo-400">
                                {resource.personalizedTips}
                              </p>
                            </div>
                          )}
                          
                          <div className="flex items-center gap-3 mt-3 flex-wrap">
                            <Badge variant="outline" className="bg-indigo-50 text-indigo-700 dark:bg-indigo-900/30 dark:text-indigo-300">
                              {resource.type}
                            </Badge>
                            <Badge variant="outline" className="bg-blue-50 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300">
                              {resource.difficulty}
                            </Badge>
                            <div className="flex items-center gap-1 text-sm text-muted-foreground">
                              <Clock className="h-3 w-3" />
                              <span>{resource.estimatedTime} min</span>
                            </div>
                            <div className="flex items-center gap-1 text-sm text-muted-foreground">
                              <Star className="h-3 w-3" />
                              <span>{(resource.relevanceScore * 100).toFixed(0)}% relevant</span>
                            </div>
                            {/* YouTube badge for YouTube videos */}
                            {resource.type === 'video' && resource.url?.includes('youtube.com') && (
                              <Badge variant="outline" className="bg-red-50 text-red-700 dark:bg-red-900/30 dark:text-red-300">
                                <Play className="h-3 w-3 mr-1" />
                                YouTube
                              </Badge>
                            )}
                          </div>
                        </div>
                      </div>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => onResourceClick?.(resource)}
                        className="border-indigo-200 text-indigo-700 hover:bg-indigo-100 dark:border-indigo-800 dark:text-indigo-300 dark:hover:bg-indigo-900/30 transition-colors"
                      >
                        <ExternalLink className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                ))
                ) : (
                  <div className="text-center py-8">
                    <BookOpen className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-2">
                      No Resources Available
                    </h3>
                    <p className="text-gray-500 dark:text-gray-400">
                      We&apos;re working on finding the best learning resources for you. Please try again later.
                    </p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Collaborative Tab */}
        <TabsContent value="collaborative" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Similar Learners */}
            <Card className="border-2 border-teal-100 dark:border-teal-900/30">
              <CardHeader className="bg-gradient-to-r from-teal-50 to-teal-100 dark:from-teal-950/20 dark:to-teal-900/20">
                <CardTitle className="flex items-center gap-2 text-teal-700 dark:text-teal-300">
                  <Users className="h-5 w-5" />
                  Similar Learners
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-6">
                                 <div className="space-y-4">
                   {(recommendations.collaborativeInsights?.similarLearners || []).map((learner, index) => (
                    <div key={index} className="border rounded-lg p-4">
                      <div className="flex items-center justify-between mb-3">
                        <h4 className="font-medium">Learner {index + 1}</h4>
                        <Badge variant="outline" className="bg-teal-50 text-teal-700 dark:bg-teal-900/30 dark:text-teal-300">
                          {(learner.similarityScore * 100).toFixed(0)}% similar
                        </Badge>
                      </div>
                      <div className="space-y-2">
                        <div>
                          <h5 className="text-sm font-medium text-teal-600">Successful Strategies:</h5>
                          <div className="space-y-1">
                            {learner.successfulStrategies.map((strategy, idx) => (
                              <div key={idx} className="flex items-center gap-2 text-sm">
                                <CheckCircle className="h-3 w-3 text-teal-600" />
                                <span>{strategy}</span>
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Community Trends */}
            <Card className="border-2 border-cyan-100 dark:border-cyan-900/30">
              <CardHeader className="bg-gradient-to-r from-cyan-50 to-cyan-100 dark:from-cyan-950/20 dark:to-cyan-900/20">
                <CardTitle className="flex items-center gap-2 text-cyan-700 dark:text-cyan-300">
                  <TrendingUp className="h-5 w-5" />
                  Community Trends
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-6">
                <div className="space-y-4">
                  <div>
                    <h4 className="font-medium mb-2 text-cyan-600">Trending Topics:</h4>
                                         <div className="flex flex-wrap gap-2">
                       {(recommendations.collaborativeInsights?.communityTrends?.trendingTopics || []).map((topic, index) => (
                        <Badge key={index} variant="outline" className="bg-cyan-50 text-cyan-700 dark:bg-cyan-900/30 dark:text-cyan-300">
                          {topic}
                        </Badge>
                      ))}
                    </div>
                  </div>
                  <div>
                    <h4 className="font-medium mb-2 text-cyan-600">Success Patterns:</h4>
                                         <div className="space-y-1">
                       {(recommendations.collaborativeInsights?.communityTrends?.successPatterns || []).map((pattern, index) => (
                        <div key={index} className="flex items-center gap-2 text-sm">
                          <Trophy className="h-3 w-3 text-cyan-600" />
                          <span>{pattern}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

                 {/* Gemini Insights Tab */}
         <TabsContent value="gemini-insights" className="space-y-6">
           {recommendations.recommendations?.geminiInsights ? (
            <div className="space-y-6">
              {/* Learning Insights */}
              <Card className="border-2 border-purple-100 dark:border-purple-900/30">
                <CardHeader className="bg-gradient-to-r from-purple-50 to-purple-100 dark:from-purple-950/20 dark:to-purple-900/20">
                  <CardTitle className="flex items-center gap-2 text-purple-700 dark:text-purple-300">
                    <Sparkles className="h-5 w-5" />
                    AI Learning Insights
                  </CardTitle>
                </CardHeader>
                <CardContent className="pt-6">
                                     <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                     {recommendations.recommendations?.geminiInsights?.learningInsights}
                   </p>
                </CardContent>
              </Card>

              {/* Motivational Tips */}
              <Card className="border-2 border-pink-100 dark:border-pink-900/30">
                <CardHeader className="bg-gradient-to-r from-pink-50 to-pink-100 dark:from-pink-950/20 dark:to-pink-900/20">
                  <CardTitle className="flex items-center gap-2 text-pink-700 dark:text-pink-300">
                    <Heart className="h-5 w-5" />
                    Motivational Tips
                  </CardTitle>
                </CardHeader>
                <CardContent className="pt-6">
                  <div className="space-y-3">
                                         {(recommendations.recommendations?.geminiInsights?.motivationalTips || []).map((tip, index) => (
                      <div key={index} className="flex items-start gap-3 p-3 bg-pink-50 dark:bg-pink-950/20 rounded-lg">
                        <Heart className="h-4 w-4 text-pink-600 mt-0.5 flex-shrink-0" />
                        <span className="text-gray-700 dark:text-gray-300">{tip}</span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Study Strategies */}
              <Card className="border-2 border-blue-100 dark:border-blue-900/30">
                <CardHeader className="bg-gradient-to-r from-blue-50 to-blue-100 dark:from-blue-950/20 dark:to-blue-900/20">
                  <CardTitle className="flex items-center gap-2 text-blue-700 dark:text-blue-300">
                    <Target className="h-5 w-5" />
                    Study Strategies
                  </CardTitle>
                </CardHeader>
                <CardContent className="pt-6">
                  <div className="space-y-3">
                                         {(recommendations.recommendations?.geminiInsights?.studyStrategies || []).map((strategy, index) => (
                      <div key={index} className="flex items-start gap-3 p-3 bg-blue-50 dark:bg-blue-950/20 rounded-lg">
                        <Target className="h-4 w-4 text-blue-600 mt-0.5 flex-shrink-0" />
                        <span className="text-gray-700 dark:text-gray-300">{strategy}</span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Encouragement */}
              <Card className="border-2 border-green-100 dark:border-green-900/30">
                <CardHeader className="bg-gradient-to-r from-green-50 to-green-100 dark:from-green-950/20 dark:to-green-900/20">
                  <CardTitle className="flex items-center gap-2 text-green-700 dark:text-green-300">
                    <Award className="h-5 w-5" />
                    Encouragement
                  </CardTitle>
                </CardHeader>
                <CardContent className="pt-6">
                  <div className="text-center">
                                         <p className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-2">
                       {recommendations.recommendations?.geminiInsights?.encouragement}
                     </p>
                     <p className="text-sm text-muted-foreground">
                       {recommendations.recommendations?.geminiInsights?.nextSteps}
                     </p>
                  </div>
                </CardContent>
              </Card>
            </div>
          ) : (
            <Card className="border-2 border-gray-100 dark:border-gray-800">
              <CardContent className="pt-6">
                <div className="text-center py-8">
                  <Sparkles className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-2">
                    AI Insights Loading
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    Advanced AI insights are being generated. This may take a few moments.
                  </p>
                </div>
              </CardContent>
            </Card>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
} 