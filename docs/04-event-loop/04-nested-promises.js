/**
 * CHALLENGE 04: Nested Promises
 *
 * ╔════════════════════════════════════════════════════════════════════════════╗
 * ║ THE GOLDEN RULE                                                            ║
 * ╠════════════════════════════════════════════════════════════════════════════╣
 * ║                                                                            ║
 * ║ Microtasks spawned by microtasks run BEFORE the next .then() in chain.     ║
 * ║                                                                            ║
 * ║ Each .then() callback queues its returned value's handler as a NEW         ║
 * ║ microtask. Nested Promises inside a .then() create additional microtasks.  ║
 * ║                                                                            ║
 * ╚════════════════════════════════════════════════════════════════════════════╝
 */

Promise.resolve().then(function() {
  console.log('A');
  Promise.resolve().then(function() {
    console.log('B');
  });
}).then(function() {
  console.log('C');
});

console.log('D');

/**
 * OUTPUT:
 *   D
 *   A
 *   B
 *   C
 *
 *
 * ╔════════════════════════════════════════════════════════════════════════════╗
 * ║ STEP-BY-STEP BREAKDOWN                                                     ║
 * ╠════════════════════════════════════════════════════════════════════════════╣
 * ║                                                                            ║
 * ║ 1. Parse the Promise chain                                                 ║
 * ║ ──────────────────────────                                                 ║
 * ║    • First .then callback → queued as microtask                            ║
 * ║    • Second .then waits for first to complete                              ║
 * ║                                                                            ║
 * ║                                                                            ║
 * ║ 2. console.log('D')                                                        ║
 * ║ ───────────────────                                                        ║
 * ║    • Synchronous - executes immediately                                    ║
 * ║    • Output: D                                                             ║
 * ║                                                                            ║
 * ║                                                                            ║
 * ║ 3. Process microtask queue - first .then                                   ║
 * ║ ─────────────────────────────────────────                                  ║
 * ║    • console.log('A') → Output: A                                          ║
 * ║    • Inner Promise.resolve().then() → queues 'B' as microtask              ║
 * ║    • First .then completes → queues second .then('C') as microtask         ║
 * ║                                                                            ║
 * ║    Microtask queue now: ['B', 'C']                                         ║
 * ║                                                                            ║
 * ║                                                                            ║
 * ║ 4. Continue draining microtasks - 'B'                                      ║
 * ║ ──────────────────────────────────────                                     ║
 * ║    • console.log('B') → Output: B                                          ║
 * ║                                                                            ║
 * ║    Microtask queue now: ['C']                                              ║
 * ║                                                                            ║
 * ║                                                                            ║
 * ║ 5. Continue draining microtasks - 'C'                                      ║
 * ║ ──────────────────────────────────────                                     ║
 * ║    • console.log('C') → Output: C                                          ║
 * ║                                                                            ║
 * ╚════════════════════════════════════════════════════════════════════════════╝
 *
 *
 * ┌─────────────────────────────────────────────────────────────────────────────┐
 * │ VISUAL: Microtask Queue Evolution                                           │
 * ├─────────────────────────────────────────────────────────────────────────────┤
 * │                                                                             │
 * │   INITIAL (after sync):                                                     │
 * │   Microtask Queue: [ callback_A ]                                           │
 * │                                                                             │
 * │   AFTER 'A' runs:                                                           │
 * │   • 'A' callback creates inner Promise → queues 'B'                         │
 * │   • 'A' callback completes → queues 'C' (chained .then)                     │
 * │   Microtask Queue: [ callback_B, callback_C ]                               │
 * │                                                                             │
 * │   AFTER 'B' runs:                                                           │
 * │   Microtask Queue: [ callback_C ]                                           │
 * │                                                                             │
 * │   AFTER 'C' runs:                                                           │
 * │   Microtask Queue: [ ] (empty)                                              │
 * │                                                                             │
 * │                                                                             │
 * │   ┌──────────────────────────────────────────────────────────┐              │
 * │   │  Promise.resolve().then(A).then(C)                       │              │
 * │   │         │            │       │                           │              │
 * │   │         │            │       └─── queued when A completes│              │
 * │   │         │            │                                   │              │
 * │   │         │            └─── contains nested Promise → B    │              │
 * │   │         │                                                │              │
 * │   │         └─── queued immediately                          │              │
 * │   └──────────────────────────────────────────────────────────┘              │
 * │                                                                             │
 * └─────────────────────────────────────────────────────────────────────────────┘
 *
 *
 * ┌─────────────────────────────────────────────────────────────────────────────┐
 * │ WHY 'B' BEFORE 'C'?                                                         │
 * ├─────────────────────────────────────────────────────────────────────────────┤
 * │                                                                             │
 * │ When 'A' callback runs:                                                     │
 * │                                                                             │
 * │   1. console.log('A') executes                                              │
 * │   2. Promise.resolve().then(() => console.log('B'))                         │
 * │      → 'B' callback queued IMMEDIATELY (Promise already resolved)           │
 * │   3. 'A' callback returns undefined                                         │
 * │   4. First .then() resolves → second .then('C') callback queued             │
 * │                                                                             │
 * │ Queue order: B was queued DURING 'A', C was queued AFTER 'A' completed.     │
 * │ So B comes before C in the queue.                                           │
 * │                                                                             │
 * └─────────────────────────────────────────────────────────────────────────────┘
 *
 *
 * ┌─────────────────────────────────────────────────────────────────────────────┐
 * │ INTERVIEW ANSWER                                                            │
 * ├─────────────────────────────────────────────────────────────────────────────┤
 * │                                                                             │
 * │ "Nested Promises create additional microtasks that get queued during        │
 * │  execution of their parent microtask.                                       │
 * │                                                                             │
 * │  Here's the execution order:                                                │
 * │  1. 'D' prints (sync code)                                                  │
 * │  2. First .then callback runs, prints 'A'                                   │
 * │  3. Inner Promise.then queues 'B' as a microtask                            │
 * │  4. First .then completes, queuing 'C' as a microtask                       │
 * │  5. 'B' runs (queued first during step 3)                                   │
 * │  6. 'C' runs (queued second during step 4)                                  │
 * │                                                                             │
 * │  The key insight is that 'B' was queued DURING the execution of the         │
 * │  first .then, while 'C' was queued AFTER it completed. Microtasks           │
 * │  spawned by microtasks are processed in the same cycle, before any          │
 * │  macrotasks run."                                                           │
 * │                                                                             │
 * └─────────────────────────────────────────────────────────────────────────────┘
 *
 *
 * RUN: node docs/04-event-loop/04-nested-promises.js
 */
