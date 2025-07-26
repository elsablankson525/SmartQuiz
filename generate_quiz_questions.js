import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// Quiz questions for Computer Science category
const computerScienceQuestions = [
  // Additional Beginner Questions (need 2 more to reach 10)
  {
    question: "What is the purpose of the 'console.log()' function in JavaScript?",
    options: ["To display text in the browser", "To print text to the console", "To create a new variable", "To define a function"],
    correctAnswer: "To print text to the console",
    explanation: "console.log() is used to output text or data to the browser's console for debugging and development purposes.",
    difficulty: "beginner",
    topic: "javascript",
    relatedConcepts: ["debugging", "console", "output"]
  },
  {
    question: "Which of the following is a valid way to declare a constant in JavaScript?",
    options: ["const myVar = 5;", "constant myVar = 5;", "let myVar = 5;", "var myVar = 5;"],
    correctAnswer: "const myVar = 5;",
    explanation: "The 'const' keyword is used to declare constants in JavaScript. The value cannot be reassigned after declaration.",
    difficulty: "beginner",
    topic: "javascript",
    relatedConcepts: ["variables", "constants", "declaration"]
  },

  // Additional Intermediate Questions (need 2 more to reach 10)
  {
    question: "What is the difference between 'let' and 'var' in JavaScript?",
    options: ["'let' has block scope, 'var' has function scope", "'let' has function scope, 'var' has block scope", "There is no difference", "'let' is for numbers, 'var' is for strings"],
    correctAnswer: "'let' has block scope, 'var' has function scope",
    explanation: "'let' variables are block-scoped (limited to the block they're declared in), while 'var' variables are function-scoped.",
    difficulty: "intermediate",
    topic: "javascript",
    relatedConcepts: ["scope", "variables", "hoisting"]
  },
  {
    question: "What is the purpose of the 'map()' method in JavaScript?",
    options: ["To filter array elements", "To transform each element in an array", "To sort array elements", "To find an element in an array"],
    correctAnswer: "To transform each element in an array",
    explanation: "The map() method creates a new array with the results of calling a function for every array element.",
    difficulty: "intermediate",
    topic: "javascript",
    relatedConcepts: ["arrays", "functional programming", "transformation"]
  },

  // Additional Advanced Questions (need 6 more to reach 10)
  {
    question: "What is a Promise in JavaScript?",
    options: ["A guarantee that code will execute", "An object representing eventual completion of an asynchronous operation", "A type of function", "A way to declare variables"],
    correctAnswer: "An object representing eventual completion of an asynchronous operation",
    explanation: "A Promise is an object that represents the eventual completion (or failure) of an asynchronous operation and its resulting value.",
    difficulty: "advanced",
    topic: "javascript",
    relatedConcepts: ["asynchronous", "promises", "async/await"]
  },
  {
    question: "What is the event loop in JavaScript?",
    options: ["A loop that runs forever", "A mechanism that handles asynchronous operations", "A type of for loop", "A way to handle errors"],
    correctAnswer: "A mechanism that handles asynchronous operations",
    explanation: "The event loop is a mechanism that allows JavaScript to perform non-blocking operations despite being single-threaded.",
    difficulty: "advanced",
    topic: "javascript",
    relatedConcepts: ["event loop", "asynchronous", "single-threaded"]
  },
  {
    question: "What is prototypal inheritance in JavaScript?",
    options: ["A way to create classes", "A mechanism where objects inherit properties from other objects", "A type of function", "A way to declare variables"],
    correctAnswer: "A mechanism where objects inherit properties from other objects",
    explanation: "Prototypal inheritance is JavaScript's way of implementing inheritance where objects inherit properties and methods from other objects through a prototype chain.",
    difficulty: "advanced",
    topic: "javascript",
    relatedConcepts: ["inheritance", "prototypes", "objects"]
  },
  {
    question: "What is the difference between '==' and '===' in JavaScript?",
    options: ["No difference", "'==' checks value and type, '===' checks only value", "'==' checks only value, '===' checks value and type", "They are used for different data types"],
    correctAnswer: "'==' checks only value, '===' checks value and type",
    explanation: "'==' performs type coercion before comparison, while '===' performs strict equality comparison without type coercion.",
    difficulty: "advanced",
    topic: "javascript",
    relatedConcepts: ["equality", "type coercion", "comparison"]
  },
  {
    question: "What is a higher-order function in JavaScript?",
    options: ["A function that returns a number", "A function that takes one or more functions as arguments or returns a function", "A function with many parameters", "A function that runs faster"],
    correctAnswer: "A function that takes one or more functions as arguments or returns a function",
    explanation: "Higher-order functions are functions that either take one or more functions as arguments or return a function as their result.",
    difficulty: "advanced",
    topic: "javascript",
    relatedConcepts: ["functional programming", "functions", "callbacks"]
  },
  {
    question: "What is the purpose of the 'bind()' method in JavaScript?",
    options: ["To create a new function", "To bind a function to a specific context", "To sort an array", "To filter an array"],
    correctAnswer: "To bind a function to a specific context",
    explanation: "The bind() method creates a new function with the same body as the original function but with the 'this' keyword bound to a specific object.",
    difficulty: "advanced",
    topic: "javascript",
    relatedConcepts: ["this", "context", "functions"]
  },

  // Adaptive Questions (need 10 total)
  {
    question: "What is the output of: console.log(typeof [])?",
    options: ["'array'", "'object'", "'undefined'", "'function'"],
    correctAnswer: "'object'",
    explanation: "In JavaScript, arrays are objects, so typeof [] returns 'object'.",
    difficulty: "adaptive",
    topic: "javascript",
    relatedConcepts: ["arrays", "data types", "typeof"]
  },
  {
    question: "Which method removes the last element from an array?",
    options: ["pop()", "push()", "shift()", "unshift()"],
    correctAnswer: "pop()",
    explanation: "The pop() method removes and returns the last element from an array.",
    difficulty: "adaptive",
    topic: "javascript",
    relatedConcepts: ["arrays", "methods", "manipulation"]
  },
  {
    question: "What is the purpose of 'use strict' in JavaScript?",
    options: ["To make code run faster", "To enable strict mode for better error checking", "To disable all errors", "To enable all features"],
    correctAnswer: "To enable strict mode for better error checking",
    explanation: "'use strict' enables strict mode, which catches common coding mistakes and prevents certain actions.",
    difficulty: "adaptive",
    topic: "javascript",
    relatedConcepts: ["strict mode", "error checking", "best practices"]
  },
  {
    question: "What is the difference between 'null' and 'undefined' in JavaScript?",
    options: ["No difference", "'null' is assigned, 'undefined' is default", "'undefined' is assigned, 'null' is default", "They are different data types"],
    correctAnswer: "'null' is assigned, 'undefined' is default",
    explanation: "'null' is an explicitly assigned value representing 'no value', while 'undefined' is the default value for uninitialized variables.",
    difficulty: "adaptive",
    topic: "javascript",
    relatedConcepts: ["null", "undefined", "data types"]
  },
  {
    question: "What is the purpose of the 'filter()' method?",
    options: ["To sort array elements", "To create a new array with elements that pass a test", "To transform array elements", "To find a specific element"],
    correctAnswer: "To create a new array with elements that pass a test",
    explanation: "The filter() method creates a new array with all elements that pass the test implemented by the provided function.",
    difficulty: "adaptive",
    topic: "javascript",
    relatedConcepts: ["arrays", "filtering", "functional programming"]
  },
  {
    question: "What is a callback function?",
    options: ["A function that calls itself", "A function passed as an argument to another function", "A function that returns a value", "A function with no parameters"],
    correctAnswer: "A function passed as an argument to another function",
    explanation: "A callback function is a function that is passed as an argument to another function and is executed after the main function has finished execution.",
    difficulty: "adaptive",
    topic: "javascript",
    relatedConcepts: ["callbacks", "functions", "asynchronous"]
  },
  {
    question: "What is the purpose of 'localStorage' in JavaScript?",
    options: ["To store data temporarily", "To store data permanently in the browser", "To store data on the server", "To store data in a database"],
    correctAnswer: "To store data permanently in the browser",
    explanation: "localStorage allows you to store key-value pairs in the browser that persist even after the browser is closed.",
    difficulty: "adaptive",
    topic: "javascript",
    relatedConcepts: ["storage", "browser", "persistence"]
  },
  {
    question: "What is the difference between 'slice()' and 'splice()' in JavaScript?",
    options: ["No difference", "'slice()' modifies the original array, 'splice()' doesn't", "'slice()' doesn't modify the original array, 'splice()' does", "They work on different data types"],
    correctAnswer: "'slice()' doesn't modify the original array, 'splice()' does",
    explanation: "slice() returns a new array without modifying the original, while splice() modifies the original array.",
    difficulty: "adaptive",
    topic: "javascript",
    relatedConcepts: ["arrays", "methods", "mutability"]
  },
  {
    question: "What is the purpose of 'JSON.parse()'?",
    options: ["To convert an object to a string", "To convert a JSON string to an object", "To validate JSON", "To format JSON"],
    correctAnswer: "To convert a JSON string to an object",
    explanation: "JSON.parse() converts a JSON string into a JavaScript object.",
    difficulty: "adaptive",
    topic: "javascript",
    relatedConcepts: ["JSON", "parsing", "data conversion"]
  },
  {
    question: "What is the purpose of 'setTimeout()' in JavaScript?",
    options: ["To set a timer", "To execute a function after a specified delay", "To stop execution", "To measure time"],
    correctAnswer: "To execute a function after a specified delay",
    explanation: "setTimeout() executes a function after a specified number of milliseconds.",
    difficulty: "adaptive",
    topic: "javascript",
    relatedConcepts: ["timing", "asynchronous", "delays"]
  }
];

