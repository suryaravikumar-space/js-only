/**
 * TOPIC: Top 50 Node.js Interview Questions - ULTIMATE Cheatsheet
 *
 * ╔════════════════════════════════════════════════════════════════════════════╗
 * ║ THE GOLDEN RULE                                                          ║
 * ╠════════════════════════════════════════════════════════════════════════════╣
 * ║                                                                          ║
 * ║ Node.js interviews test THREE things:                                    ║
 * ║   1. Do you understand the EVENT LOOP and async model?                   ║
 * ║   2. Can you build PRODUCTION-READY systems?                             ║
 * ║   3. Do you know the TRICKY EDGE CASES?                                 ║
 * ║                                                                          ║
 * ║ Master these 50 questions and you will nail any Node.js interview.       ║
 * ║                                                                          ║
 * ╚════════════════════════════════════════════════════════════════════════════╝
 *
 *
 * ┌─────────────────────────────────────────────────────────────────────────────┐
 * │ STORY TO REMEMBER                                                          │
 * ├─────────────────────────────────────────────────────────────────────────────┤
 * │                                                                             │
 * │  Imagine Node.js as a RESTAURANT with ONE waiter (single thread).          │
 * │                                                                             │
 * │  The waiter (event loop) takes orders and sends them to the kitchen        │
 * │  (thread pool / OS). He does NOT wait at the kitchen window.               │
 * │  Instead, he takes MORE orders. When food is ready, the kitchen            │
 * │  rings a BELL (callback), and the waiter delivers it.                      │
 * │                                                                             │
 * │  This is WHY Node handles 10,000 concurrent connections with ONE thread.   │
 * │  The waiter never blocks. The kitchen has MULTIPLE cooks (libuv threads).  │
 * │                                                                             │
 * │  But if a customer asks the waiter to COOK the food himself (CPU-heavy     │
 * │  task), EVERYONE waits. That is the Achilles heel of Node.js.              │
 * │                                                                             │
 * └─────────────────────────────────────────────────────────────────────────────┘
 *
 *
 * ┌─────────────────────────────────────────────────────────────────────────────┐
 * │ VISUAL: THE 50 QUESTIONS MAP                                               │
 * ├─────────────────────────────────────────────────────────────────────────────┤
 * │                                                                             │
 * │   ┌──────────────┐  ┌──────────────┐  ┌──────────────┐                    │
 * │   │ BASICS       │  │ ASYNC        │  │ THREADING    │                    │
 * │   │ Q1 - Q8      │  │ Q9 - Q16     │  │ Q17 - Q24   │                    │
 * │   └──────┬───────┘  └──────┬───────┘  └──────┬───────┘                    │
 * │          │                 │                  │                             │
 * │   ┌──────┴───────┐  ┌─────┴────────┐  ┌─────┴────────┐                   │
 * │   │ CORE MODULES │  │ SECURITY     │  │ PERFORMANCE  │                   │
 * │   │ Q25 - Q32    │  │ Q33 - Q38    │  │ Q39 - Q44   │                   │
 * │   └──────┬───────┘  └──────┬───────┘  └──────┬───────┘                    │
 * │          │                 │                  │                             │
 * │          └────────┬────────┴──────────────────┘                            │
 * │                   │                                                        │
 * │            ┌──────┴───────┐                                                │
 * │            │ ARCHITECTURE │                                                │
 * │            │ Q45 - Q50    │                                                │
 * │            └──────────────┘                                                │
 * │                                                                             │
 * └─────────────────────────────────────────────────────────────────────────────┘
 */

// ============================================================================
//  CATEGORY 1: NODE.JS BASICS (Q1 - Q8)
// ============================================================================

console.log('╔══════════════════════════════════════════════════════════════════╗');
console.log('║          CATEGORY 1: NODE.JS BASICS (Q1 - Q8)                  ║');
console.log('╚══════════════════════════════════════════════════════════════════╝\n');

// ── Q1 ─────────────────────────────────────────────────────────────────────────
console.log(`Q1: What is Node.js? Is it single-threaded?
─────────────────────────────────────────────
A: Node.js is a JavaScript RUNTIME built on Chrome's V8 engine.
   It allows running JS outside the browser with access to the file system,
   network, and OS-level APIs.

   Is it single-threaded? YES and NO (trick question!):
   - The EVENT LOOP is single-threaded (your JS code runs on one thread)
   - But libuv maintains a THREAD POOL (default 4 threads) for I/O operations
   - So: JS execution = single-threaded, I/O = multi-threaded

   ┌──────────────────────────────────────────────────┐
   │  Your JS Code  ──→  Event Loop (1 thread)       │
   │                      │                            │
   │                      ├──→ Thread Pool (4 threads) │
   │                      ├──→ OS async (epoll/kqueue) │
   │                      └──→ Callbacks back to loop  │
   └──────────────────────────────────────────────────┘

   FOLLOW-UP: "If it is single-threaded, how does it handle concurrency?"
   → Through non-blocking I/O and the event loop. Concurrency != Parallelism.
`);

// ── Q2 ─────────────────────────────────────────────────────────────────────────
console.log(`Q2: What is the Event Loop? Explain its phases.
─────────────────────────────────────────────
A: The event loop is the mechanism that allows Node.js to perform non-blocking
   I/O operations despite being single-threaded. It offloads work to the OS
   or thread pool and picks up results via callbacks.

   ┌──────────────────────────────────────────────────────────┐
   │                    EVENT LOOP PHASES                      │
   │                                                          │
   │   ┌─────────────────┐                                    │
   │   │  timers          │  ← setTimeout, setInterval        │
   │   └────────┬─────────┘                                    │
   │   ┌────────▼─────────┐                                    │
   │   │  pending callbacks│  ← I/O callbacks deferred         │
   │   └────────┬─────────┘                                    │
   │   ┌────────▼─────────┐                                    │
   │   │  idle, prepare   │  ← internal use only               │
   │   └────────┬─────────┘                                    │
   │   ┌────────▼─────────┐                                    │
   │   │  poll             │  ← retrieve new I/O events        │
   │   └────────┬─────────┘                                    │
   │   ┌────────▼─────────┐                                    │
   │   │  check            │  ← setImmediate callbacks         │
   │   └────────┬─────────┘                                    │
   │   ┌────────▼─────────┐                                    │
   │   │  close callbacks  │  ← socket.on('close')             │
   │   └──────────────────┘                                    │
   │                                                          │
   │   Between EACH phase: process.nextTick + microtasks run  │
   └──────────────────────────────────────────────────────────┘

   FOLLOW-UP: "What happens if the poll queue is empty?"
   → If setImmediate is scheduled, loop goes to check phase.
   → If timers are due, loop wraps back to timers phase.
   → Otherwise, it waits for callbacks in poll phase.
`);

// ── Q3 ─────────────────────────────────────────────────────────────────────────
console.log(`Q3: What is libuv? What is V8?
─────────────────────────────────────────────
A: V8:    Google's open-source JS engine. Compiles JS to machine code.
          Written in C++. Handles JS parsing, compilation (JIT), and execution.

   libuv: A C library that provides the event loop, thread pool, and async I/O.
          It abstracts OS-level async primitives (epoll on Linux, kqueue on Mac,
          IOCP on Windows).

   ┌─────────────────────────────────────────────────┐
   │               NODE.JS ARCHITECTURE              │
   │                                                 │
   │   ┌─────────────────────────────────┐           │
   │   │       Your JavaScript Code      │           │
   │   └──────────────┬──────────────────┘           │
   │                  │                              │
   │   ┌──────────────▼──────────────────┐           │
   │   │      Node.js Bindings (C++)     │           │
   │   └──────┬───────────────┬──────────┘           │
   │          │               │                      │
   │   ┌──────▼──────┐ ┌─────▼──────┐               │
   │   │     V8      │ │   libuv    │               │
   │   │  (JS engine)│ │ (async I/O)│               │
   │   └─────────────┘ └────────────┘               │
   └─────────────────────────────────────────────────┘

   FOLLOW-UP: "Can you replace V8 with another engine?"
   → Yes! Deno uses V8 too. Bun uses JavaScriptCore (Safari's engine).
`);

// ── Q4 ─────────────────────────────────────────────────────────────────────────
console.log(`Q4: process.nextTick() vs setImmediate()
─────────────────────────────────────────────
A: process.nextTick():
     - Fires BEFORE the event loop continues to the next phase
     - Goes into the "nextTick queue" (microtask)
     - Runs AFTER current operation, BEFORE any I/O

   setImmediate():
     - Fires in the CHECK phase of the event loop
     - Goes into the "check queue" (macrotask)
     - Runs AFTER the poll phase (after I/O)

   Priority order:
     1. process.nextTick()      ← highest (microtask)
     2. Promise.then()          ← microtask
     3. setTimeout(fn, 0)       ← timers phase
     4. setImmediate()          ← check phase

   DANGER: Recursive process.nextTick() can STARVE the event loop!
`);

