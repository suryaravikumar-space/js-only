/**
 * MODULES: 06 - Dynamic Imports & Code Splitting
 *
 * ╔════════════════════════════════════════════════════════════════════════════╗
 * ║ DYNAMIC IMPORTS - import() Function                                        ║
 * ╠════════════════════════════════════════════════════════════════════════════╣
 * ║                                                                            ║
 * ║ Load modules ON DEMAND at runtime, not at startup.                         ║
 * ║ Essential for performance optimization and code splitting.                 ║
 * ║                                                                            ║
 * ║ Syntax: import('./module.js') → Returns a Promise                          ║
 * ║                                                                            ║
 * ╚════════════════════════════════════════════════════════════════════════════╝
 */


// ═══════════════════════════════════════════════════════════════════════════════
// STATIC vs DYNAMIC IMPORTS
// ═══════════════════════════════════════════════════════════════════════════════

console.log('=== Static vs Dynamic Imports ===\n');

/**
 * ┌─────────────────────────────────────────────────────────────────────────────┐
 * │ COMPARISON                                                                  │
 * ├─────────────────────────────────────────────────────────────────────────────┤
 * │                                                                             │
 * │   STATIC IMPORT (Standard):                                                 │
 * │   ──────────────────────────────────────────────────────────────────        │
 * │                                                                             │
 * │   import { add } from './math.js';                                          │
 * │                                                                             │
 * │   • MUST be at top level of module                                          │
 * │   • MUST use string literal path                                            │
 * │   • Loaded BEFORE code execution                                            │
 * │   • Blocks rendering until loaded                                           │
 * │                                                                             │
 * │                                                                             │
 * │   DYNAMIC IMPORT (import()):                                                │
 * │   ──────────────────────────────────────────────────────────────────        │
 * │                                                                             │
 * │   const module = await import('./math.js');                                 │
 * │                                                                             │
 * │   • Can be used ANYWHERE (inside functions, if blocks, etc.)                │
 * │   • Can use COMPUTED paths                                                  │
 * │   • Returns a PROMISE                                                       │
 * │   • Loads ASYNCHRONOUSLY                                                    │
 * │                                                                             │
 * │                                                                             │
 * │   ┌────────────────────────────────────────────────────────────────────┐    │
 * │   │         STATIC                        DYNAMIC                      │    │
 * │   │         ──────                        ───────                      │    │
 * │   │   import { x }                   await import()                    │    │
 * │   │        │                              │                            │    │
 * │   │        ▼                              ▼                            │    │
 * │   │   ┌──────────┐                  ┌──────────┐                       │    │
 * │   │   │ Sync     │                  │ Async    │                       │    │
 * │   │   │ Blocking │                  │ Promise  │                       │    │
 * │   │   │ Top-level│                  │ Anywhere │                       │    │
 * │   │   └──────────┘                  └──────────┘                       │    │
 * │   └────────────────────────────────────────────────────────────────────┘    │
 * │                                                                             │
 * └─────────────────────────────────────────────────────────────────────────────┘
 */

console.log('A: Static imports load before execution, dynamic imports return Promises');


// ═══════════════════════════════════════════════════════════════════════════════
// BASIC USAGE
// ═══════════════════════════════════════════════════════════════════════════════

console.log('\n=== Basic Dynamic Import Usage ===\n');

/**
 * ┌─────────────────────────────────────────────────────────────────────────────┐
 * │ DYNAMIC IMPORT SYNTAX                                                       │
 * ├─────────────────────────────────────────────────────────────────────────────┤
 * │                                                                             │
 * │   // 1. With async/await                                                    │
 * │   async function loadMath() {                                               │
 * │     const { add, subtract } = await import('./math.js');                    │
 * │     console.log(add(1, 2));                                                 │
 * │   }                                                                         │
 * │                                                                             │
 * │   // 2. With .then()                                                        │
 * │   import('./math.js').then(({ add }) => {                                   │
 * │     console.log(add(1, 2));                                                 │
 * │   });                                                                       │
 * │                                                                             │
 * │   // 3. Default and named exports                                           │
 * │   const module = await import('./module.js');                               │
 * │   module.default;       // Default export                                   │
 * │   module.namedExport;   // Named export                                     │
 * │                                                                             │
 * │   // 4. Destructuring                                                       │
 * │   const { default: MyClass, helper } = await import('./module.js');         │
 * │                                                                             │
 * └─────────────────────────────────────────────────────────────────────────────┘
 */

