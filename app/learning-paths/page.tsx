"use client"

import { useEffect, useState } from "react"
import { useSearchParams, useRouter } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { CheckCircle, Play, HelpCircle } from "lucide-react"
import { useSession } from "next-auth/react"
import LessonQuiz from "@/components/LessonQuiz"

// This page relies on client-side search params – don't prerender
export const dynamic = "force-dynamic"

interface LearningPath {
  id: string;
  title: string;
  description: string;
  category: string;
  difficulty: string;
  milestones?: Milestone[];
  progress?: number;
  color?: string;
  icon?: string;
  estimatedDuration?: string;
}

interface Milestone {
  id: string;
  title: string;
  description: string;
  isCompleted: boolean;
  quizTopics?: string[];
  estimatedTime?: string;
  difficulty?: string;
  requiredScore?: number;
}

interface Subject {
  id: string;
  name: string;
  description?: string;
  topics?: string[];
  lessons?: Lesson[];
  resources?: Resource[];
}

interface Lesson {
  id: string;
  title: string;
  description?: string;
  order: number;
}

interface Resource {
  id: string;
  title: string;
  type: string;
  url: string;
  difficulty?: string;
}

export default function LearningPathJourneyPage() {
  const { data: session } = useSession();
  const searchParams = useSearchParams();
  const router = useRouter();
  const [paths, setPaths] = useState<LearningPath[]>([])
  const [selectedPath, setSelectedPath] = useState<LearningPath | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [selectedMilestone, setSelectedMilestone] = useState<string | null>(null)
  const [showQuiz, setShowQuiz] = useState(false)
  const [milestoneSubjects, setMilestoneSubjects] = useState<Record<string, Subject>>({})

  // Fetch all learning paths
  useEffect(() => {
    async function fetchPaths() {
      setLoading(true)
      setError(null)
      try {
        const params = new URLSearchParams()
        if (session?.user?.email) params.append("userId", session.user.email)
        const res = await fetch(`/api/learning-paths?${params.toString()}`)
        if (!res.ok) throw new Error("Failed to fetch learning paths")
        const data = await res.json()
        setPaths(data.learningPaths || [])
      } catch {
        setError("Could not load learning paths. Please try again later.")
      } finally {
        setLoading(false)
      }
    }
    fetchPaths()
  }, [session])

  // Handle path selection from URL or UI
  useEffect(() => {
    if (!paths.length) return;
    const urlPathId = searchParams.get("path");
    let pathToSelect = null;
    if (urlPathId) {
      pathToSelect = paths.find((p) => p.id === urlPathId);
    }
    if (!pathToSelect) {
      pathToSelect = paths[0];
    }
    setSelectedPath(pathToSelect);
    // Auto-select the first incomplete milestone, or the first if all complete
    if (pathToSelect && pathToSelect.milestones && pathToSelect.milestones.length > 0) {
      const firstIncomplete = pathToSelect.milestones.find((m: Milestone) => !m.isCompleted)
      setSelectedMilestone(firstIncomplete ? firstIncomplete.id : pathToSelect.milestones[0].id)
    }
  }, [paths, searchParams])

  // Fetch subject details for each milestone (by quizTopics[0])
  useEffect(() => {
    async function fetchSubjectsForMilestones() {
      if (!selectedPath || !selectedPath.milestones) return;
      const newSubjects: Record<string, Subject> = {};
      await Promise.all(selectedPath.milestones.map(async (milestone: Milestone) => {
        const topic = milestone.quizTopics?.[0];
        if (!topic) return;
        try {
          // Try to fetch subject by topic as name
          const res = await fetch(`/api/subjects`);
          if (!res.ok) return;
          const data = await res.json();
          const subject = data.subjects?.find((s: Subject) => s.name.toLowerCase() === topic.toLowerCase() || s.topics?.includes(topic));
          if (subject) {
            // Fetch lessons and resources for this subject
            const [lessonsRes, resourcesRes] = await Promise.all([
              fetch(`/api/subjects/${subject.id}/lessons`),
              fetch(`/api/subjects/${subject.id}/resources`),
            ]);
            const lessons = lessonsRes.ok ? (await lessonsRes.json()).lessons : [];
            const resources = resourcesRes.ok ? (await resourcesRes.json()).resources : [];
            newSubjects[milestone.id] = { ...subject, lessons, resources };
          }
        } catch {}
      }));
      setMilestoneSubjects(newSubjects);
    }
    fetchSubjectsForMilestones();
  }, [selectedPath]);

  // Path selection handler
  const handleSelectPath = (id: string) => {
    router.push(`?path=${id}`);
  };

  if (loading) return <div className="min-h-screen flex items-center justify-center">Loading...</div>
  if (error) return <div className="min-h-screen flex items-center justify-center text-red-500">{error}</div>
  if (!selectedPath) return <div className="min-h-screen flex items-center justify-center">No learning path found.</div>

  const milestones = selectedPath.milestones || []
  const completedCount = milestones.filter((m: Milestone) => m.isCompleted).length
  const progress = milestones.length > 0 ? Math.round((completedCount / milestones.length) * 100) : 0
  const allComplete = milestones.length > 0 && completedCount === milestones.length

  return (
    <div className="min-h-screen bg-background">
      <main className="container mx-auto px-4 py-8">
        {/* Path Selection */}
        <div className="mb-8 flex flex-wrap gap-4 justify-center">
          {paths.map((p) => (
            <Card
              key={p.id}
              className={`cursor-pointer w-72 ${selectedPath?.id === p.id ? "border-primary ring-2 ring-primary" : "hover:border-primary"}`}
              onClick={() => handleSelectPath(p.id)}
            >
              <CardHeader>
                <CardTitle className="text-lg">{p.title}</CardTitle>
                <CardDescription className="truncate">{p.description}</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex items-center gap-2 mb-2">
                  <Badge variant="outline" className="capitalize">{p.category}</Badge>
                  <Badge variant={
                    p.difficulty === "beginner"
                      ? "secondary"
                      : p.difficulty === "intermediate"
                        ? "default"
                        : "destructive"
                  }>{p.difficulty}</Badge>
                </div>
                <Progress value={p.progress} className="h-2" />
                <div className="text-xs mt-1">{p.progress}% complete</div>
              </CardContent>
            </Card>
          ))}
        </div>
        {/* Path Journey */}
        <Card className="max-w-2xl mx-auto">
          <CardHeader>
            {/* Completion Banner */}
            {allComplete && (
              <div className="mb-4 p-4 rounded-lg bg-green-100 text-green-800 text-center font-bold border border-green-300">
                🎉 Congratulations! You have completed this learning path.
              </div>
            )}
            <div className="flex items-center gap-4 mb-2">
              <div className={`w-14 h-14 rounded-full ${selectedPath?.color || 'bg-primary/10'} flex items-center justify-center text-3xl`}>
                {selectedPath?.icon || <HelpCircle className="h-8 w-8" />}
              </div>
              <div>
                <CardTitle className="text-2xl">{selectedPath?.title}</CardTitle>
                <div className="flex items-center gap-2 mt-1">
                  <Badge variant="outline" className="capitalize">{selectedPath?.category}</Badge>
                  <Badge variant={
                    selectedPath?.difficulty === "beginner"
                      ? "secondary"
                      : selectedPath?.difficulty === "intermediate"
                        ? "default"
                        : "destructive"
                  }>{selectedPath?.difficulty}</Badge>
                </div>
              </div>
            </div>
            <CardDescription className="text-base mb-2">{selectedPath?.description}</CardDescription>
            <div className="flex gap-4 text-sm mb-2">
              <div className="flex items-center gap-1">
                <Play className="h-4 w-4" />
                {selectedPath?.estimatedDuration || "-"}
              </div>
              <div className="flex items-center gap-1">
                <CheckCircle className="h-4 w-4" />
                {milestones.length} milestones
              </div>
            </div>
            <Progress value={progress} className="h-2" />
            <div className="text-sm mt-1">{completedCount}/{milestones.length} milestones completed</div>
          </CardHeader>
          <CardContent>
            {/* Milestones List */}
            <div className="mb-6">
              <h3 className="font-semibold mb-2">Milestones</h3>
              <ul className="space-y-2">
                 {(() => {
                   const shownSubjectIds = new Set();
                   return milestones.map((milestone: Milestone) => {
                     const subject = milestoneSubjects[milestone.id];
                     let showSubjectBlock = false;
                     if (subject && subject.id && !shownSubjectIds.has(subject.id)) {
                       showSubjectBlock = true;
                       shownSubjectIds.add(subject.id);
                     }
                     return (
                       <li key={milestone.id}>
                         <button
                           className={`w-full flex items-center gap-3 p-3 rounded-lg border ${selectedMilestone === milestone.id ? "border-primary bg-primary/10" : "border-muted"} hover:border-primary transition`}
                           onClick={() => {
                             setSelectedMilestone(milestone.id)
                             setShowQuiz(false)
                           }}
                         >
                           <CheckCircle className={`h-4 w-4 ${milestone.isCompleted ? "text-green-500" : "text-muted-foreground"}`} />
                           <span className="flex-1 text-left font-medium">{milestone.title}</span>
                           <span className="text-xs text-muted-foreground">Required Score: {milestone.requiredScore}%</span>
                           {milestone.isCompleted && <span className="ml-2 text-green-600">✔</span>}
                         </button>
                         {/* Milestone details and quiz */}
                         {selectedMilestone === milestone.id && (
                           <div className="mt-2 ml-8 text-sm text-muted-foreground">
                             <div className="mb-2">{milestone.description}</div>
                             <div className="mb-2">Quiz Topics: {milestone.quizTopics?.join(", ") || "No topics specified"}</div>
                             {/* Rich subject content, only if not already shown */}
                             {showSubjectBlock && subject && (
                               <div className="mb-2 p-3 rounded bg-muted/50">
                                 <div className="font-semibold text-primary mb-1">Subject: {subject.name}</div>
                                 <div className="mb-1">{subject.description}</div>
                                 {subject.lessons && subject.lessons.length > 0 && (
                                   <div className="mb-1">
                                     <span className="font-medium">Lessons:</span>
                                     <ul className="list-disc ml-6">
                                       {subject.lessons.map((lesson: Lesson) => (
                                         <li key={lesson.id}>{lesson.title}</li>
                                       ))}
                                     </ul>
                                   </div>
                                 )}
                                 {subject.resources && subject.resources.length > 0 && (
                                   <div>
                                     <span className="font-medium">Resources:</span>
                                     <ul className="list-disc ml-6">
                                       {subject.resources.map((res: Resource) => (
                                         <li key={res.id}><a href={res.url} target="_blank" rel="noopener noreferrer" className="text-blue-600 underline">{res.title}</a></li>
                                       ))}
                                     </ul>
                                   </div>
                                 )}
                               </div>
                             )}
                             {!subject && (
                              <div className="mb-2 p-3 rounded bg-muted/50 text-muted-foreground">
                                <div>No subject details available for this milestone.</div>
                              </div>
                            )}
                             {!milestone.isCompleted && !showQuiz && (
                               <Button className="mt-2" onClick={() => setShowQuiz(true)}>
                                 <Play className="h-4 w-4 mr-2" /> Start Quiz
                               </Button>
                             )}
                             {showQuiz && (
                               <div className="mt-4">
                                 {/* Use the first quiz topic for the quiz, or all topics if supported */}
                                 <LessonQuiz quizId={milestone.quizTopics?.[0] || ""} />
                               </div>
                             )}
                             {milestone.isCompleted && (
                               <div className="mt-2 text-green-700 font-semibold">Milestone completed!</div>
                             )}
                           </div>
                         )}
                       </li>
                     )
                   });
                 })()}
              </ul>
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  )
}
