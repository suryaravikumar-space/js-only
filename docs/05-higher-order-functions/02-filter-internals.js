/**
 * CHALLENGE 02: Array.filter() Internals
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

var numbers = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];

// Filter even numbers
var evens = numbers.filter(function(num) {
  return num % 2 === 0;
});
console.log('A:', evens);

// Filter with index
var firstHalf = numbers.filter(function(num, index) {
  return index < 5;
});
console.log('B:', firstHalf);

// Filter objects
var users = [
  { name: 'Alice', age: 25, active: true },
  { name: 'Bob', age: 30, active: false },
  { name: 'Charlie', age: 35, active: true }
];

var activeUsers = users.filter(user => user.active);
console.log('C:', activeUsers.map(u => u.name));

// Chaining filter and map
var result = numbers
  .filter(x => x % 2 === 0)
  .map(x => x * x);
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
 * │     var result = [];                                                        │
 * │     for (var i = 0; i < this.length; i++) {                                 │
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
 * │   var nums = [1, 2, 3, 4, 5];                                               │
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
 * RUN: node docs/05-higher-order-functions/02-filter-internals.js
 */
