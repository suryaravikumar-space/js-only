/**
 * CHALLENGE 10: Ultimate Callback Challenge
 *
 * ╔════════════════════════════════════════════════════════════════════════════╗
 * ║ THE GOLDEN RULE                                                            ║
 * ╠════════════════════════════════════════════════════════════════════════════╣
 * ║                                                                            ║
 * ║ Master callback timing:                                                    ║
 * ║                                                                            ║
 * ║ 1. Sync callbacks (forEach) block and run immediately                      ║
 * ║ 2. Async callbacks (setTimeout) run after sync code completes              ║
 * ║ 3. Multiple timeouts execute based on their delay values                   ║
 * ║ 4. Parallel execution: all start at once, finish in different order        ║
 * ║                                                                            ║
 * ╚════════════════════════════════════════════════════════════════════════════╝
 */

console.log('A:', 'Script start');

// Challenge 1: Mixed sync and async callbacks
var arr = [1, 2, 3];
arr.forEach(function(n) {
  console.log('B:', n);
});

setTimeout(function() {
  console.log('C:', 'Timeout 1');
}, 0);

// Challenge 2: Callback execution order
function asyncTask(name, delay, callback) {
  setTimeout(function() {
    callback(name);
  }, delay);
}

asyncTask('First', 30, function(name) {
  console.log('D:', name);
});

asyncTask('Second', 10, function(name) {
  console.log('E:', name);
});

// Challenge 3: Nested callbacks with different timings
setTimeout(function() {
  console.log('F:', 'Outer timeout');
  setTimeout(function() {
    console.log('F:', 'Inner timeout');
  }, 0);
}, 20);

// Challenge 4: Implement parallel execution
function parallel(tasks, finalCallback) {
  var results = [];
  var completed = 0;

  tasks.forEach(function(task, index) {
    task(function(result) {
      results[index] = result;
      completed++;
      if (completed === tasks.length) {
        finalCallback(results);
      }
    });
  });
}

parallel([
  function(cb) { setTimeout(function() { cb('a'); }, 15); },
  function(cb) { setTimeout(function() { cb('b'); }, 5); },
  function(cb) { setTimeout(function() { cb('c'); }, 10); }
], function(results) {
  console.log('G:', results);  // Order preserved despite timing
});

console.log('H:', 'Script end');

/**
 * OUTPUT:
 *   A: Script start
 *   B: 1
 *   B: 2
 *   B: 3
 *   H: Script end
 *   C: Timeout 1
 *   E: Second
 *   G: [ 'a', 'b', 'c' ]
 *   F: Outer timeout
 *   D: First
 *   F: Inner timeout
 *
 *
 * ╔════════════════════════════════════════════════════════════════════════════╗
 * ║ TIMING BREAKDOWN                                                           ║
 * ╠════════════════════════════════════════════════════════════════════════════╣
 * ║                                                                            ║
 * ║   TIME    EVENT                                                            ║
 * ║   ────    ─────                                                            ║
 * ║   0ms     A, B(1,2,3), H - all sync code runs                              ║
 * ║   ~4ms    C - setTimeout(0) has minimum delay                              ║
 * ║   5ms     parallel task 'b' completes                                      ║
 * ║   10ms    E(Second), parallel task 'c' completes                           ║
 * ║   15ms    parallel task 'a' completes → G (all done)                       ║
 * ║   20ms    F(Outer) runs, schedules inner setTimeout                        ║
 * ║   30ms    D(First) runs                                                    ║
 * ║   ~24ms   F(Inner) runs (20ms + ~4ms min delay)                            ║
 * ║                                                                            ║
 * ╚════════════════════════════════════════════════════════════════════════════╝
 *
 *
 * ┌─────────────────────────────────────────────────────────────────────────────┐
 * │ PARALLEL EXECUTION PATTERN                                                  │
 * ├─────────────────────────────────────────────────────────────────────────────┤
 * │                                                                             │
 * │   function parallel(tasks, finalCallback) {                                 │
 * │     var results = [];                                                       │
 * │     var completed = 0;                                                      │
 * │                                                                             │
 * │     tasks.forEach(function(task, index) {                                   │
 * │       task(function(result) {                                               │
 * │         results[index] = result;  // Preserve order!                        │
 * │         completed++;                                                        │
 * │         if (completed === tasks.length) {                                   │
 * │           finalCallback(results);                                           │
 * │         }                                                                   │
 * │       });                                                                   │
 * │     });                                                                     │
 * │   }                                                                         │
 * │                                                                             │
 * │   Key insight: Results are stored at their original index,                  │
 * │   so order is preserved even though tasks finish in different order.        │
 * │                                                                             │
 * └─────────────────────────────────────────────────────────────────────────────┘
 *
 *
 * ┌─────────────────────────────────────────────────────────────────────────────┐
 * │ INTERVIEW ANSWER                                                            │
 * ├─────────────────────────────────────────────────────────────────────────────┤
 * │                                                                             │
 * │ "In this challenge:                                                         │
 * │                                                                             │
 * │  1. Sync code (A, B, H) runs first in order                                 │
 * │  2. setTimeout(0) runs after sync but has minimum ~4ms delay                │
 * │  3. Multiple async tasks execute based on their delay values                │
 * │  4. Parallel pattern: all tasks start immediately, results collected        │
 * │     in original order using index, finalCallback fires when all done        │
 * │  5. Nested setTimeout: inner timer starts when outer callback runs"         │
 * │                                                                             │
 * └─────────────────────────────────────────────────────────────────────────────┘
 *
 *
 * RUN: node docs/07-callbacks/10-ultimate-callback-challenge.js
 */
