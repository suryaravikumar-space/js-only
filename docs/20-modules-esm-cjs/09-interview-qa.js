/**
 * MODULES: 09 - Interview Questions & Answers
 *
 * ╔════════════════════════════════════════════════════════════════════════════╗
 * ║ COMPLETE INTERVIEW GUIDE - JavaScript Modules                              ║
 * ╠════════════════════════════════════════════════════════════════════════════╣
 * ║                                                                            ║
 * ║ CommonJS vs ES Modules - Everything you need to know for interviews        ║
 * ║                                                                            ║
 * ╚════════════════════════════════════════════════════════════════════════════╝
 */


// ═══════════════════════════════════════════════════════════════════════════════
// QUESTION 1: What's the difference between CJS and ESM?
// ═══════════════════════════════════════════════════════════════════════════════

/**
 * ┌─────────────────────────────────────────────────────────────────────────────┐
 * │ Q1: What are the main differences between CommonJS and ES Modules?          │
 * ├─────────────────────────────────────────────────────────────────────────────┤
 * │                                                                             │
 * │ ANSWER:                                                                     │
 * │                                                                             │
 * │ 1. SYNTAX:                                                                  │
 * │    CJS: require() / module.exports                                          │
 * │    ESM: import / export                                                     │
 * │                                                                             │
 * │ 2. LOADING:                                                                 │
 * │    CJS: Synchronous (blocks execution)                                      │
 * │    ESM: Asynchronous (non-blocking)                                         │
 * │                                                                             │
 * │ 3. EVALUATION:                                                              │
 * │    CJS: Runtime (code runs when require() called)                           │
 * │    ESM: Parse time (analyzed before execution)                              │
 * │                                                                             │
 * │ 4. EXPORTS:                                                                 │
 * │    CJS: Copy of values at require() time                                    │
 * │    ESM: Live bindings (always current value)                                │
 * │                                                                             │
 * │ 5. TREE SHAKING:                                                            │
 * │    CJS: Not possible (dynamic)                                              │
 * │    ESM: Fully supported (static analysis)                                   │
 * │                                                                             │
 * │ 6. TOP-LEVEL AWAIT:                                                         │
 * │    CJS: Not supported                                                       │
 * │    ESM: Supported                                                           │
 * │                                                                             │
 * └─────────────────────────────────────────────────────────────────────────────┘
 */

console.log('Q1: CJS vs ESM differences - see answer above');


// ═══════════════════════════════════════════════════════════════════════════════
// QUESTION 2: What is tree shaking?
// ═══════════════════════════════════════════════════════════════════════════════

/**
 * ┌─────────────────────────────────────────────────────────────────────────────┐
 * │ Q2: What is tree shaking and why does it require ES Modules?                │
 * ├─────────────────────────────────────────────────────────────────────────────┤
 * │                                                                             │
 * │ ANSWER:                                                                     │
 * │                                                                             │
 * │ Tree shaking is dead code elimination that removes unused exports from      │
 * │ JavaScript bundles.                                                         │
 * │                                                                             │
 * │ WHY ESM IS REQUIRED:                                                        │
 * │                                                                             │
 * │ ES Modules have STATIC structure:                                           │
 * │ • Imports/exports are at top level                                          │
 * │ • Paths are string literals                                                 │
 * │ • Bundler knows what's used BEFORE running code                             │
 * │                                                                             │
 * │ CommonJS is DYNAMIC:                                                        │
 * │ • require() can be inside if/else                                           │
 * │ • Path can be computed: require(condition ? 'a' : 'b')                      │
 * │ • Can't know what's needed until runtime                                    │
 * │                                                                             │
 * │ EXAMPLE:                                                                    │
 * │ // utils.js                                                                 │
 * │ export function used() { }     // 1KB                                       │
 * │ export function unused() { }   // 50KB                                      │
 * │                                                                             │
 * │ // app.js                                                                   │
 * │ import { used } from './utils.js';                                          │
 * │                                                                             │
 * │ With tree shaking: Bundle = 1KB (unused removed)                            │
 * │ Without: Bundle = 51KB                                                      │
 * │                                                                             │
 * └─────────────────────────────────────────────────────────────────────────────┘
 */

console.log('Q2: Tree shaking explanation - see answer above');


