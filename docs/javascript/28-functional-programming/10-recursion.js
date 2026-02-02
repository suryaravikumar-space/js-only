/**
 * FUNCTIONAL PROGRAMMING: 10 - Recursion
 *
 * ONE CONCEPT: Functions that call themselves to solve problems
 *              by breaking them into smaller sub-problems
 */


// =============================================================================
// WHAT IS RECURSION?
// =============================================================================

console.log('=== Recursion ===\n');

/**
 *   ┌──────────────────────────────────────────────────────────────────────┐
 *   │  RECURSION = Function calls itself                                  │
 *   ├──────────────────────────────────────────────────────────────────────┤
 *   │                                                                      │
 *   │  TWO REQUIREMENTS:                                                   │
 *   │  1. BASE CASE: When to stop (prevents infinite loop)                 │
 *   │  2. RECURSIVE CASE: Call self with smaller problem                   │
 *   │                                                                      │
 *   │                                                                      │
 *   │  factorial(4)                                                        │
 *   │    │                                                                 │
 *   │    ├─ 4 * factorial(3)                                               │
 *   │    │       │                                                         │
 *   │    │       ├─ 3 * factorial(2)                                       │
 *   │    │       │       │                                                 │
 *   │    │       │       ├─ 2 * factorial(1)                               │
 *   │    │       │       │       │                                         │
 *   │    │       │       │       └─ 1  ← BASE CASE                        │
 *   │    │       │       │                                                 │
 *   │    │       │       └─ 2 * 1 = 2                                     │
 *   │    │       │                                                         │
 *   │    │       └─ 3 * 2 = 6                                             │
 *   │    │                                                                 │
 *   │    └─ 4 * 6 = 24                                                    │
 *   │                                                                      │
 *   └──────────────────────────────────────────────────────────────────────┘
 *
 */


// =============================================================================
// BASIC EXAMPLES
// =============================================================================

console.log('=== Basic Examples ===\n');

// Factorial
function factorial(n) {
  if (n <= 1) return 1;          // Base case
  return n * factorial(n - 1);    // Recursive case
}

console.log('factorial(5):', factorial(5));  // 120

// Fibonacci
function fibonacci(n) {
  if (n <= 1) return n;                          // Base case
  return fibonacci(n - 1) + fibonacci(n - 2);     // Recursive case
}

console.log('fibonacci(7):', fibonacci(7));  // 13

// Sum of array
function sumArray(arr) {
  if (arr.length === 0) return 0;                     // Base case
  return arr[0] + sumArray(arr.slice(1));              // Recursive case
}

console.log('sumArray([1,2,3,4,5]):', sumArray([1, 2, 3, 4, 5]));


// =============================================================================
// RECURSION vs ITERATION
// =============================================================================

console.log('\n=== Recursion vs Iteration ===\n');

/**
 *   ┌─────────────────────────────────────────────────────────────────────┐
 *   │  COMPARISON                                                        │
 *   ├─────────────────────────────────────────────────────────────────────┤
 *   │                                                                     │
 *   │  RECURSION                      ITERATION                          │
 *   │  ──────────                     ──────────                          │
 *   │  • Elegant, declarative         • Explicit, imperative              │
 *   │  • Good for tree/graph          • Good for linear data              │
 *   │  • Uses call stack              • Uses loop variables               │
 *   │  • Risk of stack overflow       • No stack overflow risk            │
 *   │  • Can be slower (overhead)     • Generally faster                  │
 *   │                                                                     │
 *   └─────────────────────────────────────────────────────────────────────┘
 *
 */

// Iterative countdown
function countdownIterative(n) {
  const result = [];
  for (let i = n; i > 0; i--) {
    result.push(i);
  }
  return result;
}

// Recursive countdown
function countdownRecursive(n) {
  if (n <= 0) return [];
  return [n, ...countdownRecursive(n - 1)];
}

console.log('Iterative:', countdownIterative(5));
console.log('Recursive:', countdownRecursive(5));


