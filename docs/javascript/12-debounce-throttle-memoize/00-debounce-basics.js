/**
 * TOPIC: Debounce Basics
 *
 * STORY: Imagine an elevator door. Every time someone presses the "open" button,
 * the door resets its closing timer. It only closes after NO ONE has pressed the
 * button for a few seconds. That's debouncing -- wait until the activity stops,
 * then act once.
 *
 * ╔════════════════════════════════════════════════════════════════════════════╗
 * ║ THE GOLDEN RULE                                                            ║
 * ╠════════════════════════════════════════════════════════════════════════════╣
 * ║                                                                            ║
 * ║ Debouncing ensures a function only executes AFTER a pause in calls.        ║
 * ║                                                                            ║
 * ║   "Wait until the user STOPS doing something, then execute once."          ║
 * ║                                                                            ║
 * ║ Each new call RESETS the timer. Only the LAST call in a burst executes.    ║
 * ║                                                                            ║
 * ║ Think: Autocomplete search - wait until user stops typing!                 ║
 * ║                                                                            ║
 * ╚════════════════════════════════════════════════════════════════════════════╝
 */

const debounce = (fn, delay) => { // ES6: arrow function + const
  let timeoutId; // ES6: let instead of var
  return (...args) => { // ES6: arrow function
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => fn.apply(this, args), delay);
  };
};

const log = debounce((msg) => { // ES6: const + arrow function
  console.log(`Logged: ${msg}`); // ES6: template literal
}, 100);

console.log('A: Start');

log('first');
log('second');
log('third');

console.log('B: After all calls');

setTimeout(() => { // ES6: arrow function
  console.log('C: After 150ms');
}, 150);

/**
 * OUTPUT:
 *   A: Start
 *   B: After all calls
 *   Logged: third
 *   C: After 150ms
 *
 *
 * ╔════════════════════════════════════════════════════════════════════════════╗
 * ║ STEP-BY-STEP BREAKDOWN                                                     ║
 * ╠════════════════════════════════════════════════════════════════════════════╣
 * ║                                                                            ║
 * ║ Timeline of events:                                                        ║
 * ║ ───────────────────                                                        ║
 * ║                                                                            ║
 * ║   0ms: console.log('A: Start')         → Prints "A: Start"                 ║
 * ║   0ms: log('first')                    → Sets timer for 100ms              ║
 * ║   0ms: log('second')                   → CANCELS first, new timer 100ms    ║
 * ║   0ms: log('third')                    → CANCELS second, new timer 100ms   ║
 * ║   0ms: console.log('B: After...')      → Prints "B: After all calls"       ║
 * ║                                                                            ║
 * ║   100ms: Third timer fires!            → Prints "Logged: third"            ║
 * ║                                                                            ║
 * ║   150ms: setTimeout callback           → Prints "C: After 150ms"           ║
 * ║                                                                            ║
 * ║ Key insight: Only 'third' executes because each call cancels the previous! ║
 * ║                                                                            ║
 * ╚════════════════════════════════════════════════════════════════════════════╝
 *
 *
 * ┌─────────────────────────────────────────────────────────────────────────────┐
 * │ TIMING DIAGRAM                                                              │
 * ├─────────────────────────────────────────────────────────────────────────────┤
 * │                                                                             │
 * │   Time:  0ms      50ms     100ms    150ms                                   │
 * │          │         │         │        │                                     │
 * │   Calls: ▼▼▼       │         │        │                                     │
 * │          │         │         │        │                                     │
 * │   first  ├─ ✗ cancelled      │        │                                     │
 * │   second ├─ ✗ cancelled      │        │                                     │
 * │   third  ├─────────────────► ● FIRES! │                                     │
 * │                              │        │                                     │
 * │                              │        │                                     │
 * │   Output: A, B               │ "third"│  C                                  │
 * │                                                                             │
 * │   Legend: ▼ = call, ✗ = cancelled, ● = executes                            │
 * │                                                                             │
 * └─────────────────────────────────────────────────────────────────────────────┘
 *
 *
 * ┌─────────────────────────────────────────────────────────────────────────────┐
 * │ DEBOUNCE IMPLEMENTATION EXPLAINED                                           │
 * ├─────────────────────────────────────────────────────────────────────────────┤
 * │                                                                             │
 * │   const debounce = (fn, delay) => {                                         │
 * │     let timeoutId;              // Closure stores the timer ID              │
 * │                                                                             │
 * │     return (...args) => {                                                   │
 * │       clearTimeout(timeoutId);  // CANCEL any pending execution             │
 * │       timeoutId = setTimeout(   // Schedule NEW execution                   │
 * │         () => fn.apply(this, args),                                         │
 * │         delay                                                               │
 * │       );                                                                    │
 * │     };                                                                      │
 * │   };                                                                        │
 * │                                                                             │
 * │   The magic: clearTimeout + setTimeout = reset timer on every call          │
 * │                                                                             │
 * └─────────────────────────────────────────────────────────────────────────────┘
 *
 *
 * ┌─────────────────────────────────────────────────────────────────────────────┐
 * │ INTERVIEW QUESTIONS:                                                        │
 * ├─────────────────────────────────────────────────────────────────────────────┤
 * │                                                                             │
 * │ Q1: What is debouncing and how does it work?                                │
 * │ A1: "Debouncing is a technique that delays function execution until after   │
 * │  a period of inactivity. Each new call resets the delay timer.              │
 * │                                                                             │
 * │  Implementation:                                                            │
 * │  const debounce = (fn, delay) => {                                          │
 * │    let timeoutId;                                                           │
 * │    return (...args) => {                                                    │
 * │      clearTimeout(timeoutId);                                               │
 * │      timeoutId = setTimeout(() => fn.apply(this, args), delay);             │
 * │    };                                                                       │
 * │  };                                                                         │
 * │                                                                             │
 * │ Q2: What are common use cases for debouncing?                               │
 * │ A2: Common use cases include:                                               │
 * │  - Search input autocomplete (wait until user stops typing)                 │
 * │  - Window resize handlers (wait until resize completes)                     │
 * │  - Form validation (wait until user finishes input)                         │
 * │  - Auto-save functionality (wait until user pauses editing)                 │
 * │                                                                             │
 * │ Q3: Why does only the LAST call execute in a debounced burst?               │
 * │ A3: Because each new call runs clearTimeout() which cancels the previous    │
 * │  pending setTimeout, then schedules a brand new one. Only the final call    │
 * │  has no subsequent call to cancel it, so its timer completes and fires.     │
 * │  Key insight: Only the LAST call in a rapid sequence executes."             │
 * │                                                                             │
 * └─────────────────────────────────────────────────────────────────────────────┘
 *
 *
 * RUN: node docs/javascript/12-debounce-throttle-memoize/00-debounce-basics.js
 */
