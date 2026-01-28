/**
 * MODULES: 03 - CJS vs ESM Side-by-Side Comparison
 *
 * ╔════════════════════════════════════════════════════════════════════════════╗
 * ║ WHEN TO USE WHICH MODULE SYSTEM?                                           ║
 * ╠════════════════════════════════════════════════════════════════════════════╣
 * ║                                                                            ║
 * ║ ESM: New projects, libraries targeting modern environments, front-end      ║
 * ║ CJS: Legacy Node.js code, some npm packages, build tools                   ║
 * ║                                                                            ║
 * ╚════════════════════════════════════════════════════════════════════════════╝
 */


// ═══════════════════════════════════════════════════════════════════════════════
// SIDE-BY-SIDE SYNTAX COMPARISON
// ═══════════════════════════════════════════════════════════════════════════════

console.log('=== Syntax Comparison ===\n');

/**
 * ┌─────────────────────────────────────────────────────────────────────────────┐
 * │ EXPORTING                                                                   │
 * ├─────────────────────────────────────────────────────────────────────────────┤
 * │                                                                             │
 * │   ┌───────────────────────────────┬───────────────────────────────────┐     │
 * │   │ CommonJS                      │ ES Modules                        │     │
 * │   ├───────────────────────────────┼───────────────────────────────────┤     │
 * │   │ // Named exports              │ // Named exports                  │     │
 * │   │ module.exports.add = fn;      │ export function add() {}          │     │
 * │   │ exports.add = fn;             │ export const add = () => {};      │     │
 * │   │                               │ export { add, sub };              │     │
 * │   ├───────────────────────────────┼───────────────────────────────────┤     │
 * │   │ // Default export             │ // Default export                 │     │
 * │   │ module.exports = Calculator;  │ export default Calculator;        │     │
 * │   ├───────────────────────────────┼───────────────────────────────────┤     │
 * │   │ // Both                       │ // Both                           │     │
 * │   │ module.exports = Calculator;  │ export default Calculator;        │     │
 * │   │ module.exports.helper = fn;   │ export { helper };                │     │
 * │   └───────────────────────────────┴───────────────────────────────────┘     │
 * │                                                                             │
 * └─────────────────────────────────────────────────────────────────────────────┘
 */

/**
 * ┌─────────────────────────────────────────────────────────────────────────────┐
 * │ IMPORTING                                                                   │
 * ├─────────────────────────────────────────────────────────────────────────────┤
 * │                                                                             │
 * │   ┌───────────────────────────────┬───────────────────────────────────┐     │
 * │   │ CommonJS                      │ ES Modules                        │     │
 * │   ├───────────────────────────────┼───────────────────────────────────┤     │
 * │   │ // Entire module              │ // Entire module (namespace)      │     │
 * │   │ const math = require('./m');  │ import * as math from './m.js';   │     │
 * │   ├───────────────────────────────┼───────────────────────────────────┤     │
 * │   │ // Destructure                │ // Named imports                  │     │
 * │   │ const {add} = require('./m'); │ import { add } from './m.js';     │     │
 * │   ├───────────────────────────────┼───────────────────────────────────┤     │
 * │   │ // Default (no special syntax)│ // Default import                 │     │
 * │   │ const Calc = require('./c');  │ import Calc from './c.js';        │     │
 * │   ├───────────────────────────────┼───────────────────────────────────┤     │
 * │   │ // Rename                     │ // Rename                         │     │
 * │   │ const {add:sum} = require()   │ import {add as sum} from './m';   │     │
 * │   ├───────────────────────────────┼───────────────────────────────────┤     │
 * │   │ // Dynamic (any expression)   │ // Dynamic (async)                │     │
 * │   │ const m = require(path);      │ const m = await import(path);     │     │
 * │   └───────────────────────────────┴───────────────────────────────────┘     │
 * │                                                                             │
 * └─────────────────────────────────────────────────────────────────────────────┘
 */

console.log('A: See syntax comparison tables in comments above');


