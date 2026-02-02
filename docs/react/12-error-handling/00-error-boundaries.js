/**
 * TOPIC: Error Boundaries in React
 *
 * ╔══════════════════════════════════════════════════════════╗
 * ║           THE GOLDEN RULE                                ║
 * ║  Error Boundaries are class components that catch        ║
 * ║  render errors in their child tree. They use             ║
 * ║  componentDidCatch + getDerivedStateFromError.           ║
 * ╚══════════════════════════════════════════════════════════╝
 *
 * ┌── STORY TO REMEMBER ──────────────────────────────────────┐
 * │ Error Boundary = Safety Net under a trapeze artist.       │
 * │ If a child component "falls" (throws during render),      │
 * │ the net catches it and shows a fallback UI instead of     │
 * │ crashing the whole app.                                   │
 * └───────────────────────────────────────────────────────────┘
 *
 * ┌── VISUAL DIAGRAM ────────────────────────────────────────┐
 * │                                                           │
 * │   <ErrorBoundary>          try {                          │
 * │     <ChildComponent />  =>   render(child)                │
 * │   </ErrorBoundary>         } catch(err) {                 │
 * │                              show fallback                │
 * │                            }                              │
 * │                                                           │
 * │  getDerivedStateFromError  => sets hasError = true        │
 * │  componentDidCatch         => logs error info             │
 * └───────────────────────────────────────────────────────────┘
 *
 * React code (for reference):
 *   class ErrorBoundary extends React.Component {
 *     state = { hasError: false };
 *     static getDerivedStateFromError(error) {
 *       return { hasError: true };
 *     }
 *     componentDidCatch(error, info) {
 *       logService.log(error, info.componentStack);
 *     }
 *     render() {
 *       if (this.state.hasError) return <h1>Something went wrong</h1>;
 *       return this.props.children;
 *     }
 *   }
 */

// --- Pure JS Simulation ---

// A: Simulate getDerivedStateFromError (static — derives new state from error)
function getDerivedStateFromError(error) {
  console.log("A: getDerivedStateFromError called with:", error.message);
  return { hasError: true, errorMsg: error.message };
}

// B: Simulate componentDidCatch (instance — side effects like logging)
function componentDidCatch(error, info) {
  console.log("B: componentDidCatch — logging error:", error.message);
  console.log("B: Component stack:", info.componentStack);
}

// C: Simulate a child component render that might throw
function riskyChildRender(shouldFail) {
  if (shouldFail) throw new Error("Child render exploded!");
  return "<div>Child rendered OK</div>";
}

// D: Simulate ErrorBoundary wrapping a child
function errorBoundaryRender(childFn) {
  let state = { hasError: false, errorMsg: null };

  try {
    const html = childFn();
    console.log("D: Render success =>", html);
  } catch (error) {
    // Step 1: derive state
    state = getDerivedStateFromError(error);
    // Step 2: side effect logging
    componentDidCatch(error, { componentStack: "  at RiskyChild\n  at ErrorBoundary\n  at App" });
    console.log("D: Fallback UI => <h1>Something went wrong</h1>");
  }

  console.log("D: Final state =>", JSON.stringify(state));
}

// E: Test — child renders fine
console.log("=== E: No error scenario ===");
errorBoundaryRender(() => riskyChildRender(false));

console.log("");

// F: Test — child throws
console.log("=== F: Error scenario ===");
errorBoundaryRender(() => riskyChildRender(true));

console.log("");

// G: Key limitation — error boundaries do NOT catch event handlers
console.log("G: Error boundaries DON'T catch:");
console.log("   - Event handlers (use try/catch inside handler)");
console.log("   - Async code (setTimeout, promises)");
console.log("   - Server-side rendering");
console.log("   - Errors in the boundary itself");

/**
 * OUTPUT:
 * === E: No error scenario ===
 * D: Render success => <div>Child rendered OK</div>
 * D: Final state => {"hasError":false,"errorMsg":null}
 *
 * === F: Error scenario ===
 * A: getDerivedStateFromError called with: Child render exploded!
 * B: componentDidCatch — logging error: Child render exploded!
 * B: Component stack:   at RiskyChild
 *   at ErrorBoundary
 *   at App
 * D: Fallback UI => <h1>Something went wrong</h1>
 * D: Final state => {"hasError":true,"errorMsg":"Child render exploded!"}
 *
 * G: Error boundaries DON'T catch:
 *    - Event handlers (use try/catch inside handler)
 *    - Async code (setTimeout, promises)
 *    - Server-side rendering
 *    - Errors in the boundary itself
 *
 * ┌── INTERVIEW ANSWER ──────────────────────────────────────┐
 * │ Error Boundaries are class components using               │
 * │ getDerivedStateFromError (to update state) and            │
 * │ componentDidCatch (to log). They catch errors during      │
 * │ rendering, lifecycle, and constructors of the child tree. │
 * │ They do NOT catch event handler or async errors.          │
 * └───────────────────────────────────────────────────────────┘
 *
 * RUN: node docs/react/12-error-handling/00-error-boundaries.js
 */
