/**
 * BUNDLERS & MODULES: 07 - Webpack Overview
 *
 * ONE CONCEPT: How Webpack builds a dependency graph and creates bundles
 */


// =============================================================================
// WHAT IS WEBPACK?
// =============================================================================

console.log('=== What is Webpack? ===\n');

/**
 *   ┌──────────────────────────────────────────────────────────────────────┐
 *   │  WEBPACK: Static Module Bundler                                     │
 *   ├──────────────────────────────────────────────────────────────────────┤
 *   │                                                                      │
 *   │  Entry Point(s)                                                      │
 *   │      │                                                               │
 *   │      ▼                                                               │
 *   │  ┌─────────────────────────────────────────┐                        │
 *   │  │          DEPENDENCY GRAPH                │                        │
 *   │  │                                          │                        │
 *   │  │  index.js ──▶ App.js ──▶ Header.js      │                        │
 *   │  │     │            │        └── logo.svg   │                        │
 *   │  │     │            └──▶ utils.js           │                        │
 *   │  │     └──▶ styles.css                      │                        │
 *   │  │     └──▶ api.js ──▶ axios (node_modules) │                        │
 *   │  │                                          │                        │
 *   │  └─────────────────────────────────────────┘                        │
 *   │      │                                                               │
 *   │      ▼ Loaders transform files                                      │
 *   │      ▼ Plugins optimize output                                      │
 *   │      │                                                               │
 *   │  ┌─────────────────────────────┐                                    │
 *   │  │  OUTPUT                      │                                    │
 *   │  │  dist/                       │                                    │
 *   │  │  ├── main.abc123.js          │                                    │
 *   │  │  ├── vendor.def456.js        │                                    │
 *   │  │  ├── styles.ghi789.css       │                                    │
 *   │  │  └── index.html              │                                    │
 *   │  └─────────────────────────────┘                                    │
 *   │                                                                      │
 *   └──────────────────────────────────────────────────────────────────────┘
 *
 */

console.log('Webpack starts from entry points, follows imports,');
console.log('builds a dependency graph, transforms via loaders,');
console.log('optimizes via plugins, outputs bundles.');


// =============================================================================
// CORE CONCEPTS (5 Things)
// =============================================================================

console.log('\n=== 5 Core Concepts ===\n');

/**
 *   ┌──────────────────────────────────────────────────────────────────────┐
 *   │  WEBPACK CORE CONCEPTS                                              │
 *   ├──────────────────────────────────────────────────────────────────────┤
 *   │                                                                      │
 *   │  1. ENTRY   → Where to start building the graph                     │
 *   │  2. OUTPUT  → Where to emit bundles                                 │
 *   │  3. LOADERS → Transform non-JS files (CSS, images, TS)             │
 *   │  4. PLUGINS → Broader tasks (minify, extract CSS, HTML gen)         │
 *   │  5. MODE    → development | production | none                       │
 *   │                                                                      │
 *   └──────────────────────────────────────────────────────────────────────┘
 *
 */

// Minimal webpack.config.js
const minimalConfig = {
  // 1. ENTRY: starting point
  entry: './src/index.js',

  // 2. OUTPUT: where to write bundles
  output: {
    path: '/dist',           // Absolute path
    filename: '[name].[contenthash].js',  // Cache-busting hash
    clean: true              // Clean dist/ before build
  },

  // 3. LOADERS: transform files
  module: {
    rules: [
      { test: /\.css$/, use: ['style-loader', 'css-loader'] },
      { test: /\.jsx?$/, use: 'babel-loader', exclude: /node_modules/ },
      { test: /\.(png|svg)$/, type: 'asset' }
    ]
  },

  // 4. PLUGINS: broader optimizations
  plugins: [
    // new HtmlWebpackPlugin({ template: './src/index.html' }),
    // new MiniCssExtractPlugin()
  ],

  // 5. MODE
  mode: 'production'  // Enables minification, tree-shaking
};

console.log('1. entry:   "./src/index.js"');
console.log('2. output:  "./dist/[name].[hash].js"');
console.log('3. loaders: babel-loader, css-loader, etc.');
console.log('4. plugins: HtmlWebpackPlugin, MiniCssExtract, etc.');
console.log('5. mode:    "production" | "development"');


// =============================================================================
// ENTRY POINTS
// =============================================================================

console.log('\n=== Entry Points ===\n');

/**
 *   ┌──────────────────────────────────────────────────────────────────────┐
 *   │  ENTRY CONFIGURATIONS                                               │
 *   ├──────────────────────────────────────────────────────────────────────┤
 *   │                                                                      │
 *   │  // Single entry (SPA)                                               │
 *   │  entry: './src/index.js'                                             │
 *   │                                                                      │
 *   │  // Multiple entries (MPA)                                           │
 *   │  entry: {                                                            │
 *   │    home: './src/home.js',                                            │
 *   │    about: './src/about.js',                                          │
 *   │    admin: './src/admin.js'                                           │
 *   │  }                                                                   │
 *   │  → Produces: home.[hash].js, about.[hash].js, admin.[hash].js      │
 *   │                                                                      │
 *   │  // With shared dependencies                                        │
 *   │  entry: {                                                            │
 *   │    app: { import: './src/app.js', dependOn: 'shared' },             │
 *   │    shared: ['react', 'react-dom']                                   │
 *   │  }                                                                   │
 *   │                                                                      │
 *   └──────────────────────────────────────────────────────────────────────┘
 *
 */

