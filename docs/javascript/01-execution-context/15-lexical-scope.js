/**
 * TOPIC: Lexical Scope vs Dynamic Scope
 *
 * CONCEPT:
 * JavaScript uses LEXICAL SCOPING (also called Static Scoping).
 *
 * THE GOLDEN RULE:
 * ╔════════════════════════════════════════════════════════════════╗
 * ║                                                                ║
 * ║  A function's scope is determined by WHERE it is DEFINED,     ║
 * ║  NOT where it is CALLED.                                      ║
 * ║                                                                ║
 * ╚════════════════════════════════════════════════════════════════╝
 *
 * This is one of the most important concepts in JavaScript.
 * It's the foundation of closures.
 */

var x = 10;

function outer() {
  var x = 20;
  inner();         // called from here, but...
}

function inner() {
  console.log(x);  // where does inner look for x?
}

outer();

/**
 * OUTPUT: 10
 *
 * NOT 20!
 *
 *
 * ╔════════════════════════════════════════════════════════════════╗
 * ║ WHY IS THE ANSWER 10, NOT 20?                                 ║
 * ╠════════════════════════════════════════════════════════════════╣
 * ║                                                                ║
 * ║ Look at WHERE inner() is DEFINED:                             ║
 * ║                                                                ║
 * ║   var x = 10;                                                 ║
 * ║                                                                ║
 * ║   function outer() { ... }  ← defined at global level         ║
 * ║   function inner() { ... }  ← defined at global level (SAME!) ║
 * ║                                                                ║
 * ║ inner() is NOT defined inside outer().                        ║
 * ║ inner() is defined at the SAME level as outer() (global).     ║
 * ║                                                                ║
 * ║ So inner()'s PARENT SCOPE is the GLOBAL scope.                ║
 * ║ NOT outer()'s scope.                                          ║
 * ║                                                                ║
 * ╚════════════════════════════════════════════════════════════════╝
 *
 *
 * ┌────────────────────────────────────────────────────────────────┐
 * │ STEP-BY-STEP: HOW inner() FINDS x                             │
 * ├────────────────────────────────────────────────────────────────┤
 * │                                                                │
 * │ 1. inner() runs console.log(x)                                │
 * │                                                                │
 * │ 2. JavaScript asks: "What is x?"                              │
 * │                                                                │
 * │ 3. Look in inner()'s OWN scope                                │
 * │    → No x declared inside inner()                             │
 * │    → Not found                                                │
 * │                                                                │
 * │ 4. Look in inner()'s PARENT scope                             │
 * │    → Parent = where inner was DEFINED = GLOBAL scope          │
 * │    → Found! x = 10                                            │
 * │                                                                │
 * │ 5. Print: 10                                                  │
 * │                                                                │
 * │ NOTE: outer()'s scope is NEVER searched!                      │
 * │       Because outer() is not inner()'s parent.                │
 * │       outer() just CALLED inner(), that's all.                │
 * │                                                                │
 * └────────────────────────────────────────────────────────────────┘
 *
 *
 * ┌────────────────────────────────────────────────────────────────┐
 * │ VISUAL: SCOPE CHAIN BASED ON DEFINITION                       │
 * ├────────────────────────────────────────────────────────────────┤
 * │                                                                │
 * │ ┌─────────────────────────────────────────────────────────┐   │
 * │ │ GLOBAL SCOPE                                            │   │
 * │ │                                                         │   │
 * │ │   var x = 10   ←── inner() finds this                   │   │
 * │ │                                                         │   │
 * │ │   ┌─────────────────────┐  ┌─────────────────────┐     │   │
 * │ │   │ function outer()    │  │ function inner()    │     │   │
 * │ │   │   var x = 20        │  │   console.log(x)    │     │   │
 * │ │   │   inner()  ─────────┼──│──→ looks in GLOBAL  │     │   │
 * │ │   │                     │  │      not in outer   │     │   │
 * │ │   └─────────────────────┘  └─────────────────────┘     │   │
 * │ │                                                         │   │
 * │ │   outer() and inner() are SIBLINGS (same parent)        │   │
 * │ │   They can't see each other's local variables           │   │
 * │ │                                                         │   │
 * │ └─────────────────────────────────────────────────────────┘   │
 * │                                                                │
 * └────────────────────────────────────────────────────────────────┘
 *
 *
 * ┌────────────────────────────────────────────────────────────────┐
 * │ LEXICAL SCOPE vs DYNAMIC SCOPE                                │
 * ├────────────────────────────────────────────────────────────────┤
 * │                                                                │
 * │ LEXICAL SCOPE (JavaScript, Python, C, Java, most languages):  │
 * │   - Scope determined by WHERE function is WRITTEN in code     │
 * │   - Also called "static scope"                                │
 * │   - Predictable — you can see it by reading the code          │
 * │                                                                │
 * │ DYNAMIC SCOPE (Bash, some Lisps):                             │
 * │   - Scope determined by WHERE function is CALLED              │
 * │   - Less predictable — depends on runtime call chain          │
 * │                                                                │
 * │ ┌─────────────────────┬─────────────────────┐                 │
 * │ │ Lexical (JS)        │ Dynamic             │                 │
 * │ ├─────────────────────┼─────────────────────┤                 │
 * │ │ WHERE defined       │ WHERE called        │                 │
 * │ │ inner() → global    │ inner() → outer()   │                 │
 * │ │ x = 10              │ x = 20              │                 │
 * │ └─────────────────────┴─────────────────────┘                 │
 * │                                                                │
 * │ If JavaScript used dynamic scope, the answer would be 20.     │
 * │ But JavaScript uses lexical scope, so the answer is 10.       │
 * │                                                                │
 * └────────────────────────────────────────────────────────────────┘
 *
 *
 * ┌────────────────────────────────────────────────────────────────┐
 * │ COMMON CONFUSION                                              │
 * ├────────────────────────────────────────────────────────────────┤
 * │                                                                │
 * │ WRONG THINKING:                                               │
 * │ "inner() is called from outer(), so inner() can see           │
 * │  outer()'s variables"                                         │
 * │                                                                │
 * │ CORRECT THINKING:                                             │
 * │ "inner() is DEFINED at global level, so inner()'s parent      │
 * │  scope is global. It doesn't matter where it's called from."  │
 * │                                                                │
 * │ REMEMBER:                                                     │
 * │   - DEFINED where? → determines scope chain                   │
 * │   - CALLED where? → doesn't affect scope chain                │
 * │                                                                │
 * └────────────────────────────────────────────────────────────────┘
 *
 *
 * ┌────────────────────────────────────────────────────────────────┐
 * │ WHAT IF inner() WAS DEFINED INSIDE outer()?                   │
 * ├────────────────────────────────────────────────────────────────┤
 * │                                                                │
 * │ var x = 10;                                                   │
 * │                                                                │
 * │ function outer() {                                            │
 * │   var x = 20;                                                 │
 * │                                                                │
 * │   function inner() {    // NOW defined INSIDE outer           │
 * │     console.log(x);                                           │
 * │   }                                                           │
 * │                                                                │
 * │   inner();                                                    │
 * │ }                                                             │
 * │                                                                │
 * │ outer();  // Now prints: 20                                   │
 * │                                                                │
 * │ Because inner()'s parent scope is now outer(),                │
 * │ where x = 20.                                                 │
 * │                                                                │
 * └────────────────────────────────────────────────────────────────┘
 *
 *
 * ┌────────────────────────────────────────────────────────────────┐
 * │ WHY THIS MATTERS                                              │
 * ├────────────────────────────────────────────────────────────────┤
 * │                                                                │
 * │ Lexical scoping is the foundation of CLOSURES.                │
 * │                                                                │
 * │ A closure is a function that "remembers" its lexical scope    │
 * │ even when executed outside that scope.                        │
 * │                                                                │
 * │ If you understand lexical scope, you understand closures.     │
 * │                                                                │
 * └────────────────────────────────────────────────────────────────┘
 *
 *
 * INTERVIEW QUESTIONS:
 *
 * Q: "What is lexical scope in JavaScript?"
 * A: JavaScript uses lexical scoping, which means a function's scope is
 *    determined by where it's DEFINED in the source code, not where it's
 *    called. In this example, inner() is defined at the global level, so
 *    its parent scope is global where x = 10. Even though inner() is called
 *    from outer() where x = 20, it still looks up to global and finds 10.
 *    This is different from dynamic scoping where the call location would matter.
 *
 *
 * ES6 NOTE: With ES6, use `let` and `const` instead of `var` for block scoping.
 *           Arrow functions also follow lexical scoping for `this` binding.
 *
 * RUN: node docs/javascript/01-execution-context/15-lexical-scope.js
 */
