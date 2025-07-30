"use client"

import React from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { AlertTriangle, RefreshCw, Wifi, WifiOff } from 'lucide-react'

interface ErrorBoundaryState {
  hasError: boolean
  error?: Error
  isChunkError: boolean
}

interface ErrorBoundaryProps {
  children: React.ReactNode
  fallback?: React.ComponentType<{ error?: Error; resetError: () => void }>
}

class ErrorBoundary extends React.Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props)
    this.state = { hasError: false, isChunkError: false }
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    const isChunkError = error.name === 'ChunkLoadError' || 
                        error.message.includes('ChunkLoadError') ||
                        error.message.includes('Loading chunk') ||
                        error.message.includes('Loading CSS chunk')
    
    return { hasError: true, error, isChunkError }
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('ErrorBoundary caught an error:', error, errorInfo)
    
    // For chunk loading errors, try to reload the page after a short delay
    if (this.state.isChunkError) {
      console.log('Chunk loading error detected, attempting recovery...')
      setTimeout(() => {
        window.location.reload()
      }, 2000)
    }
  }

  resetError = () => {
    this.setState({ hasError: false, error: undefined, isChunkError: false })
  }

  handleRetry = () => {
    if (this.state.isChunkError) {
      // For chunk errors, reload the page
      window.location.reload()
    } else {
      this.resetError()
    }
  }

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        const FallbackComponent = this.props.fallback
        return <FallbackComponent error={this.state.error} resetError={this.resetError} />
      }

      return (
        <div className="min-h-screen flex items-center justify-center p-4 bg-background">
          <Card className="max-w-md w-full">
            <CardHeader className="text-center">
              <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-red-100">
                {this.state.isChunkError ? (
                  <WifiOff className="h-6 w-6 text-red-600" />
                ) : (
                  <AlertTriangle className="h-6 w-6 text-red-600" />
                )}
              </div>
              <CardTitle>
                {this.state.isChunkError ? 'Loading Error' : 'Something went wrong'}
              </CardTitle>
              <CardDescription>
                {this.state.isChunkError 
                  ? 'There was an issue loading the application. Please check your internet connection and try again.'
                  : 'An unexpected error occurred. Please try refreshing the page.'
                }
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {process.env.NODE_ENV === 'development' && this.state.error && (
                <details className="text-sm">
                  <summary className="cursor-pointer text-muted-foreground">
                    Error details (development only)
                  </summary>
                  <pre className="mt-2 text-xs bg-muted p-2 rounded overflow-auto">
                    {this.state.error.message}
                  </pre>
                </details>
              )}
              <div className="flex gap-2">
                <Button onClick={this.handleRetry} className="flex-1">
                  <RefreshCw className="h-4 w-4 mr-2" />
                  {this.state.isChunkError ? 'Retry Loading' : 'Try Again'}
                </Button>
                <Button 
                  variant="outline" 
                  onClick={() => window.location.reload()} 
                  className="flex-1"
                >
                  Refresh Page
                </Button>
              </div>
              {this.state.isChunkError && (
                <div className="text-xs text-muted-foreground text-center">
                  <Wifi className="h-3 w-3 inline mr-1" />
                  Check your internet connection
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      )
    }

    return this.props.children
  }
}

export default ErrorBoundary 