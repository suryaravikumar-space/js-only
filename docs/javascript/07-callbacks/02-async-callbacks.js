/**
 * CHALLENGE 02: Asynchronous Callbacks
 *
 * ╔════════════════════════════════════════════════════════════════════════════╗
 * ║ THE GOLDEN RULE                                                            ║
 * ╠════════════════════════════════════════════════════════════════════════════╣
 * ║                                                                            ║
 * ║ Asynchronous callbacks are scheduled to run LATER, after the current       ║
 * ║ synchronous code completes. They don't block execution.                    ║
 * ║                                                                            ║
 * ║   setTimeout(fn, 0)  → fn runs AFTER all sync code, even with 0ms delay    ║
 * ║                                                                            ║
 * ╚════════════════════════════════════════════════════════════════════════════╝
 */

console.log('A:', 'Start');

// setTimeout - executes callback after delay
setTimeout(() => {
  console.log('B:', 'Timeout 1 (100ms)');
}, 100);

setTimeout(() => {
  console.log('C:', 'Timeout 2 (0ms)');
}, 0);

// setImmediate equivalent with setTimeout 0
setTimeout(() => {
  console.log('D:', 'Timeout 3 (0ms)');
}, 0);

console.log('E:', 'End');

/**
 * OUTPUT:
 *   A: Start
 *   E: End
 *   C: Timeout 2 (0ms)
 *   D: Timeout 3 (0ms)
 *   B: Timeout 1 (100ms)
 *
 *
 * ╔════════════════════════════════════════════════════════════════════════════╗
 * ║ STEP-BY-STEP BREAKDOWN                                                     ║
 * ╠════════════════════════════════════════════════════════════════════════════╣
 * ║                                                                            ║
 * ║ 1. "Start" logs immediately (sync)                                         ║
 * ║ 2. setTimeout(100ms) schedules callback → goes to timer queue              ║
 * ║ 3. setTimeout(0ms) schedules callback → goes to timer queue                ║
 * ║ 4. setTimeout(0ms) schedules callback → goes to timer queue                ║
 * ║ 5. "End" logs immediately (sync)                                           ║
 * ║ 6. Call stack empty → Event loop checks queues                             ║
 * ║ 7. 0ms timers fire first (C, D) in order they were registered              ║
 * ║ 8. 100ms timer fires last (B)                                              ║
 * ║                                                                            ║
 * ║   ┌─────────────────────────────────────────────────────────────────────┐  ║
 * ║   │  TIMELINE                                                           │  ║
 * ║   │                                                                     │  ║
 * ║   │  0ms:    A, E (sync code runs)                                      │  ║
 * ║   │  ~4ms:   C, D (0ms timers have minimum ~4ms delay)                  │  ║
 * ║   │  100ms:  B (100ms timer fires)                                      │  ║
 * ║   │                                                                     │  ║
 * ║   └─────────────────────────────────────────────────────────────────────┘  ║
 * ║                                                                            ║
 * ╚════════════════════════════════════════════════════════════════════════════╝
 *
 *
 * ┌─────────────────────────────────────────────────────────────────────────────┐
 * │ INTERVIEW ANSWER                                                            │
 * ├─────────────────────────────────────────────────────────────────────────────┤
 * │                                                                             │
 * │ "Even setTimeout with 0ms delay doesn't run immediately. It schedules      │
 * │  the callback to run after the current synchronous code completes and      │
 * │  the call stack is empty. The event loop then picks it up from the         │
 * │  callback queue. This is why 'End' prints before any timeout callbacks."   │
 * │                                                                             │
 * └─────────────────────────────────────────────────────────────────────────────┘
 *
 *
 * RUN: node docs/05-callbacks/02-async-callbacks.js
 */
