/**
 * CHALLENGE 05: Currying with Function Composition
 *
 * ╔════════════════════════════════════════════════════════════════════════════╗
 * ║ THE GOLDEN RULE                                                            ║
 * ╠════════════════════════════════════════════════════════════════════════════╣
 * ║                                                                            ║
 * ║ Currying + Composition = Functional Programming Power!                     ║
 * ║                                                                            ║
 * ║ Curried functions return unary functions (one argument),                   ║
 * ║ which compose perfectly: compose(f, g, h)(x) = f(g(h(x)))                  ║
 * ║                                                                            ║
 * ║ This enables "point-free" style - defining transformations                 ║
 * ║ without mentioning the data being transformed.                             ║
 * ║                                                                            ║
 * ╚════════════════════════════════════════════════════════════════════════════╝
 */

// Curried utilities
var add = a => b => a + b;
var multiply = a => b => a * b;

// Compose function
var compose = (...fns) => x => fns.reduceRight((acc, fn) => fn(acc), x);

// Create composed operations
var add5 = add(5);
var multiplyBy2 = multiply(2);

var add5ThenDouble = compose(multiplyBy2, add5);
var doubleThenAdd5 = compose(add5, multiplyBy2);

console.log('A:', add5ThenDouble(10));  // (10 + 5) * 2
console.log('B:', doubleThenAdd5(10));  // (10 * 2) + 5

// More complex composition
var subtract = a => b => b - a;
var subtract3 = subtract(3);

var complexOp = compose(subtract3, multiplyBy2, add5);
console.log('C:', complexOp(10));  // ((10 + 5) * 2) - 3

/**
 * OUTPUT:
 *   A: 30
 *   B: 25
 *   C: 27
 *
 *
 * ╔════════════════════════════════════════════════════════════════════════════╗
 * ║ STEP-BY-STEP BREAKDOWN                                                     ║
 * ╠════════════════════════════════════════════════════════════════════════════╣
 * ║                                                                            ║
 * ║ A: add5ThenDouble(10)                                                      ║
 * ║ ─────────────────────                                                      ║
 * ║   compose(multiplyBy2, add5)(10)                                           ║
 * ║   = multiplyBy2(add5(10))                                                  ║
 * ║   = multiplyBy2(15)     // 10 + 5                                          ║
 * ║   = 30                  // 15 * 2                                          ║
 * ║                                                                            ║
 * ║ B: doubleThenAdd5(10)                                                      ║
 * ║ ─────────────────────                                                      ║
 * ║   compose(add5, multiplyBy2)(10)                                           ║
 * ║   = add5(multiplyBy2(10))                                                  ║
 * ║   = add5(20)            // 10 * 2                                          ║
 * ║   = 25                  // 20 + 5                                          ║
 * ║                                                                            ║
 * ║ C: complexOp(10)                                                           ║
 * ║ ────────────────                                                           ║
 * ║   compose(subtract3, multiplyBy2, add5)(10)                                ║
 * ║   = subtract3(multiplyBy2(add5(10)))                                       ║
 * ║   = subtract3(multiplyBy2(15))                                             ║
 * ║   = subtract3(30)                                                          ║
 * ║   = 27                  // 30 - 3                                          ║
 * ║                                                                            ║
 * ╚════════════════════════════════════════════════════════════════════════════╝
 *
 *
 * ┌─────────────────────────────────────────────────────────────────────────────┐
 * │ POINT-FREE STYLE                                                            │
 * ├─────────────────────────────────────────────────────────────────────────────┤
 * │                                                                             │
 * │   // WITH points (explicit data)                                            │
 * │   var getActiveUserNames = function(users) {                                │
 * │     return users                                                            │
 * │       .filter(function(user) { return user.active; })                       │
 * │       .map(function(user) { return user.name; });                           │
 * │   };                                                                        │
 * │                                                                             │
 * │   // POINT-FREE (no data mentioned)                                         │
 * │   var prop = key => obj => obj[key];                                        │
 * │   var filter = pred => arr => arr.filter(pred);                             │
 * │   var map = fn => arr => arr.map(fn);                                       │
 * │                                                                             │
 * │   var getActiveUserNames = compose(                                         │
 * │     map(prop('name')),                                                      │
 * │     filter(prop('active'))                                                  │
 * │   );                                                                        │
 * │                                                                             │
 * │   // Data flows through without being named!                                │
 * │                                                                             │
 * └─────────────────────────────────────────────────────────────────────────────┘
 *
 *
 * ┌─────────────────────────────────────────────────────────────────────────────┐
 * │ REAL-WORLD COMPOSITION                                                      │
 * ├─────────────────────────────────────────────────────────────────────────────┤
 * │                                                                             │
 * │   // Processing pipeline                                                    │
 * │   var trim = str => str.trim();                                             │
 * │   var toLowerCase = str => str.toLowerCase();                               │
 * │   var split = sep => str => str.split(sep);                                 │
 * │   var join = sep => arr => arr.join(sep);                                   │
 * │   var map = fn => arr => arr.map(fn);                                       │
 * │                                                                             │
 * │   // Create slug from title                                                 │
 * │   var slugify = compose(                                                    │
 * │     join('-'),                                                              │
 * │     map(toLowerCase),                                                       │
 * │     split(' '),                                                             │
 * │     trim                                                                    │
 * │   );                                                                        │
 * │                                                                             │
 * │   slugify('  Hello World  ');  // 'hello-world'                             │
 * │                                                                             │
 * │   // Each function does ONE thing, composed into pipeline                   │
 * │                                                                             │
 * └─────────────────────────────────────────────────────────────────────────────┘
 *
 *
 * RUN: node docs/06-currying/05-currying-composition.js
 */
