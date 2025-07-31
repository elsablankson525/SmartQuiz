const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function testRecommendations() {
  try {
    console.log('Testing recommendations API...');
    
    // Check if there are any users
    const users = await prisma.user.findMany({
      take: 5
    });
    
    console.log('Users found:', users.length);
    if (users.length > 0) {
      console.log('First user:', users[0].email);
    }
    
    // Check if there are any quiz results
    const quizResults = await prisma.quizResult.findMany({
      include: {
        Quiz: true,
        user: true
      },
      take: 5
    });
    
    console.log('Quiz results found:', quizResults.length);
    if (quizResults.length > 0) {
      console.log('First quiz result:', {
        id: quizResults[0].id,
        score: quizResults[0].score,
        totalQuestions: quizResults[0].totalQuestions,
        quizCategory: quizResults[0].Quiz?.category,
        quizDifficulty: quizResults[0].Quiz?.difficulty,
        userEmail: quizResults[0].user?.email
      });
    }
    
    // Check if there are any questions
    const questions = await prisma.question.findMany({
      take: 5
    });
    
    console.log('Questions found:', questions.length);
    
    // Check if there are any learning resources
    const resources = await prisma.learningResource.findMany({
      take: 5
    });
    
    console.log('Learning resources found:', resources.length);
    
  } catch (error) {
    console.error('Error testing recommendations:', error);
  } finally {
    await prisma.$disconnect();
  }
}

testRecommendations(); 