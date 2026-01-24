/**
 * ═══════════════════════════════════════════════════════════════════════════
 * NODE.JS ARCHITECTURE - FILE 8: INTERVIEW Q&A
 * ═══════════════════════════════════════════════════════════════════════════
 *
 * Comprehensive interview questions and answers covering all Node.js
 * architecture topics. 50+ questions from basic to advanced.
 */

console.log("═══════════════════════════════════════════════════════════════════");
console.log("       NODE.JS ARCHITECTURE - INTERVIEW Q&A (50+ Questions)        ");
console.log("═══════════════════════════════════════════════════════════════════\n");

/**
 * ╔═══════════════════════════════════════════════════════════════════════════╗
 * ║                    SECTION 1: NODE.JS RUNTIME                              ║
 * ╚═══════════════════════════════════════════════════════════════════════════╝
 */

console.log("═══════════════════════════════════════════════════════════════════");
console.log("              SECTION 1: NODE.JS RUNTIME (10 Questions)            ");
console.log("═══════════════════════════════════════════════════════════════════\n");

console.log(`
┌─────────────────────────────────────────────────────────────────────────────┐
│ Q1: What is Node.js and what are its main components?                       │
├─────────────────────────────────────────────────────────────────────────────┤
│ A: Node.js is a JavaScript runtime built on Chrome's V8 engine.             │
│                                                                              │
│    Main components:                                                          │
│    1. V8 Engine - Compiles JS to machine code                               │
│    2. libuv - Provides event loop, async I/O, thread pool                   │
│    3. Core Modules - fs, http, path, crypto, etc.                           │
│    4. C++ Bindings - Bridge between JS and C++ code                         │
│                                                                              │
│    Key characteristics:                                                      │
│    • Single-threaded (main event loop)                                      │
│    • Non-blocking I/O                                                        │
│    • Event-driven architecture                                              │
│    • Cross-platform                                                          │
└─────────────────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────────────────┐
│ Q2: How does V8 compile JavaScript code?                                    │
├─────────────────────────────────────────────────────────────────────────────┤
│ A: V8 uses a multi-tier compilation pipeline:                               │
│                                                                              │
│    1. Parser → Generates AST (Abstract Syntax Tree)                         │
│    2. Ignition (Interpreter) → Generates bytecode                           │
│    3. TurboFan (Optimizer) → JIT compiles hot functions                     │
│                                                                              │
│    Optimization flow:                                                        │
│    • Code starts as interpreted bytecode                                    │
│    • V8 profiles execution (hot spots detection)                            │
│    • Hot functions get JIT compiled by TurboFan                             │
│    • Deoptimization if assumptions fail                                     │
│                                                                              │
│    Key optimizations:                                                        │
│    • Hidden classes (object shape tracking)                                 │
│    • Inline caching                                                          │
│    • Function inlining                                                       │
│    • Dead code elimination                                                   │
└─────────────────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────────────────┐
│ Q3: Why is Node.js single-threaded and how does it handle concurrency?      │
├─────────────────────────────────────────────────────────────────────────────┤
│ A: Node.js JavaScript runs in a single thread for simplicity:               │
│                                                                              │
│    Benefits of single-threaded:                                              │
│    • No race conditions in JS code                                          │
│    • No deadlocks or mutex overhead                                         │
│    • Simpler programming model                                              │
│    • Lower memory per connection                                            │
│                                                                              │
│    How it handles concurrency:                                               │
│    • Event loop processes callbacks sequentially                            │
│    • I/O operations delegated to libuv (async)                              │
│    • libuv uses OS async I/O or thread pool                                 │
│    • Callbacks queued when operations complete                              │
│                                                                              │
│    Important: Only JS is single-threaded!                                   │
│    • libuv thread pool handles blocking operations                          │
│    • crypto, zlib, dns.lookup use thread pool                               │
│    • Worker threads for CPU-intensive JS                                    │
└─────────────────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────────────────┐
│ Q4: Explain Node.js garbage collection.                                     │
├─────────────────────────────────────────────────────────────────────────────┤
│ A: V8 uses generational garbage collection:                                  │
│                                                                              │
│    Memory structure:                                                         │
│    ┌───────────────────────────────────────────────────────┐                │
│    │  Young Generation (1-8MB)  │  Old Generation (>1GB)   │                │
│    │  ├── New Space            │  └── Old Space            │                │
│    │  │   ├── From Space       │      (Long-lived objects) │                │
│    │  │   └── To Space         │                           │                │
│    └───────────────────────────────────────────────────────┘                │
│                                                                              │
│    Collection strategies:                                                    │
│    • Scavenge (Minor GC) - Fast, Young Generation only                      │
│    • Mark-Sweep-Compact (Major GC) - Slower, Old Generation                 │
│    • Incremental marking - Reduces pause times                              │
│    • Concurrent sweeping - Background sweeping                              │
│                                                                              │
│    Memory limits (default):                                                  │
│    • ~1.4GB on 64-bit systems                                               │
│    • Can increase: --max-old-space-size=4096                                │
└─────────────────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────────────────┐
│ Q5: What is libuv and why is it needed?                                     │
├─────────────────────────────────────────────────────────────────────────────┤
│ A: libuv is a C library providing:                                          │
│                                                                              │
│    1. Event Loop - Orchestrates async operations                            │
│    2. Thread Pool - For blocking operations (default 4 threads)             │
│    3. Cross-platform Async I/O - epoll/kqueue/IOCP abstraction              │
│    4. Timers, signals, child processes                                      │
│                                                                              │
│    Why needed:                                                               │
│    • V8 doesn't provide I/O mechanisms                                      │
│    • Different OS async APIs (epoll, kqueue, IOCP)                          │
│    • Need thread pool for operations without OS async support               │
│    • Event loop implementation                                              │
│                                                                              │
│    Operations using thread pool (UV_THREADPOOL_SIZE=4):                     │
│    • fs.readFile (most fs operations)                                       │
│    • crypto (CPU-intensive)                                                 │
│    • zlib (compression)                                                     │
│    • dns.lookup (uses getaddrinfo)                                          │
└─────────────────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────────────────┐
│ Q6: What is the --max-old-space-size flag and when would you use it?        │
├─────────────────────────────────────────────────────────────────────────────┤
│ A: It sets the maximum size of V8's old generation heap.                    │
│                                                                              │
│    Default limits:                                                           │
│    • ~1.4GB on 64-bit systems                                               │
│    • ~700MB on 32-bit systems                                               │
│                                                                              │
│    When to increase:                                                         │
│    • Processing large datasets                                              │
│    • Working with large in-memory caches                                    │
│    • Hitting "FATAL ERROR: CALL_AND_RETRY_LAST Allocation failed"           │
│                                                                              │
│    Usage:                                                                    │
│    node --max-old-space-size=4096 app.js  // 4GB                            │
│                                                                              │
│    Caution:                                                                  │
│    • Don't set higher than available RAM                                    │
│    • Leave room for OS and other processes                                  │
│    • Consider streaming for large data instead                              │
└─────────────────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────────────────┐
│ Q7: What happens when you require() a module?                               │
├─────────────────────────────────────────────────────────────────────────────┤
│ A: Module loading process:                                                   │
│                                                                              │
│    1. Resolution - Find the file path                                       │
│       • Core modules (built-in) → loaded directly                           │
│       • Relative paths → resolve from current file                          │
│       • node_modules → search up directory tree                             │
│                                                                              │
│    2. Loading - Read file from disk                                         │
│       • .js → JavaScript source                                             │
│       • .json → JSON.parse()                                                │
│       • .node → Native C++ addon                                            │
│                                                                              │
│    3. Wrapping - Wrap in function                                           │
│       (function(exports, require, module, __filename, __dirname) {          │
│         // Your code here                                                   │
│       });                                                                    │
│                                                                              │
│    4. Execution - Run the wrapped function                                  │
│                                                                              │
│    5. Caching - Store in require.cache                                      │
│       • Subsequent require() returns cached module                          │
│       • Modules are singletons                                              │
└─────────────────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────────────────┐
│ Q8: Difference between process.nextTick() and setImmediate()?               │
├─────────────────────────────────────────────────────────────────────────────┤
│ A: Both schedule callbacks, but at different phases:                        │
│                                                                              │
│    process.nextTick():                                                       │
│    • Runs BEFORE continuing to the next event loop phase                    │
│    • Part of "microtask queue"                                              │
│    • Can starve the event loop if recursive                                 │
│    • Use for: ensuring async callback execution                             │
│                                                                              │
│    setImmediate():                                                           │
│    • Runs in the "check" phase of the event loop                            │
│    • After I/O callbacks                                                    │
│    • Allows I/O to be processed between calls                               │
│    • Use for: breaking up CPU-intensive tasks                               │
│                                                                              │
│    Priority order:                                                           │
│    1. process.nextTick() callbacks                                          │
│    2. Promise microtasks                                                     │
│    3. Event loop phases (including setImmediate)                            │
│                                                                              │
│    Recommendation: Prefer setImmediate() for most cases.                    │
└─────────────────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────────────────┐
│ Q9: What are Node.js core modules and how are they different?               │
├─────────────────────────────────────────────────────────────────────────────┤
│ A: Core modules are built into Node.js binary:                              │
│                                                                              │
│    Examples: fs, http, path, crypto, os, util, stream, events               │
│                                                                              │
│    Differences from user modules:                                            │
│    1. No file path needed: require('fs') not require('./fs')               │
│    2. Loaded first (before node_modules)                                    │
│    3. Some are C++ bindings (faster)                                        │
│    4. Cannot be overridden by node_modules                                  │
│    5. Part of Node.js installation                                          │
│                                                                              │
│    Loading priority:                                                         │
│    1. Core modules                                                           │
│    2. node_modules packages                                                  │
│    3. Relative/absolute paths                                               │
│                                                                              │
│    Note: Use 'node:fs' prefix for explicit core module (Node 16+)           │
│    const fs = require('node:fs');  // Always core module                    │
└─────────────────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────────────────┐
│ Q10: How do you detect and fix memory leaks in Node.js?                     │
├─────────────────────────────────────────────────────────────────────────────┤
│ A: Detection methods:                                                        │
│                                                                              │
│    1. Monitor process.memoryUsage()                                         │
│       • heapUsed growing continuously = potential leak                      │
│                                                                              │
│    2. Chrome DevTools                                                        │
│       • node --inspect app.js                                               │
│       • Take heap snapshots                                                 │
│       • Compare snapshots over time                                         │
│                                                                              │
│    3. Heap profiling tools                                                   │
│       • clinic.js, heapdump, memwatch-next                                  │
│                                                                              │
│    Common leak sources:                                                      │
│    • Forgotten event listeners                                              │
│    • Closures holding references                                            │
│    • Global variables                                                        │
│    • Unclosed database connections                                          │
│    • Timers not cleared                                                      │
│                                                                              │
│    Fixes:                                                                    │
│    • Remove event listeners (removeListener, once)                          │
│    • Use WeakMap/WeakSet for caches                                         │
│    • Clear timers (clearInterval, clearTimeout)                             │
│    • Close connections properly                                             │
└─────────────────────────────────────────────────────────────────────────────┘
`);


