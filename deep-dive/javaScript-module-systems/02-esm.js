/**
 * ═══════════════════════════════════════════════════════════════════════════
 * JAVASCRIPT MODULE SYSTEMS - ES Modules (ESM)
 * ═══════════════════════════════════════════════════════════════════════════
 *
 * ES Modules is the official standard for JavaScript modules, using import/export
 * syntax with static analysis and asynchronous loading.
 */

/**
 * ┌──────────────────────────────────────────────────────────────────────────┐
 * │                    ESM OVERVIEW                                          │
 * ├──────────────────────────────────────────────────────────────────────────┤
 * │                                                                          │
 * │   ES Modules (ESM) - The Standard                                       │
 * │   ════════════════════════════════                                       │
 * │                                                                          │
 * │   • Introduced in ES6 (2015)                                            │
 * │   • Static analysis at compile time                                     │
 * │   • Asynchronous loading (browser-friendly)                             │
 * │   • Live bindings (not copies)                                          │
 * │   • Strict mode by default                                              │
 * │   • Top-level await support                                             │
 * │                                                                          │
 * │   Node.js ESM Support:                                                   │
 * │   • v12: Behind --experimental-modules flag                             │
 * │   • v14: Stable support                                                 │
 * │   • v16+: Full feature parity                                           │
 * │                                                                          │
 * └──────────────────────────────────────────────────────────────────────────┘
 */

console.log("═══════════════════════════════════════════════════════════════");
console.log("           ES MODULES (ESM)");
console.log("═══════════════════════════════════════════════════════════════\n");

/**
 * ┌──────────────────────────────────────────────────────────────────────────┐
 * │                    ENABLING ESM                                          │
 * ├──────────────────────────────────────────────────────────────────────────┤
 * │                                                                          │
 * │   Method 1: Use .mjs extension                                          │
 * │   ────────────────────────────                                           │
 * │   module.mjs → Treated as ESM                                           │
 * │   module.js  → Treated as CJS                                           │
 * │                                                                          │
 * │   Method 2: package.json "type" field                                   │
 * │   ─────────────────────────────────                                      │
 * │   {                                                                      │
 * │     "type": "module"  // All .js files are ESM                          │
 * │   }                                                                      │
 * │                                                                          │
 * │   {                                                                      │
 * │     "type": "commonjs"  // All .js files are CJS (default)              │
 * │   }                                                                      │
 * │                                                                          │
 * │   Method 3: Hybrid approach                                              │
 * │   ─────────────────────────                                              │
 * │   "type": "module" + use .cjs for CommonJS files                        │
 * │                                                                          │
 * └──────────────────────────────────────────────────────────────────────────┘
 */

console.log("─── Enabling ESM ───\n");
console.log("1. Use .mjs extension");
console.log("2. Add \"type\": \"module\" to package.json");
console.log("3. Use .cjs for CommonJS in ESM projects\n");

/**
 * ┌──────────────────────────────────────────────────────────────────────────┐
 * │                    EXPORT SYNTAX                                         │
 * ├──────────────────────────────────────────────────────────────────────────┤
 * │                                                                          │
 * │   NAMED EXPORTS:                                                         │
 * │   ══════════════                                                         │
 * │                                                                          │
 * │   // Inline export                                                       │
 * │   export const name = 'value';                                          │
 * │   export function foo() {}                                              │
 * │   export class MyClass {}                                               │
 * │                                                                          │
 * │   // Export list                                                         │
 * │   const a = 1, b = 2;                                                   │
 * │   export { a, b };                                                      │
 * │                                                                          │
 * │   // Renamed export                                                      │
 * │   export { a as aliasA, b as aliasB };                                  │
 * │                                                                          │
 * │   DEFAULT EXPORT:                                                        │
 * │   ═══════════════                                                        │
 * │                                                                          │
 * │   export default function() {}                                          │
 * │   export default class {}                                               │
 * │   export default value;                                                 │
 * │                                                                          │
 * │   // Only ONE default per module!                                       │
 * │                                                                          │
 * └──────────────────────────────────────────────────────────────────────────┘
 */

