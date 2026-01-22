/**
 * CHALLENGE 04: Promise.resolve() and Promise.reject()
 *
 * ╔════════════════════════════════════════════════════════════════════════════╗
 * ║ THE GOLDEN RULE                                                            ║
 * ╠════════════════════════════════════════════════════════════════════════════╣
 * ║                                                                            ║
 * ║ Promise.resolve(value) - Creates a resolved promise                        ║
 * ║ Promise.reject(reason) - Creates a rejected promise                        ║
 * ║                                                                            ║
 * ║ Special: If value is already a promise, resolve returns it unchanged       ║
 * ║ Special: If value is thenable, its then() is called                        ║
 * ║                                                                            ║
 * ╚════════════════════════════════════════════════════════════════════════════╝
 */

// Promise.resolve - wraps value in resolved promise
var resolved = Promise.resolve(42);
resolved.then(v => console.log('A:', v));

// Promise.resolve with thenable
var thenable = {
  then(resolve) {
    resolve('from thenable');
  }
};
Promise.resolve(thenable).then(v => console.log('B:', v));

// Promise.resolve with another promise
var original = new Promise(resolve => setTimeout(() => resolve('original'), 10));
var wrapped = Promise.resolve(original);
console.log('C:', original === wrapped);

// Promise.reject - wraps in rejected promise
var rejected = Promise.reject(new Error('oops'));
rejected.catch(e => console.log('D:', e.message));

// Common pattern: Return immediately or create promise
function getData(useCache) {
  if (useCache) {
    return Promise.resolve({ cached: true });
  }
  return new Promise(resolve => {
    setTimeout(() => resolve({ cached: false }), 10);
  });
}

getData(true).then(data => console.log('E:', data.cached));

/**
 * OUTPUT:
 *   C: true
 *   A: 42
 *   B: from thenable
 *   D: oops
 *   E: true
 *
 *
 * ╔════════════════════════════════════════════════════════════════════════════╗
 * ║ PROMISE.RESOLVE BEHAVIOR                                                   ║
 * ╠════════════════════════════════════════════════════════════════════════════╣
 * ║                                                                            ║
 * ║   Promise.resolve(42)           → Promise fulfilled with 42               ║
 * ║   Promise.resolve(promise)      → Returns same promise (not wrapped)       ║
 * ║   Promise.resolve(thenable)     → Calls thenable.then()                    ║
 * ║                                                                            ║
 * ║   Thenable: Any object with a then() method                                ║
 * ║                                                                            ║
 * ╚════════════════════════════════════════════════════════════════════════════╝
 *
 *
 * ┌─────────────────────────────────────────────────────────────────────────────┐
 * │ INTERVIEW ANSWER                                                            │
 * ├─────────────────────────────────────────────────────────────────────────────┤
 * │                                                                             │
 * │ "Promise.resolve wraps a value in a resolved promise. If the value is      │
 * │  already a promise, it returns that promise unchanged.                     │
 * │                                                                             │
 * │  Common use: Unified async interface - whether you have cached data        │
 * │  (sync) or need to fetch (async), always return a promise."                │
 * │                                                                             │
 * └─────────────────────────────────────────────────────────────────────────────┘
 *
 *
 * RUN: node docs/10-promise-methods/04-promise-resolve-reject.js
 */
