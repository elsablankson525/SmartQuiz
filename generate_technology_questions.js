import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// Quiz questions for Technology category
const technologyQuestions = [
  // Additional Beginner Questions (need 7 more to reach 10)
  {
    question: "What is technology?",
    options: ["Only computers", "The application of scientific knowledge to solve practical problems", "Only machines", "Only software"],
    correctAnswer: "The application of scientific knowledge to solve practical problems",
    explanation: "Technology is the application of scientific knowledge to solve practical problems and improve human life through tools, systems, and processes.",
    difficulty: "beginner",
    topic: "technology-fundamentals",
    relatedConcepts: ["scientific knowledge", "practical problems", "human improvement"]
  },
  {
    question: "What is the difference between hardware and software?",
    options: ["No difference", "Hardware is physical components, software is programs and data", "Hardware is always better", "Software is always better"],
    correctAnswer: "Hardware is physical components, software is programs and data",
    explanation: "Hardware refers to physical components like computers and devices, while software includes programs, applications, and data.",
    difficulty: "beginner",
    topic: "computer-basics",
    relatedConcepts: ["physical components", "programs", "data"]
  },
  {
    question: "What is the purpose of the internet?",
    options: ["Only for social media", "To connect computers and share information globally", "Only for email", "Only for shopping"],
    correctAnswer: "To connect computers and share information globally",
    explanation: "The internet is a global network that connects computers and allows sharing of information, communication, and access to resources worldwide.",
    difficulty: "beginner",
    topic: "internet-basics",
    relatedConcepts: ["global network", "information sharing", "communication"]
  },
  {
    question: "What is the role of data in technology?",
    options: ["No role", "To provide information that can be processed and analyzed", "Only for storage", "Only for backup"],
    correctAnswer: "To provide information that can be processed and analyzed",
    explanation: "Data provides information that can be processed, analyzed, and used to make decisions and improve systems.",
    difficulty: "beginner",
    topic: "data-basics",
    relatedConcepts: ["information", "processing", "analysis"]
  },
  {
    question: "What is the purpose of cybersecurity?",
    options: ["To make computers faster", "To protect systems and data from unauthorized access and attacks", "To reduce costs", "To improve performance"],
    correctAnswer: "To protect systems and data from unauthorized access and attacks",
    explanation: "Cybersecurity protects computer systems, networks, and data from unauthorized access, attacks, and damage.",
    difficulty: "beginner",
    topic: "cybersecurity",
    relatedConcepts: ["protection", "unauthorized access", "security"]
  },
  {
    question: "What is the difference between analog and digital technology?",
    options: ["No difference", "Analog uses continuous signals, digital uses discrete values", "Analog is always older", "Digital is always better"],
    correctAnswer: "Analog uses continuous signals, digital uses discrete values",
    explanation: "Analog technology uses continuous signals, while digital technology uses discrete values (0s and 1s) for processing and storage.",
    difficulty: "beginner",
    topic: "signal-processing",
    relatedConcepts: ["continuous signals", "discrete values", "processing"]
  },
  {
    question: "What is the purpose of user interface design?",
    options: ["Only decoration", "To create intuitive and user-friendly ways to interact with technology", "Only for websites", "Only for apps"],
    correctAnswer: "To create intuitive and user-friendly ways to interact with technology",
    explanation: "User interface design creates intuitive and user-friendly ways for people to interact with technology systems and applications.",
    difficulty: "beginner",
    topic: "user-interface",
    relatedConcepts: ["intuitive design", "user-friendly", "interaction"]
  },

  // Additional Intermediate Questions (need 8 more to reach 10)
  {
    question: "What is the concept of cloud computing?",
    options: ["A type of weather", "Delivering computing services over the internet", "A type of storage", "A type of software"],
    correctAnswer: "Delivering computing services over the internet",
    explanation: "Cloud computing delivers computing services like storage, processing, and software over the internet rather than on local devices.",
    difficulty: "intermediate",
    topic: "cloud-computing",
    relatedConcepts: ["computing services", "internet delivery", "remote access"]
  },
  {
    question: "What is the role of algorithms in technology?",
    options: ["No role", "To provide step-by-step procedures for solving problems", "Only for math", "Only for computers"],
    correctAnswer: "To provide step-by-step procedures for solving problems",
    explanation: "Algorithms provide step-by-step procedures for solving problems and performing tasks efficiently in technology systems.",
    difficulty: "intermediate",
    topic: "algorithms",
    relatedConcepts: ["step-by-step", "problem solving", "efficiency"]
  },
  {
    question: "What is the concept of machine learning?",
    options: ["A type of robot", "Enabling computers to learn and improve from experience without explicit programming", "A type of software", "A type of hardware"],
    correctAnswer: "Enabling computers to learn and improve from experience without explicit programming",
    explanation: "Machine learning enables computers to learn and improve from experience without being explicitly programmed for every task.",
    difficulty: "intermediate",
    topic: "machine-learning",
    relatedConcepts: ["learning", "experience", "improvement"]
  },
  {
    question: "What is the purpose of databases in technology?",
    options: ["Only storage", "To organize, store, and retrieve large amounts of data efficiently", "Only backup", "Only security"],
    correctAnswer: "To organize, store, and retrieve large amounts of data efficiently",
    explanation: "Databases organize, store, and retrieve large amounts of data efficiently, enabling quick access and management of information.",
    difficulty: "intermediate",
    topic: "databases",
    relatedConcepts: ["organization", "storage", "retrieval"]
  },
  {
    question: "What is the concept of networking in technology?",
    options: ["Only social media", "Connecting devices to share resources and communicate", "Only internet", "Only wireless"],
    correctAnswer: "Connecting devices to share resources and communicate",
    explanation: "Networking connects devices to share resources, communicate, and exchange information efficiently.",
    difficulty: "intermediate",
    topic: "networking",
    relatedConcepts: ["device connection", "resource sharing", "communication"]
  },
  {
    question: "What is the role of APIs in software development?",
    options: ["No role", "To enable different software systems to communicate and share data", "Only for websites", "Only for mobile apps"],
    correctAnswer: "To enable different software systems to communicate and share data",
    explanation: "APIs (Application Programming Interfaces) enable different software systems to communicate and share data seamlessly.",
    difficulty: "intermediate",
    topic: "apis",
    relatedConcepts: ["communication", "data sharing", "integration"]
  },
  {
    question: "What is the concept of virtualization in technology?",
    options: ["A type of reality", "Creating virtual versions of computing resources", "A type of software", "A type of hardware"],
    correctAnswer: "Creating virtual versions of computing resources",
    explanation: "Virtualization creates virtual versions of computing resources like servers, storage, and networks to improve efficiency and flexibility.",
    difficulty: "intermediate",
    topic: "virtualization",
    relatedConcepts: ["virtual resources", "efficiency", "flexibility"]
  },
  {
    question: "What is the purpose of version control in software development?",
    options: ["Only backup", "To track changes and manage different versions of software code", "Only security", "Only storage"],
    correctAnswer: "To track changes and manage different versions of software code",
    explanation: "Version control tracks changes and manages different versions of software code, enabling collaboration and rollback capabilities.",
    difficulty: "intermediate",
    topic: "version-control",
    relatedConcepts: ["change tracking", "version management", "collaboration"]
  },

  // Advanced Questions (need 10 total)
  {
    question: "What is the concept of artificial intelligence?",
    options: ["A type of robot", "Creating systems that can perform tasks requiring human intelligence", "A type of software", "A type of computer"],
    correctAnswer: "Creating systems that can perform tasks requiring human intelligence",
    explanation: "Artificial intelligence creates systems that can perform tasks typically requiring human intelligence, such as learning, reasoning, and problem-solving.",
    difficulty: "advanced",
    topic: "artificial-intelligence",
    relatedConcepts: ["human intelligence", "learning", "reasoning"]
  },
  {
    question: "What is the role of blockchain technology?",
    options: ["No role", "To create secure, decentralized digital ledgers for transactions", "Only for cryptocurrency", "Only for finance"],
    correctAnswer: "To create secure, decentralized digital ledgers for transactions",
    explanation: "Blockchain creates secure, decentralized digital ledgers that record transactions across multiple computers without central authority.",
    difficulty: "advanced",
    topic: "blockchain",
    relatedConcepts: ["decentralized", "digital ledgers", "security"]
  },
  {
    question: "What is the concept of quantum computing?",
    options: ["A type of computer", "Using quantum mechanical phenomena to process information", "A type of software", "A type of algorithm"],
    correctAnswer: "Using quantum mechanical phenomena to process information",
    explanation: "Quantum computing uses quantum mechanical phenomena like superposition and entanglement to process information in fundamentally new ways.",
    difficulty: "advanced",
    topic: "quantum-computing",
    relatedConcepts: ["quantum phenomena", "superposition", "entanglement"]
  },
  {
    question: "What is the role of edge computing in technology?",
    options: ["No role", "To process data closer to where it's generated rather than in centralized locations", "Only for mobile devices", "Only for IoT"],
    correctAnswer: "To process data closer to where it's generated rather than in centralized locations",
    explanation: "Edge computing processes data closer to where it's generated, reducing latency and improving real-time processing capabilities.",
    difficulty: "advanced",
    topic: "edge-computing",
    relatedConcepts: ["local processing", "latency reduction", "real-time"]
  },
  {
    question: "What is the concept of the Internet of Things (IoT)?",
    options: ["A type of internet", "Connecting everyday objects to the internet for data collection and control", "A type of network", "A type of device"],
    correctAnswer: "Connecting everyday objects to the internet for data collection and control",
    explanation: "IoT connects everyday objects to the internet, enabling data collection, monitoring, and remote control of devices.",
    difficulty: "advanced",
    topic: "internet-of-things",
    relatedConcepts: ["connected objects", "data collection", "remote control"]
  },
  {
    question: "What is the role of 5G technology?",
    options: ["No role", "To provide faster, more reliable wireless communication with lower latency", "Only for mobile phones", "Only for internet"],
    correctAnswer: "To provide faster, more reliable wireless communication with lower latency",
    explanation: "5G technology provides faster, more reliable wireless communication with lower latency, enabling new applications and services.",
    difficulty: "advanced",
    topic: "5g-technology",
    relatedConcepts: ["faster communication", "reliability", "low latency"]
  },
  {
    question: "What is the concept of augmented reality (AR)?",
    options: ["A type of game", "Overlaying digital information onto the real world", "A type of virtual reality", "A type of display"],
    correctAnswer: "Overlaying digital information onto the real world",
    explanation: "Augmented reality overlays digital information onto the real world, enhancing perception and interaction with the environment.",
    difficulty: "advanced",
    topic: "augmented-reality",
    relatedConcepts: ["digital overlay", "real world", "enhanced perception"]
  },
  {
    question: "What is the role of cybersecurity in protecting critical infrastructure?",
    options: ["No role", "To safeguard essential systems from cyber threats and attacks", "Only for computers", "Only for networks"],
    correctAnswer: "To safeguard essential systems from cyber threats and attacks",
    explanation: "Cybersecurity safeguards critical infrastructure like power grids, transportation, and healthcare systems from cyber threats.",
    difficulty: "advanced",
    topic: "critical-infrastructure-security",
    relatedConcepts: ["safeguarding", "essential systems", "cyber threats"]
  },
  {
    question: "What is the concept of digital transformation?",
    options: ["A type of change", "Integrating digital technology into all aspects of business and society", "A type of software", "A type of process"],
    correctAnswer: "Integrating digital technology into all aspects of business and society",
    explanation: "Digital transformation integrates digital technology into all aspects of business and society, fundamentally changing how organizations operate.",
    difficulty: "advanced",
    topic: "digital-transformation",
    relatedConcepts: ["digital integration", "business change", "societal impact"]
  },
  {
    question: "What is the role of technology in sustainable development?",
    options: ["No role", "To create solutions that balance economic growth with environmental protection", "Only for renewable energy", "Only for efficiency"],
    correctAnswer: "To create solutions that balance economic growth with environmental protection",
    explanation: "Technology creates solutions that balance economic growth with environmental protection, supporting sustainable development goals.",
    difficulty: "advanced",
    topic: "sustainable-technology",
    relatedConcepts: ["economic growth", "environmental protection", "sustainable solutions"]
  },

  // Adaptive Questions (need 10 total)
  {
    question: "What is the importance of technology literacy in modern society?",
    options: ["Not important", "To enable effective participation in a technology-driven world", "Only for professionals", "Only for students"],
    correctAnswer: "To enable effective participation in a technology-driven world",
    explanation: "Technology literacy enables effective participation in a technology-driven world, essential for personal and professional success.",
    difficulty: "adaptive",
    topic: "technology-literacy",
    relatedConcepts: ["effective participation", "technology-driven world", "success"]
  },
  {
    question: "What is the role of technology in addressing global challenges?",
    options: ["No role", "To provide innovative solutions for complex problems like climate change and healthcare", "Only for local issues", "Only for simple problems"],
    correctAnswer: "To provide innovative solutions for complex problems like climate change and healthcare",
    explanation: "Technology provides innovative solutions for complex global challenges like climate change, healthcare, and food security.",
    difficulty: "adaptive",
    topic: "technology-global-challenges",
    relatedConcepts: ["innovative solutions", "complex problems", "global impact"]
  },
  {
    question: "What is the importance of ethical considerations in technology development?",
    options: ["Not important", "To ensure technology benefits society while minimizing harm", "Only for research", "Only for government"],
    correctAnswer: "To ensure technology benefits society while minimizing harm",
    explanation: "Ethical considerations ensure technology development benefits society while minimizing potential harm and unintended consequences.",
    difficulty: "adaptive",
    topic: "technology-ethics",
    relatedConcepts: ["societal benefits", "harm minimization", "ethical development"]
  },
  {
    question: "What is the role of technology in education?",
    options: ["No role", "To enhance learning experiences and provide access to educational resources", "Only for online learning", "Only for distance education"],
    correctAnswer: "To enhance learning experiences and provide access to educational resources",
    explanation: "Technology enhances learning experiences and provides access to educational resources, making education more accessible and effective.",
    difficulty: "adaptive",
    topic: "technology-education",
    relatedConcepts: ["learning enhancement", "educational access", "effectiveness"]
  },
  {
    question: "What is the importance of digital inclusion in technology?",
    options: ["Not important", "To ensure all people have access to technology and digital opportunities", "Only for developed countries", "Only for urban areas"],
    correctAnswer: "To ensure all people have access to technology and digital opportunities",
    explanation: "Digital inclusion ensures all people have access to technology and digital opportunities, reducing the digital divide.",
    difficulty: "adaptive",
    topic: "digital-inclusion",
    relatedConcepts: ["access", "digital opportunities", "digital divide"]
  },
  {
    question: "What is the role of technology in healthcare innovation?",
    options: ["No role", "To improve patient care, diagnosis, and treatment through advanced tools and systems", "Only for hospitals", "Only for research"],
    correctAnswer: "To improve patient care, diagnosis, and treatment through advanced tools and systems",
    explanation: "Technology improves patient care, diagnosis, and treatment through advanced tools, systems, and medical innovations.",
    difficulty: "adaptive",
    topic: "healthcare-technology",
    relatedConcepts: ["patient care", "diagnosis", "treatment"]
  },
  {
    question: "What is the importance of technology in economic development?",
    options: ["Not important", "To drive innovation, productivity, and economic growth", "Only for large companies", "Only for developed countries"],
    correctAnswer: "To drive innovation, productivity, and economic growth",
    explanation: "Technology drives innovation, productivity, and economic growth by creating new industries and improving efficiency.",
    difficulty: "adaptive",
    topic: "technology-economics",
    relatedConcepts: ["innovation", "productivity", "economic growth"]
  },
  {
    question: "What is the role of technology in environmental protection?",
    options: ["No role", "To monitor, manage, and reduce environmental impact through smart systems", "Only for monitoring", "Only for renewable energy"],
    correctAnswer: "To monitor, manage, and reduce environmental impact through smart systems",
    explanation: "Technology monitors, manages, and reduces environmental impact through smart systems and sustainable solutions.",
    difficulty: "adaptive",
    topic: "environmental-technology",
    relatedConcepts: ["monitoring", "management", "environmental impact"]
  },
  {
    question: "What is the importance of technology in communication and connectivity?",
    options: ["Not important", "To enable global communication and connect people across distances", "Only for social media", "Only for business"],
    correctAnswer: "To enable global communication and connect people across distances",
    explanation: "Technology enables global communication and connects people across distances, fostering collaboration and understanding.",
    difficulty: "adaptive",
    topic: "communication-technology",
    relatedConcepts: ["global communication", "connectivity", "collaboration"]
  },
  {
    question: "What is the role of technology in shaping the future of work?",
    options: ["No role", "To transform work processes and create new employment opportunities", "Only for automation", "Only for remote work"],
    correctAnswer: "To transform work processes and create new employment opportunities",
    explanation: "Technology transforms work processes and creates new employment opportunities while changing how people work and collaborate.",
    difficulty: "adaptive",
    topic: "future-of-work",
    relatedConcepts: ["work transformation", "employment opportunities", "collaboration"]
  }
];

