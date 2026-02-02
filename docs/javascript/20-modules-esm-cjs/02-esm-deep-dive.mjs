/**
 * MODULES: 02 - ES Modules Deep Dive
 *
 * ╔════════════════════════════════════════════════════════════════════════════╗
 * ║ ES MODULES (ESM) - The Modern Standard                                     ║
 * ╠════════════════════════════════════════════════════════════════════════════╣
 * ║                                                                            ║
 * ║ Standardized in ES6 (2015), now the preferred module system.               ║
 * ║ Native support in browsers and Node.js (v12+).                             ║
 * ║                                                                            ║
 * ║ Syntax: import / export                                                    ║
 * ║ File extension: .mjs OR .js with "type": "module" in package.json          ║
 * ║                                                                            ║
 * ╚════════════════════════════════════════════════════════════════════════════╝
 */


// ═══════════════════════════════════════════════════════════════════════════════
// NAMED EXPORTS
// ═══════════════════════════════════════════════════════════════════════════════

console.log('=== Named Exports ===\n');

/**
 * ┌─────────────────────────────────────────────────────────────────────────────┐
 * │ NAMED EXPORTS - Export multiple values by name                              │
 * ├─────────────────────────────────────────────────────────────────────────────┤
 * │                                                                             │
 * │   // INLINE EXPORT (declare and export together)                            │
 * │   export const PI = 3.14159;                                                │
 * │   export function add(a, b) { return a + b; }                               │
 * │   export class Calculator { }                                               │
 * │                                                                             │
 * │   // EXPORT LIST (export separately)                                        │
 * │   const PI = 3.14159;                                                       │
 * │   function add(a, b) { return a + b; }                                      │
 * │   export { PI, add };                                                       │
 * │                                                                             │
 * │   // RENAMED EXPORT                                                         │
 * │   export { add as sum };                                                    │
 * │                                                                             │
 * └─────────────────────────────────────────────────────────────────────────────┘
 */

// Inline exports
export const PI = 3.14159;
export const E = 2.71828;

export function add(a, b) {
  return a + b;
}

export function subtract(a, b) {
  return a - b;
}

// Private (not exported)
function privateHelper() {
  return 'I am private';
}

console.log('A: Named exports defined (PI, E, add, subtract)');


// ═══════════════════════════════════════════════════════════════════════════════
// DEFAULT EXPORTS
// ═══════════════════════════════════════════════════════════════════════════════

console.log('\n=== Default Exports ===\n');

/**
 * ┌─────────────────────────────────────────────────────────────────────────────┐
 * │ DEFAULT EXPORT - One per module, any name when importing                    │
 * ├─────────────────────────────────────────────────────────────────────────────┤
 * │                                                                             │
 * │   // WAYS TO DEFAULT EXPORT:                                                │
 * │                                                                             │
 * │   export default function Calculator() { }                                  │
 * │   export default class Calculator { }                                       │
 * │   export default { ... };                                                   │
 * │                                                                             │
 * │   // Or separate declaration                                                │
 * │   function Calculator() { }                                                 │
 * │   export default Calculator;                                                │
 * │                                                                             │
 * │   // IMPORTING DEFAULT:                                                     │
 * │   import Calculator from './calc.js';      // Any name works                │
 * │   import MyCalc from './calc.js';          // This works too                │
 * │                                                                             │
 * │   ⚠️ Only ONE default export per module                                     │
 * │                                                                             │
 * └─────────────────────────────────────────────────────────────────────────────┘
 */

// Default export (this file has both named AND default)
class Calculator {
  add(a, b) { return a + b; }
  subtract(a, b) { return a - b; }
}

export default Calculator;

console.log('B: Default export defined (Calculator class)');


// ═══════════════════════════════════════════════════════════════════════════════
// IMPORT SYNTAX VARIATIONS
// ═══════════════════════════════════════════════════════════════════════════════

/**
 * ┌─────────────────────────────────────────────────────────────────────────────┐
 * │ IMPORT SYNTAX VARIATIONS                                                    │
 * ├─────────────────────────────────────────────────────────────────────────────┤
 * │                                                                             │
 * │   // Named imports                                                          │
 * │   import { add, subtract } from './math.js';                                │
 * │                                                                             │
 * │   // Renamed import                                                         │
 * │   import { add as sum } from './math.js';                                   │
 * │                                                                             │
 * │   // Default import                                                         │
 * │   import Calculator from './calc.js';                                       │
 * │                                                                             │
 * │   // Default + named                                                        │
 * │   import Calculator, { PI, add } from './math.js';                          │
 * │                                                                             │
 * │   // Namespace import (all exports as object)                               │
 * │   import * as math from './math.js';                                        │
 * │   math.add(1, 2);                                                           │
 * │   math.default; // The default export                                       │
 * │                                                                             │
 * │   // Side-effect import (just run the module)                               │
 * │   import './polyfills.js';                                                  │
 * │                                                                             │
 * └─────────────────────────────────────────────────────────────────────────────┘
 */