console.log("─── Export Syntax ───\n");

// Demonstrating export patterns (shown as strings since this is CJS file)
const namedExports = `
// Named exports
export const VERSION = '1.0.0';
export function greet(name) {
    return \`Hello, \${name}!\`;
}
export class Calculator {
    add(a, b) { return a + b; }
}

// Export list with rename
const foo = 1;
const bar = 2;
export { foo, bar as barAlias };
`;

const defaultExport = `
// Default export - only one per module
export default class App {
    start() { console.log('Starting...'); }
}

// Or
export default function() {}

// Or
const config = { port: 3000 };
export default config;
`;

const mixedExports = `
// Mixed named and default
export const VERSION = '1.0.0';
export function helper() {}
export default class Main {}
`;

console.log("Named Exports:");
console.log(namedExports);
console.log("Default Export:");
console.log(defaultExport);

/**
 * ┌──────────────────────────────────────────────────────────────────────────┐
 * │                    IMPORT SYNTAX                                         │
 * ├──────────────────────────────────────────────────────────────────────────┤
 * │                                                                          │
 * │   NAMED IMPORTS:                                                         │
 * │   ══════════════                                                         │
 * │                                                                          │
 * │   import { foo, bar } from './module.js';                               │
 * │   import { foo as f } from './module.js';  // Rename                    │
 * │   import * as mod from './module.js';       // Namespace                │
 * │                                                                          │
 * │   DEFAULT IMPORTS:                                                       │
 * │   ════════════════                                                       │
 * │                                                                          │
 * │   import MyDefault from './module.js';                                  │
 * │   import def, { named } from './module.js';  // Mixed                   │
 * │                                                                          │
 * │   SIDE-EFFECT IMPORT:                                                    │
 * │   ═══════════════════                                                    │
 * │                                                                          │
 * │   import './polyfill.js';  // Execute only, no bindings                 │
 * │                                                                          │
 * │   DYNAMIC IMPORT:                                                        │
 * │   ═══════════════                                                        │
 * │                                                                          │
 * │   const mod = await import('./module.js');  // Returns Promise          │
 * │                                                                          │
 * └──────────────────────────────────────────────────────────────────────────┘
 */

console.log("\n─── Import Syntax ───\n");

const importExamples = `
// Named imports
import { foo, bar } from './utils.js';

// Rename on import
import { foo as myFoo } from './utils.js';

// Namespace import (all exports as object)
import * as utils from './utils.js';
utils.foo();

// Default import
import App from './App.js';

// Mixed (default + named)
import App, { VERSION, helper } from './App.js';

// Side-effect only (runs module, no bindings)
import './init.js';

// Dynamic import (async)
const module = await import('./dynamic.js');

// Dynamic with destructuring
const { foo } = await import('./dynamic.js');
`;

console.log("Import Examples:");
console.log(importExamples);

/**
 * ┌──────────────────────────────────────────────────────────────────────────┐
 * │                    LIVE BINDINGS                                         │
 * ├──────────────────────────────────────────────────────────────────────────┤
 * │                                                                          │
 * │   ESM exports are LIVE BINDINGS, not copies!                            │
 * │                                                                          │
 * │   CommonJS (copies):          ESM (live bindings):                      │
 * │   ══════════════════          ═══════════════════                        │
 * │                                                                          │
 * │   // counter.cjs               // counter.mjs                           │
 * │   let count = 0;               let count = 0;                           │
 * │   exports.count = count;       export { count };                        │
 * │   exports.inc = () => count++; export function inc() { count++; }       │
 * │                                                                          │
 * │   // usage.cjs                 // usage.mjs                             │
 * │   const {count, inc} = ...;    import {count, inc} from '...';          │
 * │   console.log(count); // 0     console.log(count); // 0                 │
 * │   inc();                       inc();                                   │
 * │   console.log(count); // 0 ❌  console.log(count); // 1 ✅              │
 * │   (got copy at require time)  (live binding updates)                    │
 * │                                                                          │
 * └──────────────────────────────────────────────────────────────────────────┘
 */

