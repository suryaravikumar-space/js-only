/**
 * BUNDLERS & MODULES: 08 - Webpack Loaders & Plugins
 *
 * ONE CONCEPT: Loaders transform files, plugins extend the build process
 */


// =============================================================================
// LOADERS: WHAT THEY DO
// =============================================================================

console.log('=== Loaders ===\n');

/**
 *   ┌──────────────────────────────────────────────────────────────────────┐
 *   │  LOADERS: Per-file transformations                                  │
 *   ├──────────────────────────────────────────────────────────────────────┤
 *   │                                                                      │
 *   │  Webpack only understands JS and JSON natively.                     │
 *   │  Loaders teach webpack to process other file types.                 │
 *   │                                                                      │
 *   │  .css   ──▶ css-loader ──▶ style-loader ──▶ JS bundle              │
 *   │  .scss  ──▶ sass-loader ──▶ css-loader ──▶ style-loader            │
 *   │  .ts    ──▶ ts-loader ──▶ JS bundle                                │
 *   │  .jsx   ──▶ babel-loader ──▶ JS bundle                             │
 *   │  .png   ──▶ asset/resource ──▶ File URL                            │
 *   │  .svg   ──▶ @svgr/webpack ──▶ React component                     │
 *   │                                                                      │
 *   │  LOADER CHAIN (right to left!):                                      │
 *   │  use: ['style-loader', 'css-loader', 'postcss-loader']             │
 *   │        ← 3rd             ← 2nd           ← 1st                     │
 *   │                                                                      │
 *   │  postcss-loader: .css → processed CSS                               │
 *   │  css-loader:     CSS → JS module (resolves @import, url())          │
 *   │  style-loader:   JS → injects <style> tag in DOM                   │
 *   │                                                                      │
 *   └──────────────────────────────────────────────────────────────────────┘
 *
 */

console.log('Loaders execute RIGHT to LEFT in the use array');
console.log('Each loader receives output of the previous one');


// =============================================================================
// COMMON LOADER CONFIGURATIONS
// =============================================================================

console.log('\n=== Common Loaders ===\n');

const exampleRules = {
  module: {
    rules: [
      // JavaScript / JSX (Babel)
      {
        test: /\.(js|jsx)$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: ['@babel/preset-env', '@babel/preset-react']
          }
        }
      },

      // TypeScript
      {
        test: /\.tsx?$/,
        use: 'ts-loader',
        exclude: /node_modules/
      },

      // CSS
      {
        test: /\.css$/,
        use: ['style-loader', 'css-loader']
        // style-loader: injects CSS into DOM via <style>
        // css-loader: resolves @import and url()
      },

      // CSS Modules
      {
        test: /\.module\.css$/,
        use: [
          'style-loader',
          {
            loader: 'css-loader',
            options: { modules: true }  // .module.css → scoped classes
          }
        ]
      },

      // SASS/SCSS
      {
        test: /\.scss$/,
        use: ['style-loader', 'css-loader', 'sass-loader']
      },

      // Images (webpack 5 asset modules)
      {
        test: /\.(png|jpg|gif|svg)$/,
        type: 'asset',  // Auto: inline small, file large
        parser: {
          dataUrlCondition: { maxSize: 8 * 1024 }  // < 8KB = inline
        }
      },

      // Fonts
      {
        test: /\.(woff|woff2|eot|ttf|otf)$/,
        type: 'asset/resource'  // Always emit as file
      }
    ]
  }
};

console.log('babel-loader:  JS/JSX → compatible JS');
console.log('ts-loader:     TypeScript → JS');
console.log('css-loader:    CSS → JS module');
console.log('style-loader:  Injects CSS into DOM <style>');
console.log('sass-loader:   SCSS → CSS');
console.log('asset modules: Images/fonts (webpack 5 built-in)');


// =============================================================================
// PLUGINS: WHAT THEY DO
// =============================================================================

console.log('\n=== Plugins ===\n');

/**
 *   ┌──────────────────────────────────────────────────────────────────────┐
 *   │  PLUGINS: Build-wide operations                                     │
 *   ├──────────────────────────────────────────────────────────────────────┤
 *   │                                                                      │
 *   │  Loaders:  Per-file transforms (CSS, TS, images)                    │
 *   │  Plugins:  Anything else (HTML gen, CSS extraction, minification)   │
 *   │                                                                      │
 *   │  Plugins hook into webpack's build lifecycle:                        │
 *   │                                                                      │
 *   │  compile → make → seal → emit → done                               │
 *   │    │        │       │      │      │                                 │
 *   │    │        │       │      │      └─ Build complete                 │
 *   │    │        │       │      └─ Write files to disk                   │
 *   │    │        │       └─ Optimize chunks, tree-shake                  │
 *   │    │        └─ Build dependency graph                               │
 *   │    └─ Start compilation                                             │
 *   │                                                                      │
 *   └──────────────────────────────────────────────────────────────────────┘
 *
 */


// =============================================================================
// KEY PLUGINS
// =============================================================================

console.log('\n=== Key Plugins ===\n');