/**
 * ╔═══════════════════════════════════════════════════════════════════════════╗
 * ║                    SECTION 2: EVENT LOOP                                   ║
 * ╚═══════════════════════════════════════════════════════════════════════════╝
 */

console.log("\n" + "═".repeat(70));
console.log("              SECTION 2: EVENT LOOP (10 Questions)                 ");
console.log("═══════════════════════════════════════════════════════════════════\n");

console.log(`
┌─────────────────────────────────────────────────────────────────────────────┐
│ Q11: Explain the phases of the Node.js event loop.                          │
├─────────────────────────────────────────────────────────────────────────────┤
│ A: The event loop has 6 phases (in order):                                  │
│                                                                              │
│    1. TIMERS                                                                 │
│       • Execute setTimeout/setInterval callbacks                            │
│       • Callbacks that have reached their threshold                         │
│                                                                              │
│    2. PENDING CALLBACKS                                                      │
│       • I/O callbacks deferred from previous cycle                          │
│       • Some system operations (TCP errors)                                 │
│                                                                              │
│    3. IDLE, PREPARE                                                          │
│       • Internal use only                                                   │
│                                                                              │
│    4. POLL                                                                   │
│       • Retrieve new I/O events                                             │
│       • Execute I/O callbacks                                               │
│       • May block here if nothing else to do                                │
│                                                                              │
│    5. CHECK                                                                  │
│       • Execute setImmediate callbacks                                      │
│                                                                              │
│    6. CLOSE CALLBACKS                                                        │
│       • socket.on('close'), cleanup callbacks                               │
│                                                                              │
│    Between each phase: process.nextTick and Promise microtasks              │
└─────────────────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────────────────┐
│ Q12: What's the output and why?                                             │
│                                                                              │
│ console.log('1');                                                           │
│ setTimeout(() => console.log('2'), 0);                                      │
│ Promise.resolve().then(() => console.log('3'));                             │
│ process.nextTick(() => console.log('4'));                                   │
│ console.log('5');                                                           │
├─────────────────────────────────────────────────────────────────────────────┤
│ A: Output: 1, 5, 4, 3, 2                                                    │
│                                                                              │
│    Explanation:                                                              │
│    1. '1' - Synchronous, runs immediately                                   │
│    2. setTimeout queued to timer phase                                      │
│    3. Promise.then queued to microtask queue                                │
│    4. nextTick queued to nextTick queue                                     │
│    5. '5' - Synchronous, runs immediately                                   │
│    6. '4' - nextTick runs first (before microtasks)                         │
│    7. '3' - Promise microtask runs next                                     │
│    8. '2' - Timer callback runs last                                        │
│                                                                              │
│    Priority: sync → nextTick → microtasks → event loop phases              │
└─────────────────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────────────────┐
│ Q13: What is "event loop starvation" and how do you prevent it?             │
├─────────────────────────────────────────────────────────────────────────────┤
│ A: Event loop starvation occurs when:                                        │
│                                                                              │
│    • Long-running synchronous code blocks the loop                          │
│    • Recursive process.nextTick prevents phases from running                │
│    • Heavy computation in a single tick                                     │
│                                                                              │
│    Symptoms:                                                                 │
│    • Delayed I/O responses                                                  │
│    • Timers fire late                                                       │
│    • Server becomes unresponsive                                            │
│                                                                              │
│    Prevention:                                                               │
│    1. Break CPU work into chunks with setImmediate                          │
│       function process(items, callback) {                                   │
│         if (items.length === 0) return callback();                          │
│         processItem(items.shift());                                         │
│         setImmediate(() => process(items, callback));                       │
│       }                                                                      │
│                                                                              │
│    2. Use worker threads for heavy computation                              │
│    3. Avoid blocking operations in event handlers                           │
│    4. Use streaming for large data processing                               │
└─────────────────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────────────────┐
│ Q14: How are timers handled in Node.js?                                     │
├─────────────────────────────────────────────────────────────────────────────┤
│ A: Timers are managed by the timers phase of the event loop:                │
│                                                                              │
│    setTimeout(callback, delay):                                              │
│    • Callback queued after delay milliseconds                               │
│    • NOT guaranteed to run exactly at delay                                 │
│    • Runs at first opportunity after delay passes                           │
│    • Minimum delay: 1ms (0 is coerced to 1)                                 │
│                                                                              │
│    setInterval(callback, delay):                                             │
│    • Repeats callback every delay milliseconds                              │
│    • Can drift if callback takes longer than delay                          │
│    • Use setTimeout recursion for accurate intervals                        │
│                                                                              │
│    Timer implementation:                                                     │
│    • Stored in a min-heap by expiry time                                    │
│    • libuv checks timers at start of event loop iteration                   │
│    • Multiple timers with same delay share list (efficient)                 │
│                                                                              │
│    Precision:                                                                │
│    • Not real-time precise (~1ms resolution on most systems)                │
│    • Event loop latency affects actual timing                               │
└─────────────────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────────────────┐
│ Q15: What is the poll phase and why is it special?                          │
├─────────────────────────────────────────────────────────────────────────────┤
│ A: The poll phase is where Node.js spends most of its time:                 │
│                                                                              │
│    Responsibilities:                                                         │
│    1. Calculate how long to block and wait for I/O                          │
│    2. Process events in the poll queue (I/O callbacks)                      │
│                                                                              │
│    Behavior:                                                                 │
│    • If poll queue is not empty:                                            │
│      → Execute callbacks until queue is empty or limit reached              │
│                                                                              │
│    • If poll queue is empty:                                                 │
│      → If setImmediate exists → move to check phase                         │
│      → If timers exist → check if any expired, wrap to timers               │
│      → Otherwise → block and wait for new I/O events                        │
│                                                                              │
│    Why special:                                                              │
│    • Only phase that can block the event loop                               │
│    • Most I/O callbacks execute here                                        │
│    • Controls when loop moves forward or waits                              │
└─────────────────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────────────────┐
│ Q16: When would setTimeout vs setImmediate have unpredictable order?        │
├─────────────────────────────────────────────────────────────────────────────┤
│ A: When called in the main module (not in I/O callback):                    │
│                                                                              │
│    setTimeout(() => console.log('timeout'), 0);                             │
│    setImmediate(() => console.log('immediate'));                            │
│                                                                              │
│    Output: UNPREDICTABLE (could be either order)                            │
│                                                                              │
│    Why?                                                                      │
│    • Depends on process startup time                                        │
│    • setTimeout 0 becomes 1ms                                               │
│    • If loop starts < 1ms: timers phase has nothing                         │
│    • If loop starts >= 1ms: timer fires first                               │
│                                                                              │
│    GUARANTEED order (inside I/O callback):                                  │
│    fs.readFile('file', () => {                                              │
│      setTimeout(() => console.log('timeout'), 0);                           │
│      setImmediate(() => console.log('immediate'));                          │
│    });                                                                       │
│    // Always: immediate, timeout                                            │
│    // (I/O callback is in poll, check phase comes next)                     │
└─────────────────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────────────────┐
│ Q17: How do microtasks work in Node.js?                                     │
├─────────────────────────────────────────────────────────────────────────────┤
│ A: Microtasks run between event loop phases:                                │
│                                                                              │
│    Two microtask queues:                                                     │
│    1. nextTick queue (process.nextTick)                                     │
│    2. Promise queue (Promise.then, queueMicrotask)                          │
│                                                                              │
│    Execution order:                                                          │
│    • After each phase, before moving to next:                               │
│      1. Drain all nextTick callbacks                                        │
│      2. Drain all Promise callbacks                                         │
│      3. Repeat until both queues empty                                      │
│      4. Move to next phase                                                  │
│                                                                              │
│    Important:                                                                │
│    • Microtasks can queue more microtasks                                   │
│    • All microtasks processed before phase change                           │
│    • Can starve event loop if infinite microtasks                           │
│                                                                              │
│    Best practice:                                                            │
│    • Use Promise for async coordination                                     │
│    • Use nextTick for immediate async execution                             │
│    • Avoid recursive nextTick (starves I/O)                                 │
└─────────────────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────────────────┐
│ Q18: What is the close callbacks phase?                                     │
├─────────────────────────────────────────────────────────────────────────────┤
│ A: The close callbacks phase handles cleanup:                               │
│                                                                              │
│    Executed callbacks:                                                       │
│    • socket.on('close', callback)                                           │
│    • server.on('close', callback)                                           │
│    • Resources destroyed with socket.destroy()                              │
│                                                                              │
│    When NOT in close phase:                                                  │
│    • process.on('exit') - not part of event loop                           │
│    • socket.on('end') - runs in poll phase                                  │
│                                                                              │
│    Purpose:                                                                  │
│    • Clean up resources                                                     │
│    • Final operations before resource is gone                               │
│    • Runs after all other I/O is processed                                  │
│                                                                              │
│    Example:                                                                  │
│    const socket = net.connect(port);                                        │
│    socket.on('close', () => {                                               │
│      // Runs in close callbacks phase                                       │
│      console.log('Connection closed');                                      │
│    });                                                                       │
└─────────────────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────────────────┐
│ Q19: How can you measure event loop lag?                                    │
├─────────────────────────────────────────────────────────────────────────────┤
│ A: Several methods to measure event loop latency:                           │
│                                                                              │
│    1. Simple timer-based measurement:                                       │
│       let last = Date.now();                                                │
│       setInterval(() => {                                                   │
│         const now = Date.now();                                             │
│         const lag = now - last - 1000;                                      │
│         console.log('Lag:', lag, 'ms');                                     │
│         last = now;                                                         │
│       }, 1000);                                                             │
│                                                                              │
│    2. monitorEventLoopDelay (Node.js 11+):                                  │
│       const { monitorEventLoopDelay } = require('perf_hooks');              │
│       const h = monitorEventLoopDelay({ resolution: 20 });                  │
│       h.enable();                                                           │
│       // h.percentile(99) for p99 latency                                   │
│                                                                              │
│    3. Third-party: blocked-at, event-loop-lag                               │
│                                                                              │
│    Normal latency: < 10ms                                                   │
│    Concerning: > 100ms                                                      │
│    Critical: > 1000ms                                                       │
└─────────────────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────────────────┐
│ Q20: What determines when the event loop exits?                             │
├─────────────────────────────────────────────────────────────────────────────┤
│ A: Event loop exits when nothing is keeping it alive:                       │
│                                                                              │
│    Things that keep loop alive (refs):                                       │
│    • Active timers (setTimeout, setInterval)                                │
│    • Open handles (servers, sockets)                                        │
│    • Pending I/O operations                                                 │
│    • Active child processes                                                 │
│                                                                              │
│    Removing refs:                                                            │
│    • timer.unref() - Don't keep alive for this timer                        │
│    • server.unref() - Server won't keep process alive                       │
│                                                                              │
│    Force exit:                                                               │
│    • process.exit(code) - Immediate exit                                    │
│    • All refs removed naturally                                             │
│                                                                              │
│    Example:                                                                  │
│    const timer = setTimeout(() => {}, 1000000);                             │
│    timer.unref();  // Process can exit before timer fires                   │
│                                                                              │
│    Check ref count:                                                          │
│    process._getActiveHandles()                                              │
│    process._getActiveRequests()                                             │
└─────────────────────────────────────────────────────────────────────────────┘
`);


