/**
 * FUNCTIONAL PROGRAMMING: 00 - Overview
 *
 * ONE CONCEPT: What is Functional Programming and why it matters
 */


// =============================================================================
// WHAT IS FUNCTIONAL PROGRAMMING?
// =============================================================================

/**
 *
 *   ┌──────────────────────────────────────────────────────────────────────┐
 *   │  IMPERATIVE vs FUNCTIONAL                                           │
 *   ├──────────────────────────────────────────────────────────────────────┤
 *   │                                                                      │
 *   │  IMPERATIVE (How to do it):                                         │
 *   │  ─────────────────────────                                          │
 *   │  let total = 0;                                                     │
 *   │  for (let i = 0; i < nums.length; i++) {                            │
 *   │    if (nums[i] > 10) {                                              │
 *   │      total += nums[i];                                              │
 *   │    }                                                                │
 *   │  }                                                                  │
 *   │                                                                      │
 *   │  FUNCTIONAL (What to do):                                           │
 *   │  ────────────────────────                                           │
 *   │  const total = nums                                                 │
 *   │    .filter(n => n > 10)                                             │
 *   │    .reduce((sum, n) => sum + n, 0);                                 │
 *   │                                                                      │
 *   └──────────────────────────────────────────────────────────────────────┘
 *
 */


// =============================================================================
// CORE PRINCIPLES
// =============================================================================

console.log('=== Functional Programming Principles ===\n');

/**
 *   ┌─────────────────────────────────────────────────────────────────────┐
 *   │  THE 5 PILLARS OF FP                                               │
 *   ├─────────────────────────────────────────────────────────────────────┤
 *   │                                                                     │
 *   │  1. PURE FUNCTIONS                                                  │
 *   │     • Same input → Same output                                      │
 *   │     • No side effects                                               │
 *   │                                                                     │
 *   │  2. IMMUTABILITY                                                    │
 *   │     • Never modify data                                             │
 *   │     • Create new copies instead                                     │
 *   │                                                                     │
 *   │  3. FIRST-CLASS FUNCTIONS                                           │
 *   │     • Functions are values                                          │
 *   │     • Pass functions as arguments                                   │
 *   │                                                                     │
 *   │  4. HIGHER-ORDER FUNCTIONS                                          │
 *   │     • Functions that take/return functions                          │
 *   │     • map, filter, reduce                                           │
 *   │                                                                     │
 *   │  5. COMPOSITION                                                     │
 *   │     • Build complex from simple                                     │
 *   │     • compose, pipe                                                 │
 *   │                                                                     │
 *   └─────────────────────────────────────────────────────────────────────┘
 *
 */


// =============================================================================
// WHY FUNCTIONAL PROGRAMMING?
// =============================================================================

console.log('=== Why FP? ===\n');

/**
 *   ┌─────────────────────────────────────────────────────────────────────┐
 *   │  BENEFITS                                                          │
 *   ├─────────────────────────────────────────────────────────────────────┤
 *   │                                                                     │
 *   │  ✓ PREDICTABLE                                                      │
 *   │    Pure functions always return same result                         │
 *   │    No hidden state changes                                          │
 *   │                                                                     │
 *   │  ✓ TESTABLE                                                         │
 *   │    No mocks needed for side effects                                 │
 *   │    Just assert: input → output                                      │
 *   │                                                                     │
 *   │  ✓ DEBUGGABLE                                                       │
 *   │    No "where did this change?"                                      │
 *   │    State flows in one direction                                     │
 *   │                                                                     │
 *   │  ✓ PARALLELIZABLE                                                   │
 *   │    No shared mutable state                                          │
 *   │    Safe for concurrent execution                                    │
 *   │                                                                     │
 *   │  ✓ REUSABLE                                                         │
 *   │    Small, focused functions                                         │
 *   │    Easy to compose                                                  │
 *   │                                                                     │
 *   └─────────────────────────────────────────────────────────────────────┘
 *
 */