console.log("─── Live Bindings ───\n");

console.log("ESM exports are LIVE BINDINGS:");
console.log("  - Changes to exported values are visible to importers");
console.log("  - Unlike CJS which copies values at require time");
console.log("  - Enables real-time module state sharing\n");

const liveBindingExample = `
// counter.mjs
export let count = 0;
export function increment() {
    count++;  // Modifies the export
}

// main.mjs
import { count, increment } from './counter.mjs';

console.log(count);  // 0
increment();
console.log(count);  // 1 ← Live binding updated!
`;

console.log("Example:");
console.log(liveBindingExample);

/**
 * ┌──────────────────────────────────────────────────────────────────────────┐
 * │                    STATIC ANALYSIS                                       │
 * ├──────────────────────────────────────────────────────────────────────────┤
 * │                                                                          │
 * │   ESM imports/exports are analyzed at compile time (before execution)   │
 * │                                                                          │
 * │   BENEFITS:                                                              │
 * │   • Tree shaking (dead code elimination)                                │
 * │   • Faster module resolution                                            │
 * │   • Better IDE support (autocomplete, refactoring)                      │
 * │   • Circular dependency detection                                       │
 * │                                                                          │
 * │   CONSTRAINTS:                                                           │
 * │   • import/export must be at top level                                  │
 * │   • Cannot use variables in import paths                                │
 * │   • Cannot conditionally import (use dynamic import instead)            │
 * │                                                                          │
 * │   ❌ INVALID:                     ✅ VALID:                              │
 * │   if (cond) {                     if (cond) {                           │
 * │       import { x } from 'y';         const m = await import('y');       │
 * │   }                               }                                      │
 * │                                                                          │
 * │   import { x } from \`mod\`;        import { x } from './mod.js';        │
 * │                                                                          │
 * └──────────────────────────────────────────────────────────────────────────┘
 */

console.log("─── Static Analysis ───\n");

console.log("Static Analysis Benefits:");
console.log("  ✓ Tree shaking (remove unused exports)");
console.log("  ✓ Faster bundling");
console.log("  ✓ IDE autocomplete and refactoring");
console.log("  ✓ Early error detection\n");

console.log("Static Analysis Constraints:");
console.log("  ✗ No dynamic import paths (use dynamic import())");
console.log("  ✗ No conditional imports at top level");
console.log("  ✗ Must be at module top level");

/**
 * ┌──────────────────────────────────────────────────────────────────────────┐
 * │                    RE-EXPORTS                                            │
 * └──────────────────────────────────────────────────────────────────────────┘
 */

console.log("\n─── Re-exports (Barrel Files) ───\n");

const reexportExamples = `
// index.js - Re-export from multiple modules

// Re-export all
export * from './utils.js';
export * from './helpers.js';

// Re-export specific
export { foo, bar } from './utils.js';

// Re-export with rename
export { foo as utilFoo } from './utils.js';

// Re-export default as named
export { default as Utils } from './utils.js';

// Re-export named as default
export { namedExport as default } from './utils.js';

// Usage
import { foo, bar, helper } from './index.js';  // Single import point
`;

console.log("Re-export (Barrel) Patterns:");
console.log(reexportExamples);

/**
 * ┌──────────────────────────────────────────────────────────────────────────┐
 * │                    TOP-LEVEL AWAIT                                       │
 * └──────────────────────────────────────────────────────────────────────────┘
 */

console.log("─── Top-Level Await ───\n");

const topLevelAwait = `
// config.mjs - Top-level await (ESM only)
const response = await fetch('https://api.example.com/config');
export const config = await response.json();

// database.mjs
const connection = await db.connect();
export { connection };

// main.mjs
import { config } from './config.mjs';  // Waits for config to load
console.log(config);
`;

