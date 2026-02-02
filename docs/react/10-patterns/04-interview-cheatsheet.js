/**
 * TOPIC: React Patterns — Interview Cheatsheet
 *
 * ╔════════════════════════════════════════════════════════╗
 * ║           THE GOLDEN RULE                             ║
 * ║  Patterns solve REUSE problems. Compound = shared     ║
 * ║  state. Render props = flexible UI. HOC = enhance.    ║
 * ║  Container/Presentational = separate concerns.        ║
 * ╚════════════════════════════════════════════════════════╝
 *
 * ┌─── STORY TO REMEMBER ───┐
 * │ Patterns are recipes:   │
 * │ Compound = family dinner│
 * │   (shared table/context)│
 * │ Render prop = food truck│
 * │   (you choose the plate)│
 * │ HOC = gift wrapper      │
 * │ Container/Pres = chef + │
 * │   waiter                │
 * └─────────────────────────┘
 *
 * ┌─── VISUAL DIAGRAM ───┐
 * │                       │
 * │  Pattern Evolution:   │
 * │  Mixins (dead) →      │
 * │  HOCs →               │
 * │  Render Props →       │
 * │  Custom Hooks (modern)│
 * └───────────────────────┘
 */

const QA = [
  {
    q: "Q1: What are compound components?",
    a: "Components that work together sharing implicit state via context. Parent owns state, children consume. Example: Tabs, Accordion, Select/Option.",
  },
  {
    q: "Q2: What is the render props pattern?",
    a: "A component receives a function prop and calls it with data. The function decides what to render. Enables logic reuse with flexible UI. Mostly replaced by hooks.",
  },
  {
    q: "Q3: What is an HOC?",
    a: "A function that takes a component and returns an enhanced component. Adds behavior (auth, loading, logging) without modifying original. Convention: withX. Pitfalls: wrapper hell, prop collision.",
  },
  {
    q: "Q4: Container vs Presentational?",
    a: "Container: handles data/logic/state. Presentational: pure UI, receives only props. Custom hooks replaced containers, but the separation principle remains.",
  },
  {
    q: "Q5: How did hooks replace these patterns?",
    a: "HOC → custom hook (useAuth instead of withAuth). Render prop → custom hook (useMouse instead of <Mouse render>). Container → hook + component. Less nesting, easier composition.",
  },
  {
    q: "Q6: When would you still use HOCs?",
    a: "Cross-cutting concerns in class components. Libraries (Redux connect, React Router withRouter). When you need to wrap JSX (error boundaries). When hook is not an option.",
  },
  {
    q: "Q7: What is the Provider pattern?",
    a: "A component that provides data to its subtree via React Context. Combined with compound components. Example: ThemeProvider, AuthProvider.",
  },
  {
    q: "Q8: What is the controlled vs uncontrolled pattern?",
    a: "Controlled: parent manages state, passes value + onChange. Uncontrolled: component manages own state, parent reads via ref. Controlled = more predictable.",
  },
  {
    q: "Q9: What is prop drilling and how to solve it?",
    a: "Passing props through many intermediate components. Solutions: Context API, composition (children prop), state management (Redux, Zustand), component composition.",
  },
  {
    q: "Q10: Compare all reuse patterns",
    a: "Mixins: dead (dangerous). HOC: wraps component, adds behavior. Render props: function as child/prop. Hooks: extract logic into reusable functions. Hooks win for most cases.",
  },
];

console.log("=== REACT PATTERNS INTERVIEW CHEATSHEET ===\n");
QA.forEach((item, i) => {
  console.log(`${String.fromCharCode(65 + i)}: ${item.q}`);
  console.log(`   ${item.a}\n`);
});

// --- Pattern comparison table ---
console.log("=== PATTERN COMPARISON ===");
const patterns = [
  { name: "HOC",            reuse: "YES", nesting: "HIGH", hooks: "useX replaces withX" },
  { name: "Render Props",   reuse: "YES", nesting: "HIGH", hooks: "useX replaces render fn" },
  { name: "Compound",       reuse: "YES", nesting: "LOW",  hooks: "Still useful + context" },
  { name: "Container/Pres", reuse: "YES", nesting: "LOW",  hooks: "Hook replaces container" },
  { name: "Custom Hooks",   reuse: "YES", nesting: "NONE", hooks: "--- (IS the modern way)" },
];
console.log("  Pattern           | Reuse | Nesting | Modern Alt");
console.log("  ─────────────────────────────────────────────────");
patterns.forEach((p) => {
  console.log(`  ${p.name.padEnd(18)}| ${p.reuse.padEnd(6)}| ${p.nesting.padEnd(8)}| ${p.hooks}`);
});

/**
 * OUTPUT:
 * === REACT PATTERNS INTERVIEW CHEATSHEET ===
 * A: Q1: What are compound components? ...
 * (... 10 Q&A pairs ...)
 *
 * === PATTERN COMPARISON ===
 *   (table with 5 patterns)
 *
 * ┌─── INTERVIEW ANSWER ───┐
 * │ Know 4 patterns: Compound (shared state via context), │
 * │ Render Props (function as child), HOC (wrapper fn),   │
 * │ Container/Presentational (logic vs UI). All solve     │
 * │ code reuse. Custom hooks are the modern replacement   │
 * │ for HOCs and render props. Compound components still  │
 * │ shine for flexible parent-child APIs.                 │
 * └───────────────────────────────────────────────────────┘
 *
 * RUN: node docs/react/10-patterns/04-interview-cheatsheet.js
 */