// Demo Q4
console.log('── Q4 DEMO ──');
setTimeout(() => console.log('  setTimeout'), 0);
setImmediate(() => console.log('  setImmediate'));
process.nextTick(() => console.log('  process.nextTick'));
Promise.resolve().then(() => console.log('  Promise.then'));
console.log('  synchronous\n');

// ── Q5 ─────────────────────────────────────────────────────────────────────────
console.log(`Q5: What is the module wrapper function?
─────────────────────────────────────────────
A: Every Node.js module is wrapped in a function BEFORE execution:

   (function(exports, require, module, __filename, __dirname) {
     // Your module code actually lives here
   });

   This is WHY:
   - Variables are scoped to the module (not global)
   - You have access to require, exports, module
   - __filename and __dirname are available
   - 'this' at top level === module.exports (not global)

   FOLLOW-UP: "Is __dirname available in ES modules?"
   → NO! In ESM, use: import.meta.url + fileURLToPath
`);

// ── Q6 ─────────────────────────────────────────────────────────────────────────
console.log(`Q6: CommonJS vs ES Modules
─────────────────────────────────────────────
A: ┌─────────────────┬──────────────────┬──────────────────┐
   │ Feature         │ CommonJS (CJS)   │ ES Modules (ESM) │
   ├─────────────────┼──────────────────┼──────────────────┤
   │ Syntax          │ require/exports  │ import/export    │
   │ Loading         │ Synchronous      │ Asynchronous     │
   │ Evaluation      │ Runtime          │ Parse time       │
   │ Exports         │ Value copy       │ Live bindings    │
   │ Top-level await │ No               │ Yes              │
   │ File ext        │ .js / .cjs       │ .mjs / .js*      │
   │ this            │ module.exports   │ undefined        │
   │ __dirname       │ Yes              │ No (use meta)    │
   └─────────────────┴──────────────────┴──────────────────┘

   * .js uses ESM only if package.json has "type": "module"

   FOLLOW-UP: "Can you mix CJS and ESM?"
   → ESM can import CJS. CJS can NOT require() ESM (use dynamic import()).
`);

// ── Q7 ─────────────────────────────────────────────────────────────────────────
console.log(`Q7: What are Streams in Node.js?
─────────────────────────────────────────────
A: Streams are collections of data that might not be available all at once.
   They let you process data PIECE BY PIECE instead of loading it all into
   memory. Essential for handling large files or real-time data.

   Four types:
   ┌───────────┬──────────────────────────────────────────┐
   │ Readable  │ Source of data (fs.createReadStream)     │
   │ Writable  │ Destination (fs.createWriteStream)       │
   │ Duplex    │ Both read & write (net.Socket)           │
   │ Transform │ Modify data in transit (zlib.createGzip) │
   └───────────┴──────────────────────────────────────────┘

   Key events: 'data', 'end', 'error', 'finish', 'drain'

   FOLLOW-UP: "What happens if you read a 2GB file without streams?"
   → It loads ENTIRELY into memory, likely crashing with heap out of memory.
     Streams process it in 64KB chunks (default highWaterMark).
`);

// ── Q8 ─────────────────────────────────────────────────────────────────────────
console.log(`Q8: What is Buffer?
─────────────────────────────────────────────
A: Buffer is a class for handling raw binary data directly in Node.js.
   It represents a fixed-size chunk of memory allocated OUTSIDE the V8 heap.

   Why it exists: JavaScript strings are UTF-16, but network protocols and
   files deal with raw bytes. Buffer bridges that gap.

   Common operations:
   - Buffer.from('hello')          → create from string
   - Buffer.alloc(10)              → create zero-filled buffer of 10 bytes
   - Buffer.concat([buf1, buf2])   → merge buffers
   - buf.toString('utf8')          → convert to string

   FOLLOW-UP: "Buffer.alloc() vs Buffer.allocUnsafe()?"
   → alloc() zero-fills memory (safe, slightly slower).
   → allocUnsafe() does NOT zero-fill (may contain old data, faster).
`);

// Demo Q8
const buf = Buffer.from('Node.js Interview');
console.log('── Q8 DEMO ──');
console.log(`  Buffer: ${buf}`);
console.log(`  Bytes: ${buf.length}`);
console.log(`  Hex: ${buf.toString('hex').slice(0, 20)}...`);
console.log(`  JSON: ${JSON.stringify(buf).slice(0, 40)}...\n`);


// ============================================================================
//  CATEGORY 2: ASYNC PATTERNS (Q9 - Q16)
// ============================================================================

console.log('╔══════════════════════════════════════════════════════════════════╗');
console.log('║          CATEGORY 2: ASYNC PATTERNS (Q9 - Q16)                 ║');
console.log('╚══════════════════════════════════════════════════════════════════╝\n');

// ── Q9 ─────────────────────────────────────────────────────────────────────────
console.log(`Q9: Callbacks vs Promises vs async/await
─────────────────────────────────────────────
A: Three evolution stages of async handling in Node.js:

   1. CALLBACKS (old way):
      fs.readFile('file', (err, data) => { ... });

   2. PROMISES (better):
      fs.promises.readFile('file').then(data => ...).catch(err => ...);

   3. ASYNC/AWAIT (best - syntactic sugar over Promises):
      const data = await fs.promises.readFile('file');

   ┌────────────┬──────────┬──────────────┬──────────────┐
   │ Feature    │ Callback │ Promise      │ async/await  │
   ├────────────┼──────────┼──────────────┼──────────────┤
   │ Error      │ err arg  │ .catch()     │ try/catch    │
   │ Chaining   │ nested   │ .then chain  │ sequential   │
   │ Readability│ poor     │ better       │ best         │
   │ Debugging  │ hard     │ medium       │ easy         │
   └────────────┴──────────┴──────────────┴──────────────┘

   FOLLOW-UP: "Is async/await truly synchronous?"
   → NO. It LOOKS synchronous but is still non-blocking.
     'await' pauses only THAT function, not the event loop.
`);

// ── Q10 ────────────────────────────────────────────────────────────────────────
console.log(`Q10: What is callback hell? How to avoid it?
─────────────────────────────────────────────
A: Callback hell = deeply nested callbacks forming a "pyramid of doom":

   getUser(id, (err, user) => {
     getOrders(user.id, (err, orders) => {
       getItems(orders[0].id, (err, items) => {
         getPrice(items[0].id, (err, price) => {
           // deeply nested... unreadable!
         });
       });
     });
   });

   Solutions:
   1. Use Promises / async-await (best approach)
   2. Named functions instead of anonymous callbacks
   3. Use control-flow libraries (async.js - legacy)
   4. Modularize: break into smaller functions

   FIXED with async/await:
   const user   = await getUser(id);
   const orders = await getOrders(user.id);
   const items  = await getItems(orders[0].id);
   const price  = await getPrice(items[0].id);
`);

// ── Q11 ────────────────────────────────────────────────────────────────────────
console.log(`Q11: What is the error-first callback pattern?
─────────────────────────────────────────────
A: A Node.js convention where the FIRST argument of a callback is always
   the error object (null if no error), and the SECOND is the result.

   fs.readFile('file.txt', (err, data) => {
     if (err) {
       console.error('Failed:', err.message);
       return;  // ALWAYS return after error handling!
     }
     console.log('Data:', data);
   });

   WHY this pattern?
   - No try/catch for async code (before Promises)
   - Consistent error handling across all Node APIs
   - Forces developers to handle errors first

   FOLLOW-UP: "What if you forget to check err?"
   → The error is silently swallowed. This is a common bug.
     With Promises, unhandled rejections will crash the process (Node 15+).
`);

// ── Q12 ────────────────────────────────────────────────────────────────────────
console.log(`Q12: Promise.all vs Promise.allSettled vs Promise.race
─────────────────────────────────────────────
A: ┌──────────────────┬─────────────────────────────────────────┐
   │ Method           │ Behavior                                │
   ├──────────────────┼─────────────────────────────────────────┤
   │ Promise.all      │ Resolves when ALL resolve.              │
   │                  │ REJECTS if ANY one rejects (fail-fast). │
   ├──────────────────┼─────────────────────────────────────────┤
   │ Promise.allSettled│ Waits for ALL to settle (resolve OR    │
   │                  │ reject). Never short-circuits. Returns  │
   │                  │ [{status, value/reason}, ...]           │
   ├──────────────────┼─────────────────────────────────────────┤
   │ Promise.race     │ Resolves/rejects with the FIRST promise│
   │                  │ to settle (win or lose).                │
   ├──────────────────┼─────────────────────────────────────────┤
   │ Promise.any      │ Resolves with FIRST to fulfill.         │
   │                  │ Rejects only if ALL reject.             │
   └──────────────────┴─────────────────────────────────────────┘
`);

