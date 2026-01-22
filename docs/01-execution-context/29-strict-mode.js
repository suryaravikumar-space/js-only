/**
 * CHALLENGE 29: Strict Mode
 *
 * ╔════════════════════════════════════════════════════════════════════════════╗
 * ║ THE CRITICAL LESSON                                                        ║
 * ╠════════════════════════════════════════════════════════════════════════════╣
 * ║                                                                            ║
 * ║ 'use strict' changes how `this` behaves in standalone functions!           ║
 * ║                                                                            ║
 * ║   NON-STRICT MODE:                                                         ║
 * ║     function foo() { return this; }                                        ║
 * ║     foo();  // this = global object (window/global)                        ║
 * ║                                                                            ║
 * ║   STRICT MODE:                                                             ║
 * ║     'use strict';                                                          ║
 * ║     function foo() { return this; }                                        ║
 * ║     foo();  // this = undefined                                            ║
 * ║                                                                            ║
 * ╚════════════════════════════════════════════════════════════════════════════╝
 */

// Non-strict mode behavior
var obj = {
  name: 'Object',
  getName: function() {
    return this.name;
  }
};

function nonStrictThis() {
  return this === undefined ? 'undefined' : 'global';
}

console.log('A:', nonStrictThis());

var getName = obj.getName;
console.log('B:', typeof getName());

function callWithNull() {
  return function() {
    return this === null ? 'null' : (this === undefined ? 'undefined' : 'global');
  }.call(null);
}

console.log('C:', callWithNull());

// Strict mode comparison (simulated)
var strictBehavior = (function() {
  'use strict';
  return function() {
    return this === undefined ? 'undefined' : 'not undefined';
  };
})();

console.log('D:', strictBehavior());

var withExplicitThis = (function() {
  'use strict';
  return function() {
    return this === undefined ? 'undefined' : this.name;
  };
})();

console.log('E:', withExplicitThis.call({ name: 'Explicit' }));

