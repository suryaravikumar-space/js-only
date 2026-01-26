/**
 * ═══════════════════════════════════════════════════════════════════════════
 * JAVASCRIPT MODULE SYSTEMS - CJS vs ESM Comparison
 * ═══════════════════════════════════════════════════════════════════════════
 *
 * Comprehensive comparison of CommonJS and ES Modules, including
 * interoperability patterns and migration strategies.
 */

/**
 * ┌──────────────────────────────────────────────────────────────────────────┐
 * │                    CJS vs ESM COMPARISON TABLE                           │
 * ├──────────────────────────────────────────────────────────────────────────┤
 * │                                                                          │
 * │   ┌──────────────────┬───────────────────┬───────────────────────────┐  │
 * │   │ Feature          │ CommonJS          │ ES Modules                │  │
 * │   ├──────────────────┼───────────────────┼───────────────────────────┤  │
 * │   │ Syntax           │ require/exports   │ import/export             │  │
 * │   │ Loading          │ Synchronous       │ Asynchronous              │  │
 * │   │ Parsing          │ Runtime           │ Compile time (static)     │  │
 * │   │ Bindings         │ Copies            │ Live references           │  │
 * │   │ this (top-level) │ exports object    │ undefined                 │  │
 * │   │ __filename       │ ✅ Available      │ ❌ Use import.meta.url    │  │
 * │   │ __dirname        │ ✅ Available      │ ❌ Need workaround        │  │
 * │   │ require()        │ ✅ Available      │ ❌ Use import()           │  │
 * │   │ import()         │ ✅ (dynamic)      │ ✅ (static + dynamic)     │  │
 * │   │ JSON import      │ ✅ Direct         │ ⚠️ Experimental           │  │
 * │   │ Top-level await  │ ❌ Not supported  │ ✅ Supported              │  │
 * │   │ Tree shaking     │ ❌ Difficult      │ ✅ Native support         │  │
 * │   │ Strict mode      │ Optional          │ Always strict             │  │
 * │   │ File extensions  │ Optional          │ Required (.js/.mjs)       │  │
 * │   │ Browser native   │ ❌ Needs bundler  │ ✅ Native support         │  │
 * │   └──────────────────┴───────────────────┴───────────────────────────┘  │
 * │                                                                          │
 * └──────────────────────────────────────────────────────────────────────────┘
 */

console.log("═══════════════════════════════════════════════════════════════");
console.log("           CJS vs ESM COMPARISON");
console.log("═══════════════════════════════════════════════════════════════\n");

/**
 * ┌──────────────────────────────────────────────────────────────────────────┐
 * │                    SYNTAX COMPARISON                                     │
 * └──────────────────────────────────────────────────────────────────────────┘
 */

console.log("─── Syntax Comparison ───\n");

const syntaxComparison = {
    "Named Export": {
        CJS: "exports.foo = value;\nmodule.exports.foo = value;",
        ESM: "export const foo = value;\nexport { foo };"
    },
    "Default Export": {
        CJS: "module.exports = value;",
        ESM: "export default value;"
    },
    "Named Import": {
        CJS: "const { foo } = require('./mod');",
        ESM: "import { foo } from './mod.js';"
    },
    "Default Import": {
        CJS: "const mod = require('./mod');",
        ESM: "import mod from './mod.js';"
    },
    "Namespace Import": {
        CJS: "const mod = require('./mod');",
        ESM: "import * as mod from './mod.js';"
    },
    "Dynamic Import": {
        CJS: "const mod = require(path);",
        ESM: "const mod = await import(path);"
    },
    "Conditional Import": {
        CJS: "if (cond) require('./mod');",
        ESM: "if (cond) await import('./mod.js');"
    },
    "Re-export": {
        CJS: "module.exports = { ...require('./a'), ...require('./b') };",
        ESM: "export * from './a.js';\nexport * from './b.js';"
    }
};

Object.entries(syntaxComparison).forEach(([feature, { CJS, ESM }]) => {
    console.log(`${feature}:`);
    console.log(`  CJS: ${CJS.split('\n')[0]}`);
    console.log(`  ESM: ${ESM.split('\n')[0]}`);
    console.log("");
});

