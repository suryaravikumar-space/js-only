/**
 * TOPIC: useRef — Mutable Container That Persists Across Renders
 *
 * ╔══════════════════════════════════════════════════════════════════════╗
 * ║                    THE GOLDEN RULE                                  ║
 * ║  useRef returns { current: value }. Changing .current does NOT    ║
 * ║  trigger a re-render. It persists for the full lifetime of the    ║
 * ║  component. Perfect for DOM refs and mutable values.              ║
 * ╚══════════════════════════════════════════════════════════════════════╝
 *
 * ┌── STORY TO REMEMBER ──────────────────────────────────────────────┐
 * │ useRef is like a sticky note on your desk. You can scribble on   │
 * │ it anytime (mutate .current) without telling your boss (React).  │
 * │ useState is a formal memo — every change notifies the boss and   │
 * │ triggers a meeting (re-render).                                   │
 * └───────────────────────────────────────────────────────────────────┘
 *
 * ┌── VISUAL DIAGRAM ─────────────────────────────────────────────────┐
 * │  useState:  change → re-render → new UI                          │
 * │  useRef:    change → nothing (silent mutation)                    │
 * │                                                                    │
 * │  { current: value }  ← same object across all renders            │
 * └───────────────────────────────────────────────────────────────────┘
 */

// === Simulate useRef with plain JS ===

function useRef(initialValue) {
  return { current: initialValue };
}

// --- A: Basic ref — persists across "renders" ---
console.log("A: === useRef Persists Across Renders ===");

const countRef = useRef(0);
function renderA() {
  countRef.current++;
  console.log(`   Render: countRef.current = ${countRef.current}`);
  // No re-render triggered! Unlike useState.
}
renderA(); // 1
renderA(); // 2
renderA(); // 3
console.log(`   Same object? Always { current: ${countRef.current} }`);

// --- B: Storing previous value ---
console.log("\nB: === Store Previous Value ===");

let currentValue = 0;
const prevRef = useRef(undefined);

function renderB(newVal) {
  const prev = prevRef.current;
  prevRef.current = newVal; // Update ref AFTER reading
  currentValue = newVal;
  console.log(`   current=${currentValue}, previous=${prev}`);
}

renderB(10);
renderB(20);
renderB(30);

// --- C: DOM access simulation ---
console.log("\nC: === DOM Access (Simulated) ===");

// In React: <input ref={inputRef} />
const inputRef = useRef(null);

// Simulate React attaching DOM node after mount
inputRef.current = {
  focus() { console.log("   Input focused!"); },
  value: "hello"
};

// In useEffect or event handler:
console.log(`   Input value: ${inputRef.current.value}`);
inputRef.current.focus();

// --- D: useRef vs useState ---
console.log("\nD: === useRef vs useState ===");

let renderCount = 0;
const refCounter = useRef(0);
let stateCounter = 0;

function renderD() {
  renderCount++;
  refCounter.current++;  // No re-render
  stateCounter++;         // Would trigger re-render in React
  console.log(`   Render ${renderCount}: ref=${refCounter.current}, state=${stateCounter}`);
}

renderD();
renderD();
console.log("   ref changes: silent. state changes: triggers re-render.");

// --- E: Timer ID storage ---
console.log("\nE: === Store Timer ID in Ref ===");

const timerRef = useRef(null);

function startTimer() {
  timerRef.current = setInterval(() => {}, 1000);
  console.log(`   Timer started: ID=${timerRef.current}`);
}

function stopTimer() {
  clearInterval(timerRef.current);
  console.log(`   Timer stopped: ID=${timerRef.current}`);
  timerRef.current = null;
}

startTimer();
stopTimer();

// --- F: Ref callback pattern ---
console.log("\nF: === Ref Callback (measuring DOM) ===");
// In React: <div ref={(node) => { measure(node); }} />
function refCallback(node) {
  if (node !== null) {
    console.log(`   Node measured: width=${node.offsetWidth}`);
  }
}
refCallback({ offsetWidth: 320 }); // simulate DOM node

/**
 * OUTPUT:
 * A: countRef.current increments 1,2,3 — no re-render
 * B: Tracks previous values: 10→20→30
 * C: DOM access — focus called
 * D: ref=silent, state=re-render
 * E: Timer ID stored and cleared
 * F: Ref callback measures node
 *
 * ╔══════════════════════════════════════════════════════════════════════╗
 * ║ INTERVIEW ANSWER: "useRef returns a mutable object {current: val} ║
 * ║ that persists across renders without causing re-renders. Use it   ║
 * ║ for DOM access, storing previous values, timer IDs, or any mutable║
 * ║ value that shouldn't trigger UI updates."                          ║
 * ╚══════════════════════════════════════════════════════════════════════╝
 *
 * RUN: node docs/react/04-hooks-deep-dive/01-useRef.js
 */
