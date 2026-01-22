/**
 * CHALLENGE 06: sort as Higher-Order Function
 *
 * ╔════════════════════════════════════════════════════════════════════════════╗
 * ║ THE GOLDEN RULE                                                            ║
 * ╠════════════════════════════════════════════════════════════════════════════╣
 * ║                                                                            ║
 * ║ Array.sort() sorts IN-PLACE and takes an optional comparator function.     ║
 * ║                                                                            ║
 * ║ Default sort: Converts to strings and sorts lexicographically!             ║
 * ║   [10, 5, 100].sort()  →  [10, 100, 5]  (string order)                     ║
 * ║                                                                            ║
 * ║ Numeric sort: Provide comparator                                           ║
 * ║   [10, 5, 100].sort((a,b) => a - b)  →  [5, 10, 100]                       ║
 * ║                                                                            ║
 * ║ Comparator returns:                                                        ║
 * ║   negative: a comes first                                                  ║
 * ║   positive: b comes first                                                  ║
 * ║   zero: keep original order                                                ║
 * ║                                                                            ║
 * ╚════════════════════════════════════════════════════════════════════════════╝
 */

// Default sort - converts to strings!
var numbers = [10, 5, 8, 1, 7, 100, 25];
console.log('A:', [...numbers].sort());

// Numeric sort with comparator function
var numericSort = [...numbers].sort(function(a, b) {
  return a - b;  // ascending
});
console.log('B:', numericSort);

// Descending sort
var descending = [...numbers].sort(function(a, b) {
  return b - a;
});
console.log('C:', descending);

// Sort objects by property
var users = [
  { name: 'Charlie', age: 35 },
  { name: 'Alice', age: 25 },
  { name: 'Bob', age: 30 }
];

var byAge = [...users].sort((a, b) => a.age - b.age);
console.log('D:', byAge.map(u => u.name));

