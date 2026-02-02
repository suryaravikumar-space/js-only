/**
 * TOPIC: Refs & DOM Interview Cheatsheet
 *
 * ╔══════════════════════════════════════════════════════════╗
 * ║           THE GOLDEN RULE                                ║
 * ║  useRef = mutable container, no re-render.               ║
 * ║  forwardRef = pass ref through child to inner DOM.       ║
 * ║  useImperativeHandle = restrict what parent sees via ref.║
 * ╚══════════════════════════════════════════════════════════╝
 *
 * ┌── STORY TO REMEMBER ──────────────────────────────────────┐
 * │ Ref trio:                                                 │
 * │  useRef         = your personal notebook (private notes)  │
 * │  forwardRef     = forwarding mail to the right address    │
 * │  imperative     = concierge desk (limited services only)  │
 * └───────────────────────────────────────────────────────────┘
 *
 * ┌── VISUAL DIAGRAM ────────────────────────────────────────┐
 * │  useRef(val)  =>  { current: val }                        │
 * │  Mutate .current => no re-render                          │
 * │  Attach via ref prop => access DOM node                   │
 * │                                                           │
 * │  forwardRef((props, ref) => <input ref={ref}/>)           │
 * │  Parent's ref reaches child's inner DOM                   │
 * │                                                           │
 * │  useImperativeHandle(ref, () => ({ focus, clear }))       │
 * │  Parent's ref sees only exposed methods                   │
 * └───────────────────────────────────────────────────────────┘
 */

// --- Q&A ---

// Q1
console.log("Q1: What does useRef return?");
const ref = { current: null };
console.log("A:", JSON.stringify(ref), "- a mutable object that persists across renders\n");

// Q2
console.log("Q2: Does changing useRef cause a re-render?");
ref.current = 42;
console.log("A: No. Mutating ref.current is silent. Use useState if you need re-render.\n");

// Q3
console.log("Q3: When to use useRef vs useState?");
console.log("A: useRef  — DOM access, timers, previous values, any mutable value without re-render");
console.log("   useState — data that should trigger UI update when changed\n");

// Q4
console.log("Q4: How to focus an input on mount?");
console.log("A: const ref = useRef(null);");
console.log("   useEffect(() => { ref.current.focus(); }, []);");
console.log("   return <input ref={ref} />\n");

// Q5
console.log("Q5: What is forwardRef and why is it needed?");
console.log("A: React strips 'ref' from props. forwardRef provides ref as 2nd parameter");
console.log("   so child can attach it to its inner DOM element.\n");

// Q6
console.log("Q6: What is useImperativeHandle?");
console.log("A: Customizes what parent sees through ref. Expose only specific methods.");
console.log("   Used with forwardRef. Takes (ref, createHandle, deps).\n");

// Q7
console.log("Q7: Can you use ref with class components?");
console.log("A: Yes. Use React.createRef() in constructor. Or callback refs.");
console.log("   const ref = React.createRef(); // in constructor");
console.log("   <input ref={ref} />\n");

// Q8
console.log("Q8: What is a callback ref?");
function callbackRefDemo(node) {
  if (node) console.log("A: Callback ref called with node:", node.tagName);
}
callbackRefDemo({ tagName: "INPUT" });
console.log("   Callback ref = function passed as ref. Called with node on mount, null on unmount.\n");

// Q9: Simulate storing interval ID in ref
console.log("Q9: How to store interval ID in useRef?");
const intervalRef = { current: null };
intervalRef.current = setInterval(() => {}, 1000);
clearInterval(intervalRef.current);
console.log("A: Store in ref.current, clear in cleanup. Ref persists across renders.\n");

// Q10
console.log("Q10: useRef vs createRef?");
console.log("A: useRef    — hook, same object every render (functional components)");
console.log("   createRef — creates NEW ref each call (class components)\n");

// Q11: Quick coding demo
console.log("Q11: Implement usePrevious with useRef:");
function usePrevious(values) {
  const ref = { current: undefined };
  const results = [];
  for (const val of values) {
    results.push(ref.current);
    ref.current = val;
  }
  return results;
}
console.log("A: Previous values for [1,5,10]:", usePrevious([1, 5, 10]));

/**
 * OUTPUT:
 * Q1-Q11 answers printed above
 *
 * ┌── INTERVIEW ANSWER ──────────────────────────────────────┐
 * │ useRef = mutable { current } container, no re-render.     │
 * │ forwardRef = forward parent's ref to child's inner DOM.   │
 * │ useImperativeHandle = expose restricted API via ref.      │
 * │ callback ref = function called with DOM node.             │
 * │ useRef persists same object; createRef creates new each.  │
 * └───────────────────────────────────────────────────────────┘
 *
 * RUN: node docs/react/13-refs-dom/03-interview-cheatsheet.js
 */
