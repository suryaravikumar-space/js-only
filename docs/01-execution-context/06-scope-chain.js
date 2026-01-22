/**
 * TOPIC: Scope Chain — How JavaScript Finds Variables
 *
 * CONCEPT:
 * When JS needs a variable, it searches the scope chain:
 *   1. Look in current scope
 *   2. If not found, look in parent scope
 *   3. Keep going up until global scope
 *   4. If not found anywhere → ReferenceError
 *
 * CRITICAL RULE:
 *   Inner → Outer: YES (can look UP the chain)
 *   Outer → Inner: NO  (cannot look DOWN into child scopes)
 *
 * VISUAL MODEL:
 *
 * ┌─────────────────────────────────┐
 * │ GLOBAL                          │
 * │   var a = 'global'              │
 * │                                 │
 * │  ┌───────────────────────────┐  │
 * │  │ outer()                   │  │
 * │  │   var b = 'outer'         │  │
 * │  │   can see: a, b           │  │
 * │  │                           │  │
 * │  │  ┌─────────────────────┐  │  │
 * │  │  │ inner()             │  │  │
 * │  │  │   var c = 'inner'   │  │  │
 * │  │  │   can see: a, b, c  │  │  │
 * │  │  └─────────────────────┘  │  │
 * │  │                           │  │
 * │  │   CANNOT see: c ❌        │  │
 * │  └───────────────────────────┘  │
 * └─────────────────────────────────┘
 */

var a = 'global';

function outer() {
  var b = 'outer';

  function inner() {
    var c = 'inner';
    console.log(a, b, c);  // ✓ can see all three
  }

  inner();
  console.log(a, b, c);    // ✗ c is not defined
}

outer();

/**
 * WHAT HAPPENS:
 *
 * 1. outer() is called
 * 2. b = 'outer' is assigned
 * 3. inner() is called
 * 4. c = 'inner' is assigned
 * 5. console.log(a, b, c) inside inner():
 *    - c → found in inner scope
 *    - b → not in inner, look up → found in outer scope
 *    - a → not in inner/outer, look up → found in global
 *    - prints: "global outer inner"
 * 6. inner() finishes, c is GONE (inner scope destroyed)
 * 7. console.log(a, b, c) inside outer():
 *    - a → found in global ✓
 *    - b → found in outer ✓
 *    - c → not in outer, not in global → ReferenceError
 *
 * OUTPUT:
 *   global outer inner
 *   ReferenceError: c is not defined
 *
 * ┌────────────────────────────────────────────────────────────────┐
 * │ WHY THIS MATTERS:                                              │
 * │                                                                │
 * │ This is the foundation for CLOSURES.                          │
 * │ Understanding scope chain = understanding closures.           │
 * │                                                                │
 * │ When inner() runs, it "remembers" its parent scopes.          │
 * │ This memory is what makes closures possible.                  │
 * └────────────────────────────────────────────────────────────────┘
 *
 * INTERVIEW TIP:
 * Scope chain is determined at DEFINITION time, not call time.
 * This is called "lexical scoping" — the physical location of
 * code in the file determines what variables are accessible.
 *
 * RUN: node docs/06-scope-chain.js
 */
