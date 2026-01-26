/**
 * CHALLENGE 00: Array Destructuring Basics
 *
 * ╔════════════════════════════════════════════════════════════════════════════╗
 * ║ THE GOLDEN RULE                                                            ║
 * ╠════════════════════════════════════════════════════════════════════════════╣
 * ║                                                                            ║
 * ║ Array destructuring extracts values from arrays into distinct variables   ║
 * ║ based on POSITION (index), not name.                                       ║
 * ║                                                                            ║
 * ║   const [first, second, third] = [1, 2, 3];                               ║
 * ║   // first = 1, second = 2, third = 3                                     ║
 * ║                                                                            ║
 * ║   Position matters! Names are arbitrary.                                   ║
 * ║   const [a, b, c] = [1, 2, 3];  // Same result                            ║
 * ║                                                                            ║
 * ╚════════════════════════════════════════════════════════════════════════════╝
 */


// ═══════════════════════════════════════════════════════════════════════════════
// 1. Basic Array Destructuring
// ═══════════════════════════════════════════════════════════════════════════════

console.log("═══ 1. Basic Array Destructuring ═══\n");

const colors = ['red', 'green', 'blue'];

// Traditional way
const first = colors[0];
const second = colors[1];
const third = colors[2];
console.log('A: Traditional:', first, second, third);

// Destructuring way
const [color1, color2, color3] = colors;
console.log('B: Destructured:', color1, color2, color3);

console.log('');

/**
 * ┌─────────────────────────────────────────────────────────────────────────────┐
 * │ HOW ARRAY DESTRUCTURING WORKS                                               │
 * ├─────────────────────────────────────────────────────────────────────────────┤
 * │                                                                             │
 * │   const [a, b, c] = ['x', 'y', 'z'];                                       │
 * │                                                                             │
 * │   Array:     ['x', 'y', 'z']                                               │
 * │   Index:       0    1    2                                                 │
 * │               │    │    │                                                  │
 * │               ▼    ▼    ▼                                                  │
 * │   Variables:  a    b    c                                                  │
 * │   Values:    'x'  'y'  'z'                                                 │
 * │                                                                             │
 * │   It's syntactic sugar for:                                                 │
 * │   const a = array[0];                                                       │
 * │   const b = array[1];                                                       │
 * │   const c = array[2];                                                       │
 * │                                                                             │
 * └─────────────────────────────────────────────────────────────────────────────┘
 */


// ═══════════════════════════════════════════════════════════════════════════════
// 2. Skipping Elements
// ═══════════════════════════════════════════════════════════════════════════════

console.log("═══ 2. Skipping Elements ═══\n");

const numbers = [1, 2, 3, 4, 5];

// Skip elements with empty slots (commas)
const [, secondNum, , fourthNum] = numbers;
console.log('C: Skipped 1st and 3rd:', secondNum, fourthNum);

// Get first and last
const [firstNum, , , , lastNum] = numbers;
console.log('D: First and last:', firstNum, lastNum);

console.log('');

/**
 * ┌─────────────────────────────────────────────────────────────────────────────┐
 * │ SKIPPING PATTERN                                                            │
 * ├─────────────────────────────────────────────────────────────────────────────┤
 * │                                                                             │
 * │   const [, b, , d] = [1, 2, 3, 4];                                         │
 * │                                                                             │
 * │   Array:  [1,  2,  3,  4]                                                  │
 * │           │   │   │   │                                                    │
 * │           ▼   ▼   ▼   ▼                                                    │
 * │          skip  b  skip  d                                                  │
 * │                                                                             │
 * │   Result: b = 2, d = 4                                                     │
 * │                                                                             │
 * │   USE CASE: API returns [status, data, meta], you only need data          │
 * │   const [, data] = response;                                               │
 * │                                                                             │
 * └─────────────────────────────────────────────────────────────────────────────┘
 */


// ═══════════════════════════════════════════════════════════════════════════════
// 3. Default Values
// ═══════════════════════════════════════════════════════════════════════════════

console.log("═══ 3. Default Values ═══\n");

const partial = [1, 2];

// Without defaults
const [a1, b1, c1] = partial;
console.log('E: Without default:', a1, b1, c1);  // 1, 2, undefined

// With defaults
const [a2, b2, c2 = 'default'] = partial;
console.log('F: With default:', a2, b2, c2);  // 1, 2, 'default'

