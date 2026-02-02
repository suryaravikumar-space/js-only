/**
 * MODULES: 05 - Tree Shaking
 *
 * ╔════════════════════════════════════════════════════════════════════════════╗
 * ║ TREE SHAKING - Dead Code Elimination                                       ║
 * ╠════════════════════════════════════════════════════════════════════════════╣
 * ║                                                                            ║
 * ║ Tree shaking removes unused exports from the final bundle.                 ║
 * ║ It "shakes" the dependency tree and dead code "falls off".                 ║
 * ║                                                                            ║
 * ║ REQUIREMENT: ES Modules (static imports/exports)                           ║
 * ║ TOOLS: Webpack, Rollup, esbuild, Vite                                      ║
 * ║                                                                            ║
 * ╚════════════════════════════════════════════════════════════════════════════╝
 */


// ═══════════════════════════════════════════════════════════════════════════════
// WHAT IS TREE SHAKING?
// ═══════════════════════════════════════════════════════════════════════════════

console.log('=== What is Tree Shaking? ===\n');

/**
 * ┌─────────────────────────────────────────────────────────────────────────────┐
 * │ TREE SHAKING VISUALIZATION                                                  │
 * ├─────────────────────────────────────────────────────────────────────────────┤
 * │                                                                             │
 * │   // utils.js                                                               │
 * │   export function used() { }     // 1 KB                                    │
 * │   export function unused() { }   // 50 KB                                   │
 * │                                                                             │
 * │   // app.js                                                                 │
 * │   import { used } from './utils.js';  // Only imports 'used'                │
 * │                                                                             │
 * │                                                                             │
 * │   WITHOUT TREE SHAKING:                                                     │
 * │   ┌────────────────────────────────────────┐                                │
 * │   │  Bundle contains:                      │                                │
 * │   │  ✓ used()      (1 KB)                  │                                │
 * │   │  ✓ unused()    (50 KB)  ← INCLUDED!    │                                │
 * │   │                                        │                                │
 * │   │  Total: 51 KB                          │                                │
 * │   └────────────────────────────────────────┘                                │
 * │                                                                             │
 * │                                                                             │
 * │   WITH TREE SHAKING:                                                        │
 * │   ┌────────────────────────────────────────┐                                │
 * │   │  Bundle contains:                      │                                │
 * │   │  ✓ used()      (1 KB)                  │                                │
 * │   │  ✗ unused()    (removed)  ← SHAKEN!    │                                │
 * │   │                                        │                                │
 * │   │  Total: 1 KB                           │                                │
 * │   └────────────────────────────────────────┘                                │
 * │                                                                             │
 * └─────────────────────────────────────────────────────────────────────────────┘
 */

console.log('A: Tree shaking removes unused code from bundles');


// ═══════════════════════════════════════════════════════════════════════════════
// WHY ESM IS REQUIRED
// ═══════════════════════════════════════════════════════════════════════════════

console.log('\n=== Why ES Modules? ===\n');

/**
 * ┌─────────────────────────────────────────────────────────────────────────────┐
 * │ STATIC vs DYNAMIC IMPORTS                                                   │
 * ├─────────────────────────────────────────────────────────────────────────────┤
 * │                                                                             │
 * │   ES MODULES (STATIC):                                                      │
 * │   ──────────────────────────────────────────────────────────────────        │
 * │                                                                             │
 * │   import { add } from './math.js';                                          │
 * │                                                                             │
 * │   • Import statement is at TOP LEVEL                                        │
 * │   • Import path is a STRING LITERAL                                         │
 * │   • Bundler knows EXACTLY what's imported BEFORE running code               │
 * │   • Can analyze at BUILD TIME                                               │
 * │                                                                             │
 * │                                                                             │
 * │   COMMONJS (DYNAMIC):                                                       │
 * │   ──────────────────────────────────────────────────────────────────        │
 * │                                                                             │
 * │   const math = require('./math');                                           │
 * │   const { add } = require(condition ? './a' : './b');  // Dynamic!          │
 * │                                                                             │
 * │   if (someCondition) {                                                      │
 * │     const plugin = require('./plugin');  // Conditional!                    │
 * │   }                                                                         │
 * │                                                                             │
 * │   • require() can be ANYWHERE                                               │
 * │   • Path can be COMPUTED                                                    │
 * │   • Bundler CAN'T know what's needed until code runs                        │
 * │   • Must include EVERYTHING (no tree shaking)                               │
 * │                                                                             │
 * └─────────────────────────────────────────────────────────────────────────────┘
 */

