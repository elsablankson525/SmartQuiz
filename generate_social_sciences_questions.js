import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// Quiz questions for Social Sciences category
const socialSciencesQuestions = [
  // Additional Beginner Questions (need 7 more to reach 10)
  {
    question: "What are the social sciences?",
    options: ["Only psychology", "Academic disciplines that study human society and social relationships", "Only sociology", "Only economics"],
    correctAnswer: "Academic disciplines that study human society and social relationships",
    explanation: "Social sciences are academic disciplines that study human society, social relationships, and human behavior in groups.",
    difficulty: "beginner",
    topic: "social-sciences-overview",
    relatedConcepts: ["human society", "social relationships", "human behavior"]
  },
  {
    question: "What is sociology?",
    options: ["A type of psychology", "The study of human society, social relationships, and social institutions", "A type of economics", "A type of history"],
    correctAnswer: "The study of human society, social relationships, and social institutions",
    explanation: "Sociology is the study of human society, social relationships, and social institutions, examining how people interact and organize themselves.",
    difficulty: "beginner",
    topic: "sociology",
    relatedConcepts: ["human society", "social relationships", "social institutions"]
  },
  {
    question: "What is economics?",
    options: ["Only money", "The study of how people allocate scarce resources to satisfy unlimited wants", "Only business", "Only finance"],
    correctAnswer: "The study of how people allocate scarce resources to satisfy unlimited wants",
    explanation: "Economics studies how people allocate scarce resources to satisfy unlimited wants, examining production, distribution, and consumption.",
    difficulty: "beginner",
    topic: "economics",
    relatedConcepts: ["scarce resources", "allocation", "unlimited wants"]
  },
  {
    question: "What is anthropology?",
    options: ["Only ancient history", "The study of human cultures, societies, and development across time and space", "Only archaeology", "Only fossils"],
    correctAnswer: "The study of human cultures, societies, and development across time and space",
    explanation: "Anthropology studies human cultures, societies, and development across time and space, examining human diversity and evolution.",
    difficulty: "beginner",
    topic: "anthropology",
    relatedConcepts: ["human cultures", "societies", "human development"]
  },
  {
    question: "What is political science?",
    options: ["Only government", "The study of political systems, power, and governance", "Only elections", "Only laws"],
    correctAnswer: "The study of political systems, power, and governance",
    explanation: "Political science studies political systems, power dynamics, and governance structures at local, national, and international levels.",
    difficulty: "beginner",
    topic: "political-science",
    relatedConcepts: ["political systems", "power", "governance"]
  },
  {
    question: "What is the purpose of social research?",
    options: ["Only to collect data", "To understand social phenomena and human behavior through systematic investigation", "Only to make surveys", "Only to study statistics"],
    correctAnswer: "To understand social phenomena and human behavior through systematic investigation",
    explanation: "Social research aims to understand social phenomena and human behavior through systematic investigation using various methods.",
    difficulty: "beginner",
    topic: "social-research",
    relatedConcepts: ["social phenomena", "human behavior", "systematic investigation"]
  },
  {
    question: "What is the role of culture in society?",
    options: ["Only for entertainment", "To provide shared beliefs, values, and practices that guide social behavior", "Only for art", "Only for religion"],
    correctAnswer: "To provide shared beliefs, values, and practices that guide social behavior",
    explanation: "Culture provides shared beliefs, values, and practices that guide social behavior and create group identity.",
    difficulty: "beginner",
    topic: "cultural-studies",
    relatedConcepts: ["shared beliefs", "values", "social behavior"]
  },

  // Additional Intermediate Questions (need 8 more to reach 10)
  {
    question: "What is the difference between qualitative and quantitative research?",
    options: ["No difference", "Qualitative explores meanings, quantitative measures numerical data", "Qualitative is always better", "Quantitative is always better"],
    correctAnswer: "Qualitative explores meanings, quantitative measures numerical data",
    explanation: "Qualitative research explores meanings and experiences, while quantitative research measures numerical data and statistical relationships.",
    difficulty: "intermediate",
    topic: "research-methods",
    relatedConcepts: ["meanings", "numerical data", "statistical relationships"]
  },
  {
    question: "What is the concept of social stratification?",
    options: ["A type of society", "The hierarchical arrangement of individuals into social classes or groups", "A type of culture", "A type of government"],
    correctAnswer: "The hierarchical arrangement of individuals into social classes or groups",
    explanation: "Social stratification is the hierarchical arrangement of individuals into social classes or groups based on factors like wealth, power, and status.",
    difficulty: "intermediate",
    topic: "social-stratification",
    relatedConcepts: ["hierarchical arrangement", "social classes", "wealth and power"]
  },
  {
    question: "What is the role of institutions in society?",
    options: ["No role", "To provide stable patterns of social behavior and organization", "Only for government", "Only for education"],
    correctAnswer: "To provide stable patterns of social behavior and organization",
    explanation: "Social institutions provide stable patterns of social behavior and organization, such as family, education, religion, and government.",
    difficulty: "intermediate",
    topic: "social-institutions",
    relatedConcepts: ["stable patterns", "social behavior", "organization"]
  },
  {
    question: "What is the concept of social change?",
    options: ["A type of event", "The transformation of social structures, institutions, and relationships over time", "A type of revolution", "A type of reform"],
    correctAnswer: "The transformation of social structures, institutions, and relationships over time",
    explanation: "Social change refers to the transformation of social structures, institutions, and relationships over time due to various factors.",
    difficulty: "intermediate",
    topic: "social-change",
    relatedConcepts: ["transformation", "social structures", "time"]
  },
  {
    question: "What is the importance of social theory?",
    options: ["Not important", "To provide frameworks for understanding and explaining social phenomena", "Only for academics", "Only for research"],
    correctAnswer: "To provide frameworks for understanding and explaining social phenomena",
    explanation: "Social theory provides frameworks for understanding and explaining social phenomena, guiding research and analysis.",
    difficulty: "intermediate",
    topic: "social-theory",
    relatedConcepts: ["frameworks", "understanding", "explanation"]
  },
  {
    question: "What is the concept of globalization?",
    options: ["A type of trade", "The increasing interconnectedness of societies and economies worldwide", "A type of culture", "A type of technology"],
    correctAnswer: "The increasing interconnectedness of societies and economies worldwide",
    explanation: "Globalization refers to the increasing interconnectedness of societies and economies worldwide through trade, technology, and cultural exchange.",
    difficulty: "intermediate",
    topic: "globalization",
    relatedConcepts: ["interconnectedness", "societies", "economies"]
  },
  {
    question: "What is the role of social movements?",
    options: ["No role", "To advocate for social change and address collective grievances", "Only for protests", "Only for politics"],
    correctAnswer: "To advocate for social change and address collective grievances",
    explanation: "Social movements advocate for social change and address collective grievances, often challenging existing power structures.",
    difficulty: "intermediate",
    topic: "social-movements",
    relatedConcepts: ["social change", "collective grievances", "power structures"]
  },
  {
    question: "What is the concept of social identity?",
    options: ["A type of document", "How individuals define themselves in relation to social groups", "A type of culture", "A type of personality"],
    correctAnswer: "How individuals define themselves in relation to social groups",
    explanation: "Social identity refers to how individuals define themselves in relation to social groups, including race, gender, class, and nationality.",
    difficulty: "intermediate",
    topic: "social-identity",
    relatedConcepts: ["self-definition", "social groups", "group membership"]
  },

  // Advanced Questions (need 10 total)
  {
    question: "What is the concept of social constructionism?",
    options: ["A type of building", "The theory that social reality is created through human interaction and shared meanings", "A type of theory", "A type of method"],
    correctAnswer: "The theory that social reality is created through human interaction and shared meanings",
    explanation: "Social constructionism argues that social reality is created through human interaction and shared meanings rather than existing independently.",
    difficulty: "advanced",
    topic: "social-constructionism",
    relatedConcepts: ["social reality", "human interaction", "shared meanings"]
  },
  {
    question: "What is the role of power in social relationships?",
    options: ["No role", "To influence others' behavior and control access to resources", "Only in politics", "Only in economics"],
    correctAnswer: "To influence others' behavior and control access to resources",
    explanation: "Power in social relationships involves the ability to influence others' behavior and control access to resources and opportunities.",
    difficulty: "advanced",
    topic: "power-and-society",
    relatedConcepts: ["influence", "behavior control", "resource access"]
  },
  {
    question: "What is the concept of social capital?",
    options: ["A type of money", "Networks of relationships that provide social and economic benefits", "A type of investment", "A type of resource"],
    correctAnswer: "Networks of relationships that provide social and economic benefits",
    explanation: "Social capital refers to networks of relationships that provide social and economic benefits through trust, cooperation, and shared norms.",
    difficulty: "advanced",
    topic: "social-capital",
    relatedConcepts: ["networks", "relationships", "benefits"]
  },
  {
    question: "What is the role of discourse in shaping society?",
    options: ["No role", "To construct meaning and influence how people understand social issues", "Only in language", "Only in media"],
    correctAnswer: "To construct meaning and influence how people understand social issues",
    explanation: "Discourse constructs meaning and influences how people understand social issues, shaping public opinion and policy.",
    difficulty: "advanced",
    topic: "discourse-analysis",
    relatedConcepts: ["meaning construction", "understanding", "public opinion"]
  },
  {
    question: "What is the concept of intersectionality?",
    options: ["A type of theory", "How multiple social identities interact to create unique experiences of privilege and oppression", "A type of method", "A type of analysis"],
    correctAnswer: "How multiple social identities interact to create unique experiences of privilege and oppression",
    explanation: "Intersectionality examines how multiple social identities (race, gender, class) interact to create unique experiences of privilege and oppression.",
    difficulty: "advanced",
    topic: "intersectionality",
    relatedConcepts: ["multiple identities", "privilege", "oppression"]
  },
  {
    question: "What is the role of social networks in society?",
    options: ["No role", "To facilitate information flow, social support, and resource access", "Only for social media", "Only for business"],
    correctAnswer: "To facilitate information flow, social support, and resource access",
    explanation: "Social networks facilitate information flow, social support, and resource access, connecting individuals and groups.",
    difficulty: "advanced",
    topic: "social-networks",
    relatedConcepts: ["information flow", "social support", "resource access"]
  },
  {
    question: "What is the concept of social reproduction?",
    options: ["A type of process", "How societies maintain social inequalities across generations", "A type of theory", "A type of method"],
    correctAnswer: "How societies maintain social inequalities across generations",
    explanation: "Social reproduction refers to how societies maintain social inequalities across generations through institutions like education and family.",
    difficulty: "advanced",
    topic: "social-reproduction",
    relatedConcepts: ["social inequalities", "generations", "institutions"]
  },
  {
    question: "What is the role of social policy in addressing inequality?",
    options: ["No role", "To design interventions that reduce social disparities and promote equity", "Only for government", "Only for welfare"],
    correctAnswer: "To design interventions that reduce social disparities and promote equity",
    explanation: "Social policy designs interventions that reduce social disparities and promote equity through targeted programs and reforms.",
    difficulty: "advanced",
    topic: "social-policy",
    relatedConcepts: ["interventions", "social disparities", "equity"]
  },
  {
    question: "What is the concept of social justice?",
    options: ["A type of law", "The fair and equitable distribution of resources, opportunities, and privileges in society", "A type of policy", "A type of movement"],
    correctAnswer: "The fair and equitable distribution of resources, opportunities, and privileges in society",
    explanation: "Social justice involves the fair and equitable distribution of resources, opportunities, and privileges across all members of society.",
    difficulty: "advanced",
    topic: "social-justice",
    relatedConcepts: ["fair distribution", "equity", "opportunities"]
  },
  {
    question: "What is the role of social research in policy-making?",
    options: ["No role", "To provide evidence-based information for informed policy decisions", "Only for academics", "Only for government"],
    correctAnswer: "To provide evidence-based information for informed policy decisions",
    explanation: "Social research provides evidence-based information that helps policymakers make informed decisions on complex social issues.",
    difficulty: "advanced",
    topic: "research-policy",
    relatedConcepts: ["evidence-based", "informed decisions", "policy-making"]
  },

  // Adaptive Questions (need 10 total)
  {
    question: "What is the importance of social sciences in addressing contemporary challenges?",
    options: ["Not important", "To provide insights for solving complex social problems", "Only for academics", "Only for research"],
    correctAnswer: "To provide insights for solving complex social problems",
    explanation: "Social sciences provide crucial insights for solving complex social problems like inequality, climate change, and political polarization.",
    difficulty: "adaptive",
    topic: "social-sciences-impact",
    relatedConcepts: ["insights", "complex problems", "social challenges"]
  },
  {
    question: "What is the role of social sciences in promoting human rights?",
    options: ["No role", "To document violations and advocate for protection of human dignity", "Only for law", "Only for government"],
    correctAnswer: "To document violations and advocate for protection of human dignity",
    explanation: "Social sciences document human rights violations and advocate for the protection of human dignity and fundamental freedoms.",
    difficulty: "adaptive",
    topic: "human-rights",
    relatedConcepts: ["documentation", "advocacy", "human dignity"]
  },
  {
    question: "What is the importance of cross-cultural understanding in social sciences?",
    options: ["Not important", "To promote tolerance and cooperation in diverse societies", "Only for anthropology", "Only for international relations"],
    correctAnswer: "To promote tolerance and cooperation in diverse societies",
    explanation: "Cross-cultural understanding promotes tolerance and cooperation in diverse societies by reducing prejudice and fostering mutual respect.",
    difficulty: "adaptive",
    topic: "cross-cultural-studies",
    relatedConcepts: ["tolerance", "cooperation", "diverse societies"]
  },
  {
    question: "What is the role of social sciences in environmental sustainability?",
    options: ["No role", "To understand human-environment interactions and promote sustainable practices", "Only for ecology", "Only for policy"],
    correctAnswer: "To understand human-environment interactions and promote sustainable practices",
    explanation: "Social sciences help understand human-environment interactions and promote sustainable practices through behavioral and policy research.",
    difficulty: "adaptive",
    topic: "environmental-social-sciences",
    relatedConcepts: ["human-environment", "sustainable practices", "behavioral research"]
  },
  {
    question: "What is the importance of social sciences in education?",
    options: ["Not important", "To develop critical thinking and social awareness in students", "Only for social studies", "Only for higher education"],
    correctAnswer: "To develop critical thinking and social awareness in students",
    explanation: "Social sciences develop critical thinking and social awareness in students, preparing them for active citizenship and informed decision-making.",
    difficulty: "adaptive",
    topic: "social-sciences-education",
    relatedConcepts: ["critical thinking", "social awareness", "citizenship"]
  },
  {
    question: "What is the role of social sciences in public health?",
    options: ["No role", "To understand social determinants of health and design effective interventions", "Only for medicine", "Only for epidemiology"],
    correctAnswer: "To understand social determinants of health and design effective interventions",
    explanation: "Social sciences help understand social determinants of health and design effective public health interventions and policies.",
    difficulty: "adaptive",
    topic: "public-health-social-sciences",
    relatedConcepts: ["social determinants", "health interventions", "public health"]
  },
  {
    question: "What is the importance of social sciences in conflict resolution?",
    options: ["Not important", "To understand root causes and develop peaceful solutions", "Only for international relations", "Only for diplomacy"],
    correctAnswer: "To understand root causes and develop peaceful solutions",
    explanation: "Social sciences help understand the root causes of conflicts and develop peaceful solutions through dialogue and reconciliation.",
    difficulty: "adaptive",
    topic: "conflict-resolution",
    relatedConcepts: ["root causes", "peaceful solutions", "dialogue"]
  },
  {
    question: "What is the role of social sciences in economic development?",
    options: ["No role", "To understand social factors that influence economic growth and well-being", "Only for economics", "Only for business"],
    correctAnswer: "To understand social factors that influence economic growth and well-being",
    explanation: "Social sciences help understand social factors that influence economic growth and well-being, informing development policies.",
    difficulty: "adaptive",
    topic: "economic-development",
    relatedConcepts: ["social factors", "economic growth", "well-being"]
  },
  {
    question: "What is the importance of social sciences in media and communication?",
    options: ["Not important", "To understand how media shapes public opinion and social behavior", "Only for journalism", "Only for advertising"],
    correctAnswer: "To understand how media shapes public opinion and social behavior",
    explanation: "Social sciences help understand how media shapes public opinion and social behavior, informing media literacy and communication strategies.",
    difficulty: "adaptive",
    topic: "media-social-sciences",
    relatedConcepts: ["public opinion", "social behavior", "media literacy"]
  },
  {
    question: "What is the role of social sciences in community development?",
    options: ["No role", "To empower communities and promote participatory development", "Only for local government", "Only for NGOs"],
    correctAnswer: "To empower communities and promote participatory development",
    explanation: "Social sciences empower communities and promote participatory development by understanding local needs and building capacity.",
    difficulty: "adaptive",
    topic: "community-development",
    relatedConcepts: ["empowerment", "participatory development", "local needs"]
  }
];

