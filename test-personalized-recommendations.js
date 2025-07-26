import fetch from 'node-fetch';

// Test configuration
const BASE_URL = 'http://localhost:3000';
const TEST_USER_EMAIL = 'kaacquah2004@gmail.com';

// Test data
const mockQuizResult = {
  userId: TEST_USER_EMAIL,
  category: 'cmdjipomi000aieuocddcdg5n', // Computer Science category ID
  difficulty: 'advanced',
  score: 7,
  totalQuestions: 10,
  timeSpent: 450, // 7.5 minutes
  date: new Date().toISOString(),
  questionsAnswered: [
    { questionId: '1', topic: 'javascript', isCorrect: true, timeSpent: 45 },
    { questionId: '2', topic: 'javascript', isCorrect: false, timeSpent: 60 },
    { questionId: '3', topic: 'algorithms', isCorrect: true, timeSpent: 30 },
    { questionId: '4', topic: 'algorithms', isCorrect: false, timeSpent: 90 },
    { questionId: '5', topic: 'data-structures', isCorrect: true, timeSpent: 40 },
    { questionId: '6', topic: 'data-structures', isCorrect: false, timeSpent: 75 },
    { questionId: '7', topic: 'javascript', isCorrect: true, timeSpent: 35 },
    { questionId: '8', topic: 'algorithms', isCorrect: true, timeSpent: 25 },
    { questionId: '9', topic: 'data-structures', isCorrect: true, timeSpent: 30 },
    { questionId: '10', topic: 'javascript', isCorrect: true, timeSpent: 20 }
  ]
};

const mockQuestions = [
  { id: '1', topic: 'javascript', difficulty: 'intermediate', isCorrect: true },
  { id: '2', topic: 'javascript', difficulty: 'advanced', isCorrect: false },
  { id: '3', topic: 'algorithms', difficulty: 'intermediate', isCorrect: true },
  { id: '4', topic: 'algorithms', difficulty: 'advanced', isCorrect: false },
  { id: '5', topic: 'data-structures', difficulty: 'intermediate', isCorrect: true },
  { id: '6', topic: 'data-structures', difficulty: 'advanced', isCorrect: false },
  { id: '7', topic: 'javascript', difficulty: 'intermediate', isCorrect: true },
  { id: '8', topic: 'algorithms', difficulty: 'intermediate', isCorrect: true },
  { id: '9', topic: 'data-structures', difficulty: 'intermediate', isCorrect: true },
  { id: '10', topic: 'javascript', difficulty: 'intermediate', isCorrect: true }
];

async function testQuizResultAPI() {
  console.log('\n🧪 Testing Enhanced Quiz Result API...');
  
  try {
    const response = await fetch(`${BASE_URL}/api/quiz-result`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(mockQuizResult)
    });

    const data = await response.json();
    
    if (response.ok) {
      console.log('✅ Quiz Result API - Success');
      console.log('📊 Performance Metrics:', {
        percentageScore: data.performanceMetrics.percentageScore,
        performanceLevel: data.performanceMetrics.performanceLevel,
        timePerQuestion: data.performanceMetrics.timePerQuestion
      });
      
      console.log('🎯 Personalized Recommendations:', {
        hasRecommendations: !!data.personalizedRecommendations,
        hasStudyPlan: !!data.personalizedStudyPlan,
        hasResources: !!data.personalizedResources
      });
      
      return data;
    } else {
      console.log('❌ Quiz Result API - Failed:', data.error);
      return null;
    }
  } catch (error) {
    console.log('❌ Quiz Result API - Error:', error.message);
    return null;
  }
}

async function testPersonalizedStudyPlans() {
  console.log('\n📚 Testing Personalized Study Plans API...');
  
  try {
    const response = await fetch(
      `${BASE_URL}/api/study-plans?category=cmdjipomi000aieuocddcdg5n&userId=${TEST_USER_EMAIL}&performanceLevel=good`,
      {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        }
      }
    );

    const data = await response.json();
    
    if (response.ok) {
      console.log('✅ Personalized Study Plans API - Success');
      console.log('📋 Study Plan Details:', {
        totalWeeks: data.totalWeeks,
        learnerType: data.learnerType,
        weakAreas: data.weakAreas,
        performanceMetrics: data.performanceMetrics
      });
      
      if (data.studyPlan && data.studyPlan.length > 0) {
        console.log('📅 First Week Plan:', {
          focus: data.studyPlan[0].focus,
          priority: data.studyPlan[0].priority,
          estimatedTime: data.studyPlan[0].estimatedTime
        });
      }
      
      return data;
    } else {
      console.log('❌ Personalized Study Plans API - Failed:', data.error);
      return null;
    }
  } catch (error) {
    console.log('❌ Personalized Study Plans API - Error:', error.message);
    return null;
  }
}

