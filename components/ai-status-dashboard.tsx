'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { RefreshCw, CheckCircle, XCircle, AlertTriangle } from 'lucide-react'

interface AIProviderStatus {
  available: boolean
  model: string
  maxTokens: number
  temperature: number
}

interface TestResult {
  success: boolean
  responseTime: number
  error?: string
}

interface AIStatusData {
  currentProvider: string
  availableProviders: string[]
  providerStats: Record<string, AIProviderStatus>
  testResults: Record<string, TestResult>
  timestamp: string
}

export default function AIStatusDashboard() {
  const [status, setStatus] = useState<AIStatusData | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const fetchStatus = async () => {
    setLoading(true)
    setError(null)
    
    try {
      const response = await fetch('/api/ai-status')
      const data = await response.json()
      
      if (data.status === 'success') {
        setStatus(data.data)
      } else {
        setError(data.message || 'Failed to fetch AI status')
      }
    } catch {
      setError('Failed to connect to AI status service')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchStatus()
  }, [])

  const getStatusIcon = (success: boolean) => {
    if (success) return <CheckCircle className="h-4 w-4 text-green-500" />
    return <XCircle className="h-4 w-4 text-red-500" />
  }

  const getStatusColor = (success: boolean) => {
    return success ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
  }

  if (loading) {
    return (
      <Card>
        <CardContent className="flex items-center justify-center p-6">
          <RefreshCw className="h-6 w-6 animate-spin" />
          <span className="ml-2">Loading AI status...</span>
        </CardContent>
      </Card>
    )
  }

  if (error) {
    return (
      <Alert variant="destructive">
        <AlertTriangle className="h-4 w-4" />
        <AlertDescription>{error}</AlertDescription>
      </Alert>
    )
  }

  if (!status) {
    return null
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">AI Service Status</h2>
        <Button onClick={fetchStatus} variant="outline" size="sm">
          <RefreshCw className="h-4 w-4 mr-2" />
          Refresh
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {/* Current Provider */}
        <Card>
          <CardHeader>
            <CardTitle className="text-sm">Current Provider</CardTitle>
          </CardHeader>
          <CardContent>
            <Badge variant="outline" className="text-lg">
              {status.currentProvider}
            </Badge>
          </CardContent>
        </Card>

        {/* Available Providers */}
        <Card>
          <CardHeader>
            <CardTitle className="text-sm">Available Providers</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-2">
              {status.availableProviders.map((provider) => (
                <Badge key={provider} variant="secondary">
                  {provider}
                </Badge>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Last Updated */}
        <Card>
          <CardHeader>
            <CardTitle className="text-sm">Last Updated</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">
              {new Date(status.timestamp).toLocaleString()}
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Provider Status */}
      <Card>
        <CardHeader>
          <CardTitle>Provider Status</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {Object.entries(status.providerStats).map(([provider, stats]) => (
              <div key={provider} className="flex items-center justify-between p-3 border rounded-lg">
                <div className="flex items-center space-x-3">
                  {getStatusIcon(stats.available)}
                  <div>
                    <h3 className="font-medium capitalize">{provider}</h3>
                    <p className="text-sm text-muted-foreground">
                      Model: {stats.model} | Tokens: {stats.maxTokens}
                    </p>
                  </div>
                </div>
                <Badge className={getStatusColor(stats.available)}>
                  {stats.available ? 'Available' : 'Unavailable'}
                </Badge>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Test Results */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Test Results</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {Object.entries(status.testResults).map(([provider, result]) => (
              <div key={provider} className="flex items-center justify-between p-3 border rounded-lg">
                <div className="flex items-center space-x-3">
                  {getStatusIcon(result.success)}
                  <div>
                    <h3 className="font-medium capitalize">{provider}</h3>
                    {result.error && (
                      <p className="text-sm text-red-600">{result.error}</p>
                    )}
                  </div>
                </div>
                <div className="text-right">
                  <Badge className={getStatusColor(result.success)}>
                    {result.success ? 'Success' : 'Failed'}
                  </Badge>
                  {result.success && (
                    <p className="text-sm text-muted-foreground mt-1">
                      {result.responseTime}ms
                    </p>
                  )}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
} 