/**
 * TOPIC 00: What is Node.js?
 *
 * ╔════════════════════════════════════════════════════════════════════════════╗
 * ║ THE GOLDEN RULE                                                            ║
 * ╠════════════════════════════════════════════════════════════════════════════╣
 * ║                                                                            ║
 * ║ Node.js is a JavaScript RUNTIME (not a language, not a framework).        ║
 * ║ It lets you run JavaScript OUTSIDE the browser using Google's V8 engine.  ║
 * ║                                                                            ║
 * ║   Browser JS  → DOM, window, document                                     ║
 * ║   Node.js     → fs, http, os, child_process (system access)              ║
 * ║                                                                            ║
 * ╚════════════════════════════════════════════════════════════════════════════╝
 *
 *
 * ┌─────────────────────────────────────────────────────────────────────────────┐
 * │ STORY TO REMEMBER                                                          │
 * ├─────────────────────────────────────────────────────────────────────────────┤
 * │                                                                             │
 * │  Think of JavaScript as a CHEF who only knew how to cook in ONE kitchen   │
 * │  (the browser). Node.js is like giving that chef a FOOD TRUCK.            │
 * │                                                                             │
 * │  In the kitchen (browser):                                                 │
 * │    - Can only serve customers who walk in (DOM, clicks, forms)            │
 * │    - Limited to kitchen tools (window, document, localStorage)            │
 * │                                                                             │
 * │  In the food truck (Node.js):                                              │
 * │    - Can go ANYWHERE (servers, scripts, IoT devices)                      │
 * │    - Has new tools: gas tank (fs), GPS (os), radio (http)                 │
 * │    - Same chef, same recipes (JavaScript), different location!            │
 * │                                                                             │
 * │  "Node.js = JavaScript that escaped the browser."                         │
 * │                                                                             │
 * └─────────────────────────────────────────────────────────────────────────────┘
 *
 *
 * ┌─────────────────────────────────────────────────────────────────────────────┐
 * │ VISUAL DIAGRAM                                                             │
 * ├─────────────────────────────────────────────────────────────────────────────┤
 * │                                                                             │
 * │   ┌──────── BROWSER ────────┐    ┌──────── NODE.JS ─────────┐             │
 * │   │                         │    │                           │             │
 * │   │  window    document     │    │  process    fs            │             │
 * │   │  DOM       fetch        │    │  http       os            │             │
 * │   │  localStorage           │    │  Buffer     child_process │             │
 * │   │  alert()   prompt()     │    │  crypto     stream        │             │
 * │   │                         │    │                           │             │
 * │   └────────┬────────────────┘    └──────────┬────────────────┘             │
 * │            │                                │                              │
 * │            └──────── SHARED ────────────────┘                              │
 * │                     │                                                      │
 * │          console, setTimeout, Promise,                                     │
 * │          JSON, Math, Array, Object, Map                                    │
 * │                                                                             │
 * └─────────────────────────────────────────────────────────────────────────────┘
 */

// Node.js gives you access to system-level APIs
const os = require('os');

console.log('A:', `Platform: ${os.platform()}`);
console.log('B:', `CPU Cores: ${os.cpus().length}`);
console.log('C:', `Free Memory: ${(os.freemem() / 1024 / 1024).toFixed(0)} MB`);
console.log('D:', `Node Version: ${process.version}`);
console.log('E:', `PID: ${process.pid}`);

// Node.js is event-driven and non-blocking
const start = Date.now();

setTimeout(() => {
  console.log('G:', `Async done after ${Date.now() - start}ms`);
}, 100);

console.log('F:', 'Sync code runs first');

/**
 * OUTPUT (values will vary):
 *   A: Platform: linux
 *   B: CPU Cores: 8
 *   C: Free Memory: 4096 MB
 *   D: Node Version: v20.x.x
 *   E: PID: 12345
 *   F: Sync code runs first
 *   G: Async done after ~100ms
 *
 *
 * ╔════════════════════════════════════════════════════════════════════════════╗
 * ║ KEY CHARACTERISTICS OF NODE.JS                                            ║
 * ╠════════════════════════════════════════════════════════════════════════════╣
 * ║                                                                            ║
 * ║ 1. Single-threaded (but uses thread pool for I/O via libuv)              ║
 * ║ 2. Event-driven, non-blocking I/O                                         ║
 * ║ 3. Built on Chrome's V8 JavaScript engine                                ║
 * ║ 4. npm - largest ecosystem of open source libraries                       ║
 * ║ 5. Great for I/O-heavy tasks, NOT for CPU-heavy computation              ║
 * ║                                                                            ║
 * ╚════════════════════════════════════════════════════════════════════════════╝
 *
 *
 * ┌─────────────────────────────────────────────────────────────────────────────┐
 * │ INTERVIEW ANSWER                                                            │
 * ├─────────────────────────────────────────────────────────────────────────────┤
 * │                                                                             │
 * │ "Node.js is a JavaScript runtime built on Chrome's V8 engine. It allows    │
 * │  running JS outside the browser with access to the file system, network,   │
 * │  and OS. It uses a single-threaded event loop with non-blocking I/O,       │
 * │  making it ideal for scalable, I/O-heavy applications like APIs and        │
 * │  real-time apps. It's NOT a language or framework - it's a runtime."       │
 * │                                                                             │
 * └─────────────────────────────────────────────────────────────────────────────┘
 *
 *
 * RUN: node docs/node/00-node-basics/00-what-is-node.js
 */
