/**
 * BUNDLERS & MODULES: 02 - ES Modules (ESM)
 *
 * ONE CONCEPT: The official JavaScript module standard — import/export
 */


// =============================================================================
// ES MODULES SYNTAX
// =============================================================================

console.log('=== ES Modules Syntax ===\n');

/**
 *   ┌──────────────────────────────────────────────────────────────────────┐
 *   │  ES MODULE SYNTAX                                                   │
 *   ├──────────────────────────────────────────────────────────────────────┤
 *   │                                                                      │
 *   │  NAMED EXPORTS:                      NAMED IMPORTS:                  │
 *   │  export const add = (a,b) => a+b;    import { add } from './math';  │
 *   │  export function sub(a,b) {}          import { add, sub } from './m';│
 *   │  export class User {}                 import { add as plus } from…  │
 *   │                                       import * as math from './m';   │
 *   │                                                                      │
 *   │  DEFAULT EXPORT:                      DEFAULT IMPORT:                │
 *   │  export default function() {}         import myFn from './mod';      │
 *   │  export default class User {}         import Whatever from './mod';  │
 *   │  ← Only ONE per module               ← Any name works              │
 *   │                                                                      │
 *   │  MIXED:                               MIXED IMPORT:                  │
 *   │  export default App;                  import App, { utils } from…   │
 *   │  export { utils };                                                   │
 *   │                                                                      │
 *   │  RE-EXPORT:                                                          │
 *   │  export { add } from './math';        ← Barrel exports              │
 *   │  export * from './utils';                                            │
 *   │  export { default as Math } from…                                   │
 *   │                                                                      │
 *   └──────────────────────────────────────────────────────────────────────┘
 *
 */

console.log('Named:   export { add }     →  import { add } from ...');
console.log('Default: export default fn  →  import fn from ...');
console.log('All:     export *           →  import * as mod from ...');
console.log('Re-export: export { x } from "./other"');


// =============================================================================
// HOW ESM WORKS INTERNALLY
// =============================================================================

console.log('\n=== ESM Internal Phases ===\n');

/**
 *   ┌──────────────────────────────────────────────────────────────────────┐
 *   │  ESM THREE-PHASE LOADING                                            │
 *   ├──────────────────────────────────────────────────────────────────────┤
 *   │                                                                      │
 *   │  Phase 1: PARSING (Static Analysis)                                  │
 *   │  ┌──────────────────────────────────────────┐                       │
 *   │  │ Read source → Find import/export         │                       │
 *   │  │ Build dependency graph                   │                       │
 *   │  │ NO CODE EXECUTED YET                     │                       │
 *   │  └──────────────────────────────────────────┘                       │
 *   │         │                                                            │
 *   │         ▼                                                            │
 *   │  Phase 2: INSTANTIATION (Linking)                                    │
 *   │  ┌──────────────────────────────────────────┐                       │
 *   │  │ Create module records                    │                       │
 *   │  │ Link imports to exports (live bindings)  │                       │
 *   │  │ Allocate memory for exports              │                       │
 *   │  │ NO CODE EXECUTED YET                     │                       │
 *   │  └──────────────────────────────────────────┘                       │
 *   │         │                                                            │
 *   │         ▼                                                            │
 *   │  Phase 3: EVALUATION (Execution)                                     │
 *   │  ┌──────────────────────────────────────────┐                       │
 *   │  │ Execute code top-down                    │                       │
 *   │  │ Fill in export values                    │                       │
 *   │  │ Depth-first, post-order                  │                       │
 *   │  └──────────────────────────────────────────┘                       │
 *   │                                                                      │
 *   │  CJS: Single phase (load + execute immediately)                     │
 *   │  ESM: Three phases (parse → link → execute)                         │
 *   │                                                                      │
 *   └──────────────────────────────────────────────────────────────────────┘
 *
 */

console.log('Phase 1: Parse → find all imports/exports (static)');
console.log('Phase 2: Link  → connect imports to exports (live bindings)');
console.log('Phase 3: Eval  → execute code, fill values');


// =============================================================================
// LIVE BINDINGS
// =============================================================================

console.log('\n=== Live Bindings (ESM vs CJS) ===\n');

