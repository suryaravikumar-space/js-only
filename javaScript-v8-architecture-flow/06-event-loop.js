/**
 * ╔══════════════════════════════════════════════════════════════════════════════╗
 * ║                                                                              ║
 * ║         JAVASCRIPT V8 ENGINE - PART 6: EVENT LOOP                            ║
 * ║                                                                              ║
 * ╚══════════════════════════════════════════════════════════════════════════════╝
 *
 *
 * ┌──────────────────────────────────────────────────────────────────────────────┐
 * │ WHY EVENT LOOP?                                                              │
 * └──────────────────────────────────────────────────────────────────────────────┘
 *
 *   JavaScript is SINGLE-THREADED but handles async operations via EVENT LOOP.
 *   This allows non-blocking I/O without multi-threading complexity.
 *
 *
 *
 * ┌──────────────────────────────────────────────────────────────────────────────┐
 * │ EVENT LOOP ARCHITECTURE                                                      │
 * └──────────────────────────────────────────────────────────────────────────────┘
 *
 *   ┌─────────────────────────────────────────────────────────────────────────────┐
 *   │                        JAVASCRIPT RUNTIME                                   │
 *   ├─────────────────────────────────────────────────────────────────────────────┤
 *   │                                                                             │
 *   │  ┌───────────────────────────────────────────────────────────────────────┐ │
 *   │  │                          V8 ENGINE                                    │ │
 *   │  │                                                                       │ │
 *   │  │   ┌─────────────────┐          ┌─────────────────────────────────┐   │ │
 *   │  │   │   CALL STACK    │          │            HEAP                 │   │ │
 *   │  │   │                 │          │                                 │   │ │
 *   │  │   │  ┌───────────┐  │          │   Objects, Arrays, Functions    │   │ │
 *   │  │   │  │   func()  │  │          │                                 │   │ │
 *   │  │   │  ├───────────┤  │          │                                 │   │ │
 *   │  │   │  │  Global   │  │          │                                 │   │ │
 *   │  │   │  └───────────┘  │          │                                 │   │ │
 *   │  │   └─────────────────┘          └─────────────────────────────────┘   │ │
 *   │  └───────────────────────────────────────────────────────────────────────┘ │
 *   │                          │                                                 │
 *   │                          │ Async operations                                │
 *   │                          ▼                                                 │
 *   │  ┌───────────────────────────────────────────────────────────────────────┐ │
 *   │  │                    WEB APIs / NODE APIs                               │ │
 *   │  │                                                                       │ │
 *   │  │   ┌─────────────┐ ┌─────────────┐ ┌─────────────┐ ┌─────────────┐    │ │
 *   │  │   │ setTimeout  │ │   fetch     │ │ FileSystem  │ │   HTTP      │    │ │
 *   │  │   │ setInterval │ │   DOM       │ │   DNS       │ │   Crypto    │    │ │
 *   │  │   └─────────────┘ └─────────────┘ └─────────────┘ └─────────────┘    │ │
 *   │  │                                                                       │ │
 *   │  │   These run in SEPARATE THREADS (handled by browser/libuv)            │ │
 *   │  └─────────────────────────────────┬─────────────────────────────────────┘ │
 *   │                                    │                                       │
 *   │                                    │ Callbacks queued                      │
 *   │                                    ▼                                       │
 *   │  ┌───────────────────────────────────────────────────────────────────────┐ │
 *   │  │                       CALLBACK QUEUES                                 │ │
 *   │  │                                                                       │ │
 *   │  │   ┌─────────────────────────────────────────────────────────────────┐ │ │
 *   │  │   │ MICROTASK QUEUE (High Priority)                                 │ │ │
 *   │  │   │   • Promise.then/catch/finally                                  │ │ │
 *   │  │   │   • queueMicrotask()                                            │ │ │
 *   │  │   │   • process.nextTick() (Node.js - highest priority!)            │ │ │
 *   │  │   └─────────────────────────────────────────────────────────────────┘ │ │
 *   │  │                                                                       │ │
 *   │  │   ┌─────────────────────────────────────────────────────────────────┐ │ │
 *   │  │   │ MACROTASK QUEUE (Normal Priority)                               │ │ │
 *   │  │   │   • setTimeout / setInterval                                    │ │ │
 *   │  │   │   • setImmediate (Node.js)                                      │ │ │
 *   │  │   │   • I/O callbacks                                               │ │ │
 *   │  │   │   • UI rendering events                                         │ │ │
 *   │  │   └─────────────────────────────────────────────────────────────────┘ │ │
 *   │  └───────────────────────────────────────────────────────────────────────┘ │
 *   │                                    ▲                                       │
 *   │                                    │                                       │
 *   │  ┌─────────────────────────────────┴─────────────────────────────────────┐ │
 *   │  │                         EVENT LOOP                                    │ │
 *   │  │                                                                       │ │
 *   │  │   while (true) {                                                      │ │
 *   │  │     1. Execute all code in call stack                                 │ │
 *   │  │     2. Process ALL microtasks                                         │ │
 *   │  │     3. Take ONE macrotask                                             │ │
 *   │  │     4. Repeat                                                         │ │
 *   │  │   }                                                                   │ │
 *   │  │                                                                       │ │
 *   │  └───────────────────────────────────────────────────────────────────────┘ │
 *   └─────────────────────────────────────────────────────────────────────────────┘
 *
 *
 *
 * ┌──────────────────────────────────────────────────────────────────────────────┐
 * │ NODE.JS EVENT LOOP PHASES                                                    │
 * └──────────────────────────────────────────────────────────────────────────────┘
 *
 *      ┌───────────────────────────────┐
 *      │                               │
 *      │         ┌─────────────┐       │
 *      │    ┌───▶│   TIMERS    │───┐   │   ← setTimeout, setInterval
 *      │    │    └─────────────┘   │   │
 *      │    │                      ▼   │
 *      │    │    ┌─────────────┐       │
 *      │    │    │  PENDING    │       │   ← I/O callbacks (deferred)
 *      │    │    │  CALLBACKS  │       │
 *      │    │    └──────┬──────┘       │
 *      │    │           │              │
 *      │    │           ▼              │
 *      │    │    ┌─────────────┐       │
 *      │    │    │ IDLE/PREPARE│       │   ← Internal use
 *      │    │    └──────┬──────┘       │
 *      │    │           │              │
 *      │    │           ▼              │
 *      │    │    ┌─────────────┐       │
 *      │    │    │    POLL     │◀──────┤   ← I/O events (most time here)
 *      │    │    └──────┬──────┘       │
 *      │    │           │              │
 *      │    │           ▼              │
 *      │    │    ┌─────────────┐       │
 *      │    │    │   CHECK     │       │   ← setImmediate
 *      │    │    └──────┬──────┘       │
 *      │    │           │              │
 *      │    │           ▼              │
 *      │    │    ┌─────────────┐       │
 *      │    └────│   CLOSE     │       │   ← close callbacks
 *      │         │  CALLBACKS  │       │
 *      │         └─────────────┘       │
 *      │                               │
 *      │   Between EACH phase:         │
 *      │   Process ALL microtasks!     │
 *      │                               │
 *      └───────────────────────────────┘
 *
 *
 *
 * ┌──────────────────────────────────────────────────────────────────────────────┐
 * │ MICROTASKS vs MACROTASKS                                                     │
 * └──────────────────────────────────────────────────────────────────────────────┘
 *
 *   ┌─────────────────────────────┬───────────────────────────────────────────┐
 *   │        MICROTASKS           │            MACROTASKS                     │
 *   ├─────────────────────────────┼───────────────────────────────────────────┤
 *   │                             │                                           │
 *   │ SOURCES:                    │ SOURCES:                                  │
 *   │ • Promise.then/catch/finally│ • setTimeout                              │
 *   │ • queueMicrotask()          │ • setInterval                             │
 *   │ • MutationObserver          │ • setImmediate (Node.js)                  │
 *   │ • process.nextTick (Node)   │ • I/O operations                          │
 *   │                             │ • UI rendering                            │
 *   │                             │                                           │
 *   │ PRIORITY: HIGH              │ PRIORITY: NORMAL                          │
 *   │                             │                                           │
 *   │ PROCESSING:                 │ PROCESSING:                               │
 *   │ ALL microtasks processed    │ ONE macrotask processed                   │
 *   │ before next macrotask       │ then all microtasks                       │
 *   │                             │ then next macrotask                       │
 *   └─────────────────────────────┴───────────────────────────────────────────┘
 *
 *
 *
 * ┌──────────────────────────────────────────────────────────────────────────────┐
 * │ EXECUTION ORDER EXAMPLE                                                      │
 * └──────────────────────────────────────────────────────────────────────────────┘
 *
 *   console.log("1");                          // Sync
 *   setTimeout(() => console.log("2"), 0);     // Macrotask
 *   Promise.resolve().then(() => console.log("3")); // Microtask
 *   console.log("4");                          // Sync
 *
 *   OUTPUT: 1, 4, 3, 2
 *
 *   WHY?
 *   ────
 *   1. Execute sync code: log "1"
 *   2. setTimeout callback → Macrotask Queue
 *   3. Promise.then callback → Microtask Queue
 *   4. Execute sync code: log "4"
 *   5. Call stack empty → Process ALL microtasks → log "3"
 *   6. Process ONE macrotask → log "2"
 *
 *
 *
 * ┌──────────────────────────────────────────────────────────────────────────────┐
 * │ COMPLEX EXAMPLE TIMELINE                                                     │
 * └──────────────────────────────────────────────────────────────────────────────┘
 *
 *   console.log("start");
 *
 *   setTimeout(() => {
 *     console.log("timeout 1");
 *     Promise.resolve().then(() => console.log("promise inside timeout"));
 *   }, 0);
 *
 *   Promise.resolve().then(() => {
 *     console.log("promise 1");
 *     setTimeout(() => console.log("timeout inside promise"), 0);
 *   }).then(() => console.log("promise 2"));
 *
 *   console.log("end");
 *
 *
 *   OUTPUT:
 *   ═══════
 *   start
 *   end
 *   promise 1
 *   promise 2
 *   timeout 1
 *   promise inside timeout
 *   timeout inside promise
 *
 *
 * RUN: node javaScript-v8-architecture-flow/06-event-loop.js
 */

