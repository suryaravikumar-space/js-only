/**
 * CHALLENGE 09: setInterval Behavior
 *
 * ╔════════════════════════════════════════════════════════════════════════════╗
 * ║ THE GOLDEN RULE                                                            ║
 * ╠════════════════════════════════════════════════════════════════════════════╣
 * ║                                                                            ║
 * ║ setInterval schedules repeated callbacks at fixed intervals.               ║
 * ║                                                                            ║
 * ║   • Each callback is a macrotask                                           ║
 * ║   • clearInterval(id) stops future callbacks                               ║
 * ║   • Intervals are NOT guaranteed to be exact (event loop delays)           ║
 * ║   • If callback takes longer than interval, callbacks can stack up         ║
 * ║                                                                            ║
 * ╚════════════════════════════════════════════════════════════════════════════╝
 */

var count = 0;

var id = setInterval(function() {
  count++;
  console.log('Tick:', count);

  if (count >= 3) {
    clearInterval(id);
    console.log('Done');
  }
}, 50);

console.log('Started');

/**
 * OUTPUT (after ~250ms):
 *   Started
 *   Tick: 1
 *   Tick: 2
 *   Tick: 3
 *   Done
 *
 *
 * ╔════════════════════════════════════════════════════════════════════════════╗
 * ║ STEP-BY-STEP BREAKDOWN                                                     ║
 * ╠════════════════════════════════════════════════════════════════════════════╣
 * ║                                                                            ║
 * ║ 1. setInterval is registered                                               ║
 * ║ ─────────────────────────────                                              ║
 * ║    • Timer starts, will fire every 50ms                                    ║
 * ║    • Returns interval ID for later clearing                                ║
 * ║                                                                            ║
 * ║                                                                            ║
 * ║ 2. console.log('Started')                                                  ║
 * ║ ─────────────────────────                                                  ║
 * ║    • Synchronous - executes immediately                                    ║
 * ║    • Output: Started                                                       ║
 * ║                                                                            ║
 * ║                                                                            ║
 * ║ 3. ~50ms later - First interval callback                                   ║
 * ║ ─────────────────────────────────────────                                  ║
 * ║    • count = 1                                                             ║
 * ║    • Output: Tick: 1                                                       ║
 * ║    • count < 3, continue                                                   ║
 * ║                                                                            ║
 * ║                                                                            ║
 * ║ 4. ~100ms later - Second interval callback                                 ║
 * ║ ──────────────────────────────────────────                                 ║
 * ║    • count = 2                                                             ║
 * ║    • Output: Tick: 2                                                       ║
 * ║    • count < 3, continue                                                   ║
 * ║                                                                            ║
 * ║                                                                            ║
 * ║ 5. ~150ms later - Third interval callback                                  ║
 * ║ ─────────────────────────────────────────                                  ║
 * ║    • count = 3                                                             ║
 * ║    • Output: Tick: 3                                                       ║
 * ║    • count >= 3, clearInterval(id)                                         ║
 * ║    • Output: Done                                                          ║
 * ║    • No more callbacks                                                     ║
 * ║                                                                            ║
 * ╚════════════════════════════════════════════════════════════════════════════╝
 *
 *
 * ┌─────────────────────────────────────────────────────────────────────────────┐
 * │ VISUAL: setInterval Timeline                                                │
 * ├─────────────────────────────────────────────────────────────────────────────┤
 * │                                                                             │
 * │   TIME:  0ms      50ms     100ms    150ms    200ms                          │
 * │          │        │        │        │        │                              │
 * │          ▼        ▼        ▼        ▼        │                              │
 * │   ───────┬────────┬────────┬────────┬────────┴────────►                     │
 * │          │        │        │        │                                       │
 * │      Started   Tick:1   Tick:2   Tick:3                                     │
 * │       (sync)  (macro)  (macro)  (macro)                                     │
 * │                                    │                                        │
 * │                                    └─→ clearInterval()                      │
 * │                                        Done                                 │
 * │                                        (no more ticks)                      │
 * │                                                                             │
 * └─────────────────────────────────────────────────────────────────────────────┘
 *
 *
 * ┌─────────────────────────────────────────────────────────────────────────────┐
 * │ setInterval vs setTimeout                                                   │
 * ├─────────────────────────────────────────────────────────────────────────────┤
 * │                                                                             │
 * │ setTimeout(fn, delay)                                                       │
 * │   • Runs ONCE after delay                                                   │
 * │   • Returns timeout ID                                                      │
 * │   • clearTimeout(id) cancels                                                │
 * │                                                                             │
 * │ setInterval(fn, interval)                                                   │
 * │   • Runs REPEATEDLY at interval                                             │
 * │   • Returns interval ID                                                     │
 * │   • clearInterval(id) stops                                                 │
 * │                                                                             │
 * │                                                                             │
 * │ RECURSIVE setTimeout PATTERN (often preferred):                             │
 * │                                                                             │
 * │   function tick() {                                                         │
 * │     console.log('Tick');                                                    │
 * │     setTimeout(tick, 50);  // Schedule next AFTER this completes            │
 * │   }                                                                         │
 * │   tick();                                                                   │
 * │                                                                             │
 * │ Benefits:                                                                   │
 * │   • Guarantees minimum gap between callbacks                                │
 * │   • Avoids callback stacking if execution takes long                        │
 * │                                                                             │
 * └─────────────────────────────────────────────────────────────────────────────┘
 *
 *
 * ┌─────────────────────────────────────────────────────────────────────────────┐
 * │ IMPORTANT: Timing is NOT Guaranteed                                         │
 * ├─────────────────────────────────────────────────────────────────────────────┤
 * │                                                                             │
 * │ setInterval(fn, 50) does NOT guarantee exactly 50ms intervals:              │
 * │                                                                             │
 * │   • If call stack is busy, callback waits in queue                          │
 * │   • Browser tabs in background may be throttled                             │
 * │   • Minimum timer resolution varies (~4ms in browsers)                      │
 * │                                                                             │
 * │ Example of callback stacking:                                               │
 * │                                                                             │
 * │   setInterval(() => {                                                       │
 * │     // Takes 100ms to execute                                               │
 * │     heavyComputation();                                                     │
 * │   }, 50);                                                                   │
 * │                                                                             │
 * │   // Callbacks pile up! Each 50ms a new one queues,                         │
 * │   // but each takes 100ms to run.                                           │
 * │                                                                             │
 * └─────────────────────────────────────────────────────────────────────────────┘
 *
 *
 * ┌─────────────────────────────────────────────────────────────────────────────┐
 * │ INTERVIEW ANSWER                                                            │
 * ├─────────────────────────────────────────────────────────────────────────────┤
 * │                                                                             │
 * │ "setInterval schedules a callback to run repeatedly at a specified          │
 * │  interval. Each callback execution is a macrotask.                          │
 * │                                                                             │
 * │  In this example:                                                           │
 * │  1. 'Started' prints immediately (sync)                                     │
 * │  2. Every ~50ms, the callback runs, incrementing count                      │
 * │  3. When count reaches 3, clearInterval stops future callbacks              │
 * │                                                                             │
 * │  Important considerations:                                                  │
 * │  - Timing isn't exact - callbacks wait in the macrotask queue               │
 * │  - If callbacks take longer than the interval, they can pile up             │
 * │  - Recursive setTimeout is often preferred for guaranteed gaps              │
 * │  - Always store the ID to clear intervals when done                         │
 * │                                                                             │
 * │  The pattern of checking a condition and calling clearInterval is           │
 * │  common for controlled repetition with a stop condition."                   │
 * │                                                                             │
 * └─────────────────────────────────────────────────────────────────────────────┘
 *
 *
 * RUN: node docs/04-event-loop/09-setinterval.js
 */
