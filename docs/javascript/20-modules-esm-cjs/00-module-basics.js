/**
 * MODULES: 00 - Module Basics
 *
 * ╔════════════════════════════════════════════════════════════════════════════╗
 * ║ WHAT ARE MODULES?                                                          ║
 * ╠════════════════════════════════════════════════════════════════════════════╣
 * ║                                                                            ║
 * ║ Modules are reusable pieces of code that encapsulate implementation        ║
 * ║ details and expose a public API.                                           ║
 * ║                                                                            ║
 * ║ TWO MODULE SYSTEMS IN JAVASCRIPT:                                          ║
 * ║   • CommonJS (CJS) - Node.js original (require/module.exports)             ║
 * ║   • ES Modules (ESM) - Modern standard (import/export)                     ║
 * ║                                                                            ║
 * ╚════════════════════════════════════════════════════════════════════════════╝
 *
 *
 * ┌─────────────────────────────────────────────────────────────────────────────┐
 * │ WHY MODULES EXIST - Real World Justification                                │
 * ├─────────────────────────────────────────────────────────────────────────────┤
 * │                                                                             │
 * │ BEFORE MODULES (The Dark Ages):                                             │
 * │                                                                             │
 * │   <script src="jquery.js"></script>                                         │
 * │   <script src="utils.js"></script>                                          │
 * │   <script src="app.js"></script>                                            │
 * │                                                                             │
 * │   Problems:                                                                 │
 * │   • Global namespace pollution (everything on window)                       │
 * │   • Order-dependent loading                                                 │
 * │   • No explicit dependencies                                                │
 * │   • Name collisions                                                         │
 * │                                                                             │
 * │                                                                             │
 * │ WITH MODULES:                                                               │
 * │                                                                             │
 * │   import { formatDate } from './utils.js';                                  │
 * │   import $ from 'jquery';                                                   │
 * │                                                                             │
 * │   Benefits:                                                                 │
 * │   • Explicit dependencies                                                   │
 * │   • Private scope by default                                                │
 * │   • Static analysis (tree shaking)                                          │
 * │   • Clear API boundaries                                                    │
 * │                                                                             │
 * └─────────────────────────────────────────────────────────────────────────────┘
 */


// ═══════════════════════════════════════════════════════════════════════════════
// MODULE EVOLUTION TIMELINE
// ═══════════════════════════════════════════════════════════════════════════════

/**
 * ┌─────────────────────────────────────────────────────────────────────────────┐
 * │ JAVASCRIPT MODULE HISTORY                                                   │
 * ├─────────────────────────────────────────────────────────────────────────────┤
 * │                                                                             │
 * │   1995-2009: No Module System                                               │
 * │   ────────────────────────────────────────────                              │
 * │   • Everything global                                                       │
 * │   • IIFE pattern for privacy                                                │
 * │                                                                             │
 * │   2009: CommonJS (Node.js)                                                  │
 * │   ────────────────────────────────────────────                              │
 * │   • require() / module.exports                                              │
 * │   • Synchronous loading                                                     │
 * │   • Server-side focused                                                     │
 * │                                                                             │
 * │   2010: AMD (RequireJS)                                                     │
 * │   ────────────────────────────────────────────                              │
 * │   • define() / require()                                                    │
 * │   • Async loading for browsers                                              │
 * │   • Now mostly obsolete                                                     │
 * │                                                                             │
 * │   2015: ES Modules (ES6)                                                    │
 * │   ────────────────────────────────────────────                              │
 * │   • import / export                                                         │
 * │   • Static analysis                                                         │
 * │   • Native browser support (2017+)                                          │
 * │   • Node.js support (2020+)                                                 │
 * │                                                                             │
 * │   TODAY: ESM is the standard, CJS for legacy                                │
 * │                                                                             │
 * └─────────────────────────────────────────────────────────────────────────────┘
 */


// ═══════════════════════════════════════════════════════════════════════════════
// IIFE PATTERN (Pre-Module Era)
// ═══════════════════════════════════════════════════════════════════════════════

console.log('=== IIFE Pattern (Historical) ===\n');

/**
 * ┌─────────────────────────────────────────────────────────────────────────────┐
 * │ IIFE = Immediately Invoked Function Expression                              │
 * │ This was how we "simulated" modules before native support                   │
 * └─────────────────────────────────────────────────────────────────────────────┘
 */

// Before modules: IIFE pattern for encapsulation
const MyModule = (function() {
  // Private variables
  let privateCounter = 0;

  // Private function
  function privateIncrement() {
    privateCounter++;
  }

  // Public API (Revealing Module Pattern)
  return {
    increment() {
      privateIncrement();
      return privateCounter;
    },
    getCount() {
      return privateCounter;
    }
  };
})();

