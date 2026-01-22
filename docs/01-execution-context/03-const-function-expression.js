/**
 * TOPIC: const/let Function Expressions and TDZ
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
 *   - TypeError: bar is not a function → variable exists but isn't a function
 *   - ReferenceError: Cannot access → variable is in TDZ
 *
 * RUN: node docs/03-const-function-expression.js
 */
