/**
 * TOPIC: const/let Function Expressions and TDZ
 *
 * ES6 NOTE:
 * `const` (ES6) creates a block-scoped, non-reassignable binding.
 * Using `const` for function expressions is the modern best practice
 * because it prevents accidental reassignment of function references.
 *
 * CONCEPT:
 * Combining what we learned:
 *
 *   var bar = function() {}
 *   → bar = undefined during creation → TypeError when called
 *
 *   const bar = function() {}
 *   → bar is in TDZ during creation → ReferenceError when accessed
 *
 * The function expression doesn't change the hoisting rules.
 * What matters is HOW the variable is declared (var vs const/let).
 */

foo();
bar();

function foo() {
  console.log('foo');
}

const bar = function() {
  console.log('bar');
};

/**
 * WHAT HAPPENS:
 *
 * CREATION PHASE:
 *   - function foo() {...} → fully hoisted
 *   - const bar → registered but in TDZ (not initialized)
 *
 * EXECUTION PHASE:
 *   - foo() → works! prints "foo"
 *   - bar() → bar is in TDZ → ReferenceError: Cannot access 'bar' before initialization
 *
 * OUTPUT:
 *   foo
 *   ReferenceError: Cannot access 'bar' before initialization
 *
 * KEY INSIGHT:
 * The error type tells you what went wrong:
 *   - TypeError: bar is not a function → variable exists but isn't a function (var)
 *   - ReferenceError: Cannot access → variable is in TDZ (let/const)
 *
 * INTERVIEW QUESTION:
 *
 * Q: "What error do you get calling a const function expression before declaration?"
 * A: ReferenceError ("Cannot access before initialization"), NOT TypeError.
 *    With `var`, the variable exists as `undefined`, so calling it gives
 *    TypeError ("not a function"). With `const`/`let`, the variable is in the
 *    TDZ — it can't even be read, so you get ReferenceError first.
 *    The error type is a clue: ReferenceError = TDZ, TypeError = wrong type.
 *
 * Q: "Should I use function declarations or const arrow functions?" (ES6)
 * A: Both are valid. Function declarations are hoisted (callable anywhere),
 *    which some find convenient. `const` arrow functions enforce top-down
 *    readability and prevent reassignment. Most modern codebases prefer
 *    `const` with arrow functions for consistency and immutability.
 *
 * RUN: node docs/javascript/01-execution-context/03-const-function-expression.js
 */
