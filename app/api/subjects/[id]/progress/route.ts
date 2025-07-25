import { prisma } from '@/lib/prisma';
import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';

export async function GET(request: Request, { params }: { params: { id: string } }) {
  const { id: subjectId } = params;
  const session = await getServerSession(authOptions);
  if (!session || !session.user?.email) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
  const user = await prisma.user.findUnique({ where: { email: session.user.email } });
  if (!user) {
    return NextResponse.json({ error: 'User not found' }, { status: 404 });
  }
  const progress = await prisma.userLessonProgress.findMany({
    where: { userId: user.id, subjectId },
    select: { lessonId: true },
  });
  const completedLessonIds = progress.map((p) => p.lessonId);
  return NextResponse.json({ completedLessonIds });
}

export async function POST(request: Request, { params }: { params: { id: string } }) {
  const { id: subjectId } = params;
  const session = await getServerSession(authOptions);
  if (!session || !session.user?.email) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
  const user = await prisma.user.findUnique({ where: { email: session.user.email } });
  if (!user) {
    return NextResponse.json({ error: 'User not found' }, { status: 404 });
  }
  const body = await request.json();
  const { lessonId } = body;
  if (!lessonId) {
    return NextResponse.json({ error: 'Missing lessonId' }, { status: 400 });
  }
  await prisma.userLessonProgress.upsert({
    where: { userId_lessonId: { userId: user.id, lessonId } },
    update: {},
    create: { userId: user.id, subjectId, lessonId },
  });
  return NextResponse.json({ success: true });
} 