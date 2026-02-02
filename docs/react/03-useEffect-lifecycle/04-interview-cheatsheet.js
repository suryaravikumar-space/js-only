/**
 * TOPIC: useEffect Interview Cheatsheet
 *
 * ╔══════════════════════════════════════════════════════════════════════╗
 * ║                    THE GOLDEN RULE                                  ║
 * ║  useEffect = synchronize a component with an external system.     ║
 * ║  It is NOT a lifecycle method. It is an escape hatch.              ║
 * ╚══════════════════════════════════════════════════════════════════════╝
 *
 * ┌── STORY TO REMEMBER ──────────────────────────────────────────────┐
 * │ Interviewer asks "what is useEffect?" — Don't say "lifecycle."    │
 * │ Say: "It synchronizes my component with external systems like     │
 * │ APIs, timers, or subscriptions. React handles UI; useEffect       │
 * │ handles everything else that needs to stay in sync."              │
 * └───────────────────────────────────────────────────────────────────┘
 *
 * ┌── VISUAL DIAGRAM ─────────────────────────────────────────────────┐
 * │  Q1: Deps array          Q4: Cleanup                             │
 * │  Q2: Execution order     Q5: vs useLayoutEffect                  │
 * │  Q3: Stale closures      Q6: Strict Mode double-run              │
 * └───────────────────────────────────────────────────────────────────┘
 */

// --- Q1: What does the dependency array do? ---
console.log("Q1: === Dependency Array ===");
console.log("   []       → Run once on mount");
console.log("   [a, b]   → Run when a or b changes (Object.is comparison)");
console.log("   (omitted)→ Run after every render");
console.log("   React compares prev deps to new deps with Object.is\n");

// --- Q2: What order do multiple useEffects run? ---
console.log("Q2: === Execution Order ===");
const order = [];
function Component() {
  // Effects run in declaration order, AFTER render
  order.push("render");
  // useEffect1
  order.push("effect-1");
  // useEffect2
  order.push("effect-2");
}
Component();
console.log(`   Order: ${order.join(" → ")}`);
console.log("   Parent effects run AFTER child effects\n");

// --- Q3: What is a stale closure? ---
console.log("Q3: === Stale Closure ===");
function staleDemo() {
  let count = 0;
  const effect = () => {
    // This closes over count=0 at creation time
    console.log(`   Captured: ${count}, Actual: changed later`);
  };
  count = 10;
  effect();
}
staleDemo();
console.log("   Fix: include variable in deps array\n");

// --- Q4: When does cleanup run? ---
console.log("Q4: === Cleanup Timing ===");
console.log("   1. Before EVERY re-execution of the effect");
console.log("   2. When component unmounts");
console.log("   Old cleanup runs BEFORE new effect runs");

function cleanupDemo() {
  let run = 0;
  function simulateEffect(dep) {
    run++;
    if (run > 1) console.log(`   Cleanup from run ${run - 1}`);
    console.log(`   Effect run ${run} with dep=${dep}`);
  }
  simulateEffect("A");
  simulateEffect("B");
  console.log("   Cleanup from run 2 (unmount)");
}
cleanupDemo();

// --- Q5: useEffect vs useLayoutEffect ---
console.log("\nQ5: === useEffect vs useLayoutEffect ===");
console.log("   useEffect:       Async, runs AFTER browser paint");
console.log("   useLayoutEffect: Sync, runs BEFORE browser paint");
console.log("   Use useLayoutEffect for: DOM measurements, preventing flicker");
console.log("   Default to useEffect — only switch if you see flicker\n");

// --- Q6: Why does useEffect run twice in Strict Mode? ---
console.log("Q6: === Strict Mode Double Invocation ===");
console.log("   React 18 Strict Mode: mount → unmount → mount");
console.log("   Purpose: Verify cleanup works correctly");
console.log("   Only in development, NOT production");

function strictModeDemo() {
  const effects = [];
  // First mount
  effects.push("mount-1");
  effects.push("cleanup-1"); // immediate unmount
  effects.push("mount-2");   // remount
  console.log(`   Strict Mode sequence: ${effects.join(" → ")}`);
}
strictModeDemo();

// --- Q7: Quick-fire answers ---
console.log("\nQ7: === Quick-Fire Answers ===");
const qa = [
  ["Can you use async in useEffect?", "No directly. Define async fn inside, then call it."],
  ["What causes infinite loops?", "Object/array deps or unconditional setState in effect."],
  ["How to fetch data?", "useEffect + async fn + cleanup (AbortController or boolean flag)."],
  ["Is useEffect needed for derived state?", "No! Use useMemo or compute during render."],
  ["What replaces componentDidCatch?", "Error boundaries (class only) or react-error-boundary lib."],
];
qa.forEach(([q, a]) => {
  console.log(`   Q: ${q}`);
  console.log(`   A: ${a}\n`);
});

/**
 * ╔══════════════════════════════════════════════════════════════════════╗
 * ║ INTERVIEW ANSWER: "useEffect synchronizes a component with an     ║
 * ║ external system. The deps array controls when it re-runs using    ║
 * ║ Object.is comparison. Cleanup runs before re-execution and on     ║
 * ║ unmount. In Strict Mode it double-fires to verify cleanup works.  ║
 * ║ Never pass async directly — define it inside and call it."         ║
 * ╚══════════════════════════════════════════════════════════════════════╝
 *
 * RUN: node docs/react/03-useEffect-lifecycle/04-interview-cheatsheet.js
 */