async function generateComputerScienceQuestions() {
  try {
    console.log('🎯 GENERATING COMPUTER SCIENCE QUIZ QUESTIONS\n');
    console.log('='.repeat(50));

    // Get the Computer Science category
    const computerScienceCategory = await prisma.category.findUnique({
      where: { name: 'Computer Science' }
    });

    if (!computerScienceCategory) {
      console.log('❌ Computer Science category not found');
      return;
    }

    console.log(`📁 Category: ${computerScienceCategory.name}`);
    console.log(`📝 Adding ${computerScienceQuestions.length} new questions...\n`);

    // Add the questions
    for (const questionData of computerScienceQuestions) {
      const question = await prisma.quizQuestion.create({
        data: {
          ...questionData,
          categoryId: computerScienceCategory.id
        }
      });
      console.log(`✅ Added: ${questionData.question.substring(0, 50)}... (${questionData.difficulty})`);
    }

    console.log('\n📊 VERIFICATION:');
    console.log('='.repeat(50));

    // Check the updated question count
    const updatedQuestions = await prisma.quizQuestion.findMany({
      where: { categoryId: computerScienceCategory.id }
    });

    const difficultyStats = {};
    updatedQuestions.forEach(q => {
      if (!difficultyStats[q.difficulty]) {
        difficultyStats[q.difficulty] = 0;
      }
      difficultyStats[q.difficulty]++;
    });

    console.log('\nUpdated Computer Science questions by difficulty:');
    Object.entries(difficultyStats).forEach(([difficulty, count]) => {
      const status = count >= 10 ? '✅' : '❌';
      console.log(`  ${difficulty}: ${count} questions ${status}`);
    });

    console.log(`\nTotal Computer Science questions: ${updatedQuestions.length}`);
    console.log('\n✅ Computer Science questions generated successfully!');

  } catch (error) {
    console.error('Error generating questions:', error);
  } finally {
    await prisma.$disconnect();
  }
}

generateComputerScienceQuestions(); 