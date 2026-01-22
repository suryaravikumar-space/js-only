/**
 * CHALLENGE 01: Generic Curry Helper
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
function curry(fn) {
  return function curried(...args) {
    if (args.length >= fn.length) {
      return fn.apply(this, args);
    } else {
      return function(...moreArgs) {
        return curried.apply(this, args.concat(moreArgs));
      };
    }
  };
}

// Regular function
function sum(a, b, c) {
  return a + b + c;
}

var curriedSum = curry(sum);

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
 * │ INTERVIEW TIP: WRITE CURRY FROM MEMORY                                      │
 * ├─────────────────────────────────────────────────────────────────────────────┤
 * │                                                                             │
 * │   // Minimal version (memorize this!)                                       │
 * │   const curry = fn => function curried(...args) {                           │
 * │     return args.length >= fn.length                                         │
 * │       ? fn(...args)                                                         │
 * │       : (...more) => curried(...args, ...more);                             │
 * │   };                                                                        │
 * │                                                                             │
 * │   // Even shorter (one-liner)                                               │
 * │   const curry = fn => (...a) =>                                             │
 * │     a.length >= fn.length ? fn(...a) : curry(fn.bind(null, ...a));          │
 * │                                                                             │
 * └─────────────────────────────────────────────────────────────────────────────┘
 *
 *
 * RUN: node docs/06-currying/01-curry-helper.js
 */
