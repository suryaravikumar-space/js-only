/**
 * TOPIC: setTimeout Order
 *
 * STORY: Think of three packages shipped at the same time from different
 * distances. Package B is local (0ms), Package C is from the next city
 * (50ms), and Package A is from overseas (100ms). Even though they were
 * all shipped together, they arrive in order of distance — B first, then
 * C, then A. And the mailman (sync code) always finishes his current
 * round before checking the mailbox.
 *
 * ╔════════════════════════════════════════════════════════════════════════════╗
 * ║ THE GOLDEN RULE                                                            ║
 * ╠════════════════════════════════════════════════════════════════════════════╣
 * ║                                                                            ║
 * ║ Multiple setTimeouts are ordered by their delay times.                     ║
 * ║                                                                            ║
 * ║   • Shorter delays fire first                                              ║
 * ║   • Equal delays fire in registration order                                ║
 * ║   • ALL wait for synchronous code to complete first                        ║
 * ║                                                                            ║
 * ╚════════════════════════════════════════════════════════════════════════════╝
 */

setTimeout(() => {
  console.log('A');
}, 100);

setTimeout(() => {
  console.log('B');
}, 0);

setTimeout(() => {
  console.log('C');
}, 50);

console.log('D');

/**
 * OUTPUT:
 *   D
 *   B
 *   C
 *   A
 *
 *
 * ╔════════════════════════════════════════════════════════════════════════════╗
 * ║ STEP-BY-STEP BREAKDOWN                                                     ║
 * ╠════════════════════════════════════════════════════════════════════════════╣
 * ║                                                                            ║
 * ║ 1. setTimeout('A', 100ms) - registered, timer starts                       ║
 * ║ 2. setTimeout('B', 0ms) - registered, timer starts                         ║
 * ║ 3. setTimeout('C', 50ms) - registered, timer starts                        ║
 * ║ 4. console.log('D') - SYNC, executes immediately → Output: D               ║
 * ║                                                                            ║
 * ║ All sync code done. Now timers fire in order:                              ║
 * ║                                                                            ║
 * ║ 5. ~0ms:   'B' timer fires → Output: B                                     ║
 * ║ 6. ~50ms:  'C' timer fires → Output: C                                     ║
 * ║ 7. ~100ms: 'A' timer fires → Output: A                                     ║
 * ║                                                                            ║
 * ╚════════════════════════════════════════════════════════════════════════════╝
 *
 *
 * ┌─────────────────────────────────────────────────────────────────────────────┐
 * │ VISUAL: Timer Queue Timeline                                                │
 * ├─────────────────────────────────────────────────────────────────────────────┤
 * │                                                                             │
 * │   TIME 0ms (sync code executing):                                           │
 * │   ┌─────────────────────────────────────────────────────────────────┐       │
 * │   │ Call Stack: console.log('D')                                    │       │
 * │   └─────────────────────────────────────────────────────────────────┘       │
 * │                                                                             │
 * │   Timer API:                                                                │
 * │   ┌──────────┬──────────┬──────────┐                                        │
 * │   │ 'B' 0ms  │ 'C' 50ms │ 'A' 100ms│                                        │
 * │   └──────────┴──────────┴──────────┘                                        │
 * │                                                                             │
 * │   TIMELINE:                                                                 │
 * │   ─────────────────────────────────────────────────────────────────►        │
 * │   0ms        50ms       100ms                                               │
 * │   │          │          │                                                   │
 * │   ▼          ▼          ▼                                                   │
 * │   'B'        'C'        'A'                                                 │
 * │                                                                             │
 * │   OUTPUT ORDER: D (sync) → B (0ms) → C (50ms) → A (100ms)                   │
 * │                                                                             │
 * └─────────────────────────────────────────────────────────────────────────────┘
 *
 *
 * ┌─────────────────────────────────────────────────────────────────────────────┐
 * │ IMPORTANT NOTES                                                             │
 * ├─────────────────────────────────────────────────────────────────────────────┤
 * │                                                                             │
 * │ 1. MINIMUM DELAY                                                            │
 * │    Timer delays are minimums, not guarantees.                               │
 * │    If call stack is busy, callbacks wait longer.                            │
 * │                                                                             │
 * │ 2. REGISTRATION ORDER for same delays                                       │
 * │    setTimeout(() => console.log('X'), 0);                                   │
 * │    setTimeout(() => console.log('Y'), 0);                                   │
 * │    // Output: X, Y (registration order)                                     │
 * │                                                                             │
 * │ 3. BROWSER MINIMUM DELAY                                                    │
 * │    Nested setTimeouts (depth > 4) have ~4ms minimum delay.                  │
 * │    This is a browser optimization.                                          │
 * │                                                                             │
 * └─────────────────────────────────────────────────────────────────────────────┘
 *
 *
 * INTERVIEW QUESTIONS:
 *
 * Q1: How does JavaScript order multiple setTimeout callbacks?
 * A1: Callbacks are placed in the task queue based on their delay. Shorter
 *     delays fire first. For equal delays, they fire in registration order.
 *     All must wait for synchronous code to finish first.
 *
 * Q2: Is the delay in setTimeout a guaranteed execution time?
 * A2: No, it is a minimum delay. The callback must wait for the call stack
 *     to be empty and any earlier queued tasks to complete. If the main
 *     thread is busy, the actual delay can be longer than specified.
 *
 * Q3: What is the browser's minimum delay for nested setTimeouts?
 * A3: After 4 levels of nesting, browsers enforce a minimum ~4ms delay.
 *     This is a browser optimization to prevent CPU-intensive tight loops.
 *
 *
 * RUN: node docs/javascript/04-event-loop/01-settimeout-order.js
 */