// Demo Q12
console.log('── Q12 DEMO ──');
const p1 = Promise.resolve('fast');
const p2 = new Promise(res => setTimeout(() => res('slow'), 50));
const p3 = Promise.reject(new Error('fail'));

Promise.allSettled([p1, p2, p3]).then(results => {
  results.forEach((r, i) => console.log(`  P${i + 1}: ${r.status} → ${r.value || r.reason.message}`));
  console.log('');
});

// ── Q13 ────────────────────────────────────────────────────────────────────────
console.log(`Q13: How does async/await work under the hood?
─────────────────────────────────────────────
A: async/await is syntactic sugar over Promises and generators.

   async function fetchData() {
     const data = await getAPI();  // pauses HERE
     return data;
   }

   Under the hood, this becomes roughly:
   function fetchData() {
     return getAPI().then(data => {
       return data;
     });
   }

   Key mechanics:
   - 'async' makes the function ALWAYS return a Promise
   - 'await' suspends execution of that function, registering a .then()
   - Control returns to the event loop (non-blocking)
   - When the promise resolves, the function resumes from where it paused

   FOLLOW-UP: "Does await block the event loop?"
   → NO! It only pauses THAT function. The event loop continues processing
     other callbacks. This is the crucial distinction.
`);

// ── Q14 ────────────────────────────────────────────────────────────────────────
console.log(`Q14: Microtasks vs Macrotasks
─────────────────────────────────────────────
A: ┌─────────────────┬────────────────────────────────────┐
   │ MICROTASKS      │ MACROTASKS                          │
   │ (higher priority)│ (lower priority)                   │
   ├─────────────────┼────────────────────────────────────┤
   │ process.nextTick│ setTimeout                          │
   │ Promise.then    │ setInterval                         │
   │ queueMicrotask  │ setImmediate                        │
   │ MutationObserver│ I/O callbacks                       │
   └─────────────────┴────────────────────────────────────┘

   Execution order:
   1. Current synchronous code completes
   2. ALL microtasks drain (including newly added ones!)
   3. ONE macrotask executes
   4. ALL microtasks drain again
   5. Repeat from step 3

   DANGER: Infinite microtasks = event loop starvation!
   process.nextTick(() => process.nextTick(() => ...)); // never-ending
`);

// ── Q15 ────────────────────────────────────────────────────────────────────────
console.log(`Q15: Event Emitter Pattern
─────────────────────────────────────────────
A: EventEmitter is the backbone of Node.js. Many core modules inherit from it
   (http, fs streams, process). It implements the publish-subscribe pattern.
`);

const { EventEmitter } = require('events');

const emitter = new EventEmitter();

emitter.on('order', (item) => {
  console.log(`  Kitchen received order: ${item}`);
});

emitter.once('vip', (name) => {
  console.log(`  VIP alert (fires once): ${name}`);
});

console.log('── Q15 DEMO ──');
emitter.emit('order', 'Pizza');
emitter.emit('order', 'Burger');
emitter.emit('vip', 'Elon');
emitter.emit('vip', 'This will NOT fire');
console.log(`  Listener count for "order": ${emitter.listenerCount('order')}`);

console.log(`
   FOLLOW-UP: "What is the default max listeners limit?"
   → 10 listeners per event. Set with emitter.setMaxListeners(n).
     This is a memory leak warning, NOT a hard limit.
`);

// ── Q16 ────────────────────────────────────────────────────────────────────────
console.log(`Q16: What is the Observer Pattern?
─────────────────────────────────────────────
A: A design pattern where an object (Subject) maintains a list of dependents
   (Observers) and notifies them of state changes. EventEmitter IS Node's
   implementation of the Observer pattern.

   ┌──────────┐    notify()    ┌───────────┐
   │ Subject  │ ──────────────→│ Observer 1│
   │ (Emitter)│ ──────────────→│ Observer 2│
   │          │ ──────────────→│ Observer 3│
   └──────────┘                └───────────┘

   Real-world usage:
   - Streams (data events)
   - HTTP server (request events)
   - Process (exit, uncaughtException)
   - Database change notifications
`);


// ============================================================================
//  CATEGORY 3: THREADING & CONCURRENCY (Q17 - Q24)
// ============================================================================

console.log('╔══════════════════════════════════════════════════════════════════╗');
console.log('║       CATEGORY 3: THREADING & CONCURRENCY (Q17 - Q24)          ║');
console.log('╚══════════════════════════════════════════════════════════════════╝\n');

// ── Q17 ────────────────────────────────────────────────────────────────────────
console.log(`Q17: Is Node.js single-threaded? (TRICK QUESTION!)
─────────────────────────────────────────────
A: This is the MOST misunderstood concept in Node.js.

   PARTIALLY TRUE: Your JavaScript code runs on a SINGLE thread (the main
   thread / event loop thread).

   BUT Node.js itself is MULTI-THREADED:

   ┌──────────────────────────────────────────────────┐
   │  Main Thread (1)                                 │
   │  └── Your JS code, event loop, callbacks         │
   │                                                  │
   │  Thread Pool (4 by default, max 1024)            │
   │  ├── DNS lookups (dns.lookup)                    │
   │  ├── File system operations                      │
   │  ├── crypto (pbkdf2, randomBytes, scrypt)        │
   │  └── zlib compression                            │
   │                                                  │
   │  OS-level async threads                          │
   │  ├── TCP/UDP sockets                             │
   │  ├── DNS resolving (dns.resolve)                 │
   │  └── Pipes                                       │
   └──────────────────────────────────────────────────┘

   Set thread pool size: UV_THREADPOOL_SIZE=8 node app.js

   FOLLOW-UP: "What operations use the thread pool?"
   → fs.*, crypto.pbkdf2, crypto.randomBytes, dns.lookup, zlib.*
`);

// ── Q18 ────────────────────────────────────────────────────────────────────────
console.log(`Q18: What is the Thread Pool? How many threads?
─────────────────────────────────────────────
A: libuv maintains a thread pool for operations that cannot be done
   asynchronously at the OS level.

   Default: 4 threads
   Max: 1024 threads (set via UV_THREADPOOL_SIZE env variable)

   What uses the thread pool:
   - All fs operations (readFile, writeFile, stat, etc.)
   - crypto.pbkdf2, crypto.scrypt, crypto.randomBytes
   - dns.lookup() (NOT dns.resolve - that uses OS async)
   - zlib operations

   IMPORTANT: If all 4 threads are busy, additional operations QUEUE up.
   This can cause unexpected latency for file operations.

   FOLLOW-UP: "Should you increase the thread pool size?"
   → It depends on your workload. For I/O-heavy apps, increasing to
     the number of CPU cores can help. Too many threads = context switching.
`);

// ── Q19 ────────────────────────────────────────────────────────────────────────
console.log(`Q19: worker_threads vs child_process vs cluster
─────────────────────────────────────────────
A: ┌─────────────────┬──────────────────────────────────────────┐
   │ worker_threads  │ Threads within the SAME process.         │
   │                 │ Share memory (SharedArrayBuffer).         │
   │                 │ Lightweight. For CPU-intensive tasks.     │
   │                 │ Use case: image processing, calculations. │
   ├─────────────────┼──────────────────────────────────────────┤
   │ child_process   │ Spawns a NEW OS process.                  │
   │                 │ Separate memory space (no sharing).       │
   │                 │ Can run ANY command (not just Node).       │
   │                 │ Use case: shell commands, Python scripts.  │
   ├─────────────────┼──────────────────────────────────────────┤
   │ cluster         │ Forks MULTIPLE Node processes.            │
   │                 │ All listen on the SAME port.              │
   │                 │ Built-in load balancing (round-robin).    │
   │                 │ Use case: scaling HTTP servers.            │
   └─────────────────┴──────────────────────────────────────────┘

   FOLLOW-UP: "When would you NOT use cluster?"
   → When using a process manager like PM2 (it handles clustering).
     Or behind a load balancer like NGINX.
`);

// ── Q20 ────────────────────────────────────────────────────────────────────────
console.log(`Q20: When would you use Worker Threads?
─────────────────────────────────────────────
A: Use worker_threads when you have CPU-INTENSIVE tasks that would
   block the event loop:

   YES - Use worker threads for:
   - Image/video processing
   - Heavy mathematical computations
   - Data parsing (large CSV/JSON files)
   - Cryptographic operations
   - Machine learning inference

   NO - Do NOT use worker threads for:
   - I/O operations (already async via libuv)
   - Simple API endpoints
   - Database queries (use connection pools)
   - File reading (use streams)
`);

