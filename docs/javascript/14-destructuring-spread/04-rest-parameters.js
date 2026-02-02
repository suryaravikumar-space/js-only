/**
 * CHALLENGE 04: Rest Parameters (...args)
 *
 * ╔════════════════════════════════════════════════════════════════════════════╗
 * ║ THE GOLDEN RULE                                                            ║
 * ╠════════════════════════════════════════════════════════════════════════════╣
 * ║                                                                            ║
 * ║ Rest parameters COLLECT multiple arguments into a single array.            ║
 * ║ They're the opposite of spread - spread EXPANDS, rest COLLECTS.           ║
 * ║                                                                            ║
 * ║   function sum(...numbers) {                                               ║
 * ║     // numbers is an ARRAY of all arguments                                ║
 * ║     return numbers.reduce((a, b) => a + b, 0);                            ║
 * ║   }                                                                        ║
 * ║   sum(1, 2, 3, 4);  // numbers = [1, 2, 3, 4]                             ║
 * ║                                                                            ║
 * ╚════════════════════════════════════════════════════════════════════════════╝
 */


// ═══════════════════════════════════════════════════════════════════════════════
// 1. Basic Rest Parameters
// ═══════════════════════════════════════════════════════════════════════════════

console.log("═══ 1. Basic Rest Parameters ═══\n");

// Collect ALL arguments
function sum(...numbers) {
  console.log('A: Received array:', numbers);
  console.log('B: Is array?:', Array.isArray(numbers));
  return numbers.reduce((acc, n) => acc + n, 0);
}

console.log('C: sum(1, 2):', sum(1, 2));
console.log('D: sum(1, 2, 3, 4, 5):', sum(1, 2, 3, 4, 5));
console.log('E: sum() empty:', sum());

console.log('');

/**
 * ┌─────────────────────────────────────────────────────────────────────────────┐
 * │ REST PARAMETERS vs ARGUMENTS OBJECT                                         │
 * ├─────────────────────────────────────────────────────────────────────────────┤
 * │                                                                             │
 * │   OLD WAY (arguments):                                                      │
 * │   function fn() {                                                           │
 * │     console.log(arguments);        // Array-LIKE, not real array           │
 * │     console.log(arguments.length); // Works                                │
 * │     arguments.map(x => x);         // ERROR! Not an array                  │
 * │   }                                                                         │
 * │                                                                             │
 * │   NEW WAY (rest):                                                           │
 * │   function fn(...args) {                                                    │
 * │     console.log(args);             // REAL array!                          │
 * │     args.map(x => x);              // Works!                               │
 * │     args.filter(x => x);           // Works!                               │
 * │   }                                                                         │
 * │                                                                             │
 * │   REST PARAMETER ADVANTAGES:                                                │
 * │   ✓ Real array (has all array methods)                                      │
 * │   ✓ Works in arrow functions (arguments doesn't!)                           │
 * │   ✓ Can combine with named parameters                                       │
 * │   ✓ More explicit and readable                                              │
 * │                                                                             │
 * └─────────────────────────────────────────────────────────────────────────────┘
 */


// ═══════════════════════════════════════════════════════════════════════════════
// 2. Rest with Named Parameters
// ═══════════════════════════════════════════════════════════════════════════════

console.log("═══ 2. Rest with Named Parameters ═══\n");

// Named params first, rest collects remaining
function logMessage(level, message, ...details) {
  console.log(`[${level.toUpperCase()}] ${message}`);
  if (details.length > 0) {
    console.log('   Details:', details);
  }
}

logMessage('info', 'User logged in', 'IP: 192.168.1.1', 'Browser: Chrome');
logMessage('error', 'Failed to connect');
logMessage('warn', 'Low memory', 'RAM: 1GB', 'Disk: 5GB', 'CPU: 90%');

console.log('');

