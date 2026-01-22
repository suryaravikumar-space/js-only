/**
 * CHALLENGE 03: Loop Closure Fixes
 *
 * ╔════════════════════════════════════════════════════════════════════════════╗
 * ║ THE GOLDEN RULE                                                            ║
 * ╠════════════════════════════════════════════════════════════════════════════╣
 * ║                                                                            ║
 * ║ To fix the loop closure problem:                                           ║
 * ║                                                                            ║
 * ║   1. Use let (creates new binding each iteration)                          ║
 * ║   2. Use IIFE (captures current value in new scope)                        ║
 * ║   3. Use forEach (creates new callback scope per iteration)                ║
 * ║                                                                            ║
 * ╚════════════════════════════════════════════════════════════════════════════╝
 */

// Fix 1: IIFE
function createWithIIFE() {
  var result = [];
  for (var i = 0; i < 3; i++) {
    (function(j) {
      result.push(function() { return j; });
    })(i);
  }
  return result;
}

// Fix 2: let
function createWithLet() {
  var result = [];
  for (let i = 0; i < 3; i++) {
    result.push(function() { return i; });
  }
  return result;
}

var iifeFuncs = createWithIIFE();
var letFuncs = createWithLet();

console.log('A:', iifeFuncs[0](), iifeFuncs[1](), iifeFuncs[2]());
console.log('B:', letFuncs[0](), letFuncs[1](), letFuncs[2]());

