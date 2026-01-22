/**
 * CHALLENGE 01: Synchronous Callbacks
 *
 * ╔════════════════════════════════════════════════════════════════════════════╗
 * ║ THE GOLDEN RULE                                                            ║
 * ╠════════════════════════════════════════════════════════════════════════════╣
 * ║                                                                            ║
 * ║ Synchronous callbacks execute IMMEDIATELY, blocking further execution      ║
 * ║ until they complete. Array methods like map, filter, forEach use them.     ║
 * ║                                                                            ║
 * ║   [1,2,3].map(fn)  → fn called 3 times BEFORE map returns                  ║
 * ║                                                                            ║
 * ╚════════════════════════════════════════════════════════════════════════════╝
 */

// Array methods use synchronous callbacks
var numbers = [1, 2, 3, 4, 5];

// map - transform each element
var doubled = numbers.map(function(num) {
  return num * 2;
});
console.log('A:', doubled);

// filter - keep elements that pass test
var evens = numbers.filter(function(num) {
  return num % 2 === 0;
});
console.log('B:', evens);

// forEach - execute for each element
var sum = 0;
numbers.forEach(function(num) {
  sum += num;
});
console.log('C:', sum);

// reduce - accumulate to single value
var product = numbers.reduce(function(acc, num) {
  return acc * num;
}, 1);
console.log('D:', product);

// Execution order proof - all synchronous
console.log('E:', 'Start');
[1, 2].forEach(function(n) {
  console.log('E:', n);
});
console.log('E:', 'End');

/**
 * OUTPUT:
 *   A: [ 2, 4, 6, 8, 10 ]
 *   B: [ 2, 4 ]
 *   C: 15
 *   D: 120
 *   E: Start
 *   E: 1
 *   E: 2
 *   E: End
 *
 *
 * ╔════════════════════════════════════════════════════════════════════════════╗
 * ║ STEP-BY-STEP BREAKDOWN                                                     ║
 * ╠════════════════════════════════════════════════════════════════════════════╣
 * ║                                                                            ║
 * ║ E: Proves synchronous execution                                            ║
 * ║ ─────────────────────────────────                                          ║
 * ║   1. "Start" prints                                                        ║
 * ║   2. forEach BLOCKS and runs callback for each element                     ║
 * ║   3. "1" prints (callback for first element)                               ║
 * ║   4. "2" prints (callback for second element)                              ║
 * ║   5. forEach returns, THEN "End" prints                                    ║
 * ║                                                                            ║
 * ║   If forEach were async, order would be: Start, End, 1, 2                  ║
 * ║   But it's sync, so order is: Start, 1, 2, End                             ║
 * ║                                                                            ║
 * ╚════════════════════════════════════════════════════════════════════════════╝
 *
 *
 * ┌─────────────────────────────────────────────────────────────────────────────┐
 * │ SYNC vs ASYNC CALLBACKS                                                     │
 * ├─────────────────────────────────────────────────────────────────────────────┤
 * │                                                                             │
 * │   SYNCHRONOUS:                    ASYNCHRONOUS:                             │
 * │   - Array.map()                   - setTimeout()                            │
 * │   - Array.filter()                - setInterval()                           │
 * │   - Array.forEach()               - fetch()                                 │
 * │   - Array.reduce()                - addEventListener()                      │
 * │   - Array.find()                  - fs.readFile()                           │
 * │   - Array.some()                  - Promise.then()                          │
 * │   - Array.every()                 - async/await                             │
 * │                                                                             │
 * └─────────────────────────────────────────────────────────────────────────────┘
 *
 *
 * RUN: node docs/05-callbacks/01-sync-callbacks.js
 */