console.log('A: MyModule.increment():', MyModule.increment()); // 1
console.log('B: MyModule.increment():', MyModule.increment()); // 2
console.log('C: MyModule.getCount():', MyModule.getCount());   // 2
console.log('D: MyModule.privateCounter:', MyModule.privateCounter); // undefined


// ═══════════════════════════════════════════════════════════════════════════════
// COMMONJS SYNTAX (Node.js Default)
// ═══════════════════════════════════════════════════════════════════════════════

console.log('\n=== CommonJS Syntax ===\n');

/**
 * ┌─────────────────────────────────────────────────────────────────────────────┐
 * │ COMMONJS (CJS)                                                              │
 * ├─────────────────────────────────────────────────────────────────────────────┤
 * │                                                                             │
 * │   EXPORTING:                                                                │
 * │   ──────────────────────────────────────────────────────────────────        │
 * │                                                                             │
 * │   // Named exports                                                          │
 * │   module.exports.add = (a, b) => a + b;                                     │
 * │   module.exports.subtract = (a, b) => a - b;                                │
 * │                                                                             │
 * │   // OR using exports shorthand                                             │
 * │   exports.add = (a, b) => a + b;                                            │
 * │                                                                             │
 * │   // Default export (replacing entire exports)                              │
 * │   module.exports = { add, subtract };                                       │
 * │                                                                             │
 * │                                                                             │
 * │   IMPORTING:                                                                │
 * │   ──────────────────────────────────────────────────────────────────        │
 * │                                                                             │
 * │   const math = require('./math');      // Import all                        │
 * │   const { add } = require('./math');   // Destructure                       │
 * │                                                                             │
 * │                                                                             │
 * │   CHARACTERISTICS:                                                          │
 * │   • Synchronous loading                                                     │
 * │   • Dynamic (can require() in if blocks)                                    │
 * │   • Returns a copy of exports object                                        │
 * │   • Circular deps: partial exports                                          │
 * │                                                                             │
 * └─────────────────────────────────────────────────────────────────────────────┘
 */

// Simulating CJS-style exports (for demonstration)
const mathModule = {
  add: (a, b) => a + b,
  subtract: (a, b) => a - b,
  PI: 3.14159
};

// Simulating require
const { add, subtract } = mathModule;
console.log('E: add(2, 3):', add(2, 3));         // 5
console.log('F: subtract(5, 2):', subtract(5, 2)); // 3


// ═══════════════════════════════════════════════════════════════════════════════
// ES MODULES SYNTAX (Modern Standard)
// ═══════════════════════════════════════════════════════════════════════════════

console.log('\n=== ES Modules Syntax ===\n');

/**
 * ┌─────────────────────────────────────────────────────────────────────────────┐
 * │ ES MODULES (ESM)                                                            │
 * ├─────────────────────────────────────────────────────────────────────────────┤
 * │                                                                             │
 * │   NAMED EXPORTS:                                                            │
 * │   ──────────────────────────────────────────────────────────────────        │
 * │                                                                             │
 * │   // math.js                                                                │
 * │   export const PI = 3.14159;                                                │
 * │   export function add(a, b) { return a + b; }                               │
 * │   export const subtract = (a, b) => a - b;                                  │
 * │                                                                             │
 * │   // OR export all at once                                                  │
 * │   const PI = 3.14159;                                                       │
 * │   const add = (a, b) => a + b;                                              │
 * │   export { PI, add };                                                       │
 * │                                                                             │
 * │                                                                             │
 * │   DEFAULT EXPORT:                                                           │
 * │   ──────────────────────────────────────────────────────────────────        │
 * │                                                                             │
 * │   // Only ONE default per file                                              │
 * │   export default function Calculator() { ... }                              │
 * │                                                                             │
 * │   // Or                                                                     │
 * │   export default class Calculator { ... }                                   │
 * │                                                                             │
 * │   // Or                                                                     │
 * │   const Calculator = () => { ... };                                         │
 * │   export default Calculator;                                                │
 * │                                                                             │
 * │                                                                             │
 * │   IMPORTING:                                                                │
 * │   ──────────────────────────────────────────────────────────────────        │
 * │                                                                             │
 * │   import { add, PI } from './math.js';       // Named imports               │
 * │   import { add as sum } from './math.js';    // Rename                      │
 * │   import * as math from './math.js';         // Namespace import            │
 * │   import Calculator from './calc.js';        // Default import              │
 * │   import Calc, { helper } from './calc.js';  // Both                        │
 * │                                                                             │
 * └─────────────────────────────────────────────────────────────────────────────┘
 */

console.log('G: ESM syntax examples shown in comments above');


// ═══════════════════════════════════════════════════════════════════════════════
// KEY DIFFERENCES TABLE
// ═══════════════════════════════════════════════════════════════════════════════

