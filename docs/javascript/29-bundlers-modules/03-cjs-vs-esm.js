/**
 * BUNDLERS & MODULES: 03 - CJS vs ESM Deep Comparison
 *
 * ONE CONCEPT: Every difference between CommonJS and ES Modules
 */


// =============================================================================
// SIDE-BY-SIDE COMPARISON
// =============================================================================

console.log('=== CJS vs ESM ===\n');

/**
 *   ┌──────────────────────────────────────────────────────────────────────┐
 *   │  COMMONJS vs ES MODULES                                             │
 *   ├────────────────────┬─────────────────────────────────────────────────┤
 *   │  Feature           │  CommonJS (CJS)      │  ES Modules (ESM)       │
 *   ├────────────────────┼──────────────────────┼─────────────────────────┤
 *   │  Syntax            │  require/exports     │  import/export          │
 *   │  Loading           │  Synchronous         │  Asynchronous           │
 *   │  Evaluation        │  Runtime (dynamic)   │  Parse time (static)    │
 *   │  Binding           │  Copy of value       │  Live reference         │
 *   │  Top-level await   │  No                  │  Yes                    │
 *   │  this at top       │  module.exports      │  undefined              │
 *   │  Conditional       │  if(x) require(y)    │  Only import()          │
 *   │  File extension    │  .js or .cjs         │  .mjs or "type":"module"│
 *   │  Tree-shaking      │  No (dynamic)        │  Yes (static)           │
 *   │  Strict mode       │  No (opt-in)         │  Always                 │
 *   │  __filename        │  Yes                 │  No (import.meta.url)   │
 *   │  Circular deps     │  Partial exports     │  Live bindings work     │
 *   │  JSON import       │  require('./a.json') │  assert { type: 'json'} │
 *   │  Where used        │  Node.js primarily   │  Browsers + Node.js     │
 *   └────────────────────┴──────────────────────┴─────────────────────────┘
 *
 */


// =============================================================================
// VALUE COPY vs LIVE BINDING
// =============================================================================

console.log('=== Value Copy vs Live Binding ===\n');

/**
 *   ┌──────────────────────────────────────────────────────────────────────┐
 *   │  THE MOST IMPORTANT DIFFERENCE                                      │
 *   ├──────────────────────────────────────────────────────────────────────┤
 *   │                                                                      │
 *   │  // counter.cjs                    // counter.mjs                    │
 *   │  let count = 0;                    let count = 0;                    │
 *   │  module.exports = {               export { count, inc };            │
 *   │    count,         ← SNAPSHOT      // ↑ live binding                 │
 *   │    inc: () => ++count              const inc = () => ++count;       │
 *   │  };                                                                  │
 *   │                                                                      │
 *   │  // app.cjs                        // app.mjs                        │
 *   │  const m = require('./counter');   import { count, inc } from…      │
 *   │  m.inc();                          inc();                            │
 *   │  console.log(m.count); // 0 !!     console.log(count); // 1 ✓      │
 *   │                                                                      │
 *   │  CJS: m.count was captured at require() time                        │
 *   │  ESM: count is a LIVE binding to the module's variable              │
 *   │                                                                      │
 *   └──────────────────────────────────────────────────────────────────────┘
 *
 */

// CJS simulation
const cjsMod = (() => {
  let count = 0;
  return { count, inc: () => ++count, getCount: () => count };
})();

cjsMod.inc();
console.log('CJS count property:', cjsMod.count);      // 0 — snapshot!
console.log('CJS getCount():', cjsMod.getCount());     // 1 — function reads live

// ESM simulation (using getter)
const esmMod = (() => {
  let _count = 0;
  return {
    get count() { return _count; },  // Live binding!
    inc: () => ++_count
  };
})();

esmMod.inc();
console.log('\nESM count:', esmMod.count);  // 1 — live!


// =============================================================================
// DYNAMIC vs STATIC
// =============================================================================

console.log('\n=== Dynamic vs Static ===\n');

/**
 *   ┌──────────────────────────────────────────────────────────────────────┐
 *   │  CJS: DYNAMIC                        ESM: STATIC                    │
 *   ├──────────────────────────────────────────────────────────────────────┤
 *   │                                                                      │
 *   │  // CJS - all of these work:          // ESM - compile errors:      │
 *   │  const mod = require(varName);        import x from varName; // ✗   │
 *   │  if (cond) require('./a');            if(c) import './a'; // ✗      │
 *   │  require(`./lang/${lang}`);           import `./l/${l}`; // ✗       │
 *   │                                                                      │
 *   │  // ESM dynamic alternative:                                         │
 *   │  const mod = await import(varName);   // ✓ import() function       │
 *   │  if (cond) await import('./a');       // ✓ returns Promise          │
 *   │                                                                      │
 *   │  WHY STATIC MATTERS:                                                 │
 *   │                                                                      │
 *   │  CJS:                                 ESM:                           │
 *   │  ┌──────┐                             ┌──────┐                      │
 *   │  │ Run  │ → discover deps             │Parse │ → know ALL deps     │
 *   │  │ code │   at runtime                │ only │   before running     │
 *   │  └──────┘                             └──────┘                      │
 *   │  Can't optimize ahead of time         Tree-shake, bundle, analyze  │
 *   │                                                                      │
 *   └──────────────────────────────────────────────────────────────────────┘
 *
 */

console.log('CJS: require() is a function — can be called anywhere, any time');
console.log('ESM: import is a declaration — must be top-level, string literal');
console.log('ESM: import() is a function — dynamic, returns Promise');


// =============================================================================
// INTEROP: USING CJS FROM ESM AND VICE VERSA
// =============================================================================

console.log('\n=== Interop ===\n');

