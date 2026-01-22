/**
 * CHALLENGE 01: setTimeout Order
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

setTimeout(function() {
  console.log('A');
}, 100);

setTimeout(function() {
  console.log('B');
}, 0);

setTimeout(function() {
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
 * ┌─────────────────────────────────────────────────────────────────────────────┐
 * │ INTERVIEW ANSWER                                                            │
 * ├─────────────────────────────────────────────────────────────────────────────┤
 * │                                                                             │
 * │ "When multiple setTimeouts are registered, their callbacks are added        │
 * │  to the task queue based on their delay times. Shorter delays fire first.   │
 * │                                                                             │
 * │  In this example, all three timers start simultaneously when registered.    │
 * │  After 'D' prints (sync), the timers fire in delay order:                   │
 * │  - B at ~0ms                                                                │
 * │  - C at ~50ms                                                               │
 * │  - A at ~100ms                                                              │
 * │                                                                             │
 * │  The key point is that synchronous code always runs first. 'D' prints       │
 * │  before any setTimeout callback, regardless of the 0ms delay on 'B'.        │
 * │  The delay is the minimum wait time after sync code completes."             │
 * │                                                                             │
 * └─────────────────────────────────────────────────────────────────────────────┘
 *
 *
 * RUN: node docs/04-event-loop/01-settimeout-order.js
 */
