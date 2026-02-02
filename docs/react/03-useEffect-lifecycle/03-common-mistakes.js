/**
 * TOPIC: Common useEffect Mistakes
 *
 * ╔══════════════════════════════════════════════════════════════════════╗
 * ║                    THE GOLDEN RULE                                  ║
 * ║  Most useEffect bugs come from: missing deps (stale closures),    ║
 * ║  object/array deps (infinite loops), or async directly in effect. ║
 * ╚══════════════════════════════════════════════════════════════════════╝
 *
 * ┌── STORY TO REMEMBER ──────────────────────────────────────────────┐
 * │ useEffect deps are like a photo album. React compares the NEW     │
 * │ photo to the OLD photo using Object.is (===). Objects create a    │
 * │ NEW photo every render even if contents are the same — so React   │
 * │ thinks it changed. That's why {} !== {} causes infinite loops!    │
 * └───────────────────────────────────────────────────────────────────┘
 *
 * ┌── VISUAL DIAGRAM ─────────────────────────────────────────────────┐
 * │  MISTAKE #1: Missing deps → stale closure                        │
 * │  MISTAKE #2: Object/Array deps → infinite re-render              │
 * │  MISTAKE #3: async fn as effect → returns Promise, not cleanup   │
 * │  MISTAKE #4: setState in effect without condition → loop          │
 * └───────────────────────────────────────────────────────────────────┘
 */

// --- A: Stale Closure (missing dependency) ---
console.log("A: === Stale Closure — Missing Dependency ===");

function staleClosure() {
  let count = 0;
  // Simulates useEffect(fn, []) — captures count=0 forever
  const effectFn = (() => {
    const captured = count; // closed over at mount time
    return () => console.log(`   Stale count: ${captured}`);
  })();

  count = 5; // state updates...
  effectFn(); // Still sees 0!
  console.log(`   Actual count: ${count}`);
  console.log("   FIX: Add 'count' to deps array so effect re-runs");
}
staleClosure();

// --- B: Object deps cause infinite loop ---
console.log("\nB: === Object Deps — Infinite Loop Danger ===");

function objectDepsProblem() {
  let renderNum = 0;
  const MAX = 5; // safety limit

  function simulateRender() {
    renderNum++;
    const options = { page: 1 }; // NEW object every render!
    const prevOptions = { page: 1 };

    const same = options === prevOptions; // false! Different reference
    console.log(`   Render ${renderNum}: options === prevOptions? ${same}`);

    if (renderNum < MAX) {
      console.log("   Effect runs → setState → re-render → LOOP!");
    }
  }

  simulateRender();
  simulateRender();
  console.log("   FIX: Use primitive deps, useMemo, or JSON.stringify");
}
objectDepsProblem();

// --- C: Async function as useEffect callback ---
console.log("\nC: === Async in useEffect — Wrong Way vs Right Way ===");

// WRONG: async returns a Promise, not a cleanup function
console.log("   WRONG:");
console.log("   useEffect(async () => {        // Returns Promise!");
console.log("     const data = await fetch()");
console.log("   }, [])");
console.log("");

// RIGHT: define async inside
console.log("   RIGHT:");
console.log("   useEffect(() => {");
console.log("     async function fetchData() {");
console.log("       const data = await fetch()");
console.log("     }");
console.log("     fetchData();");
console.log("   }, [])");

// Simulate the correct pattern
function correctAsyncEffect() {
  let cleanup = false;
  // Effect body (sync)
  const run = async () => {
    const data = await Promise.resolve("fetched-data");
    if (!cleanup) console.log(`   Result: ${data}`);
  };
  run();
  return () => { cleanup = true; }; // proper cleanup!
}
const cleanupC = correctAsyncEffect();

// --- D: setState in effect without guard ---
console.log("\nD: === setState in Effect Without Guard ===");

function setStateLoop() {
  let state = 0;
  let renders = 0;
  const MAX = 4;

  function render() {
    renders++;
    if (renders > MAX) return console.log("   ... stopped (infinite loop!)");
    console.log(`   Render ${renders}, state=${state}`);

    // BAD: unconditional setState in effect
    // useEffect(() => setState(state + 1)) // infinite!
    state++;
    render(); // simulates re-render
  }

  render();
  console.log("   FIX: Add a condition or use correct deps");
}
setStateLoop();

// --- E: Reference equality trap ---
console.log("\nE: === Reference Equality Trap ===");
const a = [1, 2, 3];
const b = [1, 2, 3];
console.log(`   [1,2,3] === [1,2,3]? ${a === b}`);  // false
console.log(`   {} === {}? ${{}.toString() === {}.toString()}`); // true (strings)
console.log(`   Object.is({}, {})? ${Object.is({}, {})}`); // false
console.log("   React uses Object.is for dep comparison!");
console.log("   FIX: Destructure to primitives or useMemo the object");

/**
 * OUTPUT:
 * A: === Stale Closure — Missing Dependency ===
 *    Stale count: 0
 *    Actual count: 5
 *    FIX: Add 'count' to deps array so effect re-runs
 *
 * B: === Object Deps — Infinite Loop Danger ===
 *    Render 1: options === prevOptions? false
 *    Effect runs → setState → re-render → LOOP!
 *    Render 2: options === prevOptions? false
 *    FIX: Use primitive deps, useMemo, or JSON.stringify
 *
 * C: === Async in useEffect — Wrong Way vs Right Way ===
 *    ... (code examples shown)
 *    Result: fetched-data
 *
 * D: === setState in Effect Without Guard ===
 *    Render 1-4 then stopped
 *    FIX: Add a condition or use correct deps
 *
 * E: === Reference Equality Trap ===
 *    [1,2,3] === [1,2,3]? false
 *
 * ╔══════════════════════════════════════════════════════════════════════╗
 * ║ INTERVIEW ANSWER: "Common useEffect mistakes: 1) Missing deps     ║
 * ║ cause stale closures. 2) Object/array deps cause infinite loops   ║
 * ║ because React uses Object.is (reference equality). 3) Don't pass  ║
 * ║ async directly — define it inside. 4) Guard setState in effects." ║
 * ╚══════════════════════════════════════════════════════════════════════╝
 *
 * RUN: node docs/react/03-useEffect-lifecycle/03-common-mistakes.js
 */
