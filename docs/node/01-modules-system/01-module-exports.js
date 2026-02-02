/**
 * TOPIC 01: module.exports vs exports
 *
 * ╔════════════════════════════════════════════════════════════════════════════╗
 * ║ THE GOLDEN RULE                                                            ║
 * ╠════════════════════════════════════════════════════════════════════════════╣
 * ║                                                                            ║
 * ║ exports is just a REFERENCE to module.exports:                            ║
 * ║                                                                            ║
 * ║   exports = module.exports = {}   (initially)                             ║
 * ║                                                                            ║
 * ║   exports.foo = 'bar'      ✅ Works (adds to the object)                  ║
 * ║   exports = { foo: 'bar' } ❌ Breaks the reference!                       ║
 * ║   module.exports = { ... } ✅ Always works (this is what require returns) ║
 * ║                                                                            ║
 * ╚════════════════════════════════════════════════════════════════════════════╝
 *
 *
 * ┌─────────────────────────────────────────────────────────────────────────────┐
 * │ STORY TO REMEMBER                                                          │
 * ├─────────────────────────────────────────────────────────────────────────────┤
 * │                                                                             │
 * │  Think of module.exports as a SHIPPING BOX:                                │
 * │                                                                             │
 * │  module.exports = the ACTUAL BOX that gets shipped (require returns this)  │
 * │  exports = a LABEL stuck on the same box                                   │
 * │                                                                             │
 * │  ✅ exports.tool = hammer     → Puts hammer IN the box (works!)            │
 * │  ❌ exports = { tool: saw }   → Moves the label to a NEW box              │
 * │     But the ORIGINAL box ships! New box stays behind. Customer gets {}!    │
 * │                                                                             │
 * │  ✅ module.exports = { ... }  → Replaces the actual box (always works!)   │
 * │                                                                             │
 * │  "exports is just a sticky note. module.exports is what ships."           │
 * │                                                                             │
 * └─────────────────────────────────────────────────────────────────────────────┘
 *
 *
 * ┌─────────────────────────────────────────────────────────────────────────────┐
 * │ VISUAL DIAGRAM                                                             │
 * ├─────────────────────────────────────────────────────────────────────────────┤
 * │                                                                             │
 * │   Initially:                                                                │
 * │     module.exports ──→ { }  ←── exports   (both point to same object)     │
 * │                                                                             │
 * │   exports.x = 1:        (✅ works)                                         │
 * │     module.exports ──→ { x: 1 }  ←── exports                              │
 * │                                                                             │
 * │   exports = { y: 2 }:   (❌ breaks!)                                       │
 * │     module.exports ──→ { x: 1 }          (THIS gets returned)             │
 * │     exports ──→ { y: 2 }                  (THIS is lost!)                 │
 * │                                                                             │
 * │   module.exports = { z: 3 }:  (✅ always works)                            │
 * │     module.exports ──→ { z: 3 }          (THIS gets returned)             │
 * │                                                                             │
 * └─────────────────────────────────────────────────────────────────────────────┘
 */

// Simulating how module.exports works
const simulateModule = () => {
  const module = { exports: {} };
  let exports = module.exports; // exports is a reference

  // ✅ This works - modifying the shared object
  exports.greet = (name) => `Hello ${name}`;
  exports.version = '1.0';

  // What require() returns:
  return module.exports;
};

const mod1 = simulateModule();
console.log('A:', mod1.greet('Node'));
console.log('B:', mod1.version);

// The GOTCHA - reassigning exports breaks the reference
const simulateBroken = () => {
  const module = { exports: {} };
  let exports = module.exports;

  // ❌ This BREAKS - exports no longer points to module.exports
  exports = { broken: true };

  return module.exports; // Returns {} not { broken: true }
};

const mod2 = simulateBroken();
console.log('C:', mod2); // {} - empty!

// Common export patterns
// Pattern 1: Export a single function/class
// module.exports = (x) => x * 2;

// Pattern 2: Export multiple named values
// module.exports = { add, subtract, multiply };

// Pattern 3: Export a class
// module.exports = class MyClass { ... };

// Pattern 4: Using exports shorthand
// exports.add = (a, b) => a + b;
// exports.sub = (a, b) => a - b;

console.log('D:', 'Always use module.exports for single exports');
console.log('E:', 'Use exports.x for multiple named exports');

/**
 * OUTPUT:
 *   A: Hello Node
 *   B: 1.0
 *   C: {}
 *   D: Always use module.exports for single exports
 *   E: Use exports.x for multiple named exports
 *
 *
 * ╔════════════════════════════════════════════════════════════════════════════╗
 * ║ EXPORTS PATTERNS                                                          ║
 * ╠════════════════════════════════════════════════════════════════════════════╣
 * ║                                                                            ║
 * ║   // Single export (function, class, or value)                            ║
 * ║   module.exports = function add(a, b) { return a + b; };                 ║
 * ║                                                                            ║
 * ║   // Multiple exports (named)                                             ║
 * ║   exports.add = (a, b) => a + b;                                         ║
 * ║   exports.sub = (a, b) => a - b;                                         ║
 * ║                                                                            ║
 * ║   // Object export (common)                                               ║
 * ║   module.exports = { add, sub, mul };                                     ║
 * ║                                                                            ║
 * ║   // Class export                                                          ║
 * ║   module.exports = class Database { ... };                                ║
 * ║                                                                            ║
 * ╚════════════════════════════════════════════════════════════════════════════╝
 *
 *
 * ┌─────────────────────────────────────────────────────────────────────────────┐
 * │ INTERVIEW ANSWER                                                            │
 * ├─────────────────────────────────────────────────────────────────────────────┤
 * │                                                                             │
 * │ "exports is a shorthand reference to module.exports. You can use          │
 * │  exports.x to add properties, but if you reassign exports itself          │
 * │  (exports = {...}), it breaks the reference and require() returns {}.     │
 * │  For single exports (function/class), always use module.exports =.        │
 * │  For multiple named exports, exports.name = works fine."                  │
 * │                                                                             │
 * └─────────────────────────────────────────────────────────────────────────────┘
 *
 *
 * RUN: node docs/node/01-modules-system/01-module-exports.js
 */
