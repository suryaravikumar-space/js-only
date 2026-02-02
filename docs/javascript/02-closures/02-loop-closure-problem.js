/**
 * TOPIC: The Loop Closure Problem
 *
 * STORY: THE SHARED WHITEBOARD
 * Imagine 3 students are told to write down a number from a whiteboard. But instead
 * of writing it down immediately, they each promise to "look at the whiteboard later."
 * Meanwhile, the teacher keeps erasing and writing new numbers. When the students
 * finally look, they all see the LAST number (3), not the number that was there
 * when they were assigned. That's the loop closure problem — all closures share
 * one whiteboard (variable), not their own copy.
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
  const result = []; // ES6: const

  for (var i = 0; i < 3; i++) { // var intentional — this IS the bug being demonstrated
    result.push(function() {
      return i;
    });
  }

  return result;
}

const funcs = createFunctions(); // ES6: const

console.log('A:', funcs[0]());
console.log('B:', funcs[1]());
console.log('C:', funcs[2]());

/**
 * ES6 FIX (just change var to let):
 *
 *   for (let i = 0; i < 3; i++) {
 *     result.push(() => i);  // arrow function + let = each iteration gets own i
 *   }
 *   // Returns 0, 1, 2 as expected!
 */

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
 * INTERVIEW QUESTIONS:
 *
 * Q: "What will this code output and why?"
 *    for (var i = 0; i < 3; i++) { setTimeout(function() { console.log(i); }, 100); }
 * A: It prints 3, 3, 3. All closures share the same `var i` which is function-scoped.
 *    By the time setTimeout callbacks execute, the loop has finished and i = 3.
 *    Closures capture references, not values.
 *
 * Q: "How do you fix the loop closure problem?"
 * A: Three ways:
 *    1. `let` instead of `var` (ES6) — creates a new binding per iteration
 *    2. IIFE: `(function(j) { ... })(i)` — captures current value in new scope
 *    3. `forEach` — each callback gets its own scope with the current element
 *    The modern best practice is simply using `let`.
 *
 * Q: "Why does `let` fix the loop closure problem but `var` doesn't?"
 * A: `var` is function-scoped — one variable shared across all iterations. `let` is
 *    block-scoped — the JS engine creates a NEW binding of `i` for each iteration
 *    of the loop. Each closure captures its own separate `i`.
 *
 *
 * RUN: node docs/javascript/02-closures/02-loop-closure-problem.js
 */
