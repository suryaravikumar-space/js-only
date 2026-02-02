/**
 * BUNDLERS & MODULES: 09 - Webpack Optimization
 *
 * ONE CONCEPT: Techniques to reduce bundle size and improve build speed
 */


// =============================================================================
// OPTIMIZATION OVERVIEW
// =============================================================================

console.log('=== Webpack Optimization ===\n');

/**
 *   ┌──────────────────────────────────────────────────────────────────────┐
 *   │  TWO TYPES OF OPTIMIZATION                                          │
 *   ├──────────────────────────────────────────────────────────────────────┤
 *   │                                                                      │
 *   │  BUILD SPEED:                        BUNDLE SIZE:                    │
 *   │  • Cache                             • Tree-shaking                  │
 *   │  • Thread-loader (parallel)          • Code splitting               │
 *   │  • Exclude node_modules              • Minification                  │
 *   │  • Resolve config                    • Scope hoisting                │
 *   │  • Incremental builds                • Compression (gzip, brotli)   │
 *   │  • DLL plugin                        • Externals                     │
 *   │  • Lazy compilation                  • Dynamic import               │
 *   │                                                                      │
 *   └──────────────────────────────────────────────────────────────────────┘
 *
 */


// =============================================================================
// SPLITCHUNKS: VENDOR SPLITTING
// =============================================================================

console.log('=== SplitChunks ===\n');

/**
 *   ┌──────────────────────────────────────────────────────────────────────┐
 *   │  SPLITCHUNKS PLUGIN (built-in)                                      │
 *   ├──────────────────────────────────────────────────────────────────────┤
 *   │                                                                      │
 *   │  WITHOUT splitting:                                                  │
 *   │  main.js (500KB) = your code + react + lodash + axios               │
 *   │  ← Any code change invalidates the ENTIRE 500KB cache             │
 *   │                                                                      │
 *   │  WITH splitting:                                                     │
 *   │  main.js (100KB)    = your code (changes often)                     │
 *   │  vendor.js (400KB)  = react + lodash + axios (rarely changes)       │
 *   │  ← Code change only invalidates main.js (100KB)                   │
 *   │  ← vendor.js stays cached!                                         │
 *   │                                                                      │
 *   └──────────────────────────────────────────────────────────────────────┘
 *
 */

const splitChunksConfig = {
  optimization: {
    splitChunks: {
      chunks: 'all',        // Split sync + async imports
      cacheGroups: {
        vendor: {
          test: /[\\/]node_modules[\\/]/,
          name: 'vendors',
          chunks: 'all',
          priority: 10
        },
        common: {
          minChunks: 2,       // Shared between 2+ entry points
          name: 'common',
          chunks: 'all',
          priority: 5
        }
      }
    },
    // Extract webpack runtime into separate file
    runtimeChunk: 'single'
  }
};

console.log('splitChunks: separate vendor code from app code');
console.log('  vendor.js: node_modules (cached long-term)');
console.log('  main.js:   your code (changes frequently)');
console.log('  runtime.js: webpack runtime (small)');


// =============================================================================
// MINIFICATION
// =============================================================================

console.log('\n=== Minification ===\n');

/**
 *   ┌──────────────────────────────────────────────────────────────────────┐
 *   │  MINIFICATION (production mode auto-enables)                        │
 *   ├──────────────────────────────────────────────────────────────────────┤
 *   │                                                                      │
 *   │  JS:  TerserPlugin (default in webpack 5)                           │
 *   │  CSS: CssMinimizerPlugin                                            │
 *   │                                                                      │
 *   │  What Terser does:                                                   │
 *   │  • Remove whitespace and comments                                   │
 *   │  • Shorten variable names (mangle)                                  │
 *   │  • Dead code elimination                                            │
 *   │  • Inline simple functions                                          │
 *   │  • Collapse constant expressions                                    │
 *   │                                                                      │
 *   │  Before: function calculateTotal(items) {                           │
 *   │            return items.reduce((sum, item) => sum + item.price, 0); │
 *   │          }                                                           │
 *   │  After:  function c(t){return t.reduce((s,i)=>s+i.price,0)}        │
 *   │                                                                      │
 *   └──────────────────────────────────────────────────────────────────────┘
 *
 */

console.log('TerserPlugin: JS minification (production default)');
console.log('CssMinimizerPlugin: CSS minification');
console.log('Saves 40-70% file size typically');


// =============================================================================
// SCOPE HOISTING (Module Concatenation)
// =============================================================================

console.log('\n=== Scope Hoisting ===\n');

/**
 *   ┌──────────────────────────────────────────────────────────────────────┐
 *   │  SCOPE HOISTING (ModuleConcatenationPlugin)                         │
 *   ├──────────────────────────────────────────────────────────────────────┤
 *   │                                                                      │
 *   │  WITHOUT scope hoisting:                                             │
 *   │  Each module wrapped in a function:                                  │
 *   │                                                                      │
 *   │  __webpack_modules__({                                               │
 *   │    "./src/math.js": function(module, exports) {                     │
 *   │      exports.add = (a, b) => a + b;                                │
 *   │    },                                                                │
 *   │    "./src/app.js": function(module, exports, require) {             │
 *   │      const { add } = require("./src/math.js");                     │
 *   │      console.log(add(1, 2));                                        │
 *   │    }                                                                 │
 *   │  });                                                                 │
 *   │                                                                      │
 *   │  WITH scope hoisting:                                                │
 *   │  Modules concatenated into one scope:                                │
 *   │                                                                      │
 *   │  const add = (a, b) => a + b;                                       │
 *   │  console.log(add(1, 2));                                            │
 *   │  ← Fewer function wrappers = smaller + faster                      │
 *   │                                                                      │
 *   │  Enabled by: mode: 'production' + ESM                               │
 *   │  Requires ESM (static structure needed)                             │
 *   │                                                                      │
 *   └──────────────────────────────────────────────────────────────────────┘
 *
 */

