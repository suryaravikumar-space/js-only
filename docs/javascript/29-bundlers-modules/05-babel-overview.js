/**
 * BUNDLERS & MODULES: 05 - Babel Overview
 *
 * ONE CONCEPT: Babel transpiles modern JS to older JS for browser compatibility
 */


// =============================================================================
// WHAT IS BABEL?
// =============================================================================

console.log('=== What is Babel? ===\n');

/**
 *   ┌──────────────────────────────────────────────────────────────────────┐
 *   │  BABEL: JavaScript Compiler (Transpiler)                            │
 *   ├──────────────────────────────────────────────────────────────────────┤
 *   │                                                                      │
 *   │  YOUR CODE (Modern JS):            OUTPUT (Older JS):               │
 *   │                                                                      │
 *   │  const add = (a, b) => a + b;      var add = function(a, b) {      │
 *   │                                      return a + b;                  │
 *   │  class User {                       };                               │
 *   │    name = 'Alice';                                                   │
 *   │  }                                  function User() {               │
 *   │                                      this.name = 'Alice';           │
 *   │  const x = obj?.foo ?? 'def';      }                                │
 *   │                                                                      │
 *   │                                     var _obj$foo;                    │
 *   │                                     var x = (_obj$foo = obj ===     │
 *   │                                       null ? void 0 : obj.foo)      │
 *   │                                       != null ? _obj$foo : 'def';   │
 *   │                                                                      │
 *   │  Babel does NOT bundle. It only transforms syntax.                  │
 *   │  Bundlers (webpack/vite) call Babel as a transform step.            │
 *   │                                                                      │
 *   └──────────────────────────────────────────────────────────────────────┘
 *
 */

console.log('Babel = transpiler (source-to-source compiler)');
console.log('Input:  modern JS (ES2024, JSX, TypeScript)');
console.log('Output: compatible JS (ES5 for old browsers)');


// =============================================================================
// HOW BABEL WORKS
// =============================================================================

console.log('\n=== How Babel Works ===\n');

/**
 *   ┌──────────────────────────────────────────────────────────────────────┐
 *   │  BABEL PIPELINE                                                     │
 *   ├──────────────────────────────────────────────────────────────────────┤
 *   │                                                                      │
 *   │  Source Code                                                         │
 *   │      │                                                               │
 *   │      ▼                                                               │
 *   │  ┌──────────────────┐                                               │
 *   │  │  1. PARSE         │  Source → AST (Abstract Syntax Tree)          │
 *   │  │  (@babel/parser)  │  const x = 1;  →  { type: 'VariableDecl',   │
 *   │  └──────────────────┘                     kind: 'const', ... }      │
 *   │      │                                                               │
 *   │      ▼                                                               │
 *   │  ┌──────────────────┐                                               │
 *   │  │  2. TRANSFORM     │  AST → Modified AST                          │
 *   │  │  (plugins)        │  Plugins visit AST nodes and transform them  │
 *   │  └──────────────────┘  'const' → 'var', arrow → function, etc.     │
 *   │      │                                                               │
 *   │      ▼                                                               │
 *   │  ┌──────────────────┐                                               │
 *   │  │  3. GENERATE      │  Modified AST → Output Source Code            │
 *   │  │  (@babel/generator│  + Source Map                                 │
 *   │  └──────────────────┘                                               │
 *   │      │                                                               │
 *   │      ▼                                                               │
 *   │  Output Code + Source Map                                            │
 *   │                                                                      │
 *   └──────────────────────────────────────────────────────────────────────┘
 *
 */

console.log('1. PARSE:     source code → AST');
console.log('2. TRANSFORM: AST → modified AST (via plugins)');
console.log('3. GENERATE:  modified AST → output code + sourcemap');


// =============================================================================
// BABEL ARCHITECTURE: PLUGINS & PRESETS
// =============================================================================

console.log('\n=== Plugins & Presets ===\n');

/**
 *   ┌──────────────────────────────────────────────────────────────────────┐
 *   │  PLUGINS vs PRESETS                                                  │
 *   ├──────────────────────────────────────────────────────────────────────┤
 *   │                                                                      │
 *   │  PLUGIN = One transform                                              │
 *   │  @babel/plugin-transform-arrow-functions                             │
 *   │  @babel/plugin-transform-classes                                     │
 *   │  @babel/plugin-transform-optional-chaining                           │
 *   │  ← You'd need 50+ plugins for full modern JS!                      │
 *   │                                                                      │
 *   │  PRESET = Collection of plugins                                      │
 *   │  @babel/preset-env          ← All standard JS transforms            │
 *   │  @babel/preset-react        ← JSX → React.createElement             │
 *   │  @babel/preset-typescript   ← TypeScript → JavaScript               │
 *   │                                                                      │
 *   │  // babel.config.json                                                │
 *   │  {                                                                   │
 *   │    "presets": [                                                      │
 *   │      ["@babel/preset-env", {                                         │
 *   │        "targets": "> 0.25%, not dead"                               │
 *   │      }],                                                             │
 *   │      "@babel/preset-react",                                          │
 *   │      "@babel/preset-typescript"                                      │
 *   │    ]                                                                 │
 *   │  }                                                                   │
 *   │                                                                      │
 *   └──────────────────────────────────────────────────────────────────────┘
 *
 */