// ═══════════════════════════════════════════════════════════════════════════════
// QUESTION 3: What are live bindings?
// ═══════════════════════════════════════════════════════════════════════════════

/**
 * ┌─────────────────────────────────────────────────────────────────────────────┐
 * │ Q3: What are "live bindings" in ES Modules?                                 │
 * ├─────────────────────────────────────────────────────────────────────────────┤
 * │                                                                             │
 * │ ANSWER:                                                                     │
 * │                                                                             │
 * │ ESM exports are references to the actual variables, not copies.             │
 * │ When the exporting module changes a value, importers see the change.        │
 * │                                                                             │
 * │ // counter.js                                                               │
 * │ export let count = 0;                                                       │
 * │ export function increment() { count++; }                                    │
 * │                                                                             │
 * │ // main.js                                                                  │
 * │ import { count, increment } from './counter.js';                            │
 * │ console.log(count);  // 0                                                   │
 * │ increment();                                                                │
 * │ console.log(count);  // 1 ← Updated!                                        │
 * │                                                                             │
 * │ IN COMMONJS (Copy):                                                         │
 * │ const { count, increment } = require('./counter');                          │
 * │ console.log(count);  // 0                                                   │
 * │ increment();                                                                │
 * │ console.log(count);  // 0 ← Still 0! (was copied)                           │
 * │                                                                             │
 * │ This matters for:                                                           │
 * │ • Circular dependencies                                                     │
 * │ • State sharing                                                             │
 * │ • Singleton patterns                                                        │
 * │                                                                             │
 * └─────────────────────────────────────────────────────────────────────────────┘
 */

console.log('Q3: Live bindings explanation - see answer above');


// ═══════════════════════════════════════════════════════════════════════════════
// QUESTION 4: exports = {} doesn't work?
// ═══════════════════════════════════════════════════════════════════════════════

/**
 * ┌─────────────────────────────────────────────────────────────────────────────┐
 * │ Q4: Why doesn't `exports = {}` work in CommonJS?                            │
 * ├─────────────────────────────────────────────────────────────────────────────┤
 * │                                                                             │
 * │ ANSWER:                                                                     │
 * │                                                                             │
 * │ `exports` is just a REFERENCE to `module.exports`.                          │
 * │ Reassigning `exports` breaks the reference!                                 │
 * │                                                                             │
 * │ // WRONG                                                                    │
 * │ exports = { add: fn };  // exports now points to new object                 │
 * │ // But require() returns module.exports, not exports!                       │
 * │                                                                             │
 * │ // CORRECT                                                                  │
 * │ module.exports = { add: fn };  // Updates what require() returns            │
 * │                                                                             │
 * │ // ALSO CORRECT                                                             │
 * │ exports.add = fn;  // Modifies the shared object                            │
 * │ module.exports.subtract = fn;  // Same object                               │
 * │                                                                             │
 * │ VISUAL:                                                                     │
 * │                                                                             │
 * │ Initially:  exports ──────► { } ◄────── module.exports                      │
 * │                                                                             │
 * │ After exports = {}:                                                         │
 * │             exports ──────► { new }   (broken!)                             │
 * │             module.exports ──► { }    (unchanged)                           │
 * │                                                                             │
 * └─────────────────────────────────────────────────────────────────────────────┘
 */

console.log('Q4: exports assignment gotcha - see answer above');


// ═══════════════════════════════════════════════════════════════════════════════
// QUESTION 5: Dynamic imports
// ═══════════════════════════════════════════════════════════════════════════════

/**
 * ┌─────────────────────────────────────────────────────────────────────────────┐
 * │ Q5: What is dynamic import() and when would you use it?                     │
 * ├─────────────────────────────────────────────────────────────────────────────┤
 * │                                                                             │
 * │ ANSWER:                                                                     │
 * │                                                                             │
 * │ import() is a function that loads modules at runtime, returning a Promise.  │
 * │                                                                             │
 * │ const module = await import('./module.js');                                 │
 * │                                                                             │
 * │ USE CASES:                                                                  │
 * │                                                                             │
 * │ 1. Code Splitting / Lazy Loading                                            │
 * │    const Chart = await import('./heavy-chart-library.js');                  │
 * │                                                                             │
 * │ 2. Conditional Loading                                                      │
 * │    if (isAdmin) {                                                           │
 * │      const admin = await import('./admin.js');                              │
 * │    }                                                                        │
 * │                                                                             │
 * │ 3. Dynamic Paths                                                            │
 * │    const locale = await import(`./locales/${lang}.js`);                     │
 * │                                                                             │
 * │ 4. Polyfills                                                                │
 * │    if (!window.fetch) {                                                     │
 * │      await import('whatwg-fetch');                                          │
 * │    }                                                                        │
 * │                                                                             │
 * │ REACT EXAMPLE:                                                              │
 * │ const LazyComponent = React.lazy(() => import('./Component'));              │
 * │                                                                             │
 * └─────────────────────────────────────────────────────────────────────────────┘
 */

