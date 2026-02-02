/**
 * CHALLENGE 01: Leading Edge Debounce
 *
 * ╔════════════════════════════════════════════════════════════════════════════╗
 * ║ THE GOLDEN RULE                                                            ║
 * ╠════════════════════════════════════════════════════════════════════════════╣
 * ║                                                                            ║
 * ║ Leading edge debounce executes IMMEDIATELY on the FIRST call,              ║
 * ║ then ignores subsequent calls until a pause occurs.                        ║
 * ║                                                                            ║
 * ║   Regular debounce:  Waits, then fires at the END                          ║
 * ║   Leading debounce:  Fires at the START, then waits                        ║
 * ║                                                                            ║
 * ║ Think: Button click - respond immediately, prevent double-clicks!          ║
 * ║                                                                            ║
 * ╚════════════════════════════════════════════════════════════════════════════╝
 */

function debounceLeading(fn, delay) {
  var timeoutId;
  return function(...args) {
    var shouldCall = !timeoutId;
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => {
      timeoutId = null;
    }, delay);
    if (shouldCall) {
      fn.apply(this, args);
    }
  };
}

var log = debounceLeading(function(msg) {
  console.log('Logged:', msg);
}, 100);

console.log('A: Start');

log('first');
log('second');
log('third');

console.log('B: After all calls');

setTimeout(function() {
  log('fourth');
  console.log('C: After 150ms');
}, 150);

/**
 * OUTPUT:
 *   A: Start
 *   Logged: first
 *   B: After all calls
 *   Logged: fourth
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
 * ║   0ms: log('first')                    → timeoutId is null, so EXECUTES!   ║
 * ║                                          Sets timer to clear timeoutId     ║
 * ║   0ms: log('second')                   → timeoutId exists, SKIPPED         ║
 * ║   0ms: log('third')                    → timeoutId exists, SKIPPED         ║
 * ║   0ms: console.log('B: After...')      → Prints "B: After all calls"       ║
 * ║                                                                            ║
 * ║   100ms: Timer clears timeoutId        → Ready for new leading call        ║
 * ║                                                                            ║
 * ║   150ms: log('fourth')                 → timeoutId is null, EXECUTES!      ║
 * ║   150ms: console.log('C:...')          → Prints "C: After 150ms"           ║
 * ║                                                                            ║
 * ║ Key insight: FIRST call in each burst executes immediately!                ║
 * ║                                                                            ║
 * ╚════════════════════════════════════════════════════════════════════════════╝
 *
 *
 * ┌─────────────────────────────────────────────────────────────────────────────┐
 * │ TIMING DIAGRAM: LEADING VS TRAILING                                         │
 * ├─────────────────────────────────────────────────────────────────────────────┤
 * │                                                                             │
 * │   Time:    0ms      50ms     100ms    150ms    200ms                        │
 * │            │         │         │        │        │                          │
 * │   Calls:   ▼▼▼       │         │        ▼        │                          │
 * │            │         │         │        │        │                          │
 * │                                                                             │
 * │   TRAILING (regular debounce):                                              │
 * │   first    ├─ ✗ cancelled      │        │        │                          │
 * │   second   ├─ ✗ cancelled      │        │        │                          │
 * │   third    ├─────────────────► ●        │        │                          │
 * │   fourth   │         │         │        ├──────► ●                          │
 * │                                                                             │
 * │   LEADING (this example):                                                   │
 * │   first    ● (immediate!)      │        │        │                          │
 * │   second   ✗ ignored           │        │        │                          │
 * │   third    ✗ ignored           │        │        │                          │
 * │   fourth   │         │         │        ● (immediate!)                      │
 * │                                                                             │
 * │   Legend: ▼ = call, ✗ = skipped, ● = executes                              │
 * │                                                                             │
 * └─────────────────────────────────────────────────────────────────────────────┘
 *
 *
 * ┌─────────────────────────────────────────────────────────────────────────────┐
 * │ LEADING DEBOUNCE IMPLEMENTATION                                             │
 * ├─────────────────────────────────────────────────────────────────────────────┤
 * │                                                                             │
 * │   function debounceLeading(fn, delay) {                                     │
 * │     var timeoutId;                                                          │
 * │                                                                             │
 * │     return function(...args) {                                              │
 * │       var shouldCall = !timeoutId;  // True only if no pending timeout      │
 * │                                                                             │
 * │       clearTimeout(timeoutId);                                              │
 * │       timeoutId = setTimeout(() => {                                        │
 * │         timeoutId = null;           // Reset for next leading call          │
 * │       }, delay);                                                            │
 * │                                                                             │
 * │       if (shouldCall) {                                                     │
 * │         fn.apply(this, args);       // Execute IMMEDIATELY                  │
 * │       }                                                                     │
 * │     };                                                                      │
 * │   }                                                                         │
 * │                                                                             │
 * │   Key: Check timeoutId BEFORE setting it to decide if we should call        │
 * │                                                                             │
 * └─────────────────────────────────────────────────────────────────────────────┘
 *
 *
 * ┌─────────────────────────────────────────────────────────────────────────────┐
 * │ INTERVIEW ANSWER                                                            │
 * ├─────────────────────────────────────────────────────────────────────────────┤
 * │                                                                             │
 * │ "Leading edge debounce executes the function immediately on the first       │
 * │  call, then blocks subsequent calls until a quiet period passes.            │
 * │                                                                             │
 * │  Regular debounce: waits, then fires (trailing edge)                        │
 * │  Leading debounce: fires, then waits (leading edge)                         │
 * │                                                                             │
 * │  Implementation difference:                                                 │
 * │  - Check if timer exists BEFORE setting it                                  │
 * │  - If no timer, execute immediately                                         │
 * │  - Timer's job is to reset the 'can execute' flag, not call the function    │
 * │                                                                             │
 * │  Use cases:                                                                 │
 * │  - Button clicks (respond immediately, prevent double-clicks)               │
 * │  - Form submissions (submit once, ignore rapid re-clicks)                   │
 * │  - Any action where immediate feedback is important                         │
 * │                                                                             │
 * │  Many debounce libraries support { leading: true, trailing: false }."       │
 * │                                                                             │
 * └─────────────────────────────────────────────────────────────────────────────┘
 *
 *
 * RUN: node docs/07-debounce-throttle-memoize/01-debounce-leading.js
 */
