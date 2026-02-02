/**
 * CHALLENGE 08: Callbacks in Higher-Order Functions
 *
 * ╔════════════════════════════════════════════════════════════════════════════╗
 * ║ THE GOLDEN RULE                                                            ║
 * ╠════════════════════════════════════════════════════════════════════════════╣
 * ║                                                                            ║
 * ║ Callbacks + Higher-Order Functions = Powerful Patterns                     ║
 * ║                                                                            ║
 * ║   1. Functions that accept callbacks (repeat, forEach)                     ║
 * ║   2. Functions that return functions (factory pattern)                     ║
 * ║   3. Function composition (compose, pipe)                                  ║
 * ║   4. Callbacks with context (using call/apply)                             ║
 * ║                                                                            ║
 * ╚════════════════════════════════════════════════════════════════════════════╝
 */

// Higher-order function that accepts callback
const repeat = (n, callback) => {
  for (let i = 0; i < n; i++) {
    callback(i);
  }
};

const result = [];
repeat(3, (i) => {
  result.push(i * 2);
});
console.log('A:', result);

// Function that returns a function (callback factory)
const createMultiplier = (factor) => (num) => num * factor;

const double = createMultiplier(2);
const triple = createMultiplier(3);
console.log('B:', [1, 2, 3].map(double));
console.log('C:', [1, 2, 3].map(triple));

// Composing callbacks
const compose = (f, g) => (x) => f(g(x));

const addOne = (x) => x + 1;
const square = (x) => x * x;

const addThenSquare = compose(square, addOne);
console.log('D:', addThenSquare(4));  // square(addOne(4)) = square(5) = 25

// Callback with context
const counter = {
  count: 0,
  increment() {
    this.count++;
  }
};

const doThrice = (callback, context) => {
  for (let i = 0; i < 3; i++) {
    callback.call(context);
  }
};

doThrice(counter.increment, counter);
console.log('E:', counter.count);

/**
 * OUTPUT:
 *   A: [ 0, 2, 4 ]
 *   B: [ 2, 4, 6 ]
 *   C: [ 3, 6, 9 ]
 *   D: 25
 *   E: 3
 *
 *
 * ╔════════════════════════════════════════════════════════════════════════════╗
 * ║ CALLBACK PATTERNS                                                          ║
 * ╠════════════════════════════════════════════════════════════════════════════╣
 * ║                                                                            ║
 * ║ 1. ITERATOR PATTERN                                                        ║
 * ║    function forEach(arr, callback) {                                       ║
 * ║      for (var i = 0; i < arr.length; i++) callback(arr[i], i);             ║
 * ║    }                                                                       ║
 * ║                                                                            ║
 * ║ 2. FACTORY PATTERN                                                         ║
 * ║    function createLogger(prefix) {                                         ║
 * ║      return function(msg) { console.log(prefix + ': ' + msg); };           ║
 * ║    }                                                                       ║
 * ║                                                                            ║
 * ║ 3. COMPOSITION                                                             ║
 * ║    compose(f, g)(x) = f(g(x))  // Right to left                            ║
 * ║    pipe(f, g)(x) = g(f(x))     // Left to right                            ║
 * ║                                                                            ║
 * ║ 4. CONTEXT BINDING                                                         ║
 * ║    callback.call(context, arg1, arg2)                                      ║
 * ║    callback.apply(context, [args])                                         ║
 * ║                                                                            ║
 * ╚════════════════════════════════════════════════════════════════════════════╝
 *
 *
 * RUN: node docs/07-callbacks/08-higher-order-callbacks.js
 */
