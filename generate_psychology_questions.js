import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// Quiz questions for Psychology category
const psychologyQuestions = [
  // Additional Beginner Questions (need 8 more to reach 10)
  {
    question: "What is psychology?",
    options: ["The study of the brain", "The scientific study of behavior and mental processes", "The study of medicine", "The study of emotions only"],
    correctAnswer: "The scientific study of behavior and mental processes",
    explanation: "Psychology is the scientific study of behavior and mental processes, including thoughts, feelings, and actions.",
    difficulty: "beginner",
    topic: "general-psychology",
    relatedConcepts: ["behavior", "mental processes", "scientific study"]
  },
  {
    question: "What is memory?",
    options: ["A type of emotion", "The process of encoding, storing, and retrieving information", "A type of behavior", "A type of thought"],
    correctAnswer: "The process of encoding, storing, and retrieving information",
    explanation: "Memory is the cognitive process of encoding, storing, and retrieving information over time.",
    difficulty: "beginner",
    topic: "memory",
    relatedConcepts: ["encoding", "storage", "retrieval"]
  },
  {
    question: "What is learning?",
    options: ["A type of emotion", "A relatively permanent change in behavior due to experience", "A type of memory", "A type of thought"],
    correctAnswer: "A relatively permanent change in behavior due to experience",
    explanation: "Learning is a relatively permanent change in behavior, knowledge, or skills that occurs through experience.",
    difficulty: "beginner",
    topic: "learning",
    relatedConcepts: ["behavior change", "experience", "permanence"]
  },
  {
    question: "What is motivation?",
    options: ["A type of emotion", "The process that initiates, guides, and maintains goal-oriented behaviors", "A type of memory", "A type of thought"],
    correctAnswer: "The process that initiates, guides, and maintains goal-oriented behaviors",
    explanation: "Motivation is the process that initiates, guides, and maintains goal-oriented behaviors.",
    difficulty: "beginner",
    topic: "motivation",
    relatedConcepts: ["goals", "behavior", "initiation"]
  },
  {
    question: "What is perception?",
    options: ["A type of emotion", "The process of organizing and interpreting sensory information", "A type of memory", "A type of thought"],
    correctAnswer: "The process of organizing and interpreting sensory information",
    explanation: "Perception is the process of organizing and interpreting sensory information to give it meaning.",
    difficulty: "beginner",
    topic: "perception",
    relatedConcepts: ["sensory information", "organization", "interpretation"]
  },
  {
    question: "What is emotion?",
    options: ["A type of behavior", "A complex psychological and physiological state", "A type of memory", "A type of thought"],
    correctAnswer: "A complex psychological and physiological state",
    explanation: "Emotion is a complex psychological and physiological state that influences thoughts and behavior.",
    difficulty: "beginner",
    topic: "emotion",
    relatedConcepts: ["psychological state", "physiological state", "influence"]
  },
  {
    question: "What is personality?",
    options: ["A type of emotion", "The unique pattern of thoughts, feelings, and behaviors that characterize an individual", "A type of memory", "A type of behavior"],
    correctAnswer: "The unique pattern of thoughts, feelings, and behaviors that characterize an individual",
    explanation: "Personality refers to the unique pattern of thoughts, feelings, and behaviors that characterize an individual.",
    difficulty: "beginner",
    topic: "personality",
    relatedConcepts: ["uniqueness", "patterns", "characteristics"]
  },
  {
    question: "What is intelligence?",
    options: ["A type of emotion", "The ability to learn, understand, and apply knowledge", "A type of memory", "A type of behavior"],
    correctAnswer: "The ability to learn, understand, and apply knowledge",
    explanation: "Intelligence is the ability to learn, understand, reason, and apply knowledge to solve problems.",
    difficulty: "beginner",
    topic: "intelligence",
    relatedConcepts: ["learning", "understanding", "problem-solving"]
  },

  // Additional Intermediate Questions (need 7 more to reach 10)
  {
    question: "What is the difference between classical and operant conditioning?",
    options: ["No difference", "Classical conditioning involves involuntary responses, operant involves voluntary behaviors", "Classical is always better", "Operant is only for animals"],
    correctAnswer: "Classical conditioning involves involuntary responses, operant involves voluntary behaviors",
    explanation: "Classical conditioning involves involuntary responses to stimuli, while operant conditioning involves voluntary behaviors and their consequences.",
    difficulty: "intermediate",
    topic: "learning",
    relatedConcepts: ["involuntary", "voluntary", "consequences"]
  },
  {
    question: "What is cognitive dissonance?",
    options: ["A type of memory", "Mental discomfort from conflicting beliefs or behaviors", "A type of emotion", "A type of behavior"],
    correctAnswer: "Mental discomfort from conflicting beliefs or behaviors",
    explanation: "Cognitive dissonance is the mental discomfort experienced when holding conflicting beliefs, attitudes, or behaviors.",
    difficulty: "intermediate",
    topic: "social-psychology",
    relatedConcepts: ["conflict", "discomfort", "beliefs"]
  },
  {
    question: "What is the bystander effect?",
    options: ["A type of memory", "People are less likely to help when others are present", "A type of emotion", "A type of behavior"],
    correctAnswer: "People are less likely to help when others are present",
    explanation: "The bystander effect is a social psychological phenomenon where individuals are less likely to offer help when other people are present.",
    difficulty: "intermediate",
    topic: "social-psychology",
    relatedConcepts: ["helping behavior", "social influence", "group dynamics"]
  },
  {
    question: "What is the difference between short-term and long-term memory?",
    options: ["No difference", "Short-term is temporary, long-term is permanent", "Short-term is always better", "Long-term is only for important things"],
    correctAnswer: "Short-term is temporary, long-term is permanent",
    explanation: "Short-term memory holds information temporarily, while long-term memory stores information permanently.",
    difficulty: "intermediate",
    topic: "memory",
    relatedConcepts: ["temporary", "permanent", "storage"]
  },
  {
    question: "What is the role of the unconscious mind?",
    options: ["No role", "To influence behavior without conscious awareness", "To control all behavior", "To cause mental illness"],
    correctAnswer: "To influence behavior without conscious awareness",
    explanation: "The unconscious mind influences thoughts, feelings, and behaviors without conscious awareness.",
    difficulty: "intermediate",
    topic: "psychoanalysis",
    relatedConcepts: ["influence", "awareness", "behavior"]
  },
  {
    question: "What is the difference between nature and nurture?",
    options: ["No difference", "Nature refers to genetics, nurture refers to environment", "Nature is always more important", "Nurture is always more important"],
    correctAnswer: "Nature refers to genetics, nurture refers to environment",
    explanation: "Nature refers to genetic inheritance, while nurture refers to environmental influences on development.",
    difficulty: "intermediate",
    topic: "developmental-psychology",
    relatedConcepts: ["genetics", "environment", "development"]
  },
  {
    question: "What is the purpose of defense mechanisms?",
    options: ["To cause problems", "To protect the ego from anxiety", "To improve memory", "To change behavior"],
    correctAnswer: "To protect the ego from anxiety",
    explanation: "Defense mechanisms are psychological strategies used to protect the ego from anxiety and maintain psychological balance.",
    difficulty: "intermediate",
    topic: "psychoanalysis",
    relatedConcepts: ["protection", "anxiety", "ego"]
  },

  // Advanced Questions (need 10 total)
  {
    question: "What is the concept of neuroplasticity?",
    options: ["A type of memory", "The brain's ability to form new neural connections", "A type of emotion", "A type of behavior"],
    correctAnswer: "The brain's ability to form new neural connections",
    explanation: "Neuroplasticity is the brain's ability to form new neural connections and reorganize existing ones in response to experience.",
    difficulty: "advanced",
    topic: "neuroscience",
    relatedConcepts: ["neural connections", "reorganization", "experience"]
  },
  {
    question: "What is the difference between correlation and causation?",
    options: ["No difference", "Correlation shows relationship, causation shows cause-effect", "Correlation is always stronger", "Causation is always correlation"],
    correctAnswer: "Correlation shows relationship, causation shows cause-effect",
    explanation: "Correlation shows a relationship between variables, while causation demonstrates that one variable directly causes changes in another.",
    difficulty: "advanced",
    topic: "research-methods",
    relatedConcepts: ["relationship", "cause-effect", "variables"]
  },
  {
    question: "What is the concept of cognitive load?",
    options: ["A type of memory", "The amount of mental effort being used in working memory", "A type of emotion", "A type of behavior"],
    correctAnswer: "The amount of mental effort being used in working memory",
    explanation: "Cognitive load refers to the amount of mental effort being used in working memory to process information.",
    difficulty: "advanced",
    topic: "cognitive-psychology",
    relatedConcepts: ["mental effort", "working memory", "processing"]
  },
  {
    question: "What is the difference between implicit and explicit memory?",
    options: ["No difference", "Implicit is unconscious, explicit is conscious", "Implicit is always better", "Explicit is always conscious"],
    correctAnswer: "Implicit is unconscious, explicit is conscious",
    explanation: "Implicit memory operates unconsciously, while explicit memory involves conscious recollection of information.",
    difficulty: "advanced",
    topic: "memory",
    relatedConcepts: ["unconscious", "conscious", "recollection"]
  },
  {
    question: "What is the concept of attachment theory?",
    options: ["A type of memory", "The theory of emotional bonds between individuals", "A type of emotion", "A type of behavior"],
    correctAnswer: "The theory of emotional bonds between individuals",
    explanation: "Attachment theory describes the emotional bonds that develop between individuals, particularly in early relationships.",
    difficulty: "advanced",
    topic: "developmental-psychology",
    relatedConcepts: ["emotional bonds", "relationships", "development"]
  },
  {
    question: "What is the role of neurotransmitters in behavior?",
    options: ["No role", "To transmit signals between neurons and influence behavior", "To cause mental illness", "To control all behavior"],
    correctAnswer: "To transmit signals between neurons and influence behavior",
    explanation: "Neurotransmitters are chemical messengers that transmit signals between neurons and influence various behaviors and mental processes.",
    difficulty: "advanced",
    topic: "neuroscience",
    relatedConcepts: ["chemical messengers", "signals", "influence"]
  },
  {
    question: "What is the concept of cognitive bias?",
    options: ["A type of memory", "Systematic errors in thinking that affect judgment", "A type of emotion", "A type of behavior"],
    correctAnswer: "Systematic errors in thinking that affect judgment",
    explanation: "Cognitive biases are systematic errors in thinking that affect judgment and decision-making processes.",
    difficulty: "advanced",
    topic: "cognitive-psychology",
    relatedConcepts: ["errors", "judgment", "decision-making"]
  },
  {
    question: "What is the difference between positive and negative reinforcement?",
    options: ["No difference", "Positive adds something pleasant, negative removes something unpleasant", "Positive is always better", "Negative is always punishment"],
    correctAnswer: "Positive adds something pleasant, negative removes something unpleasant",
    explanation: "Positive reinforcement adds something pleasant to increase behavior, while negative reinforcement removes something unpleasant to increase behavior.",
    difficulty: "advanced",
    topic: "learning",
    relatedConcepts: ["addition", "removal", "behavior increase"]
  },
  {
    question: "What is the concept of emotional intelligence?",
    options: ["A type of memory", "The ability to understand and manage emotions", "A type of emotion", "A type of behavior"],
    correctAnswer: "The ability to understand and manage emotions",
    explanation: "Emotional intelligence is the ability to understand, use, and manage emotions effectively in oneself and others.",
    difficulty: "advanced",
    topic: "emotion",
    relatedConcepts: ["understanding", "management", "effectiveness"]
  },
  {
    question: "What is the role of the placebo effect in psychology?",
    options: ["No role", "The phenomenon where expectations influence outcomes", "To cause harm", "To replace treatment"],
    correctAnswer: "The phenomenon where expectations influence outcomes",
    explanation: "The placebo effect is the phenomenon where a person's expectations or beliefs about a treatment influence their response to it.",
    difficulty: "advanced",
    topic: "clinical-psychology",
    relatedConcepts: ["expectations", "beliefs", "influence"]
  },

  // Adaptive Questions (need 10 total)
  {
    question: "What is the importance of mental health?",
    options: ["Not important", "It affects overall well-being and quality of life", "Only affects emotions", "Only affects behavior"],
    correctAnswer: "It affects overall well-being and quality of life",
    explanation: "Mental health is crucial for overall well-being, affecting physical health, relationships, and quality of life.",
    difficulty: "adaptive",
    topic: "mental-health",
    relatedConcepts: ["well-being", "quality of life", "relationships"]
  },
  {
    question: "What is the role of therapy in psychology?",
    options: ["No role", "To help people understand and change problematic thoughts and behaviors", "To control people", "To replace medication"],
    correctAnswer: "To help people understand and change problematic thoughts and behaviors",
    explanation: "Therapy helps people understand and change problematic thoughts, feelings, and behaviors to improve mental health.",
    difficulty: "adaptive",
    topic: "clinical-psychology",
    relatedConcepts: ["understanding", "change", "improvement"]
  },
  {
    question: "What is the importance of self-awareness?",
    options: ["Not important", "It helps understand thoughts, feelings, and behaviors", "Only affects emotions", "Only affects memory"],
    correctAnswer: "It helps understand thoughts, feelings, and behaviors",
    explanation: "Self-awareness helps individuals understand their thoughts, feelings, and behaviors, leading to better decision-making and personal growth.",
    difficulty: "adaptive",
    topic: "self-awareness",
    relatedConcepts: ["understanding", "decision-making", "growth"]
  },
  {
    question: "What is the role of stress in psychology?",
    options: ["No role", "It can both motivate and harm depending on intensity and duration", "Always harmful", "Always beneficial"],
    correctAnswer: "It can both motivate and harm depending on intensity and duration",
    explanation: "Stress can be motivating in small amounts but harmful when chronic or excessive, affecting both physical and mental health.",
    difficulty: "adaptive",
    topic: "stress",
    relatedConcepts: ["motivation", "harm", "intensity"]
  },
  {
    question: "What is the importance of social connections?",
    options: ["Not important", "They support mental health and well-being", "Only affect emotions", "Only affect behavior"],
    correctAnswer: "They support mental health and well-being",
    explanation: "Social connections support mental health, reduce stress, and contribute to overall well-being and life satisfaction.",
    difficulty: "adaptive",
    topic: "social-psychology",
    relatedConcepts: ["support", "stress reduction", "well-being"]
  },
  {
    question: "What is the role of resilience in psychology?",
    options: ["No role", "The ability to adapt and recover from adversity", "To avoid problems", "To control others"],
    correctAnswer: "The ability to adapt and recover from adversity",
    explanation: "Resilience is the ability to adapt and recover from adversity, helping individuals cope with challenges and maintain mental health.",
    difficulty: "adaptive",
    topic: "resilience",
    relatedConcepts: ["adaptation", "recovery", "coping"]
  },
  {
    question: "What is the importance of emotional regulation?",
    options: ["Not important", "It helps manage emotions effectively and maintain mental health", "Only affects emotions", "Only affects behavior"],
    correctAnswer: "It helps manage emotions effectively and maintain mental health",
    explanation: "Emotional regulation helps individuals manage their emotions effectively, leading to better relationships and mental health.",
    difficulty: "adaptive",
    topic: "emotion-regulation",
    relatedConcepts: ["management", "effectiveness", "relationships"]
  },
  {
    question: "What is the role of mindfulness in psychology?",
    options: ["No role", "To increase awareness of present moment and reduce stress", "To control thoughts", "To replace therapy"],
    correctAnswer: "To increase awareness of present moment and reduce stress",
    explanation: "Mindfulness increases awareness of the present moment, reduces stress, and improves mental well-being.",
    difficulty: "adaptive",
    topic: "mindfulness",
    relatedConcepts: ["awareness", "present moment", "stress reduction"]
  },
  {
    question: "What is the importance of psychological research?",
    options: ["Not important", "To understand human behavior and improve mental health treatments", "Only for academics", "Only for therapists"],
    correctAnswer: "To understand human behavior and improve mental health treatments",
    explanation: "Psychological research helps understand human behavior, develop effective treatments, and improve mental health outcomes.",
    difficulty: "adaptive",
    topic: "research",
    relatedConcepts: ["understanding", "treatments", "improvement"]
  },
  {
    question: "What is the role of positive psychology?",
    options: ["No role", "To study and promote human flourishing and well-being", "To ignore problems", "To replace traditional psychology"],
    correctAnswer: "To study and promote human flourishing and well-being",
    explanation: "Positive psychology focuses on studying and promoting human flourishing, strengths, and well-being.",
    difficulty: "adaptive",
    topic: "positive-psychology",
    relatedConcepts: ["flourishing", "strengths", "well-being"]
  }
];

