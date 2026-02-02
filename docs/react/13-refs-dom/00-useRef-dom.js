/**
 * TOPIC: useRef and DOM Access
 *
 * ╔══════════════════════════════════════════════════════════╗
 * ║           THE GOLDEN RULE                                ║
 * ║  useRef returns { current: initialValue }. It persists   ║
 * ║  across renders without causing re-renders. Attach to    ║
 * ║  JSX via ref prop to access the real DOM node.           ║
 * ╚══════════════════════════════════════════════════════════╝
 *
 * ┌── STORY TO REMEMBER ──────────────────────────────────────┐
 * │ useRef = a sticky note on your desk. You can write on it  │
 * │ (mutate .current) anytime without telling anyone (no      │
 * │ re-render). When attached to a DOM element, it holds a    │
 * │ direct handle to that physical element.                   │
 * └───────────────────────────────────────────────────────────┘
 *
 * ┌── VISUAL DIAGRAM ────────────────────────────────────────┐
 * │                                                           │
 * │  const ref = useRef(null)   =>  { current: null }         │
 * │  <input ref={ref} />        =>  { current: <input/> }    │
 * │  ref.current.focus()        =>  focuses the input!        │
 * │                                                           │
 * │  useState change  => re-render                            │
 * │  useRef change    => NO re-render (silent mutation)       │
 * └───────────────────────────────────────────────────────────┘
 *
 * React code (for reference):
 *   function TextInput() {
 *     const inputRef = useRef(null);
 *     const handleClick = () => inputRef.current.focus();
 *     return <><input ref={inputRef} /><button onClick={handleClick}>Focus</button></>
 *   }
 */

// --- Pure JS Simulation ---

// A: Simulate useRef
function useRef(initialValue) {
  return { current: initialValue };
}

const inputRef = useRef(null);
console.log("A: useRef(null) =>", JSON.stringify(inputRef));

// B: Simulate attaching ref to a DOM node
const fakeDOMNode = {
  tagName: "INPUT",
  value: "",
  focus() { console.log("B: INPUT is now focused!"); },
  blur() { console.log("B: INPUT lost focus"); },
};
inputRef.current = fakeDOMNode;
console.log("B: After attach => ref.current.tagName:", inputRef.current.tagName);

// C: Use the ref to interact with DOM
console.log("\n=== C: Using ref to manipulate DOM ===");
inputRef.current.focus();
inputRef.current.value = "Hello from ref!";
console.log("C: Input value set to:", inputRef.current.value);

// D: Ref does NOT trigger re-render
let renderCount = 0;
function simulateRender() { renderCount++; }
const countRef = useRef(0);

simulateRender(); // initial render
console.log("\nD: Render count:", renderCount);

countRef.current = 10; // mutate ref — no re-render
countRef.current = 20;
console.log("D: Ref mutated twice. Render count still:", renderCount);

// E: Common use cases
console.log("\nE: Common useRef use cases:");
console.log("   1. Focus an input on mount");
console.log("   2. Store previous value (no re-render)");
console.log("   3. Store interval/timeout IDs for cleanup");
console.log("   4. Track if component is mounted");
console.log("   5. Hold reference to a third-party library instance");

// F: Storing previous value pattern
function usePrevious(value) {
  const ref = useRef(undefined);
  const prev = ref.current;
  ref.current = value;
  return prev;
}

console.log("\nF: usePrevious pattern:");
console.log("F: prev =", usePrevious(1)); // undefined
console.log("F: prev =", usePrevious(5)); // still shows first call's ref

/**
 * OUTPUT:
 * A: useRef(null) => {"current":null}
 * B: After attach => ref.current.tagName: INPUT
 *
 * === C: Using ref to manipulate DOM ===
 * B: INPUT is now focused!
 * C: Input value set to: Hello from ref!
 *
 * D: Render count: 1
 * D: Ref mutated twice. Render count still: 1
 *
 * E: Common useRef use cases: ...
 * F: usePrevious pattern: ...
 *
 * ┌── INTERVIEW ANSWER ──────────────────────────────────────┐
 * │ useRef returns a mutable { current } object that          │
 * │ persists across renders without causing re-renders.       │
 * │ Attach to JSX via ref prop to access the real DOM node.   │
 * │ Use it for DOM manipulation, storing previous values,     │
 * │ and holding mutable values that don't need re-render.     │
 * └───────────────────────────────────────────────────────────┘
 *
 * RUN: node docs/react/13-refs-dom/00-useRef-dom.js
 */
