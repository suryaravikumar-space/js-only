/**
 * ═══════════════════════════════════════════════════════════════════════════
 * JAVASCRIPT MODULE SYSTEMS - Tree Shaking
 * ═══════════════════════════════════════════════════════════════════════════
 *
 * Tree shaking is dead code elimination that removes unused exports
 * from the final bundle, reducing bundle size significantly.
 */

/**
 * ┌──────────────────────────────────────────────────────────────────────────┐
 * │                    TREE SHAKING VISUALIZATION                            │
 * ├──────────────────────────────────────────────────────────────────────────┤
 * │                                                                          │
 * │   SOURCE CODE (utils.js):          AFTER TREE SHAKING:                  │
 * │   ═══════════════════════          ═══════════════════                   │
 * │                                                                          │
 * │   export function add() {...}      // Only used function                │
 * │   export function subtract() {...} function add() {...}                 │
 * │   export function multiply() {...} // subtract, multiply                │
 * │   export function divide() {...}   // are removed!                      │
 * │                                                                          │
 * │   // app.js                                                              │
 * │   import { add } from './utils';   // Only imports 'add'                │
 * │   add(1, 2);                                                            │
 * │                                                                          │
 * │                      🌳 SHAKE THE TREE 🌳                               │
 * │                                                                          │
 * │        ┌─────────────────────┐                                          │
 * │        │     utils.js        │                                          │
 * │        │  ┌───┐ ┌───┐ ┌───┐  │                                          │
 * │        │  │add│ │sub│ │mul│  │    ←── Dead leaves fall                  │
 * │        │  └─┬─┘ └───┘ └───┘  │                                          │
 * │        │    │     ↓     ↓    │                                          │
 * │        │    │   💀    💀    │    ←── Removed from bundle               │
 * │        │    │                │                                          │
 * │        │    ▼                │                                          │
 * │        │ ┌─────┐             │                                          │
 * │        │ │app.js│            │    ←── Only 'add' in final bundle       │
 * │        │ └─────┘             │                                          │
 * │        └─────────────────────┘                                          │
 * │                                                                          │
 * └──────────────────────────────────────────────────────────────────────────┘
 */

console.log("═══════════════════════════════════════════════════════════════");
console.log("           TREE SHAKING");
console.log("═══════════════════════════════════════════════════════════════\n");

/**
 * ┌──────────────────────────────────────────────────────────────────────────┐
 * │                    HOW TREE SHAKING WORKS                                │
 * ├──────────────────────────────────────────────────────────────────────────┤
 * │                                                                          │
 * │   REQUIREMENTS FOR TREE SHAKING:                                        │
 * │   ═══════════════════════════════                                        │
 * │                                                                          │
 * │   1. ES Modules (import/export)                                         │
 * │      • Static analysis possible                                         │
 * │      • Imports/exports known at compile time                            │
 * │                                                                          │
 * │   2. No Side Effects                                                     │
 * │      • Or properly marked with sideEffects: false                       │
 * │      • Module execution shouldn't affect other code                     │
 * │                                                                          │
 * │   3. Bundler Support                                                     │
 * │      • Webpack, Rollup, esbuild all support tree shaking               │
 * │      • Production mode enabled                                          │
 * │                                                                          │
 * │   PROCESS:                                                               │
 * │   ════════                                                               │
 * │                                                                          │
 * │   1. Build dependency graph from imports                                │
 * │   2. Mark all exported symbols                                          │
 * │   3. Trace which exports are actually used                              │
 * │   4. Remove unused exports from bundle                                  │
 * │                                                                          │
 * └──────────────────────────────────────────────────────────────────────────┘
 */

console.log("─── Tree Shaking Requirements ───\n");

console.log("1. ES Modules");
console.log("   ✅ import { add } from './math'");
console.log("   ❌ const math = require('./math')\n");

console.log("2. Pure Functions (No Side Effects)");
console.log("   ✅ export const add = (a, b) => a + b");
console.log("   ❌ export const counter = globalCounter++\n");

console.log("3. Production Build");
console.log("   webpack --mode production");
console.log("   rollup -c --environment BUILD:production\n");

/**
 * ┌──────────────────────────────────────────────────────────────────────────┐
 * │                    TREE SHAKEABLE vs NON-SHAKEABLE                       │
 * └──────────────────────────────────────────────────────────────────────────┘
 */

console.log("─── Tree Shakeable Patterns ───\n");

// GOOD: Tree-shakeable
const treeShakeablePatterns = `
// ✅ GOOD: Named exports
export const add = (a, b) => a + b;
export const subtract = (a, b) => a - b;

// ✅ GOOD: Pure functions
export function multiply(a, b) {
    return a * b;  // No side effects
}

// ✅ GOOD: Constants
export const PI = 3.14159;
export const E = 2.71828;

// ✅ GOOD: Class (if unused methods are removed)
export class Calculator {
    add(a, b) { return a + b; }
}
`;

console.log("Tree-Shakeable Patterns:");
console.log(treeShakeablePatterns);

