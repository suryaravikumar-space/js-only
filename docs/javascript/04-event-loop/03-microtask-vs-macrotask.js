/**
 * CHALLENGE 03: Microtask vs Macrotask
 *
 * ╔════════════════════════════════════════════════════════════════════════════╗
 * ║ THE GOLDEN RULE                                                            ║
 * ╠════════════════════════════════════════════════════════════════════════════╣
 * ║                                                                            ║
 * ║   PRIORITY ORDER:                                                          ║
 * ║   1. Synchronous code (call stack)                                         ║
 * ║   2. Microtasks (Promise.then, queueMicrotask, MutationObserver)           ║
 * ║   3. Macrotasks (setTimeout, setInterval, I/O, UI rendering)               ║
 * ║                                                                            ║
 * ║   Microtasks ALWAYS run before macrotasks!                                 ║
 * ║                                                                            ║
 * ╚════════════════════════════════════════════════════════════════════════════╝
 */

console.log('A');

setTimeout(function() {
  console.log('B');
}, 0);

Promise.resolve().then(function() {
  console.log('C');
});

console.log('D');

/**
 * OUTPUT:
 *   A
 *   D
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
 * ║ 2. setTimeout(..., 0)                                                      ║
 * ║ ─────────────────────                                                      ║
 * ║    • Callback goes to MACROTASK queue                                      ║
 * ║    • Waits there                                                           ║
 * ║                                                                            ║
 * ║                                                                            ║
 * ║ 3. Promise.resolve().then(...)                                             ║
 * ║ ───────────────────────────────                                            ║
 * ║    • Callback goes to MICROTASK queue                                      ║
 * ║    • Higher priority than macrotasks                                       ║
 * ║                                                                            ║
 * ║                                                                            ║
 * ║ 4. console.log('D')                                                        ║
 * ║ ───────────────────                                                        ║
 * ║    • Synchronous - executes immediately                                    ║
 * ║    • Output: D                                                             ║
 * ║                                                                            ║
 * ║                                                                            ║
 * ║ 5. Sync code done - process MICROTASKS first                               ║
 * ║ ─────────────────────────────────────────────                              ║
 * ║    • Promise .then callback runs                                           ║
 * ║    • Output: C                                                             ║
 * ║                                                                            ║
 * ║                                                                            ║
 * ║ 6. Microtask queue empty - process MACROTASK                               ║
 * ║ ─────────────────────────────────────────────                              ║
 * ║    • setTimeout callback runs                                              ║
 * ║    • Output: B                                                             ║
 * ║                                                                            ║
 * ╚════════════════════════════════════════════════════════════════════════════╝
 *
 *
 * ┌─────────────────────────────────────────────────────────────────────────────┐
 * │ VISUAL: Two Queues                                                          │
 * ├─────────────────────────────────────────────────────────────────────────────┤
 * │                                                                             │
 * │   ┌─────────────────┐                                                       │
 * │   │   CALL STACK    │  ←── Sync code runs here first                        │
 * │   │                 │                                                       │
 * │   │ log('A') → A    │                                                       │
 * │   │ setTimeout ─────┼────────────────────────────────┐                      │
 * │   │ Promise.then ───┼──────────────────┐             │                      │
 * │   │ log('D') → D    │                  │             │                      │
 * │   └─────────────────┘                  │             │                      │
 * │           ▲                            │             │                      │
 * │           │ (1st)                      ▼             ▼                      │
 * │   ┌───────────────────────┐   ┌─────────────────────────┐                   │
 * │   │   MICROTASK QUEUE     │   │    MACROTASK QUEUE      │                   │
 * │   │   (Higher Priority)   │   │    (Lower Priority)     │                   │
 * │   │                       │   │                         │                   │
 * │   │  log('C') → C         │   │  log('B') → B           │                   │
 * │   │         ▲             │   │         ▲               │                   │
 * │   │         │ (2nd)       │   │         │ (3rd)         │                   │
 * │   └───────────────────────┘   └─────────────────────────┘                   │
 * │                                                                             │
 * │   ORDER: Sync → ALL Microtasks → ONE Macrotask → (repeat)                   │
 * │                                                                             │
 * └─────────────────────────────────────────────────────────────────────────────┘
 *
 *
 * ┌─────────────────────────────────────────────────────────────────────────────┐
 * │ MICROTASKS vs MACROTASKS                                                    │
 * ├─────────────────────────────────────────────────────────────────────────────┤
 * │                                                                             │
 * │   MICROTASKS:                        MACROTASKS:                            │
 * │   ─────────────                      ────────────                           │
 * │   • Promise.then/catch/finally       • setTimeout                           │
 * │   • queueMicrotask()                 • setInterval                          │
 * │   • MutationObserver                 • setImmediate (Node)                  │
 * │   • process.nextTick (Node)          • I/O operations                       │
 * │                                      • UI rendering (Browser)               │
 * │                                      • requestAnimationFrame                │
 * │                                                                             │
 * │   KEY DIFFERENCE:                                                           │
 * │   ALL microtasks run before ANY macrotask.                                  │
 * │   Between each macrotask, microtask queue is fully drained.                 │
 * │                                                                             │
 * └─────────────────────────────────────────────────────────────────────────────┘
 *
 *
 * ┌─────────────────────────────────────────────────────────────────────────────┐
 * │ INTERVIEW ANSWER                                                            │
 * ├─────────────────────────────────────────────────────────────────────────────┤
 * │                                                                             │
 * │ "The event loop has two types of async queues: microtasks and macrotasks.   │
 * │  Microtasks have higher priority and are always processed before macrotasks.│
 * │                                                                             │
 * │  In this example:                                                           │
 * │  - 'A' and 'D' print first (synchronous)                                    │
 * │  - 'C' prints next (microtask - Promise.then)                               │
 * │  - 'B' prints last (macrotask - setTimeout)                                 │
 * │                                                                             │
 * │  Even though setTimeout was registered before the Promise, the Promise      │
 * │  callback runs first because microtasks have priority over macrotasks.      │
 * │                                                                             │
 * │  The rule is: after each piece of synchronous code completes, drain         │
 * │  ALL microtasks before running the next macrotask. This is why Promise      │
 * │  callbacks feel 'faster' than setTimeout(0)."                               │
 * │                                                                             │
 * └─────────────────────────────────────────────────────────────────────────────┘
 *
 *
 * RUN: node docs/04-event-loop/03-microtask-vs-macrotask.js
 */
