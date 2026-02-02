/**
 * GENERATORS & ITERATORS: 02 - Generator Basics
 *
 * ╔════════════════════════════════════════════════════════════════════════════╗
 * ║ THE GOLDEN RULE                                                            ║
 * ╠════════════════════════════════════════════════════════════════════════════╣
 * ║                                                                            ║
 * ║ Generators are functions that can PAUSE and RESUME execution.              ║
 * ║ They use function* syntax and yield keyword to produce values lazily.      ║
 * ║                                                                            ║
 * ║   function* gen() {                                                        ║
 * ║     yield 1;    // Pause here, return 1                                    ║
 * ║     yield 2;    // Resume, pause, return 2                                 ║
 * ║     return 3;   // Done, return 3                                          ║
 * ║   }                                                                        ║
 * ║                                                                            ║
 * ╚════════════════════════════════════════════════════════════════════════════╝
 *
 *
 * ┌─────────────────────────────────────────────────────────────────────────────┐
 * │ WHY GENERATORS - Real World Justification                                   │
 * ├─────────────────────────────────────────────────────────────────────────────┤
 * │                                                                             │
 * │ 1. LAZY SEQUENCES                                                           │
 * │    → Generate values on demand (memory efficient)                           │
 * │    → Infinite sequences possible                                            │
 * │    → Process large datasets chunk by chunk                                  │
 * │                                                                             │
 * │ 2. SIMPLIFY ITERATORS                                                       │
 * │    → Automatically creates { next(), [Symbol.iterator]() }                  │
 * │    → Much cleaner than manual iterator objects                              │
 * │                                                                             │
 * │ 3. ASYNC FLOW CONTROL                                                       │
 * │    → async/await is built on generators!                                    │
 * │    → Redux-Saga uses generators for side effects                            │
 * │    → Cooperative multitasking patterns                                      │
 * │                                                                             │
 * │ 4. STATE MACHINES                                                           │
 * │    → Natural way to express step-by-step processes                          │
 * │    → Wizards, workflows, game AI                                            │
 * │                                                                             │
 * └─────────────────────────────────────────────────────────────────────────────┘
 */


// ═══════════════════════════════════════════════════════════════════════════════
// BASIC GENERATOR SYNTAX
// ═══════════════════════════════════════════════════════════════════════════════

function* simpleGenerator() {
  console.log('  Start');
  yield 1;
  console.log('  After first yield');
  yield 2;
  console.log('  After second yield');
  return 3;  // Final value (done: true)
}

// Calling generator returns an iterator (doesn't execute!)
const gen = simpleGenerator();

console.log('A: Created generator (nothing executed yet)');

// Each next() runs until next yield
console.log('B:', gen.next());  // Start... { value: 1, done: false }
console.log('C:', gen.next());  // After first... { value: 2, done: false }
console.log('D:', gen.next());  // After second... { value: 3, done: true }
console.log('E:', gen.next());  // { value: undefined, done: true }

/**
 * OUTPUT:
 *   A: Created generator (nothing executed yet)
 *     Start
 *   B: { value: 1, done: false }
 *     After first yield
 *   C: { value: 2, done: false }
 *     After second yield
 *   D: { value: 3, done: true }
 *   E: { value: undefined, done: true }
 */


// ═══════════════════════════════════════════════════════════════════════════════
// VISUAL: HOW GENERATORS PAUSE AND RESUME
// ═══════════════════════════════════════════════════════════════════════════════

/**
 * ┌─────────────────────────────────────────────────────────────────────────────┐
 * │ GENERATOR EXECUTION FLOW                                                    │
 * ├─────────────────────────────────────────────────────────────────────────────┤
 * │                                                                             │
 * │   const gen = myGenerator();   // Generator object created (not running)    │
 * │                                                                             │
 * │   gen.next()                   // Start execution...                        │
 * │      │                                                                      │
 * │      ▼                                                                      │
 * │   ┌────────────────────────────────────┐                                    │
 * │   │ function* myGenerator() {          │                                    │
 * │   │   console.log('A');                │ ← Runs                             │
 * │   │   yield 1;  ──────────────────────►│ PAUSE! Returns { value: 1 }        │
 * │   │   console.log('B');                │                                    │
 * │   │   yield 2;                         │                                    │
 * │   │   return 3;                        │                                    │
 * │   │ }                                  │                                    │
 * │   └────────────────────────────────────┘                                    │
 * │                                                                             │
 * │   gen.next()                   // Resume...                                 │
 * │      │                                                                      │
 * │      ▼                                                                      │
 * │   ┌────────────────────────────────────┐                                    │
 * │   │ function* myGenerator() {          │                                    │
 * │   │   console.log('A');                │                                    │
 * │   │   yield 1;                         │ ← Resume here                      │
 * │   │   console.log('B');                │ ← Runs                             │
 * │   │   yield 2;  ──────────────────────►│ PAUSE! Returns { value: 2 }        │
 * │   │   return 3;                        │                                    │
 * │   │ }                                  │                                    │
 * │   └────────────────────────────────────┘                                    │
 * │                                                                             │
 * └─────────────────────────────────────────────────────────────────────────────┘
 */


