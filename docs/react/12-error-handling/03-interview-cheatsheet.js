/**
 * TOPIC: Error Handling Interview Cheatsheet
 *
 * ╔══════════════════════════════════════════════════════════╗
 * ║           THE GOLDEN RULE                                ║
 * ║  Know the THREE error zones: Render (boundary),          ║
 * ║  Events (try/catch), Async (.catch/try-catch).           ║
 * ║  Each zone has its own strategy.                         ║
 * ╚══════════════════════════════════════════════════════════╝
 *
 * ┌── STORY TO REMEMBER ──────────────────────────────────────┐
 * │ Think of error handling as a hospital triage:              │
 * │  - Render crash = ER (Error Boundary catches immediately) │
 * │  - Event error = walk-in clinic (try/catch on the spot)   │
 * │  - Async error = phone-a-doctor (.catch for remote calls) │
 * └───────────────────────────────────────────────────────────┘
 *
 * ┌── VISUAL DIAGRAM ────────────────────────────────────────┐
 * │                                                           │
 * │  Q1: Error Boundary   ── getDerivedStateFromError         │
 * │                           + componentDidCatch             │
 * │  Q2: Can't catch      ── events, async, SSR, self        │
 * │  Q3: Event errors     ── try/catch + setError()           │
 * │  Q4: Async errors     ── .catch() or try/catch in async   │
 * │  Q5: Suspense         ── fallback while lazy loads        │
 * │  Q6: React.lazy       ── code splitting via dynamic import│
 * └───────────────────────────────────────────────────────────┘
 */

// --- Q&A with runnable examples ---

// Q1: What is an Error Boundary?
console.log("Q1: What is an Error Boundary?");
console.log("A: A class component with getDerivedStateFromError (static, returns new state)");
console.log("   and componentDidCatch (instance, for side effects like logging).");
console.log("   It catches errors during rendering, lifecycle methods, and constructors");
console.log("   of its entire child component tree.\n");

// Q2: What can Error Boundaries NOT catch?
console.log("Q2: What can Error Boundaries NOT catch?");
const noCatch = ["Event handlers", "Async code (setTimeout, promises, fetch)", "SSR", "The boundary itself"];
noCatch.forEach((x) => console.log("  -", x));
console.log("");

// Q3: How do you handle event handler errors?
console.log("Q3: How to handle event handler errors?");
function simulateClickHandler() {
  try {
    throw new Error("Button click failed");
  } catch (err) {
    console.log("A: try/catch inside handler:", err.message);
    console.log("   Then call setError(err.message) to update UI\n");
  }
}
simulateClickHandler();

// Q4: How to handle async errors in useEffect?
console.log("Q4: How to handle async errors in useEffect?");
console.log("A: Wrap the async call in try/catch INSIDE the effect:");
console.log("   useEffect(() => {");
console.log("     async function load() {");
console.log("       try { await fetchData(); }");
console.log("       catch(e) { setError(e.message); }");
console.log("     }");
console.log("     load();");
console.log("   }, []);\n");

// Q5: What is Suspense?
console.log("Q5: What is Suspense?");
console.log("A: A component that shows a fallback UI while children are loading.");
console.log("   Used with React.lazy for code-split components.");
console.log("   In React 18+, also used for data fetching.\n");

// Q6: What is React.lazy?
console.log("Q6: What is React.lazy?");
console.log("A: const Page = React.lazy(() => import('./Page'))");
console.log("   It dynamically imports a component. Must be wrapped in Suspense.\n");

// Q7: Difference — getDerivedStateFromError vs componentDidCatch?
console.log("Q7: getDerivedStateFromError vs componentDidCatch?");
console.log("A: getDerivedStateFromError — STATIC, runs during render, returns state");
console.log("   componentDidCatch — INSTANCE, runs after commit, for side effects\n");

// Q8: Can functional components be error boundaries?
console.log("Q8: Can functional components be error boundaries?");
console.log("A: No (as of React 18). Error boundaries must be class components.");
console.log("   But you can wrap the class in a functional wrapper.\n");

// Q9: Simulate — global error fallback
console.log("Q9: Best practice for global error handling?");
console.log("A: Wrap <App /> in an Error Boundary at the root level.");
console.log("   Also add window.addEventListener('unhandledrejection', handler)");
console.log("   for uncaught promise rejections.\n");

// Q10: Demo — error state hook pattern
console.log("Q10: Common error state hook pattern:");
function useAsync() {
  const state = { data: null, error: null, loading: false };
  console.log("A: const [data, setData] = useState(null)");
  console.log("   const [error, setError] = useState(null)");
  console.log("   const [loading, setLoading] = useState(false)");
  console.log("   // Or use a single useReducer for all three");
  return state;
}
useAsync();

/**
 * OUTPUT:
 * Q1: What is an Error Boundary?
 * A: A class component with getDerivedStateFromError...
 *
 * Q2: What can Error Boundaries NOT catch?
 *   - Event handlers
 *   - Async code ...
 *   - SSR
 *   - The boundary itself
 *
 * Q3-Q10: (see above)
 *
 * ┌── INTERVIEW ANSWER ──────────────────────────────────────┐
 * │ Three error zones: Render (ErrorBoundary), Events         │
 * │ (try/catch+setState), Async (.catch+setState). Error      │
 * │ Boundaries need class components with two lifecycle       │
 * │ methods. Suspense handles loading states for lazy/data.   │
 * └───────────────────────────────────────────────────────────┘
 *
 * RUN: node docs/react/12-error-handling/03-interview-cheatsheet.js
 */