/**
 * OUTPUT:
 *   A: 0 1 2
 *   B: 0 1 2
 *
 *
 * ╔════════════════════════════════════════════════════════════════════════════╗
 * ║ STEP-BY-STEP BREAKDOWN                                                     ║
 * ╠════════════════════════════════════════════════════════════════════════════╣
 * ║                                                                            ║
 * ║ FIX 1: IIFE (Immediately Invoked Function Expression)                      ║
 * ║ ──────────────────────────────────────────────────────                     ║
 * ║                                                                            ║
 * ║   for (var i = 0; i < 3; i++) {                                            ║
 * ║     (function(j) {           // IIFE creates new scope                     ║
 * ║       // j is a NEW variable, initialized with current i                   ║
 * ║       result.push(function() { return j; });                               ║
 * ║     })(i);                   // Pass current i as argument                 ║
 * ║   }                                                                        ║
 * ║                                                                            ║
 * ║   Iteration 0: IIFE called with j=0, closure captures j=0                  ║
 * ║   Iteration 1: IIFE called with j=1, closure captures j=1                  ║
 * ║   Iteration 2: IIFE called with j=2, closure captures j=2                  ║
 * ║                                                                            ║
 * ║   Each IIFE creates its OWN j variable!                                    ║
 * ║                                                                            ║
 * ║                                                                            ║
 * ║ FIX 2: let (Block Scoping)                                                 ║
 * ║ ──────────────────────────                                                 ║
 * ║                                                                            ║
 * ║   for (let i = 0; i < 3; i++) {                                            ║
 * ║     // let creates a NEW i for each iteration!                             ║
 * ║     result.push(function() { return i; });                                 ║
 * ║   }                                                                        ║
 * ║                                                                            ║
 * ║   Iteration 0: New i=0 created, closure captures this i                    ║
 * ║   Iteration 1: New i=1 created, closure captures this i                    ║
 * ║   Iteration 2: New i=2 created, closure captures this i                    ║
 * ║                                                                            ║
 * ║   The spec says: let in for-loop creates fresh binding per iteration       ║
 * ║                                                                            ║
 * ╚════════════════════════════════════════════════════════════════════════════╝
 *
 *
 * ┌─────────────────────────────────────────────────────────────────────────────┐
 * │ VISUAL: IIFE Creates Separate Scopes                                        │
 * ├─────────────────────────────────────────────────────────────────────────────┤
 * │                                                                             │
 * │   for (var i...) with IIFE:                                                 │
 * │                                                                             │
 * │   ┌─ IIFE scope (i=0) ─┐  ┌─ IIFE scope (i=1) ─┐  ┌─ IIFE scope (i=2) ─┐   │
 * │   │  var j = 0         │  │  var j = 1         │  │  var j = 2         │   │
 * │   │  function → j ─────┼  │  function → j ─────┼  │  function → j ─────┼   │
 * │   │  returns 0         │  │  returns 1         │  │  returns 2         │   │
 * │   └────────────────────┘  └────────────────────┘  └────────────────────┘   │
 * │                                                                             │
 * │   Three separate j variables, three separate closures!                      │
 * │                                                                             │
 * └─────────────────────────────────────────────────────────────────────────────┘
 *
 *
 * ┌─────────────────────────────────────────────────────────────────────────────┐
 * │ VISUAL: let Creates Separate Bindings                                       │
 * ├─────────────────────────────────────────────────────────────────────────────┤
 * │                                                                             │
 * │   for (let i...) - each iteration has its own i:                            │
 * │                                                                             │
 * │   ┌─ Iteration 0 scope ─┐  ┌─ Iteration 1 scope ─┐  ┌─ Iteration 2 scope ─┐│
 * │   │  let i = 0          │  │  let i = 1          │  │  let i = 2          ││
 * │   │  function → i ──────┼  │  function → i ──────┼  │  function → i ──────┼│
 * │   │  returns 0          │  │  returns 1          │  │  returns 2          ││
 * │   └─────────────────────┘  └─────────────────────┘  └─────────────────────┘│
 * │                                                                             │
 * │   The JavaScript engine creates a new i for each iteration!                 │
 * │                                                                             │
 * └─────────────────────────────────────────────────────────────────────────────┘
 *
 *
 * ┌─────────────────────────────────────────────────────────────────────────────┐
 * │ ALL THREE FIXES COMPARED                                                    │
 * ├─────────────────────────────────────────────────────────────────────────────┤
 * │                                                                             │
 * │ 1. IIFE (ES5 way):                                                          │
 * │    for (var i = 0; i < 3; i++) {                                            │
 * │      (function(j) {                                                         │
 * │        arr.push(function() { return j; });                                  │
 * │      })(i);                                                                 │
 * │    }                                                                        │
 * │                                                                             │
 * │ 2. let (ES6 - PREFERRED):                                                   │
 * │    for (let i = 0; i < 3; i++) {                                            │
 * │      arr.push(function() { return i; });                                    │
 * │    }                                                                        │
 * │                                                                             │
 * │ 3. forEach (functional style):                                              │
 * │    [0, 1, 2].forEach(function(i) {                                          │
 * │      arr.push(function() { return i; });                                    │
 * │    });                                                                      │
 * │                                                                             │
 * │ ┌──────────┬────────────────┬───────────────────────────────────────────┐   │
 * │ │ Method   │ Best For       │ Notes                                     │   │
 * │ ├──────────┼────────────────┼───────────────────────────────────────────┤   │
 * │ │ IIFE     │ Legacy ES5     │ Verbose but works everywhere              │   │
 * │ │ let      │ Modern code    │ Cleanest, most readable                   │   │
 * │ │ forEach  │ Array loops    │ No index management needed                │   │
 * │ └──────────┴────────────────┴───────────────────────────────────────────┘   │
 * │                                                                             │
 * └─────────────────────────────────────────────────────────────────────────────┘
 *
 *
 * ┌─────────────────────────────────────────────────────────────────────────────┐
 * │ INTERVIEW ANSWER                                                            │
 * ├─────────────────────────────────────────────────────────────────────────────┤
 * │                                                                             │
 * │ "The loop closure problem occurs because var is function-scoped, so all     │
 * │  closures share the same variable. There are three main fixes:              │
 * │                                                                             │
 * │  1. IIFE: Create a new function scope each iteration. The IIFE parameter    │
 * │     becomes a new variable that captures the current loop value.            │
 * │                                                                             │
 * │  2. let: ES6's let is block-scoped AND the spec specifically says that      │
 * │     for-loops with let create a new binding for each iteration. This        │
 * │     is the cleanest solution in modern JavaScript.                          │
 * │                                                                             │
 * │  3. forEach: Each callback gets its own scope with its own copy of the      │
 * │     iteration variable.                                                     │
 * │                                                                             │
 * │  In modern code, just use let. It was literally designed to fix this        │
 * │  exact problem, among other scoping issues with var."                       │
 * │                                                                             │
 * └─────────────────────────────────────────────────────────────────────────────┘
 *
 *
 * RUN: node docs/02-closures/03-loop-closure-fixes.js
 */
