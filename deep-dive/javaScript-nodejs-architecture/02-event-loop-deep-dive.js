/**
 * ═══════════════════════════════════════════════════════════════════════════
 * FILE 2: NODE.JS EVENT LOOP DEEP DIVE
 * ═══════════════════════════════════════════════════════════════════════════
 *
 * The event loop is the heart of Node.js. Understanding its phases and
 * behavior is essential for writing performant Node.js applications.
 *
 * INTERVIEW CONTEXT:
 * Event loop questions are VERY common in Node.js interviews. You should know:
 * - All 6 phases and their order
 * - Difference between microtasks and macrotasks
 * - When to use setImmediate vs setTimeout vs process.nextTick
 *
 * TOPICS COVERED:
 * 1. Event Loop Phases
 * 2. Timers Phase
 * 3. I/O Callbacks Phase
 * 4. Poll Phase
 * 5. Check Phase (setImmediate)
 * 6. Close Callbacks Phase
 * 7. Microtasks (nextTick, Promises)
 */

console.log("═══════════════════════════════════════════════════════════════");
console.log("        FILE 2: NODE.JS EVENT LOOP DEEP DIVE");
console.log("═══════════════════════════════════════════════════════════════\n");

/**
 * ┌──────────────────────────────────────────────────────────────────────────┐
 * │                    NODE.JS EVENT LOOP PHASES                             │
 * ├──────────────────────────────────────────────────────────────────────────┤
 * │                                                                          │
 * │   The event loop processes callbacks in specific phases, each with      │
 * │   a FIFO queue. Microtasks run BETWEEN each phase.                      │
 * │                                                                          │
 * │   ┌────────────────────────────────────────────────────────────────┐    │
 * │   │                                                                  │    │
 * │   │   ┌─────────────────┐                                           │    │
 * │   │   │    TIMERS       │  setTimeout, setInterval callbacks       │    │
 * │   │   └────────┬────────┘                                           │    │
 * │   │            │                                                     │    │
 * │   │   [Process nextTick queue & Promise microtasks]                │    │
 * │   │            │                                                     │    │
 * │   │            ▼                                                     │    │
 * │   │   ┌─────────────────┐                                           │    │
 * │   │   │  PENDING I/O    │  Deferred I/O callbacks                  │    │
 * │   │   │   CALLBACKS     │  (TCP errors, etc.)                      │    │
 * │   │   └────────┬────────┘                                           │    │
 * │   │            │                                                     │    │
 * │   │   [Process nextTick queue & Promise microtasks]                │    │
 * │   │            │                                                     │    │
 * │   │            ▼                                                     │    │
 * │   │   ┌─────────────────┐                                           │    │
 * │   │   │   IDLE, PREPARE │  Internal use only                       │    │
 * │   │   └────────┬────────┘                                           │    │
 * │   │            │                                                     │    │
 * │   │   [Process nextTick queue & Promise microtasks]                │    │
 * │   │            │                                                     │    │
 * │   │            ▼                                                     │    │
 * │   │   ┌─────────────────┐                                           │    │
 * │   │   │      POLL       │  Retrieve new I/O events                 │    │
 * │   │   │                 │  Execute I/O callbacks                   │    │
 * │   │   │                 │  (May block here if no timers)           │    │
 * │   │   └────────┬────────┘                                           │    │
 * │   │            │                                                     │    │
 * │   │   [Process nextTick queue & Promise microtasks]                │    │
 * │   │            │                                                     │    │
 * │   │            ▼                                                     │    │
 * │   │   ┌─────────────────┐                                           │    │
 * │   │   │     CHECK       │  setImmediate callbacks                  │    │
 * │   │   └────────┬────────┘                                           │    │
 * │   │            │                                                     │    │
 * │   │   [Process nextTick queue & Promise microtasks]                │    │
 * │   │            │                                                     │    │
 * │   │            ▼                                                     │    │
 * │   │   ┌─────────────────┐                                           │    │
 * │   │   │ CLOSE CALLBACKS │  socket.on('close'), etc.                │    │
 * │   │   └────────┬────────┘                                           │    │
 * │   │            │                                                     │    │
 * │   │   [Process nextTick queue & Promise microtasks]                │    │
 * │   │            │                                                     │    │
 * │   │            └─────────────► Loop back to TIMERS                  │    │
 * │   │                                                                  │    │
 * │   └────────────────────────────────────────────────────────────────┘    │
 * │                                                                          │
 * └──────────────────────────────────────────────────────────────────────────┘
 */