console.log("Top-Level Await Example:");
console.log(topLevelAwait);
console.log("Notes:");
console.log("  - Only works in ES modules");
console.log("  - Blocks importing modules until promise resolves");
console.log("  - Great for initialization code\n");

/**
 * ┌──────────────────────────────────────────────────────────────────────────┐
 * │                    DYNAMIC IMPORTS                                       │
 * └──────────────────────────────────────────────────────────────────────────┘
 */

console.log("─── Dynamic Imports ───\n");

const dynamicImport = `
// Conditional loading
if (user.isAdmin) {
    const { AdminPanel } = await import('./admin.js');
    new AdminPanel();
}

// Route-based code splitting
const routes = {
    '/home': () => import('./pages/Home.js'),
    '/about': () => import('./pages/About.js'),
    '/contact': () => import('./pages/Contact.js')
};

async function loadRoute(path) {
    const module = await routes[path]();
    return module.default;
}

// Lazy loading with fallback
async function loadFeature(name) {
    try {
        return await import(\`./features/\${name}.js\`);
    } catch (e) {
        console.error('Feature not found:', name);
        return null;
    }
}
`;

console.log("Dynamic Import Use Cases:");
console.log(dynamicImport);

/**
 * ┌──────────────────────────────────────────────────────────────────────────┐
 * │                    import.meta                                           │
 * └──────────────────────────────────────────────────────────────────────────┘
 */

console.log("─── import.meta ───\n");

const importMeta = `
// import.meta properties (ESM)

// File URL of current module
console.log(import.meta.url);
// file:///path/to/module.js

// Get __dirname equivalent
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Resolve relative paths
const dataPath = new URL('./data.json', import.meta.url);

// Check if running as main module
if (import.meta.url === \`file://\${process.argv[1]}\`) {
    console.log('Running as main module');
}
`;

console.log("import.meta Object:");
console.log(importMeta);

// ============================================================================
// ESM Cheat Sheet
// ============================================================================
console.log("\n╔══════════════════════════════════════════════════════════════════╗");
console.log("║           ES MODULES CHEAT SHEET                                ║");
console.log("╠══════════════════════════════════════════════════════════════════╣");
console.log("║                                                                  ║");
console.log("║  EXPORTS:                                                        ║");
console.log("║  export const foo = 1;           // Named export               ║");
console.log("║  export { foo, bar };            // Export list                ║");
console.log("║  export { foo as alias };        // Rename                     ║");
console.log("║  export default value;           // Default export             ║");
console.log("║  export * from './mod.js';       // Re-export all             ║");
console.log("║                                                                  ║");
console.log("║  IMPORTS:                                                        ║");
console.log("║  import { foo } from './mod.js';       // Named               ║");
console.log("║  import { foo as f } from './mod.js';  // Rename              ║");
console.log("║  import * as mod from './mod.js';      // Namespace           ║");
console.log("║  import def from './mod.js';           // Default             ║");
console.log("║  import def, { foo } from './mod.js';  // Mixed               ║");
console.log("║  import './mod.js';                    // Side-effect         ║");
console.log("║  const m = await import('./mod.js');   // Dynamic             ║");
console.log("║                                                                  ║");
console.log("║  KEY FEATURES:                                                   ║");
console.log("║  • Static analysis (tree shaking)                               ║");
console.log("║  • Live bindings (not copies)                                   ║");
console.log("║  • Strict mode by default                                       ║");
console.log("║  • Top-level await                                              ║");
console.log("║  • import.meta.url                                              ║");
console.log("║                                                                  ║");
console.log("╚══════════════════════════════════════════════════════════════════╝\n");

// For CJS compatibility
module.exports = {
    info: "This file demonstrates ESM concepts (run in ESM context for full features)"
};

console.log("═══ Next: CJS vs ESM Comparison ═══");
console.log("Run: node deep-dive/javaScript-module-systems/03-cjs-vs-esm.js");