/**
 *   ┌──────────────────────────────────────────────────────────────────────┐
 *   │  LIVE BINDINGS: ESM exports are REFERENCES, not copies              │
 *   ├──────────────────────────────────────────────────────────────────────┤
 *   │                                                                      │
 *   │  CJS (Copy):                                                        │
 *   │  ┌─────────────┐    require     ┌─────────────┐                    │
 *   │  │ counter = 0 │ ────────────▶ │ value = 0   │                    │
 *   │  │ counter++   │               │ (snapshot)  │                    │
 *   │  │ counter = 1 │               │ still 0!    │ ← Stale!           │
 *   │  └─────────────┘               └─────────────┘                    │
 *   │                                                                      │
 *   │  ESM (Live Binding):                                                │
 *   │  ┌─────────────┐    import     ┌─────────────┐                    │
 *   │  │ counter = 0 │ ◀──────────▶ │ counter ────┼──▶ same memory     │
 *   │  │ counter++   │               │ always      │                    │
 *   │  │ counter = 1 │               │ current!    │ ← Up to date!      │
 *   │  └─────────────┘               └─────────────┘                    │
 *   │                                                                      │
 *   └──────────────────────────────────────────────────────────────────────┘
 *
 */

// Simulating CJS (copy)
console.log('CJS behavior (copy):');
let cjsCounter = 0;
const cjsExport = cjsCounter;  // Snapshot
cjsCounter++;
console.log('  Original:', cjsCounter);  // 1
console.log('  Imported:', cjsExport);   // 0 — stale copy!

// Simulating ESM (live binding via getter)
console.log('\nESM behavior (live binding):');
const esmModule = { _counter: 0 };
Object.defineProperty(esmModule, 'counter', {
  get() { return esmModule._counter; }
});
esmModule._counter++;
console.log('  Original:', esmModule._counter);  // 1
console.log('  Imported:', esmModule.counter);    // 1 — live!


// =============================================================================
// STATIC STRUCTURE
// =============================================================================

console.log('\n=== Static Structure ===\n');

/**
 *   ┌──────────────────────────────────────────────────────────────────────┐
 *   │  ESM IS STATIC — import/export must be at top level                 │
 *   ├──────────────────────────────────────────────────────────────────────┤
 *   │                                                                      │
 *   │  ✓ ALLOWED:                                                         │
 *   │  import { add } from './math.js';    ← Top level                   │
 *   │  export const x = 10;                ← Top level                   │
 *   │                                                                      │
 *   │  ✗ NOT ALLOWED:                                                     │
 *   │  if (cond) import { x } from './a';  ← Inside block!              │
 *   │  function foo() { export const y; }  ← Inside function!           │
 *   │                                                                      │
 *   │  WHY THIS MATTERS:                                                   │
 *   │  • Dependency graph known BEFORE execution                          │
 *   │  • Enables TREE SHAKING (remove unused exports)                     │
 *   │  • Enables static analysis (IDEs, linters)                          │
 *   │  • Enables circular dependency resolution                           │
 *   │                                                                      │
 *   │  For dynamic imports: import('./module.js') → Promise               │
 *   │                                                                      │
 *   └──────────────────────────────────────────────────────────────────────┘
 *
 */

console.log('Static imports: bundler knows the dependency graph at build time');
console.log('This enables tree-shaking (dead code elimination)');
console.log('Dynamic import(): import("./mod.js").then(m => ...) for lazy loading');


// =============================================================================
// ESM IN BROWSERS
// =============================================================================

console.log('\n=== ESM in Browsers ===\n');

/**
 *   ┌──────────────────────────────────────────────────────────────────────┐
 *   │  BROWSER ESM                                                        │
 *   ├──────────────────────────────────────────────────────────────────────┤
 *   │                                                                      │
 *   │  <script type="module" src="app.js"></script>                       │
 *   │                                                                      │
 *   │  Differences from regular <script>:                                  │
 *   │  1. Deferred by default (like defer attribute)                      │
 *   │  2. Strict mode automatically                                       │
 *   │  3. Own scope (no global pollution)                                  │
 *   │  4. CORS required for cross-origin                                  │
 *   │  5. Executed only once (even if imported multiple times)            │
 *   │  6. Top-level await supported                                       │
 *   │                                                                      │
 *   │  Loading:                                                            │
 *   │  <script>          ── Parse HTML ── Download JS ── Execute ──       │
 *   │                                     ↑ blocks parsing                │
 *   │                                                                      │
 *   │  <script type="module">                                              │
 *   │  ── Parse HTML ──────────────────── Execute ──                      │
 *   │     ↓ download in parallel          ↑ after HTML parsed             │
 *   │                                                                      │
 *   └──────────────────────────────────────────────────────────────────────┘
 *
 */

