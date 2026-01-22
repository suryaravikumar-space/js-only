/**
 * CHALLENGE 00: Prototype Basics
 *
 * ╔════════════════════════════════════════════════════════════════════════════╗
 * ║ THE GOLDEN RULE                                                            ║
 * ╠════════════════════════════════════════════════════════════════════════════╣
 * ║                                                                            ║
 * ║ Every object in JavaScript has a hidden [[Prototype]] property             ║
 * ║ that links to another object (or null).                                    ║
 * ║                                                                            ║
 * ║   obj.__proto__  →  The prototype object                                   ║
 * ║   obj.property   →  If not found, look in __proto__                        ║
 * ║                                                                            ║
 * ║ This creates a CHAIN of lookups called the PROTOTYPE CHAIN.                ║
 * ║                                                                            ║
 * ╚════════════════════════════════════════════════════════════════════════════╝
 */

var animal = {
  eats: true,
  walk: function() {
    return 'Walking';
  }
};

var rabbit = {
  jumps: true
};

rabbit.__proto__ = animal;

console.log('A:', rabbit.jumps);
console.log('B:', rabbit.eats);
console.log('C:', rabbit.walk());
console.log('D:', rabbit.hasOwnProperty('eats'));
console.log('E:', rabbit.hasOwnProperty('jumps'));

