/**
 * ═══════════════════════════════════════════════════════════════════════════
 * FILE 1: NODE.JS RUNTIME ARCHITECTURE
 * ═══════════════════════════════════════════════════════════════════════════
 *
 * Node.js is a JavaScript runtime built on Chrome's V8 engine. Understanding
 * its architecture is crucial for writing performant server-side applications.
 *
 * INTERVIEW CONTEXT:
 * Understanding Node.js internals demonstrates:
 * - Deep knowledge of how JS executes on the server
 * - Ability to write performant async code
 * - Understanding of when Node.js is/isn't appropriate
 *
 * TOPICS COVERED:
 * 1. Node.js Architecture Overview
 * 2. V8 Engine Role
 * 3. libuv and System Integration
 * 4. Node.js Bindings
 * 5. Single-Threaded Nature
 * 6. Non-Blocking I/O
 */

console.log("═══════════════════════════════════════════════════════════════");
console.log("        FILE 1: NODE.JS RUNTIME ARCHITECTURE");
console.log("═══════════════════════════════════════════════════════════════\n");

/**
 * ┌──────────────────────────────────────────────────────────────────────────┐
 * │                    NODE.JS ARCHITECTURE OVERVIEW                         │
 * ├──────────────────────────────────────────────────────────────────────────┤
 * │                                                                          │
 * │   ┌────────────────────────────────────────────────────────────────┐    │
 * │   │                     YOUR JAVASCRIPT CODE                        │    │
 * │   │              (Application & npm packages)                       │    │
 * │   └──────────────────────────┬─────────────────────────────────────┘    │
 * │                              │                                          │
 * │   ┌──────────────────────────▼─────────────────────────────────────┐    │
 * │   │                    NODE.JS CORE MODULES                         │    │
 * │   │     (fs, http, path, crypto, stream, events, etc.)             │    │
 * │   └──────────────────────────┬─────────────────────────────────────┘    │
 * │                              │                                          │
 * │   ┌──────────────────────────▼─────────────────────────────────────┐    │
 * │   │                    NODE.JS BINDINGS (C++)                       │    │
 * │   │         (Bridge between JavaScript and C/C++)                   │    │
 * │   └───────────────┬───────────────────────────┬────────────────────┘    │
 * │                   │                           │                         │
 * │   ┌───────────────▼───────────┐   ┌──────────▼────────────────────┐    │
 * │   │         V8 ENGINE         │   │          LIBUV                 │    │
 * │   │                           │   │                                │    │
 * │   │  • JavaScript execution   │   │  • Event loop                  │    │
 * │   │  • Memory management      │   │  • Async I/O                   │    │
 * │   │  • Garbage collection     │   │  • Thread pool                 │    │
 * │   │  • JIT compilation        │   │  • Cross-platform              │    │
 * │   │                           │   │                                │    │
 * │   └───────────────────────────┘   └────────────────────────────────┘    │
 * │                                                                          │
 * │   ┌────────────────────────────────────────────────────────────────┐    │
 * │   │              OPERATING SYSTEM (Linux, macOS, Windows)           │    │
 * │   │                                                                  │    │
 * │   │    File System │ Network │ Processes │ Timers │ DNS │ etc.     │    │
 * │   └────────────────────────────────────────────────────────────────┘    │
 * │                                                                          │
 * └──────────────────────────────────────────────────────────────────────────┘
 */

console.log("╔════════════════════════════════════════════════════════════════╗");
console.log("║          SECTION 1: ARCHITECTURE LAYERS                        ║");
console.log("╚════════════════════════════════════════════════════════════════╝\n");