/**
 * ╔═══════════════════════════════════════════════════════════════════════════╗
 * ║                    SECTION 3: STREAMS & BUFFERS                            ║
 * ╚═══════════════════════════════════════════════════════════════════════════╝
 */

console.log("\n" + "═".repeat(70));
console.log("           SECTION 3: STREAMS & BUFFERS (10 Questions)             ");
console.log("═══════════════════════════════════════════════════════════════════\n");

console.log(`
┌─────────────────────────────────────────────────────────────────────────────┐
│ Q21: What are the four types of streams in Node.js?                         │
├─────────────────────────────────────────────────────────────────────────────┤
│ A: 1. Readable - Source of data                                             │
│       Examples: fs.createReadStream, http.IncomingMessage                   │
│                                                                              │
│    2. Writable - Destination for data                                       │
│       Examples: fs.createWriteStream, http.ServerResponse                   │
│                                                                              │
│    3. Duplex - Both readable and writable (independent)                     │
│       Examples: net.Socket, TCP sockets                                     │
│                                                                              │
│    4. Transform - Duplex that modifies data passing through                 │
│       Examples: zlib.createGzip, crypto.createCipher                        │
│                                                                              │
│    Key difference Duplex vs Transform:                                      │
│    • Duplex: Read and write are independent                                 │
│    • Transform: Output is transformation of input                           │
└─────────────────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────────────────┐
│ Q22: What is backpressure and how do you handle it?                         │
├─────────────────────────────────────────────────────────────────────────────┤
│ A: Backpressure occurs when data is produced faster than consumed:          │
│                                                                              │
│    Problem:                                                                  │
│    Producer (100/sec) → Buffer (fills up) → Consumer (10/sec)               │
│    Memory keeps growing!                                                    │
│                                                                              │
│    Detection:                                                                │
│    • writable.write() returns false when buffer full                        │
│                                                                              │
│    Handling:                                                                 │
│    1. Check write() return value:                                           │
│       if (!writable.write(chunk)) {                                         │
│         // Stop reading/producing                                           │
│         readable.pause();                                                   │
│       }                                                                      │
│                                                                              │
│    2. Wait for 'drain' event:                                               │
│       writable.on('drain', () => {                                          │
│         // Resume producing                                                 │
│         readable.resume();                                                  │
│       });                                                                    │
│                                                                              │
│    3. Use pipe() - handles automatically:                                   │
│       readable.pipe(writable);                                              │
└─────────────────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────────────────┐
│ Q23: Difference between Buffer.alloc() and Buffer.allocUnsafe()?            │
├─────────────────────────────────────────────────────────────────────────────┤
│ A: Buffer.alloc(size):                                                       │
│    • Initializes memory to zeros                                            │
│    • Safe - no old data leakage                                             │
│    • Slightly slower                                                        │
│                                                                              │
│    Buffer.allocUnsafe(size):                                                 │
│    • Does NOT initialize memory                                             │
│    • May contain old memory data (security risk!)                           │
│    • Faster allocation                                                      │
│                                                                              │
│    When to use allocUnsafe:                                                  │
│    • Performance critical                                                   │
│    • You'll immediately overwrite ALL bytes                                 │
│                                                                              │
│    Security example:                                                         │
│    const unsafe = Buffer.allocUnsafe(100);                                  │
│    console.log(unsafe);  // May show old data from memory!                  │
│                                                                              │
│    const safe = Buffer.alloc(100);                                          │
│    console.log(safe);  // Always zeros                                      │
└─────────────────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────────────────┐
│ Q24: Why use streams instead of loading entire file into memory?            │
├─────────────────────────────────────────────────────────────────────────────┤
│ A: Memory efficiency and time-to-first-byte:                                │
│                                                                              │
│    Without streams (fs.readFile):                                           │
│    • 1GB file = 1GB memory used                                             │
│    • Must wait for entire file before processing                            │
│    • Can crash with large files                                             │
│                                                                              │
│    With streams (fs.createReadStream):                                       │
│    • ~64KB memory regardless of file size                                   │
│    • Start processing immediately                                           │
│    • Can handle files larger than RAM                                       │
│                                                                              │
│    Example comparison:                                                       │
│    // ❌ Bad: Loads entire file                                             │
│    const data = fs.readFileSync('huge.log');                                │
│    data.split('\\n').forEach(processLine);                                  │
│                                                                              │
│    // ✅ Good: Streams line by line                                         │
│    const rl = readline.createInterface({                                    │
│      input: fs.createReadStream('huge.log')                                 │
│    });                                                                       │
│    for await (const line of rl) processLine(line);                          │
└─────────────────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────────────────┐
│ Q25: What is highWaterMark?                                                 │
├─────────────────────────────────────────────────────────────────────────────┤
│ A: The internal buffer size threshold (in bytes):                           │
│                                                                              │
│    Default values:                                                           │
│    • 16KB for most streams                                                  │
│    • 16 objects for objectMode streams                                      │
│                                                                              │
│    For Readable streams:                                                     │
│    • When buffer < highWaterMark: keep reading from source                  │
│    • When buffer >= highWaterMark: pause reading                            │
│                                                                              │
│    For Writable streams:                                                     │
│    • When buffer < highWaterMark: write() returns true                      │
│    • When buffer >= highWaterMark: write() returns false                    │
│                                                                              │
│    Customizing:                                                              │
│    fs.createReadStream('file', { highWaterMark: 64 * 1024 }); // 64KB       │
│                                                                              │
│    Trade-offs:                                                               │
│    • Higher = more memory, better throughput                                │
│    • Lower = less memory, more overhead                                     │
└─────────────────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────────────────┐
│ Q26: Difference between pipe() and pipeline()?                              │
├─────────────────────────────────────────────────────────────────────────────┤
│ A: pipe():                                                                   │
│    readable.pipe(transform).pipe(writable)                                  │
│    • Basic chaining                                                         │
│    • Does NOT propagate errors automatically                                │
│    • Does NOT clean up streams on error                                     │
│    • Returns destination stream                                             │
│                                                                              │
│    pipeline() (recommended):                                                 │
│    const { pipeline } = require('stream/promises');                         │
│    await pipeline(readable, transform, writable);                           │
│    • Automatic error handling                                               │
│    • Destroys all streams on error                                          │
│    • Returns promise for completion                                         │
│    • Available since Node 10, promisified in Node 15                        │
│                                                                              │
│    Error handling comparison:                                                │
│    // pipe - need manual error handling                                     │
│    src.on('error', handle);                                                 │
│    dest.on('error', handle);                                                │
│                                                                              │
│    // pipeline - automatic                                                  │
│    pipeline(src, dest).catch(handle);                                       │
└─────────────────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────────────────┐
│ Q27: What are objectMode streams?                                           │
├─────────────────────────────────────────────────────────────────────────────┤
│ A: Streams that handle JavaScript objects instead of bytes:                 │
│                                                                              │
│    Default mode:                                                             │
│    • Streams handle Buffers or strings                                      │
│    • highWaterMark in bytes (16KB)                                          │
│                                                                              │
│    objectMode:                                                               │
│    • Streams handle any JavaScript objects                                  │
│    • highWaterMark in object count (16)                                     │
│                                                                              │
│    Creating:                                                                 │
│    const { Transform } = require('stream');                                 │
│    const transform = new Transform({                                        │
│      objectMode: true,                                                      │
│      transform(obj, encoding, callback) {                                   │
│        this.push({ ...obj, processed: true });                              │
│        callback();                                                          │
│      }                                                                       │
│    });                                                                       │
│                                                                              │
│    Use cases:                                                                │
│    • Database record streaming                                              │
│    • JSON line parsing                                                      │
│    • Data transformation pipelines                                          │
└─────────────────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────────────────┐
│ Q28: How do you implement a custom readable stream?                         │
├─────────────────────────────────────────────────────────────────────────────┤
│ A: Extend Readable and implement _read():                                   │
│                                                                              │
│    const { Readable } = require('stream');                                  │
│                                                                              │
│    class Counter extends Readable {                                         │
│      constructor(max) {                                                     │
│        super();                                                             │
│        this.max = max;                                                      │
│        this.current = 0;                                                    │
│      }                                                                       │
│                                                                              │
│      _read() {                                                              │
│        if (this.current < this.max) {                                       │
│          this.push(String(this.current++));                                 │
│        } else {                                                             │
│          this.push(null);  // Signal end                                    │
│        }                                                                     │
│      }                                                                       │
│    }                                                                         │
│                                                                              │
│    Simpler approach (Readable.from):                                        │
│    const stream = Readable.from([1, 2, 3]);                                 │
│    const stream = Readable.from(asyncGenerator());                          │
└─────────────────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────────────────┐
│ Q29: What happens if you don't consume a readable stream?                   │
├─────────────────────────────────────────────────────────────────────────────┤
│ A: Data accumulates in internal buffer → memory issues:                     │
│                                                                              │
│    const readable = fs.createReadStream('large.file');                      │
│    // Not consuming... data buffers in memory!                              │
│                                                                              │
│    Stream states:                                                            │
│    • Paused (initial) - data accumulates when pushed                        │
│    • Flowing - data emits via 'data' event                                  │
│                                                                              │
│    How to consume:                                                           │
│    1. 'data' event (flowing mode)                                           │
│    2. pipe() to destination                                                 │
│    3. async iteration: for await (const chunk of stream)                    │
│    4. read() method (paused mode)                                           │
│                                                                              │
│    If you don't need data:                                                   │
│    readable.resume();  // Discard data                                      │
│    // or                                                                    │
│    readable.destroy();  // Close stream                                     │
└─────────────────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────────────────┐
│ Q30: How do you handle errors in stream pipelines?                          │
├─────────────────────────────────────────────────────────────────────────────┤
│ A: Multiple strategies:                                                     │
│                                                                              │
│    1. Using pipeline (recommended):                                         │
│       const { pipeline } = require('stream/promises');                      │
│       try {                                                                 │
│         await pipeline(src, transform, dest);                               │
│       } catch (err) {                                                       │
│         // Handles errors from ANY stream in pipeline                       │
│         // All streams are automatically destroyed                          │
│       }                                                                      │
│                                                                              │
│    2. Error events on each stream:                                          │
│       src.on('error', cleanup);                                             │
│       transform.on('error', cleanup);                                       │
│       dest.on('error', cleanup);                                            │
│       // Tedious but gives fine control                                     │
│                                                                              │
│    3. finished() helper:                                                    │
│       const { finished } = require('stream/promises');                      │
│       await finished(stream);  // Resolves on 'finish' or rejects on error │
│                                                                              │
│    Common errors:                                                            │
│    • ENOENT - File not found                                                │
│    • EPIPE - Write to closed stream                                         │
│    • ERR_STREAM_DESTROYED - Stream was destroyed                            │
└─────────────────────────────────────────────────────────────────────────────┘
`);


