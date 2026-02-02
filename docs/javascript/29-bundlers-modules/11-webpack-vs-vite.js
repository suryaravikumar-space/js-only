/**
 * BUNDLERS & MODULES: 11 - Webpack vs Vite
 *
 * ONE CONCEPT: When to use which bundler and their fundamental differences
 */


// =============================================================================
// HEAD-TO-HEAD COMPARISON
// =============================================================================

console.log('=== Webpack vs Vite ===\n');

/**
 *   ┌──────────────────────────────────────────────────────────────────────┐
 *   │  WEBPACK vs VITE                                                    │
 *   ├───────────────────┬─────────────────────┬────────────────────────────┤
 *   │  Feature          │  Webpack             │  Vite                     │
 *   ├───────────────────┼─────────────────────┼────────────────────────────┤
 *   │  Dev server       │  Bundle then serve   │  Serve, transform on req  │
 *   │  Dev startup      │  10-30s (large app)  │  < 1s                     │
 *   │  HMR speed        │  Slows with app size │  Constant (fast)          │
 *   │  Prod bundler     │  Webpack itself       │  Rollup                   │
 *   │  Config           │  Complex              │  Simple                   │
 *   │  Ecosystem        │  Huge (10+ years)     │  Growing fast             │
 *   │  CSS handling     │  Loaders required     │  Built-in (PostCSS, CSS) │
 *   │  TypeScript       │  ts-loader/babel      │  Built-in (esbuild)      │
 *   │  JSX              │  babel-loader          │  Built-in (esbuild)      │
 *   │  JSON             │  Built-in              │  Built-in                │
 *   │  Static assets    │  Loaders/plugins       │  Built-in                │
 *   │  Env variables    │  DefinePlugin          │  import.meta.env         │
 *   │  Code splitting   │  import()              │  import()                │
 *   │  SSR              │  Complex setup         │  First-class support     │
 *   │  Legacy browser   │  babel + polyfills     │  @vitejs/plugin-legacy   │
 *   │  Module format    │  CJS + ESM             │  ESM-first               │
 *   │  Node.js API      │  Rich (custom builds)  │  Limited                 │
 *   └───────────────────┴─────────────────────┴────────────────────────────┘
 *
 */

console.log('Webpack: mature, configurable, huge ecosystem');
console.log('Vite:    fast, simple, modern, ESM-native');


// =============================================================================
// ARCHITECTURE DIFFERENCE
// =============================================================================

console.log('\n=== Architecture ===\n');

/**
 *   ┌──────────────────────────────────────────────────────────────────────┐
 *   │  WEBPACK ARCHITECTURE                                                │
 *   ├──────────────────────────────────────────────────────────────────────┤
 *   │                                                                      │
 *   │  Source ──▶ [Loaders] ──▶ [Bundle] ──▶ [Plugins] ──▶ Output        │
 *   │                                                                      │
 *   │  Everything goes through webpack:                                    │
 *   │  JS, CSS, images, fonts → all processed by webpack pipeline         │
 *   │  One tool does everything                                            │
 *   │                                                                      │
 *   ├──────────────────────────────────────────────────────────────────────┤
 *   │  VITE ARCHITECTURE                                                   │
 *   ├──────────────────────────────────────────────────────────────────────┤
 *   │                                                                      │
 *   │  DEV:                                                                │
 *   │  Browser ──▶ Vite server ──▶ esbuild (transform) ──▶ ESM response  │
 *   │  (No bundling! Files served individually as ESM)                    │
 *   │                                                                      │
 *   │  PROD:                                                               │
 *   │  Source ──▶ Rollup ──▶ Optimized bundles                            │
 *   │                                                                      │
 *   │  Composition of specialized tools:                                   │
 *   │  esbuild: dev transforms + dep pre-bundling (Go, fast)             │
 *   │  Rollup:  production bundling (mature, clean output)                │
 *   │  PostCSS: CSS processing (built-in)                                 │
 *   │                                                                      │
 *   └──────────────────────────────────────────────────────────────────────┘
 *
 */

console.log('Webpack: monolithic (one tool does all)');
console.log('Vite:    composed (esbuild + Rollup + PostCSS)');


// =============================================================================
// WHEN TO USE WHICH
// =============================================================================