// =============================================================================
// QUICK EXAMPLES
// =============================================================================

console.log('=== Quick Examples ===\n');

// Pure Function
const add = (a, b) => a + b;
console.log('Pure: add(2, 3) =', add(2, 3));

// Immutability
const original = [1, 2, 3];
const doubled = original.map(x => x * 2);  // New array
console.log('Original:', original);
console.log('Doubled:', doubled);

// First-class function
const greet = name => `Hello, ${name}!`;
const shout = fn => str => fn(str).toUpperCase();
const shoutGreet = shout(greet);
console.log('First-class:', shoutGreet('world'));

// Composition
const compose = (...fns) => x => fns.reduceRight((v, f) => f(v), x);
const addOne = x => x + 1;
const double = x => x * 2;
const addOneThenDouble = compose(double, addOne);
console.log('Compose: addOneThenDouble(5) =', addOneThenDouble(5));


// =============================================================================
// FP IN JAVASCRIPT
// =============================================================================

console.log('\n=== FP in JavaScript ===\n');

/**
 *   ┌─────────────────────────────────────────────────────────────────────┐
 *   │  JAVASCRIPT IS MULTI-PARADIGM                                      │
 *   ├─────────────────────────────────────────────────────────────────────┤
 *   │                                                                     │
 *   │  JS supports FP but doesn't enforce it:                             │
 *   │                                                                     │
 *   │  Built-in FP:                                                       │
 *   │  • Array methods: map, filter, reduce, some, every                  │
 *   │  • First-class functions                                            │
 *   │  • Closures                                                         │
 *   │                                                                     │
 *   │  Not Built-in (need libraries or manual):                           │
 *   │  • Immutable data structures                                        │
 *   │  • Compose/pipe                                                     │
 *   │  • Currying                                                         │
 *   │  • Pattern matching                                                 │
 *   │                                                                     │
 *   │  Popular FP Libraries:                                              │
 *   │  • Lodash/fp                                                        │
 *   │  • Ramda                                                            │
 *   │  • Immutable.js                                                     │
 *   │                                                                     │
 *   └─────────────────────────────────────────────────────────────────────┘
 *
 */


// =============================================================================
// FILES IN THIS MODULE
// =============================================================================

console.log('=== Module Contents ===\n');

const files = [
  '00-fp-overview.js           - This file',
  '01-pure-functions.js        - No side effects',
  '02-immutability.js          - Never mutate data',
  '03-first-class-functions.js - Functions as values',
  '04-higher-order-functions.js - Functions that use functions',
  '05-currying.js              - One argument at a time',
  '06-partial-application.js   - Fix some arguments',
  '07-compose.js               - Right to left composition',
  '08-pipe.js                  - Left to right composition',
  '09-map-filter-reduce.js     - Core array methods',
  '10-recursion.js             - Functions calling themselves',
  '11-memoization.js           - Cache function results',
  '12-point-free.js            - Tacit programming',
  '13-functors-monads.js       - Containers for values',
  '14-real-world-patterns.js   - Practical applications',
  '15-interview-cheatsheet.js  - Quick reference'
];

files.forEach(f => console.log('  ' + f));


// =============================================================================
// INTERVIEW: What to Say
// =============================================================================

/**
 * "Functional programming is a paradigm where we build programs by composing
 * pure functions and avoiding shared state and mutable data. The core
 * principles are pure functions that always return the same output for the
 * same input, immutability so we never modify existing data, and treating
 * functions as first-class values that can be passed around.
 *
 * In JavaScript, I use FP concepts like map/filter/reduce for data
 * transformation, compose functions for building pipelines, and prefer
 * immutable updates especially in React state management. The main benefits
 * are predictability - pure functions are easy to test and debug because
 * there's no hidden state - and reusability - small focused functions can
 * be combined in many ways."
 */


// RUN: node docs/28-functional-programming/00-fp-overview.js