// =============================================================================
// REAL-WORLD: DEEP CLONE
// =============================================================================

console.log('\n=== Real-World: Deep Clone ===\n');

function deepClone(obj) {
  // Base cases
  if (obj === null || typeof obj !== 'object') return obj;
  if (obj instanceof Date) return new Date(obj);
  if (Array.isArray(obj)) return obj.map(item => deepClone(item));

  // Recursive case: clone each property
  const cloned = {};
  for (const key of Object.keys(obj)) {
    cloned[key] = deepClone(obj[key]);
  }
  return cloned;
}

const original = {
  name: 'Alice',
  nested: { a: 1, b: { c: 2 } },
  arr: [1, [2, 3]]
};

const cloned = deepClone(original);
cloned.nested.b.c = 999;

console.log('Original:', JSON.stringify(original));
console.log('Cloned:', JSON.stringify(cloned));
console.log('Independent:', original.nested.b.c !== cloned.nested.b.c);


// =============================================================================
// REAL-WORLD: FLATTEN NESTED DATA
// =============================================================================

console.log('\n=== Real-World: Flatten Nested Data ===\n');

/**
 *   ┌─────────────────────────────────────────────────────────────────────┐
 *   │  FILE TREE EXAMPLE                                                 │
 *   ├─────────────────────────────────────────────────────────────────────┤
 *   │                                                                     │
 *   │  src/                                                               │
 *   │  ├── components/                                                    │
 *   │  │   ├── Header.js                                                  │
 *   │  │   └── Footer.js                                                  │
 *   │  └── utils/                                                         │
 *   │      └── helpers.js                                                 │
 *   │                                                                     │
 *   │  → ["Header.js", "Footer.js", "helpers.js"]                        │
 *   │                                                                     │
 *   └─────────────────────────────────────────────────────────────────────┘
 *
 */

const fileTree = {
  name: 'src',
  children: [
    {
      name: 'components',
      children: [
        { name: 'Header.js', children: [] },
        { name: 'Footer.js', children: [] }
      ]
    },
    {
      name: 'utils',
      children: [
        { name: 'helpers.js', children: [] }
      ]
    }
  ]
};

function getAllFiles(node) {
  if (node.children.length === 0) return [node.name];
  return node.children.flatMap(child => getAllFiles(child));
}

console.log('All files:', getAllFiles(fileTree));

// Flatten nested comments (Reddit-style)
const comments = [
  {
    text: 'Great post!',
    replies: [
      {
        text: 'Thanks!',
        replies: [{ text: 'No problem', replies: [] }]
      },
      { text: 'I agree', replies: [] }
    ]
  }
];

function flattenComments(comments, depth = 0) {
  return comments.flatMap(comment => [
    { text: comment.text, depth },
    ...flattenComments(comment.replies, depth + 1)
  ]);
}

console.log('\nFlat comments:', flattenComments(comments));


// =============================================================================
// REAL-WORLD: DOM TRAVERSAL
// =============================================================================

console.log('\n=== Real-World: Tree Search ===\n');

// Simulated DOM/menu tree
const menu = {
  id: 'root',
  label: 'Menu',
  children: [
    { id: 'file', label: 'File', children: [
      { id: 'new', label: 'New', children: [] },
      { id: 'open', label: 'Open', children: [] }
    ]},
    { id: 'edit', label: 'Edit', children: [
      { id: 'undo', label: 'Undo', children: [] },
      { id: 'redo', label: 'Redo', children: [] }
    ]}
  ]
};

function findById(node, id) {
  if (node.id === id) return node;

  for (const child of node.children) {
    const found = findById(child, id);
    if (found) return found;
  }

  return null;
}

console.log('Find "undo":', findById(menu, 'undo'));
console.log('Find "missing":', findById(menu, 'missing'));


// =============================================================================
// TAIL RECURSION (OPTIMIZATION)
// =============================================================================

console.log('\n=== Tail Recursion ===\n');

