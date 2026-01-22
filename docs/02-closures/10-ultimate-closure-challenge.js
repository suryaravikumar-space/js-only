/**
 * CHALLENGE 10: Ultimate Closure Challenge
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
  var count = 0;
  var history = [];

  return {
    name: name,

    track: function(event) {
      count++;
      history.push({ event: event, count: count });
      return this.name + ': ' + event + ' (#' + count + ')';
    },

    getHistory: function() {
      return history.slice();
    },

    createLogger: function() {
      var self = this;
      return function(msg) {
        return self.track('LOG: ' + msg);
      };
    }
  };
}

var tracker1 = createTracker('App');
var tracker2 = createTracker('DB');

console.log('A:', tracker1.track('start'));
console.log('B:', tracker1.track('process'));
console.log('C:', tracker2.track('connect'));

var logger = tracker1.createLogger();
console.log('D:', logger('user logged in'));

console.log('E:', tracker1.getHistory().length);
console.log('F:', tracker2.getHistory().length);

var trackMethod = tracker1.track;
try {
  console.log('G:', trackMethod('test'));
} catch(e) {
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
 * ┌─────────────────────────────────────────────────────────────────────────────┐
 * │ INTERVIEW ANSWER                                                            │
 * ├─────────────────────────────────────────────────────────────────────────────┤
 * │                                                                             │
 * │ "This challenge demonstrates the key difference between closures and this:  │
 * │                                                                             │
 * │  Closures capture VARIABLES from the outer scope and keep them alive.       │
 * │  In the tracker, count and history are in the closure - they persist        │
 * │  between calls and are private (can't access tracker1.count).               │
 * │                                                                             │
 * │  this is NOT captured in closures - it's determined at call time.           │
 * │  When we extract trackMethod and call it standalone, this becomes global,   │
 * │  but the closure variables (count, history) still work.                     │
 * │                                                                             │
 * │  The createLogger method shows how to preserve this using var self = this.  │
 * │  By storing this in a regular variable, it becomes part of the closure      │
 * │  and works correctly when the returned function is called later.            │
 * │                                                                             │
 * │  The factory pattern (createTracker) creates independent instances.         │
 * │  tracker1 and tracker2 have completely separate closures with their         │
 * │  own count and history - operations on one don't affect the other."         │
 * │                                                                             │
 * └─────────────────────────────────────────────────────────────────────────────┘
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
 * RUN: node docs/02-closures/10-ultimate-closure-challenge.js
 */
