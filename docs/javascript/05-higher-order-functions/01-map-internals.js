/**
 * TOPIC: Array.map() Internals
 *
 * STORY: Imagine a PHOTO FILTER APP. You have a row of photos. You apply
 * the same filter (brightness +20) to EVERY photo. You get back a NEW row
 * of filtered photos -- the originals stay untouched. That is .map()!
 *
 * ╔════════════════════════════════════════════════════════════════════════════╗
 * ║ THE GOLDEN RULE                                                            ║
 * ╠════════════════════════════════════════════════════════════════════════════╣
 * ║                                                                            ║
 * ║ Array.map() creates a NEW array by calling a function on every element.    ║
 * ║                                                                            ║
 * ║   [1, 2, 3].map(fn)  →  [fn(1), fn(2), fn(3)]                              ║
 * ║                                                                            ║
 * ║ Key points:                                                                ║
 * ║   • Returns a NEW array (original unchanged)                               ║
 * ║   • Same length as original                                                ║
 * ║   • Callback receives: (element, index, array)                             ║
 * ║                                                                            ║
 * ╚════════════════════════════════════════════════════════════════════════════╝
 */

const numbers = [1, 2, 3, 4, 5]; // ES6: const

// Using built-in map
const doubled = numbers.map((num) => num * 2); // ES6: const
console.log('A:', doubled);

// Map with index
const withIndex = numbers.map((num, index) => `${num}-${index}`); // ES6: const
console.log('B:', withIndex);

// Map with arrow function
const squared = numbers.map(num => num * num); // ES6: const
console.log('C:', squared);

// Chaining maps
const result = numbers // ES6: const
  .map(x => x * 2)
  .map(x => x + 1);
console.log('D:', result);