// Example: Basic dynamic import
async function loadModule() {
  console.log('B: Loading module dynamically...');

  // Simulate dynamic import
  const fakeModule = await Promise.resolve({
    default: class Calculator {},
    add: (a, b) => a + b,
    PI: 3.14159
  });

  console.log('C: Module loaded:', Object.keys(fakeModule));
  console.log('D: add(2, 3):', fakeModule.add(2, 3));
}

loadModule();


// ═══════════════════════════════════════════════════════════════════════════════
// CONDITIONAL LOADING
// ═══════════════════════════════════════════════════════════════════════════════

console.log('\n=== Conditional Loading ===\n');

/**
 * ┌─────────────────────────────────────────────────────────────────────────────┐
 * │ LOAD MODULES BASED ON CONDITIONS                                            │
 * ├─────────────────────────────────────────────────────────────────────────────┤
 * │                                                                             │
 * │   // Load based on feature flag                                             │
 * │   if (featureEnabled) {                                                     │
 * │     const { feature } = await import('./feature.js');                       │
 * │     feature.init();                                                         │
 * │   }                                                                         │
 * │                                                                             │
 * │   // Load based on user role                                                │
 * │   if (user.isAdmin) {                                                       │
 * │     const adminPanel = await import('./AdminPanel.js');                     │
 * │   }                                                                         │
 * │                                                                             │
 * │   // Load based on browser support                                          │
 * │   if (!window.IntersectionObserver) {                                       │
 * │     await import('intersection-observer-polyfill');                         │
 * │   }                                                                         │
 * │                                                                             │
 * │   // Load based on environment                                              │
 * │   if (process.env.NODE_ENV === 'development') {                             │
 * │     const devTools = await import('./devTools.js');                         │
 * │   }                                                                         │
 * │                                                                             │
 * └─────────────────────────────────────────────────────────────────────────────┘
 */

// Example: Conditional loading
async function loadBasedOnCondition(isAdmin) {
  if (isAdmin) {
    console.log('E: Loading admin features...');
    // const admin = await import('./admin.js');
    return { admin: true };
  }
  console.log('F: Loading regular features...');
  return { admin: false };
}

loadBasedOnCondition(true);


// ═══════════════════════════════════════════════════════════════════════════════
// DYNAMIC PATHS
// ═══════════════════════════════════════════════════════════════════════════════

console.log('\n=== Dynamic Paths ===\n');

/**
 * ┌─────────────────────────────────────────────────────────────────────────────┐
 * │ COMPUTED MODULE PATHS                                                       │
 * ├─────────────────────────────────────────────────────────────────────────────┤
 * │                                                                             │
 * │   // Load locale files dynamically                                          │
 * │   async function loadLocale(lang) {                                         │
 * │     const locale = await import(`./locales/${lang}.js`);                    │
 * │     return locale.messages;                                                 │
 * │   }                                                                         │
 * │                                                                             │
 * │   loadLocale('en');  // Loads ./locales/en.js                               │
 * │   loadLocale('es');  // Loads ./locales/es.js                               │
 * │                                                                             │
 * │                                                                             │
 * │   // Load plugins dynamically                                               │
 * │   async function loadPlugin(name) {                                         │
 * │     const plugin = await import(`./plugins/${name}/index.js`);              │
 * │     return plugin.default;                                                  │
 * │   }                                                                         │
 * │                                                                             │
 * │                                                                             │
 * │   // Load theme                                                             │
 * │   const theme = await import(`./themes/${themeName}.css`);                  │
 * │                                                                             │
 * │                                                                             │
 * │   ⚠️ SECURITY: Validate user input before using in paths!                   │
 * │                                                                             │
 * │   // BAD - User-controlled path                                             │
 * │   const module = await import(userInput);  // DANGEROUS!                    │
 * │                                                                             │
 * │   // GOOD - Validate against allowed modules                                │
 * │   const allowedModules = ['en', 'es', 'fr'];                                │
 * │   if (allowedModules.includes(lang)) {                                      │
 * │     const module = await import(`./locales/${lang}.js`);                    │
 * │   }                                                                         │
 * │                                                                             │
 * └─────────────────────────────────────────────────────────────────────────────┘
 */

