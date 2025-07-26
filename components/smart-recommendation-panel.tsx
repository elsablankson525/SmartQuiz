import React, { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Progress } from '@/components/ui/progress'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { 
  BookOpen, 
  Target, 
  TrendingUp, 
  Clock, 
  Brain, 
  Lightbulb,
  ArrowRight,
  CheckCircle,
  AlertCircle,
  Star,
  Calendar,
  Users,
  Zap,
  BarChart3,
  BookMarked,
  GraduationCap
} from 'lucide-react'

interface SmartRecommendationPanelProps {
  recommendations: any
  onStartQuiz?: (category: string, difficulty: string) => void
  onViewResource?: (resource: any) => void
  onViewLearningPath?: (path: any) => void
  className?: string
}

export function SmartRecommendationPanel({
  recommendations,
  onStartQuiz,
  onViewResource,
  onViewLearningPath,
  className = ""
}: SmartRecommendationPanelProps) {
  const [activeTab, setActiveTab] = useState('overview')

  if (!recommendations) {
    return (
      <Card className={`w-full ${className}`}>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Brain className="h-5 w-5" />
            Smart Recommendations
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">Loading recommendations...</p>
        </CardContent>
      </Card>
    )
  }

  const {
    weakAreas = [],
    strongAreas = [],
    recommendedResources = [],
    nextQuizSuggestion,
    performanceAnalytics,
    personalizedInsights,
    adaptiveRecommendations,
    studyPlan = [],
    pathRecommendations = []
  } = recommendations

  return (
    <Card className={`w-full ${className}`}>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Brain className="h-5 w-5 text-blue-600" />
          Smart Recommendations
        </CardTitle>
        <CardDescription>
          AI-powered insights and personalized learning recommendations
        </CardDescription>
      </CardHeader>
      
      <CardContent>
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="analytics">Analytics</TabsTrigger>
            <TabsTrigger value="resources">Resources</TabsTrigger>
            <TabsTrigger value="study-plan">Study Plan</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-4">
            <OverviewTab 
              weakAreas={weakAreas}
              strongAreas={strongAreas}
              nextQuizSuggestion={nextQuizSuggestion}
              adaptiveRecommendations={adaptiveRecommendations}
              onStartQuiz={onStartQuiz}
            />
          </TabsContent>

          <TabsContent value="analytics" className="space-y-4">
            <AnalyticsTab 
              performanceAnalytics={performanceAnalytics}
              personalizedInsights={personalizedInsights}
            />
          </TabsContent>

          <TabsContent value="resources" className="space-y-4">
            <ResourcesTab 
              recommendedResources={recommendedResources}
              pathRecommendations={pathRecommendations}
              onViewResource={onViewResource}
              onViewLearningPath={onViewLearningPath}
            />
          </TabsContent>

          <TabsContent value="study-plan" className="space-y-4">
            <StudyPlanTab 
              studyPlan={studyPlan}
              personalizedInsights={personalizedInsights}
            />
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  )
}

