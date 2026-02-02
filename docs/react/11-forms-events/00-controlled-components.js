/**
 * TOPIC: Controlled Components — React Owns the Input Value
 *
 * ╔════════════════════════════════════════════════════════╗
 * ║           THE GOLDEN RULE                             ║
 * ║  In a controlled component, React state is the        ║
 * ║  "single source of truth." The input's value comes    ║
 * ║  from state, onChange updates state, state re-renders. ║
 * ╚════════════════════════════════════════════════════════╝
 *
 * ┌─── STORY TO REMEMBER ───┐
 * │ A puppet (input) on     │
 * │ strings (state). The    │
 * │ puppeteer (React) pulls │
 * │ the string on every     │
 * │ keystroke (onChange).    │
 * │ The puppet can ONLY move│
 * │ when the puppeteer says.│
 * └─────────────────────────┘
 *
 * ┌─── VISUAL DIAGRAM ───┐
 * │                       │
 * │  User types "A"       │
 * │    │                  │
 * │    v                  │
 * │  onChange fires        │
 * │    │                  │
 * │    v                  │
 * │  setState("A")        │
 * │    │                  │
 * │    v                  │
 * │  Re-render: value="A" │
 * └───────────────────────┘
 *
 * React code:
 *   const [value, setValue] = useState('');
 *   <input value={value} onChange={e => setValue(e.target.value)} />
 */

// --- Simulate controlled component ---
function createControlledInput(initialValue) {
  let state = initialValue;
  const listeners = [];

  return {
    getValue: () => state,
    onChange: (newValue) => {
      state = newValue;
      listeners.forEach((fn) => fn(state));
    },
    subscribe: (fn) => listeners.push(fn),
    render: () => `<input value="${state}" />`,
  };
}

// A: Basic controlled input
console.log("A: Basic controlled input");
const nameInput = createControlledInput("");
nameInput.subscribe((val) => console.log(`  [re-render] ${nameInput.render()}`));

nameInput.onChange("S");
nameInput.onChange("Su");
nameInput.onChange("Sur");
nameInput.onChange("Sury");
nameInput.onChange("Surya");

// B: Controlled select
console.log("\nB: Controlled select");
const selectInput = createControlledInput("apple");
selectInput.subscribe((val) => console.log(`  [re-render] <select value="${val}" />`));
selectInput.onChange("banana");
selectInput.onChange("cherry");

// C: Controlled form with validation
console.log("\nC: Controlled form with validation");
function createControlledForm() {
  const fields = { email: "", password: "" };
  const errors = { email: "", password: "" };

  function setValue(field, value) {
    fields[field] = value;
    // Validate on each change
    if (field === "email" && !value.includes("@")) {
      errors.email = "Must contain @";
    } else {
      errors[field] = "";
    }
    if (field === "password" && value.length < 6) {
      errors.password = "Min 6 chars";
    } else if (field === "password") {
      errors.password = "";
    }
    console.log(`  ${field}="${value}" ${errors[field] ? "ERROR: " + errors[field] : "OK"}`);
  }

  function submit() {
    const hasErrors = Object.values(errors).some(Boolean);
    console.log(`  Submit: ${hasErrors ? "BLOCKED (errors exist)" : "SUCCESS"}`);
    return !hasErrors;
  }

  return { setValue, submit };
}

const form = createControlledForm();
form.setValue("email", "surya");
form.setValue("email", "surya@dev.com");
form.setValue("password", "123");
form.setValue("password", "123456");
form.submit();

// D: Controlled vs uncontrolled comparison
console.log("\nD: Controlled vs Uncontrolled");
console.log("  Controlled:   value={state} onChange={setState}");
console.log("  Uncontrolled: defaultValue='hi' ref={inputRef}");
console.log("  Controlled = instant validation, formatted input, disable submit");
console.log("  Uncontrolled = simpler, less re-renders, file inputs");

// E: Transform input (uppercase only)
console.log("\nE: Transform input — uppercase enforced");
const upperInput = createControlledInput("");
upperInput.subscribe((val) => console.log(`  [render] value="${val}"`));
function typeUpper(input, char) {
  input.onChange((input.getValue() + char).toUpperCase());
}
typeUpper(upperInput, "h");
typeUpper(upperInput, "i");

/**
 * OUTPUT:
 * A: Basic controlled input
 *   [re-render] <input value="S" />
 *   ...
 *   [re-render] <input value="Surya" />
 *
 * B: Controlled select
 *   [re-render] <select value="banana" />
 *   [re-render] <select value="cherry" />
 *
 * C: Controlled form with validation
 *   email="surya" ERROR: Must contain @
 *   email="surya@dev.com" OK
 *   password="123" ERROR: Min 6 chars
 *   password="123456" OK
 *   Submit: SUCCESS
 *
 * D: Controlled vs Uncontrolled (comparison)
 *
 * E: Transform input — uppercase enforced
 *   [render] value="H"
 *   [render] value="HI"
 *
 * ┌─── INTERVIEW ANSWER ───┐
 * │ Controlled: React state = source of truth. value +     │
 * │ onChange on every input. Enables validation, formatting │
 * │ conditional submit. Trade-off: more re-renders.        │
 * │ Every keystroke: onChange → setState → re-render.       │
 * └────────────────────────────────────────────────────────┘
 *
 * RUN: node docs/react/11-forms-events/00-controlled-components.js
 */