/**
 * ┌──────────────────────────────────────────────────────────────────────────┐
 * │                    LOADING BEHAVIOR                                      │
 * ├──────────────────────────────────────────────────────────────────────────┤
 * │                                                                          │
 * │   COMMONJS (Synchronous):                                               │
 * │   ══════════════════════                                                │
 * │                                                                          │
 * │   console.log('before');                                                │
 * │   const mod = require('./heavy-module');  // Blocks until loaded        │
 * │   console.log('after');  // Only runs after require completes           │
 * │                                                                          │
 * │   ES MODULES (Asynchronous):                                            │
 * │   ══════════════════════════                                             │
 * │                                                                          │
 * │   1. Parse phase: Find all import/export (static)                       │
 * │   2. Load phase: Fetch all modules                                      │
 * │   3. Link phase: Connect exports to imports                             │
 * │   4. Execute phase: Run module code                                     │
 * │                                                                          │
 * │   ┌─────────────┐   ┌─────────────┐   ┌─────────────┐   ┌─────────┐    │
 * │   │   Parse     │──►│   Load      │──►│    Link     │──►│ Execute │    │
 * │   │ (static)    │   │ (async)     │   │ (bindings)  │   │ (run)   │    │
 * │   └─────────────┘   └─────────────┘   └─────────────┘   └─────────┘    │
 * │                                                                          │
 * └──────────────────────────────────────────────────────────────────────────┘
 */

console.log("─── Loading Behavior ───\n");

console.log("CommonJS (Synchronous):");
console.log("  • Blocks execution during require()");
console.log("  • Modules loaded and executed immediately");
console.log("  • Good for server (files on disk)");
console.log("  • Poor for browser (network latency)\n");

console.log("ES Modules (Asynchronous):");
console.log("  • Non-blocking module loading");
console.log("  • Parallel module fetching");
console.log("  • 4 phases: Parse → Load → Link → Execute");
console.log("  • Native browser support\n");

/**
 * ┌──────────────────────────────────────────────────────────────────────────┐
 * │                    BINDINGS: COPIES vs LIVE                              │
 * ├──────────────────────────────────────────────────────────────────────────┤
 * │                                                                          │
 * │   COMMONJS - Value Copies:                                              │
 * │   ═══════════════════════                                                │
 * │                                                                          │
 * │   // counter.js                                                         │
 * │   let count = 0;                                                        │
 * │   module.exports = { count, inc: () => count++ };                       │
 * │                                                                          │
 * │   // main.js                                                            │
 * │   const { count, inc } = require('./counter');                          │
 * │   console.log(count);  // 0                                             │
 * │   inc();                                                                │
 * │   console.log(count);  // 0 ← Still 0! Got copy at require time         │
 * │                                                                          │
 * │   ES MODULES - Live Bindings:                                           │
 * │   ═══════════════════════════                                            │
 * │                                                                          │
 * │   // counter.mjs                                                        │
 * │   export let count = 0;                                                 │
 * │   export function inc() { count++; }                                    │
 * │                                                                          │
 * │   // main.mjs                                                           │
 * │   import { count, inc } from './counter.mjs';                           │
 * │   console.log(count);  // 0                                             │
 * │   inc();                                                                │
 * │   console.log(count);  // 1 ← Updated! Live binding                     │
 * │                                                                          │
 * └──────────────────────────────────────────────────────────────────────────┘
 */

console.log("─── Bindings Comparison ───\n");

// Simulate CJS behavior (copies)
let cjsCount = 0;
const cjsModule = {
    count: cjsCount,  // Copy of value
    inc: () => cjsCount++
};

console.log("CommonJS (Value Copies):");
console.log("  Initial count:", cjsModule.count);
cjsModule.inc();
console.log("  After inc():", cjsModule.count, "← Still 0! (copy)");
console.log("  Actual cjsCount:", cjsCount, "← Changed internally\n");

// ESM would have live bindings - imports would see updated values
console.log("ES Modules (Live Bindings):");
console.log("  Imports reference the actual export");
console.log("  Changes are immediately visible");
console.log("  No stale values\n");