console.log('Single entry: SPA (one bundle)');
console.log('Multiple entries: MPA (separate bundles per page)');
console.log('dependOn: share common deps between entries');


// =============================================================================
// OUTPUT & HASHING
// =============================================================================

console.log('\n=== Output & Hashing ===\n');

/**
 *   ┌──────────────────────────────────────────────────────────────────────┐
 *   │  OUTPUT FILENAME PATTERNS                                           │
 *   ├──────────────────────────────────────────────────────────────────────┤
 *   │                                                                      │
 *   │  [name]          → Entry point name (e.g., "main", "vendor")       │
 *   │  [id]            → Chunk ID                                         │
 *   │  [hash]          → Build hash (changes every build)                │
 *   │  [contenthash]   → Content hash (changes only if content changes)  │
 *   │  [chunkhash]     → Chunk hash                                       │
 *   │                                                                      │
 *   │  Best practice: [contenthash] for long-term caching                │
 *   │                                                                      │
 *   │  output: {                                                           │
 *   │    filename: '[name].[contenthash:8].js',    ← Entry chunks        │
 *   │    chunkFilename: '[name].[contenthash:8].js' ← Async chunks      │
 *   │  }                                                                   │
 *   │                                                                      │
 *   │  main.a1b2c3d4.js  → Content changes? New hash → Cache busted      │
 *   │  main.a1b2c3d4.js  → No change? Same hash → Cache hit!            │
 *   │                                                                      │
 *   └──────────────────────────────────────────────────────────────────────┘
 *
 */

console.log('[contenthash] = best for caching');
console.log('File content changes → new hash → browser fetches new file');
console.log('File unchanged → same hash → browser uses cache');


// =============================================================================
// MODE: DEVELOPMENT vs PRODUCTION
// =============================================================================

console.log('\n=== Mode ===\n');

/**
 *   ┌──────────────────────────────────────────────────────────────────────┐
 *   │  DEVELOPMENT                        PRODUCTION                      │
 *   ├──────────────────────────────────────────────────────────────────────┤
 *   │                                                                      │
 *   │  • eval source maps (fast)          • Source maps (separate file)   │
 *   │  • No minification                  • Terser minification           │
 *   │  • No tree-shaking                  • Tree-shaking enabled          │
 *   │  • Readable output                  • Mangled variable names        │
 *   │  • process.env.NODE_ENV             • process.env.NODE_ENV          │
 *   │    = "development"                    = "production"                │
 *   │  • HMR (hot module replace)         • Scope hoisting                │
 *   │  • Named modules (debugging)        • Concatenated modules          │
 *   │                                                                      │
 *   │  Dev build: fast rebuilds, good errors                              │
 *   │  Prod build: small bundle, optimized                                │
 *   │                                                                      │
 *   └──────────────────────────────────────────────────────────────────────┘
 *
 */

console.log('development: fast builds, readable, HMR, no minify');
console.log('production:  slow build, minified, tree-shaken, optimized');


// =============================================================================
// RESOLVE
// =============================================================================

console.log('\n=== Resolve ===\n');

/**
 *   ┌──────────────────────────────────────────────────────────────────────┐
 *   │  resolve: {                                                          │
 *   │    extensions: ['.js', '.jsx', '.ts', '.tsx'],                      │
 *   │    // import './App' tries App.js, App.jsx, App.ts, App.tsx         │
 *   │                                                                      │
 *   │    alias: {                                                          │
 *   │      '@': path.resolve(__dirname, 'src'),                           │
 *   │      '@components': path.resolve(__dirname, 'src/components')       │
 *   │    }                                                                 │
 *   │    // import Button from '@components/Button'                       │
 *   │    // → resolves to src/components/Button                           │
 *   │                                                                      │
 *   │    modules: ['node_modules', 'src']                                 │
 *   │    // import 'utils' tries node_modules/utils then src/utils       │
 *   │  }                                                                   │
 *   │                                                                      │
 *   └──────────────────────────────────────────────────────────────────────┘
 *
 */

console.log('resolve.extensions: auto-try file extensions');
console.log('resolve.alias: path shortcuts (@components → src/components)');


// =============================================================================
// INTERVIEW: What to Say
// =============================================================================

/**
 * "Webpack is a static module bundler. It starts from entry points, follows
 * all import/require statements to build a dependency graph, then outputs
 * bundles. It has five core concepts:
 *
 * 1. Entry — where to start (usually src/index.js)
 * 2. Output — where to write bundles, with contenthash for cache busting
 * 3. Loaders — transform files: babel-loader for JS, css-loader for CSS,
 *    file-loader for images. They run per-file during the build.
 * 4. Plugins — broader tasks: HtmlWebpackPlugin generates HTML,
 *    MiniCssExtractPlugin extracts CSS to files, DefinePlugin injects
 *    environment variables.
 * 5. Mode — development enables HMR and readable output; production
 *    enables minification, tree-shaking, and scope hoisting.
 *
 * Webpack's strength is its flexibility — it can handle any file type
 * through loaders and has a massive plugin ecosystem. The tradeoff is
 * configuration complexity and slower builds compared to newer tools
 * like Vite and esbuild."
 */


// RUN: node docs/29-bundlers-modules/07-webpack-overview.js