async function generateTechnologyQuestions() {
  try {
    console.log('💻 GENERATING TECHNOLOGY QUIZ QUESTIONS\n');
    console.log('='.repeat(50));

    // Get the Technology category
    const technologyCategory = await prisma.category.findUnique({
      where: { name: 'Technology' }
    });

    if (!technologyCategory) {
      console.log('❌ Technology category not found');
      return;
    }

    console.log(`📁 Category: ${technologyCategory.name}`);
    console.log(`📝 Adding ${technologyQuestions.length} new questions...\n`);

    // Add the questions
    for (const questionData of technologyQuestions) {
      const question = await prisma.quizQuestion.create({
        data: {
          ...questionData,
          categoryId: technologyCategory.id
        }
      });
      console.log(`✅ Added: ${questionData.question.substring(0, 50)}... (${questionData.difficulty})`);
    }

    console.log('\n📊 VERIFICATION:');
    console.log('='.repeat(50));

    // Check the updated question count
    const updatedQuestions = await prisma.quizQuestion.findMany({
      where: { categoryId: technologyCategory.id }
    });

    const difficultyStats = {};
    updatedQuestions.forEach(q => {
      if (!difficultyStats[q.difficulty]) {
        difficultyStats[q.difficulty] = 0;
      }
      difficultyStats[q.difficulty]++;
    });

    console.log('\nUpdated Technology questions by difficulty:');
    Object.entries(difficultyStats).forEach(([difficulty, count]) => {
      const status = count >= 10 ? '✅' : '❌';
      console.log(`  ${difficulty}: ${count} questions ${status}`);
    });

    console.log(`\nTotal Technology questions: ${updatedQuestions.length}`);
    console.log('\n✅ Technology questions generated successfully!');

  } catch (error) {
    console.error('Error generating questions:', error);
  } finally {
    await prisma.$disconnect();
  }
}

generateTechnologyQuestions(); 