/**
 * TOPIC: Function Hoisting — Declarations vs Expressions
 *
 * CONCEPT:
 * During the creation phase, JS treats functions differently
 * depending on HOW they are defined:
 *
 *   Function Declaration: function foo() {}
 *   → FULLY hoisted (name + body) — ready to call immediately
 *
 *   Function Expression: var bar = function() {}
 *   → Only the variable is hoisted (bar = undefined)
 *   → The function body is assigned during execution phase
 *
 * WHY THIS MATTERS:
 * This explains why you can call function declarations
 * before they appear in code, but not function expressions.
 */

foo();
bar();

function foo() {
  console.log('foo');
}

var bar = function() {
  console.log('bar');
};

/**
 * WHAT HAPPENS:
 *
 * CREATION PHASE:
 *   - function foo() {...} → fully hoisted (name + body ready)
 *   - var bar → hoisted as bar = undefined
 *
 * EXECUTION PHASE:
 *   - foo() → works! prints "foo"
 *   - bar() → bar is undefined → TypeError: bar is not a function
 *
 * OUTPUT:
 *   foo
 *   TypeError: bar is not a function
 *
 * MENTAL MODEL (what JS "sees" after creation phase):
 *
 *   function foo() { console.log('foo'); }  // ready
 *   var bar = undefined;                     // not ready
 *
 *   foo();  // works
 *   bar();  // undefined() → crash
 *
 * KEY INSIGHT:
 * Function declarations are "first-class citizens" in hoisting.
 * Function expressions follow variable hoisting rules (var/let/const).
 *
 * RUN: node docs/02-function-hoisting.js
 */
