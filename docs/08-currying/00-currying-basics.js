/**
 * CHALLENGE 00: Currying Basics
 *
 * ╔════════════════════════════════════════════════════════════════════════════╗
 * ║ THE GOLDEN RULE                                                            ║
 * ╠════════════════════════════════════════════════════════════════════════════╣
 * ║                                                                            ║
 * ║ Currying transforms a function with multiple arguments into a sequence     ║
 * ║ of functions, each taking a single argument.                               ║
 * ║                                                                            ║
 * ║   f(a, b, c)  →  f(a)(b)(c)                                                ║
 * ║                                                                            ║
 * ║ Named after mathematician Haskell Curry.                                   ║
 * ║ Enables partial application and function composition.                      ║
 * ║                                                                            ║
 * ╚════════════════════════════════════════════════════════════════════════════╝
 */

// Regular function
function add(a, b, c) {
  return a + b + c;
}

console.log('A:', add(1, 2, 3));

// Curried version - manual
function curriedAdd(a) {
  return function(b) {
    return function(c) {
      return a + b + c;
    };
  };
}

console.log('B:', curriedAdd(1)(2)(3));

// Partial application with currying
var add1 = curriedAdd(1);
var add1and2 = add1(2);
console.log('C:', add1and2(3));

// Arrow function currying
var curriedMultiply = a => b => c => a * b * c;
console.log('D:', curriedMultiply(2)(3)(4));

/**
 * OUTPUT:
 *   A: 6
 *   B: 6
 *   C: 6
 *   D: 24
 *
 *
 * ╔════════════════════════════════════════════════════════════════════════════╗
 * ║ STEP-BY-STEP BREAKDOWN                                                     ║
 * ╠════════════════════════════════════════════════════════════════════════════╣
 * ║                                                                            ║
 * ║ B: curriedAdd(1)(2)(3)                                                     ║
 * ║ ──────────────────────                                                     ║
 * ║   Step 1: curriedAdd(1)                                                    ║
 * ║           Returns function(b) with a=1 in closure                          ║
 * ║                                                                            ║
 * ║   Step 2: curriedAdd(1)(2) = function(b){...}(2)                           ║
 * ║           Returns function(c) with a=1, b=2 in closure                     ║
 * ║                                                                            ║
 * ║   Step 3: curriedAdd(1)(2)(3) = function(c){...}(3)                        ║
 * ║           Returns 1 + 2 + 3 = 6                                            ║
 * ║                                                                            ║
 * ║                                                                            ║
 * ║ C: Partial application demonstration                                       ║
 * ║ ────────────────────────────────────                                       ║
 * ║   add1 = curriedAdd(1)        // function waiting for b, c                 ║
 * ║   add1and2 = add1(2)          // function waiting for c                    ║
 * ║   add1and2(3)                 // 1 + 2 + 3 = 6                             ║
 * ║                                                                            ║
 * ║   This shows how currying enables partial application!                     ║
 * ║                                                                            ║
 * ╚════════════════════════════════════════════════════════════════════════════╝
 *
 *
 * ┌─────────────────────────────────────────────────────────────────────────────┐
 * │ VISUAL: HOW CURRYING WORKS                                                  │
 * ├─────────────────────────────────────────────────────────────────────────────┤
 * │                                                                             │
 * │   Regular:    add(1, 2, 3)  ──────────────────────────────>  6              │
 * │                                                                             │
 * │   Curried:    curriedAdd(1)  ──>  fn(b)  ──>  fn(c)  ──>  6                │
 * │                    │               │           │                            │
 * │                   (2)             (3)          │                            │
 * │                    │               │           │                            │
 * │                    └───────────────┴───────────┘                            │
 * │                                                                             │
 * │   Each call returns a new function until all args received                  │
 * │                                                                             │
 * └─────────────────────────────────────────────────────────────────────────────┘
 *
 *
 * ┌─────────────────────────────────────────────────────────────────────────────┐
 * │ ARROW FUNCTION SYNTAX                                                       │
 * ├─────────────────────────────────────────────────────────────────────────────┤
 * │                                                                             │
 * │   // Traditional syntax (verbose)                                           │
 * │   function curriedAdd(a) {                                                  │
 * │     return function(b) {                                                    │
 * │       return function(c) {                                                  │
 * │         return a + b + c;                                                   │
 * │       };                                                                    │
 * │     };                                                                      │
 * │   }                                                                         │
 * │                                                                             │
 * │   // Arrow syntax (concise)                                                 │
 * │   const curriedAdd = a => b => c => a + b + c;                              │
 * │                                                                             │
 * │   // Both are equivalent!                                                   │
 * │   // Arrow syntax is preferred for curried functions                        │
 * │                                                                             │
 * └─────────────────────────────────────────────────────────────────────────────┘
 *
 *
 * ┌─────────────────────────────────────────────────────────────────────────────┐
 * │ INTERVIEW ANSWER                                                            │
 * ├─────────────────────────────────────────────────────────────────────────────┤
 * │                                                                             │
 * │ "Currying is a technique that transforms a function with multiple           │
 * │  arguments into a sequence of functions, each taking a single argument.     │
 * │                                                                             │
 * │  For example: f(a, b, c) becomes f(a)(b)(c)                                 │
 * │                                                                             │
 * │  It uses closures to remember previously passed arguments.                  │
 * │  Each function call returns a new function that 'closes over' the           │
 * │  argument, until all arguments are collected.                               │
 * │                                                                             │
 * │  Benefits:                                                                  │
 * │  - Enables partial application (pre-filling some arguments)                 │
 * │  - Makes function composition easier                                        │
 * │  - Creates reusable, specialized functions                                  │
 * │  - Common in functional programming and libraries like Ramda"               │
 * │                                                                             │
 * └─────────────────────────────────────────────────────────────────────────────┘
 *
 *
 * RUN: node docs/06-currying/00-currying-basics.js
 */
