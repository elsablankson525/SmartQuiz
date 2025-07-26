// Simple test script to verify recommendation system
const testRecommendationSystem = async () => {
  console.log('Testing recommendation system...');
  
  // Test 1: Check if user quiz history API works
  try {
    const response = await fetch('http://localhost:3000/api/user-quiz-history?userId=test@example.com');
    const data = await response.json();
    console.log('User quiz history API response:', data);
  } catch (error) {
    console.log('User quiz history API test failed:', error.message);
  }
  
  // Test 2: Check if quiz result API works
  try {
    const quizResult = {
      userId: 'test@example.com',
      category: 'computer-science',
      difficulty: 'intermediate',
      score: 7,
      totalQuestions: 10,
      timeSpent: 300,
      date: new Date().toISOString(),
      questionsAnswered: [
        {
          question: 'What is JavaScript?',
          userAnswer: 'A programming language',
          correctAnswer: 'A programming language',
          isCorrect: true
        }
      ]
    };
    
    const response = await fetch('http://localhost:3000/api/quiz-result', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(quizResult)
    });
    const data = await response.json();
    console.log('Quiz result API response:', data);
  } catch (error) {
    console.log('Quiz result API test failed:', error.message);
  }
};

// Run test if this file is executed directly
if (typeof window === 'undefined') {
  testRecommendationSystem();
} 