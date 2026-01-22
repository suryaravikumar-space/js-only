/**
 * CHALLENGE 07: Closures in Callbacks
 *
 * ╔════════════════════════════════════════════════════════════════════════════╗
 * ║ THE GOLDEN RULE                                                            ║
 * ╠════════════════════════════════════════════════════════════════════════════╣
 * ║                                                                            ║
 * ║ Callbacks execute LATER but still access their closure variables.          ║
 * ║ The closure "freezes" access to the scope, not the values!                 ║
 * ║                                                                            ║
 * ║   for (var i...) callbacks share ONE i (bug!)                              ║
 * ║   for (let j...) callbacks each get their OWN j (works!)                   ║
 * ║                                                                            ║
 * ╚════════════════════════════════════════════════════════════════════════════╝
 */

function setupDelayedLogs() {
  for (var i = 1; i <= 3; i++) {
    setTimeout(function() {
      console.log('var:', i);
    }, i * 100);
  }

  for (let j = 1; j <= 3; j++) {
    setTimeout(function() {
      console.log('let:', j);
    }, j * 100 + 500);
  }
}

setupDelayedLogs();

/**
 * OUTPUT (in order):
 *   var: 4
 *   var: 4
 *   var: 4
 *   let: 1
 *   let: 2
 *   let: 3
 *
 *
 * ╔════════════════════════════════════════════════════════════════════════════╗
 * ║ STEP-BY-STEP BREAKDOWN                                                     ║
 * ╠════════════════════════════════════════════════════════════════════════════╣
 * ║                                                                            ║
 * ║ TIMELINE:                                                                  ║
 * ║                                                                            ║
 * ║   Time 0ms:                                                                ║
 * ║     • var loop runs completely (i goes 1→2→3→4)                            ║
 * ║     • let loop runs completely (separate j each iteration)                 ║
 * ║     • All 6 timeouts are SCHEDULED (not executed!)                         ║
 * ║     • At this point: var i = 4                                             ║
 * ║                                                                            ║
 * ║   Time 100ms:                                                              ║
 * ║     • First var callback runs                                              ║
 * ║     • Looks up i → finds 4                                                 ║
 * ║     • Prints "var: 4"                                                      ║
 * ║                                                                            ║
 * ║   Time 200ms:                                                              ║
 * ║     • Second var callback runs                                             ║
 * ║     • Looks up i → finds 4                                                 ║
 * ║     • Prints "var: 4"                                                      ║
 * ║                                                                            ║
 * ║   Time 300ms:                                                              ║
 * ║     • Third var callback runs                                              ║
 * ║     • Looks up i → finds 4                                                 ║
 * ║     • Prints "var: 4"                                                      ║
 * ║                                                                            ║
 * ║   Time 600ms:                                                              ║
 * ║     • First let callback runs                                              ║
 * ║     • Has its OWN j from iteration 1                                       ║
 * ║     • Prints "let: 1"                                                      ║
 * ║                                                                            ║
 * ║   Time 700ms:                                                              ║
 * ║     • Second let callback runs                                             ║
 * ║     • Has its OWN j from iteration 2                                       ║
 * ║     • Prints "let: 2"                                                      ║
 * ║                                                                            ║
 * ║   Time 800ms:                                                              ║
 * ║     • Third let callback runs                                              ║
 * ║     • Has its OWN j from iteration 3                                       ║
 * ║     • Prints "let: 3"                                                      ║
 * ║                                                                            ║
 * ╚════════════════════════════════════════════════════════════════════════════╝
 *
 *
 * ┌─────────────────────────────────────────────────────────────────────────────┐
 * │ WHY var FAILS                                                               │
 * ├─────────────────────────────────────────────────────────────────────────────┤
 * │                                                                             │
 * │   for (var i = 1; i <= 3; i++) {                                            │
 * │     setTimeout(function() { console.log(i); }, i * 100);                    │
 * │   }                                                                         │
 * │                                                                             │
 * │   ┌───────────────────────────────────────────────────────────────┐         │
 * │   │  setupDelayedLogs scope                                       │         │
 * │   │                                                               │         │
 * │   │  var i = 4  (after loop finishes) ◄───────────────────────────┼──┐      │
 * │   │                                                               │  │      │
 * │   │  setTimeout callback 1 ───────────────────────────────────────┼──┤      │
 * │   │  setTimeout callback 2 ───────────────────────────────────────┼──┤      │
 * │   │  setTimeout callback 3 ───────────────────────────────────────┼──┘      │
 * │   │                                                               │         │
 * │   └───────────────────────────────────────────────────────────────┘         │
 * │                                                                             │
 * │   All three callbacks share the SAME i variable!                            │
 * │   By the time they run, i = 4.                                              │
 * │                                                                             │
 * └─────────────────────────────────────────────────────────────────────────────┘
 *
 *
 * ┌─────────────────────────────────────────────────────────────────────────────┐
 * │ WHY let WORKS                                                               │
 * ├─────────────────────────────────────────────────────────────────────────────┤
 * │                                                                             │
 * │   for (let j = 1; j <= 3; j++) {                                            │
 * │     setTimeout(function() { console.log(j); }, j * 100);                    │
 * │   }                                                                         │
 * │                                                                             │
 * │   ┌─ Iteration 1 ─────┐  ┌─ Iteration 2 ─────┐  ┌─ Iteration 3 ─────┐       │
 * │   │  let j = 1        │  │  let j = 2        │  │  let j = 3        │       │
 * │   │       ↑           │  │       ↑           │  │       ↑           │       │
 * │   │  callback ────────┼  │  callback ────────┼  │  callback ────────┼       │
 * │   │  logs 1           │  │  logs 2           │  │  logs 3           │       │
 * │   └───────────────────┘  └───────────────────┘  └───────────────────┘       │
 * │                                                                             │
 * │   Each iteration creates a NEW j variable!                                  │
 * │   Each callback has its own j in its closure.                               │
 * │                                                                             │
 * └─────────────────────────────────────────────────────────────────────────────┘
 *
 *
 * ┌─────────────────────────────────────────────────────────────────────────────┐
 * │ REAL WORLD: Event Handlers in Loops                                         │
 * ├─────────────────────────────────────────────────────────────────────────────┤
 * │                                                                             │
 * │ BROKEN (var):                                                               │
 * │                                                                             │
 * │   for (var i = 0; i < buttons.length; i++) {                                │
 * │     buttons[i].addEventListener('click', function() {                       │
 * │       console.log('Button', i, 'clicked');                                  │
 * │     });                                                                     │
 * │   }                                                                         │
 * │   // All buttons say "Button 5 clicked" (or whatever the final i is)        │
 * │                                                                             │
 * │                                                                             │
 * │ FIXED (let):                                                                │
 * │                                                                             │
 * │   for (let i = 0; i < buttons.length; i++) {                                │
 * │     buttons[i].addEventListener('click', function() {                       │
 * │       console.log('Button', i, 'clicked');                                  │
 * │     });                                                                     │
 * │   }                                                                         │
 * │   // Each button correctly reports its index                                │
 * │                                                                             │
 * │                                                                             │
 * │ FIXED (forEach):                                                            │
 * │                                                                             │
 * │   buttons.forEach(function(btn, index) {                                    │
 * │     btn.addEventListener('click', function() {                              │
 * │       console.log('Button', index, 'clicked');                              │
 * │     });                                                                     │
 * │   });                                                                       │
 * │   // Each callback has its own index                                        │
 * │                                                                             │
 * └─────────────────────────────────────────────────────────────────────────────┘
 *
 *
 * ┌─────────────────────────────────────────────────────────────────────────────┐
 * │ INTERVIEW ANSWER                                                            │
 * ├─────────────────────────────────────────────────────────────────────────────┤
 * │                                                                             │
 * │ "When callbacks are created in loops, they capture a closure over the       │
 * │  loop variable. With var, there's only one variable for the whole loop,     │
 * │  so all callbacks share it. By the time they execute (asynchronously),      │
 * │  the loop has finished and the variable has its final value.                │
 * │                                                                             │
 * │  With let, each iteration creates a new binding. This is a special          │
 * │  behavior defined in the spec for let in for-loops - each iteration         │
 * │  gets its own copy of the variable.                                         │
 * │                                                                             │
 * │  This is why the var loop prints 4, 4, 4 (final value after loop ends)      │
 * │  while the let loop prints 1, 2, 3 (each callback has its own value).       │
 * │                                                                             │
 * │  The fix in ES5 was to use an IIFE to create a new scope each iteration.    │
 * │  In ES6+, just use let - it was specifically designed to solve this         │
 * │  exact problem."                                                            │
 * │                                                                             │
 * └─────────────────────────────────────────────────────────────────────────────┘
 *
 *
 * RUN: node docs/02-closures/07-closures-in-callbacks.js
 */
