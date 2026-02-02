/**
 * TOPIC: What is a Closure?
 *
 * STORY: THE BACKPACK
 * Imagine a function is a person leaving a room. Normally, when you leave a room,
 * you can't access anything inside it anymore. But closures are like carrying a
 * backpack — before leaving, you pack the variables you need. Wherever you go,
 * you still have access to those variables in your backpack. The room (outer
 * function) is gone, but the backpack (closure) keeps the variables alive.
 *
 * ╔════════════════════════════════════════════════════════════════════════════╗
 * ║ THE GOLDEN RULE                                                            ║
 * ╠════════════════════════════════════════════════════════════════════════════╣
 * ║                                                                            ║
 * ║ A CLOSURE is a function that REMEMBERS the variables from its              ║
 * ║ lexical scope even when executed OUTSIDE that scope.                       ║
 * ║                                                                            ║
 * ║   function outer() {                                                       ║
 * ║     var x = 10;              // x is in outer's scope                      ║
 * ║     return function inner() {                                              ║
 * ║       return x;              // inner "closes over" x                      ║
 * ║     };                                                                     ║
 * ║   }                                                                        ║
 * ║                                                                            ║
 * ║   var fn = outer();          // outer() finishes, but...                   ║
 * ║   fn();                      // inner still remembers x! Returns 10        ║
 * ║                                                                            ║
 * ╚════════════════════════════════════════════════════════════════════════════╝
 */

function outer() {
  const secret = 'I am hidden'; // ES6: const instead of var

  function inner() {
    return secret;
  }

  return inner;
}

const getSecret = outer(); // ES6: const instead of var

console.log('A:', getSecret());
console.log('B:', typeof secret);

