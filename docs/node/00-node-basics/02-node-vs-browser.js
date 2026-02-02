/**
 * TOPIC 02: Node.js vs Browser
 *
 * ╔════════════════════════════════════════════════════════════════════════════╗
 * ║ THE GOLDEN RULE                                                            ║
 * ╠════════════════════════════════════════════════════════════════════════════╣
 * ║                                                                            ║
 * ║ Same language (JavaScript), DIFFERENT environments:                        ║
 * ║                                                                            ║
 * ║   Browser: window, document, DOM, fetch, localStorage                     ║
 * ║   Node.js: global, process, require, fs, http, os, Buffer                ║
 * ║                                                                            ║
 * ║ Both have: console, setTimeout, setInterval, Promise, JSON               ║
 * ║                                                                            ║
 * ╚════════════════════════════════════════════════════════════════════════════╝
 *
 *
 * ┌─────────────────────────────────────────────────────────────────────────────┐
 * │ STORY TO REMEMBER                                                          │
 * ├─────────────────────────────────────────────────────────────────────────────┤
 * │                                                                             │
 * │  Think of JS as a PERSON who can work in two OFFICES:                     │
 * │                                                                             │
 * │  Browser Office (front desk):                                              │
 * │    - Greets customers face-to-face (DOM, UI, clicks)                      │
 * │    - Has a display board (window, document)                                │
 * │    - Can't go to the warehouse (no file system)                           │
 * │                                                                             │
 * │  Node.js Office (back office):                                             │
 * │    - Has warehouse access (fs - read/write files)                         │
 * │    - Can make phone calls (http - create servers)                          │
 * │    - Can check building info (os - system details)                        │
 * │    - No customer display board (no DOM)                                    │
 * │                                                                             │
 * │  Both offices share: calculator (Math), clock (setTimeout),               │
 * │  notepad (console), and filing system (JSON, Array, Object).              │
 * │                                                                             │
 * └─────────────────────────────────────────────────────────────────────────────┘
 */

// Node.js global object (not 'window')
console.log('A:', typeof window);    // undefined in Node
console.log('B:', typeof global);    // object
console.log('C:', typeof globalThis); // object (works in both!)

// Node has 'process', browser has 'document'
console.log('D:', typeof process);   // object
console.log('E:', typeof document);  // undefined in Node

// Node has require/module system
console.log('F:', typeof require);   // function
console.log('G:', typeof module);    // object

// Node has Buffer for binary data
const buf = Buffer.from('Hello');
console.log('H:', buf);             // <Buffer 48 65 6c 6c 6f>
console.log('I:', buf.toString());   // Hello

// Node has __dirname and __filename (CommonJS)
console.log('J:', __filename.split('/').pop());
console.log('K:', __dirname.split('/').pop());

/**
 * OUTPUT:
 *   A: undefined
 *   B: object
 *   C: object
 *   D: object
 *   E: undefined
 *   F: function
 *   G: object
 *   H: <Buffer 48 65 6c 6c 6f>
 *   I: Hello
 *   J: 02-node-vs-browser.js
 *   K: 00-node-basics
 *
 *
 * ╔════════════════════════════════════════════════════════════════════════════╗
 * ║ COMPARISON TABLE                                                          ║
 * ╠════════════════════════════════════════════════════════════════════════════╣
 * ║                                                                            ║
 * ║   Feature          Browser              Node.js                           ║
 * ║   ───────          ───────              ──────                             ║
 * ║   Global object    window               global / globalThis               ║
 * ║   DOM              ✅ document           ❌ No DOM                         ║
 * ║   File system      ❌ No access          ✅ fs module                      ║
 * ║   Modules          ES Modules            CommonJS + ESM                    ║
 * ║   HTTP server      ❌ Client only        ✅ http.createServer              ║
 * ║   Binary data      ArrayBuffer           Buffer                            ║
 * ║   Console          ✅ DevTools           ✅ Terminal                       ║
 * ║   Fetch API        ✅ Built-in           ✅ v18+ (experimental v17)        ║
 * ║   Workers          Web Workers           worker_threads                    ║
 * ║                                                                            ║
 * ╚════════════════════════════════════════════════════════════════════════════╝
 *
 *
 * ┌─────────────────────────────────────────────────────────────────────────────┐
 * │ INTERVIEW ANSWER                                                            │
 * ├─────────────────────────────────────────────────────────────────────────────┤
 * │                                                                             │
 * │ "Both run JavaScript but in different environments. The browser provides   │
 * │  DOM, window, and web APIs. Node.js provides file system access, OS-level  │
 * │  APIs, and can create HTTP servers. Both share the V8 engine, support      │
 * │  ES6+, Promises, and async/await. Use globalThis for cross-environment     │
 * │  compatibility. Node uses CommonJS (require) by default but also supports  │
 * │  ES Modules."                                                              │
 * │                                                                             │
 * └─────────────────────────────────────────────────────────────────────────────┘
 *
 *
 * RUN: node docs/node/00-node-basics/02-node-vs-browser.js
 */