// ═══════════════════════════════════════════════════════════════════════════════
// LIVE BINDINGS
// ═══════════════════════════════════════════════════════════════════════════════

console.log('\n=== Live Bindings ===\n');

/**
 * ┌─────────────────────────────────────────────────────────────────────────────┐
 * │ ESM EXPORTS ARE LIVE BINDINGS (NOT COPIES!)                                 │
 * ├─────────────────────────────────────────────────────────────────────────────┤
 * │                                                                             │
 * │   ┌────────────────────────────────────────────────────────────────────┐    │
 * │   │                                                                    │    │
 * │   │   // counter.js                                                    │    │
 * │   │   export let count = 0;                                            │    │
 * │   │   export function increment() { count++; }                         │    │
 * │   │                                                                    │    │
 * │   │   // main.js                                                       │    │
 * │   │   import { count, increment } from './counter.js';                 │    │
 * │   │                                                                    │    │
 * │   │   console.log(count);  // 0                                        │    │
 * │   │   increment();                                                     │    │
 * │   │   console.log(count);  // 1  ← UPDATED!                            │    │
 * │   │                                                                    │    │
 * │   └────────────────────────────────────────────────────────────────────┘    │
 * │                                                                             │
 * │   In CommonJS, you'd get 0 both times (copy of value at require time)       │
 * │                                                                             │
 * │                                                                             │
 * │   ┌────────────────────┬─────────────────────────────────────────────┐      │
 * │   │ CommonJS           │ ES Modules                                  │      │
 * │   ├────────────────────┼─────────────────────────────────────────────┤      │
 * │   │ Exports are COPIES │ Exports are LIVE BINDINGS                   │      │
 * │   │ of values at time  │ that always reflect current                 │      │
 * │   │ of require()       │ value in exporting module                   │      │
 * │   └────────────────────┴─────────────────────────────────────────────┘      │
 * │                                                                             │
 * └─────────────────────────────────────────────────────────────────────────────┘
 */

// Demonstrating live bindings
export let counter = 0;

export function increment() {
  counter++;
  console.log('C: counter incremented to:', counter);
}

// Note: To see live binding in action, import this module and call increment()

console.log('D: Live bindings example defined');


// ═══════════════════════════════════════════════════════════════════════════════
// STATIC ANALYSIS & TREE SHAKING
// ═══════════════════════════════════════════════════════════════════════════════

console.log('\n=== Static Analysis & Tree Shaking ===\n');

/**
 * ┌─────────────────────────────────────────────────────────────────────────────┐
 * │ ESM ENABLES TREE SHAKING                                                    │
 * ├─────────────────────────────────────────────────────────────────────────────┤
 * │                                                                             │
 * │   WHAT IS TREE SHAKING?                                                     │
 * │   Removing unused code from the final bundle.                               │
 * │                                                                             │
 * │   ┌────────────────────────────────────────────────────────────────────┐    │
 * │   │                                                                    │    │
 * │   │   // utils.js                                                      │    │
 * │   │   export function usedFn() { }     // Used                         │    │
 * │   │   export function unusedFn() { }   // NOT used                     │    │
 * │   │                                                                    │    │
 * │   │   // main.js                                                       │    │
 * │   │   import { usedFn } from './utils.js';                             │    │
 * │   │                                                                    │    │
 * │   │   AFTER BUNDLING:                                                  │    │
 * │   │   • usedFn() → INCLUDED                                            │    │
 * │   │   • unusedFn() → REMOVED (tree shaken)                             │    │
 * │   │                                                                    │    │
 * │   └────────────────────────────────────────────────────────────────────┘    │
 * │                                                                             │
 * │   WHY ESM ENABLES THIS:                                                     │
 * │   • Imports/exports are STATIC (determined at parse time)                   │
 * │   • Bundlers can analyze what's used before running code                    │
 * │   • CJS require() is dynamic - can't know what's used until runtime         │
 * │                                                                             │
 * └─────────────────────────────────────────────────────────────────────────────┘
 */

// These exports can be tree-shaken if unused
export function utilityA() {
  return 'A';
}

export function utilityB() {
  return 'B';
}

export function utilityC() {
  return 'C';
}

console.log('E: Multiple exports defined (bundlers can tree-shake unused ones)');


// ═══════════════════════════════════════════════════════════════════════════════
// DYNAMIC import()
// ═══════════════════════════════════════════════════════════════════════════════

console.log('\n=== Dynamic import() ===\n');

/**
 * ┌─────────────────────────────────────────────────────────────────────────────┐
 * │ DYNAMIC IMPORTS - Load modules at runtime                                   │
 * ├─────────────────────────────────────────────────────────────────────────────┤
 * │                                                                             │
 * │   // import() returns a Promise!                                            │
 * │                                                                             │
 * │   // Conditional loading                                                    │
 * │   if (needsFeature) {                                                       │
 * │     const module = await import('./feature.js');                            │
 * │   }                                                                         │
 * │                                                                             │
 * │   // Dynamic path                                                           │
 * │   const locale = await import(`./locales/${lang}.js`);                      │
 * │                                                                             │
 * │   // Code splitting (lazy loading)                                          │
 * │   button.onclick = async () => {                                            │
 * │     const { heavyFunction } = await import('./heavy.js');                   │
 * │     heavyFunction();                                                        │
 * │   };                                                                        │
 * │                                                                             │
 * │   // Accessing default and named exports                                    │
 * │   const module = await import('./module.js');                               │
 * │   module.default;      // Default export                                    │
 * │   module.namedExport;  // Named export                                      │
 * │                                                                             │
 * └─────────────────────────────────────────────────────────────────────────────┘
 */

