import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function fixSubjectCategories() {
  try {
    console.log('🔧 FIXING SUBJECT-CATEGORY RELATIONSHIPS\n');
    console.log('='.repeat(50));

    // Define the mapping of subjects to categories
    const subjectCategoryMapping = {
      'JavaScript in 2 Days': 'Computer Science',
      'Python Crash Course': 'Computer Science',
      'Digital Marketing Basics': 'Business',
      'Excel for Beginners': 'Business',
      'Speed Reading in 3 Days': 'Arts & Humanities',
      'Engineering Fundamentals': 'Engineering',
      'Arts & Humanities Overview': 'Arts & Humanities',
      'Natural Sciences Basics': 'Natural Sciences',
      'Social Sciences Essentials': 'Social Sciences',
      'Technology Foundations': 'Technology'
    };

    // Get all categories
    const categories = await prisma.category.findMany();
    const categoryMap = {};
    categories.forEach(cat => {
      categoryMap[cat.name] = cat.id;
    });

    console.log('📋 SUBJECT-CATEGORY MAPPING:');
    Object.entries(subjectCategoryMapping).forEach(([subjectName, categoryName]) => {
      console.log(`  ${subjectName} → ${categoryName}`);
    });

    console.log('\n🔗 UPDATING RELATIONSHIPS...');

    // Update each subject with its proper category
    for (const [subjectName, categoryName] of Object.entries(subjectCategoryMapping)) {
      const categoryId = categoryMap[categoryName];
      
      if (!categoryId) {
        console.log(`❌ Category "${categoryName}" not found for subject "${subjectName}"`);
        continue;
      }

      const updatedSubject = await prisma.subject.update({
        where: { name: subjectName },
        data: { categoryId: categoryId }
      });

      console.log(`✅ Updated "${subjectName}" → "${categoryName}"`);
    }

    console.log('\n📊 VERIFICATION:');
    console.log('='.repeat(50));

    // Verify the changes
    const allSubjects = await prisma.subject.findMany({
      include: {
        category: true
      }
    });

    allSubjects.forEach(subject => {
      const categoryName = subject.category?.name || 'No Category';
      console.log(`📖 ${subject.name} (Category: ${categoryName})`);
    });

    console.log('\n✅ Subject-category relationships fixed successfully!');

  } catch (error) {
    console.error('Error fixing subject categories:', error);
  } finally {
    await prisma.$disconnect();
  }
}

fixSubjectCategories(); 