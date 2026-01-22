/**
 * CHALLENGE 07: Promise Chain
 *
 * ╔════════════════════════════════════════════════════════════════════════════╗
 * ║ THE GOLDEN RULE                                                            ║
 * ╠════════════════════════════════════════════════════════════════════════════╣
 * ║                                                                            ║
 * ║ In a Promise chain, each .then() waits for the previous to complete.       ║
 * ║                                                                            ║
 * ║   • Returning a value → next .then gets that value                         ║
 * ║   • Returning a Promise → next .then waits for it to resolve               ║
 * ║   • Each .then callback is a separate microtask                            ║
 * ║                                                                            ║
 * ╚════════════════════════════════════════════════════════════════════════════╝
 */

Promise.resolve(1)
  .then(function(x) {
    console.log('A:', x);
    return x + 1;
  })
  .then(function(x) {
    console.log('B:', x);
    return Promise.resolve(x + 1);
  })
  .then(function(x) {
    console.log('C:', x);
  });

console.log('D');

/**
 * OUTPUT:
 *   D
 *   A: 1
 *   B: 2
 *   C: 3
 *
 *
 * ╔════════════════════════════════════════════════════════════════════════════╗
 * ║ STEP-BY-STEP BREAKDOWN                                                     ║
 * ╠════════════════════════════════════════════════════════════════════════════╣
 * ║                                                                            ║
 * ║ 1. Promise chain is registered                                             ║
 * ║ ──────────────────────────────                                             ║
 * ║    • Promise.resolve(1) → resolved with value 1                            ║
 * ║    • First .then callback queued as microtask                              ║
 * ║                                                                            ║
 * ║                                                                            ║
 * ║ 2. console.log('D')                                                        ║
 * ║ ───────────────────                                                        ║
 * ║    • Synchronous - executes immediately                                    ║
 * ║    • Output: D                                                             ║
 * ║                                                                            ║
 * ║                                                                            ║
 * ║ 3. First .then executes (microtask)                                        ║
 * ║ ───────────────────────────────────                                        ║
 * ║    • x = 1                                                                 ║
 * ║    • console.log('A:', x) → Output: A: 1                                   ║
 * ║    • return x + 1 → returns 2                                              ║
 * ║    • Second .then queued with value 2                                      ║
 * ║                                                                            ║
 * ║                                                                            ║
 * ║ 4. Second .then executes (microtask)                                       ║
 * ║ ────────────────────────────────────                                       ║
 * ║    • x = 2                                                                 ║
 * ║    • console.log('B:', x) → Output: B: 2                                   ║
 * ║    • return Promise.resolve(x + 1) → returns Promise<3>                    ║
 * ║    • Third .then waits for this promise to resolve                         ║
 * ║    • When resolved, third .then queued with value 3                        ║
 * ║                                                                            ║
 * ║                                                                            ║
 * ║ 5. Third .then executes (microtask)                                        ║
 * ║ ───────────────────────────────────                                        ║
 * ║    • x = 3                                                                 ║
 * ║    • console.log('C:', x) → Output: C: 3                                   ║
 * ║                                                                            ║
 * ╚════════════════════════════════════════════════════════════════════════════╝
 *
 *
 * ┌─────────────────────────────────────────────────────────────────────────────┐
 * │ VISUAL: Promise Chain Flow                                                  │
 * ├─────────────────────────────────────────────────────────────────────────────┤
 * │                                                                             │
 * │   Promise.resolve(1)                                                        │
 * │         │                                                                   │
 * │         ▼ value: 1                                                          │
 * │   ┌───────────────┐                                                         │
 * │   │   .then(A)    │ → console.log('A:', 1)                                  │
 * │   │   return 2    │                                                         │
 * │   └───────────────┘                                                         │
 * │         │                                                                   │
 * │         ▼ value: 2                                                          │
 * │   ┌───────────────────────────┐                                             │
 * │   │   .then(B)                │ → console.log('B:', 2)                      │
 * │   │   return Promise.resolve(3)│                                            │
 * │   └───────────────────────────┘                                             │
 * │         │                                                                   │
 * │         ▼ waits... then value: 3                                            │
 * │   ┌───────────────┐                                                         │
 * │   │   .then(C)    │ → console.log('C:', 3)                                  │
 * │   └───────────────┘                                                         │
 * │                                                                             │
 * └─────────────────────────────────────────────────────────────────────────────┘
 *
 *
 * ┌─────────────────────────────────────────────────────────────────────────────┐
 * │ RETURN VALUE VS RETURN PROMISE                                              │
 * ├─────────────────────────────────────────────────────────────────────────────┤
 * │                                                                             │
 * │ RETURN PLAIN VALUE:                                                         │
 * │   .then(x => {                                                              │
 * │     return x + 1;  // Next .then gets (x + 1) immediately                   │
 * │   })                                                                        │
 * │                                                                             │
 * │ RETURN PROMISE:                                                             │
 * │   .then(x => {                                                              │
 * │     return Promise.resolve(x + 1);  // Next .then WAITS for promise         │
 * │   })                                                                        │
 * │                                                                             │
 * │   .then(x => {                                                              │
 * │     return fetch('/api');  // Next .then waits for fetch to complete        │
 * │   })                                                                        │
 * │                                                                             │
 * │ FUNCTIONALLY SAME RESULT, but returning a Promise:                          │
 * │   - May add extra microtask ticks for unwrapping                            │
 * │   - Is necessary for async operations like fetch                            │
 * │                                                                             │
 * └─────────────────────────────────────────────────────────────────────────────┘
 *
 *
 * ┌─────────────────────────────────────────────────────────────────────────────┐
 * │ INTERVIEW ANSWER                                                            │
 * ├─────────────────────────────────────────────────────────────────────────────┤
 * │                                                                             │
 * │ "Promise chains execute sequentially - each .then() waits for the           │
 * │  previous one to complete before running.                                   │
 * │                                                                             │
 * │  In this example:                                                           │
 * │  1. 'D' prints first (sync code)                                            │
 * │  2. First .then runs: 'A: 1', returns 2                                     │
 * │  3. Second .then runs: 'B: 2', returns Promise.resolve(3)                   │
 * │  4. Third .then runs: 'C: 3'                                                │
 * │                                                                             │
 * │  When you return a plain value, the next .then receives it directly.        │
 * │  When you return a Promise, the next .then waits for that Promise           │
 * │  to resolve and receives its resolved value.                                │
 * │                                                                             │
 * │  Each .then callback is a microtask. They're queued one at a time           │
 * │  as each previous .then completes. This is why Promise chains are           │
 * │  great for sequential async operations."                                    │
 * │                                                                             │
 * └─────────────────────────────────────────────────────────────────────────────┘
 *
 *
 * RUN: node docs/04-event-loop/07-promise-chain.js
 */
