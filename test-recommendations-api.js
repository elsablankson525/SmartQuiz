// Test the new recommendations API route
const testRecommendationsAPI = async () => {
  console.log('🧪 Testing Recommendations API Route...\n')

  try {
    // Mock data for testing
    const testData = {
      currentQuizResult: {
        id: "test-quiz",
        userId: "test@example.com",
        category: "computer-science",
        difficulty: "intermediate",
        score: 8,
        totalQuestions: 10,
        timeSpent: 300,
        date: new Date(),
        questionsAnswered: [
          {
            question: "What is JavaScript?",
            userAnswer: "A programming language",
            correctAnswer: "A programming language",
            isCorrect: true
          }
        ]
      },
      questions: [
        {
          id: "1",
          question: "What is JavaScript?",
          options: ["A programming language", "A markup language", "A styling language"],
          correctAnswer: "A programming language",
          explanation: "JavaScript is a programming language used for web development."
        }
      ],
      userQuizHistory: [
        {
          id: "1",
          userId: "test@example.com",
          category: "computer-science",
          difficulty: "beginner",
          score: 7,
          totalQuestions: 10,
          date: new Date(Date.now() - 86400000) // 1 day ago
        }
      ]
    }

    console.log('📤 Sending request to /api/recommendations...')
    
    const response = await fetch('http://localhost:3000/api/recommendations', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(testData)
    })

    if (response.ok) {
      const result = await response.json()
      console.log('✅ API Response received successfully!')
      console.log('📊 Recommendations:', JSON.stringify(result.recommendations, null, 2))
    } else {
      const errorText = await response.text()
      console.log('❌ API Error:', response.status, errorText)
    }

  } catch (error) {
    console.log('❌ Test failed:', error.message)
    
    if (error.message.includes('PrismaClient')) {
      console.log('🔍 This confirms the PrismaClient browser error is still present')
    } else {
      console.log('🔍 This is a different error, not related to PrismaClient browser usage')
    }
  }
}

// Run the test
testRecommendationsAPI() 