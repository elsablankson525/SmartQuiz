const fetch = require('node-fetch');

async function testAPI() {
  console.log('Testing API endpoints...\n');

  // Test 1: User Quiz History API
  console.log('1. Testing User Quiz History API...');
  try {
    const response = await fetch('http://localhost:3000/api/user-quiz-history?userId=test@example.com');
    const data = await response.json();
    console.log('Status:', response.status);
    console.log('Response:', JSON.stringify(data, null, 2));
  } catch (error) {
    console.log('Error:', error.message);
  }

  console.log('\n' + '='.repeat(50) + '\n');

  // Test 2: Quiz Result API
  console.log('2. Testing Quiz Result API...');
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
    console.log('Status:', response.status);
    console.log('Response:', JSON.stringify(data, null, 2));
  } catch (error) {
    console.log('Error:', error.message);
  }

  console.log('\n' + '='.repeat(50) + '\n');

  // Test 3: Quiz Questions API
  console.log('3. Testing Quiz Questions API...');
  try {
    const response = await fetch('http://localhost:3000/api/quiz-questions?category=computer-science&difficulty=intermediate&count=5');
    const data = await response.json();
    console.log('Status:', response.status);
    console.log('Questions count:', data.questions?.length || 0);
    if (data.questions && data.questions.length > 0) {
      console.log('Sample question:', data.questions[0].question.substring(0, 50) + '...');
    }
  } catch (error) {
    console.log('Error:', error.message);
  }
}

testAPI().catch(console.error); 