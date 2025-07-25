import { prisma } from '@/lib/prisma';
import { NextResponse } from 'next/server';

export async function GET(request: Request, { params }: { params: { id: string } }) {
  const { id } = params;
  try {
    // Check if subject exists
    const subject = await prisma.subject.findUnique({ where: { id } });
    if (!subject) {
      return NextResponse.json({ error: 'Subject not found' }, { status: 404 });
    }
    // Get lessons for this subject
    const lessons = await prisma.lesson.findMany({
      where: { subjectId: id },
      orderBy: { order: 'asc' },
    });
    return NextResponse.json({ lessons });
  } catch (error) {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
} 