function OverviewTab({ 
  weakAreas, 
  strongAreas, 
  nextQuizSuggestion, 
  adaptiveRecommendations,
  onStartQuiz 
}: any) {
  return (
    <div className="space-y-6">
      {/* Performance Summary */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <AlertCircle className="h-4 w-4 text-orange-500" />
              Areas to Improve
            </CardTitle>
          </CardHeader>
          <CardContent>
            {weakAreas.length > 0 ? (
              <div className="space-y-2">
                {weakAreas.map((area: string, index: number) => (
                  <Badge key={index} variant="secondary" className="mr-2 mb-2">
                    {area}
                  </Badge>
                ))}
              </div>
            ) : (
              <p className="text-sm text-muted-foreground">No weak areas identified!</p>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <CheckCircle className="h-4 w-4 text-green-500" />
              Strong Areas
            </CardTitle>
          </CardHeader>
          <CardContent>
            {strongAreas.length > 0 ? (
              <div className="space-y-2">
                {strongAreas.map((area: string, index: number) => (
                  <Badge key={index} variant="default" className="mr-2 mb-2">
                    {area}
                  </Badge>
                ))}
              </div>
            ) : (
              <p className="text-sm text-muted-foreground">Keep practicing to build strengths!</p>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Next Quiz Suggestion */}
      {nextQuizSuggestion && (
        <Card>
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <Target className="h-5 w-5 text-blue-600" />
              Recommended Next Quiz
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium">{nextQuizSuggestion.category}</p>
                <p className="text-sm text-muted-foreground">
                  {nextQuizSuggestion.difficulty} level
                </p>
              </div>
              <Badge variant="outline" className="capitalize">
                {nextQuizSuggestion.difficulty}
              </Badge>
            </div>
            
            <p className="text-sm text-muted-foreground">
              {nextQuizSuggestion.reason}
            </p>
            
            {nextQuizSuggestion.confidence && (
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Confidence</span>
                  <span>{Math.round(nextQuizSuggestion.confidence * 100)}%</span>
                </div>
                <Progress value={nextQuizSuggestion.confidence * 100} className="h-2" />
              </div>
            )}

            {onStartQuiz && (
              <Button 
                onClick={() => onStartQuiz(nextQuizSuggestion.category, nextQuizSuggestion.difficulty)}
                className="w-full"
              >
                Start Recommended Quiz
                <ArrowRight className="h-4 w-4 ml-2" />
              </Button>
            )}
          </CardContent>
        </Card>
      )}

      {/* Adaptive Recommendations */}
      {adaptiveRecommendations && (
        <Card>
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <Zap className="h-5 w-5 text-yellow-600" />
              Adaptive Insights
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <p className="text-sm font-medium">Difficulty Adjustment</p>
                <Badge 
                  variant={
                    adaptiveRecommendations.difficultyAdjustment === 'increase' ? 'default' :
                    adaptiveRecommendations.difficultyAdjustment === 'decrease' ? 'destructive' : 'secondary'
                  }
                >
                  {adaptiveRecommendations.difficultyAdjustment}
                </Badge>
              </div>
              
              <div className="space-y-2">
                <p className="text-sm font-medium">Ready for Next Level</p>
                <Badge variant={adaptiveRecommendations.readinessForNextLevel ? 'default' : 'secondary'}>
                  {adaptiveRecommendations.readinessForNextLevel ? 'Yes' : 'Not yet'}
                </Badge>
              </div>
            </div>

            {adaptiveRecommendations.nextTopics && adaptiveRecommendations.nextTopics.length > 0 && (
              <div className="space-y-2">
                <p className="text-sm font-medium">Suggested Next Topics</p>
                <div className="flex flex-wrap gap-2">
                  {adaptiveRecommendations.nextTopics.map((topic: string, index: number) => (
                    <Badge key={index} variant="outline">
                      {topic}
                    </Badge>
                  ))}
                </div>
              </div>
            )}

            {adaptiveRecommendations.skillGaps && adaptiveRecommendations.skillGaps.length > 0 && (
              <div className="space-y-2">
                <p className="text-sm font-medium">Skill Gaps to Address</p>
                <div className="flex flex-wrap gap-2">
                  {adaptiveRecommendations.skillGaps.map((gap: string, index: number) => (
                    <Badge key={index} variant="destructive">
                      {gap}
                    </Badge>
                  ))}
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  )
}

function AnalyticsTab({ performanceAnalytics, personalizedInsights }: any) {
  if (!performanceAnalytics) {
    return (
      <div className="text-center py-8">
        <BarChart3 className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
        <p className="text-muted-foreground">Performance analytics not available</p>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Overall Performance */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <BarChart3 className="h-5 w-5 text-blue-600" />
            Performance Overview
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="text-center">
              <p className="text-2xl font-bold">{performanceAnalytics.overallScore?.toFixed(1)}%</p>
              <p className="text-sm text-muted-foreground">Overall Score</p>
            </div>
            
            <div className="text-center">
              <div className="flex items-center justify-center gap-2">
                <TrendingUp className={`h-4 w-4 ${
                  performanceAnalytics.learningTrend === 'improving' ? 'text-green-500' :
                  performanceAnalytics.learningTrend === 'declining' ? 'text-red-500' : 'text-yellow-500'
                }`} />
                <span className="capitalize">{performanceAnalytics.learningTrend}</span>
              </div>
              <p className="text-sm text-muted-foreground">Learning Trend</p>
            </div>
            
            <div className="text-center">
              <p className="text-2xl font-bold">
                {performanceAnalytics.timeSpentAnalysis?.averageTimePerQuestion?.toFixed(0)}s
              </p>
              <p className="text-sm text-muted-foreground">Avg Time/Question</p>
            </div>
          </div>

          {/* Time Efficiency */}
          {performanceAnalytics.timeSpentAnalysis && (
            <div className="space-y-2">
              <p className="text-sm font-medium">Time Efficiency</p>
              <Badge 
                variant={
                  performanceAnalytics.timeSpentAnalysis.timeEfficiency === 'fast' ? 'default' :
                  performanceAnalytics.timeSpentAnalysis.timeEfficiency === 'slow' ? 'destructive' : 'secondary'
                }
              >
                {performanceAnalytics.timeSpentAnalysis.timeEfficiency}
              </Badge>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Category Performance */}
      {performanceAnalytics.categoryPerformance && Object.keys(performanceAnalytics.categoryPerformance).length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Category Performance</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {Object.entries(performanceAnalytics.categoryPerformance).map(([category, score]: [string, any]) => (
              <div key={category} className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="capitalize">{category}</span>
                  <span>{score.toFixed(1)}%</span>
                </div>
                <Progress value={score} className="h-2" />
              </div>
            ))}
          </CardContent>
        </Card>
      )}

      {/* Personalized Insights */}
      {personalizedInsights && (
        <Card>
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <Lightbulb className="h-5 w-5 text-yellow-600" />
              Personalized Insights
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <p className="text-sm font-medium">Learning Style</p>
                <Badge variant="outline" className="capitalize">
                  {personalizedInsights.learningStyle}
                </Badge>
              </div>
              
              <div className="space-y-2">
                <p className="text-sm font-medium">Suggested Pace</p>
                <Badge variant="outline" className="capitalize">
                  {personalizedInsights.suggestedPace}
                </Badge>
              </div>
            </div>

            <div className="space-y-2">
              <p className="text-sm font-medium">Recommended Study Time</p>
              <div className="flex items-center gap-2">
                <Clock className="h-4 w-4 text-muted-foreground" />
                <span>{personalizedInsights.recommendedStudyTime} hours per week</span>
              </div>
            </div>

            {personalizedInsights.focusAreas && personalizedInsights.focusAreas.length > 0 && (
              <div className="space-y-2">
                <p className="text-sm font-medium">Focus Areas</p>
                <div className="flex flex-wrap gap-2">
                  {personalizedInsights.focusAreas.map((area: string, index: number) => (
                    <Badge key={index} variant="secondary">
                      {area}
                    </Badge>
                  ))}
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  )
}

function ResourcesTab({ 
  recommendedResources, 
  pathRecommendations, 
  onViewResource, 
  onViewLearningPath 
}: any) {
  return (
    <div className="space-y-6">
      {/* Recommended Resources */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <BookOpen className="h-5 w-5 text-blue-600" />
            Recommended Resources
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {recommendedResources.length > 0 ? (
            recommendedResources.map((resource: any, index: number) => (
              <div key={index} className="border rounded-lg p-4 space-y-2">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <h4 className="font-medium">{resource.title}</h4>
                    <p className="text-sm text-muted-foreground">{resource.description}</p>
                  </div>
                  <div className="flex items-center gap-2 ml-4">
                    <Badge variant="outline" className="capitalize">
                      {resource.difficulty}
                    </Badge>
                    <Badge variant="secondary">
                      {resource.type}
                    </Badge>
                  </div>
                </div>
                
                <div className="flex items-center justify-between text-sm text-muted-foreground">
                  <span>{resource.provider}</span>
                  <div className="flex items-center gap-2">
                    {resource.rating > 0 && (
                      <div className="flex items-center gap-1">
                        <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                        <span>{resource.rating.toFixed(1)}</span>
                      </div>
                    )}
                    {resource.duration && <span>{resource.duration}</span>}
                  </div>
                </div>

                {onViewResource && (
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => onViewResource(resource)}
                    className="w-full"
                  >
                    View Resource
                  </Button>
                )}
              </div>
            ))
          ) : (
            <p className="text-center text-muted-foreground py-8">
              No resources available at the moment
            </p>
          )}
        </CardContent>
      </Card>

      {/* Learning Paths */}
      {pathRecommendations.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <GraduationCap className="h-5 w-5 text-green-600" />
              Recommended Learning Paths
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {pathRecommendations.map((pathRec: any, index: number) => (
              <div key={index} className="border rounded-lg p-4 space-y-3">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <h4 className="font-medium">{pathRec.path.title}</h4>
                    <p className="text-sm text-muted-foreground">{pathRec.path.description}</p>
                  </div>
                  <div className="flex items-center gap-2 ml-4">
                    <Badge variant="outline" className="capitalize">
                      {pathRec.path.difficulty}
                    </Badge>
                    <Badge variant="secondary">
                      {pathRec.matchScore}% match
                    </Badge>
                  </div>
                </div>
                
                <div className="flex items-center justify-between text-sm text-muted-foreground">
                  <div className="flex items-center gap-4">
                    <span className="flex items-center gap-1">
                      <Users className="h-3 w-3" />
                      {pathRec.path.enrolled || 0}
                    </span>
                    <span className="flex items-center gap-1">
                      <Calendar className="h-3 w-3" />
                      {pathRec.path.duration}
                    </span>
                  </div>
                  {pathRec.path.rating && (
                    <div className="flex items-center gap-1">
                      <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                      <span>{pathRec.path.rating.toFixed(1)}</span>
                    </div>
                  )}
                </div>

                <p className="text-sm text-muted-foreground">{pathRec.reason}</p>

                {onViewLearningPath && (
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => onViewLearningPath(pathRec.path)}
                    className="w-full"
                  >
                    View Learning Path
                  </Button>
                )}
              </div>
            ))}
          </CardContent>
        </Card>
      )}
    </div>
  )
}

function StudyPlanTab({ studyPlan, personalizedInsights }: any) {
  if (!studyPlan || studyPlan.length === 0) {
    return (
      <div className="text-center py-8">
        <BookMarked className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
        <p className="text-muted-foreground">No study plan available</p>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Study Plan Overview */}
      {personalizedInsights && (
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Study Plan Overview</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="text-center">
                <p className="text-2xl font-bold">{studyPlan.length}</p>
                <p className="text-sm text-muted-foreground">Weeks</p>
              </div>
              
              <div className="text-center">
                <p className="text-2xl font-bold">{personalizedInsights.recommendedStudyTime}</p>
                <p className="text-sm text-muted-foreground">Hours/Week</p>
              </div>
              
              <div className="text-center">
                <p className="text-2xl font-bold capitalize">{personalizedInsights.suggestedPace}</p>
                <p className="text-sm text-muted-foreground">Pace</p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Weekly Plan */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Weekly Breakdown</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {studyPlan.map((week: any, index: number) => (
            <div key={index} className="border rounded-lg p-4 space-y-3">
              <div className="flex items-center justify-between">
                <h4 className="font-medium">Week {week.week}</h4>
                <Badge variant="outline">{week.focus}</Badge>
              </div>
              
              <div className="space-y-2">
                <p className="text-sm font-medium">Focus Area</p>
                <p className="text-sm text-muted-foreground">{week.focus}</p>
              </div>

              {week.goals && week.goals.length > 0 && (
                <div className="space-y-2">
                  <p className="text-sm font-medium">Goals</p>
                  <ul className="text-sm text-muted-foreground space-y-1">
                    {week.goals.map((goal: string, goalIndex: number) => (
                      <li key={goalIndex} className="flex items-center gap-2">
                        <div className="h-1.5 w-1.5 rounded-full bg-muted-foreground" />
                        {goal}
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {week.quizTopics && week.quizTopics.length > 0 && (
                <div className="space-y-2">
                  <p className="text-sm font-medium">Quiz Topics</p>
                  <div className="flex flex-wrap gap-2">
                    {week.quizTopics.map((topic: string, topicIndex: number) => (
                      <Badge key={topicIndex} variant="secondary">
                        {topic}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}

              {week.resources && week.resources.length > 0 && (
                <div className="space-y-2">
                  <p className="text-sm font-medium">Resources</p>
                  <div className="flex flex-wrap gap-2">
                    {week.resources.map((resource: string, resourceIndex: number) => (
                      <Badge key={resourceIndex} variant="outline">
                        {resource}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  )
} 