const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function checkUsers() {
  try {
    console.log('Checking users in database...');
    
    const users = await prisma.user.findMany({
      select: {
        id: true,
        email: true,
        name: true,
        createdAt: true
      }
    });
    
    console.log('Users found:', users.length);
    users.forEach(user => {
      console.log(`- ${user.email} (${user.name}) - Created: ${user.createdAt}`);
    });
    
    // Also check quiz results
    const quizResults = await prisma.quizResult.findMany({
      include: {
        user: {
          select: { email: true }
        },
        Quiz: {
          select: { category: true, difficulty: true }
        }
      },
      take: 5
    });
    
    console.log('\nQuiz results found:', quizResults.length);
    quizResults.forEach(result => {
      console.log(`- User: ${result.user?.email}, Score: ${result.score}/${result.totalQuestions}, Category: ${result.Quiz?.category}`);
    });
    
  } catch (error) {
    console.error('Error checking users:', error);
  } finally {
    await prisma.$disconnect();
  }
}

checkUsers(); 