console.log("╔════════════════════════════════════════════════════════════════╗");
console.log("║          PHASE 1: TIMERS                                       ║");
console.log("╚════════════════════════════════════════════════════════════════╝\n");

/**
 * ┌──────────────────────────────────────────────────────────────────────────┐
 * │                    TIMERS PHASE                                          │
 * ├──────────────────────────────────────────────────────────────────────────┤
 * │                                                                          │
 * │  Executes callbacks scheduled by setTimeout() and setInterval().        │
 * │                                                                          │
 * │  IMPORTANT: Timer thresholds are MINIMUM delays, not guaranteed.        │
 * │                                                                          │
 * │  ┌────────────────────────────────────────────────────────────────┐     │
 * │  │                                                                  │     │
 * │  │   setTimeout(() => {}, 100)                                     │     │
 * │  │        │                                                         │     │
 * │  │        │  At t=0, timer is scheduled                            │     │
 * │  │        │                                                         │     │
 * │  │        │  At t=100ms:                                           │     │
 * │  │        │  ┌─────────────────────────────────────────────────┐   │     │
 * │  │        │  │ • Timer is ready to execute                     │   │     │
 * │  │        │  │ • BUT won't run until event loop reaches        │   │     │
 * │  │        │  │   timers phase AND has time                     │   │     │
 * │  │        │  │ • Actual execution might be at t=105ms          │   │     │
 * │  │        │  └─────────────────────────────────────────────────┘   │     │
 * │  │        │                                                         │     │
 * │  │        ▼                                                         │     │
 * │  │   Actual execution (≥ 100ms, not exactly 100ms)                 │     │
 * │  │                                                                  │     │
 * │  └────────────────────────────────────────────────────────────────┘     │
 * │                                                                          │
 * └──────────────────────────────────────────────────────────────────────────┘
 */

console.log("Timers Phase - setTimeout & setInterval:");
console.log("─".repeat(50));

// Demonstrate timer imprecision
console.log("\n  Timer Precision Test:");

const timerStart = Date.now();
setTimeout(() => {
    const elapsed = Date.now() - timerStart;
    console.log(`  setTimeout(0) actually ran after: ${elapsed}ms`);
}, 0);

setTimeout(() => {
    const elapsed = Date.now() - timerStart;
    console.log(`  setTimeout(100) actually ran after: ${elapsed}ms`);
}, 100);

// setInterval example
console.log("\n  setInterval behavior:");
let intervalCount = 0;
const intervalId = setInterval(() => {
    intervalCount++;
    console.log(`  Interval tick ${intervalCount}`);
    if (intervalCount >= 3) {
        clearInterval(intervalId);
        console.log("  Interval cleared after 3 ticks");
    }
}, 50);

console.log("\n╔════════════════════════════════════════════════════════════════╗");
console.log("║          PHASE 4: POLL                                         ║");
console.log("╚════════════════════════════════════════════════════════════════╝\n");

/**
 * ┌──────────────────────────────────────────────────────────────────────────┐
 * │                    POLL PHASE                                            │
 * ├──────────────────────────────────────────────────────────────────────────┤
 * │                                                                          │
 * │  The poll phase is WHERE Node.js spends most of its time.               │
 * │                                                                          │
 * │  TWO MAIN FUNCTIONS:                                                    │
 * │  1. Calculate how long to block and wait for I/O                        │
 * │  2. Process events in the poll queue                                    │
 * │                                                                          │
 * │  ┌────────────────────────────────────────────────────────────────┐     │
 * │  │                                                                  │     │
 * │  │   Event loop enters POLL phase                                  │     │
 * │  │                    │                                             │     │
 * │  │                    ▼                                             │     │
 * │  │   ┌────────────────────────────────────────┐                    │     │
 * │  │   │  Is poll queue empty?                   │                    │     │
 * │  │   └─────────────┬──────────────────────────┘                    │     │
 * │  │            NO   │   YES                                          │     │
 * │  │     ┌───────────┴───────────┐                                   │     │
 * │  │     │                       │                                   │     │
 * │  │     ▼                       ▼                                   │     │
 * │  │ ┌──────────────┐   ┌───────────────────────────────────┐       │     │
 * │  │ │ Execute all  │   │  Check for setImmediate:          │       │     │
 * │  │ │ callbacks in │   │  • If yes: go to CHECK phase      │       │     │
 * │  │ │ poll queue   │   │  • If no: wait for callbacks      │       │     │
 * │  │ └──────────────┘   │         OR timer threshold        │       │     │
 * │  │                    └───────────────────────────────────┘       │     │
 * │  │                                                                  │     │
 * │  └────────────────────────────────────────────────────────────────┘     │
 * │                                                                          │
 * │  I/O CALLBACKS PROCESSED HERE:                                          │
 * │  • File operations (fs.readFile callback)                               │
 * │  • Network operations (HTTP response)                                   │
 * │  • Database query results                                               │
 * │                                                                          │
 * └──────────────────────────────────────────────────────────────────────────┘
 */