// Demo Q20
const { Worker, isMainThread, parentPort } = require('worker_threads');

console.log('── Q20 DEMO ──');
console.log(`  Is main thread: ${isMainThread}`);
console.log(`  Thread ID: ${require('worker_threads').threadId}\n`);

// ── Q21 ────────────────────────────────────────────────────────────────────────
console.log(`Q21: What is a race condition? Can it happen in Node.js?
─────────────────────────────────────────────
A: A race condition occurs when the outcome depends on the timing/order
   of events. YES, it can happen in Node.js even though JS is single-threaded!

   Example: Two async operations modifying the same resource:

   let balance = 100;

   async function withdraw(amount) {
     const current = await getBalance();  // both read 100
     await setBalance(current - amount);  // both set to 50
   }

   // Two concurrent withdrawals of 50
   withdraw(50);  // reads 100, sets 50
   withdraw(50);  // reads 100 (before first write!), sets 50
   // Expected: 0, Actual: 50 (RACE CONDITION!)

   Solutions:
   - Use atomic operations (database transactions)
   - Implement a mutex/lock (async-mutex library)
   - Queue operations sequentially
`);

// ── Q22 ────────────────────────────────────────────────────────────────────────
console.log(`Q22: Process vs Thread
─────────────────────────────────────────────
A: ┌───────────────┬─────────────────────┬─────────────────────┐
   │ Aspect        │ Process              │ Thread              │
   ├───────────────┼─────────────────────┼─────────────────────┤
   │ Memory        │ Separate/isolated   │ Shared memory       │
   │ Creation cost │ Heavy (fork OS)     │ Lightweight         │
   │ Communication │ IPC (serialization) │ SharedArrayBuffer   │
   │ Crash impact  │ Independent         │ Can crash process   │
   │ Overhead      │ High                │ Low                 │
   │ Node.js       │ child_process/cluster│ worker_threads     │
   └───────────────┴─────────────────────┴─────────────────────┘
`);

// ── Q23 ────────────────────────────────────────────────────────────────────────
console.log(`Q23: Concurrency vs Parallelism
─────────────────────────────────────────────
A: Concurrency: Dealing with MULTIPLE things at once (structure).
   Parallelism:  DOING multiple things at once (execution).

   ┌─────────────────────────────────────────────────────────┐
   │ CONCURRENCY (single core, interleaved)                  │
   │                                                         │
   │ Task A: ██░░██░░██                                      │
   │ Task B: ░░██░░██░░                                      │
   │ Timeline: ──────────→                                   │
   │                                                         │
   │ PARALLELISM (multi core, simultaneous)                  │
   │                                                         │
   │ Core 1: ██████████  (Task A)                            │
   │ Core 2: ██████████  (Task B)                            │
   │ Timeline: ──────────→                                   │
   └─────────────────────────────────────────────────────────┘

   Node.js: Concurrent by default (event loop), parallel with
   worker_threads or cluster module.
`);

// ── Q24 ────────────────────────────────────────────────────────────────────────
console.log(`Q24: How to scale Node.js?
─────────────────────────────────────────────
A: Scaling strategies:

   VERTICAL (scale up):
   1. cluster module - fork workers per CPU core
   2. worker_threads - offload CPU work
   3. Increase UV_THREADPOOL_SIZE

   HORIZONTAL (scale out):
   4. Multiple servers behind a load balancer (NGINX, HAProxy)
   5. Docker containers + Kubernetes
   6. Serverless (AWS Lambda, Vercel)

   APPLICATION LEVEL:
   7. Caching (Redis, in-memory)
   8. Database indexing + connection pooling
   9. CDN for static assets
   10. Message queues (RabbitMQ, Bull) for background jobs

   ┌─────────────────────────────────────────────────┐
   │         LOAD BALANCER (NGINX)                   │
   │        ┌───────┼───────┐                        │
   │        ▼       ▼       ▼                        │
   │   ┌────────┐┌────────┐┌────────┐                │
   │   │Worker 1││Worker 2││Worker 3│                │
   │   │(CPU 1) ││(CPU 2) ││(CPU 3) │                │
   │   └────────┘└────────┘└────────┘                │
   │        │       │       │                        │
   │        └───────┼───────┘                        │
   │                ▼                                │
   │   ┌────────────────────────┐                    │
   │   │  Redis / Database      │                    │
   │   └────────────────────────┘                    │
   └─────────────────────────────────────────────────┘
`);


// ============================================================================
//  CATEGORY 4: CORE MODULES (Q25 - Q32)
// ============================================================================

console.log('╔══════════════════════════════════════════════════════════════════╗');
console.log('║          CATEGORY 4: CORE MODULES (Q25 - Q32)                  ║');
console.log('╚══════════════════════════════════════════════════════════════════╝\n');

// ── Q25 ────────────────────────────────────────────────────────────────────────
console.log(`Q25: fs module - sync vs async vs streams
─────────────────────────────────────────────
A: Three ways to read/write files:

   1. SYNCHRONOUS (blocks event loop - avoid in servers!):
      const data = fs.readFileSync('file.txt', 'utf8');

   2. ASYNC CALLBACK (non-blocking):
      fs.readFile('file.txt', 'utf8', (err, data) => { ... });

   3. ASYNC PROMISE (modern):
      const data = await fs.promises.readFile('file.txt', 'utf8');

   4. STREAMS (for large files):
      const stream = fs.createReadStream('huge.csv');
      stream.on('data', chunk => { ... });

   ┌─────────────┬──────────┬─────────┬──────────────┐
   │ Method      │ Memory   │ Speed   │ Use Case     │
   ├─────────────┼──────────┼─────────┼──────────────┤
   │ readFileSync│ Full file│ Blocks! │ Config/startup│
   │ readFile    │ Full file│ Async   │ Small files   │
   │ createRead  │ Chunked  │ Async   │ Large files   │
   └─────────────┴──────────┴─────────┴──────────────┘
`);

// ── Q26 ────────────────────────────────────────────────────────────────────────
console.log(`Q26: http module - creating a server
─────────────────────────────────────────────
A: The http module is the foundation of all Node.js web servers.
   Express, Koa, Fastify - they all use http under the hood.
`);

const http = require('http');

// Minimal server (not started - just for demo)
const server = http.createServer((req, res) => {
  res.writeHead(200, { 'Content-Type': 'application/json' });
  res.end(JSON.stringify({ message: 'Hello from Node!' }));
});

console.log(`── Q26 DEMO ──`);
console.log(`  Server created (not listening - demo only)`);
console.log(`  req is a Readable stream, res is a Writable stream`);
console.log(`  Express adds: routing, middleware, req.body parsing\n`);

// ── Q27 ────────────────────────────────────────────────────────────────────────
console.log(`Q27: path module - join vs resolve
─────────────────────────────────────────────
A: Both combine path segments, but behave differently:
`);

const path = require('path');

console.log('── Q27 DEMO ──');
console.log(`  path.join('/users', 'surya', 'docs')     → ${path.join('/users', 'surya', 'docs')}`);
console.log(`  path.resolve('users', 'surya', 'docs')   → ${path.resolve('users', 'surya', 'docs')}`);
console.log(`  path.join('/users', '../admin')           → ${path.join('/users', '../admin')}`);
console.log(`  path.resolve('/users', '../admin')        → ${path.resolve('/users', '../admin')}`);

console.log(`
   KEY DIFFERENCE:
   - join()    → concatenates segments with OS separator. No absolute path logic.
   - resolve() → builds absolute path RIGHT TO LEFT until it gets an absolute path.
                  If no absolute segment found, prepends cwd.

   Other useful methods:
   - path.basename('/a/b/file.js')  → 'file.js'
   - path.extname('app.ts')         → '.ts'
   - path.dirname('/a/b/file.js')   → '/a/b'
   - path.parse('/a/b/file.js')     → { root, dir, base, ext, name }
`);

// ── Q28 ────────────────────────────────────────────────────────────────────────
console.log(`Q28: crypto module - hashing vs encryption
─────────────────────────────────────────────
A: ┌──────────────┬────────────────────┬────────────────────┐
   │              │ HASHING            │ ENCRYPTION          │
   ├──────────────┼────────────────────┼────────────────────┤
   │ Direction    │ ONE-WAY            │ TWO-WAY             │
   │ Reversible?  │ NO                 │ YES (with key)      │
   │ Use case     │ Passwords, checksums│ Sensitive data     │
   │ Algorithms   │ SHA-256, bcrypt    │ AES-256, RSA        │
   │ Output size  │ Fixed length       │ Variable            │
   └──────────────┴────────────────────┴────────────────────┘
`);