/**
 * OUTPUT:
 *   A: I am hidden
 *   B: undefined
 *
 *
 * ╔════════════════════════════════════════════════════════════════════════════╗
 * ║ STEP-BY-STEP BREAKDOWN                                                     ║
 * ╠════════════════════════════════════════════════════════════════════════════╣
 * ║                                                                            ║
 * ║ SETUP:                                                                     ║
 * ║   1. outer() is called                                                     ║
 * ║   2. var secret = 'I am hidden' (local to outer)                           ║
 * ║   3. inner function is DEFINED (it can see secret)                         ║
 * ║   4. inner is RETURNED (not called!)                                       ║
 * ║   5. outer() finishes execution                                            ║
 * ║   6. getSecret now holds the inner function                                ║
 * ║                                                                            ║
 * ║                                                                            ║
 * ║ A: getSecret()                                                             ║
 * ║ ──────────────                                                             ║
 * ║   • getSecret IS the inner function                                        ║
 * ║   • It still has access to secret (closure!)                               ║
 * ║   • Returns 'I am hidden'                                                  ║
 * ║                                                                            ║
 * ║   WHY DOES THIS WORK?                                                      ║
 * ║   When inner was CREATED, it captured a reference to its                   ║
 * ║   lexical environment (outer's scope). This reference is                   ║
 * ║   kept alive as long as inner exists.                                      ║
 * ║                                                                            ║
 * ║                                                                            ║
 * ║ B: typeof secret                                                           ║
 * ║ ────────────────                                                           ║
 * ║   • secret is NOT in global scope                                          ║
 * ║   • It was declared inside outer()                                         ║
 * ║   • From outside, secret doesn't exist                                     ║
 * ║   • typeof returns 'undefined' for undeclared variables                    ║
 * ║                                                                            ║
 * ║   THE MAGIC:                                                               ║
 * ║   secret is PRIVATE to outer, but inner can still access it                ║
 * ║   through the closure. This is how JavaScript does encapsulation!          ║
 * ║                                                                            ║
 * ╚════════════════════════════════════════════════════════════════════════════╝
 *
 *
 * ┌─────────────────────────────────────────────────────────────────────────────┐
 * │ VISUAL: How Closures Work                                                   │
 * ├─────────────────────────────────────────────────────────────────────────────┤
 * │                                                                             │
 * │   BEFORE outer() returns:                                                   │
 * │   ┌─────────────────────────────────────────────────────────────┐           │
 * │   │  outer's scope                                              │           │
 * │   │                                                             │           │
 * │   │  var secret = 'I am hidden'                                 │           │
 * │   │                      ↑                                      │           │
 * │   │  function inner() { return secret; } ──── references ───────┘           │
 * │   │                                                             │           │
 * │   └─────────────────────────────────────────────────────────────┘           │
 * │                                                                             │
 * │   AFTER outer() returns:                                                    │
 * │   ┌─────────────────────────────────────────────────────────────┐           │
 * │   │  outer's scope (kept alive by closure!)                     │           │
 * │   │                                                             │           │
 * │   │  var secret = 'I am hidden' ◄────────────────────┐          │           │
 * │   │                                                   │          │           │
 * │   └─────────────────────────────────────────────────────────────┘           │
 * │                                                       │                     │
 * │   ┌─────────────────────────────────────────────────────────────┐           │
 * │   │  Global scope                                               │           │
 * │   │                                                             │           │
 * │   │  var getSecret = [inner function] ────── still references ──┘           │
 * │   │                                                             │           │
 * │   └─────────────────────────────────────────────────────────────┘           │
 * │                                                                             │
 * │   The closure KEEPS outer's scope alive!                                    │
 * │                                                                             │
 * └─────────────────────────────────────────────────────────────────────────────┘
 *
 *
 * ┌─────────────────────────────────────────────────────────────────────────────┐
 * │ COMMON MISCONCEPTION                                                        │
 * ├─────────────────────────────────────────────────────────────────────────────┤
 * │                                                                             │
 * │ WRONG: "Closures copy the values"                                           │
 * │                                                                             │
 * │   function counter() {                                                      │
 * │     var count = 0;                                                          │
 * │     return function() {                                                     │
 * │       return ++count;  // If it copied, count would always be 1!            │
 * │     };                                                                      │
 * │   }                                                                         │
 * │   var inc = counter();                                                      │
 * │   inc(); // 1                                                               │
 * │   inc(); // 2 ← PROOF that it's a reference, not a copy!                    │
 * │   inc(); // 3                                                               │
 * │                                                                             │
 * │                                                                             │
 * │ RIGHT: "Closures keep a REFERENCE to the variables"                         │
 * │                                                                             │
 * │   This distinction is CRITICAL for understanding:                           │
 * │   - Loop closures (Challenge 02)                                            │
 * │   - Mutable state patterns                                                  │
 * │   - Memory management                                                       │
 * │                                                                             │
 * └─────────────────────────────────────────────────────────────────────────────┘
 *
 *
 * ┌─────────────────────────────────────────────────────────────────────────────┐
 * │ WHY CLOSURES MATTER                                                         │
 * ├─────────────────────────────────────────────────────────────────────────────┤
 * │                                                                             │
 * │ 1. DATA PRIVACY                                                             │
 * │    Variables in closure are truly private                                   │
 * │    Can't be accessed or modified from outside                               │
 * │                                                                             │
 * │ 2. STATE PERSISTENCE                                                        │
 * │    Functions can "remember" data between calls                              │
 * │    (counters, caches, configuration)                                        │
 * │                                                                             │
 * │ 3. FUNCTION FACTORIES                                                       │
 * │    Create specialized functions from templates                              │
 * │    (partial application, currying)                                          │
 * │                                                                             │
 * │ 4. MODULE PATTERN                                                           │
 * │    Encapsulation without classes                                            │
 * │    Public API with private implementation                                   │
 * │                                                                             │
 * │ 5. CALLBACKS & ASYNC                                                        │
 * │    Event handlers remember their context                                    │
 * │    setTimeout callbacks retain variables                                    │
 * │                                                                             │
 * └─────────────────────────────────────────────────────────────────────────────┘
 *
 *
 * INTERVIEW QUESTIONS:
 *
 * Q: "What is a closure in JavaScript?"
 * A: A closure is a function combined with its lexical environment — the variables
 *    from its outer scope that it "closes over." Even after the outer function
 *    returns, the inner function retains access to those variables. The scope is
 *    kept alive as long as the inner function exists.
 *
 * Q: "Do closures capture values or references?"
 * A: References, not values. If the outer variable changes, the closure sees the
 *    new value. This is why closures in loops can be tricky — all iterations share
 *    the same variable. Using `let` (ES6) in loops fixes this because `let` creates
 *    a new binding per iteration.
 *
 * Q: "What are practical use cases for closures?"
 * A: Data privacy (private variables), state persistence (counters, caches),
 *    function factories (partial application, currying), the module pattern
 *    (encapsulation without classes), and callbacks/async (event handlers and
 *    setTimeout retaining context).
 *
 *
 * RUN: node docs/javascript/02-closures/00-what-is-closure.js
 */
