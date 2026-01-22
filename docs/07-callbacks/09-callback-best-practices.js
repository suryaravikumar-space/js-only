/**
 * CHALLENGE 09: Callback Best Practices
 *
 * ╔════════════════════════════════════════════════════════════════════════════╗
 * ║ THE GOLDEN RULE                                                            ║
 * ╠════════════════════════════════════════════════════════════════════════════╣
 * ║                                                                            ║
 * ║ Best Practices for Callbacks:                                              ║
 * ║                                                                            ║
 * ║ 1. Always handle errors first (error-first pattern)                        ║
 * ║ 2. Use named functions instead of nesting                                  ║
 * ║ 3. Use control flow libraries (async.js patterns)                          ║
 * ║ 4. Early return on errors                                                  ║
 * ║ 5. Consider Promises/async-await for complex flows                         ║
 * ║                                                                            ║
 * ╚════════════════════════════════════════════════════════════════════════════╝
 */

// Best Practice 1: Always handle errors first
function safeOperation(callback) {
  setTimeout(function() {
    var error = null;
    var result = 42;
    // Always call callback with error first
    callback(error, result);
  }, 10);
}

safeOperation(function(err, result) {
  if (err) {
    console.log('A:', 'Error: ' + err.message);
    return;  // Early return on error
  }
  console.log('A:', result);
});

// Best Practice 2: Don't nest - use named functions
function step1(callback) {
  setTimeout(function() { callback(null, 1); }, 10);
}

function step2(prev, callback) {
  setTimeout(function() { callback(null, prev + 1); }, 10);
}

function step3(prev, callback) {
  setTimeout(function() { callback(null, prev + 1); }, 10);
}

// Named function handlers instead of nesting
function handleStep1(err, result) {
  if (err) return console.log('B:', err);
  step2(result, handleStep2);
}

function handleStep2(err, result) {
  if (err) return console.log('B:', err);
  step3(result, handleStep3);
}

function handleStep3(err, result) {
  if (err) return console.log('B:', err);
  console.log('B:', result);
}

step1(handleStep1);

// Best Practice 3: Use async library patterns
function waterfall(tasks, finalCallback) {
  var index = 0;

  function next(err, result) {
    if (err) return finalCallback(err);
    if (index >= tasks.length) return finalCallback(null, result);

    var task = tasks[index++];
    task(result, next);
  }

  next(null, null);
}

waterfall([
  function(_, cb) { cb(null, 10); },
  function(val, cb) { cb(null, val * 2); },
  function(val, cb) { cb(null, val + 5); }
], function(err, result) {
  console.log('C:', result);
});

console.log('D:', 'Sync runs first');

/**
 * OUTPUT:
 *   D: Sync runs first
 *   A: 42
 *   B: 3
 *   C: 25
 *
 *
 * ╔════════════════════════════════════════════════════════════════════════════╗
 * ║ ASYNC LIBRARY PATTERNS                                                     ║
 * ╠════════════════════════════════════════════════════════════════════════════╣
 * ║                                                                            ║
 * ║ WATERFALL: Tasks run in sequence, each passing result to next              ║
 * ║   waterfall([task1, task2, task3], finalCallback)                          ║
 * ║   task1 → result → task2 → result → task3 → finalCallback                  ║
 * ║                                                                            ║
 * ║ PARALLEL: Tasks run simultaneously, all results collected                  ║
 * ║   parallel([task1, task2, task3], finalCallback)                           ║
 * ║   task1 ──┐                                                                ║
 * ║   task2 ──┼──→ finalCallback(results)                                      ║
 * ║   task3 ──┘                                                                ║
 * ║                                                                            ║
 * ║ SERIES: Tasks run one at a time, results collected                         ║
 * ║   series([task1, task2, task3], finalCallback)                             ║
 * ║   task1 → task2 → task3 → finalCallback(results)                           ║
 * ║                                                                            ║
 * ╚════════════════════════════════════════════════════════════════════════════╝
 *
 *
 * ┌─────────────────────────────────────────────────────────────────────────────┐
 * │ INTERVIEW ANSWER                                                            │
 * ├─────────────────────────────────────────────────────────────────────────────┤
 * │                                                                             │
 * │ "Callback best practices:                                                   │
 * │                                                                             │
 * │  1. Error-first: Always check error before using result                     │
 * │  2. Early return: Return immediately on error                               │
 * │  3. Named functions: Extract nested callbacks into named functions          │
 * │  4. Control flow: Use waterfall/parallel patterns for complex flows         │
 * │  5. Modern alternative: Use Promises or async/await for cleaner code"       │
 * │                                                                             │
 * └─────────────────────────────────────────────────────────────────────────────┘
 *
 *
 * RUN: node docs/07-callbacks/09-callback-best-practices.js
 */
