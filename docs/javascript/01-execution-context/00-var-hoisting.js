/**
 * TOPIC: Variable Hoisting with var
 *
 * STORY:
 * Think of hoisting like a teacher taking attendance at the start of class.
 * Before the lesson begins (Creation Phase), the teacher calls every name
 * on the list and marks them "present but not ready" (undefined).
 * Then the lesson starts (Execution Phase), and students raise their hands
 * one by one to say what they brought (assignment).
 *
 * CONCEPT:
 * JavaScript executes code in TWO phases:
 *
 *   1. CREATION PHASE (before any code runs)
 *      - JS scans for 'var' declarations
 *      - Variables are registered and set to 'undefined'
 *      - They EXIST but have no assigned value yet
 *
 *   2. EXECUTION PHASE (line-by-line)
 *      - Code runs top to bottom
 *      - Assignments happen when that line executes
 *
 * ES6 NOTE:
 * In modern JS, prefer `let` and `const` over `var`.
 * `let`/`const` are also hoisted but placed in the Temporal Dead Zone (TDZ),
 * so accessing them before declaration throws a ReferenceError instead of
 * silently returning undefined. This catches bugs earlier.
 *
 * WHY THIS MATTERS:
 * Understanding these two phases explains why variables
 * can be accessed before their declaration line.
 */

var a = 1;

function outer() {
  console.log(a);  // undefined
  var a = 2;
  console.log(a);  // 2
}

outer();

/**
 * WHAT HAPPENS:
 *
 * 1. Global: var a = 1 is created
 * 2. outer() is called
 * 3. CREATION PHASE inside outer():
 *    - JS sees 'var a' → creates local variable a = undefined
 *    - This local 'a' SHADOWS the global 'a' (value 1)
 *    - Global 'a' is now inaccessible inside this function
 * 4. EXECUTION PHASE:
 *    - console.log(a) → prints 'undefined' (local a exists, not assigned)
 *    - a = 2 → assigns 2 to local a
 *    - console.log(a) → prints 2
 *
 * OUTPUT:
 *   undefined
 *   2
 *
 * KEY INSIGHT:
 * "Hoisting" doesn't mean code moves. It means during the
 * creation phase, JS registers variables before executing anything.
 *
 * INTERVIEW QUESTIONS:
 *
 * Q: "What is hoisting in JavaScript?"
 * A: Hoisting is the behavior where variable and function declarations
 *    are processed during the Creation Phase before code executes.
 *    `var` declarations are initialized to `undefined`.
 *    Function declarations are fully available.
 *    `let`/`const` are hoisted but remain in the Temporal Dead Zone
 *    until their declaration line — accessing them before that throws
 *    a ReferenceError.
 *
 * Q: "What will this output? console.log(a); var a = 1;"
 * A: `undefined`. During the Creation Phase, `var a` is hoisted and
 *    initialized to `undefined`. The assignment `a = 1` only happens
 *    during the Execution Phase, which is after the console.log.
 *
 * Q: "Does hoisting physically move code to the top?"
 * A: No. Hoisting is a mental model. What actually happens is that the
 *    engine scans for declarations in the Creation Phase and allocates
 *    memory for them before any code runs. The code stays in place.
 *
 * RUN: node docs/javascript/01-execution-context/00-var-hoisting.js
 */
