/**
 * TOPIC: Closures in Callbacks
 *
 * STORY: THE DELAYED PHOTOGRAPHER
 * A photographer is asked to take photos of 3 runners at a race. With `var`,
 * it's like the photographer writes "take photo of runner #i" on a sticky note
 * but only looks at the note after the race is over — by then, the number on
 * the board shows the final runner. With `let`, each runner hands the photographer
 * their own card with their number — no matter when the photo is taken, the card
 * always shows the right number.
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
  for (var i = 1; i <= 3; i++) { // var intentional — demonstrating the bug
    setTimeout(() => { // ES6: arrow function
      console.log('var:', i);
    }, i * 100);
  }

  for (let j = 1; j <= 3; j++) { // ES6: let fixes the closure problem
    setTimeout(() => { // ES6: arrow function
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
 * INTERVIEW QUESTIONS:
 *
 * Q: "Why do setTimeout callbacks inside a var loop all print the same value?"
 * A: With `var`, there's only one variable for the whole loop (function-scoped).
 *    All callbacks share a closure over that same variable. By the time they
 *    execute asynchronously, the loop has finished and the variable has its
 *    final value (4 in this case). Closures capture references, not values.
 *
 * Q: "How does `let` fix the setTimeout-in-loop problem?"
 * A: `let` is block-scoped, and the ES6 spec defines that `let` in a for-loop
 *    creates a new binding for each iteration. Each callback captures its own
 *    separate copy of the variable, so they print 1, 2, 3 as expected.
 *
 * Q: "How would you fix this in ES5 without let?"
 * A: Use an IIFE: `(function(j) { setTimeout(function() { console.log(j); }, j*100); })(i);`
 *    The IIFE creates a new scope per iteration, and `j` captures the current value of `i`.
 *
 *
 * RUN: node docs/javascript/02-closures/07-closures-in-callbacks.js
 */
