/**
 * MODULES: 01 - CommonJS Deep Dive
 *
 * ╔════════════════════════════════════════════════════════════════════════════╗
 * ║ COMMONJS (CJS) - Node.js Original Module System                            ║
 * ╠════════════════════════════════════════════════════════════════════════════╣
 * ║                                                                            ║
 * ║ Created for Node.js in 2009 before ES Modules existed.                     ║
 * ║ Still widely used and the default for Node.js .js files.                   ║
 * ║                                                                            ║
 * ║ Syntax: require() / module.exports / exports                               ║
 * ║                                                                            ║
 * ╚════════════════════════════════════════════════════════════════════════════╝
 */


// ═══════════════════════════════════════════════════════════════════════════════
// HOW require() WORKS INTERNALLY
// ═══════════════════════════════════════════════════════════════════════════════

console.log('=== How require() Works ===\n');

/**
 * ┌─────────────────────────────────────────────────────────────────────────────┐
 * │ require() EXECUTION FLOW                                                    │
 * ├─────────────────────────────────────────────────────────────────────────────┤
 * │                                                                             │
 * │   require('./math')                                                         │
 * │         │                                                                   │
 * │         ▼                                                                   │
 * │   ┌─────────────────────────────┐                                           │
 * │   │ 1. RESOLVE: Find file path  │                                           │
 * │   │    ./math → /full/path/math │                                           │
 * │   └──────────────┬──────────────┘                                           │
 * │                  ▼                                                          │
 * │   ┌─────────────────────────────┐                                           │
 * │   │ 2. CHECK CACHE              │                                           │
 * │   │    Already loaded? Return   │                                           │
 * │   │    cached module.exports    │                                           │
 * │   └──────────────┬──────────────┘                                           │
 * │                  ▼                                                          │
 * │   ┌─────────────────────────────┐                                           │
 * │   │ 3. CREATE MODULE OBJECT     │                                           │
 * │   │    {                        │                                           │
 * │   │      id: '/path/math.js',   │                                           │
 * │   │      exports: {},           │                                           │
 * │   │      loaded: false          │                                           │
 * │   │    }                        │                                           │
 * │   └──────────────┬──────────────┘                                           │
 * │                  ▼                                                          │
 * │   ┌─────────────────────────────┐                                           │
 * │   │ 4. WRAP CODE IN FUNCTION    │                                           │
 * │   │    (function(exports,       │                                           │
 * │   │     require, module,        │                                           │
 * │   │     __filename, __dirname)  │                                           │
 * │   │    { /* your code * })     │                                           │
 * │   └──────────────┬──────────────┘                                           │
 * │                  ▼                                                          │
 * │   ┌─────────────────────────────┐                                           │
 * │   │ 5. EXECUTE & CACHE          │                                           │
 * │   │    Run code, cache result   │                                           │
 * │   │    Return module.exports    │                                           │
 * │   └─────────────────────────────┘                                           │
 * │                                                                             │
 * └─────────────────────────────────────────────────────────────────────────────┘
 */

// The wrapper function Node.js uses
console.log('A: Module wrapper function:');
console.log(`(function(exports, require, module, __filename, __dirname) {
  // Your module code here
});`);


// ═══════════════════════════════════════════════════════════════════════════════
// EXPORTING IN COMMONJS
// ═══════════════════════════════════════════════════════════════════════════════

console.log('\n=== Exporting Methods ===\n');

/**
 * ┌─────────────────────────────────────────────────────────────────────────────┐
 * │ THREE WAYS TO EXPORT                                                        │
 * ├─────────────────────────────────────────────────────────────────────────────┤
 * │                                                                             │
 * │   METHOD 1: module.exports = { ... }                                        │
 * │   ──────────────────────────────────────────────────────────────────        │
 * │   Replaces the entire exports object                                        │
 * │                                                                             │
 * │   METHOD 2: module.exports.name = value                                     │
 * │   ──────────────────────────────────────────────────────────────────        │
 * │   Adds property to exports object                                           │
 * │                                                                             │
 * │   METHOD 3: exports.name = value                                            │
 * │   ──────────────────────────────────────────────────────────────────        │
 * │   Shorthand (exports points to module.exports)                              │
 * │                                                                             │
 * │   ⚠️ GOTCHA: exports = { } DOESN'T WORK!                                    │
 * │                                                                             │
 * └─────────────────────────────────────────────────────────────────────────────┘
 */

