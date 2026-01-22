/**
 * CHALLENGE 09: Closures and `this` Interaction
 *
 * ╔════════════════════════════════════════════════════════════════════════════╗
 * ║ THE GOLDEN RULE                                                            ║
 * ╠════════════════════════════════════════════════════════════════════════════╣
 * ║                                                                            ║
 * ║ Closures capture VARIABLES, not `this`.                                    ║
 * ║ `this` is determined at call time, NOT closure time.                       ║
 * ║ Arrow functions are the exception - they capture `this` lexically.         ║
 * ║                                                                            ║
 * ║   Regular function: this = how it's called                                 ║
 * ║   Arrow function:   this = where it's defined (captured in closure)        ║
 * ║                                                                            ║
 * ╚════════════════════════════════════════════════════════════════════════════╝
 */

var obj = {
  name: 'Object',

  regularClosure: function() {
    var self = this;
    return function() {
      return self.name;
    };
  },

  brokenClosure: function() {
    return function() {
      return this.name;
    };
  },

  arrowClosure: function() {
    return () => {
      return this.name;
    };
  }
};

var getName1 = obj.regularClosure();
var getName2 = obj.brokenClosure();
var getName3 = obj.arrowClosure();

console.log('A:', getName1());
console.log('B:', getName2());
console.log('C:', getName3());

var detached = obj.arrowClosure;
var getName4 = detached();
console.log('D:', getName4());

