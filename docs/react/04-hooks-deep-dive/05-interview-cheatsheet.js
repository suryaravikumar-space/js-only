/**
 * TOPIC: Hooks Deep Dive — Interview Cheatsheet
 *
 * ╔══════════════════════════════════════════════════════════════════════╗
 * ║                    THE GOLDEN RULE                                  ║
 * ║  Hooks let you use state and lifecycle in function components.    ║
 * ║  They work by call order (linked list). Never call conditionally. ║
 * ╚══════════════════════════════════════════════════════════════════════╝
 *
 * ┌── STORY TO REMEMBER ──────────────────────────────────────────────┐
 * │ Each hook is a tool in your belt. useState is your notebook,      │
 * │ useRef is your sticky note, useMemo is your calculator cache,    │
 * │ useReducer is your decision tree, useCallback is your speed dial.│
 * │ Know which tool fits which job — that wins interviews.            │
 * └───────────────────────────────────────────────────────────────────┘
 *
 * ┌── VISUAL DIAGRAM ─────────────────────────────────────────────────┐
 * │  Hook             Returns              Re-renders?                │
 * │  ────             ───────              ───────────                │
 * │  useState         [state, setState]    YES                        │
 * │  useRef           { current }          NO                         │
 * │  useMemo          cachedValue          NO (returns cached)        │
 * │  useCallback      cachedFunction       NO (returns cached)        │
 * │  useReducer       [state, dispatch]    YES                        │
 * │  useEffect        undefined            NO (side effect)           │
 * │  useLayoutEffect  undefined            NO (sync side effect)      │
 * └───────────────────────────────────────────────────────────────────┘
 */

// --- Q1: Rules of Hooks ---
console.log("Q1: === Rules of Hooks ===");
console.log("   1. Only call at top level (no if/for/nested fn)");
console.log("   2. Only call from React functions (components or custom hooks)");
console.log("   WHY: React tracks hooks by CALL ORDER (array index)");
console.log("   Conditional calls shift indices → wrong state read\n");

// --- Q2: useRef vs useState ---
console.log("Q2: === useRef vs useState ===");
const comparison = [
  ["Feature",    "useState",       "useRef"],
  ["Triggers render", "YES",      "NO"],
  ["Persists",   "YES",            "YES"],
  ["Mutable",    "Via setState",   "Directly (.current)"],
  ["Use for",    "UI data",        "DOM, timers, prev values"],
];
comparison.forEach(([feat, s, r]) => {
  console.log(`   ${feat.padEnd(16)} ${s.padEnd(18)} ${r}`);
});

// --- Q3: useMemo vs useCallback ---
console.log("\nQ3: === useMemo vs useCallback ===");
console.log("   useMemo(fn, deps)     → returns fn() result (VALUE)");
console.log("   useCallback(fn, deps) → returns fn itself (FUNCTION)");
console.log("   useCallback(fn, d) === useMemo(() => fn, d)");
console.log("   When: useMemo for expensive calcs, useCallback for child props\n");

// --- Q4: useReducer vs useState ---
console.log("Q4: === useReducer vs useState ===");
console.log("   useState: simple, independent values");
console.log("   useReducer: complex state, related values, state machines");
console.log("   dispatch is stable (no useCallback needed)");
console.log("   Reducer is pure → easy to test\n");

// --- Q5: useLayoutEffect vs useEffect ---
console.log("Q5: === useLayoutEffect vs useEffect ===");
console.log("   useEffect:       async, after paint");
console.log("   useLayoutEffect: sync, before paint (blocks rendering)");
console.log("   Use case: DOM measurement, preventing flicker\n");

// --- Q6: Quick-fire ---
console.log("Q6: === Quick-Fire Answers ===");
const qa = [
  ["Can hooks be used in class components?", "No. Only function components and custom hooks."],
  ["What is a custom hook?", "A function starting with 'use' that calls other hooks."],
  ["Does useRef cause re-render?", "No. Mutating .current is silent."],
  ["What does useCallback prevent?", "Unnecessary child re-renders when passing fn as prop to React.memo child."],
  ["What is lazy initialization?", "useState(()=>compute) or useReducer 3rd arg. Runs once on mount."],
  ["How does React know hooks changed?", "Object.is comparison on deps array elements."],
  ["Can you call useState inside useEffect?", "No. Hooks must be at the top level of the component."],
];
qa.forEach(([q, a]) => {
  console.log(`   Q: ${q}`);
  console.log(`   A: ${a}\n`);
});

// --- Demonstrate: Hook ordering proof ---
console.log("=== PROOF: Hook Order Matters ===");
const hooks = [];
function simulateComponent(condition) {
  hooks.length = 0;
  hooks.push("useState-name");
  if (condition) hooks.push("useEffect-fetch");
  hooks.push("useState-age");
  console.log(`   condition=${condition}: [${hooks.join(", ")}]`);
}
simulateComponent(true);
simulateComponent(false);
console.log("   Index 2 points to different hooks! BUG!");

/**
 * ╔══════════════════════════════════════════════════════════════════════╗
 * ║ INTERVIEW ANSWER: "Hooks work by call order stored in an internal ║
 * ║ array. useState/useReducer trigger re-renders. useRef mutates     ║
 * ║ silently. useMemo/useCallback optimize by caching values/fns.    ║
 * ║ useLayoutEffect blocks paint for DOM reads. Always call hooks     ║
 * ║ at the top level to preserve ordering across renders."             ║
 * ╚══════════════════════════════════════════════════════════════════════╝
 *
 * RUN: node docs/react/04-hooks-deep-dive/05-interview-cheatsheet.js
 */
