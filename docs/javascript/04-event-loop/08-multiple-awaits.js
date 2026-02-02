/**
 * CHALLENGE 08: Multiple Awaits
 *
 * ╔════════════════════════════════════════════════════════════════════════════╗
 * ║ THE GOLDEN RULE                                                            ║
 * ╠════════════════════════════════════════════════════════════════════════════╣
 * ║                                                                            ║
 * ║ When async functions call other async functions:                           ║
 * ║                                                                            ║
 * ║   • Each await is a pause point                                            ║
 * ║   • The caller waits for the callee to complete                            ║
 * ║   • Code after await in BOTH functions becomes microtasks                  ║
 * ║                                                                            ║
 * ╚════════════════════════════════════════════════════════════════════════════╝
 */

async function first() {
  console.log('A');
  await second();
  console.log('B');
}

async function second() {
  console.log('C');
  await Promise.resolve();
  console.log('D');
}

console.log('E');
first();
console.log('F');

/**
 * OUTPUT:
 *   E
 *   A
 *   C
 *   F
 *   D
 *   B
 *
 *
 * ╔════════════════════════════════════════════════════════════════════════════╗
 * ║ STEP-BY-STEP BREAKDOWN                                                     ║
 * ╠════════════════════════════════════════════════════════════════════════════╣
 * ║                                                                            ║
 * ║ 1. console.log('E')                                                        ║
 * ║ ───────────────────                                                        ║
 * ║    • Synchronous                                                           ║
 * ║    • Output: E                                                             ║
 * ║                                                                            ║
 * ║                                                                            ║
 * ║ 2. first() is called                                                       ║
 * ║ ────────────────────                                                       ║
 * ║    • Enter first()                                                         ║
 * ║    • console.log('A') - sync                                               ║
 * ║    • Output: A                                                             ║
 * ║                                                                            ║
 * ║                                                                            ║
 * ║ 3. await second()                                                          ║
 * ║ ─────────────────                                                          ║
 * ║    • Calls second() - enters second()                                      ║
 * ║    • console.log('C') - sync                                               ║
 * ║    • Output: C                                                             ║
 * ║                                                                            ║
 * ║                                                                            ║
 * ║ 4. await Promise.resolve() in second()                                     ║
 * ║ ───────────────────────────────────────                                    ║
 * ║    • second() pauses at await                                              ║
 * ║    • Code after this await → queued as microtask                           ║
 * ║    • Control returns to first()                                            ║
 * ║    • first() is also waiting (await second())                              ║
 * ║    • Control returns to main script                                        ║
 * ║                                                                            ║
 * ║                                                                            ║
 * ║ 5. console.log('F')                                                        ║
 * ║ ───────────────────                                                        ║
 * ║    • Back in main script - sync                                            ║
 * ║    • Output: F                                                             ║
 * ║                                                                            ║
 * ║                                                                            ║
 * ║ 6. Sync done - process microtasks                                          ║
 * ║ ─────────────────────────────────                                          ║
 * ║    • second() resumes after await                                          ║
 * ║    • console.log('D')                                                      ║
 * ║    • Output: D                                                             ║
 * ║    • second() completes                                                    ║
 * ║                                                                            ║
 * ║                                                                            ║
 * ║ 7. first() can now resume                                                  ║
 * ║ ───────────────────────────                                                ║
 * ║    • await second() is done                                                ║
 * ║    • console.log('B')                                                      ║
 * ║    • Output: B                                                             ║
 * ║                                                                            ║
 * ╚════════════════════════════════════════════════════════════════════════════╝
 *
 *
 * ┌─────────────────────────────────────────────────────────────────────────────┐
 * │ VISUAL: Nested Async Call Stack                                             │
 * ├─────────────────────────────────────────────────────────────────────────────┤
 * │                                                                             │
 * │   CALL STACK                     EXECUTION                                  │
 * │   ──────────                     ─────────                                  │
 * │                                                                             │
 * │   [main]                         E                                          │
 * │   [main, first()]                A                                          │
 * │   [main, first(), second()]      C                                          │
 * │   [main, first()] ← paused       (awaiting in second)                       │
 * │   [main] ← paused                F                                          │
 * │   [second() resuming]            D                                          │
 * │   [first() resuming]             B                                          │
 * │   []                             (done)                                     │
 * │                                                                             │
 * │                                                                             │
 * │   TIMELINE:                                                                 │
 * │   ─────────                                                                 │
 * │   main: ───E───────first()───────────────────F────────────────────          │
 * │                       │                                                     │
 * │   first:             A──await second()──────────────────────B               │
 * │                              │                              ▲               │
 * │   second:                   C──await───────D────────────────┘               │
 * │                                                                             │
 * └─────────────────────────────────────────────────────────────────────────────┘
 *
 *
 * ┌─────────────────────────────────────────────────────────────────────────────┐
 * │ KEY INSIGHT: Await Propagates Up                                            │
 * ├─────────────────────────────────────────────────────────────────────────────┤
 * │                                                                             │
 * │ When second() hits await:                                                   │
 * │   • second() pauses                                                         │
 * │   • first() is waiting for second() → first() also pauses                   │
 * │   • Control returns all the way to main script                              │
 * │                                                                             │
 * │ This is why 'F' prints before 'D' and 'B':                                  │
 * │   • Both first() and second() are paused                                    │
 * │   • main script continues to console.log('F')                               │
 * │   • Only after sync completes do the async functions resume                 │
 * │                                                                             │
 * └─────────────────────────────────────────────────────────────────────────────┘
 *
 *
 * ┌─────────────────────────────────────────────────────────────────────────────┐
 * │ INTERVIEW ANSWER                                                            │
 * ├─────────────────────────────────────────────────────────────────────────────┤
 * │                                                                             │
 * │ "When async functions call other async functions, await pauses propagate    │
 * │  up the call chain.                                                         │
 * │                                                                             │
 * │  In this example:                                                           │
 * │  1. 'E' prints (sync)                                                       │
 * │  2. first() starts, 'A' prints                                              │
 * │  3. first() calls second(), 'C' prints                                      │
 * │  4. second() hits await, pauses - but first() is waiting for second(),      │
 * │     so first() also pauses, returning control to main                       │
 * │  5. 'F' prints (back in main, sync)                                         │
 * │  6. Sync done, second() resumes: 'D' prints, second() completes             │
 * │  7. first() resumes (await second() done): 'B' prints                       │
 * │                                                                             │
 * │  The key insight is that await in a called function affects the caller      │
 * │  too. Both functions are suspended until the awaited promise resolves,      │
 * │  allowing sync code to continue in the meantime."                           │
 * │                                                                             │
 * └─────────────────────────────────────────────────────────────────────────────┘
 *
 *
 * RUN: node docs/04-event-loop/08-multiple-awaits.js
 */
