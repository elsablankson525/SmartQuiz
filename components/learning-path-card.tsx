"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Clock, BookOpen, CheckCircle, Play, Loader2 } from "lucide-react"
import type { LearningPath } from "@/lib/learning-paths"

interface LearningPathCardProps {
  path: LearningPath
  onStart?: (pathId: string) => void
  onContinue?: (pathId: string) => void
  isLoading?: boolean
}

export function LearningPathCard({ path, onStart, onContinue, isLoading = false }: LearningPathCardProps) {
  const completedMilestones = path.milestones.filter((m) => m.isCompleted).length
  const totalMilestones = path.milestones.length

  const handleStartClick = () => {
    if (onStart && !isLoading) {
      onStart(path.id)
    }
  }

  const handleContinueClick = () => {
    if (onContinue && !isLoading) {
      onContinue(path.id)
    }
  }

  return (
    <Card className="learning-card">
      <CardHeader>
        <div className="flex items-start justify-between">
          <div>
            <CardTitle className="text-lg">{path.title}</CardTitle>
            <CardDescription className="mt-1">{path.description}</CardDescription>
          </div>
          <Badge
            variant={
              path.difficulty === "beginner"
                ? "secondary"
                : path.difficulty === "intermediate"
                  ? "default"
                  : "destructive"
            }
          >
            {path.difficulty}
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center gap-4 text-sm text-muted-foreground">
          <div className="flex items-center gap-1">
            <Clock className="h-4 w-4" />
            {path.estimatedDuration}
          </div>
          <div className="flex items-center gap-1">
            <BookOpen className="h-4 w-4" />
            {totalMilestones} milestones
          </div>
          <Badge variant="outline" className="capitalize">
            {path.category.replace("-", " ")}
          </Badge>
        </div>

        {path.progress > 0 && (
          <div className="space-y-2">
            <div className="flex items-center justify-between text-sm">
              <span>Progress</span>
              <span>
                {completedMilestones}/{totalMilestones} completed
              </span>
            </div>
            <Progress value={path.progress} className="h-2" />
          </div>
        )}

        <div className="space-y-2">
          <h4 className="text-sm font-medium">Milestones</h4>
          <div className="space-y-1">
            {path.milestones.slice(0, 3).map((milestone) => (
              <div key={milestone.id} className="flex items-center gap-2 text-sm">
                <CheckCircle
                  className={`h-4 w-4 ${milestone.isCompleted ? "text-green-500" : "text-muted-foreground"}`}
                />
                <span className={milestone.isCompleted ? "line-through text-muted-foreground" : ""}>
                  {milestone.title}
                </span>
              </div>
            ))}
            {path.milestones.length > 3 && (
              <div className="text-xs text-muted-foreground">+{path.milestones.length - 3} more milestones</div>
            )}
          </div>
        </div>

        {path.prerequisites.length > 0 && (
          <div className="space-y-2">
            <h4 className="text-sm font-medium">Prerequisites</h4>
            <div className="flex flex-wrap gap-1">
              {path.prerequisites.map((prereq) => (
                <Badge key={prereq} variant="outline" className="text-xs">
                  {prereq}
                </Badge>
              ))}
            </div>
          </div>
        )}

        <div className="pt-2">
          {path.isActive ? (
            <Button onClick={handleContinueClick} className="w-full" disabled={isLoading}>
              {isLoading ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Loading...
                </>
              ) : (
                "Continue Learning"
              )}
            </Button>
          ) : (
            <Button
              onClick={handleStartClick}
              variant="outline"
              className="w-full gap-2 bg-transparent"
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Starting...
                </>
              ) : (
                <>
                  <Play className="h-4 w-4" />
                  Start Path
                </>
              )}
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