// ═══════════════════════════════════════════════════════════════════════════════
// LOADING BEHAVIOR
// ═══════════════════════════════════════════════════════════════════════════════

console.log('\n=== Loading Behavior ===\n');

/**
 * ┌─────────────────────────────────────────────────────────────────────────────┐
 * │ SYNC vs ASYNC LOADING                                                       │
 * ├─────────────────────────────────────────────────────────────────────────────┤
 * │                                                                             │
 * │   COMMONJS (SYNCHRONOUS):                                                   │
 * │   ──────────────────────────────────────────────────────────────────        │
 * │                                                                             │
 * │   console.log('1: Before require');                                         │
 * │   const math = require('./math');  // BLOCKS until loaded                   │
 * │   console.log('2: After require'); // Only runs after math is ready         │
 * │                                                                             │
 * │   Timeline: ─────1─────[LOAD math]─────2─────►                              │
 * │                                                                             │
 * │                                                                             │
 * │   ES MODULES (ASYNCHRONOUS):                                                │
 * │   ──────────────────────────────────────────────────────────────────        │
 * │                                                                             │
 * │   // Static imports are loaded before code runs                             │
 * │   import { add } from './math.js';                                          │
 * │   console.log('Code runs after all imports ready');                         │
 * │                                                                             │
 * │   // But dynamic imports are async                                          │
 * │   const module = await import('./math.js');                                 │
 * │                                                                             │
 * │   Timeline:                                                                 │
 * │   Parse ─► Fetch all imports ─► Link ─► Execute                             │
 * │                                                                             │
 * └─────────────────────────────────────────────────────────────────────────────┘
 */


// ═══════════════════════════════════════════════════════════════════════════════
// VALUE BINDING COMPARISON
// ═══════════════════════════════════════════════════════════════════════════════

console.log('\n=== Value Binding: Copy vs Live ===\n');

/**
 * ┌─────────────────────────────────────────────────────────────────────────────┐
 * │ COPY vs LIVE BINDING                                                        │
 * ├─────────────────────────────────────────────────────────────────────────────┤
 * │                                                                             │
 * │   COMMONJS (COPY):                                                          │
 * │   ──────────────────────────────────────────────────────────────────        │
 * │                                                                             │
 * │   // counter.js                                                             │
 * │   let count = 0;                                                            │
 * │   module.exports = {                                                        │
 * │     count,                // Copies current value (0)                       │
 * │     increment() { count++; }                                                │
 * │   };                                                                        │
 * │                                                                             │
 * │   // main.js                                                                │
 * │   const { count, increment } = require('./counter');                        │
 * │   console.log(count);   // 0                                                │
 * │   increment();                                                              │
 * │   console.log(count);   // 0 ← STILL 0! (count is a copy)                   │
 * │                                                                             │
 * │                                                                             │
 * │   ES MODULES (LIVE BINDING):                                                │
 * │   ──────────────────────────────────────────────────────────────────        │
 * │                                                                             │
 * │   // counter.js                                                             │
 * │   export let count = 0;                                                     │
 * │   export function increment() { count++; }                                  │
 * │                                                                             │
 * │   // main.js                                                                │
 * │   import { count, increment } from './counter.js';                          │
 * │   console.log(count);   // 0                                                │
 * │   increment();                                                              │
 * │   console.log(count);   // 1 ← UPDATED! (live binding)                      │
 * │                                                                             │
 * └─────────────────────────────────────────────────────────────────────────────┘
 */

// Demonstrating CJS copy behavior
const cjsModule = (function() {
  let count = 0;
  return {
    count,  // Copy of value at creation time
    increment() { count++; console.log('  internal count:', count); }
  };
})();

console.log('B: CJS-style count before:', cjsModule.count);  // 0
cjsModule.increment();  // internal count: 1
console.log('C: CJS-style count after:', cjsModule.count);   // 0 (still!)


// Demonstrating ESM-like live binding (using getters)
const esmModule = (function() {
  let count = 0;
  return {
    get count() { return count; },  // Live binding via getter
    increment() { count++; }
  };
})();

