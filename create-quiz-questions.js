import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// All 20 subjects
const subjects = [
  'JavaScript Fundamentals',
  'Python Programming', 
  'Web Development',
  'Data Science',
  'Machine Learning',
  'Human Anatomy',
  'Medical Terminology',
  'Business Fundamentals',
  'Digital Marketing',
  'Legal Fundamentals',
  'Psychology Basics',
  'Mathematics',
  'React Development',
  'Node.js Backend',
  'Database Design',
  'DevOps & CI/CD',
  'Cybersecurity',
  'Mobile Development',
  'Cloud Computing',
  'Blockchain & Crypto'
];

// Template questions for different difficulty levels
const questionTemplates = {
  beginner: [
    {
      question: 'What is the basic concept of {subject}?',
      options: ['Option A', 'Option B', 'Option C', 'Option D'],
      correctAnswer: 'Option A',
      explanation: 'This is the basic concept that everyone should understand about {subject}.',
      topic: 'Basic Concepts',
      relatedConcepts: ['fundamentals', 'basics', 'introduction']
    },
    {
      question: 'Which of the following is a key component of {subject}?',
      options: ['Component A', 'Component B', 'Component C', 'Component D'],
      correctAnswer: 'Component A',
      explanation: 'Component A is essential for understanding {subject}.',
      topic: 'Key Components',
      relatedConcepts: ['components', 'elements', 'parts']
    },
    {
      question: 'How do you start learning {subject}?',
      options: ['Method A', 'Method B', 'Method C', 'Method D'],
      correctAnswer: 'Method A',
      explanation: 'Method A is the recommended approach for beginners in {subject}.',
      topic: 'Learning Methods',
      relatedConcepts: ['learning', 'education', 'study']
    },
    {
      question: 'What is the primary purpose of {subject}?',
      options: ['Purpose A', 'Purpose B', 'Purpose C', 'Purpose D'],
      correctAnswer: 'Purpose A',
      explanation: 'The primary purpose of {subject} is to achieve Purpose A.',
      topic: 'Purpose and Goals',
      relatedConcepts: ['purpose', 'goals', 'objectives']
    },
    {
      question: 'Which tool is commonly used in {subject}?',
      options: ['Tool A', 'Tool B', 'Tool C', 'Tool D'],
      correctAnswer: 'Tool A',
      explanation: 'Tool A is the most commonly used tool in {subject}.',
      topic: 'Tools and Resources',
      relatedConcepts: ['tools', 'resources', 'equipment']
    },
    {
      question: 'What is a fundamental principle of {subject}?',
      options: ['Principle A', 'Principle B', 'Principle C', 'Principle D'],
      correctAnswer: 'Principle A',
      explanation: 'Principle A is a fundamental concept that underlies {subject}.',
      topic: 'Fundamental Principles',
      relatedConcepts: ['principles', 'fundamentals', 'basics']
    },
    {
      question: 'How does {subject} relate to other fields?',
      options: ['Relation A', 'Relation B', 'Relation C', 'Relation D'],
      correctAnswer: 'Relation A',
      explanation: '{subject} relates to other fields through Relation A.',
      topic: 'Interdisciplinary Connections',
      relatedConcepts: ['connections', 'relationships', 'integration']
    },
    {
      question: 'What is the historical background of {subject}?',
      options: ['History A', 'History B', 'History C', 'History D'],
      correctAnswer: 'History A',
      explanation: 'The historical development of {subject} follows History A.',
      topic: 'Historical Context',
      relatedConcepts: ['history', 'development', 'evolution']
    },
    {
      question: 'Which skill is essential for {subject}?',
      options: ['Skill A', 'Skill B', 'Skill C', 'Skill D'],
      correctAnswer: 'Skill A',
      explanation: 'Skill A is essential for success in {subject}.',
      topic: 'Essential Skills',
      relatedConcepts: ['skills', 'competencies', 'abilities']
    },
    {
      question: 'What is the scope of {subject}?',
      options: ['Scope A', 'Scope B', 'Scope C', 'Scope D'],
      correctAnswer: 'Scope A',
      explanation: 'The scope of {subject} encompasses Scope A.',
      topic: 'Scope and Applications',
      relatedConcepts: ['scope', 'applications', 'uses']
    }
  ],
  intermediate: [
    {
      question: 'What are the advanced concepts in {subject}?',
      options: ['Concept A', 'Concept B', 'Concept C', 'Concept D'],
      correctAnswer: 'Concept A',
      explanation: 'Advanced concepts in {subject} include Concept A.',
      topic: 'Advanced Concepts',
      relatedConcepts: ['advanced', 'complex', 'sophisticated']
    },
    {
      question: 'How do you implement {subject} in practice?',
      options: ['Implementation A', 'Implementation B', 'Implementation C', 'Implementation D'],
      correctAnswer: 'Implementation A',
      explanation: 'The practical implementation of {subject} involves Implementation A.',
      topic: 'Practical Implementation',
      relatedConcepts: ['implementation', 'practice', 'application']
    },
    {
      question: 'What are the challenges in {subject}?',
      options: ['Challenge A', 'Challenge B', 'Challenge C', 'Challenge D'],
      correctAnswer: 'Challenge A',
      explanation: 'One of the main challenges in {subject} is Challenge A.',
      topic: 'Challenges and Problems',
      relatedConcepts: ['challenges', 'problems', 'difficulties']
    },
    {
      question: 'How does {subject} integrate with other technologies?',
      options: ['Integration A', 'Integration B', 'Integration C', 'Integration D'],
      correctAnswer: 'Integration A',
      explanation: '{subject} integrates with other technologies through Integration A.',
      topic: 'Technology Integration',
      relatedConcepts: ['integration', 'compatibility', 'interoperability']
    },
    {
      question: 'What are the best practices in {subject}?',
      options: ['Practice A', 'Practice B', 'Practice C', 'Practice D'],
      correctAnswer: 'Practice A',
      explanation: 'Best practices in {subject} include Practice A.',
      topic: 'Best Practices',
      relatedConcepts: ['best practices', 'standards', 'guidelines']
    },
    {
      question: 'How do you optimize {subject} performance?',
      options: ['Optimization A', 'Optimization B', 'Optimization C', 'Optimization D'],
      correctAnswer: 'Optimization A',
      explanation: 'Performance optimization in {subject} involves Optimization A.',
      topic: 'Performance Optimization',
      relatedConcepts: ['optimization', 'performance', 'efficiency']
    },
    {
      question: 'What are the security considerations in {subject}?',
      options: ['Security A', 'Security B', 'Security C', 'Security D'],
      correctAnswer: 'Security A',
      explanation: 'Security considerations in {subject} include Security A.',
      topic: 'Security',
      relatedConcepts: ['security', 'safety', 'protection']
    },
    {
      question: 'How do you troubleshoot issues in {subject}?',
      options: ['Troubleshooting A', 'Troubleshooting B', 'Troubleshooting C', 'Troubleshooting D'],
      correctAnswer: 'Troubleshooting A',
      explanation: 'Troubleshooting in {subject} requires Troubleshooting A.',
      topic: 'Troubleshooting',
      relatedConcepts: ['troubleshooting', 'debugging', 'problem-solving']
    },
    {
      question: 'What are the scalability aspects of {subject}?',
      options: ['Scalability A', 'Scalability B', 'Scalability C', 'Scalability D'],
      correctAnswer: 'Scalability A',
      explanation: 'Scalability in {subject} involves Scalability A.',
      topic: 'Scalability',
      relatedConcepts: ['scalability', 'growth', 'expansion']
    },
    {
      question: 'How do you maintain {subject} systems?',
      options: ['Maintenance A', 'Maintenance B', 'Maintenance C', 'Maintenance D'],
      correctAnswer: 'Maintenance A',
      explanation: 'Maintaining {subject} systems requires Maintenance A.',
      topic: 'Maintenance',
      relatedConcepts: ['maintenance', 'upkeep', 'management']
    }
  ],
  advanced: [
    {
      question: 'What are the cutting-edge developments in {subject}?',
      options: ['Development A', 'Development B', 'Development C', 'Development D'],
      correctAnswer: 'Development A',
      explanation: 'Cutting-edge developments in {subject} include Development A.',
      topic: 'Emerging Trends',
      relatedConcepts: ['trends', 'innovations', 'advancements']
    },
    {
      question: 'How do you architect complex {subject} systems?',
      options: ['Architecture A', 'Architecture B', 'Architecture C', 'Architecture D'],
      correctAnswer: 'Architecture A',
      explanation: 'Complex {subject} systems require Architecture A.',
      topic: 'System Architecture',
      relatedConcepts: ['architecture', 'design', 'structure']
    },
    {
      question: 'What are the theoretical foundations of {subject}?',
      options: ['Theory A', 'Theory B', 'Theory C', 'Theory D'],
      correctAnswer: 'Theory A',
      explanation: 'The theoretical foundations of {subject} are based on Theory A.',
      topic: 'Theoretical Foundations',
      relatedConcepts: ['theory', 'foundations', 'principles']
    },
    {
      question: 'How do you conduct research in {subject}?',
      options: ['Research A', 'Research B', 'Research C', 'Research D'],
      correctAnswer: 'Research A',
      explanation: 'Research in {subject} involves Research A.',
      topic: 'Research Methods',
      relatedConcepts: ['research', 'methodology', 'investigation']
    },
    {
      question: 'What are the ethical considerations in {subject}?',
      options: ['Ethics A', 'Ethics B', 'Ethics C', 'Ethics D'],
      correctAnswer: 'Ethics A',
      explanation: 'Ethical considerations in {subject} include Ethics A.',
      topic: 'Ethics',
      relatedConcepts: ['ethics', 'morality', 'responsibility']
    },
    {
      question: 'How do you innovate in {subject}?',
      options: ['Innovation A', 'Innovation B', 'Innovation C', 'Innovation D'],
      correctAnswer: 'Innovation A',
      explanation: 'Innovation in {subject} requires Innovation A.',
      topic: 'Innovation',
      relatedConcepts: ['innovation', 'creativity', 'invention']
    },
    {
      question: 'What are the future directions of {subject}?',
      options: ['Future A', 'Future B', 'Future C', 'Future D'],
      correctAnswer: 'Future A',
      explanation: 'Future directions of {subject} point toward Future A.',
      topic: 'Future Trends',
      relatedConcepts: ['future', 'trends', 'predictions']
    },
    {
      question: 'How do you lead {subject} projects?',
      options: ['Leadership A', 'Leadership B', 'Leadership C', 'Leadership D'],
      correctAnswer: 'Leadership A',
      explanation: 'Leading {subject} projects requires Leadership A.',
      topic: 'Leadership',
      relatedConcepts: ['leadership', 'management', 'direction']
    },
    {
      question: 'What are the industry standards in {subject}?',
      options: ['Standard A', 'Standard B', 'Standard C', 'Standard D'],
      correctAnswer: 'Standard A',
      explanation: 'Industry standards in {subject} include Standard A.',
      topic: 'Industry Standards',
      relatedConcepts: ['standards', 'specifications', 'requirements']
    },
    {
      question: 'How do you contribute to {subject} community?',
      options: ['Contribution A', 'Contribution B', 'Contribution C', 'Contribution D'],
      correctAnswer: 'Contribution A',
      explanation: 'Contributing to the {subject} community involves Contribution A.',
      topic: 'Community Contribution',
      relatedConcepts: ['community', 'contribution', 'collaboration']
    }
  ],
  adaptive: [
    {
      question: 'What is the most efficient approach to {subject}?',
      options: ['Approach A', 'Approach B', 'Approach C', 'Approach D'],
      correctAnswer: 'Approach A',
      explanation: 'The most efficient approach to {subject} is Approach A.',
      topic: 'Efficiency',
      relatedConcepts: ['efficiency', 'optimization', 'effectiveness']
    },
    {
      question: 'How do you adapt {subject} to different contexts?',
      options: ['Adaptation A', 'Adaptation B', 'Adaptation C', 'Adaptation D'],
      correctAnswer: 'Adaptation A',
      explanation: 'Adapting {subject} to different contexts requires Adaptation A.',
      topic: 'Adaptation',
      relatedConcepts: ['adaptation', 'flexibility', 'versatility']
    },
    {
      question: 'What is the optimal solution for {subject} problems?',
      options: ['Solution A', 'Solution B', 'Solution C', 'Solution D'],
      correctAnswer: 'Solution A',
      explanation: 'The optimal solution for {subject} problems is Solution A.',
      topic: 'Problem Solving',
      relatedConcepts: ['problem solving', 'solutions', 'optimization']
    },
    {
      question: 'How do you customize {subject} for specific needs?',
      options: ['Customization A', 'Customization B', 'Customization C', 'Customization D'],
      correctAnswer: 'Customization A',
      explanation: 'Customizing {subject} for specific needs involves Customization A.',
      topic: 'Customization',
      relatedConcepts: ['customization', 'personalization', 'tailoring']
    },
    {
      question: 'What is the best strategy for {subject} implementation?',
      options: ['Strategy A', 'Strategy B', 'Strategy C', 'Strategy D'],
      correctAnswer: 'Strategy A',
      explanation: 'The best strategy for {subject} implementation is Strategy A.',
      topic: 'Strategy',
      relatedConcepts: ['strategy', 'planning', 'approach']
    },
    {
      question: 'How do you optimize {subject} for performance?',
      options: ['Optimization A', 'Optimization B', 'Optimization C', 'Optimization D'],
      correctAnswer: 'Optimization A',
      explanation: 'Optimizing {subject} for performance requires Optimization A.',
      topic: 'Performance Optimization',
      relatedConcepts: ['optimization', 'performance', 'efficiency']
    },
    {
      question: 'What is the most cost-effective approach to {subject}?',
      options: ['Cost A', 'Cost B', 'Cost C', 'Cost D'],
      correctAnswer: 'Cost A',
      explanation: 'The most cost-effective approach to {subject} is Cost A.',
      topic: 'Cost Effectiveness',
      relatedConcepts: ['cost', 'economics', 'value']
    },
    {
      question: 'How do you scale {subject} solutions?',
      options: ['Scaling A', 'Scaling B', 'Scaling C', 'Scaling D'],
      correctAnswer: 'Scaling A',
      explanation: 'Scaling {subject} solutions involves Scaling A.',
      topic: 'Scaling',
      relatedConcepts: ['scaling', 'growth', 'expansion']
    },
    {
      question: 'What is the most reliable method for {subject}?',
      options: ['Method A', 'Method B', 'Method C', 'Method D'],
      correctAnswer: 'Method A',
      explanation: 'The most reliable method for {subject} is Method A.',
      topic: 'Reliability',
      relatedConcepts: ['reliability', 'dependability', 'consistency']
    },
    {
      question: 'How do you ensure quality in {subject}?',
      options: ['Quality A', 'Quality B', 'Quality C', 'Quality D'],
      correctAnswer: 'Quality A',
      explanation: 'Ensuring quality in {subject} requires Quality A.',
      topic: 'Quality Assurance',
      relatedConcepts: ['quality', 'assurance', 'standards']
    }
  ]
};