/**
 * ┌─────────────────────────────────────────────────────────────────────────────┐
 * │ REST MUST BE LAST!                                                          │
 * ├─────────────────────────────────────────────────────────────────────────────┤
 * │                                                                             │
 * │   function fn(a, b, ...rest) { }  // VALID - rest is last                  │
 * │   function fn(a, ...rest, b) { }  // SYNTAX ERROR!                         │
 * │   function fn(...a, ...b) { }     // SYNTAX ERROR! Only one rest           │
 * │                                                                             │
 * │   FLOW:                                                                     │
 * │   fn(1, 2, 3, 4, 5)                                                         │
 * │      │  │  └──┬──┘                                                         │
 * │      │  │     │                                                            │
 * │      ▼  ▼     ▼                                                            │
 * │      a  b   rest                                                           │
 * │      1  2   [3, 4, 5]                                                      │
 * │                                                                             │
 * │   Named parameters get their values first,                                  │
 * │   rest collects everything remaining.                                       │
 * │                                                                             │
 * └─────────────────────────────────────────────────────────────────────────────┘
 */


// ═══════════════════════════════════════════════════════════════════════════════
// 3. Rest in Arrow Functions
// ═══════════════════════════════════════════════════════════════════════════════

console.log("═══ 3. Rest in Arrow Functions ═══\n");

// Arrow functions DON'T have their own 'arguments' object
// So rest parameters are the ONLY way to collect variable args!

const multiply = (...nums) => nums.reduce((a, b) => a * b, 1);
console.log('F: multiply(2, 3, 4):', multiply(2, 3, 4));

const average = (...nums) => {
  if (nums.length === 0) return 0;
  return nums.reduce((a, b) => a + b) / nums.length;
};
console.log('G: average(10, 20, 30):', average(10, 20, 30));

// With destructuring
const first = (...args) => args[0];
const last = (...args) => args[args.length - 1];
console.log('H: first(1,2,3):', first(1, 2, 3));
console.log('I: last(1,2,3):', last(1, 2, 3));

console.log('');

/**
 * ┌─────────────────────────────────────────────────────────────────────────────┐
 * │ ARROW FUNCTIONS AND ARGUMENTS                                               │
 * ├─────────────────────────────────────────────────────────────────────────────┤
 * │                                                                             │
 * │   Regular function:                                                         │
 * │   function fn() {                                                           │
 * │     console.log(arguments);  // Works! (array-like object)                 │
 * │   }                                                                         │
 * │                                                                             │
 * │   Arrow function:                                                           │
 * │   const fn = () => {                                                        │
 * │     console.log(arguments);  // ReferenceError! Not defined               │
 * │   }                                                                         │
 * │                                                                             │
 * │   Arrow functions inherit 'arguments' from enclosing scope (if any)        │
 * │   Use REST PARAMETERS instead:                                              │
 * │                                                                             │
 * │   const fn = (...args) => {                                                │
 * │     console.log(args);       // Works! Real array                          │
 * │   }                                                                         │
 * │                                                                             │
 * └─────────────────────────────────────────────────────────────────────────────┘
 */


// ═══════════════════════════════════════════════════════════════════════════════
// 4. Common Use Cases
// ═══════════════════════════════════════════════════════════════════════════════

console.log("═══ 4. Common Use Cases ═══\n");

// 1. Wrapping functions
function wrapWithLogging(fn) {
  return function(...args) {
    console.log('J: Called with:', args);
    const result = fn(...args);  // Spread to call original
    console.log('K: Returned:', result);
    return result;
  };
}

const loggedSum = wrapWithLogging((a, b) => a + b);
loggedSum(5, 3);

// 2. Creating utility functions
const max = (...nums) => Math.max(...nums);
const min = (...nums) => Math.min(...nums);
console.log('L: max(1,5,3):', max(1, 5, 3));

// 3. Pipe/Compose functions
const pipe = (...fns) => (x) => fns.reduce((v, f) => f(v), x);

const addOne = x => x + 1;
const double = x => x * 2;
const square = x => x * x;

const transform = pipe(addOne, double, square);
console.log('M: pipe(5) -> +1 -> *2 -> ^2:', transform(5));  // (5+1)*2 = 12, 12^2 = 144

console.log('');

