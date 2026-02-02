/**
 * TOPIC 00: CommonJS - require()
 *
 * ╔════════════════════════════════════════════════════════════════════════════╗
 * ║ THE GOLDEN RULE                                                            ║
 * ╠════════════════════════════════════════════════════════════════════════════╣
 * ║                                                                            ║
 * ║ CommonJS is Node's DEFAULT module system:                                 ║
 * ║                                                                            ║
 * ║   require()        → import a module                                      ║
 * ║   module.exports   → export from a module                                 ║
 * ║   exports.x        → shorthand for module.exports.x                       ║
 * ║                                                                            ║
 * ║ require() is SYNCHRONOUS - it blocks until the module is loaded.          ║
 * ║                                                                            ║
 * ╚════════════════════════════════════════════════════════════════════════════╝
 *
 *
 * ┌─────────────────────────────────────────────────────────────────────────────┐
 * │ STORY TO REMEMBER                                                          │
 * ├─────────────────────────────────────────────────────────────────────────────┤
 * │                                                                             │
 * │  require() is like ORDERING from a CATALOG:                                │
 * │                                                                             │
 * │  1. You say "I need the path tool" → require('path')                      │
 * │  2. Warehouse finds it (resolve path)                                      │
 * │  3. Opens the box (loads the file)                                         │
 * │  4. Wraps it in gift paper (module wrapper function)                      │
 * │  5. Delivers it to your desk (executes)                                    │
 * │  6. Saves a copy in storage (caches)                                       │
 * │                                                                             │
 * │  Next time you order the same thing? Straight from storage!               │
 * │  No re-opening, no re-wrapping. Instant delivery.                         │
 * │                                                                             │
 * │  "require = order once, get cached forever."                              │
 * │                                                                             │
 * └─────────────────────────────────────────────────────────────────────────────┘
 *
 *
 * ┌─────────────────────────────────────────────────────────────────────────────┐
 * │ VISUAL DIAGRAM                                                             │
 * ├─────────────────────────────────────────────────────────────────────────────┤
 * │                                                                             │
 * │   require('path')                                                          │
 * │       │                                                                     │
 * │       ↓                                                                     │
 * │   ┌──────────┐   Is it cached?                                             │
 * │   │ RESOLVE  │──── YES ──→ Return cached module                            │
 * │   └────┬─────┘                                                             │
 * │        │ NO                                                                 │
 * │        ↓                                                                    │
 * │   ┌──────────┐                                                             │
 * │   │  LOAD    │  Read the file from disk                                    │
 * │   └────┬─────┘                                                             │
 * │        ↓                                                                    │
 * │   ┌──────────┐  Wrap in: (function(exports,require,module,...) { })        │
 * │   │   WRAP   │                                                             │
 * │   └────┬─────┘                                                             │
 * │        ↓                                                                    │
 * │   ┌──────────┐                                                             │
 * │   │ EXECUTE  │  Run the code, populate module.exports                      │
 * │   └────┬─────┘                                                             │
 * │        ↓                                                                    │
 * │   ┌──────────┐                                                             │
 * │   │  CACHE   │  Store in require.cache for next time                       │
 * │   └──────────┘                                                             │
 * │                                                                             │
 * └─────────────────────────────────────────────────────────────────────────────┘
 */

// Built-in modules (no install needed)
const path = require('path');
const os = require('os');

console.log('A:', path.join('docs', 'node', 'file.js'));
console.log('B:', os.platform());

// require() resolution order:
// 1. Core modules (fs, path, http)
// 2. File paths (./file, ../file, /absolute)
// 3. node_modules folder

// How require works internally
console.log('C:', 'require() steps:');
console.log('   1. Resolve path');
console.log('   2. Load file');
console.log('   3. Wrap in function (module wrapper)');
console.log('   4. Execute');
console.log('   5. Cache');

// The module wrapper - Node wraps every file in this:
// (function(exports, require, module, __filename, __dirname) {
//   // YOUR CODE HERE
// });
console.log('D:', 'Every file is wrapped in a function');
console.log('E:', `__filename = ${__filename.split('/').slice(-2).join('/')}`);
console.log('F:', `__dirname = ${__dirname.split('/').pop()}`);

// require returns whatever module.exports points to
const result = require('path').basename('/foo/bar/baz.js');
console.log('G:', result);

/**
 * OUTPUT:
 *   A: docs/node/file.js
 *   B: linux
 *   C: require() steps:
 *      1. Resolve path
 *      2. Load file
 *      3. Wrap in function (module wrapper)
 *      4. Execute
 *      5. Cache
 *   D: Every file is wrapped in a function
 *   E: __filename = 01-modules-system/00-commonjs-require.js
 *   F: __dirname = 01-modules-system
 *   G: baz.js
 *
 *
 * ╔════════════════════════════════════════════════════════════════════════════╗
 * ║ MODULE WRAPPER FUNCTION                                                    ║
 * ╠════════════════════════════════════════════════════════════════════════════╣
 * ║                                                                            ║
 * ║   (function(exports, require, module, __filename, __dirname) {            ║
 * ║     // Your module code actually lives here                               ║
 * ║   });                                                                      ║
 * ║                                                                            ║
 * ║   This is why:                                                             ║
 * ║   - Variables are scoped to the file (not global)                         ║
 * ║   - You have access to exports, require, module                           ║
 * ║   - __filename and __dirname are available                                ║
 * ║                                                                            ║
 * ╚════════════════════════════════════════════════════════════════════════════╝
 *
 *
 * ┌─────────────────────────────────────────────────────────────────────────────┐
 * │ INTERVIEW ANSWER                                                            │
 * ├─────────────────────────────────────────────────────────────────────────────┤
 * │                                                                             │
 * │ "CommonJS uses require() for imports and module.exports for exports.       │
 * │  It's synchronous - the module is loaded and executed immediately.         │
 * │  Node wraps each file in a function providing exports, require, module,   │
 * │  __filename, and __dirname. Modules are cached after first require() -    │
 * │  subsequent calls return the cached version."                              │
 * │                                                                             │
 * └─────────────────────────────────────────────────────────────────────────────┘
 *
 *
 * RUN: node docs/node/01-modules-system/00-commonjs-require.js
 */
