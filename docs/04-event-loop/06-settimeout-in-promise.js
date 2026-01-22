/**
 * CHALLENGE 06: setTimeout Inside Promise
 *
 * ╔════════════════════════════════════════════════════════════════════════════╗
 * ║ THE GOLDEN RULE                                                            ║
 * ╠════════════════════════════════════════════════════════════════════════════╣
 * ║                                                                            ║
 * ║ When mixing microtasks and macrotasks:                                     ║
 * ║                                                                            ║
 * ║   1. Run all sync code                                                     ║
 * ║   2. Drain ALL microtasks                                                  ║
 * ║   3. Run ONE macrotask                                                     ║
 * ║   4. Drain ALL microtasks created during that macrotask                    ║
 * ║   5. Repeat 3-4                                                            ║
 * ║                                                                            ║
 * ╚════════════════════════════════════════════════════════════════════════════╝
 */

Promise.resolve().then(function() {
  console.log('A');
  setTimeout(function() {
    console.log('B');
  }, 0);
});

setTimeout(function() {
  console.log('C');
  Promise.resolve().then(function() {
    console.log('D');
  });
}, 0);

console.log('E');

/**
 * OUTPUT:
 *   E
 *   A
 *   C
 *   D
 *   B
 *
 *
 * ╔════════════════════════════════════════════════════════════════════════════╗
 * ║ STEP-BY-STEP BREAKDOWN                                                     ║
 * ╠════════════════════════════════════════════════════════════════════════════╣
 * ║                                                                            ║
 * ║ PHASE 1: Synchronous code                                                  ║
 * ║ ─────────────────────────                                                  ║
 * ║ • Promise.then(A) → queued to microtask queue                              ║
 * ║ • setTimeout(C) → queued to macrotask queue                                ║
 * ║ • console.log('E') → Output: E                                             ║
 * ║                                                                            ║
 * ║ State: Microtasks: [A], Macrotasks: [C]                                    ║
 * ║                                                                            ║
 * ║                                                                            ║
 * ║ PHASE 2: Drain microtasks                                                  ║
 * ║ ─────────────────────────                                                  ║
 * ║ • Run 'A' callback                                                         ║
 * ║   - console.log('A') → Output: A                                           ║
 * ║   - setTimeout(B) → queued to macrotask queue                              ║
 * ║                                                                            ║
 * ║ State: Microtasks: [], Macrotasks: [C, B]                                  ║
 * ║                                                                            ║
 * ║                                                                            ║
 * ║ PHASE 3: Run one macrotask (C)                                             ║
 * ║ ───────────────────────────────                                            ║
 * ║ • Run 'C' callback                                                         ║
 * ║   - console.log('C') → Output: C                                           ║
 * ║   - Promise.then(D) → queued to microtask queue                            ║
 * ║                                                                            ║
 * ║ State: Microtasks: [D], Macrotasks: [B]                                    ║
 * ║                                                                            ║
 * ║                                                                            ║
 * ║ PHASE 4: Drain microtasks (after C)                                        ║
 * ║ ───────────────────────────────────                                        ║
 * ║ • Run 'D' callback                                                         ║
 * ║   - console.log('D') → Output: D                                           ║
 * ║                                                                            ║
 * ║ State: Microtasks: [], Macrotasks: [B]                                     ║
 * ║                                                                            ║
 * ║                                                                            ║
 * ║ PHASE 5: Run one macrotask (B)                                             ║
 * ║ ───────────────────────────────                                            ║
 * ║ • Run 'B' callback                                                         ║
 * ║   - console.log('B') → Output: B                                           ║
 * ║                                                                            ║
 * ╚════════════════════════════════════════════════════════════════════════════╝
 *
 *
 * ┌─────────────────────────────────────────────────────────────────────────────┐
 * │ VISUAL: Queue State Timeline                                                │
 * ├─────────────────────────────────────────────────────────────────────────────┤
 * │                                                                             │
 * │   TIME    OUTPUT    MICROTASK QUEUE    MACROTASK QUEUE                      │
 * │   ────    ──────    ───────────────    ───────────────                      │
 * │                                                                             │
 * │   T1      E         [A]                [C]                                  │
 * │           │                                                                 │
 * │   T2      A         []                 [C, B]                               │
 * │           │                                                                 │
 * │   T3      C         [D]                [B]                                  │
 * │           │                                                                 │
 * │   T4      D         []                 [B]                                  │
 * │           │                                                                 │
 * │   T5      B         []                 []                                   │
 * │                                                                             │
 * │                                                                             │
 * │   EVENT LOOP CYCLE:                                                         │
 * │   ┌─────────────────────────────────────────────────────────────────┐       │
 * │   │  Sync → ALL Micros → 1 Macro → ALL Micros → 1 Macro → ...      │       │
 * │   └─────────────────────────────────────────────────────────────────┘       │
 * │                                                                             │
 * └─────────────────────────────────────────────────────────────────────────────┘
 *
 *
 * ┌─────────────────────────────────────────────────────────────────────────────┐
 * │ WHY 'D' BEFORE 'B'?                                                         │
 * ├─────────────────────────────────────────────────────────────────────────────┤
 * │                                                                             │
 * │ Even though 'B' was scheduled first (during 'A' microtask):                 │
 * │                                                                             │
 * │   • 'B' is a macrotask (setTimeout)                                         │
 * │   • 'D' is a microtask (Promise.then)                                       │
 * │   • After macrotask 'C' runs, ALL microtasks must drain                     │
 * │   • So 'D' runs before 'B'                                                  │
 * │                                                                             │
 * │ Rule: Between each macrotask, the microtask queue is fully drained.         │
 * │                                                                             │
 * └─────────────────────────────────────────────────────────────────────────────┘
 *
 *
 * ┌─────────────────────────────────────────────────────────────────────────────┐
 * │ INTERVIEW ANSWER                                                            │
 * ├─────────────────────────────────────────────────────────────────────────────┤
 * │                                                                             │
 * │ "This example demonstrates the interleaving of microtasks and macrotasks.   │
 * │                                                                             │
 * │  The execution order:                                                       │
 * │  1. 'E' prints (sync)                                                       │
 * │  2. 'A' prints (microtask, which schedules 'B' as macrotask)                │
 * │  3. 'C' prints (first macrotask, which schedules 'D' as microtask)          │
 * │  4. 'D' prints (microtask created by 'C' - runs before next macro)          │
 * │  5. 'B' prints (second macrotask)                                           │
 * │                                                                             │
 * │  The key rule: after EACH macrotask, ALL microtasks are drained before      │
 * │  the next macrotask runs. This is why 'D' prints before 'B' - even though   │
 * │  'B' was scheduled first, 'D' is a microtask created during 'C', so it      │
 * │  has priority over the waiting macrotask 'B'."                              │
 * │                                                                             │
 * └─────────────────────────────────────────────────────────────────────────────┘
 *
 *
 * RUN: node docs/04-event-loop/06-settimeout-in-promise.js
 */