/**
 * ╔═══════════════════════════════════════════════════════════════════════════╗
 * ║                    SECTION 4: SCALING & CONCURRENCY                        ║
 * ╚═══════════════════════════════════════════════════════════════════════════╝
 */

console.log("\n" + "═".repeat(70));
console.log("         SECTION 4: SCALING & CONCURRENCY (10 Questions)           ");
console.log("═══════════════════════════════════════════════════════════════════\n");

console.log(`
┌─────────────────────────────────────────────────────────────────────────────┐
│ Q31: Cluster vs Worker Threads vs Child Processes?                          │
├─────────────────────────────────────────────────────────────────────────────┤
│ A: Cluster Module:                                                           │
│    • Multiple Node.js processes sharing same port                           │
│    • Each process = separate V8, separate memory                            │
│    • Built-in load balancing (round-robin)                                  │
│    • Best for: Scaling HTTP servers                                         │
│                                                                              │
│    Worker Threads:                                                           │
│    • Multiple threads in same process                                       │
│    • Separate V8 isolates, can share memory (SharedArrayBuffer)             │
│    • Lighter weight than processes                                          │
│    • Best for: CPU-intensive JS computation                                 │
│                                                                              │
│    Child Processes:                                                          │
│    • Spawn any external program                                             │
│    • Completely separate processes                                          │
│    • Best for: Running shell commands, external programs                    │
│                                                                              │
│    Summary:                                                                  │
│    • HTTP scaling → Cluster                                                 │
│    • CPU work → Worker Threads                                              │
│    • External programs → Child Processes                                    │
└─────────────────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────────────────┐
│ Q32: How does cluster load balancing work?                                  │
├─────────────────────────────────────────────────────────────────────────────┤
│ A: Two scheduling policies:                                                  │
│                                                                              │
│    1. SCHED_RR (Round-Robin) - Default on Linux/Mac:                        │
│       • Master accepts connections                                          │
│       • Distributes to workers in round-robin                               │
│       • Fair distribution regardless of worker load                         │
│                                                                              │
│    2. SCHED_NONE - Default on Windows:                                      │
│       • OS handles distribution                                             │
│       • Workers compete for accept()                                        │
│       • Can lead to uneven distribution                                     │
│                                                                              │
│    Set policy:                                                               │
│    cluster.schedulingPolicy = cluster.SCHED_RR;                             │
│    // or env: NODE_CLUSTER_SCHED_POLICY=rr                                  │
│                                                                              │
│    How round-robin works:                                                    │
│    Master → Worker1, Worker2, Worker3, Worker1, Worker2...                  │
└─────────────────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────────────────┐
│ Q33: How do you share state between cluster workers?                        │
├─────────────────────────────────────────────────────────────────────────────┤
│ A: Workers don't share memory! Options:                                     │
│                                                                              │
│    1. External data store (recommended):                                    │
│       • Redis - Fast, pub/sub, good for sessions                           │
│       • Database - Persistent, consistent                                   │
│       • Memcached - Simple caching                                          │
│                                                                              │
│    2. Master as coordinator:                                                 │
│       • Workers send state to master via IPC                                │
│       • Master broadcasts to all workers                                    │
│       • Simple but creates bottleneck                                       │
│                                                                              │
│    3. Sticky sessions:                                                       │
│       • Route same client to same worker                                    │
│       • Workers maintain local state                                        │
│       • Risk: worker crash = state loss                                     │
│                                                                              │
│    Example with Redis:                                                       │
│    const session = require('express-session');                              │
│    const RedisStore = require('connect-redis')(session);                    │
│    app.use(session({ store: new RedisStore({ client: redis }) }));          │
└─────────────────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────────────────┐
│ Q34: How do worker threads share memory?                                    │
├─────────────────────────────────────────────────────────────────────────────┤
│ A: Using SharedArrayBuffer:                                                  │
│                                                                              │
│    const { Worker } = require('worker_threads');                            │
│                                                                              │
│    // Main thread                                                           │
│    const sharedBuffer = new SharedArrayBuffer(4);                           │
│    const sharedArray = new Int32Array(sharedBuffer);                        │
│                                                                              │
│    const worker = new Worker('./worker.js', {                               │
│      workerData: { sharedBuffer }                                           │
│    });                                                                       │
│                                                                              │
│    // Worker thread                                                         │
│    const sharedArray = new Int32Array(workerData.sharedBuffer);             │
│    Atomics.add(sharedArray, 0, 1);  // Thread-safe increment                │
│                                                                              │
│    IMPORTANT: Must use Atomics API!                                         │
│    • Atomics.load(), Atomics.store()                                        │
│    • Atomics.add(), Atomics.sub()                                           │
│    • Atomics.wait(), Atomics.notify()                                       │
│                                                                              │
│    Without Atomics → Race conditions!                                       │
└─────────────────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────────────────┐
│ Q35: When should you NOT use worker threads?                                │
├─────────────────────────────────────────────────────────────────────────────┤
│ A: Don't use for:                                                           │
│                                                                              │
│    1. I/O operations:                                                       │
│       • Already async via event loop                                        │
│       • Adding threads adds overhead, no benefit                            │
│                                                                              │
│    2. Database queries:                                                      │
│       • Already non-blocking                                                │
│       • Database handles concurrency                                        │
│                                                                              │
│    3. HTTP handling:                                                         │
│       • Use cluster for scaling instead                                     │
│       • Workers share load, not threads                                     │
│                                                                              │
│    4. Quick operations (< 10ms):                                            │
│       • Thread creation overhead not worth it                               │
│       • Just run in main thread                                             │
│                                                                              │
│    USE worker threads for:                                                  │
│    • CPU-intensive computation (> 10-50ms)                                  │
│    • Image/video processing                                                 │
│    • Crypto operations                                                      │
│    • Parsing large files                                                    │
│    • Mathematical calculations                                              │
└─────────────────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────────────────┐
│ Q36: What's the difference between spawn() and exec()?                      │
├─────────────────────────────────────────────────────────────────────────────┤
│ A: spawn():                                                                  │
│    • Does NOT use shell (unless shell: true)                                │
│    • Returns streams (stdout/stderr)                                        │
│    • Memory efficient for large output                                      │
│    • Arguments as array                                                     │
│    spawn('ls', ['-la', '/tmp'])                                             │
│                                                                              │
│    exec():                                                                   │
│    • Uses shell (/bin/sh -c)                                                │
│    • Returns buffered string                                                │
│    • maxBuffer limit (default 1MB)                                          │
│    • Can use shell features (pipes, redirects)                              │
│    exec('ls -la | grep node')                                               │
│                                                                              │
│    Security:                                                                 │
│    • spawn with array = safer (no shell injection)                          │
│    • exec with user input = DANGEROUS!                                      │
│                                                                              │
│    Use spawn for:                                                            │
│    • Long-running processes                                                 │
│    • Large output                                                           │
│    • Security with user input                                               │
│                                                                              │
│    Use exec for:                                                             │
│    • Quick shell commands                                                   │
│    • Small output                                                           │
│    • Need shell features                                                    │
└─────────────────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────────────────┐
│ Q37: How do you implement zero-downtime restart?                            │
├─────────────────────────────────────────────────────────────────────────────┤
│ A: Rolling restart pattern:                                                  │
│                                                                              │
│    async function rollingRestart() {                                        │
│      const workers = Object.values(cluster.workers);                        │
│                                                                              │
│      for (const worker of workers) {                                        │
│        // 1. Fork new worker first                                          │
│        const newWorker = cluster.fork();                                    │
│        await new Promise(r => newWorker.on('listening', r));                │
│                                                                              │
│        // 2. Gracefully disconnect old worker                               │
│        worker.disconnect();                                                 │
│        await new Promise(r => worker.on('exit', r));                        │
│      }                                                                       │
│    }                                                                         │
│                                                                              │
│    Key points:                                                               │
│    • Always have at least N workers running                                 │
│    • New worker ready before old disconnects                                │
│    • disconnect() allows existing connections to finish                     │
│    • Set timeout for stuck connections                                      │
│                                                                              │
│    Or use PM2: pm2 reload app                                               │
└─────────────────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────────────────┐
│ Q38: What is UV_THREADPOOL_SIZE and when should you change it?              │
├─────────────────────────────────────────────────────────────────────────────┤
│ A: UV_THREADPOOL_SIZE controls libuv's thread pool:                         │
│                                                                              │
│    Default: 4 threads                                                        │
│    Maximum: 1024 threads                                                     │
│                                                                              │
│    Operations using thread pool:                                            │
│    • fs operations (read, write, stat)                                      │
│    • crypto (pbkdf2, randomBytes)                                           │
│    • zlib (compression)                                                     │
│    • dns.lookup()                                                           │
│                                                                              │
│    When to increase:                                                         │
│    • Many concurrent file system operations                                 │
│    • Heavy crypto workload                                                  │
│    • Lots of dns.lookup() calls                                             │
│    • Seeing "thread pool exhaustion" symptoms                               │
│                                                                              │
│    Set before requiring modules:                                            │
│    process.env.UV_THREADPOOL_SIZE = 64;                                     │
│    // or                                                                    │
│    UV_THREADPOOL_SIZE=64 node app.js                                        │
│                                                                              │
│    Recommendation: numCPUs * 2 for heavy I/O                                │
└─────────────────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────────────────┐
│ Q39: How many workers should you spawn with cluster?                        │
├─────────────────────────────────────────────────────────────────────────────┤
│ A: Depends on workload type:                                                │
│                                                                              │
│    CPU-bound work:                                                           │
│    • numCPUs workers (one per core)                                         │
│    • More workers = context switching overhead                              │
│                                                                              │
│    I/O-bound work:                                                           │
│    • numCPUs or numCPUs + 1                                                 │
│    • Extra worker helps when others wait on I/O                             │
│                                                                              │
│    Mixed workload:                                                           │
│    • Start with numCPUs                                                     │
│    • Monitor and adjust based on metrics                                    │
│                                                                              │
│    Common pattern:                                                           │
│    const numCPUs = require('os').cpus().length;                             │
│    for (let i = 0; i < numCPUs; i++) {                                      │
│      cluster.fork();                                                        │
│    }                                                                         │
│                                                                              │
│    Consider:                                                                 │
│    • Available memory (each worker ~50-100MB base)                          │
│    • Other processes on server                                              │
│    • Container memory limits                                                │
└─────────────────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────────────────┐
│ Q40: How do you prevent shell injection attacks?                            │
├─────────────────────────────────────────────────────────────────────────────┤
│ A: Shell injection occurs with exec() and user input:                       │
│                                                                              │
│    ❌ DANGEROUS:                                                            │
│    const userInput = req.query.file;                                        │
│    exec(\`cat \${userInput}\`);  // User inputs "; rm -rf /"               │
│                                                                              │
│    ✅ SAFE approaches:                                                      │
│                                                                              │
│    1. Use execFile/spawn with array arguments:                              │
│       execFile('cat', [userInput]);                                         │
│       // Treats userInput as literal filename                               │
│                                                                              │
│    2. Whitelist validation:                                                  │
│       const allowed = ['file1.txt', 'file2.txt'];                           │
│       if (!allowed.includes(userInput)) throw new Error('Invalid');         │
│                                                                              │
│    3. Sanitize input:                                                        │
│       const safe = userInput.replace(/[^a-zA-Z0-9.-]/g, '');                │
│                                                                              │
│    4. Use shell-escape library if exec needed:                              │
│       const escape = require('shell-escape');                               │
│       exec(escape(['cat', userInput]));                                     │
│                                                                              │
│    Best practice: Never use exec() with user input!                         │
└─────────────────────────────────────────────────────────────────────────────┘
`);