console.log('Q5: Dynamic import() - see answer above');


// ═══════════════════════════════════════════════════════════════════════════════
// QUESTION 6: Circular dependencies
// ═══════════════════════════════════════════════════════════════════════════════

/**
 * ┌─────────────────────────────────────────────────────────────────────────────┐
 * │ Q6: How do circular dependencies work in CJS vs ESM?                        │
 * ├─────────────────────────────────────────────────────────────────────────────┤
 * │                                                                             │
 * │ ANSWER:                                                                     │
 * │                                                                             │
 * │ COMMONJS:                                                                   │
 * │ Returns PARTIAL exports when cycle detected.                                │
 * │                                                                             │
 * │ // a.js                                                                     │
 * │ exports.done = false;                                                       │
 * │ const b = require('./b');  // b gets partial a.exports                      │
 * │ exports.done = true;                                                        │
 * │                                                                             │
 * │ // b.js                                                                     │
 * │ const a = require('./a');                                                   │
 * │ console.log(a.done);  // false! (a wasn't finished)                         │
 * │                                                                             │
 * │                                                                             │
 * │ ES MODULES:                                                                 │
 * │ Uses LIVE BINDINGS - better handling.                                       │
 * │                                                                             │
 * │ The binding exists before value is assigned, so you can access it later.    │
 * │ But accessing before initialization → ReferenceError.                       │
 * │                                                                             │
 * │                                                                             │
 * │ SOLUTIONS:                                                                  │
 * │ 1. Restructure: Extract shared code to third module                         │
 * │ 2. Dependency injection: Pass dependencies as parameters                    │
 * │ 3. Lazy loading: import() inside functions                                  │
 * │                                                                             │
 * └─────────────────────────────────────────────────────────────────────────────┘
 */

console.log('Q6: Circular dependencies - see answer above');


// ═══════════════════════════════════════════════════════════════════════════════
// QUESTION 7: Module caching
// ═══════════════════════════════════════════════════════════════════════════════

/**
 * ┌─────────────────────────────────────────────────────────────────────────────┐
 * │ Q7: Are modules cached? What are the implications?                          │
 * ├─────────────────────────────────────────────────────────────────────────────┤
 * │                                                                             │
 * │ ANSWER:                                                                     │
 * │                                                                             │
 * │ YES! Both CJS and ESM cache modules.                                        │
 * │                                                                             │
 * │ const a = require('./module');                                              │
 * │ const b = require('./module');                                              │
 * │ a === b  // true! Same object                                               │
 * │                                                                             │
 * │ IMPLICATIONS:                                                               │
 * │                                                                             │
 * │ 1. SINGLETONS: Module code runs once                                        │
 * │    • Good for: DB connections, loggers, configs                             │
 * │    • The same instance is shared across all imports                         │
 * │                                                                             │
 * │ 2. SHARED STATE:                                                            │
 * │    // state.js                                                              │
 * │    export let count = 0;                                                    │
 * │                                                                             │
 * │    // Both files share the same count!                                      │
 * │    // file1.js and file2.js                                                 │
 * │                                                                             │
 * │ 3. TESTING: May need to clear cache between tests                           │
 * │    delete require.cache[require.resolve('./module')];                       │
 * │                                                                             │
 * └─────────────────────────────────────────────────────────────────────────────┘
 */

console.log('Q7: Module caching - see answer above');


// ═══════════════════════════════════════════════════════════════════════════════
// QUESTION 8: How to use ESM in Node.js?
// ═══════════════════════════════════════════════════════════════════════════════