console.log('Scope hoisting: flatten module wrappers into one scope');
console.log('Smaller output + faster execution');
console.log('Requires: ESM syntax + production mode');


// =============================================================================
// EXTERNALS
// =============================================================================

console.log('\n=== Externals ===\n');

/**
 *   ┌──────────────────────────────────────────────────────────────────────┐
 *   │  EXTERNALS: Exclude from bundle, load from CDN                      │
 *   ├──────────────────────────────────────────────────────────────────────┤
 *   │                                                                      │
 *   │  // webpack.config.js                                                │
 *   │  externals: {                                                        │
 *   │    react: 'React',          ← import React → window.React           │
 *   │    'react-dom': 'ReactDOM'  ← import ReactDOM → window.ReactDOM    │
 *   │  }                                                                   │
 *   │                                                                      │
 *   │  // index.html                                                       │
 *   │  <script src="https://cdn/.../react.min.js"></script>               │
 *   │  <script src="https://cdn/.../react-dom.min.js"></script>           │
 *   │  <script src="bundle.js"></script>                                  │
 *   │                                                                      │
 *   │  Result: React not in bundle → smaller bundle                       │
 *   │  Useful for: libraries used across multiple micro-frontends         │
 *   │                                                                      │
 *   └──────────────────────────────────────────────────────────────────────┘
 *
 */

console.log('Externals: exclude deps from bundle, use CDN instead');
console.log('Good for: shared libs in micro-frontend architectures');


// =============================================================================
// SOURCE MAPS
// =============================================================================

console.log('\n=== Source Maps ===\n');

/**
 *   ┌──────────────────────────────────────────────────────────────────────┐
 *   │  SOURCE MAP OPTIONS                                                  │
 *   ├──────────────────────────────────────────────────────────────────────┤
 *   │                                                                      │
 *   │  devtool: 'eval'                                                     │
 *   │  → Fastest rebuild, no column mapping                               │
 *   │                                                                      │
 *   │  devtool: 'eval-source-map'                                          │
 *   │  → Best for development (fast + full mapping)                       │
 *   │                                                                      │
 *   │  devtool: 'source-map'                                               │
 *   │  → Best for production (separate .map file)                         │
 *   │                                                                      │
 *   │  devtool: 'hidden-source-map'                                        │
 *   │  → Production, .map file generated but not referenced               │
 *   │  → Upload to error tracking (Sentry) only                          │
 *   │                                                                      │
 *   │  devtool: false                                                      │
 *   │  → No source maps (fastest build)                                   │
 *   │                                                                      │
 *   └──────────────────────────────────────────────────────────────────────┘
 *
 */

console.log('Development: eval-source-map (fast + accurate)');
console.log('Production:  source-map or hidden-source-map');
console.log('hidden: upload to Sentry, dont expose to users');


// =============================================================================
// CACHING (Persistent Cache - Webpack 5)
// =============================================================================

console.log('\n=== Persistent Cache ===\n');

/**
 *   ┌──────────────────────────────────────────────────────────────────────┐
 *   │  WEBPACK 5 PERSISTENT CACHE                                         │
 *   ├──────────────────────────────────────────────────────────────────────┤
 *   │                                                                      │
 *   │  cache: {                                                            │
 *   │    type: 'filesystem',           ← Cache to disk                   │
 *   │    buildDependencies: {                                              │
 *   │      config: [__filename]        ← Invalidate on config change     │
 *   │    }                                                                 │
 *   │  }                                                                   │
 *   │                                                                      │
 *   │  First build:  30 seconds                                            │
 *   │  Second build:  3 seconds  ← 10x faster!                           │
 *   │                                                                      │
 *   │  Cache stored in: node_modules/.cache/webpack                       │
 *   │                                                                      │
 *   └──────────────────────────────────────────────────────────────────────┘
 *
 */

console.log('Webpack 5: filesystem cache for 10x faster rebuilds');


// =============================================================================
// INTERVIEW: What to Say
// =============================================================================

/**
 * "For webpack optimization, I focus on both bundle size and build speed:
 *
 * Bundle size:
 * - splitChunks separates vendor code from app code so vendors stay cached
 * - Tree-shaking removes unused exports (requires ESM)
 * - Scope hoisting flattens module wrappers into one scope
 * - Dynamic import() for route-level code splitting
 * - contenthash in filenames for long-term caching
 *
 * Build speed:
 * - Webpack 5 filesystem cache gives 10x faster rebuilds
 * - Exclude node_modules from babel-loader
 * - thread-loader for parallel processing
 *
 * For source maps, I use eval-source-map in development for speed and
 * accuracy, and hidden-source-map in production to upload to Sentry
 * without exposing them to users.
 *
 * BundleAnalyzerPlugin is essential for identifying what's making the
 * bundle large — often it's an entire library imported for one function."
 */


// RUN: node docs/29-bundlers-modules/09-webpack-optimization.js
