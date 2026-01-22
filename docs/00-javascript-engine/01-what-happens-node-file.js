/**
 * LESSON 01: What Happens When You Run `node file.js`
 *
 * ╔════════════════════════════════════════════════════════════════════════════╗
 * ║ YOUR PERSONA: THE ENGINE ARCHITECT                                         ║
 * ╠════════════════════════════════════════════════════════════════════════════╣
 * ║                                                                            ║
 * ║   You are now "THE ENGINE ARCHITECT" - a developer who understands         ║
 * ║   JavaScript not as magic, but as a deterministic machine.                 ║
 * ║                                                                            ║
 * ║   When others see: console.log("hello")                                    ║
 * ║   You see: Tokenization → AST → Bytecode → Machine Code → Stack Frame      ║
 * ║                                                                            ║
 * ║   Your superpower: You can predict EXACTLY what happens at every step.     ║
 * ║   Your mindset: "There is no magic, only mechanics I haven't learned."     ║
 * ║                                                                            ║
 * ╚════════════════════════════════════════════════════════════════════════════╝
 *
 *
 * ╔════════════════════════════════════════════════════════════════════════════╗
 * ║ THE COMPLETE JOURNEY: node file.js                                         ║
 * ╠════════════════════════════════════════════════════════════════════════════╣
 * ║                                                                            ║
 * ║  PHASE 1: LOADING                                                          ║
 * ║  ──────────────────                                                        ║
 * ║  Node.js reads your file from disk into memory as a STRING                 ║
 * ║  "var x = 10;\nconsole.log(x);"                                            ║
 * ║                                                                            ║
 * ║  PHASE 2: WRAPPING                                                         ║
 * ║  ──────────────────                                                        ║
 * ║  Node wraps your code in a function (this is why require works!)           ║
 * ║  (function(exports, require, module, __filename, __dirname) {              ║
 * ║      // your code here                                                     ║
 * ║  });                                                                       ║
 * ║                                                                            ║
 * ║  PHASE 3: PARSING                                                          ║
 * ║  ──────────────────                                                        ║
 * ║  String → Tokens → Abstract Syntax Tree (AST)                              ║
 * ║                                                                            ║
 * ║  PHASE 4: COMPILATION                                                      ║
 * ║  ──────────────────                                                        ║
 * ║  AST → Bytecode (Ignition) → Optimized Machine Code (TurboFan)             ║
 * ║                                                                            ║
 * ║  PHASE 5: EXECUTION                                                        ║
 * ║  ──────────────────                                                        ║
 * ║  Create Global Execution Context → Push to Call Stack → Run                ║
 * ║                                                                            ║
 * ║  PHASE 6: EVENT LOOP                                                       ║
 * ║  ──────────────────                                                        ║
 * ║  Keep running until no more callbacks (timers, I/O, promises)              ║
 * ║                                                                            ║
 * ║  PHASE 7: CLEANUP                                                          ║
 * ║  ──────────────────                                                        ║
 * ║  Garbage Collection → Process Exit                                         ║
 * ║                                                                            ║
 * ╚════════════════════════════════════════════════════════════════════════════╝
 */

// Let's PROVE Phase 2 (Wrapping) exists!

console.log('A:', typeof require);      // Function exists because of wrapping
console.log('B:', typeof module);       // Module object exists
console.log('C:', typeof __filename);   // File path exists
console.log('D:', typeof __dirname);    // Directory path exists

// The wrapper function signature:
console.log('E:', arguments.length);    // 5 arguments passed to wrapper!

// What ARE those 5 arguments?
// 1. exports   - object to export things from this module
// 2. require   - function to import other modules  
// 3. module    - the current module object
// 4. __filename - full path to this file
// 5. __dirname  - directory containing this file

console.log('F:', __filename.split('/').pop());  // This file's name

// PROVE the wrapper exists by looking at the wrapper function itself
console.log('G:', require('module').wrapper);

/**
 * OUTPUT:
 *   A: function
 *   B: object
 *   C: string
 *   D: string
 *   E: 5
 *   F: 01-what-happens-node-file.js
 *   G: [
 *        '(function (exports, require, module, __filename, __dirname) { ',
 *        '\n});'
 *      ]
 *
 *
 * ╔════════════════════════════════════════════════════════════════════════════╗
 * ║ STEP-BY-STEP BREAKDOWN                                                     ║
 * ╠════════════════════════════════════════════════════════════════════════════╣
 * ║                                                                            ║
 * ║ When you run: node 01-what-happens-node-file.js                            ║
 * ║                                                                            ║
 * ║ 1. Node.js executable starts (C++ program)                                 ║
 * ║ 2. V8 JavaScript engine initializes                                        ║
 * ║ 3. libuv event loop initializes                                            ║
 * ║ 4. Node reads this file as a text string                                   ║
 * ║ 5. Node wraps code: (function(exports,require,module,__filename,__dirname){║
 * ║ 6. V8's Lexer tokenizes the wrapped code                                   ║
 * ║ 7. V8's Parser builds the AST                                              ║
 * ║ 8. Ignition compiles AST to bytecode                                       ║
 * ║ 9. Global Execution Context created (Creation Phase)                       ║
 * ║ 10. Code executes line by line (Execution Phase)                           ║
 * ║ 11. console.log calls push/pop from call stack                             ║
 * ║ 12. Event loop checks for pending work (none here)                         ║
 * ║ 13. Process exits with code 0                                              ║
 * ║                                                                            ║
 * ╚════════════════════════════════════════════════════════════════════════════╝
 *
 *
 * ┌─────────────────────────────────────────────────────────────────────────────┐
 * │                        V8 ENGINE COMPONENTS                                 │
 * ├─────────────────────────────────────────────────────────────────────────────┤
 * │                                                                             │
 * │   ┌─────────────┬─────────────────────────────────────────────────────┐    │
 * │   │ Component   │ Purpose                                             │    │
 * │   ├─────────────┼─────────────────────────────────────────────────────┤    │
 * │   │ Lexer       │ Source code → Tokens (keywords, identifiers, etc)  │    │
 * │   │ Parser      │ Tokens → Abstract Syntax Tree (code structure)      │    │
 * │   │ Ignition    │ AST → Bytecode (fast startup, slower execution)     │    │
 * │   │ TurboFan    │ Bytecode → Machine code (for "hot" functions)       │    │
 * │   │ Heap        │ Stores objects, arrays, functions (garbage collected) │  │
 * │   │ Stack       │ Stores primitives, function call frames             │    │
 * │   └─────────────┴─────────────────────────────────────────────────────┘    │
 * │                                                                             │
 * └─────────────────────────────────────────────────────────────────────────────┘
 *
 *
 * RUN: node docs/00-javascript-engine/01-what-happens-node-file.js
 */