// ═══════════════════════════════════════════════════════════════════════════════
//                         EXECUTABLE EXAMPLES
// ═══════════════════════════════════════════════════════════════════════════════

console.log('═'.repeat(70));
console.log('       PART 6: EVENT LOOP - ASYNC JAVASCRIPT');
console.log('═'.repeat(70));

// 1. Basic Event Loop Order
console.log('\n1. BASIC EVENT LOOP ORDER:');
console.log('─'.repeat(40));
console.log('   Code: sync → setTimeout → Promise → sync');
console.log('   Expected: 1, 4, 3, 2');
console.log('   Output:');

console.log('   1');
setTimeout(() => console.log('   2 (macrotask)'), 0);
Promise.resolve().then(() => console.log('   3 (microtask)'));
console.log('   4');

// Use setTimeout to wait for async operations to complete before next demo
setTimeout(() => {

  // 2. Microtask Priority
  console.log('\n2. MICROTASK PRIORITY:');
  console.log('─'.repeat(40));
  console.log('   Multiple microtasks run before any macrotask:');

  setTimeout(() => console.log('   timeout (macrotask)'), 0);

  Promise.resolve()
    .then(() => console.log('   promise 1 (microtask)'))
    .then(() => console.log('   promise 2 (microtask)'))
    .then(() => console.log('   promise 3 (microtask)'));

  setTimeout(() => {

    // 3. Nested Async
    console.log('\n3. NESTED ASYNC OPERATIONS:');
    console.log('─'.repeat(40));

    setTimeout(() => {
      console.log('   timeout outer');
      Promise.resolve().then(() => console.log('   promise inside timeout'));
    }, 0);

    Promise.resolve().then(() => {
      console.log('   promise outer');
      setTimeout(() => console.log('   timeout inside promise'), 0);
    });

    setTimeout(() => {

      // 4. process.nextTick (Node.js specific)
      console.log('\n4. process.nextTick (Node.js):');
      console.log('─'.repeat(40));
      console.log('   nextTick has HIGHEST priority (before promises)');

      setTimeout(() => console.log('   setTimeout'), 0);
      Promise.resolve().then(() => console.log('   Promise'));
      process.nextTick(() => console.log('   nextTick (runs first!)'));

      setTimeout(() => {

        // 5. setImmediate vs setTimeout
        console.log('\n5. setImmediate vs setTimeout(0):');
        console.log('─'.repeat(40));
        console.log('   Order can vary in main module, but:');
        console.log('   Inside I/O callback, setImmediate always runs first');

        // In I/O callback, setImmediate runs before setTimeout
        const fs = require('fs');
        fs.readFile(__filename, () => {
          setTimeout(() => console.log('   setTimeout in I/O'), 0);
          setImmediate(() => console.log('   setImmediate in I/O (runs first)'));
        });

        setTimeout(() => {
          console.log('\n' + '═'.repeat(70));
          console.log('       Read the comments above for complete event loop details!');
          console.log('═'.repeat(70) + '\n');
        }, 100);

      }, 50);

    }, 50);

  }, 50);

}, 50);
