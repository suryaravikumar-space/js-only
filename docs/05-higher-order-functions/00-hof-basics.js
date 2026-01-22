/**
 * CHALLENGE 00: Higher-Order Functions Basics
 *
 * ╔════════════════════════════════════════════════════════════════════════════╗
 * ║ THE GOLDEN RULE                                                            ║
 * ╠════════════════════════════════════════════════════════════════════════════╣
 * ║                                                                            ║
 * ║ A Higher-Order Function (HOF) is a function that:                          ║
 * ║   1. Takes a function as an argument, OR                                   ║
 * ║   2. Returns a function, OR                                                ║
 * ║   3. Both!                                                                 ║
 * ║                                                                            ║
 * ║ This is possible because in JavaScript, functions are "first-class":       ║
 * ║   - They can be assigned to variables                                      ║
 * ║   - They can be passed as arguments                                        ║
 * ║   - They can be returned from other functions                              ║
 * ║                                                                            ║
 * ╚════════════════════════════════════════════════════════════════════════════╝
 */

// A function is "higher-order" if it:
// 1. Takes a function as argument, OR
// 2. Returns a function

// Example 1: Function that takes a function
function repeat(n, action) {
  for (var i = 0; i < n; i++) {
    action(i);
  }
}

console.log('A:');
repeat(3, console.log);

// Example 2: Function that returns a function
function greaterThan(n) {
  return function(m) {
    return m > n;
  };
}

var greaterThan10 = greaterThan(10);
console.log('B:', greaterThan10(11));
console.log('C:', greaterThan10(9));

// Example 3: Both - takes AND returns a function
function noisy(fn) {
  return function(...args) {
    console.log('Calling with:', args);
    var result = fn(...args);
    console.log('Called with:', args, 'returned:', result);
    return result;
  };
}

var noisyMath = noisy(Math.min);
console.log('D:', noisyMath(3, 2, 1));

