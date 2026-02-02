/**
 * TOPIC: useImperativeHandle
 *
 * ╔══════════════════════════════════════════════════════════╗
 * ║           THE GOLDEN RULE                                ║
 * ║  useImperativeHandle customizes what the parent sees     ║
 * ║  through a ref. Instead of the raw DOM node, expose      ║
 * ║  only specific methods. Used WITH forwardRef.            ║
 * ╚══════════════════════════════════════════════════════════╝
 *
 * ┌── STORY TO REMEMBER ──────────────────────────────────────┐
 * │ useImperativeHandle = a hotel concierge desk. The guest   │
 * │ (parent) doesn't get the master key (full DOM). They get  │
 * │ a concierge (proxy) who exposes only allowed services     │
 * │ (focus, scrollTo, reset) — nothing else.                  │
 * └───────────────────────────────────────────────────────────┘
 *
 * ┌── VISUAL DIAGRAM ────────────────────────────────────────┐
 * │                                                           │
 * │  Without useImperativeHandle:                             │
 * │    ref.current = <input />  (full DOM access)             │
 * │                                                           │
 * │  With useImperativeHandle:                                │
 * │    ref.current = { focus(), clear() }  (restricted API)   │
 * │                                                           │
 * │  Usage:                                                   │
 * │    useImperativeHandle(ref, () => ({                      │
 * │      focus: () => inputRef.current.focus(),               │
 * │      clear: () => inputRef.current.value = ''             │
 * │    }));                                                   │
 * └───────────────────────────────────────────────────────────┘
 *
 * React code:
 *   const FancyInput = forwardRef((props, ref) => {
 *     const inputRef = useRef();
 *     useImperativeHandle(ref, () => ({
 *       focus: () => inputRef.current.focus(),
 *       clear: () => { inputRef.current.value = ''; }
 *     }));
 *     return <input ref={inputRef} />;
 *   });
 */

// --- Pure JS Simulation ---

// A: Simulate the internal DOM node (private)
const realDOMNode = {
  tagName: "INPUT",
  value: "Some text",
  focus() { console.log("  [DOM] Input focused"); },
  blur() { console.log("  [DOM] Input blurred"); },
  scrollHeight: 200,
  innerHTML: "<span>secret</span>",
};

// B: Without useImperativeHandle — parent sees EVERYTHING
const refWithout = { current: realDOMNode };
console.log("B: Without useImperativeHandle:");
console.log("   Parent can access:", Object.keys(refWithout.current).join(", "));
console.log("   Parent sees innerHTML:", refWithout.current.innerHTML);

console.log("");

// C: Simulate useImperativeHandle — expose only selected methods
function useImperativeHandle(ref, createHandle) {
  ref.current = createHandle();
}

const parentRef = { current: null };
const internalRef = { current: realDOMNode };

useImperativeHandle(parentRef, () => ({
  focus() {
    internalRef.current.focus();
  },
  clear() {
    internalRef.current.value = "";
    console.log("  [API] Input cleared");
  },
  getValue() {
    return internalRef.current.value;
  },
}));

console.log("C: With useImperativeHandle:");
console.log("   Parent can access:", Object.keys(parentRef.current).join(", "));
console.log("   Parent CANNOT see innerHTML, scrollHeight, etc.");

console.log("");

// D: Parent uses the restricted API
console.log("=== D: Parent calling exposed methods ===");
parentRef.current.focus();
console.log("D: getValue =>", parentRef.current.getValue());
parentRef.current.clear();
console.log("D: getValue after clear =>", internalRef.current.value);

console.log("");

// E: Why restrict access?
console.log("E: Why use useImperativeHandle?");
console.log("   1. Encapsulation — child controls its own DOM");
console.log("   2. Stable API — internal DOM changes won't break parent");
console.log("   3. Security — prevent parent from doing unexpected mutations");
console.log("   4. Clarity — parent knows exactly what operations are available");

console.log("");

// F: Complete pattern
console.log("F: Complete pattern (React code):");
console.log("   const Child = forwardRef((props, ref) => {");
console.log("     const inputRef = useRef();");
console.log("     useImperativeHandle(ref, () => ({");
console.log("       focus: () => inputRef.current.focus(),");
console.log("       scrollToTop: () => inputRef.current.scrollTop = 0");
console.log("     }), []);  // <-- dependency array (like useEffect)");
console.log("     return <input ref={inputRef} />;");
console.log("   });");

/**
 * OUTPUT:
 * B: Without useImperativeHandle:
 *    Parent can access: tagName, value, focus, blur, scrollHeight, innerHTML
 *    Parent sees innerHTML: <span>secret</span>
 *
 * C: With useImperativeHandle:
 *    Parent can access: focus, clear, getValue
 *    Parent CANNOT see innerHTML, scrollHeight, etc.
 *
 * === D: Parent calling exposed methods ===
 *   [DOM] Input focused
 * D: getValue => Some text
 *   [API] Input cleared
 * D: getValue after clear =>
 *
 * E: Why use useImperativeHandle? ...
 * F: Complete pattern ...
 *
 * ┌── INTERVIEW ANSWER ──────────────────────────────────────┐
 * │ useImperativeHandle customizes the instance value exposed │
 * │ to parent components via ref. Used with forwardRef, it    │
 * │ lets you expose only specific methods (focus, clear)      │
 * │ instead of the raw DOM node — providing encapsulation.    │
 * └───────────────────────────────────────────────────────────┘
 *
 * RUN: node docs/react/13-refs-dom/02-useImperativeHandle.js
 */