/**
 *   ┌─────────────────────────────────────────────────────────────────────┐
 *   │  TAIL CALL OPTIMIZATION                                            │
 *   ├─────────────────────────────────────────────────────────────────────┤
 *   │                                                                     │
 *   │  Regular recursion:                                                 │
 *   │  return n * factorial(n-1)  ← Must keep stack frame for multiply    │
 *   │                                                                     │
 *   │  Tail recursion:                                                    │
 *   │  return factorial(n-1, n*acc)  ← Nothing to do after call           │
 *   │                                     Can reuse stack frame!          │
 *   │                                                                     │
 *   │  Note: Only Safari supports TCO in JS (2025)                        │
 *   │                                                                     │
 *   └─────────────────────────────────────────────────────────────────────┘
 *
 */

// Regular (NOT tail recursive - stack overflow risk)
function factorialRegular(n) {
  if (n <= 1) return 1;
  return n * factorialRegular(n - 1);  // Still needs to multiply after call
}

// Tail recursive (optimizable)
function factorialTail(n, accumulator = 1) {
  if (n <= 1) return accumulator;
  return factorialTail(n - 1, n * accumulator);  // Nothing after call
}

console.log('Regular factorial(10):', factorialRegular(10));
console.log('Tail factorial(10):', factorialTail(10));

// Trampoline - manual TCO for any JS engine
function trampoline(fn) {
  return function(...args) {
    let result = fn(...args);
    while (typeof result === 'function') {
      result = result();
    }
    return result;
  };
}

function factorialTrampoline(n, acc = 1) {
  if (n <= 1) return acc;
  return () => factorialTrampoline(n - 1, n * acc);  // Return thunk
}

const safeFact = trampoline(factorialTrampoline);
console.log('Trampoline factorial(10):', safeFact(10));
console.log('Trampoline factorial(20):', safeFact(20));


// =============================================================================
// COMMON INTERVIEW PATTERNS
// =============================================================================

console.log('\n=== Interview Patterns ===\n');

// 1. Reverse a string
function reverseString(str) {
  if (str.length <= 1) return str;
  return reverseString(str.slice(1)) + str[0];
}
console.log('Reverse "hello":', reverseString('hello'));

// 2. Check palindrome
function isPalindrome(str) {
  if (str.length <= 1) return true;
  if (str[0] !== str[str.length - 1]) return false;
  return isPalindrome(str.slice(1, -1));
}
console.log('isPalindrome("racecar"):', isPalindrome('racecar'));
console.log('isPalindrome("hello"):', isPalindrome('hello'));

// 3. Power function
function power(base, exp) {
  if (exp === 0) return 1;
  return base * power(base, exp - 1);
}
console.log('power(2, 10):', power(2, 10));

// 4. Flatten deeply nested array
function deepFlatten(arr) {
  return arr.reduce((flat, item) =>
    flat.concat(Array.isArray(item) ? deepFlatten(item) : item), []);
}
console.log('deepFlatten:', deepFlatten([1, [2, [3, [4]], 5]]));


// =============================================================================
// INTERVIEW: What to Say
// =============================================================================

/**
 * "Recursion is when a function calls itself. Every recursive function
 * needs a base case to stop and a recursive case that makes the problem
 * smaller.
 *
 * Recursion shines with tree and graph structures - like traversing a
 * DOM tree, flattening nested comments, or deep cloning objects. These
 * are naturally recursive because each node can have children of the
 * same structure.
 *
 * The main risk is stack overflow for deeply nested structures.
 * JavaScript has a limited call stack. Solutions include tail recursion
 * (only Safari optimizes this), trampolining, or converting to iteration.
 *
 * For interviews, the classic problems are factorial, fibonacci, tree
 * traversal, and deep flatten. The key is always identifying the base
 * case first, then figuring out how to reduce the problem size.
 *
 * In production, I prefer iteration for simple loops and recursion for
 * tree-shaped data. For fibonacci specifically, I'd use memoization or
 * iteration since naive recursion is O(2^n)."
 */


// RUN: node docs/28-functional-programming/10-recursion.js
