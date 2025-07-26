import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// Quiz questions for Mathematics category
const mathematicsQuestions = [
  // Additional Beginner Questions (need 7 more to reach 10)
  {
    question: "What is the order of operations in mathematics?",
    options: ["PEMDAS (Parentheses, Exponents, Multiplication, Division, Addition, Subtraction)", "Any order", "Left to right", "Right to left"],
    correctAnswer: "PEMDAS (Parentheses, Exponents, Multiplication, Division, Addition, Subtraction)",
    explanation: "PEMDAS is the standard order of operations: Parentheses, Exponents, Multiplication and Division (left to right), Addition and Subtraction (left to right).",
    difficulty: "beginner",
    topic: "arithmetic",
    relatedConcepts: ["operations", "order", "precedence"]
  },
  {
    question: "What is a fraction?",
    options: ["A whole number", "A part of a whole", "A decimal", "A percentage"],
    correctAnswer: "A part of a whole",
    explanation: "A fraction represents a part of a whole, written as one number (numerator) divided by another (denominator).",
    difficulty: "beginner",
    topic: "fractions",
    relatedConcepts: ["parts", "whole", "division"]
  },
  {
    question: "What is the difference between a prime and composite number?",
    options: ["No difference", "Prime has exactly 2 factors, composite has more than 2", "Prime is always larger", "Composite is always smaller"],
    correctAnswer: "Prime has exactly 2 factors, composite has more than 2",
    explanation: "A prime number has exactly two factors (1 and itself), while a composite number has more than two factors.",
    difficulty: "beginner",
    topic: "number-theory",
    relatedConcepts: ["factors", "divisibility", "numbers"]
  },
  {
    question: "What is a decimal?",
    options: ["A fraction", "A way to represent parts of a whole using base 10", "A percentage", "A whole number"],
    correctAnswer: "A way to represent parts of a whole using base 10",
    explanation: "A decimal is a way to represent parts of a whole using the base 10 number system, with digits after the decimal point.",
    difficulty: "beginner",
    topic: "decimals",
    relatedConcepts: ["base 10", "parts", "representation"]
  },
  {
    question: "What is the perimeter of a shape?",
    options: ["The area", "The distance around the outside", "The volume", "The height"],
    correctAnswer: "The distance around the outside",
    explanation: "The perimeter is the total distance around the outside edge of a two-dimensional shape.",
    difficulty: "beginner",
    topic: "geometry",
    relatedConcepts: ["distance", "edges", "measurement"]
  },
  {
    question: "What is the area of a shape?",
    options: ["The perimeter", "The amount of space inside", "The volume", "The height"],
    correctAnswer: "The amount of space inside",
    explanation: "The area is the amount of two-dimensional space inside a shape, measured in square units.",
    difficulty: "beginner",
    topic: "geometry",
    relatedConcepts: ["space", "two-dimensional", "measurement"]
  },
  {
    question: "What is a percentage?",
    options: ["A fraction", "A part per hundred", "A decimal", "A whole number"],
    correctAnswer: "A part per hundred",
    explanation: "A percentage represents a part per hundred, with 100% representing the whole.",
    difficulty: "beginner",
    topic: "percentages",
    relatedConcepts: ["parts", "hundred", "proportion"]
  },

  // Additional Intermediate Questions (need 8 more to reach 10)
  {
    question: "What is the difference between mean, median, and mode?",
    options: ["No difference", "Mean is average, median is middle value, mode is most frequent", "Mean is always highest", "Mode is always lowest"],
    correctAnswer: "Mean is average, median is middle value, mode is most frequent",
    explanation: "Mean is the average, median is the middle value when ordered, and mode is the most frequently occurring value.",
    difficulty: "intermediate",
    topic: "statistics",
    relatedConcepts: ["average", "central tendency", "frequency"]
  },
  {
    question: "What is the slope of a line?",
    options: ["The length", "The steepness or rate of change", "The height", "The width"],
    correctAnswer: "The steepness or rate of change",
    explanation: "The slope measures the steepness of a line and represents the rate of change between two points.",
    difficulty: "intermediate",
    topic: "algebra",
    relatedConcepts: ["steepness", "rate of change", "linear"]
  },
  {
    question: "What is a function in mathematics?",
    options: ["A number", "A relationship where each input has exactly one output", "A shape", "A formula"],
    correctAnswer: "A relationship where each input has exactly one output",
    explanation: "A function is a relationship where each input value corresponds to exactly one output value.",
    difficulty: "intermediate",
    topic: "functions",
    relatedConcepts: ["relationship", "input", "output"]
  },
  {
    question: "What is the difference between rational and irrational numbers?",
    options: ["No difference", "Rational can be expressed as fractions, irrational cannot", "Rational is always larger", "Irrational is always smaller"],
    correctAnswer: "Rational can be expressed as fractions, irrational cannot",
    explanation: "Rational numbers can be expressed as fractions of integers, while irrational numbers cannot be expressed as simple fractions.",
    difficulty: "intermediate",
    topic: "number-theory",
    relatedConcepts: ["fractions", "integers", "expressibility"]
  },
  {
    question: "What is the Pythagorean theorem used for?",
    options: ["Finding area", "Finding the length of sides in right triangles", "Finding volume", "Finding perimeter"],
    correctAnswer: "Finding the length of sides in right triangles",
    explanation: "The Pythagorean theorem relates the lengths of sides in right triangles: a² + b² = c².",
    difficulty: "intermediate",
    topic: "geometry",
    relatedConcepts: ["right triangles", "side lengths", "hypotenuse"]
  },
  {
    question: "What is a quadratic equation?",
    options: ["A linear equation", "An equation with x² as the highest power", "A cubic equation", "A simple equation"],
    correctAnswer: "An equation with x² as the highest power",
    explanation: "A quadratic equation is a polynomial equation where the highest power of the variable is 2 (x²).",
    difficulty: "intermediate",
    topic: "algebra",
    relatedConcepts: ["polynomial", "degree", "variable"]
  },
  {
    question: "What is the concept of probability?",
    options: ["A type of number", "The likelihood of an event occurring", "A type of equation", "A type of shape"],
    correctAnswer: "The likelihood of an event occurring",
    explanation: "Probability measures the likelihood of an event occurring, ranging from 0 (impossible) to 1 (certain).",
    difficulty: "intermediate",
    topic: "probability",
    relatedConcepts: ["likelihood", "events", "measurement"]
  },
  {
    question: "What is the difference between permutation and combination?",
    options: ["No difference", "Permutation considers order, combination does not", "Permutation is always larger", "Combination is always smaller"],
    correctAnswer: "Permutation considers order, combination does not",
    explanation: "Permutation considers the order of items, while combination does not consider order.",
    difficulty: "intermediate",
    topic: "combinatorics",
    relatedConcepts: ["order", "arrangement", "selection"]
  },

  // Advanced Questions (need 10 total)
  {
    question: "What is the concept of limits in calculus?",
    options: ["A type of number", "The value a function approaches as input gets closer to a point", "A type of equation", "A type of shape"],
    correctAnswer: "The value a function approaches as input gets closer to a point",
    explanation: "A limit describes the value that a function approaches as the input gets arbitrarily close to a specific point.",
    difficulty: "advanced",
    topic: "calculus",
    relatedConcepts: ["approaches", "function", "convergence"]
  },
  {
    question: "What is the derivative of a function?",
    options: ["The function itself", "The rate of change of the function", "The area under the curve", "The maximum value"],
    correctAnswer: "The rate of change of the function",
    explanation: "The derivative measures the instantaneous rate of change of a function at any given point.",
    difficulty: "advanced",
    topic: "calculus",
    relatedConcepts: ["rate of change", "instantaneous", "slope"]
  },
  {
    question: "What is the integral of a function?",
    options: ["The derivative", "The area under the curve", "The maximum value", "The minimum value"],
    correctAnswer: "The area under the curve",
    explanation: "The integral represents the area under the curve of a function between two points.",
    difficulty: "advanced",
    topic: "calculus",
    relatedConcepts: ["area", "curve", "accumulation"]
  },
  {
    question: "What is a matrix in mathematics?",
    options: ["A number", "A rectangular array of numbers", "A function", "A shape"],
    correctAnswer: "A rectangular array of numbers",
    explanation: "A matrix is a rectangular array of numbers arranged in rows and columns, used in linear algebra.",
    difficulty: "advanced",
    topic: "linear-algebra",
    relatedConcepts: ["array", "rows", "columns"]
  },
  {
    question: "What is the concept of infinity?",
    options: ["A very large number", "A concept representing something without bound", "A type of zero", "A negative number"],
    correctAnswer: "A concept representing something without bound",
    explanation: "Infinity is a concept representing something that grows without bound or has no limit.",
    difficulty: "advanced",
    topic: "number-theory",
    relatedConcepts: ["unbounded", "limit", "concept"]
  },
  {
    question: "What is a complex number?",
    options: ["A real number", "A number with real and imaginary parts", "A fraction", "A decimal"],
    correctAnswer: "A number with real and imaginary parts",
    explanation: "A complex number has both a real part and an imaginary part, written as a + bi where i is the square root of -1.",
    difficulty: "advanced",
    topic: "complex-numbers",
    relatedConcepts: ["real part", "imaginary part", "i"]
  },
  {
    question: "What is the concept of convergence in mathematics?",
    options: ["A type of number", "When a sequence approaches a specific value", "A type of equation", "A type of shape"],
    correctAnswer: "When a sequence approaches a specific value",
    explanation: "Convergence occurs when a sequence or series approaches a specific limiting value as the number of terms increases.",
    difficulty: "advanced",
    topic: "analysis",
    relatedConcepts: ["sequence", "limit", "approaches"]
  },
  {
    question: "What is the difference between discrete and continuous mathematics?",
    options: ["No difference", "Discrete deals with countable sets, continuous deals with uncountable sets", "Discrete is always easier", "Continuous is always harder"],
    correctAnswer: "Discrete deals with countable sets, continuous deals with uncountable sets",
    explanation: "Discrete mathematics deals with countable, separate values, while continuous mathematics deals with uncountable, smooth values.",
    difficulty: "advanced",
    topic: "mathematical-foundations",
    relatedConcepts: ["countable", "uncountable", "sets"]
  },
  {
    question: "What is the concept of isomorphism in mathematics?",
    options: ["A type of number", "A structure-preserving mapping between mathematical objects", "A type of equation", "A type of shape"],
    correctAnswer: "A structure-preserving mapping between mathematical objects",
    explanation: "An isomorphism is a structure-preserving mapping between mathematical objects that shows they are essentially the same.",
    difficulty: "advanced",
    topic: "abstract-algebra",
    relatedConcepts: ["mapping", "structure", "preservation"]
  },
  {
    question: "What is the concept of topology in mathematics?",
    options: ["A type of number", "The study of properties preserved under continuous deformations", "A type of equation", "A type of shape"],
    correctAnswer: "The study of properties preserved under continuous deformations",
    explanation: "Topology studies properties of geometric objects that are preserved under continuous deformations like stretching or bending.",
    difficulty: "advanced",
    topic: "topology",
    relatedConcepts: ["properties", "deformations", "geometric"]
  },

  // Adaptive Questions (need 10 total)
  {
    question: "What is the importance of mathematical proof?",
    options: ["Not important", "To establish truth with certainty", "To make math harder", "To confuse students"],
    correctAnswer: "To establish truth with certainty",
    explanation: "Mathematical proof establishes the truth of statements with absolute certainty through logical reasoning.",
    difficulty: "adaptive",
    topic: "mathematical-foundations",
    relatedConcepts: ["truth", "certainty", "logic"]
  },
  {
    question: "What is the role of patterns in mathematics?",
    options: ["No role", "To help identify relationships and make predictions", "To make math harder", "To confuse people"],
    correctAnswer: "To help identify relationships and make predictions",
    explanation: "Patterns help mathematicians identify relationships, make predictions, and develop mathematical theories.",
    difficulty: "adaptive",
    topic: "mathematical-thinking",
    relatedConcepts: ["relationships", "predictions", "theories"]
  },
  {
    question: "What is the importance of mathematical modeling?",
    options: ["Not important", "To represent real-world situations mathematically", "To make math abstract", "To avoid reality"],
    correctAnswer: "To represent real-world situations mathematically",
    explanation: "Mathematical modeling represents real-world situations mathematically to analyze, predict, and solve problems.",
    difficulty: "adaptive",
    topic: "applied-mathematics",
    relatedConcepts: ["real-world", "analysis", "prediction"]
  },
  {
    question: "What is the role of symmetry in mathematics?",
    options: ["No role", "To identify balanced and regular properties", "To make shapes irregular", "To create chaos"],
    correctAnswer: "To identify balanced and regular properties",
    explanation: "Symmetry identifies balanced and regular properties in mathematical objects, revealing underlying structure.",
    difficulty: "adaptive",
    topic: "geometry",
    relatedConcepts: ["balance", "regularity", "structure"]
  },
  {
    question: "What is the importance of mathematical notation?",
    options: ["Not important", "To communicate mathematical ideas precisely and efficiently", "To make math harder", "To confuse people"],
    correctAnswer: "To communicate mathematical ideas precisely and efficiently",
    explanation: "Mathematical notation allows precise and efficient communication of complex mathematical ideas.",
    difficulty: "adaptive",
    topic: "mathematical-communication",
    relatedConcepts: ["communication", "precision", "efficiency"]
  },
  {
    question: "What is the role of abstraction in mathematics?",
    options: ["No role", "To focus on essential properties and ignore details", "To make math harder", "To avoid reality"],
    correctAnswer: "To focus on essential properties and ignore details",
    explanation: "Abstraction allows mathematicians to focus on essential properties while ignoring irrelevant details.",
    difficulty: "adaptive",
    topic: "mathematical-thinking",
    relatedConcepts: ["essential properties", "focus", "generalization"]
  },
  {
    question: "What is the importance of mathematical logic?",
    options: ["Not important", "To ensure valid reasoning and correct conclusions", "To make math harder", "To confuse people"],
    correctAnswer: "To ensure valid reasoning and correct conclusions",
    explanation: "Mathematical logic ensures valid reasoning and helps draw correct conclusions from given premises.",
    difficulty: "adaptive",
    topic: "mathematical-logic",
    relatedConcepts: ["reasoning", "validity", "conclusions"]
  },
  {
    question: "What is the role of algorithms in mathematics?",
    options: ["No role", "To provide systematic procedures for solving problems", "To make math harder", "To avoid thinking"],
    correctAnswer: "To provide systematic procedures for solving problems",
    explanation: "Algorithms provide systematic, step-by-step procedures for solving mathematical problems efficiently.",
    difficulty: "adaptive",
    topic: "algorithms",
    relatedConcepts: ["systematic", "procedures", "efficiency"]
  },
  {
    question: "What is the importance of mathematical beauty?",
    options: ["Not important", "To inspire and guide mathematical discovery", "To make math harder", "To be subjective"],
    correctAnswer: "To inspire and guide mathematical discovery",
    explanation: "Mathematical beauty inspires discovery and often indicates that a solution or proof is correct and elegant.",
    difficulty: "adaptive",
    topic: "mathematical-aesthetics",
    relatedConcepts: ["inspiration", "discovery", "elegance"]
  },
  {
    question: "What is the role of mathematical creativity?",
    options: ["No role", "To develop new ideas and solve novel problems", "To follow rules only", "To avoid innovation"],
    correctAnswer: "To develop new ideas and solve novel problems",
    explanation: "Mathematical creativity involves developing new ideas, approaches, and solutions to mathematical problems.",
    difficulty: "adaptive",
    topic: "mathematical-creativity",
    relatedConcepts: ["innovation", "problem-solving", "development"]
  }
];