console.log('D: ESM-style count before:', esmModule.count);  // 0
esmModule.increment();
console.log('E: ESM-style count after:', esmModule.count);   // 1 (updated!)


// ═══════════════════════════════════════════════════════════════════════════════
// this VALUE
// ═══════════════════════════════════════════════════════════════════════════════

console.log('\n=== this Value ===\n');

/**
 * ┌─────────────────────────────────────────────────────────────────────────────┐
 * │ this AT TOP LEVEL                                                           │
 * ├─────────────────────────────────────────────────────────────────────────────┤
 * │                                                                             │
 * │   COMMONJS:                                                                 │
 * │   ──────────────────────────────────────────────────────────────────        │
 * │   console.log(this);          // {} (module.exports)                        │
 * │   console.log(this === exports);  // true                                   │
 * │                                                                             │
 * │   ES MODULES:                                                               │
 * │   ──────────────────────────────────────────────────────────────────        │
 * │   console.log(this);          // undefined                                  │
 * │                                                                             │
 * └─────────────────────────────────────────────────────────────────────────────┘
 */

console.log('F: this in CJS module:', this);
console.log('G: this === exports?:', this === exports);


// ═══════════════════════════════════════════════════════════════════════════════
// FEATURE COMPARISON TABLE
// ═══════════════════════════════════════════════════════════════════════════════

/**
 * ┌─────────────────────────────────────────────────────────────────────────────┐
 * │ COMPLETE FEATURE COMPARISON                                                 │
 * ├─────────────────────────────────────────────────────────────────────────────┤
 * │                                                                             │
 * │   ┌──────────────────────────┬─────────────────┬─────────────────────┐      │
 * │   │ Feature                  │ CommonJS        │ ES Modules          │      │
 * │   ├──────────────────────────┼─────────────────┼─────────────────────┤      │
 * │   │ Loading                  │ Synchronous     │ Asynchronous        │      │
 * │   │ Evaluation               │ Runtime         │ Parse time          │      │
 * │   │ Exports                  │ Copy of value   │ Live binding        │      │
 * │   │ Tree Shaking             │ ✗ Difficult     │ ✓ Native support    │      │
 * │   │ Static Analysis          │ ✗ Limited       │ ✓ Full support      │      │
 * │   │ Top-level await          │ ✗ No            │ ✓ Yes               │      │
 * │   │ Conditional import       │ ✓ Yes           │ ✓ import() only     │      │
 * │   │ Circular deps            │ Partial exports │ Live bindings       │      │
 * │   │ this at top level        │ exports object  │ undefined           │      │
 * │   │ __filename/__dirname     │ ✓ Available     │ ✗ Use import.meta   │      │
 * │   │ JSON import              │ ✓ require()     │ ✓ assert (Node 18+) │      │
 * │   │ Browser native           │ ✗ No            │ ✓ Yes               │      │
 * │   │ Node.js default (.js)    │ ✓ Yes           │ ✗ Need config       │      │
 * │   └──────────────────────────┴─────────────────┴─────────────────────┘      │
 * │                                                                             │
 * └─────────────────────────────────────────────────────────────────────────────┘
 */


// ═══════════════════════════════════════════════════════════════════════════════
// INTEROPERABILITY
// ═══════════════════════════════════════════════════════════════════════════════

console.log('\n=== Interoperability ===\n');

