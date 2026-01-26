/**
 * ═══════════════════════════════════════════════════════════════════════════
 * JAVASCRIPT MODULE SYSTEMS - Bundlers
 * ═══════════════════════════════════════════════════════════════════════════
 *
 * Bundlers combine multiple JavaScript modules into optimized bundles for
 * browsers. Covers Webpack, Rollup, esbuild, Parcel, and Vite.
 */

/**
 * ┌──────────────────────────────────────────────────────────────────────────┐
 * │                    WHY BUNDLERS?                                         │
 * ├──────────────────────────────────────────────────────────────────────────┤
 * │                                                                          │
 * │   PROBLEMS BUNDLERS SOLVE:                                              │
 * │   ═════════════════════════                                              │
 * │                                                                          │
 * │   1. Module System Compatibility                                        │
 * │      • Convert CJS/ESM/AMD to browser-compatible code                   │
 * │      • Resolve node_modules dependencies                                │
 * │                                                                          │
 * │   2. HTTP Request Optimization                                          │
 * │      • Reduce number of requests (combine files)                        │
 * │      • Enable HTTP/2 multiplexing                                       │
 * │                                                                          │
 * │   3. Code Optimization                                                   │
 * │      • Minification                                                      │
 * │      • Tree shaking (dead code elimination)                             │
 * │      • Code splitting                                                    │
 * │                                                                          │
 * │   4. Asset Processing                                                    │
 * │      • Transpile TypeScript/JSX                                         │
 * │      • Process CSS, images, fonts                                       │
 * │      • Generate source maps                                             │
 * │                                                                          │
 * │   5. Development Experience                                              │
 * │      • Hot Module Replacement (HMR)                                     │
 * │      • Dev server with live reload                                      │
 * │                                                                          │
 * └──────────────────────────────────────────────────────────────────────────┘
 */

console.log("═══════════════════════════════════════════════════════════════");
console.log("           JAVASCRIPT BUNDLERS");
console.log("═══════════════════════════════════════════════════════════════\n");

/**
 * ┌──────────────────────────────────────────────────────────────────────────┐
 * │                    BUNDLER COMPARISON                                    │
 * ├──────────────────────────────────────────────────────────────────────────┤
 * │                                                                          │
 * │   ┌─────────────┬─────────┬─────────┬─────────┬─────────┬─────────┐     │
 * │   │ Feature     │ Webpack │ Rollup  │ esbuild │ Parcel  │ Vite    │     │
 * │   ├─────────────┼─────────┼─────────┼─────────┼─────────┼─────────┤     │
 * │   │ Speed       │ Slow    │ Medium  │ Fast    │ Medium  │ Fast    │     │
 * │   │ Config      │ Complex │ Medium  │ Simple  │ Zero    │ Simple  │     │
 * │   │ Tree Shake  │ ✅      │ ✅      │ ✅      │ ✅      │ ✅      │     │
 * │   │ Code Split  │ ✅      │ ✅      │ ✅      │ ✅      │ ✅      │     │
 * │   │ HMR         │ ✅      │ Plugin  │ Limited │ ✅      │ ✅      │     │
 * │   │ TypeScript  │ Loader  │ Plugin  │ Native  │ Native  │ Native  │     │
 * │   │ ESM Output  │ ✅      │ ✅      │ ✅      │ ✅      │ ✅      │     │
 * │   │ Plugins     │ Many    │ Many    │ Few     │ Some    │ Many    │     │
 * │   │ Best For    │ Apps    │ Libs    │ Speed   │ Simple  │ Modern  │     │
 * │   └─────────────┴─────────┴─────────┴─────────┴─────────┴─────────┘     │
 * │                                                                          │
 * └──────────────────────────────────────────────────────────────────────────┘
 */

console.log("─── Bundler Comparison ───\n");

const bundlerComparison = {
    webpack: {
        pros: ["Most plugins", "Highly configurable", "Code splitting"],
        cons: ["Slow", "Complex config", "Large bundle size"],
        bestFor: "Large applications, complex requirements"
    },
    rollup: {
        pros: ["Clean output", "Best tree shaking", "ESM-first"],
        cons: ["Less plugins", "CJS support weaker"],
        bestFor: "Libraries, npm packages"
    },
    esbuild: {
        pros: ["Extremely fast (10-100x)", "Simple", "Built-in TypeScript"],
        cons: ["Limited plugins", "No HMR", "Less mature"],
        bestFor: "Build speed priority, simple projects"
    },
    parcel: {
        pros: ["Zero config", "Fast", "Asset handling"],
        cons: ["Less control", "Larger bundles"],
        bestFor: "Quick prototypes, simple apps"
    },
    vite: {
        pros: ["Fast dev server", "ESM-based", "Modern"],
        cons: ["Newer ecosystem", "Build uses Rollup"],
        bestFor: "Modern frameworks (Vue, React, Svelte)"
    }
};