const fs = require('fs');
const path = require('path');

console.log("Poll Phase - I/O Operations:");
console.log("─".repeat(50));

// Demonstrate I/O callback timing
console.log("\n  I/O Callback Example:");

const testFile = path.join(__dirname, '02-event-loop-deep-dive.js');

fs.readFile(testFile, 'utf8', (err, data) => {
    if (err) {
        console.log(`  File read error: ${err.message}`);
        return;
    }
    console.log(`  fs.readFile callback - Read ${data.length} characters`);
    console.log("  (This ran in the POLL phase)");
});

console.log("  fs.readFile called (async - callback will run in poll phase)");

console.log("\n╔════════════════════════════════════════════════════════════════╗");
console.log("║          PHASE 5: CHECK (setImmediate)                         ║");
console.log("╚════════════════════════════════════════════════════════════════╝\n");

/**
 * ┌──────────────────────────────────────────────────────────────────────────┐
 * │                    CHECK PHASE (setImmediate)                            │
 * ├──────────────────────────────────────────────────────────────────────────┤
 * │                                                                          │
 * │  setImmediate() executes callbacks immediately AFTER the poll phase.    │
 * │                                                                          │
 * │  setImmediate vs setTimeout(fn, 0):                                     │
 * │  ─────────────────────────────────                                      │
 * │                                                                          │
 * │  CONTEXT MATTERS:                                                       │
 * │                                                                          │
 * │  1. In I/O callback: setImmediate ALWAYS runs first                     │
 * │     ┌─────────────────────────────────────────────────────────────┐    │
 * │     │  fs.readFile('file', () => {                                │    │
 * │     │      setTimeout(() => console.log('timeout'), 0);           │    │
 * │     │      setImmediate(() => console.log('immediate'));          │    │
 * │     │  });                                                         │    │
 * │     │  // Output: immediate, timeout (ALWAYS this order)          │    │
 * │     └─────────────────────────────────────────────────────────────┘    │
 * │                                                                          │
 * │  2. Outside I/O: Order is NON-DETERMINISTIC                            │
 * │     ┌─────────────────────────────────────────────────────────────┐    │
 * │     │  setTimeout(() => console.log('timeout'), 0);               │    │
 * │     │  setImmediate(() => console.log('immediate'));              │    │
 * │     │  // Output: Could be either order!                          │    │
 * │     └─────────────────────────────────────────────────────────────┘    │
 * │                                                                          │
 * │  WHY?                                                                   │
 * │  In I/O callback, we're coming FROM poll phase → check phase is next   │
 * │  Outside I/O, timer might fire before we even start the loop           │
 * │                                                                          │
 * └──────────────────────────────────────────────────────────────────────────┘
 */

console.log("setImmediate vs setTimeout:");
console.log("─".repeat(50));

// Example 1: Outside I/O (non-deterministic)
console.log("\n  1. Outside I/O context (non-deterministic):");
setTimeout(() => console.log("     setTimeout(0) - timers phase"), 0);
setImmediate(() => console.log("     setImmediate - check phase"));
console.log("     (Order may vary between runs!)");

// Example 2: Inside I/O callback (deterministic)
console.log("\n  2. Inside I/O callback (deterministic):");
fs.readFile(__filename, () => {
    setTimeout(() => console.log("     setTimeout(0) inside I/O"), 0);
    setImmediate(() => console.log("     setImmediate inside I/O (runs first!)"));
});

console.log("\n╔════════════════════════════════════════════════════════════════╗");
console.log("║          MICROTASKS: process.nextTick & Promises               ║");
console.log("╚════════════════════════════════════════════════════════════════╝\n");

