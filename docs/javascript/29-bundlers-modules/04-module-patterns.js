/**
 * BUNDLERS & MODULES: 04 - Module Patterns & Dynamic Import
 *
 * ONE CONCEPT: Practical module patterns and dynamic import() for lazy loading
 */


// =============================================================================
// DYNAMIC IMPORT
// =============================================================================

console.log('=== Dynamic import() ===\n');

/**
 *   ┌──────────────────────────────────────────────────────────────────────┐
 *   │  import() — Dynamic Module Loading                                  │
 *   ├──────────────────────────────────────────────────────────────────────┤
 *   │                                                                      │
 *   │  Static import:                Dynamic import:                       │
 *   │  import { x } from './a';     const mod = await import('./a');      │
 *   │  ↑ Must be top-level          ↑ Can be anywhere                    │
 *   │  ↑ String literal only        ↑ Can use variables                  │
 *   │  ↑ Always loaded              ↑ Loaded on demand                   │
 *   │                                                                      │
 *   │  Returns a Promise<Module>:                                          │
 *   │  {                                                                   │
 *   │    default: ...,        ← default export                            │
 *   │    namedA: ...,         ← named exports                             │
 *   │    namedB: ...                                                       │
 *   │  }                                                                   │
 *   │                                                                      │
 *   │  USE CASES:                                                          │
 *   │  • Route-based code splitting                                       │
 *   │  • Conditional feature loading                                      │
 *   │  • Reducing initial bundle size                                     │
 *   │  • Loading polyfills only when needed                               │
 *   │                                                                      │
 *   └──────────────────────────────────────────────────────────────────────┘
 *
 */

// Conditional import
async function loadFeature(featureName) {
  try {
    const mod = await import(`./features/${featureName}.js`);
    return mod.default;
  } catch (e) {
    console.log(`  Feature "${featureName}" not found`);
    return null;
  }
}

// Route-based splitting (React pattern)
/**
 * const routes = {
 *   '/dashboard': () => import('./pages/Dashboard'),
 *   '/settings': () => import('./pages/Settings'),
 *   '/profile':  () => import('./pages/Profile'),
 * };
 *
 * // React.lazy
 * const Dashboard = React.lazy(() => import('./pages/Dashboard'));
 */

console.log('import() returns a Promise');
console.log('Bundlers create separate chunks for each import()');


// =============================================================================
// SINGLETON MODULE PATTERN
// =============================================================================

console.log('\n=== Singleton Pattern ===\n');

/**
 *   ┌─────────────────────────────────────────────────────────────────────┐
 *   │  MODULES ARE SINGLETONS                                            │
 *   ├─────────────────────────────────────────────────────────────────────┤
 *   │                                                                     │
 *   │  // store.js                                                        │
 *   │  class Store {                                                      │
 *   │    constructor() { this.data = {}; }                                │
 *   │  }                                                                  │
 *   │  export default new Store();   ← Same instance everywhere          │
 *   │                                                                     │
 *   │  // a.js                        // b.js                             │
 *   │  import store from './store';   import store from './store';        │
 *   │  store.data.x = 1;             console.log(store.data.x); // 1    │
 *   │  ↑ same object!                ↑ same object!                      │
 *   │                                                                     │
 *   └─────────────────────────────────────────────────────────────────────┘
 *
 */

// Simulating singleton module
const createStore = () => {
  const state = {};
  return {
    get: (key) => state[key],
    set: (key, val) => { state[key] = val; }
  };
};

const store = createStore();  // In real ESM, this runs once and is cached
store.set('user', 'Alice');
console.log('Singleton store:', store.get('user'));


// =============================================================================
// FACTORY MODULE PATTERN
// =============================================================================

console.log('\n=== Factory Pattern ===\n');

/**
 *   ┌─────────────────────────────────────────────────────────────────────┐
 *   │  EXPORT A FACTORY (Not singleton)                                  │
 *   ├─────────────────────────────────────────────────────────────────────┤
 *   │                                                                     │
 *   │  // logger.js                                                       │
 *   │  export function createLogger(prefix) {                             │
 *   │    return {                                                         │
 *   │      log: (msg) => console.log(`[${prefix}] ${msg}`),              │
 *   │      error: (msg) => console.error(`[${prefix}] ${msg}`)           │
 *   │    };                                                               │
 *   │  }                                                                  │
 *   │                                                                     │
 *   │  // app.js                                                          │
 *   │  import { createLogger } from './logger.js';                        │
 *   │  const dbLogger = createLogger('DB');                               │
 *   │  const apiLogger = createLogger('API');                             │
 *   │                                                                     │
 *   └─────────────────────────────────────────────────────────────────────┘
 *
 */

function createLogger(prefix) {
  return {
    log: (msg) => console.log(`  [${prefix}] ${msg}`),
    error: (msg) => console.log(`  [${prefix}] ERROR: ${msg}`)
  };
}

const dbLogger = createLogger('DB');
const apiLogger = createLogger('API');
dbLogger.log('Connected');
apiLogger.error('Timeout');


