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
    { name: 'Engineering', description: 'Mechanical, civil, electrical, more', icon: '🛠️', color: 'bg-gray-100 text-gray-700', iconColor: 'text-gray-500', questionCount: 25 },
    { name: 'Arts & Humanities', description: 'History, literature, philosophy', icon: '🎨', color: 'bg-pink-100 text-pink-700', iconColor: 'text-pink-500', questionCount: 25 },
    { name: 'Natural Sciences', description: 'Physics, chemistry, biology', icon: '🔬', color: 'bg-green-100 text-green-700', iconColor: 'text-green-500', questionCount: 25 },
    { name: 'Social Sciences', description: 'Sociology, economics, politics', icon: '🌍', color: 'bg-blue-100 text-blue-700', iconColor: 'text-blue-500', questionCount: 25 },
    { name: 'Technology', description: 'AI, cybersecurity, data science', icon: '🤖', color: 'bg-indigo-100 text-indigo-700', iconColor: 'text-indigo-500', questionCount: 25 },
  ];
  for (const category of categories) {
    await prisma.category.upsert({
      where: { name: category.name },
      update: {},
      create: category,
    });
  }

  // Subjects - Comprehensive list for all 11 categories
  const subjects = [
    // Computer Science Subjects
    { name: 'JavaScript Fundamentals', icon: '💻', description: 'Master JavaScript basics and modern ES6+ features.', color: 'bg-blue-100', borderColor: 'border-blue-200', topics: ['ES6', 'DOM', 'Async', 'Modules'], quizzes: 8, learners: 2500, avgTime: '4 weeks', difficulty: 'Beginner', rating: 4.8 },
    { name: 'Python Programming', icon: '🐍', description: 'Learn Python from basics to advanced concepts.', color: 'bg-green-100', borderColor: 'border-green-200', topics: ['OOP', 'Data Structures', 'Web Development'], quizzes: 10, learners: 3200, avgTime: '6 weeks', difficulty: 'Beginner', rating: 4.9 },
    { name: 'Data Structures & Algorithms', icon: '📊', description: 'Master fundamental algorithms and data structures.', color: 'bg-purple-100', borderColor: 'border-purple-200', topics: ['Arrays', 'Linked Lists', 'Trees', 'Graphs'], quizzes: 12, learners: 1800, avgTime: '8 weeks', difficulty: 'Intermediate', rating: 4.7 },
    { name: 'Web Development', icon: '🌐', description: 'Full-stack web development with modern technologies.', color: 'bg-indigo-100', borderColor: 'border-indigo-200', topics: ['HTML', 'CSS', 'React', 'Node.js'], quizzes: 15, learners: 2800, avgTime: '12 weeks', difficulty: 'Intermediate', rating: 4.8 },
    { name: 'Machine Learning', icon: '🤖', description: 'Introduction to machine learning and AI concepts.', color: 'bg-red-100', borderColor: 'border-red-200', topics: ['Supervised Learning', 'Neural Networks', 'Deep Learning'], quizzes: 10, learners: 1500, avgTime: '10 weeks', difficulty: 'Advanced', rating: 4.6 },

    // Health & Medicine Subjects
    { name: 'Human Anatomy', icon: '🫀', description: 'Comprehensive study of human body structure and function.', color: 'bg-red-100', borderColor: 'border-red-200', topics: ['Skeletal System', 'Muscular System', 'Nervous System'], quizzes: 12, learners: 1800, avgTime: '8 weeks', difficulty: 'Beginner', rating: 4.7 },
    { name: 'Medical Terminology', icon: '🏥', description: 'Learn essential medical terms and their meanings.', color: 'bg-blue-100', borderColor: 'border-blue-200', topics: ['Prefixes', 'Suffixes', 'Root Words'], quizzes: 8, learners: 2200, avgTime: '4 weeks', difficulty: 'Beginner', rating: 4.8 },
    { name: 'Nutrition Science', icon: '🥗', description: 'Understanding nutrition and its impact on health.', color: 'bg-green-100', borderColor: 'border-green-200', topics: ['Macronutrients', 'Micronutrients', 'Diet Planning'], quizzes: 10, learners: 1600, avgTime: '6 weeks', difficulty: 'Beginner', rating: 4.6 },
    { name: 'Pharmacology Basics', icon: '💊', description: 'Introduction to drugs and their effects on the body.', color: 'bg-purple-100', borderColor: 'border-purple-200', topics: ['Drug Classes', 'Mechanisms', 'Side Effects'], quizzes: 9, learners: 1200, avgTime: '6 weeks', difficulty: 'Intermediate', rating: 4.5 },
    { name: 'Clinical Skills', icon: '🩺', description: 'Essential clinical examination and diagnostic skills.', color: 'bg-orange-100', borderColor: 'border-orange-200', topics: ['Physical Exam', 'Diagnostic Tests', 'Patient Assessment'], quizzes: 11, learners: 900, avgTime: '8 weeks', difficulty: 'Advanced', rating: 4.7 },

    // Business Subjects
    { name: 'Business Fundamentals', icon: '💼', description: 'Core business concepts and principles.', color: 'bg-blue-100', borderColor: 'border-blue-200', topics: ['Management', 'Marketing', 'Finance'], quizzes: 10, learners: 2800, avgTime: '6 weeks', difficulty: 'Beginner', rating: 4.8 },
    { name: 'Digital Marketing', icon: '📈', description: 'Modern marketing strategies and digital platforms.', color: 'bg-green-100', borderColor: 'border-green-200', topics: ['SEO', 'Social Media', 'Content Marketing'], quizzes: 12, learners: 2200, avgTime: '8 weeks', difficulty: 'Beginner', rating: 4.7 },
    { name: 'Financial Management', icon: '💰', description: 'Understanding financial statements and business finance.', color: 'bg-yellow-100', borderColor: 'border-yellow-200', topics: ['Accounting', 'Budgeting', 'Investment'], quizzes: 11, learners: 1800, avgTime: '8 weeks', difficulty: 'Intermediate', rating: 4.6 },
    { name: 'Strategic Management', icon: '🎯', description: 'Strategic thinking and business planning.', color: 'bg-purple-100', borderColor: 'border-purple-200', topics: ['Strategy Formulation', 'Competitive Analysis', 'Implementation'], quizzes: 9, learners: 1400, avgTime: '6 weeks', difficulty: 'Intermediate', rating: 4.7 },
    { name: 'Entrepreneurship', icon: '🚀', description: 'Starting and growing successful businesses.', color: 'bg-red-100', borderColor: 'border-red-200', topics: ['Business Planning', 'Funding', 'Growth Strategies'], quizzes: 10, learners: 1600, avgTime: '8 weeks', difficulty: 'Advanced', rating: 4.8 },

    // Law Subjects
    { name: 'Legal Fundamentals', icon: '⚖️', description: 'Basic legal concepts and principles.', color: 'bg-blue-100', borderColor: 'border-blue-200', topics: ['Constitutional Law', 'Civil Law', 'Criminal Law'], quizzes: 8, learners: 1200, avgTime: '6 weeks', difficulty: 'Beginner', rating: 4.6 },
    { name: 'Contract Law', icon: '📋', description: 'Understanding contracts and legal agreements.', color: 'bg-green-100', borderColor: 'border-green-200', topics: ['Contract Formation', 'Breach', 'Remedies'], quizzes: 9, learners: 1000, avgTime: '6 weeks', difficulty: 'Beginner', rating: 4.7 },
    { name: 'Business Law', icon: '🏢', description: 'Legal aspects of business operations.', color: 'bg-purple-100', borderColor: 'border-purple-200', topics: ['Corporate Law', 'Employment Law', 'Intellectual Property'], quizzes: 10, learners: 800, avgTime: '8 weeks', difficulty: 'Intermediate', rating: 4.5 },
    { name: 'Criminal Law', icon: '🚨', description: 'Criminal justice system and procedures.', color: 'bg-red-100', borderColor: 'border-red-200', topics: ['Criminal Procedure', 'Evidence', 'Sentencing'], quizzes: 8, learners: 700, avgTime: '6 weeks', difficulty: 'Intermediate', rating: 4.6 },
    { name: 'International Law', icon: '🌍', description: 'Global legal frameworks and international relations.', color: 'bg-indigo-100', borderColor: 'border-indigo-200', topics: ['Treaties', 'Human Rights', 'Trade Law'], quizzes: 7, learners: 500, avgTime: '8 weeks', difficulty: 'Advanced', rating: 4.4 },

    // Psychology Subjects
    { name: 'Introduction to Psychology', icon: '🧠', description: 'Fundamental principles of human behavior and mental processes.', color: 'bg-blue-100', borderColor: 'border-blue-200', topics: ['Cognitive Psychology', 'Social Psychology', 'Developmental Psychology'], quizzes: 10, learners: 2200, avgTime: '6 weeks', difficulty: 'Beginner', rating: 4.8 },
    { name: 'Cognitive Psychology', icon: '💭', description: 'Study of mental processes and information processing.', color: 'bg-green-100', borderColor: 'border-green-200', topics: ['Memory', 'Attention', 'Problem Solving'], quizzes: 9, learners: 1600, avgTime: '6 weeks', difficulty: 'Beginner', rating: 4.7 },
    { name: 'Social Psychology', icon: '👥', description: 'How individuals think, feel, and behave in social contexts.', color: 'bg-purple-100', borderColor: 'border-purple-200', topics: ['Attitudes', 'Group Behavior', 'Social Influence'], quizzes: 8, learners: 1400, avgTime: '6 weeks', difficulty: 'Intermediate', rating: 4.6 },
    { name: 'Abnormal Psychology', icon: '🏥', description: 'Understanding psychological disorders and mental health.', color: 'bg-red-100', borderColor: 'border-red-200', topics: ['Mood Disorders', 'Anxiety Disorders', 'Treatment'], quizzes: 9, learners: 1200, avgTime: '8 weeks', difficulty: 'Intermediate', rating: 4.5 },
    { name: 'Clinical Psychology', icon: '🩺', description: 'Assessment and treatment of psychological disorders.', color: 'bg-orange-100', borderColor: 'border-orange-200', topics: ['Assessment', 'Therapy', 'Intervention'], quizzes: 10, learners: 800, avgTime: '10 weeks', difficulty: 'Advanced', rating: 4.7 },

    // Mathematics Subjects
    { name: 'Algebra Fundamentals', icon: '📐', description: 'Core algebraic concepts and problem-solving techniques.', color: 'bg-blue-100', borderColor: 'border-blue-200', topics: ['Linear Equations', 'Quadratic Functions', 'Polynomials'], quizzes: 12, learners: 2800, avgTime: '8 weeks', difficulty: 'Beginner', rating: 4.7 },
    { name: 'Calculus I', icon: '∫', description: 'Introduction to differential and integral calculus.', color: 'bg-green-100', borderColor: 'border-green-200', topics: ['Limits', 'Derivatives', 'Applications'], quizzes: 15, learners: 2000, avgTime: '10 weeks', difficulty: 'Intermediate', rating: 4.6 },
    { name: 'Statistics', icon: '📊', description: 'Data analysis and statistical inference.', color: 'bg-purple-100', borderColor: 'border-purple-200', topics: ['Descriptive Statistics', 'Probability', 'Hypothesis Testing'], quizzes: 11, learners: 1800, avgTime: '8 weeks', difficulty: 'Intermediate', rating: 4.8 },
    { name: 'Linear Algebra', icon: '🔢', description: 'Vector spaces, matrices, and linear transformations.', color: 'bg-red-100', borderColor: 'border-red-200', topics: ['Vectors', 'Matrices', 'Eigenvalues'], quizzes: 10, learners: 1200, avgTime: '8 weeks', difficulty: 'Intermediate', rating: 4.5 },
    { name: 'Number Theory', icon: '🔍', description: 'Properties of integers and mathematical structures.', color: 'bg-indigo-100', borderColor: 'border-indigo-200', topics: ['Prime Numbers', 'Modular Arithmetic', 'Cryptography'], quizzes: 8, learners: 800, avgTime: '10 weeks', difficulty: 'Advanced', rating: 4.4 },

    // Engineering Subjects
    { name: 'Engineering Mechanics', icon: '⚙️', description: 'Fundamental principles of mechanical engineering.', color: 'bg-blue-100', borderColor: 'border-blue-200', topics: ['Statics', 'Dynamics', 'Materials'], quizzes: 12, learners: 1800, avgTime: '10 weeks', difficulty: 'Beginner', rating: 4.6 },
    { name: 'Electrical Circuits', icon: '⚡', description: 'Basic electrical engineering concepts and circuit analysis.', color: 'bg-yellow-100', borderColor: 'border-yellow-200', topics: ['Ohm\'s Law', 'Circuit Analysis', 'AC/DC'], quizzes: 11, learners: 1600, avgTime: '8 weeks', difficulty: 'Beginner', rating: 4.7 },
    { name: 'Thermodynamics', icon: '🔥', description: 'Heat, energy, and thermodynamic systems.', color: 'bg-red-100', borderColor: 'border-red-200', topics: ['Laws of Thermodynamics', 'Heat Transfer', 'Power Cycles'], quizzes: 10, learners: 1200, avgTime: '8 weeks', difficulty: 'Intermediate', rating: 4.5 },
    { name: 'Fluid Mechanics', icon: '🌊', description: 'Behavior of fluids and fluid dynamics.', color: 'bg-cyan-100', borderColor: 'border-cyan-200', topics: ['Fluid Properties', 'Flow Analysis', 'Pumps'], quizzes: 9, learners: 1000, avgTime: '8 weeks', difficulty: 'Intermediate', rating: 4.4 },
    { name: 'Control Systems', icon: '🎛️', description: 'Automatic control theory and system design.', color: 'bg-purple-100', borderColor: 'border-purple-200', topics: ['Feedback Control', 'System Modeling', 'Stability'], quizzes: 8, learners: 700, avgTime: '10 weeks', difficulty: 'Advanced', rating: 4.3 },

    // Arts & Humanities Subjects
    { name: 'World History', icon: '📚', description: 'Comprehensive overview of human history and civilizations.', color: 'bg-blue-100', borderColor: 'border-blue-200', topics: ['Ancient Civilizations', 'Middle Ages', 'Modern Era'], quizzes: 15, learners: 2200, avgTime: '12 weeks', difficulty: 'Beginner', rating: 4.8 },
    { name: 'Literature Analysis', icon: '📖', description: 'Critical analysis of literary works and genres.', color: 'bg-green-100', borderColor: 'border-green-200', topics: ['Poetry', 'Prose', 'Drama'], quizzes: 12, learners: 1800, avgTime: '8 weeks', difficulty: 'Beginner', rating: 4.7 },
    { name: 'Philosophy', icon: '🤔', description: 'Major philosophical traditions and critical thinking.', color: 'bg-purple-100', borderColor: 'border-purple-200', topics: ['Ethics', 'Metaphysics', 'Epistemology'], quizzes: 10, learners: 1400, avgTime: '8 weeks', difficulty: 'Intermediate', rating: 4.6 },
    { name: 'Art History', icon: '🎨', description: 'Evolution of art and artistic movements.', color: 'bg-pink-100', borderColor: 'border-pink-200', topics: ['Renaissance', 'Modern Art', 'Contemporary'], quizzes: 11, learners: 1200, avgTime: '8 weeks', difficulty: 'Intermediate', rating: 4.5 },
    { name: 'Cultural Studies', icon: '🌍', description: 'Interdisciplinary study of culture and society.', color: 'bg-orange-100', borderColor: 'border-orange-200', topics: ['Cultural Theory', 'Media Studies', 'Identity'], quizzes: 9, learners: 800, avgTime: '10 weeks', difficulty: 'Advanced', rating: 4.4 },

    // Natural Sciences Subjects
    { name: 'Physics Fundamentals', icon: '⚛️', description: 'Core principles of physics and natural phenomena.', color: 'bg-blue-100', borderColor: 'border-blue-200', topics: ['Mechanics', 'Thermodynamics', 'Electromagnetism'], quizzes: 14, learners: 2400, avgTime: '10 weeks', difficulty: 'Beginner', rating: 4.7 },
    { name: 'Chemistry Basics', icon: '🧪', description: 'Fundamental chemical principles and reactions.', color: 'bg-green-100', borderColor: 'border-green-200', topics: ['Atomic Structure', 'Chemical Bonding', 'Reactions'], quizzes: 12, learners: 2000, avgTime: '8 weeks', difficulty: 'Beginner', rating: 4.8 },
    { name: 'Biology Essentials', icon: '🧬', description: 'Study of living organisms and life processes.', color: 'bg-purple-100', borderColor: 'border-purple-200', topics: ['Cell Biology', 'Genetics', 'Ecology'], quizzes: 13, learners: 2200, avgTime: '10 weeks', difficulty: 'Beginner', rating: 4.7 },
    { name: 'Organic Chemistry', icon: '⚗️', description: 'Carbon-based compounds and their reactions.', color: 'bg-red-100', borderColor: 'border-red-200', topics: ['Functional Groups', 'Reaction Mechanisms', 'Synthesis'], quizzes: 11, learners: 1400, avgTime: '10 weeks', difficulty: 'Intermediate', rating: 4.5 },
    { name: 'Quantum Physics', icon: '🔬', description: 'Modern physics and quantum mechanical principles.', color: 'bg-indigo-100', borderColor: 'border-indigo-200', topics: ['Wave-Particle Duality', 'Quantum States', 'Applications'], quizzes: 8, learners: 800, avgTime: '12 weeks', difficulty: 'Advanced', rating: 4.3 },

    // Social Sciences Subjects
    { name: 'Sociology', icon: '👥', description: 'Study of society, social relationships, and social institutions.', color: 'bg-blue-100', borderColor: 'border-blue-200', topics: ['Social Theory', 'Social Institutions', 'Social Change'], quizzes: 12, learners: 1800, avgTime: '8 weeks', difficulty: 'Beginner', rating: 4.7 },
    { name: 'Economics', icon: '📈', description: 'Principles of economics and economic systems.', color: 'bg-green-100', borderColor: 'border-green-200', topics: ['Microeconomics', 'Macroeconomics', 'Economic Policy'], quizzes: 13, learners: 2000, avgTime: '10 weeks', difficulty: 'Beginner', rating: 4.8 },
    { name: 'Political Science', icon: '🏛️', description: 'Study of politics, government, and political behavior.', color: 'bg-purple-100', borderColor: 'border-purple-200', topics: ['Political Theory', 'Comparative Politics', 'International Relations'], quizzes: 11, learners: 1600, avgTime: '8 weeks', difficulty: 'Intermediate', rating: 4.6 },
    { name: 'Anthropology', icon: '🌍', description: 'Study of human societies and cultures across time and space.', color: 'bg-orange-100', borderColor: 'border-orange-200', topics: ['Cultural Anthropology', 'Archaeology', 'Physical Anthropology'], quizzes: 10, learners: 1200, avgTime: '8 weeks', difficulty: 'Intermediate', rating: 4.5 },
    { name: 'Social Psychology', icon: '🧠', description: 'Psychological aspects of social behavior and group dynamics.', color: 'bg-pink-100', borderColor: 'border-pink-200', topics: ['Social Cognition', 'Group Behavior', 'Interpersonal Relations'], quizzes: 9, learners: 1000, avgTime: '8 weeks', difficulty: 'Advanced', rating: 4.4 },

    // Technology Subjects
    { name: 'Artificial Intelligence', icon: '🤖', description: 'Fundamentals of AI and machine learning systems.', color: 'bg-blue-100', borderColor: 'border-blue-200', topics: ['Machine Learning', 'Neural Networks', 'Natural Language Processing'], quizzes: 12, learners: 2200, avgTime: '10 weeks', difficulty: 'Intermediate', rating: 4.8 },
    { name: 'Cybersecurity', icon: '🔒', description: 'Protecting digital systems and information security.', color: 'bg-red-100', borderColor: 'border-red-200', topics: ['Network Security', 'Cryptography', 'Ethical Hacking'], quizzes: 11, learners: 1800, avgTime: '8 weeks', difficulty: 'Intermediate', rating: 4.7 },
    { name: 'Data Science', icon: '📊', description: 'Extracting insights from data using scientific methods.', color: 'bg-green-100', borderColor: 'border-green-200', topics: ['Data Analysis', 'Statistics', 'Visualization'], quizzes: 13, learners: 2000, avgTime: '10 weeks', difficulty: 'Intermediate', rating: 4.8 },
    { name: 'Cloud Computing', icon: '☁️', description: 'Cloud platforms and distributed computing systems.', color: 'bg-purple-100', borderColor: 'border-purple-200', topics: ['AWS', 'Azure', 'Google Cloud'], quizzes: 10, learners: 1400, avgTime: '8 weeks', difficulty: 'Intermediate', rating: 4.6 },
    { name: 'Blockchain Technology', icon: '⛓️', description: 'Distributed ledger technology and cryptocurrency systems.', color: 'bg-indigo-100', borderColor: 'border-indigo-200', topics: ['Cryptocurrency', 'Smart Contracts', 'DeFi'], quizzes: 8, learners: 1000, avgTime: '8 weeks', difficulty: 'Advanced', rating: 4.5 },
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

  // Comprehensive Resources for all subjects
  const resources = [
    // Computer Science Resources
    { title: 'MDN JavaScript Guide', type: 'article', url: 'https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide', description: 'Comprehensive JavaScript documentation and tutorials', subjectId: subjectRecords[0].id },
    { title: 'JavaScript.info', type: 'article', url: 'https://javascript.info/', description: 'Modern JavaScript tutorial from basics to advanced topics', subjectId: subjectRecords[0].id },
    { title: 'Eloquent JavaScript', type: 'article', url: 'https://eloquentjavascript.net/', description: 'Free online book on JavaScript programming', subjectId: subjectRecords[0].id },
    { title: 'Python Official Documentation', type: 'article', url: 'https://docs.python.org/3/tutorial/', description: 'Official Python language tutorial and reference', subjectId: subjectRecords[1].id },
    { title: 'Real Python Tutorials', type: 'article', url: 'https://realpython.com/', description: 'High-quality Python tutorials and articles', subjectId: subjectRecords[1].id },
    { title: 'Python Crash Course', type: 'video', url: 'https://www.youtube.com/watch?v=_uQrJ0TkZlc', description: 'Complete Python tutorial for beginners', subjectId: subjectRecords[1].id },
    { title: 'GeeksforGeeks DSA', type: 'article', url: 'https://www.geeksforgeeks.org/data-structures/', description: 'Comprehensive data structures and algorithms guide', subjectId: subjectRecords[2].id },
    { title: 'LeetCode Practice', type: 'link', url: 'https://leetcode.com/', description: 'Practice coding problems and algorithms', subjectId: subjectRecords[2].id },
    { title: 'React Documentation', type: 'article', url: 'https://react.dev/', description: 'Official React documentation and tutorials', subjectId: subjectRecords[3].id },
    { title: 'Node.js Guide', type: 'article', url: 'https://nodejs.org/en/learn/', description: 'Node.js official learning resources', subjectId: subjectRecords[3].id },
    { title: 'Coursera Machine Learning', type: 'video', url: 'https://www.coursera.org/learn/machine-learning', description: 'Andrew Ng\'s famous machine learning course', subjectId: subjectRecords[4].id },
    { title: 'Fast.ai Practical Deep Learning', type: 'video', url: 'https://course.fast.ai/', description: 'Practical deep learning for coders', subjectId: subjectRecords[4].id },

    // Health & Medicine Resources
    { title: 'Khan Academy Anatomy', type: 'video', url: 'https://www.khanacademy.org/science/health-and-medicine', description: 'Comprehensive anatomy and physiology courses', subjectId: subjectRecords[5].id },
    { title: 'Visible Body', type: 'link', url: 'https://www.visiblebody.com/', description: 'Interactive 3D human anatomy models', subjectId: subjectRecords[5].id },
    { title: 'Medical Terminology Course', type: 'article', url: 'https://www.medicalnewstoday.com/medical-terminology', description: 'Medical terms and their meanings', subjectId: subjectRecords[6].id },
    { title: 'MedlinePlus Medical Dictionary', type: 'article', url: 'https://medlineplus.gov/medwords/medicaldictionary.html', description: 'Official medical terminology resource', subjectId: subjectRecords[6].id },
    { title: 'Nutrition.gov', type: 'article', url: 'https://www.nutrition.gov/', description: 'Evidence-based nutrition information', subjectId: subjectRecords[7].id },
    { title: 'Harvard Nutrition Source', type: 'article', url: 'https://www.hsph.harvard.edu/nutritionsource/', description: 'Nutrition science from Harvard experts', subjectId: subjectRecords[7].id },
    { title: 'Drugs.com', type: 'article', url: 'https://www.drugs.com/', description: 'Comprehensive drug information database', subjectId: subjectRecords[8].id },
    { title: 'Clinical Skills Handbook', type: 'download', url: 'https://www.mededportal.org/', description: 'Clinical examination techniques guide', subjectId: subjectRecords[9].id },

    // Business Resources
    { title: 'Harvard Business Review', type: 'article', url: 'https://hbr.org/', description: 'Leading business management publication', subjectId: subjectRecords[10].id },
    { title: 'Khan Academy Economics', type: 'video', url: 'https://www.khanacademy.org/economics-finance-domain', description: 'Free economics and finance courses', subjectId: subjectRecords[10].id },
    { title: 'Google Digital Garage', type: 'video', url: 'https://learndigital.withgoogle.com/digitalgarage', description: 'Free digital marketing certification', subjectId: subjectRecords[11].id },
    { title: 'HubSpot Marketing Academy', type: 'video', url: 'https://academy.hubspot.com/', description: 'Comprehensive marketing education', subjectId: subjectRecords[11].id },
    { title: 'Investopedia', type: 'article', url: 'https://www.investopedia.com/', description: 'Financial education and investment resources', subjectId: subjectRecords[12].id },
    { title: 'Coursera Financial Management', type: 'video', url: 'https://www.coursera.org/specializations/financial-management', description: 'Professional financial management course', subjectId: subjectRecords[12].id },
    { title: 'Strategy+Business', type: 'article', url: 'https://www.strategy-business.com/', description: 'Strategic management insights and case studies', subjectId: subjectRecords[13].id },
    { title: 'Y Combinator Startup School', type: 'video', url: 'https://www.startupschool.org/', description: 'Free startup and entrepreneurship course', subjectId: subjectRecords[14].id },

    // Law Resources
    { title: 'Cornell Legal Information Institute', type: 'article', url: 'https://www.law.cornell.edu/', description: 'Free legal information and resources', subjectId: subjectRecords[15].id },
    { title: 'Harvard Law School Case Studies', type: 'article', url: 'https://case.harvard.edu/', description: 'Legal case studies and analysis', subjectId: subjectRecords[15].id },
    { title: 'Contract Law Textbook', type: 'download', url: 'https://open.umn.edu/opentextbooks/textbooks/contract-law', description: 'Open source contract law textbook', subjectId: subjectRecords[16].id },
    { title: 'Business Law Guide', type: 'article', url: 'https://www.sba.gov/business-guide/manage-your-business', description: 'Small Business Administration legal guide', subjectId: subjectRecords[17].id },
    { title: 'Criminal Law Cases', type: 'article', url: 'https://supreme.justia.com/cases/federal/us/', description: 'Supreme Court criminal law cases', subjectId: subjectRecords[18].id },
    { title: 'International Law Database', type: 'article', url: 'https://www.un.org/en/sections/issues-depth/international-law-and-justice/', description: 'UN international law resources', subjectId: subjectRecords[19].id },

    // Psychology Resources
    { title: 'Khan Academy Psychology', type: 'video', url: 'https://www.khanacademy.org/test-prep/mcat/behavior', description: 'Psychology fundamentals for MCAT prep', subjectId: subjectRecords[20].id },
    { title: 'MIT OpenCourseWare Psychology', type: 'video', url: 'https://ocw.mit.edu/courses/brain-and-cognitive-sciences/', description: 'Free psychology courses from MIT', subjectId: subjectRecords[20].id },
    { title: 'Cognitive Psychology Textbook', type: 'download', url: 'https://open.umn.edu/opentextbooks/textbooks/cognitive-psychology', description: 'Open source cognitive psychology textbook', subjectId: subjectRecords[21].id },
    { title: 'Social Psychology Network', type: 'article', url: 'https://www.socialpsychology.org/', description: 'Social psychology research and resources', subjectId: subjectRecords[22].id },
    { title: 'DSM-5 Overview', type: 'article', url: 'https://www.psychiatry.org/psychiatrists/practice/dsm', description: 'Diagnostic and Statistical Manual overview', subjectId: subjectRecords[23].id },
    { title: 'Clinical Psychology Resources', type: 'article', url: 'https://www.apa.org/education/ce/', description: 'American Psychological Association resources', subjectId: subjectRecords[24].id },

    // Mathematics Resources
    { title: 'Khan Academy Math', type: 'video', url: 'https://www.khanacademy.org/math', description: 'Comprehensive mathematics courses', subjectId: subjectRecords[25].id },
    { title: 'MIT OpenCourseWare Math', type: 'video', url: 'https://ocw.mit.edu/courses/mathematics/', description: 'Free mathematics courses from MIT', subjectId: subjectRecords[25].id },
    { title: 'Calculus Made Easy', type: 'download', url: 'https://calculusmadeeasy.org/', description: 'Interactive calculus learning platform', subjectId: subjectRecords[26].id },
    { title: 'Statistics.com', type: 'article', url: 'https://www.statistics.com/', description: 'Professional statistics education', subjectId: subjectRecords[27].id },
    { title: 'Linear Algebra Textbook', type: 'download', url: 'https://open.umn.edu/opentextbooks/textbooks/linear-algebra', description: 'Open source linear algebra textbook', subjectId: subjectRecords[28].id },
    { title: 'Number Theory Course', type: 'video', url: 'https://www.coursera.org/learn/number-theory', description: 'Introduction to number theory', subjectId: subjectRecords[29].id },

    // Engineering Resources
    { title: 'MIT Engineering Courses', type: 'video', url: 'https://ocw.mit.edu/courses/engineering/', description: 'Free engineering courses from MIT', subjectId: subjectRecords[30].id },
    { title: 'Engineering Mechanics Textbook', type: 'download', url: 'https://open.umn.edu/opentextbooks/textbooks/engineering-mechanics', description: 'Open source engineering mechanics textbook', subjectId: subjectRecords[30].id },
    { title: 'Circuit Analysis Course', type: 'video', url: 'https://www.coursera.org/learn/circuit-analysis', description: 'Electrical circuit analysis fundamentals', subjectId: subjectRecords[31].id },
    { title: 'Thermodynamics Textbook', type: 'download', url: 'https://open.umn.edu/opentextbooks/textbooks/thermodynamics', description: 'Open source thermodynamics textbook', subjectId: subjectRecords[32].id },
    { title: 'Fluid Mechanics Course', type: 'video', url: 'https://www.edx.org/learn/fluid-mechanics', description: 'Fluid mechanics and dynamics', subjectId: subjectRecords[33].id },
    { title: 'Control Systems Textbook', type: 'download', url: 'https://open.umn.edu/opentextbooks/textbooks/control-systems', description: 'Open source control systems textbook', subjectId: subjectRecords[34].id },

    // Arts & Humanities Resources
    { title: 'Khan Academy Art History', type: 'video', url: 'https://www.khanacademy.org/humanities/art-history', description: 'Comprehensive art history courses', subjectId: subjectRecords[35].id },
    { title: 'World History Encyclopedia', type: 'article', url: 'https://www.worldhistory.org/', description: 'Comprehensive world history resource', subjectId: subjectRecords[35].id },
    { title: 'Project Gutenberg', type: 'article', url: 'https://www.gutenberg.org/', description: 'Free ebooks of classic literature', subjectId: subjectRecords[36].id },
    { title: 'Stanford Encyclopedia of Philosophy', type: 'article', url: 'https://plato.stanford.edu/', description: 'Comprehensive philosophy resource', subjectId: subjectRecords[37].id },
    { title: 'Metropolitan Museum Timeline', type: 'article', url: 'https://www.metmuseum.org/toah/', description: 'Art history timeline and resources', subjectId: subjectRecords[38].id },
    { title: 'Cultural Studies Journal', type: 'article', url: 'https://www.tandfonline.com/journals/rcus20', description: 'Academic cultural studies research', subjectId: subjectRecords[39].id },

    // Natural Sciences Resources
    { title: 'Khan Academy Physics', type: 'video', url: 'https://www.khanacademy.org/science/physics', description: 'Comprehensive physics courses', subjectId: subjectRecords[40].id },
    { title: 'MIT Physics Courses', type: 'video', url: 'https://ocw.mit.edu/courses/physics/', description: 'Free physics courses from MIT', subjectId: subjectRecords[40].id },
    { title: 'Chemistry LibreTexts', type: 'article', url: 'https://chem.libretexts.org/', description: 'Open source chemistry textbooks', subjectId: subjectRecords[41].id },
    { title: 'Biology LibreTexts', type: 'article', url: 'https://bio.libretexts.org/', description: 'Open source biology textbooks', subjectId: subjectRecords[42].id },
    { title: 'Organic Chemistry Tutor', type: 'video', url: 'https://www.youtube.com/c/TheOrganicChemistryTutor', description: 'Comprehensive organic chemistry tutorials', subjectId: subjectRecords[43].id },
    { title: 'Quantum Physics Course', type: 'video', url: 'https://www.coursera.org/learn/quantum-mechanics', description: 'Introduction to quantum mechanics', subjectId: subjectRecords[44].id },

    // Social Sciences Resources
    { title: 'Khan Academy Sociology', type: 'video', url: 'https://www.khanacademy.org/test-prep/mcat/society-and-culture', description: 'Sociology fundamentals for MCAT prep', subjectId: subjectRecords[45].id },
    { title: 'Economics Textbook', type: 'download', url: 'https://open.umn.edu/opentextbooks/textbooks/principles-of-economics', description: 'Open source economics textbook', subjectId: subjectRecords[46].id },
    { title: 'Political Science Textbook', type: 'download', url: 'https://open.umn.edu/opentextbooks/textbooks/introduction-to-political-science', description: 'Open source political science textbook', subjectId: subjectRecords[47].id },
    { title: 'Anthropology Textbook', type: 'download', url: 'https://open.umn.edu/opentextbooks/textbooks/cultural-anthropology', description: 'Open source anthropology textbook', subjectId: subjectRecords[48].id },
    { title: 'Social Psychology Textbook', type: 'download', url: 'https://open.umn.edu/opentextbooks/textbooks/social-psychology', description: 'Open source social psychology textbook', subjectId: subjectRecords[49].id },

    // Technology Resources
    { title: 'Stanford CS229 Machine Learning', type: 'video', url: 'https://cs229.stanford.edu/', description: 'Stanford\'s machine learning course materials', subjectId: subjectRecords[50].id },
    { title: 'Cybersecurity Course', type: 'video', url: 'https://www.coursera.org/specializations/cyber-security', description: 'Comprehensive cybersecurity specialization', subjectId: subjectRecords[51].id },
    { title: 'Data Science Handbook', type: 'download', url: 'https://jakevdp.github.io/PythonDataScienceHandbook/', description: 'Free data science handbook', subjectId: subjectRecords[52].id },
    { title: 'AWS Training', type: 'video', url: 'https://aws.amazon.com/training/', description: 'Official AWS cloud computing training', subjectId: subjectRecords[53].id },
    { title: 'Blockchain Basics', type: 'video', url: 'https://www.coursera.org/learn/blockchain-basics', description: 'Introduction to blockchain technology', subjectId: subjectRecords[54].id },
  ];
  for (const resource of resources) {
    await prisma.resource.create({ data: resource });
  }

  // Study Plans for different difficulty levels
  const studyPlans = [
    // Beginner Level Study Plans
    {
      category: 'Computer Science',
      week: 1,
      focus: 'Programming Fundamentals',
      resources: ['JavaScript Basics', 'Python Introduction', 'HTML/CSS Fundamentals'],
      quizTopics: ['variables', 'functions', 'basic-syntax'],
      goals: ['Understand basic programming concepts', 'Write simple programs', 'Complete first coding project']
    },
    {
      category: 'Computer Science',
      week: 2,
      focus: 'Data Structures Basics',
      resources: ['Arrays and Lists', 'Basic Algorithms', 'Problem Solving'],
      quizTopics: ['arrays', 'loops', 'conditionals'],
      goals: ['Master basic data structures', 'Implement simple algorithms', 'Solve coding problems']
    },
    {
      category: 'Health & Medicine',
      week: 1,
      focus: 'Human Anatomy Basics',
      resources: ['Skeletal System', 'Muscular System', 'Basic Medical Terms'],
      quizTopics: ['anatomy', 'medical-terminology', 'body-systems'],
      goals: ['Learn major body systems', 'Understand medical terminology', 'Identify basic anatomical structures']
    },
    {
      category: 'Business',
      week: 1,
      focus: 'Business Fundamentals',
      resources: ['Business Concepts', 'Marketing Basics', 'Financial Literacy'],
      quizTopics: ['business-concepts', 'marketing', 'finance-basics'],
      goals: ['Understand business principles', 'Learn marketing fundamentals', 'Grasp basic financial concepts']
    },
    {
      category: 'Law',
      week: 1,
      focus: 'Legal Fundamentals',
      resources: ['Constitutional Law', 'Civil Law Basics', 'Legal Terminology'],
      quizTopics: ['constitutional-law', 'civil-law', 'legal-terms'],
      goals: ['Understand legal system basics', 'Learn legal terminology', 'Grasp fundamental legal concepts']
    },
    {
      category: 'Psychology',
      week: 1,
      focus: 'Psychology Introduction',
      resources: ['Cognitive Psychology', 'Social Psychology', 'Developmental Psychology'],
      quizTopics: ['cognitive-psychology', 'social-psychology', 'developmental-psychology'],
      goals: ['Understand psychology fundamentals', 'Learn major psychological theories', 'Apply psychological concepts']
    },
    {
      category: 'Mathematics',
      week: 1,
      focus: 'Algebra Fundamentals',
      resources: ['Linear Equations', 'Quadratic Functions', 'Polynomials'],
      quizTopics: ['algebra', 'equations', 'functions'],
      goals: ['Master algebraic concepts', 'Solve linear equations', 'Understand function relationships']
    },
    {
      category: 'Engineering',
      week: 1,
      focus: 'Engineering Mechanics',
      resources: ['Statics', 'Dynamics Basics', 'Materials Science'],
      quizTopics: ['mechanics', 'statics', 'dynamics'],
      goals: ['Understand mechanical principles', 'Learn engineering fundamentals', 'Apply physics to engineering']
    },
    {
      category: 'Arts & Humanities',
      week: 1,
      focus: 'World History',
      resources: ['Ancient Civilizations', 'Middle Ages', 'Modern Era'],
      quizTopics: ['ancient-history', 'medieval-history', 'modern-history'],
      goals: ['Understand historical timelines', 'Learn major historical events', 'Analyze historical patterns']
    },
    {
      category: 'Natural Sciences',
      week: 1,
      focus: 'Physics Fundamentals',
      resources: ['Mechanics', 'Thermodynamics', 'Electromagnetism'],
      quizTopics: ['mechanics', 'thermodynamics', 'electromagnetism'],
      goals: ['Understand physical laws', 'Learn scientific method', 'Apply physics concepts']
    },
    {
      category: 'Social Sciences',
      week: 1,
      focus: 'Sociology Basics',
      resources: ['Social Theory', 'Social Institutions', 'Social Change'],
      quizTopics: ['social-theory', 'social-institutions', 'social-change'],
      goals: ['Understand sociological concepts', 'Learn social theories', 'Analyze social structures']
    },
    {
      category: 'Technology',
      week: 1,
      focus: 'AI Fundamentals',
      resources: ['Machine Learning Basics', 'Neural Networks', 'Data Science'],
      quizTopics: ['machine-learning', 'neural-networks', 'data-science'],
      goals: ['Understand AI concepts', 'Learn machine learning basics', 'Grasp data science fundamentals']
    },

    // Intermediate Level Study Plans
    {
      category: 'Computer Science',
      week: 3,
      focus: 'Advanced Programming',
      resources: ['Object-Oriented Programming', 'Data Structures', 'Algorithms'],
      quizTopics: ['oop', 'data-structures', 'algorithms'],
      goals: ['Master OOP concepts', 'Implement complex data structures', 'Design efficient algorithms']
    },
    {
      category: 'Computer Science',
      week: 4,
      focus: 'Web Development',
      resources: ['React Framework', 'Node.js Backend', 'Database Design'],
      quizTopics: ['react', 'nodejs', 'databases'],
      goals: ['Build full-stack applications', 'Understand web architecture', 'Implement database systems']
    },
    {
      category: 'Health & Medicine',
      week: 2,
      focus: 'Clinical Skills',
      resources: ['Physical Examination', 'Diagnostic Tests', 'Patient Assessment'],
      quizTopics: ['clinical-skills', 'diagnostics', 'patient-care'],
      goals: ['Master clinical examination', 'Understand diagnostic procedures', 'Develop patient care skills']
    },
    {
      category: 'Business',
      week: 2,
      focus: 'Strategic Management',
      resources: ['Strategy Formulation', 'Competitive Analysis', 'Business Planning'],
      quizTopics: ['strategy', 'competitive-analysis', 'business-planning'],
      goals: ['Develop strategic thinking', 'Analyze competitive landscapes', 'Create business strategies']
    },
    {
      category: 'Law',
      week: 2,
      focus: 'Business Law',
      resources: ['Corporate Law', 'Employment Law', 'Intellectual Property'],
      quizTopics: ['corporate-law', 'employment-law', 'intellectual-property'],
      goals: ['Understand business legal framework', 'Learn employment regulations', 'Grasp IP protection']
    },
    {
      category: 'Psychology',
      week: 2,
      focus: 'Clinical Psychology',
      resources: ['Psychological Assessment', 'Therapy Techniques', 'Mental Health'],
      quizTopics: ['psychological-assessment', 'therapy', 'mental-health'],
      goals: ['Learn assessment methods', 'Understand therapy approaches', 'Grasp mental health concepts']
    },
    {
      category: 'Mathematics',
      week: 2,
      focus: 'Calculus',
      resources: ['Differential Calculus', 'Integral Calculus', 'Applications'],
      quizTopics: ['calculus', 'derivatives', 'integrals'],
      goals: ['Master calculus concepts', 'Solve complex problems', 'Apply calculus to real-world scenarios']
    },
    {
      category: 'Engineering',
      week: 2,
      focus: 'Advanced Engineering',
      resources: ['Thermodynamics', 'Fluid Mechanics', 'Control Systems'],
      quizTopics: ['thermodynamics', 'fluid-mechanics', 'control-systems'],
      goals: ['Understand advanced engineering principles', 'Apply thermodynamics concepts', 'Design control systems']
    },
    {
      category: 'Arts & Humanities',
      week: 2,
      focus: 'Philosophy',
      resources: ['Ethics', 'Metaphysics', 'Epistemology'],
      quizTopics: ['ethics', 'metaphysics', 'epistemology'],
      goals: ['Understand philosophical traditions', 'Analyze ethical dilemmas', 'Develop critical thinking']
    },
    {
      category: 'Natural Sciences',
      week: 2,
      focus: 'Chemistry',
      resources: ['Organic Chemistry', 'Inorganic Chemistry', 'Chemical Reactions'],
      quizTopics: ['organic-chemistry', 'inorganic-chemistry', 'chemical-reactions'],
      goals: ['Master chemical principles', 'Understand reaction mechanisms', 'Apply chemistry concepts']
    },
    {
      category: 'Social Sciences',
      week: 2,
      focus: 'Economics',
      resources: ['Microeconomics', 'Macroeconomics', 'Economic Policy'],
      quizTopics: ['microeconomics', 'macroeconomics', 'economic-policy'],
      goals: ['Understand economic principles', 'Analyze market behavior', 'Evaluate economic policies']
    },
    {
      category: 'Technology',
      week: 2,
      focus: 'Cybersecurity',
      resources: ['Network Security', 'Cryptography', 'Ethical Hacking'],
      quizTopics: ['network-security', 'cryptography', 'ethical-hacking'],
      goals: ['Understand security principles', 'Learn cryptographic methods', 'Develop security strategies']
    },

    // Advanced Level Study Plans
    {
      category: 'Computer Science',
      week: 5,
      focus: 'Machine Learning',
      resources: ['Supervised Learning', 'Neural Networks', 'Deep Learning'],
      quizTopics: ['machine-learning', 'neural-networks', 'deep-learning'],
      goals: ['Implement ML algorithms', 'Design neural networks', 'Apply deep learning techniques']
    },
    {
      category: 'Computer Science',
      week: 6,
      focus: 'Software Architecture',
      resources: ['System Design', 'Scalability', 'Performance Optimization'],
      quizTopics: ['system-design', 'scalability', 'performance'],
      goals: ['Design scalable systems', 'Optimize performance', 'Architect complex applications']
    },
    {
      category: 'Health & Medicine',
      week: 3,
      focus: 'Specialized Medicine',
      resources: ['Cardiology', 'Neurology', 'Oncology'],
      quizTopics: ['cardiology', 'neurology', 'oncology'],
      goals: ['Understand specialized medical fields', 'Learn advanced diagnostic techniques', 'Develop treatment strategies']
    },
    {
      category: 'Business',
      week: 3,
      focus: 'Entrepreneurship',
      resources: ['Startup Strategy', 'Funding Sources', 'Growth Hacking'],
      quizTopics: ['startup-strategy', 'funding', 'growth-hacking'],
      goals: ['Develop startup strategies', 'Understand funding mechanisms', 'Implement growth strategies']
    },
    {
      category: 'Law',
      week: 3,
      focus: 'International Law',
      resources: ['International Treaties', 'Human Rights Law', 'Trade Law'],
      quizTopics: ['international-law', 'human-rights', 'trade-law'],
      goals: ['Understand international legal frameworks', 'Analyze human rights issues', 'Navigate trade regulations']
    },
    {
      category: 'Psychology',
      week: 3,
      focus: 'Research Methods',
      resources: ['Experimental Design', 'Statistical Analysis', 'Research Ethics'],
      quizTopics: ['research-methods', 'statistical-analysis', 'research-ethics'],
      goals: ['Design research studies', 'Analyze psychological data', 'Conduct ethical research']
    },
    {
      category: 'Mathematics',
      week: 3,
      focus: 'Advanced Mathematics',
      resources: ['Number Theory', 'Abstract Algebra', 'Mathematical Logic'],
      quizTopics: ['number-theory', 'abstract-algebra', 'mathematical-logic'],
      goals: ['Master advanced mathematical concepts', 'Understand abstract structures', 'Develop mathematical reasoning']
    },
    {
      category: 'Engineering',
      week: 3,
      focus: 'Research & Development',
      resources: ['Innovation Management', 'Product Development', 'Patent Law'],
      quizTopics: ['innovation', 'product-development', 'patent-law'],
      goals: ['Manage innovation processes', 'Develop new products', 'Protect intellectual property']
    },
    {
      category: 'Arts & Humanities',
      week: 3,
      focus: 'Cultural Studies',
      resources: ['Cultural Theory', 'Media Studies', 'Identity Politics'],
      quizTopics: ['cultural-theory', 'media-studies', 'identity-politics'],
      goals: ['Analyze cultural phenomena', 'Understand media influence', 'Examine identity construction']
    },
    {
      category: 'Natural Sciences',
      week: 3,
      focus: 'Research Science',
      resources: ['Laboratory Techniques', 'Scientific Writing', 'Research Ethics'],
      quizTopics: ['laboratory-techniques', 'scientific-writing', 'research-ethics'],
      goals: ['Master laboratory skills', 'Write scientific papers', 'Conduct ethical research']
    },
    {
      category: 'Social Sciences',
      week: 3,
      focus: 'Research Methods',
      resources: ['Social Research Design', 'Statistical Analysis', 'Qualitative Methods'],
      quizTopics: ['social-research', 'statistical-analysis', 'qualitative-methods'],
      goals: ['Design social research studies', 'Analyze social data', 'Conduct qualitative research']
    },
    {
      category: 'Technology',
      week: 3,
      focus: 'Emerging Technologies',
      resources: ['Blockchain Development', 'Quantum Computing', 'IoT Systems'],
      quizTopics: ['blockchain', 'quantum-computing', 'iot'],
      goals: ['Develop blockchain applications', 'Understand quantum computing', 'Design IoT systems']
    },
  ];
  for (const studyPlan of studyPlans) {
    await prisma.studyPlan.create({ data: studyPlan });
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

  // Learning Resources - Comprehensive collection for all categories
  await prisma.learningResource.createMany({
    data: [
      // Computer Science - JavaScript
      { title: 'JavaScript Fundamentals - MDN Web Docs', type: 'tutorial', url: 'https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide', difficulty: 'beginner', category: 'Computer Science', topic: 'javascript', description: 'Official Mozilla guide to JavaScript fundamentals', readTime: '45 min', provider: 'Mozilla', rating: 4.9, tags: ['javascript', 'fundamentals', 'mdn'], language: 'English', isFree: true },
      { title: 'JavaScript Closures Explained', type: 'video', url: 'https://www.youtube.com/watch?v=3a0I8ICR1Vg', difficulty: 'intermediate', category: 'Computer Science', topic: 'javascript', description: 'Deep dive into JavaScript closures with practical examples', duration: '15 min', provider: 'freeCodeCamp', rating: 4.8, tags: ['javascript', 'closures', 'advanced'], language: 'English', isFree: true },
      { title: 'Async/Await in JavaScript', type: 'article', url: 'https://javascript.info/async-await', difficulty: 'advanced', category: 'Computer Science', topic: 'async programming', description: 'Complete guide to asynchronous JavaScript programming', readTime: '12 min', provider: 'JavaScript.info', rating: 4.7, tags: ['javascript', 'async', 'promises'], language: 'English', isFree: true },
      { title: 'JavaScript Practice Exercises', type: 'practice', url: 'https://www.freecodecamp.org/learn/javascript-algorithms-and-data-structures/', difficulty: 'beginner', category: 'Computer Science', topic: 'fundamentals', description: 'Interactive exercises for JavaScript basics', duration: '60 min', provider: 'freeCodeCamp', rating: 4.9, tags: ['javascript', 'practice', 'exercises'], language: 'English', isFree: true },
      
      // Computer Science - Python
      { title: 'Python Official Tutorial', type: 'tutorial', url: 'https://docs.python.org/3/tutorial/', difficulty: 'beginner', category: 'Computer Science', topic: 'python', description: 'Official Python tutorial from python.org', readTime: '90 min', provider: 'Python.org', rating: 4.9, tags: ['python', 'official', 'tutorial'], language: 'English', isFree: true },
      { title: 'Object-Oriented Programming in Python', type: 'video', url: 'https://www.youtube.com/watch?v=JeznW_7DlB0', difficulty: 'intermediate', category: 'Computer Science', topic: 'object-oriented programming', description: 'Learn OOP concepts with Python examples', duration: '25 min', provider: 'Tech With Tim', rating: 4.8, tags: ['python', 'oop', 'classes'], language: 'English', isFree: true },
      { title: 'Python Data Structures Guide', type: 'article', url: 'https://realpython.com/python-data-structures/', difficulty: 'beginner', category: 'Computer Science', topic: 'data structures', description: 'Comprehensive guide to Python\'s built-in data structures', readTime: '15 min', provider: 'Real Python', rating: 4.7, tags: ['python', 'data structures', 'lists'], language: 'English', isFree: true },
      { title: 'Python Practice Problems', type: 'practice', url: 'https://www.hackerrank.com/domains/python', difficulty: 'intermediate', category: 'Computer Science', topic: 'python', description: 'Practice Python programming problems', duration: '120 min', provider: 'HackerRank', rating: 4.6, tags: ['python', 'practice', 'problems'], language: 'English', isFree: true },
      
      // Computer Science - Java
      { title: 'Java Tutorial - Oracle', type: 'tutorial', url: 'https://docs.oracle.com/javase/tutorial/', difficulty: 'beginner', category: 'Computer Science', topic: 'java', description: 'Official Java tutorial from Oracle', readTime: '120 min', provider: 'Oracle', rating: 4.8, tags: ['java', 'official', 'tutorial'], language: 'English', isFree: true },
      { title: 'Java Inheritance and Polymorphism', type: 'video', url: 'https://www.youtube.com/watch?v=8a1Bc9Dv0wc', difficulty: 'intermediate', category: 'Computer Science', topic: 'inheritance', description: 'Master inheritance concepts in Java', duration: '20 min', provider: 'Programming with Mosh', rating: 4.7, tags: ['java', 'inheritance', 'oop'], language: 'English', isFree: true },
      { title: 'Java Collections Framework', type: 'article', url: 'https://www.baeldung.com/java-collections', difficulty: 'advanced', category: 'Computer Science', topic: 'collections', description: 'Complete guide to Java Collections API', readTime: '20 min', provider: 'Baeldung', rating: 4.8, tags: ['java', 'collections', 'framework'], language: 'English', isFree: true },
      
      // Computer Science - Algorithms
      { title: 'Introduction to Algorithms - MIT', type: 'video', url: 'https://ocw.mit.edu/courses/6-006-introduction-to-algorithms-spring-2020/', difficulty: 'intermediate', category: 'Computer Science', topic: 'algorithms', description: 'MIT OpenCourseWare introduction to algorithms', duration: '90 min', provider: 'MIT', rating: 4.9, tags: ['algorithms', 'mit', 'computer science'], language: 'English', isFree: true },
      { title: 'Data Structures and Algorithms', type: 'tutorial', url: 'https://www.geeksforgeeks.org/data-structures/', difficulty: 'intermediate', category: 'Computer Science', topic: 'data structures', description: 'Comprehensive guide to data structures and algorithms', readTime: '60 min', provider: 'GeeksforGeeks', rating: 4.7, tags: ['algorithms', 'data structures', 'practice'], language: 'English', isFree: true },
      
      // Health & Medicine
      { title: 'Human Anatomy - Khan Academy', type: 'video', url: 'https://www.khanacademy.org/science/health-and-medicine', difficulty: 'beginner', category: 'Health & Medicine', topic: 'anatomy', description: 'Comprehensive anatomy and physiology course', duration: '45 min', provider: 'Khan Academy', rating: 4.8, tags: ['anatomy', 'physiology', 'health'], language: 'English', isFree: true },
      { title: 'Medical Terminology Guide', type: 'article', url: 'https://www.medicalnewstoday.com/articles/medical-terminology', difficulty: 'beginner', category: 'Health & Medicine', topic: 'medical terminology', description: 'Essential medical terms and their meanings', readTime: '10 min', provider: 'Medical News Today', rating: 4.6, tags: ['medical', 'terminology', 'healthcare'], language: 'English', isFree: true },
      { title: 'Nutrition Science Basics', type: 'tutorial', url: 'https://www.nutrition.gov/topics/basic-nutrition', difficulty: 'beginner', category: 'Health & Medicine', topic: 'nutrition', description: 'Understanding nutrition and its impact on health', readTime: '15 min', provider: 'Nutrition.gov', rating: 4.7, tags: ['nutrition', 'health', 'diet'], language: 'English', isFree: true },
      { title: 'Pharmacology Fundamentals', type: 'video', url: 'https://www.youtube.com/watch?v=6VeX4J9otXA', difficulty: 'intermediate', category: 'Health & Medicine', topic: 'pharmacology', description: 'Introduction to drugs and their effects on the body', duration: '30 min', provider: 'Crash Course', rating: 4.8, tags: ['pharmacology', 'drugs', 'medicine'], language: 'English', isFree: true },
      
      // Business
      { title: 'Business Fundamentals - Coursera', type: 'course', url: 'https://www.coursera.org/learn/business-fundamentals', difficulty: 'beginner', category: 'Business', topic: 'business fundamentals', description: 'Core business concepts and principles', duration: '6 weeks', provider: 'Coursera', rating: 4.7, tags: ['business', 'fundamentals', 'management'], language: 'English', isFree: false, certification: true },
      { title: 'Digital Marketing Strategy', type: 'article', url: 'https://www.hubspot.com/marketing', difficulty: 'intermediate', category: 'Business', topic: 'digital marketing', description: 'Modern marketing strategies and digital platforms', readTime: '12 min', provider: 'HubSpot', rating: 4.8, tags: ['marketing', 'digital', 'strategy'], language: 'English', isFree: true },
      { title: 'Financial Management Basics', type: 'video', url: 'https://www.youtube.com/watch?v=WEDIj9JBTC8', difficulty: 'intermediate', category: 'Business', topic: 'financial management', description: 'Understanding financial statements and business finance', duration: '25 min', provider: 'Investopedia', rating: 4.6, tags: ['finance', 'management', 'business'], language: 'English', isFree: true },
      { title: 'Strategic Management Guide', type: 'tutorial', url: 'https://www.mindtools.com/pages/main/newMN_STR.htm', difficulty: 'intermediate', category: 'Business', topic: 'strategic management', description: 'Strategic thinking and business planning', readTime: '20 min', provider: 'Mind Tools', rating: 4.7, tags: ['strategy', 'management', 'planning'], language: 'English', isFree: true },
      
      // Law
      { title: 'Introduction to Law - Harvard', type: 'course', url: 'https://online-learning.harvard.edu/course/introduction-law', difficulty: 'beginner', category: 'Law', topic: 'legal fundamentals', description: 'Basic legal concepts and principles', duration: '8 weeks', provider: 'Harvard', rating: 4.9, tags: ['law', 'fundamentals', 'legal'], language: 'English', isFree: false, certification: true },
      { title: 'Contract Law Basics', type: 'article', url: 'https://www.law.cornell.edu/wex/contract', difficulty: 'intermediate', category: 'Law', topic: 'contract law', description: 'Understanding contracts and legal agreements', readTime: '15 min', provider: 'Cornell Law', rating: 4.8, tags: ['contracts', 'law', 'legal'], language: 'English', isFree: true },
      { title: 'Constitutional Law Overview', type: 'video', url: 'https://www.youtube.com/watch?v=kW9oJ0qQ1eA', difficulty: 'intermediate', category: 'Law', topic: 'constitutional law', description: 'Overview of constitutional law principles', duration: '20 min', provider: 'Crash Course', rating: 4.7, tags: ['constitutional law', 'government', 'rights'], language: 'English', isFree: true },
      
      // Psychology
      { title: 'Introduction to Psychology - Yale', type: 'course', url: 'https://oyc.yale.edu/psychology/psyc-110', difficulty: 'beginner', category: 'Psychology', topic: 'general psychology', description: 'Fundamental principles of human behavior and mental processes', duration: '12 weeks', provider: 'Yale', rating: 4.9, tags: ['psychology', 'behavior', 'mental processes'], language: 'English', isFree: true },
      { title: 'Cognitive Psychology Basics', type: 'article', url: 'https://www.verywellmind.com/cognitive-psychology-4157181', difficulty: 'intermediate', category: 'Psychology', topic: 'cognitive psychology', description: 'Study of mental processes and information processing', readTime: '10 min', provider: 'Verywell Mind', rating: 4.6, tags: ['cognitive psychology', 'mental processes', 'thinking'], language: 'English', isFree: true },
      { title: 'Social Psychology Concepts', type: 'video', url: 'https://www.youtube.com/watch?v=vo4pMVb0R6M', difficulty: 'intermediate', category: 'Psychology', topic: 'social psychology', description: 'How individuals think, feel, and behave in social contexts', duration: '18 min', provider: 'Crash Course', rating: 4.8, tags: ['social psychology', 'behavior', 'social interaction'], language: 'English', isFree: true },
      
      // Mathematics
      { title: 'Calculus I - MIT OpenCourseWare', type: 'course', url: 'https://ocw.mit.edu/courses/18-01sc-single-variable-calculus-fall-2010/', difficulty: 'intermediate', category: 'Mathematics', topic: 'calculus', description: 'Introduction to differential and integral calculus', duration: '12 weeks', provider: 'MIT', rating: 4.9, tags: ['calculus', 'mathematics', 'derivatives'], language: 'English', isFree: true },
      { title: 'Linear Algebra Fundamentals', type: 'video', url: 'https://www.youtube.com/watch?v=ZK3O402wf1c', difficulty: 'intermediate', category: 'Mathematics', topic: 'linear algebra', description: 'Vector spaces, matrices, and linear transformations', duration: '45 min', provider: '3Blue1Brown', rating: 4.9, tags: ['linear algebra', 'matrices', 'vectors'], language: 'English', isFree: true },
      { title: 'Statistics and Probability', type: 'tutorial', url: 'https://www.khanacademy.org/math/statistics-probability', difficulty: 'beginner', category: 'Mathematics', topic: 'statistics', description: 'Data analysis and statistical inference', duration: '8 weeks', provider: 'Khan Academy', rating: 4.8, tags: ['statistics', 'probability', 'data analysis'], language: 'English', isFree: true },
      { title: 'Algebra Fundamentals', type: 'practice', url: 'https://www.khanacademy.org/math/algebra', difficulty: 'beginner', category: 'Mathematics', topic: 'algebra', description: 'Core algebraic concepts and problem-solving techniques', duration: '10 weeks', provider: 'Khan Academy', rating: 4.7, tags: ['algebra', 'mathematics', 'equations'], language: 'English', isFree: true },
      
      // Engineering
      { title: 'Engineering Mechanics - MIT', type: 'course', url: 'https://ocw.mit.edu/courses/2-003sc-engineering-dynamics-fall-2011/', difficulty: 'intermediate', category: 'Engineering', topic: 'engineering mechanics', description: 'Fundamental principles of mechanical engineering', duration: '12 weeks', provider: 'MIT', rating: 4.8, tags: ['mechanics', 'engineering', 'physics'], language: 'English', isFree: true },
      { title: 'Electrical Circuits Basics', type: 'video', url: 'https://www.youtube.com/watch?v=J4Vq-xHqUo8', difficulty: 'beginner', category: 'Engineering', topic: 'electrical circuits', description: 'Basic electrical engineering concepts and circuit analysis', duration: '30 min', provider: 'The Organic Chemistry Tutor', rating: 4.7, tags: ['electrical', 'circuits', 'engineering'], language: 'English', isFree: true },
      { title: 'Thermodynamics Fundamentals', type: 'article', url: 'https://www.engineeringtoolbox.com/thermodynamics-t_2.html', difficulty: 'intermediate', category: 'Engineering', topic: 'thermodynamics', description: 'Heat, energy, and thermodynamic systems', readTime: '15 min', provider: 'Engineering ToolBox', rating: 4.6, tags: ['thermodynamics', 'heat', 'energy'], language: 'English', isFree: true },
      
      // Arts & Humanities
      { title: 'World History - Crash Course', type: 'video', url: 'https://www.youtube.com/watch?v=Yocja_N5s1I', difficulty: 'beginner', category: 'Arts & Humanities', topic: 'world history', description: 'Comprehensive overview of human history and civilizations', duration: '12 min', provider: 'Crash Course', rating: 4.8, tags: ['history', 'world history', 'civilizations'], language: 'English', isFree: true },
      { title: 'Literature Analysis Guide', type: 'article', url: 'https://owl.purdue.edu/owl/subject_specific_writing/writing_in_literature/index.html', difficulty: 'intermediate', category: 'Arts & Humanities', topic: 'literature', description: 'Critical analysis of literary works and genres', readTime: '20 min', provider: 'Purdue OWL', rating: 4.7, tags: ['literature', 'analysis', 'writing'], language: 'English', isFree: true },
      { title: 'Philosophy Basics', type: 'tutorial', url: 'https://plato.stanford.edu/entries/philosophy/', difficulty: 'intermediate', category: 'Arts & Humanities', topic: 'philosophy', description: 'Major philosophical traditions and critical thinking', readTime: '25 min', provider: 'Stanford Encyclopedia', rating: 4.8, tags: ['philosophy', 'critical thinking', 'ethics'], language: 'English', isFree: true },
      
      // Natural Sciences
      { title: 'Physics Fundamentals - Khan Academy', type: 'course', url: 'https://www.khanacademy.org/science/physics', difficulty: 'beginner', category: 'Natural Sciences', topic: 'physics', description: 'Core principles of physics and natural phenomena', duration: '10 weeks', provider: 'Khan Academy', rating: 4.8, tags: ['physics', 'mechanics', 'energy'], language: 'English', isFree: true },
      { title: 'Chemistry Basics', type: 'video', url: 'https://www.youtube.com/watch?v=7DjsD7Hcd9U', difficulty: 'beginner', category: 'Natural Sciences', topic: 'chemistry', description: 'Fundamental chemical principles and reactions', duration: '40 min', provider: 'Crash Course', rating: 4.7, tags: ['chemistry', 'atoms', 'molecules'], language: 'English', isFree: true },
      { title: 'Biology Essentials', type: 'tutorial', url: 'https://www.khanacademy.org/science/biology', difficulty: 'beginner', category: 'Natural Sciences', topic: 'biology', description: 'Study of living organisms and life processes', duration: '12 weeks', provider: 'Khan Academy', rating: 4.8, tags: ['biology', 'cells', 'organisms'], language: 'English', isFree: true },
      
      // Social Sciences
      { title: 'Sociology Introduction', type: 'course', url: 'https://www.coursera.org/learn/introduction-to-sociology', difficulty: 'beginner', category: 'Social Sciences', topic: 'sociology', description: 'Study of society, social relationships, and social institutions', duration: '8 weeks', provider: 'Coursera', rating: 4.7, tags: ['sociology', 'society', 'social relationships'], language: 'English', isFree: false, certification: true },
      { title: 'Economics Principles', type: 'video', url: 'https://www.youtube.com/watch?v=3ez10ADR_gM', difficulty: 'beginner', category: 'Social Sciences', topic: 'economics', description: 'Principles of economics and economic systems', duration: '12 min', provider: 'Crash Course', rating: 4.8, tags: ['economics', 'principles', 'economic systems'], language: 'English', isFree: true },
      { title: 'Political Science Overview', type: 'article', url: 'https://www.britannica.com/topic/political-science', difficulty: 'intermediate', category: 'Social Sciences', topic: 'political science', description: 'Study of politics, government, and political behavior', readTime: '15 min', provider: 'Britannica', rating: 4.6, tags: ['political science', 'government', 'politics'], language: 'English', isFree: true },
      
      // Technology
      { title: 'Machine Learning Basics - Stanford', type: 'course', url: 'https://www.coursera.org/learn/machine-learning', difficulty: 'advanced', category: 'Technology', topic: 'machine learning', description: 'Introduction to machine learning and AI concepts', duration: '11 weeks', provider: 'Stanford', rating: 4.9, tags: ['machine learning', 'AI', 'algorithms'], language: 'English', isFree: false, certification: true },
      { title: 'Cybersecurity Fundamentals', type: 'tutorial', url: 'https://www.coursera.org/learn/cybersecurity-fundamentals', difficulty: 'intermediate', category: 'Technology', topic: 'cybersecurity', description: 'Introduction to cybersecurity principles and practices', duration: '6 weeks', provider: 'Coursera', rating: 4.7, tags: ['cybersecurity', 'security', 'networking'], language: 'English', isFree: false, certification: true },
      { title: 'Data Science Essentials', type: 'video', url: 'https://www.youtube.com/watch?v=ua-CiDNNj30', difficulty: 'intermediate', category: 'Technology', topic: 'data science', description: 'Introduction to data science and analytics', duration: '25 min', provider: 'DataCamp', rating: 4.8, tags: ['data science', 'analytics', 'statistics'], language: 'English', isFree: true }
    ]
  })

  // Get category IDs for quiz questions
  const computerScienceCategory = await prisma.category.findUnique({ where: { name: 'Computer Science' } });
  const healthCategory = await prisma.category.findUnique({ where: { name: 'Health & Medicine' } });
  const businessCategory = await prisma.category.findUnique({ where: { name: 'Business' } });
  const lawCategory = await prisma.category.findUnique({ where: { name: 'Law' } });
  const psychologyCategory = await prisma.category.findUnique({ where: { name: 'Psychology' } });
  const mathematicsCategory = await prisma.category.findUnique({ where: { name: 'Mathematics' } });
  const engineeringCategory = await prisma.category.findUnique({ where: { name: 'Engineering' } });
  const artsHumanitiesCategory = await prisma.category.findUnique({ where: { name: 'Arts & Humanities' } });
  const naturalSciencesCategory = await prisma.category.findUnique({ where: { name: 'Natural Sciences' } });
  const socialSciencesCategory = await prisma.category.findUnique({ where: { name: 'Social Sciences' } });
  const technologyCategory = await prisma.category.findUnique({ where: { name: 'Technology' } });

  // Quiz Questions - Clean, unique questions with proper topics and answers
  await prisma.quizQuestion.createMany({
    data: [
      // Computer Science - JavaScript
      { question: "What is the output of console.log(typeof NaN)?", options: ["'number'", "'NaN'", "'undefined'", "'object'"], correctAnswer: "'number'", explanation: "In JavaScript, NaN (Not a Number) is actually of type 'number'. This is because NaN represents an invalid number value, but it's still within the number type system.", difficulty: "intermediate", topic: "javascript", relatedConcepts: ["data types", "type coercion", "NaN"], categoryId: computerScienceCategory?.id },
      { question: "Which method adds elements to the end of an array?", options: ["push()", "pop()", "unshift()", "shift()"], correctAnswer: "push()", explanation: "The push() method adds one or more elements to the end of an array and returns the new length. pop() removes from the end, unshift() adds to the beginning, and shift() removes from the beginning.", difficulty: "beginner", topic: "javascript", relatedConcepts: ["arrays", "methods", "data manipulation"], categoryId: computerScienceCategory?.id },
      { question: "What does the '===' operator do in JavaScript?", options: ["Checks for equality", "Checks for equality without type coercion", "Assigns a value", "Checks if a variable is defined"], correctAnswer: "Checks for equality without type coercion", explanation: "The '===' operator performs strict equality comparison without type coercion. It checks both value and type, unlike '==' which performs type coercion.", difficulty: "intermediate", topic: "javascript", relatedConcepts: ["operators", "type coercion", "comparison"], categoryId: computerScienceCategory?.id },
      { question: "What is a closure in JavaScript?", options: ["A function having access to its own scope, the outer function's scope, and the global scope", "A function that returns another function", "A function with no parameters", "A function that is immediately invoked"], correctAnswer: "A function having access to its own scope, the outer function's scope, and the global scope", explanation: "A closure is a function that retains access to its lexical scope even when executed outside its scope.", difficulty: "advanced", topic: "javascript", relatedConcepts: ["closures", "scope", "functions"], categoryId: computerScienceCategory?.id },
      { question: "Which keyword is used to declare a variable in JavaScript?", options: ["var", "let", "const", "All of the above"], correctAnswer: "All of the above", explanation: "In JavaScript, you can declare variables using var, let, or const. Each has different scoping rules.", difficulty: "beginner", topic: "javascript", relatedConcepts: ["variables", "declaration", "scope"], categoryId: computerScienceCategory?.id },
      
      // Computer Science - Python
      { question: "What is the correct way to create a function in Python?", options: ["function myFunc():", "def myFunc():", "create myFunc():", "func myFunc():"], correctAnswer: "def myFunc():", explanation: "In Python, functions are defined using the 'def' keyword followed by the function name and parentheses. The colon (:) indicates the start of the function body, which must be indented.", difficulty: "beginner", topic: "python", relatedConcepts: ["functions", "syntax", "keywords"], categoryId: computerScienceCategory?.id },
      { question: "Which of the following is used to define a block of code in Python?", options: ["Curly braces {}", "Parentheses ()", "Indentation", "Square brackets []"], correctAnswer: "Indentation", explanation: "Python uses indentation (whitespace) to define code blocks, unlike many other languages that use curly braces. This enforces clean, readable code structure.", difficulty: "beginner", topic: "python", relatedConcepts: ["syntax", "code structure", "indentation"], categoryId: computerScienceCategory?.id },
      { question: "What is a lambda function in Python?", options: ["A small anonymous function", "A function with no parameters", "A function that returns another function", "A function that is immediately invoked"], correctAnswer: "A small anonymous function", explanation: "Lambda functions are small, anonymous functions defined with the lambda keyword.", difficulty: "advanced", topic: "python", relatedConcepts: ["lambda", "functions"], categoryId: computerScienceCategory?.id },
      { question: "Which method is used to add an item to a list?", options: ["append()", "add()", "insert()", "push()"], correctAnswer: "append()", explanation: "The append() method adds an item to the end of a list.", difficulty: "beginner", topic: "python", relatedConcepts: ["lists", "methods"], categoryId: computerScienceCategory?.id },
      { question: "What is the output of set([1,2,2,3])?", options: ["{1,2,3}", "[1,2,2,3]", "(1,2,3)", "Error"], correctAnswer: "{1,2,3}", explanation: "A set removes duplicate values, so set([1,2,2,3]) is {1,2,3}.", difficulty: "intermediate", topic: "python", relatedConcepts: ["sets", "collections"], categoryId: computerScienceCategory?.id },
      
      // Computer Science - Java
      { question: "Which keyword is used to define a constant in Java?", options: ["const", "final", "static", "var"], correctAnswer: "final", explanation: "In Java, the 'final' keyword is used to create constants. When applied to variables, it prevents reassignment.", difficulty: "intermediate", topic: "java", relatedConcepts: ["keywords", "constants", "modifiers"], categoryId: computerScienceCategory?.id },
      { question: "What is the purpose of the 'public' keyword in Java?", options: ["Makes a class accessible from anywhere", "Makes a method private", "Creates a new object", "Defines a variable"], correctAnswer: "Makes a class accessible from anywhere", explanation: "The 'public' keyword is an access modifier that makes classes, methods, or variables accessible from any other class.", difficulty: "beginner", topic: "java", relatedConcepts: ["access modifiers", "visibility"], categoryId: computerScienceCategory?.id },
      { question: "What is inheritance in Java?", options: ["A mechanism where one class acquires properties of another class", "A way to create multiple objects", "A method to sort data", "A type of loop"], correctAnswer: "A mechanism where one class acquires properties of another class", explanation: "Inheritance allows a class to inherit properties and methods from another class, promoting code reuse and establishing relationships between classes.", difficulty: "intermediate", topic: "java", relatedConcepts: ["inheritance", "OOP", "classes"], categoryId: computerScienceCategory?.id },
      { question: "What is the difference between == and .equals() in Java?", options: ["== compares references, .equals() compares content", "== compares content, .equals() compares references", "No difference", "== is for numbers, .equals() is for strings"], correctAnswer: "== compares references, .equals() compares content", explanation: "== compares object references (memory addresses), while .equals() compares the actual content of objects.", difficulty: "advanced", topic: "java", relatedConcepts: ["equality", "comparison", "objects"], categoryId: computerScienceCategory?.id },
      { question: "What is an interface in Java?", options: ["A collection of abstract methods", "A type of variable", "A loop structure", "A data type"], correctAnswer: "A collection of abstract methods", explanation: "An interface in Java is a collection of abstract methods that a class must implement. It provides a contract for what methods a class should have.", difficulty: "intermediate", topic: "java", relatedConcepts: ["interfaces", "abstraction", "contracts"], categoryId: computerScienceCategory?.id },
      
      // Computer Science - Algorithms
      { question: "What is the time complexity of binary search?", options: ["O(n)", "O(log n)", "O(n²)", "O(1)"], correctAnswer: "O(log n)", explanation: "Binary search has O(log n) time complexity because it eliminates half of the remaining elements in each step.", difficulty: "intermediate", topic: "algorithms", relatedConcepts: ["time complexity", "searching", "divide and conquer"], categoryId: computerScienceCategory?.id },
      { question: "What is the time complexity of bubble sort?", options: ["O(n)", "O(n log n)", "O(n²)", "O(log n)"], correctAnswer: "O(n²)", explanation: "Bubble sort has O(n²) time complexity because it uses nested loops to compare and swap adjacent elements.", difficulty: "beginner", topic: "algorithms", relatedConcepts: ["sorting", "time complexity", "bubble sort"], categoryId: computerScienceCategory?.id },
      { question: "What is a stack data structure?", options: ["LIFO (Last In, First Out)", "FIFO (First In, First Out)", "Random access", "Tree structure"], correctAnswer: "LIFO (Last In, First Out)", explanation: "A stack is a LIFO data structure where the last element added is the first one to be removed, like a stack of plates.", difficulty: "beginner", topic: "algorithms", relatedConcepts: ["data structures", "stack", "LIFO"], categoryId: computerScienceCategory?.id },
      { question: "What is recursion?", options: ["A function calling itself", "A type of loop", "A data structure", "A sorting algorithm"], correctAnswer: "A function calling itself", explanation: "Recursion is a programming concept where a function calls itself to solve a problem by breaking it down into smaller subproblems.", difficulty: "intermediate", topic: "algorithms", relatedConcepts: ["recursion", "functions", "problem solving"], categoryId: computerScienceCategory?.id },
      { question: "What is the space complexity of merge sort?", options: ["O(1)", "O(n)", "O(n log n)", "O(n²)"], correctAnswer: "O(n)", explanation: "Merge sort has O(n) space complexity because it requires additional space proportional to the input size to store the merged subarrays.", difficulty: "advanced", topic: "algorithms", relatedConcepts: ["space complexity", "merge sort", "memory usage"], categoryId: computerScienceCategory?.id },
      
      // Health & Medicine
      { question: "Which vitamin is primarily produced when skin is exposed to sunlight?", options: ["Vitamin A", "Vitamin C", "Vitamin D", "Vitamin K"], correctAnswer: "Vitamin D", explanation: "Vitamin D is synthesized in the skin when exposed to UVB radiation from sunlight. The skin converts 7-dehydrocholesterol to previtamin D3, which then becomes vitamin D3.", difficulty: "beginner", topic: "nutrition", relatedConcepts: ["vitamins", "metabolism", "sunlight"], categoryId: healthCategory?.id },
      { question: "What is the largest organ in the human body?", options: ["Heart", "Liver", "Skin", "Brain"], correctAnswer: "Skin", explanation: "The skin is the largest organ in the human body, covering approximately 20 square feet in adults. It serves multiple functions including protection, temperature regulation, and sensation.", difficulty: "beginner", topic: "anatomy", relatedConcepts: ["organs", "integumentary system", "body systems"], categoryId: healthCategory?.id },
      { question: "Which neurotransmitter is primarily associated with mood regulation?", options: ["Dopamine", "Serotonin", "Acetylcholine", "GABA"], correctAnswer: "Serotonin", explanation: "Serotonin is often called the 'happiness neurotransmitter' because it plays a crucial role in mood regulation, sleep, appetite, and overall well-being.", difficulty: "intermediate", topic: "mental-health", relatedConcepts: ["neurotransmitters", "brain chemistry", "mood disorders"], categoryId: healthCategory?.id },
      { question: "What is the recommended daily water intake for adults?", options: ["4-6 cups", "6-8 cups", "8-10 cups", "10-12 cups"], correctAnswer: "8-10 cups", explanation: "The general recommendation is about 8-10 cups (64-80 ounces) of water daily for adults, though individual needs vary based on activity level and climate.", difficulty: "beginner", topic: "nutrition", relatedConcepts: ["hydration", "daily requirements", "health maintenance"], categoryId: healthCategory?.id },
      { question: "What is the normal resting heart rate for adults?", options: ["40-60 bpm", "60-100 bpm", "100-140 bpm", "140-180 bpm"], correctAnswer: "60-100 bpm", explanation: "The normal resting heart rate for adults is typically between 60-100 beats per minute. Athletes may have lower resting heart rates due to cardiovascular fitness.", difficulty: "beginner", topic: "physiology", relatedConcepts: ["heart rate", "cardiovascular", "vital signs"], categoryId: healthCategory?.id },
      
      // Business
      { question: "What does ROI stand for in business?", options: ["Return on Investment", "Rate of Interest", "Revenue over Income", "Risk of Investment"], correctAnswer: "Return on Investment", explanation: "ROI (Return on Investment) is a key financial metric that measures the efficiency of an investment. It's calculated as (Gain from Investment - Cost of Investment) / Cost of Investment × 100%.", difficulty: "beginner", topic: "finance", relatedConcepts: ["financial metrics", "investment analysis", "profitability"], categoryId: businessCategory?.id },
      { question: "Which of the following is NOT one of Porter's Five Forces?", options: ["Threat of new entrants", "Bargaining power of suppliers", "Competitive rivalry", "Market segmentation"], correctAnswer: "Market segmentation", explanation: "Porter's Five Forces include: 1) Threat of new entrants, 2) Bargaining power of suppliers, 3) Bargaining power of buyers, 4) Threat of substitute products, and 5) Competitive rivalry.", difficulty: "intermediate", topic: "strategy", relatedConcepts: ["competitive analysis", "strategic planning", "market forces"], categoryId: businessCategory?.id },
      { question: "What is the primary purpose of a SWOT analysis?", options: ["Financial forecasting", "Strategic planning and decision making", "Employee performance evaluation", "Market research"], correctAnswer: "Strategic planning and decision making", explanation: "SWOT analysis (Strengths, Weaknesses, Opportunities, Threats) is a strategic planning tool used to evaluate internal and external factors affecting an organization.", difficulty: "intermediate", topic: "strategy", relatedConcepts: ["strategic planning", "competitive analysis", "decision making"], categoryId: businessCategory?.id },
      { question: "What is a startup's 'runway'?", options: ["The time before a company runs out of money", "A physical runway for airplanes", "A business plan", "A marketing strategy"], correctAnswer: "The time before a company runs out of money", explanation: "A startup's runway is the amount of time the company can continue operating before it runs out of money, typically calculated by dividing current cash by monthly burn rate.", difficulty: "intermediate", topic: "startups", relatedConcepts: ["funding", "cash flow", "financial planning"], categoryId: businessCategory?.id },
      { question: "What is the difference between revenue and profit?", options: ["Revenue is total income, profit is revenue minus expenses", "Revenue is profit minus expenses", "They are the same thing", "Revenue is cash, profit is credit"], correctAnswer: "Revenue is total income, profit is revenue minus expenses", explanation: "Revenue is the total income generated from business activities, while profit is what remains after subtracting all expenses from revenue.", difficulty: "beginner", topic: "finance", relatedConcepts: ["revenue", "profit", "financial statements"], categoryId: businessCategory?.id },
      
      // Law
      { question: "What is the highest court in the United States?", options: ["Federal Court", "District Court", "Supreme Court", "Appeals Court"], correctAnswer: "Supreme Court", explanation: "The Supreme Court of the United States is the highest court in the American judicial system. It has ultimate appellate jurisdiction over all federal and state court cases involving federal law.", difficulty: "beginner", topic: "constitutional-law", relatedConcepts: ["judicial system", "court hierarchy", "constitutional law"], categoryId: lawCategory?.id },
      { question: "What does 'habeas corpus' mean?", options: ["You have the body", "Innocent until proven guilty", "Right to remain silent", "Due process of law"], correctAnswer: "You have the body", explanation: "Habeas corpus is a Latin term meaning 'you have the body.' It's a legal principle that protects against unlawful detention by requiring authorities to bring a prisoner before a court.", difficulty: "intermediate", topic: "constitutional-law", relatedConcepts: ["civil liberties", "detention", "legal principles"], categoryId: lawCategory?.id },
      { question: "In contract law, what makes an agreement legally binding?", options: ["Verbal agreement", "Written document", "Consideration", "Signatures"], correctAnswer: "Consideration", explanation: "Consideration is the exchange of something of value between parties, making a contract legally binding. It can be money, goods, services, or a promise to do or not do something.", difficulty: "intermediate", topic: "contracts", relatedConcepts: ["contract formation", "legal requirements", "enforceability"], categoryId: lawCategory?.id },
      { question: "What is the 'burden of proof' in criminal cases?", options: ["Beyond a reasonable doubt", "Preponderance of evidence", "Clear and convincing evidence", "Probable cause"], correctAnswer: "Beyond a reasonable doubt", explanation: "In criminal cases, the prosecution must prove the defendant's guilt 'beyond a reasonable doubt,' which is the highest standard of proof in the legal system.", difficulty: "intermediate", topic: "criminal-law", relatedConcepts: ["burden of proof", "criminal procedure", "legal standards"], categoryId: lawCategory?.id },
      { question: "What is intellectual property law?", options: ["Laws protecting creative and innovative works", "Laws about real estate", "Laws about employment", "Laws about contracts"], correctAnswer: "Laws protecting creative and innovative works", explanation: "Intellectual property law protects creations of the mind, including patents, copyrights, trademarks, and trade secrets.", difficulty: "beginner", topic: "intellectual-property", relatedConcepts: ["patents", "copyrights", "trademarks"], categoryId: lawCategory?.id },
      
      // Psychology
      { question: "Who is considered the father of psychoanalysis?", options: ["Carl Jung", "Sigmund Freud", "B.F. Skinner", "Ivan Pavlov"], correctAnswer: "Sigmund Freud", explanation: "Sigmund Freud (1856-1939) is considered the father of psychoanalysis. He developed theories about the unconscious mind, dream interpretation, and psychosexual development.", difficulty: "beginner", topic: "general-psychology", relatedConcepts: ["psychoanalysis", "unconscious mind", "psychological theories"], categoryId: psychologyCategory?.id },
      { question: "What is classical conditioning?", options: ["Learning through rewards and punishments", "Learning through association", "Learning through observation", "Learning through trial and error"], correctAnswer: "Learning through association", explanation: "Classical conditioning is a learning process where a neutral stimulus becomes associated with a meaningful stimulus, eventually triggering a similar response.", difficulty: "intermediate", topic: "learning", relatedConcepts: ["behaviorism", "conditioning", "learning theories"], categoryId: psychologyCategory?.id },
      { question: "What is cognitive dissonance?", options: ["Mental discomfort from conflicting beliefs", "A type of memory loss", "A learning disorder", "A personality trait"], correctAnswer: "Mental discomfort from conflicting beliefs", explanation: "Cognitive dissonance is the mental discomfort experienced when holding conflicting beliefs, attitudes, or behaviors, leading to attempts to reduce the inconsistency.", difficulty: "intermediate", topic: "social-psychology", relatedConcepts: ["cognitive psychology", "attitudes", "behavior"], categoryId: psychologyCategory?.id },
      { question: "What is the difference between nature and nurture?", options: ["Nature refers to genetics, nurture refers to environment", "Nature refers to environment, nurture refers to genetics", "They are the same thing", "Nature refers to personality, nurture refers to behavior"], correctAnswer: "Nature refers to genetics, nurture refers to environment", explanation: "The nature vs. nurture debate examines the relative contributions of genetic inheritance (nature) versus environmental factors (nurture) to human development.", difficulty: "beginner", topic: "developmental-psychology", relatedConcepts: ["genetics", "environment", "development"], categoryId: psychologyCategory?.id },
      { question: "What is the bystander effect?", options: ["People are less likely to help when others are present", "People are more likely to help when others are present", "People ignore emergencies", "People panic in crowds"], correctAnswer: "People are less likely to help when others are present", explanation: "The bystander effect is a social psychological phenomenon where individuals are less likely to offer help to a victim when other people are present.", difficulty: "intermediate", topic: "social-psychology", relatedConcepts: ["social influence", "helping behavior", "group dynamics"], categoryId: psychologyCategory?.id },
      
      // Mathematics
      { question: "What is the derivative of x²?", options: ["x", "2x", "x²/2", "2"], correctAnswer: "2x", explanation: "Using the power rule for derivatives, d/dx(xⁿ) = n·xⁿ⁻¹. For x², n=2, so the derivative is 2·x²⁻¹ = 2x¹ = 2x.", difficulty: "intermediate", topic: "calculus", relatedConcepts: ["derivatives", "power rule", "rate of change"], categoryId: mathematicsCategory?.id },
      { question: "What is the probability of getting heads on a fair coin flip?", options: ["0.25", "0.5", "0.75", "1.0"], correctAnswer: "0.5", explanation: "A fair coin has two equally likely outcomes: heads or tails. The probability of any single outcome is 1 divided by the total number of possible outcomes.", difficulty: "beginner", topic: "probability", relatedConcepts: ["probability", "fair outcomes", "basic statistics"], categoryId: mathematicsCategory?.id },
      { question: "What is the Pythagorean theorem?", options: ["a² + b² = c²", "a + b = c", "a² - b² = c²", "a × b = c"], correctAnswer: "a² + b² = c²", explanation: "The Pythagorean theorem states that in a right triangle, the square of the hypotenuse (c) equals the sum of the squares of the other two sides (a and b).", difficulty: "beginner", topic: "geometry", relatedConcepts: ["right triangles", "hypotenuse", "mathematical formulas"], categoryId: mathematicsCategory?.id },
      { question: "What is the value of π (pi) to two decimal places?", options: ["3.12", "3.14", "3.16", "3.18"], correctAnswer: "3.14", explanation: "π (pi) is approximately 3.14159..., so to two decimal places it is 3.14.", difficulty: "beginner", topic: "geometry", relatedConcepts: ["pi", "circles", "mathematical constants"], categoryId: mathematicsCategory?.id },
      { question: "What is the slope-intercept form of a linear equation?", options: ["y = mx + b", "y = x + b", "y = mx", "y = b"], correctAnswer: "y = mx + b", explanation: "The slope-intercept form of a linear equation is y = mx + b, where m is the slope and b is the y-intercept.", difficulty: "intermediate", topic: "algebra", relatedConcepts: ["linear equations", "slope", "y-intercept"], categoryId: mathematicsCategory?.id },
      
      // Engineering
      { question: "What is the first law of thermodynamics?", options: ["Energy cannot be created or destroyed", "Entropy always increases", "Heat flows from hot to cold", "Pressure and volume are inversely related"], correctAnswer: "Energy cannot be created or destroyed", explanation: "The first law of thermodynamics states that energy cannot be created or destroyed, only transferred or converted from one form to another.", difficulty: "intermediate", topic: "thermodynamics", relatedConcepts: ["energy conservation", "physics", "engineering principles"], categoryId: engineeringCategory?.id },
      { question: "What is Ohm's Law?", options: ["V = IR", "P = VI", "F = ma", "E = mc²"], correctAnswer: "V = IR", explanation: "Ohm's Law states that voltage (V) equals current (I) multiplied by resistance (R). It's a fundamental principle in electrical engineering.", difficulty: "beginner", topic: "electrical-engineering", relatedConcepts: ["voltage", "current", "resistance"], categoryId: engineeringCategory?.id },
      { question: "What is the purpose of a capacitor in an electrical circuit?", options: ["Store electrical energy", "Convert AC to DC", "Amplify signals", "Generate power"], correctAnswer: "Store electrical energy", explanation: "A capacitor stores electrical energy in an electric field. It can store and release charge, making it useful for filtering, timing, and energy storage applications.", difficulty: "intermediate", topic: "electrical-engineering", relatedConcepts: ["capacitors", "energy storage", "electrical components"], categoryId: engineeringCategory?.id },
      { question: "What is stress in materials engineering?", options: ["Force per unit area", "Deformation of a material", "Breaking point", "Elastic limit"], correctAnswer: "Force per unit area", explanation: "Stress is defined as force per unit area. It's a measure of the internal forces that particles of a material exert on each other.", difficulty: "intermediate", topic: "materials-engineering", relatedConcepts: ["stress", "mechanics", "material properties"], categoryId: engineeringCategory?.id },
      { question: "What is the difference between a beam and a column?", options: ["Beams carry lateral loads, columns carry axial loads", "Beams are horizontal, columns are vertical", "Beams are stronger than columns", "Columns are longer than beams"], correctAnswer: "Beams carry lateral loads, columns carry axial loads", explanation: "Beams primarily carry lateral loads (bending), while columns primarily carry axial loads (compression or tension).", difficulty: "intermediate", topic: "structural-engineering", relatedConcepts: ["structural elements", "loads", "building design"], categoryId: engineeringCategory?.id },
      
      // Arts & Humanities
      { question: "Who wrote 'Romeo and Juliet'?", options: ["William Shakespeare", "Charles Dickens", "Jane Austen", "Mark Twain"], correctAnswer: "William Shakespeare", explanation: "William Shakespeare wrote 'Romeo and Juliet' in the late 16th century. It's one of his most famous tragedies.", difficulty: "beginner", topic: "literature", relatedConcepts: ["Shakespeare", "tragedy", "Renaissance literature"], categoryId: artsHumanitiesCategory?.id },
      { question: "What is the Renaissance?", options: ["A period of cultural rebirth in Europe", "A type of painting", "A musical style", "A political movement"], correctAnswer: "A period of cultural rebirth in Europe", explanation: "The Renaissance was a period of cultural rebirth in Europe from the 14th to 17th centuries, marked by renewed interest in classical learning and art.", difficulty: "beginner", topic: "history", relatedConcepts: ["European history", "cultural movements", "art history"], categoryId: artsHumanitiesCategory?.id },
      { question: "What is the primary purpose of art?", options: ["To express ideas and emotions", "To make money", "To decorate spaces", "To follow rules"], correctAnswer: "To express ideas and emotions", explanation: "Art serves many purposes, but its primary function is to express ideas, emotions, and human experience through creative means.", difficulty: "beginner", topic: "art", relatedConcepts: ["artistic expression", "creativity", "human experience"], categoryId: artsHumanitiesCategory?.id },
      { question: "What is philosophy?", options: ["The study of fundamental questions about existence", "The study of ancient texts", "The study of religion", "The study of politics"], correctAnswer: "The study of fundamental questions about existence", explanation: "Philosophy is the study of fundamental questions about existence, knowledge, values, reason, mind, and language.", difficulty: "beginner", topic: "philosophy", relatedConcepts: ["metaphysics", "epistemology", "ethics"], categoryId: artsHumanitiesCategory?.id },
      { question: "What is the difference between a novel and a novella?", options: ["Length - novels are longer", "Genre - novels are fiction", "Style - novels are more complex", "Language - novels use more words"], correctAnswer: "Length - novels are longer", explanation: "The main difference is length: novellas are shorter than novels but longer than short stories, typically 20,000-50,000 words.", difficulty: "intermediate", topic: "literature", relatedConcepts: ["literary forms", "prose", "writing"], categoryId: artsHumanitiesCategory?.id },
      
      // Natural Sciences
      { question: "What is the chemical symbol for gold?", options: ["Au", "Ag", "Fe", "Cu"], correctAnswer: "Au", explanation: "The chemical symbol for gold is Au, derived from the Latin word 'aurum' meaning gold.", difficulty: "beginner", topic: "chemistry", relatedConcepts: ["chemical symbols", "elements", "periodic table"], categoryId: naturalSciencesCategory?.id },
      { question: "What is the largest planet in our solar system?", options: ["Earth", "Mars", "Jupiter", "Saturn"], correctAnswer: "Jupiter", explanation: "Jupiter is the largest planet in our solar system, with a mass more than twice that of Saturn and over 300 times that of Earth.", difficulty: "beginner", topic: "astronomy", relatedConcepts: ["solar system", "planets", "space"], categoryId: naturalSciencesCategory?.id },
      { question: "What is the process by which plants make their own food?", options: ["Photosynthesis", "Respiration", "Digestion", "Fermentation"], correctAnswer: "Photosynthesis", explanation: "Photosynthesis is the process by which plants convert sunlight, carbon dioxide, and water into glucose and oxygen.", difficulty: "beginner", topic: "biology", relatedConcepts: ["plant biology", "energy conversion", "cellular processes"], categoryId: naturalSciencesCategory?.id },
      { question: "What is the atomic number of carbon?", options: ["4", "6", "8", "12"], correctAnswer: "6", explanation: "Carbon has an atomic number of 6, meaning it has 6 protons in its nucleus. It's the basis for all organic compounds.", difficulty: "beginner", topic: "chemistry", relatedConcepts: ["atomic structure", "elements", "organic chemistry"], categoryId: naturalSciencesCategory?.id },
      { question: "What is the speed of light in a vacuum?", options: ["299,792,458 m/s", "199,792,458 m/s", "399,792,458 m/s", "499,792,458 m/s"], correctAnswer: "299,792,458 m/s", explanation: "The speed of light in a vacuum is approximately 299,792,458 meters per second (about 186,282 miles per second).", difficulty: "intermediate", topic: "physics", relatedConcepts: ["light", "relativity", "universal constants"], categoryId: naturalSciencesCategory?.id },
      
      // Social Sciences
      { question: "What is sociology?", options: ["The study of society and social behavior", "The study of the mind", "The study of economics", "The study of politics"], correctAnswer: "The study of society and social behavior", explanation: "Sociology is the scientific study of society, social relationships, social interaction, and culture.", difficulty: "beginner", topic: "sociology", relatedConcepts: ["social behavior", "society", "social institutions"], categoryId: socialSciencesCategory?.id },
      { question: "What is supply and demand?", options: ["An economic model of price determination", "A political theory", "A social concept", "A psychological principle"], correctAnswer: "An economic model of price determination", explanation: "Supply and demand is an economic model that explains how prices are determined in a market economy through the interaction of supply and demand.", difficulty: "beginner", topic: "economics", relatedConcepts: ["market economics", "price theory", "microeconomics"], categoryId: socialSciencesCategory?.id },
      { question: "What is democracy?", options: ["Government by the people", "Government by the wealthy", "Government by one person", "Government by the military"], correctAnswer: "Government by the people", explanation: "Democracy is a form of government in which power is vested in the people, who rule either directly or through elected representatives.", difficulty: "beginner", topic: "political-science", relatedConcepts: ["government", "political systems", "citizenship"], categoryId: socialSciencesCategory?.id },
      { question: "What is cultural relativism?", options: ["Understanding cultures on their own terms", "Judging other cultures", "Rejecting all cultures", "Promoting one culture"], correctAnswer: "Understanding cultures on their own terms", explanation: "Cultural relativism is the principle that a person's beliefs and activities should be understood in terms of their own culture.", difficulty: "intermediate", topic: "anthropology", relatedConcepts: ["culture", "ethnocentrism", "cross-cultural understanding"], categoryId: socialSciencesCategory?.id },
      { question: "What is the difference between microeconomics and macroeconomics?", options: ["Micro studies individuals/firms, macro studies entire economies", "Micro studies large economies, macro studies small ones", "Micro studies supply, macro studies demand", "Micro studies domestic, macro studies international"], correctAnswer: "Micro studies individuals/firms, macro studies entire economies", explanation: "Microeconomics focuses on individual economic units (households, firms), while macroeconomics studies the economy as a whole.", difficulty: "intermediate", topic: "economics", relatedConcepts: ["economic theory", "market analysis", "economic policy"], categoryId: socialSciencesCategory?.id },
      
      // Technology
      { question: "What is artificial intelligence (AI)?", options: ["Computer systems that can perform tasks requiring human intelligence", "A type of computer hardware", "A programming language", "A database system"], correctAnswer: "Computer systems that can perform tasks requiring human intelligence", explanation: "Artificial intelligence refers to computer systems that can perform tasks that typically require human intelligence, such as learning, reasoning, and problem-solving.", difficulty: "beginner", topic: "ai", relatedConcepts: ["machine learning", "automation", "computer science"], categoryId: technologyCategory?.id },
      { question: "What is cybersecurity?", options: ["Protection of computer systems from theft or damage", "A type of software", "A programming language", "A hardware component"], correctAnswer: "Protection of computer systems from theft or damage", explanation: "Cybersecurity is the practice of protecting computer systems, networks, and data from digital attacks, theft, and damage.", difficulty: "beginner", topic: "cybersecurity", relatedConcepts: ["information security", "network security", "digital protection"], categoryId: technologyCategory?.id },
      { question: "What is machine learning?", options: ["A subset of AI that enables computers to learn without explicit programming", "A type of computer hardware", "A programming language", "A database system"], correctAnswer: "A subset of AI that enables computers to learn without explicit programming", explanation: "Machine learning is a subset of artificial intelligence that enables computers to learn and improve from experience without being explicitly programmed.", difficulty: "intermediate", topic: "machine-learning", relatedConcepts: ["algorithms", "data analysis", "pattern recognition"], categoryId: technologyCategory?.id },
      { question: "What is blockchain technology?", options: ["A decentralized digital ledger", "A type of cryptocurrency", "A social media platform", "A cloud storage service"], correctAnswer: "A decentralized digital ledger", explanation: "Blockchain is a decentralized digital ledger that records transactions across multiple computers in a way that makes them secure and tamper-resistant.", difficulty: "intermediate", topic: "blockchain", relatedConcepts: ["distributed systems", "cryptography", "digital transactions"], categoryId: technologyCategory?.id },
      { question: "What is cloud computing?", options: ["Delivery of computing services over the internet", "A type of computer hardware", "A programming language", "A database system"], correctAnswer: "Delivery of computing services over the internet", explanation: "Cloud computing is the delivery of computing services—including servers, storage, databases, networking, software, and analytics—over the internet.", difficulty: "beginner", topic: "cloud-computing", relatedConcepts: ["distributed computing", "web services", "virtualization"], categoryId: technologyCategory?.id },
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

  // --- BEGIN: Comprehensive Learning Path Seeding ---
  const learningPathsData = [
    // Computer Science
    {
      title: "Web Development Fundamentals",
      description: "Master the basics of web development with HTML, CSS, and JavaScript",
      category: "Computer Science",
      difficulty: "beginner",
      duration: "12 weeks",
      modules: 12,
      color: "bg-blue-100 text-blue-700",
      icon: "💻",
      skills: ["HTML", "CSS", "JavaScript"],
      milestones: [
        { title: "HTML Fundamentals", description: "Learn HTML structure, elements, and semantic markup", requiredScore: 80, quizTopics: ["html", "markup"], resources: ["html-mdn-guide"] },
        { title: "CSS Styling", description: "Master CSS selectors, properties, and layout techniques", requiredScore: 75, quizTopics: ["css", "styling"], resources: ["css-complete-guide"] },
        { title: "JavaScript Programming", description: "Learn JavaScript fundamentals and DOM manipulation", requiredScore: 70, quizTopics: ["javascript", "programming"], resources: ["cs-javascript-mdn"] },
      ],
    },
    // Health & Medicine
    {
      title: "Health & Wellness Foundation",
      description: "Build comprehensive understanding of health, nutrition, and wellness",
      category: "Health & Medicine",
      difficulty: "beginner",
      duration: "10 weeks",
      modules: 10,
      color: "bg-green-100 text-green-700",
      icon: "🏥",
      skills: ["Nutrition", "Exercise"],
      milestones: [
        { title: "Nutrition Fundamentals", description: "Understand macronutrients, micronutrients, and healthy eating", requiredScore: 80, quizTopics: ["nutrition", "diet"], resources: ["health-nutrition-harvard"] },
        { title: "Exercise & Fitness", description: "Learn about exercise physiology and fitness principles", requiredScore: 75, quizTopics: ["exercise", "fitness"], resources: ["exercise-science-course"] },
      ],
    },
    // Business
    {
      title: "Business Strategy Mastery",
      description: "Develop strategic thinking and business analysis skills",
      category: "Business",
      difficulty: "intermediate",
      duration: "16 weeks",
      modules: 16,
      color: "bg-purple-100 text-purple-700",
      icon: "💼",
      skills: ["Strategy", "Market Analysis"],
      milestones: [
        { title: "Strategy Fundamentals", description: "Understand competitive advantage and strategic positioning", requiredScore: 75, quizTopics: ["strategy", "competition"], resources: ["business-strategy-wharton"] },
        { title: "Market Analysis", description: "Learn to analyze markets and competitive landscapes", requiredScore: 80, quizTopics: ["market-analysis", "competition"], resources: ["market-research-course"] },
      ],
    },
    // Law
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
    // Psychology
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
    // Mathematics
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
    // Engineering
    {
      title: "Engineering Foundations Path",
      description: "Explore the fundamentals of engineering disciplines.",
      category: "Engineering",
      difficulty: "beginner",
      duration: "4 weeks",
      modules: 4,
      color: "bg-gray-100 text-gray-700",
      icon: "🛠️",
      skills: ["Engineering", "Problem Solving"],
      milestones: [
        { title: "Engineering Basics", description: "Understand core engineering concepts.", requiredScore: 60, quizTopics: ["engineering"], resources: ["engineering-intro-course"] },
        { title: "Mechanical Engineering", description: "Learn about mechanical systems.", requiredScore: 60, quizTopics: ["engineering"], resources: ["mechanical-engineering-course"] },
        { title: "Electrical Engineering", description: "Explore electrical engineering.", requiredScore: 60, quizTopics: ["engineering"], resources: ["electrical-engineering-course"] },
        { title: "Review", description: "Review all topics.", requiredScore: 60, quizTopics: ["engineering"], resources: ["engineering-intro-course"] },
      ],
    },
    // Arts & Humanities
    {
      title: "Arts & Humanities Explorer Path",
      description: "Discover history, literature, and philosophy.",
      category: "Arts & Humanities",
      difficulty: "beginner",
      duration: "4 weeks",
      modules: 4,
      color: "bg-pink-100 text-pink-700",
      icon: "🎨",
      skills: ["Arts", "Humanities"],
      milestones: [
        { title: "History Basics", description: "Explore key historical events.", requiredScore: 60, quizTopics: ["history"], resources: ["history-khan-academy"] },
        { title: "Literature", description: "Study classic literature.", requiredScore: 60, quizTopics: ["literature"], resources: ["literature-openstax"] },
        { title: "Philosophy", description: "Learn about major philosophical ideas.", requiredScore: 60, quizTopics: ["philosophy"], resources: ["philosophy-coursera"] },
        { title: "Review", description: "Review all topics.", requiredScore: 60, quizTopics: ["arts-humanities"], resources: ["arts-humanities-overview"] },
      ],
    },
    // Natural Sciences
    {
      title: "Natural Sciences Discovery Path",
      description: "Understand the basics of physics, chemistry, and biology.",
      category: "Natural Sciences",
      difficulty: "beginner",
      duration: "4 weeks",
      modules: 4,
      color: "bg-green-100 text-green-700",
      icon: "🔬",
      skills: ["Physics", "Chemistry", "Biology"],
      milestones: [
        { title: "Physics Fundamentals", description: "Learn the basics of physics.", requiredScore: 60, quizTopics: ["physics"], resources: ["physics-khan-academy"] },
        { title: "Chemistry Essentials", description: "Understand core chemistry concepts.", requiredScore: 60, quizTopics: ["chemistry"], resources: ["chemistry-openstax"] },
        { title: "Biology Overview", description: "Explore biology fundamentals.", requiredScore: 60, quizTopics: ["biology"], resources: ["biology-khan-academy"] },
        { title: "Review", description: "Review all topics.", requiredScore: 60, quizTopics: ["natural-sciences"], resources: ["natural-sciences-overview"] },
      ],
    },
    // Social Sciences
    {
      title: "Social Sciences Insights Path",
      description: "Dive into sociology, economics, and politics.",
      category: "Social Sciences",
      difficulty: "beginner",
      duration: "4 weeks",
      modules: 4,
      color: "bg-blue-100 text-blue-700",
      icon: "🌍",
      skills: ["Sociology", "Economics", "Politics"],
      milestones: [
        { title: "Sociology Basics", description: "Understand sociology fundamentals.", requiredScore: 60, quizTopics: ["sociology"], resources: ["sociology-openstax"] },
        { title: "Economics Essentials", description: "Learn about economics.", requiredScore: 60, quizTopics: ["economics"], resources: ["economics-khan-academy"] },
        { title: "Political Science", description: "Explore political science.", requiredScore: 60, quizTopics: ["politics"], resources: ["political-science-coursera"] },
        { title: "Review", description: "Review all topics.", requiredScore: 60, quizTopics: ["social-sciences"], resources: ["social-sciences-overview"] },
      ],
    },
    // Technology
    {
      title: "Technology & Innovation Path",
      description: "Explore AI, cybersecurity, and data science.",
      category: "Technology",
      difficulty: "beginner",
      duration: "4 weeks",
      modules: 4,
      color: "bg-indigo-100 text-indigo-700",
      icon: "🤖",
      skills: ["AI", "Cybersecurity", "Data Science"],
      milestones: [
        { title: "AI Fundamentals", description: "Learn the basics of artificial intelligence.", requiredScore: 60, quizTopics: ["ai"], resources: ["ai-coursera"] },
        { title: "Cybersecurity Essentials", description: "Understand cybersecurity principles.", requiredScore: 60, quizTopics: ["cybersecurity"], resources: ["cybersecurity-edx"] },
        { title: "Data Science Overview", description: "Explore data science basics.", requiredScore: 60, quizTopics: ["data-science"], resources: ["data-science-udacity"] },
        { title: "Review", description: "Review all topics.", requiredScore: 60, quizTopics: ["technology"], resources: ["technology-overview"] },
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

  // --- BEGIN: Add missing comprehensive learning paths for all 11 categories ---
  learningPathsData.push(
    // Engineering
    {
      title: "Engineering Foundations Path",
      description: "Explore the fundamentals of engineering disciplines.",
      category: "Engineering",
      difficulty: "beginner",
      duration: "4 weeks",
      modules: 4,
      color: "bg-gray-100 text-gray-700",
      icon: "🛠️",
      skills: ["Engineering", "Problem Solving"],
      milestones: [
        { title: "Engineering Basics", description: "Understand core engineering concepts.", requiredScore: 60, quizTopics: ["engineering"], resources: ["engineering-intro-course"] },
        { title: "Mechanical Engineering", description: "Learn about mechanical systems.", requiredScore: 60, quizTopics: ["engineering"], resources: ["mechanical-engineering-course"] },
        { title: "Electrical Engineering", description: "Explore electrical engineering.", requiredScore: 60, quizTopics: ["engineering"], resources: ["electrical-engineering-course"] },
        { title: "Review", description: "Review all topics.", requiredScore: 60, quizTopics: ["engineering"], resources: ["engineering-intro-course"] },
      ],
    },
    // Arts & Humanities
    {
      title: "Arts & Humanities Explorer Path",
      description: "Discover history, literature, and philosophy.",
      category: "Arts & Humanities",
      difficulty: "beginner",
      duration: "4 weeks",
      modules: 4,
      color: "bg-pink-100 text-pink-700",
      icon: "🎨",
      skills: ["Arts", "Humanities"],
      milestones: [
        { title: "History Basics", description: "Explore key historical events.", requiredScore: 60, quizTopics: ["history"], resources: ["history-khan-academy"] },
        { title: "Literature", description: "Study classic literature.", requiredScore: 60, quizTopics: ["literature"], resources: ["literature-openstax"] },
        { title: "Philosophy", description: "Learn about major philosophical ideas.", requiredScore: 60, quizTopics: ["philosophy"], resources: ["philosophy-coursera"] },
        { title: "Review", description: "Review all topics.", requiredScore: 60, quizTopics: ["arts-humanities"], resources: ["arts-humanities-overview"] },
      ],
    },
    // Natural Sciences
    {
      title: "Natural Sciences Discovery Path",
      description: "Understand the basics of physics, chemistry, and biology.",
      category: "Natural Sciences",
      difficulty: "beginner",
      duration: "4 weeks",
      modules: 4,
      color: "bg-green-100 text-green-700",
      icon: "🔬",
      skills: ["Physics", "Chemistry", "Biology"],
      milestones: [
        { title: "Physics Fundamentals", description: "Learn the basics of physics.", requiredScore: 60, quizTopics: ["physics"], resources: ["physics-khan-academy"] },
        { title: "Chemistry Essentials", description: "Understand core chemistry concepts.", requiredScore: 60, quizTopics: ["chemistry"], resources: ["chemistry-openstax"] },
        { title: "Biology Overview", description: "Explore biology fundamentals.", requiredScore: 60, quizTopics: ["biology"], resources: ["biology-khan-academy"] },
        { title: "Review", description: "Review all topics.", requiredScore: 60, quizTopics: ["natural-sciences"], resources: ["natural-sciences-overview"] },
      ],
    },
    // Social Sciences
    {
      title: "Social Sciences Insights Path",
      description: "Dive into sociology, economics, and politics.",
      category: "Social Sciences",
      difficulty: "beginner",
      duration: "4 weeks",
      modules: 4,
      color: "bg-blue-100 text-blue-700",
      icon: "🌍",
      skills: ["Sociology", "Economics", "Politics"],
      milestones: [
        { title: "Sociology Basics", description: "Understand sociology fundamentals.", requiredScore: 60, quizTopics: ["sociology"], resources: ["sociology-openstax"] },
        { title: "Economics Essentials", description: "Learn about economics.", requiredScore: 60, quizTopics: ["economics"], resources: ["economics-khan-academy"] },
        { title: "Political Science", description: "Explore political science.", requiredScore: 60, quizTopics: ["politics"], resources: ["political-science-coursera"] },
        { title: "Review", description: "Review all topics.", requiredScore: 60, quizTopics: ["social-sciences"], resources: ["social-sciences-overview"] },
      ],
    },
    // Technology
    {
      title: "Technology & Innovation Path",
      description: "Explore AI, cybersecurity, and data science.",
      category: "Technology",
      difficulty: "beginner",
      duration: "4 weeks",
      modules: 4,
      color: "bg-indigo-100 text-indigo-700",
      icon: "🤖",
      skills: ["AI", "Cybersecurity", "Data Science"],
      milestones: [
        { title: "AI Fundamentals", description: "Learn the basics of artificial intelligence.", requiredScore: 60, quizTopics: ["ai"], resources: ["ai-coursera"] },
        { title: "Cybersecurity Essentials", description: "Understand cybersecurity principles.", requiredScore: 60, quizTopics: ["cybersecurity"], resources: ["cybersecurity-edx"] },
        { title: "Data Science Overview", description: "Explore data science basics.", requiredScore: 60, quizTopics: ["data-science"], resources: ["data-science-udacity"] },
        { title: "Review", description: "Review all topics.", requiredScore: 60, quizTopics: ["technology"], resources: ["technology-overview"] },
      ],
    },
  );
  // --- END: Add missing comprehensive learning paths ---
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