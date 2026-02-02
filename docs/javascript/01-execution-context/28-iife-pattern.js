/**
 * CHALLENGE 28: IIFE Pattern
 *
 * ╔════════════════════════════════════════════════════════════════════════════╗
 * ║ THE CRITICAL LESSON                                                        ║
 * ╠════════════════════════════════════════════════════════════════════════════╣
 * ║                                                                            ║
 * ║ IIFE = Immediately Invoked Function Expression                             ║
 * ║                                                                            ║
 * ║   (function() {                                                            ║
 * ║     // Private scope - variables here don't leak out!                      ║
 * ║   })();                                                                    ║
 * ║                                                                            ║
 * ║ Creates a PRIVATE SCOPE. Variables inside are not accessible outside.      ║
 * ║ This was THE way to create modules before ES6 modules existed.             ║
 * ║                                                                            ║
 * ╚════════════════════════════════════════════════════════════════════════════╝
 */

var result = (function() {
  var secret = 'hidden';
  return secret.toUpperCase();
})();

console.log('A:', result);

var counter = (function() {
  var count = 0;
  return {
    increment: function() { count++; return count; },
    decrement: function() { count--; return count; },
    getCount: function() { return count; }
  };
})();

console.log('B:', counter.increment());
console.log('C:', counter.increment());
console.log('D:', counter.decrement());

var module = (function() {
  var privateData = 'I am private';

  function privateMethod() {
    return privateData;
  }

  return {
    publicMethod: function() {
      return 'Public: ' + privateMethod();
    }
  };
})();

console.log('E:', module.publicMethod());

