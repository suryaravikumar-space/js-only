/**
 * CHALLENGE 08: ES6 Class Syntax
 *
 * ╔════════════════════════════════════════════════════════════════════════════╗
 * ║ THE GOLDEN RULE                                                            ║
 * ╠════════════════════════════════════════════════════════════════════════════╣
 * ║                                                                            ║
 * ║ ES6 classes are SYNTACTIC SUGAR over prototype-based inheritance.          ║
 * ║                                                                            ║
 * ║   class Dog extends Animal { ... }                                         ║
 * ║                                                                            ║
 * ║ Is equivalent to:                                                          ║
 * ║   function Dog() { Animal.call(this); }                                    ║
 * ║   Dog.prototype = Object.create(Animal.prototype);                         ║
 * ║   Dog.prototype.constructor = Dog;                                         ║
 * ║                                                                            ║
 * ║ Classes are still functions! typeof Animal === 'function'                  ║
 * ║                                                                            ║
 * ╚════════════════════════════════════════════════════════════════════════════╝
 */

class Animal {
  constructor(name) {
    this.name = name;
  }

  speak() {
    return this.name + ' makes a sound';
  }

  static isAnimal(obj) {
    return obj instanceof Animal;
  }
}

class Dog extends Animal {
  constructor(name, breed) {
    super(name);
    this.breed = breed;
  }

  speak() {
    return this.name + ' barks';
  }
}

var dog = new Dog('Rex', 'Husky');

console.log('A:', dog.speak());
console.log('B:', dog instanceof Dog);
console.log('C:', dog instanceof Animal);
console.log('D:', Animal.isAnimal(dog));
console.log('E:', typeof Animal);
console.log('F:', dog.hasOwnProperty('speak'));

