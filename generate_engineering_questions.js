import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// Quiz questions for Engineering category
const engineeringQuestions = [
  // Additional Beginner Questions (need 9 more to reach 10)
  {
    question: "What is engineering?",
    options: ["A type of science", "The application of science and mathematics to solve practical problems", "A type of art", "A type of business"],
    correctAnswer: "The application of science and mathematics to solve practical problems",
    explanation: "Engineering is the application of scientific and mathematical principles to design, build, and maintain structures, machines, and systems.",
    difficulty: "beginner",
    topic: "engineering-fundamentals",
    relatedConcepts: ["application", "science", "mathematics"]
  },
  {
    question: "What is the purpose of a blueprint?",
    options: ["Decoration", "A detailed technical drawing that shows how to build something", "A type of map", "A type of photo"],
    correctAnswer: "A detailed technical drawing that shows how to build something",
    explanation: "A blueprint is a detailed technical drawing that shows how to build something, including dimensions, materials, and construction methods.",
    difficulty: "beginner",
    topic: "technical-drawing",
    relatedConcepts: ["technical drawing", "dimensions", "construction"]
  },
  {
    question: "What is the difference between a force and pressure?",
    options: ["No difference", "Force is a push or pull, pressure is force per unit area", "Force is always larger", "Pressure is always larger"],
    correctAnswer: "Force is a push or pull, pressure is force per unit area",
    explanation: "Force is a push or pull on an object, while pressure is force distributed over an area (force per unit area).",
    difficulty: "beginner",
    topic: "mechanics",
    relatedConcepts: ["push", "pull", "area distribution"]
  },
  {
    question: "What is the purpose of safety factors in engineering?",
    options: ["To make things heavier", "To ensure structures can handle loads beyond expected conditions", "To increase cost", "To slow down construction"],
    correctAnswer: "To ensure structures can handle loads beyond expected conditions",
    explanation: "Safety factors ensure that structures and components can handle loads beyond expected conditions, providing a margin of safety.",
    difficulty: "beginner",
    topic: "safety-engineering",
    relatedConcepts: ["safety", "load capacity", "margin"]
  },
  {
    question: "What is the role of materials in engineering?",
    options: ["No role", "To provide the physical properties needed for specific applications", "Only for decoration", "Only for cost"],
    correctAnswer: "To provide the physical properties needed for specific applications",
    explanation: "Materials provide the physical properties (strength, conductivity, durability) needed for specific engineering applications.",
    difficulty: "beginner",
    topic: "materials-engineering",
    relatedConcepts: ["physical properties", "strength", "applications"]
  },
  {
    question: "What is the purpose of testing in engineering?",
    options: ["To waste time", "To verify that designs meet requirements and specifications", "Only for quality control", "Only for safety"],
    correctAnswer: "To verify that designs meet requirements and specifications",
    explanation: "Testing verifies that engineering designs meet requirements and specifications before implementation.",
    difficulty: "beginner",
    topic: "engineering-testing",
    relatedConcepts: ["verification", "requirements", "specifications"]
  },
  {
    question: "What is the difference between stress and strain?",
    options: ["No difference", "Stress is force per area, strain is deformation per length", "Stress is always larger", "Strain is always larger"],
    correctAnswer: "Stress is force per area, strain is deformation per length",
    explanation: "Stress is force per unit area, while strain is the deformation (change in length) per original length of a material.",
    difficulty: "beginner",
    topic: "mechanics-of-materials",
    relatedConcepts: ["force per area", "deformation", "material response"]
  },
  {
    question: "What is the purpose of quality control in engineering?",
    options: ["To increase cost", "To ensure products meet specified standards and requirements", "To slow production", "To reduce efficiency"],
    correctAnswer: "To ensure products meet specified standards and requirements",
    explanation: "Quality control ensures that engineering products meet specified standards and requirements consistently.",
    difficulty: "beginner",
    topic: "quality-control",
    relatedConcepts: ["standards", "requirements", "consistency"]
  },
  {
    question: "What is the role of computer-aided design (CAD) in engineering?",
    options: ["No role", "To create and modify technical drawings and models digitally", "Only for visualization", "Only for documentation"],
    correctAnswer: "To create and modify technical drawings and models digitally",
    explanation: "CAD software allows engineers to create and modify technical drawings and 3D models digitally, improving accuracy and efficiency.",
    difficulty: "beginner",
    topic: "computer-aided-design",
    relatedConcepts: ["digital design", "technical drawings", "3D models"]
  },

  // Additional Intermediate Questions (need 6 more to reach 10)
  {
    question: "What is the concept of efficiency in engineering?",
    options: ["A type of measurement", "The ratio of useful output to total input energy or work", "A type of cost", "A type of speed"],
    correctAnswer: "The ratio of useful output to total input energy or work",
    explanation: "Efficiency is the ratio of useful output to total input energy or work, measuring how well a system converts input to useful output.",
    difficulty: "intermediate",
    topic: "engineering-efficiency",
    relatedConcepts: ["ratio", "useful output", "energy conversion"]
  },
  {
    question: "What is the purpose of finite element analysis (FEA)?",
    options: ["A type of test", "To simulate and analyze complex structural behavior using numerical methods", "A type of drawing", "A type of material"],
    correctAnswer: "To simulate and analyze complex structural behavior using numerical methods",
    explanation: "FEA simulates and analyzes complex structural behavior by dividing structures into small elements and solving equations numerically.",
    difficulty: "intermediate",
    topic: "structural-analysis",
    relatedConcepts: ["simulation", "numerical methods", "structural behavior"]
  },
  {
    question: "What is the concept of reliability in engineering?",
    options: ["A type of cost", "The probability that a system will perform its intended function for a specified time", "A type of speed", "A type of weight"],
    correctAnswer: "The probability that a system will perform its intended function for a specified time",
    explanation: "Reliability measures the probability that a system will perform its intended function without failure for a specified time period.",
    difficulty: "intermediate",
    topic: "reliability-engineering",
    relatedConcepts: ["probability", "function", "failure"]
  },
  {
    question: "What is the role of thermodynamics in engineering?",
    options: ["No role", "To study energy transfer and conversion in systems", "Only for heat engines", "Only for cooling systems"],
    correctAnswer: "To study energy transfer and conversion in systems",
    explanation: "Thermodynamics studies energy transfer and conversion in systems, essential for designing engines, power plants, and thermal systems.",
    difficulty: "intermediate",
    topic: "thermodynamics",
    relatedConcepts: ["energy transfer", "energy conversion", "thermal systems"]
  },
  {
    question: "What is the concept of optimization in engineering design?",
    options: ["A type of cost", "Finding the best solution that balances multiple competing objectives", "A type of speed", "A type of weight"],
    correctAnswer: "Finding the best solution that balances multiple competing objectives",
    explanation: "Optimization finds the best solution that balances multiple competing objectives like cost, performance, safety, and efficiency.",
    difficulty: "intermediate",
    topic: "design-optimization",
    relatedConcepts: ["best solution", "competing objectives", "balance"]
  },
  {
    question: "What is the purpose of failure analysis in engineering?",
    options: ["To assign blame", "To understand why failures occur and prevent future failures", "To increase cost", "To slow down production"],
    correctAnswer: "To understand why failures occur and prevent future failures",
    explanation: "Failure analysis investigates why failures occur to understand root causes and prevent similar failures in the future.",
    difficulty: "intermediate",
    topic: "failure-analysis",
    relatedConcepts: ["root causes", "prevention", "investigation"]
  },

  // Advanced Questions (need 10 total)
  {
    question: "What is the concept of systems engineering?",
    options: ["A type of engineering", "An interdisciplinary approach to designing and managing complex systems", "A type of software", "A type of process"],
    correctAnswer: "An interdisciplinary approach to designing and managing complex systems",
    explanation: "Systems engineering is an interdisciplinary approach that focuses on designing and managing complex systems throughout their lifecycle.",
    difficulty: "advanced",
    topic: "systems-engineering",
    relatedConcepts: ["interdisciplinary", "complex systems", "lifecycle"]
  },
  {
    question: "What is the role of control theory in engineering?",
    options: ["No role", "To design systems that maintain desired behavior despite disturbances", "Only for robots", "Only for automation"],
    correctAnswer: "To design systems that maintain desired behavior despite disturbances",
    explanation: "Control theory designs systems that maintain desired behavior despite disturbances, essential for automation and robotics.",
    difficulty: "advanced",
    topic: "control-theory",
    relatedConcepts: ["desired behavior", "disturbances", "automation"]
  },
  {
    question: "What is the concept of mechatronics?",
    options: ["A type of robot", "The integration of mechanical, electrical, and computer engineering", "A type of software", "A type of material"],
    correctAnswer: "The integration of mechanical, electrical, and computer engineering",
    explanation: "Mechatronics integrates mechanical, electrical, and computer engineering to create intelligent systems and products.",
    difficulty: "advanced",
    topic: "mechatronics",
    relatedConcepts: ["integration", "intelligent systems", "multiple disciplines"]
  },
  {
    question: "What is the role of computational fluid dynamics (CFD)?",
    options: ["No role", "To simulate and analyze fluid flow using numerical methods", "Only for water", "Only for air"],
    correctAnswer: "To simulate and analyze fluid flow using numerical methods",
    explanation: "CFD simulates and analyzes fluid flow using numerical methods, helping design aerodynamic and hydrodynamic systems.",
    difficulty: "advanced",
    topic: "computational-fluid-dynamics",
    relatedConcepts: ["fluid flow", "numerical methods", "simulation"]
  },
  {
    question: "What is the concept of sustainable engineering?",
    options: ["A type of cost", "Designing systems that minimize environmental impact and resource consumption", "A type of material", "A type of process"],
    correctAnswer: "Designing systems that minimize environmental impact and resource consumption",
    explanation: "Sustainable engineering designs systems that minimize environmental impact and resource consumption while meeting human needs.",
    difficulty: "advanced",
    topic: "sustainable-engineering",
    relatedConcepts: ["environmental impact", "resource consumption", "human needs"]
  },
  {
    question: "What is the role of artificial intelligence in engineering?",
    options: ["No role", "To enhance design, analysis, and decision-making processes", "Only for robots", "Only for automation"],
    correctAnswer: "To enhance design, analysis, and decision-making processes",
    explanation: "AI enhances engineering design, analysis, and decision-making processes through machine learning and intelligent algorithms.",
    difficulty: "advanced",
    topic: "ai-in-engineering",
    relatedConcepts: ["enhancement", "machine learning", "intelligent algorithms"]
  },
  {
    question: "What is the concept of biomimetics in engineering?",
    options: ["A type of biology", "Designing systems inspired by biological structures and processes", "A type of material", "A type of process"],
    correctAnswer: "Designing systems inspired by biological structures and processes",
    explanation: "Biomimetics designs engineering systems inspired by biological structures and processes found in nature.",
    difficulty: "advanced",
    topic: "biomimetics",
    relatedConcepts: ["biological inspiration", "natural structures", "biological processes"]
  },
  {
    question: "What is the role of nanotechnology in engineering?",
    options: ["No role", "To design and manipulate materials at the molecular and atomic scale", "Only for electronics", "Only for medicine"],
    correctAnswer: "To design and manipulate materials at the molecular and atomic scale",
    explanation: "Nanotechnology designs and manipulates materials at the molecular and atomic scale, creating new properties and applications.",
    difficulty: "advanced",
    topic: "nanotechnology",
    relatedConcepts: ["molecular scale", "atomic scale", "new properties"]
  },
  {
    question: "What is the concept of additive manufacturing?",
    options: ["A type of process", "Building objects layer by layer from digital models", "A type of material", "A type of machine"],
    correctAnswer: "Building objects layer by layer from digital models",
    explanation: "Additive manufacturing builds objects layer by layer from digital models, enabling complex geometries and rapid prototyping.",
    difficulty: "advanced",
    topic: "additive-manufacturing",
    relatedConcepts: ["layer by layer", "digital models", "complex geometries"]
  },
  {
    question: "What is the role of quantum engineering?",
    options: ["No role", "To design systems that exploit quantum mechanical phenomena", "Only for computers", "Only for physics"],
    correctAnswer: "To design systems that exploit quantum mechanical phenomena",
    explanation: "Quantum engineering designs systems that exploit quantum mechanical phenomena for new technologies and applications.",
    difficulty: "advanced",
    topic: "quantum-engineering",
    relatedConcepts: ["quantum phenomena", "new technologies", "quantum mechanics"]
  },

  // Adaptive Questions (need 10 total)
  {
    question: "What is the importance of engineering ethics?",
    options: ["Not important", "To ensure engineers prioritize public safety and welfare", "Only for large projects", "Only for government work"],
    correctAnswer: "To ensure engineers prioritize public safety and welfare",
    explanation: "Engineering ethics ensures that engineers prioritize public safety and welfare in their professional decisions and designs.",
    difficulty: "adaptive",
    topic: "engineering-ethics",
    relatedConcepts: ["public safety", "welfare", "professional responsibility"]
  },
  {
    question: "What is the role of engineering in addressing global challenges?",
    options: ["No role", "To develop technological solutions for complex societal problems", "Only for local issues", "Only for simple problems"],
    correctAnswer: "To develop technological solutions for complex societal problems",
    explanation: "Engineering develops technological solutions for complex societal problems like climate change, energy, and infrastructure.",
    difficulty: "adaptive",
    topic: "engineering-and-society",
    relatedConcepts: ["technological solutions", "complex problems", "societal challenges"]
  },
  {
    question: "What is the importance of interdisciplinary collaboration in engineering?",
    options: ["Not important", "To combine diverse expertise for complex problem-solving", "Only for large projects", "Only for research"],
    correctAnswer: "To combine diverse expertise for complex problem-solving",
    explanation: "Interdisciplinary collaboration combines diverse expertise from multiple fields to solve complex engineering problems effectively.",
    difficulty: "adaptive",
    topic: "engineering-collaboration",
    relatedConcepts: ["diverse expertise", "complex problems", "multiple fields"]
  },
  {
    question: "What is the role of engineering in innovation?",
    options: ["No role", "To translate scientific discoveries into practical applications", "Only for research", "Only for development"],
    correctAnswer: "To translate scientific discoveries into practical applications",
    explanation: "Engineering translates scientific discoveries into practical applications that benefit society and drive technological progress.",
    difficulty: "adaptive",
    topic: "engineering-innovation",
    relatedConcepts: ["scientific discoveries", "practical applications", "technological progress"]
  },
  {
    question: "What is the importance of lifelong learning in engineering?",
    options: ["Not important", "To stay current with rapidly evolving technologies and methods", "Only for new engineers", "Only for managers"],
    correctAnswer: "To stay current with rapidly evolving technologies and methods",
    explanation: "Lifelong learning is essential for engineers to stay current with rapidly evolving technologies, methods, and industry standards.",
    difficulty: "adaptive",
    topic: "engineering-education",
    relatedConcepts: ["evolving technologies", "current knowledge", "professional development"]
  },
  {
    question: "What is the role of engineering in economic development?",
    options: ["No role", "To create infrastructure and technologies that drive economic growth", "Only for manufacturing", "Only for construction"],
    correctAnswer: "To create infrastructure and technologies that drive economic growth",
    explanation: "Engineering creates infrastructure and technologies that drive economic growth and improve quality of life.",
    difficulty: "adaptive",
    topic: "engineering-economics",
    relatedConcepts: ["infrastructure", "economic growth", "quality of life"]
  },
  {
    question: "What is the importance of risk management in engineering?",
    options: ["Not important", "To identify and mitigate potential failures and hazards", "Only for large projects", "Only for safety-critical systems"],
    correctAnswer: "To identify and mitigate potential failures and hazards",
    explanation: "Risk management identifies and mitigates potential failures and hazards to ensure project success and public safety.",
    difficulty: "adaptive",
    topic: "risk-management",
    relatedConcepts: ["potential failures", "hazards", "mitigation"]
  },
  {
    question: "What is the role of engineering in environmental protection?",
    options: ["No role", "To design systems that minimize environmental impact and promote sustainability", "Only for pollution control", "Only for renewable energy"],
    correctAnswer: "To design systems that minimize environmental impact and promote sustainability",
    explanation: "Engineering designs systems that minimize environmental impact and promote sustainability for future generations.",
    difficulty: "adaptive",
    topic: "environmental-engineering",
    relatedConcepts: ["environmental impact", "sustainability", "future generations"]
  },
  {
    question: "What is the importance of communication skills in engineering?",
    options: ["Not important", "To effectively convey technical information to diverse audiences", "Only for managers", "Only for presentations"],
    correctAnswer: "To effectively convey technical information to diverse audiences",
    explanation: "Communication skills enable engineers to effectively convey technical information to diverse audiences including clients, colleagues, and the public.",
    difficulty: "adaptive",
    topic: "engineering-communication",
    relatedConcepts: ["technical information", "diverse audiences", "effective communication"]
  },
  {
    question: "What is the role of engineering in improving quality of life?",
    options: ["No role", "To create technologies and systems that enhance human well-being", "Only for medical devices", "Only for consumer products"],
    correctAnswer: "To create technologies and systems that enhance human well-being",
    explanation: "Engineering creates technologies and systems that enhance human well-being and improve quality of life across all sectors.",
    difficulty: "adaptive",
    topic: "engineering-impact",
    relatedConcepts: ["human well-being", "quality of life", "technological advancement"]
  }
];

