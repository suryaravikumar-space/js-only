/**
 * TOPIC: useEffect Basics — Side Effects After Render
 *
 * ╔══════════════════════════════════════════════════════════════════════╗
 * ║                    THE GOLDEN RULE                                  ║
 * ║  useEffect runs AFTER the component renders to the screen.         ║
 * ║  The dependency array controls WHEN it re-runs.                    ║
 * ║  No deps = every render. [] = mount only. [dep] = when dep changes.║
 * ╚══════════════════════════════════════════════════════════════════════╝
 *
 * ┌── STORY TO REMEMBER ──────────────────────────────────────────────┐
 * │ Think of useEffect as a "post-it note" you leave for React:      │
 * │ "Hey React, AFTER you paint the screen, please do this task."    │
 * │ The dependency array is the condition: "Only do it IF these      │
 * │ values changed since last time."                                  │
 * └───────────────────────────────────────────────────────────────────┘
 *
 * ┌── VISUAL DIAGRAM ─────────────────────────────────────────────────┐
 * │                                                                    │
 * │  Render → Paint Screen → useEffect runs                           │
 * │                                                                    │
 * │  useEffect(fn)          → runs after EVERY render                 │
 * │  useEffect(fn, [])      → runs ONCE after first render            │
 * │  useEffect(fn, [a, b])  → runs when a or b change                │
 * │                                                                    │
 * └───────────────────────────────────────────────────────────────────┘
 */

// === SIMULATION: Pure JS version of React's render + useEffect cycle ===

let _effects = [];
let _deps = [];
let _hookIndex = 0;

function useEffect(callback, deps) {
  const idx = _hookIndex++;
  const prevDeps = _deps[idx];

  // Determine if effect should run
  let shouldRun = false;
  if (!prevDeps) {
    shouldRun = true; // First render — always run
  } else if (!deps) {
    shouldRun = true; // No deps array — run every render
  } else {
    shouldRun = deps.some((dep, i) => dep !== prevDeps[i]);
  }

  if (shouldRun) {
    _effects.push(callback);
  }
  _deps[idx] = deps;
}

function flushEffects() {
  _effects.forEach(fn => fn());
  _effects = [];
}

function resetHookIndex() { _hookIndex = 0; }

// --- A: useEffect with [] — runs once (mount) ---
console.log("A: === useEffect(fn, []) — Mount Only ===");
let renderCount = 0;

function ComponentA() {
  renderCount++;
  console.log(`   Render #${renderCount}`);
  useEffect(() => {
    console.log("   Effect: Runs only on mount (first render)");
  }, []);
}

resetHookIndex();
ComponentA(); flushEffects(); // Render 1 — effect runs
resetHookIndex();
ComponentA(); flushEffects(); // Render 2 — effect skipped (deps unchanged)

// --- B: useEffect with [dep] — runs when dep changes ---
console.log("\nB: === useEffect(fn, [dep]) — When Dep Changes ===");
_deps = []; _hookIndex = 0;
let count = 0;

function ComponentB(newCount) {
  count = newCount;
  console.log(`   Render with count=${count}`);
  useEffect(() => {
    console.log(`   Effect: count changed to ${count}`);
  }, [count]);
}

resetHookIndex();
ComponentB(0); flushEffects(); // mount — runs
resetHookIndex();
ComponentB(0); flushEffects(); // same value — skipped
resetHookIndex();
ComponentB(1); flushEffects(); // changed — runs

// --- C: useEffect with no deps — runs every render ---
console.log("\nC: === useEffect(fn) — Every Render ===");
_deps = []; _hookIndex = 0;

function ComponentC() {
  console.log("   Render");
  useEffect(() => {
    console.log("   Effect: Runs after EVERY render");
  }); // no deps array at all
}

resetHookIndex();
ComponentC(); flushEffects();
resetHookIndex();
ComponentC(); flushEffects();

/**
 * OUTPUT:
 * A: === useEffect(fn, []) — Mount Only ===
 *    Render #1
 *    Effect: Runs only on mount (first render)
 *    Render #2
 *
 * B: === useEffect(fn, [dep]) — When Dep Changes ===
 *    Render with count=0
 *    Effect: count changed to 0
 *    Render with count=0
 *    Render with count=1
 *    Effect: count changed to 1
 *
 * C: === useEffect(fn) — Every Render ===
 *    Render
 *    Effect: Runs after EVERY render
 *    Render
 *    Effect: Runs after EVERY render
 *
 * ╔══════════════════════════════════════════════════════════════════════╗
 * ║ INTERVIEW ANSWER: "useEffect lets you perform side effects after   ║
 * ║ render. With no deps it runs every render, with [] only on mount,  ║
 * ║ and with [deps] only when those values change. React compares deps ║
 * ║ with Object.is between renders to decide if the effect re-runs."   ║
 * ╚══════════════════════════════════════════════════════════════════════╝
 *
 * RUN: node docs/react/03-useEffect-lifecycle/00-useEffect-basics.js
 */