console.log('<script type="module">:');
console.log('  - Deferred (runs after HTML parsed)');
console.log('  - Strict mode by default');
console.log('  - Own scope per module');
console.log('  - Supports top-level await');


// =============================================================================
// ESM IN NODE.JS
// =============================================================================

console.log('\n=== ESM in Node.js ===\n');

/**
 *   ┌──────────────────────────────────────────────────────────────────────┐
 *   │  USING ESM IN NODE.JS                                               │
 *   ├──────────────────────────────────────────────────────────────────────┤
 *   │                                                                      │
 *   │  Option 1: .mjs extension                                           │
 *   │  // math.mjs                                                        │
 *   │  export const add = (a, b) => a + b;                                │
 *   │                                                                      │
 *   │  Option 2: "type": "module" in package.json                         │
 *   │  {                                                                   │
 *   │    "type": "module"    ← All .js files treated as ESM               │
 *   │  }                                                                   │
 *   │  // Then use .cjs for CommonJS files                                │
 *   │                                                                      │
 *   │  Differences from CJS in Node:                                       │
 *   │  • No require, module, exports, __filename, __dirname               │
 *   │  • Use import.meta.url instead of __filename                        │
 *   │  • Must include file extension: import './utils.js'                 │
 *   │  • Can import CJS: import cjsMod from './legacy.cjs'               │
 *   │  • CJS cannot import() ESM synchronously                           │
 *   │                                                                      │
 *   └──────────────────────────────────────────────────────────────────────┘
 *
 */

console.log('Node ESM options:');
console.log('  1. Use .mjs extension');
console.log('  2. Add "type": "module" to package.json');
console.log('');
console.log('No __filename in ESM, use:');
console.log('  import.meta.url');
console.log('  new URL(".", import.meta.url).pathname');


// =============================================================================
// BARREL EXPORTS (Index Files)
// =============================================================================

console.log('\n=== Barrel Exports ===\n');

/**
 *   ┌──────────────────────────────────────────────────────────────────────┐
 *   │  BARREL PATTERN                                                     │
 *   ├──────────────────────────────────────────────────────────────────────┤
 *   │                                                                      │
 *   │  components/                                                         │
 *   │  ├── Button.js      export default Button                           │
 *   │  ├── Modal.js       export default Modal                            │
 *   │  ├── Card.js        export default Card                             │
 *   │  └── index.js       ← Barrel file                                  │
 *   │                                                                      │
 *   │  // index.js (barrel)                                                │
 *   │  export { default as Button } from './Button.js';                   │
 *   │  export { default as Modal } from './Modal.js';                     │
 *   │  export { default as Card } from './Card.js';                       │
 *   │                                                                      │
 *   │  // Usage                                                            │
 *   │  import { Button, Modal } from './components';                      │
 *   │  // Instead of:                                                      │
 *   │  // import Button from './components/Button';                       │
 *   │  // import Modal from './components/Modal';                         │
 *   │                                                                      │
 *   │  ⚠ WARNING: Barrels can hurt tree-shaking!                         │
 *   │  Importing ONE thing may load ALL re-exports.                       │
 *   │  Modern bundlers handle this, but be aware.                         │
 *   │                                                                      │
 *   └──────────────────────────────────────────────────────────────────────┘
 *
 */

console.log('Barrel: index.js re-exports from multiple files');
console.log('Pros: clean imports');
console.log('Cons: can hurt tree-shaking if bundler not smart enough');


// =============================================================================
// INTERVIEW: What to Say
// =============================================================================

/**
 * "ES Modules are the official JavaScript module standard. You export with
 * export and import with import. The key difference from CommonJS is that
 * ESM is static — all imports and exports must be at the top level, which
 * lets bundlers analyze the dependency graph before execution and enables
 * tree-shaking.
 *
 * ESM uses live bindings, not copies. If a module exports a counter and
 * increments it, importers see the updated value. CJS gives you a snapshot.
 *
 * In browsers, <script type='module'> is deferred by default, runs in strict
 * mode, and has its own scope. In Node.js, you use .mjs extension or set
 * "type": "module" in package.json.
 *
 * The ESM loading has three phases: parse (find imports/exports), link
 * (connect them with live bindings), and evaluate (execute code). This
 * three-phase approach handles circular dependencies better than CJS.
 *
 * For dynamic loading, there's import() which returns a Promise. This
 * enables code-splitting and lazy loading of routes or features."
 */


// RUN: node docs/29-bundlers-modules/02-es-modules.js
