/**
 * TOPIC: Ultimate Closure Challenge
 *
 * ╔════════════════════════════════════════════════════════════════════════════╗
 * ║ THE FINAL TEST                                                             ║
 * ╠════════════════════════════════════════════════════════════════════════════╣
 * ║                                                                            ║
 * ║ This challenge combines ALL closure concepts:                              ║
 * ║   • Basic closure memory                                                   ║
 * ║   • Independent instances (factory pattern)                                ║
 * ║   • Nested closures with var self = this                                   ║
 * ║   • Private state                                                          ║
 * ║   • Losing this when extracting methods                                    ║
 * ║                                                                            ║
 * ╚════════════════════════════════════════════════════════════════════════════╝
 */

function createTracker(name) {
  let count = 0; // ES6: let (will be mutated)
  const history = []; // ES6: const (array ref stays same)

  return {
    name, // ES6: shorthand property

    track(event) { // ES6: shorthand method
      count++;
      history.push({ event, count }); // ES6: shorthand properties
      return `${this.name}: ${event} (#${count})`; // ES6: template literal
    },

    getHistory() { // ES6: shorthand method
      return [...history]; // ES6: spread operator (copy)
    },

    createLogger() { // ES6: shorthand method
      const self = this; // ES6: const (ES5 pattern to preserve this)
      return (msg) => { // ES6: arrow function
        return self.track(`LOG: ${msg}`); // ES6: template literal
      };
    }
  };
}

const tracker1 = createTracker('App'); // ES6: const
const tracker2 = createTracker('DB');

console.log('A:', tracker1.track('start'));
console.log('B:', tracker1.track('process'));
console.log('C:', tracker2.track('connect'));

const logger = tracker1.createLogger(); // ES6: const
console.log('D:', logger('user logged in'));

console.log('E:', tracker1.getHistory().length);
console.log('F:', tracker2.getHistory().length);

const trackMethod = tracker1.track; // ES6: const
try {
  console.log('G:', trackMethod('test'));
} catch (e) {
  console.log('G:', 'Error');
}

