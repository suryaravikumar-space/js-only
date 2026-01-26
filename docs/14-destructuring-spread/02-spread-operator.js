/**
 * CHALLENGE 02: Spread Operator (...)
 *
 * ╔════════════════════════════════════════════════════════════════════════════╗
 * ║ THE GOLDEN RULE                                                            ║
 * ╠════════════════════════════════════════════════════════════════════════════╣
 * ║                                                                            ║
 * ║ Spread (...) EXPANDS an iterable into individual elements.                ║
 * ║ Rest (...) COLLECTS multiple elements into one.                            ║
 * ║                                                                            ║
 * ║   SPREAD: Expands    [...array] → element, element, element                ║
 * ║   REST:   Collects   (...args) → [args as array]                           ║
 * ║                                                                            ║
 * ║   Same syntax, opposite operations!                                        ║
 * ║                                                                            ║
 * ╚════════════════════════════════════════════════════════════════════════════╝
 */


// ═══════════════════════════════════════════════════════════════════════════════
// 1. Spread with Arrays
// ═══════════════════════════════════════════════════════════════════════════════

console.log("═══ 1. Array Spread ═══\n");

const arr1 = [1, 2, 3];
const arr2 = [4, 5, 6];

// Combine arrays
const combined = [...arr1, ...arr2];
console.log('A: Combined:', combined);

// Add elements
const withExtra = [0, ...arr1, 3.5, ...arr2, 7];
console.log('B: With extras:', withExtra);

// Copy array (shallow)
const copy = [...arr1];
copy.push(999);
console.log('C: Original:', arr1);
console.log('D: Copy:', copy);

console.log('');

/**
 * ┌─────────────────────────────────────────────────────────────────────────────┐
 * │ ARRAY SPREAD VISUALIZATION                                                  │
 * ├─────────────────────────────────────────────────────────────────────────────┤
 * │                                                                             │
 * │   const a = [1, 2];                                                         │
 * │   const b = [3, 4];                                                         │
 * │                                                                             │
 * │   [...a, ...b]                                                              │
 * │     │      │                                                               │
 * │     ▼      ▼                                                               │
 * │   [1, 2, 3, 4]                                                              │
 * │                                                                             │
 * │   What happens:                                                             │
 * │   1. ...a expands to: 1, 2                                                  │
 * │   2. ...b expands to: 3, 4                                                  │
 * │   3. New array: [1, 2, 3, 4]                                               │
 * │                                                                             │
 * │   It's like writing: [a[0], a[1], b[0], b[1]]                              │
 * │                                                                             │
 * └─────────────────────────────────────────────────────────────────────────────┘
 */


// ═══════════════════════════════════════════════════════════════════════════════
// 2. Spread with Objects
// ═══════════════════════════════════════════════════════════════════════════════

console.log("═══ 2. Object Spread ═══\n");

const defaults = {
  host: 'localhost',
  port: 3000,
  timeout: 5000
};

const userConfig = {
  port: 8080,
  debug: true
};

// Merge objects (later values override earlier)
const config = { ...defaults, ...userConfig };
console.log('E: Merged config:', config);

// Clone object (shallow)
const clone = { ...defaults };
clone.port = 9999;
console.log('F: Original:', defaults);
console.log('G: Clone:', clone);

// Add/override properties
const updated = {
  ...defaults,
  port: 4000,
  newProp: 'added'
};
console.log('H: Updated:', updated);

console.log('');

/**
 * ┌─────────────────────────────────────────────────────────────────────────────┐
 * │ OBJECT SPREAD - ORDER MATTERS!                                              │
 * ├─────────────────────────────────────────────────────────────────────────────┤
 * │                                                                             │
 * │   const a = { x: 1, y: 2 };                                                 │
 * │   const b = { y: 99, z: 3 };                                                │
 * │                                                                             │
 * │   { ...a, ...b }  →  { x: 1, y: 99, z: 3 }                                 │
 * │                            ↑                                                │
 * │                            │                                                │
 * │                     b's y overrides a's y                                  │
 * │                                                                             │
 * │   { ...b, ...a }  →  { y: 2, z: 3, x: 1 }                                  │
 * │                       ↑                                                     │
 * │                       │                                                     │
 * │                     a's y overrides b's y                                  │
 * │                                                                             │
 * │   RULE: Last one wins!                                                      │
 * │                                                                             │
 * └─────────────────────────────────────────────────────────────────────────────┘
 */


// ═══════════════════════════════════════════════════════════════════════════════
// 3. Spread in Function Calls
// ═══════════════════════════════════════════════════════════════════════════════