Object.entries(bundlerComparison).forEach(([name, info]) => {
    console.log(`${name.toUpperCase()}:`);
    console.log(`  Best for: ${info.bestFor}`);
    console.log(`  Pros: ${info.pros.join(', ')}`);
    console.log(`  Cons: ${info.cons.join(', ')}\n`);
});

/**
 * ┌──────────────────────────────────────────────────────────────────────────┐
 * │                    WEBPACK                                               │
 * └──────────────────────────────────────────────────────────────────────────┘
 */

console.log("═══════════════════════════════════════════════════════════════");
console.log("           WEBPACK");
console.log("═══════════════════════════════════════════════════════════════\n");

const webpackConfig = `
// webpack.config.js
const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');

module.exports = {
    mode: 'production',  // or 'development'

    entry: {
        main: './src/index.js',
        vendor: './src/vendor.js'
    },

    output: {
        path: path.resolve(__dirname, 'dist'),
        filename: '[name].[contenthash].js',
        clean: true
    },

    module: {
        rules: [
            // JavaScript/JSX
            {
                test: /\\.jsx?$/,
                exclude: /node_modules/,
                use: 'babel-loader'
            },
            // TypeScript
            {
                test: /\\.tsx?$/,
                use: 'ts-loader',
                exclude: /node_modules/
            },
            // CSS
            {
                test: /\\.css$/,
                use: [MiniCssExtractPlugin.loader, 'css-loader']
            },
            // Images
            {
                test: /\\.(png|svg|jpg|jpeg|gif)$/i,
                type: 'asset/resource'
            }
        ]
    },

    plugins: [
        new HtmlWebpackPlugin({
            template: './src/index.html'
        }),
        new MiniCssExtractPlugin({
            filename: '[name].[contenthash].css'
        })
    ],

    optimization: {
        splitChunks: {
            chunks: 'all',
            cacheGroups: {
                vendor: {
                    test: /[\\\\/]node_modules[\\\\/]/,
                    name: 'vendors',
                    chunks: 'all'
                }
            }
        }
    },

    resolve: {
        extensions: ['.tsx', '.ts', '.js'],
        alias: {
            '@': path.resolve(__dirname, 'src')
        }
    },

    devServer: {
        static: './dist',
        hot: true,
        port: 3000
    }
};
`;

console.log("Webpack Configuration:");
console.log(webpackConfig);

/**
 * ┌──────────────────────────────────────────────────────────────────────────┐
 * │                    ROLLUP                                                │
 * └──────────────────────────────────────────────────────────────────────────┘
 */

console.log("═══════════════════════════════════════════════════════════════");
console.log("           ROLLUP");
console.log("═══════════════════════════════════════════════════════════════\n");

const rollupConfig = `
// rollup.config.js
import resolve from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';
import typescript from '@rollup/plugin-typescript';
import terser from '@rollup/plugin-terser';
import { dts } from 'rollup-plugin-dts';

export default [
    // Main build
    {
        input: 'src/index.ts',
        output: [
            {
                file: 'dist/index.cjs.js',
                format: 'cjs',
                sourcemap: true
            },
            {
                file: 'dist/index.esm.js',
                format: 'esm',
                sourcemap: true
            },
            {
                file: 'dist/index.umd.js',
                format: 'umd',
                name: 'MyLibrary',
                globals: {
                    lodash: '_'
                }
            }
        ],
        external: ['lodash'],  // Don't bundle
        plugins: [
            resolve(),          // Resolve node_modules
            commonjs(),         // Convert CJS to ESM
            typescript(),       // TypeScript support
            terser()            // Minification
        ]
    },
    // Types
    {
        input: 'dist/types/index.d.ts',
        output: { file: 'dist/index.d.ts', format: 'es' },
        plugins: [dts()]
    }
];
`;

console.log("Rollup Configuration (Library):");
console.log(rollupConfig);

/**
 * ┌──────────────────────────────────────────────────────────────────────────┐
 * │                    ESBUILD                                               │
 * └──────────────────────────────────────────────────────────────────────────┘
 */

console.log("═══════════════════════════════════════════════════════════════");
console.log("           ESBUILD");
console.log("═══════════════════════════════════════════════════════════════\n");

const esbuildConfig = `
// esbuild.config.js
import * as esbuild from 'esbuild';

// Build script
await esbuild.build({
    entryPoints: ['src/index.ts'],
    bundle: true,
    minify: true,
    sourcemap: true,
    target: ['es2020', 'chrome90', 'firefox88'],
    outfile: 'dist/bundle.js',
    format: 'esm',
    splitting: true,
    outdir: 'dist',
    external: ['lodash'],
    loader: {
        '.png': 'file',
        '.svg': 'text'
    },
    define: {
        'process.env.NODE_ENV': '"production"'
    },
    plugins: []
});

// CLI equivalent:
// esbuild src/index.ts --bundle --minify --outfile=dist/bundle.js

// Watch mode
const ctx = await esbuild.context({
    entryPoints: ['src/index.ts'],
    bundle: true,
    outfile: 'dist/bundle.js'
});
await ctx.watch();

// Serve mode
await ctx.serve({
    servedir: 'dist',
    port: 3000
});
`;