// BAD: Not tree-shakeable
const nonShakeablePatterns = `
// ❌ BAD: Namespace import can't be shaken
import * as utils from './utils';
utils.add(1, 2);  // Bundler keeps everything

// ❌ BAD: CommonJS
const { add } = require('./math');  // Not statically analyzable

// ❌ BAD: Side effects in module
let counter = 0;
export const increment = () => counter++;  // Modifies module state

// ❌ BAD: Default export object
export default {
    add: (a, b) => a + b,
    subtract: (a, b) => a - b
};
// Properties can't be individually shaken

// ❌ BAD: Re-exporting everything
export * from './utils';  // May keep unused exports

// ❌ BAD: Dynamic property access
const method = 'add';
utils[method](1, 2);  // Can't determine at compile time
`;

console.log("\nNon-Shakeable Patterns:");
console.log(nonShakeablePatterns);

/**
 * ┌──────────────────────────────────────────────────────────────────────────┐
 * │                    SIDE EFFECTS                                          │
 * ├──────────────────────────────────────────────────────────────────────────┤
 * │                                                                          │
 * │   Side Effect = Code that affects something outside its scope           │
 * │                                                                          │
 * │   EXAMPLES OF SIDE EFFECTS:                                             │
 * │   • Modifying global variables                                          │
 * │   • Modifying DOM                                                       │
 * │   • Making API calls                                                    │
 * │   • console.log                                                         │
 * │   • Polyfills                                                           │
 * │   • CSS imports                                                         │
 * │                                                                          │
 * │   package.json:                                                          │
 * │   {                                                                      │
 * │     "sideEffects": false  // All files are side-effect free            │
 * │   }                                                                      │
 * │                                                                          │
 * │   Or specify which files have side effects:                             │
 * │   {                                                                      │
 * │     "sideEffects": [                                                    │
 * │       "*.css",                                                          │
 * │       "*.scss",                                                         │
 * │       "./src/polyfills.js"                                              │
 * │     ]                                                                   │
 * │   }                                                                      │
 * │                                                                          │
 * └──────────────────────────────────────────────────────────────────────────┘
 */

console.log("─── Side Effects Configuration ───\n");

const sideEffectsExample = {
    "name": "my-library",
    "sideEffects": false,  // No side effects in any file

    // Or specify files with side effects:
    // "sideEffects": ["*.css", "./src/polyfills.js"]
};

console.log("package.json sideEffects field:");
console.log(JSON.stringify(sideEffectsExample, null, 2));

console.log("\nWhat counts as a side effect:");
console.log("  • Modifying global/window object");
console.log("  • DOM manipulation");
console.log("  • Polyfills that modify prototypes");
console.log("  • CSS imports (styles are side effects)");
console.log("  • Module-level code with external effects\n");

/**
 * ┌──────────────────────────────────────────────────────────────────────────┐
 * │                    PURE ANNOTATION                                       │
 * └──────────────────────────────────────────────────────────────────────────┘
 */

console.log("─── Pure Annotations ───\n");

const pureAnnotations = `
// Tell bundler this call has no side effects
const result = /*#__PURE__*/ createComponent();

// Useful for:
// - Function calls that return values
// - Factory functions
// - Higher-order functions

// Example with class
const MyClass = /*#__PURE__*/ (() => {
    class MyClass {
        // ...
    }
    return MyClass;
})();

// Terser/minifiers understand this annotation
// and will remove unused pure calls
`;

console.log("/*#__PURE__*/ Annotation:");
console.log(pureAnnotations);

/**
 * ┌──────────────────────────────────────────────────────────────────────────┐
 * │                    BUNDLER CONFIGURATION                                 │
 * └──────────────────────────────────────────────────────────────────────────┘
 */

console.log("─── Bundler Tree Shaking Configuration ───\n");

// Webpack
const webpackTreeShaking = `
// webpack.config.js
module.exports = {
    mode: 'production',  // Enables tree shaking

    optimization: {
        usedExports: true,      // Mark unused exports
        sideEffects: true,      // Check sideEffects field
        minimize: true,          // Remove marked code
        providedExports: true,   // Analyze exports
        innerGraph: true         // Track inner references
    }
};
`;

console.log("Webpack Configuration:");
console.log(webpackTreeShaking);

// Rollup
const rollupTreeShaking = `
// rollup.config.js
export default {
    input: 'src/index.js',
    output: { file: 'dist/bundle.js', format: 'esm' },

    treeshake: {
        moduleSideEffects: false,    // Assume no side effects
        propertyReadSideEffects: false,
        tryCatchDeoptimization: false,
        unknownGlobalSideEffects: false
    }
};
`;

console.log("\nRollup Configuration:");
console.log(rollupTreeShaking);

// esbuild
const esbuildTreeShaking = `
// esbuild (tree shaking is automatic)
esbuild.build({
    entryPoints: ['src/index.js'],
    bundle: true,
    treeShaking: true,  // Default: true
    minify: true,
    format: 'esm'
});
`;

console.log("\nesbuild Configuration:");
console.log(esbuildTreeShaking);

/**
 * ┌──────────────────────────────────────────────────────────────────────────┐
 * │                    LIBRARY OPTIMIZATION                                  │
 * └──────────────────────────────────────────────────────────────────────────┘
 */

