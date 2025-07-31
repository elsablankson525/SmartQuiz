import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// All 20 subjects from the enhanced seed file
const subjects = [
  'JavaScript Fundamentals',
  'Python Programming', 
  'Web Development',
  'Data Science',
  'Machine Learning',
  'Human Anatomy',
  'Medical Terminology',
  'Business Fundamentals',
  'Digital Marketing',
  'Legal Fundamentals',
  'Psychology Basics',
  'Mathematics',
  'React Development',
  'Node.js Backend',
  'Database Design',
  'DevOps & CI/CD',
  'Cybersecurity',
  'Mobile Development',
  'Cloud Computing',
  'Blockchain & Crypto'
];

// Question templates for different subjects and difficulties
const questionTemplates = {
  'JavaScript Fundamentals': {
    beginner: [
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
    ],
    intermediate: [
      {
        question: 'What is the difference between "let" and "var"?',
        options: ['let is block-scoped, var is function-scoped', 'let is function-scoped, var is block-scoped', 'There is no difference', 'let is global, var is local'],
        correctAnswer: 'let is block-scoped, var is function-scoped',
        explanation: 'let has block scope while var has function scope. let also doesn\'t allow redeclaration.',
        topic: 'Variable Scoping',
        relatedConcepts: ['let', 'var', 'block scope', 'function scope']
      },
      {
        question: 'What is a closure in JavaScript?',
        options: ['A function that has access to variables in its outer scope', 'A way to close browser windows', 'A method to end loops', 'A type of array'],
        correctAnswer: 'A function that has access to variables in its outer scope',
        explanation: 'A closure is a function that retains access to variables from its outer scope even after the outer function has returned.',
        topic: 'Closures',
        relatedConcepts: ['closures', 'lexical scope', 'function scope', 'memory management']
      },
      {
        question: 'What is the purpose of the "this" keyword?',
        options: ['To refer to the current function', 'To refer to the current object context', 'To create a new object', 'To end a loop'],
        correctAnswer: 'To refer to the current object context',
        explanation: 'The "this" keyword refers to the object that is currently executing the code.',
        topic: 'This Keyword',
        relatedConcepts: ['this', 'context', 'object methods', 'binding']
      },
      {
        question: 'What is the difference between "==" and "==="?',
        options: ['== checks value and type, === checks only value', '== checks only value, === checks value and type', 'There is no difference', '== is faster than ==='],
        correctAnswer: '== checks only value, === checks value and type',
        explanation: '== performs type coercion and checks value equality, while === checks both value and type without coercion.',
        topic: 'Operators',
        relatedConcepts: ['loose equality', 'strict equality', 'type coercion']
      },
      {
        question: 'What is an immediately invoked function expression (IIFE)?',
        options: ['A function that runs immediately when defined', 'A function that runs after a delay', 'A function that runs only once', 'A function that runs in a loop'],
        correctAnswer: 'A function that runs immediately when defined',
        explanation: 'An IIFE is a function that is executed immediately after it is created.',
        topic: 'IIFE',
        relatedConcepts: ['IIFE', 'immediately invoked', 'function expression', 'scope isolation']
      },
      {
        question: 'What is the purpose of "use strict"?',
        options: ['To make code run faster', 'To enable strict mode for better error checking', 'To disable certain features', 'To enable debugging'],
        correctAnswer: 'To enable strict mode for better error checking',
        explanation: 'Strict mode helps catch common coding mistakes and prevents certain actions that might be confusing or ill-advised.',
        topic: 'Strict Mode',
        relatedConcepts: ['use strict', 'strict mode', 'error checking', 'best practices']
      },
      {
        question: 'What is the difference between "null" and "undefined"?',
        options: ['null is assigned, undefined is not', 'undefined is assigned, null is not', 'They are the same', 'null is a type, undefined is a value'],
        correctAnswer: 'null is assigned, undefined is not',
        explanation: 'null is an explicitly assigned value, while undefined typically means a variable has been declared but not assigned a value.',
        topic: 'Null and Undefined',
        relatedConcepts: ['null', 'undefined', 'falsy values', 'type checking']
      },
      {
        question: 'What is the purpose of the "bind()" method?',
        options: ['To bind two objects together', 'To create a new function with a fixed "this" context', 'To bind event listeners', 'To bind arrays together'],
        correctAnswer: 'To create a new function with a fixed "this" context',
        explanation: 'bind() creates a new function with the "this" keyword bound to a specific object.',
        topic: 'Function Methods',
        relatedConcepts: ['bind', 'call', 'apply', 'this binding']
      },
      {
        question: 'What is a promise in JavaScript?',
        options: ['A guarantee that code will run', 'An object representing eventual completion of an async operation', 'A type of function', 'A way to store data'],
        correctAnswer: 'An object representing eventual completion of an async operation',
        explanation: 'A Promise is an object that represents the eventual completion (or failure) of an asynchronous operation.',
        topic: 'Promises',
        relatedConcepts: ['promises', 'async', 'await', 'asynchronous programming']
      },
      {
        question: 'What is the purpose of "Object.freeze()"?',
        options: ['To make an object immutable', 'To stop object execution', 'To freeze browser performance', 'To create a copy of an object'],
        correctAnswer: 'To make an object immutable',
        explanation: 'Object.freeze() makes an object immutable by preventing new properties from being added and existing properties from being modified or deleted.',
        topic: 'Object Methods',
        relatedConcepts: ['Object.freeze', 'immutability', 'object properties', 'const']
      }
    ],
    advanced: [
      {
        question: 'What is the difference between "Object.create()" and "new" keyword?',
        options: ['Object.create() uses prototypal inheritance, new uses constructor functions', 'new is faster than Object.create()', 'Object.create() is deprecated', 'There is no difference'],
        correctAnswer: 'Object.create() uses prototypal inheritance, new uses constructor functions',
        explanation: 'Object.create() creates an object with a specified prototype, while new calls a constructor function.',
        topic: 'Object Creation',
        relatedConcepts: ['Object.create', 'new keyword', 'prototypal inheritance', 'constructor functions']
      },
      {
        question: 'What is the purpose of "Symbol" in JavaScript?',
        options: ['To create unique identifiers', 'To represent mathematical symbols', 'To create special characters', 'To define constants'],
        correctAnswer: 'To create unique identifiers',
        explanation: 'Symbols are primitive values that are guaranteed to be unique, often used as property keys.',
        topic: 'Symbols',
        relatedConcepts: ['Symbol', 'unique identifiers', 'property keys', 'primitives']
      },
      {
        question: 'What is the difference between "WeakMap" and "Map"?',
        options: ['WeakMap keys must be objects and don\'t prevent garbage collection', 'WeakMap is faster than Map', 'Map is deprecated', 'There is no difference'],
        correctAnswer: 'WeakMap keys must be objects and don\'t prevent garbage collection',
        explanation: 'WeakMap keys must be objects and don\'t create strong references, allowing garbage collection.',
        topic: 'WeakMap',
        relatedConcepts: ['WeakMap', 'Map', 'garbage collection', 'memory management']
      },
      {
        question: 'What is the purpose of "Proxy" in JavaScript?',
        options: ['To create network proxies', 'To intercept and customize operations on objects', 'To improve performance', 'To create security barriers'],
        correctAnswer: 'To intercept and customize operations on objects',
        explanation: 'Proxy allows you to intercept and customize operations like property lookup, assignment, enumeration, etc.',
        topic: 'Proxy',
        relatedConcepts: ['Proxy', 'interceptors', 'meta-programming', 'object operations']
      },
      {
        question: 'What is the difference between "async/await" and "Promises"?',
        options: ['async/await is syntactic sugar over Promises', 'Promises are deprecated', 'async/await is faster', 'There is no difference'],
        correctAnswer: 'async/await is syntactic sugar over Promises',
        explanation: 'async/await provides a more readable way to work with Promises, making asynchronous code look synchronous.',
        topic: 'Async/Await',
        relatedConcepts: ['async', 'await', 'Promises', 'asynchronous programming']
      },
      {
        question: 'What is the purpose of "Reflect" in JavaScript?',
        options: ['To reflect light in graphics', 'To provide methods for interceptable JavaScript operations', 'To create mirrors', 'To improve performance'],
        correctAnswer: 'To provide methods for interceptable JavaScript operations',
        explanation: 'Reflect provides methods for interceptable JavaScript operations, similar to Proxy but as static methods.',
        topic: 'Reflect',
        relatedConcepts: ['Reflect', 'Proxy', 'meta-programming', 'object operations']
      },
      {
        question: 'What is the difference between "Object.assign()" and spread operator?',
        options: ['Object.assign() mutates the target, spread creates a new object', 'Spread is faster', 'Object.assign() is deprecated', 'There is no difference'],
        correctAnswer: 'Object.assign() mutates the target, spread creates a new object',
        explanation: 'Object.assign() modifies the target object, while spread operator creates a new object.',
        topic: 'Object Methods',
        relatedConcepts: ['Object.assign', 'spread operator', 'immutability', 'object copying']
      },
      {
        question: 'What is the purpose of "Generator" functions?',
        options: ['To generate random numbers', 'To create iterable functions that can pause and resume', 'To improve performance', 'To create loops'],
        correctAnswer: 'To create iterable functions that can pause and resume',
        explanation: 'Generator functions can pause and resume execution, yielding multiple values over time.',
        topic: 'Generators',
        relatedConcepts: ['Generator', 'yield', 'iterators', 'function pausing']
      },
      {
        question: 'What is the difference between "Set" and "Array"?',
        options: ['Set only stores unique values, Array can have duplicates', 'Array is faster', 'Set is deprecated', 'There is no difference'],
        correctAnswer: 'Set only stores unique values, Array can have duplicates',
        explanation: 'Set is a collection of unique values, while Array can contain duplicate values and maintains order.',
        topic: 'Set',
        relatedConcepts: ['Set', 'Array', 'unique values', 'collections']
      },
      {
        question: 'What is the purpose of "BigInt" in JavaScript?',
        options: ['To handle large integers beyond Number.MAX_SAFE_INTEGER', 'To improve performance', 'To create big numbers', 'To handle decimals'],
        correctAnswer: 'To handle large integers beyond Number.MAX_SAFE_INTEGER',
        explanation: 'BigInt allows you to work with integers larger than 2^53 - 1, which is the maximum safe integer in JavaScript.',
        topic: 'BigInt',
        relatedConcepts: ['BigInt', 'large integers', 'Number.MAX_SAFE_INTEGER', 'precision']
      }
    ],
    adaptive: [
      {
        question: 'What is the output of: console.log(typeof null)?',
        options: ['null', 'undefined', 'object', 'number'],
        correctAnswer: 'object',
        explanation: 'This is a known JavaScript quirk - typeof null returns "object" due to a bug in the original implementation.',
        topic: 'Type Checking',
        relatedConcepts: ['typeof', 'null', 'type checking', 'JavaScript quirks']
      },
      {
        question: 'What is the result of: [1, 2, 3] + [4, 5, 6]?',
        options: ['[1,2,3,4,5,6]', '[1,2,3][4,5,6]', '1,2,34,5,6', 'Error'],
        correctAnswer: '1,2,34,5,6',
        explanation: 'Arrays are converted to strings and concatenated, not merged as arrays.',
        topic: 'Type Coercion',
        relatedConcepts: ['array concatenation', 'type coercion', 'string conversion']
      },
      {
        question: 'What is the output of: console.log(0.1 + 0.2 === 0.3)?',
        options: ['true', 'false', 'undefined', 'Error'],
        correctAnswer: 'false',
        explanation: 'Due to floating-point precision issues, 0.1 + 0.2 equals approximately 0.30000000000000004, not exactly 0.3.',
        topic: 'Floating Point Precision',
        relatedConcepts: ['floating point', 'precision', 'IEEE 754', 'decimal arithmetic']
      },
      {
        question: 'What is the result of: typeof function(){}?',
        options: ['function', 'object', 'undefined', 'Error'],
        correctAnswer: 'function',
        explanation: 'Functions are objects in JavaScript, but typeof returns "function" for function objects.',
        topic: 'Type Checking',
        relatedConcepts: ['typeof', 'functions', 'objects', 'type checking']
      },
      {
        question: 'What is the output of: console.log([] == false)?',
        options: ['true', 'false', 'undefined', 'Error'],
        correctAnswer: 'true',
        explanation: 'Due to type coercion, empty array is converted to 0, and false is also 0, so they are equal.',
        topic: 'Type Coercion',
        relatedConcepts: ['loose equality', 'type coercion', 'falsy values', 'array conversion']
      },
      {
        question: 'What is the result of: console.log(1 < 2 < 3)?',
        options: ['true', 'false', 'Error', 'undefined'],
        correctAnswer: 'true',
        explanation: 'This evaluates as (1 < 2) < 3, which is true < 3, and true is converted to 1, so 1 < 3 is true.',
        topic: 'Operator Precedence',
        relatedConcepts: ['operator precedence', 'type coercion', 'comparison operators']
      },
      {
        question: 'What is the output of: console.log(Math.max())?',
        options: ['0', 'undefined', '-Infinity', 'Error'],
        correctAnswer: '-Infinity',
        explanation: 'When no arguments are provided, Math.max() returns -Infinity as the starting point for comparison.',
        topic: 'Math Methods',
        relatedConcepts: ['Math.max', 'Infinity', 'default values', 'mathematical operations']
      },
      {
        question: 'What is the result of: console.log(!![])?',
        options: ['true', 'false', 'undefined', 'Error'],
        correctAnswer: 'true',
        explanation: 'The double negation (!!) converts the empty array to a boolean. Arrays are truthy in JavaScript.',
        topic: 'Boolean Conversion',
        relatedConcepts: ['boolean conversion', 'truthy values', 'falsy values', 'double negation']
      },
      {
        question: 'What is the output of: console.log("5" - 3)?',
        options: ['2', '53', 'NaN', 'Error'],
        correctAnswer: '2',
        explanation: 'The string "5" is converted to number 5, then 5 - 3 = 2. Subtraction triggers numeric conversion.',
        topic: 'Type Coercion',
        relatedConcepts: ['type coercion', 'numeric conversion', 'arithmetic operators']
      },
      {
        question: 'What is the result of: console.log(typeof undefined)?',
        options: ['undefined', 'object', 'null', 'Error'],
        correctAnswer: 'undefined',
        explanation: 'typeof undefined returns "undefined", which is the only value that has this type.',
        topic: 'Type Checking',
        relatedConcepts: ['typeof', 'undefined', 'type checking', 'primitive types']
      }
    ]
  }
};

