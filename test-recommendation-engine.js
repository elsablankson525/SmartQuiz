// Test the recommendation engine directly
const testRecommendationEngine = async () => {
  console.log('🔧 Testing Recommendation Engine Directly...\n');

  try {
    // Test 1: Check if we can import the recommendation engine
    console.log('📦 Test 1: Importing recommendation engine...');
    
    // Since we're in a Node.js environment, we need to use dynamic imports
    const { generatePersonalizedRecommendations } = await import('./lib/recommendation-engine.ts');
    console.log('   ✅ Recommendation engine imported successfully');

    // Test 2: Create sample data
    console.log('\n📊 Test 2: Creating sample quiz data...');
    
    const sampleQuizResult = {
      id: 'test-1',
      userId: 'test@example.com',
      category: 'computer-science',
      difficulty: 'intermediate',
      score: 7,
      totalQuestions: 10,
      timeSpent: 450,
      date: new Date(),
      questionsAnswered: [
        {
          question: 'What is inheritance in OOP?',
          userAnswer: 'A mechanism for code reuse',
          correctAnswer: 'A mechanism for code reuse',
          isCorrect: true,
          topic: 'oop'
        }
      ]
    };

    const sampleQuestions = [
      {
        question: 'What is inheritance in OOP?',
        options: ['A mechanism for code reuse', 'A database concept', 'A web protocol'],
        correctAnswer: 'A mechanism for code reuse',
        topic: 'oop',
        difficulty: 'intermediate'
      }
    ];

    console.log('   ✅ Sample data created');

    // Test 3: Test the recommendation function
    console.log('\n🧠 Test 3: Testing generatePersonalizedRecommendations...');
    
    try {
      const recommendations = await generatePersonalizedRecommendations(
        sampleQuizResult,
        sampleQuestions,
        [], // empty user history
        'inBetween'
      );
      
      console.log('   ✅ Recommendations generated successfully');
      console.log('   📊 Weak areas:', recommendations.weakAreas);
      console.log('   ✅ Strong areas:', recommendations.strongAreas);
      console.log('   📚 Resources count:', recommendations.recommendedResources?.length || 0);
      console.log('   🎯 Next quiz:', recommendations.nextQuizSuggestion);
      console.log('   📋 Study plan count:', recommendations.studyPlan?.length || 0);
      
    } catch (error) {
      console.log('   ❌ Error generating recommendations:', error.message);
      console.log('   🔍 Error stack:', error.stack);
    }

  } catch (error) {
    console.log('❌ Failed to import recommendation engine:', error.message);
    console.log('🔍 Error details:', error);
  }

  // Test 4: Test the rule-based engine directly
  console.log('\n⚙️ Test 4: Testing rule-based engine...');
  
  try {
    const { RuleBasedEngine } = await import('./lib/rule-based-engine.ts');
    console.log('   ✅ Rule-based engine imported successfully');
    
    // Test the study plan function
    const studyPlan = RuleBasedEngine.getStudyPlanForSubjectAndLearnerType('computer-science', 'inBetween');
    console.log('   📋 Study plan generated:', studyPlan.length, 'items');
    
  } catch (error) {
    console.log('   ❌ Error with rule-based engine:', error.message);
  }

  console.log('\n🎉 Recommendation engine testing completed!');
};

// Run test if this file is executed directly
if (typeof window === 'undefined') {
  testRecommendationEngine().catch(console.error);
} 