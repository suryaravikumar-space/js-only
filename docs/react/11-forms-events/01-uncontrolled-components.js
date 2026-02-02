/**
 * TOPIC: Uncontrolled Components — DOM Holds the State, Access via Ref
 *
 * ╔════════════════════════════════════════════════════════╗
 * ║           THE GOLDEN RULE                             ║
 * ║  Uncontrolled = DOM is the source of truth. Use       ║
 * ║  defaultValue + ref to read value on demand (submit). ║
 * ║  No onChange, no re-render per keystroke.              ║
 * ╚════════════════════════════════════════════════════════╝
 *
 * ┌─── STORY TO REMEMBER ───┐
 * │ A free-range chicken    │
 * │ (input) roams freely.   │
 * │ The farmer (React)      │
 * │ doesn't track every     │
 * │ step. Only checks the   │
 * │ coop (ref) when needed  │
 * │ (on submit).            │
 * └─────────────────────────┘
 *
 * ┌─── VISUAL DIAGRAM ───┐
 * │                       │
 * │  Controlled:          │
 * │  type → onChange → setState → render │
 * │  (every keystroke)    │
 * │                       │
 * │  Uncontrolled:        │
 * │  type → DOM holds it  │
 * │  submit → ref.current.value │
 * │  (read once)          │
 * └───────────────────────┘
 *
 * React code:
 *   const inputRef = useRef();
 *   <input defaultValue="hello" ref={inputRef} />
 *   // on submit: inputRef.current.value
 */

// --- Simulate ref-based uncontrolled input ---
function createRef() {
  return { current: null };
}

function createUncontrolledInput(defaultValue) {
  const domNode = { value: defaultValue }; // simulated DOM node
  const ref = createRef();
  ref.current = domNode;

  return {
    ref,
    type(text) {
      // User types — DOM handles it, React doesn't know
      domNode.value = text;
      // NO re-render, NO setState
    },
    render() {
      return `<input defaultValue="${defaultValue}" ref={inputRef} />`;
    },
  };
}

// A: Basic uncontrolled input
console.log("A: Basic uncontrolled input");
const nameInput = createUncontrolledInput("John");
console.log(`  Initial render: ${nameInput.render()}`);
nameInput.type("Surya"); // user types, no re-render
console.log(`  DOM value (via ref): "${nameInput.ref.current.value}"`);
console.log(`  React didn't re-render — DOM handled it`);

// B: Form submit reads ref
console.log("\nB: Form submit reads ref values");
const emailInput = createUncontrolledInput("");
const passInput = createUncontrolledInput("");

emailInput.type("surya@dev.com");
passInput.type("secret123");

function handleSubmit() {
  const email = emailInput.ref.current.value;
  const password = passInput.ref.current.value;
  console.log(`  Submitted: email="${email}", password="${password}"`);
}
handleSubmit();

// C: File input — MUST be uncontrolled
console.log("\nC: File input (always uncontrolled)");
const fileInput = createUncontrolledInput("");
fileInput.type("photo.jpg"); // simulates file selection
console.log(`  File selected: "${fileInput.ref.current.value}"`);
console.log(`  React cannot set file input value — security restriction`);

// D: When to use uncontrolled
console.log("\nD: When to use uncontrolled components");
const useCases = [
  "File inputs (<input type='file'>)",
  "Third-party DOM libraries (jQuery plugins)",
  "Simple forms where instant validation isn't needed",
  "Performance-sensitive forms (many fields, no per-keystroke re-render)",
  "Integration with non-React code",
];
useCases.forEach((u, i) => console.log(`  ${i + 1}. ${u}`));

// E: Comparison
console.log("\nE: Controlled vs Uncontrolled side-by-side");
let renderCount = 0;

// Controlled: re-renders on each keystroke
const controlled = { value: "" };
"Surya".split("").forEach((ch) => {
  controlled.value += ch;
  renderCount++;
});
console.log(`  Controlled: "${controlled.value}" — ${renderCount} re-renders`);

// Uncontrolled: 0 re-renders, read once
renderCount = 0;
const uncontrolled = createUncontrolledInput("");
"Surya".split("").forEach((ch) => {
  uncontrolled.type(uncontrolled.ref.current.value + ch);
});
console.log(`  Uncontrolled: "${uncontrolled.ref.current.value}" — ${renderCount} re-renders`);

/**
 * OUTPUT:
 * A: Basic uncontrolled input
 *   Initial render: <input defaultValue="John" ref={inputRef} />
 *   DOM value (via ref): "Surya"
 *   React didn't re-render — DOM handled it
 *
 * B: Form submit reads ref values
 *   Submitted: email="surya@dev.com", password="secret123"
 *
 * C: File input (always uncontrolled)
 *   File selected: "photo.jpg"
 *   React cannot set file input value — security restriction
 *
 * D: When to use (5 cases)
 *
 * E: Controlled vs Uncontrolled
 *   Controlled: "Surya" — 5 re-renders
 *   Uncontrolled: "Surya" — 0 re-renders
 *
 * ┌─── INTERVIEW ANSWER ───┐
 * │ Uncontrolled: DOM is source of truth, not React state. │
 * │ Use defaultValue + ref, read value on submit.          │
 * │ No re-render per keystroke. Required for file inputs.  │
 * │ Prefer controlled for validation/formatting needs.     │
 * └────────────────────────────────────────────────────────┘
 *
 * RUN: node docs/react/11-forms-events/01-uncontrolled-components.js
 */
