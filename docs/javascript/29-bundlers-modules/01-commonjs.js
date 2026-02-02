/**
 * BUNDLERS & MODULES: 01 - CommonJS (CJS)
 *
 * ONE CONCEPT: Node.js module system — require() and module.exports
 */


// =============================================================================
// HOW COMMONJS WORKS
// =============================================================================

console.log('=== CommonJS (CJS) ===\n');

/**
 *   ┌──────────────────────────────────────────────────────────────────────┐
 *   │  COMMONJS MODULE SYSTEM                                             │
 *   ├──────────────────────────────────────────────────────────────────────┤
 *   │                                                                      │
 *   │  EXPORTING:                          IMPORTING:                      │
 *   │                                                                      │
 *   │  // Single export                    const add = require('./math');  │
 *   │  module.exports = function add() {}  add(1, 2);                     │
 *   │                                                                      │
 *   │  // Named exports                    const { add } = require('./m');│
 *   │  exports.add = function() {};        add(1, 2);                     │
 *   │  exports.sub = function() {};                                        │
 *   │                                                                      │
 *   │  // Object export                    const math = require('./math');│
 *   │  module.exports = { add, sub };      math.add(1, 2);               │
 *   │                                                                      │
 *   └──────────────────────────────────────────────────────────────────────┘
 *
 */


// =============================================================================
// HOW NODE.JS WRAPS MODULES
// =============================================================================

console.log('=== How Node Wraps CJS ===\n');

/**
 *   ┌──────────────────────────────────────────────────────────────────────┐
 *   │  WHAT NODE ACTUALLY DOES                                            │
 *   ├──────────────────────────────────────────────────────────────────────┤
 *   │                                                                      │
 *   │  Your code:                                                          │
 *   │  ┌────────────────────────────────┐                                 │
 *   │  │ const x = 10;                 │                                  │
 *   │  │ module.exports = x;           │                                  │
 *   │  └────────────────────────────────┘                                 │
 *   │                                                                      │
 *   │  Node wraps it in a function:                                        │
 *   │  ┌────────────────────────────────────────────────────────────┐     │
 *   │  │ (function(exports, require, module, __filename, __dirname) │     │
 *   │  │ {                                                          │     │
 *   │  │   const x = 10;                                           │     │
 *   │  │   module.exports = x;                                     │     │
 *   │  │ });                                                        │     │
 *   │  └────────────────────────────────────────────────────────────┘     │
 *   │                                                                      │
 *   │  This is why:                                                        │
 *   │  • Variables are scoped (not global)                                 │
 *   │  • require, module, exports, __filename, __dirname exist             │
 *   │  • Each file is its own scope                                        │
 *   │                                                                      │
 *   └──────────────────────────────────────────────────────────────────────┘
 *
 */

// Proof: these exist in every CJS file
console.log('module.id:', module.id);
console.log('__filename:', __filename);
console.log('__dirname:', __dirname);
console.log('typeof require:', typeof require);
console.log('typeof exports:', typeof exports);
console.log('exports === module.exports:', exports === module.exports);


// =============================================================================
// REQUIRE() RESOLUTION ALGORITHM
// =============================================================================

console.log('\n=== require() Resolution ===\n');

/**
 *   ┌──────────────────────────────────────────────────────────────────────┐
 *   │  require('X') RESOLUTION ORDER                                      │
 *   ├──────────────────────────────────────────────────────────────────────┤
 *   │                                                                      │
 *   │  require('X')                                                        │
 *   │    │                                                                 │
 *   │    ├─ Is X a core module? (fs, path, http)                          │
 *   │    │  └─ YES → return core module                                   │
 *   │    │                                                                 │
 *   │    ├─ Does X start with './' or '../' or '/'?                       │
 *   │    │  └─ YES → resolve as FILE or DIRECTORY:                        │
 *   │    │     1. Try X (exact file)                                      │
 *   │    │     2. Try X.js                                                │
 *   │    │     3. Try X.json                                              │
 *   │    │     4. Try X.node                                              │
 *   │    │     5. Try X/index.js                                          │
 *   │    │     6. Try X/index.json                                        │
 *   │    │     7. Try X/package.json → "main" field                       │
 *   │    │                                                                 │
 *   │    └─ NO (bare specifier like 'lodash')                             │
 *   │       └─ Search node_modules/ directories:                          │
 *   │          ./node_modules/X                                           │
 *   │          ../node_modules/X                                          │
 *   │          ../../node_modules/X                                       │
 *   │          ... up to root                                             │
 *   │                                                                      │
 *   └──────────────────────────────────────────────────────────────────────┘
 *
 */