/**
 * ┌──────────────────────────────────────────────────────────────────────────┐
 * │                    THE 4 PILLARS OF NODE.JS                              │
 * ├──────────────────────────────────────────────────────────────────────────┤
 * │                                                                          │
 * │  1. V8 ENGINE (Google)                                                  │
 * │  ═══════════════════════                                                │
 * │  • Written in C++                                                       │
 * │  • Compiles JavaScript to machine code                                  │
 * │  • Handles memory allocation and garbage collection                     │
 * │  • Provides the JavaScript execution environment                        │
 * │  • No DOM APIs (those are browser-specific)                             │
 * │                                                                          │
 * │  2. LIBUV (Cross-platform async I/O)                                    │
 * │  ═══════════════════════════════════                                    │
 * │  • Written in C                                                         │
 * │  • Provides the event loop                                              │
 * │  • Handles async file system, network, child processes                  │
 * │  • Thread pool for blocking operations                                  │
 * │  • Abstracts OS differences                                             │
 * │                                                                          │
 * │  3. NODE.JS BINDINGS (C++)                                              │
 * │  ═════════════════════════                                              │
 * │  • Connect JavaScript to C/C++ code                                     │
 * │  • Expose OS functionality to JS                                        │
 * │  • N-API for stable native modules                                      │
 * │                                                                          │
 * │  4. NODE.JS CORE MODULES (JavaScript)                                   │
 * │  ════════════════════════════════════                                   │
 * │  • Built-in modules (fs, http, path, etc.)                             │
 * │  • Written in JavaScript                                                │
 * │  • Use bindings to access system resources                              │
 * │                                                                          │
 * └──────────────────────────────────────────────────────────────────────────┘
 */

// Let's explore Node.js internals
console.log("Node.js Version Info:");
console.log("  Node.js:", process.version);
console.log("  V8:", process.versions.v8);
console.log("  libuv:", process.versions.uv);
console.log("  OpenSSL:", process.versions.openssl);

console.log("\nPlatform Info:");
console.log("  Platform:", process.platform);
console.log("  Architecture:", process.arch);
console.log("  PID:", process.pid);

console.log("\n╔════════════════════════════════════════════════════════════════╗");
console.log("║          SECTION 2: V8 ENGINE DEEP DIVE                        ║");
console.log("╚════════════════════════════════════════════════════════════════╝\n");

/**
 * ┌──────────────────────────────────────────────────────────────────────────┐
 * │                    V8 ENGINE ARCHITECTURE                                │
 * ├──────────────────────────────────────────────────────────────────────────┤
 * │                                                                          │
 * │  V8 compiles JavaScript directly to native machine code.                │
 * │                                                                          │
 * │  ┌────────────────────────────────────────────────────────────────┐     │
 * │  │                    V8 COMPILATION PIPELINE                      │     │
 * │  │                                                                  │     │
 * │  │   JavaScript Source Code                                        │     │
 * │  │          │                                                       │     │
 * │  │          ▼                                                       │     │
 * │  │   ┌──────────────┐                                              │     │
 * │  │   │    PARSER    │ ──► Generates Abstract Syntax Tree (AST)    │     │
 * │  │   └──────┬───────┘                                              │     │
 * │  │          │                                                       │     │
 * │  │          ▼                                                       │     │
 * │  │   ┌──────────────┐                                              │     │
 * │  │   │   IGNITION   │ ──► Interpreter, generates bytecode         │     │
 * │  │   │ (Interpreter)│     Fast startup, lower memory              │     │
 * │  │   └──────┬───────┘                                              │     │
 * │  │          │                                                       │     │
 * │  │          │ Hot code detected                                    │     │
 * │  │          ▼                                                       │     │
 * │  │   ┌──────────────┐                                              │     │
 * │  │   │  TURBOFAN    │ ──► Optimizing compiler                     │     │
 * │  │   │  (Compiler)  │     Generates optimized machine code        │     │
 * │  │   └──────┬───────┘                                              │     │
 * │  │          │                                                       │     │
 * │  │          │ If assumptions wrong (deoptimization)               │     │
 * │  │          │ ────────────────────────────────────► Back to       │     │
 * │  │          │                                       Ignition      │     │
 * │  │          ▼                                                       │     │
 * │  │   ┌──────────────┐                                              │     │
 * │  │   │ Machine Code │ ──► Executes on CPU                         │     │
 * │  │   └──────────────┘                                              │     │
 * │  │                                                                  │     │
 * │  └────────────────────────────────────────────────────────────────┘     │
 * │                                                                          │
 * │  KEY CONCEPTS:                                                          │
 * │  • JIT (Just-In-Time) Compilation                                       │
 * │  • Inline Caching: Caches property lookups for faster access           │
 * │  • Hidden Classes: Optimizes object property access                     │
 * │  • Deoptimization: Falls back when assumptions are violated            │
 * │                                                                          │
 * └──────────────────────────────────────────────────────────────────────────┘
 */

// Demonstrating V8 optimization concepts

console.log("V8 Optimization Demonstration:");

// GOOD: Consistent object shapes help V8 optimize
console.log("\n  1. Hidden Classes (Object Shapes):");
console.log("  ─────────────────────────────────");

