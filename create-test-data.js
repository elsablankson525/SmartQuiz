const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function createTestData() {
  try {
    console.log('Creating test data...');
    
    // Find the user
    const user = await prisma.user.findFirst({
      where: { email: 'john@example.com' }
    });
    
    if (!user) {
      console.log('User not found, creating...');
      const hashedPassword = await require('bcryptjs').hash('password123', 12);
      await prisma.user.create({
        data: {
          name: 'John Doe',
          email: 'john@example.com',
          password: hashedPassword,
        }
      });
    }
    
    // Create a quiz
    const quiz = await prisma.quiz.create({
      data: {
        id: 'test-quiz-1',
        userId: user?.id,
        category: 'JavaScript Fundamentals',
        difficulty: 'beginner'
      }
    });
    
    // Create a quiz result
    const quizResult = await prisma.quizResult.create({
      data: {
        quizId: quiz.id,
        userId: user?.id,
        score: 8,
        totalQuestions: 10,
        timeSpent: 300 // 5 minutes
      }
    });
    
    console.log('Test data created successfully!');
    console.log('Quiz ID:', quiz.id);
    console.log('Quiz Result ID:', quizResult.id);
    
  } catch (error) {
    console.error('Error creating test data:', error);
  } finally {
    await prisma.$disconnect();
  }
}

createTestData(); 