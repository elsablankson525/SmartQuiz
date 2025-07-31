const fetch = require('node-fetch');

async function testRecommendationsAPI() {
  try {
    console.log('Testing recommendations API...');
    
    // Test with a user that should exist after seeding
    const response = await fetch('http://localhost:3000/api/recommendations?userId=test@example.com');
    
    console.log('Response status:', response.status);
    console.log('Response headers:', Object.fromEntries(response.headers.entries()));
    
    const data = await response.json();
    console.log('Response data:', JSON.stringify(data, null, 2));
    
  } catch (error) {
    console.error('Error testing API:', error);
  }
}

testRecommendationsAPI(); 