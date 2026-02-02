/**
 * CHALLENGE 21: The call() Method
 *
 * ╔════════════════════════════════════════════════════════════════════════════╗
 * ║ THE CRITICAL LESSON                                                        ║
 * ╠════════════════════════════════════════════════════════════════════════════╣
 * ║                                                                            ║
 * ║ Regular functions determine `this` at CALL TIME                            ║
 * ║ based on HOW they are called, NOT where they came from!                    ║
 * ║                                                                            ║
 * ║   person1.greet('Hi')     →  this = person1 (method call)                  ║
 * ║                                                                            ║
 * ║   var fn = person1.greet                                                   ║
 * ║   fn('Hi')                →  this = global (standalone call!)              ║
 * ║                                                                            ║
 * ║   fn.call(person1, 'Hi')  →  this = person1 (explicit binding)             ║
 * ║                                                                            ║
 * ╚════════════════════════════════════════════════════════════════════════════╝
 */

var person1 = { // ES6: use `const`
  name: 'Alice',
  greet: function(greeting) {
    return greeting + ', ' + this.name; // ES6: use template literal `${greeting}, ${this.name}`
  }
};

var person2 = { name: 'Bob' };     // ES6: use `const`
var person3 = { name: 'Charlie' }; // ES6: use `const`

console.log('A:', person1.greet('Hello'));
console.log('B:', person1.greet.call(person2, 'Hi'));
console.log('C:', person1.greet.call(person3, 'Hey'));

var greetFunc = person1.greet; // ES6: use `const`
console.log('D:', greetFunc('Yo'));
console.log('E:', greetFunc.call(person1, 'Sup'));