console.log('\n=== When to Use Which ===\n');

/**
 *   ┌──────────────────────────────────────────────────────────────────────┐
 *   │  USE WEBPACK WHEN:                   USE VITE WHEN:                  │
 *   ├──────────────────────────────────────────────────────────────────────┤
 *   │                                                                      │
 *   │  • Legacy project already on it     • New project (greenfield)      │
 *   │  • Need custom loaders/plugins      • Want fast dev experience      │
 *   │  • Complex build requirements       • Standard React/Vue/Svelte     │
 *   │  • Micro-frontends (Module Fed)     • Simple config preferred       │
 *   │  • Non-standard file processing     • SSR needed                    │
 *   │  • Extensive Node.js API usage      • Library development           │
 *   │                                                                      │
 *   │  ALSO CONSIDER:                                                      │
 *   │  • Turbopack: Webpack successor (Rust, used in Next.js)            │
 *   │  • esbuild:   Fastest (Go), limited plugin API                     │
 *   │  • Rollup:    Best for libraries (clean ESM output)                │
 *   │  • Parcel:    Zero-config bundler                                   │
 *   │                                                                      │
 *   └──────────────────────────────────────────────────────────────────────┘
 *
 */

console.log('New project? → Vite (fast, simple)');
console.log('Existing webpack project? → Stay unless pain is high');
console.log('Complex custom builds? → Webpack (flexibility)');
console.log('Library? → Rollup or Vite library mode');
console.log('Next.js? → Turbopack (webpack successor)');


// =============================================================================
// MIGRATION: WEBPACK → VITE
// =============================================================================

console.log('\n=== Migration Considerations ===\n');

/**
 *   ┌──────────────────────────────────────────────────────────────────────┐
 *   │  WEBPACK → VITE MIGRATION GOTCHAS                                   │
 *   ├──────────────────────────────────────────────────────────────────────┤
 *   │                                                                      │
 *   │  1. require() → import                                               │
 *   │     Vite is ESM-only. All require() must become import.             │
 *   │                                                                      │
 *   │  2. process.env → import.meta.env                                    │
 *   │     REACT_APP_ → VITE_                                              │
 *   │                                                                      │
 *   │  3. Webpack-specific imports:                                        │
 *   │     require.context() → import.meta.glob()                          │
 *   │                                                                      │
 *   │  4. CSS Modules:                                                     │
 *   │     Rename .css → .module.css (convention)                          │
 *   │                                                                      │
 *   │  5. Public path:                                                     │
 *   │     PUBLIC_URL → base config in vite.config.js                      │
 *   │                                                                      │
 *   │  6. Webpack-specific plugins:                                        │
 *   │     Find Vite equivalents or Rollup alternatives                    │
 *   │                                                                      │
 *   │  7. Node.js globals (Buffer, process):                              │
 *   │     Need explicit polyfills in Vite                                 │
 *   │                                                                      │
 *   └──────────────────────────────────────────────────────────────────────┘
 *
 */

console.log('Key changes: require→import, process.env→import.meta.env');
console.log('require.context() → import.meta.glob()');


// =============================================================================
// INTERVIEW: What to Say
// =============================================================================

/**
 * "The fundamental difference is architecture. Webpack bundles everything
 * before serving — it reads all files, builds a dependency graph, transforms,
 * and bundles. Vite skips bundling in development entirely. It serves native
 * ES modules and transforms files on demand using esbuild. This makes
 * Vite's dev startup instant and HMR constant-speed regardless of app size.
 *
 * For production, Vite uses Rollup which produces clean, optimized output
 * with tree-shaking. Webpack uses its own bundler with extensive
 * optimization plugins.
 *
 * I'd choose Vite for new projects — the developer experience is
 * significantly better, config is simpler, and TypeScript, CSS, and JSX
 * work out of the box. I'd stick with Webpack for legacy projects or when
 * I need its unique features like Module Federation for micro-frontends
 * or highly custom loader chains.
 *
 * The industry is moving toward Vite. Next.js is building Turbopack
 * (Webpack's Rust-based successor), and most new frameworks default to Vite."
 */


// RUN: node docs/29-bundlers-modules/11-webpack-vs-vite.js
