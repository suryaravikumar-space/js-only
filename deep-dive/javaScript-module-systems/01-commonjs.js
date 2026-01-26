/**
 * ═══════════════════════════════════════════════════════════════════════════
 * JAVASCRIPT MODULE SYSTEMS - CommonJS (CJS)
 * ═══════════════════════════════════════════════════════════════════════════
 *
 * CommonJS is the original module system for Node.js, using require() and
 * module.exports for synchronous module loading.
 */

/**
 * ┌──────────────────────────────────────────────────────────────────────────┐
 * │                    MODULE SYSTEM HISTORY                                 │
 * ├──────────────────────────────────────────────────────────────────────────┤
 * │                                                                          │
 * │   2009: CommonJS specification created                                  │
 * │   2009: Node.js adopts CommonJS                                         │
 * │   2015: ES Modules (ESM) standardized in ES6                            │
 * │   2017: Node.js adds experimental ESM support                           │
 * │   2020: Node.js stable ESM support (v14+)                               │
 * │                                                                          │
 * │   ┌─────────────────────────────────────────────────────────────────┐   │
 * │   │                  BEFORE MODULES (Pre-2009)                      │   │
 * │   └─────────────────────────────────────────────────────────────────┘   │
 * │                                                                          │
 * │   <!-- All scripts share global scope! -->                              │
 * │   <script src="lib1.js"></script>                                       │
 * │   <script src="lib2.js"></script>  <!-- Can override lib1's vars! -->   │
 * │   <script src="app.js"></script>                                        │
 * │                                                                          │
 * │   Problems:                                                              │
 * │   • Global namespace pollution                                          │
 * │   • Load order dependencies                                             │
 * │   • No explicit dependency declaration                                  │
 * │   • Name collisions                                                     │
 * │                                                                          │
 * └──────────────────────────────────────────────────────────────────────────┘
 */

console.log("═══════════════════════════════════════════════════════════════");
console.log("           COMMONJS MODULE SYSTEM");
console.log("═══════════════════════════════════════════════════════════════\n");

/**
 * ┌──────────────────────────────────────────────────────────────────────────┐
 * │                    COMMONJS BASICS                                       │
 * ├──────────────────────────────────────────────────────────────────────────┤
 * │                                                                          │
 * │   EXPORTING:                          IMPORTING:                        │
 * │   ══════════                          ══════════                        │
 * │                                                                          │
 * │   // Named exports                    // Import all                     │
 * │   module.exports.foo = foo;           const mod = require('./mod');     │
 * │   exports.bar = bar;                  mod.foo();                        │
 * │                                                                          │
 * │   // Default export                   // Destructure                    │
 * │   module.exports = MyClass;           const { foo, bar } = require(...);│
 * │                                                                          │
 * │   // Mixed                            // Rename                         │
 * │   module.exports = {                  const { foo: f } = require(...); │
 * │       foo, bar, default: MyClass      const f = require('./mod').foo;   │
 * │   };                                                                    │
 * │                                                                          │
 * └──────────────────────────────────────────────────────────────────────────┘
 */

// ============================================================================
// Basic Exports
// ============================================================================
console.log("─── Basic Exports ───\n");

// Named export using exports shorthand
exports.VERSION = '1.0.0';

// Named export using module.exports
module.exports.greet = function(name) {
    return `Hello, ${name}!`;
};

// Function declaration export
function add(a, b) {
    return a + b;
}
module.exports.add = add;

// Class export
class Calculator {
    add(a, b) { return a + b; }
    subtract(a, b) { return a - b; }
    multiply(a, b) { return a * b; }
    divide(a, b) { return b !== 0 ? a / b : Infinity; }
}
module.exports.Calculator = Calculator;

// ============================================================================
// exports vs module.exports
// ============================================================================
console.log("─── exports vs module.exports ───\n");

