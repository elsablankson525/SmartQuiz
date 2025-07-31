import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export const quizQuestionsSubjects1to5 = [
  // ===== JAVASCRIPT FUNDAMENTALS =====
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
  },
  {
    subject: 'JavaScript Fundamentals',
    difficulty: 'intermediate',
    questions: [
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
    ]
  },
  {
    subject: 'JavaScript Fundamentals',
    difficulty: 'advanced',
    questions: [
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
    ]
  },
  {
    subject: 'JavaScript Fundamentals',
    difficulty: 'adaptive',
    questions: [
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
  },

  // ===== PYTHON PROGRAMMING =====
  {
    subject: 'Python Programming',
    difficulty: 'beginner',
    questions: [
      {
        question: 'What is the correct way to create a variable in Python?',
        options: ['var x = 5', 'x = 5', 'variable x = 5', 'declare x = 5'],
        correctAnswer: 'x = 5',
        explanation: 'In Python, you simply assign a value to create a variable. No declaration keyword is needed.',
        topic: 'Variables',
        relatedConcepts: ['variable assignment', 'python syntax', 'data types']
      },
      {
        question: 'Which of the following is a Python data type?',
        options: ['String', 'Integer', 'Float', 'All of the above'],
        correctAnswer: 'All of the above',
        explanation: 'Python has several built-in data types including String, Integer, Float, Boolean, List, Tuple, Dictionary, and Set.',
        topic: 'Data Types',
        relatedConcepts: ['built-in types', 'primitives', 'python fundamentals']
      },
      {
        question: 'How do you write a comment in Python?',
        options: ['// comment', '/* comment */', '# comment', '<!-- comment -->'],
        correctAnswer: '# comment',
        explanation: 'In Python, the hash symbol (#) is used for single-line comments.',
        topic: 'Comments',
        relatedConcepts: ['comments', 'documentation', 'code readability']
      },
      {
        question: 'What is the result of 2 + "2" in Python?',
        options: ['4', '22', 'TypeError', 'Error'],
        correctAnswer: 'TypeError',
        explanation: 'Python does not perform automatic type coercion like JavaScript. You cannot add an integer and a string directly.',
        topic: 'Type Errors',
        relatedConcepts: ['type errors', 'type safety', 'python strict typing']
      },
      {
        question: 'Which method is used to add an element to a list?',
        options: ['add()', 'append()', 'insert()', 'push()'],
        correctAnswer: 'append()',
        explanation: 'The append() method adds an element to the end of a list.',
        topic: 'List Methods',
        relatedConcepts: ['lists', 'append', 'list manipulation', 'collections']
      },
      {
        question: 'What is the correct way to check if a variable is None?',
        options: ['if x == None', 'if x is None', 'if x = None', 'if x !== None'],
        correctAnswer: 'if x is None',
        explanation: 'Use "is" to check for None, as it checks for identity rather than equality.',
        topic: 'None Check',
        relatedConcepts: ['None', 'identity comparison', 'python best practices']
      },
      {
        question: 'How do you create a function in Python?',
        options: ['function my_function():', 'def my_function():', 'create function my_function():', 'func my_function():'],
        correctAnswer: 'def my_function():',
        explanation: 'The "def" keyword is used to define a function in Python.',
        topic: 'Functions',
        relatedConcepts: ['function definition', 'def keyword', 'python functions']
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
        question: 'Which operator is used for equality comparison?',
        options: ['==', '===', '=', '!='],
        correctAnswer: '==',
        explanation: 'The == operator checks for equality of values in Python.',
        topic: 'Operators',
        relatedConcepts: ['equality', 'comparison operators', 'python operators']
      },
      {
        question: 'What is the correct way to access a dictionary value?',
        options: ['dict.key', 'dict[key]', 'dict->key', 'dict.get(key)'],
        correctAnswer: 'dict[key]',
        explanation: 'You can access dictionary values using square bracket notation with the key.',
        topic: 'Dictionaries',
        relatedConcepts: ['dictionaries', 'key-value pairs', 'data structures']
      }
    ]
  },
  {
    subject: 'Python Programming',
    difficulty: 'intermediate',
    questions: [
      {
        question: 'What is the difference between a list and a tuple?',
        options: ['Lists are mutable, tuples are immutable', 'Tuples are faster than lists', 'Lists can only contain numbers', 'There is no difference'],
        correctAnswer: 'Lists are mutable, tuples are immutable',
        explanation: 'Lists can be modified after creation, while tuples cannot be changed once created.',
        topic: 'Data Structures',
        relatedConcepts: ['lists', 'tuples', 'mutability', 'immutability']
      },
      {
        question: 'What is a lambda function?',
        options: ['A function that runs in parallel', 'A small anonymous function', 'A function that never ends', 'A function that calls itself'],
        correctAnswer: 'A small anonymous function',
        explanation: 'Lambda functions are small anonymous functions that can have any number of arguments but only one expression.',
        topic: 'Lambda Functions',
        relatedConcepts: ['lambda', 'anonymous functions', 'functional programming']
      },
      {
        question: 'What is the purpose of the "self" parameter?',
        options: ['To refer to the current function', 'To refer to the current instance of a class', 'To create a new object', 'To end a loop'],
        correctAnswer: 'To refer to the current instance of a class',
        explanation: 'The "self" parameter refers to the current instance of the class and is used to access instance variables and methods.',
        topic: 'Classes',
        relatedConcepts: ['self', 'classes', 'object-oriented programming', 'instance methods']
      },
      {
        question: 'What is the difference between "==" and "is"?',
        options: ['== checks value, is checks identity', 'is checks value, == checks identity', 'There is no difference', '== is faster than is'],
        correctAnswer: '== checks value, is checks identity',
        explanation: '== checks for equality of values, while "is" checks if two variables point to the same object in memory.',
        topic: 'Comparison Operators',
        relatedConcepts: ['equality', 'identity', 'object comparison', 'memory references']
      },
      {
        question: 'What is a generator in Python?',
        options: ['A function that generates random numbers', 'A function that yields values one at a time', 'A function that runs in a loop', 'A function that creates objects'],
        correctAnswer: 'A function that yields values one at a time',
        explanation: 'A generator is a function that uses the yield keyword to return values one at a time, making it memory efficient.',
        topic: 'Generators',
        relatedConcepts: ['generators', 'yield', 'iterators', 'memory efficiency']
      },
      {
        question: 'What is the purpose of "try-except"?',
        options: ['To make code run faster', 'To handle exceptions and errors', 'To create loops', 'To define functions'],
        correctAnswer: 'To handle exceptions and errors',
        explanation: 'try-except blocks are used to catch and handle exceptions that may occur during program execution.',
        topic: 'Exception Handling',
        relatedConcepts: ['try-except', 'exception handling', 'error handling', 'programming best practices']
      },
      {
        question: 'What is the difference between "append()" and "extend()"?',
        options: ['append() adds one element, extend() adds multiple elements', 'extend() is faster', 'append() is deprecated', 'There is no difference'],
        correctAnswer: 'append() adds one element, extend() adds multiple elements',
        explanation: 'append() adds a single element to the end of a list, while extend() adds all elements from an iterable.',
        topic: 'List Methods',
        relatedConcepts: ['append', 'extend', 'list manipulation', 'iterables']
      },
      {
        question: 'What is the purpose of the "with" statement?',
        options: ['To create loops', 'To handle context managers', 'To define functions', 'To create classes'],
        correctAnswer: 'To handle context managers',
        explanation: 'The "with" statement is used to handle context managers, ensuring proper resource management.',
        topic: 'Context Managers',
        relatedConcepts: ['with statement', 'context managers', 'resource management', 'file handling']
      },
      {
        question: 'What is a decorator in Python?',
        options: ['A function that modifies another function', 'A way to decorate output', 'A type of loop', 'A way to create classes'],
        correctAnswer: 'A function that modifies another function',
        explanation: 'A decorator is a function that takes another function as input and returns a modified version of that function.',
        topic: 'Decorators',
        relatedConcepts: ['decorators', 'function modification', 'metaprogramming', 'higher-order functions']
      },
      {
        question: 'What is the purpose of "__init__"?',
        options: ['To initialize a class', 'To create a constructor method', 'To end a function', 'To create a loop'],
        correctAnswer: 'To create a constructor method',
        explanation: '__init__ is a special method that is called when an object is created from a class.',
        topic: 'Classes',
        relatedConcepts: ['__init__', 'constructor', 'classes', 'object initialization']
      }
    ]
  },
  {
    subject: 'Python Programming',
    difficulty: 'advanced',
    questions: [
      {
        question: 'What is the difference between "deepcopy" and "copy"?',
        options: ['deepcopy creates a completely independent copy, copy creates a shallow copy', 'copy is faster', 'deepcopy is deprecated', 'There is no difference'],
        correctAnswer: 'deepcopy creates a completely independent copy, copy creates a shallow copy',
        explanation: 'deepcopy recursively copies nested objects, while copy only creates a shallow copy of the top-level object.',
        topic: 'Object Copying',
        relatedConcepts: ['deepcopy', 'copy', 'object copying', 'nested objects']
      },
      {
        question: 'What is the purpose of "__slots__"?',
        options: ['To create slots in a class', 'To optimize memory usage by restricting attributes', 'To create loops', 'To define methods'],
        correctAnswer: 'To optimize memory usage by restricting attributes',
        explanation: '__slots__ allows you to explicitly declare which attributes a class can have, reducing memory usage.',
        topic: 'Class Optimization',
        relatedConcepts: ['__slots__', 'memory optimization', 'class attributes', 'performance']
      },
      {
        question: 'What is the difference between "metaclass" and "class"?',
        options: ['A metaclass is a class that creates classes', 'A class is a metaclass', 'There is no difference', 'Metaclass is deprecated'],
        correctAnswer: 'A metaclass is a class that creates classes',
        explanation: 'A metaclass is a class that creates other classes. It controls how classes are created.',
        topic: 'Metaclasses',
        relatedConcepts: ['metaclasses', 'class creation', 'metaprogramming', 'type system']
      },
      {
        question: 'What is the purpose of "asyncio"?',
        options: ['To create asynchronous programming', 'To handle network operations', 'To improve performance', 'All of the above'],
        correctAnswer: 'All of the above',
        explanation: 'asyncio is a library for writing asynchronous code using coroutines, multiplexing I/O access over sockets and other resources.',
        topic: 'Asynchronous Programming',
        relatedConcepts: ['asyncio', 'async/await', 'coroutines', 'concurrent programming']
      },
      {
        question: 'What is the difference between "property" and "attribute"?',
        options: ['Property is a method that acts like an attribute', 'Attribute is a method', 'There is no difference', 'Property is deprecated'],
        correctAnswer: 'Property is a method that acts like an attribute',
        explanation: 'A property is a method that can be accessed like an attribute, allowing for getter/setter functionality.',
        topic: 'Properties',
        relatedConcepts: ['property', 'attributes', 'getters', 'setters']
      },
      {
        question: 'What is the purpose of "__call__"?',
        options: ['To make objects callable', 'To create functions', 'To end loops', 'To create classes'],
        correctAnswer: 'To make objects callable',
        explanation: '__call__ allows instances of a class to be called like functions.',
        topic: 'Callable Objects',
        relatedConcepts: ['__call__', 'callable objects', 'function-like objects', 'magic methods']
      },
      {
        question: 'What is the difference between "pickle" and "json"?',
        options: ['Pickle is Python-specific, JSON is universal', 'JSON is faster', 'Pickle is deprecated', 'There is no difference'],
        correctAnswer: 'Pickle is Python-specific, JSON is universal',
        explanation: 'Pickle is Python-specific serialization, while JSON is a universal data format that can be used across languages.',
        topic: 'Serialization',
        relatedConcepts: ['pickle', 'json', 'serialization', 'data formats']
      },
      {
        question: 'What is the purpose of "descriptor"?',
        options: ['To describe objects', 'To control attribute access', 'To create loops', 'To define functions'],
        correctAnswer: 'To control attribute access',
        explanation: 'Descriptors are objects that define __get__, __set__, or __delete__ methods, allowing fine-grained control over attribute access.',
        topic: 'Descriptors',
        relatedConcepts: ['descriptors', 'attribute access', 'magic methods', 'metaprogramming']
      },
      {
        question: 'What is the difference between "threading" and "multiprocessing"?',
        options: ['Threading shares memory, multiprocessing uses separate memory', 'Multiprocessing is faster', 'Threading is deprecated', 'There is no difference'],
        correctAnswer: 'Threading shares memory, multiprocessing uses separate memory',
        explanation: 'Threading uses shared memory and is limited by the Global Interpreter Lock, while multiprocessing uses separate memory spaces.',
        topic: 'Concurrency',
        relatedConcepts: ['threading', 'multiprocessing', 'GIL', 'concurrent programming']
      },
      {
        question: 'What is the purpose of "__new__"?',
        options: ['To create new objects', 'To create a new instance of a class', 'To create loops', 'To define methods'],
        correctAnswer: 'To create a new instance of a class',
        explanation: '__new__ is a static method that is called before __init__ and is responsible for creating and returning a new instance.',
        topic: 'Object Creation',
        relatedConcepts: ['__new__', '__init__', 'object creation', 'magic methods']
      }
    ]
  },
  {
    subject: 'Python Programming',
    difficulty: 'adaptive',
    questions: [
      {
        question: 'What is the output of: print(type([]))?',
        options: ['list', 'array', 'tuple', 'sequence'],
        correctAnswer: 'list',
        explanation: 'Empty square brackets create a list in Python.',
        topic: 'Type Checking',
        relatedConcepts: ['type', 'lists', 'built-in types']
      },
      {
        question: 'What is the result of: [1, 2, 3] * 3?',
        options: ['[3, 6, 9]', '[1, 2, 3, 1, 2, 3, 1, 2, 3]', '[1, 2, 3]', 'Error'],
        correctAnswer: '[1, 2, 3, 1, 2, 3, 1, 2, 3]',
        explanation: 'Multiplying a list by an integer repeats the list that many times.',
        topic: 'List Operations',
        relatedConcepts: ['list multiplication', 'repetition', 'list operations']
      },
      {
        question: 'What is the output of: print(0.1 + 0.2 == 0.3)?',
        options: ['True', 'False', 'Error', 'None'],
        correctAnswer: 'False',
        explanation: 'Due to floating-point precision, 0.1 + 0.2 is approximately 0.30000000000000004, not exactly 0.3.',
        topic: 'Floating Point',
        relatedConcepts: ['floating point precision', 'IEEE 754', 'decimal arithmetic']
      },
      {
        question: 'What is the result of: print(bool([]))?',
        options: ['True', 'False', 'Error', 'None'],
        correctAnswer: 'False',
        explanation: 'Empty lists are considered falsy in Python.',
        topic: 'Boolean Conversion',
        relatedConcepts: ['bool', 'falsy values', 'truthy values']
      },
      {
        question: 'What is the output of: print("hello" * 3)?',
        options: ['hellohellohello', 'hello3', 'Error', 'None'],
        correctAnswer: 'hellohellohello',
        explanation: 'String multiplication repeats the string that many times.',
        topic: 'String Operations',
        relatedConcepts: ['string multiplication', 'string repetition', 'string operations']
      },
      {
        question: 'What is the result of: print(3 / 2)?',
        options: ['1', '1.5', '2', 'Error'],
        correctAnswer: '1.5',
        explanation: 'In Python 3, division always returns a float, even when dividing integers.',
        topic: 'Division',
        relatedConcepts: ['division', 'floating point', 'python 3 changes']
      },
      {
        question: 'What is the output of: print(len("hello"))?',
        options: ['5', '4', '6', 'Error'],
        correctAnswer: '5',
        explanation: 'The len() function returns the number of characters in a string.',
        topic: 'String Length',
        relatedConcepts: ['len', 'string length', 'built-in functions']
      },
      {
        question: 'What is the result of: print([1, 2, 3] + [4, 5, 6])?',
        options: ['[5, 7, 9]', '[1, 2, 3, 4, 5, 6]', '[1, 2, 3][4, 5, 6]', 'Error'],
        correctAnswer: '[1, 2, 3, 4, 5, 6]',
        explanation: 'The + operator concatenates lists, not adds their elements.',
        topic: 'List Concatenation',
        relatedConcepts: ['list concatenation', 'list operations', 'addition vs concatenation']
      },
      {
        question: 'What is the output of: print(max([1, 2, 3]))?',
        options: ['1', '2', '3', 'Error'],
        correctAnswer: '3',
        explanation: 'The max() function returns the largest value in an iterable.',
        topic: 'Built-in Functions',
        relatedConcepts: ['max', 'built-in functions', 'iterables']
      },
      {
        question: 'What is the result of: print("hello".upper())?',
        options: ['HELLO', 'Hello', 'hello', 'Error'],
        correctAnswer: 'HELLO',
        explanation: 'The upper() method converts all characters in a string to uppercase.',
        topic: 'String Methods',
        relatedConcepts: ['upper', 'string methods', 'case conversion']
      }
    ]
  }
];

export async function seedQuizQuestionsSubjects1to5() {
  console.log('Seeding quiz questions for subjects 1-5...');
  
  for (const subjectData of quizQuestionsSubjects1to5) {
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
  
  console.log('Quiz questions for subjects 1-5 seeded successfully!');
} 