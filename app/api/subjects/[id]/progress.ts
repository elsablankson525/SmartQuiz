import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { getServerSession } from "next-auth/next"
import { authOptions } from "@/app/api/auth/[...nextauth]/route"

export async function GET(req: Request, { params }: { params: { id: string } }) {
  const session = await getServerSession(authOptions)
  if (!session || !session.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }
  const userId = (session.user as any).id
  const subjectId = params.id
  // @ts-ignore
  const progress = await prisma.userLessonProgress.findMany({
    where: { userId, subjectId },
    select: { lessonId: true },
  })
  return NextResponse.json({ completedLessonIds: progress.map((p: { lessonId: string }) => p.lessonId) })
}

export async function POST(req: Request, { params }: { params: { id: string } }) {
  const session = await getServerSession(authOptions)
  if (!session || !session.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }
  const userId = (session.user as any).id
  const subjectId = params.id
  const { lessonId } = await req.json()
  // @ts-ignore
  const progress = await prisma.userLessonProgress.upsert({
    where: { userId_lessonId: { userId, lessonId } },
    update: {},
    create: { userId, subjectId, lessonId },
  })
  return NextResponse.json({ success: true, progress })
} 