/**
 * ┌──────────────────────────────────────────────────────────────────────────┐
 * │                    exports vs module.exports                             │
 * ├──────────────────────────────────────────────────────────────────────────┤
 * │                                                                          │
 * │   Initially: exports = module.exports = {}                              │
 * │                                                                          │
 * │   exports is a SHORTCUT to module.exports                               │
 * │                                                                          │
 * │   ┌─────────────────────────────────────────────────────────────────┐   │
 * │   │ module                                                          │   │
 * │   │   │                                                             │   │
 * │   │   └── exports ──────────┐                                       │   │
 * │   │                         ▼                                       │   │
 * │   │                    ┌─────────┐                                  │   │
 * │   │                    │   {}    │◄──── exports (alias)             │   │
 * │   │                    └─────────┘                                  │   │
 * │   └─────────────────────────────────────────────────────────────────┘   │
 * │                                                                          │
 * │   ⚠️  GOTCHA: Reassigning exports breaks the reference!                │
 * │                                                                          │
 * │   exports = { foo: 'bar' };  // ❌ BROKEN! Doesn't export anything     │
 * │   module.exports = { foo: 'bar' };  // ✅ Works correctly              │
 * │                                                                          │
 * └──────────────────────────────────────────────────────────────────────────┘
 */

// CORRECT ways to export
const correctExports = {
    // Add to exports object
    way1: "exports.foo = 'bar'",

    // Add to module.exports
    way2: "module.exports.foo = 'bar'",

    // Replace module.exports entirely
    way3: "module.exports = { foo: 'bar' }",

    // Export single value
    way4: "module.exports = myFunction"
};

// INCORRECT - breaks export
const incorrectExports = {
    broken: "exports = { foo: 'bar' }  // Reassigns local reference!"
};

console.log("Correct export patterns:", correctExports);
console.log("Broken pattern:", incorrectExports);

/**
 * ┌──────────────────────────────────────────────────────────────────────────┐
 * │                    REQUIRE() MECHANICS                                   │
 * ├──────────────────────────────────────────────────────────────────────────┤
 * │                                                                          │
 * │   require('./module')                                                   │
 * │        │                                                                 │
 * │        ▼                                                                 │
 * │   ┌─────────────────┐                                                   │
 * │   │ 1. Check Cache  │◄─── If cached, return cached exports             │
 * │   └────────┬────────┘                                                   │
 * │            │ (not cached)                                               │
 * │            ▼                                                             │
 * │   ┌─────────────────┐                                                   │
 * │   │ 2. Resolve Path │◄─── Find actual file path                        │
 * │   └────────┬────────┘                                                   │
 * │            │                                                             │
 * │            ▼                                                             │
 * │   ┌─────────────────┐                                                   │
 * │   │ 3. Create Module│◄─── Create module object                          │
 * │   └────────┬────────┘                                                   │
 * │            │                                                             │
 * │            ▼                                                             │
 * │   ┌─────────────────┐                                                   │
 * │   │ 4. Cache Module │◄─── Cache before execution (circular refs)       │
 * │   └────────┬────────┘                                                   │
 * │            │                                                             │
 * │            ▼                                                             │
 * │   ┌─────────────────┐                                                   │
 * │   │ 5. Execute Code │◄─── Run module code                               │
 * │   └────────┬────────┘                                                   │
 * │            │                                                             │
 * │            ▼                                                             │
 * │   ┌─────────────────┐                                                   │
 * │   │ 6. Return exports│◄─── Return module.exports                        │
 * │   └─────────────────┘                                                   │
 * │                                                                          │
 * └──────────────────────────────────────────────────────────────────────────┘
 */

console.log("\n─── require() Mechanics ───\n");

// ============================================================================
// Module Caching
// ============================================================================
console.log("Module Caching:");

// Modules are cached after first require
// const mod1 = require('./myModule');  // Loads and executes
// const mod2 = require('./myModule');  // Returns cached version
// mod1 === mod2  // true

console.log("  - require.cache stores loaded modules");
console.log("  - Same module returns same object");
console.log("  - Changes persist across requires\n");

// View cache
console.log("Cache entries (first 3):");
const cacheKeys = Object.keys(require.cache).slice(0, 3);
cacheKeys.forEach(key => {
    const shortPath = key.split('/').slice(-2).join('/');
    console.log(`  - ${shortPath}`);
});

// ============================================================================
// Clear Module Cache
// ============================================================================
function clearModuleCache(modulePath) {
    const resolved = require.resolve(modulePath);

    // Delete from cache
    delete require.cache[resolved];

    // Also need to clear parent references
    Object.keys(require.cache).forEach(key => {
        const mod = require.cache[key];
        if (mod.children) {
            mod.children = mod.children.filter(child =>
                child.filename !== resolved
            );
        }
    });
}

