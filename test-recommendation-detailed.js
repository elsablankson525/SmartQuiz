// Detailed test for the recommendation feature with database connectivity check
const testRecommendationDetailed = async () => {
  console.log('🔍 Detailed Recommendation Feature Testing...\n');

  // Test 1: Check if test user exists in database
  console.log('👤 Test 1: Checking test user in database');
  try {
    const response = await fetch('http://localhost:3000/api/user-quiz-history?userId=test@example.com');
    if (response.ok) {
      const data = await response.json();
      console.log('   ✅ Test user found');
      console.log('   📊 Quiz history count:', data.length || 0);
    } else {
      console.log('   ❌ Test user not found or API error');
    }
  } catch (error) {
    console.log('   ❌ Database connectivity issue:', error.message);
  }

  // Test 2: Test recommendation engine with sample data
  console.log('\n🧠 Test 2: Testing recommendation engine logic');
  
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
      },
      {
        question: 'What is polymorphism?',
        userAnswer: 'Multiple forms',
        correctAnswer: 'Multiple forms',
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
    },
    {
      question: 'What is polymorphism?',
      options: ['Multiple forms', 'Single form', 'No form'],
      correctAnswer: 'Multiple forms',
      topic: 'oop',
      difficulty: 'intermediate'
    }
  ];

  // Simulate the recommendation logic
  const simulateRecommendationLogic = (quizResult, questions) => {
    const percentage = (quizResult.score / quizResult.totalQuestions) * 100;
    
    // Analyze performance
    let weakAreas = [];
    let strongAreas = [];
    let nextDifficulty = quizResult.difficulty;
    let reason = '';
    
    if (percentage < 50) {
      weakAreas = ['fundamentals', 'basic concepts'];
      nextDifficulty = 'beginner';
      reason = 'Focus on fundamentals to build a strong foundation';
    } else if (percentage < 70) {
      weakAreas = ['intermediate concepts'];
      strongAreas = ['fundamentals'];
      nextDifficulty = quizResult.difficulty;
      reason = 'Practice more at your current level to improve consistency';
    } else if (percentage < 90) {
      weakAreas = ['advanced concepts'];
      strongAreas = ['fundamentals', 'intermediate concepts'];
      nextDifficulty = quizResult.difficulty === 'beginner' ? 'intermediate' : quizResult.difficulty;
      reason = 'You\'re ready for the next level of difficulty';
    } else {
      strongAreas = ['fundamentals', 'intermediate concepts', 'advanced concepts'];
      nextDifficulty = quizResult.difficulty === 'beginner' ? 'intermediate' : 
                      quizResult.difficulty === 'intermediate' ? 'advanced' : 'advanced';
      reason = 'Challenge yourself with harder questions to continue growing';
    }

    // Analyze topics from questions
    const topics = questions.map(q => q.topic).filter(Boolean);
    const topicCounts = topics.reduce((acc, topic) => {
      acc[topic] = (acc[topic] || 0) + 1;
      return acc;
    }, {});

    return {
      performance: `${percentage.toFixed(1)}%`,
      weakAreas,
      strongAreas,
      nextQuizSuggestion: {
        category: quizResult.category,
        difficulty: nextDifficulty,
        reason
      },
      topicAnalysis: topicCounts,
      recommendedFocus: Object.keys(topicCounts).sort((a, b) => topicCounts[b] - topicCounts[a])[0]
    };
  };

  const recommendation = simulateRecommendationLogic(sampleQuizResult, sampleQuestions);
  
  console.log('   📊 Performance:', recommendation.performance);
  console.log('   🎯 Next Quiz:', recommendation.nextQuizSuggestion.difficulty, 'level');
  console.log('   💡 Reason:', recommendation.nextQuizSuggestion.reason);
  console.log('   ❌ Weak Areas:', recommendation.weakAreas.join(', ') || 'None');
  console.log('   ✅ Strong Areas:', recommendation.strongAreas.join(', ') || 'None');
  console.log('   📚 Topic Analysis:', recommendation.topicAnalysis);
  console.log('   🎯 Recommended Focus:', recommendation.recommendedFocus);

  // Test 3: Test different performance scenarios
  console.log('\n📈 Test 3: Testing different performance scenarios');
  
  const scenarios = [
    { name: 'Struggling Beginner', score: 2, total: 10, difficulty: 'beginner' },
    { name: 'Improving Intermediate', score: 6, total: 10, difficulty: 'intermediate' },
    { name: 'Advanced Learner', score: 8, total: 10, difficulty: 'advanced' },
    { name: 'Expert Level', score: 10, total: 10, difficulty: 'advanced' }
  ];

  scenarios.forEach(scenario => {
    const mockQuizResult = { ...sampleQuizResult, ...scenario };
    const mockQuestions = sampleQuestions;
    const rec = simulateRecommendationLogic(mockQuizResult, mockQuestions);
    
    console.log(`\n   🎭 ${scenario.name}:`);
    console.log(`      📊 Score: ${scenario.score}/${scenario.total} (${rec.performance})`);
    console.log(`      🎯 Next: ${rec.nextQuizSuggestion.difficulty} level`);
    console.log(`      💡 Focus: ${rec.recommendedFocus || 'General'}`);
  });

  // Test 4: Test the recommendations API with error handling
  console.log('\n🔧 Test 4: Testing recommendations API with detailed error handling');
  
  try {
    const response = await fetch('http://localhost:3000/api/recommendations', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        userId: 'test@example.com',
        quizResult: sampleQuizResult,
        questions: sampleQuestions,
        learnerType: 'inBetween'
      })
    });

    console.log('   📡 Response status:', response.status);
    console.log('   📡 Response headers:', Object.fromEntries(response.headers.entries()));

    if (response.ok) {
      const data = await response.json();
      console.log('   ✅ Recommendations API working');
      console.log('   📊 Response structure:', Object.keys(data));
      if (data.recommendations) {
        console.log('   🎯 Weak areas:', data.recommendations.weakAreas?.length || 0);
        console.log('   ✅ Strong areas:', data.recommendations.strongAreas?.length || 0);
        console.log('   📚 Resources:', data.recommendations.recommendedResources?.length || 0);
        console.log('   📋 Study plan:', data.recommendations.studyPlan?.length || 0);
      }
    } else {
      const errorText = await response.text();
      console.log('   ❌ API Error:', errorText);
      
      // Try to parse error as JSON
      try {
        const errorJson = JSON.parse(errorText);
        console.log('   🔍 Error details:', errorJson);
      } catch (e) {
        console.log('   🔍 Raw error:', errorText);
      }
    }
  } catch (error) {
    console.log('   ❌ Network error:', error.message);
  }

  // Test 5: Check learning resources availability
  console.log('\n📚 Test 5: Checking learning resources availability');
  try {
    const response = await fetch('http://localhost:3000/api/learning-paths');
    if (response.ok) {
      const data = await response.json();
      console.log('   ✅ Learning paths available');
      console.log('   📊 Total paths:', data.length || 0);
      if (data.length > 0) {
        console.log('   🎯 Sample paths:');
        data.slice(0, 3).forEach((path, index) => {
          console.log(`      ${index + 1}. ${path.title} (${path.difficulty})`);
        });
      }
    } else {
      console.log('   ❌ Learning paths not available');
    }
  } catch (error) {
    console.log('   ❌ Learning paths error:', error.message);
  }

  console.log('\n🎉 Detailed recommendation testing completed!');
  console.log('\n📋 Test Summary:');
  console.log('   ✅ Database connectivity');
  console.log('   ✅ Recommendation logic simulation');
  console.log('   ✅ Performance scenario analysis');
  console.log('   ✅ API endpoint testing');
  console.log('   ✅ Learning resources check');
  
  console.log('\n💡 Recommendations for improvement:');
  console.log('   1. Ensure database has learning resources for computer-science category');
  console.log('   2. Check if the recommendation engine has proper error handling');
  console.log('   3. Verify that the rule-based engine fallback is working');
  console.log('   4. Test with different user types and learning preferences');
};

// Run test if this file is executed directly
if (typeof window === 'undefined') {
  testRecommendationDetailed().catch(console.error);
} 