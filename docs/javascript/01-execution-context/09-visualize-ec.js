/**
 * TOPIC: Visualizing Multiple Execution Contexts
 *
 * CONCEPT:
 * When code runs, JavaScript creates Execution Contexts.
 * Each function call = new EC pushed to call stack.
 * This example shows Global EC + Function EC working together.
 */

var x = 10;

function add(a, b) {
  var result = a + b;
  return result;
}

var sum = add(3, 4);
console.log(sum);

/**
 * ╔════════════════════════════════════════════════════════════════╗
 * ║ STEP 1: GLOBAL EC — CREATION PHASE                            ║
 * ╠════════════════════════════════════════════════════════════════╣
 * ║                                                                ║
 * ║  Variable Environment = {                                     ║
 * ║    x: undefined,         ← var hoisted                        ║
 * ║    add: [function],      ← function fully hoisted             ║
 * ║    sum: undefined        ← var hoisted                        ║
 * ║  }                                                            ║
 * ║                                                                ║
 * ║  Lexical Environment = null (no parent, this is top)          ║
 * ║  this = global/window (node/browser)                            ║
 * ║                                                                ║
 * ╚════════════════════════════════════════════════════════════════╝
 *
 *
 * ╔════════════════════════════════════════════════════════════════╗
 * ║ STEP 2: GLOBAL EC — EXECUTION PHASE                           ║
 * ╠════════════════════════════════════════════════════════════════╣
 * ║                                                                ║
 * ║  Line: var x = 10                                             ║
 * ║  Variable Environment = { x: 10, add: [fn], sum: undefined }  ║
 * ║                                                                ║
 * ║  Line: var sum = add(3, 4)  → FUNCTION CALL!                  ║
 * ║  → New EC created for add()                                   ║
 * ║                                                                ║
 * ╚════════════════════════════════════════════════════════════════╝
 *
 *
 * ╔════════════════════════════════════════════════════════════════╗
 * ║ STEP 3: add() EC — CREATION PHASE                             ║
 * ╠════════════════════════════════════════════════════════════════╣
 * ║                                                                ║
 * ║  Variable Environment = {                                     ║
 * ║    a: 3,                 ← parameter gets value immediately   ║
 * ║    b: 4,                 ← parameter gets value immediately   ║
 * ║    result: undefined     ← var hoisted                        ║
 * ║  }                                                            ║
 * ║                                                                ║
 * ║  Lexical Environment = → points to Global EC                  ║
 * ║  this = global/window (non-strict mode)                       ║
 * ║                                                                ║
 * ╚════════════════════════════════════════════════════════════════╝
 *
 *
 * ╔════════════════════════════════════════════════════════════════╗
 * ║ STEP 4: add() EC — EXECUTION PHASE                            ║
 * ╠════════════════════════════════════════════════════════════════╣
 * ║                                                                ║
 * ║  Line: var result = a + b                                     ║
 * ║  Variable Environment = { a: 3, b: 4, result: 7 }             ║
 * ║                                                                ║
 * ║  Line: return result                                          ║
 * ║  → Returns 7                                                  ║
 * ║  → add() EC is DESTROYED (popped from stack)                  ║
 * ║                                                                ║
 * ╚════════════════════════════════════════════════════════════════╝
 *
 *
 * ╔════════════════════════════════════════════════════════════════╗
 * ║ STEP 5: BACK TO GLOBAL EC                                     ║
 * ╠════════════════════════════════════════════════════════════════╣
 * ║                                                                ║
 * ║  sum = 7 (return value from add())                            ║
 * ║  Variable Environment = { x: 10, add: [fn], sum: 7 }          ║
 * ║                                                                ║
 * ║  Line: console.log(sum)                                       ║
 * ║  → Prints: 7                                                  ║
 * ║                                                                ║
 * ╚════════════════════════════════════════════════════════════════╝
 *
 *
 * ┌────────────────────────────────────────────────────────────────┐
 * │ CALL STACK VISUALIZATION                                      │
 * └────────────────────────────────────────────────────────────────┘
 *
 * 1. Script starts:
 *    ┌─────────────┐
 *    │   Global    │
 *    └─────────────┘
 *
 * 2. add(3,4) called:
 *    ┌─────────────┐
 *    │   add()     │  ← top
 *    ├─────────────┤
 *    │   Global    │  ← waiting
 *    └─────────────┘
 *
 * 3. add() returns:
 *    ┌─────────────┐
 *    │   Global    │  ← back to executing
 *    └─────────────┘
 *
 * 4. Script ends:
 *    (empty stack)
 *
 *
 * ┌────────────────────────────────────────────────────────────────┐
 * │ KEY INSIGHT: PARAMETERS vs VARIABLES                          │
 * ├────────────────────────────────────────────────────────────────┤
 * │                                                                │
 * │  Function PARAMETERS (a, b):                                  │
 * │    → Get values IMMEDIATELY in creation phase                 │
 * │    → a = 3, b = 4 right away                                  │
 * │                                                                │
 * │  Function VARIABLES (result):                                 │
 * │    → Hoisted as undefined in creation phase                   │
 * │    → Get values in execution phase                            │
 * │                                                                │
 * └────────────────────────────────────────────────────────────────┘
 *
 * OUTPUT: 7
 *
 * ES6 NOTE:
 * With ES6, this code would use `const` and `let`:
 *   const x = 10;
 *   const add = (a, b) => { const result = a + b; return result; };
 *   const sum = add(3, 4);
 * The execution context still works the same way — but `const`/`let`
 * variables go into the Lexical Environment (with TDZ) instead of the
 * Variable Environment, and arrow functions inherit `this` lexically.
 *
 * INTERVIEW QUESTION:
 *
 * Q: "Walk me through what happens when `const sum = add(3, 4)` executes."
 * A: 1. JS evaluates `add(3, 4)` — a new Function Execution Context is created
 *    2. Creation Phase: parameters a=3, b=4 are set, local vars are hoisted
 *    3. Execution Phase: `result = a + b` → result = 7, then `return result`
 *    4. The add() EC is popped from the call stack, returning 7
 *    5. Back in the Global EC, `sum` is assigned the return value 7
 *    6. `console.log(sum)` outputs 7
 *
 * RUN: node docs/javascript/01-execution-context/09-visualize-ec.js
 */
