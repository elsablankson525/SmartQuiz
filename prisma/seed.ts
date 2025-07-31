import { PrismaClient } from '@prisma/client'
import * as bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

async function main() {
  console.log('Seeding started')
  
  // Clear existing data
  await prisma.quizResult.deleteMany({});
  await prisma.question.deleteMany({});
  await prisma.quiz.deleteMany({});
  await prisma.leaderboardEntry.deleteMany({});
  await prisma.learningResource.deleteMany({});
  await prisma.learningPath.deleteMany({});
  await prisma.subject.deleteMany({});
  await prisma.session.deleteMany({});
  await prisma.account.deleteMany({});
  await prisma.user.deleteMany({});

  // Create Subjects
  const subjects = [
    { name: 'JavaScript Fundamentals', icon: '💻', description: 'Master JavaScript basics and modern ES6+ features.', color: 'bg-blue-100' },
    { name: 'Python Programming', icon: '🐍', description: 'Learn Python from basics to advanced concepts.', color: 'bg-green-100' },
    { name: 'Web Development', icon: '🌐', description: 'Full-stack web development with modern technologies.', color: 'bg-indigo-100' },
    { name: 'Data Science', icon: '📊', description: 'Introduction to data science and analytics.', color: 'bg-purple-100' },
    { name: 'Machine Learning', icon: '🤖', description: 'Introduction to machine learning and AI concepts.', color: 'bg-red-100' },
    { name: 'Human Anatomy', icon: '🫀', description: 'Comprehensive study of human body structure and function.', color: 'bg-red-100' },
    { name: 'Medical Terminology', icon: '🏥', description: 'Learn essential medical terms and their meanings.', color: 'bg-blue-100' },
    { name: 'Business Fundamentals', icon: '💼', description: 'Core business concepts and principles.', color: 'bg-blue-100' },
    { name: 'Digital Marketing', icon: '📈', description: 'Modern marketing strategies and digital platforms.', color: 'bg-green-100' },
    { name: 'Legal Fundamentals', icon: '⚖️', description: 'Basic legal concepts and principles.', color: 'bg-blue-100' },
    { name: 'Psychology Basics', icon: '🧠', description: 'Fundamental principles of human behavior and mental processes.', color: 'bg-blue-100' },
    { name: 'Mathematics', icon: '📐', description: 'Core mathematical concepts and problem-solving techniques.', color: 'bg-blue-100' },
  ];

  for (const subject of subjects) {
    await prisma.subject.upsert({
      where: { name: subject.name },
      update: {},
      create: subject,
    });
  }

  // Create Learning Paths
  const learningPaths = [
    {
      title: 'Web Development Fundamentals',
      description: 'Master the basics of web development with HTML, CSS, and JavaScript',
      category: 'JavaScript Fundamentals',
      difficulty: 'beginner',
      estimatedDuration: '12 weeks',
      prerequisites: ['Basic computer skills'],
      progress: 0,
      isActive: true,
    },
    {
      title: 'Python for Beginners',
      description: 'Learn Python programming from scratch',
      category: 'Python Programming',
      difficulty: 'beginner',
      estimatedDuration: '8 weeks',
      prerequisites: ['Basic computer skills'],
      progress: 0,
      isActive: true,
    },
    {
      title: 'Data Science Essentials',
      description: 'Introduction to data science and analytics',
      category: 'Data Science',
      difficulty: 'intermediate',
      estimatedDuration: '10 weeks',
      prerequisites: ['Python Programming', 'Mathematics'],
      progress: 0,
      isActive: true,
    },
  ];

  for (const path of learningPaths) {
    await prisma.learningPath.create({ data: path });
  }

  // Create Learning Resources
  const resources = [
    {
      title: 'MDN JavaScript Guide',
      type: 'tutorial',
      url: 'https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide',
      difficulty: 'beginner',
      category: 'Computer Science',
      topic: 'javascript',
      description: 'Comprehensive JavaScript documentation and tutorials',
      readTime: '45 min',
      provider: 'Mozilla',
      rating: 4.9,
      tags: ['javascript', 'fundamentals', 'mdn'],
      language: 'English',
      isFree: true,
    },
    {
      title: 'Python Official Documentation',
      type: 'tutorial',
      url: 'https://docs.python.org/3/tutorial/',
      difficulty: 'beginner',
      category: 'Computer Science',
      topic: 'python',
      description: 'Official Python language tutorial and reference',
      readTime: '90 min',
      provider: 'Python.org',
      rating: 4.9,
      tags: ['python', 'official', 'tutorial'],
      language: 'English',
      isFree: true,
    },
    {
      title: 'Khan Academy Anatomy',
      type: 'video',
      url: 'https://www.khanacademy.org/science/health-and-medicine',
      difficulty: 'beginner',
      category: 'Health & Medicine',
      topic: 'anatomy',
      description: 'Comprehensive anatomy and physiology courses',
      duration: '45 min',
      provider: 'Khan Academy',
      rating: 4.8,
      tags: ['anatomy', 'physiology', 'health'],
      language: 'English',
      isFree: true,
    },
  ];

  for (const resource of resources) {
    await prisma.learningResource.create({ data: resource });
  }

  // Create Quiz Questions
  const questions = [
    {
      id: 'js-1',
      question: "What is the output of console.log(typeof NaN)?",
      options: ["'number'", "'NaN'", "'undefined'", "'object'"],
      correctAnswer: "'number'",
      explanation: "In JavaScript, NaN (Not a Number) is actually of type 'number'. This is because NaN represents an invalid number value, but it's still within the number type system.",
      category: "Computer Science",
      difficulty: "intermediate",
      topic: "javascript",
      relatedConcepts: ["data types", "type coercion", "NaN"],
    },
    {
      id: 'js-2',
      question: "Which method adds elements to the end of an array?",
      options: ["push()", "pop()", "unshift()", "shift()"],
      correctAnswer: "push()",
      explanation: "The push() method adds one or more elements to the end of an array and returns the new length.",
      category: "Computer Science",
      difficulty: "beginner",
      topic: "javascript",
      relatedConcepts: ["arrays", "methods", "data manipulation"],
    },
    {
      id: 'python-1',
      question: "What is the correct way to create a function in Python?",
      options: ["function myFunc():", "def myFunc():", "create myFunc():", "func myFunc():"],
      correctAnswer: "def myFunc():",
      explanation: "In Python, functions are defined using the 'def' keyword followed by the function name and parentheses.",
      category: "Computer Science",
      difficulty: "beginner",
      topic: "python",
      relatedConcepts: ["functions", "syntax", "keywords"],
    },
    {
      id: 'health-1',
      question: "Which vitamin is primarily produced when skin is exposed to sunlight?",
      options: ["Vitamin A", "Vitamin C", "Vitamin D", "Vitamin K"],
      correctAnswer: "Vitamin D",
      explanation: "Vitamin D is synthesized in the skin when exposed to UVB radiation from sunlight.",
      category: "Health & Medicine",
      difficulty: "beginner",
      topic: "nutrition",
      relatedConcepts: ["vitamins", "metabolism", "sunlight"],
    },
    {
      id: 'business-1',
      question: "What does ROI stand for in business?",
      options: ["Return on Investment", "Rate of Interest", "Revenue over Income", "Risk of Investment"],
      correctAnswer: "Return on Investment",
      explanation: "ROI (Return on Investment) is a key financial metric that measures the efficiency of an investment.",
      category: "Business",
      difficulty: "beginner",
      topic: "finance",
      relatedConcepts: ["financial metrics", "investment analysis", "profitability"],
    },
  ];

  for (const question of questions) {
    await prisma.question.create({ data: question });
  }

  // Create sample users with properly hashed passwords
  const hashedPassword = await bcrypt.hash('password123', 12);
  
  const users = [
    {
      name: 'John Doe',
      email: 'john@example.com',
      password: hashedPassword,
    },
    {
      name: 'Jane Smith',
      email: 'jane@example.com',
      password: hashedPassword,
    },
  ];

  for (const user of users) {
    await prisma.user.upsert({
      where: { email: user.email },
      update: {},
      create: user,
    });
  }

  // Create sample leaderboard entries
  const leaderboardEntries = [
    {
      userId: (await prisma.user.findFirst({ where: { email: 'john@example.com' } }))?.id || '',
      score: 850,
      quizzes: 15,
      streak: 7,
      badge: 'Gold',
      subjects: ['JavaScript Fundamentals', 'Python Programming'],
      timeframe: 'weekly',
    },
    {
      userId: (await prisma.user.findFirst({ where: { email: 'jane@example.com' } }))?.id || '',
      score: 920,
      quizzes: 20,
      streak: 12,
      badge: 'Platinum',
      subjects: ['Web Development', 'Data Science'],
      timeframe: 'weekly',
    },
  ];

  for (const entry of leaderboardEntries) {
    if (entry.userId) {
      await prisma.leaderboardEntry.create({ data: entry });
    }
  }

  console.log('Seeding completed successfully!')
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  }) 