/**
 * ┌─────────────────────────────────────────────────────────────────────────────┐
 * │ WRAPPER FUNCTION PATTERN                                                    │
 * ├─────────────────────────────────────────────────────────────────────────────┤
 * │                                                                             │
 * │   function wrapper(fn) {                                                    │
 * │     return function(...args) {    // REST: collect arguments              │
 * │       // Do something before                                                │
 * │       const result = fn(...args); // SPREAD: forward arguments            │
 * │       // Do something after                                                 │
 * │       return result;                                                        │
 * │     };                                                                      │
 * │   }                                                                         │
 * │                                                                             │
 * │   This pattern uses both:                                                   │
 * │   • REST in wrapper to collect any number of arguments                     │
 * │   • SPREAD to forward those arguments to original function                 │
 * │                                                                             │
 * │   USE CASES:                                                                │
 * │   • Logging/debugging wrappers                                              │
 * │   • Memoization                                                             │
 * │   • Rate limiting                                                           │
 * │   • Error handling wrappers                                                 │
 * │                                                                             │
 * └─────────────────────────────────────────────────────────────────────────────┘
 */


// ═══════════════════════════════════════════════════════════════════════════════
// 5. Rest in Destructuring (Recap)
// ═══════════════════════════════════════════════════════════════════════════════

console.log("═══ 5. Rest in Destructuring ═══\n");

// Array destructuring with rest
const [first2, second2, ...remaining] = [1, 2, 3, 4, 5];
console.log('N: first, second:', first2, second2);
console.log('O: remaining:', remaining);

// Object destructuring with rest
const { a, b, ...rest } = { a: 1, b: 2, c: 3, d: 4 };
console.log('P: a, b:', a, b);
console.log('Q: rest:', rest);

// Combined with function parameters
function processData([id, ...values], { name, ...meta }) {
  console.log('R: id:', id);
  console.log('S: values:', values);
  console.log('T: name:', name);
  console.log('U: meta:', meta);
}

processData(
  [123, 'v1', 'v2', 'v3'],
  { name: 'test', type: 'data', version: '1.0' }
);

console.log('');


// ═══════════════════════════════════════════════════════════════════════════════
// 6. Practical Examples
// ═══════════════════════════════════════════════════════════════════════════════

console.log("═══ 6. Practical Examples ═══\n");

// 1. Variable argument console.log wrapper
const debug = (...args) => {
  if (process.env.DEBUG) {
    console.log('[DEBUG]', ...args);
  }
};

// 2. Merge objects (like Object.assign)
const merge = (...objects) => Object.assign({}, ...objects);
console.log('V: merge:', merge({ a: 1 }, { b: 2 }, { c: 3 }));

// 3. Call array method with array elements
const sortNumbers = (...nums) => [...nums].sort((a, b) => a - b);
console.log('W: sorted:', sortNumbers(3, 1, 4, 1, 5, 9, 2, 6));

// 4. Event handler with extra data
function handleEvent(handler, ...extraData) {
  return function(event) {
    handler(event, ...extraData);
  };
}

const onClick = handleEvent(
  (e, userId, action) => console.log('X:', userId, action),
  123,
  'click'
);
onClick({ type: 'click' });

console.log('');


/**
 * ┌─────────────────────────────────────────────────────────────────────────────┐
 * │ INTERVIEW ANSWER                                                            │
 * ├─────────────────────────────────────────────────────────────────────────────┤
 * │                                                                             │
 * │ "Rest parameters (...args) collect multiple arguments into a real array.   │
 * │  Unlike the old 'arguments' object, rest parameters:                        │
 * │                                                                             │
 * │  1. Are real arrays with all array methods                                  │
 * │  2. Work in arrow functions (arguments doesn't)                             │
 * │  3. Can be combined with named parameters                                   │
 * │  4. Must be the last parameter                                              │
 * │                                                                             │
 * │  Common patterns:                                                           │
 * │                                                                             │
 * │  • Variable arguments: function sum(...nums) { }                            │
 * │  • Wrapper functions: function wrap(fn) {                                   │
 * │      return (...args) => fn(...args)  // rest + spread                     │
 * │    }                                                                        │
 * │  • With destructuring: const [first, ...rest] = arr                         │
 * │                                                                             │
 * │  Rest and spread look the same (...) but do opposite things:               │
 * │  - REST collects: function(...args) gets args as array                     │
 * │  - SPREAD expands: fn(...array) passes array as arguments"                 │
 * │                                                                             │
 * └─────────────────────────────────────────────────────────────────────────────┘
 *
 *
 * RUN: node docs/14-destructuring-spread/04-rest-parameters.js
 */