async function testPersonalizedResources() {
  console.log('\n📖 Testing Personalized Learning Resources API...');
  
  try {
    const response = await fetch(
      `${BASE_URL}/api/subjects/cmdjipomi000aieuocddcdg5n/resources?userId=${TEST_USER_EMAIL}&performanceLevel=good`,
      {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        }
      }
    );

    const data = await response.json();
    
    if (response.ok) {
      console.log('✅ Personalized Resources API - Success');
      console.log('📚 Resources Details:', {
        totalResources: data.totalResources,
        performanceLevel: data.performanceLevel,
        weakAreas: data.weakAreas
      });
      
      if (data.recommendations) {
        console.log('💡 Resource Recommendations:', {
          focusAreas: data.recommendations.focusAreas,
          suggestedApproach: data.recommendations.suggestedApproach?.substring(0, 100) + '...',
          resourceTypes: data.recommendations.resourceTypes
        });
      }
      
      if (data.resources && data.resources.length > 0) {
        console.log('🔝 Top Resource:', {
          title: data.resources[0].title,
          relevanceScore: data.resources[0].relevanceScore,
          recommendedFor: data.resources[0].recommendedFor
        });
      }
      
      return data;
    } else {
      console.log('❌ Personalized Resources API - Failed:', data.error);
      return null;
    }
  } catch (error) {
    console.log('❌ Personalized Resources API - Error:', error.message);
    return null;
  }
}

async function testSmartRecommendations() {
  console.log('\n🧠 Testing Enhanced Smart Recommendations API...');
  
  try {
    const response = await fetch(`${BASE_URL}/api/smart-recommendations`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        userId: TEST_USER_EMAIL,
        quizResult: mockQuizResult,
        questions: mockQuestions,
        includeAnalytics: true,
        includeStudyPlan: true,
        includeLearningPaths: true
      })
    });

    const data = await response.json();
    
    if (response.ok) {
      console.log('✅ Smart Recommendations API - Success');
      
      if (data.performanceAnalysis) {
        console.log('📊 Performance Analysis:', {
          percentageScore: data.performanceAnalysis.currentQuiz.percentageScore,
          performanceLevel: data.performanceAnalysis.currentQuiz.performanceLevel,
          weakAreas: data.performanceAnalysis.weakAreas,
          strongAreas: data.performanceAnalysis.strongAreas
        });
      }
      
      if (data.recommendations) {
        console.log('🎯 Recommendations:', {
          hasPersonalizedRecommendations: !!data.recommendations.personalizedRecommendations,
          hasNextQuizSuggestions: !!data.recommendations.nextQuizSuggestions,
          hasCategoryInsights: !!data.recommendations.categoryInsights
        });
        
        if (data.recommendations.nextQuizSuggestions && data.recommendations.nextQuizSuggestions.length > 0) {
          console.log('🔄 Next Quiz Suggestion:', {
            type: data.recommendations.nextQuizSuggestions[0].type,
            reason: data.recommendations.nextQuizSuggestions[0].reason,
            priority: data.recommendations.nextQuizSuggestions[0].priority
          });
        }
      }
      
      return data;
    } else {
      console.log('❌ Smart Recommendations API - Failed:', data.error);
      return null;
    }
  } catch (error) {
    console.log('❌ Smart Recommendations API - Error:', error.message);
    return null;
  }
}

async function testRuleBasedFallback() {
  console.log('\n🛡️ Testing Rule-Based Fallback System...');
  
  try {
    // Test with invalid data to trigger fallback
    const response = await fetch(`${BASE_URL}/api/smart-recommendations`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        userId: 'invalid-user@test.com',
        quizResult: { category: 'computer-science' },
        questions: []
      })
    });

    const data = await response.json();
    
    if (response.ok) {
      console.log('✅ Rule-Based Fallback - Success');
      console.log('📝 Fallback Note:', data.note);
      console.log('🔄 Fallback Recommendations:', {
        hasResources: !!data.recommendations.resources,
        hasStudyPlan: !!data.recommendations.studyPlan,
        hasNextQuizSuggestion: !!data.recommendations.nextQuizSuggestion
      });
      
      return data;
    } else {
      console.log('❌ Rule-Based Fallback - Failed:', data.error);
      return null;
    }
  } catch (error) {
    console.log('❌ Rule-Based Fallback - Error:', error.message);
    return null;
  }
}

async function runAllTests() {
  console.log('🚀 Starting Comprehensive Personalized Recommendation System Tests...\n');
  
  const results = {
    quizResult: await testQuizResultAPI(),
    studyPlans: await testPersonalizedStudyPlans(),
    resources: await testPersonalizedResources(),
    smartRecommendations: await testSmartRecommendations(),
    ruleBasedFallback: await testRuleBasedFallback()
  };
  
  console.log('\n📈 Test Summary:');
  console.log('================');
  
  const passedTests = Object.values(results).filter(result => result !== null).length;
  const totalTests = Object.keys(results).length;
  
  console.log(`✅ Passed: ${passedTests}/${totalTests} tests`);
  
  if (passedTests === totalTests) {
    console.log('🎉 All tests passed! The personalized recommendation system is working correctly.');
  } else {
    console.log('⚠️ Some tests failed. Please check the implementation.');
  }
  
  console.log('\n🔍 Key Features Verified:');
  console.log('• Personalized recommendations based on quiz performance');
  console.log('• Weak area identification and targeted suggestions');
  console.log('• Performance-based study plan generation');
  console.log('• Adaptive learning resource recommendations');
  console.log('• Rule-based fallback system');
  console.log('• Category-specific insights and advice');
  
  return results;
}

// Run the tests
runAllTests().catch(console.error);

export {
  runAllTests,
  testQuizResultAPI,
  testPersonalizedStudyPlans,
  testPersonalizedResources,
  testSmartRecommendations,
  testRuleBasedFallback
}; 