/**
 *   ┌──────────────────────────────────────────────────────────────────────┐
 *   │  CJS ↔ ESM INTEROP (Node.js)                                       │
 *   ├──────────────────────────────────────────────────────────────────────┤
 *   │                                                                      │
 *   │  ESM can import CJS:                                                │
 *   │  import cjsMod from './legacy.cjs';    // ✓ Gets module.exports    │
 *   │  import { named } from './legacy.cjs'; // ⚠ May not work          │
 *   │                                       // (Node may not detect names)│
 *   │                                                                      │
 *   │  CJS cannot require() ESM:                                          │
 *   │  const esm = require('./modern.mjs');  // ✗ Error!                 │
 *   │                                                                      │
 *   │  CJS can import() ESM (async):                                      │
 *   │  const esm = await import('./modern.mjs'); // ✓ But async          │
 *   │  // (only in async context)                                          │
 *   │                                                                      │
 *   │  RULE OF THUMB:                                                      │
 *   │  • ESM can consume CJS (import)                                     │
 *   │  • CJS cannot consume ESM synchronously                             │
 *   │  • CJS can use import() (async) for ESM                             │
 *   │                                                                      │
 *   └──────────────────────────────────────────────────────────────────────┘
 *
 */

console.log('ESM → CJS: import cjsMod from "./legacy.cjs"  ✓');
console.log('CJS → ESM: require("./modern.mjs")            ✗');
console.log('CJS → ESM: await import("./modern.mjs")       ✓ (async only)');


// =============================================================================
// DUAL PACKAGE PATTERN (Library Authors)
// =============================================================================

console.log('\n=== Dual Package Pattern ===\n');

/**
 *   ┌──────────────────────────────────────────────────────────────────────┐
 *   │  PUBLISHING FOR BOTH CJS AND ESM                                    │
 *   ├──────────────────────────────────────────────────────────────────────┤
 *   │                                                                      │
 *   │  // package.json                                                     │
 *   │  {                                                                   │
 *   │    "name": "my-lib",                                                │
 *   │    "main": "./dist/index.cjs",        ← CJS entry (require)        │
 *   │    "module": "./dist/index.mjs",      ← ESM entry (bundlers)       │
 *   │    "exports": {                        ← Modern conditional exports │
 *   │      ".": {                                                          │
 *   │        "import": "./dist/index.mjs",  ← import resolves here       │
 *   │        "require": "./dist/index.cjs"  ← require resolves here      │
 *   │      }                                                               │
 *   │    }                                                                 │
 *   │  }                                                                   │
 *   │                                                                      │
 *   │  "exports" field > "module" field > "main" field                    │
 *   │                                                                      │
 *   └──────────────────────────────────────────────────────────────────────┘
 *
 */

console.log('Library authors ship both CJS and ESM:');
console.log('  "main":    CJS entry (Node require)');
console.log('  "module":  ESM entry (bundlers)');
console.log('  "exports": Conditional (modern Node.js)');


// =============================================================================
// CIRCULAR DEPENDENCY HANDLING
// =============================================================================

console.log('\n=== Circular Dependencies ===\n');

/**
 *   ┌──────────────────────────────────────────────────────────────────────┐
 *   │  CJS CIRCULAR DEP:                   ESM CIRCULAR DEP:              │
 *   ├──────────────────────────────────────────────────────────────────────┤
 *   │                                                                      │
 *   │  // a.cjs                             // a.mjs                       │
 *   │  exports.x = 1;                       export let x = 1;             │
 *   │  const b = require('./b');            import { y } from './b.mjs';  │
 *   │  exports.z = 3;                       export const z = 3;           │
 *   │                                                                      │
 *   │  // b.cjs                             // b.mjs                       │
 *   │  const a = require('./a');            import { x, z } from './a';   │
 *   │  // a = { x: 1 }                     // x = 1 (live)               │
 *   │  // a.z is UNDEFINED !!              // z = undefined initially     │
 *   │  exports.y = a.x + 10;              // but becomes 3 after eval    │
 *   │                                       export const y = x + 10;      │
 *   │                                                                      │
 *   │  CJS: Gets partial object (what was set before the cycle)           │
 *   │  ESM: Gets live bindings (TDZ if accessed before initialization)    │
 *   │                                                                      │
 *   └──────────────────────────────────────────────────────────────────────┘
 *
 */

console.log('CJS circular: partial exports (snapshot of what was set so far)');
console.log('ESM circular: live bindings (TDZ error if accessed too early)');
console.log('Best practice: avoid circular dependencies entirely');


// =============================================================================
// INTERVIEW: What to Say
// =============================================================================

/**
 * "The biggest differences between CJS and ESM are:
 *
 * 1. Static vs Dynamic: ESM imports are analyzed at parse time before
 *    any code runs. CJS require() is a runtime function call. This makes
 *    ESM tree-shakeable — bundlers can remove unused exports.
 *
 * 2. Value Copy vs Live Binding: CJS exports a snapshot of the value
 *    at require() time. ESM exports live references — if the exporting
 *    module changes a value, importers see the update.
 *
 * 3. Sync vs Async: CJS is synchronous (blocks until file is loaded).
 *    ESM is asynchronous in browsers. This is why CJS works well for
 *    Node (disk reads are fast) but ESM is better for browsers.
 *
 * 4. Interop: ESM can import CJS, but CJS cannot require() ESM
 *    synchronously. CJS must use dynamic import() to consume ESM.
 *
 * For new projects, I use ESM. For library publishing, I ship dual
 * packages with both CJS and ESM using the exports field in package.json.
 * Tree-shaking and static analysis are the main reasons ESM is preferred
 * in modern frontend tooling."
 */


// RUN: node docs/29-bundlers-modules/03-cjs-vs-esm.js
