/**
 * TOPIC: Hoisting in Conditionals — Declaration vs Assignment
 *
 * CONCEPT:
 * var declarations are hoisted even from blocks that NEVER execute.
 * But assignments only happen if the code actually runs.
 *
 * ┌───────────────────────┬─────────────────────┬──────────────────┐
 * │ Phase                 │ What Happens        │ When             │
 * ├───────────────────────┼─────────────────────┼──────────────────┤
 * │ CREATION (hoisting)   │ var x = undefined   │ Always (scanned) │
 * │ EXECUTION (assignment)│ x = 5               │ Only if runs     │
 * └───────────────────────┴─────────────────────┴──────────────────┘
 *
 * KEY INSIGHT:
 * var x = 5  is actually TWO separate operations:
 *
 *   1. var x      → happens during creation phase (always)
 *   2. x = 5      → happens during execution phase (only if reached)
 *
 * This is why code inside if(false) still affects hoisting!
 */

console.log(x);  // undefined (x exists, not assigned)

if (false) {
  var x = 5;     // Declaration hoisted, assignment NEVER runs
}

console.log(x);  // undefined (still not assigned)

/**
 * WHAT HAPPENS:
 *
 * CREATION PHASE:
 *   - JS scans entire code, finds "var x" inside if block
 *   - Hoists it: var x = undefined (at global/function level)
 *   - The if(false) condition doesn't matter during this phase
 *
 * EXECUTION PHASE:
 *   - console.log(x) → x exists, value is undefined → prints undefined
 *   - if (false) { ... } → condition is false, block SKIPPED
 *   - x = 5 NEVER EXECUTES
 *   - console.log(x) → still undefined
 *
 * OUTPUT:
 *   undefined
 *   undefined
 *
 * ┌────────────────────────────────────────────────────────────────┐
 * │ COMMON MISTAKE:                                                │
 * │ Thinking "if block never runs, so var x doesn't exist"        │
 * │                                                                 │
 * │ REALITY:                                                        │
 * │ Declaration is hoisted regardless of whether block executes.   │
 * │ Only the assignment depends on execution flow.                 │
 * └────────────────────────────────────────────────────────────────┘
 *
 * COMPARISON WITH let:
 *
 * if (false) {
 *   let y = 5;
 * }
 * console.log(y);  // ReferenceError: y is not defined
 *
 * let is block-scoped, so it only exists INSIDE the if block.
 * Even if the block ran, y wouldn't be accessible outside.
 *
 * INTERVIEW QUESTIONS:
 *
 * Q: "What does this output? console.log(x); if(false){ var x = 5; } console.log(x);"
 * A: Both log `undefined`. The `var x` declaration is hoisted to the function/global
 *    scope during the Creation Phase — the `if(false)` block is irrelevant for
 *    hoisting. But `x = 5` never runs because the block is skipped.
 *
 * Q: "How would this behave differently with `let` instead of `var`?"
 * A: With `let`, `x` would be block-scoped to the `if` block. Outside the block,
 *    `x` doesn't exist at all — you'd get ReferenceError ("x is not defined"),
 *    not `undefined`. This is one of the key reasons ES6 introduced `let`/`const`.
 *
 * Q: "Why does var ignore block scope?"
 * A: `var` was designed in 1995 to be function-scoped only. Blocks like `if`,
 *    `for`, `while` are NOT scope boundaries for `var`. ES6 `let`/`const` fixed
 *    this by introducing true block scoping.
 *
 * RUN: node docs/javascript/01-execution-context/05-hoisting-conditionals.js
 */