const crypto = require('crypto');

console.log('── Q28 DEMO ──');
const hash = crypto.createHash('sha256').update('password123').digest('hex');
console.log(`  SHA-256 hash: ${hash.slice(0, 32)}...`);
console.log(`  Same input ALWAYS gives same hash (deterministic)`);

const hmac = crypto.createHmac('sha256', 'secret-key').update('data').digest('hex');
console.log(`  HMAC: ${hmac.slice(0, 32)}...`);
console.log(`  HMAC = hash + secret key (for message authentication)\n`);

// ── Q29 ────────────────────────────────────────────────────────────────────────
console.log(`Q29: Streams - Readable vs Writable vs Transform vs Duplex
─────────────────────────────────────────────
A: ┌───────────┬────────────────┬─────────────────────────────┐
   │ Type      │ Data Flow      │ Example                     │
   ├───────────┼────────────────┼─────────────────────────────┤
   │ Readable  │ ──data──→      │ fs.createReadStream          │
   │           │                │ http req, process.stdin      │
   ├───────────┼────────────────┼─────────────────────────────┤
   │ Writable  │ ←──data──      │ fs.createWriteStream         │
   │           │                │ http res, process.stdout     │
   ├───────────┼────────────────┼─────────────────────────────┤
   │ Duplex    │ ←──data──→     │ net.Socket, TCP connection   │
   │           │ (independent)  │ Read and write independently │
   ├───────────┼────────────────┼─────────────────────────────┤
   │ Transform │ ──→ modify ──→ │ zlib.createGzip              │
   │           │ (read→modify→  │ crypto.createCipheriv        │
   │           │  write)        │ CSV parser                   │
   └───────────┴────────────────┴─────────────────────────────┘

   Piping: readable.pipe(transform).pipe(writable);
`);

// ── Q30 ────────────────────────────────────────────────────────────────────────
console.log(`Q30: child_process - exec vs spawn vs fork
─────────────────────────────────────────────
A: ┌────────┬────────────────────────────────────────────────┐
   │ exec   │ Buffers output, returns in callback.            │
   │        │ Has a maxBuffer limit (default 1MB).            │
   │        │ Spawns a SHELL (/bin/sh). Use for small output. │
   │        │ exec('ls -la', (err, stdout) => ...)            │
   ├────────┼────────────────────────────────────────────────┤
   │ spawn  │ Returns a STREAM (stdout/stderr).               │
   │        │ No buffer limit. No shell by default.           │
   │        │ Use for large output or long-running processes. │
   │        │ const ls = spawn('ls', ['-la']);                │
   │        │ ls.stdout.on('data', chunk => ...);            │
   ├────────┼────────────────────────────────────────────────┤
   │ fork   │ Special spawn that creates a NEW Node process.  │
   │        │ Built-in IPC channel (send/on message).         │
   │        │ Use for running another Node.js script.         │
   │        │ const child = fork('worker.js');               │
   │        │ child.send({ type: 'start' });                 │
   └────────┴────────────────────────────────────────────────┘

   FOLLOW-UP: "exec vs execFile?"
   → execFile does NOT spawn a shell (slightly more secure and faster).
`);

// ── Q31 ────────────────────────────────────────────────────────────────────────
console.log(`Q31: Cluster module - how it works
─────────────────────────────────────────────
A: The cluster module creates MULTIPLE Node.js processes (workers)
   that all share the SAME server port.

   ┌─────────────────────────────────────────────────────┐
   │                  MASTER PROCESS                      │
   │          (manages workers, doesn't serve)            │
   │                     │                                │
   │        ┌────────────┼────────────────┐               │
   │        │            │                │               │
   │   ┌────▼────┐  ┌────▼────┐  ┌───────▼──┐            │
   │   │Worker 1 │  │Worker 2 │  │Worker N  │            │
   │   │(CPU 1)  │  │(CPU 2)  │  │(CPU N)   │            │
   │   │ :3000   │  │ :3000   │  │ :3000    │            │
   │   └─────────┘  └─────────┘  └──────────┘            │
   │                                                     │
   │   Load balancing: round-robin (default on Linux)    │
   └─────────────────────────────────────────────────────┘

   const cluster = require('cluster');
   const os = require('os');

   if (cluster.isPrimary) {
     for (let i = 0; i < os.cpus().length; i++) {
       cluster.fork();
     }
   } else {
     // Each worker runs the server
     http.createServer(handler).listen(3000);
   }

   FOLLOW-UP: "How do workers share state?"
   → They do NOT share memory. Use Redis or a database for shared state.
`);

// ── Q32 ────────────────────────────────────────────────────────────────────────
const os = require('os');

console.log(`Q32: os module - useful methods
─────────────────────────────────────────────`);

console.log('── Q32 DEMO ──');
console.log(`  Platform:    ${os.platform()}`);
console.log(`  Architecture:${os.arch()}`);
console.log(`  CPUs:        ${os.cpus().length}`);
console.log(`  Total Memory:${(os.totalmem() / 1024 / 1024 / 1024).toFixed(1)} GB`);
console.log(`  Free Memory: ${(os.freemem() / 1024 / 1024 / 1024).toFixed(1)} GB`);
console.log(`  Hostname:    ${os.hostname()}`);
console.log(`  Uptime:      ${(os.uptime() / 3600).toFixed(1)} hours`);
console.log(`  Home Dir:    ${os.homedir()}`);
console.log(`  Temp Dir:    ${os.tmpdir()}`);
console.log(`  EOL:         ${JSON.stringify(os.EOL)}\n`);


// ============================================================================
//  CATEGORY 5: SECURITY (Q33 - Q38)
// ============================================================================

console.log('╔══════════════════════════════════════════════════════════════════╗');
console.log('║             CATEGORY 5: SECURITY (Q33 - Q38)                   ║');
console.log('╚══════════════════════════════════════════════════════════════════╝\n');

// ── Q33 ────────────────────────────────────────────────────────────────────────
console.log(`Q33: Common Node.js Vulnerabilities
─────────────────────────────────────────────
A: Top security threats:

   1. INJECTION ATTACKS
      - SQL Injection: user input in queries → use parameterized queries
      - NoSQL Injection: MongoDB $gt, $ne operators in input
      - Command Injection: user input in exec() → use spawn with array args

   2. XSS (Cross-Site Scripting)
      - Storing unsanitized user HTML → use DOMPurify, helmet

   3. PROTOTYPE POLLUTION
      - Merging user input into objects → Object.create(null), validate keys

   4. DEPENDENCY VULNERABILITIES
      - npm audit, Snyk, socket.dev
      - Lock file (package-lock.json) prevents supply chain attacks

   5. DENIAL OF SERVICE (DoS)
      - ReDoS (regex denial of service)
      - Event loop blocking
      - Rate limit with express-rate-limit

   6. INSECURE DESERIALIZATION
      - Never use eval() or Function() on user input
      - Be careful with JSON.parse on untrusted data
`);

// ── Q34 ────────────────────────────────────────────────────────────────────────
console.log(`Q34: How to prevent SQL/NoSQL Injection?
─────────────────────────────────────────────
A: SQL Injection Prevention:

   BAD (vulnerable):
   db.query(\`SELECT * FROM users WHERE id = '\${req.params.id}'\`);

   GOOD (parameterized):
   db.query('SELECT * FROM users WHERE id = $1', [req.params.id]);

   MongoDB Injection Prevention:
   BAD:  User.find({ email: req.body.email }); // if email = { $gt: "" }
   GOOD: User.find({ email: String(req.body.email) }); // cast to string

   General rules:
   - ALWAYS use parameterized queries / prepared statements
   - Use an ORM (Prisma, Sequelize, Mongoose)
   - Validate input with Joi, Zod, or class-validator
   - Never concatenate user input into queries
   - Use mongo-sanitize for MongoDB
`);

