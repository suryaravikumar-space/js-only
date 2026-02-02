/**
 * TOPIC: Error Handling Patterns in React
 *
 * ╔══════════════════════════════════════════════════════════╗
 * ║           THE GOLDEN RULE                                ║
 * ║  Error boundaries catch RENDER errors only. For event    ║
 * ║  handlers & async code, use try/catch + error state.     ║
 * ║  Different errors need different patterns.               ║
 * ╚══════════════════════════════════════════════════════════╝
 *
 * ┌── STORY TO REMEMBER ──────────────────────────────────────┐
 * │ Three guards protect your React castle:                   │
 * │  1. Error Boundary — guards the walls (render)            │
 * │  2. try/catch — guards the gates (event handlers)         │
 * │  3. .catch() — guards the roads (async/fetch)             │
 * │ Each guard has its own zone. No one guards everything.    │
 * └───────────────────────────────────────────────────────────┘
 *
 * ┌── VISUAL DIAGRAM ────────────────────────────────────────┐
 * │                                                           │
 * │  Error Type         │ Solution                            │
 * │  ───────────────────┼──────────────────────               │
 * │  Render error       │ Error Boundary                      │
 * │  Event handler      │ try/catch + setState                │
 * │  Async / fetch      │ .catch() + error state              │
 * │  useEffect          │ try/catch inside effect             │
 * │  Global unhandled   │ window.onerror                      │
 * └───────────────────────────────────────────────────────────┘
 */

// --- Pure JS Simulation ---

// A: Pattern 1 — Error state in hooks (useState for error)
function useErrorState() {
  let state = { data: null, error: null, loading: false };

  function setState(updates) {
    state = { ...state, ...updates };
  }

  async function fetchData(url) {
    setState({ loading: true, error: null });
    console.log("A: Fetching", url, "...");
    try {
      // Simulate fetch that fails
      if (url === "bad-url") throw new Error("Network error");
      setState({ data: "Success data", loading: false });
      console.log("A: Success =>", state.data || "Success data");
    } catch (err) {
      setState({ error: err.message, loading: false });
      console.log("A: Error caught =>", err.message);
    }
  }

  return { getState: () => state, fetchData };
}

const hook = useErrorState();
hook.fetchData("good-url");
hook.fetchData("bad-url");

console.log("");

// B: Pattern 2 — try/catch in event handlers
function handleClick() {
  try {
    const result = JSON.parse("invalid json{{{");
    console.log(result);
  } catch (err) {
    console.log("B: Event handler error caught:", err.message);
    // In React: setError(err.message) to show in UI
  }
}
console.log("=== B: Event handler error ===");
handleClick();

console.log("");

// C: Pattern 3 — Async error in useEffect
function simulateUseEffect(effectFn) {
  console.log("=== C: useEffect with async error ===");
  // React doesn't catch errors thrown in async useEffect
  // You MUST handle them inside the effect
  effectFn();
}

simulateUseEffect(() => {
  (async () => {
    try {
      throw new Error("API down");
    } catch (err) {
      console.log("C: Caught inside useEffect:", err.message);
    }
  })();
});

console.log("");

// D: Pattern 4 — Error boundary CANNOT catch these
console.log("=== D: What Error Boundaries CANNOT catch ===");
const cannotCatch = [
  "Event handlers (onClick, onSubmit)",
  "Async code (setTimeout, fetch, promises)",
  "Server-side rendering",
  "Errors thrown in the boundary itself",
];
cannotCatch.forEach((item, i) => console.log(`D${i}: ${item}`));

console.log("");

// E: Pattern 5 — Graceful error UI pattern
function renderWithErrorHandling(renderFn) {
  const state = { error: null };
  try {
    return renderFn();
  } catch (err) {
    state.error = err.message;
    console.log("E: Rendering error fallback UI");
    return `<div class="error"><p>${state.error}</p><button>Retry</button></div>`;
  }
}

console.log("=== E: Graceful fallback ===");
const ui = renderWithErrorHandling(() => {
  throw new Error("Component crashed");
});
console.log("E: Fallback =>", ui);

/**
 * OUTPUT:
 * A: Fetching good-url ...
 * A: Success => Success data
 * A: Fetching bad-url ...
 * A: Error caught => Network error
 *
 * === B: Event handler error ===
 * B: Event handler error caught: ... (JSON parse error)
 *
 * === C: useEffect with async error ===
 * C: Caught inside useEffect: API down
 *
 * === D: What Error Boundaries CANNOT catch ===
 * D0: Event handlers (onClick, onSubmit)
 * D1: Async code (setTimeout, fetch, promises)
 * D2: Server-side rendering
 * D3: Errors thrown in the boundary itself
 *
 * === E: Graceful fallback ===
 * E: Rendering error fallback UI
 * E: Fallback => <div class="error">...</div>
 *
 * ┌── INTERVIEW ANSWER ──────────────────────────────────────┐
 * │ Use Error Boundaries for render errors. Use try/catch     │
 * │ inside event handlers. Use .catch() or try/catch in       │
 * │ async effects. Always pair error catching with error      │
 * │ state (useState) to show the user a meaningful fallback.  │
 * └───────────────────────────────────────────────────────────┘
 *
 * RUN: node docs/react/12-error-handling/02-error-patterns.js
 */