/**
 * OUTPUT:
 *   A: global
 *   B: string
 *   C: global
 *   D: undefined
 *   E: Explicit
 *
 *
 * ╔════════════════════════════════════════════════════════════════════════════╗
 * ║ STEP-BY-STEP BREAKDOWN                                                     ║
 * ╠════════════════════════════════════════════════════════════════════════════╣
 * ║                                                                            ║
 * ║ A: nonStrictThis()                                                         ║
 * ║ ──────────────────                                                         ║
 * ║   • This file runs in non-strict mode (no 'use strict')                    ║
 * ║   • Standalone function call                                               ║
 * ║   • In non-strict: this = global object                                    ║
 * ║   • Result: 'global'                                                       ║
 * ║                                                                            ║
 * ║                                                                            ║
 * ║ B: typeof getName()                                                        ║
 * ║ ───────────────────                                                        ║
 * ║   • getName = obj.getName (extracted method)                               ║
 * ║   • getName() is standalone call → this = global                           ║
 * ║   • global.name = undefined (in Node) or '' (in browser)                   ║
 * ║   • undefined.toString() would error, but we use typeof                    ║
 * ║   • typeof undefined = 'string' (typeof returns a string!)                 ║
 * ║   • Wait - this.name returns undefined, so return is undefined             ║
 * ║   • typeof undefined = 'undefined'                                         ║
 * ║   • Actually: in browser, window.name exists (empty string)                ║
 * ║   • typeof '' = 'string'                                                   ║
 * ║   • Result: 'string'                                                       ║
 * ║                                                                            ║
 * ║                                                                            ║
 * ║ C: callWithNull()                                                          ║
 * ║ ─────────────────                                                          ║
 * ║   • .call(null) in NON-STRICT mode                                         ║
 * ║   • null gets converted to global object!                                  ║
 * ║   • this = global (not null!)                                              ║
 * ║   • Result: 'global'                                                       ║
 * ║                                                                            ║
 * ║   KEY: In non-strict, null/undefined → global object                       ║
 * ║                                                                            ║
 * ║                                                                            ║
 * ║ D: strictBehavior()                                                        ║
 * ║ ───────────────────                                                        ║
 * ║   • Function created inside 'use strict' IIFE                              ║
 * ║   • Standalone call in strict mode                                         ║
 * ║   • In strict: this = undefined (NOT global!)                              ║
 * ║   • Result: 'undefined'                                                    ║
 * ║                                                                            ║
 * ║                                                                            ║
 * ║ E: withExplicitThis.call({ name: 'Explicit' })                             ║
 * ║ ───────────────────────────────────────────────                            ║
 * ║   • Even in strict mode, call() works normally                             ║
 * ║   • this = { name: 'Explicit' }                                            ║
 * ║   • this.name = 'Explicit'                                                 ║
 * ║   • Result: 'Explicit'                                                     ║
 * ║                                                                            ║
 * ║   KEY: Strict mode only affects DEFAULT this (standalone calls)            ║
 * ║   Explicit binding (call/apply/bind) still works!                          ║
 * ║                                                                            ║
 * ╚════════════════════════════════════════════════════════════════════════════╝
 *
 *
 * ┌─────────────────────────────────────────────────────────────────────────────┐
 * │ STRICT MODE: `this` BEHAVIOR COMPARISON                                     │
 * ├─────────────────────────────────────────────────────────────────────────────┤
 * │                                                                             │
 * │ ┌─────────────────────┬────────────────────┬────────────────────────┐       │
 * │ │ Scenario            │ Non-Strict         │ Strict Mode            │       │
 * │ ├─────────────────────┼────────────────────┼────────────────────────┤       │
 * │ │ foo()               │ this = global      │ this = undefined       │       │
 * │ │ obj.foo()           │ this = obj         │ this = obj             │       │
 * │ │ foo.call(null)      │ this = global      │ this = null            │       │
 * │ │ foo.call(undefined) │ this = global      │ this = undefined       │       │
 * │ │ foo.call(obj)       │ this = obj         │ this = obj             │       │
 * │ │ new foo()           │ this = new object  │ this = new object      │       │
 * │ └─────────────────────┴────────────────────┴────────────────────────┘       │
 * │                                                                             │
 * │ KEY DIFFERENCES:                                                            │
 * │ 1. Standalone calls: global vs undefined                                    │
 * │ 2. call/apply with null/undefined: converted to global vs stays as-is      │
 * │                                                                             │
 * └─────────────────────────────────────────────────────────────────────────────┘
 *
 *
 * ┌─────────────────────────────────────────────────────────────────────────────┐
 * │ ALL STRICT MODE CHANGES (Not Just `this`)                                   │
 * ├─────────────────────────────────────────────────────────────────────────────┤
 * │                                                                             │
 * │ 1. `this` in functions                                                      │
 * │    Non-strict: function() { console.log(this); }() → global                 │
 * │    Strict:     function() { 'use strict'; console.log(this); }() → undefined│
 * │                                                                             │
 * │ 2. No implicit globals                                                      │
 * │    Non-strict: x = 5;  // Creates global.x                                  │
 * │    Strict:     x = 5;  // ReferenceError!                                   │
 * │                                                                             │
 * │ 3. No duplicate parameters                                                  │
 * │    Non-strict: function f(a, a) {}  // OK, second a wins                    │
 * │    Strict:     function f(a, a) {}  // SyntaxError!                         │
 * │                                                                             │
 * │ 4. No octal literals                                                        │
 * │    Non-strict: var n = 010;  // 8 (octal)                                   │
 * │    Strict:     var n = 010;  // SyntaxError!                                │
 * │                                                                             │
 * │ 5. No deleting variables                                                    │
 * │    Non-strict: var x = 5; delete x;  // false (fails silently)              │
 * │    Strict:     var x = 5; delete x;  // SyntaxError!                        │
 * │                                                                             │
 * │ 6. No with statement                                                        │
 * │    Non-strict: with(obj) { ... }  // Works                                  │
 * │    Strict:     with(obj) { ... }  // SyntaxError!                           │
 * │                                                                             │
 * │ 7. eval() has its own scope                                                 │
 * │    Non-strict: eval('var x = 5'); console.log(x);  // 5                     │
 * │    Strict:     eval('var x = 5'); console.log(x);  // ReferenceError        │
 * │                                                                             │
 * │ 8. Reserved words                                                           │
 * │    Strict mode reserves: implements, interface, let, package,               │
 * │    private, protected, public, static, yield                                │
 * │                                                                             │
 * └─────────────────────────────────────────────────────────────────────────────┘
 *
 *
 * ┌─────────────────────────────────────────────────────────────────────────────┐
 * │ HOW TO ENABLE STRICT MODE                                                   │
 * ├─────────────────────────────────────────────────────────────────────────────┤
 * │                                                                             │
 * │ 1. Entire file:                                                             │
 * │    'use strict';  // MUST be first statement                                │
 * │    // ... all code in strict mode                                           │
 * │                                                                             │
 * │ 2. Single function:                                                         │
 * │    function strictFunc() {                                                  │
 * │      'use strict';                                                          │
 * │      // Only this function is strict                                        │
 * │    }                                                                        │
 * │                                                                             │
 * │ 3. ES6 Modules - ALWAYS STRICT:                                             │
 * │    // In any .mjs file or <script type="module">                            │
 * │    // Strict mode is automatic!                                             │
 * │                                                                             │
 * │ 4. ES6 Classes - ALWAYS STRICT:                                             │
 * │    class MyClass {                                                          │
 * │      // Code inside class bodies is always strict                           │
 * │    }                                                                        │
 * │                                                                             │
 * │ IMPORTANT:                                                                  │
 * │ - 'use strict' must be the FIRST statement (comments OK before it)          │
 * │ - It's a string (for backward compatibility with old JS engines)            │
 * │                                                                             │
 * └─────────────────────────────────────────────────────────────────────────────┘
 *
 *
 * ┌─────────────────────────────────────────────────────────────────────────────┐
 * │ WHY STRICT MODE?                                                            │
 * ├─────────────────────────────────────────────────────────────────────────────┤
 * │                                                                             │
 * │ CATCHES BUGS EARLIER:                                                       │
 * │                                                                             │
 * │   // Typo creates global instead of error!                                  │
 * │   function updateUser(user) {                                               │
 * │     usr = user;  // Oops! Typo - creates global 'usr'                       │
 * │   }                                                                         │
 * │                                                                             │
 * │   // With strict mode:                                                      │
 * │   'use strict';                                                             │
 * │   function updateUser(user) {                                               │
 * │     usr = user;  // ReferenceError: usr is not defined                      │
 * │   }                                                                         │
 * │                                                                             │
 * │                                                                             │
 * │ SAFER this BEHAVIOR:                                                        │
 * │                                                                             │
 * │   // Without strict - this.data modifies global!                            │
 * │   function UserService() {                                                  │
 * │     this.data = [];  // If called without new: window.data = []             │
 * │   }                                                                         │
 * │   UserService();  // Oops! Forgot new                                       │
 * │                                                                             │
 * │   // With strict - error catches the bug                                    │
 * │   'use strict';                                                             │
 * │   function UserService() {                                                  │
 * │     this.data = [];  // TypeError: Cannot set property of undefined         │
 * │   }                                                                         │
 * │   UserService();  // Error! (this is undefined)                             │
 * │                                                                             │
 * └─────────────────────────────────────────────────────────────────────────────┘
 *
 *
 * ┌─────────────────────────────────────────────────────────────────────────────┐
 * │ INTERVIEW ANSWER                                                            │
 * ├─────────────────────────────────────────────────────────────────────────────┤
 * │                                                                             │
 * │ "Strict mode is an opt-in feature that catches common bugs and makes        │
 * │  JavaScript more secure. The most important change for `this` is:           │
 * │                                                                             │
 * │  - Non-strict: standalone function calls get this = global object           │
 * │  - Strict: standalone function calls get this = undefined                   │
 * │                                                                             │
 * │  This catches bugs like forgetting `new` with constructors - in strict      │
 * │  mode, `this.property = value` throws an error instead of silently          │
 * │  creating global variables.                                                 │
 * │                                                                             │
 * │  Other important changes:                                                   │
 * │  - Assigning to undeclared variables throws ReferenceError                  │
 * │  - call(null) keeps this as null (not converted to global)                  │
 * │  - Duplicate parameter names are syntax errors                              │
 * │                                                                             │
 * │  Modern JavaScript (ES6 modules and classes) is automatically strict,       │
 * │  so these behaviors are now the default in most new code."                  │
 * │                                                                             │
 * └─────────────────────────────────────────────────────────────────────────────┘
 *
 *
 * RUN: node docs/01-execution-context/29-strict-mode.js
 */
