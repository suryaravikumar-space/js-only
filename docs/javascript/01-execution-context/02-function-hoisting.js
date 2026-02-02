/**
 * TOPIC: Function Hoisting — Declarations vs Expressions
 *
 * STORY:
 * Think of a company directory. Function declarations are like permanent
 * employees — their names and roles are listed on day one. Function expressions
 * are like contractors — the desk (variable) is reserved but empty until the
 * contractor actually shows up (execution phase).
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
 *   Arrow Function (ES6): const baz = () => {}
 *   → Same as function expression — follows const/let TDZ rules
 *   → ReferenceError if accessed before declaration
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
 * ES6 NOTE:
 * With arrow functions (ES6), you'd write:
 *   const bar = () => { console.log('bar'); };
 * This follows `const` rules — TDZ applies, so calling bar() before
 * the declaration gives ReferenceError (not TypeError like with `var`).
 *
 * INTERVIEW QUESTIONS:
 *
 * Q: "What's the difference between function declaration and function expression?"
 * A: A function declaration (`function foo() {}`) is fully hoisted — you can
 *    call it before it appears in code. A function expression (`const foo = function() {}`)
 *    follows the variable's hoisting rules. With `var`, it's `undefined` before
 *    the line (TypeError). With `const`/`let`, it's in the TDZ (ReferenceError).
 *
 * Q: "Can you call an arrow function before its declaration?"
 * A: No. Arrow functions are always expressions, never declarations. They follow
 *    the hosting rules of the variable they're assigned to (`const`/`let` → TDZ,
 *    `var` → undefined). There is no "arrow function declaration" syntax.
 *
 * RUN: node docs/javascript/01-execution-context/02-function-hoisting.js
 */