// ═══════════════════════════════════════════════════════════════════════════════
// GENERATORS ARE ITERABLE
// ═══════════════════════════════════════════════════════════════════════════════

function* threeNumbers() {
  yield 1;
  yield 2;
  yield 3;
}

// Use with for...of (ignores return value!)
console.log('F: Using for...of:');
for (const num of threeNumbers()) {
  console.log(`  ${num}`);
}

// Use with spread
console.log('G:', [...threeNumbers()]);  // [1, 2, 3]

// Use with Array.from
console.log('H:', Array.from(threeNumbers()));  // [1, 2, 3]

// Use with destructuring
const [a, b, c] = threeNumbers();
console.log('I:', a, b, c);  // 1 2 3

/**
 * OUTPUT:
 *   F: Using for...of:
 *     1
 *     2
 *     3
 *   G: [ 1, 2, 3 ]
 *   H: [ 1, 2, 3 ]
 *   I: 1 2 3
 */


// ═══════════════════════════════════════════════════════════════════════════════
// GENERATORS WITH PARAMETERS
// ═══════════════════════════════════════════════════════════════════════════════

function* range(start, end, step = 1) {
  for (let i = start; i <= end; i += step) {
    yield i;
  }
}

console.log('J:', [...range(1, 5)]);       // [1, 2, 3, 4, 5]
console.log('K:', [...range(0, 10, 2)]);   // [0, 2, 4, 6, 8, 10]
console.log('L:', [...range(5, 1, -1)]);   // [] (empty - condition fails)

/**
 * OUTPUT:
 *   J: [ 1, 2, 3, 4, 5 ]
 *   K: [ 0, 2, 4, 6, 8, 10 ]
 *   L: []
 */


// ═══════════════════════════════════════════════════════════════════════════════
// INFINITE GENERATORS
// ═══════════════════════════════════════════════════════════════════════════════

function* infiniteCounter(start = 0) {
  let count = start;
  while (true) {
    yield count++;
  }
}

function* fibonacci() {
  let [a, b] = [0, 1];
  while (true) {
    yield a;
    [a, b] = [b, a + b];
  }
}

// Take first N values helper
function take(n, generator) {
  const result = [];
  const gen = generator();
  for (let i = 0; i < n; i++) {
    result.push(gen.next().value);
  }
  return result;
}

console.log('M:', take(5, infiniteCounter));   // [0, 1, 2, 3, 4]
console.log('N:', take(10, fibonacci));        // [0, 1, 1, 2, 3, 5, 8, 13, 21, 34]

// With parameter
const counter = infiniteCounter(100);
console.log('O:', counter.next().value);  // 100
console.log('P:', counter.next().value);  // 101
console.log('Q:', counter.next().value);  // 102

/**
 * OUTPUT:
 *   M: [ 0, 1, 2, 3, 4 ]
 *   N: [ 0, 1, 1, 2, 3, 5, 8, 13, 21, 34 ]
 *   O: 100
 *   P: 101
 *   Q: 102
 */


// ═══════════════════════════════════════════════════════════════════════════════
// PASSING VALUES INTO GENERATOR (Two-way Communication)
// ═══════════════════════════════════════════════════════════════════════════════

/**
 * ┌─────────────────────────────────────────────────────────────────────────────┐
 * │ YIELD AS TWO-WAY CHANNEL                                                    │
 * ├─────────────────────────────────────────────────────────────────────────────┤
 * │                                                                             │
 * │ yield VALUE;     // Sends VALUE out                                         │
 * │ x = yield VALUE; // Sends VALUE out, receives what's passed to next(x)      │
 * │                                                                             │
 * │   gen.next()     // Starts execution, reaches first yield                   │
 * │   gen.next(10)   // Resumes, and 10 becomes the value of that yield         │
 * │                                                                             │
 * └─────────────────────────────────────────────────────────────────────────────┘
 */

function* conversation() {
  console.log('  Generator: Starting...');

  const name = yield 'What is your name?';
  console.log(`  Generator: Received name: ${name}`);

  const age = yield `Hello ${name}! How old are you?`;
  console.log(`  Generator: Received age: ${age}`);

  return `Nice to meet you, ${name}! You are ${age} years old.`;
}