// Function to generate questions for a subject
function generateQuestionsForSubject(subject: string) {
  const questions = [];
  const difficulties = ['beginner', 'intermediate', 'advanced', 'adaptive'];
  
  for (const difficulty of difficulties) {
    // For now, we'll use JavaScript questions as a template and modify them
    // In a real implementation, you'd have specific questions for each subject
    const templateQuestions = questionTemplates['JavaScript Fundamentals']?.[difficulty as keyof typeof questionTemplates['JavaScript Fundamentals']];
    
    if (templateQuestions) {
      for (let i = 0; i < 10; i++) {
        const templateQuestion = templateQuestions[i];
        if (templateQuestion) {
          questions.push({
            subject,
            difficulty,
            question: templateQuestion.question,
            options: templateQuestion.options,
            correctAnswer: templateQuestion.correctAnswer,
            explanation: templateQuestion.explanation,
            topic: templateQuestion.topic,
            relatedConcepts: templateQuestion.relatedConcepts
          });
        }
      }
    }
  }
  
  return questions;
}

// Function to seed all quiz questions
export async function seedAllQuizQuestions() {
  console.log('Starting to seed quiz questions for all subjects...');
  
  let totalQuestions = 0;
  
  for (const subject of subjects) {
    console.log(`Generating questions for: ${subject}`);
    const questions = generateQuestionsForSubject(subject);
    
    for (const questionData of questions) {
      await prisma.question.create({
        data: {
          id: `${subject.toLowerCase().replace(/\s+/g, '-')}-${questionData.difficulty}-${Math.random().toString(36).substr(2, 9)}`,
          question: questionData.question,
          options: questionData.options,
          correctAnswer: questionData.correctAnswer,
          explanation: questionData.explanation,
          category: subject,
          difficulty: questionData.difficulty,
          topic: questionData.topic,
          relatedConcepts: questionData.relatedConcepts,
        }
      });
      totalQuestions++;
    }
  }
  
  console.log(`Successfully seeded ${totalQuestions} quiz questions for all subjects!`);
  console.log(`Generated ${subjects.length} subjects × 4 difficulties × 10 questions = ${subjects.length * 4 * 10} total questions`);
}

// Function to run the seeding
async function main() {
  try {
    await seedAllQuizQuestions();
  } catch (error) {
    console.error('Error seeding quiz questions:', error);
  } finally {
    await prisma.$disconnect();
  }
}

// Run if this file is executed directly
if (require.main === module) {
  main();
} 