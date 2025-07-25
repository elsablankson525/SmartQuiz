import { PrismaClient } from '@prisma/client'
const prisma = new PrismaClient()

async function main() {
  console.log('Seeding started')
  // Clear tables to prevent duplicates
  await prisma.userLessonProgress.deleteMany({});
  await prisma.resource.deleteMany({});
  await prisma.lesson.deleteMany({});
  // Categories (ensure all from app/quiz/new/page.tsx are present)
  const categories = [
    { name: 'Computer Science', description: 'Programming, algorithms, software', icon: '\ud83d\udcbb', color: 'bg-blue-100 text-blue-700', iconColor: 'text-blue-500', questionCount: 45 },
    { name: 'Health & Medicine', description: 'Medical knowledge, anatomy, care', icon: '\ud83c\udfe5', color: 'bg-green-100 text-green-700', iconColor: 'text-green-500', questionCount: 38 },
    { name: 'Business', description: 'Strategy, finance, management', icon: '\ud83d\udcbc', color: 'bg-purple-100 text-purple-700', iconColor: 'text-purple-500', questionCount: 52 },
    { name: 'Law', description: 'Legal principles, jurisprudence', icon: '\u2696\ufe0f', color: 'bg-amber-100 text-amber-700', iconColor: 'text-amber-500', questionCount: 29 },
    { name: 'Psychology', description: 'Human behavior, mental processes', icon: '\ud83e\udde0', color: 'bg-pink-100 text-pink-700', iconColor: 'text-pink-500', questionCount: 34 },
    { name: 'Mathematics', description: 'Algebra, calculus, statistics', icon: '\ud83d\udcca', color: 'bg-indigo-100 text-indigo-700', iconColor: 'text-indigo-500', questionCount: 41 },
    { name: 'Engineering', description: 'Mechanical, civil, electrical, more', icon: '🛠️', color: 'bg-gray-100 text-gray-700', iconColor: 'text-gray-500', questionCount: 0 },
    { name: 'Arts & Humanities', description: 'History, literature, philosophy', icon: '🎨', color: 'bg-pink-100 text-pink-700', iconColor: 'text-pink-500', questionCount: 0 },
    { name: 'Natural Sciences', description: 'Physics, chemistry, biology', icon: '🔬', color: 'bg-green-100 text-green-700', iconColor: 'text-green-500', questionCount: 0 },
    { name: 'Social Sciences', description: 'Sociology, economics, politics', icon: '🌍', color: 'bg-blue-100 text-blue-700', iconColor: 'text-blue-500', questionCount: 0 },
    { name: 'Technology', description: 'AI, cybersecurity, data science', icon: '🤖', color: 'bg-indigo-100 text-indigo-700', iconColor: 'text-indigo-500', questionCount: 0 },
  ];
  for (const category of categories) {
    await prisma.category.upsert({
      where: { name: category.name },
      update: {},
      create: category,
    });
  }

  // Subjects
  const subjects = [
    { name: 'JavaScript in 2 Days', icon: '💻', description: 'Quickly master JavaScript basics in just 2 days.', color: 'bg-blue-100', borderColor: 'border-blue-200', topics: ['ES6', 'DOM', 'Async'], quizzes: 5, learners: 1200, avgTime: '2 days', difficulty: 'Beginner', rating: 4.9 },
    { name: 'Python Crash Course', icon: '🐍', description: 'A fast-paced introduction to Python programming.', color: 'bg-green-100', borderColor: 'border-green-200', topics: ['OOP', 'Data Structures'], quizzes: 4, learners: 950, avgTime: '3 days', difficulty: 'Beginner', rating: 4.8 },
    { name: 'Digital Marketing Basics', icon: '📈', description: 'Learn the essentials of digital marketing in 3 days.', color: 'bg-pink-100', borderColor: 'border-pink-200', topics: ['SEO', 'Social Media'], quizzes: 3, learners: 800, avgTime: '3 days', difficulty: 'Beginner', rating: 4.7 },
    { name: 'Excel for Beginners', icon: '📊', description: 'Get started with Excel and spreadsheets in 2 days.', color: 'bg-yellow-100', borderColor: 'border-yellow-200', topics: ['Formulas', 'Charts'], quizzes: 2, learners: 700, avgTime: '2 days', difficulty: 'Beginner', rating: 4.6 },
    { name: 'Speed Reading in 3 Days', icon: '📚', description: 'Boost your reading speed and comprehension.', color: 'bg-purple-100', borderColor: 'border-purple-200', topics: ['Techniques', 'Practice'], quizzes: 2, learners: 600, avgTime: '3 days', difficulty: 'Beginner', rating: 4.5 },
  ];
  const subjectRecords = [];
  for (const subject of subjects) {
    // Normalize name
    const normalizedName = subject.name.trim();
    const record = await prisma.subject.upsert({
      where: { name: normalizedName },
      update: {},
      create: { ...subject, name: normalizedName },
    });
    subjectRecords.push(record);
  }

  // Lessons for each subject
  const lessons = [
    // JavaScript in 2 Days
    { title: 'Introduction to JavaScript', type: 'video', content: 'https://www.youtube.com/watch?v=W6NZfCO5SIk', duration: '15 min', order: 1, subjectId: subjectRecords[0].id },
    { title: 'Variables and Data Types', type: 'article', content: 'Learn about JS variables and types...', duration: '10 min', order: 2, subjectId: subjectRecords[0].id },
    { title: 'DOM Manipulation', type: 'video', content: 'https://www.youtube.com/watch?v=0ik6X4DJKCc', duration: '20 min', order: 3, subjectId: subjectRecords[0].id },
    { title: 'Async JavaScript', type: 'article', content: 'Understanding callbacks, promises, and async/await...', duration: '15 min', order: 4, subjectId: subjectRecords[0].id },
    { title: 'JS Basics Quiz', type: 'quiz', content: 'quiz-js-basics', duration: '10 min', order: 5, subjectId: subjectRecords[0].id },
    // Python Crash Course
    { title: 'Getting Started with Python', type: 'video', content: 'https://www.youtube.com/watch?v=_uQrJ0TkZlc', duration: '20 min', order: 1, subjectId: subjectRecords[1].id },
    { title: 'Python Data Structures', type: 'article', content: 'Lists, tuples, and dictionaries in Python...', duration: '12 min', order: 2, subjectId: subjectRecords[1].id },
    { title: 'OOP in Python', type: 'video', content: 'https://www.youtube.com/watch?v=JeznW_7DlB0', duration: '18 min', order: 3, subjectId: subjectRecords[1].id },
    { title: 'Python Basics Quiz', type: 'quiz', content: 'quiz-python-basics', duration: '8 min', order: 4, subjectId: subjectRecords[1].id },
    // Digital Marketing Basics
    { title: 'What is Digital Marketing?', type: 'article', content: 'Overview of digital marketing channels...', duration: '8 min', order: 1, subjectId: subjectRecords[2].id },
    { title: 'SEO Fundamentals', type: 'video', content: 'https://www.youtube.com/watch?v=E1Sxj6SKkLw', duration: '14 min', order: 2, subjectId: subjectRecords[2].id },
    { title: 'Social Media Marketing', type: 'article', content: 'How to use social media for business...', duration: '10 min', order: 3, subjectId: subjectRecords[2].id },
    // Excel for Beginners
    { title: 'Excel Interface Overview', type: 'video', content: 'https://www.youtube.com/watch?v=Vl0H-qTclOg', duration: '12 min', order: 1, subjectId: subjectRecords[3].id },
    { title: 'Basic Formulas in Excel', type: 'article', content: 'How to use SUM, AVERAGE, and more...', duration: '10 min', order: 2, subjectId: subjectRecords[3].id },
    // Speed Reading in 3 Days
    { title: 'Speed Reading Techniques', type: 'video', content: 'https://www.youtube.com/watch?v=ZwEquW_Yij0', duration: '13 min', order: 1, subjectId: subjectRecords[4].id },
    { title: 'Practice Exercises', type: 'article', content: 'Daily exercises to improve reading speed...', duration: '9 min', order: 2, subjectId: subjectRecords[4].id },
  ];
  for (const lesson of lessons) {
    await prisma.lesson.create({ data: lesson });
  }

  // Resources for some lessons/subjects
  const resources = [
    { title: 'MDN JavaScript Guide', type: 'article', url: 'https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide', description: 'Comprehensive JS documentation', subjectId: subjectRecords[0].id },
    { title: 'Python Official Docs', type: 'article', url: 'https://docs.python.org/3/tutorial/', description: 'Python language tutorial', subjectId: subjectRecords[1].id },
    { title: 'Google Digital Garage', type: 'video', url: 'https://learndigital.withgoogle.com/digitalgarage', description: 'Free digital marketing course', subjectId: subjectRecords[2].id },
    { title: 'Excel Practice Files', type: 'download', url: 'https://example.com/excel-practice.zip', description: 'Downloadable Excel files for practice', subjectId: subjectRecords[3].id },
    { title: 'Speed Reading App', type: 'link', url: 'https://www.spreeder.com/', description: 'Practice speed reading online', subjectId: subjectRecords[4].id },
  ];
  for (const resource of resources) {
    await prisma.resource.create({ data: resource });
  }

  // Learning Paths and Milestones (expanded from lib/learning-paths.ts)
  const webDevPath = await prisma.learningPath.create({
    data: {
      title: 'Web Development Fundamentals',
      description: 'Master the basics of web development with HTML, CSS, and JavaScript',
      category: 'Computer Science',
      difficulty: 'beginner',
      duration: '12 weeks',
      modules: 12,
      enrolled: 3420,
      rating: 4.8,
      progress: 0,
      color: 'bg-blue-100 text-blue-700',
      icon: '\ud83d\udcbb',
      skills: ['HTML', 'CSS', 'JavaScript'],
      instructor: 'EduQuest AI',
      isPopular: true,
    }
  })
  await prisma.milestone.createMany({
    data: [
      {
        title: 'HTML Fundamentals',
        description: 'Learn HTML structure, elements, and semantic markup',
        requiredScore: 80,
        quizTopics: ['html', 'markup'],
        resources: ['html-mdn-guide'],
        learningPathId: webDevPath.id,
      },
      {
        title: 'CSS Styling',
        description: 'Master CSS selectors, properties, and layout techniques',
        requiredScore: 75,
        quizTopics: ['css', 'styling'],
        resources: ['css-complete-guide'],
        learningPathId: webDevPath.id,
      },
      {
        title: 'JavaScript Programming',
        description: 'Learn JavaScript fundamentals and DOM manipulation',
        requiredScore: 70,
        quizTopics: ['javascript', 'programming'],
        resources: ['cs-javascript-mdn'],
        learningPathId: webDevPath.id,
      },
    ]
  })
  const businessPath = await prisma.learningPath.create({
    data: {
      title: 'Business Strategy Mastery',
      description: 'Develop strategic thinking and business analysis skills',
      category: 'Business',
      difficulty: 'intermediate',
      duration: '16 weeks',
      modules: 16,
      enrolled: 2000,
      rating: 4.7,
      progress: 0,
      color: 'bg-purple-100 text-purple-700',
      icon: '\ud83d\udcbc',
      skills: ['Strategy', 'Market Analysis'],
      instructor: 'BizMaster AI',
      isPopular: true,
    }
  })
  await prisma.milestone.createMany({
    data: [
      {
        title: 'Strategy Fundamentals',
        description: 'Understand competitive advantage and strategic positioning',
        requiredScore: 75,
        quizTopics: ['strategy', 'competition'],
        resources: ['business-strategy-wharton'],
        learningPathId: businessPath.id,
      },
      {
        title: 'Market Analysis',
        description: 'Learn to analyze markets and competitive landscapes',
        requiredScore: 80,
        quizTopics: ['market-analysis', 'competition'],
        resources: ['market-research-course'],
        learningPathId: businessPath.id,
      },
    ]
  })
  const healthPath = await prisma.learningPath.create({
    data: {
      title: 'Health & Wellness Foundation',
      description: 'Build comprehensive understanding of health, nutrition, and wellness',
      category: 'Health',
      difficulty: 'beginner',
      duration: '10 weeks',
      modules: 10,
      enrolled: 1500,
      rating: 4.6,
      progress: 0,
      color: 'bg-green-100 text-green-700',
      icon: '\ud83c\udfe5',
      skills: ['Nutrition', 'Exercise'],
      instructor: 'HealthAI',
      isPopular: true,
    }
  })
  await prisma.milestone.createMany({
    data: [
      {
        title: 'Nutrition Fundamentals',
        description: 'Understand macronutrients, micronutrients, and healthy eating',
        requiredScore: 80,
        quizTopics: ['nutrition', 'diet'],
        resources: ['health-nutrition-harvard'],
        learningPathId: healthPath.id,
      },
      {
        title: 'Exercise & Fitness',
        description: 'Learn about exercise physiology and fitness principles',
        requiredScore: 75,
        quizTopics: ['exercise', 'fitness'],
        resources: ['exercise-science-course'],
        learningPathId: healthPath.id,
      },
    ]
  })

  // Learning Resources (expanded from lib/recommendation-engine.ts)
  await prisma.learningResource.createMany({
    data: [
      // JavaScript
      { title: 'Understanding JavaScript Closures', type: 'video', url: 'https://example.com/js-closures', difficulty: 'medium', category: 'Computer Science', topic: 'javascript', description: 'Deep dive into JavaScript closures with practical examples', duration: '15 min' },
      { title: 'Mastering Async/Await in JavaScript', type: 'article', url: 'https://example.com/js-async', difficulty: 'hard', category: 'Computer Science', topic: 'async programming', description: 'Complete guide to asynchronous JavaScript programming', readTime: '8 min' },
      { title: 'JavaScript Fundamentals Practice', type: 'practice', url: 'https://example.com/js-practice', difficulty: 'easy', category: 'Computer Science', topic: 'fundamentals', description: 'Interactive exercises for JavaScript basics' },
      // Python
      { title: 'Object-Oriented Programming in Python', type: 'tutorial', url: 'https://example.com/py-oop', difficulty: 'medium', category: 'Computer Science', topic: 'object-oriented programming', description: 'Learn OOP concepts with Python examples', duration: '25 min' },
      { title: 'Python Data Structures Guide', type: 'article', url: 'https://example.com/py-data', difficulty: 'easy', category: 'Computer Science', topic: 'data structures', description: 'Comprehensive guide to Python\'s built-in data structures', readTime: '12 min' },
      // Java
      { title: 'Java Inheritance and Polymorphism', type: 'video', url: 'https://example.com/java-inheritance', difficulty: 'medium', category: 'Computer Science', topic: 'inheritance', description: 'Master inheritance concepts in Java', duration: '20 min' },
      { title: 'Java Collections Framework', type: 'tutorial', url: 'https://example.com/java-collections', difficulty: 'hard', category: 'Computer Science', topic: 'collections', description: 'Complete guide to Java Collections API' },
    ]
  })

  // Quiz Questions (expanded from lib/quiz-generator.ts)
  await prisma.quizQuestion.createMany({
    data: [
      // Computer Science (JavaScript)
      { question: "What is the output of console.log(typeof NaN)?", options: ["'number'", "'NaN'", "'undefined'", "'object'"], correctAnswer: "'number'", explanation: "In JavaScript, NaN (Not a Number) is actually of type 'number'. This is because NaN represents an invalid number value, but it's still within the number type system. This is a common JavaScript quirk that catches many developers off guard.", difficulty: "intermediate", topic: "javascript", relatedConcepts: ["data types", "type coercion", "NaN"] },
      { question: "Which method adds elements to the end of an array?", options: ["push()", "pop()", "unshift()", "shift()"], correctAnswer: "push()", explanation: "The push() method adds one or more elements to the end of an array and returns the new length. pop() removes from the end, unshift() adds to the beginning, and shift() removes from the beginning.", difficulty: "beginner", topic: "javascript", relatedConcepts: ["arrays", "methods", "data manipulation"] },
      { question: "What does the '===' operator do in JavaScript?", options: ["Checks for equality", "Checks for equality without type coercion", "Assigns a value", "Checks if a variable is defined"], correctAnswer: "Checks for equality without type coercion", explanation: "The '===' operator performs strict equality comparison without type coercion. It checks both value and type, unlike '==' which performs type coercion. For example: '5' === 5 is false, but '5' == 5 is true.", difficulty: "intermediate", topic: "javascript", relatedConcepts: ["operators", "type coercion", "comparison"] },
      // Computer Science (Python)
      { question: "What is the correct way to create a function in Python?", options: ["function myFunc():", "def myFunc():", "create myFunc():", "func myFunc():"], correctAnswer: "def myFunc():", explanation: "In Python, functions are defined using the 'def' keyword followed by the function name and parentheses. The colon (:) indicates the start of the function body, which must be indented.", difficulty: "beginner", topic: "python", relatedConcepts: ["functions", "syntax", "keywords"] },
      { question: "Which of the following is used to define a block of code in Python?", options: ["Curly braces {}", "Parentheses ()", "Indentation", "Square brackets []"], correctAnswer: "Indentation", explanation: "Python uses indentation (whitespace) to define code blocks, unlike many other languages that use curly braces. This enforces clean, readable code structure. Typically, 4 spaces or 1 tab is used for each indentation level.", difficulty: "beginner", topic: "python", relatedConcepts: ["syntax", "code structure", "indentation"] },
      // Computer Science (Java)
      { question: "Which keyword is used to define a constant in Java?", options: ["const", "final", "static", "var"], correctAnswer: "final", explanation: "In Java, the 'final' keyword is used to create constants. When applied to variables, it prevents reassignment. When combined with 'static', it creates class-level constants that are shared across all instances.", difficulty: "intermediate", topic: "java", relatedConcepts: ["keywords", "constants", "modifiers"] },
      // Computer Science (Algorithms)
      { question: "What is the time complexity of binary search?", options: ["O(n)", "O(log n)", "O(n²)", "O(1)"], correctAnswer: "O(log n)", explanation: "Binary search has O(log n) time complexity because it eliminates half of the remaining elements in each step. This logarithmic behavior makes it very efficient for searching sorted arrays, much faster than linear search's O(n).", difficulty: "intermediate", topic: "algorithms", relatedConcepts: ["time complexity", "searching", "divide and conquer"] },
      // Health
      { question: "Which vitamin is primarily produced when skin is exposed to sunlight?", options: ["Vitamin A", "Vitamin C", "Vitamin D", "Vitamin K"], correctAnswer: "Vitamin D", explanation: "Vitamin D is synthesized in the skin when exposed to UVB radiation from sunlight. The skin converts 7-dehydrocholesterol to previtamin D3, which then becomes vitamin D3. This is why vitamin D is often called the 'sunshine vitamin' and why deficiency is common in areas with limited sunlight.", difficulty: "beginner", topic: "nutrition", relatedConcepts: ["vitamins", "metabolism", "sunlight"] },
      { question: "What is the largest organ in the human body?", options: ["Heart", "Liver", "Skin", "Brain"], correctAnswer: "Skin", explanation: "The skin is the largest organ in the human body, covering approximately 20 square feet in adults. It serves multiple functions including protection, temperature regulation, sensation, and vitamin D synthesis. It consists of three main layers: epidermis, dermis, and hypodermis.", difficulty: "beginner", topic: "anatomy", relatedConcepts: ["organs", "integumentary system", "body systems"] },
      { question: "Which neurotransmitter is primarily associated with mood regulation?", options: ["Dopamine", "Serotonin", "Acetylcholine", "GABA"], correctAnswer: "Serotonin", explanation: "Serotonin is often called the 'happiness neurotransmitter' because it plays a crucial role in mood regulation, sleep, appetite, and overall well-being. Low serotonin levels are associated with depression, anxiety, and sleep disorders. About 90% of serotonin is produced in the gut.", difficulty: "intermediate", topic: "mental-health", relatedConcepts: ["neurotransmitters", "brain chemistry", "mood disorders"] },
      { question: "What is the recommended daily water intake for adults?", options: ["4-6 cups", "6-8 cups", "8-10 cups", "10-12 cups"], correctAnswer: "8-10 cups", explanation: "The general recommendation is about 8-10 cups (64-80 ounces) of water daily for adults, though individual needs vary based on activity level, climate, and overall health. The '8x8 rule' (8 glasses of 8 ounces) is a good starting point, but active individuals may need more.", difficulty: "beginner", topic: "nutrition", relatedConcepts: ["hydration", "daily requirements", "health maintenance"] },
      // Business
      { question: "What does ROI stand for in business?", options: ["Return on Investment", "Rate of Interest", "Revenue over Income", "Risk of Investment"], correctAnswer: "Return on Investment", explanation: "ROI (Return on Investment) is a key financial metric that measures the efficiency of an investment. It's calculated as (Gain from Investment - Cost of Investment) / Cost of Investment × 100%. A positive ROI indicates a profitable investment, while negative ROI indicates a loss.", difficulty: "beginner", topic: "finance", relatedConcepts: ["financial metrics", "investment analysis", "profitability"] },
      { question: "Which of the following is NOT one of Porter's Five Forces?", options: ["Threat of new entrants", "Bargaining power of suppliers", "Competitive rivalry", "Market segmentation"], correctAnswer: "Market segmentation", explanation: "Porter's Five Forces include: 1) Threat of new entrants, 2) Bargaining power of suppliers, 3) Bargaining power of buyers, 4) Threat of substitute products, and 5) Competitive rivalry. Market segmentation is a marketing strategy, not one of Porter's competitive forces.", difficulty: "intermediate", topic: "strategy", relatedConcepts: ["competitive analysis", "strategic planning", "market forces"] },
      { question: "What is the primary purpose of a SWOT analysis?", options: ["Financial forecasting", "Strategic planning and decision making", "Employee performance evaluation", "Market research"], correctAnswer: "Strategic planning and decision making", explanation: "SWOT analysis (Strengths, Weaknesses, Opportunities, Threats) is a strategic planning tool used to evaluate internal and external factors affecting an organization. It helps identify competitive advantages, areas for improvement, market opportunities, and potential risks to inform strategic decisions.", difficulty: "intermediate", topic: "strategy", relatedConcepts: ["strategic planning", "competitive analysis", "decision making"] },
      // Law
      { question: "What is the highest court in the United States?", options: ["Federal Court", "District Court", "Supreme Court", "Appeals Court"], correctAnswer: "Supreme Court", explanation: "The Supreme Court of the United States is the highest court in the American judicial system. It has ultimate appellate jurisdiction over all federal and state court cases involving federal law, and original jurisdiction over a narrow range of cases including disputes between states.", difficulty: "beginner", topic: "constitutional-law", relatedConcepts: ["judicial system", "court hierarchy", "constitutional law"] },
      { question: "What does 'habeas corpus' mean?", options: ["You have the body", "Innocent until proven guilty", "Right to remain silent", "Due process of law"], correctAnswer: "You have the body", explanation: "Habeas corpus is a Latin term meaning 'you have the body.' It's a legal principle that protects against unlawful detention by requiring authorities to bring a prisoner before a court and justify their detention. It's a fundamental safeguard of individual liberty.", difficulty: "intermediate", topic: "constitutional-law", relatedConcepts: ["civil liberties", "detention", "legal principles"] },
      { question: "In contract law, what makes an agreement legally binding?", options: ["Verbal agreement", "Written document", "Consideration", "Signatures"], correctAnswer: "Consideration", explanation: "Consideration is the exchange of something of value between parties, making a contract legally binding. It can be money, goods, services, or a promise to do or not do something. Without consideration, an agreement is generally not enforceable as a contract.", difficulty: "intermediate", topic: "contracts", relatedConcepts: ["contract formation", "legal requirements", "enforceability"] },
      // Psychology
      { question: "Who is considered the father of psychoanalysis?", options: ["Carl Jung", "Sigmund Freud", "B.F. Skinner", "Ivan Pavlov"], correctAnswer: "Sigmund Freud", explanation: "Sigmund Freud (1856-1939) is considered the father of psychoanalysis. He developed theories about the unconscious mind, dream interpretation, and psychosexual development. His work laid the foundation for modern psychotherapy, though many of his specific theories have been revised or challenged.", difficulty: "beginner", topic: "general-psychology", relatedConcepts: ["psychoanalysis", "unconscious mind", "psychological theories"] },
      { question: "What is classical conditioning?", options: ["Learning through rewards and punishments", "Learning through association", "Learning through observation", "Learning through trial and error"], correctAnswer: "Learning through association", explanation: "Classical conditioning is a learning process where a neutral stimulus becomes associated with a meaningful stimulus, eventually triggering a similar response. Pavlov's famous experiment with dogs demonstrated this: dogs learned to salivate at the sound of a bell when it was repeatedly paired with food.", difficulty: "intermediate", topic: "learning", relatedConcepts: ["behaviorism", "conditioning", "learning theories"] },
      // Mathematics
      { question: "What is the derivative of x²?", options: ["x", "2x", "x²/2", "2"], correctAnswer: "2x", explanation: "Using the power rule for derivatives, d/dx(xⁿ) = n·xⁿ⁻¹. For x², n=2, so the derivative is 2·x²⁻¹ = 2x¹ = 2x. This represents the rate of change or slope of the function x² at any point x.", difficulty: "intermediate", topic: "calculus", relatedConcepts: ["derivatives", "power rule", "rate of change"] },
      { question: "What is the probability of getting heads on a fair coin flip?", options: ["0.25", "0.5", "0.75", "1.0"], correctAnswer: "0.5", explanation: "A fair coin has two equally likely outcomes: heads or tails. The probability of any single outcome is 1 divided by the total number of possible outcomes. Since there are 2 outcomes and they're equally likely, P(heads) = 1/2 = 0.5 or 50%.", difficulty: "beginner", topic: "probability", relatedConcepts: ["probability", "fair outcomes", "basic statistics"] },
      // --- BEGIN GENERATED QUESTIONS ---
      // Computer Science - JavaScript
      // Beginner
      { question: "Which keyword is used to declare a variable in JavaScript?", options: ["var", "let", "const", "All of the above"], correctAnswer: "All of the above", explanation: "In JavaScript, you can declare variables using var, let, or const. Each has different scoping rules.", difficulty: "beginner", topic: "javascript", relatedConcepts: ["variables", "declaration", "scope"] },
      { question: "What does the following code output? console.log(2 + '2')", options: ["4", "'22'", "NaN", "undefined"], correctAnswer: "'22'", explanation: "When a number is added to a string in JavaScript, the number is coerced to a string and concatenated.", difficulty: "beginner", topic: "javascript", relatedConcepts: ["type coercion", "strings", "operators"] },
      { question: "Which method is used to remove the last element from an array?", options: ["pop()", "push()", "shift()", "unshift()"], correctAnswer: "pop()", explanation: "The pop() method removes the last element from an array and returns that element.", difficulty: "beginner", topic: "javascript", relatedConcepts: ["arrays", "methods"] },
      { question: "How do you write a single-line comment in JavaScript?", options: ["// comment", "<!-- comment -->", "# comment", "/* comment */"], correctAnswer: "// comment", explanation: "Single-line comments in JavaScript start with //.", difficulty: "beginner", topic: "javascript", relatedConcepts: ["comments", "syntax"] },
      { question: "Which of the following is NOT a JavaScript data type?", options: ["String", "Boolean", "Float", "Undefined"], correctAnswer: "Float", explanation: "JavaScript does not have a 'Float' type; numbers are all of type 'Number'.", difficulty: "beginner", topic: "javascript", relatedConcepts: ["data types", "numbers"] },
      // Intermediate
      { question: "What is the result of [1,2,3].map(x => x * 2)?", options: ["[2,4,6]", "[1,2,3,2,4,6]", "[1,4,9]", "[2,3,4]"], correctAnswer: "[2,4,6]", explanation: "The map() method creates a new array with the results of calling a function on every element.", difficulty: "intermediate", topic: "javascript", relatedConcepts: ["arrays", "map", "functions"] },
      { question: "What does 'use strict' do in JavaScript?", options: ["Enables strict mode", "Disables strict mode", "Declares a variable", "Defines a function"], correctAnswer: "Enables strict mode", explanation: "'use strict' enables strict mode, which catches common coding errors and prevents unsafe actions.", difficulty: "intermediate", topic: "javascript", relatedConcepts: ["strict mode", "errors"] },
      { question: "Which of the following is a falsy value in JavaScript?", options: ["0", "'false'", "[]", "{}"], correctAnswer: "0", explanation: "0 is a falsy value. 'false', [], and {} are all truthy.", difficulty: "intermediate", topic: "javascript", relatedConcepts: ["truthy", "falsy", "values"] },
      { question: "What is the output of typeof null?", options: ["'object'", "'null'", "'undefined'", "'number'"], correctAnswer: "'object'", explanation: "typeof null returns 'object' due to a historical bug in JavaScript.", difficulty: "intermediate", topic: "javascript", relatedConcepts: ["null", "typeof"] },
      { question: "Which function is used to parse a string to an integer?", options: ["parseInt()", "parseFloat()", "Number()", "All of the above"], correctAnswer: "All of the above", explanation: "All these functions can convert a string to a number, but parseInt() specifically parses to integer.", difficulty: "intermediate", topic: "javascript", relatedConcepts: ["parsing", "numbers"] },
      // Advanced
      { question: "What is a closure in JavaScript?", options: ["A function having access to its own scope, the outer function's scope, and the global scope", "A function that returns another function", "A function with no parameters", "A function that is immediately invoked"], correctAnswer: "A function having access to its own scope, the outer function's scope, and the global scope", explanation: "A closure is a function that retains access to its lexical scope even when executed outside its scope.", difficulty: "advanced", topic: "javascript", relatedConcepts: ["closures", "scope", "functions"] },
      { question: "How can you create a private variable in JavaScript?", options: ["Using closures", "Using var", "Using let", "Using global variables"], correctAnswer: "Using closures", explanation: "Closures can be used to create private variables by encapsulating them within a function scope.", difficulty: "advanced", topic: "javascript", relatedConcepts: ["private variables", "closures"] },
      { question: "What is the purpose of the 'bind' method?", options: ["To set the value of 'this' in a function", "To call a function", "To create a new array", "To loop through an array"], correctAnswer: "To set the value of 'this' in a function", explanation: "The bind() method creates a new function with a specified 'this' value.", difficulty: "advanced", topic: "javascript", relatedConcepts: ["bind", "this", "functions"] },
      { question: "What is the difference between == and === in JavaScript?", options: ["== checks value only, === checks value and type", "== checks type only, === checks value only", "No difference", "== is for numbers, === is for strings"], correctAnswer: "== checks value only, === checks value and type", explanation: "== performs type coercion, while === checks both value and type.", difficulty: "advanced", topic: "javascript", relatedConcepts: ["equality", "type coercion"] },
      { question: "What is the output of [].length?", options: ["0", "1", "undefined", "null"], correctAnswer: "0", explanation: "The length property of an empty array is 0.", difficulty: "advanced", topic: "javascript", relatedConcepts: ["arrays", "length"] },
      // Adaptive
      { question: "Which of the following best describes adaptive learning in JavaScript quizzes?", options: ["Questions adjust based on user performance", "Questions are always random", "Questions are always the same", "Questions are only theoretical"], correctAnswer: "Questions adjust based on user performance", explanation: "Adaptive quizzes change the difficulty or topic based on how the user is performing.", difficulty: "adaptive", topic: "javascript", relatedConcepts: ["adaptive learning", "quizzes"] },
      { question: "In an adaptive quiz, what happens if you answer several questions incorrectly?", options: ["You get easier questions", "You get harder questions", "No change", "Quiz ends"], correctAnswer: "You get easier questions", explanation: "Adaptive quizzes typically lower the difficulty if you answer incorrectly.", difficulty: "adaptive", topic: "javascript", relatedConcepts: ["adaptive", "difficulty"] },
      { question: "What is a practical benefit of adaptive quizzes for JavaScript learners?", options: ["Personalized learning path", "Faster grading", "More theoretical questions", "No benefit"], correctAnswer: "Personalized learning path", explanation: "Adaptive quizzes help tailor the learning experience to the user's needs.", difficulty: "adaptive", topic: "javascript", relatedConcepts: ["personalization", "learning"] },
      { question: "Which JavaScript feature is most useful for building adaptive quizzes?", options: ["Functions", "Event listeners", "Conditional logic", "Loops"], correctAnswer: "Conditional logic", explanation: "Conditional logic allows the quiz to change behavior based on user answers.", difficulty: "adaptive", topic: "javascript", relatedConcepts: ["conditional logic", "adaptive"] },
      { question: "How can you track user progress in an adaptive JavaScript quiz?", options: ["Using state variables", "Using only HTML", "Using CSS", "Not possible"], correctAnswer: "Using state variables", explanation: "State variables (in React or similar) are used to track user progress and adapt the quiz.", difficulty: "adaptive", topic: "javascript", relatedConcepts: ["state", "progress tracking"] },
      // Computer Science - Python
      // Beginner
      { question: "Which symbol is used to comment a single line in Python?", options: ["#", "//", "<!-- -->", "--"], correctAnswer: "#", explanation: "In Python, the # symbol is used for single-line comments.", difficulty: "beginner", topic: "python", relatedConcepts: ["comments", "syntax"] },
      { question: "What is the output of print(2 * 3)?", options: ["5", "6", "23", "Error"], correctAnswer: "6", explanation: "The * operator multiplies numbers in Python, so 2 * 3 is 6.", difficulty: "beginner", topic: "python", relatedConcepts: ["operators", "arithmetic"] },
      { question: "Which data type is used to store text in Python?", options: ["int", "str", "float", "bool"], correctAnswer: "str", explanation: "The str type is used for text (strings) in Python.", difficulty: "beginner", topic: "python", relatedConcepts: ["data types", "strings"] },
      { question: "How do you create a list in Python?", options: ["[]", "{}", "()", "<>"], correctAnswer: "[]", explanation: "Lists in Python are created using square brackets, e.g., [1, 2, 3].", difficulty: "beginner", topic: "python", relatedConcepts: ["lists", "collections"] },
      { question: "What does len([1,2,3]) return?", options: ["2", "3", "1", "Error"], correctAnswer: "3", explanation: "The len() function returns the number of items in a list.", difficulty: "beginner", topic: "python", relatedConcepts: ["lists", "functions"] },
      // Intermediate
      { question: "What is the output of 'hello'.upper()?", options: ["'HELLO'", "'hello'", "'Hello'", "Error"], correctAnswer: "'HELLO'", explanation: "The upper() method returns the string in uppercase.", difficulty: "intermediate", topic: "python", relatedConcepts: ["strings", "methods"] },
      { question: "Which keyword is used to define a function in Python?", options: ["def", "func", "function", "define"], correctAnswer: "def", explanation: "Functions in Python are defined using the 'def' keyword.", difficulty: "intermediate", topic: "python", relatedConcepts: ["functions", "keywords"] },
      { question: "What is the output of 5 // 2 in Python?", options: ["2.5", "2", "3", "2.0"], correctAnswer: "2", explanation: "The // operator performs integer (floor) division.", difficulty: "intermediate", topic: "python", relatedConcepts: ["operators", "division"] },
      { question: "Which of the following is a tuple in Python?", options: ["(1, 2, 3)", "[1, 2, 3]", "{1, 2, 3}", "<1, 2, 3>"], correctAnswer: "(1, 2, 3)", explanation: "Tuples are created using parentheses.", difficulty: "intermediate", topic: "python", relatedConcepts: ["tuples", "collections"] },
      { question: "How do you import a module in Python?", options: ["import module", "include module", "require module", "use module"], correctAnswer: "import module", explanation: "The import statement is used to include modules in Python.", difficulty: "intermediate", topic: "python", relatedConcepts: ["modules", "import"] },
      // Advanced
      { question: "What is a lambda function in Python?", options: ["A small anonymous function", "A function with no parameters", "A function that returns another function", "A function that is immediately invoked"], correctAnswer: "A small anonymous function", explanation: "Lambda functions are small, anonymous functions defined with the lambda keyword.", difficulty: "advanced", topic: "python", relatedConcepts: ["lambda", "functions"] },
      { question: "Which method is used to add an item to a list?", options: ["append()", "add()", "insert()", "push()"], correctAnswer: "append()", explanation: "The append() method adds an item to the end of a list.", difficulty: "advanced", topic: "python", relatedConcepts: ["lists", "methods"] },
      { question: "What does the 'with' statement do in Python?", options: ["Manages resources", "Defines a function", "Imports a module", "Creates a class"], correctAnswer: "Manages resources", explanation: "The 'with' statement is used for resource management and exception handling.", difficulty: "advanced", topic: "python", relatedConcepts: ["context managers", "resources"] },
      { question: "What is the output of set([1,2,2,3])?", options: ["{1,2,3}", "[1,2,2,3]", "(1,2,3)", "Error"], correctAnswer: "{1,2,3}", explanation: "A set removes duplicate values, so set([1,2,2,3]) is {1,2,3}.", difficulty: "advanced", topic: "python", relatedConcepts: ["sets", "collections"] },
      { question: "What is the purpose of __init__ in a Python class?", options: ["Constructor", "Destructor", "Operator", "Method"], correctAnswer: "Constructor", explanation: "__init__ is the constructor method in Python classes.", difficulty: "advanced", topic: "python", relatedConcepts: ["classes", "constructors"] },
      // Adaptive
      { question: "What is an adaptive quiz in Python learning?", options: ["A quiz that changes based on your answers", "A quiz with only easy questions", "A quiz with only hard questions", "A quiz with random questions"], correctAnswer: "A quiz that changes based on your answers", explanation: "Adaptive quizzes adjust the difficulty or topic based on your performance.", difficulty: "adaptive", topic: "python", relatedConcepts: ["adaptive learning", "quizzes"] },
      { question: "How can Python track user progress in an adaptive quiz?", options: ["Using variables", "Using only print statements", "Using only comments", "Not possible"], correctAnswer: "Using variables", explanation: "Variables can be used to track user progress and adapt the quiz.", difficulty: "adaptive", topic: "python", relatedConcepts: ["variables", "progress tracking"] },
      { question: "Which Python feature is most useful for building adaptive quizzes?", options: ["if statements", "for loops", "print()", "input()"], correctAnswer: "if statements", explanation: "if statements allow the quiz to change behavior based on user answers.", difficulty: "adaptive", topic: "python", relatedConcepts: ["conditional logic", "adaptive"] },
      { question: "What is a practical benefit of adaptive quizzes for Python learners?", options: ["Personalized learning path", "Faster grading", "More theoretical questions", "No benefit"], correctAnswer: "Personalized learning path", explanation: "Adaptive quizzes help tailor the learning experience to the user's needs.", difficulty: "adaptive", topic: "python", relatedConcepts: ["personalization", "learning"] },
      { question: "In an adaptive Python quiz, what happens if you answer several questions incorrectly?", options: ["You get easier questions", "You get harder questions", "No change", "Quiz ends"], correctAnswer: "You get easier questions", explanation: "Adaptive quizzes typically lower the difficulty if you answer incorrectly.", difficulty: "adaptive", topic: "python", relatedConcepts: ["adaptive", "difficulty"] },
      // Computer Science - Java
      // Beginner
      { question: "Which keyword is used to declare a variable in Java?", options: ["var", "let", "const", "All of the above"], correctAnswer: "All of the above", explanation: "In JavaScript, you can declare variables using var, let, or const. Each has different scoping rules.", difficulty: "beginner", topic: "java", relatedConcepts: ["variables", "declaration", "scope"] },
      { question: "What does the following code output? console.log(2 + '2')", options: ["4", "'22'", "NaN", "undefined"], correctAnswer: "'22'", explanation: "When a number is added to a string in JavaScript, the number is coerced to a string and concatenated.", difficulty: "beginner", topic: "java", relatedConcepts: ["type coercion", "strings", "operators"] },
      { question: "Which method is used to remove the last element from an array?", options: ["pop()", "push()", "shift()", "unshift()"], correctAnswer: "pop()", explanation: "The pop() method removes the last element from an array and returns that element.", difficulty: "beginner", topic: "java", relatedConcepts: ["arrays", "methods"] },
      { question: "How do you write a single-line comment in JavaScript?", options: ["// comment", "<!-- comment -->", "# comment", "/* comment */"], correctAnswer: "// comment", explanation: "Single-line comments in JavaScript start with //.", difficulty: "beginner", topic: "java", relatedConcepts: ["comments", "syntax"] },
      { question: "Which of the following is NOT a JavaScript data type?", options: ["String", "Boolean", "Float", "Undefined"], correctAnswer: "Float", explanation: "JavaScript does not have a 'Float' type; numbers are all of type 'Number'.", difficulty: "beginner", topic: "java", relatedConcepts: ["data types", "numbers"] },
      // Intermediate
      { question: "What is the result of [1,2,3].map(x => x * 2)?", options: ["[2,4,6]", "[1,2,3,2,4,6]", "[1,4,9]", "[2,3,4]"], correctAnswer: "[2,4,6]", explanation: "The map() method creates a new array with the results of calling a function on every element.", difficulty: "intermediate", topic: "java", relatedConcepts: ["arrays", "map", "functions"] },
      { question: "What does 'use strict' do in JavaScript?", options: ["Enables strict mode", "Disables strict mode", "Declares a variable", "Defines a function"], correctAnswer: "Enables strict mode", explanation: "'use strict' enables strict mode, which catches common coding errors and prevents unsafe actions.", difficulty: "intermediate", topic: "java", relatedConcepts: ["strict mode", "errors"] },
      { question: "Which of the following is a falsy value in JavaScript?", options: ["0", "'false'", "[]", "{}"], correctAnswer: "0", explanation: "0 is a falsy value. 'false', [], and {} are all truthy.", difficulty: "intermediate", topic: "java", relatedConcepts: ["truthy", "falsy", "values"] },
      { question: "What is the output of typeof null?", options: ["'object'", "'null'", "'undefined'", "'number'"], correctAnswer: "'object'", explanation: "typeof null returns 'object' due to a historical bug in JavaScript.", difficulty: "intermediate", topic: "java", relatedConcepts: ["null", "typeof"] },
      { question: "Which function is used to parse a string to an integer?", options: ["parseInt()", "parseFloat()", "Number()", "All of the above"], correctAnswer: "All of the above", explanation: "All these functions can convert a string to a number, but parseInt() specifically parses to integer.", difficulty: "intermediate", topic: "java", relatedConcepts: ["parsing", "numbers"] },
      // Advanced
      { question: "What is a closure in JavaScript?", options: ["A function having access to its own scope, the outer function's scope, and the global scope", "A function that returns another function", "A function with no parameters", "A function that is immediately invoked"], correctAnswer: "A function having access to its own scope, the outer function's scope, and the global scope", explanation: "A closure is a function that retains access to its lexical scope even when executed outside its scope.", difficulty: "advanced", topic: "java", relatedConcepts: ["closures", "scope", "functions"] },
      { question: "How can you create a private variable in JavaScript?", options: ["Using closures", "Using var", "Using let", "Using global variables"], correctAnswer: "Using closures", explanation: "Closures can be used to create private variables by encapsulating them within a function scope.", difficulty: "advanced", topic: "java", relatedConcepts: ["private variables", "closures"] },
      { question: "What is the purpose of the 'bind' method?", options: ["To set the value of 'this' in a function", "To call a function", "To create a new array", "To loop through an array"], correctAnswer: "To set the value of 'this' in a function", explanation: "The bind() method creates a new function with a specified 'this' value.", difficulty: "advanced", topic: "java", relatedConcepts: ["bind", "this", "functions"] },
      { question: "What is the difference between == and === in JavaScript?", options: ["== checks value only, === checks value and type", "== checks type only, === checks value only", "No difference", "== is for numbers, === is for strings"], correctAnswer: "== checks value only, === checks value and type", explanation: "== performs type coercion, while === checks both value and type.", difficulty: "advanced", topic: "java", relatedConcepts: ["equality", "type coercion"] },
      { question: "What is the output of [].length?", options: ["0", "1", "undefined", "null"], correctAnswer: "0", explanation: "The length property of an empty array is 0.", difficulty: "advanced", topic: "java", relatedConcepts: ["arrays", "length"] },
      // Adaptive
      { question: "Which of the following best describes adaptive learning in JavaScript quizzes?", options: ["Questions adjust based on user performance", "Questions are always random", "Questions are always the same", "Questions are only theoretical"], correctAnswer: "Questions adjust based on user performance", explanation: "Adaptive quizzes change the difficulty or topic based on how the user is performing.", difficulty: "adaptive", topic: "java", relatedConcepts: ["adaptive learning", "quizzes"] },
      { question: "In an adaptive quiz, what happens if you answer several questions incorrectly?", options: ["You get easier questions", "You get harder questions", "No change", "Quiz ends"], correctAnswer: "You get easier questions", explanation: "Adaptive quizzes typically lower the difficulty if you answer incorrectly.", difficulty: "adaptive", topic: "java", relatedConcepts: ["adaptive", "difficulty"] },
      { question: "What is a practical benefit of adaptive quizzes for JavaScript learners?", options: ["Personalized learning path", "Faster grading", "More theoretical questions", "No benefit"], correctAnswer: "Personalized learning path", explanation: "Adaptive quizzes help tailor the learning experience to the user's needs.", difficulty: "adaptive", topic: "java", relatedConcepts: ["personalization", "learning"] },
      { question: "Which JavaScript feature is most useful for building adaptive quizzes?", options: ["Functions", "Event listeners", "Conditional logic", "Loops"], correctAnswer: "Conditional logic", explanation: "Conditional logic allows the quiz to change behavior based on user answers.", difficulty: "adaptive", topic: "java", relatedConcepts: ["conditional logic", "adaptive"] },
      { question: "How can you track user progress in an adaptive JavaScript quiz?", options: ["Using state variables", "Using only HTML", "Using CSS", "Not possible"], correctAnswer: "Using state variables", explanation: "State variables (in React or similar) are used to track user progress and adapt the quiz.", difficulty: "adaptive", topic: "java", relatedConcepts: ["state", "progress tracking"] },
      // Computer Science - Algorithms
      // Beginner
      { question: "Which keyword is used to declare a variable in Algorithms?", options: ["var", "let", "const", "All of the above"], correctAnswer: "All of the above", explanation: "In Algorithms, you can declare variables using var, let, or const. Each has different scoping rules.", difficulty: "beginner", topic: "algorithms", relatedConcepts: ["variables", "declaration", "scope"] },
      { question: "What does the following code output? console.log(2 + '2')", options: ["4", "'22'", "NaN", "undefined"], correctAnswer: "'22'", explanation: "When a number is added to a string in Algorithms, the number is coerced to a string and concatenated.", difficulty: "beginner", topic: "algorithms", relatedConcepts: ["type coercion", "strings", "operators"] },
      { question: "Which method is used to remove the last element from an array?", options: ["pop()", "push()", "shift()", "unshift()"], correctAnswer: "pop()", explanation: "The pop() method removes the last element from an array and returns that element.", difficulty: "beginner", topic: "algorithms", relatedConcepts: ["arrays", "methods"] },
      { question: "How do you write a single-line comment in Algorithms?", options: ["// comment", "<!-- comment -->", "# comment", "/* comment */"], correctAnswer: "// comment", explanation: "Single-line comments in Algorithms start with //.", difficulty: "beginner", topic: "algorithms", relatedConcepts: ["comments", "syntax"] },
      { question: "Which of the following is NOT a JavaScript data type?", options: ["String", "Boolean", "Float", "Undefined"], correctAnswer: "Float", explanation: "Algorithms does not have a 'Float' type; numbers are all of type 'Number'.", difficulty: "beginner", topic: "algorithms", relatedConcepts: ["data types", "numbers"] },
      // Intermediate
      { question: "What is the result of [1,2,3].map(x => x * 2)?", options: ["[2,4,6]", "[1,2,3,2,4,6]", "[1,4,9]", "[2,3,4]"], correctAnswer: "[2,4,6]", explanation: "The map() method creates a new array with the results of calling a function on every element.", difficulty: "intermediate", topic: "algorithms", relatedConcepts: ["arrays", "map", "functions"] },
      { question: "What does 'use strict' do in Algorithms?", options: ["Enables strict mode", "Disables strict mode", "Declares a variable", "Defines a function"], correctAnswer: "Enables strict mode", explanation: "'use strict' enables strict mode, which catches common coding errors and prevents unsafe actions.", difficulty: "intermediate", topic: "algorithms", relatedConcepts: ["strict mode", "errors"] },
      { question: "Which of the following is a falsy value in Algorithms?", options: ["0", "'false'", "[]", "{}"], correctAnswer: "0", explanation: "0 is a falsy value. 'false', [], and {} are all truthy.", difficulty: "intermediate", topic: "algorithms", relatedConcepts: ["truthy", "falsy", "values"] },
      { question: "What is the output of typeof null?", options: ["'object'", "'null'", "'undefined'", "'number'"], correctAnswer: "'object'", explanation: "typeof null returns 'object' due to a historical bug in Algorithms.", difficulty: "intermediate", topic: "algorithms", relatedConcepts: ["null", "typeof"] },
      { question: "Which function is used to parse a string to an integer?", options: ["parseInt()", "parseFloat()", "Number()", "All of the above"], correctAnswer: "All of the above", explanation: "All these functions can convert a string to a number, but parseInt() specifically parses to integer.", difficulty: "intermediate", topic: "algorithms", relatedConcepts: ["parsing", "numbers"] },
      // Advanced
      { question: "What is a closure in Algorithms?", options: ["A function having access to its own scope, the outer function's scope, and the global scope", "A function that returns another function", "A function with no parameters", "A function that is immediately invoked"], correctAnswer: "A function having access to its own scope, the outer function's scope, and the global scope", explanation: "A closure is a function that retains access to its lexical scope even when executed outside its scope.", difficulty: "advanced", topic: "algorithms", relatedConcepts: ["closures", "scope", "functions"] },
      { question: "How can you create a private variable in Algorithms?", options: ["Using closures", "Using var", "Using let", "Using global variables"], correctAnswer: "Using closures", explanation: "Closures can be used to create private variables by encapsulating them within a function scope.", difficulty: "advanced", topic: "algorithms", relatedConcepts: ["private variables", "closures"] },
      { question: "What is the purpose of the 'bind' method?", options: ["To set the value of 'this' in a function", "To call a function", "To create a new array", "To loop through an array"], correctAnswer: "To set the value of 'this' in a function", explanation: "The bind() method creates a new function with a specified 'this' value.", difficulty: "advanced", topic: "algorithms", relatedConcepts: ["bind", "this", "functions"] },
      { question: "What is the difference between == and === in Algorithms?", options: ["== checks value only, === checks value and type", "== checks type only, === checks value only", "No difference", "== is for numbers, === is for strings"], correctAnswer: "== checks value only, === checks value and type", explanation: "== performs type coercion, while === checks both value and type.", difficulty: "advanced", topic: "algorithms", relatedConcepts: ["equality", "type coercion"] },
      { question: "What is the output of [].length?", options: ["0", "1", "undefined", "null"], correctAnswer: "0", explanation: "The length property of an empty array is 0.", difficulty: "advanced", topic: "algorithms", relatedConcepts: ["arrays", "length"] },
      // Adaptive
      { question: "Which of the following best describes adaptive learning in Algorithms quizzes?", options: ["Questions adjust based on user performance", "Questions are always random", "Questions are always the same", "Questions are only theoretical"], correctAnswer: "Questions adjust based on user performance", explanation: "Adaptive quizzes change the difficulty or topic based on how the user is performing.", difficulty: "adaptive", topic: "algorithms", relatedConcepts: ["adaptive learning", "quizzes"] },
      { question: "In an adaptive quiz, what happens if you answer several questions incorrectly?", options: ["You get easier questions", "You get harder questions", "No change", "Quiz ends"], correctAnswer: "You get easier questions", explanation: "Adaptive quizzes typically lower the difficulty if you answer incorrectly.", difficulty: "adaptive", topic: "algorithms", relatedConcepts: ["adaptive", "difficulty"] },
      { question: "What is a practical benefit of adaptive quizzes for Algorithms learners?", options: ["Personalized learning path", "Faster grading", "More theoretical questions", "No benefit"], correctAnswer: "Personalized learning path", explanation: "Adaptive quizzes help tailor the learning experience to the user's needs.", difficulty: "adaptive", topic: "algorithms", relatedConcepts: ["personalization", "learning"] },
      { question: "Which Algorithms feature is most useful for building adaptive quizzes?", options: ["Functions", "Event listeners", "Conditional logic", "Loops"], correctAnswer: "Conditional logic", explanation: "Conditional logic allows the quiz to change behavior based on user answers.", difficulty: "adaptive", topic: "algorithms", relatedConcepts: ["conditional logic", "adaptive"] },
      { question: "How can you track user progress in an adaptive Algorithms quiz?", options: ["Using state variables", "Using only HTML", "Using CSS", "Not possible"], correctAnswer: "Using state variables", explanation: "State variables (in React or similar) are used to track user progress and adapt the quiz.", difficulty: "adaptive", topic: "algorithms", relatedConcepts: ["state", "progress tracking"] },
      // Computer Science - Health
      // Beginner
      { question: "Which keyword is used to declare a variable in Health?", options: ["var", "let", "const", "All of the above"], correctAnswer: "All of the above", explanation: "In Health, you can declare variables using var, let, or const. Each has different scoping rules.", difficulty: "beginner", topic: "health", relatedConcepts: ["variables", "declaration", "scope"] },
      { question: "What does the following code output? console.log(2 + '2')", options: ["4", "'22'", "NaN", "undefined"], correctAnswer: "'22'", explanation: "When a number is added to a string in Health, the number is coerced to a string and concatenated.", difficulty: "beginner", topic: "health", relatedConcepts: ["type coercion", "strings", "operators"] },
      { question: "Which method is used to remove the last element from an array?", options: ["pop()", "push()", "shift()", "unshift()"], correctAnswer: "pop()", explanation: "The pop() method removes the last element from an array and returns that element.", difficulty: "beginner", topic: "health", relatedConcepts: ["arrays", "methods"] },
      { question: "How do you write a single-line comment in Health?", options: ["// comment", "<!-- comment -->", "# comment", "/* comment */"], correctAnswer: "// comment", explanation: "Single-line comments in Health start with //.", difficulty: "beginner", topic: "health", relatedConcepts: ["comments", "syntax"] },
      { question: "Which of the following is NOT a JavaScript data type?", options: ["String", "Boolean", "Float", "Undefined"], correctAnswer: "Float", explanation: "Health does not have a 'Float' type; numbers are all of type 'Number'.", difficulty: "beginner", topic: "health", relatedConcepts: ["data types", "numbers"] },
      // Intermediate
      { question: "What is the result of [1,2,3].map(x => x * 2)?", options: ["[2,4,6]", "[1,2,3,2,4,6]", "[1,4,9]", "[2,3,4]"], correctAnswer: "[2,4,6]", explanation: "The map() method creates a new array with the results of calling a function on every element.", difficulty: "intermediate", topic: "health", relatedConcepts: ["arrays", "map", "functions"] },
      { question: "What does 'use strict' do in Health?", options: ["Enables strict mode", "Disables strict mode", "Declares a variable", "Defines a function"], correctAnswer: "Enables strict mode", explanation: "'use strict' enables strict mode, which catches common coding errors and prevents unsafe actions.", difficulty: "intermediate", topic: "health", relatedConcepts: ["strict mode", "errors"] },
      { question: "Which of the following is a falsy value in Health?", options: ["0", "'false'", "[]", "{}"], correctAnswer: "0", explanation: "0 is a falsy value. 'false', [], and {} are all truthy.", difficulty: "intermediate", topic: "health", relatedConcepts: ["truthy", "falsy", "values"] },
      { question: "What is the output of typeof null?", options: ["'object'", "'null'", "'undefined'", "'number'"], correctAnswer: "'object'", explanation: "typeof null returns 'object' due to a historical bug in Health.", difficulty: "intermediate", topic: "health", relatedConcepts: ["null", "typeof"] },
      { question: "Which function is used to parse a string to an integer?", options: ["parseInt()", "parseFloat()", "Number()", "All of the above"], correctAnswer: "All of the above", explanation: "All these functions can convert a string to a number, but parseInt() specifically parses to integer.", difficulty: "intermediate", topic: "health", relatedConcepts: ["parsing", "numbers"] },
      // Advanced
      { question: "What is a closure in Health?", options: ["A function having access to its own scope, the outer function's scope, and the global scope", "A function that returns another function", "A function with no parameters", "A function that is immediately invoked"], correctAnswer: "A function having access to its own scope, the outer function's scope, and the global scope", explanation: "A closure is a function that retains access to its lexical scope even when executed outside its scope.", difficulty: "advanced", topic: "health", relatedConcepts: ["closures", "scope", "functions"] },
      { question: "How can you create a private variable in Health?", options: ["Using closures", "Using var", "Using let", "Using global variables"], correctAnswer: "Using closures", explanation: "Closures can be used to create private variables by encapsulating them within a function scope.", difficulty: "advanced", topic: "health", relatedConcepts: ["private variables", "closures"] },
      { question: "What is the purpose of the 'bind' method?", options: ["To set the value of 'this' in a function", "To call a function", "To create a new array", "To loop through an array"], correctAnswer: "To set the value of 'this' in a function", explanation: "The bind() method creates a new function with a specified 'this' value.", difficulty: "advanced", topic: "health", relatedConcepts: ["bind", "this", "functions"] },
      { question: "What is the difference between == and === in Health?", options: ["== checks value only, === checks value and type", "== checks type only, === checks value only", "No difference", "== is for numbers, === is for strings"], correctAnswer: "== checks value only, === checks value and type", explanation: "== performs type coercion, while === checks both value and type.", difficulty: "advanced", topic: "health", relatedConcepts: ["equality", "type coercion"] },
      { question: "What is the output of [].length?", options: ["0", "1", "undefined", "null"], correctAnswer: "0", explanation: "The length property of an empty array is 0.", difficulty: "advanced", topic: "health", relatedConcepts: ["arrays", "length"] },
      // Adaptive
      { question: "Which of the following best describes adaptive learning in Health quizzes?", options: ["Questions adjust based on user performance", "Questions are always random", "Questions are always the same", "Questions are only theoretical"], correctAnswer: "Questions adjust based on user performance", explanation: "Adaptive quizzes change the difficulty or topic based on how the user is performing.", difficulty: "adaptive", topic: "health", relatedConcepts: ["adaptive learning", "quizzes"] },
      { question: "In an adaptive quiz, what happens if you answer several questions incorrectly?", options: ["You get easier questions", "You get harder questions", "No change", "Quiz ends"], correctAnswer: "You get easier questions", explanation: "Adaptive quizzes typically lower the difficulty if you answer incorrectly.", difficulty: "adaptive", topic: "health", relatedConcepts: ["adaptive", "difficulty"] },
      { question: "What is a practical benefit of adaptive quizzes for Health learners?", options: ["Personalized learning path", "Faster grading", "More theoretical questions", "No benefit"], correctAnswer: "Personalized learning path", explanation: "Adaptive quizzes help tailor the learning experience to the user's needs.", difficulty: "adaptive", topic: "health", relatedConcepts: ["personalization", "learning"] },
      { question: "Which Health feature is most useful for building adaptive quizzes?", options: ["Functions", "Event listeners", "Conditional logic", "Loops"], correctAnswer: "Conditional logic", explanation: "Conditional logic allows the quiz to change behavior based on user answers.", difficulty: "adaptive", topic: "health", relatedConcepts: ["conditional logic", "adaptive"] },
      { question: "How can you track user progress in an adaptive Health quiz?", options: ["Using state variables", "Using only HTML", "Using CSS", "Not possible"], correctAnswer: "Using state variables", explanation: "State variables (in React or similar) are used to track user progress and adapt the quiz.", difficulty: "adaptive", topic: "health", relatedConcepts: ["state", "progress tracking"] },
      // Computer Science - Mathematics
      // Beginner
      { question: "Which keyword is used to declare a variable in Mathematics?", options: ["var", "let", "const", "All of the above"], correctAnswer: "All of the above", explanation: "In Mathematics, you can declare variables using var, let, or const. Each has different scoping rules.", difficulty: "beginner", topic: "mathematics", relatedConcepts: ["variables", "declaration", "scope"] },
      { question: "What does the following code output? console.log(2 + '2')", options: ["4", "'22'", "NaN", "undefined"], correctAnswer: "'22'", explanation: "When a number is added to a string in Mathematics, the number is coerced to a string and concatenated.", difficulty: "beginner", topic: "mathematics", relatedConcepts: ["type coercion", "strings", "operators"] },
      { question: "Which method is used to remove the last element from an array?", options: ["pop()", "push()", "shift()", "unshift()"], correctAnswer: "pop()", explanation: "The pop() method removes the last element from an array and returns that element.", difficulty: "beginner", topic: "mathematics", relatedConcepts: ["arrays", "methods"] },
      { question: "How do you write a single-line comment in Mathematics?", options: ["// comment", "<!-- comment -->", "# comment", "/* comment */"], correctAnswer: "// comment", explanation: "Single-line comments in Mathematics start with //.", difficulty: "beginner", topic: "mathematics", relatedConcepts: ["comments", "syntax"] },
      { question: "Which of the following is NOT a JavaScript data type?", options: ["String", "Boolean", "Float", "Undefined"], correctAnswer: "Float", explanation: "Mathematics does not have a 'Float' type; numbers are all of type 'Number'.", difficulty: "beginner", topic: "mathematics", relatedConcepts: ["data types", "numbers"] },
      // Intermediate
      { question: "What is the result of [1,2,3].map(x => x * 2)?", options: ["[2,4,6]", "[1,2,3,2,4,6]", "[1,4,9]", "[2,3,4]"], correctAnswer: "[2,4,6]", explanation: "The map() method creates a new array with the results of calling a function on every element.", difficulty: "intermediate", topic: "mathematics", relatedConcepts: ["arrays", "map", "functions"] },
      { question: "What does 'use strict' do in Mathematics?", options: ["Enables strict mode", "Disables strict mode", "Declares a variable", "Defines a function"], correctAnswer: "Enables strict mode", explanation: "'use strict' enables strict mode, which catches common coding errors and prevents unsafe actions.", difficulty: "intermediate", topic: "mathematics", relatedConcepts: ["strict mode", "errors"] },
      { question: "Which of the following is a falsy value in Mathematics?", options: ["0", "'false'", "[]", "{}"], correctAnswer: "0", explanation: "0 is a falsy value. 'false', [], and {} are all truthy.", difficulty: "intermediate", topic: "mathematics", relatedConcepts: ["truthy", "falsy", "values"] },
      { question: "What is the output of typeof null?", options: ["'object'", "'null'", "'undefined'", "'number'"], correctAnswer: "'object'", explanation: "typeof null returns 'object' due to a historical bug in Mathematics.", difficulty: "intermediate", topic: "mathematics", relatedConcepts: ["null", "typeof"] },
      { question: "Which function is used to parse a string to an integer?", options: ["parseInt()", "parseFloat()", "Number()", "All of the above"], correctAnswer: "All of the above", explanation: "All these functions can convert a string to a number, but parseInt() specifically parses to integer.", difficulty: "intermediate", topic: "mathematics", relatedConcepts: ["parsing", "numbers"] },
      // Advanced
      { question: "What is a closure in Mathematics?", options: ["A function having access to its own scope, the outer function's scope, and the global scope", "A function that returns another function", "A function with no parameters", "A function that is immediately invoked"], correctAnswer: "A function having access to its own scope, the outer function's scope, and the global scope", explanation: "A closure is a function that retains access to its lexical scope even when executed outside its scope.", difficulty: "advanced", topic: "mathematics", relatedConcepts: ["closures", "scope", "functions"] },
      { question: "How can you create a private variable in Mathematics?", options: ["Using closures", "Using var", "Using let", "Using global variables"], correctAnswer: "Using closures", explanation: "Closures can be used to create private variables by encapsulating them within a function scope.", difficulty: "advanced", topic: "mathematics", relatedConcepts: ["private variables", "closures"] },
      { question: "What is the purpose of the 'bind' method?", options: ["To set the value of 'this' in a function", "To call a function", "To create a new array", "To loop through an array"], correctAnswer: "To set the value of 'this' in a function", explanation: "The bind() method creates a new function with a specified 'this' value.", difficulty: "advanced", topic: "mathematics", relatedConcepts: ["bind", "this", "functions"] },
      { question: "What is the difference between == and === in Mathematics?", options: ["== checks value only, === checks value and type", "== checks type only, === checks value only", "No difference", "== is for numbers, === is for strings"], correctAnswer: "== checks value only, === checks value and type", explanation: "== performs type coercion, while === checks both value and type.", difficulty: "advanced", topic: "mathematics", relatedConcepts: ["equality", "type coercion"] },
      { question: "What is the output of [].length?", options: ["0", "1", "undefined", "null"], correctAnswer: "0", explanation: "The length property of an empty array is 0.", difficulty: "advanced", topic: "mathematics", relatedConcepts: ["arrays", "length"] },
      // Adaptive
      { question: "Which of the following best describes adaptive learning in Mathematics quizzes?", options: ["Questions adjust based on user performance", "Questions are always random", "Questions are always the same", "Questions are only theoretical"], correctAnswer: "Questions adjust based on user performance", explanation: "Adaptive quizzes change the difficulty or topic based on how the user is performing.", difficulty: "adaptive", topic: "mathematics", relatedConcepts: ["adaptive learning", "quizzes"] },
      { question: "In an adaptive quiz, what happens if you answer several questions incorrectly?", options: ["You get easier questions", "You get harder questions", "No change", "Quiz ends"], correctAnswer: "You get easier questions", explanation: "Adaptive quizzes typically lower the difficulty if you answer incorrectly.", difficulty: "adaptive", topic: "mathematics", relatedConcepts: ["adaptive", "difficulty"] },
      { question: "What is a practical benefit of adaptive quizzes for Mathematics learners?", options: ["Personalized learning path", "Faster grading", "More theoretical questions", "No benefit"], correctAnswer: "Personalized learning path", explanation: "Adaptive quizzes help tailor the learning experience to the user's needs.", difficulty: "adaptive", topic: "mathematics", relatedConcepts: ["personalization", "learning"] },
      { question: "Which Mathematics feature is most useful for building adaptive quizzes?", options: ["Functions", "Event listeners", "Conditional logic", "Loops"], correctAnswer: "Conditional logic", explanation: "Conditional logic allows the quiz to change behavior based on user answers.", difficulty: "adaptive", topic: "mathematics", relatedConcepts: ["conditional logic", "adaptive"] },
      { question: "How can you track user progress in an adaptive Mathematics quiz?", options: ["Using state variables", "Using only HTML", "Using CSS", "Not possible"], correctAnswer: "Using state variables", explanation: "State variables (in React or similar) are used to track user progress and adapt the quiz.", difficulty: "adaptive", topic: "mathematics", relatedConcepts: ["state", "progress tracking"] },
      // Computer Science - Law
      // Beginner
      { question: "Which keyword is used to declare a variable in Law?", options: ["var", "let", "const", "All of the above"], correctAnswer: "All of the above", explanation: "In Law, you can declare variables using var, let, or const. Each has different scoping rules.", difficulty: "beginner", topic: "law", relatedConcepts: ["variables", "declaration", "scope"] },
      { question: "What does the following code output? console.log(2 + '2')", options: ["4", "'22'", "NaN", "undefined"], correctAnswer: "'22'", explanation: "When a number is added to a string in Law, the number is coerced to a string and concatenated.", difficulty: "beginner", topic: "law", relatedConcepts: ["type coercion", "strings", "operators"] },
      { question: "Which method is used to remove the last element from an array?", options: ["pop()", "push()", "shift()", "unshift()"], correctAnswer: "pop()", explanation: "The pop() method removes the last element from an array and returns that element.", difficulty: "beginner", topic: "law", relatedConcepts: ["arrays", "methods"] },
      { question: "How do you write a single-line comment in Law?", options: ["// comment", "<!-- comment -->", "# comment", "/* comment */"], correctAnswer: "// comment", explanation: "Single-line comments in Law start with //.", difficulty: "beginner", topic: "law", relatedConcepts: ["comments", "syntax"] },
      { question: "Which of the following is NOT a JavaScript data type?", options: ["String", "Boolean", "Float", "Undefined"], correctAnswer: "Float", explanation: "Law does not have a 'Float' type; numbers are all of type 'Number'.", difficulty: "beginner", topic: "law", relatedConcepts: ["data types", "numbers"] },
      // Intermediate
      { question: "What is the result of [1,2,3].map(x => x * 2)?", options: ["[2,4,6]", "[1,2,3,2,4,6]", "[1,4,9]", "[2,3,4]"], correctAnswer: "[2,4,6]", explanation: "The map() method creates a new array with the results of calling a function on every element.", difficulty: "intermediate", topic: "law", relatedConcepts: ["arrays", "map", "functions"] },
      { question: "What does 'use strict' do in Law?", options: ["Enables strict mode", "Disables strict mode", "Declares a variable", "Defines a function"], correctAnswer: "Enables strict mode", explanation: "'use strict' enables strict mode, which catches common coding errors and prevents unsafe actions.", difficulty: "intermediate", topic: "law", relatedConcepts: ["strict mode", "errors"] },
      { question: "Which of the following is a falsy value in Law?", options: ["0", "'false'", "[]", "{}"], correctAnswer: "0", explanation: "0 is a falsy value. 'false', [], and {} are all truthy.", difficulty: "intermediate", topic: "law", relatedConcepts: ["truthy", "falsy", "values"] },
      { question: "What is the output of typeof null?", options: ["'object'", "'null'", "'undefined'", "'number'"], correctAnswer: "'object'", explanation: "typeof null returns 'object' due to a historical bug in Law.", difficulty: "intermediate", topic: "law", relatedConcepts: ["null", "typeof"] },
      { question: "Which function is used to parse a string to an integer?", options: ["parseInt()", "parseFloat()", "Number()", "All of the above"], correctAnswer: "All of the above", explanation: "All these functions can convert a string to a number, but parseInt() specifically parses to integer.", difficulty: "intermediate", topic: "law", relatedConcepts: ["parsing", "numbers"] },
      // Advanced
      { question: "What is a closure in Law?", options: ["A function having access to its own scope, the outer function's scope, and the global scope", "A function that returns another function", "A function with no parameters", "A function that is immediately invoked"], correctAnswer: "A function having access to its own scope, the outer function's scope, and the global scope", explanation: "A closure is a function that retains access to its lexical scope even when executed outside its scope.", difficulty: "advanced", topic: "law", relatedConcepts: ["closures", "scope", "functions"] },
      { question: "How can you create a private variable in Law?", options: ["Using closures", "Using var", "Using let", "Using global variables"], correctAnswer: "Using closures", explanation: "Closures can be used to create private variables by encapsulating them within a function scope.", difficulty: "advanced", topic: "law", relatedConcepts: ["private variables", "closures"] },
      { question: "What is the purpose of the 'bind' method?", options: ["To set the value of 'this' in a function", "To call a function", "To create a new array", "To loop through an array"], correctAnswer: "To set the value of 'this' in a function", explanation: "The bind() method creates a new function with a specified 'this' value.", difficulty: "advanced", topic: "law", relatedConcepts: ["bind", "this", "functions"] },
      { question: "What is the difference between == and === in Law?", options: ["== checks value only, === checks value and type", "== checks type only, === checks value only", "No difference", "== is for numbers, === is for strings"], correctAnswer: "== checks value only, === checks value and type", explanation: "== performs type coercion, while === checks both value and type.", difficulty: "advanced", topic: "law", relatedConcepts: ["equality", "type coercion"] },
      { question: "What is the output of [].length?", options: ["0", "1", "undefined", "null"], correctAnswer: "0", explanation: "The length property of an empty array is 0.", difficulty: "advanced", topic: "law", relatedConcepts: ["arrays", "length"] },
      // Adaptive
      { question: "Which of the following best describes adaptive learning in Law quizzes?", options: ["Questions adjust based on user performance", "Questions are always random", "Questions are always the same", "Questions are only theoretical"], correctAnswer: "Questions adjust based on user performance", explanation: "Adaptive quizzes change the difficulty or topic based on how the user is performing.", difficulty: "adaptive", topic: "law", relatedConcepts: ["adaptive learning", "quizzes"] },
      { question: "In an adaptive quiz, what happens if you answer several questions incorrectly?", options: ["You get easier questions", "You get harder questions", "No change", "Quiz ends"], correctAnswer: "You get easier questions", explanation: "Adaptive quizzes typically lower the difficulty if you answer incorrectly.", difficulty: "adaptive", topic: "law", relatedConcepts: ["adaptive", "difficulty"] },
      { question: "What is a practical benefit of adaptive quizzes for Law learners?", options: ["Personalized learning path", "Faster grading", "More theoretical questions", "No benefit"], correctAnswer: "Personalized learning path", explanation: "Adaptive quizzes help tailor the learning experience to the user's needs.", difficulty: "adaptive", topic: "law", relatedConcepts: ["personalization", "learning"] },
      { question: "Which Law feature is most useful for building adaptive quizzes?", options: ["Functions", "Event listeners", "Conditional logic", "Loops"], correctAnswer: "Conditional logic", explanation: "Conditional logic allows the quiz to change behavior based on user answers.", difficulty: "adaptive", topic: "law", relatedConcepts: ["conditional logic", "adaptive"] },
      { question: "How can you track user progress in an adaptive Law quiz?", options: ["Using state variables", "Using only HTML", "Using CSS", "Not possible"], correctAnswer: "Using state variables", explanation: "State variables (in React or similar) are used to track user progress and adapt the quiz.", difficulty: "adaptive", topic: "law", relatedConcepts: ["state", "progress tracking"] },
      // Computer Science - Psychology
      // Beginner
      { question: "Which keyword is used to declare a variable in Psychology?", options: ["var", "let", "const", "All of the above"], correctAnswer: "All of the above", explanation: "In Psychology, you can declare variables using var, let, or const. Each has different scoping rules.", difficulty: "beginner", topic: "psychology", relatedConcepts: ["variables", "declaration", "scope"] },
      { question: "What does the following code output? console.log(2 + '2')", options: ["4", "'22'", "NaN", "undefined"], correctAnswer: "'22'", explanation: "When a number is added to a string in Psychology, the number is coerced to a string and concatenated.", difficulty: "beginner", topic: "psychology", relatedConcepts: ["type coercion", "strings", "operators"] },
      { question: "Which method is used to remove the last element from an array?", options: ["pop()", "push()", "shift()", "unshift()"], correctAnswer: "pop()", explanation: "The pop() method removes the last element from an array and returns that element.", difficulty: "beginner", topic: "psychology", relatedConcepts: ["arrays", "methods"] },
      { question: "How do you write a single-line comment in Psychology?", options: ["// comment", "<!-- comment -->", "# comment", "/* comment */"], correctAnswer: "// comment", explanation: "Single-line comments in Psychology start with //.", difficulty: "beginner", topic: "psychology", relatedConcepts: ["comments", "syntax"] },
      { question: "Which of the following is NOT a JavaScript data type?", options: ["String", "Boolean", "Float", "Undefined"], correctAnswer: "Float", explanation: "Psychology does not have a 'Float' type; numbers are all of type 'Number'.", difficulty: "beginner", topic: "psychology", relatedConcepts: ["data types", "numbers"] },
      // Intermediate
      { question: "What is the result of [1,2,3].map(x => x * 2)?", options: ["[2,4,6]", "[1,2,3,2,4,6]", "[1,4,9]", "[2,3,4]"], correctAnswer: "[2,4,6]", explanation: "The map() method creates a new array with the results of calling a function on every element.", difficulty: "intermediate", topic: "psychology", relatedConcepts: ["arrays", "map", "functions"] },
      { question: "What does 'use strict' do in Psychology?", options: ["Enables strict mode", "Disables strict mode", "Declares a variable", "Defines a function"], correctAnswer: "Enables strict mode", explanation: "'use strict' enables strict mode, which catches common coding errors and prevents unsafe actions.", difficulty: "intermediate", topic: "psychology", relatedConcepts: ["strict mode", "errors"] },
      { question: "Which of the following is a falsy value in Psychology?", options: ["0", "'false'", "[]", "{}"], correctAnswer: "0", explanation: "0 is a falsy value. 'false', [], and {} are all truthy.", difficulty: "intermediate", topic: "psychology", relatedConcepts: ["truthy", "falsy", "values"] },
      { question: "What is the output of typeof null?", options: ["'object'", "'null'", "'undefined'", "'number'"], correctAnswer: "'object'", explanation: "typeof null returns 'object' due to a historical bug in Psychology.", difficulty: "intermediate", topic: "psychology", relatedConcepts: ["null", "typeof"] },
      { question: "Which function is used to parse a string to an integer?", options: ["parseInt()", "parseFloat()", "Number()", "All of the above"], correctAnswer: "All of the above", explanation: "All these functions can convert a string to a number, but parseInt() specifically parses to integer.", difficulty: "intermediate", topic: "psychology", relatedConcepts: ["parsing", "numbers"] },
      // Advanced
      { question: "What is a closure in Psychology?", options: ["A function having access to its own scope, the outer function's scope, and the global scope", "A function that returns another function", "A function with no parameters", "A function that is immediately invoked"], correctAnswer: "A function having access to its own scope, the outer function's scope, and the global scope", explanation: "A closure is a function that retains access to its lexical scope even when executed outside its scope.", difficulty: "advanced", topic: "psychology", relatedConcepts: ["closures", "scope", "functions"] },
      { question: "How can you create a private variable in Psychology?", options: ["Using closures", "Using var", "Using let", "Using global variables"], correctAnswer: "Using closures", explanation: "Closures can be used to create private variables by encapsulating them within a function scope.", difficulty: "advanced", topic: "psychology", relatedConcepts: ["private variables", "closures"] },
      { question: "What is the purpose of the 'bind' method?", options: ["To set the value of 'this' in a function", "To call a function", "To create a new array", "To loop through an array"], correctAnswer: "To set the value of 'this' in a function", explanation: "The bind() method creates a new function with a specified 'this' value.", difficulty: "advanced", topic: "psychology", relatedConcepts: ["bind", "this", "functions"] },
      { question: "What is the difference between == and === in Psychology?", options: ["== checks value only, === checks value and type", "== checks type only, === checks value only", "No difference", "== is for numbers, === is for strings"], correctAnswer: "== checks value only, === checks value and type", explanation: "== performs type coercion, while === checks both value and type.", difficulty: "advanced", topic: "psychology", relatedConcepts: ["equality", "type coercion"] },
      { question: "What is the output of [].length?", options: ["0", "1", "undefined", "null"], correctAnswer: "0", explanation: "The length property of an empty array is 0.", difficulty: "advanced", topic: "psychology", relatedConcepts: ["arrays", "length"] },
      // Adaptive
      { question: "Which of the following best describes adaptive learning in Psychology quizzes?", options: ["Questions adjust based on user performance", "Questions are always random", "Questions are always the same", "Questions are only theoretical"], correctAnswer: "Questions adjust based on user performance", explanation: "Adaptive quizzes change the difficulty or topic based on how the user is performing.", difficulty: "adaptive", topic: "psychology", relatedConcepts: ["adaptive learning", "quizzes"] },
      { question: "In an adaptive quiz, what happens if you answer several questions incorrectly?", options: ["You get easier questions", "You get harder questions", "No change", "Quiz ends"], correctAnswer: "You get easier questions", explanation: "Adaptive quizzes typically lower the difficulty if you answer incorrectly.", difficulty: "adaptive", topic: "psychology", relatedConcepts: ["adaptive", "difficulty"] },
      { question: "What is a practical benefit of adaptive quizzes for Psychology learners?", options: ["Personalized learning path", "Faster grading", "More theoretical questions", "No benefit"], correctAnswer: "Personalized learning path", explanation: "Adaptive quizzes help tailor the learning experience to the user's needs.", difficulty: "adaptive", topic: "psychology", relatedConcepts: ["personalization", "learning"] },
      { question: "Which Psychology feature is most useful for building adaptive quizzes?", options: ["Functions", "Event listeners", "Conditional logic", "Loops"], correctAnswer: "Conditional logic", explanation: "Conditional logic allows the quiz to change behavior based on user answers.", difficulty: "adaptive", topic: "psychology", relatedConcepts: ["conditional logic", "adaptive"] },
      { question: "How can you track user progress in an adaptive Psychology quiz?", options: ["Using state variables", "Using only HTML", "Using CSS", "Not possible"], correctAnswer: "Using state variables", explanation: "State variables (in React or similar) are used to track user progress and adapt the quiz.", difficulty: "adaptive", topic: "psychology", relatedConcepts: ["state", "progress tracking"] },
      // Computer Science - Business
      // Beginner
      { question: "Which keyword is used to declare a variable in Business?", options: ["var", "let", "const", "All of the above"], correctAnswer: "All of the above", explanation: "In Business, you can declare variables using var, let, or const. Each has different scoping rules.", difficulty: "beginner", topic: "business", relatedConcepts: ["variables", "declaration", "scope"] },
      { question: "What does the following code output? console.log(2 + '2')", options: ["4", "'22'", "NaN", "undefined"], correctAnswer: "'22'", explanation: "When a number is added to a string in Business, the number is coerced to a string and concatenated.", difficulty: "beginner", topic: "business", relatedConcepts: ["type coercion", "strings", "operators"] },
      { question: "Which method is used to remove the last element from an array?", options: ["pop()", "push()", "shift()", "unshift()"], correctAnswer: "pop()", explanation: "The pop() method removes the last element from an array and returns that element.", difficulty: "beginner", topic: "business", relatedConcepts: ["arrays", "methods"] },
      { question: "How do you write a single-line comment in Business?", options: ["// comment", "<!-- comment -->", "# comment", "/* comment */"], correctAnswer: "// comment", explanation: "Single-line comments in Business start with //.", difficulty: "beginner", topic: "business", relatedConcepts: ["comments", "syntax"] },
      { question: "Which of the following is NOT a JavaScript data type?", options: ["String", "Boolean", "Float", "Undefined"], correctAnswer: "Float", explanation: "Business does not have a 'Float' type; numbers are all of type 'Number'.", difficulty: "beginner", topic: "business", relatedConcepts: ["data types", "numbers"] },
      // Intermediate
      { question: "What is the result of [1,2,3].map(x => x * 2)?", options: ["[2,4,6]", "[1,2,3,2,4,6]", "[1,4,9]", "[2,3,4]"], correctAnswer: "[2,4,6]", explanation: "The map() method creates a new array with the results of calling a function on every element.", difficulty: "intermediate", topic: "business", relatedConcepts: ["arrays", "map", "functions"] },
      { question: "What does 'use strict' do in Business?", options: ["Enables strict mode", "Disables strict mode", "Declares a variable", "Defines a function"], correctAnswer: "Enables strict mode", explanation: "'use strict' enables strict mode, which catches common coding errors and prevents unsafe actions.", difficulty: "intermediate", topic: "business", relatedConcepts: ["strict mode", "errors"] },
      { question: "Which of the following is a falsy value in Business?", options: ["0", "'false'", "[]", "{}"], correctAnswer: "0", explanation: "0 is a falsy value. 'false', [], and {} are all truthy.", difficulty: "intermediate", topic: "business", relatedConcepts: ["truthy", "falsy", "values"] },
      { question: "What is the output of typeof null?", options: ["'object'", "'null'", "'undefined'", "'number'"], correctAnswer: "'object'", explanation: "typeof null returns 'object' due to a historical bug in Business.", difficulty: "intermediate", topic: "business", relatedConcepts: ["null", "typeof"] },
      { question: "Which function is used to parse a string to an integer?", options: ["parseInt()", "parseFloat()", "Number()", "All of the above"], correctAnswer: "All of the above", explanation: "All these functions can convert a string to a number, but parseInt() specifically parses to integer.", difficulty: "intermediate", topic: "business", relatedConcepts: ["parsing", "numbers"] },
      // Advanced
      { question: "What is a closure in Business?", options: ["A function having access to its own scope, the outer function's scope, and the global scope", "A function that returns another function", "A function with no parameters", "A function that is immediately invoked"], correctAnswer: "A function having access to its own scope, the outer function's scope, and the global scope", explanation: "A closure is a function that retains access to its lexical scope even when executed outside its scope.", difficulty: "advanced", topic: "business", relatedConcepts: ["closures", "scope", "functions"] },
      { question: "How can you create a private variable in Business?", options: ["Using closures", "Using var", "Using let", "Using global variables"], correctAnswer: "Using closures", explanation: "Closures can be used to create private variables by encapsulating them within a function scope.", difficulty: "advanced", topic: "business", relatedConcepts: ["private variables", "closures"] },
      { question: "What is the purpose of the 'bind' method?", options: ["To set the value of 'this' in a function", "To call a function", "To create a new array", "To loop through an array"], correctAnswer: "To set the value of 'this' in a function", explanation: "The bind() method creates a new function with a specified 'this' value.", difficulty: "advanced", topic: "business", relatedConcepts: ["bind", "this", "functions"] },
      { question: "What is the difference between == and === in Business?", options: ["== checks value only, === checks value and type", "== checks type only, === checks value only", "No difference", "== is for numbers, === is for strings"], correctAnswer: "== checks value only, === checks value and type", explanation: "== performs type coercion, while === checks both value and type.", difficulty: "advanced", topic: "business", relatedConcepts: ["equality", "type coercion"] },
      { question: "What is the output of [].length?", options: ["0", "1", "undefined", "null"], correctAnswer: "0", explanation: "The length property of an empty array is 0.", difficulty: "advanced", topic: "business", relatedConcepts: ["arrays", "length"] },
      // Adaptive
      { question: "Which of the following best describes adaptive learning in Business quizzes?", options: ["Questions adjust based on user performance", "Questions are always random", "Questions are always the same", "Questions are only theoretical"], correctAnswer: "Questions adjust based on user performance", explanation: "Adaptive quizzes change the difficulty or topic based on how the user is performing.", difficulty: "adaptive", topic: "business", relatedConcepts: ["adaptive learning", "quizzes"] },
      { question: "In an adaptive quiz, what happens if you answer several questions incorrectly?", options: ["You get easier questions", "You get harder questions", "No change", "Quiz ends"], correctAnswer: "You get easier questions", explanation: "Adaptive quizzes typically lower the difficulty if you answer incorrectly.", difficulty: "adaptive", topic: "business", relatedConcepts: ["adaptive", "difficulty"] },
      { question: "What is a practical benefit of adaptive quizzes for Business learners?", options: ["Personalized learning path", "Faster grading", "More theoretical questions", "No benefit"], correctAnswer: "Personalized learning path", explanation: "Adaptive quizzes help tailor the learning experience to the user's needs.", difficulty: "adaptive", topic: "business", relatedConcepts: ["personalization", "learning"] },
      { question: "Which Business feature is most useful for building adaptive quizzes?", options: ["Functions", "Event listeners", "Conditional logic", "Loops"], correctAnswer: "Conditional logic", explanation: "Conditional logic allows the quiz to change behavior based on user answers.", difficulty: "adaptive", topic: "business", relatedConcepts: ["conditional logic", "adaptive"] },
      { question: "How can you track user progress in an adaptive Business quiz?", options: ["Using state variables", "Using only HTML", "Using CSS", "Not possible"], correctAnswer: "Using state variables", explanation: "State variables (in React or similar) are used to track user progress and adapt the quiz.", difficulty: "adaptive", topic: "business", relatedConcepts: ["state", "progress tracking"] },
      // Computer Science - Engineering
      // Beginner
      { question: "Which keyword is used to declare a variable in Engineering?", options: ["var", "let", "const", "All of the above"], correctAnswer: "All of the above", explanation: "In Engineering, you can declare variables using var, let, or const. Each has different scoping rules.", difficulty: "beginner", topic: "engineering", relatedConcepts: ["variables", "declaration", "scope"] },
      { question: "What does the following code output? console.log(2 + '2')", options: ["4", "'22'", "NaN", "undefined"], correctAnswer: "'22'", explanation: "When a number is added to a string in Engineering, the number is coerced to a string and concatenated.", difficulty: "beginner", topic: "engineering", relatedConcepts: ["type coercion", "strings", "operators"] },
      { question: "Which method is used to remove the last element from an array?", options: ["pop()", "push()", "shift()", "unshift()"], correctAnswer: "pop()", explanation: "The pop() method removes the last element from an array and returns that element.", difficulty: "beginner", topic: "engineering", relatedConcepts: ["arrays", "methods"] },
      { question: "How do you write a single-line comment in Engineering?", options: ["// comment", "<!-- comment -->", "# comment", "/* comment */"], correctAnswer: "// comment", explanation: "Single-line comments in Engineering start with //.", difficulty: "beginner", topic: "engineering", relatedConcepts: ["comments", "syntax"] },
      { question: "Which of the following is NOT a JavaScript data type?", options: ["String", "Boolean", "Float", "Undefined"], correctAnswer: "Float", explanation: "Engineering does not have a 'Float' type; numbers are all of type 'Number'.", difficulty: "beginner", topic: "engineering", relatedConcepts: ["data types", "numbers"] },
      // Intermediate
      { question: "What is the result of [1,2,3].map(x => x * 2)?", options: ["[2,4,6]", "[1,2,3,2,4,6]", "[1,4,9]", "[2,3,4]"], correctAnswer: "[2,4,6]", explanation: "The map() method creates a new array with the results of calling a function on every element.", difficulty: "intermediate", topic: "engineering", relatedConcepts: ["arrays", "map", "functions"] },
      { question: "What does 'use strict' do in Engineering?", options: ["Enables strict mode", "Disables strict mode", "Declares a variable", "Defines a function"], correctAnswer: "Enables strict mode", explanation: "'use strict' enables strict mode, which catches common coding errors and prevents unsafe actions.", difficulty: "intermediate", topic: "engineering", relatedConcepts: ["strict mode", "errors"] },
      { question: "Which of the following is a falsy value in Engineering?", options: ["0", "'false'", "[]", "{}"], correctAnswer: "0", explanation: "0 is a falsy value. 'false', [], and {} are all truthy.", difficulty: "intermediate", topic: "engineering", relatedConcepts: ["truthy", "falsy", "values"] },
      { question: "What is the output of typeof null?", options: ["'object'", "'null'", "'undefined'", "'number'"], correctAnswer: "'object'", explanation: "typeof null returns 'object' due to a historical bug in Engineering.", difficulty: "intermediate", topic: "engineering", relatedConcepts: ["null", "typeof"] },
      { question: "Which function is used to parse a string to an integer?", options: ["parseInt()", "parseFloat()", "Number()", "All of the above"], correctAnswer: "All of the above", explanation: "All these functions can convert a string to a number, but parseInt() specifically parses to integer.", difficulty: "intermediate", topic: "engineering", relatedConcepts: ["parsing", "numbers"] },
      // Advanced
      { question: "What is a closure in Engineering?", options: ["A function having access to its own scope, the outer function's scope, and the global scope", "A function that returns another function", "A function with no parameters", "A function that is immediately invoked"], correctAnswer: "A function having access to its own scope, the outer function's scope, and the global scope", explanation: "A closure is a function that retains access to its lexical scope even when executed outside its scope.", difficulty: "advanced", topic: "engineering", relatedConcepts: ["closures", "scope", "functions"] },
      { question: "How can you create a private variable in Engineering?", options: ["Using closures", "Using var", "Using let", "Using global variables"], correctAnswer: "Using closures", explanation: "Closures can be used to create private variables by encapsulating them within a function scope.", difficulty: "advanced", topic: "engineering", relatedConcepts: ["private variables", "closures"] },
      { question: "What is the purpose of the 'bind' method?", options: ["To set the value of 'this' in a function", "To call a function", "To create a new array", "To loop through an array"], correctAnswer: "To set the value of 'this' in a function", explanation: "The bind() method creates a new function with a specified 'this' value.", difficulty: "advanced", topic: "engineering", relatedConcepts: ["bind", "this", "functions"] },
      { question: "What is the difference between == and === in Engineering?", options: ["== checks value only, === checks value and type", "== checks type only, === checks value only", "No difference", "== is for numbers, === is for strings"], correctAnswer: "== checks value only, === checks value and type", explanation: "== performs type coercion, while === checks both value and type.", difficulty: "advanced", topic: "engineering", relatedConcepts: ["equality", "type coercion"] },
      { question: "What is the output of [].length?", options: ["0", "1", "undefined", "null"], correctAnswer: "0", explanation: "The length property of an empty array is 0.", difficulty: "advanced", topic: "engineering", relatedConcepts: ["arrays", "length"] },
      // Adaptive
      { question: "Which of the following best describes adaptive learning in Engineering quizzes?", options: ["Questions adjust based on user performance", "Questions are always random", "Questions are always the same", "Questions are only theoretical"], correctAnswer: "Questions adjust based on user performance", explanation: "Adaptive quizzes change the difficulty or topic based on how the user is performing.", difficulty: "adaptive", topic: "engineering", relatedConcepts: ["adaptive learning", "quizzes"] },
      { question: "In an adaptive quiz, what happens if you answer several questions incorrectly?", options: ["You get easier questions", "You get harder questions", "No change", "Quiz ends"], correctAnswer: "You get easier questions", explanation: "Adaptive quizzes typically lower the difficulty if you answer incorrectly.", difficulty: "adaptive", topic: "engineering", relatedConcepts: ["adaptive", "difficulty"] },
      { question: "What is a practical benefit of adaptive quizzes for Engineering learners?", options: ["Personalized learning path", "Faster grading", "More theoretical questions", "No benefit"], correctAnswer: "Personalized learning path", explanation: "Adaptive quizzes help tailor the learning experience to the user's needs.", difficulty: "adaptive", topic: "engineering", relatedConcepts: ["personalization", "learning"] },
      { question: "Which Engineering feature is most useful for building adaptive quizzes?", options: ["Functions", "Event listeners", "Conditional logic", "Loops"], correctAnswer: "Conditional logic", explanation: "Conditional logic allows the quiz to change behavior based on user answers.", difficulty: "adaptive", topic: "engineering", relatedConcepts: ["conditional logic", "adaptive"] },
      { question: "How can you track user progress in an adaptive Engineering quiz?", options: ["Using state variables", "Using only HTML", "Using CSS", "Not possible"], correctAnswer: "Using state variables", explanation: "State variables (in React or similar) are used to track user progress and adapt the quiz.", difficulty: "adaptive", topic: "engineering", relatedConcepts: ["state", "progress tracking"] },
      // Computer Science - Arts & Humanities
      // Beginner
      { question: "Which keyword is used to declare a variable in Arts & Humanities?", options: ["var", "let", "const", "All of the above"], correctAnswer: "All of the above", explanation: "In Arts & Humanities, you can declare variables using var, let, or const. Each has different scoping rules.", difficulty: "beginner", topic: "arts-humanities", relatedConcepts: ["variables", "declaration", "scope"] },
      { question: "What does the following code output? console.log(2 + '2')", options: ["4", "'22'", "NaN", "undefined"], correctAnswer: "'22'", explanation: "When a number is added to a string in Arts & Humanities, the number is coerced to a string and concatenated.", difficulty: "beginner", topic: "arts-humanities", relatedConcepts: ["type coercion", "strings", "operators"] },
      { question: "Which method is used to remove the last element from an array?", options: ["pop()", "push()", "shift()", "unshift()"], correctAnswer: "pop()", explanation: "The pop() method removes the last element from an array and returns that element.", difficulty: "beginner", topic: "arts-humanities", relatedConcepts: ["arrays", "methods"] },
      { question: "How do you write a single-line comment in Arts & Humanities?", options: ["// comment", "<!-- comment -->", "# comment", "/* comment */"], correctAnswer: "// comment", explanation: "Single-line comments in Arts & Humanities start with //.", difficulty: "beginner", topic: "arts-humanities", relatedConcepts: ["comments", "syntax"] },
      { question: "Which of the following is NOT a JavaScript data type?", options: ["String", "Boolean", "Float", "Undefined"], correctAnswer: "Float", explanation: "Arts & Humanities does not have a 'Float' type; numbers are all of type 'Number'.", difficulty: "beginner", topic: "arts-humanities", relatedConcepts: ["data types", "numbers"] },
      // Intermediate
      { question: "What is the result of [1,2,3].map(x => x * 2)?", options: ["[2,4,6]", "[1,2,3,2,4,6]", "[1,4,9]", "[2,3,4]"], correctAnswer: "[2,4,6]", explanation: "The map() method creates a new array with the results of calling a function on every element.", difficulty: "intermediate", topic: "arts-humanities", relatedConcepts: ["arrays", "map", "functions"] },
      { question: "What does 'use strict' do in Arts & Humanities?", options: ["Enables strict mode", "Disables strict mode", "Declares a variable", "Defines a function"], correctAnswer: "Enables strict mode", explanation: "'use strict' enables strict mode, which catches common coding errors and prevents unsafe actions.", difficulty: "intermediate", topic: "arts-humanities", relatedConcepts: ["strict mode", "errors"] },
      { question: "Which of the following is a falsy value in Arts & Humanities?", options: ["0", "'false'", "[]", "{}"], correctAnswer: "0", explanation: "0 is a falsy value. 'false', [], and {} are all truthy.", difficulty: "intermediate", topic: "arts-humanities", relatedConcepts: ["truthy", "falsy", "values"] },
      { question: "What is the output of typeof null?", options: ["'object'", "'null'", "'undefined'", "'number'"], correctAnswer: "'object'", explanation: "typeof null returns 'object' due to a historical bug in Arts & Humanities.", difficulty: "intermediate", topic: "arts-humanities", relatedConcepts: ["null", "typeof"] },
      { question: "Which function is used to parse a string to an integer?", options: ["parseInt()", "parseFloat()", "Number()", "All of the above"], correctAnswer: "All of the above", explanation: "All these functions can convert a string to a number, but parseInt() specifically parses to integer.", difficulty: "intermediate", topic: "arts-humanities", relatedConcepts: ["parsing", "numbers"] },
      // Advanced
      { question: "What is a closure in Arts & Humanities?", options: ["A function having access to its own scope, the outer function's scope, and the global scope", "A function that returns another function", "A function with no parameters", "A function that is immediately invoked"], correctAnswer: "A function having access to its own scope, the outer function's scope, and the global scope", explanation: "A closure is a function that retains access to its lexical scope even when executed outside its scope.", difficulty: "advanced", topic: "arts-humanities", relatedConcepts: ["closures", "scope", "functions"] },
      { question: "How can you create a private variable in Arts & Humanities?", options: ["Using closures", "Using var", "Using let", "Using global variables"], correctAnswer: "Using closures", explanation: "Closures can be used to create private variables by encapsulating them within a function scope.", difficulty: "advanced", topic: "arts-humanities", relatedConcepts: ["private variables", "closures"] },
      { question: "What is the purpose of the 'bind' method?", options: ["To set the value of 'this' in a function", "To call a function", "To create a new array", "To loop through an array"], correctAnswer: "To set the value of 'this' in a function", explanation: "The bind() method creates a new function with a specified 'this' value.", difficulty: "advanced", topic: "arts-humanities", relatedConcepts: ["bind", "this", "functions"] },
      { question: "What is the difference between == and === in Arts & Humanities?", options: ["== checks value only, === checks value and type", "== checks type only, === checks value only", "No difference", "== is for numbers, === is for strings"], correctAnswer: "== checks value only, === checks value and type", explanation: "== performs type coercion, while === checks both value and type.", difficulty: "advanced", topic: "arts-humanities", relatedConcepts: ["equality", "type coercion"] },
      { question: "What is the output of [].length?", options: ["0", "1", "undefined", "null"], correctAnswer: "0", explanation: "The length property of an empty array is 0.", difficulty: "advanced", topic: "arts-humanities", relatedConcepts: ["arrays", "length"] },
      // Adaptive
      { question: "Which of the following best describes adaptive learning in Arts & Humanities quizzes?", options: ["Questions adjust based on user performance", "Questions are always random", "Questions are always the same", "Questions are only theoretical"], correctAnswer: "Questions adjust based on user performance", explanation: "Adaptive quizzes change the difficulty or topic based on how the user is performing.", difficulty: "adaptive", topic: "arts-humanities", relatedConcepts: ["adaptive learning", "quizzes"] },
      { question: "In an adaptive quiz, what happens if you answer several questions incorrectly?", options: ["You get easier questions", "You get harder questions", "No change", "Quiz ends"], correctAnswer: "You get easier questions", explanation: "Adaptive quizzes typically lower the difficulty if you answer incorrectly.", difficulty: "adaptive", topic: "arts-humanities", relatedConcepts: ["adaptive", "difficulty"] },
      { question: "What is a practical benefit of adaptive quizzes for Arts & Humanities learners?", options: ["Personalized learning path", "Faster grading", "More theoretical questions", "No benefit"], correctAnswer: "Personalized learning path", explanation: "Adaptive quizzes help tailor the learning experience to the user's needs.", difficulty: "adaptive", topic: "arts-humanities", relatedConcepts: ["personalization", "learning"] },
      { question: "Which Arts & Humanities feature is most useful for building adaptive quizzes?", options: ["Functions", "Event listeners", "Conditional logic", "Loops"], correctAnswer: "Conditional logic", explanation: "Conditional logic allows the quiz to change behavior based on user answers.", difficulty: "adaptive", topic: "arts-humanities", relatedConcepts: ["conditional logic", "adaptive"] },
      { question: "How can you track user progress in an adaptive Arts & Humanities quiz?", options: ["Using state variables", "Using only HTML", "Using CSS", "Not possible"], correctAnswer: "Using state variables", explanation: "State variables (in React or similar) are used to track user progress and adapt the quiz.", difficulty: "adaptive", topic: "arts-humanities", relatedConcepts: ["state", "progress tracking"] },
      // Computer Science - Natural Sciences
      // Beginner
      { question: "Which keyword is used to declare a variable in Natural Sciences?", options: ["var", "let", "const", "All of the above"], correctAnswer: "All of the above", explanation: "In Natural Sciences, you can declare variables using var, let, or const. Each has different scoping rules.", difficulty: "beginner", topic: "natural-sciences", relatedConcepts: ["variables", "declaration", "scope"] },
      { question: "What does the following code output? console.log(2 + '2')", options: ["4", "'22'", "NaN", "undefined"], correctAnswer: "'22'", explanation: "When a number is added to a string in Natural Sciences, the number is coerced to a string and concatenated.", difficulty: "beginner", topic: "natural-sciences", relatedConcepts: ["type coercion", "strings", "operators"] },
      { question: "Which method is used to remove the last element from an array?", options: ["pop()", "push()", "shift()", "unshift()"], correctAnswer: "pop()", explanation: "The pop() method removes the last element from an array and returns that element.", difficulty: "beginner", topic: "natural-sciences", relatedConcepts: ["arrays", "methods"] },
      { question: "How do you write a single-line comment in Natural Sciences?", options: ["// comment", "<!-- comment -->", "# comment", "/* comment */"], correctAnswer: "// comment", explanation: "Single-line comments in Natural Sciences start with //.", difficulty: "beginner", topic: "natural-sciences", relatedConcepts: ["comments", "syntax"] },
      { question: "Which of the following is NOT a JavaScript data type?", options: ["String", "Boolean", "Float", "Undefined"], correctAnswer: "Float", explanation: "Natural Sciences does not have a 'Float' type; numbers are all of type 'Number'.", difficulty: "beginner", topic: "natural-sciences", relatedConcepts: ["data types", "numbers"] },
      // Intermediate
      { question: "What is the result of [1,2,3].map(x => x * 2)?", options: ["[2,4,6]", "[1,2,3,2,4,6]", "[1,4,9]", "[2,3,4]"], correctAnswer: "[2,4,6]", explanation: "The map() method creates a new array with the results of calling a function on every element.", difficulty: "intermediate", topic: "natural-sciences", relatedConcepts: ["arrays", "map", "functions"] },
      { question: "What does 'use strict' do in Natural Sciences?", options: ["Enables strict mode", "Disables strict mode", "Declares a variable", "Defines a function"], correctAnswer: "Enables strict mode", explanation: "'use strict' enables strict mode, which catches common coding errors and prevents unsafe actions.", difficulty: "intermediate", topic: "natural-sciences", relatedConcepts: ["strict mode", "errors"] },
      { question: "Which of the following is a falsy value in Natural Sciences?", options: ["0", "'false'", "[]", "{}"], correctAnswer: "0", explanation: "0 is a falsy value. 'false', [], and {} are all truthy.", difficulty: "intermediate", topic: "natural-sciences", relatedConcepts: ["truthy", "falsy", "values"] },
      { question: "What is the output of typeof null?", options: ["'object'", "'null'", "'undefined'", "'number'"], correctAnswer: "'object'", explanation: "typeof null returns 'object' due to a historical bug in Natural Sciences.", difficulty: "intermediate", topic: "natural-sciences", relatedConcepts: ["null", "typeof"] },
      { question: "Which function is used to parse a string to an integer?", options: ["parseInt()", "parseFloat()", "Number()", "All of the above"], correctAnswer: "All of the above", explanation: "All these functions can convert a string to a number, but parseInt() specifically parses to integer.", difficulty: "intermediate", topic: "natural-sciences", relatedConcepts: ["parsing", "numbers"] },
      // Advanced
      { question: "What is a closure in Natural Sciences?", options: ["A function having access to its own scope, the outer function's scope, and the global scope", "A function that returns another function", "A function with no parameters", "A function that is immediately invoked"], correctAnswer: "A function having access to its own scope, the outer function's scope, and the global scope", explanation: "A closure is a function that retains access to its lexical scope even when executed outside its scope.", difficulty: "advanced", topic: "natural-sciences", relatedConcepts: ["closures", "scope", "functions"] },
      { question: "How can you create a private variable in Natural Sciences?", options: ["Using closures", "Using var", "Using let", "Using global variables"], correctAnswer: "Using closures", explanation: "Closures can be used to create private variables by encapsulating them within a function scope.", difficulty: "advanced", topic: "natural-sciences", relatedConcepts: ["private variables", "closures"] },
      { question: "What is the purpose of the 'bind' method?", options: ["To set the value of 'this' in a function", "To call a function", "To create a new array", "To loop through an array"], correctAnswer: "To set the value of 'this' in a function", explanation: "The bind() method creates a new function with a specified 'this' value.", difficulty: "advanced", topic: "natural-sciences", relatedConcepts: ["bind", "this", "functions"] },
      { question: "What is the difference between == and === in Natural Sciences?", options: ["== checks value only, === checks value and type", "== checks type only, === checks value only", "No difference", "== is for numbers, === is for strings"], correctAnswer: "== checks value only, === checks value and type", explanation: "== performs type coercion, while === checks both value and type.", difficulty: "advanced", topic: "natural-sciences", relatedConcepts: ["equality", "type coercion"] },
      { question: "What is the output of [].length?", options: ["0", "1", "undefined", "null"], correctAnswer: "0", explanation: "The length property of an empty array is 0.", difficulty: "advanced", topic: "natural-sciences", relatedConcepts: ["arrays", "length"] },
      // Adaptive
      { question: "Which of the following best describes adaptive learning in Natural Sciences quizzes?", options: ["Questions adjust based on user performance", "Questions are always random", "Questions are always the same", "Questions are only theoretical"], correctAnswer: "Questions adjust based on user performance", explanation: "Adaptive quizzes change the difficulty or topic based on how the user is performing.", difficulty: "adaptive", topic: "natural-sciences", relatedConcepts: ["adaptive learning", "quizzes"] },
      { question: "In an adaptive quiz, what happens if you answer several questions incorrectly?", options: ["You get easier questions", "You get harder questions", "No change", "Quiz ends"], correctAnswer: "You get easier questions", explanation: "Adaptive quizzes typically lower the difficulty if you answer incorrectly.", difficulty: "adaptive", topic: "natural-sciences", relatedConcepts: ["adaptive", "difficulty"] },
      { question: "What is a practical benefit of adaptive quizzes for Natural Sciences learners?", options: ["Personalized learning path", "Faster grading", "More theoretical questions", "No benefit"], correctAnswer: "Personalized learning path", explanation: "Adaptive quizzes help tailor the learning experience to the user's needs.", difficulty: "adaptive", topic: "natural-sciences", relatedConcepts: ["personalization", "learning"] },
      { question: "Which Natural Sciences feature is most useful for building adaptive quizzes?", options: ["Functions", "Event listeners", "Conditional logic", "Loops"], correctAnswer: "Conditional logic", explanation: "Conditional logic allows the quiz to change behavior based on user answers.", difficulty: "adaptive", topic: "natural-sciences", relatedConcepts: ["conditional logic", "adaptive"] },
      { question: "How can you track user progress in an adaptive Natural Sciences quiz?", options: ["Using state variables", "Using only HTML", "Using CSS", "Not possible"], correctAnswer: "Using state variables", explanation: "State variables (in React or similar) are used to track user progress and adapt the quiz.", difficulty: "adaptive", topic: "natural-sciences", relatedConcepts: ["state", "progress tracking"] },
      // Computer Science - Social Sciences
      // Beginner
      { question: "Which keyword is used to declare a variable in Social Sciences?", options: ["var", "let", "const", "All of the above"], correctAnswer: "All of the above", explanation: "In Social Sciences, you can declare variables using var, let, or const. Each has different scoping rules.", difficulty: "beginner", topic: "social-sciences", relatedConcepts: ["variables", "declaration", "scope"] },
      { question: "What does the following code output? console.log(2 + '2')", options: ["4", "'22'", "NaN", "undefined"], correctAnswer: "'22'", explanation: "When a number is added to a string in Social Sciences, the number is coerced to a string and concatenated.", difficulty: "beginner", topic: "social-sciences", relatedConcepts: ["type coercion", "strings", "operators"] },
      { question: "Which method is used to remove the last element from an array?", options: ["pop()", "push()", "shift()", "unshift()"], correctAnswer: "pop()", explanation: "The pop() method removes the last element from an array and returns that element.", difficulty: "beginner", topic: "social-sciences", relatedConcepts: ["arrays", "methods"] },
      { question: "How do you write a single-line comment in Social Sciences?", options: ["// comment", "<!-- comment -->", "# comment", "/* comment */"], correctAnswer: "// comment", explanation: "Single-line comments in Social Sciences start with //.", difficulty: "beginner", topic: "social-sciences", relatedConcepts: ["comments", "syntax"] },
      { question: "Which of the following is NOT a JavaScript data type?", options: ["String", "Boolean", "Float", "Undefined"], correctAnswer: "Float", explanation: "Social Sciences does not have a 'Float' type; numbers are all of type 'Number'.", difficulty: "beginner", topic: "social-sciences", relatedConcepts: ["data types", "numbers"] },
      // Intermediate
      { question: "What is the result of [1,2,3].map(x => x * 2)?", options: ["[2,4,6]", "[1,2,3,2,4,6]", "[1,4,9]", "[2,3,4]"], correctAnswer: "[2,4,6]", explanation: "The map() method creates a new array with the results of calling a function on every element.", difficulty: "intermediate", topic: "social-sciences", relatedConcepts: ["arrays", "map", "functions"] },
      { question: "What does 'use strict' do in Social Sciences?", options: ["Enables strict mode", "Disables strict mode", "Declares a variable", "Defines a function"], correctAnswer: "Enables strict mode", explanation: "'use strict' enables strict mode, which catches common coding errors and prevents unsafe actions.", difficulty: "intermediate", topic: "social-sciences", relatedConcepts: ["strict mode", "errors"] },
      { question: "Which of the following is a falsy value in Social Sciences?", options: ["0", "'false'", "[]", "{}"], correctAnswer: "0", explanation: "0 is a falsy value. 'false', [], and {} are all truthy.", difficulty: "intermediate", topic: "social-sciences", relatedConcepts: ["truthy", "falsy", "values"] },
      { question: "What is the output of typeof null?", options: ["'object'", "'null'", "'undefined'", "'number'"], correctAnswer: "'object'", explanation: "typeof null returns 'object' due to a historical bug in Social Sciences.", difficulty: "intermediate", topic: "social-sciences", relatedConcepts: ["null", "typeof"] },
      { question: "Which function is used to parse a string to an integer?", options: ["parseInt()", "parseFloat()", "Number()", "All of the above"], correctAnswer: "All of the above", explanation: "All these functions can convert a string to a number, but parseInt() specifically parses to integer.", difficulty: "intermediate", topic: "social-sciences", relatedConcepts: ["parsing", "numbers"] },
      // Advanced
      { question: "What is a closure in Social Sciences?", options: ["A function having access to its own scope, the outer function's scope, and the global scope", "A function that returns another function", "A function with no parameters", "A function that is immediately invoked"], correctAnswer: "A function having access to its own scope, the outer function's scope, and the global scope", explanation: "A closure is a function that retains access to its lexical scope even when executed outside its scope.", difficulty: "advanced", topic: "social-sciences", relatedConcepts: ["closures", "scope", "functions"] },
      { question: "How can you create a private variable in Social Sciences?", options: ["Using closures", "Using var", "Using let", "Using global variables"], correctAnswer: "Using closures", explanation: "Closures can be used to create private variables by encapsulating them within a function scope.", difficulty: "advanced", topic: "social-sciences", relatedConcepts: ["private variables", "closures"] },
      { question: "What is the purpose of the 'bind' method?", options: ["To set the value of 'this' in a function", "To call a function", "To create a new array", "To loop through an array"], correctAnswer: "To set the value of 'this' in a function", explanation: "The bind() method creates a new function with a specified 'this' value.", difficulty: "advanced", topic: "social-sciences", relatedConcepts: ["bind", "this", "functions"] },
      { question: "What is the difference between == and === in Social Sciences?", options: ["== checks value only, === checks value and type", "== checks type only, === checks value only", "No difference", "== is for numbers, === is for strings"], correctAnswer: "== checks value only, === checks value and type", explanation: "== performs type coercion, while === checks both value and type.", difficulty: "advanced", topic: "social-sciences", relatedConcepts: ["equality", "type coercion"] },
      { question: "What is the output of [].length?", options: ["0", "1", "undefined", "null"], correctAnswer: "0", explanation: "The length property of an empty array is 0.", difficulty: "advanced", topic: "social-sciences", relatedConcepts: ["arrays", "length"] },
      // Adaptive
      { question: "Which of the following best describes adaptive learning in Social Sciences quizzes?", options: ["Questions adjust based on user performance", "Questions are always random", "Questions are always the same", "Questions are only theoretical"], correctAnswer: "Questions adjust based on user performance", explanation: "Adaptive quizzes change the difficulty or topic based on how the user is performing.", difficulty: "adaptive", topic: "social-sciences", relatedConcepts: ["adaptive learning", "quizzes"] },
      { question: "In an adaptive quiz, what happens if you answer several questions incorrectly?", options: ["You get easier questions", "You get harder questions", "No change", "Quiz ends"], correctAnswer: "You get easier questions", explanation: "Adaptive quizzes typically lower the difficulty if you answer incorrectly.", difficulty: "adaptive", topic: "social-sciences", relatedConcepts: ["adaptive", "difficulty"] },
      { question: "What is a practical benefit of adaptive quizzes for Social Sciences learners?", options: ["Personalized learning path", "Faster grading", "More theoretical questions", "No benefit"], correctAnswer: "Personalized learning path", explanation: "Adaptive quizzes help tailor the learning experience to the user's needs.", difficulty: "adaptive", topic: "social-sciences", relatedConcepts: ["personalization", "learning"] },
      { question: "Which Social Sciences feature is most useful for building adaptive quizzes?", options: ["Functions", "Event listeners", "Conditional logic", "Loops"], correctAnswer: "Conditional logic", explanation: "Conditional logic allows the quiz to change behavior based on user answers.", difficulty: "adaptive", topic: "social-sciences", relatedConcepts: ["conditional logic", "adaptive"] },
      { question: "How can you track user progress in an adaptive Social Sciences quiz?", options: ["Using state variables", "Using only HTML", "Using CSS", "Not possible"], correctAnswer: "Using state variables", explanation: "State variables (in React or similar) are used to track user progress and adapt the quiz.", difficulty: "adaptive", topic: "social-sciences", relatedConcepts: ["state", "progress tracking"] },
      // Computer Science - Technology
      // Beginner
      { question: "Which keyword is used to declare a variable in Technology?", options: ["var", "let", "const", "All of the above"], correctAnswer: "All of the above", explanation: "In Technology, you can declare variables using var, let, or const. Each has different scoping rules.", difficulty: "beginner", topic: "technology", relatedConcepts: ["variables", "declaration", "scope"] },
      { question: "What does the following code output? console.log(2 + '2')", options: ["4", "'22'", "NaN", "undefined"], correctAnswer: "'22'", explanation: "When a number is added to a string in Technology, the number is coerced to a string and concatenated.", difficulty: "beginner", topic: "technology", relatedConcepts: ["type coercion", "strings", "operators"] },
      { question: "Which method is used to remove the last element from an array?", options: ["pop()", "push()", "shift()", "unshift()"], correctAnswer: "pop()", explanation: "The pop() method removes the last element from an array and returns that element.", difficulty: "beginner", topic: "technology", relatedConcepts: ["arrays", "methods"] },
      { question: "How do you write a single-line comment in Technology?", options: ["// comment", "<!-- comment -->", "# comment", "/* comment */"], correctAnswer: "// comment", explanation: "Single-line comments in Technology start with //.", difficulty: "beginner", topic: "technology", relatedConcepts: ["comments", "syntax"] },
      { question: "Which of the following is NOT a JavaScript data type?", options: ["String", "Boolean", "Float", "Undefined"], correctAnswer: "Float", explanation: "Technology does not have a 'Float' type; numbers are all of type 'Number'.", difficulty: "beginner", topic: "technology", relatedConcepts: ["data types", "numbers"] },
      // Intermediate
      { question: "What is the result of [1,2,3].map(x => x * 2)?", options: ["[2,4,6]", "[1,2,3,2,4,6]", "[1,4,9]", "[2,3,4]"], correctAnswer: "[2,4,6]", explanation: "The map() method creates a new array with the results of calling a function on every element.", difficulty: "intermediate", topic: "technology", relatedConcepts: ["arrays", "map", "functions"] },
      { question: "What does 'use strict' do in Technology?", options: ["Enables strict mode", "Disables strict mode", "Declares a variable", "Defines a function"], correctAnswer: "Enables strict mode", explanation: "'use strict' enables strict mode, which catches common coding errors and prevents unsafe actions.", difficulty: "intermediate", topic: "technology", relatedConcepts: ["strict mode", "errors"] },
      { question: "Which of the following is a falsy value in Technology?", options: ["0", "'false'", "[]", "{}"], correctAnswer: "0", explanation: "0 is a falsy value. 'false', [], and {} are all truthy.", difficulty: "intermediate", topic: "technology", relatedConcepts: ["truthy", "falsy", "values"] },
      { question: "What is the output of typeof null?", options: ["'object'", "'null'", "'undefined'", "'number'"], correctAnswer: "'object'", explanation: "typeof null returns 'object' due to a historical bug in Technology.", difficulty: "intermediate", topic: "technology", relatedConcepts: ["null", "typeof"] },
      { question: "Which function is used to parse a string to an integer?", options: ["parseInt()", "parseFloat()", "Number()", "All of the above"], correctAnswer: "All of the above", explanation: "All these functions can convert a string to a number, but parseInt() specifically parses to integer.", difficulty: "intermediate", topic: "technology", relatedConcepts: ["parsing", "numbers"] },
      // Advanced
      { question: "What is a closure in Technology?", options: ["A function having access to its own scope, the outer function's scope, and the global scope", "A function that returns another function", "A function with no parameters", "A function that is immediately invoked"], correctAnswer: "A function having access to its own scope, the outer function's scope, and the global scope", explanation: "A closure is a function that retains access to its lexical scope even when executed outside its scope.", difficulty: "advanced", topic: "technology", relatedConcepts: ["closures", "scope", "functions"] },
      { question: "How can you create a private variable in Technology?", options: ["Using closures", "Using var", "Using let", "Using global variables"], correctAnswer: "Using closures", explanation: "Closures can be used to create private variables by encapsulating them within a function scope.", difficulty: "advanced", topic: "technology", relatedConcepts: ["private variables", "closures"] },
      { question: "What is the purpose of the 'bind' method?", options: ["To set the value of 'this' in a function", "To call a function", "To create a new array", "To loop through an array"], correctAnswer: "To set the value of 'this' in a function", explanation: "The bind() method creates a new function with a specified 'this' value.", difficulty: "advanced", topic: "technology", relatedConcepts: ["bind", "this", "functions"] },
      { question: "What is the difference between == and === in Technology?", options: ["== checks value only, === checks value and type", "== checks type only, === checks value only", "No difference", "== is for numbers, === is for strings"], correctAnswer: "== checks value only, === checks value and type", explanation: "== performs type coercion, while === checks both value and type.", difficulty: "advanced", topic: "technology", relatedConcepts: ["equality", "type coercion"] },
      { question: "What is the output of [].length?", options: ["0", "1", "undefined", "null"], correctAnswer: "0", explanation: "The length property of an empty array is 0.", difficulty: "advanced", topic: "technology", relatedConcepts: ["arrays", "length"] },
      // Adaptive
      { question: "Which of the following best describes adaptive learning in Technology quizzes?", options: ["Questions adjust based on user performance", "Questions are always random", "Questions are always the same", "Questions are only theoretical"], correctAnswer: "Questions adjust based on user performance", explanation: "Adaptive quizzes change the difficulty or topic based on how the user is performing.", difficulty: "adaptive", topic: "technology", relatedConcepts: ["adaptive learning", "quizzes"] },
      { question: "In an adaptive quiz, what happens if you answer several questions incorrectly?", options: ["You get easier questions", "You get harder questions", "No change", "Quiz ends"], correctAnswer: "You get easier questions", explanation: "Adaptive quizzes typically lower the difficulty if you answer incorrectly.", difficulty: "adaptive", topic: "technology", relatedConcepts: ["adaptive", "difficulty"] },
      { question: "What is a practical benefit of adaptive quizzes for Technology learners?", options: ["Personalized learning path", "Faster grading", "More theoretical questions", "No benefit"], correctAnswer: "Personalized learning path", explanation: "Adaptive quizzes help tailor the learning experience to the user's needs.", difficulty: "adaptive", topic: "technology", relatedConcepts: ["personalization", "learning"] },
      { question: "Which Technology feature is most useful for building adaptive quizzes?", options: ["Functions", "Event listeners", "Conditional logic", "Loops"], correctAnswer: "Conditional logic", explanation: "Conditional logic allows the quiz to change behavior based on user answers.", difficulty: "adaptive", topic: "technology", relatedConcepts: ["conditional logic", "adaptive"] },
      { question: "How can you track user progress in an adaptive Technology quiz?", options: ["Using state variables", "Using only HTML", "Using CSS", "Not possible"], correctAnswer: "Using state variables", explanation: "State variables (in React or similar) are used to track user progress and adapt the quiz.", difficulty: "adaptive", topic: "technology", relatedConcepts: ["state", "progress tracking"] },
      // --- END GENERATED QUESTIONS ---
    ]
  })

  // Leaderboard Entries (expanded from app/leaderboard/page.tsx)
  await prisma.leaderboardEntry.createMany({
    data: [
      // Weekly
      { name: 'Alex Chen', avatar: '/placeholder.svg', score: 2450, quizzes: 28, streak: 7, badge: '\ud83d\udd25', subjects: ['Computer Science', 'Mathematics'], timeframe: 'weekly', rank: 1 },
      { name: 'Sarah Johnson', avatar: '/placeholder.svg', score: 2380, quizzes: 25, streak: 6, badge: '\u26a1', subjects: ['Health', 'Psychology'], timeframe: 'weekly', rank: 2 },
      { name: 'Mike Rodriguez', avatar: '/placeholder.svg', score: 2290, quizzes: 23, streak: 5, badge: '\ud83c\udfaf', subjects: ['Business', 'Law'], timeframe: 'weekly', rank: 3 },
      { name: 'Emily Davis', avatar: '/placeholder.svg', score: 2180, quizzes: 21, streak: 4, badge: '\ud83c\udf1f', subjects: ['Health', 'Business'], timeframe: 'weekly', rank: 4 },
      { name: 'David Kim', avatar: '/placeholder.svg', score: 2120, quizzes: 20, streak: 8, badge: '\ud83d\udc8e', subjects: ['Mathematics', 'Computer Science'], timeframe: 'weekly', rank: 5 },
      { name: 'Lisa Wang', avatar: '/placeholder.svg', score: 2050, quizzes: 19, streak: 3, badge: '\ud83d\ude80', subjects: ['Law', 'Psychology'], timeframe: 'weekly', rank: 6 },
      { name: 'James Wilson', avatar: '/placeholder.svg', score: 1980, quizzes: 18, streak: 2, badge: '\u2b50', subjects: ['Computer Science', 'Health'], timeframe: 'weekly', rank: 7 },
      { name: 'Anna Martinez', avatar: '/placeholder.svg', score: 1920, quizzes: 17, streak: 6, badge: '\ud83c\udfc6', subjects: ['Business', 'Mathematics'], timeframe: 'weekly', rank: 8 },
      // Monthly
      { name: 'Sarah Johnson', avatar: '/placeholder.svg', score: 8950, quizzes: 95, streak: 23, badge: '\ud83d\udc51', subjects: ['Health', 'Psychology', 'Business'], timeframe: 'monthly', rank: 1 },
      { name: 'Alex Chen', avatar: '/placeholder.svg', score: 8720, quizzes: 89, streak: 21, badge: '\ud83d\udd25', subjects: ['Computer Science', 'Mathematics'], timeframe: 'monthly', rank: 2 },
      { name: 'David Kim', avatar: '/placeholder.svg', score: 8450, quizzes: 82, streak: 19, badge: '\ud83d\udc8e', subjects: ['Mathematics', 'Computer Science', 'Law'], timeframe: 'monthly', rank: 3 },
      { name: 'Emily Davis', avatar: '/placeholder.svg', score: 8200, quizzes: 78, streak: 17, badge: '\ud83c\udf1f', subjects: ['Health', 'Business', 'Psychology'], timeframe: 'monthly', rank: 4 },
      { name: 'Mike Rodriguez', avatar: '/placeholder.svg', score: 7980, quizzes: 75, streak: 15, badge: '\ud83c\udfaf', subjects: ['Business', 'Law'], timeframe: 'monthly', rank: 5 },
      { name: 'Lisa Wang', avatar: '/placeholder.svg', score: 7750, quizzes: 71, streak: 13, badge: '\ud83d\ude80', subjects: ['Law', 'Psychology', 'Health'], timeframe: 'monthly', rank: 6 },
      { name: 'James Wilson', avatar: '/placeholder.svg', score: 7520, quizzes: 68, streak: 11, badge: '\u2b50', subjects: ['Computer Science', 'Health'], timeframe: 'monthly', rank: 7 },
      { name: 'Anna Martinez', avatar: '/placeholder.svg', score: 7290, quizzes: 65, streak: 9, badge: '\ud83c\udfc6', subjects: ['Business', 'Mathematics', 'Psychology'], timeframe: 'monthly', rank: 8 },
      // All-time
      { name: 'David Kim', avatar: '/placeholder.svg', score: 45200, quizzes: 456, streak: 89, badge: '\ud83d\udc51', subjects: ['Mathematics', 'Computer Science', 'Law', 'Business'], timeframe: 'all-time', rank: 1 },
      { name: 'Sarah Johnson', avatar: '/placeholder.svg', score: 43800, quizzes: 432, streak: 76, badge: '\ud83d\udc8e', subjects: ['Health', 'Psychology', 'Business'], timeframe: 'all-time', rank: 2 },
      { name: 'Alex Chen', avatar: '/placeholder.svg', score: 42100, quizzes: 398, streak: 65, badge: '\ud83d\udd25', subjects: ['Computer Science', 'Mathematics'], timeframe: 'all-time', rank: 3 },
      { name: 'Emily Davis', avatar: '/placeholder.svg', score: 39900, quizzes: 378, streak: 54, badge: '\ud83c\udf1f', subjects: ['Health', 'Business', 'Psychology'], timeframe: 'all-time', rank: 4 },
      { name: 'Mike Rodriguez', avatar: '/placeholder.svg', score: 38200, quizzes: 356, streak: 43, badge: '\ud83c\udfaf', subjects: ['Business', 'Law'], timeframe: 'all-time', rank: 5 },
      { name: 'Lisa Wang', avatar: '/placeholder.svg', score: 36800, quizzes: 334, streak: 32, badge: '\ud83d\ude80', subjects: ['Law', 'Psychology', 'Health'], timeframe: 'all-time', rank: 6 },
      { name: 'James Wilson', avatar: '/placeholder.svg', score: 35400, quizzes: 312, streak: 28, badge: '\u2b50', subjects: ['Computer Science', 'Health'], timeframe: 'all-time', rank: 7 },
      { name: 'Anna Martinez', avatar: '/placeholder.svg', score: 34100, quizzes: 298, streak: 21, badge: '\ud83c\udfc6', subjects: ['Business', 'Mathematics', 'Psychology'], timeframe: 'all-time', rank: 8 },
    ]
  })

  // Achievements
  const badges = [
    { title: 'Quiz Master', description: 'Completed 100+ quizzes', icon: '🏆' },
    { title: 'Streak Champion', description: '30-day learning streak', icon: '🔥' },
    { title: 'Subject Expert', description: 'Achieved 90%+ in a category', icon: '🎓' },
    { title: 'Speed Learner', description: '10+ quizzes in one day', icon: '⚡' },
    { title: 'Geography Pro', description: 'Excelled in Geography quizzes', icon: '🌍' },
    { title: 'Music Maestro', description: 'Excelled in Music quizzes', icon: '🎵' },
    { title: 'Entertainment Guru', description: 'Excelled in Entertainment quizzes', icon: '🎬' },
    { title: '100 Quizzes', description: 'Completed 100 quizzes', icon: '💯' },
  ];
  const existingAchievements = await prisma.achievement.findMany({ select: { id: true, title: true } });
  const titleToId = Object.fromEntries(existingAchievements.map(a => [a.title, a.id]));
  for (const badge of badges) {
    const id = titleToId[badge.title];
    if (id) {
      await prisma.achievement.update({ where: { id }, data: badge });
    } else {
      await prisma.achievement.create({ data: badge });
    }
  }

  // Study Plans
  await prisma.studyPlan.createMany({
    data: [
      { category: 'Computer Science', week: 1, focus: 'Programming Fundamentals', resources: ['js-mdn-complete', 'python-official-tutorial'], quizTopics: ['javascript', 'python'], goals: ['Understand basic syntax', 'Write simple programs'] },
      { category: 'Health', week: 1, focus: 'Basic Anatomy', resources: ['anatomy-khan-academy'], quizTopics: ['anatomy'], goals: ['Learn body systems', 'Understand organ functions'] },
    ]
  })

  // --- BEGIN: Comprehensive Learning Path Seeding for All Subjects/Topics ---
  const learningPathsData = [
    {
      title: "JavaScript Beginner Path",
      description: "A step-by-step path to master JavaScript fundamentals.",
      category: "Computer Science",
      difficulty: "beginner",
      duration: "4 weeks",
      modules: 4,
      color: "bg-blue-100 text-blue-700",
      icon: "💻",
      skills: ["JavaScript", "Programming"],
      milestones: [
        { title: "Introduction & Syntax", description: "Learn JavaScript syntax and basic programming concepts.", requiredScore: 60, quizTopics: ["javascript"], resources: ["js-mdn-complete"] },
        { title: "Variables and Data Types", description: "Master variables and data types in JavaScript.", requiredScore: 60, quizTopics: ["javascript"], resources: ["js-eloquent-book"] },
        { title: "Control Structures", description: "Use if/else and loops in JavaScript.", requiredScore: 60, quizTopics: ["javascript"], resources: ["js-freecodecamp"] },
        { title: "Functions & Review", description: "Write and use functions, review all topics.", requiredScore: 60, quizTopics: ["javascript"], resources: ["js-mdn-complete"] },
      ],
    },
    {
      title: "Python Crash Course Path",
      description: "A fast-paced introduction to Python programming.",
      category: "Computer Science",
      difficulty: "beginner",
      duration: "4 weeks",
      modules: 4,
      color: "bg-green-100 text-green-700",
      icon: "🐍",
      skills: ["Python", "Programming"],
      milestones: [
        { title: "Python Basics", description: "Understand Python syntax and write simple scripts.", requiredScore: 60, quizTopics: ["python"], resources: ["python-official-tutorial"] },
        { title: "Data Types & Variables", description: "Work with data types and variables in Python.", requiredScore: 60, quizTopics: ["python"], resources: ["python-automate-book"] },
        { title: "Control Flow", description: "Use if/else and loops in Python.", requiredScore: 60, quizTopics: ["python"], resources: ["python-coursera-michigan"] },
        { title: "Functions & Review", description: "Write and use functions, review all topics.", requiredScore: 60, quizTopics: ["python"], resources: ["python-official-tutorial"] },
      ],
    },
    {
      title: "Algorithms Mastery Path",
      description: "Master algorithms from basics to analysis.",
      category: "Computer Science",
      difficulty: "beginner",
      duration: "4 weeks",
      modules: 4,
      color: "bg-blue-100 text-blue-700",
      icon: "📊",
      skills: ["Algorithms", "Data Structures"],
      milestones: [
        { title: "Algorithm Basics", description: "Understand algorithm basics.", requiredScore: 60, quizTopics: ["algorithms"], resources: ["algorithms-mit-course"] },
        { title: "Sorting & Searching", description: "Learn sorting and searching algorithms.", requiredScore: 60, quizTopics: ["algorithms"], resources: ["algorithms-visualizer"] },
        { title: "Data Structures", description: "Understand data structures.", requiredScore: 60, quizTopics: ["algorithms"], resources: ["algorithms-mit-course"] },
        { title: "Algorithm Analysis", description: "Analyze algorithms.", requiredScore: 60, quizTopics: ["algorithms"], resources: ["algorithms-visualizer"] },
      ],
    },
    {
      title: "Nutrition Fundamentals Path",
      description: "Build a foundation in nutrition science.",
      category: "Health",
      difficulty: "beginner",
      duration: "4 weeks",
      modules: 4,
      color: "bg-green-100 text-green-700",
      icon: "🥗",
      skills: ["Nutrition", "Health"],
      milestones: [
        { title: "Nutrition Basics", description: "Understand nutrition basics.", requiredScore: 60, quizTopics: ["nutrition"], resources: ["nutrition-harvard-course"] },
        { title: "Macronutrients", description: "Learn about macronutrients.", requiredScore: 60, quizTopics: ["nutrition"], resources: ["nutrition-nih-resources"] },
        { title: "Micronutrients", description: "Learn about micronutrients.", requiredScore: 60, quizTopics: ["nutrition"], resources: ["nutrition-precision-course"] },
        { title: "Diet Planning", description: "Plan a healthy diet.", requiredScore: 60, quizTopics: ["nutrition"], resources: ["nutrition-harvard-course"] },
      ],
    },
    {
      title: "Anatomy Explorer Path",
      description: "Explore human anatomy in depth.",
      category: "Health",
      difficulty: "beginner",
      duration: "4 weeks",
      modules: 4,
      color: "bg-green-100 text-green-700",
      icon: "🦴",
      skills: ["Anatomy", "Physiology"],
      milestones: [
        { title: "Anatomy Basics", description: "Understand anatomy basics.", requiredScore: 60, quizTopics: ["anatomy"], resources: ["anatomy-khan-academy"] },
        { title: "Body Systems", description: "Learn about body systems.", requiredScore: 60, quizTopics: ["anatomy"], resources: ["anatomy-visible-body"] },
        { title: "Organs", description: "Understand organ functions.", requiredScore: 60, quizTopics: ["anatomy"], resources: ["anatomy-khan-academy"] },
        { title: "Review", description: "Review all topics.", requiredScore: 60, quizTopics: ["anatomy"], resources: ["anatomy-visible-body"] },
      ],
    },
    {
      title: "Mental Health & Wellness Path",
      description: "Understand mental health and wellness strategies.",
      category: "Health",
      difficulty: "beginner",
      duration: "4 weeks",
      modules: 4,
      color: "bg-green-100 text-green-700",
      icon: "🧠",
      skills: ["Mental Health", "Wellness"],
      milestones: [
        { title: "Mental Health Basics", description: "Understand mental health basics.", requiredScore: 60, quizTopics: ["mental-health"], resources: ["mental-health-coursera"] },
        { title: "Wellness Strategies", description: "Learn wellness strategies.", requiredScore: 60, quizTopics: ["mental-health"], resources: ["mental-health-coursera"] },
        { title: "Psychology", description: "Understand psychology basics.", requiredScore: 60, quizTopics: ["mental-health"], resources: ["mental-health-coursera"] },
        { title: "Review", description: "Review all topics.", requiredScore: 60, quizTopics: ["mental-health"], resources: ["mental-health-coursera"] },
      ],
    },
    {
      title: "Business Strategy Path",
      description: "Develop strategic thinking and business analysis skills.",
      category: "Business",
      difficulty: "beginner",
      duration: "4 weeks",
      modules: 4,
      color: "bg-purple-100 text-purple-700",
      icon: "💼",
      skills: ["Strategy", "Business"],
      milestones: [
        { title: "Strategy Basics", description: "Understand strategy basics.", requiredScore: 60, quizTopics: ["strategy"], resources: ["strategy-wharton-course"] },
        { title: "Business Models", description: "Learn about business models.", requiredScore: 60, quizTopics: ["strategy"], resources: ["strategy-hbr-articles"] },
        { title: "Case Studies", description: "Analyze case studies.", requiredScore: 60, quizTopics: ["strategy"], resources: ["strategy-wharton-course"] },
        { title: "Review", description: "Review all topics.", requiredScore: 60, quizTopics: ["strategy"], resources: ["strategy-hbr-articles"] },
      ],
    },
    {
      title: "Finance Fundamentals Path",
      description: "Master finance basics and corporate finance.",
      category: "Business",
      difficulty: "beginner",
      duration: "4 weeks",
      modules: 4,
      color: "bg-purple-100 text-purple-700",
      icon: "💰",
      skills: ["Finance", "Business"],
      milestones: [
        { title: "Finance Basics", description: "Understand finance basics.", requiredScore: 60, quizTopics: ["finance"], resources: ["finance-mit-course"] },
        { title: "Corporate Finance", description: "Learn about corporate finance.", requiredScore: 60, quizTopics: ["finance"], resources: ["finance-khan-academy"] },
        { title: "Financial Analysis", description: "Analyze financial statements.", requiredScore: 60, quizTopics: ["finance"], resources: ["finance-mit-course"] },
        { title: "Review", description: "Review all topics.", requiredScore: 60, quizTopics: ["finance"], resources: ["finance-khan-academy"] },
      ],
    },
    {
      title: "Marketing Essentials Path",
      description: "Learn the essentials of digital marketing.",
      category: "Business",
      difficulty: "beginner",
      duration: "4 weeks",
      modules: 4,
      color: "bg-pink-100 text-pink-700",
      icon: "📈",
      skills: ["Marketing", "Digital Marketing"],
      milestones: [
        { title: "Marketing Basics", description: "Understand marketing basics.", requiredScore: 60, quizTopics: ["marketing"], resources: ["marketing-google-course"] },
        { title: "Digital Marketing", description: "Learn about digital marketing.", requiredScore: 60, quizTopics: ["marketing"], resources: ["marketing-google-course"] },
        { title: "Campaigns", description: "Plan marketing campaigns.", requiredScore: 60, quizTopics: ["marketing"], resources: ["marketing-google-course"] },
        { title: "Review", description: "Review all topics.", requiredScore: 60, quizTopics: ["marketing"], resources: ["marketing-google-course"] },
      ],
    },
    {
      title: "Constitutional Law Path",
      description: "Master the basics of constitutional law.",
      category: "Law",
      difficulty: "beginner",
      duration: "4 weeks",
      modules: 4,
      color: "bg-amber-100 text-amber-700",
      icon: "⚖️",
      skills: ["Constitutional Law", "Law"],
      milestones: [
        { title: "Constitutional Law Basics", description: "Understand constitutional law basics.", requiredScore: 60, quizTopics: ["constitutional-law"], resources: ["constitutional-yale-course"] },
        { title: "Supreme Court Cases", description: "Learn about Supreme Court cases.", requiredScore: 60, quizTopics: ["constitutional-law"], resources: ["constitutional-justia"] },
        { title: "Case Analysis", description: "Analyze cases.", requiredScore: 60, quizTopics: ["constitutional-law"], resources: ["constitutional-yale-course"] },
        { title: "Review", description: "Review all topics.", requiredScore: 60, quizTopics: ["constitutional-law"], resources: ["constitutional-justia"] },
      ],
    },
    {
      title: "Contract Law Path",
      description: "Learn the essentials of contract law.",
      category: "Law",
      difficulty: "beginner",
      duration: "4 weeks",
      modules: 4,
      color: "bg-amber-100 text-amber-700",
      icon: "📜",
      skills: ["Contracts", "Law"],
      milestones: [
        { title: "Contract Law Basics", description: "Understand contract law basics.", requiredScore: 60, quizTopics: ["contracts"], resources: ["contracts-harvard-course"] },
        { title: "Case Studies", description: "Analyze contract law cases.", requiredScore: 60, quizTopics: ["contracts"], resources: ["contracts-harvard-course"] },
        { title: "Drafting Contracts", description: "Learn contract drafting.", requiredScore: 60, quizTopics: ["contracts"], resources: ["contracts-harvard-course"] },
        { title: "Review", description: "Review all topics.", requiredScore: 60, quizTopics: ["contracts"], resources: ["contracts-harvard-course"] },
      ],
    },
    {
      title: "General Psychology Path",
      description: "Explore the fundamentals of psychology.",
      category: "Psychology",
      difficulty: "beginner",
      duration: "4 weeks",
      modules: 4,
      color: "bg-pink-100 text-pink-700",
      icon: "🧠",
      skills: ["Psychology"],
      milestones: [
        { title: "Psychology Basics", description: "Understand psychology basics.", requiredScore: 60, quizTopics: ["general-psychology"], resources: ["psychology-yale-intro"] },
        { title: "Research Methods", description: "Learn about research methods.", requiredScore: 60, quizTopics: ["general-psychology"], resources: ["psychology-apa-resources"] },
        { title: "Applications", description: "Explore psychology applications.", requiredScore: 60, quizTopics: ["general-psychology"], resources: ["psychology-yale-intro"] },
        { title: "Review", description: "Review all topics.", requiredScore: 60, quizTopics: ["general-psychology"], resources: ["psychology-apa-resources"] },
      ],
    },
    {
      title: "Cognitive Science Path",
      description: "Dive into cognitive science and neuroscience.",
      category: "Psychology",
      difficulty: "beginner",
      duration: "4 weeks",
      modules: 4,
      color: "bg-pink-100 text-pink-700",
      icon: "🧠",
      skills: ["Cognitive Science"],
      milestones: [
        { title: "Cognitive Science Basics", description: "Understand cognitive science basics.", requiredScore: 60, quizTopics: ["cognitive-science"], resources: ["cognitive-mit-course"] },
        { title: "Neuroscience", description: "Learn about neuroscience.", requiredScore: 60, quizTopics: ["cognitive-science"], resources: ["cognitive-mit-course"] },
        { title: "Applications", description: "Explore cognitive science applications.", requiredScore: 60, quizTopics: ["cognitive-science"], resources: ["cognitive-mit-course"] },
        { title: "Review", description: "Review all topics.", requiredScore: 60, quizTopics: ["cognitive-science"], resources: ["cognitive-mit-course"] },
      ],
    },
    {
      title: "Calculus Mastery Path",
      description: "Master calculus from basics to integrals.",
      category: "Mathematics",
      difficulty: "beginner",
      duration: "4 weeks",
      modules: 4,
      color: "bg-indigo-100 text-indigo-700",
      icon: "📈",
      skills: ["Calculus"],
      milestones: [
        { title: "Calculus Basics", description: "Understand calculus basics.", requiredScore: 60, quizTopics: ["calculus"], resources: ["calculus-khan-academy"] },
        { title: "Derivatives", description: "Learn about derivatives.", requiredScore: 60, quizTopics: ["calculus"], resources: ["calculus-mit-course"] },
        { title: "Integrals", description: "Understand integrals.", requiredScore: 60, quizTopics: ["calculus"], resources: ["calculus-khan-academy"] },
        { title: "Review", description: "Review all topics.", requiredScore: 60, quizTopics: ["calculus"], resources: ["calculus-mit-course"] },
      ],
    },
    {
      title: "Statistics & Probability Path",
      description: "Learn statistics and probability fundamentals.",
      category: "Mathematics",
      difficulty: "beginner",
      duration: "4 weeks",
      modules: 4,
      color: "bg-indigo-100 text-indigo-700",
      icon: "📊",
      skills: ["Statistics", "Probability"],
      milestones: [
        { title: "Statistics Basics", description: "Understand statistics basics.", requiredScore: 60, quizTopics: ["statistics"], resources: ["statistics-khan-academy"] },
        { title: "Probability", description: "Learn about probability.", requiredScore: 60, quizTopics: ["statistics"], resources: ["statistics-mit-course"] },
        { title: "Data Analysis", description: "Understand data analysis.", requiredScore: 60, quizTopics: ["statistics"], resources: ["statistics-khan-academy"] },
        { title: "Review", description: "Review all topics.", requiredScore: 60, quizTopics: ["statistics"], resources: ["statistics-mit-course"] },
      ],
    },
  ];

  for (const lp of learningPathsData) {
    await prisma.learningPath.create({
      data: {
        title: lp.title,
        description: lp.description,
        category: lp.category,
        difficulty: lp.difficulty,
        duration: lp.duration,
        modules: lp.modules,
        color: lp.color,
        icon: lp.icon,
        skills: lp.skills,
        isPopular: false,
        milestones: {
          create: lp.milestones.map(m => ({
            title: m.title,
            description: m.description,
            requiredScore: m.requiredScore,
            quizTopics: m.quizTopics,
            resources: m.resources,
          }))
        },
      }
    });
  }
  // --- END: Comprehensive Learning Path Seeding ---
}

main()
  .then(() => {
    console.log('Database seeded successfully!')
    return prisma.$disconnect()
  })
  .catch((e) => {
    console.error(e)
    process.exit(1)
  }) 