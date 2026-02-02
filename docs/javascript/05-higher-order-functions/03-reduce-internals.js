/**
 * CHALLENGE 03: Array.reduce() Internals
 *
 * ╔════════════════════════════════════════════════════════════════════════════╗
 * ║ THE GOLDEN RULE                                                            ║
 * ╠════════════════════════════════════════════════════════════════════════════╣
 * ║                                                                            ║
 * ║ Array.reduce() "reduces" an array to a single value by applying a          ║
 * ║ function to each element, carrying forward an accumulator.                 ║
 * ║                                                                            ║
 * ║   [1, 2, 3].reduce((acc, curr) => acc + curr, 0)  →  6                     ║
 * ║                                                                            ║
 * ║ Key points:                                                                ║
 * ║   • Takes: (accumulator, currentValue, index, array)                       ║
 * ║   • Second argument is initial value (optional but recommended)            ║
 * ║   • Can return ANY type: number, string, array, object                     ║
 * ║   • Most powerful array method - can implement map & filter!               ║
 * ║                                                                            ║
 * ╚════════════════════════════════════════════════════════════════════════════╝
 */

var numbers = [1, 2, 3, 4, 5];

// Sum all numbers
var sum = numbers.reduce(function(accumulator, current) {
  return accumulator + current;
}, 0);
console.log('A:', sum);

// Without initial value (first element becomes initial)
var sum2 = numbers.reduce(function(acc, curr) {
  return acc + curr;
});
console.log('B:', sum2);

// Find max value
var max = numbers.reduce(function(acc, curr) {
  return curr > acc ? curr : acc;
});
console.log('C:', max);

// Flatten array
var nested = [[1, 2], [3, 4], [5]];
var flat = nested.reduce(function(acc, curr) {
  return acc.concat(curr);
}, []);
console.log('D:', flat);

// Count occurrences
var words = ['apple', 'banana', 'apple', 'cherry', 'banana', 'apple'];
var count = words.reduce(function(acc, word) {
  acc[word] = (acc[word] || 0) + 1;
  return acc;
}, {});
console.log('E:', count);