// Simulating module object
const module1 = { exports: {} };
let exports1 = module1.exports; // exports is a reference to module.exports

// Method 2: Adding properties
module1.exports.add = (a, b) => a + b;
exports1.subtract = (a, b) => a - b;  // Works! Same object

console.log('B: module1.exports:', module1.exports);
// { add: [Function], subtract: [Function] }


// ═══════════════════════════════════════════════════════════════════════════════
// THE exports SHORTHAND GOTCHA
// ═══════════════════════════════════════════════════════════════════════════════

console.log('\n=== exports Gotcha ===\n');

/**
 * ┌─────────────────────────────────────────────────────────────────────────────┐
 * │ WHY exports = { } DOESN'T WORK                                              │
 * ├─────────────────────────────────────────────────────────────────────────────┤
 * │                                                                             │
 * │   INITIAL STATE:                                                            │
 * │   ┌────────────────────────────────────────────────────────────────────┐    │
 * │   │                                                                    │    │
 * │   │   module.exports ─────────────► { }  (Object A)                    │    │
 * │   │                                  ▲                                 │    │
 * │   │   exports ────────────────────────┘  (points to same object)       │    │
 * │   │                                                                    │    │
 * │   └────────────────────────────────────────────────────────────────────┘    │
 * │                                                                             │
 * │   AFTER: exports = { newProp: 1 }                                           │
 * │   ┌────────────────────────────────────────────────────────────────────┐    │
 * │   │                                                                    │    │
 * │   │   module.exports ─────────────► { }  (Object A - UNCHANGED!)       │    │
 * │   │                                                                    │    │
 * │   │   exports ────────────────────► { newProp: 1 }  (Object B - NEW)   │    │
 * │   │                                                                    │    │
 * │   └────────────────────────────────────────────────────────────────────┘    │
 * │                                                                             │
 * │   require() returns module.exports (Object A), not exports!                 │
 * │                                                                             │
 * └─────────────────────────────────────────────────────────────────────────────┘
 */

const module2 = { exports: {} };
let exports2 = module2.exports;

// This BREAKS the reference!
exports2 = { broken: true };  // exports now points to different object

console.log('C: module2.exports:', module2.exports);  // {} (empty!)
console.log('D: exports2:', exports2);                 // { broken: true }
console.log('E: Same object?:', module2.exports === exports2); // false!

// CORRECT way to replace exports:
const module3 = { exports: {} };
module3.exports = { working: true };  // Replace on module, not exports

console.log('F: module3.exports:', module3.exports);  // { working: true }


// ═══════════════════════════════════════════════════════════════════════════════
// MODULE CACHING
// ═══════════════════════════════════════════════════════════════════════════════

console.log('\n=== Module Caching ===\n');

/**
 * ┌─────────────────────────────────────────────────────────────────────────────┐
 * │ MODULES ARE CACHED (SINGLETONS)                                             │
 * ├─────────────────────────────────────────────────────────────────────────────┤
 * │                                                                             │
 * │   const a = require('./counter');                                           │
 * │   const b = require('./counter');                                           │
 * │                                                                             │
 * │   a === b  // TRUE! Same object                                             │
 * │                                                                             │
 * │   WHY?                                                                      │
 * │   • require() caches in require.cache                                       │
 * │   • Second require() returns cached exports                                 │
 * │   • Module code runs ONLY ONCE                                              │
 * │                                                                             │
 * │                                                                             │
 * │   WHEN TO USE:                                                              │
 * │   • Singletons (database connections, loggers)                              │
 * │   • Configuration objects                                                   │
 * │   • Shared state                                                            │
 * │                                                                             │
 * │                                                                             │
 * │   HOW TO CLEAR CACHE:                                                       │
 * │   delete require.cache[require.resolve('./module')];                        │
 * │                                                                             │
 * └─────────────────────────────────────────────────────────────────────────────┘
 */

// Simulating caching
const requireCache = {};

function simulateRequire(modulePath) {
  // Check cache first
  if (requireCache[modulePath]) {
    console.log(`  [Cache HIT] ${modulePath}`);
    return requireCache[modulePath].exports;
  }

  console.log(`  [Cache MISS] Loading ${modulePath}`);

  // Create and cache module
  const module = { exports: {} };
  requireCache[modulePath] = module;

  // "Execute" module (simulate)
  module.exports = { counter: 0, increment() { this.counter++; } };

  return module.exports;
}