// ✅ GOOD - Same shape, V8 can optimize
function GoodPoint(x, y) {
    this.x = x;  // Property added in consistent order
    this.y = y;
}

const p1 = new GoodPoint(1, 2);
const p2 = new GoodPoint(3, 4);
console.log("  ✅ Consistent shape: new GoodPoint(x, y) - V8 optimizes");

// ❌ BAD - Different shapes, V8 can't optimize well
const badP1 = { x: 1 };
badP1.y = 2;  // Added later

const badP2 = { y: 1 };  // Different order!
badP2.x = 2;

console.log("  ❌ Inconsistent shape: {x} then y vs {y} then x - Slower");

// 2. Inline Caching
console.log("\n  2. Inline Caching:");
console.log("  ─────────────────────────────────");

function getX(obj) {
    return obj.x;  // V8 caches the location of 'x'
}

// When called with same shape objects, V8 uses cached location
const objs = Array.from({ length: 1000 }, () => new GoodPoint(1, 2));
objs.forEach(o => getX(o));  // All same shape = cache hits

console.log("  ✅ Same shapes: V8 caches property location (fast)");
console.log("  ❌ Mixed shapes: Cache misses (slow)");

// 3. Avoiding Deoptimization
console.log("\n  3. Avoiding Deoptimization:");
console.log("  ─────────────────────────────────");

// ✅ GOOD - Type stable
function addNumbers(a, b) {
    return a + b;  // Always called with numbers
}

// V8 optimizes for numbers
console.log("  ✅ addNumbers(1, 2) - Always numbers, stays optimized");

// ❌ BAD - Type changing causes deopt
function addAnything(a, b) {
    return a + b;
}
// If called with numbers, then suddenly strings, V8 deoptimizes
// addAnything(1, 2);      // Optimized for numbers
// addAnything("a", "b");  // DEOPT! Falls back to interpreter

console.log("  ❌ addAnything(1,2) then addAnything('a','b') - Causes deoptimization");

console.log("\n╔════════════════════════════════════════════════════════════════╗");
console.log("║          SECTION 3: MEMORY MANAGEMENT                          ║");
console.log("╚════════════════════════════════════════════════════════════════╝\n");

/**
 * ┌──────────────────────────────────────────────────────────────────────────┐
 * │                    V8 MEMORY STRUCTURE                                   │
 * ├──────────────────────────────────────────────────────────────────────────┤
 * │                                                                          │
 * │  ┌────────────────────────────────────────────────────────────────┐     │
 * │  │                         V8 HEAP                                 │     │
 * │  │                                                                  │     │
 * │  │  ┌───────────────────────────────────────────────────────────┐ │     │
 * │  │  │               NEW SPACE (Young Generation)                │ │     │
 * │  │  │                                                            │ │     │
 * │  │  │   ┌─────────────────┐    ┌─────────────────┐             │ │     │
 * │  │  │   │   Semi-space    │    │   Semi-space    │             │ │     │
 * │  │  │   │     (FROM)      │    │      (TO)       │             │ │     │
 * │  │  │   │                 │    │                 │             │ │     │
 * │  │  │   │ New allocations │    │  (empty until   │             │ │     │
 * │  │  │   │   go here       │    │   GC copies)    │             │ │     │
 * │  │  │   └─────────────────┘    └─────────────────┘             │ │     │
 * │  │  │                                                            │ │     │
 * │  │  │   Small, frequently collected (Minor GC / Scavenge)       │ │     │
 * │  │  └───────────────────────────────────────────────────────────┘ │     │
 * │  │                              │                                  │     │
 * │  │                              │ Objects that survive             │     │
 * │  │                              │ multiple GC cycles               │     │
 * │  │                              ▼                                  │     │
 * │  │  ┌───────────────────────────────────────────────────────────┐ │     │
 * │  │  │               OLD SPACE (Old Generation)                  │ │     │
 * │  │  │                                                            │ │     │
 * │  │  │   • Long-lived objects                                    │ │     │
 * │  │  │   • Collected less frequently (Major GC / Mark-Sweep)     │ │     │
 * │  │  │   • Mark-Sweep-Compact algorithm                          │ │     │
 * │  │  │                                                            │ │     │
 * │  │  └───────────────────────────────────────────────────────────┘ │     │
 * │  │                                                                  │     │
 * │  │  ┌───────────────────────┐  ┌───────────────────────┐         │     │
 * │  │  │      CODE SPACE       │  │     LARGE OBJECT      │         │     │
 * │  │  │  (compiled code)      │  │        SPACE          │         │     │
 * │  │  └───────────────────────┘  └───────────────────────┘         │     │
 * │  │                                                                  │     │
 * │  └────────────────────────────────────────────────────────────────┘     │
 * │                                                                          │
 * └──────────────────────────────────────────────────────────────────────────┘
 */