// Dynamic import example
async function loadModule() {
  // This would dynamically import a module
  // const { add } = await import('./math.js');
  console.log('F: Dynamic import() would load module asynchronously');
}

loadModule();


// ═══════════════════════════════════════════════════════════════════════════════
// TOP-LEVEL AWAIT
// ═══════════════════════════════════════════════════════════════════════════════

console.log('\n=== Top-Level Await ===\n');

/**
 * ┌─────────────────────────────────────────────────────────────────────────────┐
 * │ TOP-LEVEL AWAIT - Only in ESM!                                              │
 * ├─────────────────────────────────────────────────────────────────────────────┤
 * │                                                                             │
 * │   // config.js (ESM)                                                        │
 * │   const response = await fetch('/api/config');                              │
 * │   export const config = await response.json();                              │
 * │                                                                             │
 * │   // main.js                                                                │
 * │   import { config } from './config.js';                                     │
 * │   // config is READY to use (module waited for fetch)                       │
 * │                                                                             │
 * │                                                                             │
 * │   BEHAVIOR:                                                                 │
 * │   • Module with top-level await becomes async                               │
 * │   • Importers wait for it to complete                                       │
 * │   • Import graph is still resolved statically                               │
 * │                                                                             │
 * │   ⚠️ Use carefully - can delay app startup!                                 │
 * │                                                                             │
 * └─────────────────────────────────────────────────────────────────────────────┘
 */

// Top-level await example
const data = await Promise.resolve({ loaded: true });
console.log('G: Top-level await result:', data);


// ═══════════════════════════════════════════════════════════════════════════════
// import.meta
// ═══════════════════════════════════════════════════════════════════════════════

console.log('\n=== import.meta ===\n');

/**
 * ┌─────────────────────────────────────────────────────────────────────────────┐
 * │ import.meta - Module metadata                                               │
 * ├─────────────────────────────────────────────────────────────────────────────┤
 * │                                                                             │
 * │   import.meta.url                                                           │
 * │   → Full URL of the current module                                          │
 * │   → file:///home/user/project/src/utils.js (Node.js)                        │
 * │   → https://example.com/js/utils.js (Browser)                               │
 * │                                                                             │
 * │   REPLACING __dirname and __filename:                                       │
 * │   ──────────────────────────────────────────────────────────────────        │
 * │                                                                             │
 * │   import { fileURLToPath } from 'url';                                      │
 * │   import { dirname } from 'path';                                           │
 * │                                                                             │
 * │   const __filename = fileURLToPath(import.meta.url);                        │
 * │   const __dirname = dirname(__filename);                                    │
 * │                                                                             │
 * └─────────────────────────────────────────────────────────────────────────────┘
 */

console.log('H: import.meta.url:', import.meta.url);

// Getting __dirname equivalent in ESM
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

console.log('I: ESM __filename:', __filename);
console.log('J: ESM __dirname:', __dirname);


/**
 * ┌─────────────────────────────────────────────────────────────────────────────┐
 * │ INTERVIEW ANSWER                                                            │
 * ├─────────────────────────────────────────────────────────────────────────────┤
 * │                                                                             │
 * │ "ES Modules are the modern JavaScript module standard with key features:    │
 * │                                                                             │
 * │ 1. Static imports: Analyzed at parse time, enabling tree shaking            │
 * │    → import { add } from './math.js';                                       │
 * │                                                                             │
 * │ 2. Live bindings: Exports reflect current values, not copies                │
 * │    → Changes in exporting module are visible to importers                   │
 * │                                                                             │
 * │ 3. Asynchronous: Modules load without blocking                              │
 * │                                                                             │
 * │ 4. Top-level await: Can use await outside async functions                   │
 * │    → const data = await fetch('/api');                                      │
 * │                                                                             │
 * │ 5. Dynamic import(): Load modules conditionally at runtime                  │
 * │    → const mod = await import('./module.js');                               │
 * │                                                                             │
 * │ 6. Named and default exports:                                               │
 * │    → export const x = 1; export default class X { }                         │
 * │                                                                             │
 * │ ESM enables smaller bundles through tree shaking, which removes unused      │
 * │ exports. This is possible because import/export are static and analyzed     │
 * │ before the code runs, unlike CommonJS require() which is dynamic."          │
 * │                                                                             │
 * └─────────────────────────────────────────────────────────────────────────────┘
 *
 *
 * RUN: node docs/20-modules-esm-cjs/02-esm-deep-dive.mjs
 *
 * NOTE: This file uses .mjs extension to run as ES Module
 */
