/**
 * TOPIC: Custom Hooks — Extract Reusable Logic
 *
 * ╔══════════════════════════════════════════════════════════════════════╗
 * ║                    THE GOLDEN RULE                                  ║
 * ║  A custom hook is a function starting with "use" that calls other ║
 * ║  hooks. It extracts reusable stateful logic without adding more   ║
 * ║  components. Each call gets its OWN independent state.            ║
 * ╚══════════════════════════════════════════════════════════════════════╝
 *
 * ┌── STORY TO REMEMBER ──────────────────────────────────────────────┐
 * │ Custom hooks are like recipes. The recipe (hook) is the same,    │
 * │ but each chef (component) using it gets their OWN pot of food.   │
 * │ Sharing the recipe doesn't mean sharing the meal — each call     │
 * │ creates independent state.                                        │
 * └───────────────────────────────────────────────────────────────────┘
 *
 * ┌── VISUAL DIAGRAM ─────────────────────────────────────────────────┐
 * │  Before custom hooks:                                              │
 * │  ComponentA: [state, effect, logic]                               │
 * │  ComponentB: [state, effect, SAME logic copy-pasted]              │
 * │                                                                    │
 * │  After custom hooks:                                               │
 * │  useSharedLogic: [state, effect, logic]                           │
 * │  ComponentA: useSharedLogic()  → own state instance               │
 * │  ComponentB: useSharedLogic()  → own state instance               │
 * └───────────────────────────────────────────────────────────────────┘
 */

// === Simulate hooks infrastructure ===
let _store = [];
let _idx = 0;
function useState(init) {
  const i = _idx++;
  if (_store[i] === undefined) _store[i] = init;
  return [_store[i], (v) => { _store[i] = v; }];
}
function resetHooks() { _idx = 0; }
function clearStore() { _store = []; _idx = 0; }

// --- A: Basic custom hook — useToggle ---
console.log("A: === useToggle — Basic Custom Hook ===");

function useToggle(initial = false) {
  const [value, setValue] = useState(initial);
  const toggle = () => setValue(!_store[_idx - 2]); // simulate toggle
  return [value, toggle];
}

clearStore();
const [isOpen, toggleOpen] = useToggle(false);
console.log(`   isOpen: ${isOpen}`);
// In React, toggle() would cause re-render with new value

// --- B: useCounter — composing useState ---
console.log("\nB: === useCounter — Compose Hooks ===");

function useCounter(initial = 0) {
  const [count, setCount] = useState(initial);
  return {
    count,
    increment: () => setCount(count + 1),
    decrement: () => setCount(count - 1),
    reset: () => setCount(initial),
  };
}

clearStore();
const counter = useCounter(10);
console.log(`   count: ${counter.count}`);
console.log("   Has: increment(), decrement(), reset()");
console.log("   Each component using useCounter gets its OWN count\n");

// --- C: Independent state proof ---
console.log("C: === Each Call Gets Independent State ===");

clearStore();
// Component A calls useCounter
const counterA = useCounter(0);   // uses _store[0]
// Component B calls useCounter
const counterB = useCounter(100); // uses _store[1]

console.log(`   counterA.count = ${counterA.count}`);
console.log(`   counterB.count = ${counterB.count}`);
console.log("   Different instances! Not shared state.\n");

// --- D: Naming convention ---
console.log("D: === Naming Convention ===");
console.log("   MUST start with 'use' — this tells React's linter to");
console.log("   enforce the Rules of Hooks inside it.\n");
console.log("   useAuth()         - authentication logic");
console.log("   useFetch()        - data fetching");
console.log("   useLocalStorage() - localStorage sync");
console.log("   useDebounce()     - debounced values");
console.log("   useWindowSize()   - window dimensions\n");

// --- E: Composing hooks inside hooks ---
console.log("E: === Composing Hooks ===");

function useForm(initialValues) {
  const [values, setValues] = useState(initialValues);
  const [errors, setErrors] = useState({});

  const handleChange = (name, value) => {
    console.log(`   setValues({ ...values, ${name}: "${value}" })`);
  };

  const validate = () => {
    console.log("   Validating form...");
    return Object.keys(initialValues).every(k => initialValues[k] !== "");
  };

  return { values, errors, handleChange, validate };
}

clearStore();
const form = useForm({ name: "", email: "" });
form.handleChange("name", "Surya");
form.handleChange("email", "surya@test.com");
console.log(`   Valid: ${form.validate()}`);

/**
 * OUTPUT:
 * A: useToggle basic hook
 * B: useCounter composed from useState
 * C: Independent state per call
 * D: Naming conventions
 * E: Composing hooks in useForm
 *
 * ╔══════════════════════════════════════════════════════════════════════╗
 * ║ INTERVIEW ANSWER: "Custom hooks extract reusable stateful logic   ║
 * ║ into functions prefixed with 'use'. They can call any built-in    ║
 * ║ hook or other custom hooks. Each component calling the hook gets  ║
 * ║ its own independent state — hooks share logic, not state."         ║
 * ╚══════════════════════════════════════════════════════════════════════╝
 *
 * RUN: node docs/react/05-custom-hooks/00-custom-hook-basics.js
 */