// Memory usage information
const memUsage = process.memoryUsage();

console.log("Current Memory Usage:");
console.log("─".repeat(50));
console.log(`  Heap Total:     ${(memUsage.heapTotal / 1024 / 1024).toFixed(2)} MB`);
console.log(`  Heap Used:      ${(memUsage.heapUsed / 1024 / 1024).toFixed(2)} MB`);
console.log(`  External:       ${(memUsage.external / 1024 / 1024).toFixed(2)} MB`);
console.log(`  RSS:            ${(memUsage.rss / 1024 / 1024).toFixed(2)} MB`);
console.log(`  Array Buffers:  ${(memUsage.arrayBuffers / 1024 / 1024).toFixed(2)} MB`);

console.log("\nMemory Terms Explained:");
console.log("─".repeat(50));
console.log("  heapTotal:     Total size of allocated heap");
console.log("  heapUsed:      Actual memory used by JS objects");
console.log("  external:      Memory for C++ objects bound to JS");
console.log("  rss:           Resident Set Size (total process memory)");
console.log("  arrayBuffers:  Memory for ArrayBuffers");

// Demonstrating garbage collection
console.log("\nGarbage Collection Types:");
console.log("─".repeat(50));
console.log("  Minor GC (Scavenge):");
console.log("    • Collects Young Generation");
console.log("    • Fast (~1-2ms)");
console.log("    • Uses semi-space copying");
console.log("");
console.log("  Major GC (Mark-Sweep-Compact):");
console.log("    • Collects Old Generation");
console.log("    • Slower (~100-200ms for large heaps)");
console.log("    • Marks live objects, sweeps dead ones");

console.log("\n╔════════════════════════════════════════════════════════════════╗");
console.log("║          SECTION 4: SINGLE-THREADED MODEL                      ║");
console.log("╚════════════════════════════════════════════════════════════════╝\n");

/**
 * ┌──────────────────────────────────────────────────────────────────────────┐
 * │              NODE.JS SINGLE-THREADED MODEL                               │
 * ├──────────────────────────────────────────────────────────────────────────┤
 * │                                                                          │
 * │  "Node.js is single-threaded" - PARTIALLY TRUE!                         │
 * │                                                                          │
 * │  WHAT'S SINGLE-THREADED:                                                │
 * │  • Your JavaScript code                                                 │
 * │  • The event loop                                                       │
 * │  • V8 execution                                                         │
 * │                                                                          │
 * │  WHAT'S MULTI-THREADED:                                                 │
 * │  • libuv thread pool (4 threads default)                               │
 * │  • Some crypto operations                                               │
 * │  • DNS lookups                                                          │
 * │  • File system operations                                               │
 * │                                                                          │
 * │  ┌────────────────────────────────────────────────────────────────┐     │
 * │  │                                                                  │     │
 * │  │        MAIN THREAD           │         THREAD POOL             │     │
 * │  │       (Single Thread)        │       (4 threads default)       │     │
 * │  │                              │                                  │     │
 * │  │   ┌─────────────────────┐   │   ┌─────────────────────────┐   │     │
 * │  │   │   Your JS Code      │   │   │  Thread 1 │ Thread 2   │   │     │
 * │  │   │   Event Loop        │   │   │  Thread 3 │ Thread 4   │   │     │
 * │  │   │   V8 Execution      │   │   └─────────────────────────┘   │     │
 * │  │   └─────────────────────┘   │                                  │     │
 * │  │             │               │   Used for:                      │     │
 * │  │             │               │   • fs operations               │     │
 * │  │             │               │   • crypto                      │     │
 * │  │             │ delegates     │   • zlib compression           │     │
 * │  │             └───────────────│──►• DNS lookup                  │     │
 * │  │                             │                                  │     │
 * │  └────────────────────────────────────────────────────────────────┘     │
 * │                                                                          │
 * │  WHY SINGLE-THREADED FOR JS?                                            │
 * │  • No race conditions in JS code                                        │
 * │  • No deadlocks                                                         │
 * │  • No need for locks/mutexes                                            │
 * │  • Simpler programming model                                            │
 * │                                                                          │
 * └──────────────────────────────────────────────────────────────────────────┘
 */

