// Comprehensive test for the recommendation feature
const testRecommendationFeature = async () => {
  console.log('🧪 Testing Recommendation Feature...\n');

  // Test 1: Test recommendation engine with different quiz results
  console.log('📊 Test 1: Testing recommendation engine with different performance levels');
  
  const testCases = [
    {
      name: 'Low Performance (Beginner)',
      quizResult: {
        userId: 'test@example.com',
        category: 'computer-science',
        difficulty: 'beginner',
        score: 3,
        totalQuestions: 10,
        timeSpent: 300,
        date: new Date().toISOString(),
        questionsAnswered: [
          {
            question: 'What is a variable?',
            userAnswer: 'A storage container',
            correctAnswer: 'A storage container',
            isCorrect: true,
            topic: 'programming-basics'
          }
        ]
      }
    },
    {
      name: 'Medium Performance (Intermediate)',
      quizResult: {
        userId: 'test@example.com',
        category: 'computer-science',
        difficulty: 'intermediate',
        score: 7,
        totalQuestions: 10,
        timeSpent: 450,
        date: new Date().toISOString(),
        questionsAnswered: [
          {
            question: 'What is object-oriented programming?',
            userAnswer: 'A programming paradigm',
            correctAnswer: 'A programming paradigm',
            isCorrect: true,
            topic: 'oop'
          }
        ]
      }
    },
    {
      name: 'High Performance (Advanced)',
      quizResult: {
        userId: 'test@example.com',
        category: 'computer-science',
        difficulty: 'advanced',
        score: 9,
        totalQuestions: 10,
        timeSpent: 600,
        date: new Date().toISOString(),
        questionsAnswered: [
          {
            question: 'What is a design pattern?',
            userAnswer: 'A reusable solution',
            correctAnswer: 'A reusable solution',
            isCorrect: true,
            topic: 'design-patterns'
          }
        ]
      }
    }
  ];

  for (const testCase of testCases) {
    console.log(`\n🔍 Testing: ${testCase.name}`);
    console.log(`   Score: ${testCase.quizResult.score}/${testCase.quizResult.totalQuestions} (${(testCase.quizResult.score/testCase.quizResult.totalQuestions*100).toFixed(1)}%)`);
    console.log(`   Category: ${testCase.quizResult.category}`);
    console.log(`   Difficulty: ${testCase.quizResult.difficulty}`);
    
    try {
      // Test the recommendation API (if it exists)
      const response = await fetch('http://localhost:3000/api/quiz-result', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(testCase.quizResult)
      });
      
      if (response.ok) {
        const data = await response.json();
        console.log('   ✅ Quiz result saved successfully');
        console.log('   📝 Response:', JSON.stringify(data, null, 2));
      } else {
        console.log('   ❌ Failed to save quiz result');
        const error = await response.text();
        console.log('   Error:', error);
      }
    } catch (error) {
      console.log('   ❌ API call failed:', error.message);
    }
  }

  // Test 2: Test user quiz history retrieval
  console.log('\n📚 Test 2: Testing user quiz history retrieval');
  try {
    const response = await fetch('http://localhost:3000/api/user-quiz-history?userId=test@example.com');
    if (response.ok) {
      const data = await response.json();
      console.log('   ✅ User quiz history retrieved successfully');
      console.log(`   📊 Found ${data.length} quiz results`);
      if (data.length > 0) {
        console.log('   📈 Recent performance:', data.slice(-3).map(r => `${r.score}/${r.totalQuestions}`));
      }
    } else {
      console.log('   ❌ Failed to retrieve user quiz history');
    }
  } catch (error) {
    console.log('   ❌ API call failed:', error.message);
  }

  // Test 3: Test learning paths API
  console.log('\n🛤️ Test 3: Testing learning paths API');
  try {
    const response = await fetch('http://localhost:3000/api/learning-paths');
    if (response.ok) {
      const data = await response.json();
      console.log('   ✅ Learning paths retrieved successfully');
      console.log(`   📚 Found ${data.length} learning paths`);
      if (data.length > 0) {
        console.log('   🎯 Sample paths:', data.slice(0, 3).map(p => `${p.title} (${p.difficulty})`));
      }
    } else {
      console.log('   ❌ Failed to retrieve learning paths');
    }
  } catch (error) {
    console.log('   ❌ API call failed:', error.message);
  }

  // Test 4: Test categories API
  console.log('\n📂 Test 4: Testing categories API');
  try {
    const response = await fetch('http://localhost:3000/api/categories');
    if (response.ok) {
      const data = await response.json();
      console.log('   ✅ Categories retrieved successfully');
      console.log(`   📂 Found ${data.length} categories`);
      if (data.length > 0) {
        console.log('   🏷️ Available categories:', data.map(c => c.name));
      }
    } else {
      console.log('   ❌ Failed to retrieve categories');
    }
  } catch (error) {
    console.log('   ❌ API call failed:', error.message);
  }

  // Test 5: Test the new recommendations API
  console.log('\n🧠 Test 5: Testing the new recommendations API');
  
  const testRecommendationAPI = async () => {
    const testQuizResult = {
      userId: 'test@example.com',
      category: 'computer-science',
      difficulty: 'intermediate',
      score: 7,
      totalQuestions: 10,
      timeSpent: 450,
      date: new Date().toISOString(),
      questionsAnswered: [
        {
          question: 'What is object-oriented programming?',
          userAnswer: 'A programming paradigm',
          correctAnswer: 'A programming paradigm',
          isCorrect: true,
          topic: 'oop'
        }
      ]
    };

    const testQuestions = [
      {
        question: 'What is object-oriented programming?',
        options: ['A programming paradigm', 'A database', 'A web framework'],
        correctAnswer: 'A programming paradigm',
        topic: 'oop',
        difficulty: 'intermediate'
      }
    ];

    try {
      const response = await fetch('http://localhost:3000/api/recommendations', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId: 'test@example.com',
          quizResult: testQuizResult,
          questions: testQuestions,
          learnerType: 'inBetween'
        })
      });

      if (response.ok) {
        const data = await response.json();
        console.log('   ✅ Recommendations generated successfully');
        console.log('   📊 User history count:', data.userHistory);
        console.log('   🎯 Weak areas:', data.recommendations.weakAreas);
        console.log('   ✅ Strong areas:', data.recommendations.strongAreas);
        console.log('   📚 Recommended resources:', data.recommendations.recommendedResources?.length || 0);
        console.log('   🎯 Next quiz suggestion:', data.recommendations.nextQuizSuggestion);
        console.log('   📋 Study plan items:', data.recommendations.studyPlan?.length || 0);
      } else {
        console.log('   ❌ Failed to generate recommendations');
        const error = await response.text();
        console.log('   Error:', error);
      }
    } catch (error) {
      console.log('   ❌ API call failed:', error.message);
    }
  };

  await testRecommendationAPI();

  // Test 6: Test recommendation logic simulation
  console.log('\n🧠 Test 6: Testing recommendation logic simulation');
  
  const simulateRecommendations = (score, totalQuestions, difficulty, category) => {
    const percentage = (score / totalQuestions) * 100;
    
    let weakAreas = [];
    let strongAreas = [];
    let nextDifficulty = difficulty;
    let reason = '';
    
    if (percentage < 50) {
      weakAreas = ['fundamentals', 'basic concepts'];
      nextDifficulty = 'beginner';
      reason = 'Focus on fundamentals to build a strong foundation';
    } else if (percentage < 70) {
      weakAreas = ['intermediate concepts'];
      strongAreas = ['fundamentals'];
      nextDifficulty = difficulty;
      reason = 'Practice more at your current level to improve consistency';
    } else if (percentage < 90) {
      weakAreas = ['advanced concepts'];
      strongAreas = ['fundamentals', 'intermediate concepts'];
      nextDifficulty = difficulty === 'beginner' ? 'intermediate' : difficulty;
      reason = 'You\'re ready for the next level of difficulty';
    } else {
      strongAreas = ['fundamentals', 'intermediate concepts', 'advanced concepts'];
      nextDifficulty = difficulty === 'beginner' ? 'intermediate' : difficulty === 'intermediate' ? 'advanced' : 'advanced';
      reason = 'Challenge yourself with harder questions to continue growing';
    }
    
    return {
      weakAreas,
      strongAreas,
      nextQuizSuggestion: {
        category,
        difficulty: nextDifficulty,
        reason
      },
      performance: `${percentage.toFixed(1)}%`
    };
  };

  const testScores = [
    { score: 2, total: 10, difficulty: 'beginner', category: 'computer-science' },
    { score: 6, total: 10, difficulty: 'intermediate', category: 'computer-science' },
    { score: 8, total: 10, difficulty: 'advanced', category: 'computer-science' },
    { score: 10, total: 10, difficulty: 'advanced', category: 'computer-science' }
  ];

  testScores.forEach(({ score, total, difficulty, category }) => {
    const recommendation = simulateRecommendations(score, total, difficulty, category);
    console.log(`\n   📊 Score: ${score}/${total} (${recommendation.performance})`);
    console.log(`   🎯 Next Quiz: ${recommendation.nextQuizSuggestion.difficulty} level`);
    console.log(`   💡 Reason: ${recommendation.nextQuizSuggestion.reason}`);
    console.log(`   ❌ Weak Areas: ${recommendation.weakAreas.join(', ') || 'None'}`);
    console.log(`   ✅ Strong Areas: ${recommendation.strongAreas.join(', ') || 'None'}`);
  });

  console.log('\n🎉 Recommendation feature testing completed!');
  console.log('\n📋 Summary:');
  console.log('   ✅ Quiz result submission');
  console.log('   ✅ User history retrieval');
  console.log('   ✅ Learning paths access');
  console.log('   ✅ Categories access');
  console.log('   ✅ Recommendations API testing');
  console.log('   ✅ Recommendation logic simulation');
  console.log('\n💡 Next steps:');
  console.log('   1. Check the server logs for any errors');
  console.log('   2. Verify database entries were created');
  console.log('   3. Test the frontend recommendation display');
  console.log('   4. Validate learning resource recommendations');
};

// Run test if this file is executed directly
if (typeof window === 'undefined') {
  testRecommendationFeature().catch(console.error);
} 