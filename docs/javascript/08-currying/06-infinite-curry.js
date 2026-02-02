/**
 * CHALLENGE 06: Infinite Currying (Interview Classic)
 *
 * ╔════════════════════════════════════════════════════════════════════════════╗
 * ║ THE GOLDEN RULE                                                            ║
 * ╠════════════════════════════════════════════════════════════════════════════╣
 * ║                                                                            ║
 * ║ Infinite currying: sum(1)(2)(3)...(n) with unlimited arguments             ║
 * ║                                                                            ║
 * ║ Two approaches:                                                            ║
 * ║ 1. Use valueOf/toString for implicit conversion: +sum(1)(2)(3)             ║
 * ║ 2. Use empty call to terminate: sum(1)(2)(3)()                             ║
 * ║                                                                            ║
 * ║ This is a CLASSIC interview question testing closure understanding!        ║
 * ║                                                                            ║
 * ╚════════════════════════════════════════════════════════════════════════════╝
 */

// Infinite curry with valueOf
function infiniteSum(a) {
  var sum = a;

  function inner(b) {
    sum += b;
    return inner;
  }

  inner.valueOf = function() {
    return sum;
  };

  inner.toString = function() {
    return sum;
  };

  return inner;
}

// Uses valueOf when converted to number
console.log('A:', +infiniteSum(1)(2)(3));
console.log('B:', +infiniteSum(1)(2)(3)(4)(5));

// Alternative: Return value when called with no args
function sum(a) {
  return function(b) {
    if (b === undefined) {
      return a;
    }
    return sum(a + b);
  };
}

console.log('C:', sum(1)(2)(3)());
console.log('D:', sum(10)(20)(30)(40)());

/**
 * OUTPUT:
 *   A: 6
 *   B: 15
 *   C: 6
 *   D: 100
 *
 *
 * ╔════════════════════════════════════════════════════════════════════════════╗
 * ║ APPROACH 1: valueOf/toString                                               ║
 * ╠════════════════════════════════════════════════════════════════════════════╣
 * ║                                                                            ║
 * ║ How it works:                                                              ║
 * ║                                                                            ║
 * ║ 1. infiniteSum(1) creates closure with sum=1, returns inner                ║
 * ║ 2. inner(2) adds 2 to sum (now 3), returns inner                           ║
 * ║ 3. inner(3) adds 3 to sum (now 6), returns inner                           ║
 * ║ 4. + operator triggers valueOf() → returns 6                               ║
 * ║                                                                            ║
 * ║ Key insight: Functions are objects! We can add valueOf/toString.           ║
 * ║                                                                            ║
 * ║   inner.valueOf = function() { return sum; };                              ║
 * ║                                                                            ║
 * ║ When JS needs a primitive value (+ operator, comparison, etc.),            ║
 * ║ it calls valueOf() automatically.                                          ║
 * ║                                                                            ║
 * ╚════════════════════════════════════════════════════════════════════════════╝
 *
 *
 * ┌─────────────────────────────────────────────────────────────────────────────┐
 * │ APPROACH 2: Empty call terminator                                           │
 * ├─────────────────────────────────────────────────────────────────────────────┤
 * │                                                                             │
 * │   function sum(a) {                                                         │
 * │     return function(b) {                                                    │
 * │       if (b === undefined) {                                                │
 * │         return a;  // No more args, return total                            │
 * │       }                                                                     │
 * │       return sum(a + b);  // Recurse with new total                         │
 * │     };                                                                      │
 * │   }                                                                         │
 * │                                                                             │
 * │   Trace of sum(1)(2)(3)():                                                  │
 * │   • sum(1) returns fn with a=1                                              │
 * │   • fn(2): b=2, not undefined → return sum(1+2) = sum(3)                    │
 * │   • sum(3) returns fn with a=3                                              │
 * │   • fn(3): b=3, not undefined → return sum(3+3) = sum(6)                    │
 * │   • sum(6) returns fn with a=6                                              │
 * │   • fn(): b=undefined → return a = 6                                        │
 * │                                                                             │
 * └─────────────────────────────────────────────────────────────────────────────┘
 *
 *
 * ┌─────────────────────────────────────────────────────────────────────────────┐
 * │ INTERVIEW VARIATIONS                                                        │
 * ├─────────────────────────────────────────────────────────────────────────────┤
 * │                                                                             │
 * │   // Variation 1: multiply(2)(3)(4) = 24                                    │
 * │   function multiply(a) {                                                    │
 * │     return function(b) {                                                    │
 * │       if (b === undefined) return a;                                        │
 * │       return multiply(a * b);                                               │
 * │     };                                                                      │
 * │   }                                                                         │
 * │                                                                             │
 * │   // Variation 2: sum with multiple args per call                           │
 * │   function sum(...args) {                                                   │
 * │     var total = args.reduce((a, b) => a + b, 0);                            │
 * │     function inner(...more) {                                               │
 * │       if (more.length === 0) return total;                                  │
 * │       total += more.reduce((a, b) => a + b, 0);                             │
 * │       return inner;                                                         │
 * │     }                                                                       │
 * │     inner.valueOf = () => total;                                            │
 * │     return inner;                                                           │
 * │   }                                                                         │
 * │   sum(1, 2)(3, 4)(5)();  // 15                                              │
 * │                                                                             │
 * └─────────────────────────────────────────────────────────────────────────────┘
 *
 *
 * ┌─────────────────────────────────────────────────────────────────────────────┐
 * │ INTERVIEW ANSWER                                                            │
 * ├─────────────────────────────────────────────────────────────────────────────┤
 * │                                                                             │
 * │ "To implement infinite currying like sum(1)(2)(3)..., we need to:           │
 * │                                                                             │
 * │  1. Return a function that can accept more arguments                        │
 * │  2. Accumulate values using closure                                         │
 * │  3. Provide a way to get the final value                                    │
 * │                                                                             │
 * │  Two common approaches:                                                     │
 * │                                                                             │
 * │  1. valueOf method: Override valueOf so type coercion returns the sum       │
 * │     Used with +sum(1)(2)(3) or when compared                                │
 * │                                                                             │
 * │  2. Empty call terminator: Return sum when called with no args              │
 * │     Used with sum(1)(2)(3)()                                                │
 * │                                                                             │
 * │  The key is understanding that each call returns a NEW function             │
 * │  that closes over the accumulated value."                                   │
 * │                                                                             │
 * └─────────────────────────────────────────────────────────────────────────────┘
 *
 *
 * RUN: node docs/06-currying/06-infinite-curry.js
 */
