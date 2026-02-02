/**
 * TOPIC: Prototype Inheritance
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
 *
 * STORY: Think of Animal as a general employee manual that all staff share.
 * Dog is a specialized department handbook that builds on the general manual
 * but overrides certain sections (like "speak" becomes "bark"). Every new
 * Dog hire gets their own name badge (instance props) but shares the department
 * handbook (prototype methods).
 */

function Animal(name) {
  this.name = name;
}

Animal.prototype.speak = function() {
  return `${this.name} makes a sound`;
};

function Dog(name, breed) {
  Animal.call(this, name);
  this.breed = breed;
}

Dog.prototype = Object.create(Animal.prototype);
Dog.prototype.constructor = Dog;

Dog.prototype.speak = function() {
  return `${this.name} barks`;
};

Dog.prototype.fetch = function() {
  return `${this.name} fetches the ball`;
};

const dog = new Dog('Rex', 'German Shepherd'); // ES6: const

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
 * │ INTERVIEW QUESTIONS:                                                        │
 * ├─────────────────────────────────────────────────────────────────────────────┤
 * │                                                                             │
 * │ Q1: What are the 3 steps for ES5 prototype inheritance?                     │
 * │ A1: 1) Call Parent.call(this, args) to initialize inherited instance        │
 * │     properties. 2) Set Child.prototype = Object.create(Parent.prototype)    │
 * │     to link the chain. 3) Fix Child.prototype.constructor = Child.          │
 * │                                                                             │
 * │ Q2: Why use Object.create(Parent.prototype) instead of new Parent()?        │
 * │ A2: `new Parent()` runs the constructor which may have side effects and     │
 * │     puts instance properties on the prototype (shared by all children).     │
 * │     Object.create() cleanly links the chain without calling the constructor.│
 * │                                                                             │
 * │ Q3: How does method overriding work with prototypes?                        │
 * │ A3: When Dog.prototype defines speak(), it shadows Animal.prototype.speak() │
 * │     because property lookup finds Dog.prototype first. This is polymorphism │
 * │     — the first match in the chain wins.                                    │
 * │                                                                             │
 * └─────────────────────────────────────────────────────────────────────────────┘
 *
 *
 * RUN: node docs/javascript/03-prototypes/04-prototype-inheritance.js
 */
