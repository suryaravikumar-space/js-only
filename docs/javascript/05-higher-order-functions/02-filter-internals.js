/**
 * TOPIC: Array.filter() Internals
 *
 * STORY: Imagine a SECURITY CHECKPOINT at an airport. Every passenger walks
 * through, but only those who pass the scan (truthy) get through to the gate.
 * The rest are excluded. You get a NEW line of approved passengers. That is .filter()!
 *
 * ╔════════════════════════════════════════════════════════════════════════════╗
 * ║ THE GOLDEN RULE                                                            ║
 * ╠════════════════════════════════════════════════════════════════════════════╣
 * ║                                                                            ║
 * ║ Array.filter() creates a NEW array with elements that pass a test.         ║
 * ║                                                                            ║
 * ║   [1, 2, 3, 4].filter(x => x > 2)  →  [3, 4]                               ║
 * ║                                                                            ║
 * ║ Key points:                                                                ║
 * ║   • Returns a NEW array (original unchanged)                               ║
 * ║   • Length can be 0 to original.length                                     ║
 * ║   • Callback must return truthy/falsy                                      ║
 * ║   • Elements are NOT transformed, just selected                            ║
 * ║                                                                            ║
 * ╚════════════════════════════════════════════════════════════════════════════╝
 */

const numbers = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]; // ES6: const

// Filter even numbers
const evens = numbers.filter((num) => num % 2 === 0); // ES6: const
console.log('A:', evens);

// Filter with index
const firstHalf = numbers.filter((num, index) => index < 5); // ES6: const
console.log('B:', firstHalf);

// Filter objects
const users = [ // ES6: const
  { name: 'Alice', age: 25, active: true },
  { name: 'Bob', age: 30, active: false },
  { name: 'Charlie', age: 35, active: true }
];

const activeUsers = users.filter((user) => user.active); // ES6: const
console.log('C:', activeUsers.map((u) => u.name));

// Chaining filter and map
const result = numbers // ES6: const
  .filter((x) => x % 2 === 0)
  .map((x) => x * x);
console.log('D:', result);

