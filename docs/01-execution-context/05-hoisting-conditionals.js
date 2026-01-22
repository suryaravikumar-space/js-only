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
 * WHY THIS MATTERS FOR INTERVIEWS:
 * This tests whether you understand:
 *   1. Hoisting is about DECLARATION, not assignment
 *   2. var ignores block scope (hoists to function/global)
 *   3. Creation phase scans ALL code, regardless of conditions
 *
 * RUN: node docs/05-hoisting-conditionals.js
 */