console.log("esbuild Configuration:");
console.log(esbuildConfig);

console.log("esbuild Speed Comparison:");
console.log("  Webpack:  40+ seconds");
console.log("  Rollup:   30+ seconds");
console.log("  esbuild:  ~0.4 seconds ← 100x faster!\n");

/**
 * ┌──────────────────────────────────────────────────────────────────────────┐
 * │                    VITE                                                  │
 * └──────────────────────────────────────────────────────────────────────────┘
 */

console.log("═══════════════════════════════════════════════════════════════");
console.log("           VITE");
console.log("═══════════════════════════════════════════════════════════════\n");

const viteConfig = `
// vite.config.js
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

export default defineConfig({
    plugins: [react()],

    resolve: {
        alias: {
            '@': path.resolve(__dirname, 'src')
        }
    },

    build: {
        outDir: 'dist',
        sourcemap: true,
        rollupOptions: {
            output: {
                manualChunks: {
                    vendor: ['react', 'react-dom'],
                    lodash: ['lodash']
                }
            }
        }
    },

    server: {
        port: 3000,
        open: true,
        proxy: {
            '/api': {
                target: 'http://localhost:8080',
                changeOrigin: true
            }
        }
    },

    css: {
        modules: {
            localsConvention: 'camelCase'
        },
        preprocessorOptions: {
            scss: {
                additionalData: '@import "./src/styles/variables";'
            }
        }
    }
});

// Commands:
// vite           - Start dev server
// vite build     - Production build
// vite preview   - Preview production build
`;

console.log("Vite Configuration:");
console.log(viteConfig);

/**
 * ┌──────────────────────────────────────────────────────────────────────────┐
 * │                    BUNDLER CONCEPTS                                      │
 * └──────────────────────────────────────────────────────────────────────────┘
 */

console.log("═══════════════════════════════════════════════════════════════");
console.log("           KEY BUNDLER CONCEPTS");
console.log("═══════════════════════════════════════════════════════════════\n");

console.log("1. ENTRY POINTS");
console.log("   Starting point(s) for dependency graph");
console.log("   entry: './src/index.js'\n");

console.log("2. OUTPUT");
console.log("   Where and how bundles are generated");
console.log("   output: { filename: '[name].[hash].js', path: 'dist' }\n");

console.log("3. LOADERS (Webpack) / PLUGINS");
console.log("   Transform non-JS files (CSS, images, TypeScript)");
console.log("   module.rules: [{ test: /\\.css$/, use: 'css-loader' }]\n");

console.log("4. CODE SPLITTING");
console.log("   Split code into chunks loaded on demand");
console.log("   - Dynamic imports: import('./module.js')");
console.log("   - Entry points: Multiple entries");
console.log("   - Vendor splitting: Separate node_modules\n");

console.log("5. CHUNK HASHING");
console.log("   Cache busting with content-based hashes");
console.log("   [name].[contenthash].js → app.a1b2c3d4.js\n");

console.log("6. SOURCE MAPS");
console.log("   Map minified code back to source");
console.log("   devtool: 'source-map'\n");

// ============================================================================
// Bundler Cheat Sheet
// ============================================================================
console.log("╔══════════════════════════════════════════════════════════════════╗");
console.log("║           BUNDLER CHEAT SHEET                                   ║");
console.log("╠══════════════════════════════════════════════════════════════════╣");
console.log("║                                                                  ║");
console.log("║  CHOOSE:                                                         ║");
console.log("║  • Webpack: Complex apps, need everything                       ║");
console.log("║  • Rollup:  Libraries, npm packages                             ║");
console.log("║  • esbuild: Speed priority, simple builds                       ║");
console.log("║  • Parcel:  Zero config, quick start                            ║");
console.log("║  • Vite:    Modern dev experience, Vue/React                    ║");
console.log("║                                                                  ║");
console.log("║  KEY FEATURES:                                                   ║");
console.log("║  • Tree shaking: Remove unused exports                          ║");
console.log("║  • Code splitting: Load code on demand                          ║");
console.log("║  • Minification: Reduce file size                               ║");
console.log("║  • HMR: Update modules without full reload                      ║");
console.log("║  • Source maps: Debug production code                           ║");
console.log("║                                                                  ║");
console.log("║  COMMANDS:                                                       ║");
console.log("║  webpack/rollup/esbuild/vite + build/dev/serve                  ║");
console.log("║                                                                  ║");
console.log("╚══════════════════════════════════════════════════════════════════╝\n");

module.exports = {
    bundlerComparison
};

console.log("═══ Next: Tree Shaking ═══");
console.log("Run: node deep-dive/javaScript-module-systems/05-tree-shaking.js");
