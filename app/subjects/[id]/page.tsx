"use client"
import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"
import { useParams } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { BookOpen, Users, Clock, Star, Play, FileText, HelpCircle, Link2 } from "lucide-react"
import ReactMarkdown from 'react-markdown'
import ReactPlayer from 'react-player'
import { useSession } from "next-auth/react"
import jsPDF from "jspdf"
import LessonQuiz from "@/components/LessonQuiz"

export default function SubjectStudyPage() {
  const router = useRouter()
  const params = useParams()
  const { id } = params as { id: string }
  const [subject, setSubject] = useState<any>(null)
  const [lessons, setLessons] = useState<any[]>([])
  const [resources, setResources] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [selectedLesson, setSelectedLesson] = useState<string | null>(null)
  const [completedLessons, setCompletedLessons] = useState<string[]>([])
  const { data: session } = useSession();
  const userName = session?.user?.name || "Your Name"
  const [certificate, setCertificate] = useState<any>(null)

  // Fetch completed lessons from backend
  useEffect(() => {
    async function fetchProgressAndCert() {
      setLoading(true)
      setError(null)
      try {
        const [subjectRes, lessonsRes, resourcesRes, progressRes, certRes] = await Promise.all([
          fetch(`/api/subjects/${id}`),
          fetch(`/api/subjects/${id}/lessons`),
          fetch(`/api/subjects/${id}/resources`),
          fetch(`/api/subjects/${id}/progress`),
          fetch(`/api/subjects/${id}/certificate`),
        ])
        const subjectData = await subjectRes.json()
        const lessonsData = (await lessonsRes.json()).lessons
        setSubject(subjectData)
        setLessons(lessonsData)
        setResources((await resourcesRes.json()).resources)
        const completed = (await progressRes.json()).completedLessonIds
        setCompletedLessons(completed)
        setCertificate((await certRes.json()).certificate)
        // Auto-select the first incomplete lesson, or the first lesson if all are complete
        if (!selectedLesson && lessonsData.length > 0) {
          const firstIncomplete = lessonsData.find((l: any) => !completed.includes(l.id))
          setSelectedLesson(firstIncomplete ? firstIncomplete.id : lessonsData[0].id)
        }
      } catch (err) {
        setError("Could not load subject. Please try again later.")
      } finally {
        setLoading(false)
      }
    }
    fetchProgressAndCert()
  }, [id])

  // Mark lesson as complete in backend
  const handleMarkComplete = async (lessonId: string) => {
    try {
      await fetch(`/api/subjects/${id}/progress`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ lessonId }),
      })
      setCompletedLessons((prev) => prev.includes(lessonId) ? prev : [...prev, lessonId])
    } catch (err) {
      // Optionally show error
    }
  }

  // Issue certificate when all lessons complete
  useEffect(() => {
    if (lessons.length > 0 && completedLessons.length === lessons.length && !certificate) {
      fetch(`/api/subjects/${id}/certificate`, { method: "POST" })
        .then((res) => res.json())
        .then((data) => setCertificate(data.certificate))
    }
  }, [lessons, completedLessons, certificate, id])

  // Certificate download (styled PDF)
  const handleDownloadCertificate = () => {
    const doc = new jsPDF({ orientation: "landscape" })
    // Background
    doc.setFillColor(245, 245, 245)
    doc.rect(0, 0, 297, 210, "F")
    // Title
    doc.setFontSize(28)
    doc.setTextColor(34, 139, 34)
    doc.text("Certificate of Completion", 148, 40, { align: "center" })
    // Logo placeholder
    doc.setDrawColor(200, 200, 200)
    doc.rect(128, 50, 40, 40, "S")
    doc.setFontSize(10)
    doc.setTextColor(180)
    doc.text("Your Logo", 148, 73, { align: "center" })
    // User name
    doc.setFontSize(20)
    doc.setTextColor(0, 0, 0)
    doc.text(userName, 148, 100, { align: "center" })
    // Course name
    doc.setFontSize(16)
    doc.setTextColor(80, 80, 80)
    doc.text(`has successfully completed the course:`, 148, 115, { align: "center" })
    doc.setFontSize(18)
    doc.setTextColor(34, 139, 34)
    doc.text(subject?.name || "Course", 148, 130, { align: "center" })
    // Date
    doc.setFontSize(12)
    doc.setTextColor(100, 100, 100)
    doc.text(`Date: ${new Date().toLocaleDateString()}`, 148, 150, { align: "center" })
    // Signature placeholder
    doc.setFontSize(10)
    doc.setTextColor(120, 120, 120)
    doc.text("Signature", 230, 180)
    doc.line(210, 178, 270, 178)
    // Download
    doc.save(`Certificate-${subject?.name || "Course"}.pdf`)
  }

  if (loading) return <div className="min-h-screen flex items-center justify-center">Loading...</div>
  if (error) return <div className="min-h-screen flex items-center justify-center text-red-500">{error}</div>
  if (!subject) return <div className="min-h-screen flex items-center justify-center">Subject not found.</div>

  // Progress calculation
  const progress = lessons.length > 0 ? Math.round((completedLessons.length / lessons.length) * 100) : 0
  const allComplete = lessons.length > 0 && completedLessons.length === lessons.length

  const lessonIcon = (type: string) => {
    switch (type) {
      case "video": return <Play className="h-4 w-4 text-blue-500" />
      case "article": return <FileText className="h-4 w-4 text-green-500" />
      case "quiz": return <HelpCircle className="h-4 w-4 text-yellow-500" />
      default: return <FileText className="h-4 w-4 text-gray-400" />
    }
  }

  return (
    <div className="min-h-screen bg-background">
      <main className="container mx-auto px-4 py-8">
        <Card className="max-w-2xl mx-auto">
          <CardHeader>
            {/* Certificate/Completion Banner */}
            {allComplete && certificate && (
              <div className="mb-4 p-4 rounded-lg bg-green-100 text-green-800 text-center font-bold border border-green-300">
                🎉 Congratulations, {userName}! You have completed this course.<br />
                <button
                  className="mt-2 px-4 py-2 bg-primary text-white rounded hover:bg-primary/80"
                  onClick={handleDownloadCertificate}
                >
                  Download Certificate
                </button>
              </div>
            )}
            <div className="flex items-center gap-4 mb-2">
              <div className={`w-14 h-14 rounded-full ${subject.color} flex items-center justify-center text-3xl`}>
                {subject.icon}
              </div>
              <div>
                <CardTitle className="text-2xl">{subject.name}</CardTitle>
                <div className="flex items-center gap-2 mt-1">
                  <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                  <span className="text-sm font-medium">{subject.rating}</span>
                </div>
              </div>
            </div>
            <CardDescription className="text-base mb-2">{subject.description}</CardDescription>
            <div className="flex gap-4 text-sm mb-2">
              <div className="flex items-center gap-1 text-muted-foreground">
                <BookOpen className="h-4 w-4" />
                <span>{subject.quizzes} Quizzes</span>
              </div>
              <div className="flex items-center gap-1 text-muted-foreground">
                <Users className="h-4 w-4" />
                <span>{subject.learners?.toLocaleString()} Learners</span>
              </div>
              <div className="flex items-center gap-1 text-muted-foreground">
                <Clock className="h-4 w-4" />
                <span>{subject.avgTime} Avg Time</span>
              </div>
            </div>
            <div className="flex flex-wrap gap-2 mt-2">
              <Badge variant="outline">{subject.difficulty}</Badge>
              {subject.topics?.map((topic: string) => (
                <Badge key={topic} variant="secondary" className="text-xs">{topic}</Badge>
              ))}
            </div>
            {/* Progress Bar */}
            <div className="mt-4">
              <div className="flex justify-between text-xs mb-1">
                <span>Course Progress</span>
                <span>{progress}%</span>
              </div>
              <Progress value={progress} />
            </div>
          </CardHeader>
          <CardContent>
            {/* Lessons List */}
            <div className="mb-6">
              <h3 className="font-semibold mb-2">Lessons</h3>
              <ul className="space-y-2">
                {lessons.map((lesson) => (
                  <li key={lesson.id}>
                    <button
                      className={`w-full flex items-center gap-3 p-3 rounded-lg border ${selectedLesson === lesson.id ? "border-primary bg-primary/10" : "border-muted"} hover:border-primary transition`}
                      onClick={() => setSelectedLesson(selectedLesson === lesson.id ? null : lesson.id)}
                    >
                      {lessonIcon(lesson.type)}
                      <span className="flex-1 text-left font-medium">{lesson.title}</span>
                      <span className="text-xs text-muted-foreground">{lesson.duration}</span>
                      {completedLessons.includes(lesson.id) && <span className="ml-2 text-green-600">✔</span>}
                    </button>
                    {selectedLesson === lesson.id && (
                      <div className="mt-2 ml-8 text-sm text-muted-foreground">
                        {lesson.type === "video" ? (
                          <div>
                            <ReactPlayer {...{url: String(lesson.content), controls: true, width: '100%', height: '240px'}} />
                          </div>
                        ) : lesson.type === "article" ? (
                          <div className="prose max-w-none">
                            <ReactMarkdown>{lesson.content}</ReactMarkdown>
                          </div>
                        ) : lesson.type === "quiz" ? (
                          <LessonQuiz quizId={lesson.content} />
                        ) : (
                          <div>{lesson.content}</div>
                        )}
                        {!completedLessons.includes(lesson.id) && (
                          <button
                            className="mt-3 px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
                            onClick={() => handleMarkComplete(lesson.id)}
                          >
                            Mark as Complete
                          </button>
                        )}
                      </div>
                    )}
                  </li>
                ))}
              </ul>
            </div>
            {/* Resources List */}
            <div className="mb-4">
              <h3 className="font-semibold mb-2">Resources</h3>
              <ul className="space-y-2">
                {resources.map((res) => (
                  <li key={res.id} className="flex items-center gap-2">
                    <Link2 className="h-4 w-4 text-primary" />
                    <a href={res.url} target="_blank" rel="noopener noreferrer" className="underline text-primary font-medium">{res.title}</a>
                    <span className="text-xs text-muted-foreground ml-2">{res.type}</span>
                  </li>
                ))}
                {resources.length === 0 && <li className="text-muted-foreground text-sm">No resources yet.</li>}
              </ul>
            </div>
            <Button variant="outline" onClick={() => router.push("/subjects")}>Back to Subjects</Button>
          </CardContent>
        </Card>
      </main>
    </div>
  )
} 