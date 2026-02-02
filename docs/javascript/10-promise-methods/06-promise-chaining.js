/**
 * CHALLENGE 06: Promise Chaining Patterns
 *
 * ╔════════════════════════════════════════════════════════════════════════════╗
 * ║ THE GOLDEN RULE                                                            ║
 * ╠════════════════════════════════════════════════════════════════════════════╣
 * ║                                                                            ║
 * ║ Each .then() returns a NEW promise:                                        ║
 * ║   - Return value → next .then() receives it                                ║
 * ║   - Return promise → next .then() waits for it                             ║
 * ║   - Throw error → jumps to next .catch()                                   ║
 * ║                                                                            ║
 * ╚════════════════════════════════════════════════════════════════════════════╝
 */

// Chain 1: Value transformation
Promise.resolve(1)
  .then(v => v + 1)
  .then(v => v * 2)
  .then(v => v + 10)
  .then(v => console.log('A:', v));  // ((1+1)*2)+10

// Chain 2: Returning promises
function double(n) {
  return new Promise(resolve => {
    setTimeout(() => resolve(n * 2), 10);
  });
}

Promise.resolve(5)
  .then(double)
  .then(double)
  .then(v => console.log('B:', v));

// Chain 3: Error propagation
Promise.resolve(1)
  .then(v => { throw new Error('oops'); })
  .then(v => console.log('C1:', v))  // Skipped
  .then(v => console.log('C2:', v))  // Skipped
  .catch(e => console.log('C:', e.message));

// Chain 4: Recovery from error
Promise.reject(new Error('initial error'))
  .catch(e => 'recovered')
  .then(v => console.log('D:', v));

/**
 * OUTPUT:
 *   A: 14
 *   C: oops
 *   D: recovered
 *   B: 20
 *
 *
 * ╔════════════════════════════════════════════════════════════════════════════╗
 * ║ CHAINING RULES                                                             ║
 * ╠════════════════════════════════════════════════════════════════════════════╣
 * ║                                                                            ║
 * ║   .then(value => ...)                                                      ║
 * ║     return x        → next gets x                                          ║
 * ║     return promise  → next waits and gets resolved value                   ║
 * ║     throw error     → skips to catch                                       ║
 * ║     return nothing  → next gets undefined                                  ║
 * ║                                                                            ║
 * ║   .catch(error => ...)                                                     ║
 * ║     return x        → chain continues (recovered)                          ║
 * ║     throw error     → next catch handles it                                ║
 * ║                                                                            ║
 * ╚════════════════════════════════════════════════════════════════════════════╝
 *
 *
 * ┌─────────────────────────────────────────────────────────────────────────────┐
 * │ INTERVIEW ANSWER                                                            │
 * ├─────────────────────────────────────────────────────────────────────────────┤
 * │                                                                             │
 * │ "Promise chaining works because each .then() returns a new promise.        │
 * │  Returning a value resolves the next promise; returning a promise makes    │
 * │  the chain wait. Throwing skips to the next catch.                         │
 * │                                                                             │
 * │  You can recover from errors in catch by returning a value - the chain     │
 * │  continues as if nothing went wrong."                                      │
 * │                                                                             │
 * └─────────────────────────────────────────────────────────────────────────────┘
 *
 *
 * RUN: node docs/10-promise-methods/06-promise-chaining.js
 */
