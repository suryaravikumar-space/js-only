/**
 * ═══════════════════════════════════════════════════════════════════════════
 * JAVASCRIPT MODULE SYSTEMS - Interview Questions & Answers
 * ═══════════════════════════════════════════════════════════════════════════
 *
 * 50+ commonly asked module systems interview questions.
 */

console.log("═══════════════════════════════════════════════════════════════");
console.log("           MODULE SYSTEMS - INTERVIEW Q&A");
console.log("═══════════════════════════════════════════════════════════════\n");

const interviewQuestions = [
    // ========================================================================
    // COMMONJS QUESTIONS
    // ========================================================================
    {
        category: "CommonJS",
        question: "What is CommonJS and how does it work?",
        answer: `
CommonJS is the module system used in Node.js, using require() for imports
and module.exports for exports.

KEY CHARACTERISTICS:
• Synchronous loading (blocks until module loads)
• Runtime evaluation (parsed at execution time)
• Value copies (exports are copied at require time)
• Single exports object per module

SYNTAX:
// Exporting
module.exports = { foo, bar };
exports.foo = foo;

// Importing
const { foo } = require('./module');
const mod = require('./module');

HOW IT WORKS:
1. Resolve module path
2. Check cache (return if cached)
3. Create module wrapper function
4. Execute module code
5. Return module.exports
        `
    },
    {
        category: "CommonJS",
        question: "What's the difference between exports and module.exports?",
        answer: `
exports is a SHORTCUT to module.exports:
• Initially: exports === module.exports === {}
• They reference the same object

IMPORTANT GOTCHA:
// Works - adding to object
exports.foo = 'bar';      // ✅
module.exports.foo = 'bar'; // ✅

// Broken - reassigning exports
exports = { foo: 'bar' };  // ❌ Breaks reference!
module.exports = { foo: 'bar' }; // ✅ Works

WHY?
exports is a local variable pointing to module.exports.
Reassigning exports breaks the reference, but module.exports
is what actually gets returned.

RULE: When exporting single value, always use module.exports
        `
    },
    {
        category: "CommonJS",
        question: "How does Node.js handle circular dependencies?",
        answer: `
Node.js returns PARTIAL exports when circular dependencies occur.

EXAMPLE:
// a.js
exports.done = false;
const b = require('./b');  // b gets partial a
exports.done = true;

// b.js
exports.done = false;
const a = require('./a');  // Gets { done: false }!
exports.done = true;

EXECUTION ORDER:
1. Start loading a.js
2. a.exports.done = false
3. a.js requires b.js
4. b.js requires a.js
5. Returns CURRENT a.exports { done: false }
6. b.js finishes
7. a.js continues, sets done = true

SOLUTIONS:
• Restructure to avoid circular deps
• Move shared code to third module
• Use lazy require (inside function)
• Dependency injection
        `
    },
    {
        category: "CommonJS",
        question: "Explain the module wrapper function.",
        answer: `
Node.js wraps every module in a function before executing:

(function(exports, require, module, __filename, __dirname) {
    // Your module code here
});

THIS PROVIDES:
• Private scope (variables aren't global)
• exports: Shortcut to module.exports
• require: Function to load modules
• module: Reference to current module
• __filename: Absolute path to file
• __dirname: Absolute path to directory

WHY?
• Prevents global namespace pollution
• Each module has its own scope
• Provides module-level variables
        `
    },

    // ========================================================================
    // ES MODULES QUESTIONS
    // ========================================================================
    {
        category: "ES Modules",
        question: "What are ES Modules and how do they differ from CommonJS?",
        answer: `
ES Modules (ESM) is the official JavaScript standard for modules.

KEY DIFFERENCES:
┌────────────────┬───────────────┬──────────────────┐
│ Feature        │ CommonJS      │ ES Modules       │
├────────────────┼───────────────┼──────────────────┤
│ Syntax         │ require       │ import/export    │
│ Loading        │ Synchronous   │ Asynchronous     │
│ Parsing        │ Runtime       │ Static (compile) │
│ Exports        │ Copies        │ Live bindings    │
│ this           │ exports       │ undefined        │
│ Top-level await│ ❌            │ ✅               │
│ Tree shaking   │ Difficult     │ Native support   │
│ Browser native │ ❌            │ ✅               │
└────────────────┴───────────────┴──────────────────┘

STATIC ANALYSIS:
• Imports/exports analyzed at compile time
• Enables tree shaking
• Better IDE support
        `
    },
    {
        category: "ES Modules",
        question: "What are live bindings in ES Modules?",
        answer: `
Live bindings mean imports are REFERENCES to exports, not copies.

EXAMPLE:
// counter.mjs
export let count = 0;
export function increment() { count++; }

// main.mjs
import { count, increment } from './counter.mjs';

console.log(count);  // 0
increment();
console.log(count);  // 1 ← Updated!

CONTRAST WITH CJS:
// CommonJS exports copies
let count = 0;
module.exports = { count, increment };
// Importing gets snapshot, not live value

IMPLICATIONS:
• Changes in module visible to all importers
• Useful for shared state
• Circular dependencies handled better
• Cannot reassign imports (read-only)
        `
    },
    {
        category: "ES Modules",
        question: "Explain static vs dynamic imports.",
        answer: `
STATIC IMPORTS:
• Parsed at compile time
• Must be at top level
• String literals only
• Always loaded

import { foo } from './module.js';

DYNAMIC IMPORTS:
• Evaluated at runtime
• Can be anywhere in code
• Dynamic paths allowed
• Returns Promise
• Enables code splitting

const module = await import('./module.js');
const { foo } = await import(\`./\${name}.js\`);

USE CASES FOR DYNAMIC:
• Conditional loading
• Route-based code splitting
• Feature flags
• Lazy loading heavy components
• Computed module paths
        `
    },
    {
        category: "ES Modules",
        question: "How do you enable ES Modules in Node.js?",
        answer: `
THREE METHODS:

1. File extension .mjs
   module.mjs → Treated as ESM
   module.js  → Treated as CJS

2. package.json "type" field
   {
     "type": "module"
   }
   Now all .js files are ESM

3. Use .cjs for CommonJS exceptions
   When "type": "module", use .cjs for CJS files

GETTING __dirname IN ESM:
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
        `
    },

    // ========================================================================
    // BUNDLER QUESTIONS
    // ========================================================================
    {
        category: "Bundlers",
        question: "What is a JavaScript bundler and why do we need it?",
        answer: `
A bundler combines multiple JavaScript modules into optimized files
for browsers.

PROBLEMS SOLVED:
1. Module compatibility
   - Convert CJS/ESM to browser-compatible code
   - Resolve node_modules

2. Performance
   - Reduce HTTP requests (combine files)
   - Minification and compression
   - Code splitting
   - Tree shaking

3. Asset processing
   - Transpile TypeScript/JSX
   - Process CSS, images
   - Generate source maps

4. Development experience
   - Hot Module Replacement (HMR)
   - Dev server

POPULAR BUNDLERS:
• Webpack: Full-featured, complex config
• Rollup: Library-focused, clean output
• esbuild: Extremely fast
• Vite: Modern dev experience
• Parcel: Zero config
        `
    },
    {
        category: "Bundlers",
        question: "Compare Webpack, Rollup, and esbuild.",
        answer: `
WEBPACK:
• Most plugins and loaders
• Best for applications
• Complex configuration
• Slow build times
• Great code splitting

ROLLUP:
• Clean, efficient output
• Best for libraries
• Excellent tree shaking
• ESM-first design
• Simpler than Webpack

ESBUILD:
• 10-100x faster than others
• Written in Go
• Built-in TypeScript
• Simple configuration
• Limited plugin ecosystem

WHEN TO USE:
• Webpack: Complex apps, need everything
• Rollup: npm packages, libraries
• esbuild: Speed priority, simple projects
• Vite: Modern frameworks, fast dev server
        `
    },

    // ========================================================================
    // TREE SHAKING QUESTIONS
    // ========================================================================
    {
        category: "Tree Shaking",
        question: "What is tree shaking?",
        answer: `
Tree shaking is dead code elimination that removes unused exports
from the final bundle.

HOW IT WORKS:
1. Build dependency graph from imports
2. Mark exported symbols
3. Trace which exports are used
4. Remove unused code

REQUIREMENTS:
1. ES Modules (static analysis)
2. Production build
3. sideEffects: false in package.json

GOOD PATTERN:
export const add = (a, b) => a + b;
export const subtract = (a, b) => a - b;
// Only imported function included

BAD PATTERN:
export default {
    add: (a, b) => a + b,
    subtract: (a, b) => a - b
};
// Entire object included even if one method used
        `
    },
    {
        category: "Tree Shaking",
        question: "What are side effects and how do they affect tree shaking?",
        answer: `
Side effects are code that affects something outside its scope:
• Modifying global variables
• DOM manipulation
• Polyfills
• CSS imports

package.json CONFIGURATION:
{
  "sideEffects": false  // No side effects
}

OR specify files with side effects:
{
  "sideEffects": [
    "*.css",
    "./src/polyfills.js"
  ]
}

WHY IT MATTERS:
Without sideEffects: false, bundler assumes ALL code
might have side effects and can't remove unused imports.

PURE ANNOTATION:
const result = /*#__PURE__*/ createComponent();
// Tells bundler this call has no side effects
        `
    },
    {
        category: "Tree Shaking",
        question: "Why doesn't tree shaking work with CommonJS?",
        answer: `
CommonJS is DYNAMIC - can't analyze at compile time.

PROBLEMS:
1. require() is a function
   const module = require(path);  // path can be variable

2. Conditional requires
   if (condition) require('./a');

3. exports is an object
   module.exports[key] = value;  // dynamic keys

4. Runtime evaluation
   require() evaluated at runtime, not compile time

CONTRAST WITH ESM:
• import/export at top level only
• String literals only
• Analyzed before execution
• Bundler knows all imports/exports

SOLUTION:
• Use ES module versions of libraries
• import { debounce } from 'lodash-es'
• Not: const _ = require('lodash')
        `
    },

    // ========================================================================
    // CODE SPLITTING QUESTIONS
    // ========================================================================
    {
        category: "Code Splitting",
        question: "What is code splitting and what are the strategies?",
        answer: `
Code splitting divides code into chunks loaded on demand,
reducing initial bundle size.

STRATEGIES:

1. ROUTE-BASED
   const Home = React.lazy(() => import('./Home'));
   const About = React.lazy(() => import('./About'));

2. COMPONENT-BASED
   const HeavyChart = React.lazy(() => import('./Chart'));

3. VENDOR SPLITTING
   Separate node_modules into own chunk

4. CONDITIONAL
   if (user.isAdmin) {
       const admin = await import('./admin');
   }

WEBPACK MAGIC COMMENTS:
import(/* webpackChunkName: "chart" */ './Chart');
import(/* webpackPrefetch: true */ './NextPage');
import(/* webpackPreload: true */ './Critical');
        `
    },
    {
        category: "Code Splitting",
        question: "What's the difference between prefetch and preload?",
        answer: `
PREFETCH:
• Load during browser idle time
• Low priority
• For FUTURE navigation
• Won't block current page

<link rel="prefetch" href="next-page.js">
import(/* webpackPrefetch: true */ './NextPage');

PRELOAD:
• Load immediately
• High priority
• For CURRENT page
• Parallel to main bundle

<link rel="preload" href="critical.js" as="script">
import(/* webpackPreload: true */ './Critical');

TIMELINE:
Main:     ████████████
Preload:  ████████████ (parallel)
Prefetch: ░░░░░░░░████ (after main, idle)
        `
    },

    // ========================================================================
    // MODULE FEDERATION QUESTIONS
    // ========================================================================
    {
        category: "Module Federation",
        question: "What is Module Federation?",
        answer: `
Module Federation enables sharing code between separately built
applications at runtime. Introduced in Webpack 5.

KEY CONCEPTS:
• HOST: Consumes remote modules
• REMOTE: Exposes modules
• SHARED: Dependencies used by multiple apps

USE CASES:
• Micro-frontends
• Independent deployments
• Multi-team development
• Incremental migration

CONFIGURATION:
// Remote (exposes)
new ModuleFederationPlugin({
    name: 'mfe1',
    filename: 'remoteEntry.js',
    exposes: {
        './Button': './src/Button'
    },
    shared: ['react']
});

// Host (consumes)
new ModuleFederationPlugin({
    remotes: {
        mfe1: 'mfe1@http://localhost:3001/remoteEntry.js'
    },
    shared: ['react']
});
        `
    },
    {
        category: "Module Federation",
        question: "How do you handle shared dependencies in Module Federation?",
        answer: `
Shared dependencies prevent duplicate loading of libraries like React.

CONFIGURATION OPTIONS:
shared: {
    react: {
        singleton: true,      // Only one instance
        strictVersion: true,  // Exact version match
        requiredVersion: '^18.0.0',
        eager: true           // Load immediately
    }
}

SINGLETON:
• Ensures only one version loaded
• Critical for React (context, state)
• Prevents duplicate instances

VERSION NEGOTIATION:
• Bundler picks highest compatible version
• Uses requiredVersion for compatibility check
• strictVersion enforces exact match

EAGER LOADING:
• Load immediately, not lazy
• Use for critical shared deps
• Prevents async loading issues
        `
    },

    // ========================================================================
    // INTEROP QUESTIONS
    // ========================================================================
    {
        category: "Interoperability",
        question: "How do you use CommonJS modules in ES Modules?",
        answer: `
ESM CAN IMPORT CJS:

// CJS module (lib.cjs)
module.exports = { foo: 'bar' };

// ESM importing CJS
import lib from './lib.cjs';        // Default import
import { foo } from './lib.cjs';    // Named import (Node 14+)

WHAT HAPPENS:
• module.exports becomes the default export
• Named exports are auto-extracted in modern Node

GOTCHAS:
• CJS require() returns entire module.exports
• ESM import can destructure named exports
• Not all CJS patterns work perfectly
        `
    },
    {
        category: "Interoperability",
        question: "How do you use ES Modules in CommonJS?",
        answer: `
CJS CANNOT USE require() FOR ESM:

// ❌ This doesn't work
const esm = require('./module.mjs');

// ✅ Must use dynamic import
(async () => {
    const esm = await import('./module.mjs');
    console.log(esm.default);
    console.log(esm.namedExport);
})();

WHY?
• ESM loading is asynchronous
• require() is synchronous
• Can't await in CJS top-level (Node < 14.8)

WORKAROUND:
• Wrap in async function
• Use .then()
• Consider converting CJS to ESM
        `
    },
    {
        category: "Interoperability",
        question: "How do you publish a dual CJS/ESM package?",
        answer: `
Use conditional exports in package.json:

{
  "name": "my-package",
  "type": "module",
  "main": "./dist/index.cjs",
  "module": "./dist/index.mjs",
  "exports": {
    ".": {
      "import": "./dist/index.mjs",
      "require": "./dist/index.cjs",
      "types": "./dist/index.d.ts"
    },
    "./utils": {
      "import": "./dist/utils.mjs",
      "require": "./dist/utils.cjs"
    }
  },
  "sideEffects": false
}

BUILD BOTH VERSIONS:
• Use Rollup or tsup
• Output both .mjs and .cjs
• Same source, different formats
        `
    }
];

