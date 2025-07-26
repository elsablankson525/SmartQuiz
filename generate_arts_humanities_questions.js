import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// Quiz questions for Arts & Humanities category
const artsHumanitiesQuestions = [
  // Additional Beginner Questions (need 6 more to reach 10)
  {
    question: "What is the primary purpose of art?",
    options: ["To make money", "To express human creativity and emotion", "To decorate walls", "To follow rules"],
    correctAnswer: "To express human creativity and emotion",
    explanation: "Art serves as a means of human expression, allowing artists to communicate emotions, ideas, and experiences through creative forms.",
    difficulty: "beginner",
    topic: "art-theory",
    relatedConcepts: ["expression", "creativity", "emotion"]
  },
  {
    question: "What is literature?",
    options: ["Only books", "Written works of artistic merit", "Only poetry", "Only novels"],
    correctAnswer: "Written works of artistic merit",
    explanation: "Literature encompasses written works that have artistic merit, including poetry, prose, drama, and other forms of creative writing.",
    difficulty: "beginner",
    topic: "literature",
    relatedConcepts: ["writing", "artistic merit", "creative expression"]
  },
  {
    question: "What is the difference between primary and secondary colors?",
    options: ["No difference", "Primary colors are basic, secondary are mixtures", "Primary are always brighter", "Secondary are always darker"],
    correctAnswer: "Primary colors are basic, secondary are mixtures",
    explanation: "Primary colors (red, blue, yellow) are the basic colors that can be mixed to create secondary colors (green, orange, purple).",
    difficulty: "beginner",
    topic: "color-theory",
    relatedConcepts: ["color mixing", "basic colors", "art fundamentals"]
  },
  {
    question: "What is a museum?",
    options: ["A store", "An institution that preserves and displays cultural artifacts", "A library", "A school"],
    correctAnswer: "An institution that preserves and displays cultural artifacts",
    explanation: "A museum is an institution dedicated to collecting, preserving, and displaying cultural, historical, or scientific artifacts for public education and enjoyment.",
    difficulty: "beginner",
    topic: "cultural-institutions",
    relatedConcepts: ["preservation", "education", "cultural heritage"]
  },
  {
    question: "What is the purpose of music?",
    options: ["Only entertainment", "To express emotion and communicate through sound", "Only background noise", "Only for dancing"],
    correctAnswer: "To express emotion and communicate through sound",
    explanation: "Music serves as a universal language for expressing emotions, telling stories, and communicating ideas through organized sound.",
    difficulty: "beginner",
    topic: "music-theory",
    relatedConcepts: ["sound", "emotion", "communication"]
  },
  {
    question: "What is philosophy?",
    options: ["A type of science", "The study of fundamental questions about existence and knowledge", "A religion", "A type of art"],
    correctAnswer: "The study of fundamental questions about existence and knowledge",
    explanation: "Philosophy is the systematic study of fundamental questions about existence, knowledge, values, reason, mind, and language.",
    difficulty: "beginner",
    topic: "philosophy",
    relatedConcepts: ["existence", "knowledge", "fundamental questions"]
  },

  // Additional Intermediate Questions (need 9 more to reach 10)
  {
    question: "What is the difference between classical and modern art?",
    options: ["No difference", "Classical follows traditional forms, modern breaks conventions", "Classical is always older", "Modern is always better"],
    correctAnswer: "Classical follows traditional forms, modern breaks conventions",
    explanation: "Classical art follows traditional forms and techniques, while modern art often breaks with conventions and explores new forms of expression.",
    difficulty: "intermediate",
    topic: "art-history",
    relatedConcepts: ["traditional forms", "conventions", "artistic movements"]
  },
  {
    question: "What is the concept of beauty in aesthetics?",
    options: ["Only physical appearance", "A subjective quality that pleases the senses or mind", "Only symmetry", "Only color"],
    correctAnswer: "A subjective quality that pleases the senses or mind",
    explanation: "Beauty in aesthetics is a subjective quality that pleases the senses or mind, varying across cultures and individuals.",
    difficulty: "intermediate",
    topic: "aesthetics",
    relatedConcepts: ["subjective", "pleasure", "sensory experience"]
  },
  {
    question: "What is the role of symbolism in art?",
    options: ["No role", "To represent ideas or concepts beyond literal meaning", "Only decoration", "Only color"],
    correctAnswer: "To represent ideas or concepts beyond literal meaning",
    explanation: "Symbolism in art uses objects, colors, or forms to represent ideas or concepts beyond their literal meaning.",
    difficulty: "intermediate",
    topic: "art-analysis",
    relatedConcepts: ["representation", "meaning", "concepts"]
  },
  {
    question: "What is the difference between prose and poetry?",
    options: ["No difference", "Prose is natural language, poetry uses structured form", "Prose is always longer", "Poetry is always shorter"],
    correctAnswer: "Prose is natural language, poetry uses structured form",
    explanation: "Prose uses natural language flow, while poetry uses structured form with rhythm, meter, and often rhyme.",
    difficulty: "intermediate",
    topic: "literary-forms",
    relatedConcepts: ["language", "structure", "rhythm"]
  },
  {
    question: "What is the concept of cultural relativism?",
    options: ["No concept", "Understanding cultures on their own terms", "Judging all cultures", "Ignoring differences"],
    correctAnswer: "Understanding cultures on their own terms",
    explanation: "Cultural relativism is the principle of understanding and evaluating cultures based on their own values and standards rather than external criteria.",
    difficulty: "intermediate",
    topic: "cultural-studies",
    relatedConcepts: ["understanding", "values", "standards"]
  },
  {
    question: "What is the purpose of drama and theater?",
    options: ["Only entertainment", "To tell stories and explore human experience through performance", "Only comedy", "Only tragedy"],
    correctAnswer: "To tell stories and explore human experience through performance",
    explanation: "Drama and theater serve to tell stories and explore human experience through live performance, combining various art forms.",
    difficulty: "intermediate",
    topic: "performing-arts",
    relatedConcepts: ["performance", "storytelling", "human experience"]
  },
  {
    question: "What is the role of criticism in the arts?",
    options: ["No role", "To analyze and evaluate artistic works", "Only negative comments", "Only praise"],
    correctAnswer: "To analyze and evaluate artistic works",
    explanation: "Artistic criticism involves analyzing and evaluating works of art to understand their meaning, technique, and cultural significance.",
    difficulty: "intermediate",
    topic: "art-criticism",
    relatedConcepts: ["analysis", "evaluation", "understanding"]
  },
  {
    question: "What is the concept of artistic style?",
    options: ["No concept", "Distinctive characteristics that identify an artist or period", "Only color choice", "Only subject matter"],
    correctAnswer: "Distinctive characteristics that identify an artist or period",
    explanation: "Artistic style refers to distinctive characteristics in technique, form, or content that identify an artist, movement, or historical period.",
    difficulty: "intermediate",
    topic: "art-history",
    relatedConcepts: ["characteristics", "technique", "identification"]
  },
  {
    question: "What is the importance of cultural heritage?",
    options: ["Not important", "To preserve and pass on cultural traditions and values", "Only for museums", "Only for tourism"],
    correctAnswer: "To preserve and pass on cultural traditions and values",
    explanation: "Cultural heritage preserves and passes on cultural traditions, values, and knowledge from one generation to the next.",
    difficulty: "intermediate",
    topic: "cultural-heritage",
    relatedConcepts: ["preservation", "traditions", "values"]
  },

  // Advanced Questions (need 10 total)
  {
    question: "What is the concept of postmodernism in the arts?",
    options: ["A type of modern art", "A movement that questions traditional assumptions about art and culture", "A style of painting", "A type of music"],
    correctAnswer: "A movement that questions traditional assumptions about art and culture",
    explanation: "Postmodernism questions traditional assumptions about art, culture, and knowledge, often using irony, pastiche, and self-reference.",
    difficulty: "advanced",
    topic: "art-theory",
    relatedConcepts: ["questioning", "assumptions", "irony"]
  },
  {
    question: "What is the role of semiotics in art analysis?",
    options: ["No role", "To study signs and symbols and their meaning", "Only color analysis", "Only composition"],
    correctAnswer: "To study signs and symbols and their meaning",
    explanation: "Semiotics studies signs and symbols and their meaning, helping analyze how visual elements communicate meaning in art.",
    difficulty: "advanced",
    topic: "art-analysis",
    relatedConcepts: ["signs", "symbols", "meaning"]
  },
  {
    question: "What is the concept of the sublime in aesthetics?",
    options: ["A type of beauty", "An overwhelming experience that transcends ordinary understanding", "A color", "A style"],
    correctAnswer: "An overwhelming experience that transcends ordinary understanding",
    explanation: "The sublime refers to an overwhelming experience that transcends ordinary understanding, often associated with awe and wonder.",
    difficulty: "advanced",
    topic: "aesthetics",
    relatedConcepts: ["overwhelming", "transcendence", "awe"]
  },
  {
    question: "What is the role of patronage in art history?",
    options: ["No role", "Financial support that shaped artistic production and style", "Only modern concept", "Only government funding"],
    correctAnswer: "Financial support that shaped artistic production and style",
    explanation: "Patronage provided financial support that significantly shaped artistic production, style, and subject matter throughout history.",
    difficulty: "advanced",
    topic: "art-history",
    relatedConcepts: ["financial support", "production", "influence"]
  },
  {
    question: "What is the concept of artistic autonomy?",
    options: ["No concept", "The independence of art from external purposes", "Only modern art", "Only abstract art"],
    correctAnswer: "The independence of art from external purposes",
    explanation: "Artistic autonomy refers to the independence of art from external purposes, allowing it to serve its own aesthetic ends.",
    difficulty: "advanced",
    topic: "art-theory",
    relatedConcepts: ["independence", "aesthetic", "purpose"]
  },
  {
    question: "What is the role of gender in art history?",
    options: ["No role", "To influence artistic production, representation, and reception", "Only modern concern", "Only women artists"],
    correctAnswer: "To influence artistic production, representation, and reception",
    explanation: "Gender has significantly influenced artistic production, representation, and reception throughout art history.",
    difficulty: "advanced",
    topic: "art-history",
    relatedConcepts: ["gender", "representation", "influence"]
  },
  {
    question: "What is the concept of artistic genius?",
    options: ["A type of artist", "Exceptional creative ability that transcends ordinary talent", "Only famous artists", "Only modern concept"],
    correctAnswer: "Exceptional creative ability that transcends ordinary talent",
    explanation: "Artistic genius refers to exceptional creative ability that transcends ordinary talent and produces works of lasting significance.",
    difficulty: "advanced",
    topic: "art-theory",
    relatedConcepts: ["exceptional ability", "creativity", "significance"]
  },
  {
    question: "What is the role of technology in contemporary art?",
    options: ["No role", "To expand artistic possibilities and challenge traditional forms", "Only digital art", "Only photography"],
    correctAnswer: "To expand artistic possibilities and challenge traditional forms",
    explanation: "Technology expands artistic possibilities and challenges traditional forms, creating new media and methods of expression.",
    difficulty: "advanced",
    topic: "contemporary-art",
    relatedConcepts: ["possibilities", "challenge", "new media"]
  },
  {
    question: "What is the concept of artistic appropriation?",
    options: ["No concept", "Using existing images or objects in new contexts", "Only copying", "Only stealing"],
    correctAnswer: "Using existing images or objects in new contexts",
    explanation: "Artistic appropriation involves using existing images, objects, or styles in new contexts to create new meaning.",
    difficulty: "advanced",
    topic: "contemporary-art",
    relatedConcepts: ["existing elements", "new contexts", "meaning"]
  },
  {
    question: "What is the role of institutions in art?",
    options: ["No role", "To legitimize, preserve, and disseminate artistic works", "Only museums", "Only galleries"],
    correctAnswer: "To legitimize, preserve, and disseminate artistic works",
    explanation: "Institutions like museums, galleries, and academies legitimize, preserve, and disseminate artistic works and ideas.",
    difficulty: "advanced",
    topic: "art-institutions",
    relatedConcepts: ["legitimization", "preservation", "dissemination"]
  },

  // Adaptive Questions (need 10 total)
  {
    question: "What is the importance of art education?",
    options: ["Not important", "To develop creativity, critical thinking, and cultural understanding", "Only for artists", "Only for children"],
    correctAnswer: "To develop creativity, critical thinking, and cultural understanding",
    explanation: "Art education develops creativity, critical thinking, and cultural understanding, essential skills for all individuals.",
    difficulty: "adaptive",
    topic: "art-education",
    relatedConcepts: ["creativity", "critical thinking", "cultural understanding"]
  },
  {
    question: "What is the role of art in social change?",
    options: ["No role", "To challenge norms, raise awareness, and inspire action", "Only decoration", "Only entertainment"],
    correctAnswer: "To challenge norms, raise awareness, and inspire action",
    explanation: "Art can challenge social norms, raise awareness of issues, and inspire action for social change.",
    difficulty: "adaptive",
    topic: "art-and-society",
    relatedConcepts: ["challenge", "awareness", "inspiration"]
  },
  {
    question: "What is the importance of preserving cultural artifacts?",
    options: ["Not important", "To maintain cultural identity and historical knowledge", "Only for museums", "Only for tourism"],
    correctAnswer: "To maintain cultural identity and historical knowledge",
    explanation: "Preserving cultural artifacts maintains cultural identity and provides historical knowledge for future generations.",
    difficulty: "adaptive",
    topic: "cultural-preservation",
    relatedConcepts: ["identity", "knowledge", "future"]
  },
  {
    question: "What is the role of interpretation in art?",
    options: ["No role", "To find personal meaning and understanding in artistic works", "Only expert analysis", "Only historical context"],
    correctAnswer: "To find personal meaning and understanding in artistic works",
    explanation: "Interpretation allows individuals to find personal meaning and understanding in artistic works, making art relevant to their own experience.",
    difficulty: "adaptive",
    topic: "art-interpretation",
    relatedConcepts: ["personal meaning", "understanding", "relevance"]
  },
  {
    question: "What is the importance of artistic freedom?",
    options: ["Not important", "To allow creative expression without censorship or restriction", "Only for famous artists", "Only in democracies"],
    correctAnswer: "To allow creative expression without censorship or restriction",
    explanation: "Artistic freedom allows creative expression without censorship or restriction, essential for cultural development and innovation.",
    difficulty: "adaptive",
    topic: "artistic-freedom",
    relatedConcepts: ["expression", "censorship", "innovation"]
  },
  {
    question: "What is the role of art in personal development?",
    options: ["No role", "To foster self-expression, empathy, and emotional intelligence", "Only for artists", "Only for children"],
    correctAnswer: "To foster self-expression, empathy, and emotional intelligence",
    explanation: "Art fosters self-expression, empathy, and emotional intelligence, contributing to personal growth and development.",
    difficulty: "adaptive",
    topic: "personal-development",
    relatedConcepts: ["self-expression", "empathy", "growth"]
  },
  {
    question: "What is the importance of cultural diversity in the arts?",
    options: ["Not important", "To enrich artistic expression and promote understanding", "Only for museums", "Only for international art"],
    correctAnswer: "To enrich artistic expression and promote understanding",
    explanation: "Cultural diversity enriches artistic expression and promotes understanding between different cultures and perspectives.",
    difficulty: "adaptive",
    topic: "cultural-diversity",
    relatedConcepts: ["enrichment", "understanding", "perspectives"]
  },
  {
    question: "What is the role of art in healing and therapy?",
    options: ["No role", "To provide emotional expression and therapeutic benefits", "Only for children", "Only for mental health"],
    correctAnswer: "To provide emotional expression and therapeutic benefits",
    explanation: "Art provides emotional expression and therapeutic benefits, helping individuals process feelings and experiences.",
    difficulty: "adaptive",
    topic: "art-therapy",
    relatedConcepts: ["emotional expression", "therapeutic", "healing"]
  },
  {
    question: "What is the importance of artistic collaboration?",
    options: ["Not important", "To combine diverse perspectives and create innovative works", "Only for large projects", "Only for performance art"],
    correctAnswer: "To combine diverse perspectives and create innovative works",
    explanation: "Artistic collaboration combines diverse perspectives and skills to create innovative works that might not be possible individually.",
    difficulty: "adaptive",
    topic: "artistic-collaboration",
    relatedConcepts: ["diverse perspectives", "innovation", "combination"]
  },
  {
    question: "What is the role of art in environmental awareness?",
    options: ["No role", "To raise awareness and inspire action on environmental issues", "Only for nature art", "Only for activists"],
    correctAnswer: "To raise awareness and inspire action on environmental issues",
    explanation: "Art can raise awareness and inspire action on environmental issues, making complex problems more accessible and engaging.",
    difficulty: "adaptive",
    topic: "environmental-art",
    relatedConcepts: ["awareness", "inspiration", "accessibility"]
  }
];

