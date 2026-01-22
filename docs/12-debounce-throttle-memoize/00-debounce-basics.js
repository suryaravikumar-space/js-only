/**
 * CHALLENGE 00: Debounce Basics
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

function debounce(fn, delay) {
  var timeoutId;
  return function(...args) {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => fn.apply(this, args), delay);
  };
}

var log = debounce(function(msg) {
  console.log('Logged:', msg);
}, 100);

console.log('A: Start');

log('first');
log('second');
log('third');

console.log('B: After all calls');

setTimeout(function() {
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
 * │   function debounce(fn, delay) {                                            │
 * │     var timeoutId;              // Closure stores the timer ID              │
 * │                                                                             │
 * │     return function(...args) {                                              │
 * │       clearTimeout(timeoutId);  // CANCEL any pending execution             │
 * │       timeoutId = setTimeout(   // Schedule NEW execution                   │
 * │         () => fn.apply(this, args),                                         │
 * │         delay                                                               │
 * │       );                                                                    │
 * │     };                                                                      │
 * │   }                                                                         │
 * │                                                                             │
 * │   The magic: clearTimeout + setTimeout = reset timer on every call          │
 * │                                                                             │
 * └─────────────────────────────────────────────────────────────────────────────┘
 *
 *
 * ┌─────────────────────────────────────────────────────────────────────────────┐
 * │ INTERVIEW ANSWER                                                            │
 * ├─────────────────────────────────────────────────────────────────────────────┤
 * │                                                                             │
 * │ "Debouncing is a technique that delays function execution until after       │
 * │  a period of inactivity. Each new call resets the delay timer.              │
 * │                                                                             │
 * │  Implementation:                                                            │
 * │  function debounce(fn, delay) {                                             │
 * │    let timeoutId;                                                           │
 * │    return function(...args) {                                               │
 * │      clearTimeout(timeoutId);                                               │
 * │      timeoutId = setTimeout(() => fn.apply(this, args), delay);             │
 * │    };                                                                       │
 * │  }                                                                          │
 * │                                                                             │
 * │  Use cases:                                                                 │
 * │  - Search input autocomplete (wait until user stops typing)                 │
 * │  - Window resize handlers (wait until resize completes)                     │
 * │  - Form validation (wait until user finishes input)                         │
 * │  - Auto-save functionality (wait until user pauses editing)                 │
 * │                                                                             │
 * │  Key insight: Only the LAST call in a rapid sequence executes."             │
 * │                                                                             │
 * └─────────────────────────────────────────────────────────────────────────────┘
 *
 *
 * RUN: node docs/07-debounce-throttle-memoize/00-debounce-basics.js
 */
