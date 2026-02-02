/**
 * TOPIC: let vs var — The Temporal Dead Zone (TDZ)
 *
 * STORY:
 * Imagine a hotel. `var` is like a room that's always unlocked — you can
 * walk in anytime but it might be empty (undefined). `let` is like a room
 * with a "Do Not Enter" sign until housekeeping finishes (TDZ). If you try
 * to enter before it's ready, security stops you (ReferenceError).
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
 * ES6 NOTE:
 * `let` and `const` were introduced in ES6 (2015) specifically to fix
 * the confusing behavior of `var`. They are block-scoped (not function-scoped)
 * and enforce the TDZ to catch bugs early.
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
 * INTERVIEW QUESTIONS:
 *
 * Q: "Is `let` hoisted?"
 * A: Yes. `let` IS hoisted, but unlike `var`, it is not initialized.
 *    It stays in the Temporal Dead Zone from the start of the block
 *    until the declaration line. Accessing it in the TDZ throws a
 *    ReferenceError. The proof: if `let` weren't hoisted, JS would
 *    look up the scope chain and find the outer variable instead of
 *    throwing an error.
 *
 * Q: "What is the Temporal Dead Zone?"
 * A: The TDZ is the period between entering a scope and reaching the
 *    `let`/`const` declaration. The variable exists (it's hoisted) but
 *    cannot be read or written. It's "dead" until the declaration runs.
 *    This prevents the confusing behavior of `var` where you get
 *    `undefined` instead of an error.
 *
 * Q: "What are the differences between var, let, and const?" (ES6)
 * A:
 *   ┌──────────┬──────────────┬────────────┬──────────────┐
 *   │          │ Scope        │ Hoisting   │ Reassignment │
 *   ├──────────┼──────────────┼────────────┼──────────────┤
 *   │ var      │ Function     │ undefined  │ Yes          │
 *   │ let      │ Block        │ TDZ        │ Yes          │
 *   │ const    │ Block        │ TDZ        │ No           │
 *   └──────────┴──────────────┴────────────┴──────────────┘
 *
 * RUN: node docs/javascript/01-execution-context/01-let-vs-var.js
 */
