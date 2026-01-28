/**
 * FUNCTIONAL PROGRAMMING: 05 - Currying
 *
 * ONE CONCEPT: Transform a function with multiple arguments into a sequence
 *              of functions, each taking a single argument
 */


// =============================================================================
// WHAT IS CURRYING?
// =============================================================================

console.log('=== Currying ===\n');

/**
 *   ┌──────────────────────────────────────────────────────────────────────┐
 *   │  CURRYING TRANSFORMATION                                            │
 *   ├──────────────────────────────────────────────────────────────────────┤
 *   │                                                                      │
 *   │  BEFORE (Regular function):                                          │
 *   │  ┌──────────────────────────────┐                                    │
 *   │  │  add(a, b, c)  →  a + b + c  │                                    │
 *   │  └──────────────────────────────┘                                    │
 *   │        ↓ all arguments at once                                       │
 *   │                                                                      │
 *   │  add(1, 2, 3)  →  6                                                  │
 *   │                                                                      │
 *   │                                                                      │
 *   │  AFTER (Curried function):                                           │
 *   │  ┌──────────────────────────────────────────────────────────────┐    │
 *   │  │  curriedAdd(a) → (b) → (c) → a + b + c                       │    │
 *   │  └──────────────────────────────────────────────────────────────┘    │
 *   │                                                                      │
 *   │  curriedAdd(1)       →  fn waiting for b                             │
 *   │  curriedAdd(1)(2)    →  fn waiting for c                             │
 *   │  curriedAdd(1)(2)(3) →  6                                            │
 *   │                                                                      │
 *   └──────────────────────────────────────────────────────────────────────┘
 *
 */


// =============================================================================
// BASIC CURRYING
// =============================================================================

console.log('=== Basic Currying ===\n');

// Regular function
function addRegular(a, b, c) {
  return a + b + c;
}

// Manually curried
function addCurried(a) {
  return function(b) {
    return function(c) {
      return a + b + c;
    };
  };
}

// Arrow syntax (cleaner)
const addCurriedArrow = a => b => c => a + b + c;

console.log('Regular: add(1, 2, 3) =', addRegular(1, 2, 3));
console.log('Curried: add(1)(2)(3) =', addCurried(1)(2)(3));
console.log('Arrow:   add(1)(2)(3) =', addCurriedArrow(1)(2)(3));

// Partial application via currying
const add1 = addCurriedArrow(1);       // a = 1
const add1and2 = add1(2);              // b = 2
const result = add1and2(3);            // c = 3

console.log('\nPartial application:');
console.log('add1 = addCurried(1)');
console.log('add1(2)(3) =', add1(2)(3));


// =============================================================================
// AUTOMATIC CURRY FUNCTION
// =============================================================================

console.log('\n=== Curry Helper Function ===\n');

/**
 *   ┌─────────────────────────────────────────────────────────────────────┐
 *   │  HOW CURRY WORKS                                                   │
 *   ├─────────────────────────────────────────────────────────────────────┤
 *   │                                                                     │
 *   │  curry(fn) returns a new function that:                             │
 *   │                                                                     │
 *   │  1. Collects arguments                                              │
 *   │  2. If enough args → calls original fn                              │
 *   │  3. If not enough → returns function waiting for more               │
 *   │                                                                     │
 *   │  fn.length gives the number of expected arguments                   │
 *   │                                                                     │
 *   └─────────────────────────────────────────────────────────────────────┘
 *
 */

function curry(fn) {
  return function curried(...args) {
    // If we have enough arguments, call the function
    if (args.length >= fn.length) {
      return fn(...args);
    }

    // Otherwise, return a function that collects more arguments
    return function(...moreArgs) {
      return curried(...args, ...moreArgs);
    };
  };
}

// Usage
function multiply(a, b, c) {
  return a * b * c;
}

const curriedMultiply = curry(multiply);

// All these work:
console.log('curry(multiply)(2)(3)(4):', curriedMultiply(2)(3)(4));
console.log('curry(multiply)(2, 3)(4):', curriedMultiply(2, 3)(4));
console.log('curry(multiply)(2)(3, 4):', curriedMultiply(2)(3, 4));
console.log('curry(multiply)(2, 3, 4):', curriedMultiply(2, 3, 4));


// =============================================================================
// WHY CURRYING? (Real Benefits)
// =============================================================================

console.log('\n=== Why Currying? ===\n');

/**
 *   ┌─────────────────────────────────────────────────────────────────────┐
 *   │  BENEFITS OF CURRYING                                              │
 *   ├─────────────────────────────────────────────────────────────────────┤
 *   │                                                                     │
 *   │  1. REUSABILITY                                                     │
 *   │     Create specialized functions from general ones                  │
 *   │                                                                     │
 *   │  2. COMPOSITION                                                     │
 *   │     Single-argument functions compose better                        │
 *   │                                                                     │
 *   │  3. POINT-FREE STYLE                                                │
 *   │     Write code without mentioning data                              │
 *   │                                                                     │
 *   │  4. DELAYED EXECUTION                                               │
 *   │     Configure now, execute later                                    │
 *   │                                                                     │
 *   └─────────────────────────────────────────────────────────────────────┘
 *
 */

// ─────────────────────────────────────────────────────────────────────────────
// EXAMPLE 1: Reusable Validators
// ─────────────────────────────────────────────────────────────────────────────