console.log('require("fs")          → core module');
console.log('require("./utils")     → ./utils.js or ./utils/index.js');
console.log('require("lodash")      → node_modules/lodash/');
console.log('require("./data.json") → parsed JSON object');


// =============================================================================
// CACHING: MODULES ARE SINGLETONS
// =============================================================================

console.log('\n=== Module Caching ===\n');

/**
 *   ┌──────────────────────────────────────────────────────────────────────┐
 *   │  CJS MODULES ARE CACHED (Singleton)                                 │
 *   ├──────────────────────────────────────────────────────────────────────┤
 *   │                                                                      │
 *   │  First require('./counter'):                                         │
 *   │  ┌──────────────┐    ┌────────────┐    ┌──────────────┐            │
 *   │  │ require()    │ →  │ Execute    │ →  │ Cache result │            │
 *   │  │              │    │ module code│    │ in require   │            │
 *   │  └──────────────┘    └────────────┘    └──────────────┘            │
 *   │                                                                      │
 *   │  Second require('./counter'):                                        │
 *   │  ┌──────────────┐    ┌────────────┐                                │
 *   │  │ require()    │ →  │ Return     │  ← Code NOT re-executed!       │
 *   │  │              │    │ from cache │                                 │
 *   │  └──────────────┘    └────────────┘                                │
 *   │                                                                      │
 *   └──────────────────────────────────────────────────────────────────────┘
 *
 */

// Simulating CJS caching behavior
const moduleCache = {};

function fakeRequire(id) {
  if (moduleCache[id]) {
    console.log(`  Cache HIT: ${id}`);
    return moduleCache[id].exports;
  }

  console.log(`  Loading: ${id}`);
  const mod = { exports: {} };
  moduleCache[id] = mod;

  // "Execute" module
  if (id === 'counter') {
    let count = 0;
    mod.exports = {
      increment: () => ++count,
      getCount: () => count
    };
  }

  return mod.exports;
}

const counter1 = fakeRequire('counter');
const counter2 = fakeRequire('counter');  // Cache hit!

counter1.increment();
counter1.increment();
console.log('counter1.getCount():', counter1.getCount());  // 2
console.log('counter2.getCount():', counter2.getCount());  // 2 — same instance!
console.log('Same object?', counter1 === counter2);  // true


// =============================================================================
// SYNCHRONOUS LOADING
// =============================================================================

console.log('\n=== Synchronous Loading ===\n');

/**
 *   ┌─────────────────────────────────────────────────────────────────────┐
 *   │  CJS IS SYNCHRONOUS                                                │
 *   ├─────────────────────────────────────────────────────────────────────┤
 *   │                                                                     │
 *   │  const a = require('./a');   ← Blocks until a is loaded            │
 *   │  const b = require('./b');   ← Then blocks until b is loaded       │
 *   │  console.log(a, b);         ← Only runs after both loaded          │
 *   │                                                                     │
 *   │  This is fine for Node.js (reading from disk = fast)               │
 *   │  This is bad for browsers (downloading over network = slow)         │
 *   │  → That's why browsers need ESM (async) or bundlers                │
 *   │                                                                     │
 *   └─────────────────────────────────────────────────────────────────────┘
 *
 */

console.log('CJS: synchronous, blocking');
console.log('Good for: Node.js (disk I/O is fast)');
console.log('Bad for: browsers (network I/O is slow)');


// =============================================================================
// EXPORTS vs MODULE.EXPORTS
// =============================================================================

console.log('\n=== exports vs module.exports ===\n');

