/**
 * CHALLENGE 04: Prototype Inheritance
 *
 * ╔════════════════════════════════════════════════════════════════════════════╗
 * ║ THE GOLDEN RULE                                                            ║
 * ╠════════════════════════════════════════════════════════════════════════════╣
 * ║                                                                            ║
 * ║ To create inheritance in JavaScript (ES5):                                 ║
 * ║                                                                            ║
 * ║   1. Call parent constructor: Parent.call(this, args)                      ║
 * ║   2. Set up prototype chain: Child.prototype = Object.create(Parent.proto) ║
 * ║   3. Fix constructor: Child.prototype.constructor = Child                  ║
 * ║                                                                            ║
 * ╚════════════════════════════════════════════════════════════════════════════╝
 */

function Animal(name) {
  this.name = name;
}

Animal.prototype.speak = function() {
  return this.name + ' makes a sound';
};

function Dog(name, breed) {
  Animal.call(this, name);
  this.breed = breed;
}

Dog.prototype = Object.create(Animal.prototype);
Dog.prototype.constructor = Dog;

Dog.prototype.speak = function() {
  return this.name + ' barks';
};

Dog.prototype.fetch = function() {
  return this.name + ' fetches the ball';
};

var dog = new Dog('Rex', 'German Shepherd');

console.log('A:', dog.name);
console.log('B:', dog.breed);
console.log('C:', dog.speak());
console.log('D:', dog.fetch());
console.log('E:', dog instanceof Dog);
console.log('F:', dog instanceof Animal);

