import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { getServerSession } from "next-auth/next"
import { authOptions } from "@/app/api/auth/[...nextauth]/route"

interface SessionUser {
  id: string;
  name?: string | null;
  email?: string | null;
  image?: string | null;
}

export async function GET(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const session = await getServerSession(authOptions)
  if (!session || !(session.user as SessionUser)?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }
  const userId = (session.user as SessionUser).id
  const { id: subjectId } = await params
  
  const progress = await prisma.userLessonProgress.findMany({
    where: { userId, subjectId },
    include: { lesson: true }
  })
  return NextResponse.json({ progress })
}

export async function POST(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const session = await getServerSession(authOptions)
  if (!session || !(session.user as SessionUser)?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }
  const userId = (session.user as SessionUser).id
  const { id: subjectId } = await params
  const { lessonId, completed } = await req.json()
  
  const progress = await prisma.userLessonProgress.upsert({
    where: { userId_lessonId: { userId, lessonId } },
    update: { completedAt: completed ? new Date() : undefined },
    create: { userId, lessonId, subjectId, completedAt: completed ? new Date() : undefined }
  })
  return NextResponse.json({ progress })
} 