async function generatePsychologyQuestions() {
  try {
    console.log('🎯 GENERATING PSYCHOLOGY QUIZ QUESTIONS\n');
    console.log('='.repeat(50));

    // Get the Psychology category
    const psychologyCategory = await prisma.category.findUnique({
      where: { name: 'Psychology' }
    });

    if (!psychologyCategory) {
      console.log('❌ Psychology category not found');
      return;
    }

    console.log(`📁 Category: ${psychologyCategory.name}`);
    console.log(`📝 Adding ${psychologyQuestions.length} new questions...\n`);

    // Add the questions
    for (const questionData of psychologyQuestions) {
      const question = await prisma.quizQuestion.create({
        data: {
          ...questionData,
          categoryId: psychologyCategory.id
        }
      });
      console.log(`✅ Added: ${questionData.question.substring(0, 50)}... (${questionData.difficulty})`);
    }

    console.log('\n📊 VERIFICATION:');
    console.log('='.repeat(50));

    // Check the updated question count
    const updatedQuestions = await prisma.quizQuestion.findMany({
      where: { categoryId: psychologyCategory.id }
    });

    const difficultyStats = {};
    updatedQuestions.forEach(q => {
      if (!difficultyStats[q.difficulty]) {
        difficultyStats[q.difficulty] = 0;
      }
      difficultyStats[q.difficulty]++;
    });

    console.log('\nUpdated Psychology questions by difficulty:');
    Object.entries(difficultyStats).forEach(([difficulty, count]) => {
      const status = count >= 10 ? '✅' : '❌';
      console.log(`  ${difficulty}: ${count} questions ${status}`);
    });

    console.log(`\nTotal Psychology questions: ${updatedQuestions.length}`);
    console.log('\n✅ Psychology questions generated successfully!');

  } catch (error) {
    console.error('Error generating questions:', error);
  } finally {
    await prisma.$disconnect();
  }
}

generatePsychologyQuestions(); 