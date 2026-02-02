/**
 * TOPIC: useLocalStorage — Sync State with localStorage
 *
 * ╔══════════════════════════════════════════════════════════════════════╗
 * ║                    THE GOLDEN RULE                                  ║
 * ║  useLocalStorage wraps useState but persists to localStorage.     ║
 * ║  Read on mount (lazy init), write on every state change.          ║
 * ║  Handle JSON parse errors and SSR (no window).                    ║
 * ╚══════════════════════════════════════════════════════════════════════╝
 *
 * ┌── STORY TO REMEMBER ──────────────────────────────────────────────┐
 * │ useLocalStorage is a notebook with carbon copy. Whatever you     │
 * │ write on the top page (state), automatically copies to the       │
 * │ bottom page (localStorage). When you open the notebook tomorrow  │
 * │ (remount), the carbon copy is still there.                        │
 * └───────────────────────────────────────────────────────────────────┘
 *
 * ┌── VISUAL DIAGRAM ─────────────────────────────────────────────────┐
 * │  Mount: localStorage.getItem(key) → parse → initial state        │
 * │  Update: setState(val) → JSON.stringify → localStorage.setItem   │
 * │                                                                    │
 * │  Component ←→ useState ←→ localStorage                           │
 * │              (in memory)    (on disk)                              │
 * └───────────────────────────────────────────────────────────────────┘
 */

// === Simulate localStorage in Node.js ===
const fakeStorage = {};
const localStorage = {
  getItem(key) { return fakeStorage[key] || null; },
  setItem(key, val) { fakeStorage[key] = String(val); },
  removeItem(key) { delete fakeStorage[key]; },
};

// === Simulate useLocalStorage ===
function useLocalStorage(key, initialValue) {
  // Lazy initialization: read from storage
  let storedValue;
  try {
    const item = localStorage.getItem(key);
    storedValue = item ? JSON.parse(item) : initialValue;
  } catch (e) {
    console.log(`   Error reading "${key}": ${e.message}`);
    storedValue = initialValue;
  }

  let state = storedValue;

  const setValue = (value) => {
    // Support functional updates: setValue(prev => prev + 1)
    const newValue = typeof value === "function" ? value(state) : value;
    state = newValue;
    try {
      localStorage.setItem(key, JSON.stringify(newValue));
    } catch (e) {
      console.log(`   Error writing "${key}": ${e.message}`);
    }
  };

  return [() => state, setValue]; // getter fn since we can't re-render
}

// --- A: Basic usage ---
console.log("A: === Basic useLocalStorage ===");
const [getTheme, setTheme] = useLocalStorage("theme", "light");
console.log(`   Initial theme: ${getTheme()}`);
setTheme("dark");
console.log(`   After set: ${getTheme()}`);
console.log(`   localStorage: ${localStorage.getItem("theme")}`);

// --- B: Persists across "remounts" ---
console.log("\nB: === Persists Across Remounts ===");
// Simulate unmount + remount — reads from storage
const [getTheme2] = useLocalStorage("theme", "light");
console.log(`   Remount reads: ${getTheme2()} (from localStorage, not default!)`);

// --- C: Complex objects ---
console.log("\nC: === Complex Objects ===");
const [getUser, setUser] = useLocalStorage("user", { name: "", loggedIn: false });
console.log(`   Initial: ${JSON.stringify(getUser())}`);
setUser({ name: "Surya", loggedIn: true });
console.log(`   Updated: ${JSON.stringify(getUser())}`);
console.log(`   Stored:  ${localStorage.getItem("user")}`);

// --- D: Functional update ---
console.log("\nD: === Functional Update ===");
const [getCount, setCount] = useLocalStorage("count", 0);
setCount(prev => prev + 1);
setCount(prev => prev + 1);
setCount(prev => prev + 1);
console.log(`   Count after 3 increments: ${getCount()}`);

// --- E: Error handling ---
console.log("\nE: === Error Handling ===");
// Corrupt data in storage
localStorage.setItem("broken", "not-valid-json{{{");
const [getBroken] = useLocalStorage("broken", "fallback");
console.log(`   Corrupt data falls back to: ${getBroken()}`);

// --- F: The React code ---
console.log("\nF: === Actual React Code ===");
console.log("   function useLocalStorage(key, initialValue) {");
console.log("     const [state, setState] = useState(() => {");
console.log("       const item = localStorage.getItem(key);");
console.log("       return item ? JSON.parse(item) : initialValue;");
console.log("     });");
console.log("     useEffect(() => {");
console.log("       localStorage.setItem(key, JSON.stringify(state));");
console.log("     }, [key, state]);");
console.log("     return [state, setState];");
console.log("   }");

/**
 * OUTPUT:
 * A: theme light → dark, stored in localStorage
 * B: Remount reads "dark" from storage
 * C: Complex object stored as JSON
 * D: Functional updates work
 * E: Corrupt JSON falls back to default
 * F: React code printed
 *
 * ╔══════════════════════════════════════════════════════════════════════╗
 * ║ INTERVIEW ANSWER: "useLocalStorage wraps useState with lazy init  ║
 * ║ from localStorage and a useEffect that writes on state change.    ║
 * ║ It handles JSON serialization, parse errors with try/catch, and   ║
 * ║ supports functional updates. Data persists across page reloads."  ║
 * ╚══════════════════════════════════════════════════════════════════════╝
 *
 * RUN: node docs/react/05-custom-hooks/02-useLocalStorage.js
 */
