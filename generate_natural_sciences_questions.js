import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// Quiz questions for Natural Sciences category
const naturalSciencesQuestions = [
  // Additional Beginner Questions (need 6 more to reach 10)
  {
    question: "What is the scientific method?",
    options: ["A type of experiment", "A systematic approach to research and problem-solving", "A laboratory procedure", "A type of hypothesis"],
    correctAnswer: "A systematic approach to research and problem-solving",
    explanation: "The scientific method is a systematic approach involving observation, hypothesis formation, experimentation, and conclusion drawing.",
    difficulty: "beginner",
    topic: "scientific-method",
    relatedConcepts: ["observation", "hypothesis", "experimentation"]
  },
  {
    question: "What is a hypothesis?",
    options: ["A fact", "A testable explanation for an observation", "A conclusion", "A theory"],
    correctAnswer: "A testable explanation for an observation",
    explanation: "A hypothesis is a testable explanation for an observation that can be supported or refuted through experimentation.",
    difficulty: "beginner",
    topic: "scientific-method",
    relatedConcepts: ["testable", "explanation", "observation"]
  },
  {
    question: "What is the difference between a theory and a law in science?",
    options: ["No difference", "A theory explains why, a law describes what happens", "A theory is always wrong", "A law is always right"],
    correctAnswer: "A theory explains why, a law describes what happens",
    explanation: "A scientific theory explains why something happens, while a scientific law describes what happens under certain conditions.",
    difficulty: "beginner",
    topic: "scientific-concepts",
    relatedConcepts: ["explanation", "description", "scientific principles"]
  },
  {
    question: "What is the purpose of a control group in experiments?",
    options: ["To make experiments longer", "To provide a baseline for comparison", "To waste time", "To confuse researchers"],
    correctAnswer: "To provide a baseline for comparison",
    explanation: "A control group provides a baseline for comparison, allowing researchers to determine if changes in the experimental group are due to the treatment.",
    difficulty: "beginner",
    topic: "experimental-design",
    relatedConcepts: ["baseline", "comparison", "experimental design"]
  },
  {
    question: "What is the importance of peer review in science?",
    options: ["Not important", "To ensure quality and validity of research", "To make papers longer", "To delay publication"],
    correctAnswer: "To ensure quality and validity of research",
    explanation: "Peer review ensures quality and validity of research by having experts evaluate the methodology, results, and conclusions.",
    difficulty: "beginner",
    topic: "scientific-communication",
    relatedConcepts: ["quality", "validity", "expert evaluation"]
  },
  {
    question: "What is the role of observation in science?",
    options: ["No role", "To gather information about the natural world", "Only for experiments", "Only for theories"],
    correctAnswer: "To gather information about the natural world",
    explanation: "Observation is fundamental to science, allowing researchers to gather information about the natural world and identify patterns.",
    difficulty: "beginner",
    topic: "scientific-method",
    relatedConcepts: ["information gathering", "natural world", "patterns"]
  },

  // Additional Intermediate Questions (need 9 more to reach 10)
  {
    question: "What is the difference between correlation and causation?",
    options: ["No difference", "Correlation shows relationship, causation shows cause-effect", "Correlation is always wrong", "Causation is always right"],
    correctAnswer: "Correlation shows relationship, causation shows cause-effect",
    explanation: "Correlation shows a relationship between variables, while causation demonstrates that one variable directly causes changes in another.",
    difficulty: "intermediate",
    topic: "statistical-analysis",
    relatedConcepts: ["relationship", "cause-effect", "variables"]
  },
  {
    question: "What is the concept of falsifiability in science?",
    options: ["A type of experiment", "The ability to prove a hypothesis wrong", "A type of theory", "A type of law"],
    correctAnswer: "The ability to prove a hypothesis wrong",
    explanation: "Falsifiability means a hypothesis or theory can potentially be proven wrong through observation or experimentation.",
    difficulty: "intermediate",
    topic: "scientific-philosophy",
    relatedConcepts: ["testability", "proof", "scientific criteria"]
  },
  {
    question: "What is the role of models in science?",
    options: ["No role", "To represent complex systems and make predictions", "Only for visualization", "Only for teaching"],
    correctAnswer: "To represent complex systems and make predictions",
    explanation: "Scientific models represent complex systems and allow scientists to make predictions and test hypotheses.",
    difficulty: "intermediate",
    topic: "scientific-modeling",
    relatedConcepts: ["representation", "predictions", "complex systems"]
  },
  {
    question: "What is the importance of replication in science?",
    options: ["Not important", "To verify results and ensure reliability", "To waste time", "To delay progress"],
    correctAnswer: "To verify results and ensure reliability",
    explanation: "Replication verifies results and ensures reliability by having other researchers repeat experiments to confirm findings.",
    difficulty: "intermediate",
    topic: "scientific-rigor",
    relatedConcepts: ["verification", "reliability", "confirmation"]
  },
  {
    question: "What is the concept of uncertainty in scientific measurements?",
    options: ["A type of error", "The range of possible values in a measurement", "A type of bias", "A type of precision"],
    correctAnswer: "The range of possible values in a measurement",
    explanation: "Uncertainty represents the range of possible values in a measurement, acknowledging that all measurements have some degree of error.",
    difficulty: "intermediate",
    topic: "measurement",
    relatedConcepts: ["range", "possible values", "error"]
  },
  {
    question: "What is the role of statistics in science?",
    options: ["No role", "To analyze data and draw conclusions", "Only for surveys", "Only for experiments"],
    correctAnswer: "To analyze data and draw conclusions",
    explanation: "Statistics help scientists analyze data, identify patterns, and draw reliable conclusions from their research.",
    difficulty: "intermediate",
    topic: "statistical-analysis",
    relatedConcepts: ["data analysis", "patterns", "conclusions"]
  },
  {
    question: "What is the concept of bias in scientific research?",
    options: ["A type of error", "Systematic error that affects results", "A type of precision", "A type of accuracy"],
    correctAnswer: "Systematic error that affects results",
    explanation: "Bias is systematic error that affects research results, often due to researcher expectations or experimental design flaws.",
    difficulty: "intermediate",
    topic: "research-methodology",
    relatedConcepts: ["systematic error", "expectations", "experimental design"]
  },
  {
    question: "What is the importance of interdisciplinary research?",
    options: ["Not important", "To combine knowledge from multiple fields", "To make research harder", "To confuse researchers"],
    correctAnswer: "To combine knowledge from multiple fields",
    explanation: "Interdisciplinary research combines knowledge from multiple fields to solve complex problems that require diverse perspectives.",
    difficulty: "intermediate",
    topic: "research-approach",
    relatedConcepts: ["multiple fields", "complex problems", "diverse perspectives"]
  },
  {
    question: "What is the role of technology in scientific research?",
    options: ["No role", "To enhance observation, measurement, and analysis", "Only for experiments", "Only for data collection"],
    correctAnswer: "To enhance observation, measurement, and analysis",
    explanation: "Technology enhances scientific research by improving observation, measurement, and analysis capabilities.",
    difficulty: "intermediate",
    topic: "scientific-technology",
    relatedConcepts: ["enhancement", "capabilities", "research tools"]
  },

  // Advanced Questions (need 10 total)
  {
    question: "What is the concept of emergence in complex systems?",
    options: ["A type of error", "Properties that arise from interactions but aren't present in individual components", "A type of bias", "A type of model"],
    correctAnswer: "Properties that arise from interactions but aren't present in individual components",
    explanation: "Emergence describes properties that arise from interactions between components but aren't present in the individual components themselves.",
    difficulty: "advanced",
    topic: "complex-systems",
    relatedConcepts: ["interactions", "properties", "system behavior"]
  },
  {
    question: "What is the role of mathematics in scientific modeling?",
    options: ["No role", "To provide precise language for describing relationships and making predictions", "Only for calculations", "Only for statistics"],
    correctAnswer: "To provide precise language for describing relationships and making predictions",
    explanation: "Mathematics provides a precise language for describing relationships and making predictions in scientific models.",
    difficulty: "advanced",
    topic: "mathematical-modeling",
    relatedConcepts: ["precise language", "relationships", "predictions"]
  },
  {
    question: "What is the concept of scientific paradigms?",
    options: ["A type of theory", "Dominant frameworks that guide scientific research", "A type of method", "A type of law"],
    correctAnswer: "Dominant frameworks that guide scientific research",
    explanation: "Scientific paradigms are dominant frameworks that guide research, define problems, and establish acceptable methods and standards.",
    difficulty: "advanced",
    topic: "scientific-philosophy",
    relatedConcepts: ["frameworks", "research guidance", "standards"]
  },
  {
    question: "What is the role of computational modeling in science?",
    options: ["No role", "To simulate complex systems and test hypotheses", "Only for data storage", "Only for visualization"],
    correctAnswer: "To simulate complex systems and test hypotheses",
    explanation: "Computational modeling allows scientists to simulate complex systems and test hypotheses that would be impossible or unethical to test directly.",
    difficulty: "advanced",
    topic: "computational-science",
    relatedConcepts: ["simulation", "complex systems", "hypothesis testing"]
  },
  {
    question: "What is the concept of scientific reductionism?",
    options: ["A type of error", "Breaking complex phenomena into simpler components", "A type of bias", "A type of model"],
    correctAnswer: "Breaking complex phenomena into simpler components",
    explanation: "Reductionism involves breaking complex phenomena into simpler components to understand the whole through its parts.",
    difficulty: "advanced",
    topic: "scientific-approach",
    relatedConcepts: ["complex phenomena", "simpler components", "understanding"]
  },
  {
    question: "What is the role of ethics in scientific research?",
    options: ["No role", "To ensure responsible conduct and protect participants", "Only for human studies", "Only for animal studies"],
    correctAnswer: "To ensure responsible conduct and protect participants",
    explanation: "Ethics in scientific research ensures responsible conduct and protects the rights and welfare of research participants.",
    difficulty: "advanced",
    topic: "research-ethics",
    relatedConcepts: ["responsible conduct", "protection", "participant rights"]
  },
  {
    question: "What is the concept of scientific consensus?",
    options: ["A type of theory", "General agreement among experts in a field", "A type of law", "A type of hypothesis"],
    correctAnswer: "General agreement among experts in a field",
    explanation: "Scientific consensus represents general agreement among experts in a field based on the best available evidence.",
    difficulty: "advanced",
    topic: "scientific-communication",
    relatedConcepts: ["expert agreement", "evidence", "field consensus"]
  },
  {
    question: "What is the role of uncertainty quantification in science?",
    options: ["No role", "To assess and communicate the reliability of scientific results", "Only for statistics", "Only for measurements"],
    correctAnswer: "To assess and communicate the reliability of scientific results",
    explanation: "Uncertainty quantification assesses and communicates the reliability of scientific results, helping users understand the limitations of findings.",
    difficulty: "advanced",
    topic: "scientific-communication",
    relatedConcepts: ["reliability", "communication", "limitations"]
  },
  {
    question: "What is the concept of scientific objectivity?",
    options: ["A type of bias", "Striving to minimize personal bias in research", "A type of error", "A type of method"],
    correctAnswer: "Striving to minimize personal bias in research",
    explanation: "Scientific objectivity involves striving to minimize personal bias in research through systematic methods and peer review.",
    difficulty: "advanced",
    topic: "scientific-philosophy",
    relatedConcepts: ["bias minimization", "systematic methods", "peer review"]
  },
  {
    question: "What is the role of meta-analysis in scientific research?",
    options: ["No role", "To combine results from multiple studies for stronger conclusions", "Only for statistics", "Only for reviews"],
    correctAnswer: "To combine results from multiple studies for stronger conclusions",
    explanation: "Meta-analysis combines results from multiple studies to draw stronger conclusions than individual studies can provide.",
    difficulty: "advanced",
    topic: "research-synthesis",
    relatedConcepts: ["multiple studies", "stronger conclusions", "research synthesis"]
  },

  // Adaptive Questions (need 10 total)
  {
    question: "What is the importance of scientific literacy?",
    options: ["Not important", "To enable informed decision-making in a technological society", "Only for scientists", "Only for students"],
    correctAnswer: "To enable informed decision-making in a technological society",
    explanation: "Scientific literacy enables informed decision-making in a technological society by helping people understand and evaluate scientific information.",
    difficulty: "adaptive",
    topic: "scientific-literacy",
    relatedConcepts: ["informed decisions", "technological society", "understanding"]
  },
  {
    question: "What is the role of science in addressing global challenges?",
    options: ["No role", "To provide evidence-based solutions to complex problems", "Only for local issues", "Only for simple problems"],
    correctAnswer: "To provide evidence-based solutions to complex problems",
    explanation: "Science provides evidence-based solutions to complex global challenges like climate change, disease, and resource management.",
    difficulty: "adaptive",
    topic: "science-and-society",
    relatedConcepts: ["evidence-based", "complex problems", "global challenges"]
  },
  {
    question: "What is the importance of open science practices?",
    options: ["Not important", "To increase transparency, reproducibility, and collaboration", "Only for data sharing", "Only for publication"],
    correctAnswer: "To increase transparency, reproducibility, and collaboration",
    explanation: "Open science practices increase transparency, reproducibility, and collaboration by sharing data, methods, and results openly.",
    difficulty: "adaptive",
    topic: "open-science",
    relatedConcepts: ["transparency", "reproducibility", "collaboration"]
  },
  {
    question: "What is the role of citizen science in research?",
    options: ["No role", "To engage the public in scientific research and data collection", "Only for simple projects", "Only for local studies"],
    correctAnswer: "To engage the public in scientific research and data collection",
    explanation: "Citizen science engages the public in scientific research and data collection, expanding research capacity and public involvement.",
    difficulty: "adaptive",
    topic: "citizen-science",
    relatedConcepts: ["public engagement", "research capacity", "involvement"]
  },
  {
    question: "What is the importance of science communication?",
    options: ["Not important", "To make scientific knowledge accessible and relevant to society", "Only for scientists", "Only for education"],
    correctAnswer: "To make scientific knowledge accessible and relevant to society",
    explanation: "Science communication makes scientific knowledge accessible and relevant to society, bridging the gap between research and public understanding.",
    difficulty: "adaptive",
    topic: "science-communication",
    relatedConcepts: ["accessibility", "relevance", "public understanding"]
  },
  {
    question: "What is the role of science in policy-making?",
    options: ["No role", "To provide evidence-based information for informed decisions", "Only for environmental policy", "Only for health policy"],
    correctAnswer: "To provide evidence-based information for informed decisions",
    explanation: "Science provides evidence-based information that helps policymakers make informed decisions on complex issues.",
    difficulty: "adaptive",
    topic: "science-policy",
    relatedConcepts: ["evidence-based", "informed decisions", "policy-making"]
  },
  {
    question: "What is the importance of scientific skepticism?",
    options: ["Not important", "To question claims and demand evidence before accepting conclusions", "Only for controversial topics", "Only for new theories"],
    correctAnswer: "To question claims and demand evidence before accepting conclusions",
    explanation: "Scientific skepticism involves questioning claims and demanding evidence before accepting conclusions, promoting critical thinking.",
    difficulty: "adaptive",
    topic: "scientific-thinking",
    relatedConcepts: ["questioning", "evidence", "critical thinking"]
  },
  {
    question: "What is the role of science in innovation and technology?",
    options: ["No role", "To provide fundamental knowledge that drives technological advancement", "Only for basic research", "Only for applied research"],
    correctAnswer: "To provide fundamental knowledge that drives technological advancement",
    explanation: "Science provides fundamental knowledge that drives technological advancement and innovation across all sectors.",
    difficulty: "adaptive",
    topic: "science-innovation",
    relatedConcepts: ["fundamental knowledge", "technological advancement", "innovation"]
  },
  {
    question: "What is the importance of scientific collaboration?",
    options: ["Not important", "To combine expertise and resources for complex research challenges", "Only for large projects", "Only for international studies"],
    correctAnswer: "To combine expertise and resources for complex research challenges",
    explanation: "Scientific collaboration combines expertise and resources to tackle complex research challenges that require diverse skills and perspectives.",
    difficulty: "adaptive",
    topic: "scientific-collaboration",
    relatedConcepts: ["expertise", "resources", "complex challenges"]
  },
  {
    question: "What is the role of science in education?",
    options: ["No role", "To develop critical thinking and problem-solving skills", "Only for science classes", "Only for higher education"],
    correctAnswer: "To develop critical thinking and problem-solving skills",
    explanation: "Science education develops critical thinking and problem-solving skills essential for navigating an increasingly complex world.",
    difficulty: "adaptive",
    topic: "science-education",
    relatedConcepts: ["critical thinking", "problem-solving", "essential skills"]
  }
];

