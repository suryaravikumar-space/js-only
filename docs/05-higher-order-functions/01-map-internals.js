/**
 * CHALLENGE 01: Array.map() Internals
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

var numbers = [1, 2, 3, 4, 5];

// Using built-in map
var doubled = numbers.map(function(num) {
  return num * 2;
});
console.log('A:', doubled);

// Map with index
var withIndex = numbers.map(function(num, index) {
  return num + '-' + index;
});
console.log('B:', withIndex);

// Map with arrow function
var squared = numbers.map(num => num * num);
console.log('C:', squared);

// Chaining maps
var result = numbers
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
 * ║ B: numbers.map((num, index) => num + '-' + index)                          ║
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
 * │     var result = [];                                                        │
 * │     for (var i = 0; i < this.length; i++) {                                 │
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
 * │   array.map(function(element, index, array) {                               │
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
 * RUN: node docs/05-higher-order-functions/01-map-internals.js
 */