// Function to replace placeholders in questions
function replacePlaceholders(template, subject) {
  return {
    question: template.question.replace(/{subject}/g, subject),
    options: template.options,
    correctAnswer: template.correctAnswer,
    explanation: template.explanation.replace(/{subject}/g, subject),
    topic: template.topic,
    relatedConcepts: template.relatedConcepts
  };
}

// Function to generate questions for all subjects
async function generateAllQuizQuestions() {
  console.log('Starting to generate quiz questions for all subjects...');
  
  let totalQuestions = 0;
  
  for (const subject of subjects) {
    console.log(`Generating questions for: ${subject}`);
    
    for (const [difficulty, templates] of Object.entries(questionTemplates)) {
      for (let i = 0; i < templates.length; i++) {
        const template = templates[i];
        const questionData = replacePlaceholders(template, subject);
        
        await prisma.question.create({
          data: {
            id: `${subject.toLowerCase().replace(/\s+/g, '-')}-${difficulty}-${i + 1}-${Math.random().toString(36).substr(2, 9)}`,
            question: questionData.question,
            options: questionData.options,
            correctAnswer: questionData.correctAnswer,
            explanation: questionData.explanation,
            category: subject,
            difficulty: difficulty,
            topic: questionData.topic,
            relatedConcepts: questionData.relatedConcepts,
          }
        });
        totalQuestions++;
      }
    }
  }
  
  console.log(`Successfully generated ${totalQuestions} quiz questions!`);
  console.log(`Generated ${subjects.length} subjects × 4 difficulties × 10 questions = ${subjects.length * 4 * 10} total questions`);
}

// Function to run the generation
async function main() {
  try {
    await generateAllQuizQuestions();
  } catch (error) {
    console.error('Error generating quiz questions:', error);
  } finally {
    await prisma.$disconnect();
  }
}

// Run the script
main(); 