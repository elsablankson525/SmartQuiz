import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export const javascriptQuizQuestions = [
  {
    subject: 'JavaScript Fundamentals',
    difficulty: 'beginner',
    questions: [
      {
        question: 'What is the correct way to declare a variable in JavaScript?',
        options: ['var x = 5;', 'variable x = 5;', 'v x = 5;', 'declare x = 5;'],
        correctAnswer: 'var x = 5;',
        explanation: 'The "var" keyword is used to declare variables in JavaScript. "let" and "const" are also valid in modern JavaScript.',
        topic: 'Variables and Declaration',
        relatedConcepts: ['var', 'let', 'const', 'variable declaration']
      },
      {
        question: 'Which of the following is a JavaScript data type?',
        options: ['Integer', 'Float', 'String', 'Character'],
        correctAnswer: 'String',
        explanation: 'JavaScript has primitive data types including String, Number, Boolean, Undefined, Null, and Symbol.',
        topic: 'Data Types',
        relatedConcepts: ['primitive types', 'string', 'number', 'boolean']
      },
      {
        question: 'How do you write a comment in JavaScript?',
        options: ['<!-- comment -->', '// comment', '/* comment */', 'Both B and C'],
        correctAnswer: 'Both B and C',
        explanation: 'JavaScript supports both single-line comments (//) and multi-line comments (/* */).',
        topic: 'Comments',
        relatedConcepts: ['comments', 'documentation', 'code readability']
      },
      {
        question: 'What is the result of 2 + "2" in JavaScript?',
        options: ['4', '22', 'NaN', 'Error'],
        correctAnswer: '22',
        explanation: 'JavaScript performs type coercion. When adding a number and string, the number is converted to a string and concatenated.',
        topic: 'Type Coercion',
        relatedConcepts: ['type coercion', 'string concatenation', 'implicit conversion']
      },
      {
        question: 'Which method is used to add an element to the end of an array?',
        options: ['push()', 'pop()', 'shift()', 'unshift()'],
        correctAnswer: 'push()',
        explanation: 'The push() method adds one or more elements to the end of an array and returns the new length.',
        topic: 'Array Methods',
        relatedConcepts: ['arrays', 'push', 'pop', 'array manipulation']
      },
      {
        question: 'What is the correct way to check if a variable is undefined?',
        options: ['if (x == undefined)', 'if (x === undefined)', 'if (x = undefined)', 'if (x !== undefined)'],
        correctAnswer: 'if (x === undefined)',
        explanation: 'Use strict equality (===) to check for undefined. The loose equality (==) can cause unexpected behavior.',
        topic: 'Conditional Statements',
        relatedConcepts: ['undefined', 'strict equality', 'conditional checks']
      },
      {
        question: 'How do you create a function in JavaScript?',
        options: ['function myFunction()', 'function: myFunction()', 'create function myFunction()', 'def myFunction()'],
        correctAnswer: 'function myFunction()',
        explanation: 'The "function" keyword is used to declare a function in JavaScript.',
        topic: 'Functions',
        relatedConcepts: ['function declaration', 'function expression', 'arrow functions']
      },
      {
        question: 'What is the purpose of the "return" statement?',
        options: ['To stop the function execution', 'To return a value from a function', 'To break out of a loop', 'All of the above'],
        correctAnswer: 'To return a value from a function',
        explanation: 'The return statement specifies the value to be returned from a function.',
        topic: 'Functions',
        relatedConcepts: ['return statement', 'function output', 'function values']
      },
      {
        question: 'Which operator is used for strict equality comparison?',
        options: ['==', '===', '=', '!='],
        correctAnswer: '===',
        explanation: 'The === operator checks both value and type equality, while == only checks value equality.',
        topic: 'Operators',
        relatedConcepts: ['strict equality', 'loose equality', 'type comparison']
      },
      {
        question: 'What is the correct way to access an object property?',
        options: ['object.property', 'object[property]', 'Both A and B', 'object->property'],
        correctAnswer: 'Both A and B',
        explanation: 'You can access object properties using dot notation (object.property) or bracket notation (object[property]).',
        topic: 'Objects',
        relatedConcepts: ['object properties', 'dot notation', 'bracket notation']
      }
    ]
  }
];

export async function seedJavaScriptQuizQuestions() {
  console.log('Seeding JavaScript quiz questions...');
  
  for (const subjectData of javascriptQuizQuestions) {
    const { subject, difficulty, questions } = subjectData;
    
    for (const questionData of questions) {
      await prisma.question.create({
        data: {
          id: `${subject.toLowerCase().replace(/\s+/g, '-')}-${difficulty}-${Math.random().toString(36).substr(2, 9)}`,
          question: questionData.question,
          options: questionData.options,
          correctAnswer: questionData.correctAnswer,
          explanation: questionData.explanation,
          category: subject,
          difficulty: difficulty,
          topic: questionData.topic,
          relatedConcepts: questionData.relatedConcepts,
        }
      });
    }
  }
  
  console.log('JavaScript quiz questions seeded successfully!');
} 