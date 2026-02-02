/**
 * TOPIC: React Performance — Interview Cheatsheet
 *
 * ╔════════════════════════════════════════════════════════╗
 * ║           THE GOLDEN RULE                             ║
 * ║  Don't optimize prematurely. Measure first (Profiler) ║
 * ║  then apply: memo, useMemo, useCallback, code split,  ║
 * ║  virtualization, lazy loading.                        ║
 * ╚════════════════════════════════════════════════════════╝
 *
 * ┌─── STORY TO REMEMBER ───┐
 * │ Performance is a toolbox:│
 * │ memo = security guard    │
 * │ useMemo = calculator     │
 * │   with sticky notes      │
 * │ useCallback = same phone │
 * │   number, not a new one  │
 * │ lazy = on-demand delivery│
 * │ virtualize = train window│
 * └──────────────────────────┘
 *
 * ┌─── VISUAL DIAGRAM ───┐
 * │                       │
 * │  Render too slow?     │
 * │    │                  │
 * │    ├─ Too many renders? → React.memo + useCallback │
 * │    ├─ Heavy computation? → useMemo                 │
 * │    ├─ Big bundle?       → Code splitting           │
 * │    ├─ Long list?        → Virtualization           │
 * │    └─ Find the cause?   → Profiler                 │
 * └───────────────────────┘
 */

const QA = [
  {
    q: "Q1: What does React.memo do?",
    a: "Wraps a function component. Shallow-compares props. Skips re-render if props unchanged. It's an HOC, not a hook.",
  },
  {
    q: "Q2: When does React.memo fail to prevent re-renders?",
    a: "When props include objects/arrays/functions created inline (new reference every render). Fix with useMemo/useCallback.",
  },
  {
    q: "Q3: useMemo vs useCallback?",
    a: "useMemo caches a computed VALUE. useCallback caches a FUNCTION reference. useCallback(fn, deps) === useMemo(() => fn, deps).",
  },
  {
    q: "Q4: What is code splitting?",
    a: "Breaking the bundle into smaller chunks loaded on demand. React.lazy + Suspense for component-level splitting. Best done at route level.",
  },
  {
    q: "Q5: What is virtualization/windowing?",
    a: "Only rendering visible items in a long list. Instead of 10K DOM nodes, render ~20. Libraries: react-window, react-virtuoso, TanStack Virtual.",
  },
  {
    q: "Q6: How does React Profiler work?",
    a: "Wrap components in <Profiler id onRender>. onRender receives: id, phase (mount/update), actualDuration, baseDuration, startTime, commitTime.",
  },
  {
    q: "Q7: What causes unnecessary re-renders?",
    a: "1) Parent re-renders. 2) Context value changes. 3) State updates. 4) Inline object/function props. Fix with memo, useMemo, useCallback, context splitting.",
  },
  {
    q: "Q8: What is the key prop and why does it matter for performance?",
    a: "Key helps React identify items in lists. Stable keys (IDs) let React reuse DOM nodes. Index keys cause full re-render on reorder.",
  },
  {
    q: "Q9: Lazy loading vs code splitting?",
    a: "Code splitting = bundler divides code into chunks. Lazy loading = loading those chunks only when needed. React.lazy bridges both.",
  },
  {
    q: "Q10: How to optimize Context to avoid re-renders?",
    a: "1) Split context (separate state vs dispatch). 2) Memoize provider value. 3) Use selectors (use-context-selector lib). 4) Move state closer to consumer.",
  },
];

// --- Print all Q&A ---
console.log("=== REACT PERFORMANCE INTERVIEW CHEATSHEET ===\n");
QA.forEach((item, i) => {
  console.log(`${String.fromCharCode(65 + i)}: ${item.q}`);
  console.log(`   ${item.a}\n`);
});

// --- Quick performance tips ---
console.log("=== QUICK TIPS ===");
const tips = [
  "Measure before optimizing (React DevTools Profiler)",
  "React.memo for pure components with stable props",
  "useMemo for expensive calculations",
  "useCallback for functions passed to memoized children",
  "Code split at route boundaries",
  "Virtualize lists > 100 items",
  "Avoid inline objects as props: style={{ color: 'red' }}",
  "Use production builds for benchmarking",
  "Debounce rapid state updates (search input)",
  "Use React.lazy for rarely-visited routes",
];
tips.forEach((t, i) => console.log(`  ${i + 1}. ${t}`));

/**
 * OUTPUT:
 * === REACT PERFORMANCE INTERVIEW CHEATSHEET ===
 *
 * A: Q1: What does React.memo do?
 *    Wraps a function component...
 * (... all 10 Q&A pairs ...)
 *
 * === QUICK TIPS ===
 *   1. Measure before optimizing...
 *   (... all 10 tips ...)
 *
 * ┌─── INTERVIEW ANSWER ───┐
 * │ React perf optimization strategy:                      │
 * │ 1. Measure with Profiler / DevTools                    │
 * │ 2. Prevent re-renders: memo, useCallback, useMemo      │
 * │ 3. Reduce bundle: code splitting, tree shaking          │
 * │ 4. Reduce DOM: virtualization for long lists            │
 * │ 5. Optimize state: colocate, split context              │
 * └────────────────────────────────────────────────────────┘
 *
 * RUN: node docs/react/09-performance/04-interview-cheatsheet.js
 */
