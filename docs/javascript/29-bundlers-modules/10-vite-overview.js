/**
 * BUNDLERS & MODULES: 10 - Vite Overview
 *
 * ONE CONCEPT: Vite uses native ESM for dev and Rollup for production builds
 */


// =============================================================================
// WHAT IS VITE?
// =============================================================================

console.log('=== What is Vite? ===\n');

/**
 *   ┌──────────────────────────────────────────────────────────────────────┐
 *   │  VITE: Next-Generation Frontend Tooling                             │
 *   ├──────────────────────────────────────────────────────────────────────┤
 *   │                                                                      │
 *   │  TWO MODES:                                                          │
 *   │                                                                      │
 *   │  DEV SERVER:                                                         │
 *   │  ┌─────────────────────────────────────────────┐                    │
 *   │  │ Browser requests /src/App.jsx                │                    │
 *   │  │         │                                    │                    │
 *   │  │         ▼                                    │                    │
 *   │  │ Vite transforms file on demand (esbuild)    │                    │
 *   │  │         │                                    │                    │
 *   │  │         ▼                                    │                    │
 *   │  │ Serves native ESM to browser                │                    │
 *   │  │ <script type="module" src="/src/main.js">   │                    │
 *   │  │                                              │                    │
 *   │  │ NO BUNDLING during dev!                      │                    │
 *   │  └─────────────────────────────────────────────┘                    │
 *   │                                                                      │
 *   │  PRODUCTION BUILD:                                                   │
 *   │  ┌─────────────────────────────────────────────┐                    │
 *   │  │ Rollup bundles everything                    │                    │
 *   │  │ Tree-shaking, code splitting, minification  │                    │
 *   │  │ Outputs optimized static files              │                    │
 *   │  └─────────────────────────────────────────────┘                    │
 *   │                                                                      │
 *   └──────────────────────────────────────────────────────────────────────┘
 *
 */

console.log('Vite dev:  No bundling! Native ESM + on-demand transforms');
console.log('Vite prod: Rollup bundler (tree-shaking, splitting, minify)');


// =============================================================================
// WHY VITE IS FAST
// =============================================================================

console.log('\n=== Why Vite is Fast ===\n');

/**
 *   ┌──────────────────────────────────────────────────────────────────────┐
 *   │  WEBPACK DEV:                        VITE DEV:                       │
 *   ├──────────────────────────────────────────────────────────────────────┤
 *   │                                                                      │
 *   │  Start server:                       Start server:                   │
 *   │  ┌──────────────────────────┐        ┌──────────────────────────┐   │
 *   │  │ 1. Read ALL files       │        │ 1. Start server         │   │
 *   │  │ 2. Build dep graph      │        │ 2. Pre-bundle deps      │   │
 *   │  │ 3. Transform ALL       │        │    (esbuild — instant)   │   │
 *   │  │ 4. Bundle ALL          │        │ 3. Serve index.html     │   │
 *   │  │ 5. Serve               │        │                          │   │
 *   │  └──────────────────────────┘        └──────────────────────────┘   │
 *   │  ← 10-30 seconds for large app      ← < 1 second!                 │
 *   │                                                                      │
 *   │  File change:                        File change:                    │
 *   │  ┌──────────────────────────┐        ┌──────────────────────────┐   │
 *   │  │ Rebuild affected chunks │        │ Invalidate ONE module   │   │
 *   │  │ Push to browser         │        │ Browser re-fetches it   │   │
 *   │  └──────────────────────────┘        └──────────────────────────┘   │
 *   │  ← Slower as app grows              ← Constant speed!              │
 *   │                                                                      │
 *   │  KEY INSIGHT:                                                        │
 *   │  Webpack bundles THEN serves                                        │
 *   │  Vite serves THEN transforms (on demand)                            │
 *   │                                                                      │
 *   └──────────────────────────────────────────────────────────────────────┘
 *
 */

console.log('Webpack: bundle everything → then serve (slow start)');
console.log('Vite:    serve immediately → transform on request (instant start)');
console.log('');
console.log('HMR speed:');
console.log('  Webpack: proportional to app size (slower as app grows)');
console.log('  Vite:    constant time (only transforms changed module)');


// =============================================================================
// DEPENDENCY PRE-BUNDLING
// =============================================================================

console.log('\n=== Dependency Pre-Bundling ===\n');

/**
 *   ┌──────────────────────────────────────────────────────────────────────┐
 *   │  PRE-BUNDLING (esbuild)                                             │
 *   ├──────────────────────────────────────────────────────────────────────┤
 *   │                                                                      │
 *   │  Problem: lodash-es has 600+ modules!                                │
 *   │  import { debounce } from 'lodash-es';                              │
 *   │  → Browser would make 600+ HTTP requests!                           │
 *   │                                                                      │
 *   │  Solution: Vite pre-bundles dependencies:                            │
 *   │  1. Detects bare imports (react, lodash, etc.)                      │
 *   │  2. Bundles them into single files using esbuild (10-100x faster)  │
 *   │  3. Converts CJS → ESM (e.g., React is CJS)                       │
 *   │  4. Caches in node_modules/.vite/                                   │
 *   │                                                                      │
 *   │  Result: lodash-es → one bundled file → one HTTP request            │
 *   │                                                                      │
 *   │  Your source code: NOT pre-bundled (served as native ESM)           │
 *   │  node_modules:     Pre-bundled (one file per dep)                   │
 *   │                                                                      │
 *   └──────────────────────────────────────────────────────────────────────┘
 *
 */