// ── Q35 ────────────────────────────────────────────────────────────────────────
console.log(`Q35: What is CORS? How to handle it?
─────────────────────────────────────────────
A: CORS (Cross-Origin Resource Sharing) is a security mechanism that
   restricts HTTP requests made from a DIFFERENT origin (domain/port/protocol).

   ┌───────────────────────────────────────────────────────┐
   │  Browser at localhost:3000                            │
   │  └── fetch('http://api.example.com/data')             │
   │       │                                               │
   │       ▼                                               │
   │  Browser: "Different origin! Let me check CORS."      │
   │       │                                               │
   │       ▼  (Preflight OPTIONS request)                  │
   │  Server: Access-Control-Allow-Origin: localhost:3000  │
   │       │                                               │
   │       ▼                                               │
   │  Browser: "Server says OK. Proceed with request."     │
   └───────────────────────────────────────────────────────┘

   In Express:
   const cors = require('cors');
   app.use(cors({ origin: 'https://myapp.com', credentials: true }));

   Manual headers:
   res.setHeader('Access-Control-Allow-Origin', 'https://myapp.com');
   res.setHeader('Access-Control-Allow-Methods', 'GET,POST,PUT,DELETE');
   res.setHeader('Access-Control-Allow-Headers', 'Content-Type,Authorization');

   FOLLOW-UP: "CORS is enforced by the browser, NOT the server."
   → Server-to-server requests skip CORS entirely. That is why Postman works.
`);

// ── Q36 ────────────────────────────────────────────────────────────────────────
console.log(`Q36: What is JWT? How does it work?
─────────────────────────────────────────────
A: JWT (JSON Web Token) is a compact, self-contained token for authentication.

   Structure (3 parts, base64-encoded, dot-separated):
   ┌──────────────────────────────────────────────────┐
   │ HEADER.PAYLOAD.SIGNATURE                         │
   │                                                  │
   │ Header:    { "alg": "HS256", "typ": "JWT" }     │
   │ Payload:   { "userId": 123, "role": "admin",    │
   │              "exp": 1700000000 }                 │
   │ Signature: HMACSHA256(header + "." + payload,   │
   │             secretKey)                           │
   └──────────────────────────────────────────────────┘

   Flow:
   1. User logs in with credentials
   2. Server validates, creates JWT, sends it back
   3. Client stores JWT (httpOnly cookie > localStorage)
   4. Client sends JWT in Authorization: Bearer <token>
   5. Server verifies signature on each request

   IMPORTANT:
   - JWTs are NOT encrypted - anyone can decode the payload
   - JWTs are SIGNED - tampering invalidates the signature
   - Use short expiry + refresh tokens
   - Store in httpOnly cookies (NOT localStorage - XSS risk!)

   FOLLOW-UP: "JWT vs Session?"
   → JWT: stateless, scalable, no server storage needed.
   → Session: server stores state, more secure (can invalidate instantly).
`);

// ── Q37 ────────────────────────────────────────────────────────────────────────
console.log(`Q37: Rate Limiting Strategies
─────────────────────────────────────────────
A: Rate limiting protects APIs from abuse and DoS attacks.

   Strategies:
   1. FIXED WINDOW:    100 requests per minute, resets on the minute
   2. SLIDING WINDOW:  100 requests in any 60-second window
   3. TOKEN BUCKET:    Tokens refill at a steady rate; each request costs 1
   4. LEAKY BUCKET:    Requests queue and drain at a fixed rate

   Implementation:
   - express-rate-limit (simple, in-memory)
   - Redis-based (rate-limit-redis for distributed systems)
   - API gateway level (AWS API Gateway, NGINX)

   const rateLimit = require('express-rate-limit');
   app.use(rateLimit({
     windowMs: 15 * 60 * 1000,  // 15 minutes
     max: 100,                   // 100 requests per window
     standardHeaders: true,
     legacyHeaders: false,
   }));

   FOLLOW-UP: "What about distributed rate limiting?"
   → Use Redis with a sliding window algorithm. In-memory only works for
     single-server deployments.
`);

// ── Q38 ────────────────────────────────────────────────────────────────────────
console.log(`Q38: How to handle environment secrets?
─────────────────────────────────────────────
A: NEVER hardcode secrets in source code.

   Strategies (from basic to production):

   1. .env files (development):
      - Use dotenv package
      - Add .env to .gitignore ALWAYS
      - require('dotenv').config();
      - process.env.DATABASE_URL

   2. Environment variables (production):
      - Set via hosting platform (Heroku, Vercel, AWS)
      - Docker: --env-file or docker-compose env_file

   3. Secret managers (enterprise):
      - AWS Secrets Manager / Parameter Store
      - HashiCorp Vault
      - Google Secret Manager
      - Azure Key Vault

   4. Encrypted config (advanced):
      - SOPS (Secrets OPerationS)
      - git-crypt for encrypted files in git

   Rules:
   - NEVER commit .env files
   - Rotate secrets regularly
   - Use different secrets per environment
   - Audit access to secrets
`);


// ============================================================================
//  CATEGORY 6: PERFORMANCE & PRODUCTION (Q39 - Q44)
// ============================================================================

console.log('╔══════════════════════════════════════════════════════════════════╗');
console.log('║       CATEGORY 6: PERFORMANCE & PRODUCTION (Q39 - Q44)         ║');
console.log('╚══════════════════════════════════════════════════════════════════╝\n');

// ── Q39 ────────────────────────────────────────────────────────────────────────
console.log(`Q39: How to find memory leaks?
─────────────────────────────────────────────
A: Symptoms: RSS (Resident Set Size) grows continuously over time.

   Tools:
   1. process.memoryUsage()     - quick check
   2. --inspect + Chrome DevTools → Heap Snapshots
   3. clinic.js (clinic doctor, clinic heapprofiler)
   4. node --heap-prof app.js   - generate heap profile

   Common causes:
   - Global variables accumulating data
   - Closures retaining references
   - Event listeners not removed (emitter.removeListener)
   - Unbounded caches (use LRU cache instead)
   - Forgotten timers (clearInterval / clearTimeout)
`);

console.log('── Q39 DEMO ──');
const memUsage = process.memoryUsage();
console.log(`  RSS:        ${(memUsage.rss / 1024 / 1024).toFixed(1)} MB`);
console.log(`  Heap Total: ${(memUsage.heapTotal / 1024 / 1024).toFixed(1)} MB`);
console.log(`  Heap Used:  ${(memUsage.heapUsed / 1024 / 1024).toFixed(1)} MB`);
console.log(`  External:   ${(memUsage.external / 1024 / 1024).toFixed(1)} MB\n`);

// ── Q40 ────────────────────────────────────────────────────────────────────────
console.log(`Q40: What is backpressure in streams?
─────────────────────────────────────────────
A: Backpressure occurs when the WRITABLE stream cannot consume data as fast
   as the READABLE stream produces it. Data builds up in memory.

   ┌──────────┐   FAST   ┌──────────────┐   SLOW   ┌──────────┐
   │ Readable │ ────────→│ Internal     │ ────────→│ Writable │
   │ (source) │          │ Buffer       │          │ (dest)   │
   └──────────┘          │ ████████████ │          └──────────┘
                         │ FILLING UP!  │
                         └──────────────┘

   Solution: .pipe() handles backpressure automatically!
   readable.pipe(writable); // pipe manages flow control

   Manual handling:
   readable.on('data', (chunk) => {
     const canContinue = writable.write(chunk);
     if (!canContinue) {
       readable.pause();  // Stop reading
       writable.once('drain', () => readable.resume());  // Resume when ready
     }
   });

   FOLLOW-UP: "What is highWaterMark?"
   → The threshold (in bytes) that triggers backpressure. Default: 16KB for
     streams, 64KB for fs streams. When buffer exceeds this, .write() returns false.
`);

// ── Q41 ────────────────────────────────────────────────────────────────────────
console.log(`Q41: Connection Pooling - why and how?
─────────────────────────────────────────────
A: Opening a new DB connection for every request is EXPENSIVE:
   - TCP handshake (3-way)
   - TLS negotiation
   - Authentication
   - ~50-100ms per connection!

   Connection pooling maintains a SET of reusable connections:

   ┌─────────────────────────────────────────────────┐
   │             CONNECTION POOL                      │
   │  ┌─────┐ ┌─────┐ ┌─────┐ ┌─────┐ ┌─────┐      │
   │  │Conn1│ │Conn2│ │Conn3│ │Conn4│ │Conn5│      │
   │  │BUSY │ │FREE │ │BUSY │ │FREE │ │FREE │      │
   │  └─────┘ └─────┘ └─────┘ └─────┘ └─────┘      │
   │                                                 │
   │  Request arrives → grab FREE conn → use → return│
   └─────────────────────────────────────────────────┘

   // PostgreSQL pool example:
   const { Pool } = require('pg');
   const pool = new Pool({
     host: 'localhost',
     max: 20,              // max connections in pool
     idleTimeoutMillis: 30000,
     connectionTimeoutMillis: 2000,
   });
   const result = await pool.query('SELECT * FROM users');
`);

