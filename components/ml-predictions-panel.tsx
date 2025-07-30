'use client'

import React, { useState, useEffect, useCallback } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { Button } from '@/components/ui/button'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { 
  Brain, 
  TrendingUp, 
  BookOpen, 
  Target, 
  AlertTriangle, 
  Lightbulb,
  BarChart3
} from 'lucide-react'
import type { MLModelPredictions } from '@/lib/ml-models'
import type { Question } from '@/lib/types';

interface MLPredictionsPanelProps {
  quizResultId: string
  questions: Question[]
  resources?: string[]
  onPredictionsGenerated?: (predictions: MLModelPredictions) => void
}

export function MLPredictionsPanel({ 
  quizResultId, 
  questions, 
  resources = [],
  onPredictionsGenerated 
}: MLPredictionsPanelProps) {
  const [predictions, setPredictions] = useState<MLModelPredictions | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const generatePredictions = useCallback(async () => {
    setLoading(true)
    setError(null)

    try {
      const response = await fetch('/api/ml-predictions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          quizResultId,
          questions,
          resources
        }),
      })

      if (!response.ok) {
        throw new Error('Failed to generate predictions')
      }

      const data = await response.json()
      setPredictions(data.predictions)
      onPredictionsGenerated?.(data.predictions)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred')
    } finally {
      setLoading(false)
    }
  }, [quizResultId, questions, resources, onPredictionsGenerated])

  useEffect(() => {
    if (quizResultId) {
      generatePredictions()
    }
  }, [quizResultId, generatePredictions])

  if (loading) {
    return (
      <Card className="w-full">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Brain className="h-5 w-5" />
            AI Analysis
          </CardTitle>
          <CardDescription>
            Analyzing your performance patterns...
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          </div>
        </CardContent>
      </Card>
    )
  }

  if (error) {
    return (
      <Alert variant="destructive">
        <AlertTriangle className="h-4 w-4" />
        <AlertDescription>
          {error}
          <Button 
            variant="outline" 
            size="sm" 
            className="ml-2"
            onClick={generatePredictions}
          >
            Retry
          </Button>
        </AlertDescription>
      </Alert>
    )
  }

  if (!predictions) {
    return null
  }

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Brain className="h-5 w-5" />
          AI Analysis
        </CardTitle>
        <CardDescription>
          Personalized insights based on your learning patterns
        </CardDescription>
        <div className="flex items-center gap-2">
          <Badge variant="secondary">
            Confidence: {Math.round((predictions.confidence || 0) * 100)}%
          </Badge>
        </div>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="learning-style" className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="learning-style">Learning Style</TabsTrigger>
            <TabsTrigger value="performance">Performance</TabsTrigger>
            <TabsTrigger value="recommendations">Recommendations</TabsTrigger>
          </TabsList>

          <TabsContent value="learning-style" className="space-y-4">
            {predictions.learningStyle && (
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <BookOpen className="h-4 w-4" />
                    <span className="font-medium">Primary Learning Style</span>
                  </div>
                  <Badge variant="outline" className="capitalize">
                    {predictions.learningStyle.style}
                  </Badge>
                </div>

                <div className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span>Confidence</span>
                    <span>{Math.round(predictions.learningStyle.confidence * 100)}%</span>
                  </div>
                  <Progress value={predictions.learningStyle.confidence * 100} />
                </div>

                <div className="space-y-2">
                  <h4 className="font-medium text-sm">Style Probabilities</h4>
                  <div className="grid grid-cols-2 gap-2">
                    {Object.entries(predictions.learningStyle.probabilities).map(([style, prob]) => (
                      <div key={style} className="flex items-center justify-between text-xs">
                        <span className="capitalize">{style}</span>
                        <span>{Math.round(prob * 100)}%</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="space-y-2">
                  <h4 className="font-medium text-sm">Analysis</h4>
                  <ul className="space-y-1 text-sm text-muted-foreground">
                    {predictions.learningStyle.reasoning.map((reason, index) => (
                      <li key={index} className="flex items-start gap-2">
                        <Lightbulb className="h-3 w-3 mt-0.5 flex-shrink-0" />
                        {reason}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            )}
          </TabsContent>

          <TabsContent value="performance" className="space-y-4">
            {predictions.performance && (
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <Target className="h-4 w-4" />
                      <span className="font-medium">Expected Score</span>
                    </div>
                    <div className="text-2xl font-bold">
                      {Math.round(predictions.performance.expectedScore)}%
                    </div>
                    <div className="text-xs text-muted-foreground">
                      Confidence: {Math.round(predictions.performance.confidence * 100)}%
                    </div>
                  </div>

                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <BarChart3 className="h-4 w-4" />
                      <span className="font-medium">Confidence Interval</span>
                    </div>
                    <div className="text-sm">
                      {Math.round(predictions.performance.confidenceInterval.lower)}% - {Math.round(predictions.performance.confidenceInterval.upper)}%
                    </div>
                  </div>
                </div>

                {predictions.performance.riskFactors.length > 0 && (
                  <div className="space-y-2">
                    <h4 className="font-medium text-sm flex items-center gap-2">
                      <AlertTriangle className="h-4 w-4" />
                      Risk Factors
                    </h4>
                    <ul className="space-y-1 text-sm text-muted-foreground">
                      {predictions.performance.riskFactors.map((factor, index) => (
                        <li key={index} className="flex items-start gap-2">
                          <div className="h-1.5 w-1.5 rounded-full bg-red-500 mt-2 flex-shrink-0" />
                          {factor}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {predictions.performance.improvementSuggestions.length > 0 && (
                  <div className="space-y-2">
                    <h4 className="font-medium text-sm flex items-center gap-2">
                      <Lightbulb className="h-4 w-4" />
                      Improvement Suggestions
                    </h4>
                    <ul className="space-y-1 text-sm text-muted-foreground">
                      {predictions.performance.improvementSuggestions.map((suggestion, index) => (
                        <li key={index} className="flex items-start gap-2">
                          <div className="h-1.5 w-1.5 rounded-full bg-green-500 mt-2 flex-shrink-0" />
                          {suggestion}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            )}
          </TabsContent>

          <TabsContent value="recommendations" className="space-y-4">
            {predictions.recommendations && predictions.recommendations.length > 0 ? (
              <div className="space-y-4">
                <div className="flex items-center gap-2">
                  <TrendingUp className="h-4 w-4" />
                  <span className="font-medium">Top Recommendations</span>
                </div>

                <div className="space-y-3">
                  {predictions.recommendations.slice(0, 5).map((rec) => (
                    <div key={rec.resourceId} className="border rounded-lg p-3 space-y-2">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <Badge variant="outline" className="text-xs">
                            #{rec.rank}
                          </Badge>
                          <span className="font-medium">Resource {rec.resourceId}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="text-sm text-muted-foreground">
                            {Math.round(rec.relevanceScore * 100)}% relevant
                          </span>
                          <Badge variant="secondary" className="text-xs">
                            {Math.round(rec.confidence * 100)}% confidence
                          </Badge>
                        </div>
                      </div>

                      <div className="text-sm text-muted-foreground">
                        <div className="font-medium">Reasoning:</div>
                        <p>{rec.reasoning}</p>
                      </div>

                      <div className="text-sm text-muted-foreground">
                        <div className="font-medium">Expected Outcome:</div>
                        <p>{rec.expectedOutcome}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <div className="text-center py-8 text-muted-foreground">
                <BookOpen className="h-8 w-8 mx-auto mb-2" />
                <p>No recommendations available</p>
                <p className="text-sm">Complete more quizzes to get personalized recommendations</p>
              </div>
            )}
          </TabsContent>
        </Tabs>

        <div className="mt-6 pt-4 border-t">
          <Button 
            variant="outline" 
            size="sm" 
            onClick={generatePredictions}
            disabled={loading}
            className="w-full"
          >
            {loading ? 'Analyzing...' : 'Refresh Analysis'}
          </Button>
        </div>
      </CardContent>
    </Card>
  )
} 