import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// Quiz questions for Health & Medicine category
const healthQuestions = [
  // Additional Beginner Questions (need 6 more to reach 10)
  {
    question: "What is the main function of the heart?",
    options: ["To digest food", "To pump blood throughout the body", "To produce hormones", "To filter waste"],
    correctAnswer: "To pump blood throughout the body",
    explanation: "The heart's primary function is to pump blood throughout the body, delivering oxygen and nutrients to tissues and removing waste products.",
    difficulty: "beginner",
    topic: "anatomy",
    relatedConcepts: ["cardiovascular", "circulation", "oxygen"]
  },
  {
    question: "What is the recommended daily water intake for adults?",
    options: ["4-6 cups", "6-8 cups", "8-10 cups", "10-12 cups"],
    correctAnswer: "8-10 cups",
    explanation: "The general recommendation is about 8-10 cups (64-80 ounces) of water daily for adults, though individual needs vary based on activity level and climate.",
    difficulty: "beginner",
    topic: "nutrition",
    relatedConcepts: ["hydration", "daily requirements", "health maintenance"]
  },
  {
    question: "What is the normal resting heart rate for adults?",
    options: ["40-60 bpm", "60-100 bpm", "100-140 bpm", "140-180 bpm"],
    correctAnswer: "60-100 bpm",
    explanation: "The normal resting heart rate for adults is typically between 60-100 beats per minute. Athletes may have lower resting heart rates due to cardiovascular fitness.",
    difficulty: "beginner",
    topic: "physiology",
    relatedConcepts: ["heart rate", "cardiovascular", "vital signs"]
  },
  {
    question: "What is the largest organ in the human body?",
    options: ["Heart", "Liver", "Skin", "Brain"],
    correctAnswer: "Skin",
    explanation: "The skin is the largest organ in the human body, covering approximately 20 square feet in adults. It serves multiple functions including protection, temperature regulation, and sensation.",
    difficulty: "beginner",
    topic: "anatomy",
    relatedConcepts: ["organs", "integumentary system", "body systems"]
  },
  {
    question: "Which vitamin is primarily produced when skin is exposed to sunlight?",
    options: ["Vitamin A", "Vitamin C", "Vitamin D", "Vitamin K"],
    correctAnswer: "Vitamin D",
    explanation: "Vitamin D is synthesized in the skin when exposed to UVB radiation from sunlight. The skin converts 7-dehydrocholesterol to previtamin D3, which then becomes vitamin D3.",
    difficulty: "beginner",
    topic: "nutrition",
    relatedConcepts: ["vitamins", "metabolism", "sunlight"]
  },
  {
    question: "What is the primary function of the lungs?",
    options: ["To pump blood", "To exchange oxygen and carbon dioxide", "To digest food", "To filter waste"],
    correctAnswer: "To exchange oxygen and carbon dioxide",
    explanation: "The lungs are responsible for gas exchange, taking in oxygen from the air and releasing carbon dioxide from the bloodstream.",
    difficulty: "beginner",
    topic: "anatomy",
    relatedConcepts: ["respiration", "gas exchange", "oxygen"]
  },

  // Additional Intermediate Questions (need 9 more to reach 10)
  {
    question: "What is the difference between systolic and diastolic blood pressure?",
    options: ["No difference", "Systolic is when heart contracts, diastolic is when heart relaxes", "Systolic is always higher", "Diastolic measures oxygen levels"],
    correctAnswer: "Systolic is when heart contracts, diastolic is when heart relaxes",
    explanation: "Systolic pressure occurs when the heart contracts and pumps blood, while diastolic pressure occurs when the heart relaxes and fills with blood.",
    difficulty: "intermediate",
    topic: "physiology",
    relatedConcepts: ["blood pressure", "cardiac cycle", "measurement"]
  },
  {
    question: "What is the role of insulin in the body?",
    options: ["To break down food", "To regulate blood sugar levels", "To produce energy", "To fight infection"],
    correctAnswer: "To regulate blood sugar levels",
    explanation: "Insulin is a hormone produced by the pancreas that helps regulate blood sugar levels by allowing glucose to enter cells for energy production.",
    difficulty: "intermediate",
    topic: "physiology",
    relatedConcepts: ["hormones", "glucose", "metabolism"]
  },
  {
    question: "What is the purpose of the immune system?",
    options: ["To digest food", "To protect against disease and infection", "To pump blood", "To produce hormones"],
    correctAnswer: "To protect against disease and infection",
    explanation: "The immune system is the body's defense mechanism against pathogens, including bacteria, viruses, and other harmful microorganisms.",
    difficulty: "intermediate",
    topic: "immunology",
    relatedConcepts: ["defense", "pathogens", "protection"]
  },
  {
    question: "What is the difference between aerobic and anaerobic exercise?",
    options: ["No difference", "Aerobic uses oxygen, anaerobic doesn't", "Aerobic is always better", "Anaerobic is for athletes only"],
    correctAnswer: "Aerobic uses oxygen, anaerobic doesn't",
    explanation: "Aerobic exercise uses oxygen to produce energy and can be sustained for longer periods, while anaerobic exercise doesn't require oxygen and is high-intensity but short-duration.",
    difficulty: "intermediate",
    topic: "exercise",
    relatedConcepts: ["oxygen", "energy", "intensity"]
  },
  {
    question: "What is the function of the nervous system?",
    options: ["To pump blood", "To coordinate body activities and respond to stimuli", "To digest food", "To produce hormones"],
    correctAnswer: "To coordinate body activities and respond to stimuli",
    explanation: "The nervous system coordinates all body activities, processes sensory information, and enables responses to internal and external stimuli.",
    difficulty: "intermediate",
    topic: "physiology",
    relatedConcepts: ["coordination", "sensory", "response"]
  },
  {
    question: "What is the role of antioxidants in the body?",
    options: ["To provide energy", "To neutralize harmful free radicals", "To build muscle", "To digest food"],
    correctAnswer: "To neutralize harmful free radicals",
    explanation: "Antioxidants help neutralize harmful free radicals that can damage cells and contribute to aging and disease.",
    difficulty: "intermediate",
    topic: "nutrition",
    relatedConcepts: ["free radicals", "cell protection", "aging"]
  },
  {
    question: "What is the difference between acute and chronic conditions?",
    options: ["No difference", "Acute is sudden and short-term, chronic is long-term", "Acute is always serious", "Chronic is always mild"],
    correctAnswer: "Acute is sudden and short-term, chronic is long-term",
    explanation: "Acute conditions develop suddenly and are typically short-term, while chronic conditions develop slowly and persist over a long period.",
    difficulty: "intermediate",
    topic: "medicine",
    relatedConcepts: ["duration", "severity", "management"]
  },
  {
    question: "What is the purpose of the digestive system?",
    options: ["To pump blood", "To break down food and absorb nutrients", "To produce hormones", "To fight infection"],
    correctAnswer: "To break down food and absorb nutrients",
    explanation: "The digestive system breaks down food into smaller molecules that can be absorbed and used by the body for energy and growth.",
    difficulty: "intermediate",
    topic: "anatomy",
    relatedConcepts: ["digestion", "absorption", "nutrients"]
  },
  {
    question: "What is the role of the endocrine system?",
    options: ["To pump blood", "To produce and regulate hormones", "To digest food", "To fight infection"],
    correctAnswer: "To produce and regulate hormones",
    explanation: "The endocrine system produces and regulates hormones that control various body functions including metabolism, growth, and reproduction.",
    difficulty: "intermediate",
    topic: "physiology",
    relatedConcepts: ["hormones", "regulation", "metabolism"]
  },

  // Advanced Questions (need 10 total)
  {
    question: "What is the mechanism of action of antibiotics?",
    options: ["To boost the immune system", "To kill or inhibit bacterial growth", "To reduce inflammation", "To increase energy"],
    correctAnswer: "To kill or inhibit bacterial growth",
    explanation: "Antibiotics work by either killing bacteria directly or inhibiting their growth and reproduction, allowing the immune system to eliminate the infection.",
    difficulty: "advanced",
    topic: "pharmacology",
    relatedConcepts: ["bacteria", "infection", "treatment"]
  },
  {
    question: "What is the difference between Type 1 and Type 2 diabetes?",
    options: ["No difference", "Type 1 is autoimmune, Type 2 is lifestyle-related", "Type 1 is more common", "Type 2 is always genetic"],
    correctAnswer: "Type 1 is autoimmune, Type 2 is lifestyle-related",
    explanation: "Type 1 diabetes is an autoimmune condition where the body attacks insulin-producing cells, while Type 2 diabetes is typically related to lifestyle factors and insulin resistance.",
    difficulty: "advanced",
    topic: "endocrinology",
    relatedConcepts: ["autoimmunity", "insulin", "lifestyle"]
  },
  {
    question: "What is the role of the lymphatic system?",
    options: ["To pump blood", "To transport lymph and support immune function", "To digest food", "To produce hormones"],
    correctAnswer: "To transport lymph and support immune function",
    explanation: "The lymphatic system transports lymph fluid, helps remove waste and toxins, and plays a crucial role in immune function by transporting white blood cells.",
    difficulty: "advanced",
    topic: "anatomy",
    relatedConcepts: ["lymph", "immune function", "waste removal"]
  },
  {
    question: "What is the mechanism of pain perception?",
    options: ["Pain is only psychological", "Nociceptors detect tissue damage and send signals to the brain", "Pain is always caused by inflammation", "Pain receptors don't exist"],
    correctAnswer: "Nociceptors detect tissue damage and send signals to the brain",
    explanation: "Pain perception involves nociceptors (pain receptors) detecting tissue damage and sending electrical signals through nerves to the brain for interpretation.",
    difficulty: "advanced",
    topic: "neurology",
    relatedConcepts: ["nociceptors", "neural pathways", "perception"]
  },
  {
    question: "What is the difference between benign and malignant tumors?",
    options: ["No difference", "Benign is non-cancerous, malignant is cancerous", "Benign is always dangerous", "Malignant is always treatable"],
    correctAnswer: "Benign is non-cancerous, malignant is cancerous",
    explanation: "Benign tumors are non-cancerous and don't spread to other parts of the body, while malignant tumors are cancerous and can invade nearby tissues and spread.",
    difficulty: "advanced",
    topic: "oncology",
    relatedConcepts: ["cancer", "metastasis", "tumor growth"]
  },
  {
    question: "What is the role of the microbiome in human health?",
    options: ["No role", "To maintain gut health and support immune function", "To cause disease", "To produce energy"],
    correctAnswer: "To maintain gut health and support immune function",
    explanation: "The microbiome consists of trillions of microorganisms that play crucial roles in digestion, immune function, and overall health maintenance.",
    difficulty: "advanced",
    topic: "microbiology",
    relatedConcepts: ["microorganisms", "gut health", "immune function"]
  },
  {
    question: "What is the mechanism of muscle contraction?",
    options: ["Muscles contract randomly", "Sliding filament theory involving actin and myosin", "Muscles only work with electricity", "Contraction is only chemical"],
    correctAnswer: "Sliding filament theory involving actin and myosin",
    explanation: "Muscle contraction follows the sliding filament theory where actin and myosin filaments slide past each other, powered by ATP, to create muscle shortening.",
    difficulty: "advanced",
    topic: "physiology",
    relatedConcepts: ["actin", "myosin", "ATP"]
  },
  {
    question: "What is the role of epigenetics in health and disease?",
    options: ["No role", "To regulate gene expression without changing DNA sequence", "To change DNA structure", "To cause mutations"],
    correctAnswer: "To regulate gene expression without changing DNA sequence",
    explanation: "Epigenetics involves changes in gene expression that don't alter the DNA sequence but can be influenced by environmental factors and lifestyle choices.",
    difficulty: "advanced",
    topic: "genetics",
    relatedConcepts: ["gene expression", "environmental factors", "regulation"]
  },
  {
    question: "What is the mechanism of drug metabolism in the liver?",
    options: ["Drugs are not metabolized", "Enzymes break down drugs for elimination", "Liver stores all drugs", "Metabolism only occurs in kidneys"],
    correctAnswer: "Enzymes break down drugs for elimination",
    explanation: "The liver contains enzymes that break down drugs into metabolites that can be more easily eliminated from the body through urine or bile.",
    difficulty: "advanced",
    topic: "pharmacology",
    relatedConcepts: ["enzymes", "metabolism", "elimination"]
  },
  {
    question: "What is the role of stem cells in medicine?",
    options: ["No role", "To regenerate damaged tissues and treat diseases", "To cause cancer", "To replace all cells"],
    correctAnswer: "To regenerate damaged tissues and treat diseases",
    explanation: "Stem cells have the ability to differentiate into various cell types and are being researched for their potential to regenerate damaged tissues and treat diseases.",
    difficulty: "advanced",
    topic: "regenerative-medicine",
    relatedConcepts: ["differentiation", "regeneration", "therapy"]
  },

  // Adaptive Questions (need 10 total)
  {
    question: "What is the importance of sleep for health?",
    options: ["Sleep is not important", "It allows body repair and brain function", "Sleep only affects energy", "Sleep is only for rest"],
    correctAnswer: "It allows body repair and brain function",
    explanation: "Sleep is crucial for physical repair, memory consolidation, immune function, and overall brain health and cognitive performance.",
    difficulty: "adaptive",
    topic: "sleep",
    relatedConcepts: ["repair", "memory", "immune function"]
  },
  {
    question: "What is the role of exercise in maintaining health?",
    options: ["Exercise is not important", "It improves cardiovascular health, strength, and mental well-being", "Exercise only builds muscle", "Exercise is only for weight loss"],
    correctAnswer: "It improves cardiovascular health, strength, and mental well-being",
    explanation: "Regular exercise improves cardiovascular health, builds strength, enhances mental well-being, and helps prevent various chronic diseases.",
    difficulty: "adaptive",
    topic: "exercise",
    relatedConcepts: ["cardiovascular", "strength", "mental health"]
  },
  {
    question: "What is the importance of mental health?",
    options: ["Mental health is not important", "It affects overall well-being and physical health", "Mental health only affects emotions", "Mental health is separate from physical health"],
    correctAnswer: "It affects overall well-being and physical health",
    explanation: "Mental health is integral to overall well-being and can significantly impact physical health, relationships, and quality of life.",
    difficulty: "adaptive",
    topic: "mental-health",
    relatedConcepts: ["well-being", "physical health", "quality of life"]
  },
  {
    question: "What is the role of preventive medicine?",
    options: ["No role", "To prevent disease before it occurs", "To only treat existing conditions", "To replace all treatments"],
    correctAnswer: "To prevent disease before it occurs",
    explanation: "Preventive medicine focuses on preventing disease and promoting health through vaccinations, screenings, lifestyle modifications, and early intervention.",
    difficulty: "adaptive",
    topic: "preventive-medicine",
    relatedConcepts: ["prevention", "screening", "lifestyle"]
  },
  {
    question: "What is the importance of nutrition in health?",
    options: ["Nutrition is not important", "It provides essential nutrients for body function", "Nutrition only affects weight", "Nutrition is only about calories"],
    correctAnswer: "It provides essential nutrients for body function",
    explanation: "Proper nutrition provides essential nutrients that support all body functions, including growth, repair, energy production, and disease prevention.",
    difficulty: "adaptive",
    topic: "nutrition",
    relatedConcepts: ["nutrients", "body function", "disease prevention"]
  },
  {
    question: "What is the role of stress in health?",
    options: ["Stress has no effect", "Chronic stress can negatively impact physical and mental health", "Stress is always beneficial", "Stress only affects emotions"],
    correctAnswer: "Chronic stress can negatively impact physical and mental health",
    explanation: "While acute stress can be beneficial, chronic stress can negatively impact cardiovascular health, immune function, and mental well-being.",
    difficulty: "adaptive",
    topic: "stress",
    relatedConcepts: ["chronic stress", "cardiovascular", "immune function"]
  },
  {
    question: "What is the importance of regular health check-ups?",
    options: ["Not important", "To detect problems early and maintain health", "Only for sick people", "Only for elderly"],
    correctAnswer: "To detect problems early and maintain health",
    explanation: "Regular health check-ups help detect health problems early, monitor existing conditions, and provide preventive care recommendations.",
    difficulty: "adaptive",
    topic: "preventive-care",
    relatedConcepts: ["early detection", "monitoring", "prevention"]
  },
  {
    question: "What is the role of genetics in health?",
    options: ["No role", "To influence disease risk and response to treatments", "Genetics only affect appearance", "Genetics are not important"],
    correctAnswer: "To influence disease risk and response to treatments",
    explanation: "Genetics can influence an individual's risk for certain diseases and their response to medications and treatments.",
    difficulty: "adaptive",
    topic: "genetics",
    relatedConcepts: ["disease risk", "treatment response", "inheritance"]
  },
  {
    question: "What is the importance of social connections for health?",
    options: ["Not important", "They support mental health and may improve physical health", "Only for mental health", "Only for elderly"],
    correctAnswer: "They support mental health and may improve physical health",
    explanation: "Strong social connections support mental health, reduce stress, and may improve physical health outcomes and longevity.",
    difficulty: "adaptive",
    topic: "social-health",
    relatedConcepts: ["mental health", "stress reduction", "longevity"]
  },
  {
    question: "What is the role of environmental factors in health?",
    options: ["No role", "To influence health through air quality, water, and living conditions", "Only affect physical health", "Only affect mental health"],
    correctAnswer: "To influence health through air quality, water, and living conditions",
    explanation: "Environmental factors including air quality, water quality, living conditions, and exposure to toxins can significantly impact health outcomes.",
    difficulty: "adaptive",
    topic: "environmental-health",
    relatedConcepts: ["air quality", "water quality", "toxins"]
  }
];

