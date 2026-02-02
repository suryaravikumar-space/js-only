/**
 * TOPIC: React Suspense & React.lazy
 *
 * ╔══════════════════════════════════════════════════════════╗
 * ║           THE GOLDEN RULE                                ║
 * ║  Suspense shows a fallback UI while its child is         ║
 * ║  loading. React.lazy lets you code-split components      ║
 * ║  so they load on demand, not upfront.                    ║
 * ╚══════════════════════════════════════════════════════════╝
 *
 * ┌── STORY TO REMEMBER ──────────────────────────────────────┐
 * │ Suspense = a restaurant waiter saying "Your meal is       │
 * │ being prepared" (fallback) until the kitchen (lazy        │
 * │ component) finishes cooking (resolves the import).        │
 * └───────────────────────────────────────────────────────────┘
 *
 * ┌── VISUAL DIAGRAM ────────────────────────────────────────┐
 * │                                                           │
 * │  <Suspense fallback={<Spinner/>}>                         │
 * │    <LazyComponent />                                      │
 * │  </Suspense>                                              │
 * │                                                           │
 * │  Timeline:                                                │
 * │  [Request]──>[Spinner shown]──>[Component loaded]──>      │
 * │              fallback            resolved render           │
 * │                                                           │
 * │  React.lazy(() => import('./HeavyPage'))                  │
 * │  => returns a lazy component that loads on first render   │
 * └───────────────────────────────────────────────────────────┘
 *
 * React code (for reference):
 *   const LazyPage = React.lazy(() => import('./HeavyPage'));
 *   function App() {
 *     return (
 *       <Suspense fallback={<p>Loading...</p>}>
 *         <LazyPage />
 *       </Suspense>
 *     );
 *   }
 */

// --- Pure JS Simulation ---

// A: Simulate React.lazy — wraps an async import into a lazy loader
function simulateLazy(importFn) {
  let cache = null;
  let status = "pending";

  return function load() {
    if (status === "resolved") return cache;
    if (status === "pending") {
      console.log("A: Lazy component not loaded yet — triggering import...");
      status = "loading";
      importFn().then((mod) => {
        cache = mod;
        status = "resolved";
        console.log("A: Lazy component loaded!");
      });
    }
    return null; // not ready
  };
}

// B: Simulate Suspense — shows fallback until child resolves
function simulateSuspense(lazyFn, fallback, onReady) {
  const result = lazyFn();
  if (result === null) {
    console.log("B: Suspense => showing fallback:", fallback);
  } else {
    console.log("B: Suspense => child ready:", result);
    if (onReady) onReady(result);
  }
}

// C: Simulate an async component import
function fakeAsyncImport() {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve("<HeavyPage>Loaded content</HeavyPage>");
    }, 100);
  });
}

// D: Run the simulation
const LazyPage = simulateLazy(fakeAsyncImport);

console.log("=== D: First render — component not ready ===");
simulateSuspense(LazyPage, "<Spinner />", null);

console.log("");
console.log("=== E: After async load completes ===");
setTimeout(() => {
  simulateSuspense(LazyPage, "<Spinner />", (content) => {
    console.log("E: App renders:", content);
  });
}, 200);

// F: Code splitting benefit
setTimeout(() => {
  console.log("");
  console.log("F: Why code splitting matters:");
  console.log("   Without lazy: bundle = 500KB (all pages)");
  console.log("   With lazy:    bundle = 100KB (only current page)");
  console.log("   Other pages load on navigation");
  console.log("");
  console.log("G: Suspense can also wrap data fetching (React 18+)");
  console.log("   Used with: React.lazy, use() hook, frameworks like Next.js");
}, 300);

/**
 * OUTPUT:
 * === D: First render — component not ready ===
 * A: Lazy component not loaded yet — triggering import...
 * B: Suspense => showing fallback: <Spinner />
 *
 * === E: After async load completes ===
 * A: Lazy component loaded!
 * B: Suspense => child ready: <HeavyPage>Loaded content</HeavyPage>
 * E: App renders: <HeavyPage>Loaded content</HeavyPage>
 *
 * F: Why code splitting matters:
 *    Without lazy: bundle = 500KB (all pages)
 *    With lazy:    bundle = 100KB (only current page)
 *    Other pages load on navigation
 *
 * G: Suspense can also wrap data fetching (React 18+)
 *    Used with: React.lazy, use() hook, frameworks like Next.js
 *
 * ┌── INTERVIEW ANSWER ──────────────────────────────────────┐
 * │ React.lazy dynamically imports a component. Suspense      │
 * │ wraps it and shows a fallback until it loads. This        │
 * │ enables code splitting — smaller initial bundles and      │
 * │ on-demand loading of routes/features.                     │
 * └───────────────────────────────────────────────────────────┘
 *
 * RUN: node docs/react/12-error-handling/01-suspense-basics.js
 */