async function generateEngineeringQuestions() {
  try {
    console.log('⚙️ GENERATING ENGINEERING QUIZ QUESTIONS\n');
    console.log('='.repeat(50));

    // Get the Engineering category
    const engineeringCategory = await prisma.category.findUnique({
      where: { name: 'Engineering' }
    });

    if (!engineeringCategory) {
      console.log('❌ Engineering category not found');
      return;
    }

    console.log(`📁 Category: ${engineeringCategory.name}`);
    console.log(`📝 Adding ${engineeringQuestions.length} new questions...\n`);

    // Add the questions
    for (const questionData of engineeringQuestions) {
      const question = await prisma.quizQuestion.create({
        data: {
          ...questionData,
          categoryId: engineeringCategory.id
        }
      });
      console.log(`✅ Added: ${questionData.question.substring(0, 50)}... (${questionData.difficulty})`);
    }

    console.log('\n📊 VERIFICATION:');
    console.log('='.repeat(50));

    // Check the updated question count
    const updatedQuestions = await prisma.quizQuestion.findMany({
      where: { categoryId: engineeringCategory.id }
    });

    const difficultyStats = {};
    updatedQuestions.forEach(q => {
      if (!difficultyStats[q.difficulty]) {
        difficultyStats[q.difficulty] = 0;
      }
      difficultyStats[q.difficulty]++;
    });

    console.log('\nUpdated Engineering questions by difficulty:');
    Object.entries(difficultyStats).forEach(([difficulty, count]) => {
      const status = count >= 10 ? '✅' : '❌';
      console.log(`  ${difficulty}: ${count} questions ${status}`);
    });

    console.log(`\nTotal Engineering questions: ${updatedQuestions.length}`);
    console.log('\n✅ Engineering questions generated successfully!');

  } catch (error) {
    console.error('Error generating questions:', error);
  } finally {
    await prisma.$disconnect();
  }
}

generateEngineeringQuestions(); 