console.log('B: ESM imports are analyzed at parse time, enabling dead code detection');


// ═══════════════════════════════════════════════════════════════════════════════
// TREE-SHAKEABLE CODE
// ═══════════════════════════════════════════════════════════════════════════════

console.log('\n=== Writing Tree-Shakeable Code ===\n');

/**
 * ┌─────────────────────────────────────────────────────────────────────────────┐
 * │ TREE-SHAKEABLE PATTERNS                                                     │
 * ├─────────────────────────────────────────────────────────────────────────────┤
 * │                                                                             │
 * │   ✓ GOOD - Named exports (tree-shakeable)                                   │
 * │   ──────────────────────────────────────────────────────────────────        │
 * │                                                                             │
 * │   export function add(a, b) { return a + b; }                               │
 * │   export function subtract(a, b) { return a - b; }                          │
 * │   export function multiply(a, b) { return a * b; }                          │
 * │                                                                             │
 * │   // Consumer imports only what's needed                                    │
 * │   import { add } from './math.js';  // subtract, multiply removed           │
 * │                                                                             │
 * │                                                                             │
 * │   ✗ BAD - Object export (NOT tree-shakeable)                                │
 * │   ──────────────────────────────────────────────────────────────────        │
 * │                                                                             │
 * │   export default {                                                          │
 * │     add: (a, b) => a + b,                                                   │
 * │     subtract: (a, b) => a - b,                                              │
 * │     multiply: (a, b) => a * b                                               │
 * │   };                                                                        │
 * │                                                                             │
 * │   // Consumer                                                               │
 * │   import math from './math.js';                                             │
 * │   math.add(1, 2);  // Entire object included!                               │
 * │                                                                             │
 * │                                                                             │
 * │   ✗ BAD - Class with methods (NOT tree-shakeable)                           │
 * │   ──────────────────────────────────────────────────────────────────        │
 * │                                                                             │
 * │   export class Utils {                                                      │
 * │     static add(a, b) { return a + b; }                                      │
 * │     static subtract(a, b) { return a - b; }                                 │
 * │   }                                                                         │
 * │                                                                             │
 * │   // All methods included even if only one is used                          │
 * │                                                                             │
 * └─────────────────────────────────────────────────────────────────────────────┘
 */

// GOOD: Named exports
export function add(a, b) { return a + b; }
export function subtract(a, b) { return a - b; }
export function multiply(a, b) { return a * b; }
export function divide(a, b) { return a / b; }

console.log('C: Named exports can be individually tree-shaken');


// ═══════════════════════════════════════════════════════════════════════════════
// SIDE EFFECTS
// ═══════════════════════════════════════════════════════════════════════════════

console.log('\n=== Side Effects & sideEffects Field ===\n');

