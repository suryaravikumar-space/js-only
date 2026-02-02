/**
 * BUNDLERS & MODULES: 00 - Module Systems Overview
 *
 * ONE CONCEPT: Why modules exist and how JavaScript evolved its module story
 */


// =============================================================================
// WHY MODULES?
// =============================================================================

console.log('=== Why Modules? ===\n');

/**
 *   ┌──────────────────────────────────────────────────────────────────────┐
 *   │  THE PROBLEM (Pre-Modules Era)                                      │
 *   ├──────────────────────────────────────────────────────────────────────┤
 *   │                                                                      │
 *   │  <script src="jquery.js"></script>                                   │
 *   │  <script src="utils.js"></script>       ← Order matters!            │
 *   │  <script src="app.js"></script>         ← Global scope pollution    │
 *   │                                                                      │
 *   │  Problems:                                                           │
 *   │  1. Everything in global scope (window.*)                            │
 *   │  2. Script order = dependency order (manual)                         │
 *   │  3. Name collisions (two libs define $)                              │
 *   │  4. No encapsulation (anyone can access anything)                    │
 *   │  5. No dependency management                                         │
 *   │                                                                      │
 *   └──────────────────────────────────────────────────────────────────────┘
 *
 */

// Before modules - everything global
// var utils = {};
// utils.add = function(a, b) { return a + b; };
// // Another file could overwrite utils!
// var utils = 'oops';  // Collision!


// =============================================================================
// EVOLUTION OF MODULES
// =============================================================================

console.log('=== Evolution of JS Modules ===\n');

/**
 *   ┌──────────────────────────────────────────────────────────────────────┐
 *   │  MODULE EVOLUTION TIMELINE                                          │
 *   ├──────────────────────────────────────────────────────────────────────┤
 *   │                                                                      │
 *   │  2009  CommonJS (CJS)                                               │
 *   │  ├── require() / module.exports                                     │
 *   │  ├── Synchronous loading                                            │
 *   │  ├── Designed for Node.js (server)                                  │
 *   │  └── Still used in Node.js today                                    │
 *   │                                                                      │
 *   │  2011  AMD (Asynchronous Module Definition)                         │
 *   │  ├── define() / require()                                           │
 *   │  ├── Async loading for browsers                                     │
 *   │  ├── RequireJS was main implementation                              │
 *   │  └── Mostly dead now                                                │
 *   │                                                                      │
 *   │  2011  UMD (Universal Module Definition)                            │
 *   │  ├── Works in CJS, AMD, and global                                  │
 *   │  ├── Wrapper pattern                                                │
 *   │  └── Still seen in some libraries                                   │
 *   │                                                                      │
 *   │  2015  ES Modules (ESM)                                             │
 *   │  ├── import / export                                                │
 *   │  ├── Static analysis (tree-shakeable)                               │
 *   │  ├── Official standard (TC39)                                       │
 *   │  ├── Async by default in browsers                                   │
 *   │  └── THE FUTURE - use this!                                         │
 *   │                                                                      │
 *   └──────────────────────────────────────────────────────────────────────┘
 *
 */

console.log('2009: CommonJS  → require/module.exports (Node.js)');
console.log('2011: AMD       → define/require (browser async)');
console.log('2011: UMD       → universal wrapper (CJS + AMD + global)');
console.log('2015: ES Modules → import/export (the standard)');


// =============================================================================
// IIFE: THE ORIGINAL "MODULE" PATTERN
// =============================================================================

console.log('\n=== IIFE Module Pattern (Pre-Modules) ===\n');

/**
 *   ┌─────────────────────────────────────────────────────────────────────┐
 *   │  IIFE (Immediately Invoked Function Expression)                    │
 *   ├─────────────────────────────────────────────────────────────────────┤
 *   │                                                                     │
 *   │  (function() {                                                      │
 *   │    var private = 'hidden';       ← Function scope = private        │
 *   │    window.myLib = { ... };       ← Expose only what's needed       │
 *   │  })();                                                              │
 *   │                                                                     │
 *   │  This was the ONLY way to get encapsulation before modules          │
 *   │                                                                     │
 *   └─────────────────────────────────────────────────────────────────────┘
 *
 */

const MyModule = (function() {
  // Private
  let count = 0;

  function increment() {
    count++;
  }

  // Public API
  return {
    getCount: () => count,
    add: () => { increment(); return count; }
  };
})();

console.log('IIFE module count:', MyModule.getCount());
console.log('After add:', MyModule.add());
// console.log(count);  // ReferenceError - private!


// =============================================================================
// WHAT BUNDLERS DO
// =============================================================================

console.log('\n=== What Bundlers Do ===\n');

/**
 *   ┌──────────────────────────────────────────────────────────────────────┐
 *   │  BUNDLER: Combines modules into browser-ready files                 │
 *   ├──────────────────────────────────────────────────────────────────────┤
 *   │                                                                      │
 *   │  Source Files:              Bundle Output:                           │
 *   │                                                                      │
 *   │  src/                       dist/                                    │
 *   │  ├── index.js               ├── bundle.js      ← All JS combined   │
 *   │  ├── utils.js               ├── styles.css      ← All CSS combined │
 *   │  ├── api.js                 ├── index.html                          │
 *   │  ├── styles.css             └── assets/                             │
 *   │  └── components/                ├── logo.abc123.png                 │
 *   │      ├── Header.js              └── font.def456.woff               │
 *   │      └── Footer.js                                                  │
 *   │                                                                      │
 *   │  Bundler does:                                                       │
 *   │  1. Resolves import/require dependencies (dependency graph)         │
 *   │  2. Transforms code (Babel, TypeScript, JSX → JS)                   │
 *   │  3. Bundles into fewer files (reduce HTTP requests)                 │
 *   │  4. Minifies (remove whitespace, shorten names)                     │
 *   │  5. Tree-shakes (remove unused exports)                             │
 *   │  6. Code-splits (lazy load routes/features)                         │
 *   │  7. Hashes filenames (cache busting)                                │
 *   │                                                                      │
 *   └──────────────────────────────────────────────────────────────────────┘
 *
 */

console.log('Bundler pipeline:');
console.log('  Source → Dependency Graph → Transform → Bundle → Optimize → Output');
console.log('');
console.log('Popular bundlers:');
console.log('  Webpack  - most configurable, plugin ecosystem');
console.log('  Vite     - fast dev server, ESM-native');
console.log('  Rollup   - best for libraries, clean output');
console.log('  esbuild  - fastest, written in Go');
console.log('  Parcel   - zero-config');


// =============================================================================
// MODULE CONTENTS
// =============================================================================

/**
 * This module covers:
 *
 * 00. Module Systems Overview (this file)
 * 01. CommonJS (require/module.exports)
 * 02. ES Modules (import/export)
 * 03. CJS vs ESM Deep Comparison
 * 04. Module Patterns & Dynamic Import
 * 05. Babel Overview (transpilation)
 * 06. Babel Transforms & Plugins
 * 07. Webpack Overview
 * 08. Webpack Loaders & Plugins
 * 09. Webpack Optimization
 * 10. Vite Overview
 * 11. Webpack vs Vite
 * 12. Tree Shaking
 * 13. Code Splitting
 * 14. Hot Module Replacement
 * 15. Interview Cheatsheet
 */


// RUN: node docs/29-bundlers-modules/00-module-systems-overview.js
