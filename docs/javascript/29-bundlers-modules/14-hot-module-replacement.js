/**
 * BUNDLERS & MODULES: 14 - Hot Module Replacement (HMR)
 *
 * ONE CONCEPT: Update modules in the browser without a full page reload
 */


// =============================================================================
// WHAT IS HMR?
// =============================================================================

console.log('=== Hot Module Replacement ===\n');

/**
 *   ┌──────────────────────────────────────────────────────────────────────┐
 *   │  HMR: Update code WITHOUT losing application state                  │
 *   ├──────────────────────────────────────────────────────────────────────┤
 *   │                                                                      │
 *   │  WITHOUT HMR (Full Reload):                                         │
 *   │  Save file → Rebuild ALL → Reload page → Lose state                │
 *   │  • Form data lost                                                    │
 *   │  • Scroll position reset                                            │
 *   │  • Modal closed                                                      │
 *   │  • Redux store reset                                                │
 *   │                                                                      │
 *   │  WITH HMR:                                                          │
 *   │  Save file → Transform CHANGED module → Patch in browser            │
 *   │  • State preserved!                                                  │
 *   │  • Form data kept                                                    │
 *   │  • Scroll position kept                                             │
 *   │  • Only changed component re-renders                                │
 *   │                                                                      │
 *   └──────────────────────────────────────────────────────────────────────┘
 *
 */

console.log('HMR: swap modules in browser without losing state');
console.log('Essential for good developer experience');


// =============================================================================
// HOW HMR WORKS
// =============================================================================

console.log('\n=== How HMR Works ===\n');

/**
 *   ┌──────────────────────────────────────────────────────────────────────┐
 *   │  HMR FLOW                                                           │
 *   ├──────────────────────────────────────────────────────────────────────┤
 *   │                                                                      │
 *   │  1. You save a file                                                  │
 *   │     │                                                                │
 *   │     ▼                                                                │
 *   │  2. Dev server detects change (file watcher)                        │
 *   │     │                                                                │
 *   │     ▼                                                                │
 *   │  3. Server re-compiles ONLY changed module                          │
 *   │     │                                                                │
 *   │     ▼                                                                │
 *   │  4. Server sends update via WebSocket                               │
 *   │     { type: 'update', path: '/src/Button.jsx' }                    │
 *   │     │                                                                │
 *   │     ▼                                                                │
 *   │  5. Browser HMR runtime receives update                             │
 *   │     │                                                                │
 *   │     ▼                                                                │
 *   │  6. Old module replaced with new module                             │
 *   │     │                                                                │
 *   │     ▼                                                                │
 *   │  7. Accept handler runs (re-render component)                       │
 *   │     React Fast Refresh re-renders with preserved state              │
 *   │                                                                      │
 *   │  If no accept handler → FULL PAGE RELOAD (fallback)                │
 *   │                                                                      │
 *   └──────────────────────────────────────────────────────────────────────┘
 *
 */

console.log('File change → WebSocket → Replace module → Re-render');
console.log('No accept handler → falls back to full reload');


// =============================================================================
// WEBPACK HMR API
// =============================================================================

console.log('\n=== Webpack HMR API ===\n');

/**
 *   ┌──────────────────────────────────────────────────────────────────────┐
 *   │  WEBPACK HMR API (Low-level)                                        │
 *   ├──────────────────────────────────────────────────────────────────────┤
 *   │                                                                      │
 *   │  // module.hot only exists in development                           │
 *   │  if (module.hot) {                                                   │
 *   │    // Accept updates for THIS module                                │
 *   │    module.hot.accept();                                              │
 *   │                                                                      │
 *   │    // Accept updates for a DEPENDENCY                               │
 *   │    module.hot.accept('./Button', () => {                            │
 *   │      // Re-render with new Button                                   │
 *   │      render();                                                       │
 *   │    });                                                               │
 *   │                                                                      │
 *   │    // Cleanup before module is replaced                             │
 *   │    module.hot.dispose((data) => {                                   │
 *   │      clearInterval(timer);      // Clean up side effects           │
 *   │      data.savedState = state;   // Pass data to new version        │
 *   │    });                                                               │
 *   │  }                                                                   │
 *   │                                                                      │
 *   │  You rarely write this manually — frameworks handle it:             │
 *   │  React: React Fast Refresh                                          │
 *   │  Vue: vue-loader HMR                                                │
 *   │                                                                      │
 *   └──────────────────────────────────────────────────────────────────────┘
 *
 */

console.log('module.hot.accept() — accept updates for this module');
console.log('module.hot.dispose() — cleanup before replacement');
console.log('In practice: frameworks handle HMR automatically');


// =============================================================================
// VITE HMR API
// =============================================================================

console.log('\n=== Vite HMR API ===\n');