/**
 * OUTPUT:
 *   A: [ 1, 10, 100, 25, 5, 7, 8 ]
 *   B: [ 1, 5, 7, 8, 10, 25, 100 ]
 *   C: [ 100, 25, 10, 8, 7, 5, 1 ]
 *   D: [ 'Alice', 'Bob', 'Charlie' ]
 *
 *
 * ╔════════════════════════════════════════════════════════════════════════════╗
 * ║ STEP-BY-STEP BREAKDOWN                                                     ║
 * ╠════════════════════════════════════════════════════════════════════════════╣
 * ║                                                                            ║
 * ║ A: Default sort (GOTCHA!)                                                  ║
 * ║ ─────────────────────────                                                  ║
 * ║   • Numbers are converted to STRINGS                                       ║
 * ║   • "10" < "100" < "25" < "5" (lexicographic)                              ║
 * ║   • "1" < "10" < "100" < "25" < "5" < "7" < "8"                            ║
 * ║   • This is almost NEVER what you want for numbers!                        ║
 * ║                                                                            ║
 * ║                                                                            ║
 * ║ B: Numeric ascending                                                       ║
 * ║ ────────────────────                                                       ║
 * ║   • (a, b) => a - b                                                        ║
 * ║   • If a < b: negative → a first                                           ║
 * ║   • If a > b: positive → b first                                           ║
 * ║   • Result: [1, 5, 7, 8, 10, 25, 100]                                      ║
 * ║                                                                            ║
 * ║                                                                            ║
 * ║ C: Numeric descending                                                      ║
 * ║ ─────────────────────                                                      ║
 * ║   • (a, b) => b - a (reversed)                                             ║
 * ║   • If a < b: positive → b first                                           ║
 * ║   • Result: [100, 25, 10, 8, 7, 5, 1]                                      ║
 * ║                                                                            ║
 * ╚════════════════════════════════════════════════════════════════════════════╝
 *
 *
 * ┌─────────────────────────────────────────────────────────────────────────────┐
 * │ THE COMPARATOR FUNCTION                                                     │
 * ├─────────────────────────────────────────────────────────────────────────────┤
 * │                                                                             │
 * │   array.sort(function(a, b) {                                               │
 * │     // Return negative: a comes before b                                    │
 * │     // Return positive: b comes before a                                    │
 * │     // Return 0: keep original order                                        │
 * │   });                                                                       │
 * │                                                                             │
 * │   // Memory trick for numbers:                                              │
 * │   a - b  →  ascending  (small to large)                                     │
 * │   b - a  →  descending (large to small)                                     │
 * │                                                                             │
 * │   // For strings, use localeCompare:                                        │
 * │   ['banana', 'Apple', 'cherry'].sort((a, b) => a.localeCompare(b));         │
 * │   // ['Apple', 'banana', 'cherry'] (case-insensitive)                       │
 * │                                                                             │
 * └─────────────────────────────────────────────────────────────────────────────┘
 *
 *
 * ┌─────────────────────────────────────────────────────────────────────────────┐
 * │ SORTING OBJECTS                                                             │
 * ├─────────────────────────────────────────────────────────────────────────────┤
 * │                                                                             │
 * │   var products = [                                                          │
 * │     { name: 'Laptop', price: 999 },                                         │
 * │     { name: 'Phone', price: 699 },                                          │
 * │     { name: 'Tablet', price: 499 }                                          │
 * │   ];                                                                        │
 * │                                                                             │
 * │   // Sort by price (ascending)                                              │
 * │   products.sort((a, b) => a.price - b.price);                               │
 * │                                                                             │
 * │   // Sort by name (alphabetically)                                          │
 * │   products.sort((a, b) => a.name.localeCompare(b.name));                    │
 * │                                                                             │
 * │   // Sort by multiple criteria                                              │
 * │   products.sort((a, b) => {                                                 │
 * │     // First by category, then by price                                     │
 * │     if (a.category !== b.category) {                                        │
 * │       return a.category.localeCompare(b.category);                          │
 * │     }                                                                       │
 * │     return a.price - b.price;                                               │
 * │   });                                                                       │
 * │                                                                             │
 * └─────────────────────────────────────────────────────────────────────────────┘
 *
 *
 * ┌─────────────────────────────────────────────────────────────────────────────┐
 * │ IMPORTANT: SORT MUTATES!                                                    │
 * ├─────────────────────────────────────────────────────────────────────────────┤
 * │                                                                             │
 * │   var original = [3, 1, 2];                                                 │
 * │   var sorted = original.sort((a, b) => a - b);                              │
 * │                                                                             │
 * │   console.log(original);  // [1, 2, 3] - MUTATED!                           │
 * │   console.log(sorted);    // [1, 2, 3]                                      │
 * │   console.log(original === sorted);  // true - same array!                  │
 * │                                                                             │
 * │   // To avoid mutation, copy first:                                         │
 * │   var sorted = [...original].sort((a, b) => a - b);                         │
 * │   // or                                                                     │
 * │   var sorted = original.slice().sort((a, b) => a - b);                      │
 * │   // or (ES2023)                                                            │
 * │   var sorted = original.toSorted((a, b) => a - b);                          │
 * │                                                                             │
 * └─────────────────────────────────────────────────────────────────────────────┘
 *
 *
 * ┌─────────────────────────────────────────────────────────────────────────────┐
 * │ INTERVIEW GOTCHA                                                            │
 * ├─────────────────────────────────────────────────────────────────────────────┤
 * │                                                                             │
 * │   // What does this return?                                                 │
 * │   [10, 9, 8, 7].sort();                                                     │
 * │                                                                             │
 * │   // Answer: [10, 7, 8, 9]                                                  │
 * │   // Because "10" < "7" < "8" < "9" (string comparison)                     │
 * │                                                                             │
 * │   // ALWAYS use comparator for numbers!                                     │
 * │   [10, 9, 8, 7].sort((a, b) => a - b);  // [7, 8, 9, 10]                    │
 * │                                                                             │
 * └─────────────────────────────────────────────────────────────────────────────┘
 *
 *
 * RUN: node docs/05-higher-order-functions/06-sort-hof.js
 */
