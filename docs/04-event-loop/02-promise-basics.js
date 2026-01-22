/**
 * CHALLENGE 02: Promise Basics
 *
 * ╔════════════════════════════════════════════════════════════════════════════╗
 * ║ THE GOLDEN RULE                                                            ║
 * ╠════════════════════════════════════════════════════════════════════════════╣
 * ║                                                                            ║
 * ║ Promise callbacks (.then, .catch, .finally) are MICROTASKS.                ║
 * ║                                                                            ║
 * ║   • Microtasks run AFTER current synchronous code                          ║
 * ║   • Microtasks run BEFORE any macrotasks (setTimeout, etc.)                ║
 * ║   • ALL microtasks are drained before any macrotask runs                   ║
 * ║                                                                            ║
 * ╚════════════════════════════════════════════════════════════════════════════╝
 */

console.log('A');

Promise.resolve().then(function() {
  console.log('B');
});

console.log('C');

/**
 * OUTPUT:
 *   A
 *   C
 *   B
 *
 *
 * ╔════════════════════════════════════════════════════════════════════════════╗
 * ║ STEP-BY-STEP BREAKDOWN                                                     ║
 * ╠════════════════════════════════════════════════════════════════════════════╣
 * ║                                                                            ║
 * ║ 1. console.log('A')                                                        ║
 * ║ ───────────────────                                                        ║
 * ║    • Synchronous - executes immediately                                    ║
 * ║    • Output: A                                                             ║
 * ║                                                                            ║
 * ║                                                                            ║
 * ║ 2. Promise.resolve().then(...)                                             ║
 * ║ ───────────────────────────────                                            ║
 * ║    • Promise.resolve() creates an already-resolved promise                 ║
 * ║    • .then() callback is queued in the MICROTASK queue                     ║
 * ║    • Does NOT execute immediately                                          ║
 * ║                                                                            ║
 * ║                                                                            ║
 * ║ 3. console.log('C')                                                        ║
 * ║ ───────────────────                                                        ║
 * ║    • Synchronous - executes immediately                                    ║
 * ║    • Output: C                                                             ║
 * ║                                                                            ║
 * ║                                                                            ║
 * ║ 4. Sync code done, process microtask queue                                 ║
 * ║ ──────────────────────────────────────────                                 ║
 * ║    • .then callback runs: console.log('B')                                 ║
 * ║    • Output: B                                                             ║
 * ║                                                                            ║
 * ╚════════════════════════════════════════════════════════════════════════════╝
 *
 *
 * ┌─────────────────────────────────────────────────────────────────────────────┐
 * │ VISUAL: Microtask Queue                                                     │
 * ├─────────────────────────────────────────────────────────────────────────────┤
 * │                                                                             │
 * │   ┌─────────────────┐                                                       │
 * │   │   CALL STACK    │                                                       │
 * │   │                 │                                                       │
 * │   │ console.log('A')│ → A                                                   │
 * │   │ Promise.resolve │ ────┐                                                 │
 * │   │ console.log('C')│ → C │                                                 │
 * │   │                 │     │                                                 │
 * │   └─────────────────┘     │                                                 │
 * │           ▲               │                                                 │
 * │           │               ▼                                                 │
 * │   ┌───────────────────────────────────┐                                     │
 * │   │       MICROTASK QUEUE             │                                     │
 * │   │                                   │                                     │
 * │   │  () => console.log('B')           │                                     │
 * │   │                                   │                                     │
 * │   └───────────────────────────────────┘                                     │
 * │                                                                             │
 * │   After sync code: microtask runs → B                                       │
 * │                                                                             │
 * └─────────────────────────────────────────────────────────────────────────────┘
 *
 *
 * ┌─────────────────────────────────────────────────────────────────────────────┐
 * │ PROMISE.RESOLVE() EXPLAINED                                                 │
 * ├─────────────────────────────────────────────────────────────────────────────┤
 * │                                                                             │
 * │ Promise.resolve() creates an already-fulfilled promise.                     │
 * │ The .then() callback is GUARANTEED to be async, even though                 │
 * │ the promise is already resolved.                                            │
 * │                                                                             │
 * │   Promise.resolve(value)                                                    │
 * │   // Same as:                                                               │
 * │   new Promise(resolve => resolve(value))                                    │
 * │                                                                             │
 * │ This is part of the Promise specification - .then() callbacks               │
 * │ ALWAYS run asynchronously to maintain consistent behavior.                  │
 * │                                                                             │
 * └─────────────────────────────────────────────────────────────────────────────┘
 *
 *
 * ┌─────────────────────────────────────────────────────────────────────────────┐
 * │ INTERVIEW ANSWER                                                            │
 * ├─────────────────────────────────────────────────────────────────────────────┤
 * │                                                                             │
 * │ "Promise callbacks are microtasks, which have special priority in the       │
 * │  event loop. After synchronous code completes, the microtask queue is       │
 * │  fully drained before any macrotasks (like setTimeout) run.                 │
 * │                                                                             │
 * │  In this example:                                                           │
 * │  1. 'A' prints (sync)                                                       │
 * │  2. Promise.resolve() is already resolved, so .then() callback              │
 * │     is immediately queued as a microtask                                    │
 * │  3. 'C' prints (sync)                                                       │
 * │  4. Sync complete, microtask queue processes                                │
 * │  5. 'B' prints (microtask)                                                  │
 * │                                                                             │
 * │  Even though the promise is instantly resolved, .then() is always           │
 * │  asynchronous - this is guaranteed by the Promise specification             │
 * │  to ensure consistent, predictable behavior."                               │
 * │                                                                             │
 * └─────────────────────────────────────────────────────────────────────────────┘
 *
 *
 * RUN: node docs/04-event-loop/02-promise-basics.js
 */