// ── Q42 ────────────────────────────────────────────────────────────────────────
console.log(`Q42: Caching Strategies
─────────────────────────────────────────────
A: ┌─────────────────┬───────────────────────────────────────┐
   │ Strategy        │ Description                            │
   ├─────────────────┼───────────────────────────────────────┤
   │ Cache-Aside     │ App checks cache first. Miss? Query   │
   │ (Lazy Loading)  │ DB, store result in cache. Most common.│
   ├─────────────────┼───────────────────────────────────────┤
   │ Write-Through   │ Write to cache AND DB simultaneously. │
   │                 │ Ensures consistency. Slower writes.     │
   ├─────────────────┼───────────────────────────────────────┤
   │ Write-Behind    │ Write to cache first, async write to  │
   │ (Write-Back)    │ DB later. Fast writes, risk data loss. │
   ├─────────────────┼───────────────────────────────────────┤
   │ Read-Through    │ Cache itself manages DB reads. App     │
   │                 │ always talks to cache, never directly  │
   │                 │ to DB.                                  │
   └─────────────────┴───────────────────────────────────────┘

   Levels:
   1. In-memory (Map, LRU cache) → fastest, per-process, lost on restart
   2. Redis/Memcached → shared across processes, persistent
   3. CDN → static assets, HTML pages
   4. HTTP caching → Cache-Control, ETag, Last-Modified headers
`);

// ── Q43 ────────────────────────────────────────────────────────────────────────
console.log(`Q43: How to do Graceful Shutdown?
─────────────────────────────────────────────
A: Graceful shutdown = stop accepting new requests, finish current ones,
   clean up resources, then exit.
`);

console.log(`── Q43 DEMO (code pattern) ──`);

const gracefulShutdown = (server, connections) => {
  console.log('  [shutdown] Stop accepting new connections');
  // server.close() stops new connections, waits for existing ones
  server.close(() => {
    console.log('  [shutdown] All connections closed');
    // Close database pools, Redis, etc.
    process.exit(0);
  });

  // Force shutdown after timeout
  setTimeout(() => {
    console.log('  [shutdown] Forced shutdown after timeout');
    process.exit(1);
  }, 10000);
};

console.log(`  Signals to handle: SIGTERM (kill), SIGINT (Ctrl+C)
  process.on('SIGTERM', () => gracefulShutdown(server));
  process.on('SIGINT',  () => gracefulShutdown(server));

  Steps:
  1. Catch SIGTERM/SIGINT signals
  2. server.close() - stop new connections
  3. Wait for in-flight requests to complete
  4. Close DB connections, Redis, message queues
  5. process.exit(0)
  6. Set a timeout for forced shutdown (failsafe)
`);

// ── Q44 ────────────────────────────────────────────────────────────────────────
console.log(`Q44: PM2 and Process Management
─────────────────────────────────────────────
A: PM2 is a production process manager for Node.js:

   Key features:
   - Cluster mode (auto-fork per CPU core)
   - Zero-downtime restarts (pm2 reload)
   - Log management (pm2 logs)
   - Monitoring (pm2 monit)
   - Startup scripts (pm2 startup)
   - Ecosystem file (ecosystem.config.js)

   Common commands:
   pm2 start app.js -i max        → cluster mode, all CPUs
   pm2 reload app                 → zero-downtime restart
   pm2 list                       → show all processes
   pm2 logs                       → view logs
   pm2 monit                      → live monitoring dashboard
   pm2 save && pm2 startup        → survive system reboot

   ecosystem.config.js:
   module.exports = {
     apps: [{
       name: 'api',
       script: './app.js',
       instances: 'max',
       exec_mode: 'cluster',
       max_memory_restart: '1G',
       env_production: {
         NODE_ENV: 'production',
         PORT: 3000,
       },
     }],
   };

   Alternatives: forever, nodemon (dev), Docker + Kubernetes (containerized)
`);


// ============================================================================
//  CATEGORY 7: ARCHITECTURE & PATTERNS (Q45 - Q50)
// ============================================================================

console.log('╔══════════════════════════════════════════════════════════════════╗');
console.log('║       CATEGORY 7: ARCHITECTURE & PATTERNS (Q45 - Q50)          ║');
console.log('╚══════════════════════════════════════════════════════════════════╝\n');

// ── Q45 ────────────────────────────────────────────────────────────────────────
console.log(`Q45: Middleware Pattern
─────────────────────────────────────────────
A: Middleware = functions that execute in a PIPELINE, each having access to
   the request, response, and the NEXT function in the chain.

   ┌─────────┐    ┌──────────┐    ┌──────────┐    ┌─────────┐
   │ Request │───→│ Logger   │───→│ Auth     │───→│ Route   │
   └─────────┘    │ next()   │    │ next()   │    │ res.send│
                  └──────────┘    └──────────┘    └─────────┘

   Express middleware signature:
   (req, res, next) => { ... next(); }

   Error handling middleware (4 args):
   (err, req, res, next) => { ... }

   Types:
   - Application-level:  app.use(middleware)
   - Router-level:       router.use(middleware)
   - Error-handling:     app.use((err, req, res, next) => ...)
   - Built-in:           express.json(), express.static()
   - Third-party:        cors(), helmet(), morgan()

   Order matters! Middleware runs in the order it is defined.
`);

// Demo Q45
console.log('── Q45 DEMO ──');

const middlewarePipeline = (middlewares) => {
  return (data) => {
    let index = 0;
    const next = () => {
      if (index < middlewares.length) {
        const mw = middlewares[index++];
        mw(data, next);
      }
    };
    next();
  };
};

const logger = (data, next) => { console.log(`  [LOG] ${data.method} ${data.url}`); next(); };
const auth = (data, next) => { data.user = 'surya'; console.log(`  [AUTH] User: ${data.user}`); next(); };
const handler = (data) => { console.log(`  [HANDLER] Serving ${data.url} for ${data.user}`); };

const pipeline = middlewarePipeline([logger, auth, handler]);
pipeline({ method: 'GET', url: '/api/data' });
console.log('');

// ── Q46 ────────────────────────────────────────────────────────────────────────
console.log(`Q46: MVC in Node.js
─────────────────────────────────────────────
A: Model-View-Controller separates concerns:

   ┌──────────────────────────────────────────────────────┐
   │                    MVC Pattern                        │
   │                                                      │
   │  ┌─────────┐   interacts   ┌────────────┐           │
   │  │  VIEW   │ ◄────────────→│ CONTROLLER │           │
   │  │ (EJS,   │               │ (Express   │           │
   │  │  React) │               │  routes)   │           │
   │  └─────────┘               └──────┬─────┘           │
   │                                   │                  │
   │                            ┌──────▼─────┐           │
   │                            │   MODEL    │           │
   │                            │ (Mongoose, │           │
   │                            │  Prisma)   │           │
   │                            └────────────┘           │
   └──────────────────────────────────────────────────────┘

   Typical Express project structure:
   src/
   ├── controllers/   → business logic (handle req/res)
   ├── models/        → database schemas/queries
   ├── routes/        → URL mapping to controllers
   ├── middlewares/    → auth, validation, logging
   ├── services/      → reusable business logic
   ├── utils/         → helper functions
   └── app.js         → entry point

   FOLLOW-UP: "MVC vs Service Layer?"
   → Controllers should be THIN (route + validation only).
     Heavy logic goes in a SERVICE layer between controller and model.
`);

// ── Q47 ────────────────────────────────────────────────────────────────────────
console.log(`Q47: Microservices vs Monolith
─────────────────────────────────────────────
A: ┌─────────────────┬────────────────────┬────────────────────┐
   │ Aspect          │ Monolith           │ Microservices       │
   ├─────────────────┼────────────────────┼────────────────────┤
   │ Deployment      │ Single unit        │ Independent services│
   │ Scaling         │ Scale everything   │ Scale per service   │
   │ Development     │ Simple initially   │ Complex initially   │
   │ Data            │ Shared database    │ DB per service      │
   │ Communication   │ Function calls     │ HTTP/gRPC/queues   │
   │ Failure impact  │ Entire app down    │ Partial degradation │
   │ Team structure  │ One team           │ Team per service    │
   │ Testing         │ Simpler            │ Integration complex │
   └─────────────────┴────────────────────┴────────────────────┘

   Start MONOLITH, migrate to microservices when:
   - Team grows beyond 8-10 developers
   - Different parts need different scaling
   - Deployment of one part blocks others
   - You have clear domain boundaries

   Communication patterns:
   - Synchronous: REST, gRPC
   - Asynchronous: Message queues (RabbitMQ, Kafka), Event-driven
`);