/**
 * ┌─────────────────────────────────────────────────────────────────────────────┐
 * │ Q8: How do you use ES Modules in Node.js?                                   │
 * ├─────────────────────────────────────────────────────────────────────────────┤
 * │                                                                             │
 * │ ANSWER:                                                                     │
 * │                                                                             │
 * │ THREE WAYS:                                                                 │
 * │                                                                             │
 * │ 1. Use .mjs extension                                                       │
 * │    // app.mjs                                                               │
 * │    import { add } from './math.mjs';                                        │
 * │                                                                             │
 * │ 2. Set "type": "module" in package.json                                     │
 * │    {                                                                        │
 * │      "type": "module"                                                       │
 * │    }                                                                        │
 * │    // Now all .js files are ESM                                             │
 * │                                                                             │
 * │ 3. Use .cjs for CommonJS in a "type": "module" project                      │
 * │    // legacy.cjs - stays as CommonJS                                        │
 * │                                                                             │
 * │                                                                             │
 * │ __dirname REPLACEMENT:                                                      │
 * │                                                                             │
 * │ import { fileURLToPath } from 'url';                                        │
 * │ import { dirname } from 'path';                                             │
 * │                                                                             │
 * │ const __filename = fileURLToPath(import.meta.url);                          │
 * │ const __dirname = dirname(__filename);                                      │
 * │                                                                             │
 * └─────────────────────────────────────────────────────────────────────────────┘
 */

console.log('Q8: ESM in Node.js - see answer above');


// ═══════════════════════════════════════════════════════════════════════════════
// QUICK REFERENCE CHEAT SHEET
// ═══════════════════════════════════════════════════════════════════════════════

/**
 * ╔════════════════════════════════════════════════════════════════════════════╗
 * ║                     MODULES INTERVIEW CHEAT SHEET                          ║
 * ╠════════════════════════════════════════════════════════════════════════════╣
 * ║                                                                            ║
 * ║  COMMONJS (CJS)                                                            ║
 * ║  ──────────────────────────────────────────────────────────────────        ║
 * ║  Export:  module.exports = { }; exports.name = value;                      ║
 * ║  Import:  const x = require('./x');                                        ║
 * ║  Dynamic: YES - require() works anywhere                                   ║
 * ║  Loading: Synchronous                                                      ║
 * ║  Exports: Copies (snapshots)                                               ║
 * ║  Tree Shaking: NO                                                          ║
 * ║                                                                            ║
 * ║                                                                            ║
 * ║  ES MODULES (ESM)                                                          ║
 * ║  ──────────────────────────────────────────────────────────────────        ║
 * ║  Export:  export const x; export default y;                                ║
 * ║  Import:  import { x } from './x.js';                                      ║
 * ║  Dynamic: import('./x.js') returns Promise                                 ║
 * ║  Loading: Asynchronous                                                     ║
 * ║  Exports: Live bindings                                                    ║
 * ║  Tree Shaking: YES                                                         ║
 * ║                                                                            ║
 * ║                                                                            ║
 * ║  GOTCHAS TO REMEMBER:                                                      ║
 * ║  ──────────────────────────────────────────────────────────────────        ║
 * ║  • exports = {} doesn't work (use module.exports = {})                     ║
 * ║  • ESM in Node.js: .mjs or "type": "module"                                ║
 * ║  • __dirname not in ESM (use import.meta.url)                              ║
 * ║  • Circular deps: CJS = partial, ESM = live bindings                       ║
 * ║  • Modules are cached (singletons)                                         ║
 * ║  • Named exports enable tree shaking                                       ║
 * ║                                                                            ║
 * ║                                                                            ║
 * ║  WHEN TO USE WHICH:                                                        ║
 * ║  ──────────────────────────────────────────────────────────────────        ║
 * ║  ESM: New projects, browsers, libraries, tree shaking                      ║
 * ║  CJS: Legacy code, some npm packages, simple Node.js scripts               ║
 * ║                                                                            ║
 * ╚════════════════════════════════════════════════════════════════════════════╝
 *
 *
 * RUN: node docs/20-modules-esm-cjs/09-interview-qa.js
 */

console.log('\n=== Interview Q&A Complete ===');
console.log('Review the detailed answers in the comments above');
