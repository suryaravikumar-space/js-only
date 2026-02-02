/**
 * TOPIC: Strict Mode and this Binding
 *
 * CONCEPT:
 * Strict mode ('use strict') changes how `this` behaves in
 * standalone function calls. This is part of the Execution Context's
 * third component: the `this` binding.
 *
 * ╔════════════════════════════════════════════════════════════════╗
 * ║ THE KEY DIFFERENCE                                            ║
 * ╠════════════════════════════════════════════════════════════════╣
 * ║                                                                ║
 * ║  Non-strict mode:  func()  →  this = global object            ║
 * ║  Strict mode:      func()  →  this = undefined                ║
 * ║                                                                ║
 * ╚════════════════════════════════════════════════════════════════╝
 */

function normalFunction() {
  console.log(this);
}

function strictFunction() {
  'use strict';
  console.log(this);
}

normalFunction();
strictFunction();

/**
 * OUTPUT (Node.js):
 *   Object [global] { ... }   ← normalFunction
 *   undefined                  ← strictFunction
 *
 * OUTPUT (Browser):
 *   Window { ... }            ← normalFunction
 *   undefined                  ← strictFunction
 *
 *
 * ┌────────────────────────────────────────────────────────────────┐
 * │ WHY THIS HAPPENS                                              │
 * ├────────────────────────────────────────────────────────────────┤
 * │                                                                │
 * │ NON-STRICT MODE (default):                                    │
 * │   When you call a function without an object (standalone),    │
 * │   JavaScript "helps" you by setting `this` to the global      │
 * │   object. This was a design decision from 1995.               │
 * │                                                                │
 * │   normalFunction();  // this = global (window/global)         │
 * │                                                                │
 * │                                                                │
 * │ STRICT MODE:                                                  │
 * │   JavaScript does NOT automatically give you the global       │
 * │   object. If you call a function standalone, `this` is        │
 * │   `undefined`. This is a SAFETY feature.                      │
 * │                                                                │
 * │   strictFunction();  // this = undefined                      │
 * │                                                                │
 * └────────────────────────────────────────────────────────────────┘
 *
 *
 * ┌────────────────────────────────────────────────────────────────┐
 * │ WHY IS STRICT MODE SAFER?                                     │
 * ├────────────────────────────────────────────────────────────────┤
 * │                                                                │
 * │ In non-strict mode, you can accidentally modify global:       │
 * │                                                                │
 * │   function dangerous() {                                      │
 * │     this.x = 100;  // Accidentally creates global.x!          │
 * │   }                                                           │
 * │   dangerous();                                                │
 * │   console.log(x);  // 100 — global polluted!                  │
 * │                                                                │
 * │                                                                │
 * │ In strict mode, this would throw an error:                    │
 * │                                                                │
 * │   function safe() {                                           │
 * │     'use strict';                                             │
 * │     this.x = 100;  // TypeError: Cannot set property of       │
 * │   }                  //           undefined                    │
 * │   safe();                                                     │
 * │                                                                │
 * │ The error helps you catch bugs early!                         │
 * │                                                                │
 * └────────────────────────────────────────────────────────────────┘
 *
 *
 * ┌────────────────────────────────────────────────────────────────┐
 * │ COMMON CONFUSION: "Strict mode restricts access to global"    │
 * ├────────────────────────────────────────────────────────────────┤
 * │                                                                │
 * │ WRONG THINKING:                                               │
 * │   "Strict mode prevents access to global variables"           │
 * │                                                                │
 * │ CORRECT THINKING:                                             │
 * │   "Strict mode sets `this` to undefined for standalone calls. │
 * │    You can still access global variables directly."           │
 * │                                                                │
 * │ EXAMPLE:                                                      │
 * │                                                                │
 * │   var x = 10;                                                 │
 * │                                                                │
 * │   function strictFunction() {                                 │
 * │     'use strict';                                             │
 * │     console.log(this);    // undefined                        │
 * │     console.log(x);       // 10 — can still access directly!  │
 * │   }                                                           │
 * │                                                                │
 * │ `this` is undefined, but global variables are still reachable │
 * │ through the scope chain.                                      │
 * │                                                                │
 * └────────────────────────────────────────────────────────────────┘
 *
 *
 * ┌────────────────────────────────────────────────────────────────┐
 * │ EXECUTION CONTEXT VIEW                                        │
 * ├────────────────────────────────────────────────────────────────┤
 * │                                                                │
 * │ When normalFunction() is called:                              │
 * │ ┌────────────────────────────────────────────────────────┐    │
 * │ │ normalFunction() Execution Context                     │    │
 * │ │                                                        │    │
 * │ │ Variable Environment: { }                              │    │
 * │ │ Lexical Environment:  → Global                         │    │
 * │ │ this:                 global object (window/global)    │    │
 * │ └────────────────────────────────────────────────────────┘    │
 * │                                                                │
 * │ When strictFunction() is called:                              │
 * │ ┌────────────────────────────────────────────────────────┐    │
 * │ │ strictFunction() Execution Context                     │    │
 * │ │                                                        │    │
 * │ │ Variable Environment: { }                              │    │
 * │ │ Lexical Environment:  → Global                         │    │
 * │ │ this:                 undefined                        │    │
 * │ └────────────────────────────────────────────────────────┘    │
 * │                                                                │
 * │ Only the `this` binding changes. Scope chain stays the same.  │
 * │                                                                │
 * └────────────────────────────────────────────────────────────────┘
 *
 *
 * ┌────────────────────────────────────────────────────────────────┐
 * │ WAYS TO ENABLE STRICT MODE                                    │
 * ├────────────────────────────────────────────────────────────────┤
 * │                                                                │
 * │ 1. For entire file (at top):                                  │
 * │    'use strict';                                              │
 * │    // all code here is strict                                 │
 * │                                                                │
 * │ 2. For single function:                                       │
 * │    function myFunc() {                                        │
 * │      'use strict';                                            │
 * │      // only this function is strict                          │
 * │    }                                                          │
 * │                                                                │
 * │ 3. ES6 Modules are strict by default:                         │
 * │    // In .mjs files or type="module"                          │
 * │    // strict mode is automatic                                │
 * │                                                                │
 * │ 4. ES6 Classes are strict by default:                         │
 * │    class MyClass {                                            │
 * │      method() {                                               │
 * │        // strict mode automatic                               │
 * │      }                                                        │
 * │    }                                                          │
 * │                                                                │
 * └────────────────────────────────────────────────────────────────┘
 *
 *
 * ┌────────────────────────────────────────────────────────────────┐
 * │ SUMMARY: this BINDING RULES (UPDATED)                         │
 * ├─────────────────────┬──────────────────────────────────────────┤
 * │ Call Pattern        │ this =                                  │
 * ├─────────────────────┼──────────────────────────────────────────┤
 * │ func() non-strict   │ global object (window/global)           │
 * │ func() strict       │ undefined                               │
 * │ obj.func()          │ obj (object before the dot)             │
 * │ func.call(obj)      │ obj (explicitly set)                    │
 * │ func.apply(obj)     │ obj (explicitly set)                    │
 * │ func.bind(obj)()    │ obj (permanently bound)                 │
 * │ new func()          │ new empty object                        │
 * │ arrow function      │ inherits from parent scope              │
 * └─────────────────────┴──────────────────────────────────────────┘
 *
 *
 * INTERVIEW QUESTIONS:
 *
 * Q: "How does strict mode affect `this` in standalone function calls?"
 * A: In non-strict mode, calling a function standalone sets `this` to the
 *    global object. In strict mode, `this` is `undefined` for standalone
 *    calls. This is a safety feature that prevents accidental modification
 *    of the global object. Note that strict mode doesn't prevent access to
 *    global variables through the scope chain -- it only affects what `this`
 *    points to. ES6 modules and classes are strict by default, so most
 *    modern code runs in strict mode.
 *
 *
 * ES6 NOTE: ES6 modules and classes run in strict mode by default.
 *           Arrow functions inherit `this` from their enclosing scope,
 *           avoiding the strict/non-strict `this` confusion entirely.
 *
 * RUN: node docs/javascript/01-execution-context/16-strict-mode-this.js
 */