/**
 * ╔═══════════════════════════════════════════════════════════════════════════╗
 * ║                    SECTION 5: QUICK FIRE QUESTIONS                         ║
 * ╚═══════════════════════════════════════════════════════════════════════════╝
 */

console.log("\n" + "═".repeat(70));
console.log("           SECTION 5: QUICK FIRE (10+ Questions)                   ");
console.log("═══════════════════════════════════════════════════════════════════\n");

console.log(`
┌─────────────────────────────────────────────────────────────────────────────┐
│ Q41: Is Node.js single-threaded?                                            │
├─────────────────────────────────────────────────────────────────────────────┤
│ A: JavaScript execution is single-threaded, but Node.js isn't fully:       │
│    • Main event loop = single thread                                        │
│    • libuv thread pool = multiple threads (default 4)                       │
│    • Worker threads = additional JS threads                                 │
└─────────────────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────────────────┐
│ Q42: What's the default thread pool size?                                   │
├─────────────────────────────────────────────────────────────────────────────┤
│ A: 4 threads. Change with UV_THREADPOOL_SIZE (max 1024).                    │
└─────────────────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────────────────┐
│ Q43: What's the default highWaterMark for streams?                          │
├─────────────────────────────────────────────────────────────────────────────┤
│ A: 16KB for Buffer mode, 16 objects for objectMode.                         │
└─────────────────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────────────────┐
│ Q44: What does process.nextTick do?                                         │
├─────────────────────────────────────────────────────────────────────────────┤
│ A: Schedules callback before next event loop phase (before microtasks).     │
└─────────────────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────────────────┐
│ Q45: Difference between fork() and spawn()?                                 │
├─────────────────────────────────────────────────────────────────────────────┤
│ A: fork() is specialized spawn() for Node.js with built-in IPC channel.    │
└─────────────────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────────────────┐
│ Q46: What uses the thread pool?                                             │
├─────────────────────────────────────────────────────────────────────────────┤
│ A: fs operations, crypto, zlib, dns.lookup (NOT dns.resolve).               │
└─────────────────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────────────────┐
│ Q47: What's the max V8 heap size by default?                                │
├─────────────────────────────────────────────────────────────────────────────┤
│ A: ~1.4GB on 64-bit. Increase with --max-old-space-size=4096.               │
└─────────────────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────────────────┐
│ Q48: How do you make a timer not keep the process alive?                    │
├─────────────────────────────────────────────────────────────────────────────┤
│ A: timer.unref() - Process can exit even if timer is pending.               │
└─────────────────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────────────────┐
│ Q49: What event fires when a stream is done writing?                        │
├─────────────────────────────────────────────────────────────────────────────┤
│ A: 'finish' for writable, 'end' for readable.                               │
└─────────────────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────────────────┐
│ Q50: How do you check if cluster is master or worker?                       │
├─────────────────────────────────────────────────────────────────────────────┤
│ A: cluster.isMaster (deprecated: cluster.isPrimary) or cluster.isWorker.    │
└─────────────────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────────────────┐
│ Q51: What's the minimum setTimeout delay?                                   │
├─────────────────────────────────────────────────────────────────────────────┤
│ A: 1ms. setTimeout(fn, 0) is coerced to setTimeout(fn, 1).                  │
└─────────────────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────────────────┐
│ Q52: What's the order: setTimeout(0) vs setImmediate in I/O callback?       │
├─────────────────────────────────────────────────────────────────────────────┤
│ A: setImmediate always first (check phase comes after poll phase).          │
└─────────────────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────────────────┐
│ Q53: What signal gracefully stops a process?                                │
├─────────────────────────────────────────────────────────────────────────────┤
│ A: SIGTERM (can be caught). SIGKILL cannot be caught (force kill).          │
└─────────────────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────────────────┐
│ Q54: How do you detect if running in worker thread?                         │
├─────────────────────────────────────────────────────────────────────────────┤
│ A: require('worker_threads').isMainThread === false                         │
└─────────────────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────────────────┐
│ Q55: What's the purpose of Atomics API?                                     │
├─────────────────────────────────────────────────────────────────────────────┤
│ A: Thread-safe operations on SharedArrayBuffer (prevent race conditions).   │
└─────────────────────────────────────────────────────────────────────────────┘
`);


