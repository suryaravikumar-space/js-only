/**
 * TOPIC: Combined Tricky Question — Interview Style
 *
 * This question tests multiple concepts at once:
 *   - var hoisting
 *   - let TDZ
 *   - Scope shadowing
 *   - Error behavior (uncaught errors stop execution)
 */

var a = 10;

function outer() {
  console.log(a);   // undefined
  console.log(b);   // ReferenceError — STOPS HERE

  var a = 20;
  let b = 30;

  function inner() {
    console.log(a);
  }

  inner();
}

outer();

/**
 * OUTPUT:
 *   undefined
 *   ReferenceError: Cannot access 'b' before initialization
 *
 * Only 2 outputs, not 4. Error kills the rest.
 *
 *
 * ╔════════════════════════════════════════════════════════════════╗
 * ║ STEP-BY-STEP ANALYSIS                                         ║
 * ╠════════════════════════════════════════════════════════════════╣
 * ║                                                                ║
 * ║ CREATION PHASE of outer():                                    ║
 * ║                                                                ║
 * ║   Variable Environment = {                                    ║
 * ║     a: undefined,        ← var hoisted                        ║
 * ║     inner: [function]    ← function hoisted                   ║
 * ║   }                                                           ║
 * ║                                                                ║
 * ║   let b is registered but in TDZ (not in Variable Env yet)    ║
 * ║                                                                ║
 * ║ EXECUTION PHASE of outer():                                   ║
 * ║                                                                ║
 * ║   Line: console.log(a)                                        ║
 * ║   → Looks for 'a' in outer's scope                            ║
 * ║   → Found! a = undefined (local var, not global)              ║
 * ║   → Prints: undefined                                         ║
 * ║                                                                ║
 * ║   Line: console.log(b)                                        ║
 * ║   → Looks for 'b' in outer's scope                            ║
 * ║   → Found! But b is in TDZ                                    ║
 * ║   → ReferenceError: Cannot access 'b' before initialization   ║
 * ║   → EXECUTION STOPS                                           ║
 * ║                                                                ║
 * ║   Lines after error: NEVER EXECUTED                           ║
 * ║   - var a = 20      (never runs)                              ║
 * ║   - let b = 30      (never runs)                              ║
 * ║   - inner()         (never runs)                              ║
 * ║                                                                ║
 * ╚════════════════════════════════════════════════════════════════╝
 *
 *
 * ┌────────────────────────────────────────────────────────────────┐
 * │ WHY console.log(a) PRINTS undefined, NOT 10                   │
 * ├────────────────────────────────────────────────────────────────┤
 * │                                                                │
 * │ Global has: var a = 10                                        │
 * │ outer() has: var a = 20 (declared later in code)              │
 * │                                                                │
 * │ But var is HOISTED during creation phase!                     │
 * │                                                                │
 * │ So when console.log(a) runs:                                  │
 * │   - JS looks in outer's scope first                           │
 * │   - Finds local 'a' (hoisted, value = undefined)              │
 * │   - SHADOWS the global a = 10                                 │
 * │   - Prints: undefined                                         │
 * │                                                                │
 * │ The global a = 10 is NEVER accessible inside outer()          │
 * │                                                                │
 * └────────────────────────────────────────────────────────────────┘
 *
 *
 * ┌────────────────────────────────────────────────────────────────┐
 * │ KEY INSIGHT: UNCAUGHT ERRORS STOP EXECUTION                   │
 * ├────────────────────────────────────────────────────────────────┤
 * │                                                                │
 * │ When an error is thrown and NOT caught (try/catch):           │
 * │   - Current function stops immediately                        │
 * │   - Call stack unwinds                                        │
 * │   - Program terminates (or browser shows error)               │
 * │                                                                │
 * │ This is why TDZ errors are "dangerous":                       │
 * │   - They crash your program                                   │
 * │   - But they HELP you find bugs early (fail fast)             │
 * │                                                                │
 * └────────────────────────────────────────────────────────────────┘
 *
 *
 * ┌────────────────────────────────────────────────────────────────┐
 * │ WHAT IF WE WANTED ALL 4 CONSOLE.LOGS TO RUN?                  │
 * ├────────────────────────────────────────────────────────────────┤
 * │                                                                │
 * │ Option 1: Move declarations before usage                      │
 * │                                                                │
 * │ function outer() {                                            │
 * │   var a = 20;          // declare first                       │
 * │   let b = 30;          // declare first                       │
 * │   console.log(a);      // 20                                  │
 * │   console.log(b);      // 30                                  │
 * │   ...                                                         │
 * │ }                                                             │
 * │                                                                │
 * │ Option 2: Use try/catch to handle error                       │
 * │                                                                │
 * │ function outer() {                                            │
 * │   console.log(a);                                             │
 * │   try {                                                       │
 * │     console.log(b);    // error caught                        │
 * │   } catch(e) {                                                │
 * │     console.log('b not ready');                               │
 * │   }                                                           │
 * │   var a = 20;                                                 │
 * │   let b = 30;                                                 │
 * │   // continues...                                             │
 * │ }                                                             │
 * │                                                                │
 * └────────────────────────────────────────────────────────────────┘
 *
 *
 * ┌────────────────────────────────────────────────────────────────┐
 * │ INTERVIEW TIP                                                 │
 * ├────────────────────────────────────────────────────────────────┤
 * │                                                                │
 * │ When given a tricky question like this:                       │
 * │                                                                │
 * │ 1. Identify all declarations (var, let, const, function)      │
 * │ 2. Apply hoisting rules for each                              │
 * │ 3. Check for shadowing (local vs outer scope)                 │
 * │ 4. Check for TDZ (let/const accessed before declaration)      │
 * │ 5. Remember: errors STOP execution unless caught              │
 * │                                                                │
 * │ Don't assume all console.logs will run!                       │
 * │                                                                │
 * └────────────────────────────────────────────────────────────────┘
 *
 *
 * RUN: node docs/01-execution-context/13-combined-tricky.js
 */