// ── Q48 ────────────────────────────────────────────────────────────────────────
console.log(`Q48: REST vs GraphQL
─────────────────────────────────────────────
A: ┌─────────────────┬────────────────────┬────────────────────┐
   │ Aspect          │ REST               │ GraphQL             │
   ├─────────────────┼────────────────────┼────────────────────┤
   │ Endpoints       │ Multiple (/users,  │ Single (/graphql)   │
   │                 │ /posts, /comments) │                     │
   │ Data fetching   │ Fixed response     │ Client specifies    │
   │                 │ structure          │ exact fields needed │
   │ Over-fetching   │ Common problem     │ Solved              │
   │ Under-fetching  │ Multiple requests  │ One query           │
   │ Caching         │ HTTP caching easy  │ More complex        │
   │ Learning curve  │ Low                │ Medium              │
   │ File uploads    │ Native             │ Needs extra setup   │
   │ Real-time       │ SSE/WebSocket      │ Subscriptions       │
   └─────────────────┴────────────────────┴────────────────────┘

   Use REST when: simple CRUD, public APIs, caching is important
   Use GraphQL when: complex data relationships, mobile apps (bandwidth),
                     multiple client types need different data shapes
`);

// ── Q49 ────────────────────────────────────────────────────────────────────────
console.log(`Q49: WebSocket vs HTTP
─────────────────────────────────────────────
A: ┌─────────────────────────────────────────────────────┐
   │ HTTP (Request-Response)                              │
   │                                                     │
   │ Client ──req──→ Server                               │
   │ Client ←──res── Server                               │
   │ Client ──req──→ Server                               │
   │ Client ←──res── Server  (connection closes)          │
   │                                                     │
   │ WebSocket (Full-Duplex, Persistent)                  │
   │                                                     │
   │ Client ←─────→ Server  (handshake via HTTP upgrade)  │
   │ Client ←─────→ Server  (bidirectional, persistent)   │
   │ Client ←─────→ Server  (real-time, low overhead)     │
   └─────────────────────────────────────────────────────┘

   Use WebSocket for:
   - Chat applications
   - Live dashboards / stock tickers
   - Multiplayer games
   - Collaborative editing (Google Docs-style)

   Use HTTP/SSE for:
   - REST APIs
   - One-way real-time (SSE - Server-Sent Events)
   - File downloads/uploads

   Libraries: ws (raw), Socket.IO (with fallbacks + rooms + namespaces)

   FOLLOW-UP: "What is Socket.IO vs WebSocket?"
   → Socket.IO is NOT just WebSocket. It adds auto-reconnection,
     rooms, namespaces, fallback to long-polling, and broadcasting.
`);

// ── Q50 ────────────────────────────────────────────────────────────────────────
console.log(`Q50: Design Patterns in Node.js (Singleton, Factory, Observer)
─────────────────────────────────────────────
A: Common patterns used in Node.js applications:
`);

// Singleton Pattern
console.log('── SINGLETON (use module caching) ──');

class Database {
  constructor() {
    if (Database.instance) return Database.instance;
    this.connection = `Connected at ${Date.now()}`;
    Database.instance = this;
  }
}

const db1 = new Database();
const db2 = new Database();
console.log(`  db1 === db2: ${db1 === db2}`);
console.log(`  (Module caching makes require() a natural singleton)\n`);

// Factory Pattern
console.log('── FACTORY ──');

const createUser = (type, name) => {
  const roles = {
    admin: { canDelete: true, canEdit: true, canView: true },
    editor: { canDelete: false, canEdit: true, canView: true },
    viewer: { canDelete: false, canEdit: false, canView: true },
  };
  return { name, type, permissions: roles[type] || roles.viewer };
};

const admin = createUser('admin', 'Surya');
const viewer = createUser('viewer', 'Guest');
console.log(`  Admin: ${JSON.stringify(admin.permissions)}`);
console.log(`  Viewer: ${JSON.stringify(viewer.permissions)}\n`);

// Observer Pattern (EventEmitter)
console.log('── OBSERVER (EventEmitter) ──');

const orderSystem = new EventEmitter();

orderSystem.on('newOrder', (order) => console.log(`  Email service: Order #${order.id} confirmation sent`));
orderSystem.on('newOrder', (order) => console.log(`  Inventory: Stock updated for ${order.item}`));
orderSystem.on('newOrder', (order) => console.log(`  Analytics: Order tracked - $${order.total}`));

orderSystem.emit('newOrder', { id: 1001, item: 'Laptop', total: 999 });

console.log(`
   Other patterns in Node.js:
   ┌────────────────┬─────────────────────────────────────────┐
   │ Pattern        │ Node.js Usage                           │
   ├────────────────┼─────────────────────────────────────────┤
   │ Singleton      │ Module caching (require returns same)   │
   │ Factory        │ Creating objects without 'new'          │
   │ Observer       │ EventEmitter, streams                   │
   │ Middleware     │ Express middleware chain                 │
   │ Proxy          │ ES6 Proxy, logging wrappers             │
   │ Decorator      │ Higher-order functions                  │
   │ Strategy       │ Passport.js authentication strategies   │
   │ Repository     │ Data access layer (ORM abstraction)     │
   │ Pub/Sub        │ Redis pub/sub, message queues           │
   └────────────────┴─────────────────────────────────────────┘
`);


// ============================================================================
//  BONUS: RAPID-FIRE TRICKY QUESTIONS
// ============================================================================

console.log('╔══════════════════════════════════════════════════════════════════╗');
console.log('║          BONUS: RAPID-FIRE TRICKY QUESTIONS                    ║');
console.log('╚══════════════════════════════════════════════════════════════════╝\n');

console.log(`RAPID-FIRE (one-line answers for speed rounds):

  Q: "require() is synchronous or async?"
  A: SYNCHRONOUS. It blocks. That is why you require at the top, not in loops.

  Q: "What is the difference between process.cwd() and __dirname?"
  A: cwd() = where you RAN the command. __dirname = where the FILE lives.

  Q: "Can Node.js access the DOM?"
  A: NO. There is no document, window, or DOM in Node.js. Use jsdom for testing.

  Q: "What is the event loop's role if Node is single-threaded?"
  A: It orchestrates async operations. Takes callbacks from the queue and
     runs them on the single thread when the stack is empty.

  Q: "What happens to unhandled promise rejections?"
  A: Node 15+: process crashes with UnhandledPromiseRejectionWarning.
     Always use .catch() or try/catch with await.

  Q: "What is the purpose of package-lock.json?"
  A: Locks EXACT dependency versions for reproducible builds.
     Without it, npm install might get different versions on different machines.

  Q: "Explain the difference between dependencies and devDependencies"
  A: dependencies: needed in production (express, pg).
     devDependencies: only for development (jest, eslint, nodemon).
     npm install --production skips devDependencies.

  Q: "What is 'this' at the top level of a Node module?"
  A: module.exports (an empty object {}). NOT global, NOT undefined.

  Q: "How does Node.js handle uncaught exceptions?"
  A: Emits 'uncaughtException' on process. If no handler, process crashes.
     process.on('uncaughtException', (err) => { log(err); process.exit(1); });
     NEVER try to resume after an uncaught exception - state is corrupted.

  Q: "What is the 'global' object in Node.js?"
  A: Equivalent to 'window' in browsers. globalThis works in both.
     Avoid polluting it. Use modules instead.
`);

/**
 * OUTPUT (partial - values vary by system):
 *
 *   ╔══════════════════════════════════════════════════════════════════╗
 *   ║          CATEGORY 1: NODE.JS BASICS (Q1 - Q8)                  ║
 *   ╚══════════════════════════════════════════════════════════════════╝
 *
 *   Q1: What is Node.js? Is it single-threaded?
 *   ...
 *   Q4 DEMO:
 *     synchronous
 *     process.nextTick
 *     Promise.then
 *     setTimeout
 *     setImmediate
 *   ...
 *   Q8 DEMO:
 *     Buffer: Node.js Interview
 *     Bytes: 17
 *   ...
 *   (All 50 questions with answers, demos, diagrams)
 *   ...
 *   BONUS: RAPID-FIRE TRICKY QUESTIONS
 *
 *
 * ╔════════════════════════════════════════════════════════════════════════════╗
 * ║ INTERVIEW TIPS                                                           ║
 * ╠════════════════════════════════════════════════════════════════════════════╣
 * ║                                                                          ║
 * ║ 1. Always explain the WHY, not just the WHAT                            ║
 * ║ 2. Use diagrams (draw the event loop phases!)                           ║
 * ║ 3. Mention trade-offs (nothing is perfect)                              ║
 * ║ 4. Know the difference between "can it?" and "should you?"              ║
 * ║ 5. If you do not know, say "I would look into..." not "I do not know"  ║
 * ║                                                                          ║
 * ╚════════════════════════════════════════════════════════════════════════════╝
 *
 *
 * RUN: node docs/node/14-interview-cheatsheet/00-top-50-questions.js
 */