/**
 * OUTPUT:
 *   A: 15
 *   B: 15
 *   C: 5
 *   D: [ 1, 2, 3, 4, 5 ]
 *   E: { apple: 3, banana: 2, cherry: 1 }
 *
 *
 * ╔════════════════════════════════════════════════════════════════════════════╗
 * ║ STEP-BY-STEP BREAKDOWN                                                     ║
 * ╠════════════════════════════════════════════════════════════════════════════╣
 * ║                                                                            ║
 * ║ A: [1,2,3,4,5].reduce((acc, curr) => acc + curr, 0)                        ║
 * ║ ───────────────────────────────────────────────────                        ║
 * ║   • Initial: acc=0                                                         ║
 * ║   • Step 1: acc=0, curr=1  → 0+1=1                                         ║
 * ║   • Step 2: acc=1, curr=2  → 1+2=3                                         ║
 * ║   • Step 3: acc=3, curr=3  → 3+3=6                                         ║
 * ║   • Step 4: acc=6, curr=4  → 6+4=10                                        ║
 * ║   • Step 5: acc=10, curr=5 → 10+5=15                                       ║
 * ║   • Final: 15                                                              ║
 * ║                                                                            ║
 * ║                                                                            ║
 * ║ E: Count occurrences                                                       ║
 * ║ ────────────────────                                                       ║
 * ║   • Initial: acc={}                                                        ║
 * ║   • 'apple': acc={apple:1}                                                 ║
 * ║   • 'banana': acc={apple:1, banana:1}                                      ║
 * ║   • 'apple': acc={apple:2, banana:1}                                       ║
 * ║   • 'cherry': acc={apple:2, banana:1, cherry:1}                            ║
 * ║   • 'banana': acc={apple:2, banana:2, cherry:1}                            ║
 * ║   • 'apple': acc={apple:3, banana:2, cherry:1}                             ║
 * ║                                                                            ║
 * ╚════════════════════════════════════════════════════════════════════════════╝
 *
 *
 * ┌─────────────────────────────────────────────────────────────────────────────┐
 * │ HOW REDUCE WORKS INTERNALLY                                                 │
 * ├─────────────────────────────────────────────────────────────────────────────┤
 * │                                                                             │
 * │   Array.prototype.myReduce = function(callback, initialValue) {             │
 * │     var accumulator = initialValue;                                         │
 * │     var startIndex = 0;                                                     │
 * │                                                                             │
 * │     // If no initial value, use first element                               │
 * │     if (arguments.length < 2) {                                             │
 * │       accumulator = this[0];                                                │
 * │       startIndex = 1;                                                       │
 * │     }                                                                       │
 * │                                                                             │
 * │     for (var i = startIndex; i < this.length; i++) {                        │
 * │       accumulator = callback(accumulator, this[i], i, this);                │
 * │     }                                                                       │
 * │                                                                             │
 * │     return accumulator;                                                     │
 * │   };                                                                        │
 * │                                                                             │
 * └─────────────────────────────────────────────────────────────────────────────┘
 *
 *
 * ┌─────────────────────────────────────────────────────────────────────────────┐
 * │ REDUCE CAN DO ANYTHING                                                      │
 * ├─────────────────────────────────────────────────────────────────────────────┤
 * │                                                                             │
 * │   // Implement map with reduce                                              │
 * │   function map(arr, fn) {                                                   │
 * │     return arr.reduce((acc, curr, i) => {                                   │
 * │       acc.push(fn(curr, i));                                                │
 * │       return acc;                                                           │
 * │     }, []);                                                                 │
 * │   }                                                                         │
 * │                                                                             │
 * │   // Implement filter with reduce                                           │
 * │   function filter(arr, predicate) {                                         │
 * │     return arr.reduce((acc, curr) => {                                      │
 * │       if (predicate(curr)) acc.push(curr);                                  │
 * │       return acc;                                                           │
 * │     }, []);                                                                 │
 * │   }                                                                         │
 * │                                                                             │
 * │   // Group by property                                                      │
 * │   users.reduce((groups, user) => {                                          │
 * │     var key = user.department;                                              │
 * │     groups[key] = groups[key] || [];                                        │
 * │     groups[key].push(user);                                                 │
 * │     return groups;                                                          │
 * │   }, {});                                                                   │
 * │                                                                             │
 * └─────────────────────────────────────────────────────────────────────────────┘
 *
 *
 * ┌─────────────────────────────────────────────────────────────────────────────┐
 * │ COMMON INTERVIEW GOTCHA                                                     │
 * ├─────────────────────────────────────────────────────────────────────────────┤
 * │                                                                             │
 * │   // Without initial value on empty array                                   │
 * │   [].reduce((a, b) => a + b);                                               │
 * │   // TypeError: Reduce of empty array with no initial value                 │
 * │                                                                             │
 * │   // Always provide initial value to be safe                                │
 * │   [].reduce((a, b) => a + b, 0);  // 0 (no error)                           │
 * │                                                                             │
 * │   // Without initial value, first element is used                           │
 * │   [5].reduce((a, b) => a + b);    // 5 (callback never called!)             │
 * │   [5].reduce((a, b) => a + b, 0); // 5 (callback called once)               │
 * │                                                                             │
 * └─────────────────────────────────────────────────────────────────────────────┘
 *
 *
 * ┌─────────────────────────────────────────────────────────────────────────────┐
 * │ INTERVIEW ANSWER                                                            │
 * ├─────────────────────────────────────────────────────────────────────────────┤
 * │                                                                             │
 * │ "Array.reduce() is the most powerful array method. It iterates through      │
 * │  an array, maintaining an accumulator that carries forward between          │
 * │  iterations.                                                                │
 * │                                                                             │
 * │  The callback receives (accumulator, currentValue, index, array).           │
 * │  Whatever you return becomes the accumulator for the next iteration.        │
 * │                                                                             │
 * │  Common uses:                                                               │
 * │  - Sum/product of numbers                                                   │
 * │  - Flatten nested arrays                                                    │
 * │  - Count occurrences                                                        │
 * │  - Group by property                                                        │
 * │  - Implement map and filter                                                 │
 * │                                                                             │
 * │  Always provide an initial value to avoid errors on empty arrays            │
 * │  and to make the code more predictable."                                    │
 * │                                                                             │
 * └─────────────────────────────────────────────────────────────────────────────┘
 *
 *
 * RUN: node docs/05-higher-order-functions/03-reduce-internals.js
 */
