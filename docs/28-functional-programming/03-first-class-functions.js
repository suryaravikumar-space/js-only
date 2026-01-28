/**
 * FUNCTIONAL PROGRAMMING: 03 - First-Class Functions
 *
 * ONE CONCEPT: Functions are values that can be assigned, passed, and returned
 */


// =============================================================================
// WHAT ARE FIRST-CLASS FUNCTIONS?
// =============================================================================

console.log('=== First-Class Functions ===\n');

/**
 *   ┌──────────────────────────────────────────────────────────────────────┐
 *   │  FIRST-CLASS CITIZEN                                                │
 *   ├──────────────────────────────────────────────────────────────────────┤
 *   │                                                                      │
 *   │  In JavaScript, functions are treated like any other value:          │
 *   │                                                                      │
 *   │  Numbers    →  const x = 42;                                         │
 *   │  Strings    →  const s = "hello";                                    │
 *   │  Objects    →  const o = { a: 1 };                                   │
 *   │  Functions  →  const f = () => {};      ← Same treatment!            │
 *   │                                                                      │
 *   │                                                                      │
 *   │  WHAT YOU CAN DO:                                                    │
 *   │  ─────────────────                                                   │
 *   │  1. Assign to variables                                              │
 *   │  2. Store in data structures                                         │
 *   │  3. Pass as arguments                                                │
 *   │  4. Return from functions                                            │
 *   │                                                                      │
 *   └──────────────────────────────────────────────────────────────────────┘
 *
 */


// =============================================================================
// 1. ASSIGN TO VARIABLES
// =============================================================================

console.log('=== Assign to Variables ===\n');

// Function declaration
function greetDeclaration(name) {
  return `Hello, ${name}!`;
}

// Function expression (assigned to variable)
const greetExpression = function(name) {
  return `Hello, ${name}!`;
};

// Arrow function (also assigned to variable)
const greetArrow = (name) => `Hello, ${name}!`;

// All three can be called the same way
console.log(greetDeclaration('Alice'));
console.log(greetExpression('Bob'));
console.log(greetArrow('Charlie'));

// Re-assign function to another variable
const sayHello = greetArrow;
console.log(sayHello('Dave'));


// =============================================================================
// 2. STORE IN DATA STRUCTURES
// =============================================================================

console.log('\n=== Store in Data Structures ===\n');

// Functions in array
const operations = [
  (x) => x + 1,
  (x) => x * 2,
  (x) => x ** 2
];

console.log('Functions in array:');
console.log('  operations[0](5):', operations[0](5));  // 6
console.log('  operations[1](5):', operations[1](5));  // 10
console.log('  operations[2](5):', operations[2](5));  // 25

// Functions in object (strategy pattern)
const validators = {
  required: (value) => value !== '' && value !== null,
  email: (value) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value),
  minLength: (min) => (value) => value.length >= min
};

console.log('\nValidators object:');
console.log('  required("hello"):', validators.required('hello'));
console.log('  email("a@b.com"):', validators.email('a@b.com'));
console.log('  minLength(3)("hi"):', validators.minLength(3)('hi'));


// =============================================================================
// 3. PASS AS ARGUMENTS (Callback Pattern)
// =============================================================================

console.log('\n=== Pass as Arguments ===\n');

/**
 *   ┌─────────────────────────────────────────────────────────────────────┐
 *   │  CALLBACK PATTERN                                                  │
 *   ├─────────────────────────────────────────────────────────────────────┤
 *   │                                                                     │
 *   │  ┌─────────────┐       ┌─────────────┐                              │
 *   │  │  Function A │ ───── │ Function B  │                              │
 *   │  │  (receiver) │ passes│ (callback)  │                              │
 *   │  └──────┬──────┘       └──────┬──────┘                              │
 *   │         │                     │                                     │
 *   │         │    A decides WHEN   │                                     │
 *   │         │    to call B        │                                     │
 *   │         └──────────┬──────────┘                                     │
 *   │                    │                                                │
 *   │                    ▼                                                │
 *   │              B executes                                             │
 *   │                                                                     │
 *   └─────────────────────────────────────────────────────────────────────┘
 *
 */

// Array methods accept functions
const numbers = [1, 2, 3, 4, 5];

const double = x => x * 2;
const isEven = x => x % 2 === 0;
const sum = (acc, x) => acc + x;

console.log('map(double):', numbers.map(double));
console.log('filter(isEven):', numbers.filter(isEven));
console.log('reduce(sum, 0):', numbers.reduce(sum, 0));

// Custom function that takes a function
function processArray(arr, processor) {
  const result = [];
  for (const item of arr) {
    result.push(processor(item));
  }
  return result;
}

console.log('processArray:', processArray([1, 2, 3], x => x * 10));


// =============================================================================
// 4. RETURN FROM FUNCTIONS
// =============================================================================

console.log('\n=== Return from Functions ===\n');

