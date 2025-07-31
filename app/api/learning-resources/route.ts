import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '../../../lib/prisma';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const category = searchParams.get('category');
    const difficulty = searchParams.get('difficulty');
    const topic = searchParams.get('topic');
    const type = searchParams.get('type');

    const where: Record<string, string> = {};
    
    if (category) {
      where.category = category;
    }
    
    if (difficulty) {
      where.difficulty = difficulty;
    }
    
    if (topic) {
      where.topic = topic;
    }
    
    if (type) {
      where.type = type;
    }

    const resources = await prisma.learningResource.findMany({
      where,
      orderBy: {
        title: 'asc'
      }
    });

    return NextResponse.json(resources);
  } catch (error) {
    console.error('Error fetching learning resources:', error);
    return NextResponse.json(
      { error: 'Failed to fetch learning resources' },
      { status: 500 }
    );
  }
} 