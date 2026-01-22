/**
 * CHALLENGE 03: Error-First Callback Pattern (Node.js style)
 *
 * ╔════════════════════════════════════════════════════════════════════════════╗
 * ║ THE GOLDEN RULE                                                            ║
 * ╠════════════════════════════════════════════════════════════════════════════╣
 * ║                                                                            ║
 * ║ The error-first callback pattern: callback(error, result)                  ║
 * ║                                                                            ║
 * ║   - First argument is ALWAYS error (or null if success)                    ║
 * ║   - Second argument is the result (or null if error)                       ║
 * ║   - ALWAYS check for error before using result                             ║
 * ║                                                                            ║
 * ╚════════════════════════════════════════════════════════════════════════════╝
 */

// Error-first callback: callback(error, result)
function divide(a, b, callback) {
  if (b === 0) {
    callback(new Error('Cannot divide by zero'), null);
  } else {
    callback(null, a / b);
  }
}

// Success case
divide(10, 2, function(err, result) {
  if (err) {
    console.log('A:', err.message);
  } else {
    console.log('A:', result);
  }
});

// Error case
divide(10, 0, function(err, result) {
  if (err) {
    console.log('B:', err.message);
  } else {
    console.log('B:', result);
  }
});

// Simulating async file read
function readFile(filename, callback) {
  setTimeout(function() {
    if (filename === 'missing.txt') {
      callback(new Error('File not found'), null);
    } else {
      callback(null, 'File contents: Hello World');
    }
  }, 10);
}

readFile('data.txt', function(err, data) {
  console.log('C:', err ? err.message : data);
});

readFile('missing.txt', function(err, data) {
  console.log('D:', err ? err.message : data);
});

/**
 * OUTPUT:
 *   A: 5
 *   B: Cannot divide by zero
 *   C: File contents: Hello World
 *   D: File not found
 *
 *
 * ╔════════════════════════════════════════════════════════════════════════════╗
 * ║ ERROR-FIRST PATTERN ANATOMY                                                ║
 * ╠════════════════════════════════════════════════════════════════════════════╣
 * ║                                                                            ║
 * ║   function asyncOperation(params, callback) {                              ║
 * ║     // Do async work...                                                    ║
 * ║     if (error) {                                                           ║
 * ║       callback(new Error('message'), null);  // Error case                 ║
 * ║     } else {                                                               ║
 * ║       callback(null, result);                // Success case               ║
 * ║     }                                                                      ║
 * ║   }                                                                        ║
 * ║                                                                            ║
 * ║   // Usage:                                                                ║
 * ║   asyncOperation(params, function(err, result) {                           ║
 * ║     if (err) {                                                             ║
 * ║       // Handle error                                                      ║
 * ║       return;                                                              ║
 * ║     }                                                                      ║
 * ║     // Use result                                                          ║
 * ║   });                                                                      ║
 * ║                                                                            ║
 * ╚════════════════════════════════════════════════════════════════════════════╝
 *
 *
 * ┌─────────────────────────────────────────────────────────────────────────────┐
 * │ INTERVIEW ANSWER                                                            │
 * ├─────────────────────────────────────────────────────────────────────────────┤
 * │                                                                             │
 * │ "The error-first callback pattern is a Node.js convention where the        │
 * │  callback's first parameter is always reserved for an error object.        │
 * │                                                                             │
 * │  Why error first?                                                           │
 * │  - Forces developers to handle errors                                       │
 * │  - Consistent API across all async functions                                │
 * │  - Can't accidentally ignore errors and use undefined result                │
 * │                                                                             │
 * │  Modern alternatives: Promises, async/await with try/catch"                 │
 * │                                                                             │
 * └─────────────────────────────────────────────────────────────────────────────┘
 *
 *
 * RUN: node docs/05-callbacks/03-callback-pattern.js
 */
