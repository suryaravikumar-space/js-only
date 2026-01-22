/**
 * CHALLENGE 07: Promise Error Handling
 *
 * ╔════════════════════════════════════════════════════════════════════════════╗
 * ║ THE GOLDEN RULE                                                            ║
 * ╠════════════════════════════════════════════════════════════════════════════╣
 * ║                                                                            ║
 * ║ Promise error handling follows these rules:                                ║
 * ║                                                                            ║
 * ║ 1. Errors skip all .then() until a .catch() is found                       ║
 * ║ 2. .catch() can recover and continue the chain                             ║
 * ║ 3. .then(onFulfilled, onRejected) handles rejection locally                ║
 * ║ 4. Throwing in .catch() creates a new rejection                            ║
 * ║                                                                            ║
 * ╚════════════════════════════════════════════════════════════════════════════╝
 */

// Error handling 1: Single catch at end
Promise.resolve()
  .then(() => { throw new Error('error1'); })
  .then(() => console.log('A1:', 'skipped'))
  .then(() => console.log('A2:', 'skipped'))
  .catch(e => console.log('A:', e.message));

// Error handling 2: Early catch allows continuation
Promise.resolve()
  .then(() => { throw new Error('error2'); })
  .catch(e => { console.log('B:', e.message); return 'recovered'; })
  .then(v => console.log('C:', v));

// Error handling 3: Unhandled in then with 2 args
Promise.reject(new Error('error3'))
  .then(
    v => console.log('D1:', v),
    e => { console.log('D:', e.message); return 'from handler'; }
  )
  .then(v => console.log('E:', v));

// Error handling 4: Re-throwing
Promise.reject(new Error('original'))
  .catch(e => {
    console.log('F:', 'caught original');
    throw new Error('new error');
  })
  .catch(e => console.log('G:', e.message));

/**
 * OUTPUT:
 *   A: error1
 *   B: error2
 *   C: recovered
 *   D: error3
 *   E: from handler
 *   F: caught original
 *   G: new error
 *
 *
 * ╔════════════════════════════════════════════════════════════════════════════╗
 * ║ STEP-BY-STEP BREAKDOWN                                                     ║
 * ╠════════════════════════════════════════════════════════════════════════════╣
 * ║                                                                            ║
 * ║ A: Error skips all .then() until .catch()                                  ║
 * ║ ───────────────────────────────────────────                                ║
 * ║   throw Error('error1') → skips A1, A2 → caught at end                     ║
 * ║   A1 and A2 never execute                                                  ║
 * ║                                                                            ║
 * ║                                                                            ║
 * ║ B & C: .catch() recovers the chain                                         ║
 * ║ ─────────────────────────────────────                                      ║
 * ║   throw Error('error2') → caught by .catch()                               ║
 * ║   .catch() returns 'recovered' → chain continues!                          ║
 * ║   Next .then() receives 'recovered'                                        ║
 * ║                                                                            ║
 * ║                                                                            ║
 * ║ D & E: .then(success, error) handles locally                               ║
 * ║ ───────────────────────────────────────────────                            ║
 * ║   Promise.reject() → onRejected handler called                             ║
 * ║   Returns 'from handler' → chain continues                                 ║
 * ║   Next .then() receives the return value                                   ║
 * ║                                                                            ║
 * ║                                                                            ║
 * ║ F & G: Re-throwing creates new rejection                                   ║
 * ║ ──────────────────────────────────────────                                 ║
 * ║   First .catch() catches 'original'                                        ║
 * ║   throw new Error('new error') → new rejection                             ║
 * ║   Second .catch() catches 'new error'                                      ║
 * ║                                                                            ║
 * ╚════════════════════════════════════════════════════════════════════════════╝
 *
 *
 * ┌─────────────────────────────────────────────────────────────────────────────┐
 * │ ERROR HANDLING PATTERNS                                                     │
 * ├─────────────────────────────────────────────────────────────────────────────┤
 * │                                                                             │
 * │   // Pattern 1: Single catch at end (recommended)                           │
 * │   fetchData()                                                               │
 * │     .then(process)                                                          │
 * │     .then(display)                                                          │
 * │     .catch(handleError);  // Catches any error above                        │
 * │                                                                             │
 * │   // Pattern 2: Recover and continue                                        │
 * │   fetchData()                                                               │
 * │     .catch(() => fallbackData)  // Recover with default                     │
 * │     .then(process);             // Always runs                              │
 * │                                                                             │
 * │   // Pattern 3: Rethrow with context                                        │
 * │   fetchData()                                                               │
 * │     .catch(e => { throw new Error(`Fetch failed: ${e.message}`); });        │
 * │                                                                             │
 * └─────────────────────────────────────────────────────────────────────────────┘
 *
 *
 * RUN: node docs/10-promise-methods/07-promise-error-handling.js
 */