/**
 * OUTPUT:
 *   A: [ 2, 4, 6, 8, 10 ]
 *   B: [ 1, 2, 3, 4, 5 ]
 *   C: [ 'Alice', 'Charlie' ]
 *   D: [ 4, 16, 36, 64, 100 ]
 *
 *
 * ╔════════════════════════════════════════════════════════════════════════════╗
 * ║ STEP-BY-STEP BREAKDOWN                                                     ║
 * ╠════════════════════════════════════════════════════════════════════════════╣
 * ║                                                                            ║
 * ║ A: numbers.filter(num => num % 2 === 0)                                    ║
 * ║ ───────────────────────────────────────                                    ║
 * ║   • 1 % 2 === 0? NO  → excluded                                            ║
 * ║   • 2 % 2 === 0? YES → included                                            ║
 * ║   • 3 % 2 === 0? NO  → excluded                                            ║
 * ║   • 4 % 2 === 0? YES → included                                            ║
 * ║   • ...etc                                                                 ║
 * ║   • Result: [2, 4, 6, 8, 10]                                               ║
 * ║                                                                            ║
 * ║                                                                            ║
 * ║ C: users.filter(user => user.active)                                       ║
 * ║ ────────────────────────────────────                                       ║
 * ║   • Alice: active=true  → included                                         ║
 * ║   • Bob: active=false   → excluded                                         ║
 * ║   • Charlie: active=true → included                                        ║
 * ║   • Result: [{name:'Alice'...}, {name:'Charlie'...}]                       ║
 * ║                                                                            ║
 * ║                                                                            ║
 * ║ D: filter then map                                                         ║
 * ║ ──────────────────                                                         ║
 * ║   • filter: [1-10] → [2,4,6,8,10] (even numbers)                           ║
 * ║   • map: [2,4,6,8,10] → [4,16,36,64,100] (squared)                         ║
 * ║                                                                            ║
 * ╚════════════════════════════════════════════════════════════════════════════╝
 *
 *
 * ┌─────────────────────────────────────────────────────────────────────────────┐
 * │ HOW FILTER WORKS INTERNALLY                                                 │
 * ├─────────────────────────────────────────────────────────────────────────────┤
 * │                                                                             │
 * │   // Simplified implementation                                              │
 * │   Array.prototype.myFilter = function(predicate) {                          │
 * │     const result = [];                                                      │
 * │     for (let i = 0; i < this.length; i++) {                                 │
 * │       if (predicate(this[i], i, this)) {                                    │
 * │         result.push(this[i]);                                               │
 * │       }                                                                     │
 * │     }                                                                       │
 * │     return result;                                                          │
 * │   };                                                                        │
 * │                                                                             │
 * │   // Usage:                                                                 │
 * │   [1, 2, 3, 4].myFilter(x => x > 2);  // [3, 4]                             │
 * │                                                                             │
 * └─────────────────────────────────────────────────────────────────────────────┘
 *
 *
 * ┌─────────────────────────────────────────────────────────────────────────────┐
 * │ TRUTHY/FALSY IN FILTER                                                      │
 * ├─────────────────────────────────────────────────────────────────────────────┤
 * │                                                                             │
 * │   // Filter uses truthy/falsy, not just true/false                          │
 * │                                                                             │
 * │   // Remove falsy values:                                                   │
 * │   [0, 1, '', 'hello', null, undefined, false, true]                         │
 * │     .filter(Boolean);  // [1, 'hello', true]                                │
 * │                                                                             │
 * │   // Remove empty strings:                                                  │
 * │   ['a', '', 'b', '', 'c'].filter(x => x);  // ['a', 'b', 'c']               │
 * │                                                                             │
 * │   // Filter nullish values:                                                 │
 * │   [1, null, 2, undefined, 3].filter(x => x != null);  // [1, 2, 3]          │
 * │                                                                             │
 * └─────────────────────────────────────────────────────────────────────────────┘
 *
 *
 * ┌─────────────────────────────────────────────────────────────────────────────┐
 * │ FILTER vs FIND                                                              │
 * ├─────────────────────────────────────────────────────────────────────────────┤
 * │                                                                             │
 * │   const nums = [1, 2, 3, 4, 5];                                             │
 * │                                                                             │
 * │   // filter: returns ALL matches as array                                   │
 * │   nums.filter(x => x > 2);  // [3, 4, 5]                                    │
 * │                                                                             │
 * │   // find: returns FIRST match (or undefined)                               │
 * │   nums.find(x => x > 2);    // 3                                            │
 * │                                                                             │
 * │   ┌──────────┬────────────────────┬──────────────────────┐                  │
 * │   │ Method   │ Returns            │ Use when             │                  │
 * │   ├──────────┼────────────────────┼──────────────────────┤                  │
 * │   │ filter   │ Array of matches   │ Need all matches     │                  │
 * │   │ find     │ First match/undef  │ Need one match       │                  │
 * │   └──────────┴────────────────────┴──────────────────────┘                  │
 * │                                                                             │
 * └─────────────────────────────────────────────────────────────────────────────┘
 *
 *
 * ┌─────────────────────────────────────────────────────────────────────────────┐
 * │ INTERVIEW QUESTIONS:                                                        │
 * ├─────────────────────────────────────────────────────────────────────────────┤
 * │                                                                             │
 * │ Q1: What is the difference between filter() and find()?                     │
 * │ A1: filter() returns a NEW array of ALL elements that pass the test.        │
 * │     find() returns only the FIRST element that passes (or undefined).       │
 * │                                                                             │
 * │ Q2: How can you remove all falsy values from an array?                      │
 * │ A2: Use .filter(Boolean). Boolean is used as the callback -- it converts    │
 * │     each element to true/false, keeping only truthy values.                 │
 * │                                                                             │
 * │ Q3: Does filter() mutate the original array?                                │
 * │ A3: No. filter() returns a brand new array. The original array remains      │
 * │     unchanged. However, if the array contains objects, both arrays          │
 * │     reference the same objects (shallow copy).                              │
 * │                                                                             │
 * └─────────────────────────────────────────────────────────────────────────────┘
 *
 *
 * RUN: node docs/javascript/05-higher-order-functions/02-filter-internals.js
 */
