/**
 * TOPIC: Code Splitting — React.lazy + Suspense for Dynamic Imports
 *
 * ╔════════════════════════════════════════════════════════╗
 * ║           THE GOLDEN RULE                             ║
 * ║  React.lazy() takes a function that returns a         ║
 * ║  dynamic import() Promise. Suspense shows fallback    ║
 * ║  while the chunk loads. Split by ROUTE, not component.║
 * ╚════════════════════════════════════════════════════════╝
 *
 * ┌─── STORY TO REMEMBER ───┐
 * │ A restaurant (app) with │
 * │ a huge menu (bundle).   │
 * │ Instead of printing the │
 * │ whole menu, each table  │
 * │ gets only the page they │
 * │ need (lazy chunk). The  │
 * │ waiter says "one moment"│
 * │ (Suspense fallback).    │
 * └─────────────────────────┘
 *
 * ┌─── VISUAL DIAGRAM ───┐
 * │                       │
 * │  import()             │
 * │    │                  │
 * │    v                  │
 * │  Promise<Module>      │
 * │    │                  │
 * │    ├─ pending → show fallback │
 * │    └─ resolved → render component │
 * └───────────────────────┘
 *
 * React code (for reference):
 *   const Dashboard = React.lazy(() => import('./Dashboard'));
 *   <Suspense fallback={<Spinner />}>
 *     <Dashboard />
 *   </Suspense>
 */

// --- Simulate a module that loads asynchronously ---
function simulateImport(moduleName, delayMs) {
  console.log(`  [network] Fetching chunk: ${moduleName}...`);
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({ default: () => `<${moduleName} /> rendered!` });
    }, delayMs);
  });
}

// --- Simulate React.lazy ---
function reactLazy(importFn) {
  let cached = null;
  return {
    load: async () => {
      if (cached) {
        console.log("  [lazy] Already loaded — using cache");
        return cached;
      }
      const mod = await importFn();
      cached = mod.default;
      return cached;
    },
  };
}

// --- Simulate Suspense ---
async function suspense(lazyComponent, fallback) {
  console.log(`  [suspense] Showing fallback: "${fallback}"`);
  const Component = await lazyComponent.load();
  const result = Component();
  console.log(`  [suspense] Loaded! Result: ${result}`);
  return result;
}

// A: Lazy load a "Dashboard" component
async function main() {
  console.log("A: First load — shows fallback, then component");
  const LazyDashboard = reactLazy(() => simulateImport("Dashboard", 500));
  await suspense(LazyDashboard, "Loading...");

  // B: Second load — cached
  console.log("\nB: Second load — cached, no network");
  await suspense(LazyDashboard, "Loading...");

  // C: Route-based splitting simulation
  console.log("\nC: Route-based splitting");
  const routes = {
    "/home": reactLazy(() => simulateImport("HomePage", 200)),
    "/settings": reactLazy(() => simulateImport("SettingsPage", 300)),
  };

  const currentRoute = "/settings";
  console.log(`  Navigating to ${currentRoute}`);
  await suspense(routes[currentRoute], "Loading page...");

  // D: Error handling for failed imports
  console.log("\nD: Failed import simulation");
  const LazyBroken = reactLazy(() => Promise.reject(new Error("Network error")));
  try {
    await suspense(LazyBroken, "Loading...");
  } catch (err) {
    console.log(`  [error boundary] Caught: ${err.message}`);
  }
}

main();

/**
 * OUTPUT:
 * A: First load — shows fallback, then component
 *   [suspense] Showing fallback: "Loading..."
 *   [network] Fetching chunk: Dashboard...
 *   [suspense] Loaded! Result: <Dashboard /> rendered!
 *
 * B: Second load — cached, no network
 *   [suspense] Showing fallback: "Loading..."
 *   [lazy] Already loaded — using cache
 *   [suspense] Loaded! Result: <Dashboard /> rendered!
 *
 * C: Route-based splitting
 *   Navigating to /settings
 *   [suspense] Showing fallback: "Loading page..."
 *   [network] Fetching chunk: SettingsPage...
 *   [suspense] Loaded! Result: <SettingsPage /> rendered!
 *
 * D: Failed import simulation
 *   [suspense] Showing fallback: "Loading..."
 *   [error boundary] Caught: Network error
 *
 * ┌─── INTERVIEW ANSWER ───┐
 * │ Code splitting breaks your bundle into smaller chunks   │
 * │ loaded on demand. React.lazy + Suspense handle this.    │
 * │ Best practice: split by route. Wrap lazy components in  │
 * │ Suspense with a fallback UI. Use Error Boundaries for   │
 * │ failed loads.                                           │
 * └─────────────────────────────────────────────────────────┘
 *
 * RUN: node docs/react/09-performance/01-code-splitting.js
 */
