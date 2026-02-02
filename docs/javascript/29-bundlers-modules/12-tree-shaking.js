/**
 * BUNDLERS & MODULES: 12 - Tree Shaking
 *
 * ONE CONCEPT: Dead code elimination by removing unused exports
 */


// =============================================================================
// WHAT IS TREE SHAKING?
// =============================================================================

console.log('=== Tree Shaking ===\n');

/**
 *   ┌──────────────────────────────────────────────────────────────────────┐
 *   │  TREE SHAKING: Remove unused exports from the bundle                │
 *   ├──────────────────────────────────────────────────────────────────────┤
 *   │                                                                      │
 *   │  // math.js                                                          │
 *   │  export const add = (a, b) => a + b;                                │
 *   │  export const sub = (a, b) => a - b;    ← NOT imported anywhere    │
 *   │  export const mul = (a, b) => a * b;    ← NOT imported anywhere    │
 *   │                                                                      │
 *   │  // app.js                                                           │
 *   │  import { add } from './math.js';       ← Only uses add            │
 *   │  console.log(add(1, 2));                                            │
 *   │                                                                      │
 *   │  WITHOUT tree shaking: Bundle includes add + sub + mul              │
 *   │  WITH tree shaking:    Bundle includes ONLY add                     │
 *   │                                                                      │
 *   │  Named "tree shaking" because you shake the dependency tree         │
 *   │  and dead (unused) code falls out.                                  │
 *   │                                                                      │
 *   │  ┌─── Tree ───┐        Shake!        ┌─── Tree ───┐               │
 *   │  │    app      │      ────────▶      │    app      │               │
 *   │  │   / | \     │                      │   /         │               │
 *   │  │ add sub mul │                      │ add         │               │
 *   │  └─────────────┘                      └─────────────┘               │
 *   │                                                                      │
 *   └──────────────────────────────────────────────────────────────────────┘
 *
 */


// =============================================================================
// REQUIREMENTS FOR TREE SHAKING
// =============================================================================

console.log('=== Requirements ===\n');

/**
 *   ┌──────────────────────────────────────────────────────────────────────┐
 *   │  TREE SHAKING REQUIRES:                                              │
 *   ├──────────────────────────────────────────────────────────────────────┤
 *   │                                                                      │
 *   │  1. ES MODULES (import/export)                                      │
 *   │     ✓ import { add } from './math';   ← Static, tree-shakeable     │
 *   │     ✗ const { add } = require('./math'); ← Dynamic, NOT shakeable  │
 *   │                                                                      │
 *   │  2. STATIC IMPORTS (known at compile time)                          │
 *   │     ✓ import { add } from './math';   ← Bundler knows what's used │
 *   │     ✗ import(variable)                ← Dynamic, can't shake       │
 *   │                                                                      │
 *   │  3. NO SIDE EFFECTS (or marked as side-effect-free)                │
 *   │     // package.json                                                  │
 *   │     { "sideEffects": false }          ← All files are pure         │
 *   │     { "sideEffects": ["*.css"] }      ← CSS has side effects       │
 *   │                                                                      │
 *   │  4. PRODUCTION MODE                                                  │
 *   │     Webpack only tree-shakes in production mode                     │
 *   │                                                                      │
 *   └──────────────────────────────────────────────────────────────────────┘
 *
 */

console.log('1. Must use ESM (import/export), NOT CJS (require)');
console.log('2. Imports must be static (string literals)');
console.log('3. "sideEffects": false in package.json');
console.log('4. Production mode enabled');


// =============================================================================
// SIDE EFFECTS
// =============================================================================

console.log('\n=== Side Effects ===\n');

/**
 *   ┌──────────────────────────────────────────────────────────────────────┐
 *   │  WHAT ARE SIDE EFFECTS IN MODULES?                                   │
 *   ├──────────────────────────────────────────────────────────────────────┤
 *   │                                                                      │
 *   │  SIDE-EFFECT-FREE (safe to tree-shake):                             │
 *   │  export const add = (a, b) => a + b;                                │
 *   │  ← Only defines a function, no global changes                      │
 *   │                                                                      │
 *   │  HAS SIDE EFFECTS (NOT safe to tree-shake):                         │
 *   │  import './polyfills.js';        ← Modifies global prototypes      │
 *   │  import './styles.css';          ← Injects CSS                     │
 *   │  window.myGlobal = 'hello';      ← Modifies global                │
 *   │  Array.prototype.last = fn;      ← Modifies built-in              │
 *   │                                                                      │
 *   │  If bundler removes a "side-effect" module, those effects are lost! │
 *   │                                                                      │
 *   │  // package.json                                                     │
 *   │  {                                                                   │
 *   │    "sideEffects": false              ← "All my code is pure"       │
 *   │  }                                                                   │
 *   │  {                                                                   │
 *   │    "sideEffects": [                                                  │
 *   │      "*.css",                        ← "CSS has side effects"      │
 *   │      "./src/polyfills.js"            ← "This file has effects"     │
 *   │    ]                                                                 │
 *   │  }                                                                   │
 *   │                                                                      │
 *   └──────────────────────────────────────────────────────────────────────┘
 *
 */

