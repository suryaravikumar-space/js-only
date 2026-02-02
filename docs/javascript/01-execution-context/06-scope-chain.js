/**
 * TOPIC: Scope Chain — How JavaScript Finds Variables
 *
 * STORY:
 * Think of scope like floors in a building. You're on the 3rd floor (inner
 * function) and need a pen. You check your desk first. Not there? Take the
 * elevator DOWN to the 2nd floor (outer function). Still not there? Go to
 * the lobby (global scope). If nobody has a pen, you get an error.
 * You can always go DOWN to lower floors, but people on lower floors
 * can NEVER come up to YOUR floor to see your stuff.
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
 * INTERVIEW QUESTIONS:
 *
 * Q: "What is the scope chain in JavaScript?"
 * A: The scope chain is the mechanism JS uses to resolve variable references.
 *    When a variable is accessed, JS looks in the current scope first, then
 *    follows the chain to parent scopes (lexical environments) up to global.
 *    If the variable isn't found anywhere, it throws a ReferenceError.
 *
 * Q: "What is lexical scoping?"
 * A: Lexical scoping means the scope chain is determined by WHERE the code
 *    is physically written (at definition time), NOT where it is called from.
 *    A function defined inside another function will always have access to
 *    its parent's variables, regardless of where or when it's invoked.
 *    This is also called "static scoping" and is the foundation for closures.
 *
 * Q: "What's the difference between lexical scope and dynamic scope?"
 * A: JS uses lexical scope — variables are resolved based on where functions
 *    are defined in the source code. Dynamic scope (used by some other
 *    languages) resolves variables based on the call stack at runtime.
 *    In JS, the only thing that works like dynamic scope is `this`.
 *
 * ES6 NOTE:
 * With `let`/`const`, each block `{}` creates its own scope. With `var`,
 * only functions create new scopes. Using `let`/`const` gives you finer
 * control over scope chains.
 *
 * RUN: node docs/javascript/01-execution-context/06-scope-chain.js
 */
