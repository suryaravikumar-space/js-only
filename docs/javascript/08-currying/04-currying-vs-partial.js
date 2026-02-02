/**
 * CHALLENGE 04: Currying vs Partial Application
 *
 * ╔════════════════════════════════════════════════════════════════════════════╗
 * ║ THE GOLDEN RULE                                                            ║
 * ╠════════════════════════════════════════════════════════════════════════════╣
 * ║                                                                            ║
 * ║ CURRYING:                                                                  ║
 * ║   Transform f(a, b, c) into f(a)(b)(c)                                     ║
 * ║   Each call takes exactly ONE argument                                     ║
 * ║                                                                            ║
 * ║ PARTIAL APPLICATION:                                                       ║
 * ║   Fix SOME arguments, return function for the REST                         ║
 * ║   partial(f, a, b) returns f_with_a_b(c)                                   ║
 * ║                                                                            ║
 * ║ Currying ENABLES partial application, but they're not the same!            ║
 * ║                                                                            ║
 * ╚════════════════════════════════════════════════════════════════════════════╝
 */

// Partial Application: Fix SOME arguments
function partial(fn, ...fixedArgs) {
  return function(...remainingArgs) {
    return fn(...fixedArgs, ...remainingArgs);
  };
}

function greet(greeting, punctuation, name) {
  return `${greeting}, ${name}${punctuation}`;
}

// Partial: fix first two args
var greetHello = partial(greet, 'Hello', '!');
console.log('A:', greetHello('Alice'));
console.log('B:', greetHello('Bob'));

// Currying: Transform into chain of single-arg functions
var curriedGreet = greeting => punctuation => name =>
  `${greeting}, ${name}${punctuation}`;

var greetHi = curriedGreet('Hi')('.');
console.log('C:', greetHi('Charlie'));

var greetHey = curriedGreet('Hey')('!');
console.log('D:', greetHey('Diana'));

/**
 * OUTPUT:
 *   A: Hello, Alice!
 *   B: Hello, Bob!
 *   C: Hi, Charlie.
 *   D: Hey, Diana!
 *
 *
 * ╔════════════════════════════════════════════════════════════════════════════╗
 * ║ KEY DIFFERENCES                                                            ║
 * ╠════════════════════════════════════════════════════════════════════════════╣
 * ║                                                                            ║
 * ║ ┌─────────────────────────┬────────────────────────────────────────────┐   ║
 * ║ │ CURRYING                │ PARTIAL APPLICATION                        │   ║
 * ║ ├─────────────────────────┼────────────────────────────────────────────┤   ║
 * ║ │ Always 1 arg per call   │ Any number of args per call                │   ║
 * ║ │ f(a)(b)(c)              │ partial(f, a, b)(c)                        │   ║
 * ║ │ Transform function form │ Pre-fill specific arguments                │   ║
 * ║ │ Returns chain of fn     │ Returns single fn                          │   ║
 * ║ │ Functional programming  │ Common in any paradigm                     │   ║
 * ║ └─────────────────────────┴────────────────────────────────────────────┘   ║
 * ║                                                                            ║
 * ╚════════════════════════════════════════════════════════════════════════════╝
 *
 *
 * ┌─────────────────────────────────────────────────────────────────────────────┐
 * │ VISUAL COMPARISON                                                           │
 * ├─────────────────────────────────────────────────────────────────────────────┤
 * │                                                                             │
 * │   Original: greet(greeting, punctuation, name)                              │
 * │                                                                             │
 * │   CURRYING:                                                                 │
 * │   ─────────                                                                 │
 * │   curriedGreet('Hello')  →  returns fn(punctuation)                         │
 * │   curriedGreet('Hello')('!')  →  returns fn(name)                           │
 * │   curriedGreet('Hello')('!')('Alice')  →  'Hello, Alice!'                   │
 * │                                                                             │
 * │   Each step: exactly 1 argument                                             │
 * │                                                                             │
 * │                                                                             │
 * │   PARTIAL APPLICATION:                                                      │
 * │   ────────────────────                                                      │
 * │   partial(greet, 'Hello')  →  returns fn(punctuation, name)                 │
 * │   partial(greet, 'Hello', '!')  →  returns fn(name)                         │
 * │   partial(greet, 'Hello', '!')('Alice')  →  'Hello, Alice!'                 │
 * │                                                                             │
 * │   Each step: any number of arguments                                        │
 * │                                                                             │
 * └─────────────────────────────────────────────────────────────────────────────┘
 *
 *
 * ┌─────────────────────────────────────────────────────────────────────────────┐
 * │ BIND AS PARTIAL APPLICATION                                                 │
 * ├─────────────────────────────────────────────────────────────────────────────┤
 * │                                                                             │
 * │   // JavaScript's bind() is essentially partial application!                │
 * │                                                                             │
 * │   function greet(greeting, name) {                                          │
 * │     return `${greeting}, ${name}!`;                                         │
 * │   }                                                                         │
 * │                                                                             │
 * │   // Using bind for partial application                                     │
 * │   var sayHello = greet.bind(null, 'Hello');                                 │
 * │   sayHello('Alice');  // 'Hello, Alice!'                                    │
 * │   sayHello('Bob');    // 'Hello, Bob!'                                      │
 * │                                                                             │
 * │   // null is for 'this' context (not needed here)                           │
 * │   // 'Hello' is pre-filled as first argument                                │
 * │                                                                             │
 * └─────────────────────────────────────────────────────────────────────────────┘
 *
 *
 * ┌─────────────────────────────────────────────────────────────────────────────┐
 * │ WHEN TO USE WHICH                                                           │
 * ├─────────────────────────────────────────────────────────────────────────────┤
 * │                                                                             │
 * │   USE CURRYING when:                                                        │
 * │   • Building utility libraries (Ramda-style)                                │
 * │   • Need maximum flexibility in arg application                             │
 * │   • Working with function composition                                       │
 * │   • Creating point-free style code                                          │
 * │                                                                             │
 * │   USE PARTIAL APPLICATION when:                                             │
 * │   • Pre-configuring functions with known values                             │
 * │   • Creating event handlers with extra context                              │
 * │   • Simplifying repeated function calls                                     │
 * │   • Quick, one-off specializations                                          │
 * │                                                                             │
 * │   // Currying: compose(map(prop('name')), filter(isActive))                 │
 * │   // Partial: saveButton.onClick = partial(save, userId, token)             │
 * │                                                                             │
 * └─────────────────────────────────────────────────────────────────────────────┘
 *
 *
 * RUN: node docs/06-currying/04-currying-vs-partial.js
 */