/**
 *   ┌──────────────────────────────────────────────────────────────────────┐
 *   │  VITE HMR API (import.meta.hot)                                     │
 *   ├──────────────────────────────────────────────────────────────────────┤
 *   │                                                                      │
 *   │  if (import.meta.hot) {                                              │
 *   │    import.meta.hot.accept((newModule) => {                          │
 *   │      // Handle updated module                                       │
 *   │    });                                                               │
 *   │                                                                      │
 *   │    import.meta.hot.dispose(() => {                                  │
 *   │      // Cleanup                                                      │
 *   │    });                                                               │
 *   │                                                                      │
 *   │    // Preserve data across HMR updates                              │
 *   │    import.meta.hot.data.count = count;                              │
 *   │  }                                                                   │
 *   │                                                                      │
 *   │  KEY DIFFERENCE:                                                     │
 *   │  Webpack: module.hot (CJS-style)                                    │
 *   │  Vite:    import.meta.hot (ESM-style)                               │
 *   │                                                                      │
 *   └──────────────────────────────────────────────────────────────────────┘
 *
 */

console.log('Webpack: module.hot');
console.log('Vite:    import.meta.hot');


// =============================================================================
// REACT FAST REFRESH
// =============================================================================

console.log('\n=== React Fast Refresh ===\n');

/**
 *   ┌──────────────────────────────────────────────────────────────────────┐
 *   │  REACT FAST REFRESH (React's HMR implementation)                    │
 *   ├──────────────────────────────────────────────────────────────────────┤
 *   │                                                                      │
 *   │  What it preserves:                                                  │
 *   │  ✓ useState values                                                  │
 *   │  ✓ useRef values                                                    │
 *   │  ✓ DOM state (scroll, focus)                                        │
 *   │                                                                      │
 *   │  What causes a full remount:                                        │
 *   │  • Changing hooks order                                             │
 *   │  • Adding/removing hooks                                            │
 *   │  • Non-component exports (forced full reload)                       │
 *   │                                                                      │
 *   │  Rules:                                                              │
 *   │  • Component names must start with uppercase                        │
 *   │  • File should export ONLY React components for best HMR           │
 *   │  • Mixing components + non-components → full reload                │
 *   │                                                                      │
 *   │  Setup:                                                              │
 *   │  Webpack: @pmmmwh/react-refresh-webpack-plugin                      │
 *   │  Vite:    @vitejs/plugin-react (includes Fast Refresh)             │
 *   │                                                                      │
 *   └──────────────────────────────────────────────────────────────────────┘
 *
 */

console.log('React Fast Refresh preserves useState/useRef during edits');
console.log('Changing hook count → full remount');
console.log('Exporting non-components from same file → full reload');


// =============================================================================
// CSS HMR
// =============================================================================

console.log('\n=== CSS HMR ===\n');

/**
 *   ┌──────────────────────────────────────────────────────────────────────┐
 *   │  CSS HMR: Style updates without page reload                        │
 *   ├──────────────────────────────────────────────────────────────────────┤
 *   │                                                                      │
 *   │  Webpack (style-loader):                                            │
 *   │  CSS injected via <style> tags → replaced in-place                 │
 *   │  No page reload needed!                                              │
 *   │                                                                      │
 *   │  Vite:                                                               │
 *   │  CSS served as ESM → browser re-fetches on change                  │
 *   │  Instant style updates                                               │
 *   │                                                                      │
 *   │  CSS Modules:                                                        │
 *   │  Class names change → component re-renders with new classes        │
 *   │                                                                      │
 *   └──────────────────────────────────────────────────────────────────────┘
 *
 */

console.log('CSS changes: instant update, no page reload');
console.log('style-loader (webpack) or native ESM (Vite) handles it');


// =============================================================================
// INTERVIEW: What to Say
// =============================================================================

/**
 * "Hot Module Replacement updates code in the browser without a full page
 * reload, preserving application state. When you save a file, the dev
 * server compiles only the changed module, sends it to the browser via
 * WebSocket, and the HMR runtime swaps the old module for the new one.
 *
 * React uses Fast Refresh which preserves useState and useRef values
 * during edits. It works by re-rendering the component with the new code
 * while keeping state references intact. If you change hook order or
 * mix component and non-component exports, it falls back to a full reload.
 *
 * The difference between Webpack and Vite HMR: Webpack re-bundles affected
 * chunks, which gets slower as the app grows. Vite only re-transforms the
 * single changed file and lets the browser re-import it via ESM, keeping
 * HMR speed constant regardless of app size.
 *
 * CSS HMR is simpler — styles are replaced in-place without any component
 * state being affected."
 */


// RUN: node docs/29-bundlers-modules/14-hot-module-replacement.js
