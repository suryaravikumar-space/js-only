/**
 * TOPIC: let vs var — The Temporal Dead Zone (TDZ)
 *
 * CONCEPT:
 * Both var and let are "hoisted" but behave differently:
 *
 *   var  → hoisted AND initialized to 'undefined'
 *   let  → hoisted but NOT initialized (stays in TDZ)
 *
 * TDZ (Temporal Dead Zone):
 * The period between entering a scope and the declaration line
 * where the variable exists but cannot be accessed.
 *
 * WHY THIS MATTERS:
 * - Prevents bugs from accessing variables before they're ready
 * - Makes code behavior more predictable
 * - This is why modern JS prefers let/const over var
 */

var x = 10;

function test() {
  console.log(x);  // ReferenceError: Cannot access 'x' before initialization
  let x = 20;
  console.log(x);
}

test();

/**
 * WHAT HAPPENS:
 *
 * 1. Global x = 10 is created
 * 2. test() is called
 * 3. CREATION PHASE: JS sees 'let x' → registers local x (NOT initialized)
 *    - Local x now SHADOWS global x
 *    - Local x is in TDZ
 * 4. EXECUTION: console.log(x) → tries to access x → still in TDZ → ERROR
 *
 * KEY INSIGHT:
 * The error proves let IS hoisted. If it wasn't, JS would have
 * accessed the global x (value 10) instead of throwing an error.
 *
 * RUN: node docs/01-let-vs-var.js
 */