/**
 * OUTPUT:
 *   A: [ 2, 4, 6, 8, 10 ]
 *   B: [ '1-0', '2-1', '3-2', '4-3', '5-4' ]
 *   C: [ 1, 4, 9, 16, 25 ]
 *   D: [ 3, 5, 7, 9, 11 ]
 *
 *
 * ╔════════════════════════════════════════════════════════════════════════════╗
 * ║ STEP-BY-STEP BREAKDOWN                                                     ║
 * ╠════════════════════════════════════════════════════════════════════════════╣
 * ║                                                                            ║
 * ║ A: numbers.map(num => num * 2)                                             ║
 * ║ ──────────────────────────────                                             ║
 * ║   • Element 1: 1 * 2 = 2                                                   ║
 * ║   • Element 2: 2 * 2 = 4                                                   ║
 * ║   • Element 3: 3 * 2 = 6                                                   ║
 * ║   • Element 4: 4 * 2 = 8                                                   ║
 * ║   • Element 5: 5 * 2 = 10                                                  ║
 * ║   • Result: [2, 4, 6, 8, 10]                                               ║
 * ║                                                                            ║
 * ║                                                                            ║
 * ║ B: numbers.map((num, index) => `${num}-${index}`)                          ║
 * ║ ─────────────────────────────────────────────────                          ║
 * ║   • Element 1, Index 0: "1-0"                                              ║
 * ║   • Element 2, Index 1: "2-1"                                              ║
 * ║   • Element 3, Index 2: "3-2"                                              ║
 * ║   • ...and so on                                                           ║
 * ║                                                                            ║
 * ║                                                                            ║
 * ║ D: Chained maps                                                            ║
 * ║ ───────────────                                                            ║
 * ║   • First map: [1,2,3,4,5] → [2,4,6,8,10]                                  ║
 * ║   • Second map: [2,4,6,8,10] → [3,5,7,9,11]                                ║
 * ║                                                                            ║
 * ╚════════════════════════════════════════════════════════════════════════════╝
 *
 *
 * ┌─────────────────────────────────────────────────────────────────────────────┐
 * │ HOW MAP WORKS INTERNALLY                                                    │
 * ├─────────────────────────────────────────────────────────────────────────────┤
 * │                                                                             │
 * │   // Simplified implementation                                              │
 * │   Array.prototype.myMap = function(callback) {                              │
 * │     const result = [];                                                      │
 * │     for (let i = 0; i < this.length; i++) {                                 │
 * │       result.push(callback(this[i], i, this));                              │
 * │     }                                                                       │
 * │     return result;                                                          │
 * │   };                                                                        │
 * │                                                                             │
 * │   // Usage:                                                                 │
 * │   [1, 2, 3].myMap(x => x * 2);  // [2, 4, 6]                                │
 * │                                                                             │
 * └─────────────────────────────────────────────────────────────────────────────┘
 *
 *
 * ┌─────────────────────────────────────────────────────────────────────────────┐
 * │ MAP CALLBACK SIGNATURE                                                      │
 * ├─────────────────────────────────────────────────────────────────────────────┤
 * │                                                                             │
 * │   array.map((element, index, array) => {                                    │
 * │     // element: current element                                             │
 * │     // index: current index                                                 │
 * │     // array: the original array being mapped                               │
 * │     return transformedElement;                                              │
 * │   });                                                                       │
 * │                                                                             │
 * │   // Most common: just use element                                          │
 * │   [1, 2, 3].map(x => x * 2);                                                │
 * │                                                                             │
 * │   // Sometimes need index                                                   │
 * │   ['a', 'b', 'c'].map((el, i) => `${i}: ${el}`);                            │
 * │                                                                             │
 * └─────────────────────────────────────────────────────────────────────────────┘
 *
 *
 * ┌─────────────────────────────────────────────────────────────────────────────┐
 * │ COMMON INTERVIEW GOTCHA                                                     │
 * ├─────────────────────────────────────────────────────────────────────────────┤
 * │                                                                             │
 * │   ['1', '2', '3'].map(parseInt);                                            │
 * │                                                                             │
 * │   // Expected: [1, 2, 3]                                                    │
 * │   // Actual: [1, NaN, NaN]                                                  │
 * │                                                                             │
 * │   // WHY?                                                                   │
 * │   // map passes: (element, index, array)                                    │
 * │   // parseInt expects: (string, radix)                                      │
 * │                                                                             │
 * │   // So it becomes:                                                         │
 * │   // parseInt('1', 0) → 1 (radix 0 means auto-detect)                       │
 * │   // parseInt('2', 1) → NaN (radix 1 is invalid)                            │
 * │   // parseInt('3', 2) → NaN (3 is not valid in binary)                      │
 * │                                                                             │
 * │   // Fix:                                                                   │
 * │   ['1', '2', '3'].map(x => parseInt(x, 10));  // [1, 2, 3]                  │
 * │   ['1', '2', '3'].map(Number);  // [1, 2, 3]                                │
 * │                                                                             │
 * └─────────────────────────────────────────────────────────────────────────────┘
 *
 *
 * ┌─────────────────────────────────────────────────────────────────────────────┐
 * │ INTERVIEW QUESTIONS:                                                        │
 * ├─────────────────────────────────────────────────────────────────────────────┤
 * │                                                                             │
 * │ Q1: What does Array.map() return and does it mutate the original array?     │
 * │ A1: map() returns a NEW array of the same length with each element          │
 * │     transformed by the callback. It does NOT mutate the original array.     │
 * │                                                                             │
 * │ Q2: Why does ['1','2','3'].map(parseInt) return [1, NaN, NaN]?              │
 * │ A2: map passes (element, index, array) to the callback. parseInt receives   │
 * │     the index as the radix argument. parseInt('2', 1) and parseInt('3', 2)  │
 * │     produce NaN because 1 is invalid radix and 3 is not a valid binary      │
 * │     digit. Fix: .map(x => parseInt(x, 10)) or .map(Number).                │
 * │                                                                             │
 * │ Q3: How would you implement map() from scratch?                             │
 * │ A3: Create a new empty array, loop through `this`, call the callback with   │
 * │     (element, index, array), push each result, and return the new array.    │
 * │                                                                             │
 * └─────────────────────────────────────────────────────────────────────────────┘
 *
 *
 * RUN: node docs/javascript/05-higher-order-functions/01-map-internals.js
 */
