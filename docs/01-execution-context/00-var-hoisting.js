/**
 * TOPIC: Variable Hoisting with var
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
 * RUN: node docs/00-var-hoisting.js
 */
