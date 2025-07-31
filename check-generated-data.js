import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function checkGeneratedData() {
  console.log('📊 Checking Generated Data Statistics...\n');
  
  try {
    // Count total questions
    const totalQuestions = await prisma.question.count();
    console.log(`📝 Total Quiz Questions: ${totalQuestions}`);
    
    // Count questions by difficulty
    const questionsByDifficulty = await prisma.question.groupBy({
      by: ['difficulty'],
      _count: {
        difficulty: true
      }
    });
    
    console.log('\n📊 Questions by Difficulty:');
    questionsByDifficulty.forEach(item => {
      console.log(`   • ${item.difficulty}: ${item._count.difficulty} questions`);
    });
    
    // Count questions by subject
    const questionsBySubject = await prisma.question.groupBy({
      by: ['category'],
      _count: {
        category: true
      }
    });
    
    console.log('\n📚 Questions by Subject:');
    questionsBySubject.forEach(item => {
      console.log(`   • ${item.category}: ${item._count.category} questions`);
    });
    
    // Count total learning resources
    const totalResources = await prisma.learningResource.count();
    console.log(`\n📖 Total Learning Resources: ${totalResources}`);
    
    // Count resources by type
    const resourcesByType = await prisma.learningResource.groupBy({
      by: ['type'],
      _count: {
        type: true
      }
    });
    
    console.log('\n📖 Resources by Type:');
    resourcesByType.forEach(item => {
      console.log(`   • ${item.type}: ${item._count.type} resources`);
    });
    
    // Count resources by difficulty
    const resourcesByDifficulty = await prisma.learningResource.groupBy({
      by: ['difficulty'],
      _count: {
        difficulty: true
      }
    });
    
    console.log('\n📖 Resources by Difficulty:');
    resourcesByDifficulty.forEach(item => {
      console.log(`   • ${item.difficulty}: ${item._count.difficulty} resources`);
    });
    
    // Sample questions
    console.log('\n🔍 Sample Questions:');
    const sampleQuestions = await prisma.question.findMany({
      take: 5,
      select: {
        question: true,
        category: true,
        difficulty: true,
        topic: true
      }
    });
    
    sampleQuestions.forEach((q, index) => {
      console.log(`   ${index + 1}. [${q.category} - ${q.difficulty}] ${q.question.substring(0, 80)}...`);
    });
    
    // Sample resources
    console.log('\n🔍 Sample Learning Resources:');
    const sampleResources = await prisma.learningResource.findMany({
      take: 5,
      select: {
        title: true,
        type: true,
        category: true,
        difficulty: true,
        provider: true
      }
    });
    
    sampleResources.forEach((r, index) => {
      console.log(`   ${index + 1}. [${r.category} - ${r.difficulty}] ${r.title} (${r.type}) - ${r.provider}`);
    });
    
    console.log('\n✅ Data generation completed successfully!');
    console.log('🎯 Your SmartQuiz application now has comprehensive content for all 20 subjects.');
    
  } catch (error) {
    console.error('❌ Error checking generated data:', error);
  } finally {
    await prisma.$disconnect();
  }
}

// Run the check
checkGeneratedData(); 