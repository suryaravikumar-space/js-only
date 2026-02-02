/**
 * TOPIC 02: ES Modules (import/export)
 *
 * ╔════════════════════════════════════════════════════════════════════════════╗
 * ║ THE GOLDEN RULE                                                            ║
 * ╠════════════════════════════════════════════════════════════════════════════╣
 * ║                                                                            ║
 * ║ ES Modules (ESM) = modern, standard JavaScript module system:             ║
 * ║                                                                            ║
 * ║   import x from './file.js'        → default import                       ║
 * ║   import { x } from './file.js'    → named import                         ║
 * ║   export default x                 → default export                       ║
 * ║   export const x = 1               → named export                        ║
 * ║                                                                            ║
 * ║ Enable in Node: "type": "module" in package.json OR use .mjs extension   ║
 * ║                                                                            ║
 * ╚════════════════════════════════════════════════════════════════════════════╝
 *
 *
 * ┌─────────────────────────────────────────────────────────────────────────────┐
 * │ STORY TO REMEMBER                                                          │
 * ├─────────────────────────────────────────────────────────────────────────────┤
 * │                                                                             │
 * │  CJS vs ESM is like LANDLINE vs SMARTPHONE:                                │
 * │                                                                             │
 * │  CommonJS (Landline):                                                      │
 * │    - Dial and WAIT for connection (synchronous)                            │
 * │    - Can only call one number at a time (dynamic, runtime)                │
 * │    - Old but reliable, works everywhere in Node                           │
 * │                                                                             │
 * │  ES Modules (Smartphone):                                                  │
 * │    - Contacts loaded at startup (static, compile-time)                    │
 * │    - Can text while calling (async, top-level await)                       │
 * │    - Auto-cleans unused contacts (tree-shaking)                           │
 * │    - The future standard, works in browser + Node                         │
 * │                                                                             │
 * │  "CJS = old reliable. ESM = modern standard. Both deliver messages."      │
 * │                                                                             │
 * └─────────────────────────────────────────────────────────────────────────────┘
 *
 *
 * ┌─────────────────────────────────────────────────────────────────────────────┐
 * │ VISUAL DIAGRAM                                                             │
 * ├─────────────────────────────────────────────────────────────────────────────┤
 * │                                                                             │
 * │   CommonJS Flow:                                                            │
 * │     require() ──→ find file ──→ execute ──→ return module.exports          │
 * │     (blocks until done - synchronous)                                      │
 * │                                                                             │
 * │   ESM Flow:                                                                │
 * │     import ──→ parse (static analysis) ──→ fetch ──→ link ──→ evaluate    │
 * │     (async, can tree-shake unused exports)                                 │
 * │                                                                             │
 * │   ┌── CJS ──────────┐          ┌── ESM ──────────────┐                    │
 * │   │ require()       │          │ import              │                     │
 * │   │ module.exports  │          │ export default      │                     │
 * │   │ .js (default)   │          │ .mjs / "type":"mod" │                     │
 * │   │ sync, dynamic   │          │ async, static       │                     │
 * │   │ no tree-shake   │          │ tree-shakeable       │                    │
 * │   └─────────────────┘          └─────────────────────┘                    │
 * │                                                                             │
 * └─────────────────────────────────────────────────────────────────────────────┘
 */

// NOTE: This file uses CommonJS since it's a .js file without "type":"module"
// Below shows ESM syntax as comments + explanation

console.log('A:', 'ESM uses import/export (static, async)');
console.log('B:', 'CJS uses require/module.exports (dynamic, sync)');

// ESM Syntax (use in .mjs files or with "type":"module"):
//
// Named exports:
//   export const add = (a, b) => a + b;
//   export const sub = (a, b) => a - b;
//
// Default export:
//   export default class MyClass { }
//
// Named import:
//   import { add, sub } from './math.js';
//
// Default import:
//   import MyClass from './MyClass.js';
//
// Rename import:
//   import { add as sum } from './math.js';
//
// Import all:
//   import * as math from './math.js';

// Key differences
const differences = [
  { feature: 'Loading', cjs: 'Synchronous', esm: 'Asynchronous' },
  { feature: 'Parsing', cjs: 'Runtime', esm: 'Static (compile-time)' },
  { feature: 'Top-level await', cjs: 'No', esm: 'Yes' },
  { feature: 'Tree-shaking', cjs: 'No', esm: 'Yes' },
  { feature: 'this', cjs: 'module.exports', esm: 'undefined' },
];

console.log('C:');
console.table(differences);

// Dynamic import() works in both CJS and ESM
const loadModule = async () => {
  const path = await import('path');
  console.log('D:', path.default.join('a', 'b'));
};
loadModule();

/**
 * OUTPUT:
 *   A: ESM uses import/export (static, async)
 *   B: CJS uses require/module.exports (dynamic, sync)
 *   C: (table of differences)
 *   D: a/b
 *
 *
 * ╔════════════════════════════════════════════════════════════════════════════╗
 * ║ CJS vs ESM COMPARISON                                                     ║
 * ╠════════════════════════════════════════════════════════════════════════════╣
 * ║                                                                            ║
 * ║   CommonJS (CJS)              ES Modules (ESM)                            ║
 * ║   ──────────────              ────────────────                             ║
 * ║   require()                   import                                       ║
 * ║   module.exports              export default                               ║
 * ║   exports.x                   export { x }                                ║
 * ║   Synchronous                 Asynchronous                                 ║
 * ║   Dynamic (runtime)           Static (compile-time)                        ║
 * ║   .js default                 .mjs or "type":"module"                      ║
 * ║   No tree-shaking             Tree-shakeable                               ║
 * ║   No top-level await          Top-level await ✅                           ║
 * ║                                                                            ║
 * ╚════════════════════════════════════════════════════════════════════════════╝
 *
 *
 * ┌─────────────────────────────────────────────────────────────────────────────┐
 * │ INTERVIEW ANSWER                                                            │
 * ├─────────────────────────────────────────────────────────────────────────────┤
 * │                                                                             │
 * │ "ES Modules are the standard JS module system. Unlike CommonJS (sync,     │
 * │  dynamic), ESM is async and statically analyzed at compile time, enabling │
 * │  tree-shaking. In Node, enable with 'type':'module' in package.json or    │
 * │  .mjs extension. ESM supports top-level await. Use dynamic import() for   │
 * │  conditional loading in both systems."                                     │
 * │                                                                             │
 * └─────────────────────────────────────────────────────────────────────────────┘
 *
 *
 * RUN: node docs/node/01-modules-system/02-esm-import-export.js
 */
