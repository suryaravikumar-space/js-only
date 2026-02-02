/**
 * TOPIC: Top 50 React Interview Questions
 *
 * ╔══════════════════════════════════════════════════════════╗
 * ║           THE GOLDEN RULE                                ║
 * ║  Master these 50 questions and you cover 90% of React    ║
 * ║  interviews. Each answer is concise — 1-3 lines max.     ║
 * ╚══════════════════════════════════════════════════════════╝
 *
 * ┌── STORY TO REMEMBER ──────────────────────────────────────┐
 * │ Think of React knowledge as 5 pillars:                    │
 * │  1. Core (VDOM, JSX, components)                          │
 * │  2. Hooks (state, effects, context)                       │
 * │  3. Patterns (HOC, render props, composition)             │
 * │  4. Performance (memo, keys, splitting)                   │
 * │  5. Advanced (SSR, RSC, concurrent, Suspense)             │
 * └───────────────────────────────────────────────────────────┘
 *
 * ┌── VISUAL DIAGRAM ────────────────────────────────────────┐
 * │  Questions 1-10:  Core Concepts                           │
 * │  Questions 11-20: Hooks                                   │
 * │  Questions 21-30: State & Lifecycle                       │
 * │  Questions 31-40: Patterns & Performance                  │
 * │  Questions 41-50: Advanced & SSR                          │
 * └───────────────────────────────────────────────────────────┘
 */

