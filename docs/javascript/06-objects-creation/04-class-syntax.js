/**
 * CHALLENGE 04: ES6 Class Syntax
 *
 * ╔════════════════════════════════════════════════════════════════════════════╗
 * ║ THE GOLDEN RULE                                                            ║
 * ╠════════════════════════════════════════════════════════════════════════════╣
 * ║                                                                            ║
 * ║ ES6 classes are "syntactic sugar" over prototypes.                         ║
 * ║                                                                            ║
 * ║   class Person {                                                           ║
 * ║     constructor(name) { this.name = name; }                                ║
 * ║     greet() { return 'Hi'; }        // On prototype                        ║
 * ║     static species() { return '?'; } // On class itself                    ║
 * ║   }                                                                        ║
 * ║                                                                            ║
 * ║ Under the hood, it's still prototypes!                                     ║
 * ║   typeof Person === 'function'                                             ║
 * ║                                                                            ║
 * ╚════════════════════════════════════════════════════════════════════════════╝
 */

// ES6 Class
class Person {
  constructor(name, age) {
    this.name = name;
    this.age = age;
  }

  greet() {
    return 'Hello, I am ' + this.name;
  }

  static species() {
    return 'Homo sapiens';
  }
}

var alice = new Person('Alice', 25);

console.log('A:', alice.greet());
console.log('B:', Person.species());
console.log('C:', typeof Person);

// Class inheritance
class Employee extends Person {
  constructor(name, age, role) {
    super(name, age);
    this.role = role;
  }

  greet() {
    return super.greet() + ', a ' + this.role;
  }
}

var bob = new Employee('Bob', 30, 'Developer');

console.log('D:', bob.greet());
console.log('E:', bob instanceof Person);
console.log('F:', bob instanceof Employee);

/**
 * OUTPUT:
 *   A: Hello, I am Alice
 *   B: Homo sapiens
 *   C: function
 *   D: Hello, I am Bob, a Developer
 *   E: true
 *   F: true
 *
 *
 * ╔════════════════════════════════════════════════════════════════════════════╗
 * ║ STEP-BY-STEP BREAKDOWN                                                     ║
 * ╠════════════════════════════════════════════════════════════════════════════╣
 * ║                                                                            ║
 * ║ A: Instance method                                                         ║
 * ║ ──────────────────                                                         ║
 * ║   greet() is on Person.prototype                                           ║
 * ║   alice.greet() finds it via prototype chain                               ║
 * ║                                                                            ║
 * ║                                                                            ║
 * ║ B: Static method                                                           ║
 * ║ ────────────────                                                           ║
 * ║   species() is on Person itself, not prototype                             ║
 * ║   Called as Person.species(), NOT alice.species()                          ║
 * ║                                                                            ║
 * ║                                                                            ║
 * ║ C: Classes are functions                                                   ║
 * ║ ─────────────────────────                                                  ║
 * ║   typeof Person === 'function'                                             ║
 * ║   Classes are just syntactic sugar over constructor functions              ║
 * ║                                                                            ║
 * ║                                                                            ║
 * ║ D: Inheritance with super                                                  ║
 * ║ ────────────────────────────                                               ║
 * ║   super(name, age) calls Person's constructor                              ║
 * ║   super.greet() calls Person's greet method                                ║
 * ║   Returns 'Hello, I am Bob, a Developer'                                   ║
 * ║                                                                            ║
 * ║                                                                            ║
 * ║ E & F: instanceof checks prototype chain                                   ║
 * ║ ─────────────────────────────────────────                                  ║
 * ║   bob → Employee.prototype → Person.prototype → Object.prototype           ║
 * ║   bob instanceof Person → true (Person.prototype in chain)                 ║
 * ║   bob instanceof Employee → true                                           ║
 * ║                                                                            ║
 * ╚════════════════════════════════════════════════════════════════════════════╝
 *
 *
 * ┌─────────────────────────────────────────────────────────────────────────────┐
 * │ CLASS vs CONSTRUCTOR FUNCTION (Equivalent)                                  │
 * ├─────────────────────────────────────────────────────────────────────────────┤
 * │                                                                             │
 * │   // ES6 Class                          // ES5 Equivalent                   │
 * │   class Person {                        function Person(name) {             │
 * │     constructor(name) {                   this.name = name;                 │
 * │       this.name = name;                 }                                   │
 * │     }                                   Person.prototype.greet = function() │
 * │     greet() {                             return 'Hi ' + this.name;         │
 * │       return 'Hi ' + this.name;         };                                  │
 * │     }                                   Person.species = function() {       │
 * │     static species() {                    return 'Human';                   │
 * │       return 'Human';                   };                                  │
 * │     }                                                                       │
 * │   }                                                                         │
 * │                                                                             │
 * └─────────────────────────────────────────────────────────────────────────────┘
 *
 *
 * RUN: node docs/06-objects-creation/04-class-syntax.js
 */
