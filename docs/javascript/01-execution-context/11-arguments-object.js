/**
 * TOPIC: The arguments Object
 *
 * CONCEPT:
 * Every function (except arrow functions) has a built-in local
 * variable called `arguments`. You never declare it — JavaScript
 * creates it automatically during the function's creation phase.
 *
 * `arguments` is an ARRAY-LIKE object:
 *   - Has indices (0, 1, 2, ...)
 *   - Has .length property
 *   - But NOT a real array (no .map, .filter, .reduce)
 */

function sum() {
  console.log(arguments);
  console.log(arguments.length);
  console.log(arguments[0] + arguments[1]);
}

sum(3, 5, 7, 9);

/**
 * OUTPUT:
 *   [Arguments] { '0': 3, '1': 5, '2': 7, '3': 9 }
 *   4
 *   8
 *
 *
 * ┌────────────────────────────────────────────────────────────────┐
 * │ WHERE DOES arguments COME FROM?                               │
 * ├────────────────────────────────────────────────────────────────┤
 * │                                                                │
 * │ During function's CREATION PHASE, JavaScript automatically    │
 * │ adds `arguments` to the Variable Environment:                 │
 * │                                                                │
 * │ sum() Variable Environment = {                                │
 * │   arguments: { '0': 3, '1': 5, '2': 7, '3': 9, length: 4 }   │
 * │ }                                                             │
 * │                                                                │
 * │ You never declare it — it's built-in to every function.      │
 * │                                                                │
 * └────────────────────────────────────────────────────────────────┘
 *
 *
 * ┌────────────────────────────────────────────────────────────────┐
 * │ PARAMETERS vs ARGUMENTS                                       │
 * ├─────────────────┬──────────────────────────────────────────────┤
 * │ Term            │ Definition                                   │
 * ├─────────────────┼──────────────────────────────────────────────┤
 * │ Parameters      │ Names declared in function definition       │
 * │                 │ function add(a, b) — a, b are parameters    │
 * ├─────────────────┼──────────────────────────────────────────────┤
 * │ Arguments       │ Actual values passed when calling           │
 * │                 │ add(3, 5) — 3, 5 are arguments              │
 * └─────────────────┴──────────────────────────────────────────────┘
 *
 *
 * ╔════════════════════════════════════════════════════════════════╗
 * ║ KEY INSIGHT: JAVASCRIPT DOESN'T ENFORCE PARAMETER COUNT       ║
 * ╠════════════════════════════════════════════════════════════════╣
 * ║                                                                ║
 * ║ Unlike Java/C++, JavaScript doesn't care how many arguments   ║
 * ║ you pass. It's flexible and forgiving.                        ║
 * ║                                                                ║
 * ║ function sum() {       // 0 parameters declared               ║
 * ║   // ...                                                      ║
 * ║ }                                                             ║
 * ║ sum(3, 5, 7, 9);       // 4 arguments passed — JS: "OK!"     ║
 * ║                                                                ║
 * ╚════════════════════════════════════════════════════════════════╝
 *
 *
 * ┌────────────────────────────────────────────────────────────────┐
 * │ WHAT HAPPENS WITH MISMATCH?                                   │
 * ├────────────────────────────┬───────────────────────────────────┤
 * │ Scenario                   │ What JavaScript Does              │
 * ├────────────────────────────┼───────────────────────────────────┤
 * │ More arguments than params │ Extra ignored (saved in arguments)│
 * │ Fewer arguments than params│ Missing params = undefined        │
 * └────────────────────────────┴───────────────────────────────────┘
 *
 * Example — fewer arguments than parameters:
 *
 * function greet(name, age) {
 *   console.log(name);    // "John"
 *   console.log(age);     // undefined (not passed)
 * }
 * greet("John");          // Only 1 argument, but 2 parameters
 *
 *
 * ┌────────────────────────────────────────────────────────────────┐
 * │ WHY DOES THIS EXIST?                                          │
 * ├────────────────────────────────────────────────────────────────┤
 * │                                                                │
 * │ JavaScript was designed to be FLEXIBLE (1995, built in 10     │
 * │ days). The `arguments` object was the solution:               │
 * │                                                                │
 * │ "Even if you don't declare parameters, you can still access   │
 * │  ALL passed values through `arguments`"                       │
 * │                                                                │
 * │ function sum() {                                              │
 * │   let total = 0;                                              │
 * │   for (let i = 0; i < arguments.length; i++) {                │
 * │     total += arguments[i];                                    │
 * │   }                                                           │
 * │   return total;                                               │
 * │ }                                                             │
 * │ sum(1, 2, 3, 4, 5);  // Returns 15                            │
 * │                                                                │
 * └────────────────────────────────────────────────────────────────┘
 *
 *
 * ┌────────────────────────────────────────────────────────────────┐
 * │ MODERN ALTERNATIVE: REST PARAMETERS (...args)                 │
 * ├────────────────────────────────────────────────────────────────┤
 * │                                                                │
 * │ Today we use rest parameters instead of `arguments`:          │
 * │                                                                │
 * │ function sum(...numbers) {   // numbers is a REAL array       │
 * │   return numbers.reduce((a, b) => a + b, 0);                  │
 * │ }                                                             │
 * │ sum(1, 2, 3, 4, 5);  // Returns 15                            │
 * │                                                                │
 * │ ┌───────────────────┬─────────────────────────────────────┐   │
 * │ │ arguments         │ ...rest                             │   │
 * │ ├───────────────────┼─────────────────────────────────────┤   │
 * │ │ Array-like object │ Real array                          │   │
 * │ │ No .map, .filter  │ Has all array methods               │   │
 * │ │ Legacy (ES5)      │ Modern (ES6+)                       │   │
 * │ │ All functions     │ Must be declared                    │   │
 * │ └───────────────────┴─────────────────────────────────────┘   │
 * │                                                                │
 * └────────────────────────────────────────────────────────────────┘
 *
 *
 * ┌────────────────────────────────────────────────────────────────┐
 * │ ARROW FUNCTIONS: NO arguments OBJECT                          │
 * ├────────────────────────────────────────────────────────────────┤
 * │                                                                │
 * │ Arrow functions do NOT have their own `arguments`:            │
 * │                                                                │
 * │ const sum = () => {                                           │
 * │   console.log(arguments);  // ReferenceError or inherits     │
 * │ };                                                            │
 * │                                                                │
 * │ This is one key difference between regular and arrow funcs.   │
 * │                                                                │
 * └────────────────────────────────────────────────────────────────┘
 *
 *
 * INTERVIEW QUESTIONS:
 *
 * Q: "What is the `arguments` object?"
 * A: It's an array-like object automatically available inside every regular
 *    function (not arrow functions). It contains all passed arguments
 *    regardless of how many parameters were declared. It has indices and
 *    `.length` but no array methods like `.map` or `.filter`.
 *
 * Q: "What's the ES6 alternative to `arguments`?"
 * A: Rest parameters (`...args`). Unlike `arguments`, rest params create
 *    a real Array with all array methods. They must be explicitly declared:
 *    `function sum(...numbers) { return numbers.reduce((a, b) => a + b, 0); }`
 *    Arrow functions don't have `arguments`, so rest params are the only option.
 *
 * Q: "Do arrow functions have an `arguments` object?"
 * A: No. Arrow functions do NOT have their own `arguments`. If you reference
 *    `arguments` inside an arrow function, it inherits from the enclosing
 *    regular function (if any), or throws ReferenceError. Use `...args` instead.
 *
 * RUN: node docs/javascript/01-execution-context/11-arguments-object.js
 */