// Default only used when value is undefined (not null, 0, '')
const [x1 = 'default'] = [undefined];
const [x2 = 'default'] = [null];
const [x3 = 'default'] = [0];
const [x4 = 'default'] = [''];

console.log('G: undefined:', x1);  // 'default'
console.log('H: null:', x2);       // null
console.log('I: 0:', x3);          // 0
console.log('J: empty string:', x4); // ''

console.log('');

/**
 * ┌─────────────────────────────────────────────────────────────────────────────┐
 * │ DEFAULT VALUE RULE                                                          │
 * ├─────────────────────────────────────────────────────────────────────────────┤
 * │                                                                             │
 * │   Default is used ONLY when value is undefined                             │
 * │                                                                             │
 * │   [a = 'X'] = [undefined]  →  a = 'X'   (default used)                    │
 * │   [a = 'X'] = []           →  a = 'X'   (missing = undefined)             │
 * │   [a = 'X'] = [null]       →  a = null  (null is NOT undefined)           │
 * │   [a = 'X'] = [0]          →  a = 0     (0 is NOT undefined)              │
 * │   [a = 'X'] = ['']         →  a = ''    ('' is NOT undefined)             │
 * │                                                                             │
 * │   INTERVIEW TIP: This trips people up! Default is not for "falsy"         │
 * │   values, only for undefined.                                               │
 * │                                                                             │
 * └─────────────────────────────────────────────────────────────────────────────┘
 */


// ═══════════════════════════════════════════════════════════════════════════════
// 4. Rest Pattern (...)
// ═══════════════════════════════════════════════════════════════════════════════

console.log("═══ 4. Rest Pattern ═══\n");

const alphabet = ['a', 'b', 'c', 'd', 'e'];

// Get first, rest in array
const [firstLetter, ...restLetters] = alphabet;
console.log('K: First:', firstLetter);
console.log('L: Rest:', restLetters);

// Get first two, rest in array
const [one, two, ...remaining] = alphabet;
console.log('M: First two:', one, two);
console.log('N: Remaining:', remaining);

// Rest MUST be last
// const [...first, last] = alphabet;  // SyntaxError!

console.log('');

/**
 * ┌─────────────────────────────────────────────────────────────────────────────┐
 * │ REST PATTERN                                                                │
 * ├─────────────────────────────────────────────────────────────────────────────┤
 * │                                                                             │
 * │   const [a, b, ...rest] = [1, 2, 3, 4, 5];                                 │
 * │                                                                             │
 * │   Array: [1, 2, 3, 4, 5]                                                   │
 * │           │  │  └──┬──┘                                                    │
 * │           │  │     │                                                       │
 * │           ▼  ▼     ▼                                                       │
 * │           a  b   rest                                                      │
 * │           1  2   [3, 4, 5]                                                 │
 * │                                                                             │
 * │   RULES:                                                                    │
 * │   • Rest must be LAST element                                               │
 * │   • Rest collects ALL remaining elements                                    │
 * │   • Rest is always an array (empty [] if nothing left)                     │
 * │                                                                             │
 * └─────────────────────────────────────────────────────────────────────────────┘
 */


// ═══════════════════════════════════════════════════════════════════════════════
// 5. Swapping Variables
// ═══════════════════════════════════════════════════════════════════════════════

console.log("═══ 5. Swapping Variables ═══\n");

let left = 'LEFT';
let right = 'RIGHT';

console.log('O: Before swap:', left, right);

// Traditional way (needs temp variable)
// const temp = left;
// left = right;
// right = temp;

// Destructuring way (no temp needed!)
[left, right] = [right, left];

console.log('P: After swap:', left, right);

// Rotate three values
let a = 1, b = 2, c = 3;
console.log('Q: Before rotate:', a, b, c);
[a, b, c] = [b, c, a];
console.log('R: After rotate:', a, b, c);

console.log('');

/**
 * ┌─────────────────────────────────────────────────────────────────────────────┐
 * │ SWAP PATTERN                                                                │
 * ├─────────────────────────────────────────────────────────────────────────────┤
 * │                                                                             │
 * │   [a, b] = [b, a];                                                          │
 * │                                                                             │
 * │   Step 1: Right side creates temporary array [b, a]                        │
 * │   Step 2: Left side destructures into a and b                              │
 * │   Step 3: a gets old b, b gets old a                                       │
 * │                                                                             │
 * │   NO TEMPORARY VARIABLE NEEDED!                                             │
 * │                                                                             │
 * │   Works for any number of variables:                                        │
 * │   [a, b, c] = [c, a, b];  // Rotate                                        │
 * │   [a, b, c, d] = [d, c, b, a];  // Reverse                                 │
 * │                                                                             │
 * └─────────────────────────────────────────────────────────────────────────────┘
 */