console.log('Plugin: single transform (arrow functions, classes, etc.)');
console.log('Preset: bundle of plugins (@babel/preset-env = all standard)');
console.log('');
console.log('Key presets:');
console.log('  @babel/preset-env        → Modern JS → compatible JS');
console.log('  @babel/preset-react      → JSX → createElement');
console.log('  @babel/preset-typescript  → TS → JS (strips types only)');


// =============================================================================
// @babel/preset-env & BROWSERSLIST
// =============================================================================

console.log('\n=== preset-env & Browserslist ===\n');

/**
 *   ┌──────────────────────────────────────────────────────────────────────┐
 *   │  SMART TRANSPILATION WITH TARGETS                                   │
 *   ├──────────────────────────────────────────────────────────────────────┤
 *   │                                                                      │
 *   │  Without targets: Transpile EVERYTHING to ES5                        │
 *   │  With targets:    Only transpile what browsers DON'T support         │
 *   │                                                                      │
 *   │  // babel.config.json                                                │
 *   │  {                                                                   │
 *   │    "presets": [["@babel/preset-env", {                               │
 *   │      "targets": {                                                    │
 *   │        "chrome": "90",      ← Chrome 90+ supports most ES2021      │
 *   │        "firefox": "88",     ← Fewer transforms needed              │
 *   │        "safari": "14"                                                │
 *   │      }                                                               │
 *   │    }]]                                                               │
 *   │  }                                                                   │
 *   │                                                                      │
 *   │  // Or use browserslist (recommended)                                │
 *   │  // .browserslistrc                                                  │
 *   │  > 0.5%                                                              │
 *   │  last 2 versions                                                     │
 *   │  not dead                                                            │
 *   │  not IE 11                                                           │
 *   │                                                                      │
 *   │  Result: smaller output, fewer transforms, faster code              │
 *   │                                                                      │
 *   └──────────────────────────────────────────────────────────────────────┘
 *
 */

console.log('Browserslist controls what Babel transforms:');
console.log('  Targeting modern browsers → less transpilation → smaller bundle');
console.log('  Targeting IE 11 → heavy transpilation → bigger bundle');


// =============================================================================
// POLYFILLS vs TRANSPILATION
// =============================================================================

console.log('\n=== Polyfills vs Transpilation ===\n');

/**
 *   ┌──────────────────────────────────────────────────────────────────────┐
 *   │  TWO TYPES OF COMPATIBILITY                                         │
 *   ├──────────────────────────────────────────────────────────────────────┤
 *   │                                                                      │
 *   │  TRANSPILATION (Syntax):                                             │
 *   │  Babel can rewrite syntax to older equivalents                      │
 *   │                                                                      │
 *   │  const x = a ?? b;          →  var x = a != null ? a : b;          │
 *   │  class Foo { }              →  function Foo() { }                   │
 *   │  const [a, ...b] = arr;     →  var a = arr[0], b = arr.slice(1);   │
 *   │                                                                      │
 *   │  POLYFILL (API):                                                     │
 *   │  Babel CANNOT rewrite missing APIs — must add implementations       │
 *   │                                                                      │
 *   │  Array.prototype.includes   →  Need polyfill code                   │
 *   │  Promise                    →  Need polyfill code                   │
 *   │  Object.entries             →  Need polyfill code                   │
 *   │  Map, Set, WeakMap          →  Need polyfill code                   │
 *   │                                                                      │
 *   │  Solution: core-js (polyfill library)                               │
 *   │  preset-env can auto-inject only needed polyfills                   │
 *   │                                                                      │
 *   │  {                                                                   │
 *   │    "presets": [["@babel/preset-env", {                               │
 *   │      "useBuiltIns": "usage",   ← Auto-import needed polyfills      │
 *   │      "corejs": 3               ← core-js version                   │
 *   │    }]]                                                               │
 *   │  }                                                                   │
 *   │                                                                      │
 *   └──────────────────────────────────────────────────────────────────────┘
 *
 */