async function generateArtsHumanitiesQuestions() {
  try {
    console.log('🎨 GENERATING ARTS & HUMANITIES QUIZ QUESTIONS\n');
    console.log('='.repeat(50));

    // Get the Arts & Humanities category
    const artsHumanitiesCategory = await prisma.category.findUnique({
      where: { name: 'Arts & Humanities' }
    });

    if (!artsHumanitiesCategory) {
      console.log('❌ Arts & Humanities category not found');
      return;
    }

    console.log(`📁 Category: ${artsHumanitiesCategory.name}`);
    console.log(`📝 Adding ${artsHumanitiesQuestions.length} new questions...\n`);

    // Add the questions
    for (const questionData of artsHumanitiesQuestions) {
      const question = await prisma.quizQuestion.create({
        data: {
          ...questionData,
          categoryId: artsHumanitiesCategory.id
        }
      });
      console.log(`✅ Added: ${questionData.question.substring(0, 50)}... (${questionData.difficulty})`);
    }

    console.log('\n📊 VERIFICATION:');
    console.log('='.repeat(50));

    // Check the updated question count
    const updatedQuestions = await prisma.quizQuestion.findMany({
      where: { categoryId: artsHumanitiesCategory.id }
    });

    const difficultyStats = {};
    updatedQuestions.forEach(q => {
      if (!difficultyStats[q.difficulty]) {
        difficultyStats[q.difficulty] = 0;
      }
      difficultyStats[q.difficulty]++;
    });

    console.log('\nUpdated Arts & Humanities questions by difficulty:');
    Object.entries(difficultyStats).forEach(([difficulty, count]) => {
      const status = count >= 10 ? '✅' : '❌';
      console.log(`  ${difficulty}: ${count} questions ${status}`);
    });

    console.log(`\nTotal Arts & Humanities questions: ${updatedQuestions.length}`);
    console.log('\n✅ Arts & Humanities questions generated successfully!');

  } catch (error) {
    console.error('Error generating questions:', error);
  } finally {
    await prisma.$disconnect();
  }
}

generateArtsHumanitiesQuestions(); 