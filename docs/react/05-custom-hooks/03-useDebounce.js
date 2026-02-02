/**
 * TOPIC: useDebounce — Debounced Value Hook
 *
 * ╔══════════════════════════════════════════════════════════════════════╗
 * ║                    THE GOLDEN RULE                                  ║
 * ║  useDebounce delays updating a value until the user stops         ║
 * ║  changing it for N milliseconds. Perfect for search inputs.       ║
 * ║  It uses useEffect + setTimeout + cleanup (clearTimeout).         ║
 * ╚══════════════════════════════════════════════════════════════════════╝
 *
 * ┌── STORY TO REMEMBER ──────────────────────────────────────────────┐
 * │ Debounce is an elevator door. Every time someone presses the     │
 * │ button (types a letter), the door timer resets. The door only    │
 * │ closes (value updates) when nobody presses for N seconds.        │
 * └───────────────────────────────────────────────────────────────────┘
 *
 * ┌── VISUAL DIAGRAM ─────────────────────────────────────────────────┐
 * │  User types: H-e-l-l-o                                            │
 * │  Timer:      [x][x][x][x][...wait 300ms...] → "Hello"           │
 * │              reset each keystroke   ↑ finally fires               │
 * │                                                                    │
 * │  Without debounce: 5 API calls (H, He, Hel, Hell, Hello)        │
 * │  With debounce:    1 API call  (Hello)                            │
 * └───────────────────────────────────────────────────────────────────┘
 */

// === Core debounce function ===
function debounce(fn, delay) {
  let timerId;
  return (...args) => {
    clearTimeout(timerId);
    timerId = setTimeout(() => fn(...args), delay);
  };
}

// --- A: Basic debounce ---
console.log("A: === Basic Debounce ===");

const apiCalls = [];
const debouncedSearch = debounce((query) => {
  apiCalls.push(query);
  console.log(`   API call: "${query}"`);
}, 100);

// Simulate rapid typing
debouncedSearch("H");
debouncedSearch("He");
debouncedSearch("Hel");
debouncedSearch("Hell");
debouncedSearch("Hello");

setTimeout(() => {
  console.log(`   Total API calls: ${apiCalls.length} (instead of 5)\n`);

  // --- B: useDebounce hook simulation ---
  console.log("B: === useDebounce Hook Simulation ===");

  function useDebounce(value, delay) {
    let debouncedValue = value;
    let timerId = null;

    const update = (newValue) => {
      clearTimeout(timerId);
      return new Promise(resolve => {
        timerId = setTimeout(() => {
          debouncedValue = newValue;
          resolve(debouncedValue);
        }, delay);
      });
    };

    const cancel = () => clearTimeout(timerId);

    return { getValue: () => debouncedValue, update, cancel };
  }

  const debounced = useDebounce("", 150);

  // Simulate typing with delays
  async function simulateTyping() {
    const letters = ["R", "Re", "Rea", "Reac", "React"];
    for (const text of letters) {
      console.log(`   Typed: "${text}" → debounced: "${debounced.getValue()}"`);
      debounced.update(text);
      await new Promise(r => setTimeout(r, 30)); // fast typing
    }
    // Wait for debounce to settle
    await new Promise(r => setTimeout(r, 200));
    console.log(`   Settled: "${debounced.getValue()}" → trigger search!\n`);

    // --- C: Cleanup prevents stale updates ---
    console.log("C: === Cleanup on Unmount ===");
    const hook = useDebounce("", 200);
    hook.update("searching...");
    hook.cancel(); // component unmounted!
    await new Promise(r => setTimeout(r, 250));
    console.log(`   After cancel: "${hook.getValue()}" (empty — cancelled!)\n`);

    // --- D: React code ---
    console.log("D: === Actual React Code ===");
    console.log("   function useDebounce(value, delay) {");
    console.log("     const [debounced, setDebounced] = useState(value);");
    console.log("     useEffect(() => {");
    console.log("       const timer = setTimeout(() => {");
    console.log("         setDebounced(value);");
    console.log("       }, delay);");
    console.log("       return () => clearTimeout(timer);  // cleanup!");
    console.log("     }, [value, delay]);");
    console.log("     return debounced;");
    console.log("   }");
    console.log("");
    console.log("   // Usage:");
    console.log("   const [query, setQuery] = useState('');");
    console.log("   const debouncedQuery = useDebounce(query, 300);");
    console.log("   useEffect(() => {");
    console.log("     if (debouncedQuery) fetchResults(debouncedQuery);");
    console.log("   }, [debouncedQuery]);");
  }

  simulateTyping();
}, 200);

/**
 * OUTPUT:
 * A: Only 1 API call for "Hello" (not 5)
 * B: Typing shows intermediate, settles to "React"
 * C: Cancel prevents stale update
 * D: React code printed
 *
 * ╔══════════════════════════════════════════════════════════════════════╗
 * ║ INTERVIEW ANSWER: "useDebounce returns a debounced version of a   ║
 * ║ value that only updates after the user stops changing it for N ms.║
 * ║ Internally it uses useEffect with setTimeout and clears the timer ║
 * ║ in the cleanup function. This prevents excessive API calls during ║
 * ║ rapid input like search-as-you-type."                              ║
 * ╚══════════════════════════════════════════════════════════════════════╝
 *
 * RUN: node docs/react/05-custom-hooks/03-useDebounce.js
 */
