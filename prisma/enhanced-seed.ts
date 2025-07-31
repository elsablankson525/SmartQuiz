import { PrismaClient } from '@prisma/client'
import * as bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

async function main() {
  console.log('Enhanced seeding started')
  
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
  await prisma.userPreferences.deleteMany({});
  await prisma.studyPlan.deleteMany({});
  await prisma.achievement.deleteMany({});
  await prisma.quizQuestion.deleteMany({});
  await prisma.userLessonProgress.deleteMany({});
  await prisma.userCertificate.deleteMany({});
  await prisma.resource.deleteMany({});
  await prisma.lesson.deleteMany({});
  await prisma.category.deleteMany({});

  // Create Enhanced Subjects
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
    { name: 'React Development', icon: '⚛️', description: 'Learn React.js for building modern web applications.', color: 'bg-cyan-100' },
    { name: 'Node.js Backend', icon: '🟢', description: 'Server-side JavaScript development with Node.js.', color: 'bg-green-100' },
    { name: 'Database Design', icon: '🗄️', description: 'Database concepts, SQL, and data modeling.', color: 'bg-orange-100' },
    { name: 'DevOps & CI/CD', icon: '🔧', description: 'Development operations and continuous integration.', color: 'bg-gray-100' },
    { name: 'Cybersecurity', icon: '🔒', description: 'Information security and ethical hacking.', color: 'bg-red-100' },
    { name: 'Mobile Development', icon: '📱', description: 'iOS and Android app development.', color: 'bg-purple-100' },
    { name: 'Cloud Computing', icon: '☁️', description: 'AWS, Azure, and Google Cloud platforms.', color: 'bg-blue-100' },
    { name: 'Blockchain & Crypto', icon: '⛓️', description: 'Blockchain technology and cryptocurrency.', color: 'bg-yellow-100' },
  ];

  for (const subject of subjects) {
    await prisma.subject.upsert({
      where: { name: subject.name },
      update: {},
      create: subject,
    });
  }

  // Create Categories
  const categories = [
    {
      name: 'Computer Science',
      description: 'Programming, algorithms, and software development',
      icon: '💻',
      color: 'bg-blue-100',
      iconColor: 'text-blue-600',
      questionCount: 150,
    },
    {
      name: 'Health & Medicine',
      description: 'Medical terminology, anatomy, and healthcare',
      icon: '🏥',
      color: 'bg-red-100',
      iconColor: 'text-red-600',
      questionCount: 120,
    },
    {
      name: 'Business & Marketing',
      description: 'Business fundamentals and digital marketing',
      icon: '💼',
      color: 'bg-green-100',
      iconColor: 'text-green-600',
      questionCount: 100,
    },
    {
      name: 'Mathematics',
      description: 'Core mathematical concepts and problem-solving',
      icon: '📐',
      color: 'bg-purple-100',
      iconColor: 'text-purple-600',
      questionCount: 80,
    },
    {
      name: 'Data Science',
      description: 'Data analysis, machine learning, and AI',
      icon: '📊',
      color: 'bg-orange-100',
      iconColor: 'text-orange-600',
      questionCount: 90,
    },
  ];

  for (const category of categories) {
    await prisma.category.upsert({
      where: { name: category.name },
      update: {},
      create: category,
    });
  }

  // Create Enhanced Learning Paths
  const learningPaths = [
    // JavaScript & Web Development Paths
    {
      title: 'JavaScript Fundamentals',
      description: 'Master JavaScript basics and modern ES6+ features',
      category: 'JavaScript Fundamentals',
      difficulty: 'beginner',
      estimatedDuration: '8 weeks',
      prerequisites: ['Basic computer skills'],
      progress: 0,
      isActive: true,
    },
    {
      title: 'Advanced JavaScript',
      description: 'Deep dive into advanced JavaScript concepts and patterns',
      category: 'JavaScript Fundamentals',
      difficulty: 'intermediate',
      estimatedDuration: '10 weeks',
      prerequisites: ['JavaScript Fundamentals'],
      progress: 0,
      isActive: true,
    },
    {
      title: 'React.js Mastery',
      description: 'Build modern web applications with React.js',
      category: 'React Development',
      difficulty: 'intermediate',
      estimatedDuration: '12 weeks',
      prerequisites: ['JavaScript Fundamentals'],
      progress: 0,
      isActive: true,
    },
    {
      title: 'Full-Stack Web Development',
      description: 'Complete web development from frontend to backend',
      category: 'Web Development',
      difficulty: 'intermediate',
      estimatedDuration: '16 weeks',
      prerequisites: ['JavaScript Fundamentals', 'Database Design'],
      progress: 0,
      isActive: true,
    },
    
    // Python Paths
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
      title: 'Python for Data Science',
      description: 'Data analysis and visualization with Python',
      category: 'Python Programming',
      difficulty: 'intermediate',
      estimatedDuration: '10 weeks',
      prerequisites: ['Python for Beginners', 'Mathematics'],
      progress: 0,
      isActive: true,
    },
    
    // Data Science Paths
    {
      title: 'Data Science Essentials',
      description: 'Introduction to data science and analytics',
      category: 'Data Science',
      difficulty: 'intermediate',
      estimatedDuration: '12 weeks',
      prerequisites: ['Python Programming', 'Mathematics'],
      progress: 0,
      isActive: true,
    },
    {
      title: 'Machine Learning Fundamentals',
      description: 'Introduction to machine learning algorithms and concepts',
      category: 'Machine Learning',
      difficulty: 'intermediate',
      estimatedDuration: '14 weeks',
      prerequisites: ['Data Science Essentials', 'Mathematics'],
      progress: 0,
      isActive: true,
    },
    
    // Backend Development Paths
    {
      title: 'Node.js Backend Development',
      description: 'Build scalable backend services with Node.js',
      category: 'Node.js Backend',
      difficulty: 'intermediate',
      estimatedDuration: '10 weeks',
      prerequisites: ['JavaScript Fundamentals'],
      progress: 0,
      isActive: true,
    },
    {
      title: 'Database Design & SQL',
      description: 'Learn database design principles and SQL',
      category: 'Database Design',
      difficulty: 'beginner',
      estimatedDuration: '8 weeks',
      prerequisites: ['Basic computer skills'],
      progress: 0,
      isActive: true,
    },
    
    // Business & Marketing Paths
    {
      title: 'Business Fundamentals',
      description: 'Core business concepts and entrepreneurship',
      category: 'Business Fundamentals',
      difficulty: 'beginner',
      estimatedDuration: '10 weeks',
      prerequisites: ['Basic computer skills'],
      progress: 0,
      isActive: true,
    },
    {
      title: 'Digital Marketing Strategy',
      description: 'Modern marketing strategies and digital platforms',
      category: 'Digital Marketing',
      difficulty: 'intermediate',
      estimatedDuration: '12 weeks',
      prerequisites: ['Business Fundamentals'],
      progress: 0,
      isActive: true,
    },
    
    // Health & Medical Paths
    {
      title: 'Human Anatomy & Physiology',
      description: 'Comprehensive study of human body structure and function',
      category: 'Human Anatomy',
      difficulty: 'intermediate',
      estimatedDuration: '16 weeks',
      prerequisites: ['Basic biology knowledge'],
      progress: 0,
      isActive: true,
    },
    {
      title: 'Medical Terminology',
      description: 'Learn essential medical terms and their meanings',
      category: 'Medical Terminology',
      difficulty: 'beginner',
      estimatedDuration: '8 weeks',
      prerequisites: ['Basic English'],
      progress: 0,
      isActive: true,
    },
  ];

  for (const path of learningPaths) {
    await prisma.learningPath.create({ data: path });
  }

  // Create Enhanced Learning Resources
  const resources = [
    // JavaScript Resources
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
      title: 'Eloquent JavaScript',
      type: 'book',
      url: 'https://eloquentjavascript.net/',
      difficulty: 'intermediate',
      category: 'Computer Science',
      topic: 'javascript',
      description: 'Free online book covering JavaScript programming',
      readTime: '120 min',
      provider: 'Marijn Haverbeke',
      rating: 4.8,
      tags: ['javascript', 'book', 'programming'],
      language: 'English',
      isFree: true,
    },
    {
      title: 'JavaScript.info',
      type: 'tutorial',
      url: 'https://javascript.info/',
      difficulty: 'intermediate',
      category: 'Computer Science',
      topic: 'javascript',
      description: 'Modern JavaScript tutorial',
      readTime: '60 min',
      provider: 'javascript.info',
      rating: 4.9,
      tags: ['javascript', 'modern', 'es6'],
      language: 'English',
      isFree: true,
    },
    
    // Python Resources
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
      title: 'Real Python Tutorials',
      type: 'tutorial',
      url: 'https://realpython.com/',
      difficulty: 'beginner',
      category: 'Computer Science',
      topic: 'python',
      description: 'High-quality Python tutorials and articles',
      readTime: '30 min',
      provider: 'Real Python',
      rating: 4.8,
      tags: ['python', 'tutorials', 'practical'],
      language: 'English',
      isFree: true,
    },
    
    // React Resources
    {
      title: 'React Official Tutorial',
      type: 'tutorial',
      url: 'https://react.dev/learn',
      difficulty: 'intermediate',
      category: 'Computer Science',
      topic: 'react',
      description: 'Official React.js tutorial and documentation',
      readTime: '60 min',
      provider: 'Meta',
      rating: 4.9,
      tags: ['react', 'frontend', 'javascript'],
      language: 'English',
      isFree: true,
    },
    {
      title: 'React Router Tutorial',
      type: 'video',
      url: 'https://www.youtube.com/watch?v=Law7wfdg_ls',
      difficulty: 'intermediate',
      category: 'Computer Science',
      topic: 'react',
      description: 'Complete React Router tutorial',
      duration: '45 min',
      provider: 'Web Dev Simplified',
      rating: 4.7,
      tags: ['react', 'routing', 'frontend'],
      language: 'English',
      isFree: true,
    },
    
    // Data Science Resources
    {
      title: 'Pandas Documentation',
      type: 'tutorial',
      url: 'https://pandas.pydata.org/docs/',
      difficulty: 'intermediate',
      category: 'Data Science',
      topic: 'pandas',
      description: 'Official pandas library documentation',
      readTime: '75 min',
      provider: 'Pandas',
      rating: 4.8,
      tags: ['python', 'pandas', 'data-analysis'],
      language: 'English',
      isFree: true,
    },
    {
      title: 'NumPy Tutorial',
      type: 'tutorial',
      url: 'https://numpy.org/doc/stable/user/quickstart.html',
      difficulty: 'intermediate',
      category: 'Data Science',
      topic: 'numpy',
      description: 'NumPy quickstart tutorial',
      readTime: '45 min',
      provider: 'NumPy',
      rating: 4.7,
      tags: ['python', 'numpy', 'numerical-computing'],
      language: 'English',
      isFree: true,
    },
    
    // Health & Medical Resources
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
    {
      title: 'Medical Terminology Course',
      type: 'course',
      url: 'https://www.coursera.org/learn/medical-terminology',
      difficulty: 'beginner',
      category: 'Health & Medicine',
      topic: 'medical-terminology',
      description: 'Comprehensive medical terminology course',
      duration: '8 weeks',
      provider: 'Coursera',
      rating: 4.6,
      tags: ['medical', 'terminology', 'healthcare'],
      language: 'English',
      isFree: false,
    },
    
    // Business Resources
    {
      title: 'Harvard Business Review',
      type: 'article',
      url: 'https://hbr.org/',
      difficulty: 'intermediate',
      category: 'Business',
      topic: 'business-strategy',
      description: 'Leading business management publication',
      readTime: '15 min',
      provider: 'Harvard Business Review',
      rating: 4.9,
      tags: ['business', 'management', 'strategy'],
      language: 'English',
      isFree: false,
    },
    {
      title: 'Digital Marketing Course',
      type: 'course',
      url: 'https://www.udemy.com/course/learn-digital-marketing-course/',
      difficulty: 'beginner',
      category: 'Marketing',
      topic: 'digital-marketing',
      description: 'Complete digital marketing course',
      duration: '12 hours',
      provider: 'Udemy',
      rating: 4.5,
      tags: ['marketing', 'digital', 'social-media'],
      language: 'English',
      isFree: false,
    },
    
    // Mathematics Resources
    {
      title: 'Khan Academy Math',
      type: 'video',
      url: 'https://www.khanacademy.org/math',
      difficulty: 'beginner',
      category: 'Mathematics',
      topic: 'mathematics',
      description: 'Comprehensive mathematics courses',
      duration: '30 min',
      provider: 'Khan Academy',
      rating: 4.9,
      tags: ['mathematics', 'algebra', 'calculus'],
      language: 'English',
      isFree: true,
    },
    {
      title: 'MIT OpenCourseWare Math',
      type: 'course',
      url: 'https://ocw.mit.edu/courses/mathematics/',
      difficulty: 'advanced',
      category: 'Mathematics',
      topic: 'mathematics',
      description: 'MIT mathematics courses',
      duration: '16 weeks',
      provider: 'MIT',
      rating: 4.9,
      tags: ['mathematics', 'advanced', 'university'],
      language: 'English',
      isFree: true,
    },
  ];

  for (const resource of resources) {
    await prisma.learningResource.create({ data: resource });
  }

  // Create Enhanced Quiz Questions
  const questions = [
    // JavaScript Questions
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
      id: 'js-3',
      question: "What is the difference between '==' and '===' in JavaScript?",
      options: ["No difference", "== checks value and type, === checks only value", "== checks only value, === checks value and type", "== is deprecated"],
      correctAnswer: "== checks only value, === checks value and type",
      explanation: "== performs type coercion before comparison, while === checks both value and type without coercion.",
      category: "Computer Science",
      difficulty: "intermediate",
      topic: "javascript",
      relatedConcepts: ["operators", "type coercion", "comparison"],
    },
    {
      id: 'js-4',
      question: "What is a closure in JavaScript?",
      options: ["A function that has access to variables in its outer scope", "A way to close browser tabs", "A method to end loops", "A type of variable"],
      correctAnswer: "A function that has access to variables in its outer scope",
      explanation: "A closure is a function that has access to variables in its outer (enclosing) scope even after the outer function has returned.",
      category: "Computer Science",
      difficulty: "advanced",
      topic: "javascript",
      relatedConcepts: ["functions", "scope", "closures"],
    },
    
    // Python Questions
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
      id: 'python-2',
      question: "What is the output of print(type([]))?",
      options: ["<class 'list'>", "<class 'array'>", "<class 'tuple'>", "<class 'set'>"],
      correctAnswer: "<class 'list'>",
      explanation: "In Python, [] creates a list object, so type([]) returns <class 'list'>.",
      category: "Computer Science",
      difficulty: "beginner",
      topic: "python",
      relatedConcepts: ["data types", "lists", "type function"],
    },
    {
      id: 'python-3',
      question: "What is a list comprehension?",
      options: ["A way to read lists", "A concise way to create lists", "A method to sort lists", "A type of loop"],
      correctAnswer: "A concise way to create lists",
      explanation: "List comprehensions provide a concise way to create lists based on existing sequences or iterables.",
      category: "Computer Science",
      difficulty: "intermediate",
      topic: "python",
      relatedConcepts: ["lists", "comprehensions", "functional programming"],
    },
    
    // React Questions
    {
      id: 'react-1',
      question: "What is JSX in React?",
      options: ["A JavaScript library", "A syntax extension for JavaScript", "A CSS framework", "A database"],
      correctAnswer: "A syntax extension for JavaScript",
      explanation: "JSX is a syntax extension for JavaScript that allows you to write HTML-like code in JavaScript.",
      category: "Computer Science",
      difficulty: "beginner",
      topic: "react",
      relatedConcepts: ["jsx", "react", "frontend"],
    },
    {
      id: 'react-2',
      question: "What is the purpose of useState hook?",
      options: ["To create global state", "To manage component state", "To connect to databases", "To handle routing"],
      correctAnswer: "To manage component state",
      explanation: "useState is a React hook that allows functional components to manage local state.",
      category: "Computer Science",
      difficulty: "intermediate",
      topic: "react",
      relatedConcepts: ["hooks", "state management", "functional components"],
    },
    
    // Data Science Questions
    {
      id: 'ds-1',
      question: "What is pandas used for in data science?",
      options: ["Web development", "Data manipulation and analysis", "Machine learning", "Database management"],
      correctAnswer: "Data manipulation and analysis",
      explanation: "Pandas is a Python library used for data manipulation and analysis, providing data structures like DataFrames.",
      category: "Data Science",
      difficulty: "intermediate",
      topic: "pandas",
      relatedConcepts: ["data analysis", "python", "dataframes"],
    },
    {
      id: 'ds-2',
      question: "What is overfitting in machine learning?",
      options: ["When a model performs too well on training data", "When a model is too simple", "When data is missing", "When features are correlated"],
      correctAnswer: "When a model performs too well on training data",
      explanation: "Overfitting occurs when a model learns the training data too well, including noise, and fails to generalize to new data.",
      category: "Data Science",
      difficulty: "intermediate",
      topic: "machine-learning",
      relatedConcepts: ["overfitting", "model evaluation", "generalization"],
    },
    
    // Health & Medical Questions
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
      id: 'health-2',
      question: "What is the largest organ in the human body?",
      options: ["Heart", "Brain", "Liver", "Skin"],
      correctAnswer: "Skin",
      explanation: "The skin is the largest organ in the human body, covering approximately 20 square feet in adults.",
      category: "Health & Medicine",
      difficulty: "beginner",
      topic: "anatomy",
      relatedConcepts: ["human body", "organs", "anatomy"],
    },
    {
      id: 'health-3',
      question: "What does 'cardio-' mean in medical terminology?",
      options: ["Heart", "Brain", "Lung", "Liver"],
      correctAnswer: "Heart",
      explanation: "The prefix 'cardio-' refers to the heart in medical terminology.",
      category: "Health & Medicine",
      difficulty: "beginner",
      topic: "medical-terminology",
      relatedConcepts: ["prefixes", "medical terms", "anatomy"],
    },
    
    // Business Questions
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
    {
      id: 'business-2',
      question: "What is a SWOT analysis?",
      options: ["A financial statement", "A strategic planning tool", "A marketing campaign", "A legal document"],
      correctAnswer: "A strategic planning tool",
      explanation: "SWOT analysis evaluates Strengths, Weaknesses, Opportunities, and Threats for strategic planning.",
      category: "Business",
      difficulty: "intermediate",
      topic: "strategy",
      relatedConcepts: ["strategic planning", "business analysis", "management"],
    },
    {
      id: 'business-3',
      question: "What is the primary goal of marketing?",
      options: ["To reduce costs", "To create value for customers", "To increase prices", "To minimize competition"],
      correctAnswer: "To create value for customers",
      explanation: "The primary goal of marketing is to create value for customers and build strong customer relationships.",
      category: "Business",
      difficulty: "beginner",
      topic: "marketing",
      relatedConcepts: ["marketing", "customer value", "business strategy"],
    },
    
    // Mathematics Questions
    {
      id: 'math-1',
      question: "What is the derivative of x²?",
      options: ["x", "2x", "x³", "2x²"],
      correctAnswer: "2x",
      explanation: "The derivative of x² is 2x, using the power rule of differentiation.",
      category: "Mathematics",
      difficulty: "intermediate",
      topic: "calculus",
      relatedConcepts: ["derivatives", "power rule", "calculus"],
    },
    {
      id: 'math-2',
      question: "What is the Pythagorean theorem?",
      options: ["a + b = c", "a² + b² = c²", "a × b = c", "a ÷ b = c"],
      correctAnswer: "a² + b² = c²",
      explanation: "The Pythagorean theorem states that in a right triangle, a² + b² = c², where c is the hypotenuse.",
      category: "Mathematics",
      difficulty: "beginner",
      topic: "geometry",
      relatedConcepts: ["right triangles", "geometry", "theorems"],
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
    {
      name: 'Alice Johnson',
      email: 'alice@example.com',
      password: hashedPassword,
    },
    {
      name: 'Bob Wilson',
      email: 'bob@example.com',
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
    {
      userId: (await prisma.user.findFirst({ where: { email: 'alice@example.com' } }))?.id || '',
      score: 780,
      quizzes: 12,
      streak: 5,
      badge: 'Silver',
      subjects: ['React Development', 'Node.js Backend'],
      timeframe: 'weekly',
    },
    {
      userId: (await prisma.user.findFirst({ where: { email: 'bob@example.com' } }))?.id || '',
      score: 650,
      quizzes: 8,
      streak: 3,
      badge: 'Bronze',
      subjects: ['Business Fundamentals', 'Digital Marketing'],
      timeframe: 'weekly',
    },
  ];

  for (const entry of leaderboardEntries) {
    if (entry.userId) {
      await prisma.leaderboardEntry.create({ data: entry });
    }
  }

  // Create Lessons for each subject
  const allSubjects = await prisma.subject.findMany();
  for (const subject of allSubjects) {
    const lessons = [
      {
        title: `Introduction to ${subject.name}`,
        type: 'video',
        content: `Welcome to ${subject.name}! This lesson covers the fundamentals and basic concepts.`,
        duration: '30 min',
        order: 1,
        isFree: true,
        subjectId: subject.id,
      },
      {
        title: `${subject.name} Fundamentals`,
        type: 'interactive',
        content: `Learn the core principles and essential concepts of ${subject.name}.`,
        duration: '45 min',
        order: 2,
        isFree: true,
        subjectId: subject.id,
      },
      {
        title: `Advanced ${subject.name}`,
        type: 'practice',
        content: `Deep dive into advanced topics and practical applications of ${subject.name}.`,
        duration: '60 min',
        order: 3,
        isFree: false,
        subjectId: subject.id,
      },
    ];

    for (const lesson of lessons) {
      await prisma.lesson.create({ data: lesson });
    }
  }

  // Create Resources for lessons
  const lessons = await prisma.lesson.findMany();
  for (const lesson of lessons) {
    const resources = [
      {
        title: `${lesson.title} - Video Tutorial`,
        type: 'video',
        url: `https://example.com/videos/${lesson.id}`,
        description: `Comprehensive video tutorial for ${lesson.title}`,
        lessonId: lesson.id,
        subjectId: lesson.subjectId,
      },
      {
        title: `${lesson.title} - Documentation`,
        type: 'documentation',
        url: `https://example.com/docs/${lesson.id}`,
        description: `Detailed documentation and reference materials`,
        lessonId: lesson.id,
        subjectId: lesson.subjectId,
      },
    ];

    for (const resource of resources) {
      await prisma.resource.create({ data: resource });
    }
  }

  // Create User Preferences for each user
  const allUsers = await prisma.user.findMany();
  for (const user of allUsers) {
    await prisma.userPreferences.create({
      data: {
        userId: user.id,
        learningStyle: ['visual', 'auditory', 'kinesthetic'][Math.floor(Math.random() * 3)],
        preferredTimeOfDay: ['morning', 'afternoon', 'evening'][Math.floor(Math.random() * 3)],
        studySessionDuration: [30, 45, 60][Math.floor(Math.random() * 3)],
        weeklyStudyHours: [5, 10, 15, 20][Math.floor(Math.random() * 4)],
        preferredDifficulty: ['beginner', 'intermediate', 'advanced'][Math.floor(Math.random() * 3)],
        preferredSubjects: ['JavaScript Fundamentals', 'Python Programming', 'Web Development'],
        quizTimeLimit: 30,
        showExplanations: true,
        enableSmartRecommendations: true,
        enableStudyPlans: true,
        enableProgressTracking: true,
        enableAdaptiveLearning: true,
        emailNotifications: true,
        pushNotifications: true,
        weeklyProgressReport: true,
        achievementAlerts: true,
        targetScore: 85,
        targetSubjects: ['JavaScript Fundamentals', 'Python Programming'],
        learningGoals: ['Master JavaScript basics', 'Learn Python programming'],
      },
    });
  }

  // Create Study Plans for users
  for (const user of allUsers) {
    const studyPlans = [
      {
        userId: user.id,
        title: 'JavaScript Mastery Plan',
        description: 'Complete JavaScript learning path from basics to advanced concepts',
        subject: 'JavaScript Fundamentals',
        difficulty: 'intermediate',
        duration: '8 weeks',
        goals: ['Master ES6+ features', 'Understand async programming', 'Build real projects'],
        milestones: [
          { title: 'Week 1-2: Basics', completed: false },
          { title: 'Week 3-4: Intermediate', completed: false },
          { title: 'Week 5-6: Advanced', completed: false },
          { title: 'Week 7-8: Projects', completed: false },
        ],
        progress: 0,
        isActive: true,
      },
      {
        userId: user.id,
        title: 'Python for Data Science',
        description: 'Learn Python programming with focus on data science applications',
        subject: 'Python Programming',
        difficulty: 'intermediate',
        duration: '10 weeks',
        goals: ['Learn Python syntax', 'Master data manipulation', 'Build ML models'],
        milestones: [
          { title: 'Week 1-3: Python Basics', completed: false },
          { title: 'Week 4-6: Data Analysis', completed: false },
          { title: 'Week 7-9: Machine Learning', completed: false },
          { title: 'Week 10: Final Project', completed: false },
        ],
        progress: 0,
        isActive: true,
      },
    ];

    for (const plan of studyPlans) {
      await prisma.studyPlan.create({ data: plan });
    }
  }

  // Create Achievements
  const achievements = [
    {
      title: 'First Steps',
      description: 'Complete your first lesson',
      icon: '🎯',
      points: 10,
      criteria: { type: 'lesson_completion', count: 1 },
    },
    {
      title: 'Quiz Master',
      description: 'Score 100% on any quiz',
      icon: '🏆',
      points: 50,
      criteria: { type: 'perfect_quiz', count: 1 },
    },
    {
      title: 'Streak Champion',
      description: 'Maintain a 7-day study streak',
      icon: '🔥',
      points: 100,
      criteria: { type: 'study_streak', days: 7 },
    },
    {
      title: 'Subject Expert',
      description: 'Complete all lessons in a subject',
      icon: '🎓',
      points: 200,
      criteria: { type: 'subject_completion', count: 1 },
    },
    {
      title: 'Early Bird',
      description: 'Study for 5 consecutive days in the morning',
      icon: '🌅',
      points: 75,
      criteria: { type: 'morning_streak', days: 5 },
    },
    {
      title: 'Night Owl',
      description: 'Study for 5 consecutive days in the evening',
      icon: '🦉',
      points: 75,
      criteria: { type: 'evening_streak', days: 5 },
    },
    {
      title: 'Consistent Learner',
      description: 'Study for 30 days',
      icon: '📚',
      points: 300,
      criteria: { type: 'total_study_days', days: 30 },
    },
    {
      title: 'Quiz Enthusiast',
      description: 'Take 50 quizzes',
      icon: '📝',
      points: 150,
      criteria: { type: 'quiz_count', count: 50 },
    },
  ];

  for (const achievement of achievements) {
    await prisma.achievement.create({ data: achievement });
  }

  // Create Quiz Questions (additional to existing questions)
  const additionalQuestions = [
    {
      id: 'quiz-js-1',
      question: 'What is the purpose of the "use strict" directive in JavaScript?',
      options: [
        'To enable strict type checking',
        'To enforce stricter parsing and error handling',
        'To improve performance',
        'To enable new ES6 features'
      ],
      correctAnswer: 'To enforce stricter parsing and error handling',
      explanation: 'The "use strict" directive enables strict mode, which catches common coding mistakes and prevents certain unsafe actions.',
      category: 'JavaScript Fundamentals',
      difficulty: 'intermediate',
      topic: 'javascript',
      tags: ['strict-mode', 'javascript', 'best-practices'],
    },
    {
      id: 'quiz-python-1',
      question: 'What is a decorator in Python?',
      options: [
        'A function that modifies another function',
        'A type of variable',
        'A loop construct',
        'A data structure'
      ],
      correctAnswer: 'A function that modifies another function',
      explanation: 'A decorator is a function that takes another function as input and returns a modified version of that function.',
      category: 'Python Programming',
      difficulty: 'intermediate',
      topic: 'python',
      tags: ['decorators', 'python', 'functions'],
    },
    {
      id: 'quiz-react-1',
      question: 'What is the Virtual DOM in React?',
      options: [
        'A real DOM element',
        'A lightweight copy of the actual DOM',
        'A database',
        'A styling framework'
      ],
      correctAnswer: 'A lightweight copy of the actual DOM',
      explanation: 'The Virtual DOM is a lightweight copy of the actual DOM that React uses to optimize rendering performance.',
      category: 'React Development',
      difficulty: 'intermediate',
      topic: 'react',
      tags: ['virtual-dom', 'react', 'performance'],
    },
  ];

  for (const question of additionalQuestions) {
    await prisma.quizQuestion.create({ data: question });
  }

  // Create some sample user lesson progress
  const sampleUsers = await prisma.user.findMany({ take: 2 });
  const sampleLessons = await prisma.lesson.findMany({ take: 3 });
  
  for (const user of sampleUsers) {
    for (const lesson of sampleLessons) {
      if (Math.random() > 0.5) { // 50% chance of completion
        await prisma.userLessonProgress.create({
          data: {
            userId: user.id,
            subjectId: lesson.subjectId,
            lessonId: lesson.id,
            completedAt: new Date(),
          },
        });
      }
    }
  }

  // Create some sample certificates
  const completedSubjects = await prisma.subject.findMany({ take: 2 });
  for (const user of sampleUsers) {
    for (const subject of completedSubjects) {
      await prisma.userCertificate.create({
        data: {
          userId: user.id,
          subjectId: subject.id,
          issuedAt: new Date(),
          certificateUrl: `https://example.com/certificates/${user.id}-${subject.id}.pdf`,
        },
      });
    }
  }

  console.log('Enhanced seeding completed successfully!')
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  }) 