/**
 * ┌──────────────────────────────────────────────────────────────────────────┐
 * │                    MICROTASKS IN NODE.JS                                 │
 * ├──────────────────────────────────────────────────────────────────────────┤
 * │                                                                          │
 * │  Microtasks run BETWEEN each phase of the event loop.                   │
 * │  They have HIGHEST priority (before any macrotask).                     │
 * │                                                                          │
 * │  PRIORITY ORDER (highest to lowest):                                    │
 * │  ─────────────────────────────────────                                  │
 * │                                                                          │
 * │   1. process.nextTick() queue     ◄── HIGHEST PRIORITY                 │
 * │   2. Promise microtasks (.then)   ◄── Runs after nextTick              │
 * │   3. setTimeout/setInterval       ◄── Timers phase                     │
 * │   4. setImmediate                 ◄── Check phase                      │
 * │                                                                          │
 * │  ┌────────────────────────────────────────────────────────────────┐     │
 * │  │                                                                  │     │
 * │  │   PHASE A ────► [nextTick] ────► [Promises] ────► PHASE B      │     │
 * │  │                                                                  │     │
 * │  │   Example:                                                      │     │
 * │  │   ┌──────────────────────────────────────────────────────────┐ │     │
 * │  │   │ setTimeout(() => console.log('1'), 0);                   │ │     │
 * │  │   │ Promise.resolve().then(() => console.log('2'));          │ │     │
 * │  │   │ process.nextTick(() => console.log('3'));                │ │     │
 * │  │   │ console.log('4');                                         │ │     │
 * │  │   │                                                           │ │     │
 * │  │   │ Output: 4, 3, 2, 1                                        │ │     │
 * │  │   │         │  │  │  └── setTimeout (timers phase)           │ │     │
 * │  │   │         │  │  └───── Promise (microtask)                 │ │     │
 * │  │   │         │  └──────── nextTick (before microtasks)        │ │     │
 * │  │   │         └─────────── Sync (immediate)                    │ │     │
 * │  │   └──────────────────────────────────────────────────────────┘ │     │
 * │  │                                                                  │     │
 * │  └────────────────────────────────────────────────────────────────┘     │
 * │                                                                          │
 * │  WARNING: process.nextTick can STARVE the event loop!                   │
 * │  ────────────────────────────────────────────────────                   │
 * │  If nextTick keeps adding more nextTick callbacks,                      │
 * │  I/O and timers will never run!                                         │
 * │                                                                          │
 * └──────────────────────────────────────────────────────────────────────────┘
 */

console.log("Microtask Execution Order:");
console.log("─".repeat(50));

console.log("\n  Demo: nextTick vs Promise vs setTimeout:");

setTimeout(() => console.log("     4. setTimeout (macrotask - timers)"), 0);
setImmediate(() => console.log("     5. setImmediate (macrotask - check)"));

Promise.resolve().then(() => console.log("     3. Promise.then (microtask)"));

process.nextTick(() => console.log("     2. process.nextTick (highest priority microtask)"));

console.log("     1. Synchronous (runs first)");

// Nested microtasks
console.log("\n  Demo: Nested nextTick (runs before Promise):");
setTimeout(() => {
    process.nextTick(() => {
        console.log("     nextTick inside setTimeout");
        process.nextTick(() => console.log("     nested nextTick (still before Promises!)"));
    });

    Promise.resolve().then(() => console.log("     Promise inside setTimeout"));
}, 200);

console.log("\n╔════════════════════════════════════════════════════════════════╗");
console.log("║          CLASSIC INTERVIEW QUESTION                            ║");
console.log("╚════════════════════════════════════════════════════════════════╝\n");

/**
 * ┌──────────────────────────────────────────────────────────────────────────┐
 * │              CLASSIC EVENT LOOP INTERVIEW QUESTION                       │
 * ├──────────────────────────────────────────────────────────────────────────┤
 * │                                                                          │
 * │  "What is the output of this code?"                                     │
 * │                                                                          │
 * │  console.log('1');                                                      │
 * │                                                                          │
 * │  setTimeout(() => console.log('2'), 0);                                 │
 * │                                                                          │
 * │  Promise.resolve().then(() => console.log('3'));                        │
 * │                                                                          │
 * │  process.nextTick(() => console.log('4'));                              │
 * │                                                                          │
 * │  setImmediate(() => console.log('5'));                                  │
 * │                                                                          │
 * │  console.log('6');                                                      │
 * │                                                                          │
 * │  ═══════════════════════════════════════════════════════════════════    │
 * │                                                                          │
 * │  ANSWER: 1, 6, 4, 3, 2, 5  (or 1, 6, 4, 3, 5, 2)                       │
 * │                                                                          │
 * │  EXPLANATION:                                                           │
 * │  1, 6 - Synchronous code runs first                                     │
 * │  4    - process.nextTick (highest priority microtask)                   │
 * │  3    - Promise.then (microtask, after nextTick)                        │
 * │  2, 5 - setTimeout and setImmediate (non-deterministic outside I/O)    │
 * │                                                                          │
 * └──────────────────────────────────────────────────────────────────────────┘
 */