/**
 * OUTPUT:
 *   A: Rex
 *   B: German Shepherd
 *   C: Rex barks
 *   D: Rex fetches the ball
 *   E: true
 *   F: true
 *
 *
 * ╔════════════════════════════════════════════════════════════════════════════╗
 * ║ STEP-BY-STEP BREAKDOWN                                                     ║
 * ╠════════════════════════════════════════════════════════════════════════════╣
 * ║                                                                            ║
 * ║ INHERITANCE SETUP:                                                         ║
 * ║ ───────────────────                                                        ║
 * ║                                                                            ║
 * ║   Animal.call(this, name)                                                  ║
 * ║   → Calls Animal constructor with Dog's this                               ║
 * ║   → Sets this.name = name on the Dog instance                              ║
 * ║                                                                            ║
 * ║   Dog.prototype = Object.create(Animal.prototype)                          ║
 * ║   → Creates object with __proto__ = Animal.prototype                       ║
 * ║   → Dog instances inherit from both Dog.prototype AND Animal.prototype     ║
 * ║                                                                            ║
 * ║   Dog.prototype.constructor = Dog                                          ║
 * ║   → Fixes the constructor reference (Object.create broke it)               ║
 * ║                                                                            ║
 * ║                                                                            ║
 * ║ A: dog.name → 'Rex'                                                        ║
 * ║   • Set by Animal.call(this, name) in Dog constructor                      ║
 * ║                                                                            ║
 * ║ B: dog.breed → 'German Shepherd'                                           ║
 * ║   • Set directly in Dog constructor                                        ║
 * ║                                                                            ║
 * ║ C: dog.speak() → 'Rex barks'                                               ║
 * ║   • Dog.prototype.speak OVERRIDES Animal.prototype.speak                   ║
 * ║   • This is METHOD OVERRIDING                                              ║
 * ║                                                                            ║
 * ║ D: dog.fetch() → 'Rex fetches the ball'                                    ║
 * ║   • Found on Dog.prototype                                                 ║
 * ║   • Animal doesn't have this method                                        ║
 * ║                                                                            ║
 * ║ E: dog instanceof Dog → true                                               ║
 * ║   • Dog.prototype is in dog's prototype chain                              ║
 * ║                                                                            ║
 * ║ F: dog instanceof Animal → true                                            ║
 * ║   • Animal.prototype is ALSO in dog's prototype chain                      ║
 * ║   • dog → Dog.prototype → Animal.prototype → Object.prototype              ║
 * ║                                                                            ║
 * ╚════════════════════════════════════════════════════════════════════════════╝
 *
 *
 * ┌─────────────────────────────────────────────────────────────────────────────┐
 * │ VISUAL: Inheritance Chain                                                   │
 * ├─────────────────────────────────────────────────────────────────────────────┤
 * │                                                                             │
 * │   ┌───────────────────────────────────────────────────────────────┐         │
 * │   │  dog instance                                                 │         │
 * │   │                                                               │         │
 * │   │  name: 'Rex'                                                  │         │
 * │   │  breed: 'German Shepherd'                                     │         │
 * │   │  __proto__ ───────────────────────────────────────────┐       │         │
 * │   └───────────────────────────────────────────────────────────────┘         │
 * │                                                           │                 │
 * │                                                           ▼                 │
 * │   ┌───────────────────────────────────────────────────────────────┐         │
 * │   │  Dog.prototype                                                │         │
 * │   │                                                               │         │
 * │   │  constructor: Dog                                             │         │
 * │   │  speak: function (overrides Animal's)                         │         │
 * │   │  fetch: function                                              │         │
 * │   │  __proto__ ───────────────────────────────────────────┐       │         │
 * │   └───────────────────────────────────────────────────────────────┘         │
 * │                                                           │                 │
 * │                                                           ▼                 │
 * │   ┌───────────────────────────────────────────────────────────────┐         │
 * │   │  Animal.prototype                                             │         │
 * │   │                                                               │         │
 * │   │  constructor: Animal                                          │         │
 * │   │  speak: function (shadowed by Dog's)                          │         │
 * │   │  __proto__ → Object.prototype                                 │         │
 * │   └───────────────────────────────────────────────────────────────┘         │
 * │                                                                             │
 * └─────────────────────────────────────────────────────────────────────────────┘
 *
 *
 * ┌─────────────────────────────────────────────────────────────────────────────┐
 * │ COMMON MISTAKES                                                             │
 * ├─────────────────────────────────────────────────────────────────────────────┤
 * │                                                                             │
 * │ WRONG: Dog.prototype = Animal.prototype                                     │
 * │   • Both point to SAME object                                               │
 * │   • Modifying Dog.prototype affects Animal.prototype too!                   │
 * │                                                                             │
 * │ WRONG: Dog.prototype = new Animal()                                         │
 * │   • Creates an Animal instance as prototype                                 │
 * │   • Runs Animal constructor (might have side effects)                       │
 * │   • Instance properties become shared (bad!)                                │
 * │                                                                             │
 * │ RIGHT: Dog.prototype = Object.create(Animal.prototype)                      │
 * │   • Creates new object with Animal.prototype as prototype                   │
 * │   • No Animal constructor called                                            │
 * │   • Clean inheritance chain                                                 │
 * │                                                                             │
 * │ FORGOT: Dog.prototype.constructor = Dog                                     │
 * │   • dog.constructor would return Animal (wrong!)                            │
 * │   • Some code relies on constructor being correct                           │
 * │                                                                             │
 * └─────────────────────────────────────────────────────────────────────────────┘
 *
 *
 * ┌─────────────────────────────────────────────────────────────────────────────┐
 * │ INTERVIEW ANSWER                                                            │
 * ├─────────────────────────────────────────────────────────────────────────────┤
 * │                                                                             │
 * │ "ES5 prototype inheritance requires three steps:                            │
 * │                                                                             │
 * │  1. Call the parent constructor with Parent.call(this, ...) to              │
 * │     initialize inherited instance properties.                               │
 * │                                                                             │
 * │  2. Set Child.prototype = Object.create(Parent.prototype) to                │
 * │     establish the prototype chain. This creates a new object that           │
 * │     inherits from Parent.prototype without calling the constructor.         │
 * │                                                                             │
 * │  3. Fix Child.prototype.constructor = Child because Object.create()         │
 * │     breaks the constructor reference.                                       │
 * │                                                                             │
 * │  Dog's speak() method overrides Animal's speak() - this is polymorphism.    │
 * │  The first match in the prototype chain wins.                               │
 * │                                                                             │
 * │  dog instanceof Animal returns true because Animal.prototype                │
 * │  is in dog's prototype chain: dog → Dog.prototype → Animal.prototype."      │
 * │                                                                             │
 * └─────────────────────────────────────────────────────────────────────────────┘
 *
 *
 * RUN: node docs/03-prototypes/04-prototype-inheritance.js
 */
