/**
 * TOPIC: Synchronous vs Asynchronous
 *
 * STORY: Imagine a restaurant with ONE waiter (single thread). Synchronous
 * is like the waiter taking an order, going to the kitchen, WAITING for the
 * food, then coming back — no one else gets served. Asynchronous is like the
 * waiter taking the order, handing it to the kitchen, and immediately going
 * to serve the next table. When the food is ready, the kitchen rings a bell
 * (callback) and the waiter delivers it.
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

setTimeout(() => {
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
 * INTERVIEW QUESTIONS:
 *
 * Q1: What is the difference between synchronous and asynchronous code in JS?
 * A1: Synchronous code executes line by line, blocking until each operation
 *     completes. Asynchronous code is scheduled to run later via the event
 *     loop, allowing the main thread to continue without blocking.
 *
 * Q2: Why does setTimeout(fn, 0) not execute immediately?
 * A2: Even with a 0ms delay, the callback is placed in the task queue. It
 *     must wait for all synchronous code to finish and the call stack to be
 *     empty before the event loop moves it onto the stack for execution.
 *
 * Q3: What does "single-threaded but non-blocking" mean?
 * A3: JavaScript has only one call stack (single-threaded), so it can run
 *     one piece of code at a time. However, it delegates async operations
 *     (timers, network) to browser/Node APIs and uses the event loop to
 *     process their callbacks later, making it non-blocking.
 *
 *
 * RUN: node docs/javascript/04-event-loop/00-sync-vs-async.js
 */
