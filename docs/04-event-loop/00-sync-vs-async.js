/**
 * CHALLENGE 00: Synchronous vs Asynchronous
 *
 * ╔════════════════════════════════════════════════════════════════════════════╗
 * ║ THE GOLDEN RULE                                                            ║
 * ╠════════════════════════════════════════════════════════════════════════════╣
 * ║                                                                            ║
 * ║ JavaScript is SINGLE-THREADED but NON-BLOCKING.                            ║
 * ║                                                                            ║
 * ║   Synchronous code:  Executes line by line, blocks until done              ║
 * ║   Asynchronous code: Scheduled to run later, doesn't block                 ║
 * ║                                                                            ║
 * ║ ALL synchronous code runs FIRST, then async callbacks execute.             ║
 * ║                                                                            ║
 * ╚════════════════════════════════════════════════════════════════════════════╝
 */

console.log('A');

setTimeout(function() {
  console.log('B');
}, 0);

console.log('C');

/**
 * OUTPUT:
 *   A
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
 * ║    • setTimeout is an async Web API                                        ║
 * ║    • The callback is sent to the browser/Node timer                        ║
 * ║    • Even with 0ms delay, it goes to the task queue                        ║
 * ║    • Does NOT execute now - scheduled for later                            ║
 * ║                                                                            ║
 * ║                                                                            ║
 * ║ 3. console.log('C')                                                        ║
 * ║ ───────────────────                                                        ║
 * ║    • Synchronous - executes immediately                                    ║
 * ║    • Output: C                                                             ║
 * ║                                                                            ║
 * ║                                                                            ║
 * ║ 4. Call stack is empty                                                     ║
 * ║ ──────────────────────                                                     ║
 * ║    • Event loop checks the task queue                                      ║
 * ║    • Finds setTimeout callback                                             ║
 * ║    • Moves it to call stack and executes                                   ║
 * ║    • Output: B                                                             ║
 * ║                                                                            ║
 * ╚════════════════════════════════════════════════════════════════════════════╝
 *
 *
 * ┌─────────────────────────────────────────────────────────────────────────────┐
 * │ VISUAL: Event Loop Basics                                                   │
 * ├─────────────────────────────────────────────────────────────────────────────┤
 * │                                                                             │
 * │   ┌─────────────────┐         ┌─────────────────┐                           │
 * │   │   CALL STACK    │         │    WEB APIs     │                           │
 * │   │                 │         │    (Browser)    │                           │
 * │   │ console.log('A')│ ───────►│                 │                           │
 * │   │ setTimeout(...)│ ────────►│  Timer: 0ms    │                           │
 * │   │ console.log('C')│         │       │         │                           │
 * │   │                 │         │       ▼         │                           │
 * │   └─────────────────┘         └─────────────────┘                           │
 * │           ▲                           │                                     │
 * │           │                           │                                     │
 * │           │    ┌──────────────────────┘                                     │
 * │           │    │                                                            │
 * │           │    ▼                                                            │
 * │   ┌─────────────────┐                                                       │
 * │   │   TASK QUEUE    │◄──── callback: () => console.log('B')                 │
 * │   │   (Macrotask)   │                                                       │
 * │   └─────────────────┘                                                       │
 * │                                                                             │
 * │   EVENT LOOP: When call stack is empty, move tasks from queue to stack      │
 * │                                                                             │
 * └─────────────────────────────────────────────────────────────────────────────┘
 *
 *
 * ┌─────────────────────────────────────────────────────────────────────────────┐
 * │ KEY INSIGHT: setTimeout(fn, 0) !== "run immediately"                        │
 * ├─────────────────────────────────────────────────────────────────────────────┤
 * │                                                                             │
 * │ setTimeout(fn, 0) means:                                                    │
 * │   "Run this callback as soon as possible, but AFTER all sync code"          │
 * │                                                                             │
 * │ The 0ms is the MINIMUM delay, not exact timing.                             │
 * │ The callback must wait for:                                                 │
 * │   1. Current synchronous code to complete                                   │
 * │   2. Call stack to be empty                                                 │
 * │   3. Any earlier queued tasks                                               │
 * │                                                                             │
 * └─────────────────────────────────────────────────────────────────────────────┘
 *
 *
 * ┌─────────────────────────────────────────────────────────────────────────────┐
 * │ INTERVIEW ANSWER                                                            │
 * ├─────────────────────────────────────────────────────────────────────────────┤
 * │                                                                             │
 * │ "JavaScript is single-threaded, meaning it has one call stack and           │
 * │  executes code line by line. However, it handles async operations           │
 * │  through the event loop.                                                    │
 * │                                                                             │
 * │  In this example, console.log('A') runs first (sync), then setTimeout       │
 * │  registers its callback with the browser's timer API and continues.         │
 * │  console.log('C') runs next (sync).                                         │
 * │                                                                             │
 * │  Even with a 0ms delay, the setTimeout callback must wait in the task       │
 * │  queue until the call stack is empty. Only then does the event loop         │
 * │  move the callback to the stack, printing 'B'.                              │
 * │                                                                             │
 * │  This is why the output is A, C, B - all synchronous code runs first,       │
 * │  then async callbacks are processed."                                       │
 * │                                                                             │
 * └─────────────────────────────────────────────────────────────────────────────┘
 *
 *
 * RUN: node docs/04-event-loop/00-sync-vs-async.js
 */
