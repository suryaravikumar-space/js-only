/**
 * TOPIC: The Classic Loop Problem — var vs let in loops
 *
 * CONCEPT:
 * This is one of the MOST ASKED interview questions.
 * It tests understanding of:
 *   - var (function-scoped) vs let (block-scoped)
 *   - Closures (functions remembering their scope)
 *   - setTimeout and async execution
 *
 * WHY THIS MATTERS:
 * This bug appears in real production code all the time.
 * Understanding it = understanding JavaScript scope deeply.
 *
 *
 * ╔════════════════════════════════════════════════════════════════╗
 * ║ CRITICAL UNDERSTANDING: setTimeout DOES NOT RUN IMMEDIATELY   ║
 * ╠════════════════════════════════════════════════════════════════╣
 * ║                                                                ║
 * ║ setTimeout schedules a function to run LATER (after delay).   ║
 * ║ The loop completes FIRST, then callbacks run.                 ║
 * ║                                                                ║
 * ║ TIMELINE:                                                     ║
 * ║                                                                ║
 * ║ 0ms    Loop runs completely:                                  ║
 * ║        i=0 → schedule callback #1                             ║
 * ║        i=1 → schedule callback #2                             ║
 * ║        i=2 → schedule callback #3                             ║
 * ║        i=3 → loop exits                                       ║
 * ║        (Loop DONE. All callbacks waiting.)                    ║
 * ║                                                                ║
 * ║ 100ms  Callbacks start running:                               ║
 * ║        Callback #1: "What is i?" → finds 3                    ║
 * ║        Callback #2: "What is i?" → finds 3                    ║
 * ║        Callback #3: "What is i?" → finds 3                    ║
 * ║                                                                ║
 * ║ The callbacks don't STORE the value.                          ║
 * ║ They store a REFERENCE to the variable.                       ║
 * ║ When they run later, they ask "what is i NOW?" → i is 3.      ║
 * ║                                                                ║
 * ╚════════════════════════════════════════════════════════════════╝
 */

// PROBLEM: var (prints 3, 3, 3)
for (var i = 0; i < 3; i++) {
  setTimeout(function() {
    console.log(i);
  }, 100);
}