const hasMinLength = curry((min, str) => str.length >= min);
const hasMaxLength = curry((max, str) => str.length <= max);

// Create specialized validators
const atLeast3 = hasMinLength(3);
const atMost10 = hasMaxLength(10);

console.log('Validators:');
console.log('atLeast3("hi"):', atLeast3('hi'));
console.log('atLeast3("hello"):', atLeast3('hello'));
console.log('atMost10("hello"):', atMost10('hello'));


// ─────────────────────────────────────────────────────────────────────────────
// EXAMPLE 2: API Helpers
// ─────────────────────────────────────────────────────────────────────────────

console.log('\nAPI helpers:');

const request = curry((method, url, data) => {
  console.log(`  ${method} ${url}`, data || '');
  // return fetch(url, { method, body: JSON.stringify(data) });
});

const get = request('GET');
const post = request('POST');
const del = request('DELETE');

get('/api/users', null);
post('/api/users', { name: 'Alice' });
del('/api/users/1', null);


// ─────────────────────────────────────────────────────────────────────────────
// EXAMPLE 3: Event Handling
// ─────────────────────────────────────────────────────────────────────────────

console.log('\nEvent handling:');

const handleEvent = curry((eventType, handler, element) => {
  console.log(`  Adding ${eventType} listener to ${element}`);
  // element.addEventListener(eventType, handler);
});

// Create specialized handlers
const onClick = handleEvent('click');
const onSubmit = handleEvent('submit');

// Even more specialized
const logClick = onClick(() => console.log('clicked'));

logClick('button#submit');
logClick('a.link');


// =============================================================================
// CURRYING WITH MAP/FILTER
// =============================================================================

console.log('\n=== Currying with Array Methods ===\n');

const map = curry((fn, arr) => arr.map(fn));
const filter = curry((fn, arr) => arr.filter(fn));
const reduce = curry((fn, initial, arr) => arr.reduce(fn, initial));

// Create reusable transformations
const doubles = map(x => x * 2);
const evens = filter(x => x % 2 === 0);
const sum = reduce((a, b) => a + b, 0);

const numbers = [1, 2, 3, 4, 5];

console.log('doubles([1,2,3,4,5]):', doubles(numbers));
console.log('evens([1,2,3,4,5]):', evens(numbers));
console.log('sum([1,2,3,4,5]):', sum(numbers));

// Chain them (point-free style coming next!)
const doubleEvens = arr => doubles(evens(arr));
console.log('doubleEvens:', doubleEvens(numbers));


// =============================================================================
// PRACTICAL EXAMPLE: CONFIGURATION
// =============================================================================

console.log('\n=== Practical: Logger Configuration ===\n');

const createLogger = curry((level, prefix, message) => {
  const timestamp = new Date().toISOString();
  console.log(`[${timestamp}] [${level}] [${prefix}] ${message}`);
});

// Create specialized loggers
const error = createLogger('ERROR');
const warn = createLogger('WARN');
const info = createLogger('INFO');

// Even more specialized
const dbError = error('Database');
const apiError = error('API');
const authInfo = info('Auth');

dbError('Connection failed');
apiError('Rate limit exceeded');
authInfo('User logged in');


// =============================================================================
// CURRY vs PARTIAL APPLICATION
// =============================================================================

console.log('\n=== Curry vs Partial Application ===\n');

/**
 *   ┌─────────────────────────────────────────────────────────────────────┐
 *   │  CURRYING                      PARTIAL APPLICATION                 │
 *   ├─────────────────────────────────────────────────────────────────────┤
 *   │                                                                     │
 *   │  One argument at a time        Fix some arguments                   │
 *   │  f(a)(b)(c)                    f(a, b) with c later                 │
 *   │                                                                     │
 *   │  Returns unary functions       Returns function with fewer args     │
 *   │                                                                     │
 *   │  Left to right only            Can fix any position                 │
 *   │                                                                     │
 *   └─────────────────────────────────────────────────────────────────────┘
 *
 */

// Partial application (more flexible - see next file)
function partial(fn, ...fixedArgs) {
  return function(...remainingArgs) {
    return fn(...fixedArgs, ...remainingArgs);
  };
}

const greet = (greeting, name, punctuation) =>
  `${greeting}, ${name}${punctuation}`;

// Currying: must be left-to-right
const curriedGreet = curry(greet);
const sayHello = curriedGreet('Hello');

// Partial: can fix any arguments
const exclaim = partial(greet, 'Hello');  // Fix first arg
console.log('Curried:', sayHello('World')('!'));
console.log('Partial:', exclaim('World', '!'));


// =============================================================================
// INTERVIEW: What to Say
// =============================================================================

/**
 * "Currying transforms a function that takes multiple arguments into a
 * sequence of functions that each take a single argument.
 *
 * Instead of calling add(1, 2, 3), you call curriedAdd(1)(2)(3). Each call
 * returns a new function until all arguments are provided.
 *
 * The main benefit is creating specialized functions from general ones.
 * For example, I might curry an API request function to create get, post,
 * and delete helpers. Or curry a logger to create error, warn, and info
 * loggers with different levels pre-configured.
 *
 * Currying also enables point-free programming where you can compose
 * functions without explicitly mentioning data. Libraries like Ramda use
 * currying extensively for this.
 *
 * The key difference from partial application is that currying always
 * takes one argument at a time in order, while partial application can
 * fix any arguments in any position."
 */


// RUN: node docs/28-functional-programming/05-currying.js
