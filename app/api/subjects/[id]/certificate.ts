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
  
  const cert = await prisma.userCertificate.findUnique({
    where: { userId_subjectId: { userId, subjectId } },
  })
  return NextResponse.json({ certificate: cert })
}

export async function POST(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const session = await getServerSession(authOptions)
  if (!session || !(session.user as SessionUser)?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }
  const userId = (session.user as SessionUser).id
  const { id: subjectId } = await params
  
  const lessons = await prisma.lesson.findMany({ where: { subjectId } })
  const completed = await prisma.userLessonProgress.findMany({ where: { userId, subjectId } })
  if (lessons.length === 0 || completed.length < lessons.length) {
    return NextResponse.json({ error: "Not all lessons complete" }, { status: 400 })
  }
  
  const cert = await prisma.userCertificate.upsert({
    where: { userId_subjectId: { userId, subjectId } },
    update: {},
    create: { userId, subjectId },
  })
  return NextResponse.json({ certificate: cert })
} 