/**
 * OUTPUT:
 *   A: App: start (#1)
 *   B: App: process (#2)
 *   C: DB: connect (#1)
 *   D: App: LOG: user logged in (#3)
 *   E: 3
 *   F: 1
 *   G: undefined: test (#4)
 *
 *
 * ╔════════════════════════════════════════════════════════════════════════════╗
 * ║ STEP-BY-STEP BREAKDOWN                                                     ║
 * ╠════════════════════════════════════════════════════════════════════════════╣
 * ║                                                                            ║
 * ║ SETUP:                                                                     ║
 * ║   tracker1 = createTracker('App')                                          ║
 * ║     → Closure with: count=0, history=[], name='App'                        ║
 * ║                                                                            ║
 * ║   tracker2 = createTracker('DB')                                           ║
 * ║     → SEPARATE closure: count=0, history=[], name='DB'                     ║
 * ║                                                                            ║
 * ║                                                                            ║
 * ║ A: tracker1.track('start')                                                 ║
 * ║ ──────────────────────────                                                 ║
 * ║   • this = tracker1 (method call)                                          ║
 * ║   • this.name = 'App'                                                      ║
 * ║   • count++ → count = 1                                                    ║
 * ║   • history.push({event: 'start', count: 1})                               ║
 * ║   • Returns 'App: start (#1)'                                              ║
 * ║                                                                            ║
 * ║                                                                            ║
 * ║ B: tracker1.track('process')                                               ║
 * ║ ────────────────────────────                                               ║
 * ║   • Same tracker1 closure                                                  ║
 * ║   • count++ → count = 2                                                    ║
 * ║   • history now has 2 entries                                              ║
 * ║   • Returns 'App: process (#2)'                                            ║
 * ║                                                                            ║
 * ║                                                                            ║
 * ║ C: tracker2.track('connect')                                               ║
 * ║ ────────────────────────────                                               ║
 * ║   • DIFFERENT closure! tracker2 has its own count                          ║
 * ║   • count++ → count = 1 (starts from 0)                                    ║
 * ║   • this.name = 'DB'                                                       ║
 * ║   • Returns 'DB: connect (#1)'                                             ║
 * ║                                                                            ║
 * ║   KEY: Independent instances have separate closures!                       ║
 * ║                                                                            ║
 * ║                                                                            ║
 * ║ D: logger('user logged in')                                                ║
 * ║ ───────────────────────────                                                ║
 * ║   • logger = tracker1.createLogger()                                       ║
 * ║   • createLogger captured self = tracker1                                  ║
 * ║   • logger calls self.track('LOG: user logged in')                         ║
 * ║   • self.track uses tracker1's closure                                     ║
 * ║   • count++ → count = 3                                                    ║
 * ║   • Returns 'App: LOG: user logged in (#3)'                                ║
 * ║                                                                            ║
 * ║   KEY: var self = this preserves the correct this!                         ║
 * ║                                                                            ║
 * ║                                                                            ║
 * ║ E: tracker1.getHistory().length                                            ║
 * ║ ──────────────────────────────                                             ║
 * ║   • tracker1's history has 3 entries (start, process, LOG)                 ║
 * ║   • Returns 3                                                              ║
 * ║                                                                            ║
 * ║                                                                            ║
 * ║ F: tracker2.getHistory().length                                            ║
 * ║ ──────────────────────────────                                             ║
 * ║   • tracker2's history has only 1 entry (connect)                          ║
 * ║   • SEPARATE from tracker1!                                                ║
 * ║   • Returns 1                                                              ║
 * ║                                                                            ║
 * ║                                                                            ║
 * ║ G: trackMethod('test')                                                     ║
 * ║ ──────────────────────                                                     ║
 * ║   • trackMethod = tracker1.track (extracted method)                        ║
 * ║   • trackMethod('test') is STANDALONE call                                 ║
 * ║   • this = global object                                                   ║
 * ║   • global.name = undefined                                                ║
 * ║   • count++ → count = 4 (still uses tracker1's closure!)                   ║
 * ║   • Returns 'undefined: test (#4)'                                         ║
 * ║                                                                            ║
 * ║   KEY: Closure (count) preserved, but this is lost!                        ║
 * ║                                                                            ║
 * ╚════════════════════════════════════════════════════════════════════════════╝
 *
 *
 * ┌─────────────────────────────────────────────────────────────────────────────┐
 * │ VISUAL: The Complete Picture                                                │
 * ├─────────────────────────────────────────────────────────────────────────────┤
 * │                                                                             │
 * │   createTracker('App')                    createTracker('DB')               │
 * │   ┌────────────────────────────┐          ┌────────────────────────────┐    │
 * │   │  CLOSURE 1                 │          │  CLOSURE 2                 │    │
 * │   │                            │          │                            │    │
 * │   │  count = 4                 │          │  count = 1                 │    │
 * │   │  history = [3 items]       │          │  history = [1 item]        │    │
 * │   │         ↑                  │          │         ↑                  │    │
 * │   │  ┌──────────────────────┐  │          │  ┌──────────────────────┐  │    │
 * │   │  │ tracker1 object      │  │          │  │ tracker2 object      │  │    │
 * │   │  │                      │  │          │  │                      │  │    │
 * │   │  │ name: 'App'          │  │          │  │ name: 'DB'           │  │    │
 * │   │  │ track() ─────────────┼──┼──► count │  │ track() ─────────────┼──┼─►  │
 * │   │  │ getHistory() ────────┼──┼──► hist  │  │ getHistory() ────────┼──┼─►  │
 * │   │  │ createLogger() ──────┼──┘          │  │ createLogger() ──────┼──┘    │
 * │   │  │                      │             │  │                      │       │
 * │   │  └──────────────────────┘             │  └──────────────────────┘       │
 * │   └────────────────────────────┘          └────────────────────────────┘    │
 * │                                                                             │
 * │   logger (from createLogger):                                               │
 * │   ┌──────────────────────────────┐                                          │
 * │   │  Closure over:               │                                          │
 * │   │  self = tracker1 object ─────┼───► allows self.track() to work          │
 * │   │                              │                                          │
 * │   │  function(msg) {             │                                          │
 * │   │    return self.track(...)    │                                          │
 * │   │  }                           │                                          │
 * │   └──────────────────────────────┘                                          │
 * │                                                                             │
 * └─────────────────────────────────────────────────────────────────────────────┘
 *
 *
 * ┌─────────────────────────────────────────────────────────────────────────────┐
 * │ ALL CLOSURE CONCEPTS IN ONE CHALLENGE                                       │
 * ├─────────────────────────────────────────────────────────────────────────────┤
 * │                                                                             │
 * │ ┌────────────────────────┬──────────────────────────────────────────────┐   │
 * │ │ Concept                │ Where It Appears                             │   │
 * │ ├────────────────────────┼──────────────────────────────────────────────┤   │
 * │ │ Basic closure          │ count persists between track() calls         │   │
 * │ │ Private variables      │ count & history not accessible directly      │   │
 * │ │ Factory pattern        │ createTracker creates independent instances  │   │
 * │ │ var self = this        │ createLogger preserves this in closure       │   │
 * │ │ Losing this            │ trackMethod() loses this.name                │   │
 * │ │ Closure vs this        │ count works, but this.name doesn't           │   │
 * │ └────────────────────────┴──────────────────────────────────────────────┘   │
 * │                                                                             │
 * └─────────────────────────────────────────────────────────────────────────────┘
 *
 *
 * ┌─────────────────────────────────────────────────────────────────────────────┐
 * │ THE KEY INSIGHT: CLOSURE ≠ THIS                                             │
 * ├─────────────────────────────────────────────────────────────────────────────┤
 * │                                                                             │
 * │ When you extract a method:                                                  │
 * │                                                                             │
 * │   var trackMethod = tracker1.track;                                         │
 * │   trackMethod('test');                                                      │
 * │                                                                             │
 * │ ✓ CLOSURE IS PRESERVED:                                                     │
 * │   - count is still accessible (increments to 4)                             │
 * │   - history is still accessible (gets new entry)                            │
 * │                                                                             │
 * │ ✗ THIS IS LOST:                                                             │
 * │   - this.name becomes undefined                                             │
 * │   - Because trackMethod() is a standalone call                              │
 * │                                                                             │
 * │ This is why the result is 'undefined: test (#4)'                            │
 * │   - 'undefined' from this.name (this = global)                              │
 * │   - '#4' from count in closure (still tracker1's closure)                   │
 * │                                                                             │
 * └─────────────────────────────────────────────────────────────────────────────┘
 *
 *
 * INTERVIEW QUESTIONS:
 *
 * Q: "What's the difference between closures and `this`?"
 * A: Closures capture VARIABLES from the outer scope and keep them alive — `count`
 *    and `history` persist between calls and are private. `this` is NOT captured in
 *    closures — it's determined at call time. When you extract a method and call it
 *    standalone, `this` becomes global, but closure variables still work. That's why
 *    G prints `undefined: test (#4)` — `this.name` is lost but `count` increments.
 *
 * Q: "How does `var self = this` / `const self = this` solve the `this` problem?"
 * A: By storing `this` in a regular variable (`self`), it becomes part of the closure.
 *    The returned function accesses `self` via closure (which always points to the
 *    correct object), instead of relying on `this` which changes based on how
 *    the function is called. In ES6, arrow functions achieve the same thing more cleanly.
 *
 * Q: "Why do tracker1 and tracker2 not affect each other?"
 * A: Each call to `createTracker()` creates a NEW closure with its own `count` and
 *    `history` variables. They're completely independent — the factory pattern uses
 *    closures to create isolated instances, similar to how class constructors create
 *    separate object instances.
 *
 *
 * ╔════════════════════════════════════════════════════════════════════════════╗
 * ║ CLOSURES MASTERY CHECKLIST                                                  ║
 * ╠════════════════════════════════════════════════════════════════════════════╣
 * ║                                                                            ║
 * ║ ✓ Understand that closures capture REFERENCES, not values                  ║
 * ║ ✓ Know the loop closure problem and its fixes (let, IIFE)                  ║
 * ║ ✓ Use closures for private variables                                       ║
 * ║ ✓ Understand factory functions create independent closures                 ║
 * ║ ✓ Know partial application and currying patterns                           ║
 * ║ ✓ Understand closure memory implications                                   ║
 * ║ ✓ Know that this is NOT captured (use self or arrow functions)             ║
 * ║ ✓ Recognize when methods lose this but keep closure                        ║
 * ║                                                                            ║
 * ║ You're ready for closure questions in interviews!                          ║
 * ║                                                                            ║
 * ╚════════════════════════════════════════════════════════════════════════════╝
 *
 *
 * RUN: node docs/javascript/02-closures/10-ultimate-closure-challenge.js
 */