console.log("─── Library Best Practices ───\n");

const libraryBestPractices = `
// 1. Use named exports, not default object
// ❌ BAD
export default {
    add, subtract, multiply, divide
};

// ✅ GOOD
export { add, subtract, multiply, divide };

// 2. Provide ESM build
// package.json
{
    "main": "dist/cjs/index.js",
    "module": "dist/esm/index.js",  // ESM entry for bundlers
    "sideEffects": false
}

// 3. Use subpath exports for large libraries
{
    "exports": {
        ".": "./dist/index.js",
        "./array": "./dist/array.js",
        "./string": "./dist/string.js"
    }
}

// Usage: import { map } from 'lodash-es/array'
// Only array module is included

// 4. Avoid barrel files that re-export everything
// ❌ BAD: index.js
export * from './array';
export * from './string';
export * from './object';
// All modules included even if one function used

// ✅ GOOD: Direct imports
import { debounce } from 'lodash-es/debounce';
`;

console.log(libraryBestPractices);

/**
 * ┌──────────────────────────────────────────────────────────────────────────┐
 * │                    ANALYZING BUNDLE                                      │
 * └──────────────────────────────────────────────────────────────────────────┘
 */

console.log("─── Bundle Analysis Tools ───\n");

console.log("1. Webpack Bundle Analyzer");
console.log("   npm install --save-dev webpack-bundle-analyzer");
console.log("   Visualize bundle contents\n");

console.log("2. Source Map Explorer");
console.log("   npx source-map-explorer dist/bundle.js");
console.log("   Analyze source map to see what's included\n");

console.log("3. Bundlephobia");
console.log("   https://bundlephobia.com/");
console.log("   Check package size before installing\n");

console.log("4. Import Cost (VS Code Extension)");
console.log("   Shows import size inline\n");

const bundleAnalyzerConfig = `
// webpack.config.js
const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;

module.exports = {
    plugins: [
        new BundleAnalyzerPlugin({
            analyzerMode: 'static',
            reportFilename: 'bundle-report.html'
        })
    ]
};
`;

console.log("Bundle Analyzer Setup:");
console.log(bundleAnalyzerConfig);

/**
 * ┌──────────────────────────────────────────────────────────────────────────┐
 * │                    COMMON TREE SHAKING ISSUES                            │
 * └──────────────────────────────────────────────────────────────────────────┘
 */

console.log("─── Common Tree Shaking Issues ───\n");

const commonIssues = {
    "Import entire library": {
        bad: "import _ from 'lodash'",
        good: "import { debounce } from 'lodash-es'",
        fix: "Use ES module version and named imports"
    },
    "Namespace imports": {
        bad: "import * as utils from './utils'",
        good: "import { needed } from './utils'",
        fix: "Import only what you need"
    },
    "Side effect imports": {
        bad: "import './styles.css' in unused file",
        good: "Configure sideEffects in package.json",
        fix: "Mark CSS files as side effects"
    },
    "Dynamic imports with variables": {
        bad: "import(`./modules/${name}`)",
        good: "import('./modules/specific')",
        fix: "Bundler can't analyze variable paths"
    },
    "Barrel files": {
        bad: "import { one } from './index' (re-exports all)",
        good: "import { one } from './one'",
        fix: "Import directly from source file"
    }
};

Object.entries(commonIssues).forEach(([issue, { bad, good, fix }]) => {
    console.log(`${issue}:`);
    console.log(`  ❌ ${bad}`);
    console.log(`  ✅ ${good}`);
    console.log(`  Fix: ${fix}\n`);
});

// ============================================================================
// Tree Shaking Cheat Sheet
// ============================================================================
console.log("╔══════════════════════════════════════════════════════════════════╗");
console.log("║           TREE SHAKING CHEAT SHEET                              ║");
console.log("╠══════════════════════════════════════════════════════════════════╣");
console.log("║                                                                  ║");
console.log("║  REQUIREMENTS:                                                   ║");
console.log("║  • Use ES modules (import/export)                               ║");
console.log("║  • Production mode build                                        ║");
console.log("║  • Configure sideEffects in package.json                        ║");
console.log("║                                                                  ║");
console.log("║  BEST PRACTICES:                                                 ║");
console.log("║  • Named exports over default objects                           ║");
console.log("║  • Direct imports over barrel files                             ║");
console.log("║  • Use /*#__PURE__*/ annotation                                 ║");
console.log("║  • Avoid namespace imports (import *)                           ║");
console.log("║  • Choose tree-shakeable library versions (-es)                 ║");
console.log("║                                                                  ║");
console.log("║  DEBUG:                                                          ║");
console.log("║  • webpack-bundle-analyzer                                      ║");
console.log("║  • source-map-explorer                                          ║");
console.log("║  • Check for sideEffects warnings                               ║");
console.log("║                                                                  ║");
console.log("╚══════════════════════════════════════════════════════════════════╝\n");

module.exports = {
    commonIssues
};

console.log("═══ Next: Dynamic Imports & Code Splitting ═══");
console.log("Run: node deep-dive/javaScript-module-systems/06-dynamic-imports.js");
