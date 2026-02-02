/**
 * TOPIC: Promise Basics
 *
 * STORY: Imagine ordering food at a fast-food counter. The cashier gives you
 * a receipt with a number (the Promise). You step aside (async) and wait.
 * When your food is ready, your number is called (.then). You do NOT stand
 * at the counter blocking everyone — you move aside and get notified later.
 * Importantly, receipt-holders (microtasks) get served before walk-in
 * customers waiting outside (macrotasks like setTimeout).
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

Promise.resolve().then(() => {
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
 * INTERVIEW QUESTIONS:
 *
 * Q1: What are microtasks and how do they differ from macrotasks?
 * A1: Microtasks (Promise .then/.catch/.finally, queueMicrotask) run after
 *     the current synchronous code but BEFORE any macrotasks (setTimeout,
 *     setInterval). The entire microtask queue is drained before the next
 *     macrotask executes.
 *
 * Q2: Why is .then() always asynchronous even on an already-resolved Promise?
 * A2: The Promise spec guarantees .then() callbacks run asynchronously to
 *     ensure consistent, predictable behavior. This prevents code from
 *     behaving differently based on whether a promise is already resolved
 *     or still pending.
 *
 * Q3: What does Promise.resolve() do?
 * A3: It creates an already-fulfilled promise with the given value. It is
 *     equivalent to `new Promise(resolve => resolve(value))`. The .then()
 *     callback is immediately queued as a microtask.
 *
 *
 * RUN: node docs/javascript/04-event-loop/02-promise-basics.js
 */
