"use client"

import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'

interface ContinuousLearningStatus {
  isActive: boolean
  lastTrainingDate: Date
  nextTrainingDate: Date
  totalDataPoints: number
  modelPerformance: {
    learningStyleAccuracy: number
    performanceAccuracy: number
    recommendationPrecision: number
    recommendationRecall: number
    overallAccuracy: number
    youtubeVideoRelevance: number
    youtubeVideoEngagement: number
    studyPlanEffectiveness: number
    studyPlanCompletion: number
    accuracyImprovement: number
    lastUpdated: Date
    dataPointsUsed: number
  }
  activeFeatures: {
    youtubeVideos: boolean
    studyPlan: boolean
    autoRetraining: boolean
    aBTesting: boolean
  }
  deploymentStatus: {
    currentVersion: string
    deploymentDate: Date
    rollbackAvailable: boolean
  }
}

export function ContinuousLearningStatus() {
  const [status, setStatus] = useState<ContinuousLearningStatus | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchStatus = async () => {
      try {
        const response = await fetch('/api/continuous-learning', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ action: 'get-status' }),
        })

        if (!response.ok) {
          throw new Error('Failed to fetch status')
        }

        const data = await response.json()
        setStatus(data.status)
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Unknown error')
      } finally {
        setLoading(false)
      }
    }

    fetchStatus()
  }, [])

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Continuous Learning System</CardTitle>
          <CardDescription>Loading system status...</CardDescription>
        </CardHeader>
      </Card>
    )
  }

  if (error) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Continuous Learning System</CardTitle>
          <CardDescription>Error: {error}</CardDescription>
        </CardHeader>
      </Card>
    )
  }

  if (!status) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Continuous Learning System</CardTitle>
          <CardDescription>No status available</CardDescription>
        </CardHeader>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          Continuous Learning System
          <Badge variant={status.isActive ? "default" : "secondary"}>
            {status.isActive ? "Active" : "Inactive"}
          </Badge>
        </CardTitle>
        <CardDescription>
          Version {status.deploymentStatus.currentVersion} • 
          {status.totalDataPoints} data points collected
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <h4 className="font-medium mb-2">Model Performance</h4>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-sm">Overall Accuracy</span>
                <span className="text-sm font-medium">
                  {(status.modelPerformance.overallAccuracy * 100).toFixed(1)}%
                </span>
              </div>
              <Progress value={status.modelPerformance.overallAccuracy * 100} />
            </div>
          </div>
          <div>
            <h4 className="font-medium mb-2">Active Features</h4>
            <div className="space-y-1">
              {Object.entries(status.activeFeatures).map(([feature, active]) => (
                <div key={feature} className="flex items-center gap-2">
                  <Badge variant={active ? "outline" : "secondary"} className="text-xs">
                    {active ? "✓" : "✗"}
                  </Badge>
                  <span className="text-sm capitalize">
                    {feature.replace(/([A-Z])/g, ' $1').trim()}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
        
        <div className="text-xs text-muted-foreground">
          Last training: {new Date(status.lastTrainingDate).toLocaleDateString()} • 
          Next training: {new Date(status.nextTrainingDate).toLocaleDateString()}
        </div>
      </CardContent>
    </Card>
  )
} 