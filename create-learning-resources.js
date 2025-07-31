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

// Learning resource templates
const resourceTemplates = {
  'JavaScript Fundamentals': [
    {
      title: 'JavaScript Basics for Beginners',
      type: 'video',
      url: 'https://www.youtube.com/watch?v=W6NZfCO5SIk',
      difficulty: 'beginner',
      topic: 'JavaScript Fundamentals',
      description: 'Learn JavaScript basics including variables, functions, and DOM manipulation.',
      duration: '3 hours',
      readTime: null,
      provider: 'freeCodeCamp',
      rating: 4.8,
      tags: ['javascript', 'basics', 'beginner', 'web development'],
      language: 'English',
      isFree: true,
      certification: false
    },
    {
      title: 'Modern JavaScript ES6+ Tutorial',
      type: 'video',
      url: 'https://www.youtube.com/watch?v=NCwa_xi0Uuc',
      difficulty: 'intermediate',
      topic: 'ES6+ Features',
      description: 'Learn modern JavaScript features including arrow functions, destructuring, and modules.',
      duration: '2.5 hours',
      readTime: null,
      provider: 'Traversy Media',
      rating: 4.7,
      tags: ['javascript', 'es6', 'modern', 'intermediate'],
      language: 'English',
      isFree: true,
      certification: false
    },
    {
      title: 'JavaScript: The Complete Guide',
      type: 'course',
      url: 'https://www.udemy.com/course/javascript-the-complete-guide-2020-beginner-advanced/',
      difficulty: 'advanced',
      topic: 'Complete JavaScript',
      description: 'Comprehensive JavaScript course covering from basics to advanced concepts.',
      duration: '52 hours',
      readTime: null,
      provider: 'Udemy',
      rating: 4.6,
      tags: ['javascript', 'complete', 'advanced', 'comprehensive'],
      language: 'English',
      isFree: false,
      certification: true
    },
    {
      title: 'JavaScript Best Practices',
      type: 'article',
      url: 'https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide',
      difficulty: 'intermediate',
      topic: 'Best Practices',
      description: 'Official JavaScript guide with best practices and coding standards.',
      duration: null,
      readTime: '45 minutes',
      provider: 'MDN Web Docs',
      rating: 4.9,
      tags: ['javascript', 'best practices', 'guide', 'mdn'],
      language: 'English',
      isFree: true,
      certification: false
    }
  ],
  'Python Programming': [
    {
      title: 'Python for Beginners',
      type: 'video',
      url: 'https://www.youtube.com/watch?v=_uQrJ0TkZlc',
      difficulty: 'beginner',
      topic: 'Python Basics',
      description: 'Complete Python tutorial for beginners with hands-on projects.',
      duration: '6 hours',
      readTime: null,
      provider: 'Programming with Mosh',
      rating: 4.8,
      tags: ['python', 'beginner', 'tutorial', 'programming'],
      language: 'English',
      isFree: true,
      certification: false
    },
    {
      title: 'Python Intermediate Course',
      type: 'course',
      url: 'https://www.coursera.org/learn/python-programming',
      difficulty: 'intermediate',
      topic: 'Intermediate Python',
      description: 'Learn intermediate Python concepts including OOP and data structures.',
      duration: '8 weeks',
      readTime: null,
      provider: 'Coursera',
      rating: 4.5,
      tags: ['python', 'intermediate', 'oop', 'data structures'],
      language: 'English',
      isFree: false,
      certification: true
    },
    {
      title: 'Advanced Python Programming',
      type: 'book',
      url: 'https://realpython.com/advanced-python/',
      difficulty: 'advanced',
      topic: 'Advanced Python',
      description: 'Advanced Python concepts including decorators, generators, and metaprogramming.',
      duration: null,
      readTime: '3 hours',
      provider: 'Real Python',
      rating: 4.7,
      tags: ['python', 'advanced', 'decorators', 'generators'],
      language: 'English',
      isFree: true,
      certification: false
    }
  ],
  'Web Development': [
    {
      title: 'Full Stack Web Development',
      type: 'course',
      url: 'https://www.udemy.com/course/the-complete-web-development-bootcamp/',
      difficulty: 'intermediate',
      topic: 'Full Stack Development',
      description: 'Learn HTML, CSS, JavaScript, Node.js, and databases for full-stack development.',
      duration: '44 hours',
      readTime: null,
      provider: 'Udemy',
      rating: 4.7,
      tags: ['web development', 'full stack', 'html', 'css', 'javascript'],
      language: 'English',
      isFree: false,
      certification: true
    },
    {
      title: 'Web Development Fundamentals',
      type: 'video',
      url: 'https://www.youtube.com/watch?v=916GWv2Qs08',
      difficulty: 'beginner',
      topic: 'Web Basics',
      description: 'Introduction to web development with HTML, CSS, and JavaScript.',
      duration: '4 hours',
      readTime: null,
      provider: 'freeCodeCamp',
      rating: 4.6,
      tags: ['web development', 'html', 'css', 'beginner'],
      language: 'English',
      isFree: true,
      certification: false
    }
  ],
  'Data Science': [
    {
      title: 'Data Science Fundamentals',
      type: 'course',
      url: 'https://www.coursera.org/learn/data-science',
      difficulty: 'intermediate',
      topic: 'Data Science Basics',
      description: 'Introduction to data science with Python, statistics, and machine learning.',
      duration: '10 weeks',
      readTime: null,
      provider: 'Coursera',
      rating: 4.6,
      tags: ['data science', 'python', 'statistics', 'machine learning'],
      language: 'English',
      isFree: false,
      certification: true
    },
    {
      title: 'Python for Data Science',
      type: 'video',
      url: 'https://www.youtube.com/watch?v=r-uOL6NrBeo',
      difficulty: 'beginner',
      topic: 'Data Science with Python',
      description: 'Learn Python libraries for data science including pandas, numpy, and matplotlib.',
      duration: '5 hours',
      readTime: null,
      provider: 'freeCodeCamp',
      rating: 4.7,
      tags: ['data science', 'python', 'pandas', 'numpy'],
      language: 'English',
      isFree: true,
      certification: false
    }
  ],
  'Machine Learning': [
    {
      title: 'Machine Learning Course',
      type: 'course',
      url: 'https://www.coursera.org/learn/machine-learning',
      difficulty: 'intermediate',
      topic: 'Machine Learning',
      description: 'Andrew Ng\'s famous machine learning course covering algorithms and applications.',
      duration: '11 weeks',
      readTime: null,
      provider: 'Coursera',
      rating: 4.9,
      tags: ['machine learning', 'algorithms', 'andrew ng', 'coursera'],
      language: 'English',
      isFree: false,
      certification: true
    },
    {
      title: 'Deep Learning Fundamentals',
      type: 'video',
      url: 'https://www.youtube.com/watch?v=VyWAvY2CF3c',
      difficulty: 'advanced',
      topic: 'Deep Learning',
      description: 'Introduction to deep learning with neural networks and TensorFlow.',
      duration: '6 hours',
      readTime: null,
      provider: 'MIT OpenCourseWare',
      rating: 4.8,
      tags: ['deep learning', 'neural networks', 'tensorflow', 'mit'],
      language: 'English',
      isFree: true,
      certification: false
    }
  ]
};

