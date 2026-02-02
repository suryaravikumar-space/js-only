/**
 * TOPIC: Arrow Functions Inside Methods (The Correct Usage)
 *
 * CONCEPT:
 * This challenge shows WHY arrow functions were created.
 * Arrow functions are perfect for CALLBACKS inside methods
 * because they preserve the parent's `this`.
 *
 * ╔════════════════════════════════════════════════════════════════╗
 * ║ THE PROBLEM ARROW FUNCTIONS SOLVE                             ║
 * ╠════════════════════════════════════════════════════════════════╣
 * ║                                                                ║
 * ║ Regular function callbacks LOSE `this` because setTimeout     ║
 * ║ calls them as standalone functions: callback()                ║
 * ║                                                                ║
 * ║ Arrow function callbacks PRESERVE `this` because they         ║
 * ║ inherit it from where they were defined.                      ║
 * ║                                                                ║
 * ╚════════════════════════════════════════════════════════════════╝
 */

var person = { // ES6: use `const`
  name: 'John',

  greetWithRegular: function() {
    setTimeout(function() {
      console.log('Regular:', this.name);
    }, 100);
  },

  greetWithArrow: function() {
    setTimeout(() => {
      console.log('Arrow:', this.name);
    }, 100);
  }
};

person.greetWithRegular();
person.greetWithArrow();

