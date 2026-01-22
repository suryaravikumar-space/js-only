/**
 * CHALLENGE 05: Promise.prototype.finally()
 *
 * ╔════════════════════════════════════════════════════════════════════════════╗
 * ║ THE GOLDEN RULE                                                            ║
 * ╠════════════════════════════════════════════════════════════════════════════╣
 * ║                                                                            ║
 * ║ finally() runs regardless of resolve/reject                                ║
 * ║                                                                            ║
 * ║ - Does NOT receive the value                                               ║
 * ║ - Return value is ignored (unless it throws)                               ║
 * ║ - Passes through the original value/error                                  ║
 * ║                                                                            ║
 * ╚════════════════════════════════════════════════════════════════════════════╝
 */

// Finally after resolve
Promise.resolve('success')
  .then(v => { console.log('A:', v); return v; })
  .finally(() => console.log('B:', 'cleanup'))
  .then(v => console.log('C:', v));

// Finally after reject
Promise.reject(new Error('failed'))
  .catch(e => { console.log('D:', e.message); return 'recovered'; })
  .finally(() => console.log('E:', 'cleanup'))
  .then(v => console.log('F:', v));

// Finally doesn't receive value
Promise.resolve(42)
  .finally(value => {
    console.log('G:', value);  // undefined!
    return 100;  // Ignored unless it throws
  })
  .then(v => console.log('H:', v));  // Still 42

/**
 * OUTPUT:
 *   A: success
 *   B: cleanup
 *   C: success
 *   D: failed
 *   E: cleanup
 *   F: recovered
 *   G: undefined
 *   H: 42
 *
 *
 * ╔════════════════════════════════════════════════════════════════════════════╗
 * ║ FINALLY BEHAVIOR                                                           ║
 * ╠════════════════════════════════════════════════════════════════════════════╣
 * ║                                                                            ║
 * ║   .finally(fn)                                                             ║
 * ║     - fn receives NO arguments                                             ║
 * ║     - fn's return value is IGNORED                                         ║
 * ║     - Original value/error passes through                                  ║
 * ║     - If fn throws, that error propagates                                  ║
 * ║                                                                            ║
 * ║   Like try/catch/finally:                                                  ║
 * ║     try { return 42; }                                                     ║
 * ║     finally { cleanup(); }  // 42 still returned                           ║
 * ║                                                                            ║
 * ╚════════════════════════════════════════════════════════════════════════════╝
 *
 *
 * ┌─────────────────────────────────────────────────────────────────────────────┐
 * │ INTERVIEW ANSWER                                                            │
 * ├─────────────────────────────────────────────────────────────────────────────┤
 * │                                                                             │
 * │ "finally() runs cleanup code regardless of promise outcome. It doesn't     │
 * │  receive the value and can't modify it (unless it throws).                 │
 * │                                                                             │
 * │  Use cases: Hiding loading spinners, closing connections, cleanup.         │
 * │  The original value/error passes through to the next handler."             │
 * │                                                                             │
 * └─────────────────────────────────────────────────────────────────────────────┘
 *
 *
 * RUN: node docs/10-promise-methods/05-promise-finally.js
 */
