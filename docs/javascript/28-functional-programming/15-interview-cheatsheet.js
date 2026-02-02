/**
 * FUNCTIONAL PROGRAMMING: 15 - Interview Cheatsheet
 *
 * Quick reference for all FP concepts
 */


// =============================================================================
// FP MASTER CHEATSHEET
// =============================================================================

/**
 *   ┌──────────────────────────────────────────────────────────────────────┐
 *   │  FUNCTIONAL PROGRAMMING CHEATSHEET                                  │
 *   ├──────────────────────────────────────────────────────────────────────┤
 *   │                                                                      │
 *   │  PURE FUNCTION                                                       │
 *   │  • Same input → Same output                                          │
 *   │  • No side effects (no mutation, no I/O)                             │
 *   │  • const add = (a, b) => a + b;                                      │
 *   │                                                                      │
 *   │  IMMUTABILITY                                                        │
 *   │  • Never modify, create new copies                                   │
 *   │  • Spread: { ...obj, key: val }  |  [...arr, item]                   │
 *   │  • Required for React state / Redux                                  │
 *   │  • Shallow copy gotcha: nested objects share references              │
 *   │                                                                      │
 *   │  FIRST-CLASS FUNCTIONS                                               │
 *   │  • Functions are values                                              │
 *   │  • Assign, pass, return functions                                    │
 *   │  • const fn = () => {};  arr.map(fn);                                │
 *   │                                                                      │
 *   │  HIGHER-ORDER FUNCTIONS                                              │
 *   │  • Take or return functions                                          │
 *   │  • map, filter, reduce, debounce, throttle, memoize                  │
 *   │                                                                      │
 *   │  CURRYING                                                            │
 *   │  • f(a, b, c) → f(a)(b)(c)                                           │
 *   │  • One argument at a time                                            │
 *   │  • Creates specialized functions                                     │
 *   │                                                                      │
 *   │  PARTIAL APPLICATION                                                 │
 *   │  • Fix some arguments: partial(fn, a) → fn(b, c)                     │
 *   │  • Built-in: fn.bind(null, a)                                        │
 *   │  • More flexible than currying (any position)                        │
 *   │                                                                      │
 *   │  COMPOSE                                                             │
 *   │  • Right to left: compose(f, g)(x) = f(g(x))                         │
 *   │  • reduceRight                                                       │
 *   │  • Used in Redux enhancers                                           │
 *   │                                                                      │
 *   │  PIPE                                                                │
 *   │  • Left to right: pipe(f, g)(x) = g(f(x))                            │
 *   │  • reduce                                                            │
 *   │  • More intuitive for data pipelines                                 │
 *   │                                                                      │
 *   │  MAP / FILTER / REDUCE                                               │
 *   │  • map: transform each → new array (same length)                     │
 *   │  • filter: keep matching → new array (shorter)                       │
 *   │  • reduce: accumulate → single value                                 │
 *   │  • reduce can implement map & filter                                 │
 *   │  • Always pass initial value to reduce!                              │
 *   │                                                                      │
 *   │  RECURSION                                                           │
 *   │  • Base case + recursive case                                        │
 *   │  • Great for trees, nested data                                      │
 *   │  • Tail recursion avoids stack overflow (Safari only)                │
 *   │  • Trampoline for other engines                                      │
 *   │                                                                      │
 *   │  MEMOIZATION                                                         │
 *   │  • Cache function results                                            │
 *   │  • Pure functions only                                               │
 *   │  • Fibonacci: O(2^n) → O(n)                                          │
 *   │  • React: useMemo, useCallback, React.memo                          │
 *   │                                                                      │
 *   │  POINT-FREE                                                          │
 *   │  • No explicit arguments: arr.map(double)                            │
 *   │  • Works with curried functions + pipe                               │
 *   │  • Gotcha: parseInt radix issue                                      │
 *   │                                                                      │
 *   │  FUNCTORS / MONADS                                                   │
 *   │  • Functor: .map() container                                         │
 *   │  • Monad: .chain() (flatMap) to avoid nesting                        │
 *   │  • Maybe: null safety                                                │
 *   │  • Either: error handling (Right=success, Left=error)                │
 *   │  • Promise ≈ monad (.then auto-flattens)                             │
 *   │                                                                      │
 *   └──────────────────────────────────────────────────────────────────────┘
 *
 */