console.log("Understanding Node.js Threading:");
console.log("─".repeat(50));

// Check thread pool size
const threadPoolSize = process.env.UV_THREADPOOL_SIZE || 4;
console.log(`\n  libuv Thread Pool Size: ${threadPoolSize}`);
console.log("  (Set UV_THREADPOOL_SIZE env var to change)");

// Demonstrate single-threaded nature
console.log("\n  Single-Threaded Implications:");
console.log("  ─────────────────────────────");
console.log("  ✅ No race conditions in your JS code");
console.log("  ✅ No need for locks/mutexes");
console.log("  ❌ CPU-intensive tasks block the event loop");
console.log("  ❌ Can't utilize multiple cores (without clusters/workers)");

// CPU-bound blocking example
console.log("\n  Blocking Example (DON'T DO THIS!):");
console.log("  ─────────────────────────────");

function blockingOperation() {
    const start = Date.now();
    // Simulate CPU-intensive work
    let result = 0;
    for (let i = 0; i < 1e7; i++) {
        result += Math.sqrt(i);
    }
    return Date.now() - start;
}

const blockTime = blockingOperation();
console.log(`  Blocking loop took: ${blockTime}ms`);
console.log("  ⚠️  During this time, NO other requests could be handled!");

console.log("\n╔════════════════════════════════════════════════════════════════╗");
console.log("║          SECTION 5: INTERVIEW KEY POINTS                       ║");
console.log("╚════════════════════════════════════════════════════════════════╝\n");

/**
 * ┌──────────────────────────────────────────────────────────────────────────┐
 * │              INTERVIEW: NODE.JS ARCHITECTURE                             │
 * ├──────────────────────────────────────────────────────────────────────────┤
 * │                                                                          │
 * │  Q: What is Node.js?                                                    │
 * │  A: "Node.js is a JavaScript runtime built on Chrome's V8 engine        │
 * │      and libuv. It uses an event-driven, non-blocking I/O model         │
 * │      that makes it efficient for data-intensive applications."          │
 * │                                                                          │
 * │  Q: Is Node.js single-threaded?                                         │
 * │  A: "JavaScript execution is single-threaded, but Node.js uses          │
 * │      libuv's thread pool for blocking operations like file I/O,         │
 * │      DNS lookups, and some crypto operations."                          │
 * │                                                                          │
 * │  Q: What is V8?                                                         │
 * │  A: "V8 is Google's open-source JavaScript engine. It compiles          │
 * │      JavaScript to native machine code using JIT compilation.           │
 * │      It handles memory management and garbage collection."              │
 * │                                                                          │
 * │  Q: What is libuv?                                                      │
 * │  A: "libuv is a C library that provides the event loop, async I/O,      │
 * │      thread pool, and cross-platform abstraction. It's the core         │
 * │      of Node.js's non-blocking capabilities."                           │
 * │                                                                          │
 * │  Q: When is Node.js NOT suitable?                                       │
 * │  A: "Node.js isn't ideal for:                                           │
 * │      • CPU-intensive tasks (video encoding, ML)                         │
 * │      • Heavy computational work                                         │
 * │      But you can use Worker Threads for CPU-bound tasks."               │
 * │                                                                          │
 * └──────────────────────────────────────────────────────────────────────────┘
 */

console.log("Interview Summary - Node.js Architecture:");
console.log("─".repeat(50));
console.log("\n  Core Components:");
console.log("  • V8 Engine - JS execution, GC, JIT compilation");
console.log("  • libuv - Event loop, async I/O, thread pool");
console.log("  • Node Bindings - Bridge JS to C++");
console.log("  • Core Modules - Built-in JS modules (fs, http, etc.)");

console.log("\n  Key Characteristics:");
console.log("  • Single-threaded JS execution");
console.log("  • Event-driven architecture");
console.log("  • Non-blocking I/O");
console.log("  • libuv thread pool for blocking ops");

console.log("\n  Best For:");
console.log("  ✅ I/O intensive (APIs, real-time apps)");
console.log("  ✅ Microservices");
console.log("  ✅ Real-time applications");
console.log("  ❌ CPU intensive (use Worker Threads)");

console.log("\n═══ FILE 1 COMPLETE ═══");
console.log("Run: node 02-event-loop-deep-dive.js");
