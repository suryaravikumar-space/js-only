/**
 * BUNDLERS & MODULES: 15 - Interview Cheatsheet
 *
 * Quick reference for all bundler/module concepts
 */


// =============================================================================
// MASTER CHEATSHEET
// =============================================================================

/**
 *   ┌──────────────────────────────────────────────────────────────────────┐
 *   │  BUNDLERS & MODULES CHEATSHEET                                      │
 *   ├──────────────────────────────────────────────────────────────────────┤
 *   │                                                                      │
 *   │  MODULE SYSTEMS                                                      │
 *   │  • CJS: require/module.exports — sync, runtime, copies values       │
 *   │  • ESM: import/export — async, parse-time, live bindings            │
 *   │  • ESM is the standard. CJS still used in Node.js.                 │
 *   │  • ESM enables tree-shaking (static analysis)                       │
 *   │  • CJS cannot require() ESM. ESM can import CJS.                   │
 *   │                                                                      │
 *   │  BABEL                                                               │
 *   │  • Transpiler: modern JS → compatible JS                            │
 *   │  • Parse → Transform (plugins) → Generate                          │
 *   │  • preset-env: standard JS transforms                               │
 *   │  • preset-react: JSX → createElement                                │
 *   │  • Transpilation (syntax) vs Polyfill (APIs like Promise)           │
 *   │  • useBuiltIns: "usage" auto-imports needed polyfills               │
 *   │  • SWC/esbuild replacing Babel for speed                            │
 *   │                                                                      │
 *   │  WEBPACK                                                             │
 *   │  • Entry → Dependency graph → Loaders → Plugins → Output           │
 *   │  • Loaders: per-file transforms (babel, css, images)                │
 *   │  • Plugins: build-wide tasks (HTML gen, CSS extract, minify)        │
 *   │  • splitChunks: vendor splitting for caching                        │
 *   │  • Scope hoisting: flatten module wrappers (ESM only)               │
 *   │  • contenthash: cache-busting filenames                             │
 *   │                                                                      │
 *   │  VITE                                                                │
 *   │  • Dev: native ESM, no bundling, esbuild transforms                │
 *   │  • Prod: Rollup bundler                                             │
 *   │  • Pre-bundles node_modules (CJS→ESM, many→one)                    │
 *   │  • Instant startup, constant-speed HMR                              │
 *   │  • VITE_ prefix for client env vars                                 │
 *   │                                                                      │
 *   │  TREE SHAKING                                                        │
 *   │  • Remove unused exports from bundle                                │
 *   │  • Requires: ESM + production mode + sideEffects: false             │
 *   │  • Breaks with: CJS, dynamic access, module-level side effects     │
 *   │  • lodash (71KB) vs lodash-es with named import (3KB)              │
 *   │                                                                      │
 *   │  CODE SPLITTING                                                      │
 *   │  • import() creates separate chunks loaded on demand                │
 *   │  • React.lazy + Suspense for route-level splitting                  │
 *   │  • prefetch: download during idle (might need)                      │
 *   │  • preload: download now in parallel (need soon)                    │
 *   │                                                                      │
 *   │  HMR                                                                 │
 *   │  • Update modules without full reload, preserve state               │
 *   │  • React Fast Refresh: preserves useState/useRef                    │
 *   │  • Webpack: module.hot | Vite: import.meta.hot                      │
 *   │                                                                      │
 *   └──────────────────────────────────────────────────────────────────────┘
 *
 */


// =============================================================================
// TOP INTERVIEW Q&A
// =============================================================================

console.log('=== Top Interview Q&A ===\n');