const questions = [
  // --- CORE (1-10) ---
  ["What is React?", "A JS library for building UIs with reusable components. Declarative, component-based, uses Virtual DOM."],
  ["What is Virtual DOM?", "A lightweight JS object tree mirroring real DOM. React diffs old vs new VDOM (reconciliation) and patches only changed nodes."],
  ["What is JSX?", "Syntactic sugar for React.createElement(). Looks like HTML in JS. Babel transpiles it. Not a template — it's JS expressions."],
  ["What is reconciliation?", "React's diffing algorithm. Compares old vs new VDOM tree. Uses keys and element type to minimize DOM mutations. O(n) heuristic."],
  ["Controlled vs Uncontrolled components?", "Controlled: React state drives input value (via value + onChange). Uncontrolled: DOM holds state (via ref). Controlled is preferred."],
  ["What are keys in React?", "Unique identifiers for list items. Help React track which items changed/added/removed. Never use array index for dynamic lists."],
  ["What are Fragments?", "<React.Fragment> or <>...</> — groups children without adding extra DOM nodes. Keeps DOM clean."],
  ["What are Portals?", "ReactDOM.createPortal(child, domNode) — renders child into a different DOM node. Used for modals, tooltips. Events still bubble through React tree."],
  ["What is StrictMode?", "<React.StrictMode> — dev-only wrapper. Double-invokes renders, effects, and reducers to catch side effects. No production impact."],
  ["Class vs Functional components?", "Class: ES6 class, lifecycle methods, this.state. Functional: plain functions + hooks. Functional preferred since React 16.8."],

  // --- HOOKS (11-20) ---
  ["What are hooks?", "Functions that let functional components use state and lifecycle. Rules: only call at top level, only in React functions."],
  ["useState vs useReducer?", "useState: simple state. useReducer: complex state logic, multiple sub-values, or when next state depends on previous."],
  ["What does useEffect do?", "Runs side effects after render. Replaces componentDidMount/Update/Unmount. Cleanup returned function runs before next effect or unmount."],
  ["useEffect dependency array?", "[]: mount only. [dep]: run when dep changes. none: every render. React compares deps with Object.is."],
  ["What is useContext?", "Reads context value without Consumer wrapper. const value = useContext(MyContext). Re-renders when context value changes."],
  ["What is useCallback?", "Memoizes a function reference. Returns same fn unless deps change. Prevents child re-renders when passing callbacks as props."],
  ["What is useMemo?", "Memoizes a computed value. Only recalculates when deps change. Use for expensive calculations, not everything."],
  ["What is useRef?", "Returns { current: value }. Persists across renders, no re-render on mutation. Used for DOM access and mutable values."],
  ["What is useLayoutEffect?", "Like useEffect but fires synchronously after DOM mutation, before paint. Use for DOM measurements. Prefer useEffect normally."],
  ["Custom hooks?", "Functions starting with 'use' that compose other hooks. Extract reusable stateful logic. Share logic, not state."],

  // --- STATE & LIFECYCLE (21-30) ---
  ["How does setState work?", "Batches updates, merges state (class) or replaces (hooks). Triggers re-render. Use callback form for prev state: setState(prev => prev+1)."],
  ["What is lifting state up?", "Moving shared state to the closest common ancestor. Children receive state via props and notify parent via callbacks."],
  ["What is prop drilling?", "Passing props through many levels of components. Solutions: Context API, state management libs (Redux, Zustand), composition."],
  ["Component lifecycle (class)?", "Mount: constructor > render > componentDidMount. Update: render > componentDidUpdate. Unmount: componentWillUnmount."],
  ["What is getDerivedStateFromProps?", "Static method: derives state from props before render. Rarely needed — prefer controlled components or memoization."],
  ["What is React.memo?", "HOC that memoizes a functional component. Skips re-render if props haven't changed (shallow comparison)."],
  ["shouldComponentUpdate?", "Class lifecycle returning boolean. If false, skips re-render. Replaced by React.memo + PureComponent."],
  ["What is PureComponent?", "Class component with built-in shallow prop/state comparison in shouldComponentUpdate. Functional equivalent: React.memo."],
  ["Synthetic Events?", "React wraps native events in SyntheticEvent for cross-browser consistency. Pooled (reused) in React <17. Same API as native events."],
  ["What is a Higher-Order Component?", "A function that takes a component and returns an enhanced component. Pattern for reusing logic: withAuth(Page)."],

  // --- PATTERNS & PERFORMANCE (31-40) ---
  ["Render Props pattern?", "A component prop that is a function returning JSX: <Mouse render={({x}) => <p>{x}</p>}/>. Shares behavior via function children."],
  ["Composition vs Inheritance?", "React favors composition. Use children prop, specialized components, or render props. Inheritance is almost never needed."],
  ["Code splitting?", "React.lazy + Suspense for component-level splitting. Dynamic import() for route-based splitting. Reduces initial bundle size."],
  ["React performance tips?", "React.memo, useMemo, useCallback, virtualization (react-window), code splitting, avoid inline objects/functions in JSX."],
  ["Why not use index as key?", "Index keys cause bugs when list is reordered/filtered. React can't distinguish moved vs changed items. Use stable unique IDs."],
  ["What is windowing/virtualization?", "Only render visible list items. Libraries: react-window, react-virtuoso. Critical for 1000+ item lists."],
  ["Batching in React 18?", "Automatic batching for ALL state updates (including setTimeout, promises). Before 18, only event handlers were batched."],
  ["useTransition?", "Marks state updates as non-urgent. UI stays responsive. startTransition(() => setState(...)). Shows pending state via isPending."],
  ["useDeferredValue?", "Defers a value to a lower-priority render. const deferredQuery = useDeferredValue(query). Good for search/filter UIs."],
  ["Error Boundaries?", "Class components with getDerivedStateFromError + componentDidCatch. Catch render errors in child tree. Not for events/async."],

  // --- ADVANCED & SSR (41-50) ---
  ["What is SSR?", "Server-Side Rendering: server generates HTML, sends to client. Faster first paint, better SEO. Hydration makes it interactive."],
  ["SSR vs CSR vs SSG?", "SSR: server renders per request. CSR: client renders (SPA). SSG: pre-built at build time. SSR+SSG give better SEO & performance."],
  ["What is hydration?", "Attaching React event listeners to server-rendered HTML. React 'hydrates' static HTML to make it interactive without re-rendering."],
  ["What are Server Components (RSC)?", "Components that run ONLY on the server. Zero JS sent to client. Can access DB directly. Use 'use client' to opt into client components."],
  ["Concurrent Mode / React 18?", "Concurrent rendering: React can pause, interrupt, resume renders. Enables Suspense, transitions, streaming SSR."],
  ["What is Suspense for data?", "Components can 'suspend' while loading data. Suspense shows fallback. Works with frameworks (Next.js) and the use() hook."],
  ["Streaming SSR?", "Server sends HTML in chunks (renderToPipeableStream). User sees content progressively. Suspense boundaries define chunk points."],
  ["React Server Actions?", "Functions that run on the server, called from client. Replace API routes for mutations. Form actions with 'use server' directive."],
  ["What is the use() hook?", "React 19 hook that reads async resources (promises, context) in render. Works with Suspense for data fetching."],
  ["React Compiler?", "Auto-memoizes components and hooks. Replaces manual React.memo/useMemo/useCallback. Ships with React 19+."],
];

// Print all Q&A
questions.forEach(([q, a], i) => {
  console.log(`Q${i + 1}: ${q}`);
  console.log(`A: ${a}\n`);
});

// Quick demo
console.log("=== BONUS: Quick VDOM diff demo ===");
const oldTree = { type: "div", props: { className: "old" }, children: ["Hello"] };
const newTree = { type: "div", props: { className: "new" }, children: ["Hello World"] };
console.log("Old:", JSON.stringify(oldTree));
console.log("New:", JSON.stringify(newTree));
console.log("Diff: className old->new, text Hello->Hello World");
console.log("Patch: update className, update textContent (2 DOM ops, not full re-render)");

/**
 * OUTPUT:
 * Q1-Q50 with answers printed above
 * BONUS: Quick VDOM diff demo
 *
 * ┌── INTERVIEW ANSWER ──────────────────────────────────────┐
 * │ These 50 questions cover: VDOM, reconciliation, hooks,    │
 * │ state management, lifecycle, keys, fragments, portals,    │
 * │ strict mode, concurrent mode, server components, RSC,     │
 * │ hydration, SSR vs CSR vs SSG, and React 18/19 features.   │
 * └───────────────────────────────────────────────────────────┘
 *
 * RUN: node docs/react/14-interview-cheatsheet/00-top-50-questions.js
 */
