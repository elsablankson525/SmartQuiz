'use client'

import React, { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { 
  Brain, 
  TrendingUp, 
  BookOpen, 
  Target, 
  AlertTriangle, 
  Settings,
  Play,
  BarChart3,
  Zap
} from 'lucide-react'
import { MLPredictionsPanel } from '@/components/ml-predictions-panel'
import type { QuizResult, Question } from '@/lib/types';
import type { MLModelConfig } from '@/lib/ml-models';

interface ModelMetrics {
  metrics: {
    learningStyle: { accuracy: number };
    performance: { accuracy: number };
    recommendations: { precision: number; recall: number };
  };
  overallAccuracy: number;
  models: MLModelConfig[];
}

interface TrainingStatus {
  results?: Array<{
    model: string;
    version: string;
    accuracy: number;
    lastTrained: string;
  }>;
}

export default function MLDemoPage() {
  const [trainingStatus, setTrainingStatus] = useState<TrainingStatus | null>(null)
  const [modelMetrics, setModelMetrics] = useState<ModelMetrics | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [demoQuizResult, setDemoQuizResult] = useState<QuizResult | null>(null)
  const [demoQuestions, setDemoQuestions] = useState<Question[]>([])

  useEffect(() => {
    fetchModelStatus()
    generateDemoData()
  }, [])

  const fetchModelStatus = async () => {
    try {
      const response = await fetch('/api/ml-train')
      if (response.ok) {
        const data = await response.json()
        setModelMetrics(data)
      }
    } catch (error) {
      console.error('Error fetching model status:', error)
    }
  }

  const generateDemoData = () => {
    // Create demo quiz result
    const demoResult: QuizResult = {
      id: 'demo-quiz-1',
      userId: 'demo-user',
      quizId: 'demo-quiz-1',
      score: 7,
      totalQuestions: 10,
      timeSpent: 450, // 7.5 minutes
      date: new Date(),
      questionsAnswered: [
        { question: 'What is 2+2?', userAnswer: '4', correctAnswer: '4', isCorrect: true, topic: 'Basic Math' },
        { question: 'Solve for x: 3x + 5 = 20', userAnswer: '5', correctAnswer: '5', isCorrect: true, topic: 'Algebra' },
        { question: 'What is the area of a circle?', userAnswer: 'πr²', correctAnswer: 'πr²', isCorrect: true, topic: 'Geometry' },
        { question: 'What is the derivative of x²?', userAnswer: '2x', correctAnswer: '2x', isCorrect: true, topic: 'Calculus' },
        { question: 'What is 15% of 200?', userAnswer: '25', correctAnswer: '30', isCorrect: false, topic: 'Percentages' },
        { question: 'Solve: 2x - 3 = 7', userAnswer: '4', correctAnswer: '5', isCorrect: false, topic: 'Algebra' },
        { question: 'What is the square root of 16?', userAnswer: '4', correctAnswer: '4', isCorrect: true, topic: 'Basic Math' },
        { question: 'What is 8 × 7?', userAnswer: '56', correctAnswer: '56', isCorrect: true, topic: 'Basic Math' },
        { question: 'What is the perimeter of a square?', userAnswer: '4s', correctAnswer: '4s', isCorrect: true, topic: 'Geometry' },
        { question: 'What is 1/2 + 1/3?', userAnswer: '2/5', correctAnswer: '5/6', isCorrect: false, topic: 'Fractions' }
      ]
    }

    const demoQuestions: Question[] = [
      { question: 'What is 2+2?', options: ['3', '4', '5', '6'], correctAnswer: '4', topic: 'Basic Math', difficulty: 'easy' },
      { question: 'Solve for x: 3x + 5 = 20', options: ['3', '4', '5', '6'], correctAnswer: '5', topic: 'Algebra', difficulty: 'medium' },
      { question: 'What is the area of a circle?', options: ['πr', 'πr²', '2πr', '2πr²'], correctAnswer: 'πr²', topic: 'Geometry', difficulty: 'medium' },
      { question: 'What is the derivative of x²?', options: ['x', '2x', 'x²', '2x²'], correctAnswer: '2x', topic: 'Calculus', difficulty: 'hard' },
      { question: 'What is 15% of 200?', options: ['25', '30', '35', '40'], correctAnswer: '30', topic: 'Percentages', difficulty: 'medium' },
      { question: 'Solve: 2x - 3 = 7', options: ['3', '4', '5', '6'], correctAnswer: '5', topic: 'Algebra', difficulty: 'medium' },
      { question: 'What is the square root of 16?', options: ['2', '3', '4', '5'], correctAnswer: '4', topic: 'Basic Math', difficulty: 'easy' },
      { question: 'What is 8 × 7?', options: ['54', '55', '56', '57'], correctAnswer: '56', topic: 'Basic Math', difficulty: 'easy' },
      { question: 'What is the perimeter of a square?', options: ['s', '2s', '3s', '4s'], correctAnswer: '4s', topic: 'Geometry', difficulty: 'easy' },
      { question: 'What is 1/2 + 1/3?', options: ['2/5', '3/6', '5/6', '6/5'], correctAnswer: '5/6', topic: 'Fractions', difficulty: 'medium' }
    ]

    setDemoQuizResult(demoResult)
    setDemoQuestions(demoQuestions)
  }

  const trainModels = async (modelType: string = 'all') => {
    setLoading(true)
    setError(null)

    try {
      const response = await fetch('/api/ml-train', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          modelType,
          dataSize: 1000,
          useRealisticData: true
        }),
      })

      if (!response.ok) {
        throw new Error('Failed to train models')
      }

      const data = await response.json()
      setTrainingStatus(data)
      setModelMetrics(data)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="container mx-auto py-8 space-y-8">
      <div className="text-center space-y-4">
        <h1 className="text-4xl font-bold flex items-center justify-center gap-3">
          <Brain className="h-10 w-10 text-primary" />
          ML Model Demo
        </h1>
        <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
          Explore our machine learning models for learning style classification, performance prediction, and personalized recommendations.
        </p>
      </div>

      <Tabs defaultValue="overview" className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="training">Training</TabsTrigger>
          <TabsTrigger value="predictions">Predictions</TabsTrigger>
          <TabsTrigger value="metrics">Metrics</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BookOpen className="h-5 w-5" />
                  Learning Style Classifier
                </CardTitle>
                <CardDescription>
                  Naive Bayes classifier that identifies learning preferences
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Accuracy</span>
                    <span>{modelMetrics?.metrics?.learningStyle?.accuracy ? Math.round(modelMetrics.metrics.learningStyle.accuracy * 100) : 'N/A'}%</span>
                  </div>
                  <Progress value={modelMetrics?.metrics?.learningStyle?.accuracy ? modelMetrics.metrics.learningStyle.accuracy * 100 : 0} />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Target className="h-5 w-5" />
                  Performance Predictor
                </CardTitle>
                <CardDescription>
                  Linear regression model for score prediction
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Accuracy</span>
                    <span>{modelMetrics?.metrics?.performance?.accuracy ? Math.round(modelMetrics.metrics.performance.accuracy * 100) : 'N/A'}%</span>
                  </div>
                  <Progress value={modelMetrics?.metrics?.performance?.accuracy ? modelMetrics.metrics.performance.accuracy * 100 : 0} />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <TrendingUp className="h-5 w-5" />
                  Recommendation Engine
                </CardTitle>
                <CardDescription>
                  Collaborative filtering for resource recommendations
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Precision</span>
                    <span>{modelMetrics?.metrics?.recommendations?.precision ? Math.round(modelMetrics.metrics.recommendations.precision * 100) : 'N/A'}%</span>
                  </div>
                  <Progress value={modelMetrics?.metrics?.recommendations?.precision ? modelMetrics.metrics.recommendations.precision * 100 : 0} />
                </div>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Zap className="h-5 w-5" />
                Overall System Performance
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="font-medium">Overall Accuracy</span>
                    <Badge variant="outline" className="text-lg">
                      {modelMetrics?.overallAccuracy ? Math.round(modelMetrics.overallAccuracy * 100) : 'N/A'}%
                    </Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="font-medium">Active Models</span>
                    <Badge variant="secondary">
                      {modelMetrics?.models?.length || 0} models
                    </Badge>
                  </div>
                </div>
                <div className="space-y-2">
                  <h4 className="font-medium">Key Features</h4>
                  <ul className="space-y-1 text-sm text-muted-foreground">
                    <li>• Real-time learning style detection</li>
                    <li>• Performance trend analysis</li>
                    <li>• Personalized resource recommendations</li>
                    <li>• Confidence scoring for predictions</li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="training" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Settings className="h-5 w-5" />
                Model Training
              </CardTitle>
              <CardDescription>
                Train the machine learning models with synthetic data
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <Button 
                  onClick={() => trainModels('learning-style')}
                  disabled={loading}
                  className="w-full"
                >
                  {loading ? 'Training...' : 'Train Learning Style'}
                </Button>
                <Button 
                  onClick={() => trainModels('performance')}
                  disabled={loading}
                  className="w-full"
                >
                  {loading ? 'Training...' : 'Train Performance'}
                </Button>
                <Button 
                  onClick={() => trainModels('recommendation')}
                  disabled={loading}
                  className="w-full"
                >
                  {loading ? 'Training...' : 'Train Recommendations'}
                </Button>
                <Button 
                  onClick={() => trainModels('all')}
                  disabled={loading}
                  className="w-full"
                  variant="default"
                >
                  {loading ? 'Training All...' : 'Train All Models'}
                </Button>
              </div>

              {error && (
                <Alert variant="destructive">
                  <AlertTriangle className="h-4 w-4" />
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}

              {trainingStatus && (
                <div className="space-y-4">
                  <h3 className="font-medium">Training Results</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {trainingStatus.results?.map((result, index: number) => (
                      <Card key={index}>
                        <CardContent className="pt-6">
                          <div className="space-y-2">
                            <div className="flex items-center justify-between">
                              <span className="font-medium capitalize">{result.model}</span>
                              <Badge variant="outline">{result.version}</Badge>
                            </div>
                            <div className="flex justify-between text-sm">
                              <span>Accuracy</span>
                              <span>{Math.round(result.accuracy * 100)}%</span>
                            </div>
                            <Progress value={result.accuracy * 100} />
                            <div className="text-xs text-muted-foreground">
                              Trained: {new Date(result.lastTrained).toLocaleString()}
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="predictions" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Play className="h-5 w-5" />
                Live Predictions Demo
              </CardTitle>
              <CardDescription>
                See the ML models in action with a sample quiz result
              </CardDescription>
            </CardHeader>
            <CardContent>
              {demoQuizResult && demoQuestions.length > 0 ? (
                <MLPredictionsPanel
                  quizResultId={demoQuizResult.id}
                  questions={demoQuestions}
                  onPredictionsGenerated={(predictions) => {
                    console.log('Generated predictions:', predictions)
                  }}
                />
              ) : (
                <div className="text-center py-8 text-muted-foreground">
                  <Brain className="h-8 w-8 mx-auto mb-2" />
                  <p>Loading demo data...</p>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="metrics" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BarChart3 className="h-5 w-5" />
                Model Metrics & Analytics
              </CardTitle>
              <CardDescription>
                Detailed performance metrics for each model
              </CardDescription>
            </CardHeader>
            <CardContent>
              {modelMetrics ? (
                <div className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="space-y-4">
                      <h3 className="font-medium">Learning Style Classifier</h3>
                      <div className="space-y-2">
                        <div className="flex justify-between text-sm">
                          <span>Accuracy</span>
                          <span>{Math.round(modelMetrics.metrics.learningStyle.accuracy * 100)}%</span>
                        </div>
                        <Progress value={modelMetrics.metrics.learningStyle.accuracy * 100} />
                      </div>
                    </div>

                    <div className="space-y-4">
                      <h3 className="font-medium">Performance Predictor</h3>
                      <div className="space-y-2">
                        <div className="flex justify-between text-sm">
                          <span>Accuracy</span>
                          <span>{Math.round(modelMetrics.metrics.performance.accuracy * 100)}%</span>
                        </div>
                        <Progress value={modelMetrics.metrics.performance.accuracy * 100} />
                      </div>
                    </div>

                    <div className="space-y-4">
                      <h3 className="font-medium">Recommendation Engine</h3>
                      <div className="space-y-2">
                        <div className="flex justify-between text-sm">
                          <span>Precision</span>
                          <span>{Math.round(modelMetrics.metrics.recommendations.precision * 100)}%</span>
                        </div>
                        <Progress value={modelMetrics.metrics.recommendations.precision * 100} />
                        <div className="flex justify-between text-sm">
                          <span>Recall</span>
                          <span>{Math.round(modelMetrics.metrics.recommendations.recall * 100)}%</span>
                        </div>
                        <Progress value={modelMetrics.metrics.recommendations.recall * 100} />
                      </div>
                    </div>
                  </div>

                  <div className="border-t pt-6">
                    <h3 className="font-medium mb-4">Model Details</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                      {modelMetrics.models?.map((model: MLModelConfig, index: number) => (
                        <Card key={index}>
                          <CardContent className="pt-6">
                            <div className="space-y-2">
                              <div className="flex items-center justify-between">
                                <span className="font-medium capitalize">{model.modelType}</span>
                                <Badge variant={model.isActive ? "default" : "secondary"}>
                                  {model.isActive ? "Active" : "Inactive"}
                                </Badge>
                              </div>
                              <div className="text-sm text-muted-foreground">
                                Version: {model.version}
                              </div>
                              <div className="text-sm text-muted-foreground">
                                Last trained: {new Date(model.lastTrained).toLocaleDateString()}
                              </div>
                              <div className="flex justify-between text-sm">
                                <span>Accuracy</span>
                                <span>{Math.round(model.accuracy * 100)}%</span>
                              </div>
                              <Progress value={model.accuracy * 100} />
                            </div>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  </div>
                </div>
              ) : (
                <div className="text-center py-8 text-muted-foreground">
                  <BarChart3 className="h-8 w-8 mx-auto mb-2" />
                  <p>No metrics available. Train the models first.</p>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
} 