console.log("═══ 3. Function Call Spread ═══\n");

function sum(a, b, c) {
  return a + b + c;
}

const numbers = [1, 2, 3];

// Traditional (apply)
console.log('I: Using apply:', sum.apply(null, numbers));

// Spread (cleaner)
console.log('J: Using spread:', sum(...numbers));

// With Math functions
const values = [5, 1, 8, 3, 9, 2];
console.log('K: Max:', Math.max(...values));
console.log('L: Min:', Math.min(...values));

// Spread with other arguments
console.log('M: Mixed:', Math.max(0, ...values, 100));

console.log('');


// ═══════════════════════════════════════════════════════════════════════════════
// 4. Spread vs Rest - Know the Difference!
// ═══════════════════════════════════════════════════════════════════════════════

console.log("═══ 4. Spread vs Rest ═══\n");

// SPREAD: Expands elements (right side of =, function args)
const spreadExample = [...[1, 2], ...[3, 4]];
console.log('N: Spread (expand):', spreadExample);

// REST: Collects elements (left side of =, function params)
const [first, ...restExample] = [1, 2, 3, 4];
console.log('O: Rest (collect):', first, restExample);

// In functions
function restParams(...nums) {  // REST: collects
  return nums.reduce((a, b) => a + b);
}
console.log('P: Rest params:', restParams(1, 2, 3, 4));

const args = [1, 2, 3, 4];
console.log('Q: Spread args:', restParams(...args));  // SPREAD: expands

console.log('');

/**
 * ┌─────────────────────────────────────────────────────────────────────────────┐
 * │ SPREAD vs REST                                                              │
 * ├─────────────────────────────────────────────────────────────────────────────┤
 * │                                                                             │
 * │   SPREAD (expands):                                                         │
 * │   • In array literals:    [1, ...arr, 2]                                   │
 * │   • In object literals:   { ...obj, x: 1 }                                 │
 * │   • In function calls:    fn(...args)                                      │
 * │                                                                             │
 * │   REST (collects):                                                          │
 * │   • In destructuring:     const [a, ...rest] = arr                         │
 * │   • In function params:   function fn(...args) { }                         │
 * │                                                                             │
 * │   ┌────────────────────────────────────────────────────────────────────┐   │
 * │   │                                                                     │   │
 * │   │   SPREAD: [1, 2, 3] → 1, 2, 3         (array to elements)          │   │
 * │   │   REST:   1, 2, 3 → [1, 2, 3]         (elements to array)          │   │
 * │   │                                                                     │   │
 * │   │   They're OPPOSITES with the SAME SYNTAX!                          │   │
 * │   │                                                                     │   │
 * │   └────────────────────────────────────────────────────────────────────┘   │
 * │                                                                             │
 * └─────────────────────────────────────────────────────────────────────────────┘
 */


// ═══════════════════════════════════════════════════════════════════════════════
// 5. Shallow Copy Warning
// ═══════════════════════════════════════════════════════════════════════════════

console.log("═══ 5. Shallow Copy Warning ═══\n");

const original = {
  name: 'John',
  scores: [85, 90, 95],
  address: {
    city: 'NYC'
  }
};

// Spread creates SHALLOW copy
const shallow = { ...original };

// Primitives are copied (safe)
shallow.name = 'Jane';
console.log('R: Original name:', original.name);  // 'John'
console.log('S: Shallow name:', shallow.name);    // 'Jane'

// Nested objects/arrays are SHARED (danger!)
shallow.scores.push(100);
shallow.address.city = 'LA';
console.log('T: Original scores:', original.scores);  // [85, 90, 95, 100] - MODIFIED!
console.log('U: Original city:', original.address.city);  // 'LA' - MODIFIED!

console.log('');

/**
 * ┌─────────────────────────────────────────────────────────────────────────────┐
 * │ SHALLOW vs DEEP COPY                                                        │
 * ├─────────────────────────────────────────────────────────────────────────────┤
 * │                                                                             │
 * │   Original:          Shallow Copy:                                          │
 * │   ┌───────────┐     ┌───────────┐                                          │
 * │   │ name: 'A' │     │ name: 'A' │  ← New primitive (safe)                  │
 * │   │ arr: ──────┼─┐  │ arr: ──────┼─┐                                       │
 * │   └───────────┘ │   └───────────┘ │                                        │
 * │                 │                  │                                        │
 * │                 └───────┬──────────┘                                        │
 * │                         ▼                                                   │
 * │                   ┌──────────┐                                              │
 * │                   │ [1,2,3]  │  ← SHARED! (danger!)                        │
 * │                   └──────────┘                                              │
 * │                                                                             │
 * │   DEEP COPY OPTIONS:                                                        │
 * │   • JSON.parse(JSON.stringify(obj))  // Loses functions, dates             │
 * │   • structuredClone(obj)             // Modern, handles more types         │
 * │   • lodash.cloneDeep(obj)            // Library solution                   │
 * │                                                                             │
 * └─────────────────────────────────────────────────────────────────────────────┘
 */


