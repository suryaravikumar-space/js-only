/**
 * CLASSES & OOP: 00 - Class Basics
 *
 * ╔════════════════════════════════════════════════════════════════════════════╗
 * ║ THE GOLDEN RULE                                                            ║
 * ╠════════════════════════════════════════════════════════════════════════════╣
 * ║                                                                            ║
 * ║ ES6 classes are SYNTACTIC SUGAR over JavaScript's prototype-based         ║
 * ║ inheritance. Under the hood, they still use prototypes!                    ║
 * ║                                                                            ║
 * ║   class Dog { }                                                            ║
 * ║   typeof Dog  // "function" - Classes are just special functions!         ║
 * ║                                                                            ║
 * ╚════════════════════════════════════════════════════════════════════════════╝
 *
 *
 * ┌─────────────────────────────────────────────────────────────────────────────┐
 * │ WHEN TO USE CLASSES - Real World Justification                             │
 * ├─────────────────────────────────────────────────────────────────────────────┤
 * │                                                                             │
 * │ USE CLASSES WHEN:                                                           │
 * │                                                                             │
 * │ 1. You need multiple instances with shared behavior                         │
 * │    → User objects, Product objects, Order objects                           │
 * │    → Each instance has own data but shares methods                          │
 * │                                                                             │
 * │ 2. You need inheritance hierarchy                                           │
 * │    → Animal → Dog → GermanShepherd                                          │
 * │    → Shape → Circle, Rectangle                                              │
 * │                                                                             │
 * │ 3. Working with frameworks that expect classes                              │
 * │    → React class components (legacy but still used)                         │
 * │    → Angular, NestJS, TypeORM                                               │
 * │                                                                             │
 * │ 4. You need instanceof checks                                               │
 * │    → Error handling: if (err instanceof ValidationError)                    │
 * │    → Type narrowing in TypeScript                                           │
 * │                                                                             │
 * │ 5. Team comes from OOP background (Java, C#)                                │
 * │    → Familiar syntax, easier onboarding                                     │
 * │                                                                             │
 * └─────────────────────────────────────────────────────────────────────────────┘
 */


// ═══════════════════════════════════════════════════════════════════════════════
// BASIC CLASS SYNTAX
// ═══════════════════════════════════════════════════════════════════════════════

class User {
  // Constructor - called when you use 'new'
  constructor(name, email) {
    // 'this' refers to the new instance being created
    this.name = name;
    this.email = email;
    this.createdAt = new Date();
  }

  // Methods - automatically added to prototype (memory efficient!)
  greet() {
    return `Hello, I'm ${this.name}`;
  }

  getInfo() {
    return `${this.name} (${this.email})`;
  }
}

// Creating instances with 'new'
const user1 = new User('Alice', 'alice@example.com');
const user2 = new User('Bob', 'bob@example.com');

console.log('A:', user1.greet());
console.log('B:', user2.greet());
console.log('C:', user1.getInfo());

/**
 * OUTPUT:
 *   A: Hello, I'm Alice
 *   B: Hello, I'm Bob
 *   C: Alice (alice@example.com)
 */


// ═══════════════════════════════════════════════════════════════════════════════
// PROOF THAT CLASSES ARE FUNCTIONS
// ═══════════════════════════════════════════════════════════════════════════════

console.log('D:', typeof User);                      // "function"
console.log('E:', User.prototype.constructor === User);  // true
console.log('F:', user1 instanceof User);            // true
console.log('G:', user1.greet === user2.greet);      // true - SAME function!

/**
 * OUTPUT:
 *   D: function
 *   E: true
 *   F: true
 *   G: true
 *
 *
 * ┌─────────────────────────────────────────────────────────────────────────────┐
 * │ VISUAL: How Classes Work Under the Hood                                     │
 * ├─────────────────────────────────────────────────────────────────────────────┤
 * │                                                                             │
 * │   class User { ... }                                                        │
 * │         │                                                                   │
 * │         ▼                                                                   │
 * │   ┌─────────────────────────────────┐                                       │
 * │   │ User (function)                 │                                       │
 * │   │                                 │                                       │
 * │   │ prototype ──────────────────────┼──▶ ┌────────────────────────┐         │
 * │   │                                 │    │ User.prototype         │         │
 * │   └─────────────────────────────────┘    │                        │         │
 * │                                          │ constructor: User      │         │
 * │                                          │ greet: function()      │         │
 * │                                          │ getInfo: function()    │         │
 * │                                          └────────────────────────┘         │
 * │                                                    ▲                        │
 * │                                                    │ [[Prototype]]          │
 * │   new User('Alice', 'alice@...')                   │                        │
 * │         │                                          │                        │
 * │         ▼                                          │                        │
 * │   ┌─────────────────────────────────┐              │                        │
 * │   │ user1 (instance)                │──────────────┘                        │
 * │   │                                 │                                       │
 * │   │ name: 'Alice'                   │                                       │
 * │   │ email: 'alice@example.com'      │                                       │
 * │   │ createdAt: Date                 │                                       │
 * │   └─────────────────────────────────┘                                       │
 * │                                                                             │
 * │   Methods are on PROTOTYPE (shared), data is on INSTANCE (separate)         │
 * │                                                                             │
 * └─────────────────────────────────────────────────────────────────────────────┘
 */


// ═══════════════════════════════════════════════════════════════════════════════
// CLASS EXPRESSIONS (Less Common)
// ═══════════════════════════════════════════════════════════════════════════════

// Named class expression
const Animal = class AnimalClass {
  constructor(name) {
    this.name = name;
  }
};

// Anonymous class expression
const Vehicle = class {
  constructor(brand) {
    this.brand = brand;
  }
};