/**
 *   ┌─────────────────────────────────────────────────────────────────────┐
 *   │  FUNCTION FACTORY                                                  │
 *   ├─────────────────────────────────────────────────────────────────────┤
 *   │                                                                     │
 *   │  ┌──────────────┐                                                   │
 *   │  │   Factory    │                                                   │
 *   │  │   Function   │                                                   │
 *   │  └──────┬───────┘                                                   │
 *   │         │                                                           │
 *   │         │ returns                                                   │
 *   │         ▼                                                           │
 *   │  ┌──────────────┐                                                   │
 *   │  │  New Function │ ← configured/customized                          │
 *   │  └──────────────┘                                                   │
 *   │                                                                     │
 *   └─────────────────────────────────────────────────────────────────────┘
 *
 */

// Function that returns a function
function createMultiplier(factor) {
  return function(number) {
    return number * factor;
  };
}

const double2 = createMultiplier(2);
const triple = createMultiplier(3);

console.log('double2(5):', double2(5));
console.log('triple(5):', triple(5));

// With arrow functions (more concise)
const createAdder = (amount) => (x) => x + amount;

const add5 = createAdder(5);
const add10 = createAdder(10);

console.log('add5(100):', add5(100));
console.log('add10(100):', add10(100));


// =============================================================================
// REAL-WORLD: Event Handlers
// =============================================================================

console.log('\n=== Real-World: Event Handler Factory ===\n');

// Factory for creating event handlers with configuration
function createClickHandler(options) {
  const { logClicks, preventDefault, onComplete } = options;

  return function(event) {
    if (logClicks) {
      console.log('Click detected:', event.target);
    }

    if (preventDefault) {
      event.preventDefault?.();
    }

    // Do something...

    if (onComplete) {
      onComplete();
    }
  };
}

// Simulated usage
const handleSubmit = createClickHandler({
  logClicks: true,
  preventDefault: true,
  onComplete: () => console.log('Form submitted!')
});

// Simulate click event
handleSubmit({ target: 'button', preventDefault: () => {} });


// =============================================================================
// REAL-WORLD: Middleware Pattern
// =============================================================================

console.log('\n=== Real-World: Middleware Pattern ===\n');

// Middleware - functions that wrap other functions
function withLogging(fn) {
  return function(...args) {
    console.log(`Calling ${fn.name} with:`, args);
    const result = fn(...args);
    console.log(`Result:`, result);
    return result;
  };
}

function withTiming(fn) {
  return function(...args) {
    const start = performance.now();
    const result = fn(...args);
    const end = performance.now();
    console.log(`${fn.name} took ${(end - start).toFixed(2)}ms`);
    return result;
  };
}

// Original function
function calculateSum(a, b) {
  return a + b;
}

// Enhanced with middleware
const loggedSum = withLogging(calculateSum);
const timedSum = withTiming(calculateSum);

console.log('With logging:');
loggedSum(10, 20);

console.log('\nWith timing:');
timedSum(10, 20);


// =============================================================================
// REAL-WORLD: Configuration Pattern
// =============================================================================

console.log('\n=== Real-World: Configuration Pattern ===\n');

// API client factory
function createApiClient(baseUrl, defaultHeaders = {}) {
  return {
    get: async (endpoint) => {
      console.log(`GET ${baseUrl}${endpoint}`);
      console.log('Headers:', defaultHeaders);
      // return fetch(`${baseUrl}${endpoint}`, { headers: defaultHeaders });
    },

    post: async (endpoint, data) => {
      console.log(`POST ${baseUrl}${endpoint}`);
      console.log('Headers:', defaultHeaders);
      console.log('Data:', data);
      // return fetch(...);
    }
  };
}

// Create configured instances
const githubApi = createApiClient('https://api.github.com', {
  Authorization: 'token xxx'
});

const myApi = createApiClient('https://api.myapp.com', {
  'X-API-Key': 'abc123'
});

githubApi.get('/users/octocat');
myApi.post('/data', { name: 'test' });


// =============================================================================
// INTERVIEW: What to Say
// =============================================================================

/**
 * "In JavaScript, functions are first-class citizens, meaning they're
 * treated like any other value. You can assign them to variables, store
 * them in arrays or objects, pass them as arguments, and return them
 * from other functions.
 *
 * This enables powerful patterns. Callbacks are functions passed as
 * arguments - like the function you pass to map or filter. Array
 * methods like map, filter, and reduce all rely on first-class functions.
 *
 * I use function factories to create configured functions - for example,
 * a createApiClient function that returns functions pre-configured with
 * a base URL and auth headers. This is great for reducing boilerplate.
 *
 * The middleware pattern also depends on first-class functions - you
 * wrap a function with another function that adds logging, timing, or
 * error handling. This is how Express middleware works."
 */


// RUN: node docs/28-functional-programming/03-first-class-functions.js
