/**
 * CHALLENGE 10: Ultimate Event Loop Challenge
 *
 * ╔════════════════════════════════════════════════════════════════════════════╗
 * ║ THE FINAL TEST                                                             ║
 * ╠════════════════════════════════════════════════════════════════════════════╣
 * ║                                                                            ║
 * ║ This challenge combines ALL event loop concepts:                           ║
 * ║   • Synchronous vs asynchronous                                            ║
 * ║   • Microtasks (Promise.then)                                              ║
 * ║   • Macrotasks (setTimeout)                                                ║
 * ║   • async/await                                                            ║
 * ║   • Promise executor (synchronous!)                                        ║
 * ║                                                                            ║
 * ╚════════════════════════════════════════════════════════════════════════════╝
 */

async function async1() {
  console.log('A');
  await async2();
  console.log('B');
}

async function async2() {
  console.log('C');
}

console.log('D');

setTimeout(function() {
  console.log('E');
}, 0);

async1();

new Promise(function(resolve) {
  console.log('F');
  resolve();
}).then(function() {
  console.log('G');
});

console.log('H');

/**
 * OUTPUT:
 *   D
 *   A
 *   C
 *   F
 *   H
 *   B
 *   G
 *   E
 *
 *
 * ╔════════════════════════════════════════════════════════════════════════════╗
 * ║ STEP-BY-STEP BREAKDOWN                                                     ║
 * ╠════════════════════════════════════════════════════════════════════════════╣
 * ║                                                                            ║
 * ║ PHASE 1: Synchronous Execution                                             ║
 * ║ ═══════════════════════════════                                            ║
 * ║                                                                            ║
 * ║ 1. console.log('D')                                                        ║
 * ║    • Output: D                                                             ║
 * ║                                                                            ║
 * ║ 2. setTimeout(...) registered                                              ║
 * ║    • Callback 'E' → macrotask queue                                        ║
 * ║                                                                            ║
 * ║ 3. async1() called                                                         ║
 * ║    • Enter async1                                                          ║
 * ║    • console.log('A') → Output: A                                          ║
 * ║    • await async2() → calls async2                                         ║
 * ║      • Enter async2                                                        ║
 * ║      • console.log('C') → Output: C                                        ║
 * ║      • async2 returns (implicitly Promise<undefined>)                      ║
 * ║    • await pauses async1                                                   ║
 * ║    • Code after await ('B') → microtask queue                              ║
 * ║    • Return to main                                                        ║
 * ║                                                                            ║
 * ║ 4. new Promise(executor)                                                   ║
 * ║    • EXECUTOR RUNS SYNCHRONOUSLY!                                          ║
 * ║    • console.log('F') → Output: F                                          ║
 * ║    • resolve() called                                                      ║
 * ║    • .then callback 'G' → microtask queue                                  ║
 * ║                                                                            ║
 * ║ 5. console.log('H')                                                        ║
 * ║    • Output: H                                                             ║
 * ║                                                                            ║
 * ║                                                                            ║
 * ║ STATE AFTER SYNC:                                                          ║
 * ║   Output so far: D, A, C, F, H                                             ║
 * ║   Microtask queue: [async1 continuation ('B'), Promise.then ('G')]         ║
 * ║   Macrotask queue: [setTimeout ('E')]                                      ║
 * ║                                                                            ║
 * ║                                                                            ║
 * ║ PHASE 2: Microtask Queue                                                   ║
 * ║ ═════════════════════════                                                  ║
 * ║                                                                            ║
 * ║ 6. async1 resumes                                                          ║
 * ║    • console.log('B') → Output: B                                          ║
 * ║                                                                            ║
 * ║ 7. Promise.then callback                                                   ║
 * ║    • console.log('G') → Output: G                                          ║
 * ║                                                                            ║
 * ║                                                                            ║
 * ║ PHASE 3: Macrotask Queue                                                   ║
 * ║ ═════════════════════════                                                  ║
 * ║                                                                            ║
 * ║ 8. setTimeout callback                                                     ║
 * ║    • console.log('E') → Output: E                                          ║
 * ║                                                                            ║
 * ╚════════════════════════════════════════════════════════════════════════════╝
 *
 *
 * ┌─────────────────────────────────────────────────────────────────────────────┐
 * │ VISUAL: Complete Execution Timeline                                         │
 * ├─────────────────────────────────────────────────────────────────────────────┤
 * │                                                                             │
 * │   ┌─────────────────────────────────────────────────────────────────────┐   │
 * │   │  SYNCHRONOUS PHASE                                                  │   │
 * │   │                                                                     │   │
 * │   │  D ─→ setTimeout(E) ─→ async1() ─→ A ─→ async2() ─→ C               │   │
 * │   │          │                              │                           │   │
 * │   │          │                              └─→ await (pause, queue B)  │   │
 * │   │          │                                                          │   │
 * │   │          └─→ macrotask queue                                        │   │
 * │   │                                                                     │   │
 * │   │  ─→ new Promise() ─→ F ─→ resolve() ─→ H                            │   │
 * │   │                              │                                      │   │
 * │   │                              └─→ microtask queue (G)                │   │
 * │   └─────────────────────────────────────────────────────────────────────┘   │
 * │                                                                             │
 * │   Output: D, A, C, F, H                                                     │
 * │   Microtasks: [B, G]                                                        │
 * │   Macrotasks: [E]                                                           │
 * │                                                                             │
 * │   ┌─────────────────────────────────────────────────────────────────────┐   │
 * │   │  MICROTASK PHASE                                                    │   │
 * │   │                                                                     │   │
 * │   │  async1 resumes ─→ B                                                │   │
 * │   │  Promise.then ─→ G                                                  │   │
 * │   └─────────────────────────────────────────────────────────────────────┘   │
 * │                                                                             │
 * │   Output: B, G                                                              │
 * │                                                                             │
 * │   ┌─────────────────────────────────────────────────────────────────────┐   │
 * │   │  MACROTASK PHASE                                                    │   │
 * │   │                                                                     │   │
 * │   │  setTimeout callback ─→ E                                           │   │
 * │   └─────────────────────────────────────────────────────────────────────┘   │
 * │                                                                             │
 * │   Output: E                                                                 │
 * │                                                                             │
 * │   FINAL OUTPUT: D, A, C, F, H, B, G, E                                      │
 * │                                                                             │
 * └─────────────────────────────────────────────────────────────────────────────┘
 *
 *
 * ┌─────────────────────────────────────────────────────────────────────────────┐
 * │ KEY INSIGHT: Promise Executor is SYNC!                                      │
 * ├─────────────────────────────────────────────────────────────────────────────┤
 * │                                                                             │
 * │   new Promise(function(resolve) {                                           │
 * │     console.log('F');  // ← This runs SYNCHRONOUSLY!                        │
 * │     resolve();                                                              │
 * │   })                                                                        │
 * │                                                                             │
 * │   The Promise EXECUTOR function runs immediately when the Promise           │
 * │   is created. Only the .then() callback is asynchronous.                    │
 * │                                                                             │
 * │   This is why 'F' prints in the sync phase, not later.                      │
 * │                                                                             │
 * └─────────────────────────────────────────────────────────────────────────────┘
 *
 *
 * ┌─────────────────────────────────────────────────────────────────────────────┐
 * │ EVENT LOOP MASTERY CHECKLIST                                                │
 * ├─────────────────────────────────────────────────────────────────────────────┤
 * │                                                                             │
 * │ ✓ JavaScript is single-threaded, non-blocking                               │
 * │ ✓ Sync code always runs first, completely                                   │
 * │ ✓ Microtasks: Promise.then, await continuation, queueMicrotask              │
 * │ ✓ Macrotasks: setTimeout, setInterval, I/O                                  │
 * │ ✓ ALL microtasks drain before ANY macrotask                                 │
 * │ ✓ After each macrotask, microtask queue is drained                          │
 * │ ✓ Promise executor runs synchronously                                       │
 * │ ✓ await splits function: before=sync, after=microtask                       │
 * │ ✓ Nested async calls propagate pause up the chain                           │
 * │                                                                             │
 * │ You're ready for event loop questions in interviews!                        │
 * │                                                                             │
 * └─────────────────────────────────────────────────────────────────────────────┘
 *
 *
 * ┌─────────────────────────────────────────────────────────────────────────────┐
 * │ INTERVIEW ANSWER                                                            │
 * ├─────────────────────────────────────────────────────────────────────────────┤
 * │                                                                             │
 * │ "This example tests understanding of the complete event loop.               │
 * │                                                                             │
 * │  SYNCHRONOUS PHASE (D, A, C, F, H):                                         │
 * │  - 'D' prints first (top-level sync)                                        │
 * │  - setTimeout queues 'E' as macrotask                                       │
 * │  - async1 runs: 'A' prints, calls async2, 'C' prints                        │
 * │  - await pauses async1, queues continuation ('B') as microtask              │
 * │  - Promise executor is SYNC: 'F' prints, resolve() queues 'G'               │
 * │  - 'H' prints                                                               │
 * │                                                                             │
 * │  MICROTASK PHASE (B, G):                                                    │
 * │  - async1 resumes: 'B' prints                                               │
 * │  - Promise.then: 'G' prints                                                 │
 * │                                                                             │
 * │  MACROTASK PHASE (E):                                                       │
 * │  - setTimeout callback: 'E' prints                                          │
 * │                                                                             │
 * │  The key insights are:                                                      │
 * │  1. Promise executor is synchronous                                         │
 * │  2. await creates a microtask for code after it                             │
 * │  3. Microtasks always run before macrotasks                                 │
 * │  4. All sync code completes before any callbacks run"                       │
 * │                                                                             │
 * └─────────────────────────────────────────────────────────────────────────────┘
 *
 *
 * RUN: node docs/04-event-loop/10-ultimate-event-loop-challenge.js
 */
