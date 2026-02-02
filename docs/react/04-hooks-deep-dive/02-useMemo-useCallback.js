/**
 * TOPIC: useMemo & useCallback — Memoization Hooks
 *
 * ╔══════════════════════════════════════════════════════════════════════╗
 * ║                    THE GOLDEN RULE                                  ║
 * ║  useMemo(fn, deps)     → caches the RETURN VALUE of fn           ║
 * ║  useCallback(fn, deps) → caches the FUNCTION ITSELF              ║
 * ║  useCallback(fn, deps) === useMemo(() => fn, deps)                ║
 * ╚══════════════════════════════════════════════════════════════════════╝
 *
 * ┌── STORY TO REMEMBER ──────────────────────────────────────────────┐
 * │ useMemo is a chef who cooks once and serves leftovers until the  │
 * │ recipe (deps) changes. useCallback is a waiter who keeps the     │
 * │ same order slip — only gets a new one if the table changes.      │
 * │ Both save work by reusing results when inputs haven't changed.   │
 * └───────────────────────────────────────────────────────────────────┘
 *
 * ┌── VISUAL DIAGRAM ─────────────────────────────────────────────────┐
 * │  useMemo:     fn() → value  (cached until deps change)           │
 * │  useCallback: fn   → fn     (same reference until deps change)   │
 * │                                                                    │
 * │  Without:  render → compute → render → compute (every time)      │
 * │  With:     render → compute → render → cache hit! (skip)         │
 * └───────────────────────────────────────────────────────────────────┘
 */

// === Simulate memoization hooks ===

let memoStore = [];
let memoIdx = 0;

function useMemo(factory, deps) {
  const idx = memoIdx++;
  const prev = memoStore[idx];

  if (prev && deps.every((d, i) => Object.is(d, prev.deps[i]))) {
    console.log(`      useMemo[${idx}]: cache HIT`);
    return prev.value;
  }

  const value = factory();
  memoStore[idx] = { value, deps };
  console.log(`      useMemo[${idx}]: COMPUTED`);
  return value;
}

function useCallback(fn, deps) {
  return useMemo(() => fn, deps);
}

function resetMemo() { memoIdx = 0; }

// --- A: useMemo — expensive computation ---
console.log("A: === useMemo — Cache Expensive Computation ===");

function expensiveFilter(items, query) {
  console.log("      (Filtering... expensive!)");
  return items.filter(i => i.includes(query));
}

const items = ["apple", "banana", "apricot", "cherry"];

function SearchComponent(query) {
  console.log(`   Render with query="${query}"`);
  const filtered = useMemo(() => expensiveFilter(items, query), [query]);
  console.log(`   Result: [${filtered}]`);
}

resetMemo(); SearchComponent("ap");
resetMemo(); SearchComponent("ap");  // cache hit!
resetMemo();
memoStore = []; // simulate deps change
SearchComponent("ch");               // recompute

// --- B: useCallback — stable function reference ---
console.log("\nB: === useCallback — Stable Function Reference ===");
memoStore = [];

let renderId = 0;
function ParentComponent(count) {
  renderId++;
  console.log(`   Parent render #${renderId}`);

  resetMemo();
  const handleClick = useCallback(() => {
    console.log(`clicked ${count}`);
  }, [count]);

  // Child only re-renders if props change (React.memo)
  // With useCallback, handleClick is the SAME reference if count hasn't changed
  console.log(`   handleClick ref stable? ${memoStore[0] ? "yes" : "new"}`);
}

ParentComponent(1);
ParentComponent(1); // same count — same fn reference

// --- C: When NOT to use useMemo/useCallback ---
console.log("\nC: === When NOT to Use ===");
console.log("   DON'T memoize:");
console.log("   - Simple computations (a + b, string concat)");
console.log("   - Primitives (they're already === stable)");
console.log("   - Functions not passed to memoized children");
console.log("");
console.log("   DO memoize:");
console.log("   - Expensive array/object computations");
console.log("   - Functions passed to React.memo children");
console.log("   - Values used as useEffect dependencies");

// --- D: Build our own memoize (general purpose) ---
console.log("\nD: === General Memoize Function ===");

function memoize(fn) {
  const cache = new Map();
  return (...args) => {
    const key = JSON.stringify(args);
    if (cache.has(key)) {
      console.log(`   Cache HIT for (${args})`);
      return cache.get(key);
    }
    console.log(`   Cache MISS for (${args}) — computing`);
    const result = fn(...args);
    cache.set(key, result);
    return result;
  };
}

const slowSquare = memoize((n) => n * n);
console.log(`   Result: ${slowSquare(5)}`);
console.log(`   Result: ${slowSquare(5)}`);  // hit
console.log(`   Result: ${slowSquare(6)}`);  // miss

/**
 * OUTPUT:
 * A: useMemo caches filter — hits on same query
 * B: useCallback keeps same fn reference
 * C: Guidelines for when to memoize
 * D: General memoize with Map cache
 *
 * ╔══════════════════════════════════════════════════════════════════════╗
 * ║ INTERVIEW ANSWER: "useMemo caches a computed value, useCallback   ║
 * ║ caches a function reference. Both take a deps array. Use useMemo  ║
 * ║ for expensive calculations, useCallback for functions passed to   ║
 * ║ React.memo children. Don't over-memoize — it has its own cost."   ║
 * ╚══════════════════════════════════════════════════════════════════════╝
 *
 * RUN: node docs/react/04-hooks-deep-dive/02-useMemo-useCallback.js
 */