/**
 * ┌──────────────────────────────────────────────────────────────────────────┐
 * │                    INTEROPERABILITY                                      │
 * ├──────────────────────────────────────────────────────────────────────────┤
 * │                                                                          │
 * │   ESM importing CJS:                   CJS importing ESM:               │
 * │   ═══════════════════                  ═══════════════════               │
 * │                                                                          │
 * │   // Works!                            // Must use dynamic import!      │
 * │   import cjsModule from './mod.cjs';   const esm = await import('./m'); │
 * │   import { named } from './mod.cjs';                                    │
 * │                                        // Cannot use require()          │
 * │   // CJS module.exports becomes        // on ESM modules!               │
 * │   // the default export                                                 │
 * │                                                                          │
 * └──────────────────────────────────────────────────────────────────────────┘
 */

console.log("─── Interoperability ───\n");

console.log("ESM → CJS (✅ Supported):");
console.log(`
  // ESM file importing CJS
  import cjsMod from './module.cjs';     // module.exports as default
  import { named } from './module.cjs';   // Named exports work
`);

console.log("CJS → ESM (⚠️ Limited):");
console.log(`
  // CJS file importing ESM - MUST use dynamic import
  (async () => {
      const esmMod = await import('./module.mjs');
      console.log(esmMod.default);  // Default export
      console.log(esmMod.named);    // Named export
  })();

  // ❌ This does NOT work:
  // const mod = require('./module.mjs');  // Error!
`);

/**
 * ┌──────────────────────────────────────────────────────────────────────────┐
 * │                    DUAL PACKAGE SUPPORT                                  │
 * ├──────────────────────────────────────────────────────────────────────────┤
 * │                                                                          │
 * │   Publishing packages that work with both CJS and ESM                   │
 * │                                                                          │
 * │   package.json:                                                          │
 * │   {                                                                      │
 * │     "name": "my-package",                                               │
 * │     "type": "module",                                                   │
 * │     "main": "./dist/index.cjs",       // CJS entry                      │
 * │     "module": "./dist/index.mjs",     // ESM entry (bundlers)           │
 * │     "exports": {                                                        │
 * │       ".": {                                                            │
 * │         "import": "./dist/index.mjs", // ESM                            │
 * │         "require": "./dist/index.cjs" // CJS                            │
 * │       },                                                                │
 * │       "./utils": {                                                      │
 * │         "import": "./dist/utils.mjs",                                   │
 * │         "require": "./dist/utils.cjs"                                   │
 * │       }                                                                 │
 * │     }                                                                   │
 * │   }                                                                      │
 * │                                                                          │
 * └──────────────────────────────────────────────────────────────────────────┘
 */

console.log("─── Dual Package Support ───\n");

const dualPackageJson = {
    "name": "my-package",
    "type": "module",
    "main": "./dist/index.cjs",
    "module": "./dist/index.mjs",
    "exports": {
        ".": {
            "import": "./dist/index.mjs",
            "require": "./dist/index.cjs",
            "types": "./dist/index.d.ts"
        }
    }
};

console.log("Dual Package package.json:");
console.log(JSON.stringify(dualPackageJson, null, 2));

/**
 * ┌──────────────────────────────────────────────────────────────────────────┐
 * │                    __dirname / __filename EQUIVALENTS                    │
 * └──────────────────────────────────────────────────────────────────────────┘
 */

console.log("\n─── __dirname / __filename in ESM ───\n");

console.log("CommonJS (built-in):");
console.log("  console.log(__dirname);");
console.log("  console.log(__filename);\n");

console.log("ES Modules (workaround):");
const esmDirnameExample = `
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Or for relative paths:
const dataPath = new URL('./data.json', import.meta.url);
`;
console.log(esmDirnameExample);

