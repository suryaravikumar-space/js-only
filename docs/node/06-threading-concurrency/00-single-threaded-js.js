/**
 * TOPIC 00: JavaScript is Single-Threaded
 *
 * ╔════════════════════════════════════════════════════════════════════════════╗
 * ║ THE GOLDEN RULE                                                          ║
 * ╠════════════════════════════════════════════════════════════════════════════╣
 * ║                                                                          ║
 * ║ JavaScript has ONE call stack and ONE thread of execution.               ║
 * ║ It can only do ONE thing at a time. The event loop + async callbacks     ║
 * ║ give the ILLUSION of multitasking, but JS itself never runs in parallel. ║
 * ║                                                                          ║
 * ╚════════════════════════════════════════════════════════════════════════════╝
 *
 *
 * ┌─────────────────────────────────────────────────────────────────────────────┐
 * │ STORY TO REMEMBER                                                          │
 * ├─────────────────────────────────────────────────────────────────────────────┤
 * │                                                                            │
 * │  Imagine a SHOP with ONE CASHIER. No matter how many customers walk in,   │
 * │  they all stand in a single queue. The cashier serves them ONE BY ONE.    │
 * │                                                                            │
 * │    Customer 1: "I want to buy milk"      → Cashier handles it             │
 * │    Customer 2: "I want bread"            → Waits in line                  │
 * │    Customer 3: "I want eggs"             → Waits behind Customer 2        │
 * │                                                                            │
 * │  But the cashier is SMART. If Customer 1 says "order a rare item from    │
 * │  warehouse", the cashier doesn't freeze. He says "I'll call you when     │
 * │  it arrives" (callback) and moves to Customer 2 immediately.             │
 * │                                                                            │
 * │  That's the EVENT LOOP - one cashier, never blocking, always moving.     │
 * │                                                                            │
 * └─────────────────────────────────────────────────────────────────────────────┘
 *
 *
 * ┌─────────────────────────────────────────────────────────────────────────────┐
 * │ VISUAL DIAGRAM: Single Thread Execution                                    │
 * ├─────────────────────────────────────────────────────────────────────────────┤
 * │                                                                            │
 * │   CALL STACK (one at a time)         EVENT LOOP                           │
 * │   ┌──────────────────┐                                                    │
 * │   │  main()          │──→ executes line by line                           │
 * │   │  console.log()   │──→ runs, pops off                                 │
 * │   │  setTimeout(cb)  │──→ registers cb with timer, pops off              │
 * │   │  console.log()   │──→ runs, pops off                                 │
 * │   │  (stack empty)   │                                                    │
 * │   └──────────────────┘                                                    │
 * │            │                                                              │
 * │            ▼                                                              │
 * │   ┌──────────────────┐    ┌──────────────────┐                           │
 * │   │ Event Loop checks│───▶│ Callback Queue   │                           │
 * │   │ "stack empty?"   │    │ [cb from timer]   │                           │
 * │   └──────────────────┘    └──────────────────┘                           │
 * │            │                       │                                      │
 * │            ▼                       ▼                                      │
 * │   ┌──────────────────┐                                                    │
 * │   │  cb()            │──→ now executes the callback                      │
 * │   └──────────────────┘                                                    │
 * │                                                                            │
 * └─────────────────────────────────────────────────────────────────────────────┘
 */

// ─── 1. Proving JS is single-threaded ───
const start = Date.now();

console.log('A:', 'Step 1 - Synchronous');
console.log('B:', 'Step 2 - Synchronous');

setTimeout(() => {
  console.log('D:', `Step 4 - Async callback (after ${Date.now() - start}ms)`);
}, 0);

console.log('C:', 'Step 3 - Synchronous (runs BEFORE setTimeout 0!)');

// ─── 2. Blocking the single thread ───
const blockThread = (ms) => {
  const end = Date.now() + ms;
  while (Date.now() < end) {} // busy wait - blocks everything
};

setTimeout(() => {
  console.log('F:', `This was delayed by the blocking code`);
}, 50);

console.log('E:', 'About to block for 200ms...');
blockThread(200);
console.log('G:', `Unblocked after 200ms. setTimeout(50) is LATE because thread was blocked.`);

// ─── 3. The call stack in action ───
const third = () => {
  console.log('H:', 'third() - top of stack');
};

const second = () => {
  console.log('I:', 'second() - calls third()');
  third();
};

const first = () => {
  console.log('J:', 'first() - calls second()');
  second();
};

first();

// ─── 4. Why single-thread works for I/O ───
const fs = require('fs');

console.log('K:', 'Reading file async - thread is FREE while waiting');
fs.readFile(__filename, 'utf8', (err, data) => {
  console.log('L:', `File read complete: ${data.length} characters`);
});
console.log('M:', 'This runs BEFORE file read finishes (non-blocking)');

/**
 * OUTPUT:
 *   A: Step 1 - Synchronous
 *   B: Step 2 - Synchronous
 *   C: Step 3 - Synchronous (runs BEFORE setTimeout 0!)
 *   E: About to block for 200ms...
 *   G: Unblocked after 200ms. setTimeout(50) is LATE because thread was blocked.
 *   J: first() - calls second()
 *   I: second() - calls third()
 *   H: third() - top of stack
 *   K: Reading file async - thread is FREE while waiting
 *   M: This runs BEFORE file read finishes (non-blocking)
 *   D: Step 4 - Async callback (after ~200ms)
 *   F: This was delayed by the blocking code
 *   L: File read complete: XXXX characters
 *
 *
 * ┌─────────────────────────────────────────────────────────────────────────────┐
 * │ INTERVIEW ANSWER                                                           │
 * ├─────────────────────────────────────────────────────────────────────────────┤
 * │                                                                            │
 * │ "JavaScript is single-threaded - it has one call stack and executes one   │
 * │  operation at a time. The event loop enables non-blocking behavior by     │
 * │  offloading I/O operations to the OS or libuv thread pool, then picking  │
 * │  up their callbacks when the stack is empty. This works great for I/O     │
 * │  because the thread isn't waiting - it's serving other requests. But      │
 * │  CPU-heavy synchronous code BLOCKS everything since there's only one     │
 * │  thread. That's why we never do heavy computation on the main thread."   │
 * │                                                                            │
 * └─────────────────────────────────────────────────────────────────────────────┘
 *
 *
 * RUN: node docs/node/06-threading-concurrency/00-single-threaded-js.js
 */