// ═══════════════════════════════════════════════════════════════════════════════
// 6. Deep Copy Solutions
// ═══════════════════════════════════════════════════════════════════════════════

console.log("═══ 6. Deep Copy Solutions ═══\n");

const nested = {
  a: 1,
  b: { c: 2, d: [3, 4] }
};

// Method 1: JSON (loses functions, dates, undefined)
const jsonCopy = JSON.parse(JSON.stringify(nested));
jsonCopy.b.c = 999;
console.log('V: JSON copy - original:', nested.b.c);
console.log('W: JSON copy - copy:', jsonCopy.b.c);

// Method 2: structuredClone (modern, ES2022+)
const structuredCopy = structuredClone(nested);
structuredCopy.b.d.push(5);
console.log('X: Structured clone - original:', nested.b.d);
console.log('Y: Structured clone - copy:', structuredCopy.b.d);

// Method 3: Manual recursive (for custom needs)
function deepClone(obj) {
  if (obj === null || typeof obj !== 'object') return obj;
  if (Array.isArray(obj)) return obj.map(deepClone);
  return Object.fromEntries(
    Object.entries(obj).map(([k, v]) => [k, deepClone(v)])
  );
}

console.log('');


// ═══════════════════════════════════════════════════════════════════════════════
// 7. Common Use Cases
// ═══════════════════════════════════════════════════════════════════════════════

console.log("═══ 7. Common Use Cases ═══\n");

// 1. Immutable state update (React pattern)
const state = { count: 0, name: 'App' };
const newState = { ...state, count: state.count + 1 };
console.log('Z: State update:', state.count, '->', newState.count);

// 2. Array with new element (immutable)
const todos = ['Learn JS', 'Learn React'];
const newTodos = [...todos, 'Build Project'];
console.log('AA: Immutable add:', newTodos);

// 3. Remove from array (immutable)
const items = [1, 2, 3, 4, 5];
const without3 = items.filter(x => x !== 3);
console.log('AB: Remove item:', without3);

// 4. Update item in array (immutable)
const users = [
  { id: 1, name: 'Alice' },
  { id: 2, name: 'Bob' }
];
const updatedUsers = users.map(u =>
  u.id === 2 ? { ...u, name: 'Bobby' } : u
);
console.log('AC: Updated array:', updatedUsers);

// 5. Merge with override
const baseConfig = { a: 1, b: 2, c: 3 };
const override = { b: 99 };
const final = { ...baseConfig, ...override };
console.log('AD: Merged:', final);

console.log('');


/**
 * ┌─────────────────────────────────────────────────────────────────────────────┐
 * │ INTERVIEW ANSWER                                                            │
 * ├─────────────────────────────────────────────────────────────────────────────┤
 * │                                                                             │
 * │ "The spread operator (...) expands iterables into individual elements.     │
 * │  It's the opposite of rest, which collects elements.                        │
 * │                                                                             │
 * │  Key uses:                                                                  │
 * │  1. Combine arrays: [...arr1, ...arr2]                                      │
 * │  2. Clone arrays/objects: [...arr] or {...obj}                              │
 * │  3. Function arguments: Math.max(...numbers)                                │
 * │  4. Merge objects: {...defaults, ...overrides}                              │
 * │                                                                             │
 * │  Critical warning: Spread creates SHALLOW copies! Nested objects/arrays    │
 * │  are still shared references. For deep copy, use structuredClone() or      │
 * │  JSON.parse(JSON.stringify()).                                              │
 * │                                                                             │
 * │  In React, spread is essential for immutable state updates:                 │
 * │  setState(prev => ({ ...prev, count: prev.count + 1 }))                    │
 * │                                                                             │
 * │  For object spread, order matters - last value wins for duplicate keys."   │
 * │                                                                             │
 * └─────────────────────────────────────────────────────────────────────────────┘
 *
 *
 * RUN: node docs/14-destructuring-spread/02-spread-operator.js
 */
