'use client'

import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible'
import { 
  Lightbulb, 
  BookOpen, 
  HelpCircle, 
  ChevronDown, 
  ChevronUp,
  Info,
  Sparkles,
  Target,
  Clock
} from 'lucide-react'
import { cn } from '@/lib/utils'

interface Hint {
  id: string
  type: 'general' | 'specific' | 'explanation' | 'tip'
  content: string
  cost?: number // hint cost in points
  used?: boolean
}

interface QuizHintsSystemProps {
  hints: Hint[]
  onUseHint: (hintId: string) => void
  currentPoints: number
  className?: string
  showExplanations?: boolean
  difficulty?: string
  topic?: string
}

export default function QuizHintsSystem({
  hints,
  onUseHint,
  currentPoints,
  className,
  showExplanations = true,
  difficulty,
  topic
}: QuizHintsSystemProps) {

  const [showAllHints, setShowAllHints] = useState(false)

  const getHintIcon = (type: string) => {
    switch (type) {
      case 'general':
        return <HelpCircle className="h-4 w-4" />
      case 'specific':
        return <Target className="h-4 w-4" />
      case 'explanation':
        return <BookOpen className="h-4 w-4" />
      case 'tip':
        return <Sparkles className="h-4 w-4" />
      default:
        return <Lightbulb className="h-4 w-4" />
    }
  }

  const getHintColor = (type: string) => {
    switch (type) {
      case 'general':
        return 'text-blue-600 bg-blue-50 border-blue-200'
      case 'specific':
        return 'text-purple-600 bg-purple-50 border-purple-200'
      case 'explanation':
        return 'text-green-600 bg-green-50 border-green-200'
      case 'tip':
        return 'text-orange-600 bg-orange-50 border-orange-200'
      default:
        return 'text-gray-600 bg-gray-50 border-gray-200'
    }
  }

  const getHintTypeLabel = (type: string) => {
    switch (type) {
      case 'general':
        return 'General Hint'
      case 'specific':
        return 'Specific Hint'
      case 'explanation':
        return 'Explanation'
      case 'tip':
        return 'Learning Tip'
      default:
        return 'Hint'
    }
  }

  const canUseHint = (hint: Hint) => {
    if (hint.used) return false
    if (hint.cost && hint.cost > currentPoints) return false
    return true
  }

  const availableHints = hints.filter(hint => !hint.used)
  const usedHints = hints.filter(hint => hint.used)

  return (
    <div className={cn("space-y-4", className)}>
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Lightbulb className="h-5 w-5 text-yellow-500" />
          <h3 className="text-lg font-semibold">Hints & Help</h3>
        </div>
        <div className="flex items-center gap-2">
          <Badge variant="outline" className="flex items-center gap-1">
            <Clock className="h-3 w-3" />
            {currentPoints} pts
          </Badge>
          {difficulty && (
            <Badge variant="secondary">{difficulty}</Badge>
          )}
        </div>
      </div>

      {/* Topic Info */}
      {topic && (
        <Card className="bg-muted/30">
          <CardContent className="p-3">
            <div className="flex items-center gap-2">
              <Info className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm text-muted-foreground">
                Topic: <span className="font-medium">{topic}</span>
              </span>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Available Hints */}
      {availableHints.length > 0 && (
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-base flex items-center gap-2">
              Available Hints ({availableHints.length})
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {availableHints.map((hint) => (
              <div
                key={hint.id}
                className={cn(
                  "p-3 rounded-lg border transition-all",
                  getHintColor(hint.type)
                )}
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-start gap-2 flex-1">
                    {getHintIcon(hint.type)}
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-sm font-medium">
                          {getHintTypeLabel(hint.type)}
                        </span>
                        {hint.cost && (
                          <Badge variant="outline" className="text-xs">
                            {hint.cost} pts
                          </Badge>
                        )}
                      </div>
                      <p className="text-sm">{hint.content}</p>
                    </div>
                  </div>
                  <Button
                    size="sm"
                    onClick={() => onUseHint(hint.id)}
                    disabled={!canUseHint(hint)}
                    className="shrink-0"
                  >
                    Use Hint
                  </Button>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      )}

      {/* Used Hints */}
      {usedHints.length > 0 && (
        <Collapsible open={showAllHints} onOpenChange={setShowAllHints}>
          <Card>
            <CardHeader className="pb-3">
              <CollapsibleTrigger asChild>
                <Button variant="ghost" className="p-0 h-auto justify-between">
                  <CardTitle className="text-base flex items-center gap-2">
                    Used Hints ({usedHints.length})
                  </CardTitle>
                  {showAllHints ? (
                    <ChevronUp className="h-4 w-4" />
                  ) : (
                    <ChevronDown className="h-4 w-4" />
                  )}
                </Button>
              </CollapsibleTrigger>
            </CardHeader>
            <CollapsibleContent>
              <CardContent className="space-y-3 pt-0">
                {usedHints.map((hint) => (
                  <div
                    key={hint.id}
                    className={cn(
                      "p-3 rounded-lg border opacity-75",
                      getHintColor(hint.type)
                    )}
                  >
                    <div className="flex items-start gap-2">
                      {getHintIcon(hint.type)}
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="text-sm font-medium">
                            {getHintTypeLabel(hint.type)}
                          </span>
                          <Badge variant="secondary" className="text-xs">
                            Used
                          </Badge>
                        </div>
                        <p className="text-sm">{hint.content}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </CardContent>
            </CollapsibleContent>
          </Card>
        </Collapsible>
      )}

      {/* Learning Tips */}
      {showExplanations && (
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-base flex items-center gap-2">
              <BookOpen className="h-4 w-4" />
              Learning Tips
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <div className="text-sm text-muted-foreground space-y-2">
              <p>💡 Read the question carefully and identify key terms</p>
              <p>🎯 Eliminate obviously wrong answers first</p>
              <p>⏱️ Manage your time - don&apos;t spend too long on one question</p>
              <p>📝 Review your answers if time permits</p>
            </div>
          </CardContent>
        </Card>
      )}

      {/* No Hints Available */}
      {availableHints.length === 0 && usedHints.length === 0 && (
        <Card>
          <CardContent className="p-6 text-center">
            <Lightbulb className="h-8 w-8 text-muted-foreground mx-auto mb-2" />
            <p className="text-sm text-muted-foreground">
              No hints available for this question. Trust your knowledge!
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  )
} 