/**
 * ┌─────────────────────────────────────────────────────────────────────────────┐
 * │ SIDE EFFECTS PREVENT TREE SHAKING                                           │
 * ├─────────────────────────────────────────────────────────────────────────────┤
 * │                                                                             │
 * │   WHAT IS A SIDE EFFECT?                                                    │
 * │   Code that does something OTHER than export values.                        │
 * │                                                                             │
 * │   ┌────────────────────────────────────────────────────────────────────┐    │
 * │   │                                                                    │    │
 * │   │   // polyfill.js - Has side effects!                               │    │
 * │   │   if (!Array.prototype.flat) {                                     │    │
 * │   │     Array.prototype.flat = function() { ... };                     │    │
 * │   │   }                                                                │    │
 * │   │   export {};  // No exports, but modifies global!                  │    │
 * │   │                                                                    │    │
 * │   │   // analytics.js - Has side effects!                              │    │
 * │   │   window.analytics = new Analytics();                              │    │
 * │   │   export const track = () => { ... };                              │    │
 * │   │                                                                    │    │
 * │   │   // styles.js - Has side effects!                                 │    │
 * │   │   import './styles.css';  // CSS injection                         │    │
 * │   │                                                                    │    │
 * │   └────────────────────────────────────────────────────────────────────┘    │
 * │                                                                             │
 * │   Bundler must include side-effect code even if exports unused!             │
 * │                                                                             │
 * │                                                                             │
 * │   PACKAGE.JSON "sideEffects" FIELD:                                         │
 * │   ──────────────────────────────────────────────────────────────────        │
 * │                                                                             │
 * │   {                                                                         │
 * │     "sideEffects": false           // No side effects (fully shakeable)     │
 * │   }                                                                         │
 * │                                                                             │
 * │   {                                                                         │
 * │     "sideEffects": [               // Only these files have side effects    │
 * │       "*.css",                                                              │
 * │       "./src/polyfills.js"                                                  │
 * │     ]                                                                       │
 * │   }                                                                         │
 * │                                                                             │
 * └─────────────────────────────────────────────────────────────────────────────┘
 */

console.log('D: Set "sideEffects": false in package.json for optimal tree shaking');


// ═══════════════════════════════════════════════════════════════════════════════
// RE-EXPORTS AND BARREL FILES
// ═══════════════════════════════════════════════════════════════════════════════

console.log('\n=== Re-exports & Barrel Files ===\n');

/**
 * ┌─────────────────────────────────────────────────────────────────────────────┐
 * │ BARREL FILES CAN BREAK TREE SHAKING                                         │
 * ├─────────────────────────────────────────────────────────────────────────────┤
 * │                                                                             │
 * │   // index.js (barrel file)                                                 │
 * │   export { Button } from './Button';                                        │
 * │   export { Modal } from './Modal';                                          │
 * │   export { Form } from './Form';                                            │
 * │                                                                             │
 * │                                                                             │
 * │   ✗ BAD IMPORT (may include everything):                                    │
 * │   ──────────────────────────────────────────────────────────────────        │
 * │                                                                             │
 * │   import { Button } from './components';                                    │
 * │   // Some bundlers may include Modal, Form too!                             │
 * │                                                                             │
 * │                                                                             │
 * │   ✓ GOOD IMPORT (direct path):                                              │
 * │   ──────────────────────────────────────────────────────────────────        │
 * │                                                                             │
 * │   import { Button } from './components/Button';                             │
 * │   // Only Button code included                                              │
 * │                                                                             │
 * │                                                                             │
 * │   MODERN BUNDLERS:                                                          │
 * │   Webpack 5, Rollup, esbuild handle barrel files well now.                  │
 * │   But deep imports are still safer for older bundlers.                      │
 * │                                                                             │
 * └─────────────────────────────────────────────────────────────────────────────┘
 */

// Re-export example (for demonstration)
// export { add, subtract } from './math.js';
// export { formatDate } from './date.js';

console.log('E: Direct imports are safer than barrel imports for tree shaking');


// ═══════════════════════════════════════════════════════════════════════════════
// VERIFYING TREE SHAKING
// ═══════════════════════════════════════════════════════════════════════════════

console.log('\n=== How to Verify Tree Shaking ===\n');