/**
 * OUTPUT:
 *   Regular: undefined
 *   Arrow: John
 *
 *
 * ╔════════════════════════════════════════════════════════════════╗
 * ║ THE KEY QUESTION: WHO CALLS THE CALLBACK?                     ║
 * ╠════════════════════════════════════════════════════════════════╣
 * ║                                                                ║
 * ║ setTimeout internally does something like:                    ║
 * ║                                                                ║
 * ║   function setTimeout(callback, delay) {                      ║
 * ║     // wait for delay...                                      ║
 * ║     callback();  ← STANDALONE call! No object before dot!     ║
 * ║   }                                                           ║
 * ║                                                                ║
 * ║ This is why regular function callbacks lose `this`.           ║
 * ║ They're called without an object: callback() not obj.cb()     ║
 * ║                                                                ║
 * ╚════════════════════════════════════════════════════════════════╝
 *
 *
 * ┌────────────────────────────────────────────────────────────────┐
 * │ SCENARIO 1: Regular Function Callback (LOSES this)            │
 * ├────────────────────────────────────────────────────────────────┤
 * │                                                                │
 * │   person.greetWithRegular()                                    │
 * │   │                                                            │
 * │   │  this = person ✓ (method call)                             │
 * │   │                                                            │
 * │   └──► setTimeout(function() { ... }, 100)                     │
 * │                    │                                           │
 * │                    │  Later, setTimeout does internally:       │
 * │                    │  callback()  ← STANDALONE call!           │
 * │                    │                                           │
 * │                    └──► this = global (no object before dot)   │
 * │                         this.name = undefined                  │
 * │                                                                │
 * │   Regular function asks: "Who called me RIGHT NOW?"            │
 * │   Answer: Nobody specific (standalone) → this = global         │
 * │                                                                │
 * └────────────────────────────────────────────────────────────────┘
 *
 *
 * ┌────────────────────────────────────────────────────────────────┐
 * │ SCENARIO 2: Arrow Function Callback (PRESERVES this)          │
 * ├────────────────────────────────────────────────────────────────┤
 * │                                                                │
 * │   person.greetWithArrow()                                      │
 * │   │                                                            │
 * │   │  this = person ✓ (method call)                             │
 * │   │                                                            │
 * │   └──► setTimeout(() => { ... }, 100)                          │
 * │                    │                                           │
 * │                    │  Arrow function REMEMBERS at creation:    │
 * │                    │  "My parent's this = person"              │
 * │                    │                                           │
 * │                    │  Later, setTimeout does:                  │
 * │                    │  callback()  ← Doesn't matter!            │
 * │                    │                                           │
 * │                    └──► this = person (inherited at creation)  │
 * │                         this.name = "John"                     │
 * │                                                                │
 * │   Arrow function says: "I remember my boss from when I was     │
 * │   created. I don't care who's calling me now."                 │
 * │                                                                │
 * └────────────────────────────────────────────────────────────────┘
 *
 *
 * ┌────────────────────────────────────────────────────────────────┐
 * │ SIMPLE ANALOGY                                                │
 * ├────────────────────────────────────────────────────────────────┤
 * │                                                                │
 * │ REGULAR FUNCTION = "I'll ask who's calling me when I run"     │
 * │                                                                │
 * │   setTimeout calls it → "Who called me? Nobody specific.       │
 * │                          I'll use global."                     │
 * │                                                                │
 * │                                                                │
 * │ ARROW FUNCTION = "I already know who my boss is from birth"   │
 * │                                                                │
 * │   Created inside greetWithArrow where this=person              │
 * │   → "My boss is person, forever. Doesn't matter who calls me." │
 * │                                                                │
 * └────────────────────────────────────────────────────────────────┘
 *
 *
 * ┌────────────────────────────────────────────────────────────────┐
 * │ COMMON CONFUSION: Challenge 17 vs Challenge 18                │
 * ├────────────────────────────────────────────────────────────────┤
 * │                                                                │
 * │ CHALLENGE 17: Arrow function AS a method (BAD)                │
 * │                                                                │
 * │   var person = {                                               │
 * │     arrowMethod: () => { ... }  ← Defined at GLOBAL scope      │
 * │   };                                                           │
 * │   person.arrowMethod();  // this = global (not person!)        │
 * │                                                                │
 * │   Object literals { } are NOT scopes!                          │
 * │   Arrow inherits from GLOBAL, not from person.                 │
 * │                                                                │
 * │                                                                │
 * │ CHALLENGE 18: Arrow function INSIDE a method (GOOD)           │
 * │                                                                │
 * │   var person = {                                               │
 * │     method: function() {       ← Regular method                │
 * │       setTimeout(() => { ... })← Arrow INSIDE method           │
 * │     }                                                          │
 * │   };                                                           │
 * │   person.method();  // Arrow's this = person (from method!)    │
 * │                                                                │
 * │   Arrow is defined INSIDE the method where this=person.        │
 * │   Arrow inherits that this.                                    │
 * │                                                                │
 * ├────────────────────────────────────────────────────────────────┤
 * │                                                                │
 * │ SUMMARY:                                                       │
 * │   Arrow AS method       → BAD (loses object reference)        │
 * │   Arrow INSIDE method   → GOOD (preserves object reference)   │
 * │                                                                │
 * └────────────────────────────────────────────────────────────────┘
 *
 *
 * ┌────────────────────────────────────────────────────────────────┐
 * │ THE KEY RULE                                                  │
 * ├─────────────────┬──────────────────┬───────────────────────────┤
 * │ Function Type   │ this decided     │ Based on                 │
 * ├─────────────────┼──────────────────┼───────────────────────────┤
 * │ Regular         │ When CALLED      │ How it's called          │
 * │                 │                  │ (obj.fn vs fn)           │
 * ├─────────────────┼──────────────────┼───────────────────────────┤
 * │ Arrow           │ When CREATED     │ Parent scope's this      │
 * │                 │                  │ at creation time         │
 * └─────────────────┴──────────────────┴───────────────────────────┘
 *
 *
 * ┌────────────────────────────────────────────────────────────────┐
 * │ BEFORE ARROW FUNCTIONS: The var self = this Pattern           │
 * ├────────────────────────────────────────────────────────────────┤
 * │                                                                │
 * │ Before ES6, developers used this workaround:                   │
 * │                                                                │
 * │   var person = {                                               │
 * │     name: 'John',                                              │
 * │     greet: function() {                                        │
 * │       var self = this;  // Save reference to this              │
 * │                                                                │
 * │       setTimeout(function() {                                  │
 * │         console.log(self.name);  // Use self, not this         │
 * │       }, 100);                                                 │
 * │     }                                                          │
 * │   };                                                           │
 * │                                                                │
 * │ Arrow functions eliminated the need for this pattern.          │
 * │                                                                │
 * └────────────────────────────────────────────────────────────────┘
 *
 *
 * ┌────────────────────────────────────────────────────────────────┐
 * │ ANOTHER OLD PATTERN: Using .bind(this)                        │
 * ├────────────────────────────────────────────────────────────────┤
 * │                                                                │
 * │   var person = {                                               │
 * │     name: 'John',                                              │
 * │     greet: function() {                                        │
 * │       setTimeout(function() {                                  │
 * │         console.log(this.name);                                │
 * │       }.bind(this), 100);  // Bind this to the callback        │
 * │     }                                                          │
 * │   };                                                           │
 * │                                                                │
 * │ Arrow functions are cleaner than .bind(this).                  │
 * │                                                                │
 * └────────────────────────────────────────────────────────────────┘
 *
 *
 * ┌────────────────────────────────────────────────────────────────┐
 * │ WHEN TO USE WHICH                                             │
 * ├────────────────────────────────────────────────────────────────┤
 * │                                                                │
 * │ USE REGULAR FUNCTION FOR:                                     │
 * │   ✓ Object methods (need this to be the object)               │
 * │   ✓ Constructors (new keyword)                                │
 * │   ✓ Event handlers where this should be the element           │
 * │                                                                │
 * │ USE ARROW FUNCTION FOR:                                       │
 * │   ✓ Callbacks inside methods (setTimeout, setInterval)        │
 * │   ✓ Array methods (map, filter, forEach, reduce)              │
 * │   ✓ Promise chains (.then, .catch)                            │
 * │   ✓ Any callback where you need parent's this                 │
 * │                                                                │
 * └────────────────────────────────────────────────────────────────┘
 *
 *
 * ┌────────────────────────────────────────────────────────────────┐
 * │ REAL-WORLD EXAMPLE: Array Methods                             │
 * ├────────────────────────────────────────────────────────────────┤
 * │                                                                │
 * │ var team = {                                                   │
 * │   name: 'Engineers',                                           │
 * │   members: ['Alice', 'Bob', 'Charlie'],                        │
 * │                                                                │
 * │   // BAD: Regular function callback                            │
 * │   introduceBad: function() {                                   │
 * │     this.members.forEach(function(member) {                    │
 * │       console.log(member + ' from ' + this.name);              │
 * │       // this.name = undefined (callback is standalone)        │
 * │     });                                                        │
 * │   },                                                           │
 * │                                                                │
 * │   // GOOD: Arrow function callback                             │
 * │   introduceGood: function() {                                  │
 * │     this.members.forEach((member) => {                         │
 * │       console.log(member + ' from ' + this.name);              │
 * │       // this.name = 'Engineers' (arrow preserves this)        │
 * │     });                                                        │
 * │   }                                                            │
 * │ };                                                             │
 * │                                                                │
 * └────────────────────────────────────────────────────────────────┘
 *
 *
 * INTERVIEW QUESTIONS:
 *
 * Q: "Why does a regular function callback in setTimeout lose `this`, but an arrow function preserves it?"
 * A: greetWithRegular prints 'undefined' because the callback is a regular function.
 *    When setTimeout calls it later, it calls it as a standalone function: callback().
 *    Regular functions determine `this` at call time, and a standalone call means `this`
 *    is the global object (or undefined in strict mode). greetWithArrow prints 'John'
 *    because arrow functions don't have their own `this` -- they inherit it from the
 *    scope where they're defined. The arrow is defined inside greetWithArrow where
 *    `this` is person, so the arrow's `this` is also person. This is exactly why arrow
 *    functions were created -- to preserve `this` in callbacks. Before ES6, we had to
 *    use `var self = this` or `.bind(this)` as workarounds.
 *
 *
 * ES6 NOTE: Arrow functions are the ES6 solution to the `this` problem in callbacks.
 *           Use `const` for object declarations and template literals for string
 *           concatenation: `${member} from ${this.name}`.
 *
 * RUN: node docs/javascript/01-execution-context/18-arrow-inside-method.js
 */
