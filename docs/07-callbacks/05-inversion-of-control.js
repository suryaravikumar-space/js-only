/**
 * CHALLENGE 05: Inversion of Control / Trust Issues
 *
 * ╔════════════════════════════════════════════════════════════════════════════╗
 * ║ THE GOLDEN RULE                                                            ║
 * ╠════════════════════════════════════════════════════════════════════════════╣
 * ║                                                                            ║
 * ║ Inversion of Control: When you pass a callback to another function,        ║
 * ║ you're giving up control of when/how/if it gets called.                    ║
 * ║                                                                            ║
 * ║ Trust Issues with Callbacks:                                               ║
 * ║   1. Called too many times                                                 ║
 * ║   2. Called too few times (never called)                                   ║
 * ║   3. Called too early (sync vs async)                                      ║
 * ║   4. Called with wrong arguments                                           ║
 * ║   5. Errors swallowed or mishandled                                        ║
 * ║                                                                            ║
 * ╚════════════════════════════════════════════════════════════════════════════╝
 */

// Problem 1: Callback might be called multiple times
function buggyProcess(data, callback) {
  callback(data);
  callback(data);  // Oops! Called twice
}

var count = 0;
buggyProcess('test', function(data) {
  count++;
  console.log('A:', 'Called ' + count + ' time(s)');
});

// Problem 2: Callback might never be called
function unreliableAPI(callback) {
  if (Math.random() > 0.5) {
    callback('Success');
  }
  // Callback might never execute!
}

// Problem 3: Callback called synchronously when expected async
function inconsistentAPI(cached, callback) {
  if (cached) {
    callback('From cache');  // Sync!
  } else {
    setTimeout(function() {
      callback('From server');  // Async!
    }, 10);
  }
}

console.log('B:', 'Before');
inconsistentAPI(true, function(result) {
  console.log('B:', result);
});
console.log('B:', 'After');

// Problem 4: Error handling - callback might throw
function riskyOperation(callback) {
  try {
    callback(null, 'data');
  } catch (e) {
    console.log('C:', 'Error caught: ' + e.message);
  }
}

riskyOperation(function(err, data) {
  throw new Error('Callback error');
});

/**
 * OUTPUT:
 *   A: Called 1 time(s)
 *   A: Called 2 time(s)
 *   B: Before
 *   B: From cache
 *   B: After
 *   C: Error caught: Callback error
 *
 *
 * ╔════════════════════════════════════════════════════════════════════════════╗
 * ║ WHY PROMISES SOLVE THESE ISSUES                                            ║
 * ╠════════════════════════════════════════════════════════════════════════════╣
 * ║                                                                            ║
 * ║ 1. Called only once: Promise resolves/rejects exactly once                 ║
 * ║                                                                            ║
 * ║ 2. Guaranteed callback: .then() always called if resolved                  ║
 * ║                                                                            ║
 * ║ 3. Always async: .then() handlers always run async (microtask)             ║
 * ║                                                                            ║
 * ║ 4. Type safety: resolve/reject have clear contracts                        ║
 * ║                                                                            ║
 * ║ 5. Error propagation: Errors bubble up the chain                           ║
 * ║                                                                            ║
 * ╚════════════════════════════════════════════════════════════════════════════╝
 *
 *
 * ┌─────────────────────────────────────────────────────────────────────────────┐
 * │ INTERVIEW ANSWER                                                            │
 * ├─────────────────────────────────────────────────────────────────────────────┤
 * │                                                                             │
 * │ "Inversion of Control with callbacks means you give control to             │
 * │  third-party code over when your callback executes. This creates           │
 * │  trust issues because the callback might be called multiple times,         │
 * │  never called, called synchronously when expecting async, or               │
 * │  errors might be swallowed.                                                │
 * │                                                                             │
 * │  Promises solve this by:                                                    │
 * │  - Resolving/rejecting exactly once                                         │
 * │  - Always being async (microtask queue)                                     │
 * │  - Having built-in error propagation"                                       │
 * │                                                                             │
 * └─────────────────────────────────────────────────────────────────────────────┘
 *
 *
 * RUN: node docs/07-callbacks/05-inversion-of-control.js
 */
