/**
 * TOPIC: Prototype Basics
 *
 * STORY: THE FAMILY INHERITANCE
 * Think of prototypes like a family tree. If a child doesn't have a skill
 * (property), they ask their parent. If the parent doesn't have it either,
 * they ask the grandparent, all the way up the family tree. The child doesn't
 * OWN the skill — they just know where to look for it. That's prototype
 * inheritance: objects delegate property lookups up the chain.
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

const animal = { // ES6: const
  eats: true,
  walk() { // ES6: shorthand method
    return 'Walking';
  }
};

const rabbit = Object.create(animal); // ES6: use Object.create instead of __proto__
rabbit.jumps = true;

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
 * INTERVIEW QUESTIONS:
 *
 * Q: "What is the prototype chain in JavaScript?"
 * A: Every object has an internal [[Prototype]] property accessible via
 *    `Object.getPrototypeOf()` (or the deprecated `__proto__`). When you access
 *    a property, JS checks the object itself first. If not found, it walks up
 *    the prototype chain until it finds the property or reaches `null`.
 *
 * Q: "What's the difference between `__proto__` and `.prototype`?"
 * A: `__proto__` exists on ALL objects — it points to the object's prototype.
 *    `.prototype` exists only on FUNCTIONS — it becomes the `__proto__` of objects
 *    created with `new`. Example: `new Dog().__proto__ === Dog.prototype`.
 *    Use `Object.getPrototypeOf()` instead of `__proto__` (which is deprecated).
 *
 * Q: "How does `hasOwnProperty()` differ from the `in` operator?"
 * A: `hasOwnProperty()` checks only the object itself — inherited properties return
 *    false. The `in` operator checks the entire prototype chain. So
 *    `'eats' in rabbit` is true (found on animal), but
 *    `rabbit.hasOwnProperty('eats')` is false (not rabbit's own property).
 *
 *
 * RUN: node docs/javascript/03-prototypes/00-prototype-basics.js
 */