async function generateHealthQuestions() {
  try {
    console.log('🎯 GENERATING HEALTH & MEDICINE QUIZ QUESTIONS\n');
    console.log('='.repeat(50));

    // Get the Health & Medicine category
    const healthCategory = await prisma.category.findUnique({
      where: { name: 'Health & Medicine' }
    });

    if (!healthCategory) {
      console.log('❌ Health & Medicine category not found');
      return;
    }

    console.log(`📁 Category: ${healthCategory.name}`);
    console.log(`📝 Adding ${healthQuestions.length} new questions...\n`);

    // Add the questions
    for (const questionData of healthQuestions) {
      const question = await prisma.quizQuestion.create({
        data: {
          ...questionData,
          categoryId: healthCategory.id
        }
      });
      console.log(`✅ Added: ${questionData.question.substring(0, 50)}... (${questionData.difficulty})`);
    }

    console.log('\n📊 VERIFICATION:');
    console.log('='.repeat(50));

    // Check the updated question count
    const updatedQuestions = await prisma.quizQuestion.findMany({
      where: { categoryId: healthCategory.id }
    });

    const difficultyStats = {};
    updatedQuestions.forEach(q => {
      if (!difficultyStats[q.difficulty]) {
        difficultyStats[q.difficulty] = 0;
      }
      difficultyStats[q.difficulty]++;
    });

    console.log('\nUpdated Health & Medicine questions by difficulty:');
    Object.entries(difficultyStats).forEach(([difficulty, count]) => {
      const status = count >= 10 ? '✅' : '❌';
      console.log(`  ${difficulty}: ${count} questions ${status}`);
    });

    console.log(`\nTotal Health & Medicine questions: ${updatedQuestions.length}`);
    console.log('\n✅ Health & Medicine questions generated successfully!');

  } catch (error) {
    console.error('Error generating questions:', error);
  } finally {
    await prisma.$disconnect();
  }
}

generateHealthQuestions(); 