// ============================================================================
// Print Questions
// ============================================================================
let currentCategory = '';

interviewQuestions.forEach((q, index) => {
    if (q.category !== currentCategory) {
        currentCategory = q.category;
        console.log(`\n${'═'.repeat(67)}`);
        console.log(`   ${currentCategory.toUpperCase()} QUESTIONS`);
        console.log(`${'═'.repeat(67)}`);
    }

    console.log(`\n${index + 1}. Q: ${q.question}`);
    console.log(`\n   A: ${q.answer.trim().split('\n').join('\n   ')}`);
});

// ============================================================================
// Quick Reference
// ============================================================================
console.log("\n" + "═".repeat(67));
console.log("           MODULE SYSTEMS QUICK REFERENCE");
console.log("═".repeat(67));

console.log(`
╔══════════════════════════════════════════════════════════════════╗
║                MODULE SYSTEMS QUICK REFERENCE                    ║
╠══════════════════════════════════════════════════════════════════╣
║                                                                  ║
║  COMMONJS:                       ES MODULES:                     ║
║  require('./mod')                import x from './mod.js'        ║
║  module.exports = x              export default x                ║
║  exports.foo = x                 export { foo }                  ║
║  Synchronous                     Asynchronous                    ║
║  Value copies                    Live bindings                   ║
║                                                                  ║
║  ENABLING ESM:                   TREE SHAKING:                   ║
║  • .mjs extension                • Use named exports             ║
║  • "type": "module"              • sideEffects: false            ║
║  • .cjs for CommonJS             • Production build              ║
║                                                                  ║
║  CODE SPLITTING:                 BUNDLERS:                       ║
║  await import('./mod.js')        • Webpack: Apps                 ║
║  React.lazy(() => import())      • Rollup: Libraries             ║
║  /* webpackChunkName */          • esbuild: Speed                ║
║                                  • Vite: Modern DX               ║
║                                                                  ║
╚══════════════════════════════════════════════════════════════════╝
`);

module.exports = { interviewQuestions };

console.log("\n═══ MODULE SYSTEMS MODULE COMPLETE! ═══");
console.log("All 8 files covering module systems created.");
console.log("\nNext module: Meta-programming");
console.log("Run: node deep-dive/javaScript-meta-programming/01-proxy.js");