/**
 *   ┌──────────────────────────────────────────────────────────────────────┐
 *   │  THE EXPORTS GOTCHA                                                 │
 *   ├──────────────────────────────────────────────────────────────────────┤
 *   │                                                                      │
 *   │  Initially:  exports === module.exports  (same reference)           │
 *   │                                                                      │
 *   │  ✓ WORKS:                                                           │
 *   │  exports.add = fn;           // Adds to the shared object           │
 *   │  module.exports.add = fn;    // Same thing                          │
 *   │  module.exports = { add };   // Replaces the export object          │
 *   │                                                                      │
 *   │  ✗ BROKEN:                                                          │
 *   │  exports = { add };          // Reassigns local variable!           │
 *   │                              // module.exports unchanged!           │
 *   │                                                                      │
 *   │  ┌─────────┐     ┌──────────────┐                                  │
 *   │  │ exports ├────▶│ { }          │◀──── module.exports              │
 *   │  └─────────┘     └──────────────┘                                  │
 *   │                                                                      │
 *   │  exports = { add }                                                  │
 *   │  ┌─────────┐     ┌──────────────┐                                  │
 *   │  │ exports ├────▶│ { add }      │   module.exports still → { }    │
 *   │  └─────────┘     └──────────────┘                                  │
 *   │                  (orphaned! require returns module.exports)         │
 *   │                                                                      │
 *   └──────────────────────────────────────────────────────────────────────┘
 *
 */

// Demonstration
const mod = { exports: {} };
let exp = mod.exports;  // Same reference

// This works - mutating the shared object
exp.hello = 'world';
console.log('After exp.hello:', mod.exports);  // { hello: 'world' }

// This BREAKS - reassigning the local variable
exp = { goodbye: 'world' };
console.log('After exp = {}:', mod.exports);   // { hello: 'world' } — unchanged!
console.log('exp:', exp);                       // { goodbye: 'world' } — orphaned

console.log('\nRule: Always use module.exports for full replacement');
console.log('Use exports.x for adding properties');


// =============================================================================
// CIRCULAR DEPENDENCIES
// =============================================================================

console.log('\n=== Circular Dependencies ===\n');

/**
 *   ┌─────────────────────────────────────────────────────────────────────┐
 *   │  CJS HANDLES CIRCULAR DEPS (partially)                            │
 *   ├─────────────────────────────────────────────────────────────────────┤
 *   │                                                                     │
 *   │  a.js:                        b.js:                                │
 *   │  exports.x = 1;              const a = require('./a');             │
 *   │  const b = require('./b');   // a = { x: 1 } (partial!)           │
 *   │  exports.y = 2;              exports.z = a.x + 10;               │
 *   │                                                                     │
 *   │  When b requires a:                                                │
 *   │  • a hasn't finished executing                                     │
 *   │  • b gets a PARTIAL export (only what's been set so far)          │
 *   │  • a.x exists, a.y does NOT yet                                    │
 *   │                                                                     │
 *   │  This can cause subtle bugs! Avoid circular deps.                  │
 *   │                                                                     │
 *   └─────────────────────────────────────────────────────────────────────┘
 *
 */

console.log('CJS circular deps: returns partial exports (what was set so far)');
console.log('ESM circular deps: returns live bindings (reference, not value)');
console.log('Best practice: AVOID circular dependencies');


// =============================================================================
// COMMON CJS PATTERNS
// =============================================================================

console.log('\n=== Common CJS Patterns ===\n');

// Pattern 1: Export a function
// module.exports = function createApp() { ... };

// Pattern 2: Export an object
// module.exports = { add, subtract, multiply };

// Pattern 3: Export a class
// module.exports = class Database { ... };

// Pattern 4: Export a singleton
// module.exports = new Database();  // Same instance everywhere

// Pattern 5: Conditional require
const isProduction = process.env.NODE_ENV === 'production';
// const logger = require(isProduction ? './prod-logger' : './dev-logger');

console.log('CJS allows dynamic/conditional require():');
console.log('  if (cond) require("./a") else require("./b")');
console.log('  ESM cannot do this (static imports only)');


// =============================================================================
// INTERVIEW: What to Say
// =============================================================================

/**
 * "CommonJS is Node.js's original module system. You export with
 * module.exports and import with require(). Node wraps each file in a
 * function that provides exports, require, module, __filename, and __dirname.
 *
 * Key characteristics: it's synchronous (loads files from disk, blocking),
 * modules are cached as singletons (require the same file twice, get the same
 * object), and require() is dynamic — you can call it conditionally or
 * compute the path at runtime.
 *
 * A common gotcha is `exports = { ... }` which breaks the reference to
 * module.exports. Always use module.exports for full replacement.
 *
 * CJS modules are evaluated at runtime and return a copy of the exported
 * value. This means they can't be statically analyzed for tree-shaking,
 * which is one reason ESM is preferred for modern frontend code."
 */


// RUN: node docs/29-bundlers-modules/01-commonjs.js