/**
 * ┌─────────────────────────────────────────────────────────────────────────────┐
 * │ VERIFY YOUR BUNDLE IS TREE-SHAKEN                                           │
 * ├─────────────────────────────────────────────────────────────────────────────┤
 * │                                                                             │
 * │   1. BUNDLE ANALYZER:                                                       │
 * │   ──────────────────────────────────────────────────────────────────        │
 * │                                                                             │
 * │   # Webpack                                                                 │
 * │   npm install webpack-bundle-analyzer                                       │
 * │                                                                             │
 * │   # Vite                                                                    │
 * │   npm install rollup-plugin-visualizer                                      │
 * │                                                                             │
 * │   Visualizes what's in your bundle!                                         │
 * │                                                                             │
 * │                                                                             │
 * │   2. SEARCH BUNDLE OUTPUT:                                                  │
 * │   ──────────────────────────────────────────────────────────────────        │
 * │                                                                             │
 * │   # Add unique string to unused export                                      │
 * │   export function unusedFn() {                                              │
 * │     console.log('UNIQUE_MARKER_12345');                                     │
 * │   }                                                                         │
 * │                                                                             │
 * │   # Search bundle for marker                                                │
 * │   grep "UNIQUE_MARKER_12345" dist/bundle.js                                 │
 * │   # If found → not tree-shaken!                                             │
 * │                                                                             │
 * │                                                                             │
 * │   3. SOURCE MAP EXPLORER:                                                   │
 * │   ──────────────────────────────────────────────────────────────────        │
 * │                                                                             │
 * │   npx source-map-explorer dist/bundle.js                                    │
 * │                                                                             │
 * └─────────────────────────────────────────────────────────────────────────────┘
 */

console.log('F: Use bundle analyzer tools to verify tree shaking');


// ═══════════════════════════════════════════════════════════════════════════════
// LIBRARY AUTHOR BEST PRACTICES
// ═══════════════════════════════════════════════════════════════════════════════

console.log('\n=== Library Author Best Practices ===\n');

/**
 * ┌─────────────────────────────────────────────────────────────────────────────┐
 * │ MAKING YOUR LIBRARY TREE-SHAKEABLE                                          │
 * ├─────────────────────────────────────────────────────────────────────────────┤
 * │                                                                             │
 * │   1. Use named exports, not default object export                           │
 * │                                                                             │
 * │   2. Set "sideEffects": false in package.json                               │
 * │                                                                             │
 * │   3. Provide ESM build:                                                     │
 * │      {                                                                      │
 * │        "main": "./dist/index.cjs",      // CJS                              │
 * │        "module": "./dist/index.mjs",    // ESM                              │
 * │        "exports": {                                                         │
 * │          "import": "./dist/index.mjs",                                      │
 * │          "require": "./dist/index.cjs"                                      │
 * │        }                                                                    │
 * │      }                                                                      │
 * │                                                                             │
 * │   4. Avoid side effects in module scope                                     │
 * │                                                                             │
 * │   5. Don't export entire objects/classes if possible                        │
 * │                                                                             │
 * │   6. Consider providing separate entry points:                              │
 * │      import { Button } from 'ui-lib/Button';                                │
 * │      import { Modal } from 'ui-lib/Modal';                                  │
 * │                                                                             │
 * └─────────────────────────────────────────────────────────────────────────────┘
 */

console.log('G: See library best practices in comments above');


/**
 * ┌─────────────────────────────────────────────────────────────────────────────┐
 * │ INTERVIEW ANSWER                                                            │
 * ├─────────────────────────────────────────────────────────────────────────────┤
 * │                                                                             │
 * │ "Tree shaking is dead code elimination that removes unused exports from     │
 * │ JavaScript bundles. It works by analyzing which exports are actually        │
 * │ imported and removing the rest.                                             │
 * │                                                                             │
 * │ Requirements:                                                               │
 * │ • ES Modules (import/export) - because they're statically analyzable        │
 * │ • Production mode in bundler                                                │
 * │ • Code without side effects (or proper sideEffects field)                   │
 * │                                                                             │
 * │ Best practices:                                                             │
 * │ 1. Use named exports instead of default object exports                      │
 * │ 2. Set 'sideEffects: false' in package.json                                 │
 * │ 3. Avoid modifying globals at module level                                  │
 * │ 4. Use direct imports instead of barrel file imports when possible          │
 * │                                                                             │
 * │ CommonJS can't be tree-shaken because require() is dynamic - the bundler    │
 * │ can't know what's needed until the code actually runs.                      │
 * │                                                                             │
 * │ Tree shaking is crucial for reducing bundle size, especially when using     │
 * │ large libraries like lodash where you might only need a few functions."     │
 * │                                                                             │
 * └─────────────────────────────────────────────────────────────────────────────┘
 *
 *
 * RUN: node docs/20-modules-esm-cjs/05-tree-shaking.js
 */