const counterA = simulateRequire('./counter');
const counterB = simulateRequire('./counter');

console.log('G: counterA === counterB:', counterA === counterB); // true

counterA.increment();
console.log('H: counterA.counter:', counterA.counter); // 1
console.log('I: counterB.counter:', counterB.counter); // 1 (same object!)


// ═══════════════════════════════════════════════════════════════════════════════
// DYNAMIC REQUIRE
// ═══════════════════════════════════════════════════════════════════════════════

console.log('\n=== Dynamic require() ===\n');

/**
 * ┌─────────────────────────────────────────────────────────────────────────────┐
 * │ require() IS DYNAMIC (CAN BE USED ANYWHERE)                                 │
 * ├─────────────────────────────────────────────────────────────────────────────┤
 * │                                                                             │
 * │   // Conditional require                                                    │
 * │   if (process.env.NODE_ENV === 'dev') {                                     │
 * │     const debug = require('debug-tools');                                   │
 * │   }                                                                         │
 * │                                                                             │
 * │   // Dynamic path                                                           │
 * │   const plugin = require(`./plugins/${pluginName}`);                        │
 * │                                                                             │
 * │   // Inside functions                                                       │
 * │   function loadConfig() {                                                   │
 * │     return require('./config.json');                                        │
 * │   }                                                                         │
 * │                                                                             │
 * │   ⚠️ This flexibility makes static analysis difficult (no tree shaking)    │
 * │                                                                             │
 * └─────────────────────────────────────────────────────────────────────────────┘
 */

// Example: Conditional loading
const env = 'production';

function getLogger() {
  if (env === 'development') {
    // Would dynamically require dev logger
    return { log: console.log };
  }
  // Production logger (minimal)
  return { log: () => {} };
}

const logger = getLogger();
console.log('J: Logger loaded based on environment');


// ═══════════════════════════════════════════════════════════════════════════════
// __filename AND __dirname
// ═══════════════════════════════════════════════════════════════════════════════

console.log('\n=== __filename and __dirname ===\n');

/**
 * ┌─────────────────────────────────────────────────────────────────────────────┐
 * │ CJS PROVIDES __filename AND __dirname                                       │
 * ├─────────────────────────────────────────────────────────────────────────────┤
 * │                                                                             │
 * │   __filename: Full path to current file                                     │
 * │              /home/user/project/src/utils.js                                │
 * │                                                                             │
 * │   __dirname: Directory of current file                                      │
 * │             /home/user/project/src                                          │
 * │                                                                             │
 * │   Common use cases:                                                         │
 * │   • path.join(__dirname, 'data.json')                                       │
 * │   • path.resolve(__dirname, '..', 'config')                                 │
 * │                                                                             │
 * │   ⚠️ NOT available in ESM! Use import.meta.url instead.                     │
 * │                                                                             │
 * └─────────────────────────────────────────────────────────────────────────────┘
 */

console.log('K: __filename:', __filename);
console.log('L: __dirname:', __dirname);


/**
 * ┌─────────────────────────────────────────────────────────────────────────────┐
 * │ INTERVIEW ANSWER                                                            │
 * ├─────────────────────────────────────────────────────────────────────────────┤
 * │                                                                             │
 * │ "CommonJS is Node.js's original module system with these key features:      │
 * │                                                                             │
 * │ 1. Synchronous loading: require() blocks until module loads                 │
 * │                                                                             │
 * │ 2. Runtime evaluation: Code runs when require() is called                   │
 * │                                                                             │
 * │ 3. Caching: Modules are singletons - require() twice returns same object    │
 * │                                                                             │
 * │ 4. Dynamic: Can require() inside conditionals or with computed paths        │
 * │                                                                             │
 * │ 5. Module wrapper: Node wraps code in a function providing:                 │
 * │    exports, require, module, __filename, __dirname                          │
 * │                                                                             │
 * │ Common gotcha: 'exports = {}' doesn't work because exports is just a        │
 * │ reference to module.exports. Reassigning it breaks the reference.           │
 * │ Always use 'module.exports = {}' to replace the entire export.              │
 * │                                                                             │
 * │ The main limitation is no static analysis, which prevents tree shaking.     │
 * │ That's why ES Modules are preferred for modern applications."               │
 * │                                                                             │
 * └─────────────────────────────────────────────────────────────────────────────┘
 *
 *
 * RUN: node docs/20-modules-esm-cjs/01-commonjs-deep-dive.js
 */
