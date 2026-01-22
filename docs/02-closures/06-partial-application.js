/**
 * CHALLENGE 06: Partial Application & Currying
 *
 * ╔════════════════════════════════════════════════════════════════════════════╗
 * ║ THE GOLDEN RULE                                                            ║
 * ╠════════════════════════════════════════════════════════════════════════════╣
 * ║                                                                            ║
 * ║ Partial Application: Fix some arguments, return function for the rest.     ║
 * ║ Currying: Transform f(a,b,c) into f(a)(b)(c).                              ║
 * ║ Both rely on closures to "remember" the fixed arguments.                   ║
 * ║                                                                            ║
 * ║   var double = partial(multiply, 2);                                       ║
 * ║   double(5);  // multiply(2, 5) = 10                                       ║
 * ║                                                                            ║
 * ╚════════════════════════════════════════════════════════════════════════════╝
 */

// Partial Application
function multiply(a, b) {
  return a * b;
}

function partial(fn, a) {
  return function(b) {
    return fn(a, b);
  };
}

var double = partial(multiply, 2);
var triple = partial(multiply, 3);

console.log('A:', double(5));
console.log('B:', triple(5));

// Currying
function curry(fn) {
  return function(a) {
    return function(b) {
      return fn(a, b);
    };
  };
}

var curriedMultiply = curry(multiply);
console.log('C:', curriedMultiply(4)(5));

var multiplyBy10 = curriedMultiply(10);
console.log('D:', multiplyBy10(7));
console.log('E:', multiplyBy10(3));

