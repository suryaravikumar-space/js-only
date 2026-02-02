/**
 * BUNDLERS & MODULES: 13 - Code Splitting
 *
 * ONE CONCEPT: Load only what you need, when you need it
 */


// =============================================================================
// WHAT IS CODE SPLITTING?
// =============================================================================

console.log('=== Code Splitting ===\n');

/**
 *   ┌──────────────────────────────────────────────────────────────────────┐
 *   │  CODE SPLITTING: Break bundle into smaller chunks                   │
 *   ├──────────────────────────────────────────────────────────────────────┤
 *   │                                                                      │
 *   │  WITHOUT splitting:                                                  │
 *   │  ┌──────────────────────────────────────────┐                       │
 *   │  │ bundle.js (2MB)                          │                       │
 *   │  │ Home + Dashboard + Settings + Admin      │ ← User downloads ALL │
 *   │  │ + Chart library + PDF library            │    even for homepage  │
 *   │  └──────────────────────────────────────────┘                       │
 *   │                                                                      │
 *   │  WITH splitting:                                                     │
 *   │  ┌───────────────┐  Initial load (200KB)                            │
 *   │  │ main.js       │  Home page + shared code                         │
 *   │  └───────────────┘                                                  │
 *   │  ┌───────────────┐  Loaded when user visits /dashboard              │
 *   │  │ dashboard.js  │  Dashboard + Chart library                       │
 *   │  └───────────────┘                                                  │
 *   │  ┌───────────────┐  Loaded when user visits /admin                  │
 *   │  │ admin.js      │  Admin + PDF library                             │
 *   │  └───────────────┘                                                  │
 *   │                                                                      │
 *   │  Faster initial load! Only load what's needed.                      │
 *   │                                                                      │
 *   └──────────────────────────────────────────────────────────────────────┘
 *
 */

console.log('Code splitting = breaking one big bundle into smaller chunks');
console.log('Initial load only downloads what the current page needs');


// =============================================================================
// THREE APPROACHES
// =============================================================================

console.log('\n=== Three Approaches ===\n');

/**
 *   ┌──────────────────────────────────────────────────────────────────────┐
 *   │  1. ENTRY POINTS (Multiple entries)                                  │
 *   │     Manually split by page (MPA)                                    │
 *   │                                                                      │
 *   │  2. VENDOR SPLITTING (splitChunks)                                   │
 *   │     Separate node_modules from app code                             │
 *   │                                                                      │
 *   │  3. DYNAMIC IMPORT (import())                                       │
 *   │     Load modules on demand (route/feature level)                    │
 *   │     ← Most common and most impactful!                              │
 *   │                                                                      │
 *   └──────────────────────────────────────────────────────────────────────┘
 *
 */


// =============================================================================
// DYNAMIC IMPORT (import())
// =============================================================================

console.log('=== Dynamic import() ===\n');

/**
 *   ┌──────────────────────────────────────────────────────────────────────┐
 *   │  HOW DYNAMIC IMPORT CREATES CHUNKS                                  │
 *   ├──────────────────────────────────────────────────────────────────────┤
 *   │                                                                      │
 *   │  // app.js                                                           │
 *   │  button.onclick = async () => {                                      │
 *   │    const { Chart } = await import('./Chart.js');                    │
 *   │    //                    ↑ Bundler sees this and creates a chunk    │
 *   │    new Chart(data);                                                  │
 *   │  };                                                                  │
 *   │                                                                      │
 *   │  Build output:                                                       │
 *   │  dist/                                                               │
 *   │  ├── main.abc123.js        ← Entry chunk (loaded immediately)      │
 *   │  └── Chart.def456.js       ← Async chunk (loaded on click)         │
 *   │                                                                      │
 *   │  Network:                                                            │
 *   │  Page load:   GET main.abc123.js                                    │
 *   │  User clicks: GET Chart.def456.js  ← Only when needed!            │
 *   │                                                                      │
 *   └──────────────────────────────────────────────────────────────────────┘
 *
 */

// Simulating dynamic import pattern
async function loadChart() {
  console.log('  Loading chart module...');
  // const { Chart } = await import('./Chart.js');
  // return new Chart(data);
  return 'Chart loaded on demand!';
}

loadChart().then(console.log);


// =============================================================================
// REACT CODE SPLITTING
// =============================================================================

console.log('\n=== React Code Splitting ===\n');

/**
 *   ┌──────────────────────────────────────────────────────────────────────┐
 *   │  REACT.LAZY + SUSPENSE                                              │
 *   ├──────────────────────────────────────────────────────────────────────┤
 *   │                                                                      │
 *   │  // Route-level splitting                                            │
 *   │  const Dashboard = React.lazy(() => import('./Dashboard'));         │
 *   │  const Settings = React.lazy(() => import('./Settings'));           │
 *   │                                                                      │
 *   │  function App() {                                                    │
 *   │    return (                                                          │
 *   │      <Suspense fallback={<Spinner />}>                              │
 *   │        <Routes>                                                      │
 *   │          <Route path="/" element={<Home />} />                      │
 *   │          <Route path="/dash" element={<Dashboard />} />             │
 *   │          <Route path="/settings" element={<Settings />} />          │
 *   │        </Routes>                                                     │
 *   │      </Suspense>                                                     │
 *   │    );                                                                │
 *   │  }                                                                   │
 *   │                                                                      │
 *   │  Visiting /dash → downloads Dashboard chunk                         │
 *   │  Visiting /settings → downloads Settings chunk                      │
 *   │  Home is in the main bundle (always loaded)                         │
 *   │                                                                      │
 *   └──────────────────────────────────────────────────────────────────────┘
 *
 */

