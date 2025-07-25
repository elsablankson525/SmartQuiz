import { prisma } from '@/lib/prisma';
import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';

export async function GET(request: Request, context: { params: { id: string } }) {
  const { params } = context;
  const { id: subjectId } = await params;
  const session = await getServerSession(authOptions);
  if (!session || !session.user?.email) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
  const user = await prisma.user.findUnique({ where: { email: session.user.email } });
  if (!user) {
    return NextResponse.json({ error: 'User not found' }, { status: 404 });
  }
  const cert = await prisma.userCertificate.findUnique({
    where: { userId_subjectId: { userId: user.id, subjectId } },
  });
  return NextResponse.json({ certificate: cert });
}

export async function POST(request: Request, context: { params: { id: string } }) {
  const { params } = context;
  const { id: subjectId } = await params;
  const session = await getServerSession(authOptions);
  if (!session || !session.user?.email) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
  const user = await prisma.user.findUnique({ where: { email: session.user.email } });
  if (!user) {
    return NextResponse.json({ error: 'User not found' }, { status: 404 });
  }
  // Check if all lessons are completed
  const lessons = await prisma.lesson.findMany({ where: { subjectId } });
  const completed = await prisma.userLessonProgress.findMany({ where: { userId: user.id, subjectId } });
  if (lessons.length === 0 || completed.length < lessons.length) {
    return NextResponse.json({ error: 'Not all lessons completed' }, { status: 400 });
  }
  // Issue or return certificate
  const cert = await prisma.userCertificate.upsert({
    where: { userId_subjectId: { userId: user.id, subjectId } },
    update: {},
    create: { userId: user.id, subjectId },
  });
  return NextResponse.json({ certificate: cert });
} 