/**
 * CHALLENGE 03: Promise.any()
 *
 * ╔════════════════════════════════════════════════════════════════════════════╗
 * ║ THE GOLDEN RULE                                                            ║
 * ╠════════════════════════════════════════════════════════════════════════════╣
 * ║                                                                            ║
 * ║ Promise.any([promises]) - First to FULFILL wins                            ║
 * ║                                                                            ║
 * ║ - Ignores rejections until all reject                                      ║
 * ║ - If ALL reject, throws AggregateError with all errors                     ║
 * ║                                                                            ║
 * ╚════════════════════════════════════════════════════════════════════════════╝
 */

// Any 1: First success wins
var p1 = new Promise((_, reject) => setTimeout(() => reject('err1'), 50));
var p2 = new Promise(resolve => setTimeout(() => resolve('success'), 100));
var p3 = new Promise((_, reject) => setTimeout(() => reject('err2'), 150));

Promise.any([p1, p2, p3]).then(result => {
  console.log('A:', result);
});

// Any 2: All reject
var allFail = [
  Promise.reject('fail1'),
  Promise.reject('fail2'),
  Promise.reject('fail3')
];

Promise.any(allFail).catch(err => {
  console.log('B:', err.constructor.name);
  console.log('C:', err.errors.length);
});

/**
 * OUTPUT:
 *   A: success
 *   B: AggregateError
 *   C: 3
 *
 *
 * ╔════════════════════════════════════════════════════════════════════════════╗
 * ║ PROMISE METHOD COMPARISON                                                  ║
 * ╠════════════════════════════════════════════════════════════════════════════╣
 * ║                                                                            ║
 * ║   ┌─────────────┬─────────────────────┬─────────────────────────────────┐  ║
 * ║   │ Method      │ Resolves when       │ Rejects when                    │  ║
 * ║   ├─────────────┼─────────────────────┼─────────────────────────────────┤  ║
 * ║   │ all         │ ALL resolve         │ ANY rejects                     │  ║
 * ║   │ allSettled  │ ALL settle          │ Never rejects                   │  ║
 * ║   │ race        │ FIRST settles       │ FIRST rejects                   │  ║
 * ║   │ any         │ FIRST resolves      │ ALL reject (AggregateError)     │  ║
 * ║   └─────────────┴─────────────────────┴─────────────────────────────────┘  ║
 * ║                                                                            ║
 * ╚════════════════════════════════════════════════════════════════════════════╝
 *
 *
 * ┌─────────────────────────────────────────────────────────────────────────────┐
 * │ INTERVIEW ANSWER                                                            │
 * ├─────────────────────────────────────────────────────────────────────────────┤
 * │                                                                             │
 * │ "Promise.any resolves with the first fulfilled promise, ignoring           │
 * │  rejections. Only if ALL promises reject does it throw AggregateError.     │
 * │                                                                             │
 * │  Use case: Fetching from multiple mirrors - first successful response wins,│
 * │  individual failures are ignored as long as one succeeds."                 │
 * │                                                                             │
 * └─────────────────────────────────────────────────────────────────────────────┘
 *
 *
 * RUN: node docs/10-promise-methods/03-promise-any.js
 */