/**
 * OUTPUT:
 *   A: 10
 *   B: 15
 *   C: 20
 *   D: 70
 *   E: 30
 *
 *
 * ╔════════════════════════════════════════════════════════════════════════════╗
 * ║ STEP-BY-STEP BREAKDOWN                                                     ║
 * ╠════════════════════════════════════════════════════════════════════════════╣
 * ║                                                                            ║
 * ║ A: double(5)                                                               ║
 * ║ ────────────                                                               ║
 * ║   • double = partial(multiply, 2)                                          ║
 * ║   • Creates closure: fn=multiply, a=2                                      ║
 * ║   • double(5) → calls multiply(2, 5)                                       ║
 * ║   • Returns 10                                                             ║
 * ║                                                                            ║
 * ║                                                                            ║
 * ║ B: triple(5)                                                               ║
 * ║ ────────────                                                               ║
 * ║   • triple = partial(multiply, 3)                                          ║
 * ║   • Creates closure: fn=multiply, a=3                                      ║
 * ║   • triple(5) → calls multiply(3, 5)                                       ║
 * ║   • Returns 15                                                             ║
 * ║                                                                            ║
 * ║                                                                            ║
 * ║ C: curriedMultiply(4)(5)                                                   ║
 * ║ ────────────────────────                                                   ║
 * ║   • curriedMultiply = curry(multiply)                                      ║
 * ║   • curriedMultiply(4) returns function with a=4 in closure                ║
 * ║   • That function(5) calls multiply(4, 5)                                  ║
 * ║   • Returns 20                                                             ║
 * ║                                                                            ║
 * ║                                                                            ║
 * ║ D: multiplyBy10(7)                                                         ║
 * ║ ──────────────────                                                         ║
 * ║   • multiplyBy10 = curriedMultiply(10)                                     ║
 * ║   • Creates closure with a=10                                              ║
 * ║   • multiplyBy10(7) → multiply(10, 7)                                      ║
 * ║   • Returns 70                                                             ║
 * ║                                                                            ║
 * ║                                                                            ║
 * ║ E: multiplyBy10(3)                                                         ║
 * ║ ──────────────────                                                         ║
 * ║   • Same multiplyBy10 with a=10 in closure                                 ║
 * ║   • multiplyBy10(3) → multiply(10, 3)                                      ║
 * ║   • Returns 30                                                             ║
 * ║                                                                            ║
 * ╚════════════════════════════════════════════════════════════════════════════╝
 *
 *
 * ┌─────────────────────────────────────────────────────────────────────────────┐
 * │ HOW CLOSURE ENABLES PARTIAL APPLICATION                                     │
 * ├─────────────────────────────────────────────────────────────────────────────┤
 * │                                                                             │
 * │   function partial(fn, a) {                                                 │
 * │     // fn and a are captured in closure                                     │
 * │     return function(b) {                                                    │
 * │       // When called later, fn and a are still accessible!                  │
 * │       return fn(a, b);                                                      │
 * │     };                                                                      │
 * │   }                                                                         │
 * │                                                                             │
 * │   var double = partial(multiply, 2);                                        │
 * │                                                                             │
 * │   ┌─────────────────────────────────────────┐                               │
 * │   │  Closure for 'double'                   │                               │
 * │   │                                         │                               │
 * │   │  fn = multiply (captured)               │                               │
 * │   │  a = 2 (captured)                       │                               │
 * │   │                                         │                               │
 * │   │  function(b) {                          │                               │
 * │   │    return fn(a, b);  // multiply(2, b)  │                               │
 * │   │  }                                      │                               │
 * │   └─────────────────────────────────────────┘                               │
 * │                                                                             │
 * │   double(5) → multiply(2, 5) → 10                                           │
 * │                                                                             │
 * └─────────────────────────────────────────────────────────────────────────────┘
 *
 *
 * ┌─────────────────────────────────────────────────────────────────────────────┐
 * │ PARTIAL APPLICATION vs CURRYING                                             │
 * ├─────────────────────────────────────────────────────────────────────────────┤
 * │                                                                             │
 * │ PARTIAL APPLICATION:                                                        │
 * │   Fix SOME arguments, call with the rest at once                            │
 * │                                                                             │
 * │   add(a, b, c)  →  addPartial = partial(add, 1)  →  addPartial(2, 3)        │
 * │                     (a is fixed to 1)                 (b=2, c=3)            │
 * │                                                                             │
 * │                                                                             │
 * │ CURRYING:                                                                   │
 * │   Transform to chain of single-argument functions                           │
 * │                                                                             │
 * │   add(a, b, c)  →  curriedAdd(a)(b)(c)                                      │
 * │                     Each call takes exactly ONE argument                    │
 * │                                                                             │
 * │                                                                             │
 * │ ┌────────────────────┬────────────────────────────────────────────────────┐ │
 * │ │ Partial            │ Currying                                           │ │
 * │ ├────────────────────┼────────────────────────────────────────────────────┤ │
 * │ │ Fix some args      │ Transform ALL args to single-arg chain             │ │
 * │ │ partial(fn, 1, 2)  │ curry(fn)(1)(2)(3)                                 │ │
 * │ │ More flexible      │ More composable                                    │ │
 * │ │ Common in JS       │ Common in functional programming                   │ │
 * │ └────────────────────┴────────────────────────────────────────────────────┘ │
 * │                                                                             │
 * └─────────────────────────────────────────────────────────────────────────────┘
 *
 *
 * ┌─────────────────────────────────────────────────────────────────────────────┐
 * │ REAL WORLD EXAMPLES                                                         │
 * ├─────────────────────────────────────────────────────────────────────────────┤
 * │                                                                             │
 * │ 1. API calls with fixed base URL:                                           │
 * │    var fetchFromAPI = partial(fetch, 'https://api.example.com');            │
 * │    fetchFromAPI('/users');                                                  │
 * │    fetchFromAPI('/products');                                               │
 * │                                                                             │
 * │ 2. Logging with prefix:                                                     │
 * │    var debug = partial(console.log, '[DEBUG]');                             │
 * │    var error = partial(console.log, '[ERROR]');                             │
 * │    debug('User logged in');   // [DEBUG] User logged in                     │
 * │    error('Connection lost');  // [ERROR] Connection lost                    │
 * │                                                                             │
 * │ 3. Event handlers with context:                                             │
 * │    var handleUserClick = partial(handleClick, 'user');                      │
 * │    var handleAdminClick = partial(handleClick, 'admin');                    │
 * │    userButton.onclick = handleUserClick;                                    │
 * │                                                                             │
 * │ 4. Using bind() (built-in partial application):                             │
 * │    var double = multiply.bind(null, 2);                                     │
 * │    double(5);  // 10                                                        │
 * │                                                                             │
 * └─────────────────────────────────────────────────────────────────────────────┘
 *
 *
 * ┌─────────────────────────────────────────────────────────────────────────────┐
 * │ INTERVIEW ANSWER                                                            │
 * ├─────────────────────────────────────────────────────────────────────────────┤
 * │                                                                             │
 * │ "Partial application and currying both use closures to 'remember'           │
 * │  previously supplied arguments.                                             │
 * │                                                                             │
 * │  Partial application: Fix some arguments upfront, return a function         │
 * │  that takes the remaining arguments. It's like creating specialized         │
 * │  versions of a general function.                                            │
 * │                                                                             │
 * │  Currying: Transform a function that takes multiple arguments into          │
 * │  a chain of functions that each take one argument.                          │
 * │                                                                             │
 * │  In JavaScript, you can use bind() for partial application:                 │
 * │    var double = multiply.bind(null, 2);                                     │
 * │                                                                             │
 * │  Or write a custom partial function using closures:                         │
 * │    function partial(fn, ...fixedArgs) {                                     │
 * │      return (...remainingArgs) => fn(...fixedArgs, ...remainingArgs);       │
 * │    }                                                                        │
 * │                                                                             │
 * │  These patterns are useful for creating reusable, configurable functions    │
 * │  and are fundamental to functional programming in JavaScript."              │
 * │                                                                             │
 * └─────────────────────────────────────────────────────────────────────────────┘
 *
 *
 * RUN: node docs/02-closures/06-partial-application.js
 */
