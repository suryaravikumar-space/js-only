/**
 * CHALLENGE 07: Curry with Placeholder
 *
 * ╔════════════════════════════════════════════════════════════════════════════╗
 * ║ THE GOLDEN RULE                                                            ║
 * ╠════════════════════════════════════════════════════════════════════════════╣
 * ║                                                                            ║
 * ║ Placeholders let you skip arguments and fill them later.                   ║
 * ║                                                                            ║
 * ║   curry(divide)(_, 10, 2)(100)  // 100/10/2 = 5                            ║
 * ║                   ↑                 ↑                                       ║
 * ║              placeholder       fills placeholder                            ║
 * ║                                                                            ║
 * ║ This is an ADVANCED interview question found in Lodash/Ramda!              ║
 * ║                                                                            ║
 * ╚════════════════════════════════════════════════════════════════════════════╝
 */

var _ = Symbol('placeholder');

function curryWithPlaceholder(fn) {
  return function curried(...args) {
    // Check if we have enough non-placeholder args
    var complete = args.length >= fn.length &&
                   !args.slice(0, fn.length).includes(_);

    if (complete) {
      return fn.apply(this, args);
    }

    return function(...moreArgs) {
      // Replace placeholders with new args
      var newArgs = args.map(arg =>
        arg === _ && moreArgs.length ? moreArgs.shift() : arg
      );
      return curried.apply(this, newArgs.concat(moreArgs));
    };
  };
}

function divide(a, b, c) {
  return a / b / c;
}

var curriedDivide = curryWithPlaceholder(divide);

console.log('A:', curriedDivide(100, 10, 2));       // 100/10/2 = 5
console.log('B:', curriedDivide(_, 10, 2)(100));   // 100/10/2 = 5
console.log('C:', curriedDivide(_, _, 2)(100)(10)); // 100/10/2 = 5

/**
 * OUTPUT:
 *   A: 5
 *   B: 5
 *   C: 5
 *
 *
 * ╔════════════════════════════════════════════════════════════════════════════╗
 * ║ STEP-BY-STEP BREAKDOWN                                                     ║
 * ╠════════════════════════════════════════════════════════════════════════════╣
 * ║                                                                            ║
 * ║ B: curriedDivide(_, 10, 2)(100)                                            ║
 * ║ ──────────────────────────────                                             ║
 * ║   First call: args = [_, 10, 2]                                            ║
 * ║   • Has placeholder → not complete                                          ║
 * ║   • Returns function waiting for more args                                  ║
 * ║                                                                            ║
 * ║   Second call: moreArgs = [100]                                            ║
 * ║   • Map over args, replace _ with 100                                       ║
 * ║   • newArgs = [100, 10, 2]                                                  ║
 * ║   • No placeholders, complete → divide(100, 10, 2) = 5                      ║
 * ║                                                                            ║
 * ║                                                                            ║
 * ║ C: curriedDivide(_, _, 2)(100)(10)                                         ║
 * ║ ─────────────────────────────────                                          ║
 * ║   First call: args = [_, _, 2]                                             ║
 * ║   • Has placeholders → not complete                                         ║
 * ║                                                                            ║
 * ║   Second call: moreArgs = [100]                                            ║
 * ║   • Replace first _ with 100                                                ║
 * ║   • newArgs = [100, _, 2]                                                   ║
 * ║   • Still has placeholder → not complete                                    ║
 * ║                                                                            ║
 * ║   Third call: moreArgs = [10]                                              ║
 * ║   • Replace _ with 10                                                       ║
 * ║   • newArgs = [100, 10, 2]                                                  ║
 * ║   • Complete → divide(100, 10, 2) = 5                                       ║
 * ║                                                                            ║
 * ╚════════════════════════════════════════════════════════════════════════════╝
 *
 *
 * ┌─────────────────────────────────────────────────────────────────────────────┐
 * │ WHY USE PLACEHOLDERS?                                                       │
 * ├─────────────────────────────────────────────────────────────────────────────┤
 * │                                                                             │
 * │   // Without placeholder: Can only fill from left                           │
 * │   var divide = curry((a, b) => a / b);                                      │
 * │   var divideBy2 = divide(_, 2);  // Can't do this!                          │
 * │                                                                             │
 * │   // With placeholder: Fill any position                                    │
 * │   var divide = curryWithPlaceholder((a, b) => a / b);                       │
 * │   var divideBy2 = divide(_, 2);  // Works! Returns fn(a) => a/2             │
 * │   divideBy2(10);  // 5                                                      │
 * │                                                                             │
 * │   // Useful for:                                                            │
 * │   var map = curryWithPlaceholder((fn, arr) => arr.map(fn));                 │
 * │   var mapOverArray = map(_, [1, 2, 3]);  // Fill fn later                   │
 * │   mapOverArray(x => x * 2);  // [2, 4, 6]                                   │
 * │                                                                             │
 * └─────────────────────────────────────────────────────────────────────────────┘
 *
 *
 * ┌─────────────────────────────────────────────────────────────────────────────┐
 * │ IMPLEMENTATION DETAILS                                                      │
 * ├─────────────────────────────────────────────────────────────────────────────┤
 * │                                                                             │
 * │   // Using Symbol for placeholder (unique, won't conflict)                  │
 * │   var _ = Symbol('placeholder');                                            │
 * │                                                                             │
 * │   // Check completion: enough args AND no placeholders in required slots    │
 * │   var complete = args.length >= fn.length &&                                │
 * │                  !args.slice(0, fn.length).includes(_);                     │
 * │                                                                             │
 * │   // Replace placeholders in order                                          │
 * │   var newArgs = args.map(arg =>                                             │
 * │     arg === _ && moreArgs.length                                            │
 * │       ? moreArgs.shift()  // Take from front of new args                    │
 * │       : arg               // Keep original arg                              │
 * │   );                                                                        │
 * │                                                                             │
 * │   // Append any remaining new args                                          │
 * │   return curried.apply(this, newArgs.concat(moreArgs));                     │
 * │                                                                             │
 * └─────────────────────────────────────────────────────────────────────────────┘
 *
 *
 * RUN: node docs/06-currying/07-curry-placeholder.js
 */
