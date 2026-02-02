/**
 * TOPIC: React.forwardRef
 *
 * ╔══════════════════════════════════════════════════════════╗
 * ║           THE GOLDEN RULE                                ║
 * ║  forwardRef lets a parent pass a ref THROUGH a child     ║
 * ║  component to reach the child's inner DOM node.          ║
 * ║  Without it, ref on a custom component does nothing.     ║
 * ╚══════════════════════════════════════════════════════════╝
 *
 * ┌── STORY TO REMEMBER ──────────────────────────────────────┐
 * │ forwardRef = a mail forwarding service. The parent sends  │
 * │ a letter (ref) to a PO Box (child component). forwardRef │
 * │ forwards that letter to the actual house (inner DOM).     │
 * └───────────────────────────────────────────────────────────┘
 *
 * ┌── VISUAL DIAGRAM ────────────────────────────────────────┐
 * │                                                           │
 * │  Parent                                                   │
 * │    const ref = useRef(null)                               │
 * │    <FancyInput ref={ref} />                               │
 * │         │                                                 │
 * │         ▼  (ref is forwarded)                             │
 * │  FancyInput = forwardRef((props, ref) =>                  │
 * │    <input ref={ref} />                                    │
 * │  )                                                        │
 * │         │                                                 │
 * │         ▼                                                 │
 * │  ref.current === <input /> DOM node                       │
 * └───────────────────────────────────────────────────────────┘
 *
 * React code:
 *   const FancyInput = React.forwardRef((props, ref) => (
 *     <input ref={ref} className="fancy" {...props} />
 *   ));
 *   // Parent: <FancyInput ref={myRef} />
 */

// --- Pure JS Simulation ---

// A: Without forwardRef — ref doesn't reach inner DOM
function RegularChild(props) {
  const innerDOM = { tagName: "INPUT", focus() { console.log("  INPUT focused"); } };
  // ref is NOT accessible — it's just a prop name React strips
  return { render: "RegularChild rendered", _dom: innerDOM };
}

const parentRef1 = { current: null };
const child1 = RegularChild({ ref: parentRef1 });
console.log("A: Without forwardRef => parentRef.current:", parentRef1.current); // null!

console.log("");

// B: With forwardRef — parent can reach inner DOM
function forwardRef(renderFn) {
  return function ForwardedComponent(props, ref) {
    return renderFn(props, ref);
  };
}

const FancyInput = forwardRef((props, ref) => {
  const innerDOM = {
    tagName: "INPUT",
    className: "fancy",
    focus() { console.log("  FANCY INPUT focused!"); },
    value: props.defaultValue || "",
  };
  // Forward the ref to inner DOM
  if (ref) ref.current = innerDOM;
  return { render: "FancyInput rendered" };
});

const parentRef2 = { current: null };
const child2 = FancyInput({ defaultValue: "Hello" }, parentRef2);
console.log("B: With forwardRef => parentRef.current:", parentRef2.current);
parentRef2.current.focus();

console.log("");

// C: Real-world use case — reusable component library
console.log("=== C: Common forwardRef use cases ===");
console.log("C1: Custom input components (FancyInput, SearchBar)");
console.log("C2: Component libraries (MUI, Chakra UI)");
console.log("C3: HOCs that wrap components");
console.log("C4: Any time parent needs DOM access to a child's element");

console.log("");

// D: forwardRef with displayName (for devtools)
const MyComponent = forwardRef((props, ref) => {
  return { render: "MyComponent" };
});
MyComponent.displayName = "MyComponent";
console.log("D: Set displayName for devtools:", MyComponent.displayName);

// E: Key point — ref is NOT a prop
console.log("\nE: Why do we need forwardRef?");
console.log("   React strips 'ref' from props automatically.");
console.log("   forwardRef gives you a 2nd parameter to receive it.");
console.log("   Without forwardRef: (props) => ... // no ref access");
console.log("   With forwardRef:    (props, ref) => ... // ref available");

/**
 * OUTPUT:
 * A: Without forwardRef => parentRef.current: null
 *
 * B: With forwardRef => parentRef.current: { tagName: 'INPUT', ... }
 *   FANCY INPUT focused!
 *
 * === C: Common forwardRef use cases ===
 * C1-C4: (listed above)
 *
 * D: Set displayName for devtools: MyComponent
 * E: Why do we need forwardRef? ...
 *
 * ┌── INTERVIEW ANSWER ──────────────────────────────────────┐
 * │ forwardRef is a HOF that lets a child component receive   │
 * │ a ref from its parent and attach it to an inner DOM       │
 * │ element. React strips ref from props, so forwardRef       │
 * │ provides it as a second argument: (props, ref) => JSX.    │
 * └───────────────────────────────────────────────────────────┘
 *
 * RUN: node docs/react/13-refs-dom/01-forwardRef.js
 */