// Example: Dynamic path
async function loadLocale(lang) {
  const allowed = ['en', 'es', 'fr', 'de'];

  if (!allowed.includes(lang)) {
    throw new Error(`Invalid locale: ${lang}`);
  }

  console.log(`G: Would load: ./locales/${lang}.js`);
  // const locale = await import(`./locales/${lang}.js`);
  // return locale;
}

loadLocale('en');


// ═══════════════════════════════════════════════════════════════════════════════
// CODE SPLITTING
// ═══════════════════════════════════════════════════════════════════════════════

console.log('\n=== Code Splitting ===\n');

/**
 * ┌─────────────────────────────────────────────────────────────────────────────┐
 * │ CODE SPLITTING - Bundler creates separate chunks                            │
 * ├─────────────────────────────────────────────────────────────────────────────┤
 * │                                                                             │
 * │   WITHOUT CODE SPLITTING:                                                   │
 * │   ┌────────────────────────────────────────────────────────────────────┐    │
 * │   │                                                                    │    │
 * │   │   bundle.js (500 KB)                                               │    │
 * │   │   ├── App code                                                     │    │
 * │   │   ├── Admin panel (rarely used)                                    │    │
 * │   │   ├── Charts library (only used on dashboard)                      │    │
 * │   │   └── All dependencies                                             │    │
 * │   │                                                                    │    │
 * │   │   → User downloads 500 KB even for simple pages!                   │    │
 * │   │                                                                    │    │
 * │   └────────────────────────────────────────────────────────────────────┘    │
 * │                                                                             │
 * │                                                                             │
 * │   WITH CODE SPLITTING:                                                      │
 * │   ┌────────────────────────────────────────────────────────────────────┐    │
 * │   │                                                                    │    │
 * │   │   main.js (100 KB)         ← Loaded immediately                    │    │
 * │   │   ├── App code                                                     │    │
 * │   │   └── Core dependencies                                            │    │
 * │   │                                                                    │    │
 * │   │   admin.chunk.js (150 KB)  ← Loaded when admin panel opened        │    │
 * │   │   charts.chunk.js (200 KB) ← Loaded when dashboard visited         │    │
 * │   │   vendor.chunk.js (50 KB)  ← Shared dependencies                   │    │
 * │   │                                                                    │    │
 * │   │   → User downloads only what's needed!                             │    │
 * │   │                                                                    │    │
 * │   └────────────────────────────────────────────────────────────────────┘    │
 * │                                                                             │
 * └─────────────────────────────────────────────────────────────────────────────┘
 */

console.log('H: Code splitting reduces initial load time');


// ═══════════════════════════════════════════════════════════════════════════════
// REACT LAZY LOADING
// ═══════════════════════════════════════════════════════════════════════════════

console.log('\n=== Framework Examples ===\n');

/**
 * ┌─────────────────────────────────────────────────────────────────────────────┐
 * │ REACT LAZY LOADING                                                          │
 * ├─────────────────────────────────────────────────────────────────────────────┤
 * │                                                                             │
 * │   import { lazy, Suspense } from 'react';                                   │
 * │                                                                             │
 * │   // Lazy load component                                                    │
 * │   const Dashboard = lazy(() => import('./Dashboard'));                      │
 * │   const AdminPanel = lazy(() => import('./AdminPanel'));                    │
 * │                                                                             │
 * │   function App() {                                                          │
 * │     return (                                                                │
 * │       <Suspense fallback={<Loading />}>                                     │
 * │         <Routes>                                                            │
 * │           <Route path="/dashboard" element={<Dashboard />} />               │
 * │           <Route path="/admin" element={<AdminPanel />} />                  │
 * │         </Routes>                                                           │
 * │       </Suspense>                                                           │
 * │     );                                                                      │
 * │   }                                                                         │
 * │                                                                             │
 * │                                                                             │
 * │   VUE ASYNC COMPONENTS:                                                     │
 * │   ──────────────────────────────────────────────────────────────────        │
 * │                                                                             │
 * │   const Dashboard = defineAsyncComponent(() =>                              │
 * │     import('./components/Dashboard.vue')                                    │
 * │   );                                                                        │
 * │                                                                             │
 * │                                                                             │
 * │   NEXT.JS DYNAMIC:                                                          │
 * │   ──────────────────────────────────────────────────────────────────        │
 * │                                                                             │
 * │   import dynamic from 'next/dynamic';                                       │
 * │                                                                             │
 * │   const Chart = dynamic(() => import('./Chart'), {                          │
 * │     loading: () => <p>Loading...</p>,                                       │
 * │     ssr: false  // Disable server-side rendering                            │
 * │   });                                                                       │
 * │                                                                             │
 * └─────────────────────────────────────────────────────────────────────────────┘
 */