/**
 * OUTPUT:
 *   A: Object
 *   B: undefined
 *   C: Object
 *   D: undefined
 *
 *
 * ╔════════════════════════════════════════════════════════════════════════════╗
 * ║ STEP-BY-STEP BREAKDOWN                                                     ║
 * ╠════════════════════════════════════════════════════════════════════════════╣
 * ║                                                                            ║
 * ║ A: getName1() - regularClosure with var self = this                        ║
 * ║ ───────────────────────────────────────────────────                        ║
 * ║   1. obj.regularClosure() is called                                        ║
 * ║   2. this = obj (method call)                                              ║
 * ║   3. var self = this → self = obj                                          ║
 * ║   4. Returns inner function with closure over self                         ║
 * ║   5. getName1() calls inner function                                       ║
 * ║   6. Uses self.name (closure variable, not this!)                          ║
 * ║   7. self.name = 'Object'                                                  ║
 * ║   8. Returns 'Object'                                                      ║
 * ║                                                                            ║
 * ║                                                                            ║
 * ║ B: getName2() - brokenClosure using this directly                          ║
 * ║ ──────────────────────────────────────────────────                         ║
 * ║   1. obj.brokenClosure() is called                                         ║
 * ║   2. this = obj (method call)                                              ║
 * ║   3. Returns inner function (no self capture!)                             ║
 * ║   4. getName2() is STANDALONE call                                         ║
 * ║   5. this = global object (non-strict)                                     ║
 * ║   6. global.name = undefined                                               ║
 * ║   7. Returns undefined                                                     ║
 * ║                                                                            ║
 * ║   KEY: `this` is NOT captured in closure!                                  ║
 * ║   It's determined when the inner function is CALLED.                       ║
 * ║                                                                            ║
 * ║                                                                            ║
 * ║ C: getName3() - arrowClosure                                               ║
 * ║ ────────────────────────────                                               ║
 * ║   1. obj.arrowClosure() is called                                          ║
 * ║   2. this = obj (method call)                                              ║
 * ║   3. Arrow function CAPTURES this lexically!                               ║
 * ║   4. Returns arrow with this = obj (forever)                               ║
 * ║   5. getName3() calls arrow                                                ║
 * ║   6. Arrow's this is still obj                                             ║
 * ║   7. Returns 'Object'                                                      ║
 * ║                                                                            ║
 * ║   KEY: Arrow functions capture this AT DEFINITION TIME                     ║
 * ║                                                                            ║
 * ║                                                                            ║
 * ║ D: getName4() - detached arrowClosure                                      ║
 * ║ ─────────────────────────────────────                                      ║
 * ║   1. detached = obj.arrowClosure (just a reference!)                       ║
 * ║   2. detached() is STANDALONE call                                         ║
 * ║   3. this = global (for arrowClosure itself!)                              ║
 * ║   4. Arrow function captures global's this                                 ║
 * ║   5. getName4() calls arrow                                                ║
 * ║   6. Arrow's this = global                                                 ║
 * ║   7. global.name = undefined                                               ║
 * ║                                                                            ║
 * ║   KEY: The arrow captures whatever this was when arrowClosure ran.         ║
 * ║   Since arrowClosure was called standalone, this was global.               ║
 * ║                                                                            ║
 * ╚════════════════════════════════════════════════════════════════════════════╝
 *
 *
 * ┌─────────────────────────────────────────────────────────────────────────────┐
 * │ VISUAL: this in Closures                                                    │
 * ├─────────────────────────────────────────────────────────────────────────────┤
 * │                                                                             │
 * │ REGULAR FUNCTION - this determined at CALL TIME:                            │
 * │                                                                             │
 * │   function() {                                                              │
 * │     return this.name;  // What is this? Depends on how I'm called!          │
 * │   }                                                                         │
 * │                                                                             │
 * │   obj.method()    →  this = obj                                             │
 * │   standalone()    →  this = global                                          │
 * │   fn.call(other)  →  this = other                                           │
 * │                                                                             │
 * │                                                                             │
 * │ ARROW FUNCTION - this captured at DEFINITION TIME:                          │
 * │                                                                             │
 * │   () => {                                                                   │
 * │     return this.name;  // this was captured when arrow was created          │
 * │   }                                                                         │
 * │                                                                             │
 * │   // No matter how you call it:                                             │
 * │   arrow()          →  this = what it was at definition                      │
 * │   arrow.call(obj)  →  this = what it was at definition (call ignored!)      │
 * │                                                                             │
 * └─────────────────────────────────────────────────────────────────────────────┘
 *
 *
 * ┌─────────────────────────────────────────────────────────────────────────────┐
 * │ THE THREE SOLUTIONS FOR this IN CALLBACKS                                   │
 * ├─────────────────────────────────────────────────────────────────────────────┤
 * │                                                                             │
 * │ 1. var self = this (ES5 pattern)                                            │
 * │                                                                             │
 * │    method: function() {                                                     │
 * │      var self = this;                                                       │
 * │      setTimeout(function() {                                                │
 * │        console.log(self.name);  // Works! Uses closure variable             │
 * │      }, 100);                                                               │
 * │    }                                                                        │
 * │                                                                             │
 * │                                                                             │
 * │ 2. bind() (ES5 pattern)                                                     │
 * │                                                                             │
 * │    method: function() {                                                     │
 * │      setTimeout(function() {                                                │
 * │        console.log(this.name);  // Works! this is bound                     │
 * │      }.bind(this), 100);                                                    │
 * │    }                                                                        │
 * │                                                                             │
 * │                                                                             │
 * │ 3. Arrow function (ES6 - PREFERRED)                                         │
 * │                                                                             │
 * │    method: function() {                                                     │
 * │      setTimeout(() => {                                                     │
 * │        console.log(this.name);  // Works! Arrow captures this               │
 * │      }, 100);                                                               │
 * │    }                                                                        │
 * │                                                                             │
 * └─────────────────────────────────────────────────────────────────────────────┘
 *
 *
 * ┌─────────────────────────────────────────────────────────────────────────────┐
 * │ COMMON MISTAKE: Arrow as Object Method                                      │
 * ├─────────────────────────────────────────────────────────────────────────────┤
 * │                                                                             │
 * │ BROKEN:                                                                     │
 * │                                                                             │
 * │   var obj = {                                                               │
 * │     name: 'Object',                                                         │
 * │     getName: () => {                                                        │
 * │       return this.name;  // WRONG! this = global, not obj!                  │
 * │     }                                                                       │
 * │   };                                                                        │
 * │                                                                             │
 * │   obj.getName();  // undefined                                              │
 * │                                                                             │
 * │                                                                             │
 * │ WHY IT'S BROKEN:                                                            │
 * │   - Arrow functions don't get their own this                                │
 * │   - They capture this from where they're DEFINED                            │
 * │   - Object literal { } doesn't create a new this                            │
 * │   - So the arrow captures the GLOBAL this                                   │
 * │                                                                             │
 * │                                                                             │
 * │ CORRECT:                                                                    │
 * │                                                                             │
 * │   var obj = {                                                               │
 * │     name: 'Object',                                                         │
 * │     getName: function() {                                                   │
 * │       return this.name;  // Works! this = obj for method call               │
 * │     }                                                                       │
 * │   };                                                                        │
 * │                                                                             │
 * └─────────────────────────────────────────────────────────────────────────────┘
 *
 *
 * ┌─────────────────────────────────────────────────────────────────────────────┐
 * │ INTERVIEW ANSWER                                                            │
 * ├─────────────────────────────────────────────────────────────────────────────┤
 * │                                                                             │
 * │ "Closures capture variables, but `this` is NOT a variable - it's a          │
 * │  special keyword determined at call time for regular functions.             │
 * │                                                                             │
 * │  To preserve `this` in nested functions, you have three options:            │
 * │  1. var self = this - capture in a regular variable                         │
 * │  2. bind() - create a function with permanent this                          │
 * │  3. Arrow function - lexically captures this                                │
 * │                                                                             │
 * │  Arrow functions are special - they don't have their own this.              │
 * │  They use the this from where they were defined (lexical this).             │
 * │  This makes them perfect for callbacks but problematic as object methods.   │
 * │                                                                             │
 * │  In the challenge:                                                          │
 * │  A works because self captures obj in closure                               │
 * │  B fails because this is determined when inner function is called           │
 * │  C works because arrow captures this from arrowClosure's call               │
 * │  D fails because arrowClosure itself was called standalone"                 │
 * │                                                                             │
 * └─────────────────────────────────────────────────────────────────────────────┘
 *
 *
 * RUN: node docs/02-closures/09-closures-and-this.js
 */