/**
 * ┌─────────────────────────────────────────────────────────────────────────────┐
 * │ MIXING CJS AND ESM                                                          │
 * ├─────────────────────────────────────────────────────────────────────────────┤
 * │                                                                             │
 * │   ESM importing CJS:                                                        │
 * │   ──────────────────────────────────────────────────────────────────        │
 * │   // WORKS!                                                                 │
 * │   import cjsModule from './cjs-module.cjs';                                 │
 * │   import { namedExport } from './cjs-module.cjs'; // May not work           │
 * │                                                                             │
 * │   // CJS module.exports becomes default import                              │
 * │   // Named imports may need destructuring from default                      │
 * │                                                                             │
 * │                                                                             │
 * │   CJS importing ESM:                                                        │
 * │   ──────────────────────────────────────────────────────────────────        │
 * │   // require() DOESN'T WORK with ESM!                                       │
 * │   const esm = require('./esm-module.mjs'); // ERROR!                        │
 * │                                                                             │
 * │   // Must use dynamic import()                                              │
 * │   async function loadEsm() {                                                │
 * │     const esm = await import('./esm-module.mjs');                           │
 * │     return esm;                                                             │
 * │   }                                                                         │
 * │                                                                             │
 * └─────────────────────────────────────────────────────────────────────────────┘
 */

console.log('H: Interoperability rules shown in comments above');


// ═══════════════════════════════════════════════════════════════════════════════
// WHEN TO USE WHICH
// ═══════════════════════════════════════════════════════════════════════════════

console.log('\n=== When to Use Which ===\n');

/**
 * ┌─────────────────────────────────────────────────────────────────────────────┐
 * │ DECISION GUIDE                                                              │
 * ├─────────────────────────────────────────────────────────────────────────────┤
 * │                                                                             │
 * │   USE ES MODULES WHEN:                                                      │
 * │   ──────────────────────────────────────────────────────────────────        │
 * │   • Starting a new project                                                  │
 * │   • Building for browsers                                                   │
 * │   • Need tree shaking                                                       │
 * │   • Want modern syntax                                                      │
 * │   • Publishing a library for modern bundlers                                │
 * │   • Using top-level await                                                   │
 * │                                                                             │
 * │   USE COMMONJS WHEN:                                                        │
 * │   ──────────────────────────────────────────────────────────────────        │
 * │   • Maintaining legacy Node.js code                                         │
 * │   • Dependencies require CJS                                                │
 * │   • Using tools that don't support ESM                                      │
 * │   • Need synchronous require()                                              │
 * │   • Writing Node.js CLI tools (simpler setup)                               │
 * │                                                                             │
 * │   DUAL PUBLISH (BOTH):                                                      │
 * │   ──────────────────────────────────────────────────────────────────        │
 * │   • Publishing npm packages for wide compatibility                          │
 * │   • Use "exports" field in package.json                                     │
 * │                                                                             │
 * └─────────────────────────────────────────────────────────────────────────────┘
 */

console.log('I: Decision guide shown in comments above');


/**
 * ┌─────────────────────────────────────────────────────────────────────────────┐
 * │ INTERVIEW ANSWER                                                            │
 * ├─────────────────────────────────────────────────────────────────────────────┤
 * │                                                                             │
 * │ "The key differences between CommonJS and ES Modules are:                   │
 * │                                                                             │
 * │ 1. Loading: CJS is synchronous, ESM is asynchronous                         │
 * │                                                                             │
 * │ 2. Exports: CJS creates copies of values, ESM uses live bindings            │
 * │    - In CJS: changing exported variable doesn't update importers            │
 * │    - In ESM: changes are reflected immediately                              │
 * │                                                                             │
 * │ 3. Static vs Dynamic:                                                       │
 * │    - ESM imports are statically analyzed (enables tree shaking)             │
 * │    - CJS require() is dynamic (can use in if blocks, with variables)        │
 * │                                                                             │
 * │ 4. Interop:                                                                 │
 * │    - ESM can import CJS (module.exports becomes default)                    │
 * │    - CJS cannot require() ESM (must use await import())                     │
 * │                                                                             │
 * │ I prefer ESM for new projects because of tree shaking, top-level await,     │
 * │ and browser compatibility. I use CJS mainly for legacy code or when         │
 * │ dependencies require it."                                                   │
 * │                                                                             │
 * └─────────────────────────────────────────────────────────────────────────────┘
 *
 *
 * RUN: node docs/20-modules-esm-cjs/03-cjs-vs-esm-comparison.js
 */
