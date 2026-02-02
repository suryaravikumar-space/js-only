/**
 * LESSON 01: What Happens When You Run `node file.js`
 *
 * ╔════════════════════════════════════════════════════════════════════════════╗
 * ║ STORY: THE RESTAURANT KITCHEN                                              ║
 * ╠════════════════════════════════════════════════════════════════════════════╣
 * ║                                                                            ║
 * ║   Imagine you walk into a restaurant and order "Pasta Alfredo".            ║
 * ║                                                                            ║
 * ║   1. The waiter READS your order (Loading - reading the file)              ║
 * ║   2. Kitchen wraps it in a ticket format (Wrapping - module wrapper)       ║
 * ║   3. Chef breaks it down: pasta, cream, garlic (Parsing - tokenization)   ║
 * ║   4. Chef plans the cooking steps (Compilation - AST to bytecode)         ║
 * ║   5. Chef cooks it (Execution - running the code)                         ║
 * ║   6. Waiter checks if more orders (Event Loop - pending callbacks)        ║
 * ║   7. Kitchen cleans up (Garbage Collection - cleanup)                     ║
 * ║                                                                            ║
 * ║   Running `node file.js` follows the EXACT same pipeline.                 ║
 * ║   There is no magic, only mechanics you haven't learned yet.              ║
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

console.log(`A: typeof require = ${typeof require}`);      // Function exists because of wrapping
console.log(`B: typeof module = ${typeof module}`);         // Module object exists
console.log(`C: typeof __filename = ${typeof __filename}`); // File path exists
console.log(`D: typeof __dirname = ${typeof __dirname}`);   // Directory path exists

// The wrapper function signature:
console.log(`E: arguments.length = ${arguments.length}`);   // 5 arguments passed to wrapper!

// What ARE those 5 arguments?
// 1. exports   - object to export things from this module
// 2. require   - function to import other modules
// 3. module    - the current module object
// 4. __filename - full path to this file
// 5. __dirname  - directory containing this file

const fileName = __filename.split('/').pop();
console.log(`F: Current file = ${fileName}`);

// PROVE the wrapper exists by looking at the wrapper function itself
const { wrapper } = require('module');
console.log('G:', wrapper);

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
 * ╔════════════════════════════════════════════════════════════════════════════╗
 * ║ INTERVIEW QUESTIONS                                                       ║
 * ╠════════════════════════════════════════════════════════════════════════════╣
 * ║                                                                            ║
 * ║ Q1: "What happens internally when you run `node index.js`?"               ║
 * ║                                                                            ║
 * ║ A: Node.js (a C++ program) starts, initializes V8 and libuv. It reads     ║
 * ║    the file as a string, wraps it in a module function with exports,       ║
 * ║    require, module, __filename, __dirname as parameters. V8 then           ║
 * ║    tokenizes the code, parses it into an AST, compiles it to bytecode     ║
 * ║    via Ignition, creates a Global Execution Context, and executes the     ║
 * ║    code. The event loop then runs until no pending callbacks remain.       ║
 * ║                                                                            ║
 * ║ Q2: "Why does `require` work in Node.js but not in the browser?"          ║
 * ║                                                                            ║
 * ║ A: Because Node.js wraps every file in a module wrapper function that     ║
 * ║    injects `require`, `module`, `exports`, `__filename`, `__dirname`      ║
 * ║    as parameters. The browser doesn't have this wrapper — it uses          ║
 * ║    ES Modules (`import`/`export`) or script tags instead.                 ║
 * ║                                                                            ║
 * ║ Q3: "Is JavaScript interpreted or compiled?"                              ║
 * ║                                                                            ║
 * ║ A: Neither purely. Modern JS engines like V8 use JIT (Just-In-Time)       ║
 * ║    compilation. Code is first interpreted as bytecode by Ignition for      ║
 * ║    fast startup, then hot functions are compiled to optimized machine      ║
 * ║    code by TurboFan. So it's a hybrid approach.                           ║
 * ║                                                                            ║
 * ╚════════════════════════════════════════════════════════════════════════════╝
 *
 *
 * ╔════════════════════════════════════════════════════════════════════════════╗
 * ║ ES6+ FEATURES USED IN THIS FILE                                           ║
 * ╠════════════════════════════════════════════════════════════════════════════╣
 * ║                                                                            ║
 * ║  • Template literals (`${expr}`) - used for string interpolation          ║
 * ║  • const - used for variables that won't be reassigned                    ║
 * ║  • Note: This file intentionally uses some `var` to demonstrate the       ║
 * ║    module wrapper's `arguments` object, which only works in non-strict    ║
 * ║    CommonJS modules.                                                      ║
 * ║                                                                            ║
 * ╚════════════════════════════════════════════════════════════════════════════╝
 *
 *
 * RUN: node docs/00-javascript-engine/01-what-happens-node-file.js
 */
