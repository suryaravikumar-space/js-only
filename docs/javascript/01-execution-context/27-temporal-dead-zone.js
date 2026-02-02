/**
 * CHALLENGE 27: Temporal Dead Zone (TDZ)
 *
 * ╔════════════════════════════════════════════════════════════════════════════╗
 * ║ THE CRITICAL LESSON                                                        ║
 * ╠════════════════════════════════════════════════════════════════════════════╣
 * ║                                                                            ║
 * ║ let and const have a TEMPORAL DEAD ZONE (TDZ)!                             ║
 * ║                                                                            ║
 * ║   console.log(x);  // ReferenceError: Cannot access 'x' before init        ║
 * ║   let x = 5;                                                               ║
 * ║                                                                            ║
 * ║ var is HOISTED with value undefined:                                       ║
 * ║   console.log(y);  // undefined (hoisted, but not initialized)             ║
 * ║   var y = 5;                                                               ║
 * ║                                                                            ║
 * ║ The TDZ exists from the start of the block until the declaration.          ║
 * ║                                                                            ║
 * ╚════════════════════════════════════════════════════════════════════════════╝
 */

console.log('A:', typeof undeclaredVar);

var varVariable = 'var value';
console.log('B:', varVariable);

function testTDZ() {
  console.log('C:', typeof maybeExists);

  var hoistedVar = 'hoisted';
  console.log('D:', hoistedVar);
}

testTDZ();

function demonstrateLet() {
  var result = [];

  for (var i = 0; i < 3; i++) {
    result.push(function() { return i; });
  }

  return result[0]();
}

console.log('E:', demonstrateLet());