console.log('Transpilation: rewrite SYNTAX (arrow fn → function)');
console.log('Polyfill: add missing APIs (Promise, Array.includes)');
console.log('');
console.log('useBuiltIns options:');
console.log('  "false"   → no polyfills (you handle it)');
console.log('  "entry"   → import all polyfills for your targets');
console.log('  "usage"   → import only polyfills you actually use (best)');


// =============================================================================
// BABEL CONFIG FILES
// =============================================================================

console.log('\n=== Config Files ===\n');

/**
 *   ┌──────────────────────────────────────────────────────────────────────┐
 *   │  BABEL CONFIGURATION                                                │
 *   ├──────────────────────────────────────────────────────────────────────┤
 *   │                                                                      │
 *   │  babel.config.json  ← Project-wide (monorepo root)                 │
 *   │  babel.config.js    ← Project-wide (dynamic config)                │
 *   │  .babelrc.json      ← Directory-specific (per package)             │
 *   │  .babelrc           ← Same as .babelrc.json                        │
 *   │  package.json       ← "babel" key                                  │
 *   │                                                                      │
 *   │  // Typical React project:                                           │
 *   │  // babel.config.json                                                │
 *   │  {                                                                   │
 *   │    "presets": [                                                      │
 *   │      ["@babel/preset-env", { "targets": "defaults" }],              │
 *   │      ["@babel/preset-react", { "runtime": "automatic" }],           │
 *   │      "@babel/preset-typescript"                                      │
 *   │    ],                                                                │
 *   │    "plugins": [                                                      │
 *   │      "@babel/plugin-proposal-decorators"                             │
 *   │    ]                                                                 │
 *   │  }                                                                   │
 *   │                                                                      │
 *   └──────────────────────────────────────────────────────────────────────┘
 *
 */

console.log('babel.config.json → project-wide config');
console.log('.babelrc.json     → directory-specific config');
console.log('Presets run LAST to FIRST, plugins run FIRST to LAST');


// =============================================================================
// IS BABEL STILL NEEDED?
// =============================================================================

console.log('\n=== Is Babel Still Needed? ===\n');

/**
 *   ┌──────────────────────────────────────────────────────────────────────┐
 *   │  BABEL IN 2024+                                                     │
 *   ├──────────────────────────────────────────────────────────────────────┤
 *   │                                                                      │
 *   │  ALTERNATIVES:                                                       │
 *   │  • SWC (Rust) — used by Next.js, 20-70x faster                     │
 *   │  • esbuild (Go) — used by Vite, extremely fast                     │
 *   │  • TypeScript (tsc) — strips types + some transforms               │
 *   │                                                                      │
 *   │  BABEL STILL USED FOR:                                               │
 *   │  • Custom plugins (AST transforms)                                  │
 *   │  • Macro systems (babel-plugin-macros)                              │
 *   │  • Specific proposals (decorators, pipeline)                        │
 *   │  • Legacy projects / CRA                                            │
 *   │                                                                      │
 *   │  TREND: SWC/esbuild replacing Babel for speed                       │
 *   │  Babel's plugin ecosystem is still unmatched                        │
 *   │                                                                      │
 *   └──────────────────────────────────────────────────────────────────────┘
 *
 */

console.log('Babel: most configurable, largest plugin ecosystem');
console.log('SWC:   20-70x faster (Rust), used by Next.js');
console.log('esbuild: fastest, used by Vite');
console.log('Trend: speed tools for builds, Babel for custom transforms');


// =============================================================================
// INTERVIEW: What to Say
// =============================================================================

/**
 * "Babel is a JavaScript transpiler that converts modern syntax into
 * compatible code for older browsers. It works in three steps: parse
 * source into an AST, transform the AST using plugins, and generate
 * output code with source maps.
 *
 * Plugins handle individual transforms — one for arrow functions, one for
 * classes, etc. Presets bundle related plugins: preset-env for standard JS,
 * preset-react for JSX, preset-typescript for TS.
 *
 * The key insight is the difference between transpilation and polyfills.
 * Babel can rewrite syntax like optional chaining into equivalent older code,
 * but APIs like Promise or Array.includes need polyfill code injected.
 * preset-env with useBuiltIns: 'usage' auto-imports only the polyfills you
 * actually need based on your browserslist targets.
 *
 * In modern projects, SWC (Rust) and esbuild (Go) are replacing Babel for
 * speed. Next.js uses SWC, Vite uses esbuild. But Babel's plugin system
 * is still valuable for custom AST transforms."
 */


// RUN: node docs/29-bundlers-modules/05-babel-overview.js