// Function to generate resources for all subjects
async function generateLearningResources() {
  console.log('Starting to generate learning resources for all subjects...');
  
  let totalResources = 0;
  
  for (const subject of subjects) {
    console.log(`Generating resources for: ${subject}`);
    
    // Get specific resources for the subject or use generic ones
    const subjectResources = resourceTemplates[subject] || generateGenericResources(subject);
    
    for (const resource of subjectResources) {
      await prisma.learningResource.create({
        data: {
          title: resource.title,
          type: resource.type,
          url: resource.url,
          difficulty: resource.difficulty,
          category: subject,
          topic: resource.topic,
          description: resource.description,
          duration: resource.duration,
          readTime: resource.readTime,
          provider: resource.provider,
          rating: resource.rating,
          tags: resource.tags,
          language: resource.language,
          isFree: resource.isFree,
          certification: resource.certification
        }
      });
      totalResources++;
    }
  }
  
  console.log(`Successfully generated ${totalResources} learning resources!`);
}

// Function to generate generic resources for subjects without specific templates
function generateGenericResources(subject) {
  const resourceTypes = ['video', 'course', 'article', 'book'];
  const difficulties = ['beginner', 'intermediate', 'advanced'];
  const providers = ['Coursera', 'Udemy', 'edX', 'freeCodeCamp', 'MDN Web Docs'];
  
  const resources = [];
  
  for (let i = 0; i < 4; i++) {
    const type = resourceTypes[i];
    const difficulty = difficulties[i % 3];
    const provider = providers[i % providers.length];
    
    resources.push({
      title: `${subject} ${difficulty.charAt(0).toUpperCase() + difficulty.slice(1)} ${type.charAt(0).toUpperCase() + type.slice(1)}`,
      type: type,
      url: `https://example.com/${subject.toLowerCase().replace(/\s+/g, '-')}-${difficulty}-${type}`,
      difficulty: difficulty,
      topic: subject,
      description: `Learn ${subject} at ${difficulty} level through this ${type}.`,
      duration: type === 'video' ? `${Math.floor(Math.random() * 5) + 1} hours` : 
                type === 'course' ? `${Math.floor(Math.random() * 10) + 4} weeks` : null,
      readTime: type === 'article' || type === 'book' ? `${Math.floor(Math.random() * 60) + 15} minutes` : null,
      provider: provider,
      rating: (Math.random() * 1 + 4).toFixed(1),
      tags: [subject.toLowerCase(), difficulty, type, 'learning'],
      language: 'English',
      isFree: Math.random() > 0.5,
      certification: type === 'course'
    });
  }
  
  return resources;
}

// Function to run the generation
async function main() {
  try {
    await generateLearningResources();
  } catch (error) {
    console.error('Error generating learning resources:', error);
  } finally {
    await prisma.$disconnect();
  }
}

// Run the script
main(); 