/**
 * OUTPUT:
 *   A:
 *   0
 *   1
 *   2
 *   B: true
 *   C: false
 *   Calling with: [ 3, 2, 1 ]
 *   Called with: [ 3, 2, 1 ] returned: 1
 *   D: 1
 *
 *
 * ╔════════════════════════════════════════════════════════════════════════════╗
 * ║ STEP-BY-STEP BREAKDOWN                                                     ║
 * ╠════════════════════════════════════════════════════════════════════════════╣
 * ║                                                                            ║
 * ║ A: repeat(3, console.log)                                                  ║
 * ║ ─────────────────────────                                                  ║
 * ║   • repeat takes a function (console.log) as argument                      ║
 * ║   • Calls action(i) for i = 0, 1, 2                                        ║
 * ║   • console.log(0), console.log(1), console.log(2)                         ║
 * ║   • Prints 0, 1, 2 on separate lines                                       ║
 * ║                                                                            ║
 * ║                                                                            ║
 * ║ B: greaterThan10(11)                                                       ║
 * ║ ────────────────────                                                       ║
 * ║   • greaterThan(10) returns a function with n=10 in closure                ║
 * ║   • greaterThan10(11) → 11 > 10 → true                                     ║
 * ║                                                                            ║
 * ║                                                                            ║
 * ║ C: greaterThan10(9)                                                        ║
 * ║ ───────────────────                                                        ║
 * ║   • Same function with n=10 in closure                                     ║
 * ║   • greaterThan10(9) → 9 > 10 → false                                      ║
 * ║                                                                            ║
 * ║                                                                            ║
 * ║ D: noisyMath(3, 2, 1)                                                      ║
 * ║ ─────────────────────                                                      ║
 * ║   • noisy(Math.min) takes a function AND returns a function                ║
 * ║   • The returned function logs args, calls original, logs result           ║
 * ║   • noisyMath(3, 2, 1) → Math.min(3, 2, 1) → 1                             ║
 * ║                                                                            ║
 * ╚════════════════════════════════════════════════════════════════════════════╝
 *
 *
 * ┌─────────────────────────────────────────────────────────────────────────────┐
 * │ TYPES OF HIGHER-ORDER FUNCTIONS                                             │
 * ├─────────────────────────────────────────────────────────────────────────────┤
 * │                                                                             │
 * │ 1. FUNCTIONS THAT TAKE FUNCTIONS (Callbacks)                                │
 * │                                                                             │
 * │    [1, 2, 3].map(x => x * 2)     // Array methods                           │
 * │    setTimeout(callback, 1000)    // Timers                                  │
 * │    element.addEventListener('click', handler)  // Events                    │
 * │                                                                             │
 * │                                                                             │
 * │ 2. FUNCTIONS THAT RETURN FUNCTIONS (Factory)                                │
 * │                                                                             │
 * │    function multiplier(n) {                                                 │
 * │      return function(x) {                                                   │
 * │        return x * n;                                                        │
 * │      };                                                                     │
 * │    }                                                                        │
 * │    var double = multiplier(2);                                              │
 * │    double(5);  // 10                                                        │
 * │                                                                             │
 * │                                                                             │
 * │ 3. FUNCTIONS THAT DO BOTH (Decorators/Wrappers)                             │
 * │                                                                             │
 * │    function logged(fn) {                                                    │
 * │      return function(...args) {                                             │
 * │        console.log('Calling', fn.name);                                     │
 * │        return fn(...args);                                                  │
 * │      };                                                                     │
 * │    }                                                                        │
 * │                                                                             │
 * └─────────────────────────────────────────────────────────────────────────────┘
 *
 *
 * ┌─────────────────────────────────────────────────────────────────────────────┐
 * │ WHY HIGHER-ORDER FUNCTIONS MATTER                                           │
 * ├─────────────────────────────────────────────────────────────────────────────┤
 * │                                                                             │
 * │ 1. ABSTRACTION                                                              │
 * │    Extract common patterns, pass the varying part as a function             │
 * │                                                                             │
 * │    // Instead of writing 10 different loops...                              │
 * │    numbers.map(transform);                                                  │
 * │    numbers.filter(predicate);                                               │
 * │                                                                             │
 * │                                                                             │
 * │ 2. COMPOSITION                                                              │
 * │    Build complex behavior from simple functions                             │
 * │                                                                             │
 * │    var process = compose(validate, transform, save);                        │
 * │                                                                             │
 * │                                                                             │
 * │ 3. REUSABILITY                                                              │
 * │    Create specialized functions from general ones                           │
 * │                                                                             │
 * │    var double = multiplier(2);                                              │
 * │    var triple = multiplier(3);                                              │
 * │                                                                             │
 * └─────────────────────────────────────────────────────────────────────────────┘
 *
 *
 * ┌─────────────────────────────────────────────────────────────────────────────┐
 * │ INTERVIEW ANSWER                                                            │
 * ├─────────────────────────────────────────────────────────────────────────────┤
 * │                                                                             │
 * │ "A higher-order function is a function that either takes a function as      │
 * │  an argument, returns a function, or both.                                  │
 * │                                                                             │
 * │  This is possible because JavaScript treats functions as first-class        │
 * │  citizens - they can be assigned to variables, passed as arguments,         │
 * │  and returned from other functions.                                         │
 * │                                                                             │
 * │  Common examples include:                                                   │
 * │  - Array methods like map, filter, reduce (take callback functions)         │
 * │  - setTimeout/setInterval (take callback functions)                         │
 * │  - Function factories that return specialized functions                     │
 * │  - Decorators/wrappers that enhance existing functions                      │
 * │                                                                             │
 * │  HOFs enable powerful patterns like composition, partial application,       │
 * │  and currying - fundamental concepts in functional programming."            │
 * │                                                                             │
 * └─────────────────────────────────────────────────────────────────────────────┘
 *
 *
 * RUN: node docs/05-higher-order-functions/00-hof-basics.js
 */