console.log('"sideEffects": false tells bundler: safe to remove unused exports');
console.log('"sideEffects": ["*.css"] keeps CSS imports even if not "used"');


// =============================================================================
// WHAT BREAKS TREE SHAKING
// =============================================================================

console.log('\n=== What Breaks Tree Shaking ===\n');

/**
 *   ┌──────────────────────────────────────────────────────────────────────┐
 *   │  TREE SHAKING KILLERS                                                │
 *   ├──────────────────────────────────────────────────────────────────────┤
 *   │                                                                      │
 *   │  1. CommonJS (require)                                               │
 *   │     const _ = require('lodash');      ← All of lodash included!    │
 *   │     import _ from 'lodash';           ← Same! (CJS under hood)     │
 *   │     import { debounce } from 'lodash-es'; ← ✓ ESM version         │
 *   │                                                                      │
 *   │  2. Re-exporting everything (barrel files)                          │
 *   │     export * from './utils';          ← May pull in everything     │
 *   │     export { specific } from './utils'; ← Better                   │
 *   │                                                                      │
 *   │  3. Side effects in module scope                                    │
 *   │     // utils.js                                                      │
 *   │     console.log('loaded');            ← Side effect!               │
 *   │     export const add = (a,b) => a+b; ← Can't remove module        │
 *   │                                                                      │
 *   │  4. Dynamic property access                                         │
 *   │     import * as utils from './utils';                               │
 *   │     utils[dynamicKey]();              ← Can't determine what's used│
 *   │                                                                      │
 *   │  5. Class with methods                                              │
 *   │     export class Utils {              ← Classes are hard to shake  │
 *   │       static add() {}                   (all methods kept)          │
 *   │       static sub() {}                                               │
 *   │     }                                                                │
 *   │                                                                      │
 *   └──────────────────────────────────────────────────────────────────────┘
 *
 */

console.log('CJS (require) → no tree shaking');
console.log('import * + dynamic access → no tree shaking');
console.log('Module-level side effects → module cant be removed');
console.log('Classes → all methods kept (hard to shake)');
console.log('');
console.log('Best: named imports from ESM packages with sideEffects: false');


// =============================================================================
// PRACTICAL IMPACT
// =============================================================================

console.log('\n=== Practical Impact ===\n');

/**
 *   ┌──────────────────────────────────────────────────────────────────────┐
 *   │  REAL-WORLD EXAMPLE: LODASH                                         │
 *   ├──────────────────────────────────────────────────────────────────────┤
 *   │                                                                      │
 *   │  import _ from 'lodash';              → 71KB (gzipped)             │
 *   │  import { debounce } from 'lodash';   → 71KB (CJS, no shaking!)   │
 *   │  import { debounce } from 'lodash-es';→  3KB (ESM, tree-shaken!)  │
 *   │  import debounce from 'lodash/debounce'; → 3KB (direct import)    │
 *   │                                                                      │
 *   │  RULE: Use ESM versions of libraries when available                 │
 *   │  lodash → lodash-es                                                  │
 *   │  moment → date-fns (ESM, tree-shakeable)                            │
 *   │                                                                      │
 *   └──────────────────────────────────────────────────────────────────────┘
 *
 */

console.log('lodash (CJS):    71KB gzipped — no tree shaking');
console.log('lodash-es (ESM):  3KB for one function — tree-shaken!');
console.log('Always prefer ESM versions of libraries');


// =============================================================================
// INTERVIEW: What to Say
// =============================================================================

/**
 * "Tree shaking is dead code elimination that removes unused exports from
 * the bundle. It requires ES modules because import/export are static —
 * the bundler can analyze at build time which exports are actually imported.
 * CommonJS require() is dynamic, so bundlers can't determine what's used.
 *
 * For tree shaking to work, you need: ESM syntax, production mode, and the
 * sideEffects field in package.json. Setting sideEffects to false tells the
 * bundler that unused modules can be safely removed. CSS and polyfill files
 * have side effects and need to be listed as exceptions.
 *
 * A practical example: importing one function from lodash (CJS) includes
 * the entire 71KB library. Using lodash-es (ESM version) with a named
 * import tree-shakes it down to about 3KB. This is why I always check
 * for ESM versions of dependencies and use BundleAnalyzerPlugin to verify
 * tree shaking is working."
 */


// RUN: node docs/29-bundlers-modules/12-tree-shaking.js