/**
 * OUTPUT:
 *   A: Rex barks
 *   B: true
 *   C: true
 *   D: true
 *   E: function
 *   F: false
 *
 *
 * ╔════════════════════════════════════════════════════════════════════════════╗
 * ║ STEP-BY-STEP BREAKDOWN                                                     ║
 * ╠════════════════════════════════════════════════════════════════════════════╣
 * ║                                                                            ║
 * ║ A: dog.speak()                                                             ║
 * ║ ──────────────                                                             ║
 * ║   • Dog has its own speak() that overrides Animal's                        ║
 * ║   • this.name = 'Rex'                                                      ║
 * ║   • Returns 'Rex barks'                                                    ║
 * ║                                                                            ║
 * ║                                                                            ║
 * ║ B: dog instanceof Dog                                                      ║
 * ║ ─────────────────────                                                      ║
 * ║   • Checks if Dog.prototype is in dog's prototype chain                    ║
 * ║   • Returns true                                                           ║
 * ║                                                                            ║
 * ║                                                                            ║
 * ║ C: dog instanceof Animal                                                   ║
 * ║ ────────────────────────                                                   ║
 * ║   • Animal.prototype is also in dog's prototype chain                      ║
 * ║   • dog → Dog.prototype → Animal.prototype                                 ║
 * ║   • Returns true                                                           ║
 * ║                                                                            ║
 * ║                                                                            ║
 * ║ D: Animal.isAnimal(dog)                                                    ║
 * ║ ───────────────────────                                                    ║
 * ║   • isAnimal is a STATIC method (on the class, not instances)              ║
 * ║   • Called as Animal.isAnimal(), not dog.isAnimal()                        ║
 * ║   • Returns true (dog instanceof Animal)                                   ║
 * ║                                                                            ║
 * ║                                                                            ║
 * ║ E: typeof Animal                                                           ║
 * ║ ────────────────                                                           ║
 * ║   • Classes are just functions under the hood!                             ║
 * ║   • Returns 'function'                                                     ║
 * ║                                                                            ║
 * ║                                                                            ║
 * ║ F: dog.hasOwnProperty('speak')                                             ║
 * ║ ──────────────────────────────                                             ║
 * ║   • speak() is on Dog.prototype, not on dog itself                         ║
 * ║   • Class methods go on the prototype (shared)                             ║
 * ║   • Returns false                                                          ║
 * ║                                                                            ║
 * ╚════════════════════════════════════════════════════════════════════════════╝
 *
 *
 * ┌─────────────────────────────────────────────────────────────────────────────┐
 * │ CLASS SYNTAX FEATURES                                                       │
 * ├─────────────────────────────────────────────────────────────────────────────┤
 * │                                                                             │
 * │ constructor()                                                               │
 * │   • Called when using 'new'                                                 │
 * │   • Initializes instance properties                                         │
 * │                                                                             │
 * │ Regular methods                                                             │
 * │   • Go on the prototype (shared)                                            │
 * │   • speak() → Dog.prototype.speak                                           │
 * │                                                                             │
 * │ static methods                                                              │
 * │   • Go on the class itself (not prototype)                                  │
 * │   • Animal.isAnimal, not dog.isAnimal                                       │
 * │   • Can't access 'this' (no instance)                                       │
 * │                                                                             │
 * │ extends                                                                     │
 * │   • Sets up prototype chain                                                 │
 * │   • Dog.prototype.__proto__ = Animal.prototype                              │
 * │                                                                             │
 * │ super()                                                                     │
 * │   • Calls parent constructor                                                │
 * │   • MUST be called in child constructor before using 'this'                 │
 * │                                                                             │
 * │ super.method()                                                              │
 * │   • Calls parent's method                                                   │
 * │   • speak() { return super.speak() + '!!!'; }                               │
 * │                                                                             │
 * └─────────────────────────────────────────────────────────────────────────────┘
 *
 *
 * ┌─────────────────────────────────────────────────────────────────────────────┐
 * │ CLASS vs CONSTRUCTOR FUNCTION                                               │
 * ├─────────────────────────────────────────────────────────────────────────────┤
 * │                                                                             │
 * │ ES6 CLASS:                                                                  │
 * │                                                                             │
 * │   class Animal {                                                            │
 * │     constructor(name) {                                                     │
 * │       this.name = name;                                                     │
 * │     }                                                                       │
 * │     speak() {                                                               │
 * │       return this.name + ' speaks';                                         │
 * │     }                                                                       │
 * │   }                                                                         │
 * │                                                                             │
 * │ EQUIVALENT ES5:                                                             │
 * │                                                                             │
 * │   function Animal(name) {                                                   │
 * │     this.name = name;                                                       │
 * │   }                                                                         │
 * │   Animal.prototype.speak = function() {                                     │
 * │     return this.name + ' speaks';                                           │
 * │   };                                                                        │
 * │                                                                             │
 * │                                                                             │
 * │ KEY DIFFERENCES:                                                            │
 * │   • Classes can't be called without 'new'                                   │
 * │   • Class methods are non-enumerable                                        │
 * │   • Classes are always in strict mode                                       │
 * │   • Classes aren't hoisted (TDZ applies)                                    │
 * │                                                                             │
 * └─────────────────────────────────────────────────────────────────────────────┘
 *
 *
 * ┌─────────────────────────────────────────────────────────────────────────────┐
 * │ INTERVIEW ANSWER                                                            │
 * ├─────────────────────────────────────────────────────────────────────────────┤
 * │                                                                             │
 * │ "ES6 classes are syntactic sugar over JavaScript's prototype system.        │
 * │  Under the hood, typeof Animal === 'function' and methods are still         │
 * │  on the prototype. The class syntax just provides a cleaner way to          │
 * │  write what we used to do with constructor functions.                       │
 * │                                                                             │
 * │  Key points:                                                                │
 * │  - constructor() initializes instances                                      │
 * │  - Regular methods go on prototype (shared, memory efficient)               │
 * │  - static methods go on the class itself, not instances                     │
 * │  - extends sets up the prototype chain for inheritance                      │
 * │  - super() calls parent constructor (required before using this)            │
 * │                                                                             │
 * │  dog.hasOwnProperty('speak') is false because speak is on                   │
 * │  Dog.prototype, not on the dog instance itself. This is the same            │
 * │  behavior as traditional prototype methods.                                 │
 * │                                                                             │
 * │  Understanding that classes are just functions is important for             │
 * │  debugging and understanding JavaScript's inheritance model."               │
 * │                                                                             │
 * └─────────────────────────────────────────────────────────────────────────────┘
 *
 *
 * RUN: node docs/03-prototypes/08-class-syntax.js
 */