/**
 * OUTPUT:
 *   A: undefined
 *   B: var value
 *   C: undefined
 *   D: hoisted
 *   E: 3
 *
 *
 * ╔════════════════════════════════════════════════════════════════════════════╗
 * ║ STEP-BY-STEP BREAKDOWN                                                     ║
 * ╠════════════════════════════════════════════════════════════════════════════╣
 * ║                                                                            ║
 * ║ A: typeof undeclaredVar                                                    ║
 * ║ ───────────────────────                                                    ║
 * ║   • undeclaredVar doesn't exist at all                                     ║
 * ║   • typeof is special - it doesn't throw for undeclared variables          ║
 * ║   • Returns 'undefined' (string)                                           ║
 * ║                                                                            ║
 * ║   NOTE: typeof is the ONLY safe way to check undeclared variables          ║
 * ║   Doing `if (undeclaredVar)` would throw ReferenceError                    ║
 * ║                                                                            ║
 * ║                                                                            ║
 * ║ B: varVariable                                                             ║
 * ║ ──────────────                                                             ║
 * ║   • var is declared and initialized before this line                       ║
 * ║   • varVariable = 'var value'                                              ║
 * ║   • Result: 'var value'                                                    ║
 * ║                                                                            ║
 * ║                                                                            ║
 * ║ C: typeof maybeExists                                                      ║
 * ║ ─────────────────────                                                      ║
 * ║   • maybeExists is not declared in this scope                              ║
 * ║   • typeof returns 'undefined' for undeclared variables                    ║
 * ║   • Result: 'undefined'                                                    ║
 * ║                                                                            ║
 * ║                                                                            ║
 * ║ D: hoistedVar                                                              ║
 * ║ ─────────────                                                              ║
 * ║   • var hoistedVar is hoisted to top of function                           ║
 * ║   • But we're accessing it AFTER the assignment                            ║
 * ║   • Result: 'hoisted'                                                      ║
 * ║                                                                            ║
 * ║                                                                            ║
 * ║ E: demonstrateLet() → 3  ← THE CLASSIC CLOSURE BUG!                        ║
 * ║ ──────────────────────                                                     ║
 * ║   • var i is hoisted to function scope (not block!)                        ║
 * ║   • Loop creates 3 functions, all referencing the SAME i                   ║
 * ║   • After loop, i = 3                                                      ║
 * ║   • All functions return 3 (not 0, 1, 2!)                                  ║
 * ║                                                                            ║
 * ║   FIX with let:                                                            ║
 * ║   for (let i = 0; ...) → Each iteration gets its own i                     ║
 * ║   result[0]() would return 0                                               ║
 * ║                                                                            ║
 * ╚════════════════════════════════════════════════════════════════════════════╝
 *
 *
 * ┌─────────────────────────────────────────────────────────────────────────────┐
 * │ var vs let vs const HOISTING                                                │
 * ├─────────────────────────────────────────────────────────────────────────────┤
 * │                                                                             │
 * │ ┌──────────┬────────────────────┬─────────────────┬───────────────────────┐ │
 * │ │ Keyword  │ Hoisted?           │ Initial Value   │ TDZ?                  │ │
 * │ ├──────────┼────────────────────┼─────────────────┼───────────────────────┤ │
 * │ │ var      │ Yes, to function   │ undefined       │ No                    │ │
 * │ │ let      │ Yes, to block      │ <uninitialized> │ YES                   │ │
 * │ │ const    │ Yes, to block      │ <uninitialized> │ YES                   │ │
 * │ └──────────┴────────────────────┴─────────────────┴───────────────────────┘ │
 * │                                                                             │
 * │ IMPORTANT:                                                                  │
 * │ let and const ARE hoisted (JavaScript knows they exist), but they're        │
 * │ NOT initialized until the declaration line is reached.                      │
 * │                                                                             │
 * │ This period (from start of block to declaration) is the TDZ.                │
 * │                                                                             │
 * └─────────────────────────────────────────────────────────────────────────────┘
 *
 *
 * ┌─────────────────────────────────────────────────────────────────────────────┐
 * │ VISUAL: Temporal Dead Zone                                                  │
 * ├─────────────────────────────────────────────────────────────────────────────┤
 * │                                                                             │
 * │   {                                                                         │
 * │     // ─────────────────────────────────────────────────                    │
 * │     // │ TEMPORAL DEAD ZONE for 'x'                   │                     │
 * │     // │                                              │                     │
 * │     // │ console.log(x);  // ReferenceError!          │                     │
 * │     // │ x = 5;           // ReferenceError!          │                     │
 * │     // │                                              │                     │
 * │     // ─────────────────────────────────────────────────                    │
 * │                                                                             │
 * │     let x = 10;  // ← TDZ ends here, x is now initialized                   │
 * │                                                                             │
 * │     console.log(x);  // 10 - works fine                                     │
 * │   }                                                                         │
 * │                                                                             │
 * │                                                                             │
 * │   COMPARISON WITH var:                                                      │
 * │                                                                             │
 * │   {                                                                         │
 * │     console.log(y);  // undefined (not an error!)                           │
 * │     var y = 10;                                                             │
 * │     console.log(y);  // 10                                                  │
 * │   }                                                                         │
 * │                                                                             │
 * └─────────────────────────────────────────────────────────────────────────────┘
 *
 *
 * ┌─────────────────────────────────────────────────────────────────────────────┐
 * │ THE CLASSIC LOOP CLOSURE BUG                                                │
 * ├─────────────────────────────────────────────────────────────────────────────┤
 * │                                                                             │
 * │ PROBLEM with var:                                                           │
 * │                                                                             │
 * │   for (var i = 0; i < 3; i++) {                                             │
 * │     setTimeout(function() {                                                 │
 * │       console.log(i);  // Always prints 3, 3, 3                             │
 * │     }, 100);                                                                │
 * │   }                                                                         │
 * │                                                                             │
 * │   WHY? There's only ONE 'i' variable, shared by all callbacks.              │
 * │   By the time callbacks run, loop is done and i = 3.                        │
 * │                                                                             │
 * │                                                                             │
 * │ FIX 1: Use let (creates new binding each iteration)                         │
 * │                                                                             │
 * │   for (let i = 0; i < 3; i++) {                                             │
 * │     setTimeout(function() {                                                 │
 * │       console.log(i);  // Prints 0, 1, 2                                    │
 * │     }, 100);                                                                │
 * │   }                                                                         │
 * │                                                                             │
 * │                                                                             │
 * │ FIX 2: IIFE (ES5 way)                                                       │
 * │                                                                             │
 * │   for (var i = 0; i < 3; i++) {                                             │
 * │     (function(j) {  // j captures current i                                 │
 * │       setTimeout(function() {                                               │
 * │         console.log(j);  // Prints 0, 1, 2                                  │
 * │       }, 100);                                                              │
 * │     })(i);                                                                  │
 * │   }                                                                         │
 * │                                                                             │
 * └─────────────────────────────────────────────────────────────────────────────┘
 *
 *
 * ┌─────────────────────────────────────────────────────────────────────────────┐
 * │ TDZ GOTCHAS                                                                 │
 * ├─────────────────────────────────────────────────────────────────────────────┤
 * │                                                                             │
 * │ 1. TDZ affects typeof (unlike undeclared variables!)                        │
 * │                                                                             │
 * │    console.log(typeof undeclared);  // 'undefined' (safe)                   │
 * │    console.log(typeof x);           // ReferenceError!                      │
 * │    let x = 5;                                                               │
 * │                                                                             │
 * │                                                                             │
 * │ 2. TDZ in function default parameters                                       │
 * │                                                                             │
 * │    function broken(a = b, b = 1) {}  // ReferenceError!                     │
 * │    // 'b' is in TDZ when 'a = b' is evaluated                               │
 * │                                                                             │
 * │    function works(a = 1, b = a) {}   // OK                                  │
 * │    // 'a' is already initialized when 'b = a' is evaluated                  │
 * │                                                                             │
 * │                                                                             │
 * │ 3. TDZ in class expressions                                                 │
 * │                                                                             │
 * │    const C = class extends C {};  // ReferenceError!                        │
 * │    // C is in TDZ during the class expression                               │
 * │                                                                             │
 * └─────────────────────────────────────────────────────────────────────────────┘
 *
 *
 * ┌─────────────────────────────────────────────────────────────────────────────┐
 * │ INTERVIEW ANSWER                                                            │
 * ├─────────────────────────────────────────────────────────────────────────────┤
 * │                                                                             │
 * │ "The Temporal Dead Zone is the period between entering a scope and the      │
 * │  point where a let or const variable is declared. During this time,         │
 * │  accessing the variable throws a ReferenceError.                            │
 * │                                                                             │
 * │  This differs from var, which is hoisted with an initial value of           │
 * │  undefined - you can access a var before its declaration without error,     │
 * │  you just get undefined.                                                    │
 * │                                                                             │
 * │  The TDZ exists to catch bugs earlier - accessing a variable before         │
 * │  declaration is usually a mistake, and with let/const you get an error      │
 * │  instead of a silent undefined.                                             │
 * │                                                                             │
 * │  A practical consequence is the classic loop closure bug:                   │
 * │  - var in a loop: all closures share one variable                           │
 * │  - let in a loop: each iteration gets its own binding                       │
 * │                                                                             │
 * │  This is why modern JavaScript prefers let/const over var."                 │
 * │                                                                             │
 * └─────────────────────────────────────────────────────────────────────────────┘
 *
 *
 * RUN: node docs/01-execution-context/27-temporal-dead-zone.js
 */