console.log('React.lazy(() => import("./Page"))');
console.log('Suspense provides loading fallback');
console.log('Each lazy component = separate chunk');


// =============================================================================
// WEBPACK MAGIC COMMENTS
// =============================================================================

console.log('\n=== Webpack Magic Comments ===\n');

/**
 *   ┌──────────────────────────────────────────────────────────────────────┐
 *   │  WEBPACK MAGIC COMMENTS                                              │
 *   ├──────────────────────────────────────────────────────────────────────┤
 *   │                                                                      │
 *   │  // Name the chunk (for debugging)                                   │
 *   │  import(/* webpackChunkName: "dashboard" * / './Dashboard');         │
 *   │  → dashboard.abc123.js                                              │
 *   │                                                                      │
 *   │  // Prefetch: download during idle time                              │
 *   │  import(/* webpackPrefetch: true * / './Dashboard');                 │
 *   │  → <link rel="prefetch" href="dashboard.js">                       │
 *   │  → Downloads after main content loaded                              │
 *   │                                                                      │
 *   │  // Preload: download in parallel with current                      │
 *   │  import(/* webpackPreload: true * / './Chart');                     │
 *   │  → <link rel="preload" href="chart.js">                            │
 *   │  → Downloads immediately (needed soon)                              │
 *   │                                                                      │
 *   │  PREFETCH vs PRELOAD:                                                │
 *   │  prefetch: "might need later" → low priority, during idle          │
 *   │  preload:  "need very soon"   → high priority, parallel            │
 *   │                                                                      │
 *   └──────────────────────────────────────────────────────────────────────┘
 *
 */

console.log('webpackChunkName: name the output chunk');
console.log('webpackPrefetch: download during idle (might need later)');
console.log('webpackPreload: download in parallel (needed soon)');


// =============================================================================
// SPLITTING STRATEGIES
// =============================================================================

console.log('\n=== Splitting Strategies ===\n');

/**
 *   ┌──────────────────────────────────────────────────────────────────────┐
 *   │  COMMON SPLITTING STRATEGIES                                         │
 *   ├──────────────────────────────────────────────────────────────────────┤
 *   │                                                                      │
 *   │  1. ROUTE-BASED (most common)                                       │
 *   │     Each page/route = separate chunk                                │
 *   │     / → main.js, /dashboard → dashboard.js                         │
 *   │                                                                      │
 *   │  2. COMPONENT-BASED                                                  │
 *   │     Heavy components loaded on demand                               │
 *   │     Modal, Chart, RichEditor → separate chunks                      │
 *   │                                                                      │
 *   │  3. VENDOR SPLITTING                                                 │
 *   │     node_modules in separate chunk (cached long-term)               │
 *   │                                                                      │
 *   │  4. ABOVE/BELOW THE FOLD                                             │
 *   │     Critical above-fold content in main bundle                      │
 *   │     Below-fold content lazy loaded                                  │
 *   │                                                                      │
 *   │  AVOID:                                                              │
 *   │  • Too many tiny chunks (HTTP overhead)                             │
 *   │  • Splitting shared code that's always needed                       │
 *   │  • Over-splitting (waterfall requests)                              │
 *   │                                                                      │
 *   └──────────────────────────────────────────────────────────────────────┘
 *
 */

console.log('Best: route-based splitting (each page = chunk)');
console.log('Also: heavy components on demand (charts, editors)');
console.log('Avoid: too many tiny chunks (HTTP overhead)');


// =============================================================================
// INTERVIEW: What to Say
// =============================================================================

/**
 * "Code splitting breaks the bundle into smaller chunks loaded on demand.
 * The main technique is dynamic import() — the bundler sees it and creates
 * a separate chunk that's loaded only when that code path executes.
 *
 * In React, I use React.lazy with Suspense for route-level splitting.
 * Each route becomes a separate chunk. When a user visits /dashboard,
 * only then is the dashboard chunk downloaded. This dramatically reduces
 * initial load time.
 *
 * Beyond routes, I split heavy components like chart libraries or rich
 * text editors that aren't needed on every page.
 *
 * Webpack supports prefetch (download during idle, for pages the user
 * might visit) and preload (download in parallel, for resources needed
 * soon). Vite handles this automatically based on the module graph.
 *
 * The key tradeoff is between initial load size and subsequent navigation
 * speed. I combine splitting with vendor chunking — vendor code stays
 * cached while app code chunks are loaded per route."
 */


// RUN: node docs/29-bundlers-modules/13-code-splitting.js
