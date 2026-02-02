/**
 * TOPIC: Rules of Hooks — Why Order Matters
 *
 * ╔══════════════════════════════════════════════════════════════════════╗
 * ║                    THE GOLDEN RULE                                  ║
 * ║  1. Only call hooks at the TOP LEVEL (no ifs, loops, nested fns)  ║
 * ║  2. Only call hooks from React functions (components or hooks)    ║
 * ║  React tracks hooks by CALL ORDER, not by name.                   ║
 * ╚══════════════════════════════════════════════════════════════════════╝
 *
 * ┌── STORY TO REMEMBER ──────────────────────────────────────────────┐
 * │ Hooks are like a playlist. React presses play and expects song 1 │
 * │ at position 1, song 2 at position 2, every time. If you skip a   │
 * │ song with an if-statement, the whole playlist gets misaligned.    │
 * │ Song 3 plays where song 2 should be. Everything breaks.          │
 * └───────────────────────────────────────────────────────────────────┘
 *
 * ┌── VISUAL DIAGRAM ─────────────────────────────────────────────────┐
 * │  React stores hooks as a LINKED LIST / ARRAY by index:           │
 * │                                                                    │
 * │  Render 1:  [useState(0), useEffect(fn), useState("")]           │
 * │              hook[0]       hook[1]        hook[2]                  │
 * │                                                                    │
 * │  Render 2:  [useState(0), useEffect(fn), useState("")]           │
 * │              hook[0]       hook[1]        hook[2]  ← SAME ORDER!  │
 * │                                                                    │
 * │  BROKEN (hook inside if):                                         │
 * │  Render 2:  [useEffect(fn), useState("")]  ← SHIFTED! BUG!      │
 * └───────────────────────────────────────────────────────────────────┘
 */

// === Simulate React's hook storage by index ===

let hookStore = [];
let hookIndex = 0;

function useState(initial) {
  const idx = hookIndex++;
  if (hookStore[idx] === undefined) hookStore[idx] = initial;
  const setState = (val) => { hookStore[idx] = val; };
  return [hookStore[idx], setState];
}

function useEffect(fn, deps) {
  const idx = hookIndex++;
  hookStore[idx] = { type: "effect", deps };
}

function resetIndex() { hookIndex = 0; }

// --- A: Correct — hooks always in same order ---
console.log("A: === Correct Hook Order ===");

function GoodComponent(show) {
  const [count, setCount] = useState(0);       // hook[0]
  useEffect(() => {}, []);                       // hook[1]
  const [name, setName] = useState("Surya");    // hook[2]

  console.log(`   count=${count}, name=${name}`);
  console.log(`   Hook store: [${hookStore.map(h =>
    typeof h === "object" && h.type ? "effect" : h
  ).join(", ")}]`);
}

resetIndex(); GoodComponent(true);
resetIndex(); GoodComponent(false); // Same order — works!

// --- B: BROKEN — hook inside conditional ---
console.log("\nB: === Broken: Hook Inside Conditional ===");
hookStore = []; hookIndex = 0;

function BrokenComponent(show) {
  const [count] = useState(0);     // hook[0] — always
  if (show) {
    useEffect(() => {}, []);        // hook[1] — ONLY if show=true
  }
  const [name] = useState("Surya"); // hook[1] or hook[2]??

  const nameIdx = show ? 2 : 1;
  console.log(`   show=${show}: name reads hook[${nameIdx}] = ${hookStore[nameIdx]}`);
}

resetIndex(); BrokenComponent(true);
console.log(`   Store after render 1: [${hookStore}]`);
resetIndex(); BrokenComponent(false);
console.log("   BUG! 'name' reads from wrong index when show=false!");

// --- C: The fix — always call, conditionally execute ---
console.log("\nC: === Fix: Always Call, Conditionally Execute ===");
hookStore = []; hookIndex = 0;

function FixedComponent(show) {
  const [count] = useState(0);
  useEffect(() => {                  // Always called
    if (show) { /* do thing */ }      // Condition INSIDE
  }, [show]);
  const [name] = useState("Surya");  // Always hook[2]
  console.log(`   show=${show}: count=${count}, name=${name} — Correct!`);
}

resetIndex(); FixedComponent(true);
resetIndex(); FixedComponent(false);

// --- D: Why only in React functions? ---
console.log("\nD: === Only Call in React Functions ===");
console.log("   Regular functions don't have React's hook tracking.");
console.log("   Hooks rely on React's internal fiber/component context.");
console.log("   Custom hooks work because they're called FROM components.\n");

console.log("   ALLOWED:");
console.log("   function MyComponent() { useState(0); }       // Component");
console.log("   function useCustom() { useState(0); }         // Custom hook");
console.log("");
console.log("   NOT ALLOWED:");
console.log("   function helper() { useState(0); }            // Regular fn");
console.log("   class MyClass { method() { useState(0); } }   // Class");

/**
 * ╔══════════════════════════════════════════════════════════════════════╗
 * ║ INTERVIEW ANSWER: "React tracks hooks by call order using an      ║
 * ║ internal array/linked list. If you put a hook inside a condition, ║
 * ║ the order shifts between renders and React reads the wrong state. ║
 * ║ That's why hooks must be at the top level — to guarantee the      ║
 * ║ same number and order of hook calls on every render."              ║
 * ╚══════════════════════════════════════════════════════════════════════╝
 *
 * RUN: node docs/react/04-hooks-deep-dive/00-rules-of-hooks.js
 */