/**
 * ═══════════════════════════════════════════════════════════════════════════
 *                           CHEAT SHEET
 * ═══════════════════════════════════════════════════════════════════════════
 */

console.log("\n" + "═".repeat(70));
console.log("📝  NODE.JS ARCHITECTURE MASTER CHEAT SHEET");
console.log("═══════════════════════════════════════════════════════════════════\n");

console.log(`
╔═══════════════════════════════════════════════════════════════════════════╗
║                         ARCHITECTURE OVERVIEW                              ║
╠═══════════════════════════════════════════════════════════════════════════╣
║                                                                            ║
║  Node.js = V8 + libuv + Core Modules + C++ Bindings                       ║
║                                                                            ║
║  Single-threaded main loop, but:                                           ║
║  • libuv thread pool (UV_THREADPOOL_SIZE=4)                               ║
║  • Worker threads for CPU tasks                                           ║
║  • Cluster for scaling HTTP                                               ║
║                                                                            ║
╠═══════════════════════════════════════════════════════════════════════════╣
║                          EVENT LOOP ORDER                                  ║
╠═══════════════════════════════════════════════════════════════════════════╣
║                                                                            ║
║  1. Timers (setTimeout, setInterval)                                      ║
║  2. Pending callbacks                                                      ║
║  3. Idle, prepare (internal)                                               ║
║  4. Poll (I/O callbacks) ← Most time spent here                           ║
║  5. Check (setImmediate)                                                   ║
║  6. Close callbacks                                                        ║
║                                                                            ║
║  Between phases: nextTick → microtasks (Promise)                          ║
║                                                                            ║
╠═══════════════════════════════════════════════════════════════════════════╣
║                            PRIORITIES                                      ║
╠═══════════════════════════════════════════════════════════════════════════╣
║                                                                            ║
║  Sync code → nextTick → Promises → timers → I/O → setImmediate           ║
║                                                                            ║
╠═══════════════════════════════════════════════════════════════════════════╣
║                        SCALING STRATEGIES                                  ║
╠═══════════════════════════════════════════════════════════════════════════╣
║                                                                            ║
║  HTTP Servers → cluster (multiple processes)                              ║
║  CPU Tasks → worker_threads (multiple threads)                            ║
║  External Programs → child_process (spawn/exec/fork)                      ║
║                                                                            ║
╠═══════════════════════════════════════════════════════════════════════════╣
║                         STREAM TYPES                                       ║
╠═══════════════════════════════════════════════════════════════════════════╣
║                                                                            ║
║  Readable → Writable (pipe)                                               ║
║  Duplex = Read + Write (independent)                                      ║
║  Transform = Duplex (output = f(input))                                   ║
║                                                                            ║
║  Backpressure: write() returns false → wait for 'drain'                   ║
║  Use pipeline() for automatic error handling                              ║
║                                                                            ║
╠═══════════════════════════════════════════════════════════════════════════╣
║                        COMMON ISSUES                                       ║
╠═══════════════════════════════════════════════════════════════════════════╣
║                                                                            ║
║  Memory leak? → Check event listeners, closures, timers                   ║
║  Event loop lag? → Break CPU work, use worker threads                     ║
║  Thread pool exhaustion? → Increase UV_THREADPOOL_SIZE                    ║
║  Shell injection? → Use execFile/spawn with array args                    ║
║                                                                            ║
╚═══════════════════════════════════════════════════════════════════════════╝
`);

console.log("\n═══ NODE.JS ARCHITECTURE MODULE COMPLETE! ═══");
console.log("All 8 files covering Node.js internals created.");
console.log("\nNext module: Functional Programming");
console.log("Run: node deep-dive/javaScript-functional-programming/01-pure-functions.js");