/**
 * OUTPUT:
 *   3
 *   3
 *   3
 *
 *
 * ╔════════════════════════════════════════════════════════════════╗
 * ║ STEP-BY-STEP: WHAT HAPPENS                                    ║
 * ╠════════════════════════════════════════════════════════════════╣
 * ║                                                                ║
 * ║ STEP 1: Loop runs COMPLETELY (synchronous)                    ║
 * ║                                                                ║
 * ║   i = 0 → schedule setTimeout callback #1                     ║
 * ║   i = 1 → schedule setTimeout callback #2                     ║
 * ║   i = 2 → schedule setTimeout callback #3                     ║
 * ║   i = 3 → condition false, loop exits                         ║
 * ║                                                                ║
 * ║ STEP 2: After 100ms, callbacks execute                        ║
 * ║                                                                ║
 * ║   Callback #1 runs: console.log(i) → i is 3 → prints 3        ║
 * ║   Callback #2 runs: console.log(i) → i is 3 → prints 3        ║
 * ║   Callback #3 runs: console.log(i) → i is 3 → prints 3        ║
 * ║                                                                ║
 * ╚════════════════════════════════════════════════════════════════╝
 *
 *
 * ┌────────────────────────────────────────────────────────────────┐
 * │ WHY DOES THIS HAPPEN?                                         │
 * ├────────────────────────────────────────────────────────────────┤
 * │                                                                │
 * │ var is FUNCTION-SCOPED (or global if no function).            │
 * │ There is only ONE variable i shared by all 3 callbacks.       │
 * │                                                                │
 * │ ┌─────────────────────────────────────────────────────────┐   │
 * │ │ Global Scope                                            │   │
 * │ │                                                         │   │
 * │ │   var i = 3  ←── ONE variable (final value)             │   │
 * │ │                                                         │   │
 * │ │   callback #1 ──┐                                       │   │
 * │ │   callback #2 ──┼── all point to the SAME i             │   │
 * │ │   callback #3 ──┘                                       │   │
 * │ │                                                         │   │
 * │ └─────────────────────────────────────────────────────────┘   │
 * │                                                                │
 * │ When callbacks run, they look up i → find 3                   │
 * │                                                                │
 * └────────────────────────────────────────────────────────────────┘
 *
 *
 * ╔════════════════════════════════════════════════════════════════╗
 * ║ THE FIX: USE let INSTEAD OF var                               ║
 * ╠════════════════════════════════════════════════════════════════╣
 * ║                                                                ║
 * ║ for (let i = 0; i < 3; i++) {                                 ║
 * ║   setTimeout(function() {                                     ║
 * ║     console.log(i);                                           ║
 * ║   }, 100);                                                    ║
 * ║ }                                                             ║
 * ║                                                                ║
 * ║ OUTPUT: 0, 1, 2                                               ║
 * ║                                                                ║
 * ╚════════════════════════════════════════════════════════════════╝
 *
 *
 * ┌────────────────────────────────────────────────────────────────┐
 * │ WHY DOES let FIX IT?                                          │
 * ├────────────────────────────────────────────────────────────────┤
 * │                                                                │
 * │ let is BLOCK-SCOPED.                                          │
 * │ Each loop iteration creates a NEW i in a new block scope.     │
 * │                                                                │
 * │ ┌──────────────────────────────┐                              │
 * │ │ Iteration 1 (block)         │                              │
 * │ │   let i = 0                 │                              │
 * │ │   callback #1 → points here │                              │
 * │ └──────────────────────────────┘                              │
 * │                                                                │
 * │ ┌──────────────────────────────┐                              │
 * │ │ Iteration 2 (block)         │                              │
 * │ │   let i = 1                 │                              │
 * │ │   callback #2 → points here │                              │
 * │ └──────────────────────────────┘                              │
 * │                                                                │
 * │ ┌──────────────────────────────┐                              │
 * │ │ Iteration 3 (block)         │                              │
 * │ │   let i = 2                 │                              │
 * │ │   callback #3 → points here │                              │
 * │ └──────────────────────────────┘                              │
 * │                                                                │
 * │ Each callback has its OWN i captured (closure).               │
 * │                                                                │
 * └────────────────────────────────────────────────────────────────┘
 *
 *
 * ┌────────────────────────────────────────────────────────────────┐
 * │ COMMON CONFUSION: "Isn't let i redeclared each iteration?"    │
 * ├────────────────────────────────────────────────────────────────┤
 * │                                                                │
 * │ QUESTION:                                                     │
 * │ "With let, we define i=0, then i=1, then i=2.                 │
 * │  Isn't that redeclaring the same variable? Why no error?"     │
 * │                                                                │
 * │ ANSWER:                                                       │
 * │ Each loop iteration is a DIFFERENT block scope.               │
 * │ They're NOT in the same block.                                │
 * │                                                                │
 * │ What for-let ACTUALLY does (simplified):                      │
 * │                                                                │
 * │   {  // Block 1                                               │
 * │     let i = 0;                                                │
 * │     setTimeout(...);                                          │
 * │   }                                                           │
 * │                                                                │
 * │   {  // Block 2 — DIFFERENT scope, NOT redeclaration          │
 * │     let i = 1;                                                │
 * │     setTimeout(...);                                          │
 * │   }                                                           │
 * │                                                                │
 * │   {  // Block 3 — DIFFERENT scope, NOT redeclaration          │
 * │     let i = 2;                                                │
 * │     setTimeout(...);                                          │
 * │   }                                                           │
 * │                                                                │
 * │ These are 3 DIFFERENT blocks, so 3 separate let declarations. │
 * │ No redeclaration error because they're in separate scopes.    │
 * │                                                                │
 * └────────────────────────────────────────────────────────────────┘
 *
 *
 * ┌────────────────────────────────────────────────────────────────┐
 * │ VISUAL COMPARISON: var vs let IN LOOP                         │
 * ├────────────────────────────────────────────────────────────────┤
 * │                                                                │
 * │ var i — ONE variable, all callbacks share it:                 │
 * │                                                                │
 * │ ┌─────────────────────────────────────────────────────────┐   │
 * │ │ Function/Global Scope                                   │   │
 * │ │                                                         │   │
 * │ │   var i  ←── ONE variable (final value = 3)             │   │
 * │ │                                                         │   │
 * │ │   ┌───────┐   ┌───────┐   ┌───────┐                    │   │
 * │ │   │Block 1│   │Block 2│   │Block 3│                    │   │
 * │ │   │ i=0→3 │   │ i=1→3 │   │ i=2→3 │                    │   │
 * │ │   └───┬───┘   └───┬───┘   └───┬───┘                    │   │
 * │ │       └───────────┴───────────┴────► ALL point to      │   │
 * │ │                                       SAME variable     │   │
 * │ └─────────────────────────────────────────────────────────┘   │
 * │                                                                │
 * │                                                                │
 * │ let i — THREE variables, each callback has its own:           │
 * │                                                                │
 * │   ┌─────────────┐   ┌─────────────┐   ┌─────────────┐         │
 * │   │ Block 1     │   │ Block 2     │   │ Block 3     │         │
 * │   │ let i = 0   │   │ let i = 1   │   │ let i = 2   │         │
 * │   │      │      │   │      │      │   │      │      │         │
 * │   │      ▼      │   │      ▼      │   │      ▼      │         │
 * │   │ Variable #1 │   │ Variable #2 │   │ Variable #3 │         │
 * │   └─────────────┘   └─────────────┘   └─────────────┘         │
 * │                                                                │
 * │   Callback #1       Callback #2       Callback #3             │
 * │   sees 0            sees 1            sees 2                  │
 * │                                                                │
 * └────────────────────────────────────────────────────────────────┘
 *
 *
 * ┌────────────────────────────────────────────────────────────────┐
 * │ SIMPLE ANALOGY                                                │
 * ├────────────────────────────────────────────────────────────────┤
 * │                                                                │
 * │ var = One whiteboard, everyone reads from it                  │
 * │                                                                │
 * │   Whiteboard: [  3  ]    ← final value                        │
 * │       ↑   ↑   ↑                                               │
 * │       │   │   └── Callback #3 reads: 3                        │
 * │       │   └────── Callback #2 reads: 3                        │
 * │       └────────── Callback #1 reads: 3                        │
 * │                                                                │
 * │                                                                │
 * │ let = Each person has their own notepad                       │
 * │                                                                │
 * │   Notepad #1: [ 0 ] ← Callback #1 reads: 0                    │
 * │   Notepad #2: [ 1 ] ← Callback #2 reads: 1                    │
 * │   Notepad #3: [ 2 ] ← Callback #3 reads: 2                    │
 * │                                                                │
 * └────────────────────────────────────────────────────────────────┘
 *
 *
 * ┌────────────────────────────────────────────────────────────────┐
 * │ ALTERNATIVE FIX: IIFE (Before ES6)                            │
 * ├────────────────────────────────────────────────────────────────┤
 * │                                                                │
 * │ Before let existed, developers used IIFE to create scope:     │
 * │                                                                │
 * │ for (var i = 0; i < 3; i++) {                                 │
 * │   (function(j) {                // IIFE creates new scope     │
 * │     setTimeout(function() {                                   │
 * │       console.log(j);           // j is captured, not i       │
 * │     }, 100);                                                  │
 * │   })(i);                        // pass current i as j        │
 * │ }                                                             │
 * │                                                                │
 * │ OUTPUT: 0, 1, 2                                               │
 * │                                                                │
 * │ IIFE = Immediately Invoked Function Expression                │
 * │ It creates a new function scope, capturing i's value as j.    │
 * │                                                                │
 * └────────────────────────────────────────────────────────────────┘
 *
 *
 * ┌────────────────────────────────────────────────────────────────┐
 * │ SUMMARY TABLE                                                 │
 * ├────────────────────┬───────────────────────────────────────────┤
 * │ Approach           │ Output                                   │
 * ├────────────────────┼───────────────────────────────────────────┤
 * │ for (var i...)     │ 3, 3, 3 (one shared variable)            │
 * │ for (let i...)     │ 0, 1, 2 (new variable each iteration)    │
 * │ IIFE with var      │ 0, 1, 2 (manual closure)                 │
 * └────────────────────┴───────────────────────────────────────────┘
 *
 *
 * ┌────────────────────────────────────────────────────────────────┐
 * │ INTERVIEW ANSWER                                              │
 * ├────────────────────────────────────────────────────────────────┤
 * │                                                                │
 * │ "This prints 3, 3, 3 because var is function-scoped. There's  │
 * │  only one variable i shared by all callbacks. By the time     │
 * │  setTimeout callbacks run, the loop has finished and i is 3.  │
 * │                                                                │
 * │  The fix is to use let instead of var. let is block-scoped,   │
 * │  so each iteration creates a new i. Each callback captures    │
 * │  its own i through closure, giving us 0, 1, 2.                │
 * │                                                                │
 * │  Before ES6, we used IIFE to manually create a new scope      │
 * │  and capture the value."                                      │
 * │                                                                │
 * └────────────────────────────────────────────────────────────────┘
 *
 *
 * CONNECTION TO EXECUTION CONTEXT:
 *
 * This is about SCOPE (Variable Environment):
 *   - var creates variable in function's Variable Environment
 *   - let creates variable in block's Lexical Environment
 *
 * This is ALSO a preview of CLOSURES:
 *   - The callback function "remembers" its surrounding scope
 *   - We'll cover closures deeply in the next topic
 *
 *
 * ES6 NOTE:
 * The modern way to write this uses `let` + arrow functions:
 *   for (let i = 0; i < 3; i++) {
 *     setTimeout(() => console.log(i), 100);
 *   }
 * Arrow functions (=>) are shorter and inherit `this` lexically.
 * Combined with `let`, this is clean, readable, and bug-free.
 *
 * RUN: node docs/javascript/01-execution-context/14-loop-var-settimeout.js
 */
