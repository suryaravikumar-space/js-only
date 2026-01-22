/**
 * CHALLENGE 00: Promise.all() - Wait for All
 *
 * ╔════════════════════════════════════════════════════════════════════════════╗
 * ║ THE GOLDEN RULE                                                            ║
 * ╠════════════════════════════════════════════════════════════════════════════╣
 * ║                                                                            ║
 * ║ Promise.all() waits for ALL promises to fulfill, then returns an array    ║
 * ║ of results IN THE SAME ORDER as the input array (not completion order).   ║
 * ║                                                                            ║
 * ║   • If ANY promise rejects, Promise.all() immediately rejects             ║
 * ║   • Results maintain input array order, regardless of resolution time     ║
 * ║   • All promises run concurrently (not sequentially)                      ║
 * ║                                                                            ║
 * ╚════════════════════════════════════════════════════════════════════════════╝
 */

console.log('A');

var p1 = new Promise(function(resolve) {
  setTimeout(function() {
    console.log('B');
    resolve('first');
  }, 100);
});

var p2 = new Promise(function(resolve) {
  setTimeout(function() {
    console.log('C');
    resolve('second');
  }, 50);
});

var p3 = Promise.resolve('third');

Promise.all([p1, p2, p3]).then(function(results) {
  console.log('D:', results);
});

console.log('E');

/**
 * OUTPUT:
 *   A
 *   E
 *   C
 *   B
 *   D: [ 'first', 'second', 'third' ]
 *
 *
 * ╔════════════════════════════════════════════════════════════════════════════╗
 * ║ STEP-BY-STEP BREAKDOWN                                                     ║
 * ╠════════════════════════════════════════════════════════════════════════════╣
 * ║                                                                            ║
 * ║ 1. console.log('A')                                                        ║
 * ║ ───────────────────                                                        ║
 * ║    • Synchronous - executes immediately                                    ║
 * ║    • Output: A                                                             ║
 * ║                                                                            ║
 * ║                                                                            ║
 * ║ 2. Creating p1, p2, p3                                                     ║
 * ║ ──────────────────────                                                     ║
 * ║    • p1: setTimeout scheduled for 100ms                                    ║
 * ║    • p2: setTimeout scheduled for 50ms                                     ║
 * ║    • p3: Already resolved (Promise.resolve is sync)                        ║
 * ║                                                                            ║
 * ║                                                                            ║
 * ║ 3. Promise.all([p1, p2, p3])                                               ║
 * ║ ────────────────────────────                                               ║
 * ║    • Starts waiting for all three promises                                 ║
 * ║    • .then callback queued when ALL resolve                                ║
 * ║                                                                            ║
 * ║                                                                            ║
 * ║ 4. console.log('E')                                                        ║
 * ║ ───────────────────                                                        ║
 * ║    • Synchronous - executes immediately                                    ║
 * ║    • Output: E                                                             ║
 * ║                                                                            ║
 * ║                                                                            ║
 * ║ 5. After 50ms: p2's setTimeout fires                                       ║
 * ║ ────────────────────────────────────                                       ║
 * ║    • Output: C                                                             ║
 * ║    • p2 resolves with 'second'                                             ║
 * ║                                                                            ║
 * ║                                                                            ║
 * ║ 6. After 100ms: p1's setTimeout fires                                      ║
 * ║ ─────────────────────────────────────                                      ║
 * ║    • Output: B                                                             ║
 * ║    • p1 resolves with 'first'                                              ║
 * ║    • ALL promises now resolved!                                            ║
 * ║                                                                            ║
 * ║                                                                            ║
 * ║ 7. Promise.all .then callback runs                                         ║
 * ║ ──────────────────────────────────                                         ║
 * ║    • Results array maintains INPUT order: ['first', 'second', 'third']    ║
 * ║    • NOT completion order (would be ['third', 'second', 'first'])         ║
 * ║    • Output: D: [ 'first', 'second', 'third' ]                            ║
 * ║                                                                            ║
 * ╚════════════════════════════════════════════════════════════════════════════╝
 *
 *
 * ┌─────────────────────────────────────────────────────────────────────────────┐
 * │ VISUAL: Promise.all Timing                                                  │
 * ├─────────────────────────────────────────────────────────────────────────────┤
 * │                                                                             │
 * │   Time:    0ms      50ms     100ms                                          │
 * │            │         │         │                                            │
 * │   p1: ─────┼─────────┼─────────●──> 'first'                                │
 * │            │         │         │                                            │
 * │   p2: ─────┼─────────●─────────┼──> 'second'                               │
 * │            │         │         │                                            │
 * │   p3: ────●┼─────────┼─────────┼──> 'third'                                │
 * │            │         │         │                                            │
 * │   all: ────┼─────────┼─────────●──> ['first', 'second', 'third']           │
 * │            │         │         │                                            │
 * │            ▲         ▲         ▲                                            │
 * │         A, E        C         B, D                                          │
 * │                                                                             │
 * │   Promise.all waits for the SLOWEST promise (100ms)                         │
 * │   Results maintain INPUT array order, not completion order                  │
 * │                                                                             │
 * └─────────────────────────────────────────────────────────────────────────────┘
 *
 *
 * ┌─────────────────────────────────────────────────────────────────────────────┐
 * │ PROMISE.ALL WITH REJECTION                                                  │
 * ├─────────────────────────────────────────────────────────────────────────────┤
 * │                                                                             │
 * │   var p1 = Promise.resolve(1);                                              │
 * │   var p2 = Promise.reject('error');                                         │
 * │   var p3 = Promise.resolve(3);                                              │
 * │                                                                             │
 * │   Promise.all([p1, p2, p3])                                                 │
 * │     .then(results => console.log(results))     // never runs               │
 * │     .catch(err => console.log('Caught:', err)); // 'Caught: error'         │
 * │                                                                             │
 * │   FAIL-FAST: If ANY promise rejects, Promise.all immediately rejects       │
 * │   with that error. Other promises continue running but results ignored.    │
 * │                                                                             │
 * └─────────────────────────────────────────────────────────────────────────────┘
 *
 *
 * ┌─────────────────────────────────────────────────────────────────────────────┐
 * │ INTERVIEW ANSWER                                                            │
 * ├─────────────────────────────────────────────────────────────────────────────┤
 * │                                                                             │
 * │ "Promise.all() takes an iterable of promises and returns a single promise  │
 * │  that fulfills when ALL input promises fulfill, or rejects when ANY        │
 * │  promise rejects (fail-fast behavior).                                     │
 * │                                                                             │
 * │  Key characteristics:                                                       │
 * │  1. Concurrent execution - all promises run in parallel                    │
 * │  2. Order preserved - results array matches input array order              │
 * │  3. Fail-fast - rejects immediately on first rejection                     │
 * │  4. Total time = slowest promise (not sum of all)                          │
 * │                                                                             │
 * │  Use cases:                                                                 │
 * │  - Fetching multiple independent API endpoints                             │
 * │  - Loading multiple resources before rendering                             │
 * │  - Running parallel database queries                                       │
 * │                                                                             │
 * │  When NOT to use:                                                           │
 * │  - When you need all results even if some fail (use allSettled)            │
 * │  - When promises must run sequentially"                                    │
 * │                                                                             │
 * └─────────────────────────────────────────────────────────────────────────────┘
 *
 *
 * RUN: node docs/06-promise-methods/00-promise-all.js
 */
