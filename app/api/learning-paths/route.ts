import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '../../../lib/prisma';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const category = searchParams.get('category');
    const difficulty = searchParams.get('difficulty');

    const where: Record<string, string> = {};
    
    if (category) {
      where.category = category;
    }
    
    if (difficulty) {
      where.difficulty = difficulty;
    }

    const learningPaths = await prisma.learningPath.findMany({
      where,
      orderBy: {
        title: 'asc'
      }
    });

    // Add default milestones to each learning path
    const learningPathsWithMilestones = learningPaths.map(path => ({
      ...path,
      milestones: [
        {
          id: `${path.id}-milestone-1`,
          title: 'Getting Started',
          description: 'Introduction to the fundamentals',
          isCompleted: false,
          quizTopics: [path.category],
          estimatedTime: '2-3 hours',
          difficulty: 'beginner',
          requiredScore: 70
        },
        {
          id: `${path.id}-milestone-2`,
          title: 'Core Concepts',
          description: 'Master the essential concepts',
          isCompleted: false,
          quizTopics: [path.category],
          estimatedTime: '4-6 hours',
          difficulty: path.difficulty,
          requiredScore: 80
        },
        {
          id: `${path.id}-milestone-3`,
          title: 'Advanced Topics',
          description: 'Explore advanced features and techniques',
          isCompleted: false,
          quizTopics: [path.category],
          estimatedTime: '6-8 hours',
          difficulty: path.difficulty === 'beginner' ? 'intermediate' : 'advanced',
          requiredScore: 85
        }
      ],
      progress: 0
    }));

    return NextResponse.json(learningPathsWithMilestones);
  } catch (error) {
    console.error('Error fetching learning paths:', error);
    return NextResponse.json(
      { error: 'Failed to fetch learning paths' },
      { status: 500 }
    );
  }
}

// New endpoint to get unique difficulties
export async function GET_DIFFICULTIES() {
  try {
    const difficulties = await prisma.learningPath.findMany({
      select: { difficulty: true },
      distinct: ['difficulty'],
    });
    const uniqueDifficulties = difficulties.map(d => d.difficulty).filter(Boolean);
    return NextResponse.json({ difficulties: uniqueDifficulties });
  } catch {
    return NextResponse.json({ error: "Failed to fetch difficulties" }, { status: 500 });
  }
} 