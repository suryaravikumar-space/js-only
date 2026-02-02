/**
 * TOPIC: Generic Curry Helper
 *
 * STORY: Think of a curry helper like a smart waiter at a restaurant. You can
 * give your entire order at once ("burger, fries, and a drink"), or piece by piece
 * ("burger first... now fries... now a drink"). The waiter remembers what you have
 * ordered so far and only sends the order to the kitchen when everything is collected.
 * The generic curry function works the same way -- it accumulates arguments until
 * it has enough, then calls the original function.
 *
 * ╔════════════════════════════════════════════════════════════════════════════╗
 * ║ THE GOLDEN RULE                                                            ║
 * ╠════════════════════════════════════════════════════════════════════════════╣
 * ║                                                                            ║
 * ║ A generic curry function can transform ANY function into curried form.     ║
 * ║                                                                            ║
 * ║ It checks fn.length (number of expected arguments) and:                    ║
 * ║   - If enough args provided → call original function                       ║
 * ║   - If not enough → return function waiting for more args                  ║
 * ║                                                                            ║
 * ║ This enables flexible calling: f(a,b,c) OR f(a)(b)(c) OR f(a,b)(c)         ║
 * ║                                                                            ║
 * ╚════════════════════════════════════════════════════════════════════════════╝
 */

// Generic curry function
const curry = (fn) => { // ES6: arrow function + const
  return function curried(...args) {
    if (args.length >= fn.length) {
      return fn.apply(this, args);
    } else {
      return (...moreArgs) => curried.apply(this, args.concat(moreArgs)); // ES6: arrow function
    }
  };
};

// Regular function
const sum = (a, b, c) => a + b + c; // ES6: arrow function + const

const curriedSum = curry(sum); // ES6: const

// Multiple ways to call
console.log('A:', curriedSum(1, 2, 3));      // All at once
console.log('B:', curriedSum(1)(2)(3));      // One at a time
console.log('C:', curriedSum(1, 2)(3));      // Mixed
console.log('D:', curriedSum(1)(2, 3));      // Mixed other way

/**
 * OUTPUT:
 *   A: 6
 *   B: 6
 *   C: 6
 *   D: 6
 *
 *
 * ╔════════════════════════════════════════════════════════════════════════════╗
 * ║ STEP-BY-STEP: HOW CURRY() WORKS                                            ║
 * ╠════════════════════════════════════════════════════════════════════════════╣
 * ║                                                                            ║
 * ║ curry(sum) returns 'curried' function                                      ║
 * ║                                                                            ║
 * ║ A: curriedSum(1, 2, 3)                                                     ║
 * ║    args = [1, 2, 3], fn.length = 3                                         ║
 * ║    args.length >= fn.length → call sum(1, 2, 3) → 6                        ║
 * ║                                                                            ║
 * ║ B: curriedSum(1)(2)(3)                                                     ║
 * ║    Call 1: args = [1], 1 < 3 → return new curried with args=[1]            ║
 * ║    Call 2: args = [1,2], 2 < 3 → return new curried with args=[1,2]        ║
 * ║    Call 3: args = [1,2,3], 3 >= 3 → call sum(1,2,3) → 6                    ║
 * ║                                                                            ║
 * ║ C: curriedSum(1, 2)(3)                                                     ║
 * ║    Call 1: args = [1,2], 2 < 3 → return new curried with args=[1,2]        ║
 * ║    Call 2: args = [1,2,3], 3 >= 3 → call sum(1,2,3) → 6                    ║
 * ║                                                                            ║
 * ╚════════════════════════════════════════════════════════════════════════════╝
 *
 *
 * ┌─────────────────────────────────────────────────────────────────────────────┐
 * │ UNDERSTANDING fn.length                                                     │
 * ├─────────────────────────────────────────────────────────────────────────────┤
 * │                                                                             │
 * │   // fn.length = number of EXPECTED parameters                              │
 * │                                                                             │
 * │   function foo(a, b, c) {}                                                  │
 * │   foo.length;  // 3                                                         │
 * │                                                                             │
 * │   function bar(a, b = 10) {}                                                │
 * │   bar.length;  // 1 (default params not counted!)                           │
 * │                                                                             │
 * │   function baz(a, ...rest) {}                                               │
 * │   baz.length;  // 1 (rest params not counted!)                              │
 * │                                                                             │
 * │   // This is why curry works - it knows when to call original               │
 * │                                                                             │
 * └─────────────────────────────────────────────────────────────────────────────┘
 *
 *
 * ┌─────────────────────────────────────────────────────────────────────────────┐
 * │ CURRY IMPLEMENTATION EXPLAINED                                              │
 * ├─────────────────────────────────────────────────────────────────────────────┤
 * │                                                                             │
 * │   function curry(fn) {                                                      │
 * │     return function curried(...args) {                                      │
 * │       // Check if we have enough arguments                                  │
 * │       if (args.length >= fn.length) {                                       │
 * │         // YES: call original function                                      │
 * │         return fn.apply(this, args);                                        │
 * │       } else {                                                              │
 * │         // NO: return function that collects more                           │
 * │         return function(...moreArgs) {                                      │
 * │           // Combine old and new args, recurse                              │
 * │           return curried.apply(this, args.concat(moreArgs));                │
 * │         };                                                                  │
 * │       }                                                                     │
 * │     };                                                                      │
 * │   }                                                                         │
 * │                                                                             │
 * │   Key points:                                                               │
 * │   • Uses recursion (curried calls itself)                                   │
 * │   • Accumulates args with concat                                            │
 * │   • Preserves 'this' with apply                                             │
 * │                                                                             │
 * └─────────────────────────────────────────────────────────────────────────────┘
 *
 *
 * ┌─────────────────────────────────────────────────────────────────────────────┐
 * │ INTERVIEW QUESTIONS:                                                        │
 * ├─────────────────────────────────────────────────────────────────────────────┤
 * │                                                                             │
 * │ Q1: How would you write a generic curry helper function?                    │
 * │ A1: A generic curry checks if enough arguments have been collected by       │
 * │     comparing args.length with fn.length. If enough, call the original      │
 * │     function. If not, return a new function that concatenates the new       │
 * │     arguments with the old ones and recurses. Minimal version:              │
 * │     const curry = fn => function curried(...args) {                         │
 * │       return args.length >= fn.length                                       │
 * │         ? fn(...args)                                                       │
 * │         : (...more) => curried(...args, ...more);                           │
 * │     };                                                                      │
 * │                                                                             │
 * │ Q2: What is fn.length and why does it matter for currying?                  │
 * │ A2: fn.length returns the number of expected parameters of a function.      │
 * │     It does NOT count parameters with default values or rest parameters.    │
 * │     Curry uses it to know when all arguments have been collected and the    │
 * │     original function can be invoked.                                       │
 * │                                                                             │
 * │ Q3: Can you curry a function that has default or rest parameters?           │
 * │ A3: It gets tricky because fn.length only counts parameters before the      │
 * │     first default value or rest parameter. A function like (a, b = 10)      │
 * │     has length 1, so curry would call it after just one argument. You       │
 * │     would need to explicitly specify the arity to handle such cases.        │
 * │                                                                             │
 * └─────────────────────────────────────────────────────────────────────────────┘
 *
 *
 * RUN: node docs/javascript/08-currying/01-curry-helper.js
 */
