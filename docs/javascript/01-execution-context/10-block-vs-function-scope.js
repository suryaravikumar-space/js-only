/**
 * TOPIC: Block Scope vs Function Scope
 *
 * CONCEPT:
 * var, let, and const have DIFFERENT scope rules.
 * This is one of the most commonly confused topics.
 *
 * ┌─────────────────────────────────────────────────────────────────┐
 * │ SCOPE RULES                                                    │
 * ├─────────────────┬───────────────────────────────────────────────┤
 * │ Declaration     │ Scope                                        │
 * ├─────────────────┼───────────────────────────────────────────────┤
 * │ var             │ FUNCTION scope — entire function             │
 * │ let             │ BLOCK scope — only within { }                │
 * │ const           │ BLOCK scope — only within { }                │
 * └─────────────────┴───────────────────────────────────────────────┘
 *
 * "Block" = any { } — if, for, while, or just standalone { }
 * "Function" = the entire function body
 */

function test() {
  if (true) {
    var a = 1;
    let b = 2;
    const c = 3;
  }

  console.log(a);  // 1
  // console.log(b);  // ReferenceError: b is not defined
}

test();

/**
 * OUTPUT:
 *   1
 *   (if b is logged: ReferenceError: b is not defined)
 *
 *
 * ╔════════════════════════════════════════════════════════════════╗
 * ║ VISUAL MODEL: WHERE EACH VARIABLE LIVES                       ║
 * ╠════════════════════════════════════════════════════════════════╣
 * ║                                                                ║
 * ║  function test() {                                            ║
 * ║  ┌─────────────────────────────────────────────────────────┐  ║
 * ║  │ FUNCTION SCOPE                                          │  ║
 * ║  │                                                         │  ║
 * ║  │   var a lives HERE (hoisted to function level)         │  ║
 * ║  │                                                         │  ║
 * ║  │   if (true) {                                          │  ║
 * ║  │   ┌─────────────────────────────────────────────────┐  │  ║
 * ║  │   │ BLOCK SCOPE                                     │  │  ║
 * ║  │   │                                                 │  │  ║
 * ║  │   │   var a = 1;  → ESCAPES to function scope      │  │  ║
 * ║  │   │   let b = 2;  → TRAPPED in block scope         │  │  ║
 * ║  │   │   const c = 3; → TRAPPED in block scope        │  │  ║
 * ║  │   │                                                 │  │  ║
 * ║  │   └─────────────────────────────────────────────────┘  │  ║
 * ║  │                                                         │  ║
 * ║  │   console.log(a); → ✓ a is in function scope          │  ║
 * ║  │   console.log(b); → ✗ b died with the block           │  ║
 * ║  │                                                         │  ║
 * ║  └─────────────────────────────────────────────────────────┘  ║
 * ║  }                                                            ║
 * ║                                                                ║
 * ╚════════════════════════════════════════════════════════════════╝
 *
 *
 * ┌────────────────────────────────────────────────────────────────┐
 * │ COMMON CONFUSION #1: Mixing Scope Chain with Block Scope      │
 * ├────────────────────────────────────────────────────────────────┤
 * │                                                                │
 * │ WRONG THINKING:                                               │
 * │   "Outer can't see inner, so console.log(a) fails"            │
 * │                                                                │
 * │ WHY IT'S WRONG:                                               │
 * │   Scope chain (inner→outer lookup) is about NESTED FUNCTIONS  │
 * │   Block scope is about WHERE a variable is DECLARED           │
 * │                                                                │
 * │ CORRECT THINKING:                                             │
 * │   "var ignores blocks — it's hoisted to function level"       │
 * │   "let/const respect blocks — they die when block ends"       │
 * │                                                                │
 * └────────────────────────────────────────────────────────────────┘
 *
 *
 * ┌────────────────────────────────────────────────────────────────┐
 * │ COMMON CONFUSION #2: Thinking var has block scope             │
 * ├────────────────────────────────────────────────────────────────┤
 * │                                                                │
 * │ WRONG THINKING:                                               │
 * │   "var a is inside if block, so it's only in that block"      │
 * │                                                                │
 * │ WHY IT'S WRONG:                                               │
 * │   var was created in 1995, before block scope existed in JS   │
 * │   var only respects FUNCTION boundaries, not block { }        │
 * │                                                                │
 * │ CORRECT THINKING:                                             │
 * │   "var is function-scoped — the if { } is invisible to var"   │
 * │                                                                │
 * └────────────────────────────────────────────────────────────────┘
 *
 *
 * ┌────────────────────────────────────────────────────────────────┐
 * │ MEMORY MODEL: WHAT HAPPENS TO VARIABLES                       │
 * └────────────────────────────────────────────────────────────────┘
 *
 * Timeline:
 *
 * 1. test() called
 *    ┌──────────────────────────────────┐
 *    │ test() Variable Environment:     │
 *    │   a: undefined (var hoisted)     │
 *    └──────────────────────────────────┘
 *
 * 2. Enter if block
 *    ┌──────────────────────────────────┐
 *    │ test() Variable Environment:     │
 *    │   a: undefined                   │
 *    │ ┌────────────────────────────┐   │
 *    │ │ Block scope (if):          │   │
 *    │ │   b: TDZ → 2               │   │
 *    │ │   c: TDZ → 3               │   │
 *    │ └────────────────────────────┘   │
 *    └──────────────────────────────────┘
 *
 * 3. Execute assignments
 *    ┌──────────────────────────────────┐
 *    │ test() Variable Environment:     │
 *    │   a: 1                           │
 *    │ ┌────────────────────────────┐   │
 *    │ │ Block scope (if):          │   │
 *    │ │   b: 2                     │   │
 *    │ │   c: 3                     │   │
 *    │ └────────────────────────────┘   │
 *    └──────────────────────────────────┘
 *
 * 4. Exit if block → BLOCK SCOPE DESTROYED
 *    ┌──────────────────────────────────┐
 *    │ test() Variable Environment:     │
 *    │   a: 1   ← still alive           │
 *    │   (b, c are GONE)                │
 *    └──────────────────────────────────┘
 *
 * 5. console.log(a) → 1 ✓
 *    console.log(b) → ReferenceError (b doesn't exist)
 *
 *
 * ┌────────────────────────────────────────────────────────────────┐
 * │ INTERVIEW TIP                                                 │
 * ├────────────────────────────────────────────────────────────────┤
 * │                                                                │
 * │ When asked about var vs let/const, mention SCOPE:             │
 * │                                                                │
 * │ "var is function-scoped — it ignores block boundaries.        │
 * │  let and const are block-scoped — they only exist within      │
 * │  the nearest { } braces. This is why modern JS prefers        │
 * │  let/const — they're more predictable and prevent bugs        │
 * │  from variables leaking out of loops and conditionals."       │
 * │                                                                │
 * └────────────────────────────────────────────────────────────────┘
 *
 *
 * PRACTICAL EXAMPLE — The Classic Loop Problem:
 *
 * // With var (BROKEN):
 * for (var i = 0; i < 3; i++) {
 *   setTimeout(() => console.log(i), 100);
 * }
 * // Output: 3, 3, 3 (var is function-scoped, same i for all)
 *
 * // With let (WORKS):
 * for (let i = 0; i < 3; i++) {
 *   setTimeout(() => console.log(i), 100);
 * }
 * // Output: 0, 1, 2 (let is block-scoped, new i each iteration)
 *
 *
 * INTERVIEW QUESTIONS:
 *
 * Q: "What's the difference between block scope and function scope?"
 * A: Function scope (`var`) means the variable exists throughout the entire
 *    function, regardless of blocks. Block scope (`let`/`const`, ES6) means
 *    the variable only exists inside the `{}` where it's declared — if blocks,
 *    for loops, while loops, or even standalone `{}`.
 *
 * Q: "Why does `for (var i = 0; i < 3; i++) setTimeout(() => console.log(i), 100)`
 *     print 3,3,3 instead of 0,1,2?"
 * A: `var` is function-scoped, so there's only ONE `i` shared across all iterations.
 *    By the time the setTimeout callbacks run, the loop has finished and `i` is 3.
 *    With `let` (ES6), each iteration gets its OWN `i` due to block scoping,
 *    so it correctly prints 0, 1, 2.
 *
 * RUN: node docs/javascript/01-execution-context/10-block-vs-function-scope.js
 */
