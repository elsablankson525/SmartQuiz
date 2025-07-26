import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { getServerSession } from "next-auth/next"
import { authOptions } from "@/app/api/auth/[...nextauth]/route"

export async function GET(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const session = await getServerSession(authOptions)
  if (!session || !(session.user as any)?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }
  const userId = (session.user as any).id
  const { id: subjectId } = await params
  // @ts-ignore
  const cert = await prisma.userCertificate.findUnique({
    where: { userId_subjectId: { userId, subjectId } },
  })
  return NextResponse.json({ certificate: cert })
}

export async function POST(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const session = await getServerSession(authOptions)
  if (!session || !(session.user as any)?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }
  const userId = (session.user as any).id
  const { id: subjectId } = await params
  // @ts-ignore
  const lessons = await prisma.lesson.findMany({ where: { subjectId } })
  // @ts-ignore
  const completed = await prisma.userLessonProgress.findMany({ where: { userId, subjectId } })
  if (lessons.length === 0 || completed.length < lessons.length) {
    return NextResponse.json({ error: "Not all lessons complete" }, { status: 400 })
  }
  // @ts-ignore
  const cert = await prisma.userCertificate.upsert({
    where: { userId_subjectId: { userId, subjectId } },
    update: {},
    create: { userId, subjectId },
  })
  return NextResponse.json({ certificate: cert })
} 