async function generateMathematicsQuestions() {
  try {
    console.log('🎯 GENERATING MATHEMATICS QUIZ QUESTIONS\n');
    console.log('='.repeat(50));

    // Get the Mathematics category
    const mathematicsCategory = await prisma.category.findUnique({
      where: { name: 'Mathematics' }
    });

    if (!mathematicsCategory) {
      console.log('❌ Mathematics category not found');
      return;
    }

    console.log(`📁 Category: ${mathematicsCategory.name}`);
    console.log(`📝 Adding ${mathematicsQuestions.length} new questions...\n`);

    // Add the questions
    for (const questionData of mathematicsQuestions) {
      const question = await prisma.quizQuestion.create({
        data: {
          ...questionData,
          categoryId: mathematicsCategory.id
        }
      });
      console.log(`✅ Added: ${questionData.question.substring(0, 50)}... (${questionData.difficulty})`);
    }

    console.log('\n📊 VERIFICATION:');
    console.log('='.repeat(50));

    // Check the updated question count
    const updatedQuestions = await prisma.quizQuestion.findMany({
      where: { categoryId: mathematicsCategory.id }
    });

    const difficultyStats = {};
    updatedQuestions.forEach(q => {
      if (!difficultyStats[q.difficulty]) {
        difficultyStats[q.difficulty] = 0;
      }
      difficultyStats[q.difficulty]++;
    });

    console.log('\nUpdated Mathematics questions by difficulty:');
    Object.entries(difficultyStats).forEach(([difficulty, count]) => {
      const status = count >= 10 ? '✅' : '❌';
      console.log(`  ${difficulty}: ${count} questions ${status}`);
    });

    console.log(`\nTotal Mathematics questions: ${updatedQuestions.length}`);
    console.log('\n✅ Mathematics questions generated successfully!');

  } catch (error) {
    console.error('Error generating questions:', error);
  } finally {
    await prisma.$disconnect();
  }
}

generateMathematicsQuestions(); 