async function generateSocialSciencesQuestions() {
  try {
    console.log('🌍 GENERATING SOCIAL SCIENCES QUIZ QUESTIONS\n');
    console.log('='.repeat(50));

    // Get the Social Sciences category
    const socialSciencesCategory = await prisma.category.findUnique({
      where: { name: 'Social Sciences' }
    });

    if (!socialSciencesCategory) {
      console.log('❌ Social Sciences category not found');
      return;
    }

    console.log(`📁 Category: ${socialSciencesCategory.name}`);
    console.log(`📝 Adding ${socialSciencesQuestions.length} new questions...\n`);

    // Add the questions
    for (const questionData of socialSciencesQuestions) {
      const question = await prisma.quizQuestion.create({
        data: {
          ...questionData,
          categoryId: socialSciencesCategory.id
        }
      });
      console.log(`✅ Added: ${questionData.question.substring(0, 50)}... (${questionData.difficulty})`);
    }

    console.log('\n📊 VERIFICATION:');
    console.log('='.repeat(50));

    // Check the updated question count
    const updatedQuestions = await prisma.quizQuestion.findMany({
      where: { categoryId: socialSciencesCategory.id }
    });

    const difficultyStats = {};
    updatedQuestions.forEach(q => {
      if (!difficultyStats[q.difficulty]) {
        difficultyStats[q.difficulty] = 0;
      }
      difficultyStats[q.difficulty]++;
    });

    console.log('\nUpdated Social Sciences questions by difficulty:');
    Object.entries(difficultyStats).forEach(([difficulty, count]) => {
      const status = count >= 10 ? '✅' : '❌';
      console.log(`  ${difficulty}: ${count} questions ${status}`);
    });

    console.log(`\nTotal Social Sciences questions: ${updatedQuestions.length}`);
    console.log('\n✅ Social Sciences questions generated successfully!');

  } catch (error) {
    console.error('Error generating questions:', error);
  } finally {
    await prisma.$disconnect();
  }
}

generateSocialSciencesQuestions(); 