console.log("\nClearing cache function:");
console.log("  delete require.cache[require.resolve('./module')]");

/**
 * ┌──────────────────────────────────────────────────────────────────────────┐
 * │                    MODULE RESOLUTION                                     │
 * ├──────────────────────────────────────────────────────────────────────────┤
 * │                                                                          │
 * │   require('X') - Resolution Algorithm:                                  │
 * │                                                                          │
 * │   1. If X is a core module (fs, path, http):                           │
 * │      → Return core module                                               │
 * │                                                                          │
 * │   2. If X starts with './' or '../' or '/':                            │
 * │      → Resolve as file, then as directory                              │
 * │                                                                          │
 * │   3. Else (package):                                                    │
 * │      → Search node_modules folders up the tree                          │
 * │                                                                          │
 * │   FILE RESOLUTION:                                                       │
 * │   X → X.js → X.json → X.node → X/index.js                              │
 * │                                                                          │
 * │   NODE_MODULES SEARCH:                                                   │
 * │   /project/src/node_modules/X                                           │
 * │   /project/node_modules/X                                               │
 * │   /node_modules/X                                                        │
 * │                                                                          │
 * └──────────────────────────────────────────────────────────────────────────┘
 */

console.log("\n─── Module Resolution ───\n");

// Resolution examples
const resolutionExamples = {
    "require('fs')": "Core module - built into Node.js",
    "require('./utils')": "./utils.js or ./utils/index.js",
    "require('../config')": "../config.js or ../config/index.js",
    "require('lodash')": "node_modules/lodash/index.js",
    "require('lodash/get')": "node_modules/lodash/get.js"
};

console.log("Resolution Examples:");
Object.entries(resolutionExamples).forEach(([req, resolved]) => {
    console.log(`  ${req}`);
    console.log(`    → ${resolved}`);
});

// ============================================================================
// module Object Properties
// ============================================================================
console.log("\n─── module Object ───\n");

console.log("module.id:", module.id);
console.log("module.filename:", module.filename?.split('/').slice(-2).join('/'));
console.log("module.loaded:", module.loaded);
console.log("module.parent:", module.parent ? 'exists' : 'null (entry point)');
console.log("module.children.length:", module.children?.length);
console.log("module.paths (first 2):", module.paths?.slice(0, 2));

/**
 * ┌──────────────────────────────────────────────────────────────────────────┐
 * │                    CIRCULAR DEPENDENCIES                                 │
 * ├──────────────────────────────────────────────────────────────────────────┤
 * │                                                                          │
 * │   a.js requires b.js                                                    │
 * │   b.js requires a.js  ◄── Circular!                                     │
 * │                                                                          │
 * │   HOW NODE HANDLES IT:                                                   │
 * │   1. Start loading a.js                                                 │
 * │   2. a.js requires b.js                                                 │
 * │   3. Start loading b.js                                                 │
 * │   4. b.js requires a.js                                                 │
 * │   5. Return PARTIAL a.js exports (what's exported so far)              │
 * │   6. Finish loading b.js                                                │
 * │   7. Return to a.js, finish loading                                     │
 * │                                                                          │
 * │   ⚠️  b.js gets incomplete a.js exports!                               │
 * │                                                                          │
 * └──────────────────────────────────────────────────────────────────────────┘
 */

console.log("\n─── Circular Dependencies ───\n");

// Simulating circular dependency behavior
const circularExample = `
// a.js
console.log('a starting');
exports.done = false;
const b = require('./b.js');
console.log('in a, b.done =', b.done);
exports.done = true;
console.log('a done');

// b.js
console.log('b starting');
exports.done = false;
const a = require('./a.js');  // Gets PARTIAL exports!
console.log('in b, a.done =', a.done);  // false!
exports.done = true;
console.log('b done');

// Output:
// a starting
// b starting
// in b, a.done = false  ← Partial!
// b done
// in a, b.done = true
// a done
`;

console.log("Circular Dependency Example:");
console.log(circularExample);

// Solution patterns
console.log("Solutions:");
console.log("  1. Move shared code to third module");
console.log("  2. Use dependency injection");
console.log("  3. Defer require to function body");
console.log("  4. Restructure to avoid circular deps\n");

