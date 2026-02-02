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
 *
 *
 * ┌─────────────────────────────────────────────────────────────────────────────┐
 * │ SIMPLE EXPLANATION                                                         │
 * ├─────────────────────────────────────────────────────────────────────────────┤
 * │                                                                             │
 * │  "Synchronous" = happens RIGHT NOW, one after another, in order.           │
 * │                                                                             │
 * │  Think of a CHECKOUT LINE at a store:                                      │
 * │                                                                             │
 * │   Customer 1 → scan items → pay → done                                    │
 * │   Customer 2 → scan items → pay → done    (waits for Customer 1)          │
 * │   Customer 3 → scan items → pay → done    (waits for Customer 2)          │
 * │                                                                             │
 * │  Nobody skips ahead. Each one BLOCKS the line until they finish.           │
 * │                                                                             │
 * │  Same with [1,2,3].forEach(fn):                                            │
 * │   fn(1) → runs and finishes                                                │
 * │   fn(2) → runs and finishes    (waits for fn(1))                           │
 * │   fn(3) → runs and finishes    (waits for fn(2))                           │
 * │   THEN the next line of code runs.                                          │
 * │                                                                             │
 * │  "Blocking" just means: nothing else runs until I'm done.                 │
 * │                                                                             │
 * └─────────────────────────────────────────────────────────────────────────────┘
 */

// Array methods use synchronous callbacks
const numbers = [1, 2, 3, 4, 5];

// map - transform each element
const doubled = numbers.map((num) => num * 2);
console.log('A:', doubled);

// filter - keep elements that pass test
const evens = numbers.filter((num) => num % 2 === 0);
console.log('B:', evens);

// forEach - execute for each element
let sum = 0;
numbers.forEach((num) => {
  sum += num;
});
console.log('C:', sum);

// reduce - accumulate to single value
const product = numbers.reduce((acc, num) => acc * num, 1);
console.log('D:', product);

// Execution order proof - all synchronous
console.log('E:', 'Start');
[1, 2].forEach((n) => {
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
