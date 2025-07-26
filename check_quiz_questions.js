import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function checkQuizQuestions() {
  try {
    console.log('=== COMPREHENSIVE DATABASE ANALYSIS ===\n');

    // Check all categories
    const categories = await prisma.category.findMany({
      include: {
        subjects: true,
        quizzes: true
      }
    });

    console.log('📊 CATEGORIES OVERVIEW:');
    console.log('='.repeat(50));
    categories.forEach(cat => {
      console.log(`📁 ${cat.name}`);
      console.log(`   Subjects: ${cat.subjects.length}`);
      console.log(`   Quiz Questions: ${cat.quizzes.length}`);
      console.log('');
    });

    // Check all subjects
    const allSubjects = await prisma.subject.findMany({
      include: {
        category: true
      }
    });

    console.log('📚 SUBJECTS OVERVIEW:');
    console.log('='.repeat(50));
    allSubjects.forEach(subject => {
      const categoryName = subject.category?.name || 'No Category';
      console.log(`📖 ${subject.name} (Category: ${categoryName})`);
    });

    console.log(`\nTotal Subjects: ${allSubjects.length}`);

    // Check quiz questions by difficulty
    const allQuestions = await prisma.quizQuestion.findMany({
      include: {
        category: true
      }
    });

    console.log('\n🎯 QUIZ QUESTIONS BY DIFFICULTY:');
    console.log('='.repeat(50));
    
    const difficultyStats = {};
    const categoryDifficultyStats = {};
    
    allQuestions.forEach(q => {
      // Overall difficulty stats
      if (!difficultyStats[q.difficulty]) {
        difficultyStats[q.difficulty] = 0;
      }
      difficultyStats[q.difficulty]++;
      
      // Category-specific difficulty stats
      const categoryName = q.category?.name || 'No Category';
      if (!categoryDifficultyStats[categoryName]) {
        categoryDifficultyStats[categoryName] = {};
      }
      if (!categoryDifficultyStats[categoryName][q.difficulty]) {
        categoryDifficultyStats[categoryName][q.difficulty] = 0;
      }
      categoryDifficultyStats[categoryName][q.difficulty]++;
    });

    console.log('\nOverall difficulty distribution:');
    Object.entries(difficultyStats).forEach(([difficulty, count]) => {
      console.log(`  ${difficulty}: ${count} questions`);
    });

    console.log('\n📊 DETAILED ANALYSIS BY CATEGORY:');
    console.log('='.repeat(50));

    for (const [categoryName, difficulties] of Object.entries(categoryDifficultyStats)) {
      console.log(`\n📁 ${categoryName}:`);
      
      const difficultiesList = ['beginner', 'intermediate', 'advanced', 'adaptive'];
      let allLevelsHaveEnough = true;
      
      for (const difficulty of difficultiesList) {
        const count = difficulties[difficulty] || 0;
        const status = count >= 10 ? '✅' : '❌';
        console.log(`  ${difficulty}: ${count} questions ${status}`);
        
        if (count < 10) {
          allLevelsHaveEnough = false;
        }
      }
      
      const totalQuestions = Object.values(difficulties).reduce((sum, count) => sum + count, 0);
      console.log(`  Total: ${totalQuestions} questions`);
      console.log(`  Status: ${allLevelsHaveEnough ? '✅ COMPLETE' : '❌ INCOMPLETE'}`);
    }

    // Check for "pagy" specifically
    console.log('\n🔍 SEARCHING FOR "PAGY" CATEGORY:');
    console.log('='.repeat(50));
    
    const pagyCategory = await prisma.category.findFirst({
      where: {
        name: {
          contains: 'pagy',
          mode: 'insensitive'
        }
      }
    });

    if (pagyCategory) {
      console.log(`Found category: ${pagyCategory.name}`);
    } else {
      console.log('❌ No category found with "pagy" in the name');
      console.log('\nAvailable categories:');
      categories.forEach(cat => {
        console.log(`  - ${cat.name}`);
      });
    }

    // Check if there are any subjects that might be related to "pagy"
    console.log('\n🔍 SEARCHING FOR "PAGY" IN SUBJECTS:');
    console.log('='.repeat(50));
    
    const pagySubjects = await prisma.subject.findMany({
      where: {
        name: {
          contains: 'pagy',
          mode: 'insensitive'
        }
      }
    });

    if (pagySubjects.length > 0) {
      console.log('Found subjects with "pagy":');
      pagySubjects.forEach(subject => {
        console.log(`  - ${subject.name}`);
      });
    } else {
      console.log('❌ No subjects found with "pagy" in the name');
    }

    // Summary
    console.log('\n📋 SUMMARY:');
    console.log('='.repeat(50));
    console.log(`Total Categories: ${categories.length}`);
    console.log(`Total Subjects: ${allSubjects.length}`);
    console.log(`Total Quiz Questions: ${allQuestions.length}`);
    
    const categoriesWithEnoughQuestions = Object.entries(categoryDifficultyStats).filter(([categoryName, difficulties]) => {
      const difficultiesList = ['beginner', 'intermediate', 'advanced', 'adaptive'];
      return difficultiesList.every(difficulty => (difficulties[difficulty] || 0) >= 10);
    });

    console.log(`Categories with 10+ questions per difficulty: ${categoriesWithEnoughQuestions.length}/${categories.length}`);
    
    if (categoriesWithEnoughQuestions.length < categories.length) {
      console.log('\n⚠️  CATEGORIES NEEDING MORE QUESTIONS:');
      Object.entries(categoryDifficultyStats).forEach(([categoryName, difficulties]) => {
        const difficultiesList = ['beginner', 'intermediate', 'advanced', 'adaptive'];
        const hasEnough = difficultiesList.every(difficulty => (difficulties[difficulty] || 0) >= 10);
        
        if (!hasEnough) {
          console.log(`  ❌ ${categoryName}`);
          difficultiesList.forEach(difficulty => {
            const count = difficulties[difficulty] || 0;
            if (count < 10) {
              console.log(`    ${difficulty}: ${count}/10 questions`);
            }
          });
        }
      });
    }

  } catch (error) {
    console.error('Error checking database:', error);
  } finally {
    await prisma.$disconnect();
  }
}

checkQuizQuestions(); 