console.log('I: Frameworks provide wrappers around dynamic import()');


// ═══════════════════════════════════════════════════════════════════════════════
// ERROR HANDLING
// ═══════════════════════════════════════════════════════════════════════════════

console.log('\n=== Error Handling ===\n');

/**
 * ┌─────────────────────────────────────────────────────────────────────────────┐
 * │ HANDLING DYNAMIC IMPORT ERRORS                                              │
 * ├─────────────────────────────────────────────────────────────────────────────┤
 * │                                                                             │
 * │   // Try-catch approach                                                     │
 * │   async function loadModule() {                                             │
 * │     try {                                                                   │
 * │       const module = await import('./feature.js');                          │
 * │       return module;                                                        │
 * │     } catch (error) {                                                       │
 * │       if (error.code === 'MODULE_NOT_FOUND') {                              │
 * │         console.error('Module not found');                                  │
 * │       } else {                                                              │
 * │         console.error('Failed to load module:', error);                     │
 * │       }                                                                     │
 * │       return null;                                                          │
 * │     }                                                                       │
 * │   }                                                                         │
 * │                                                                             │
 * │                                                                             │
 * │   // With retry logic                                                       │
 * │   async function loadWithRetry(path, maxRetries = 3) {                      │
 * │     for (let i = 0; i < maxRetries; i++) {                                  │
 * │       try {                                                                 │
 * │         return await import(path);                                          │
 * │       } catch (error) {                                                     │
 * │         if (i === maxRetries - 1) throw error;                              │
 * │         await new Promise(r => setTimeout(r, 1000 * (i + 1)));              │
 * │       }                                                                     │
 * │     }                                                                       │
 * │   }                                                                         │
 * │                                                                             │
 * └─────────────────────────────────────────────────────────────────────────────┘
 */

async function safeImport(moduleName) {
  try {
    // Simulating module load that might fail
    if (moduleName === 'bad-module') {
      throw new Error('MODULE_NOT_FOUND');
    }
    console.log(`J: Successfully loaded ${moduleName}`);
    return {};
  } catch (error) {
    console.log(`K: Failed to load ${moduleName}:`, error.message);
    return null;
  }
}

safeImport('good-module');
safeImport('bad-module');


/**
 * ┌─────────────────────────────────────────────────────────────────────────────┐
 * │ INTERVIEW ANSWER                                                            │
 * ├─────────────────────────────────────────────────────────────────────────────┤
 * │                                                                             │
 * │ "Dynamic imports with import() allow loading modules on demand:             │
 * │                                                                             │
 * │ Key features:                                                               │
 * │ • Returns a Promise (must use await or .then())                             │
 * │ • Can be used anywhere in code (not just top-level)                         │
 * │ • Supports computed/dynamic paths                                           │
 * │ • Enables code splitting                                                    │
 * │                                                                             │
 * │ Use cases:                                                                  │
 * │ 1. Route-based code splitting - load page components on navigation          │
 * │ 2. Feature flags - load features conditionally                              │
 * │ 3. Locale loading - load translations based on user language                │
 * │ 4. Heavy libraries - load charts/editors only when needed                   │
 * │ 5. Polyfills - load only for browsers that need them                        │
 * │                                                                             │
 * │ React example:                                                              │
 * │ const Component = lazy(() => import('./Component'));                        │
 * │                                                                             │
 * │ The bundler (Webpack, Vite) automatically creates separate chunks for       │
 * │ dynamic imports, reducing initial bundle size and improving load time."     │
 * │                                                                             │
 * └─────────────────────────────────────────────────────────────────────────────┘
 *
 *
 * RUN: node docs/20-modules-esm-cjs/06-dynamic-imports.js
 */