/**
 * OUTPUT:
 *   A: HIDDEN
 *   B: 1
 *   C: 2
 *   D: 1
 *   E: Public: I am private
 *
 *
 * ╔════════════════════════════════════════════════════════════════════════════╗
 * ║ STEP-BY-STEP BREAKDOWN                                                     ║
 * ╠════════════════════════════════════════════════════════════════════════════╣
 * ║                                                                            ║
 * ║ A: result = (function() { ... })()                                         ║
 * ║ ──────────────────────────────────                                         ║
 * ║   • IIFE creates a private scope                                           ║
 * ║   • var secret = 'hidden' (private, not accessible outside)                ║
 * ║   • Returns 'hidden'.toUpperCase() = 'HIDDEN'                              ║
 * ║   • result = 'HIDDEN'                                                      ║
 * ║   • secret is NOT accessible (it's private to the IIFE)                    ║
 * ║                                                                            ║
 * ║                                                                            ║
 * ║ B, C, D: counter.increment() / decrement()                                 ║
 * ║ ──────────────────────────────────────────                                 ║
 * ║   • IIFE creates private variable: var count = 0                           ║
 * ║   • Returns object with methods that ACCESS count via closure              ║
 * ║   • count persists between calls (closure!)                                ║
 * ║                                                                            ║
 * ║   B: increment() → count becomes 1 → returns 1                             ║
 * ║   C: increment() → count becomes 2 → returns 2                             ║
 * ║   D: decrement() → count becomes 1 → returns 1                             ║
 * ║                                                                            ║
 * ║   KEY: counter.count is undefined!                                         ║
 * ║   The count variable is TRULY private - only accessible through methods.   ║
 * ║                                                                            ║
 * ║                                                                            ║
 * ║ E: module.publicMethod()                                                   ║
 * ║ ────────────────────────                                                   ║
 * ║   • IIFE creates:                                                          ║
 * ║     - Private variable: privateData                                        ║
 * ║     - Private function: privateMethod                                      ║
 * ║   • Returns object with publicMethod only                                  ║
 * ║   • publicMethod can access privateMethod via closure                      ║
 * ║   • Result: 'Public: I am private'                                         ║
 * ║                                                                            ║
 * ║   module.privateMethod is undefined!                                       ║
 * ║   module.privateData is undefined!                                         ║
 * ║                                                                            ║
 * ╚════════════════════════════════════════════════════════════════════════════╝
 *
 *
 * ┌─────────────────────────────────────────────────────────────────────────────┐
 * │ IIFE SYNTAX VARIATIONS                                                      │
 * ├─────────────────────────────────────────────────────────────────────────────┤
 * │                                                                             │
 * │ 1. Classic IIFE (parens around function):                                   │
 * │    (function() { ... })();                                                  │
 * │                                                                             │
 * │ 2. Alternative (parens around everything):                                  │
 * │    (function() { ... }());                                                  │
 * │                                                                             │
 * │ 3. With arguments:                                                          │
 * │    (function(window, document) {                                            │
 * │      // Use window and document                                             │
 * │    })(window, document);                                                    │
 * │                                                                             │
 * │ 4. Arrow function IIFE (ES6):                                               │
 * │    (() => { ... })();                                                       │
 * │                                                                             │
 * │ 5. Named IIFE (useful for debugging):                                       │
 * │    (function myModule() { ... })();                                         │
 * │                                                                             │
 * │ 6. Async IIFE:                                                              │
 * │    (async function() {                                                      │
 * │      await someAsyncOperation();                                            │
 * │    })();                                                                    │
 * │                                                                             │
 * └─────────────────────────────────────────────────────────────────────────────┘
 *
 *
 * ┌─────────────────────────────────────────────────────────────────────────────┐
 * │ THE MODULE PATTERN                                                          │
 * ├─────────────────────────────────────────────────────────────────────────────┤
 * │                                                                             │
 * │ var MyModule = (function() {                                                │
 * │   // ═══════════════════════════════════════════                            │
 * │   // PRIVATE - Not accessible from outside                                  │
 * │   // ═══════════════════════════════════════════                            │
 * │   var privateVar = 'secret';                                                │
 * │   var privateCount = 0;                                                     │
 * │                                                                             │
 * │   function privateMethod() {                                                │
 * │     return 'Private: ' + privateVar;                                        │
 * │   }                                                                         │
 * │                                                                             │
 * │   // ═══════════════════════════════════════════                            │
 * │   // PUBLIC - Returned and accessible                                       │
 * │   // ═══════════════════════════════════════════                            │
 * │   return {                                                                  │
 * │     publicVar: 'I am public',                                               │
 * │                                                                             │
 * │     publicMethod: function() {                                              │
 * │       return privateMethod();  // Can access private!                       │
 * │     },                                                                      │
 * │                                                                             │
 * │     getCount: function() {                                                  │
 * │       return privateCount;                                                  │
 * │     },                                                                      │
 * │                                                                             │
 * │     incrementCount: function() {                                            │
 * │       privateCount++;                                                       │
 * │     }                                                                       │
 * │   };                                                                        │
 * │ })();                                                                       │
 * │                                                                             │
 * │ // Usage:                                                                   │
 * │ MyModule.publicVar;           // 'I am public'                              │
 * │ MyModule.publicMethod();      // 'Private: secret'                          │
 * │ MyModule.privateVar;          // undefined (truly private!)                 │
 * │ MyModule.privateMethod;       // undefined (truly private!)                 │
 * │                                                                             │
 * └─────────────────────────────────────────────────────────────────────────────┘
 *
 *
 * ┌─────────────────────────────────────────────────────────────────────────────┐
 * │ WHY IIFE? USE CASES                                                         │
 * ├─────────────────────────────────────────────────────────────────────────────┤
 * │                                                                             │
 * │ 1. AVOID GLOBAL POLLUTION                                                   │
 * │    Without IIFE: var helper = ...; // Added to global!                      │
 * │    With IIFE: (function() { var helper = ...; })(); // Stays private        │
 * │                                                                             │
 * │ 2. CREATE PRIVATE STATE                                                     │
 * │    JavaScript has no private keyword (pre-ES2020)                           │
 * │    IIFE + closures = true privacy                                           │
 * │                                                                             │
 * │ 3. INITIALIZE ONCE                                                          │
 * │    (function() {                                                            │
 * │      // Setup code runs once immediately                                    │
 * │      document.addEventListener('DOMContentLoaded', ...);                    │
 * │    })();                                                                    │
 * │                                                                             │
 * │ 4. LOOP CLOSURE FIX (pre-ES6)                                               │
 * │    for (var i = 0; i < 3; i++) {                                            │
 * │      (function(j) {                                                         │
 * │        setTimeout(function() { console.log(j); }, 100);                     │
 * │      })(i);                                                                 │
 * │    }                                                                        │
 * │                                                                             │
 * │ 5. SAFE jQuery PLUGIN PATTERN                                               │
 * │    (function($) {                                                           │
 * │      // $ is definitely jQuery here, even if noConflict() was used          │
 * │      $.fn.myPlugin = function() { ... };                                    │
 * │    })(jQuery);                                                              │
 * │                                                                             │
 * └─────────────────────────────────────────────────────────────────────────────┘
 *
 *
 * ┌─────────────────────────────────────────────────────────────────────────────┐
 * │ IIFE vs ES6 MODULES                                                         │
 * ├─────────────────────────────────────────────────────────────────────────────┤
 * │                                                                             │
 * │ IIFE (pre-ES6):                                                             │
 * │   var MyModule = (function() {                                              │
 * │     var private = 'secret';                                                 │
 * │     return { public: function() { return private; } };                      │
 * │   })();                                                                     │
 * │                                                                             │
 * │ ES6 Module (modern):                                                        │
 * │   // myModule.js                                                            │
 * │   const private = 'secret';  // Module-scoped (private)                     │
 * │   export function publicFn() { return private; }                            │
 * │                                                                             │
 * │   // other.js                                                               │
 * │   import { publicFn } from './myModule.js';                                 │
 * │                                                                             │
 * │                                                                             │
 * │ When to use IIFE today:                                                     │
 * │ - Legacy code / no module bundler                                           │
 * │ - One-time initialization scripts                                           │
 * │ - Creating private scope in specific situations                             │
 * │ - Browser scripts without build process                                     │
 * │                                                                             │
 * │ When to use ES6 modules:                                                    │
 * │ - Modern projects with bundlers (Webpack, Vite, etc.)                       │
 * │ - Node.js projects                                                          │
 * │ - Any new code (preferred approach)                                         │
 * │                                                                             │
 * └─────────────────────────────────────────────────────────────────────────────┘
 *
 *
 * ┌─────────────────────────────────────────────────────────────────────────────┐
 * │ INTERVIEW ANSWER                                                            │
 * ├─────────────────────────────────────────────────────────────────────────────┤
 * │                                                                             │
 * │ "An IIFE (Immediately Invoked Function Expression) is a function that       │
 * │  runs as soon as it's defined. The syntax is:                               │
 * │                                                                             │
 * │    (function() { ... })();                                                  │
 * │                                                                             │
 * │  The main purposes are:                                                     │
 * │  1. Creating private scope - variables inside don't leak to global          │
 * │  2. Module pattern - return an object with public methods that can          │
 * │     access private variables via closure                                    │
 * │  3. Avoiding global namespace pollution                                     │
 * │  4. One-time initialization                                                 │
 * │                                                                             │
 * │  The counter example shows true encapsulation:                              │
 * │    var counter = (function() {                                              │
 * │      var count = 0;  // Private!                                            │
 * │      return { increment: function() { return ++count; } };                  │
 * │    })();                                                                    │
 * │                                                                             │
 * │  counter.count is undefined - the variable is truly private, only           │
 * │  accessible through the returned methods.                                   │
 * │                                                                             │
 * │  In modern ES6+, modules provide similar encapsulation, but IIFEs           │
 * │  are still useful for one-off scripts and legacy code."                     │
 * │                                                                             │
 * └─────────────────────────────────────────────────────────────────────────────┘
 *
 *
 * RUN: node docs/01-execution-context/28-iife-pattern.js
 */