const chat = conversation();

console.log('R:', chat.next());        // First next() starts the generator
console.log('S:', chat.next('Alice')); // Pass name, get next question
console.log('T:', chat.next(30));      // Pass age, get final message

/**
 * OUTPUT:
 *   Generator: Starting...
 *   R: { value: 'What is your name?', done: false }
 *   Generator: Received name: Alice
 *   S: { value: 'Hello Alice! How old are you?', done: false }
 *   Generator: Received age: 30
 *   T: { value: 'Nice to meet you, Alice! You are 30 years old.', done: true }
 */


// ═══════════════════════════════════════════════════════════════════════════════
// PRACTICAL EXAMPLE: ID Generator
// ═══════════════════════════════════════════════════════════════════════════════

function* idGenerator(prefix = 'id') {
  let id = 1;
  while (true) {
    const reset = yield `${prefix}-${id++}`;
    if (reset) {
      id = 1;
    }
  }
}

const userIds = idGenerator('user');
console.log('U:', userIds.next().value);    // user-1
console.log('V:', userIds.next().value);    // user-2
console.log('W:', userIds.next().value);    // user-3
console.log('X:', userIds.next(true).value); // user-1 (reset!)
console.log('Y:', userIds.next().value);    // user-2

/**
 * OUTPUT:
 *   U: user-1
 *   V: user-2
 *   W: user-3
 *   X: user-1
 *   Y: user-2
 */


// ═══════════════════════════════════════════════════════════════════════════════
// yield vs return
// ═══════════════════════════════════════════════════════════════════════════════

/**
 * ┌─────────────────────────────────────────────────────────────────────────────┐
 * │ yield vs return IN GENERATORS                                               │
 * ├─────────────────────────────────────────────────────────────────────────────┤
 * │                                                                             │
 * │ yield:                                                                      │
 * │ - Pauses execution, returns { value, done: false }                          │
 * │ - Can be used multiple times                                                │
 * │ - Values included when iterating (for...of, spread)                         │
 * │                                                                             │
 * │ return:                                                                     │
 * │ - Ends generator, returns { value, done: true }                             │
 * │ - Value is NOT included when iterating!                                     │
 * │ - Only accessible via .next() return value                                  │
 * │                                                                             │
 * └─────────────────────────────────────────────────────────────────────────────┘
 */

function* yieldVsReturn() {
  yield 1;
  yield 2;
  return 3;  // This is lost in for...of!
}

console.log('Z: for...of (return value lost):');
for (const val of yieldVsReturn()) {
  console.log(`  ${val}`);
}

console.log('\nAA: Manual next() (return value preserved):');
const gen2 = yieldVsReturn();
console.log(`  ${JSON.stringify(gen2.next())}`);
console.log(`  ${JSON.stringify(gen2.next())}`);
console.log(`  ${JSON.stringify(gen2.next())}`);  // value: 3 is here!

/**
 * OUTPUT:
 *   Z: for...of (return value lost):
 *     1
 *     2
 *
 *   AA: Manual next() (return value preserved):
 *     {"value":1,"done":false}
 *     {"value":2,"done":false}
 *     {"value":3,"done":true}
 */


/**
 * ┌─────────────────────────────────────────────────────────────────────────────┐
 * │ INTERVIEW ANSWER                                                            │
 * ├─────────────────────────────────────────────────────────────────────────────┤
 * │                                                                             │
 * │ "Generators are special functions that can pause and resume execution.      │
 * │ They use function* syntax and yield to produce values lazily.               │
 * │                                                                             │
 * │ Key characteristics:                                                        │
 * │ 1. Calling generator returns an iterator (doesn't run the code)             │
 * │ 2. Each .next() runs until next yield, then pauses                          │
 * │ 3. yield sends value out, can also receive value from next(value)           │
 * │ 4. return ends the generator with done: true                                │
 * │                                                                             │
 * │ Generators are automatically iterable - work with:                          │
 * │ - for...of loops                                                            │
 * │ - Spread operator [...]                                                     │
 * │ - Array.from()                                                              │
 * │ - Destructuring                                                             │
 * │                                                                             │
 * │ Use cases:                                                                  │
 * │ - Lazy sequences (generate values on demand)                                │
 * │ - Infinite sequences (fibonacci, counters)                                  │
 * │ - Simplified iterator creation                                              │
 * │ - Async flow control (Redux-Saga)                                           │
 * │ - State machines                                                            │
 * │                                                                             │
 * │ Note: return value is NOT included in for...of iteration!"                  │
 * │                                                                             │
 * └─────────────────────────────────────────────────────────────────────────────┘
 *
 *
 * RUN: node docs/16-generators-iterators/02-generator-basics.js
 */
