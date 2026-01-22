/**
 * CHALLENGE 05: Async/Await
 *
 * ╔════════════════════════════════════════════════════════════════════════════╗
 * ║ THE GOLDEN RULE                                                            ║
 * ╠════════════════════════════════════════════════════════════════════════════╣
 * ║                                                                            ║
 * ║ async/await is syntactic sugar over Promises.                              ║
 * ║                                                                            ║
 * ║   • Code BEFORE await runs synchronously                                   ║
 * ║   • await pauses the function (like .then())                               ║
 * ║   • Code AFTER await runs as a microtask                                   ║
 * ║                                                                            ║
 * ║   async function foo() {       │  Equivalent to:                           ║
 * ║     console.log('A');          │  function foo() {                         ║
 * ║     await Promise.resolve();   │    console.log('A');                      ║
 * ║     console.log('B');          │    return Promise.resolve().then(() => {  ║
 * ║   }                            │      console.log('B');                    ║
 * ║                                │    });                                    ║
 * ║                                │  }                                        ║
 * ║                                                                            ║
 * ╚════════════════════════════════════════════════════════════════════════════╝
 */

async function foo() {
  console.log('A');
  await Promise.resolve();
  console.log('B');
}

console.log('C');
foo();
console.log('D');

/**
 * OUTPUT:
 *   C
 *   A
 *   D
 *   B
 *
 *
 * ╔════════════════════════════════════════════════════════════════════════════╗
 * ║ STEP-BY-STEP BREAKDOWN                                                     ║
 * ╠════════════════════════════════════════════════════════════════════════════╣
 * ║                                                                            ║
 * ║ 1. console.log('C')                                                        ║
 * ║ ───────────────────                                                        ║
 * ║    • Synchronous - executes immediately                                    ║
 * ║    • Output: C                                                             ║
 * ║                                                                            ║
 * ║                                                                            ║
 * ║ 2. foo() is called                                                         ║
 * ║ ──────────────────                                                         ║
 * ║    • Enters foo() function                                                 ║
 * ║    • console.log('A') - SYNC, runs immediately                             ║
 * ║    • Output: A                                                             ║
 * ║                                                                            ║
 * ║                                                                            ║
 * ║ 3. await Promise.resolve()                                                 ║
 * ║ ──────────────────────────                                                 ║
 * ║    • Promise resolves immediately                                          ║
 * ║    • BUT await pauses foo() here                                           ║
 * ║    • Everything after await → queued as microtask                          ║
 * ║    • Control returns to caller (main script)                               ║
 * ║                                                                            ║
 * ║                                                                            ║
 * ║ 4. console.log('D')                                                        ║
 * ║ ───────────────────                                                        ║
 * ║    • Back in main script (sync)                                            ║
 * ║    • Output: D                                                             ║
 * ║                                                                            ║
 * ║                                                                            ║
 * ║ 5. Sync code done - process microtasks                                     ║
 * ║ ──────────────────────────────────────                                     ║
 * ║    • foo() resumes after await                                             ║
 * ║    • console.log('B')                                                      ║
 * ║    • Output: B                                                             ║
 * ║                                                                            ║
 * ╚════════════════════════════════════════════════════════════════════════════╝
 *
 *
 * ┌─────────────────────────────────────────────────────────────────────────────┐
 * │ VISUAL: async/await Execution Flow                                          │
 * ├─────────────────────────────────────────────────────────────────────────────┤
 * │                                                                             │
 * │   CALL STACK                        MICROTASK QUEUE                         │
 * │   ──────────                        ───────────────                         │
 * │                                                                             │
 * │   1. [console.log('C')]             []                                      │
 * │      Output: C                                                              │
 * │                                                                             │
 * │   2. [foo()]                        []                                      │
 * │      [console.log('A')]                                                     │
 * │      Output: A                                                              │
 * │                                                                             │
 * │   3. [foo() paused at await]        [foo() continuation]                    │
 * │                                     (code after await)                      │
 * │                                                                             │
 * │   4. [console.log('D')]             [foo() continuation]                    │
 * │      Output: D                                                              │
 * │                                                                             │
 * │   5. []                             [foo() continuation]                    │
 * │      (stack empty, run microtask)                                           │
 * │                                                                             │
 * │   6. [foo() continuation]           []                                      │
 * │      [console.log('B')]                                                     │
 * │      Output: B                                                              │
 * │                                                                             │
 * └─────────────────────────────────────────────────────────────────────────────┘
 *
 *
 * ┌─────────────────────────────────────────────────────────────────────────────┐
 * │ KEY INSIGHT: await SPLITS the function                                      │
 * ├─────────────────────────────────────────────────────────────────────────────┤
 * │                                                                             │
 * │   async function foo() {                                                    │
 * │     // ──── PART 1: SYNCHRONOUS ────                                        │
 * │     console.log('A');                                                       │
 * │                                                                             │
 * │     await Promise.resolve();   ← PAUSE POINT                                │
 * │                                                                             │
 * │     // ──── PART 2: MICROTASK ────                                          │
 * │     console.log('B');                                                       │
 * │   }                                                                         │
 * │                                                                             │
 * │   Everything before await: runs synchronously when foo() is called          │
 * │   Everything after await: queued as microtask, runs later                   │
 * │                                                                             │
 * └─────────────────────────────────────────────────────────────────────────────┘
 *
 *
 * ┌─────────────────────────────────────────────────────────────────────────────┐
 * │ INTERVIEW ANSWER                                                            │
 * ├─────────────────────────────────────────────────────────────────────────────┤
 * │                                                                             │
 * │ "async/await is syntactic sugar over Promises. When an async function       │
 * │  hits an await, it pauses and returns control to the caller. The code       │
 * │  after await is scheduled as a microtask.                                   │
 * │                                                                             │
 * │  In this example:                                                           │
 * │  1. 'C' prints (sync, before foo() call)                                    │
 * │  2. foo() starts, 'A' prints (sync part of foo)                             │
 * │  3. await pauses foo(), control returns to main script                      │
 * │  4. 'D' prints (sync, after foo() call)                                     │
 * │  5. Sync done, microtask runs: foo() resumes, 'B' prints                    │
 * │                                                                             │
 * │  The key insight is that await effectively splits the function:             │
 * │  code before await runs synchronously, code after runs as a microtask.      │
 * │  This is why 'D' prints before 'B' even though foo() was called first."     │
 * │                                                                             │
 * └─────────────────────────────────────────────────────────────────────────────┘
 *
 *
 * RUN: node docs/04-event-loop/05-async-await.js
 */
