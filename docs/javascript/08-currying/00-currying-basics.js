/**
 * TOPIC: Currying Basics
 *
 * STORY: Imagine a pizza ordering system. Instead of giving all details at once
 * (size, crust, topping), you go through stations: first pick size, then crust,
 * then topping. Each station remembers your previous choices. That is currying --
 * breaking a multi-argument function into a chain of single-argument functions,
 * each remembering what came before via closures.
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
const add = (a, b, c) => a + b + c; // ES6: arrow function

console.log('A:', add(1, 2, 3));

// Curried version - manual
const curriedAdd = (a) => (b) => (c) => a + b + c; // ES6: arrow function currying

console.log('B:', curriedAdd(1)(2)(3));

// Partial application with currying
const add1 = curriedAdd(1); // ES6: const
const add1and2 = add1(2); // ES6: const
console.log('C:', add1and2(3));

// Arrow function currying
const curriedMultiply = a => b => c => a * b * c; // ES6: const
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
 * │ INTERVIEW QUESTIONS:                                                        │
 * ├─────────────────────────────────────────────────────────────────────────────┤
 * │                                                                             │
 * │ Q1: What is currying in JavaScript?                                         │
 * │ A1: Currying is a technique that transforms a function with multiple        │
 * │     arguments into a sequence of functions, each taking a single argument.  │
 * │     For example: f(a, b, c) becomes f(a)(b)(c). It uses closures to         │
 * │     remember previously passed arguments. Each function call returns a new  │
 * │     function that 'closes over' the argument, until all arguments are       │
 * │     collected.                                                              │
 * │                                                                             │
 * │ Q2: What are the benefits of currying?                                      │
 * │ A2: Benefits include: enabling partial application (pre-filling some        │
 * │     arguments), making function composition easier, creating reusable       │
 * │     specialized functions, and it is common in functional programming and   │
 * │     libraries like Ramda.                                                   │
 * │                                                                             │
 * │ Q3: How does currying relate to closures?                                   │
 * │ A3: Each function in the curried chain closes over the arguments passed     │
 * │     to previous functions. When you call curriedAdd(1), the returned        │
 * │     function remembers a=1 via closure. This continues until all arguments  │
 * │     are collected and the final computation executes.                       │
 * │                                                                             │
 * └─────────────────────────────────────────────────────────────────────────────┘
 *
 *
 * RUN: node docs/javascript/08-currying/00-currying-basics.js
 */