/**
 * ┌──────────────────────────────────────────────────────────────────────────┐
 * │                    CIRCULAR DEPENDENCIES                                 │
 * ├──────────────────────────────────────────────────────────────────────────┤
 * │                                                                          │
 * │   CommonJS: Returns partial exports (what's exported so far)            │
 * │   ES Modules: Live bindings work, but values may be undefined           │
 * │                                                                          │
 * │   ESM handles circular deps better due to:                              │
 * │   • Static analysis (knows all imports upfront)                         │
 * │   • Live bindings (updates when values are set)                         │
 * │   • Link phase happens before execution                                 │
 * │                                                                          │
 * └──────────────────────────────────────────────────────────────────────────┘
 */

console.log("─── Circular Dependencies ───\n");

console.log("CommonJS Behavior:");
console.log("  • Returns partial exports (incomplete object)");
console.log("  • Can cause undefined values\n");

console.log("ESM Behavior:");
console.log("  • Live bindings eventually resolve");
console.log("  • May get TDZ errors if accessed too early");
console.log("  • Generally handles better due to static analysis\n");

/**
 * ┌──────────────────────────────────────────────────────────────────────────┐
 * │                    MIGRATION STRATEGIES                                  │
 * └──────────────────────────────────────────────────────────────────────────┘
 */

console.log("─── Migration: CJS to ESM ───\n");

const migrationSteps = `
Step 1: Update package.json
───────────────────────────
{
  "type": "module"
}

Step 2: Update file extensions (optional)
─────────────────────────────────────────
.js → .mjs  (explicit ESM)
Keep .js   (with "type": "module")

Step 3: Update imports
──────────────────────
// Before (CJS)
const fs = require('fs');
const { helper } = require('./utils');

// After (ESM)
import fs from 'fs';
import { helper } from './utils.js';  // Extension required!

Step 4: Update exports
──────────────────────
// Before (CJS)
module.exports = { foo, bar };

// After (ESM)
export { foo, bar };

Step 5: Fix __dirname/__filename
────────────────────────────────
import { fileURLToPath } from 'url';
import { dirname } from 'path';
const __dirname = dirname(fileURLToPath(import.meta.url));

Step 6: Fix dynamic requires
────────────────────────────
// Before
const config = require('./config.json');

// After
import config from './config.json' assert { type: 'json' };
// Or
const config = JSON.parse(await readFile('./config.json', 'utf8'));

Step 7: Update CJS dependencies
───────────────────────────────
// Usually just works (default import)
import cjsModule from 'cjs-only-package';
`;

console.log(migrationSteps);

// ============================================================================
// When to Use What
// ============================================================================
console.log("─── When to Use What ───\n");

console.log("Use CommonJS when:");
console.log("  • Legacy Node.js project");
console.log("  • Need dynamic require with variable paths");
console.log("  • Dependencies are CJS-only");
console.log("  • Quick scripts/prototypes\n");

console.log("Use ES Modules when:");
console.log("  • New projects");
console.log("  • Browser compatibility needed");
console.log("  • Tree shaking is important");
console.log("  • Using modern tooling");
console.log("  • Package will be used in ESM contexts\n");

// ============================================================================
// Cheat Sheet
// ============================================================================
console.log("╔══════════════════════════════════════════════════════════════════╗");
console.log("║           CJS vs ESM QUICK REFERENCE                            ║");
console.log("╠══════════════════════════════════════════════════════════════════╣");
console.log("║                                                                  ║");
console.log("║  COMMONJS:                      ES MODULES:                      ║");
console.log("║  require()                      import                           ║");
console.log("║  module.exports                 export                           ║");
console.log("║  Synchronous                    Asynchronous                     ║");
console.log("║  Runtime parsing                Static parsing                   ║");
console.log("║  Value copies                   Live bindings                    ║");
console.log("║  __dirname built-in             import.meta.url                  ║");
console.log("║  Extensions optional            Extensions required              ║");
console.log("║                                                                  ║");
console.log("║  INTEROP:                                                        ║");
console.log("║  ESM → CJS: import works        CJS → ESM: await import()       ║");
console.log("║                                                                  ║");
console.log("╚══════════════════════════════════════════════════════════════════╝\n");

module.exports = {
    syntaxComparison,
    dualPackageJson
};

console.log("═══ Next: JavaScript Bundlers ═══");
console.log("Run: node deep-dive/javaScript-module-systems/04-bundlers.js");