/**
 * ┌──────────────────────────────────────────────────────────────────────────┐
 * │                    COMMONJS WRAPPER                                      │
 * ├──────────────────────────────────────────────────────────────────────────┤
 * │                                                                          │
 * │   Node wraps every module in a function:                                │
 * │                                                                          │
 * │   (function(exports, require, module, __filename, __dirname) {          │
 * │       // Your module code here                                          │
 * │   });                                                                    │
 * │                                                                          │
 * │   This provides:                                                         │
 * │   • Private scope (no global pollution)                                 │
 * │   • exports, require, module, __filename, __dirname                     │
 * │                                                                          │
 * └──────────────────────────────────────────────────────────────────────────┘
 */

console.log("─── Module Wrapper ───\n");
console.log("Node.js wraps each module in:");
console.log(`
(function(exports, require, module, __filename, __dirname) {
    // Your code here
});
`);

console.log("__filename:", __filename?.split('/').slice(-1)[0]);
console.log("__dirname:", __dirname?.split('/').slice(-1)[0]);

// ============================================================================
// Synchronous Loading
// ============================================================================
console.log("\n─── Synchronous Loading ───\n");

console.log("CommonJS require() is SYNCHRONOUS:");
console.log("  - Blocks execution until module loads");
console.log("  - Fine for server (files on disk)");
console.log("  - Problematic for browser (network latency)");
console.log("  - Reason ESM was designed for async loading\n");

// ============================================================================
// CommonJS Patterns
// ============================================================================
console.log("─── CommonJS Patterns ───\n");

// Pattern 1: Export object
const pattern1 = `
// utils.js
module.exports = {
    add: (a, b) => a + b,
    subtract: (a, b) => a - b
};

// Usage
const utils = require('./utils');
utils.add(1, 2);
`;

// Pattern 2: Export function (factory)
const pattern2 = `
// logger.js
module.exports = function(prefix) {
    return {
        log: (msg) => console.log(\`[\${prefix}] \${msg}\`)
    };
};

// Usage
const createLogger = require('./logger');
const logger = createLogger('APP');
logger.log('Hello');
`;

// Pattern 3: Export class
const pattern3 = `
// Database.js
class Database {
    connect() { /* ... */ }
}
module.exports = Database;

// Usage
const Database = require('./Database');
const db = new Database();
`;

// Pattern 4: Export singleton
const pattern4 = `
// config.js
const config = {
    port: process.env.PORT || 3000,
    db: process.env.DATABASE_URL
};
module.exports = config;  // Same object for all requires

// Usage
const config = require('./config');
`;

console.log("Common Patterns:");
console.log("1. Export object (utilities)");
console.log("2. Export factory function");
console.log("3. Export class");
console.log("4. Export singleton");

// ============================================================================
// CommonJS Cheat Sheet
// ============================================================================
console.log("\n╔══════════════════════════════════════════════════════════════════╗");
console.log("║           COMMONJS CHEAT SHEET                                  ║");
console.log("╠══════════════════════════════════════════════════════════════════╣");
console.log("║                                                                  ║");
console.log("║  EXPORTING:                                                      ║");
console.log("║  exports.foo = value          // Named export (shorthand)       ║");
console.log("║  module.exports.foo = value   // Named export                   ║");
console.log("║  module.exports = value       // Default export                 ║");
console.log("║                                                                  ║");
console.log("║  IMPORTING:                                                      ║");
console.log("║  const mod = require('./mod')      // All exports              ║");
console.log("║  const { foo } = require('./mod')  // Destructure              ║");
console.log("║  const foo = require('./mod').foo  // Single export            ║");
console.log("║                                                                  ║");
console.log("║  KEY POINTS:                                                     ║");
console.log("║  • Synchronous loading                                          ║");
console.log("║  • Modules cached after first require                          ║");
console.log("║  • exports is alias to module.exports                          ║");
console.log("║  • Don't reassign exports (breaks reference)                   ║");
console.log("║  • Circular deps get partial exports                           ║");
console.log("║                                                                  ║");
console.log("╚══════════════════════════════════════════════════════════════════╝\n");

module.exports = {
    VERSION: exports.VERSION,
    greet: module.exports.greet,
    add,
    Calculator,
    clearModuleCache
};

console.log("═══ Next: ES Modules (ESM) ═══");
console.log("Run: node deep-dive/javaScript-module-systems/02-esm.js");