/**
 * OUTPUT:
 *   A: Hello, Alice
 *   B: Hi, Bob
 *   C: Hey, Charlie
 *   D: Yo, undefined
 *   E: Sup, Alice
 *
 *
 * ╔════════════════════════════════════════════════════════════════════════════╗
 * ║ STEP-BY-STEP BREAKDOWN                                                     ║
 * ╠════════════════════════════════════════════════════════════════════════════╣
 * ║                                                                            ║
 * ║ A: person1.greet('Hello')                                                  ║
 * ║ ─────────────────────────                                                  ║
 * ║   • Method call: object.method()                                           ║
 * ║   • this = person1 (object before the dot)                                 ║
 * ║   • this.name = 'Alice'                                                    ║
 * ║   • Result: 'Hello, Alice'                                                 ║
 * ║                                                                            ║
 * ║                                                                            ║
 * ║ B: person1.greet.call(person2, 'Hi')                                       ║
 * ║ ────────────────────────────────────                                       ║
 * ║   • Using call() to explicitly set this                                    ║
 * ║   • this = person2 (first argument to call)                                ║
 * ║   • this.name = 'Bob'                                                      ║
 * ║   • Result: 'Hi, Bob'                                                      ║
 * ║                                                                            ║
 * ║                                                                            ║
 * ║ C: person1.greet.call(person3, 'Hey')                                      ║
 * ║ ─────────────────────────────────────                                      ║
 * ║   • Using call() to explicitly set this                                    ║
 * ║   • this = person3 (first argument to call)                                ║
 * ║   • this.name = 'Charlie'                                                  ║
 * ║   • Result: 'Hey, Charlie'                                                 ║
 * ║                                                                            ║
 * ║                                                                            ║
 * ║ D: greetFunc('Yo')  ← THE TRICKY ONE!                                      ║
 * ║ ──────────────────                                                         ║
 * ║   • greetFunc is just a reference to the function                          ║
 * ║   • It does NOT remember it came from person1                              ║
 * ║   • greetFunc('Yo') is a STANDALONE call (no object.method)                ║
 * ║   • this = global object (non-strict mode)                                 ║
 * ║   • global.name = undefined                                                ║
 * ║   • Result: 'Yo, undefined'                                                ║
 * ║                                                                            ║
 * ║                                                                            ║
 * ║ E: greetFunc.call(person1, 'Sup')                                          ║
 * ║ ─────────────────────────────────                                          ║
 * ║   • Using call() to explicitly set this                                    ║
 * ║   • this = person1                                                         ║
 * ║   • this.name = 'Alice'                                                    ║
 * ║   • Result: 'Sup, Alice'                                                   ║
 * ║                                                                            ║
 * ╚════════════════════════════════════════════════════════════════════════════╝
 *
 *
 * ┌─────────────────────────────────────────────────────────────────────────────┐
 * │ THE COMMON MISTAKE                                                          │
 * ├─────────────────────────────────────────────────────────────────────────────┤
 * │                                                                             │
 * │ WRONG THINKING:                                                             │
 * │   "greetFunc came from person1, so this is still person1"                   │
 * │                                                                             │
 * │ CORRECT THINKING:                                                           │
 * │   "How is greetFunc being CALLED right now?"                                │
 * │   → greetFunc('Yo') has no object before it                                 │
 * │   → It's a standalone call                                                  │
 * │   → this = global                                                           │
 * │                                                                             │
 * │ VISUAL:                                                                     │
 * │                                                                             │
 * │   var greetFunc = person1.greet;                                            │
 * │                                                                             │
 * │   ┌──────────────┐         ┌──────────────────────────┐                     │
 * │   │  greetFunc   │ ──────► │ function(greeting) {...} │                     │
 * │   └──────────────┘         └──────────────────────────┘                     │
 * │                                     ↑                                       │
 * │   ┌──────────────┐                  │                                       │
 * │   │  person1     │                  │                                       │
 * │   │  .greet      │ ─────────────────┘                                       │
 * │   └──────────────┘                                                          │
 * │                                                                             │
 * │   Both point to the SAME function, but:                                     │
 * │   - person1.greet() → this = person1                                        │
 * │   - greetFunc()     → this = global (no object!)                            │
 * │                                                                             │
 * └─────────────────────────────────────────────────────────────────────────────┘
 *
 *
 * ┌─────────────────────────────────────────────────────────────────────────────┐
 * │ HOW TO FIX LOST this                                                        │
 * ├─────────────────────────────────────────────────────────────────────────────┤
 * │                                                                             │
 * │ Option 1: Use call() every time                                             │
 * │   greetFunc.call(person1, 'Yo')  // Yo, Alice                               │
 * │                                                                             │
 * │ Option 2: Use bind() to permanently attach this                             │
 * │   var greetFunc = person1.greet.bind(person1);                              │
 * │   greetFunc('Yo')  // Yo, Alice (always!)                                   │
 * │                                                                             │
 * │ Option 3: Use arrow function wrapper                                        │
 * │   var greetFunc = (greeting) => person1.greet(greeting);                    │
 * │   greetFunc('Yo')  // Yo, Alice                                             │
 * │                                                                             │
 * └─────────────────────────────────────────────────────────────────────────────┘
 *
 *
 * ┌─────────────────────────────────────────────────────────────────────────────┐
 * │ SUMMARY: call() SYNTAX                                                      │
 * ├─────────────────────────────────────────────────────────────────────────────┤
 * │                                                                             │
 * │   func.call(thisArg, arg1, arg2, arg3, ...)                                 │
 * │             ───────  ─────────────────────                                  │
 * │                │              │                                             │
 * │                │              └── Arguments passed to function              │
 * │                │                                                            │
 * │                └── Object to use as `this`                                  │
 * │                                                                             │
 * │ KEY POINTS:                                                                 │
 * │   • call() IMMEDIATELY executes the function                                │
 * │   • First argument becomes `this`                                           │
 * │   • Remaining arguments passed to function (comma-separated)                │
 * │   • Unlike bind(), does NOT return a new function                           │
 * │                                                                             │
 * └─────────────────────────────────────────────────────────────────────────────┘
 *
 *
 * INTERVIEW QUESTIONS:
 *
 * Q: "What does call() do, and why would you need it?"
 * A: call() explicitly sets `this` for a function invocation. Regular functions
 *    determine `this` at CALL TIME, not definition time. When you extract a method
 *    reference (var greetFunc = person1.greet) and call it standalone, `this` becomes
 *    the global object (or undefined in strict mode). call() lets you fix this by
 *    passing the desired `this` as the first argument: greetFunc.call(person1, 'Yo').
 *    Alternatively, bind() permanently attaches `this` to a function.
 *
 *
 * ES6 NOTE: Use `const` instead of `var`, template literals instead of string
 *           concatenation, and arrow functions for callbacks. Arrow functions
 *           cannot have their `this` changed by call/apply/bind.
 *
 * RUN: node docs/javascript/01-execution-context/21-call-method.js
 */