const qa = [
  {
    q: 'CJS vs ESM — what are the key differences?',
    a: 'CJS: require(), synchronous, runtime, value copies. ESM: import/export, static, parse-time, live bindings. ESM enables tree-shaking because the dependency graph is known before execution.'
  },
  {
    q: 'What is tree shaking?',
    a: 'Removing unused exports from the bundle. Requires ESM (static imports), production mode, and sideEffects: false in package.json. CJS can\'t be tree-shaken because require is dynamic.'
  },
  {
    q: 'What does Babel do?',
    a: 'Transpiles modern JS syntax to older equivalents: arrow functions to regular functions, classes to prototypes, optional chaining to null checks. Uses plugins for individual transforms and presets for bundles of plugins. Doesn\'t polyfill APIs — needs core-js for that.'
  },
  {
    q: 'Webpack loaders vs plugins?',
    a: 'Loaders transform individual files (babel-loader for JS, css-loader for CSS). Plugins handle broader build tasks (HtmlWebpackPlugin generates HTML, MiniCssExtractPlugin extracts CSS files). Loaders in module.rules, plugins in plugins array.'
  },
  {
    q: 'Why is Vite faster than Webpack in dev?',
    a: 'Webpack bundles everything before serving. Vite serves native ESM — no bundling needed. It transforms files on demand using esbuild (Go, extremely fast). HMR stays fast because only one module is re-transformed, not a whole chunk.'
  },
  {
    q: 'What is code splitting?',
    a: 'Breaking the bundle into smaller chunks loaded on demand. Use dynamic import() — bundler creates a separate chunk. In React, React.lazy + Suspense for route-level splitting. Reduces initial load significantly.'
  },
  {
    q: 'How does HMR work?',
    a: 'Dev server detects file change, re-compiles only that module, sends update via WebSocket. Browser replaces the old module and re-renders. React Fast Refresh preserves useState/useRef. Falls back to full reload if module has no accept handler.'
  },
  {
    q: 'What is scope hoisting?',
    a: 'Webpack flattens module wrappers into one scope instead of wrapping each in a function. Reduces bundle size and improves runtime performance. Requires ESM and production mode.'
  },
  {
    q: 'How do you optimize a webpack build?',
    a: 'splitChunks for vendor caching, contenthash for cache busting, tree-shaking with ESM, code splitting with import(), scope hoisting, filesystem cache for faster rebuilds, BundleAnalyzerPlugin to find bloat.'
  },
  {
    q: 'What is the sideEffects field in package.json?',
    a: 'Tells bundlers which files have side effects (modify globals, inject CSS). Files marked side-effect-free can be safely removed if their exports aren\'t used. Setting false means all files are pure. List CSS files as exceptions.'
  }
];

qa.forEach(({ q, a }, i) => {
  console.log(`${i + 1}. Q: ${q}`);
  console.log(`   A: ${a}\n`);
});


// =============================================================================
// QUICK REFERENCE: CONFIG COMPARISON
// =============================================================================

console.log('=== Config Comparison ===\n');

/**
 *   ┌──────────────────────────────────────────────────────────────────────┐
 *   │  WEBPACK CONFIG                       VITE CONFIG                    │
 *   ├──────────────────────────────────────────────────────────────────────┤
 *   │                                                                      │
 *   │  entry: './src/index.js'              (auto: index.html)            │
 *   │  output: { path, filename }           build: { outDir }             │
 *   │  module: { rules: [...] }             (built-in: CSS, TS, JSX)     │
 *   │  plugins: [HtmlWebpackPlugin]         plugins: [react()]            │
 *   │  devServer: { port, proxy }           server: { port, proxy }       │
 *   │  resolve: { alias }                   resolve: { alias }            │
 *   │  mode: 'production'                   (auto: based on command)      │
 *   │  devtool: 'source-map'               build: { sourcemap: true }    │
 *   │                                                                      │
 *   │  Env vars:                                                           │
 *   │  DefinePlugin +                      .env files +                   │
 *   │  process.env.REACT_APP_X             import.meta.env.VITE_X         │
 *   │                                                                      │
 *   └──────────────────────────────────────────────────────────────────────┘
 *
 */

console.log('Vite: less config needed (sensible defaults)');
console.log('Webpack: explicit config for everything');


// RUN: node docs/29-bundlers-modules/15-interview-cheatsheet.js