const dog = new Animal('Rex');
const car = new Vehicle('Toyota');

console.log('H:', dog.name);  // Rex
console.log('I:', car.brand); // Toyota


// ═══════════════════════════════════════════════════════════════════════════════
// WHY METHODS ARE SHARED (Memory Efficiency)
// ═══════════════════════════════════════════════════════════════════════════════

/**
 * ┌─────────────────────────────────────────────────────────────────────────────┐
 * │ MEMORY COMPARISON                                                           │
 * ├─────────────────────────────────────────────────────────────────────────────┤
 * │                                                                             │
 * │ WITHOUT CLASSES (methods on each instance):                                 │
 * │                                                                             │
 * │   function createUser(name) {                                               │
 * │     return {                                                                │
 * │       name: name,                                                           │
 * │       greet: function() { ... },  // New function EVERY time!               │
 * │       getInfo: function() { ... } // New function EVERY time!               │
 * │     };                                                                      │
 * │   }                                                                         │
 * │                                                                             │
 * │   1000 users = 1000 copies of greet + 1000 copies of getInfo                │
 * │                = 2000 function objects in memory!                           │
 * │                                                                             │
 * │                                                                             │
 * │ WITH CLASSES (methods on prototype):                                        │
 * │                                                                             │
 * │   class User {                                                              │
 * │     greet() { ... }    // On prototype - ONE copy                           │
 * │     getInfo() { ... }  // On prototype - ONE copy                           │
 * │   }                                                                         │
 * │                                                                             │
 * │   1000 users = 1 copy of greet + 1 copy of getInfo                          │
 * │                = 2 function objects in memory!                              │
 * │                                                                             │
 * └─────────────────────────────────────────────────────────────────────────────┘
 */


// ═══════════════════════════════════════════════════════════════════════════════
// CLASS MUST USE 'new'
// ═══════════════════════════════════════════════════════════════════════════════

class Product {
  constructor(name, price) {
    this.name = name;
    this.price = price;
  }
}

// Correct
const laptop = new Product('Laptop', 999);
console.log('J:', laptop.name);  // Laptop

// Incorrect - will throw TypeError!
try {
  const phone = Product('Phone', 799);  // Missing 'new'
} catch (e) {
  console.log('K:', e.message);
}

/**
 * OUTPUT:
 *   J: Laptop
 *   K: Class constructor Product cannot be invoked without 'new'
 *
 *
 * ┌─────────────────────────────────────────────────────────────────────────────┐
 * │ WHY 'new' IS REQUIRED                                                       │
 * ├─────────────────────────────────────────────────────────────────────────────┤
 * │                                                                             │
 * │ The 'new' keyword does 4 things:                                            │
 * │                                                                             │
 * │   1. Creates a new empty object: {}                                         │
 * │   2. Links it to the prototype: obj.__proto__ = Constructor.prototype       │
 * │   3. Binds 'this' to the new object                                         │
 * │   4. Returns the new object (unless constructor returns another object)     │
 * │                                                                             │
 * │ Without 'new', 'this' would be undefined (in strict mode) or window/global  │
 * │ Classes enforce this to prevent bugs!                                       │
 * │                                                                             │
 * └─────────────────────────────────────────────────────────────────────────────┘
 */


// ═══════════════════════════════════════════════════════════════════════════════
// ADDING METHODS AFTER CLASS DEFINITION
// ═══════════════════════════════════════════════════════════════════════════════

class Counter {
  constructor() {
    this.count = 0;
  }

  increment() {
    this.count++;
    return this;  // Return 'this' for method chaining
  }
}

// Add method to prototype AFTER class definition
Counter.prototype.decrement = function() {
  this.count--;
  return this;
};

const counter = new Counter();
counter.increment().increment().decrement();  // Method chaining!
console.log('L:', counter.count);  // 1

/**
 * OUTPUT:
 *   L: 1
 */


/**
 * ┌─────────────────────────────────────────────────────────────────────────────┐
 * │ INTERVIEW ANSWER                                                            │
 * ├─────────────────────────────────────────────────────────────────────────────┤
 * │                                                                             │
 * │ "ES6 classes are syntactic sugar over JavaScript's prototype-based          │
 * │  inheritance. Under the hood, a class is just a special function, and       │
 * │  typeof MyClass returns 'function'.                                         │
 * │                                                                             │
 * │  Key points about classes:                                                  │
 * │                                                                             │
 * │  1. Constructor is called with 'new' to create instances                    │
 * │  2. Methods are automatically added to the prototype, not each instance     │
 * │     This is memory efficient - all instances share the same method          │
 * │  3. Unlike regular functions, classes MUST be called with 'new'             │
 * │  4. Classes are NOT hoisted like function declarations                      │
 * │  5. Class body always runs in strict mode                                   │
 * │                                                                             │
 * │  When to use classes:                                                       │
 * │  - Multiple instances with shared behavior (Users, Products, etc.)          │
 * │  - Inheritance hierarchies (Animal → Dog → GermanShepherd)                  │
 * │  - Working with OOP-oriented frameworks (Angular, NestJS, TypeORM)          │
 * │  - When instanceof checks are needed for type narrowing                     │
 * │                                                                             │
 * │  When NOT to use classes:                                                   │
 * │  - Simple objects with no methods (use object literals)                     │
 * │  - Functions that don't need 'this' (use regular functions)                 │
 * │  - When you need true privacy (use closures or private fields #)            │
 * │  - React functional components with hooks"                                  │
 * │                                                                             │
 * └─────────────────────────────────────────────────────────────────────────────┘
 *
 *
 * RUN: node docs/15-classes-oop/00-class-basics.js
 */