/**
 *   ┌──────────────────────────────────────────────────────────────────────┐
 *   │  ESSENTIAL PLUGINS                                                   │
 *   ├──────────────────────────────────────────────────────────────────────┤
 *   │                                                                      │
 *   │  HtmlWebpackPlugin                                                  │
 *   │  → Generates index.html with <script> tags auto-injected           │
 *   │  → Template support                                                  │
 *   │                                                                      │
 *   │  MiniCssExtractPlugin                                               │
 *   │  → Extracts CSS to separate .css files (instead of <style> tags)   │
 *   │  → Replaces style-loader in production                             │
 *   │                                                                      │
 *   │  DefinePlugin (built-in)                                             │
 *   │  → Compile-time constants (process.env.NODE_ENV)                    │
 *   │  → Dead code elimination with mode: 'production'                    │
 *   │                                                                      │
 *   │  CopyWebpackPlugin                                                  │
 *   │  → Copy static files to dist/ (public/ folder)                     │
 *   │                                                                      │
 *   │  BundleAnalyzerPlugin                                               │
 *   │  → Visualize bundle size (treemap of modules)                       │
 *   │                                                                      │
 *   │  CleanWebpackPlugin                                                 │
 *   │  → Clean dist/ before each build (webpack 5: output.clean)         │
 *   │                                                                      │
 *   └──────────────────────────────────────────────────────────────────────┘
 *
 */

const examplePlugins = {
  plugins: [
    // HtmlWebpackPlugin: generates HTML with script tags
    // new HtmlWebpackPlugin({
    //   template: './src/index.html',
    //   minify: { collapseWhitespace: true }
    // }),

    // MiniCssExtractPlugin: CSS to separate files
    // new MiniCssExtractPlugin({
    //   filename: '[name].[contenthash].css'
    // }),

    // DefinePlugin: inject constants
    // new webpack.DefinePlugin({
    //   'process.env.API_URL': JSON.stringify('https://api.example.com')
    // }),
  ]
};

console.log('HtmlWebpackPlugin:     auto-generate HTML with script tags');
console.log('MiniCssExtractPlugin:  CSS → separate .css files');
console.log('DefinePlugin:          compile-time constants');
console.log('BundleAnalyzerPlugin:  visualize bundle contents');


// =============================================================================
// LOADERS vs PLUGINS
// =============================================================================

console.log('\n=== Loaders vs Plugins ===\n');

/**
 *   ┌──────────────────────────────────────────────────────────────────────┐
 *   │  LOADERS                             PLUGINS                         │
 *   ├──────────────────────────────────────────────────────────────────────┤
 *   │                                                                      │
 *   │  Transform individual files          Extend the build process        │
 *   │  Configured in module.rules          Configured in plugins array     │
 *   │  Run during module resolution        Hook into build lifecycle       │
 *   │  Input: file → Output: module        Can access entire compilation  │
 *   │                                                                      │
 *   │  Examples:                           Examples:                       │
 *   │  babel-loader (JS transform)         HtmlWebpackPlugin (gen HTML)   │
 *   │  css-loader (CSS → JS)              MiniCssExtract (extract CSS)   │
 *   │  ts-loader (TS → JS)               DefinePlugin (inject vars)      │
 *   │  file-loader (files → URLs)         BundleAnalyzer (visualize)      │
 *   │                                                                      │
 *   └──────────────────────────────────────────────────────────────────────┘
 *
 */

console.log('Loader: "How should I transform this .scss file?"');
console.log('Plugin: "Generate HTML and inject all bundle <script> tags"');


// =============================================================================
// DEV SERVER
// =============================================================================

console.log('\n=== Dev Server ===\n');

/**
 *   ┌──────────────────────────────────────────────────────────────────────┐
 *   │  webpack-dev-server                                                  │
 *   ├──────────────────────────────────────────────────────────────────────┤
 *   │                                                                      │
 *   │  devServer: {                                                        │
 *   │    port: 3000,                                                       │
 *   │    hot: true,              ← Hot Module Replacement                 │
 *   │    open: true,             ← Open browser on start                  │
 *   │    historyApiFallback: true, ← SPA routing (all routes → index)   │
 *   │    proxy: {                                                          │
 *   │      '/api': 'http://localhost:8080'  ← Proxy API calls            │
 *   │    }                                                                 │
 *   │  }                                                                   │
 *   │                                                                      │
 *   │  Serves from memory (no disk writes) → Fast!                        │
 *   │                                                                      │
 *   └──────────────────────────────────────────────────────────────────────┘
 *
 */

console.log('webpack-dev-server: in-memory builds, HMR, proxy');
console.log('historyApiFallback: needed for SPA client-side routing');


// =============================================================================
// INTERVIEW: What to Say
// =============================================================================

/**
 * "Loaders and plugins are the two extension mechanisms in webpack.
 *
 * Loaders are per-file transforms — they teach webpack to handle non-JS
 * files. For CSS, css-loader resolves imports and url(), then style-loader
 * injects it into the DOM. Loaders chain right-to-left, so the order
 * matters. In production, I swap style-loader for MiniCssExtractPlugin
 * to emit separate CSS files.
 *
 * Plugins hook into webpack's build lifecycle for broader tasks.
 * HtmlWebpackPlugin generates HTML with script tags automatically.
 * DefinePlugin injects compile-time constants like API URLs.
 * BundleAnalyzerPlugin helps find what's making the bundle large.
 *
 * The key distinction: loaders transform individual modules, plugins
 * operate on the entire compilation. If I need to process a file type,
 * I use a loader. If I need to affect the build output, I use a plugin."
 */


// RUN: node docs/29-bundlers-modules/08-webpack-loaders-plugins.js