// =============================================================================
// QUICK CODE REFERENCE
// =============================================================================

console.log('=== Quick Code Reference ===\n');

// --- Core Utilities ---

const compose = (...fns) => x => fns.reduceRight((v, f) => f(v), x);
const pipe = (...fns) => x => fns.reduce((v, f) => f(v), x);

function curry(fn) {
  return function curried(...args) {
    if (args.length >= fn.length) return fn(...args);
    return (...more) => curried(...args, ...more);
  };
}

function memoize(fn) {
  const cache = new Map();
  return function(...args) {
    const key = JSON.stringify(args);
    if (cache.has(key)) return cache.get(key);
    const result = fn(...args);
    cache.set(key, result);
    return result;
  };
}

function debounce(fn, delay) {
  let timer;
  return function(...args) {
    clearTimeout(timer);
    timer = setTimeout(() => fn(...args), delay);
  };
}

function throttle(fn, limit) {
  let lastRun = 0;
  return function(...args) {
    if (Date.now() - lastRun >= limit) {
      lastRun = Date.now();
      fn(...args);
    }
  };
}

function once(fn) {
  let called = false, result;
  return function(...args) {
    if (!called) { called = true; result = fn(...args); }
    return result;
  };
}

console.log('compose, pipe, curry, memoize, debounce, throttle, once');


// =============================================================================
// TOP INTERVIEW QUESTIONS & ANSWERS
// =============================================================================

console.log('\n=== Top Interview Q&A ===\n');

const qa = [
  {
    q: 'What is a pure function?',
    a: 'Same input → same output, no side effects. Testable, predictable.'
  },
  {
    q: 'What is immutability and why does React need it?',
    a: 'Never mutate data. React uses reference equality (oldState !== newState) for change detection. Mutation = same reference = no re-render.'
  },
  {
    q: 'Difference between map, filter, reduce?',
    a: 'map: transform each element. filter: keep matching elements. reduce: accumulate into single value. reduce is the most powerful - can implement the other two.'
  },
  {
    q: 'What is currying?',
    a: 'Transform f(a,b,c) into f(a)(b)(c). Each call returns a new function until all args provided. Creates specialized functions from general ones.'
  },
  {
    q: 'Compose vs pipe?',
    a: 'Both combine functions. compose = right-to-left (math style). pipe = left-to-right (intuitive). pipe is more readable for data pipelines.'
  },
  {
    q: 'What is memoization?',
    a: 'Cache function results by arguments. Only works for pure functions. Fibonacci: O(2^n) → O(n). React: useMemo, useCallback.'
  },
  {
    q: 'Implement debounce.',
    a: 'Wait N ms after last call before executing. Clear timer on each call, set new timer. Used for search inputs.'
  },
  {
    q: 'What is a higher-order function?',
    a: 'Function that takes or returns a function. Examples: map, filter, reduce, debounce, throttle, memoize, React HOCs.'
  },
  {
    q: 'How do you handle immutability with nested objects?',
    a: 'Spread at each level: {...state, user: {...state.user, name: "new"}}. Or use Immer for complex state. Shallow spread only copies top level.'
  },
  {
    q: 'What are side effects?',
    a: 'Anything outside the function: DOM changes, network calls, console.log, modifying external variables, reading Date.now(). Push to edges, keep core pure.'
  }
];

qa.forEach(({ q, a }, i) => {
  console.log(`${i + 1}. Q: ${q}`);
  console.log(`   A: ${a}\n`);
});