console.log("Classic Interview Question - Event Loop Order:");
console.log("─".repeat(50));

setTimeout(() => {
    console.log("\n  Running the classic question:\n");

    console.log('  1');

    setTimeout(() => console.log('  2 (setTimeout)'), 0);

    Promise.resolve().then(() => console.log('  3 (Promise)'));

    process.nextTick(() => console.log('  4 (nextTick)'));

    setImmediate(() => console.log('  5 (setImmediate)'));

    console.log('  6');

    console.log("\n  Expected: 1, 6, 4, 3, then 2 and 5 (order varies)");
}, 300);

console.log("\n╔════════════════════════════════════════════════════════════════╗");
console.log("║          EVENT LOOP SUMMARY                                    ║");
console.log("╚════════════════════════════════════════════════════════════════╝\n");

/**
 * ┌──────────────────────────────────────────────────────────────────────────┐
 * │                    EVENT LOOP CHEAT SHEET                                │
 * ├──────────────────────────────────────────────────────────────────────────┤
 * │                                                                          │
 * │  EXECUTION ORDER:                                                       │
 * │  ════════════════                                                       │
 * │                                                                          │
 * │  1. Synchronous code                                                    │
 * │  2. process.nextTick callbacks                                          │
 * │  3. Promise microtasks                                                  │
 * │  4. Timer callbacks (setTimeout/setInterval that are ready)             │
 * │  5. I/O callbacks (in poll phase)                                       │
 * │  6. setImmediate callbacks (check phase)                                │
 * │  7. Close callbacks                                                     │
 * │                                                                          │
 * │  KEY RULES:                                                             │
 * │  ═══════════                                                            │
 * │                                                                          │
 * │  • nextTick runs BEFORE Promises                                        │
 * │  • Microtasks run BETWEEN each phase                                    │
 * │  • setImmediate runs AFTER I/O, setTimeout runs BEFORE poll             │
 * │  • Inside I/O callback: setImmediate always before setTimeout(0)        │
 * │  • Outside I/O: setTimeout(0) vs setImmediate is non-deterministic     │
 * │                                                                          │
 * │  WHEN TO USE WHAT:                                                      │
 * │  ═════════════════                                                      │
 * │                                                                          │
 * │  process.nextTick:                                                      │
 * │  • When you need to run BEFORE any I/O                                  │
 * │  • Error handling after async operation starts                          │
 * │  • ⚠️ Use sparingly - can starve I/O!                                  │
 * │                                                                          │
 * │  setImmediate:                                                          │
 * │  • When you need to run AFTER I/O events                                │
 * │  • Breaking up long-running operations                                  │
 * │  • Safer than nextTick                                                  │
 * │                                                                          │
 * │  setTimeout(fn, 0):                                                     │
 * │  • When you need to defer execution                                     │
 * │  • Browser compatibility needed                                         │
 * │                                                                          │
 * └──────────────────────────────────────────────────────────────────────────┘
 */

setTimeout(() => {
    console.log("Event Loop Summary:");
    console.log("─".repeat(50));
    console.log("\n  Phases (in order):");
    console.log("  1. Timers (setTimeout, setInterval)");
    console.log("  2. Pending I/O callbacks");
    console.log("  3. Idle, Prepare (internal)");
    console.log("  4. Poll (I/O, incoming connections)");
    console.log("  5. Check (setImmediate)");
    console.log("  6. Close callbacks");

    console.log("\n  Microtasks (between EVERY phase):");
    console.log("  • process.nextTick (first)");
    console.log("  • Promise callbacks (second)");

    console.log("\n  Interview Key Points:");
    console.log("  • nextTick > Promise > macrotasks");
    console.log("  • Inside I/O: setImmediate > setTimeout(0)");
    console.log("  • Outside I/O: order is non-deterministic");

    console.log("\n═══ FILE 2 COMPLETE ═══");
    console.log("Run: node 03-libuv-thread-pool.js");
}, 500);
