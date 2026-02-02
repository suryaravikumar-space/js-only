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
const safeOperation = (callback) => {
  setTimeout(() => {
    const error = null;
    const result = 42;
    callback(error, result);
  }, 10);
};

safeOperation((err, result) => {
  if (err) {
    console.log('A:', `Error: ${err.message}`);
    return;  // Early return on error
  }
  console.log('A:', result);
});

// Best Practice 2: Don't nest - use named functions
const step1 = (callback) => {
  setTimeout(() => callback(null, 1), 10);
};

const step2 = (prev, callback) => {
  setTimeout(() => callback(null, prev + 1), 10);
};

const step3 = (prev, callback) => {
  setTimeout(() => callback(null, prev + 1), 10);
};

// Named function handlers instead of nesting
const handleStep1 = (err, result) => {
  if (err) return console.log('B:', err);
  step2(result, handleStep2);
};

const handleStep2 = (err, result) => {
  if (err) return console.log('B:', err);
  step3(result, handleStep3);
};

const handleStep3 = (err, result) => {
  if (err) return console.log('B:', err);
  console.log('B:', result);
};

step1(handleStep1);

// Best Practice 3: Use async library patterns
const waterfall = (tasks, finalCallback) => {
  let index = 0;

  const next = (err, result) => {
    if (err) return finalCallback(err);
    if (index >= tasks.length) return finalCallback(null, result);

    const task = tasks[index++];
    task(result, next);
  };

  next(null, null);
};

waterfall([
  (_, cb) => cb(null, 10),
  (val, cb) => cb(null, val * 2),
  (val, cb) => cb(null, val + 5)
], (err, result) => {
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