// =============================================================================
// COMMON GOTCHAS
// =============================================================================

console.log('=== Common Gotchas ===\n');

/**
 *   ┌─────────────────────────────────────────────────────────────────────┐
 *   │  GOTCHAS                                                           │
 *   ├─────────────────────────────────────────────────────────────────────┤
 *   │                                                                     │
 *   │  1. Spread is SHALLOW copy                                          │
 *   │     {...obj} doesn't deep clone nested objects                      │
 *   │                                                                     │
 *   │  2. reduce without initial value                                    │
 *   │     [].reduce(fn) → TypeError!                                      │
 *   │     Always: [].reduce(fn, 0) ← provide initial                     │
 *   │                                                                     │
 *   │  3. map(parseInt) gotcha                                            │
 *   │     ['1','2','3'].map(parseInt) → [1, NaN, NaN]                     │
 *   │     map passes (value, index) → parseInt(value, index)              │
 *   │     Use Number or unary wrapper                                     │
 *   │                                                                     │
 *   │  4. sort() mutates the array!                                       │
 *   │     Use [...arr].sort() for immutable sort                          │
 *   │                                                                     │
 *   │  5. Object.freeze is SHALLOW                                        │
 *   │     Nested objects can still be modified                             │
 *   │                                                                     │
 *   │  6. Arrow functions and this                                        │
 *   │     Arrow functions capture enclosing `this`                        │
 *   │     Can't use as methods or constructors                            │
 *   │                                                                     │
 *   └─────────────────────────────────────────────────────────────────────┘
 *
 */

// Demonstrate gotchas
console.log('Gotcha 1 - Shallow spread:');
const obj = { a: { b: 1 } };
const copy = { ...obj };
copy.a.b = 2;
console.log('  Original modified!', obj.a.b);  // 2!

console.log('\nGotcha 2 - reduce no initial:');
try { [].reduce((a, b) => a + b); } catch (e) { console.log('  Error:', e.message); }
console.log('  Safe:', [].reduce((a, b) => a + b, 0));

console.log('\nGotcha 3 - map(parseInt):');
console.log('  Wrong:', ['1', '2', '3'].map(parseInt));
console.log('  Right:', ['1', '2', '3'].map(Number));

console.log('\nGotcha 4 - sort mutates:');
const arr = [3, 1, 2];
const sorted = [...arr].sort();
console.log('  Original:', arr, '| Sorted:', sorted);


// =============================================================================
// FP vs OOP: WHEN TO USE WHAT
// =============================================================================

console.log('\n=== FP vs OOP ===\n');

/**
 *   ┌─────────────────────────────────────────────────────────────────────┐
 *   │  FP vs OOP                                                        │
 *   ├─────────────────────────────────────────────────────────────────────┤
 *   │                                                                     │
 *   │  USE FP FOR:                    USE OOP FOR:                        │
 *   │  • Data transformations         • Entity modeling (User, Order)     │
 *   │  • Pure computations            • Stateful objects (WebSocket)      │
 *   │  • Array/data pipelines         • Complex hierarchies              │
 *   │  • Redux reducers               • When encapsulation needed         │
 *   │  • Validation                   • Framework patterns (React class)  │
 *   │  • Middleware                                                       │
 *   │                                                                     │
 *   │  In practice: USE BOTH! JS is multi-paradigm                        │
 *   │  • React hooks = FP approach                                        │
 *   │  • React classes = OOP approach                                     │
 *   │  • Most modern JS leans FP                                          │
 *   │                                                                     │
 *   └─────────────────────────────────────────────────────────────────────┘
 *
 */

console.log('Modern JS: Use FP for data, OOP for entities');
console.log('React hooks pushed JS toward FP');
console.log('Redux is purely functional');


// RUN: node docs/28-functional-programming/15-interview-cheatsheet.js
