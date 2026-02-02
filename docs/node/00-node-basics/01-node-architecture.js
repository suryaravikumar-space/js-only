/**
 * TOPIC 01: Node.js Architecture
 *
 * ╔════════════════════════════════════════════════════════════════════════════╗
 * ║ THE GOLDEN RULE                                                            ║
 * ╠════════════════════════════════════════════════════════════════════════════╣
 * ║                                                                            ║
 * ║ Node.js = V8 (JS engine) + libuv (async I/O) + C/C++ bindings            ║
 * ║                                                                            ║
 * ║   Your JS Code                                                            ║
 * ║       ↓                                                                    ║
 * ║   Node.js Bindings (C++)                                                  ║
 * ║       ↓               ↓                                                    ║
 * ║   V8 Engine        libuv                                                  ║
 * ║   (compiles JS)    (event loop, thread pool, async I/O)                   ║
 * ║                                                                            ║
 * ╚════════════════════════════════════════════════════════════════════════════╝
 *
 *
 * ┌─────────────────────────────────────────────────────────────────────────────┐
 * │ STORY TO REMEMBER                                                          │
 * ├─────────────────────────────────────────────────────────────────────────────┤
 * │                                                                             │
 * │  Node.js is like a RESTAURANT:                                             │
 * │                                                                             │
 * │  V8 Engine = The HEAD CHEF                                                 │
 * │    - Reads your recipe (JS code)                                           │
 * │    - Cooks it into a dish (machine code) really fast (JIT)                │
 * │                                                                             │
 * │  libuv = The WAITSTAFF (event loop + thread pool)                         │
 * │    - 1 main waiter (event loop) takes ALL orders                          │
 * │    - 4 kitchen helpers (thread pool) handle heavy tasks                   │
 * │    - Main waiter never waits - takes next order immediately               │
 * │    - When a dish is ready, helper shouts and waiter delivers it           │
 * │                                                                             │
 * │  C++ Bindings = The KITCHEN EQUIPMENT                                     │
 * │    - Connects the chef to ovens, fridges, grills (OS, filesystem, network)│
 * │                                                                             │
 * │  "One waiter, multiple helpers, everyone's fed!"                          │
 * │                                                                             │
 * └─────────────────────────────────────────────────────────────────────────────┘
 */

// V8 compiles your JS to machine code
const code = 'const x = 1 + 2;'; // V8 compiles this to native machine code (JIT)
console.log('A:', 'V8 compiles JS → machine code (JIT compilation)');

// libuv handles all async operations
const fs = require('fs');
const crypto = require('crypto');

// This uses libuv's thread pool (default 4 threads)
const start = Date.now();

crypto.pbkdf2('password', 'salt', 100000, 64, 'sha512', (err, key) => {
  console.log('B:', `Crypto done in ${Date.now() - start}ms (libuv thread pool)`);
});

// Event loop phases (simplified)
console.log('C:', 'Event Loop Phases: timers → I/O → check → close');

// process.nextTick vs setImmediate
process.nextTick(() => {
  console.log('E:', 'nextTick (microtask - runs before any I/O)');
});

setImmediate(() => {
  console.log('F:', 'setImmediate (runs in check phase)');
});

console.log('D:', 'Sync code runs first');

/**
 * OUTPUT:
 *   A: V8 compiles JS → machine code (JIT compilation)
 *   C: Event Loop Phases: timers → I/O → check → close
 *   D: Sync code runs first
 *   E: nextTick (microtask - runs before any I/O)
 *   F: setImmediate (runs in check phase)
 *   B: Crypto done in ~80ms (libuv thread pool)
 *
 *
 * ╔════════════════════════════════════════════════════════════════════════════╗
 * ║ NODE.JS ARCHITECTURE DIAGRAM                                              ║
 * ╠════════════════════════════════════════════════════════════════════════════╣
 * ║                                                                            ║
 * ║   ┌─────────────────────────────────────────────┐                         ║
 * ║   │           Your JavaScript Code              │                         ║
 * ║   └─────────────────┬───────────────────────────┘                         ║
 * ║                     ↓                                                      ║
 * ║   ┌─────────────────────────────────────────────┐                         ║
 * ║   │           Node.js Bindings (C++)            │                         ║
 * ║   └──────┬──────────────────────────┬───────────┘                         ║
 * ║          ↓                          ↓                                      ║
 * ║   ┌──────────────┐   ┌──────────────────────────┐                         ║
 * ║   │  V8 Engine   │   │        libuv             │                         ║
 * ║   │  (Google)    │   │  ┌─────────────────────┐ │                         ║
 * ║   │              │   │  │  Event Loop         │ │                         ║
 * ║   │  - Parse JS  │   │  │  Thread Pool (4)    │ │                         ║
 * ║   │  - Compile   │   │  │  Async I/O          │ │                         ║
 * ║   │  - Execute   │   │  │  DNS, fs, crypto    │ │                         ║
 * ║   └──────────────┘   │  └─────────────────────┘ │                         ║
 * ║                      └──────────────────────────┘                         ║
 * ║                                                                            ║
 * ╚════════════════════════════════════════════════════════════════════════════╝
 *
 *
 * ┌─────────────────────────────────────────────────────────────────────────────┐
 * │ INTERVIEW ANSWER                                                            │
 * ├─────────────────────────────────────────────────────────────────────────────┤
 * │                                                                             │
 * │ "Node.js has three main components:                                        │
 * │                                                                             │
 * │  1. V8 Engine: Compiles JavaScript to machine code using JIT compilation   │
 * │  2. libuv: C library that provides the event loop, thread pool (default    │
 * │     4 threads), and async I/O for file system, DNS, and crypto ops         │
 * │  3. C++ Bindings: Bridge between JS and low-level system operations        │
 * │                                                                             │
 * │  The event loop is single-threaded but offloads heavy I/O to libuv's       │
 * │  thread pool, giving the illusion of multi-threading."                     │
 * │                                                                             │
 * └─────────────────────────────────────────────────────────────────────────────┘
 *
 *
 * RUN: node docs/node/00-node-basics/01-node-architecture.js
 */
