/**
 * CHALLENGE 02: Constructor Functions with new
 *
 * ╔════════════════════════════════════════════════════════════════════════════╗
 * ║ THE GOLDEN RULE                                                            ║
 * ╠════════════════════════════════════════════════════════════════════════════╣
 * ║                                                                            ║
 * ║ Constructor functions are called with 'new' keyword.                       ║
 * ║                                                                            ║
 * ║ What 'new' does:                                                           ║
 * ║   1. Creates a new empty object {}                                         ║
 * ║   2. Sets [[Prototype]] to Constructor.prototype                           ║
 * ║   3. Binds 'this' to the new object                                        ║
 * ║   4. Returns the object (unless constructor returns another object)        ║
 * ║                                                                            ║
 * ║   function Person(name) {                                                  ║
 * ║     this.name = name;  // 'this' is the new object                         ║
 * ║   }                                                                        ║
 * ║   var p = new Person('Alice');                                             ║
 * ║                                                                            ║
 * ╚════════════════════════════════════════════════════════════════════════════╝
 */

// Constructor function
function Person(name, age) {
  this.name = name;
  this.age = age;
  this.greet = function() {
    return 'Hello, I am ' + this.name;
  };
}

var alice = new Person('Alice', 25);

console.log('A:', alice.greet());
console.log('B:', alice instanceof Person);
console.log('C:', alice.constructor === Person);

// What happens without new?
function Car(model) {
  this.model = model;
  return this;
}

var honda = Car('Honda');  // No 'new' keyword!

console.log('D:', typeof honda);
console.log('E:', honda === globalThis || honda === global || honda === window || honda.model === 'Honda');

// Constructor returning an object
function Robot(name) {
  this.name = name;
  return { name: 'Override', type: 'robot' };
}

var r1 = new Robot('R2D2');
console.log('F:', r1.name);

/**
 * OUTPUT:
 *   A: Hello, I am Alice
 *   B: true
 *   C: true
 *   D: object
 *   E: true
 *   F: Override
 *
 *
 * ╔════════════════════════════════════════════════════════════════════════════╗
 * ║ STEP-BY-STEP BREAKDOWN                                                     ║
 * ╠════════════════════════════════════════════════════════════════════════════╣
 * ║                                                                            ║
 * ║ A, B, C: Normal constructor usage                                          ║
 * ║ ──────────────────────────────────                                         ║
 * ║   new Person('Alice', 25):                                                 ║
 * ║   1. Creates {} with [[Prototype]] = Person.prototype                      ║
 * ║   2. this.name = 'Alice', this.age = 25, this.greet = fn                   ║
 * ║   3. Returns the new object                                                ║
 * ║                                                                            ║
 * ║   alice instanceof Person → true (checks prototype chain)                  ║
 * ║   alice.constructor === Person → true (inherited from prototype)           ║
 * ║                                                                            ║
 * ║                                                                            ║
 * ║ D, E: Calling without 'new' - DANGER!                                      ║
 * ║ ────────────────────────────────────                                       ║
 * ║   Without 'new', 'this' is the global object                               ║
 * ║   Car('Honda') sets globalThis.model = 'Honda'                             ║
 * ║   Returns globalThis (not a new object!)                                   ║
 * ║   honda === globalThis → true                                              ║
 * ║                                                                            ║
 * ║                                                                            ║
 * ║ F: Constructor returning object                                            ║
 * ║ ────────────────────────────────                                           ║
 * ║   If constructor returns an object, that object is used                    ║
 * ║   instead of the automatically created 'this'                              ║
 * ║   r1 = { name: 'Override', type: 'robot' }                                 ║
 * ║   r1.name → 'Override' (not 'R2D2')                                        ║
 * ║                                                                            ║
 * ╚════════════════════════════════════════════════════════════════════════════╝
 *
 *
 * ┌─────────────────────────────────────────────────────────────────────────────┐
 * │ SAFE CONSTRUCTOR PATTERN                                                    │
 * ├─────────────────────────────────────────────────────────────────────────────┤
 * │                                                                             │
 * │   // Protect against missing 'new'                                          │
 * │   function SafePerson(name) {                                               │
 * │     if (!(this instanceof SafePerson)) {                                    │
 * │       return new SafePerson(name);                                          │
 * │     }                                                                       │
 * │     this.name = name;                                                       │
 * │   }                                                                         │
 * │                                                                             │
 * │   // Both work correctly now:                                               │
 * │   var p1 = new SafePerson('Alice');                                         │
 * │   var p2 = SafePerson('Bob');  // Still works!                              │
 * │                                                                             │
 * │   // ES6 alternative: new.target                                            │
 * │   function Person(name) {                                                   │
 * │     if (!new.target) {                                                      │
 * │       throw new Error('Must use new keyword');                              │
 * │     }                                                                       │
 * │     this.name = name;                                                       │
 * │   }                                                                         │
 * │                                                                             │
 * └─────────────────────────────────────────────────────────────────────────────┘
 *
 *
 * RUN: node docs/06-objects-creation/02-constructor-functions.js
 */
