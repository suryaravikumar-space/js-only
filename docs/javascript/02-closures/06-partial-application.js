/**
 * TOPIC: Partial Application & Currying
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
const multiply = (a, b) => a * b; // ES6: arrow function + const

// ES6: rest/spread partial application
const partial = (fn, ...fixedArgs) => (...remainingArgs) => fn(...fixedArgs, ...remainingArgs);

const double = partial(multiply, 2); // ES6: const
const triple = partial(multiply, 3);

console.log('A:', double(5));
console.log('B:', triple(5));

// Currying (ES6: arrow functions make it concise)
const curry = (fn) => (a) => (b) => fn(a, b);

const curriedMultiply = curry(multiply);
console.log('C:', curriedMultiply(4)(5));

const multiplyBy10 = curriedMultiply(10);
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
 * INTERVIEW QUESTIONS:
 *
 * Q: "What's the difference between partial application and currying?"
 * A: Partial application fixes SOME arguments and returns a function for the rest
 *    (can take multiple remaining args at once). Currying transforms f(a,b,c) into
 *    f(a)(b)(c) — a chain of single-argument functions. Both use closures to remember
 *    previously supplied arguments.
 *
 * Q: "How can you do partial application using built-in JS?"
 * A: Use `Function.prototype.bind()`:
 *    `const double = multiply.bind(null, 2);` — the first arg sets `this` (null here),
 *    remaining args are pre-filled. Or use ES6 rest/spread:
 *    `const partial = (fn, ...fixed) => (...rest) => fn(...fixed, ...rest);`
 *
 * Q: "Give a real-world use case for currying or partial application."
 * A: Logging with prefixes: `const debug = partial(log, '[DEBUG]')`, API fetchers with
 *    fixed base URLs, event handlers with pre-bound context, or composing data
 *    transformations in functional pipelines like `array.map(multiply(2))`.
 *
 *
 * RUN: node docs/javascript/02-closures/06-partial-application.js
 */
