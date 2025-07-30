import { prisma } from '@/lib/prisma';
import { NextResponse } from 'next/server';

export async function GET(request: Request, context: { params: Promise<{ id: string }> }) {
  const { id } = await context.params;
  try {
    const subject = await prisma.subject.findUnique({
      where: { id },
    });
    if (!subject) {
      return NextResponse.json({ error: 'Subject not found' }, { status: 404 });
    }
    return NextResponse.json(subject);
  } catch {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
} 