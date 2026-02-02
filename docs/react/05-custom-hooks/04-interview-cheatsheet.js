/**
 * TOPIC: Custom Hooks — Interview Cheatsheet
 *
 * ╔══════════════════════════════════════════════════════════════════════╗
 * ║                    THE GOLDEN RULE                                  ║
 * ║  Custom hooks extract reusable logic. They share LOGIC, not STATE.║
 * ║  Name them "use*". They follow all Rules of Hooks.                ║
 * ╚══════════════════════════════════════════════════════════════════════╝
 *
 * ┌── STORY TO REMEMBER ──────────────────────────────────────────────┐
 * │ Custom hooks are like USB adapters. The adapter (hook) is the    │
 * │ same design, but each device (component) plugging in gets its    │
 * │ own power (state). You design one adapter, use it everywhere.    │
 * └───────────────────────────────────────────────────────────────────┘
 *
 * ┌── VISUAL DIAGRAM ─────────────────────────────────────────────────┐
 * │  Popular Custom Hooks:                                             │
 * │  ─────────────────────                                            │
 * │  useFetch        → loading, data, error + abort cleanup           │
 * │  useLocalStorage → persist state to localStorage                  │
 * │  useDebounce     → delay value updates                            │
 * │  useToggle       → boolean on/off                                 │
 * │  usePrevious     → track previous value                           │
 * │  useOnClickOutside → detect clicks outside element                │
 * │  useMediaQuery   → responsive breakpoints                        │
 * └───────────────────────────────────────────────────────────────────┘
 */

// --- Q1: What is a custom hook? ---
console.log("Q1: === What is a Custom Hook? ===");
console.log("   A function prefixed with 'use' that calls other hooks.");
console.log("   Extracts reusable stateful logic from components.");
console.log("   Each call creates independent state.\n");

// --- Q2: Do custom hooks share state? ---
console.log("Q2: === Do Custom Hooks Share State? ===");
console.log("   NO. Each call gets its OWN state.");
function useCounter(init) {
  let count = init;
  return { count, inc: () => ++count };
}
const a = useCounter(0);
const b = useCounter(100);
console.log(`   a.count=${a.count}, b.count=${b.count} — independent!\n`);

// --- Q3: Rules for custom hooks? ---
console.log("Q3: === Rules for Custom Hooks ===");
console.log("   1. Name MUST start with 'use'");
console.log("   2. Can call other hooks (useState, useEffect, etc.)");
console.log("   3. Must follow Rules of Hooks (top level, no conditions)");
console.log("   4. Can return anything (array, object, value)\n");

// --- Q4: Build usePrevious ---
console.log("Q4: === Build usePrevious ===");
function usePrevious() {
  let current = undefined;
  let previous = undefined;
  return {
    update(val) { previous = current; current = val; },
    get prev() { return previous; },
    get curr() { return current; },
  };
}
const prev = usePrevious();
prev.update(1); prev.update(2); prev.update(3);
console.log(`   current=${prev.curr}, previous=${prev.prev}`);
console.log("   React version uses useRef + useEffect\n");

// --- Q5: Build useToggle ---
console.log("Q5: === Build useToggle ===");
function useToggle(init = false) {
  let value = init;
  return {
    get value() { return value; },
    toggle() { value = !value; },
  };
}
const modal = useToggle();
console.log(`   Initial: ${modal.value}`);
modal.toggle();
console.log(`   After toggle: ${modal.value}\n`);

// --- Q6: When to create a custom hook? ---
console.log("Q6: === When to Create a Custom Hook? ===");
console.log("   1. Same logic in 2+ components (DRY)");
console.log("   2. Complex effect logic (fetch + loading + error)");
console.log("   3. Logic that's hard to test inside a component");
console.log("   4. Separation of concerns (logic vs UI)\n");

// --- Q7: Quick-fire ---
console.log("Q7: === Quick-Fire Answers ===");
const qa = [
  ["Can custom hooks return JSX?", "Technically yes, but don't. Use a component instead."],
  ["Can you call a hook inside a hook?", "Yes! That's how composition works."],
  ["Does the 'use' prefix do anything?", "It tells React's linter to enforce Rules of Hooks."],
  ["Custom hook vs HOC vs render props?", "Hooks are simpler, no wrapper hell, share logic not UI."],
  ["Can custom hooks have side effects?", "Yes, they can call useEffect internally."],
  ["Testing custom hooks?", "Use @testing-library/react-hooks renderHook()."],
];
qa.forEach(([q, ans]) => {
  console.log(`   Q: ${q}`);
  console.log(`   A: ${ans}\n`);
});

// --- Common hook patterns ---
console.log("=== Common Patterns Summary ===");
const patterns = [
  { hook: "useFetch(url)", returns: "{ data, loading, error }", key: "AbortController cleanup" },
  { hook: "useLocalStorage(key, init)", returns: "[value, setValue]", key: "JSON parse/stringify" },
  { hook: "useDebounce(value, delay)", returns: "debouncedValue", key: "clearTimeout cleanup" },
  { hook: "usePrevious(value)", returns: "previousValue", key: "useRef + useEffect" },
  { hook: "useToggle(init)", returns: "[value, toggle]", key: "Boolean flip" },
];
patterns.forEach(p => {
  console.log(`   ${p.hook.padEnd(30)} → ${p.returns.padEnd(25)} (${p.key})`);
});

/**
 * ╔══════════════════════════════════════════════════════════════════════╗
 * ║ INTERVIEW ANSWER: "Custom hooks are 'use'-prefixed functions that ║
 * ║ extract reusable stateful logic. Each call gets independent state.║
 * ║ Common ones: useFetch (data loading), useLocalStorage (persist),  ║
 * ║ useDebounce (input delay). They replaced HOCs and render props    ║
 * ║ as the primary pattern for logic reuse in React."                  ║
 * ╚══════════════════════════════════════════════════════════════════════╝
 *
 * RUN: node docs/react/05-custom-hooks/04-interview-cheatsheet.js
 */
