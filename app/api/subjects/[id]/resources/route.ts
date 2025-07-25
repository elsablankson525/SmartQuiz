import { prisma } from '@/lib/prisma';
import { NextResponse } from 'next/server';

export async function GET(request: Request, context: { params: { id: string } }) {
  const { id } = (await context).params;
  try {
    // Check if subject exists
    const subject = await prisma.subject.findUnique({ where: { id } });
    if (!subject) {
      return NextResponse.json({ error: 'Subject not found' }, { status: 404 });
    }
    // Get resources for this subject
    const resources = await prisma.resource.findMany({
      where: { subjectId: id },
    });
    return NextResponse.json({ resources });
  } catch (error) {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
} 