/**
 * TOPIC: Forms & Events Interview Cheatsheet
 *
 * ╔══════════════════════════════════════════════════════════════════════╗
 * ║                    THE GOLDEN RULE                                  ║
 * ║  Controlled = React owns the value (via state).                    ║
 * ║  Uncontrolled = DOM owns the value (via ref).                      ║
 * ║  Synthetic events = React's cross-browser wrapper over native.     ║
 * ╚══════════════════════════════════════════════════════════════════════╝
 *
 * ┌── STORY TO REMEMBER ──────────────────────────────────────────────┐
 * │ Interviewer asks "controlled vs uncontrolled?" — Don't just       │
 * │ define them. Say: "Controlled gives me instant access to every    │
 * │ keystroke for validation, formatting, conditional logic.          │
 * │ Uncontrolled is simpler when I just need the final value.         │
 * │ I default to controlled and only use refs for file inputs."       │
 * └───────────────────────────────────────────────────────────────────┘
 *
 * ┌── VISUAL DIAGRAM ─────────────────────────────────────────────────┐
 * │  Q1: Controlled vs Uncontrolled   Q4: Synthetic events            │
 * │  Q2: Form validation              Q5: Event pooling               │
 * │  Q3: onChange vs onInput           Q6: Quick-fire answers          │
 * └───────────────────────────────────────────────────────────────────┘
 */

// --- Q1: Controlled vs Uncontrolled Components ---
console.log("Q1: === Controlled vs Uncontrolled ===");

function controlledDemo() {
  let state = "";
  function setState(val) { state = val; }
  function handleChange(value) {
    setState(value);
    console.log(`   [Controlled] State updated to: "${state}"`);
  }
  handleChange("H");
  handleChange("He");
  handleChange("Hel");
  handleChange("Hell");
  handleChange("Hello");
  console.log(`   Final state: "${state}"`);
}
controlledDemo();

function uncontrolledDemo() {
  const ref = { current: null };
  // DOM holds the value — we only read on submit
  ref.current = "Hello";
  console.log(`   [Uncontrolled] Read ref on submit: "${ref.current}"`);
}
uncontrolledDemo();

console.log("   Controlled: value={state} + onChange={setState}");
console.log("   Uncontrolled: defaultValue + ref → read on submit");
console.log("   File inputs are ALWAYS uncontrolled (security)\n");

// --- Q2: Form Validation Patterns ---
console.log("Q2: === Form Validation ===");

function validateForm(values) {
  const errors = {};
  if (!values.email) errors.email = "Required";
  else if (!/\S+@\S+\.\S+/.test(values.email)) errors.email = "Invalid email";
  if (!values.password) errors.password = "Required";
  else if (values.password.length < 8) errors.password = "Min 8 characters";
  return errors;
}

const test1 = validateForm({ email: "", password: "" });
console.log(`   A: Empty form errors:`, test1);

const test2 = validateForm({ email: "bad", password: "short" });
console.log(`   B: Invalid values:`, test2);

const test3 = validateForm({ email: "a@b.com", password: "12345678" });
console.log(`   C: Valid form:`, test3);

console.log("   Strategies: onChange (instant), onBlur (on leave), onSubmit (on submit)");
console.log("   Libraries: Formik, React Hook Form (uncontrolled + refs = fast)\n");

// --- Q3: onChange vs onInput ---
console.log("Q3: === onChange vs onInput ===");
console.log("   HTML: onchange fires on blur. oninput fires on every keystroke.");
console.log("   React: onChange fires on every keystroke (like HTML oninput).");
console.log("   React's onChange = HTML's oninput. This is a React-specific behavior.");
console.log("   Why? Consistent API. One handler for all input changes.\n");

// --- Q4: Synthetic Events ---
console.log("Q4: === Synthetic Events ===");

function syntheticEventDemo() {
  // Simulating React's SyntheticEvent wrapper
  const nativeEvent = { type: "click", target: "button", bubbles: true };
  const syntheticEvent = {
    ...nativeEvent,
    nativeEvent,
    preventDefault() { console.log("   preventDefault called"); },
    stopPropagation() { console.log("   stopPropagation called"); },
    persist() { console.log("   persist called (no-op in React 17+)"); },
  };
  console.log(`   A: type="${syntheticEvent.type}", target="${syntheticEvent.target}"`);
  console.log(`   B: Has nativeEvent? ${!!syntheticEvent.nativeEvent}`);
  syntheticEvent.preventDefault();
}
syntheticEventDemo();
console.log("   SyntheticEvent wraps native events for cross-browser consistency");
console.log("   Access native via e.nativeEvent\n");

// --- Q5: Event Pooling (React 16 vs 17+) ---
console.log("Q5: === Event Pooling ===");
console.log("   React 16: Events were pooled and reused. Properties nullified after handler.");
console.log("   Had to call e.persist() to keep event in async code.");
console.log("   React 17+: Pooling REMOVED. Events work like normal objects.");
console.log("   e.persist() still exists but is a no-op.");

function poolingDemo() {
  let event = { type: "click", target: "btn" };
  // React 16 would nullify these:
  setTimeout(() => {
    console.log(`   Async access: type="${event.type}" (works in React 17+)`);
  }, 0);
}
poolingDemo();

// --- Q6: Quick-fire answers ---
setTimeout(() => {
  console.log("\nQ6: === Quick-Fire Answers ===");
  const qa = [
    ["How to handle form submit?", "onSubmit + e.preventDefault(). Never use action= for SPA."],
    ["Controlled or uncontrolled?", "Default to controlled. Uncontrolled for file inputs or simple forms."],
    ["React Hook Form vs Formik?", "RHF: uncontrolled + refs = fewer re-renders. Formik: controlled = simpler mental model."],
    ["How to handle multiple inputs?", "Single handler with e.target.name: setState(prev => ({...prev, [name]: value}))"],
    ["What is e.currentTarget?", "Element the handler is attached to. e.target = element that triggered event."],
    ["Event delegation in React?", "React already delegates to root (React 17+). You don't need manual delegation."],
  ];
  qa.forEach(([q, a]) => {
    console.log(`   Q: ${q}`);
    console.log(`   A: ${a}\n`);
  });
}, 10);

/**
 * ╔══════════════════════════════════════════════════════════════════════╗
 * ║ INTERVIEW ANSWER: "Controlled components store input values in    ║
 * ║ React state via onChange — giving full control over every          ║
 * ║ keystroke for validation and formatting. Uncontrolled components   ║
 * ║ let the DOM own the value, read via refs on submit. React's       ║
 * ║ SyntheticEvent wraps native events for cross-browser consistency. ║
 * ║ Event pooling was removed in React 17. I default to controlled    ║
 * ║ inputs and use React Hook Form for complex forms."                ║
 * ╚══════════════════════════════════════════════════════════════════════╝
 *
 * RUN: node docs/react/11-forms-events/04-interview-cheatsheet.js
 */