// =============================================================================
// NAMESPACE / BARREL PATTERN
// =============================================================================

console.log('\n=== Namespace & Barrel ===\n');

/**
 *   ┌──────────────────────────────────────────────────────────────────────┐
 *   │  BARREL (Re-export from index.js)                                   │
 *   ├──────────────────────────────────────────────────────────────────────┤
 *   │                                                                      │
 *   │  // utils/index.js                                                   │
 *   │  export { formatDate } from './date.js';                            │
 *   │  export { formatCurrency } from './currency.js';                    │
 *   │  export { capitalize } from './string.js';                          │
 *   │                                                                      │
 *   │  // app.js                                                           │
 *   │  import { formatDate, capitalize } from './utils';                  │
 *   │                                                                      │
 *   │  NAMESPACE:                                                          │
 *   │  import * as utils from './utils';                                   │
 *   │  utils.formatDate(...);                                              │
 *   │  utils.capitalize(...);                                              │
 *   │                                                                      │
 *   │  ⚠ Barrel performance:                                              │
 *   │  • Can cause ALL modules to be loaded even if you use one          │
 *   │  • Modern bundlers (webpack 5, Vite) handle this well              │
 *   │  • Next.js has modularizeImports to auto-convert                   │
 *   │                                                                      │
 *   └──────────────────────────────────────────────────────────────────────┘
 *
 */

console.log('Barrel: re-export from index.js for clean imports');
console.log('Namespace: import * as utils — groups under one name');


// =============================================================================
// UMD PATTERN (Legacy)
// =============================================================================

console.log('\n=== UMD Pattern (Legacy) ===\n');

/**
 *   ┌──────────────────────────────────────────────────────────────────────┐
 *   │  UMD: Works in CJS, AMD, and Browser Globals                       │
 *   ├──────────────────────────────────────────────────────────────────────┤
 *   │                                                                      │
 *   │  (function(root, factory) {                                          │
 *   │    if (typeof define === 'function' && define.amd) {                │
 *   │      define(['dep'], factory);           ← AMD                     │
 *   │    } else if (typeof module === 'object') {                         │
 *   │      module.exports = factory(require('dep')); ← CJS              │
 *   │    } else {                                                          │
 *   │      root.MyLib = factory(root.Dep);     ← Browser global          │
 *   │    }                                                                 │
 *   │  })(this, function(dep) {                                           │
 *   │    return { /* library */ };                                        │
 *   │  });                                                                 │
 *   │                                                                      │
 *   │  You'll see this in older libraries. Modern libs use ESM.           │
 *   │                                                                      │
 *   └──────────────────────────────────────────────────────────────────────┘
 *
 */

console.log('UMD: universal wrapper for CJS + AMD + global');
console.log('Legacy pattern — modern libraries ship ESM');


// =============================================================================
// TOP-LEVEL AWAIT (ESM Only)
// =============================================================================

console.log('\n=== Top-Level Await ===\n');

/**
 *   ┌──────────────────────────────────────────────────────────────────────┐
 *   │  TOP-LEVEL AWAIT (ESM Only)                                         │
 *   ├──────────────────────────────────────────────────────────────────────┤
 *   │                                                                      │
 *   │  // config.mjs                                                       │
 *   │  const response = await fetch('/api/config');                        │
 *   │  export const config = await response.json();                       │
 *   │                                                                      │
 *   │  // app.mjs                                                          │
 *   │  import { config } from './config.mjs';                             │
 *   │  // config is already resolved! ← Module waited for the await      │
 *   │                                                                      │
 *   │  How it works:                                                       │
 *   │  • Module with top-level await becomes async                        │
 *   │  • Importers automatically wait for it to resolve                   │
 *   │  • Doesn't block sibling modules (parallel loading)                │
 *   │  • Only blocks dependent modules                                    │
 *   │                                                                      │
 *   │  CJS cannot do this — no top-level await support                    │
 *   │                                                                      │
 *   └──────────────────────────────────────────────────────────────────────┘
 *
 */

console.log('ESM supports top-level await');
console.log('Great for: config loading, DB connections, feature detection');
console.log('CJS alternative: async IIFE wrapper');


// =============================================================================
// INTERVIEW: What to Say
// =============================================================================

/**
 * "Dynamic import() returns a Promise and lets you load modules on demand.
 * Bundlers recognize import() calls and automatically create separate chunks,
 * enabling code splitting. In React, React.lazy uses import() for
 * route-level splitting.
 *
 * Modules are singletons — the code runs once and the result is cached.
 * This is useful for shared state like stores or config. If you need
 * multiple instances, export a factory function instead.
 *
 * For library organization, I use barrel files (index.js re-exports) for
 * clean imports. Modern bundlers handle barrel tree-shaking well, but
 * for large libraries like lodash, direct imports are safer.
 *
 * Top-level await is an ESM-only feature that makes a module async.
 * Importers automatically wait for it. It's great for loading config
 * or establishing database connections at module level."
 */


// RUN: node docs/29-bundlers-modules/04-module-patterns.js