async function generateNaturalSciencesQuestions() {
  try {
    console.log('🔬 GENERATING NATURAL SCIENCES QUIZ QUESTIONS\n');
    console.log('='.repeat(50));

    // Get the Natural Sciences category
    const naturalSciencesCategory = await prisma.category.findUnique({
      where: { name: 'Natural Sciences' }
    });

    if (!naturalSciencesCategory) {
      console.log('❌ Natural Sciences category not found');
      return;
    }

    console.log(`📁 Category: ${naturalSciencesCategory.name}`);
    console.log(`📝 Adding ${naturalSciencesQuestions.length} new questions...\n`);

    // Add the questions
    for (const questionData of naturalSciencesQuestions) {
      const question = await prisma.quizQuestion.create({
        data: {
          ...questionData,
          categoryId: naturalSciencesCategory.id
        }
      });
      console.log(`✅ Added: ${questionData.question.substring(0, 50)}... (${questionData.difficulty})`);
    }

    console.log('\n📊 VERIFICATION:');
    console.log('='.repeat(50));

    // Check the updated question count
    const updatedQuestions = await prisma.quizQuestion.findMany({
      where: { categoryId: naturalSciencesCategory.id }
    });

    const difficultyStats = {};
    updatedQuestions.forEach(q => {
      if (!difficultyStats[q.difficulty]) {
        difficultyStats[q.difficulty] = 0;
      }
      difficultyStats[q.difficulty]++;
    });

    console.log('\nUpdated Natural Sciences questions by difficulty:');
    Object.entries(difficultyStats).forEach(([difficulty, count]) => {
      const status = count >= 10 ? '✅' : '❌';
      console.log(`  ${difficulty}: ${count} questions ${status}`);
    });

    console.log(`\nTotal Natural Sciences questions: ${updatedQuestions.length}`);
    console.log('\n✅ Natural Sciences questions generated successfully!');

  } catch (error) {
    console.error('Error generating questions:', error);
  } finally {
    await prisma.$disconnect();
  }
}

generateNaturalSciencesQuestions(); 