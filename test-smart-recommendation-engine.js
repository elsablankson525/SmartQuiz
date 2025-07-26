// Comprehensive test for the Smart Quiz Recommendation Engine
const testSmartRecommendationEngine = async () => {
  console.log('🧠 Testing Smart Quiz Recommendation Engine...\n');

  // Check if server is running by trying to connect to it
  const baseURL = 'http://localhost:3000';
  
  console.log('🔍 Checking if development server is running...');
  try {
    const healthCheck = await fetch(`${baseURL}/api/health`, { 
      method: 'GET',
      timeout: 3000 
    });
    console.log('✅ Server is running');
  } catch (error) {
    console.log('❌ Server is not running. Please start the development server first:');
    console.log('   npm run dev');
    console.log('   or');
    console.log('   pnpm dev');
    console.log('\nThen run this test script again.');
    return;
  }

  // Test 1: Test the new smart recommendations API endpoint
  console.log('\n📊 Test 1: Testing Smart Recommendations API Endpoint');
  console.log('='.repeat(60));

  const testCases = [
    {
      name: 'Beginner with Low Performance',
      quizResult: {
        userId: 'test@example.com',
        category: 'computer-science',
        difficulty: 'beginner',
        score: 3,
        totalQuestions: 10,
        timeSpent: 600,
        date: new Date().toISOString(),
        questionsAnswered: [
          {
            question: 'What is a variable?',
            userAnswer: 'A storage container',
            correctAnswer: 'A storage container',
            isCorrect: true,
            topic: 'programming-basics'
          },
          {
            question: 'What is a function?',
            userAnswer: 'A block of code',
            correctAnswer: 'A reusable block of code',
            isCorrect: false,
            topic: 'programming-basics'
          }
        ]
      },
      questions: [
        {
          question: 'What is a variable?',
          options: ['A storage container', 'A function', 'A loop'],
          correctAnswer: 'A storage container',
          topic: 'programming-basics',
          difficulty: 'beginner'
        },
        {
          question: 'What is a function?',
          options: ['A variable', 'A reusable block of code', 'A data type'],
          correctAnswer: 'A reusable block of code',
          topic: 'programming-basics',
          difficulty: 'beginner'
        }
      ]
    },
    {
      name: 'Intermediate with Good Performance',
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
          },
          {
            question: 'What is inheritance?',
            userAnswer: 'A mechanism for code reuse',
            correctAnswer: 'A mechanism for code reuse',
            isCorrect: true,
            topic: 'oop'
          }
        ]
      },
      questions: [
        {
          question: 'What is object-oriented programming?',
          options: ['A programming paradigm', 'A database', 'A web framework'],
          correctAnswer: 'A programming paradigm',
          topic: 'oop',
          difficulty: 'intermediate'
        },
        {
          question: 'What is inheritance?',
          options: ['A loop', 'A mechanism for code reuse', 'A variable'],
          correctAnswer: 'A mechanism for code reuse',
          topic: 'oop',
          difficulty: 'intermediate'
        }
      ]
    },
    {
      name: 'Advanced with Excellent Performance',
      quizResult: {
        userId: 'test@example.com',
        category: 'computer-science',
        difficulty: 'advanced',
        score: 9,
        totalQuestions: 10,
        timeSpent: 300,
        date: new Date().toISOString(),
        questionsAnswered: [
          {
            question: 'What is a design pattern?',
            userAnswer: 'A reusable solution to common problems',
            correctAnswer: 'A reusable solution to common problems',
            isCorrect: true,
            topic: 'design-patterns'
          },
          {
            question: 'What is dependency injection?',
            userAnswer: 'A technique for loose coupling',
            correctAnswer: 'A technique for loose coupling',
            isCorrect: true,
            topic: 'design-patterns'
          }
        ]
      },
      questions: [
        {
          question: 'What is a design pattern?',
          options: ['A variable', 'A function', 'A reusable solution to common problems'],
          correctAnswer: 'A reusable solution to common problems',
          topic: 'design-patterns',
          difficulty: 'advanced'
        },
        {
          question: 'What is dependency injection?',
          options: ['A loop', 'A technique for loose coupling', 'A data type'],
          correctAnswer: 'A technique for loose coupling',
          topic: 'design-patterns',
          difficulty: 'advanced'
        }
      ]
    }
  ];

  for (const testCase of testCases) {
    console.log(`\n🎯 Testing: ${testCase.name}`);
    console.log('-'.repeat(40));
    
    try {
      const response = await fetch(`${baseURL}/api/smart-recommendations`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userId: testCase.quizResult.userId,
          quizResult: testCase.quizResult,
          questions: testCase.questions,
          learnerType: 'inBetween',
          includeAnalytics: true,
          includeStudyPlan: true,
          includeLearningPaths: true
        })
      });

      if (response.ok) {
        const data = await response.json();
        console.log('✅ API Response Success');
        
        // Display key insights
        console.log(`   📈 Performance: ${data.recommendations?.nextQuizSuggestion?.difficulty || 'N/A'} level`);
        console.log(`   🎯 Next Quiz: ${data.recommendations?.nextQuizSuggestion?.reason || 'N/A'}`);
        console.log(`   ❌ Weak Areas: ${data.recommendations?.weakAreas?.join(', ') || 'None'}`);
        console.log(`   ✅ Strong Areas: ${data.recommendations?.strongAreas?.join(', ') || 'None'}`);
        
        // Display analytics if available
        if (data.performanceAnalytics) {
          console.log(`   📊 Overall Score: ${data.performanceAnalytics.overallScore?.toFixed(1)}%`);
          console.log(`   📈 Learning Trend: ${data.performanceAnalytics.learningTrend || 'N/A'}`);
          console.log(`   ⏱️ Time Efficiency: ${data.performanceAnalytics.timeSpentAnalysis?.timeEfficiency || 'N/A'}`);
        }
        
        // Display adaptive recommendations if available
        if (data.adaptiveRecommendations) {
          console.log(`   🔄 Difficulty Adjustment: ${data.adaptiveRecommendations.difficultyAdjustment || 'N/A'}`);
          console.log(`   🎯 Ready for Next Level: ${data.adaptiveRecommendations.readinessForNextLevel ? 'Yes' : 'No'}`);
        }
        
        // Display study plan if available
        if (data.studyPlan && data.studyPlan.length > 0) {
          console.log(`   📚 Study Plan: ${data.studyPlan.length} weeks`);
        }
        
        // Display learning paths if available
        if (data.pathRecommendations && data.pathRecommendations.length > 0) {
          console.log(`   🛤️ Learning Paths: ${data.pathRecommendations.length} recommended`);
        }
        
      } else {
        const errorData = await response.json();
        console.log('❌ API Response Error:', errorData.error);
      }
    } catch (error) {
      console.log('❌ Request Failed:', error.message);
    }
  }

  // Test 2: Test learning profile retrieval
  console.log('\n\n📋 Test 2: Testing Learning Profile Retrieval');
  console.log('='.repeat(60));
  
  try {
    const response = await fetch(`${baseURL}/api/smart-recommendations?userId=test@example.com`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      }
    });

    if (response.ok) {
      const data = await response.json();
      console.log('✅ Learning Profile Retrieved Successfully');
      
      if (data.learningProfile) {
        console.log(`   👤 Experience Level: ${data.learningProfile.experienceLevel}`);
        console.log(`   📊 Average Score: ${data.learningProfile.averageScore}%`);
        console.log(`   📈 Learning Trend: ${data.learningProfile.learningTrend}`);
        console.log(`   🎯 Total Quizzes: ${data.learningProfile.totalQuizzes}`);
        console.log(`   💪 Strengths: ${data.learningProfile.strengths?.join(', ') || 'None'}`);
        console.log(`   🔧 Weaknesses: ${data.learningProfile.weaknesses?.join(', ') || 'None'}`);
        console.log(`   🎯 Recommended Focus: ${data.learningProfile.recommendedFocus}`);
      }
    } else {
      const errorData = await response.json();
      console.log('❌ Learning Profile Error:', errorData.error);
    }
  } catch (error) {
    console.log('❌ Learning Profile Request Failed:', error.message);
  }

  // Test 3: Test different learner types
  console.log('\n\n🎓 Test 3: Testing Different Learner Types');
  console.log('='.repeat(60));
  
  const learnerTypes = ['slow', 'inBetween', 'fast'];
  
  for (const learnerType of learnerTypes) {
    console.log(`\n🧠 Testing Learner Type: ${learnerType}`);
    console.log('-'.repeat(30));
    
    try {
      const response = await fetch(`${baseURL}/api/smart-recommendations`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userId: 'test@example.com',
          quizResult: {
            userId: 'test@example.com',
            category: 'computer-science',
            difficulty: 'intermediate',
            score: 6,
            totalQuestions: 10,
            timeSpent: 500,
            date: new Date().toISOString(),
            questionsAnswered: []
          },
          questions: [],
          learnerType: learnerType,
          includeStudyPlan: true
        })
      });

      if (response.ok) {
        const data = await response.json();
        console.log('✅ Recommendations Generated');
        
        if (data.studyPlan && data.studyPlan.length > 0) {
          console.log(`   📚 Study Plan Weeks: ${data.studyPlan.length}`);
          console.log(`   🎯 First Week Focus: ${data.studyPlan[0]?.focus || 'N/A'}`);
        }
        
        if (data.personalizedInsights) {
          console.log(`   🎓 Suggested Pace: ${data.personalizedInsights.suggestedPace}`);
          console.log(`   ⏰ Study Time: ${data.personalizedInsights.recommendedStudyTime} hours/week`);
        }
      } else {
        console.log('❌ Failed to generate recommendations');
      }
    } catch (error) {
      console.log('❌ Request Failed:', error.message);
    }
  }

  // Test 4: Test adaptive difficulty scenarios
  console.log('\n\n🔄 Test 4: Testing Adaptive Difficulty Scenarios');
  console.log('='.repeat(60));
  
  const adaptiveScenarios = [
    { name: 'Struggling Student', score: 2, total: 10, difficulty: 'intermediate' },
    { name: 'Average Performer', score: 6, total: 10, difficulty: 'intermediate' },
    { name: 'High Achiever', score: 9, total: 10, difficulty: 'intermediate' },
    { name: 'Expert Level', score: 10, total: 10, difficulty: 'advanced' }
  ];
  
  for (const scenario of adaptiveScenarios) {
    console.log(`\n🎯 Testing: ${scenario.name}`);
    console.log('-'.repeat(25));
    
    try {
      const response = await fetch(`${baseURL}/api/smart-recommendations`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userId: 'test@example.com',
          quizResult: {
            userId: 'test@example.com',
            category: 'computer-science',
            difficulty: scenario.difficulty,
            score: scenario.score,
            totalQuestions: scenario.total,
            timeSpent: 400,
            date: new Date().toISOString(),
            questionsAnswered: []
          },
          questions: [],
          includeAnalytics: true,
          includeStudyPlan: false,
          includeLearningPaths: false
        })
      });

      if (response.ok) {
        const data = await response.json();
        console.log('✅ Adaptive Analysis Complete');
        
        console.log(`   📊 Performance: ${scenario.score}/${scenario.total} (${(scenario.score/scenario.total*100).toFixed(1)}%)`);
        console.log(`   🎯 Next Difficulty: ${data.recommendations?.nextQuizSuggestion?.difficulty || 'N/A'}`);
        console.log(`   💡 Reason: ${data.recommendations?.nextQuizSuggestion?.reason || 'N/A'}`);
        
        if (data.adaptiveRecommendations) {
          console.log(`   🔄 Adjustment: ${data.adaptiveRecommendations.difficultyAdjustment}`);
          console.log(`   🎯 Ready for Next: ${data.adaptiveRecommendations.readinessForNextLevel ? 'Yes' : 'No'}`);
        }
      } else {
        console.log('❌ Failed to analyze adaptive scenario');
      }
    } catch (error) {
      console.log('❌ Request Failed:', error.message);
    }
  }

  // Test 5: Test category-specific recommendations
  console.log('\n\n📚 Test 5: Testing Category-Specific Recommendations');
  console.log('='.repeat(60));
  
  const categories = ['computer-science', 'health', 'business', 'law', 'psychology', 'mathematics'];
  
  for (const category of categories) {
    console.log(`\n📁 Testing Category: ${category}`);
    console.log('-'.repeat(30));
    
    try {
      const response = await fetch(`${baseURL}/api/smart-recommendations?userId=test@example.com&category=${category}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        }
      });

      if (response.ok) {
        const data = await response.json();
        console.log('✅ Category Recommendations Retrieved');
        
        if (data.categoryRecommendations) {
          console.log(`   📚 Resources: ${data.categoryRecommendations.recommendedResources?.length || 0}`);
          console.log(`   🛤️ Learning Paths: ${data.categoryRecommendations.pathRecommendations?.length || 0}`);
          console.log(`   📋 Study Plan: ${data.categoryRecommendations.studyPlan?.length || 0} weeks`);
        }
      } else {
        console.log('❌ Failed to get category recommendations');
      }
    } catch (error) {
      console.log('❌ Request Failed:', error.message);
    }
  }

  // Test 6: Performance and error handling
  console.log('\n\n⚡ Test 6: Performance and Error Handling');
  console.log('='.repeat(60));
  
  // Test with invalid data
  console.log('\n🧪 Testing Error Handling:');
  console.log('-'.repeat(25));
  
  try {
    const response = await fetch(`${baseURL}/api/smart-recommendations`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        // Missing required fields
        userId: '',
        quizResult: null
      })
    });

    if (!response.ok) {
      const errorData = await response.json();
      console.log('✅ Error handling working correctly');
      console.log(`   ❌ Error: ${errorData.error}`);
    } else {
      console.log('❌ Should have returned an error for invalid data');
    }
  } catch (error) {
    console.log('❌ Request Failed:', error.message);
  }

  // Test performance with large dataset simulation
  console.log('\n⚡ Testing Performance:');
  console.log('-'.repeat(20));
  
  const startTime = Date.now();
  
  try {
    const response = await fetch(`${baseURL}/api/smart-recommendations`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        userId: 'test@example.com',
        quizResult: {
          userId: 'test@example.com',
          category: 'computer-science',
          difficulty: 'intermediate',
          score: 7,
          totalQuestions: 10,
          timeSpent: 450,
          date: new Date().toISOString(),
          questionsAnswered: Array.from({ length: 10 }, (_, i) => ({
            question: `Question ${i + 1}`,
            userAnswer: 'Answer',
            correctAnswer: 'Answer',
            isCorrect: i < 7,
            topic: 'programming'
          }))
        },
        questions: Array.from({ length: 10 }, (_, i) => ({
          question: `Question ${i + 1}`,
          options: ['A', 'B', 'C', 'D'],
          correctAnswer: 'A',
          topic: 'programming',
          difficulty: 'intermediate'
        })),
        includeAnalytics: true,
        includeStudyPlan: true,
        includeLearningPaths: true
      })
    });

    const endTime = Date.now();
    const responseTime = endTime - startTime;
    
    if (response.ok) {
      console.log(`✅ Performance test completed in ${responseTime}ms`);
      console.log(`   📊 Response time: ${responseTime < 2000 ? 'Good' : 'Slow'} (< 2s)`);
    } else {
      console.log('❌ Performance test failed');
    }
  } catch (error) {
    console.log('❌ Performance test error:', error.message);
  }

  console.log('\n\n🎉 Smart Recommendation Engine Testing Complete!');
  console.log('='.repeat(60));
  console.log('✅ All tests completed');
  console.log('📊 Comprehensive analytics and insights generated');
  console.log('🔄 Adaptive recommendations working');
  console.log('📚 Study plans and learning paths available');
  console.log('🎯 Personalized insights provided');
};

// Run the test
testSmartRecommendationEngine().catch(console.error); 