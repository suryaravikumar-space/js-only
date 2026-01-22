/**
 * CHALLENGE 00: Callback Basics
 *
 * ╔════════════════════════════════════════════════════════════════════════════╗
 * ║ THE GOLDEN RULE                                                            ║
 * ╠════════════════════════════════════════════════════════════════════════════╣
 * ║                                                                            ║
 * ║ A callback is a function passed as an argument to another function,        ║
 * ║ to be executed later (synchronously or asynchronously).                    ║
 * ║                                                                            ║
 * ║   function doSomething(callback) {                                         ║
 * ║     // ... do work ...                                                     ║
 * ║     callback();  // Execute the callback                                   ║
 * ║   }                                                                        ║
 * ║                                                                            ║
 * ╚════════════════════════════════════════════════════════════════════════════╝
 */

// A callback is a function passed as an argument to another function
function greet(name, callback) {
  console.log('A:', 'Hello ' + name);
  callback();
}

greet('Alice', function() {
  console.log('B:', 'Callback executed');
});

// Callbacks can receive arguments
function calculate(a, b, callback) {
  var result = a + b;
  callback(result);
}

calculate(5, 3, function(sum) {
  console.log('C:', sum);
});

// Named function as callback
function logResult(value) {
  console.log('D:', value * 2);
}

calculate(10, 5, logResult);

/**
 * OUTPUT:
 *   A: Hello Alice
 *   B: Callback executed
 *   C: 8
 *   D: 30
 *
 *
 * ╔════════════════════════════════════════════════════════════════════════════╗
 * ║ STEP-BY-STEP BREAKDOWN                                                     ║
 * ╠════════════════════════════════════════════════════════════════════════════╣
 * ║                                                                            ║
 * ║ A & B: Simple callback pattern                                             ║
 * ║ ──────────────────────────────                                             ║
 * ║   1. greet('Alice', fn) is called                                          ║
 * ║   2. Inside greet: logs "Hello Alice"                                      ║
 * ║   3. callback() executes the anonymous function                            ║
 * ║   4. Anonymous function logs "Callback executed"                           ║
 * ║                                                                            ║
 * ║                                                                            ║
 * ║ C: Callback with argument                                                  ║
 * ║ ─────────────────────────────                                              ║
 * ║   1. calculate(5, 3, fn) is called                                         ║
 * ║   2. result = 5 + 3 = 8                                                    ║
 * ║   3. callback(8) passes result to anonymous function                       ║
 * ║   4. Anonymous function logs 8                                             ║
 * ║                                                                            ║
 * ║                                                                            ║
 * ║ D: Named function as callback                                              ║
 * ║ ─────────────────────────────                                              ║
 * ║   1. calculate(10, 5, logResult) is called                                 ║
 * ║   2. result = 10 + 5 = 15                                                  ║
 * ║   3. callback(15) → logResult(15)                                          ║
 * ║   4. logResult logs 15 * 2 = 30                                            ║
 * ║                                                                            ║
 * ╚════════════════════════════════════════════════════════════════════════════╝
 *
 *
 * ┌─────────────────────────────────────────────────────────────────────────────┐
 * │ CALLBACK PATTERNS                                                           │
 * ├─────────────────────────────────────────────────────────────────────────────┤
 * │                                                                             │
 * │   // 1. Anonymous callback                                                  │
 * │   doSomething(function() { ... });                                          │
 * │                                                                             │
 * │   // 2. Named callback                                                      │
 * │   function myCallback() { ... }                                             │
 * │   doSomething(myCallback);                                                  │
 * │                                                                             │
 * │   // 3. Arrow function callback                                             │
 * │   doSomething(() => { ... });                                               │
 * │                                                                             │
 * │   // 4. Callback with arguments                                             │
 * │   doSomething(function(result) { ... });                                    │
 * │                                                                             │
 * └─────────────────────────────────────────────────────────────────────────────┘
 *
 *
 * ┌─────────────────────────────────────────────────────────────────────────────┐
 * │ INTERVIEW ANSWER                                                            │
 * ├─────────────────────────────────────────────────────────────────────────────┤
 * │                                                                             │
 * │ "A callback is a function passed as an argument to another function,        │
 * │  which is then invoked inside that function to complete some action.        │
 * │                                                                             │
 * │  Callbacks can be:                                                          │
 * │  - Synchronous: executed immediately (like Array.map)                       │
 * │  - Asynchronous: executed later (like setTimeout, fetch)                    │
 * │                                                                             │
 * │  They enable:                                                               │
 * │  - Higher-order function patterns                                           │
 * │  - Event handling                                                           │
 * │  - Asynchronous programming                                                 │
 * │  - Customizable behavior injection"                                         │
 * │                                                                             │
 * └─────────────────────────────────────────────────────────────────────────────┘
 *
 *
 * RUN: node docs/05-callbacks/00-callback-basics.js
 */