/**
 * OUTPUT:
 *   A: true
 *   B: true
 *   C: Walking
 *   D: false
 *   E: true
 *
 *
 * ╔════════════════════════════════════════════════════════════════════════════╗
 * ║ STEP-BY-STEP BREAKDOWN                                                     ║
 * ╠════════════════════════════════════════════════════════════════════════════╣
 * ║                                                                            ║
 * ║ A: rabbit.jumps                                                            ║
 * ║ ──────────────────                                                         ║
 * ║   • Look for 'jumps' on rabbit                                             ║
 * ║   • Found directly on rabbit → true                                        ║
 * ║                                                                            ║
 * ║                                                                            ║
 * ║ B: rabbit.eats                                                             ║
 * ║ ─────────────────                                                          ║
 * ║   • Look for 'eats' on rabbit                                              ║
 * ║   • Not found on rabbit                                                    ║
 * ║   • Look in rabbit.__proto__ (animal)                                      ║
 * ║   • Found on animal → true                                                 ║
 * ║                                                                            ║
 * ║                                                                            ║
 * ║ C: rabbit.walk()                                                           ║
 * ║ ─────────────────                                                          ║
 * ║   • Look for 'walk' on rabbit                                              ║
 * ║   • Not found on rabbit                                                    ║
 * ║   • Look in rabbit.__proto__ (animal)                                      ║
 * ║   • Found on animal, call it → 'Walking'                                   ║
 * ║                                                                            ║
 * ║                                                                            ║
 * ║ D: rabbit.hasOwnProperty('eats')                                           ║
 * ║ ────────────────────────────────                                           ║
 * ║   • hasOwnProperty checks ONLY the object itself                           ║
 * ║   • 'eats' is NOT on rabbit, it's on animal                                ║
 * ║   • Returns false                                                          ║
 * ║                                                                            ║
 * ║                                                                            ║
 * ║ E: rabbit.hasOwnProperty('jumps')                                          ║
 * ║ ─────────────────────────────────                                          ║
 * ║   • 'jumps' IS directly on rabbit                                          ║
 * ║   • Returns true                                                           ║
 * ║                                                                            ║
 * ╚════════════════════════════════════════════════════════════════════════════╝
 *
 *
 * ┌─────────────────────────────────────────────────────────────────────────────┐
 * │ VISUAL: Prototype Chain                                                     │
 * ├─────────────────────────────────────────────────────────────────────────────┤
 * │                                                                             │
 * │   ┌─────────────────────────────────────────────────────────────────┐       │
 * │   │  rabbit                                                         │       │
 * │   │                                                                 │       │
 * │   │  jumps: true                                                    │       │
 * │   │  __proto__ ──────────────────────────────────────┐              │       │
 * │   │                                                  │              │       │
 * │   └─────────────────────────────────────────────────────────────────┘       │
 * │                                                      │                      │
 * │                                                      ▼                      │
 * │   ┌─────────────────────────────────────────────────────────────────┐       │
 * │   │  animal                                                         │       │
 * │   │                                                                 │       │
 * │   │  eats: true                                                     │       │
 * │   │  walk: function                                                 │       │
 * │   │  __proto__ ──────────────────────────────────────┐              │       │
 * │   │                                                  │              │       │
 * │   └─────────────────────────────────────────────────────────────────┘       │
 * │                                                      │                      │
 * │                                                      ▼                      │
 * │   ┌─────────────────────────────────────────────────────────────────┐       │
 * │   │  Object.prototype                                               │       │
 * │   │                                                                 │       │
 * │   │  hasOwnProperty: function                                       │       │
 * │   │  toString: function                                             │       │
 * │   │  __proto__ → null (end of chain)                                │       │
 * │   │                                                                 │       │
 * │   └─────────────────────────────────────────────────────────────────┘       │
 * │                                                                             │
 * └─────────────────────────────────────────────────────────────────────────────┘
 *
 *
 * ┌─────────────────────────────────────────────────────────────────────────────┐
 * │ __proto__ vs prototype                                                      │
 * ├─────────────────────────────────────────────────────────────────────────────┤
 * │                                                                             │
 * │ ┌────────────────────┬──────────────────────────────────────────────────┐   │
 * │ │ __proto__          │ prototype                                        │   │
 * │ ├────────────────────┼──────────────────────────────────────────────────┤   │
 * │ │ Exists on ALL      │ Exists only on FUNCTIONS                         │   │
 * │ │ objects            │                                                  │   │
 * │ ├────────────────────┼──────────────────────────────────────────────────┤   │
 * │ │ Points to the      │ Becomes __proto__ of objects created             │   │
 * │ │ object's prototype │ with new Constructor()                           │   │
 * │ ├────────────────────┼──────────────────────────────────────────────────┤   │
 * │ │ obj.__proto__      │ Function.prototype                               │   │
 * │ └────────────────────┴──────────────────────────────────────────────────┘   │
 * │                                                                             │
 * │ EXAMPLE:                                                                    │
 * │   function Dog() {}                                                         │
 * │   var d = new Dog();                                                        │
 * │                                                                             │
 * │   d.__proto__ === Dog.prototype  // true                                    │
 * │   Dog.prototype.constructor === Dog  // true                                │
 * │                                                                             │
 * └─────────────────────────────────────────────────────────────────────────────┘
 *
 *
 * ┌─────────────────────────────────────────────────────────────────────────────┐
 * │ INTERVIEW ANSWER                                                            │
 * ├─────────────────────────────────────────────────────────────────────────────┤
 * │                                                                             │
 * │ "Every JavaScript object has an internal [[Prototype]] property,            │
 * │  accessible via __proto__ or Object.getPrototypeOf(). When you access       │
 * │  a property on an object, JavaScript first checks the object itself.        │
 * │  If not found, it looks up the prototype chain until it finds the           │
 * │  property or reaches null.                                                  │
 * │                                                                             │
 * │  In this example, rabbit.eats returns true even though 'eats' is not        │
 * │  defined on rabbit - it's found on animal through the prototype chain.      │
 * │                                                                             │
 * │  hasOwnProperty() is crucial because it only checks the object itself,      │
 * │  not the prototype chain. rabbit.hasOwnProperty('eats') is false            │
 * │  because 'eats' is inherited, not owned.                                    │
 * │                                                                             │
 * │  Note: __proto__ is deprecated for direct manipulation. Use                 │
 * │  Object.create(), Object.getPrototypeOf(), and Object.setPrototypeOf()."    │
 * │                                                                             │
 * └─────────────────────────────────────────────────────────────────────────────┘
 *
 *
 * RUN: node docs/03-prototypes/00-prototype-basics.js
 */
