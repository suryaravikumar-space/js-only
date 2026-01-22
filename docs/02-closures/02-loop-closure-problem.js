/**
 * CHALLENGE 02: The Loop Closure Problem
 *
 * ╔════════════════════════════════════════════════════════════════════════════╗
 * ║ THE GOLDEN RULE                                                            ║
 * ╠════════════════════════════════════════════════════════════════════════════╣
 * ║                                                                            ║
 * ║ Closures capture REFERENCES to variables, not VALUES.                      ║
 * ║ In a loop with var, all closures share the SAME variable!                  ║
 * ║                                                                            ║
 * ║   for (var i = 0; i < 3; i++) {                                            ║
 * ║     funcs.push(function() { return i; });                                  ║
 * ║   }                                                                        ║
 * ║   // All functions return 3! They share the same i.                        ║
 * ║                                                                            ║
 * ╚════════════════════════════════════════════════════════════════════════════╝
 */

function createFunctions() {
  var result = [];

  for (var i = 0; i < 3; i++) {
    result.push(function() {
      return i;
    });
  }

  return result;
}

var funcs = createFunctions();

console.log('A:', funcs[0]());
console.log('B:', funcs[1]());
console.log('C:', funcs[2]());

/**
 * OUTPUT:
 *   A: 3
 *   B: 3
 *   C: 3
 *
 *
 * ╔════════════════════════════════════════════════════════════════════════════╗
 * ║ STEP-BY-STEP BREAKDOWN                                                     ║
 * ╠════════════════════════════════════════════════════════════════════════════╣
 * ║                                                                            ║
 * ║ DURING THE LOOP:                                                           ║
 * ║                                                                            ║
 * ║   Iteration 0: i = 0                                                       ║
 * ║     → Push function that returns i (NOT 0, but the variable i!)            ║
 * ║                                                                            ║
 * ║   Iteration 1: i = 1                                                       ║
 * ║     → Push function that returns i (NOT 1, but the variable i!)            ║
 * ║                                                                            ║
 * ║   Iteration 2: i = 2                                                       ║
 * ║     → Push function that returns i (NOT 2, but the variable i!)            ║
 * ║                                                                            ║
 * ║   Loop check: i = 3, 3 < 3 is false, loop ends                             ║
 * ║                                                                            ║
 * ║                                                                            ║
 * ║ AFTER THE LOOP:                                                            ║
 * ║   • i = 3 (final value after loop terminates)                              ║
 * ║   • All three functions have closure over the SAME i variable              ║
 * ║   • When called, they all look up i and find 3                             ║
 * ║                                                                            ║
 * ║                                                                            ║
 * ║ WHY THIS HAPPENS:                                                          ║
 * ║   • var is FUNCTION-scoped, not block-scoped                               ║
 * ║   • There's only ONE i variable for the entire function                    ║
 * ║   • All closures reference that same variable                              ║
 * ║   • By the time closures are called, i has already changed to 3            ║
 * ║                                                                            ║
 * ╚════════════════════════════════════════════════════════════════════════════╝
 *
 *
 * ┌─────────────────────────────────────────────────────────────────────────────┐
 * │ VISUAL: Why All Functions Return 3                                          │
 * ├─────────────────────────────────────────────────────────────────────────────┤
 * │                                                                             │
 * │   ┌───────────────────────────────────────────────────────────────┐         │
 * │   │  createFunctions scope                                        │         │
 * │   │                                                               │         │
 * │   │  var i = 3  (final value after loop) ◄────────────────────────┼───┐     │
 * │   │                                                               │   │     │
 * │   │  result[0] = function() { return i; } ────────────────────────┼───┤     │
 * │   │  result[1] = function() { return i; } ────────────────────────┼───┤     │
 * │   │  result[2] = function() { return i; } ────────────────────────┼───┘     │
 * │   │                                                               │         │
 * │   └───────────────────────────────────────────────────────────────┘         │
 * │                                                                             │
 * │   All three functions point to the SAME i variable!                         │
 * │   When called later, they all see i = 3.                                    │
 * │                                                                             │
 * └─────────────────────────────────────────────────────────────────────────────┘
 *
 *
 * ┌─────────────────────────────────────────────────────────────────────────────┐
 * │ THE COMMON EXPECTATION vs REALITY                                           │
 * ├─────────────────────────────────────────────────────────────────────────────┤
 * │                                                                             │
 * │ WHAT DEVELOPERS EXPECT:                                                     │
 * │   funcs[0]() → 0  (captured when i was 0)                                   │
 * │   funcs[1]() → 1  (captured when i was 1)                                   │
 * │   funcs[2]() → 2  (captured when i was 2)                                   │
 * │                                                                             │
 * │ WHAT ACTUALLY HAPPENS:                                                      │
 * │   funcs[0]() → 3  (looks up i NOW, i = 3)                                   │
 * │   funcs[1]() → 3  (looks up i NOW, i = 3)                                   │
 * │   funcs[2]() → 3  (looks up i NOW, i = 3)                                   │
 * │                                                                             │
 * │                                                                             │
 * │ THE MENTAL MODEL FIX:                                                       │
 * │                                                                             │
 * │   DON'T think: "function captures the VALUE of i"                           │
 * │   DO think:    "function has a REFERENCE to the variable i"                 │
 * │                                                                             │
 * │   The closure doesn't snapshot the value - it keeps a live link             │
 * │   to the variable that can be read (or modified!) later.                    │
 * │                                                                             │
 * └─────────────────────────────────────────────────────────────────────────────┘
 *
 *
 * ┌─────────────────────────────────────────────────────────────────────────────┐
 * │ WHY THIS IS THE #1 CLOSURE BUG                                              │
 * ├─────────────────────────────────────────────────────────────────────────────┤
 * │                                                                             │
 * │ This bug appears in:                                                        │
 * │                                                                             │
 * │ 1. Event handlers in loops:                                                 │
 * │    for (var i = 0; i < buttons.length; i++) {                               │
 * │      buttons[i].onclick = function() {                                      │
 * │        console.log('Button', i, 'clicked');  // Always last index!          │
 * │      };                                                                     │
 * │    }                                                                        │
 * │                                                                             │
 * │ 2. setTimeout in loops:                                                     │
 * │    for (var i = 0; i < 3; i++) {                                            │
 * │      setTimeout(function() {                                                │
 * │        console.log(i);  // Always 3!                                        │
 * │      }, 1000);                                                              │
 * │    }                                                                        │
 * │                                                                             │
 * │ 3. Callbacks in async operations:                                           │
 * │    for (var i = 0; i < urls.length; i++) {                                  │
 * │      fetch(urls[i]).then(function(response) {                               │
 * │        console.log('Response', i);  // Always last index!                   │
 * │      });                                                                    │
 * │    }                                                                        │
 * │                                                                             │
 * └─────────────────────────────────────────────────────────────────────────────┘
 *
 *
 * ┌─────────────────────────────────────────────────────────────────────────────┐
 * │ INTERVIEW ANSWER                                                            │
 * ├─────────────────────────────────────────────────────────────────────────────┤
 * │                                                                             │
 * │ "This is the classic loop closure problem. All three functions return 3     │
 * │  because closures capture references to variables, not their values.        │
 * │                                                                             │
 * │  With var, there's only ONE i variable scoped to the function. All three    │
 * │  closures share a reference to this same i. By the time we call the         │
 * │  functions, the loop has finished and i equals 3.                           │
 * │                                                                             │
 * │  The fix is to create a new scope for each iteration. We can do this with:  │
 * │  1. let instead of var (creates new binding per iteration)                  │
 * │  2. IIFE to capture the current value                                       │
 * │  3. forEach which creates a new callback scope each iteration               │
 * │                                                                             │
 * │  This is probably the most common closure bug in JavaScript and             │
 * │  frequently asked in interviews."                                           │
 * │                                                                             │
 * └─────────────────────────────────────────────────────────────────────────────┘
 *
 *
 * RUN: node docs/02-closures/02-loop-closure-problem.js
 */
