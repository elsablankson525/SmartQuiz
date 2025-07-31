import { exec } from 'child_process';
import { promisify } from 'util';

const execAsync = promisify(exec);

async function runAllGenerators() {
  console.log('🚀 Starting comprehensive data generation for SmartQuiz...\n');
  
  try {
    // Step 1: Generate Quiz Questions
    console.log('📝 Step 1: Generating Quiz Questions...');
    console.log('This will create 10 questions each for all 20 subjects across 4 difficulty levels...');
    
    const quizResult = await execAsync('node create-quiz-questions.js');
    console.log('✅ Quiz Questions Generation Complete!\n');
    console.log(quizResult.stdout);
    
    // Step 2: Generate Learning Resources
    console.log('📚 Step 2: Generating Learning Resources...');
    console.log('This will create learning resources for all 20 subjects...');
    
    const resourcesResult = await execAsync('node create-learning-resources.js');
    console.log('✅ Learning Resources Generation Complete!\n');
    console.log(resourcesResult.stdout);
    
    // Summary
    console.log('🎉 All Data Generation Complete!');
    console.log('📊 Summary:');
    console.log('   • 20 Subjects');
    console.log('   • 4 Difficulty Levels per subject (beginner, intermediate, advanced, adaptive)');
    console.log('   • 10 Questions per difficulty level');
    console.log('   • Total: 800 Quiz Questions');
    console.log('   • Learning Resources for each subject');
    console.log('\n✨ Your SmartQuiz application is now ready with comprehensive content!');
    
  } catch (error) {
    console.error('❌ Error during data generation:', error.message);
    if (error.stdout) console.log('STDOUT:', error.stdout);
    if (error.stderr) console.log('STDERR:', error.stderr);
  }
}

// Run the master script
runAllGenerators(); 