console.log('Vite pre-bundles node_modules with esbuild:');
console.log('  CJS → ESM conversion');
console.log('  Many files → single file (lodash 600+ → 1)');
console.log('  Cached in node_modules/.vite/');


// =============================================================================
// VITE CONFIG
// =============================================================================

console.log('\n=== Vite Configuration ===\n');

/**
 *   // vite.config.js
 *   import { defineConfig } from 'vite';
 *   import react from '@vitejs/plugin-react';
 *
 *   export default defineConfig({
 *     plugins: [react()],
 *
 *     server: {
 *       port: 3000,
 *       proxy: {
 *         '/api': 'http://localhost:8080'
 *       }
 *     },
 *
 *     build: {
 *       outDir: 'dist',
 *       sourcemap: true,
 *       rollupOptions: {
 *         output: {
 *           manualChunks: {
 *             vendor: ['react', 'react-dom']
 *           }
 *         }
 *       }
 *     },
 *
 *     resolve: {
 *       alias: {
 *         '@': '/src'
 *       }
 *     }
 *   });
 */

console.log('Vite config is simple compared to webpack:');
console.log('  plugins: [react()]  ← Framework support');
console.log('  server.proxy        ← API proxy');
console.log('  build.rollupOptions ← Production customization');
console.log('  resolve.alias       ← Path aliases');


// =============================================================================
// VITE PLUGINS
// =============================================================================

console.log('\n=== Vite Plugins ===\n');

/**
 *   ┌──────────────────────────────────────────────────────────────────────┐
 *   │  VITE PLUGIN ECOSYSTEM                                              │
 *   ├──────────────────────────────────────────────────────────────────────┤
 *   │                                                                      │
 *   │  Framework plugins:                                                  │
 *   │  @vitejs/plugin-react       ← React (Babel or SWC)                 │
 *   │  @vitejs/plugin-react-swc   ← React (SWC — faster)                │
 *   │  @vitejs/plugin-vue         ← Vue                                  │
 *   │  @sveltejs/vite-plugin-svelte ← Svelte                            │
 *   │                                                                      │
 *   │  Vite is compatible with Rollup plugins!                            │
 *   │  Most Rollup plugins work in Vite directly.                         │
 *   │                                                                      │
 *   │  Plugin API hooks:                                                   │
 *   │  • configResolved  → access resolved config                        │
 *   │  • transformIndexHtml → modify HTML                                │
 *   │  • transform → transform individual modules                        │
 *   │  • handleHotUpdate → custom HMR                                    │
 *   │                                                                      │
 *   └──────────────────────────────────────────────────────────────────────┘
 *
 */

console.log('Vite plugins are Rollup-compatible');
console.log('@vitejs/plugin-react-swc: fastest React transform');


// =============================================================================
// ENVIRONMENT VARIABLES
// =============================================================================

console.log('\n=== Environment Variables ===\n');

/**
 *   ┌──────────────────────────────────────────────────────────────────────┐
 *   │  VITE ENV VARIABLES                                                  │
 *   ├──────────────────────────────────────────────────────────────────────┤
 *   │                                                                      │
 *   │  .env                 ← All modes                                   │
 *   │  .env.local           ← All modes (gitignored)                     │
 *   │  .env.development     ← Dev mode                                   │
 *   │  .env.production      ← Prod mode                                  │
 *   │                                                                      │
 *   │  # .env                                                              │
 *   │  VITE_API_URL=https://api.example.com                               │
 *   │  SECRET_KEY=abc123        ← NOT exposed (no VITE_ prefix)          │
 *   │                                                                      │
 *   │  // In code:                                                         │
 *   │  import.meta.env.VITE_API_URL  ← Exposed to client                │
 *   │  import.meta.env.MODE          ← "development" | "production"      │
 *   │  import.meta.env.DEV           ← true in dev                       │
 *   │  import.meta.env.PROD          ← true in prod                      │
 *   │                                                                      │
 *   │  Only VITE_ prefixed vars are exposed (security!)                   │
 *   │  (CRA uses REACT_APP_ prefix, same idea)                           │
 *   │                                                                      │
 *   └──────────────────────────────────────────────────────────────────────┘
 *
 */

console.log('VITE_ prefix: exposed to client code');
console.log('No prefix: server-only (not in bundle)');
console.log('Access via: import.meta.env.VITE_API_URL');


// =============================================================================
// INTERVIEW: What to Say
// =============================================================================

/**
 * "Vite is a build tool that takes a fundamentally different approach
 * from webpack. In development, it doesn't bundle at all — it serves
 * source files as native ES modules and transforms them on demand using
 * esbuild. This means server startup is instant regardless of app size,
 * and HMR stays fast because only the changed module is re-transformed.
 *
 * For node_modules, Vite pre-bundles dependencies with esbuild — converting
 * CJS to ESM and collapsing many-file packages like lodash into single
 * files to reduce HTTP requests.
 *
 * For production, Vite uses Rollup which produces highly optimized bundles
 * with tree-shaking, code splitting, and minification.
 *
 * The config is much simpler than webpack. Framework support comes through
 * plugins like @vitejs/plugin-react. It's Rollup-compatible, so most
 * Rollup plugins work directly.
 *
 * Environment variables use the VITE_ prefix for security — only prefixed
 * variables are exposed to client code via import.meta.env."
 */


// RUN: node docs/29-bundlers-modules/10-vite-overview.js