/**
 * ┌─────────────────────────────────────────────────────────────────────────────┐
 * │ CJS vs ESM COMPARISON                                                       │
 * ├─────────────────────────────────────────────────────────────────────────────┤
 * │                                                                             │
 * │   ┌──────────────────────┬─────────────────────┬─────────────────────┐      │
 * │   │ Feature              │ CommonJS            │ ES Modules          │      │
 * │   ├──────────────────────┼─────────────────────┼─────────────────────┤      │
 * │   │ Syntax               │ require/exports     │ import/export       │      │
 * │   │ Loading              │ Synchronous         │ Asynchronous        │      │
 * │   │ Evaluation           │ Runtime             │ Parse time          │      │
 * │   │ Tree Shaking         │ Difficult           │ Built-in support    │      │
 * │   │ Circular Deps        │ Partial exports     │ Live bindings       │      │
 * │   │ Dynamic Import       │ Yes (require())     │ import()            │      │
 * │   │ Top-level await      │ No                  │ Yes                 │      │
 * │   │ this value           │ exports object      │ undefined           │      │
 * │   │ __filename/__dirname │ Available           │ Not available       │      │
 * │   │ File Extension       │ .js (default)       │ .mjs or type:module │      │
 * │   └──────────────────────┴─────────────────────┴─────────────────────┘      │
 * │                                                                             │
 * └─────────────────────────────────────────────────────────────────────────────┘
 */

console.log('\n=== Key Differences ===\n');
console.log('H: See the comparison table in comments above');


// ═══════════════════════════════════════════════════════════════════════════════
// FILE EXTENSIONS AND PACKAGE.JSON
// ═══════════════════════════════════════════════════════════════════════════════

/**
 * ┌─────────────────────────────────────────────────────────────────────────────┐
 * │ HOW NODE.JS DETERMINES MODULE TYPE                                          │
 * ├─────────────────────────────────────────────────────────────────────────────┤
 * │                                                                             │
 * │   ┌────────────────────────────────────────────────────────────────────┐    │
 * │   │                                                                    │    │
 * │   │   .mjs file  →  Always ESM                                         │    │
 * │   │   .cjs file  →  Always CommonJS                                    │    │
 * │   │   .js file   →  Check nearest package.json                         │    │
 * │   │                                                                    │    │
 * │   │   package.json:                                                    │    │
 * │   │   {                                                                │    │
 * │   │     "type": "module"     →  .js files are ESM                      │    │
 * │   │     "type": "commonjs"   →  .js files are CJS (default)            │    │
 * │   │   }                                                                │    │
 * │   │                                                                    │    │
 * │   └────────────────────────────────────────────────────────────────────┘    │
 * │                                                                             │
 * │                                                                             │
 * │   BROWSER:                                                                  │
 * │   ──────────────────────────────────────────────────────────────────        │
 * │                                                                             │
 * │   <script type="module" src="app.js"></script>   ← ESM                      │
 * │   <script src="app.js"></script>                 ← Classic (not ESM)        │
 * │                                                                             │
 * └─────────────────────────────────────────────────────────────────────────────┘
 */


/**
 * ┌─────────────────────────────────────────────────────────────────────────────┐
 * │ INTERVIEW ANSWER                                                            │
 * ├─────────────────────────────────────────────────────────────────────────────┤
 * │                                                                             │
 * │ "JavaScript has two main module systems:                                    │
 * │                                                                             │
 * │ CommonJS (CJS):                                                             │
 * │ • Node.js original module system (2009)                                     │
 * │ • Uses require() and module.exports                                         │
 * │ • Synchronous loading, evaluated at runtime                                 │
 * │ • Dynamic: can require() inside conditionals                                │
 * │                                                                             │
 * │ ES Modules (ESM):                                                           │
 * │ • Modern standard (ES6, 2015)                                               │
 * │ • Uses import/export keywords                                               │
 * │ • Statically analyzed at parse time                                         │
 * │ • Enables tree shaking for smaller bundles                                  │
 * │ • Supports top-level await                                                  │
 * │                                                                             │
 * │ Key differences:                                                            │
 * │ • ESM exports are live bindings, CJS exports are copies                     │
 * │ • ESM is async, CJS is sync                                                 │
 * │ • ESM has better tooling support (static analysis)                          │
 * │                                                                             │
 * │ In Node.js, use .mjs extension or set 'type': 'module' in package.json     │
 * │ for ESM. The industry is moving toward ESM as the standard."                │
 * │                                                                             │
 * └─────────────────────────────────────────────────────────────────────────────┘
 *
 *
 * RUN: node docs/20-modules-esm-cjs/00-module-basics.js
 */