// ═══════════════════════════════════════════════════════════════════════════════
// 6. Destructuring Function Returns
// ═══════════════════════════════════════════════════════════════════════════════

console.log("═══ 6. Function Return Destructuring ═══\n");

// Function returning array
function getCoordinates() {
  return [10, 20, 30];
}

const [x, y, z] = getCoordinates();
console.log('S: Coordinates:', x, y, z);

// Common pattern: React useState
function useState(initialValue) {
  let state = initialValue;
  const setState = (newValue) => { state = newValue; };
  return [state, setState];  // Returns [value, setter]
}

const [count, setCount] = useState(0);
console.log('T: React pattern - count:', count);

// Ignore values you don't need
function getStats() {
  return [100, 200, 300, 400];
}

const [min, , , max] = getStats();
console.log('U: Min and max only:', min, max);

console.log('');


// ═══════════════════════════════════════════════════════════════════════════════
// 7. Nested Array Destructuring
// ═══════════════════════════════════════════════════════════════════════════════

console.log("═══ 7. Nested Destructuring ═══\n");

const matrix = [
  [1, 2, 3],
  [4, 5, 6],
  [7, 8, 9]
];

// Get nested values
const [[a11, a12], [, a22], [, , a33]] = matrix;
console.log('V: Diagonal:', a11, a22, a33);

// Mixed with rest
const [firstRow, ...otherRows] = matrix;
console.log('W: First row:', firstRow);
console.log('X: Other rows:', otherRows);

// Deep nesting
const nested = [1, [2, [3, [4]]]];
const [n1, [n2, [n3, [n4]]]] = nested;
console.log('Y: Deep nested:', n1, n2, n3, n4);

console.log('');

/**
 * ┌─────────────────────────────────────────────────────────────────────────────┐
 * │ NESTED DESTRUCTURING                                                        │
 * ├─────────────────────────────────────────────────────────────────────────────┤
 * │                                                                             │
 * │   const [[a, b], [c, d]] = [[1, 2], [3, 4]];                               │
 * │                                                                             │
 * │   Outer array: [ [1,2], [3,4] ]                                            │
 * │                    │      │                                                │
 * │                    ▼      ▼                                                │
 * │   Pattern:      [a, b] [c, d]                                              │
 * │                                                                             │
 * │   Inner arrays: [1, 2] [3, 4]                                              │
 * │                  │  │   │  │                                               │
 * │                  ▼  ▼   ▼  ▼                                               │
 * │   Values:        a  b   c  d                                               │
 * │                  1  2   3  4                                               │
 * │                                                                             │
 * └─────────────────────────────────────────────────────────────────────────────┘
 */


/**
 * ┌─────────────────────────────────────────────────────────────────────────────┐
 * │ INTERVIEW ANSWER                                                            │
 * ├─────────────────────────────────────────────────────────────────────────────┤
 * │                                                                             │
 * │ "Array destructuring is an ES6 feature that extracts values from arrays    │
 * │  into variables based on position. Key features:                            │
 * │                                                                             │
 * │  1. Basic: const [a, b] = [1, 2]                                            │
 * │  2. Skip elements: const [, second] = arr                                   │
 * │  3. Default values: const [a = 'default'] = []                              │
 * │     - Only used when value is undefined, not null/0/''                      │
 * │  4. Rest pattern: const [first, ...rest] = arr                              │
 * │     - Must be last, collects remaining into array                           │
 * │  5. Swapping: [a, b] = [b, a] - no temp variable needed                     │
 * │  6. Nested: const [[a]] = [[1]]                                             │
 * │                                                                             │
 * │  Common use case: React's useState returns [value, setter], which           │
 * │  we destructure as const [count, setCount] = useState(0)                    │
 * │                                                                             │
 * │  Position matters - unlike object destructuring which uses keys."          │
 * │                                                                             │
 * └─────────────────────────────────────────────────────────────────────────────┘
 *
 *
 * RUN: node docs/14-destructuring-spread/00-array-destructuring.js
 */
