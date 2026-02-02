/**
 * CLASSES & OOP: 03 - Inheritance (extends & super)
 *
 * ╔════════════════════════════════════════════════════════════════════════════╗
 * ║ THE GOLDEN RULE                                                            ║
 * ╠════════════════════════════════════════════════════════════════════════════╣
 * ║                                                                            ║
 * ║ 'extends' creates a parent-child relationship between classes.             ║
 * ║ 'super' calls the parent's constructor or methods.                         ║
 * ║                                                                            ║
 * ║   class Child extends Parent {                                             ║
 * ║     constructor(a, b) {                                                    ║
 * ║       super(a);  // MUST call super() BEFORE using 'this'                  ║
 * ║       this.b = b;                                                          ║
 * ║     }                                                                      ║
 * ║   }                                                                        ║
 * ║                                                                            ║
 * ╚════════════════════════════════════════════════════════════════════════════╝
 *
 *
 * ┌─────────────────────────────────────────────────────────────────────────────┐
 * │ WHEN TO USE INHERITANCE - Real World Justification                          │
 * ├─────────────────────────────────────────────────────────────────────────────┤
 * │                                                                             │
 * │ USE INHERITANCE WHEN:                                                       │
 * │                                                                             │
 * │ 1. TRUE "IS-A" RELATIONSHIP                                                 │
 * │    → Dog IS-A Animal (correct)                                              │
 * │    → ValidationError IS-A Error (correct)                                   │
 * │    → Car IS-A Engine (WRONG - has-a, use composition)                       │
 * │                                                                             │
 * │ 2. SHARED BEHAVIOR ACROSS TYPES                                             │
 * │    → All shapes need area(), perimeter()                                    │
 * │    → All errors need message, stack                                         │
 * │    → All users need authenticate(), authorize()                             │
 * │                                                                             │
 * │ 3. POLYMORPHISM NEEDED                                                      │
 * │    → Process any Animal the same way (all have speak())                     │
 * │    → Handle any Error type (all have .message)                              │
 * │    → Render any Component (all have render())                               │
 * │                                                                             │
 * │ AVOID INHERITANCE WHEN:                                                     │
 * │                                                                             │
 * │ 1. It's a "HAS-A" relationship (use composition)                            │
 * │ 2. You only need to share a few methods (use mixins)                        │
 * │ 3. Inheritance chain gets deeper than 2-3 levels (hard to maintain)         │
 * │                                                                             │
 * └─────────────────────────────────────────────────────────────────────────────┘
 */


// ═══════════════════════════════════════════════════════════════════════════════
// BASIC INHERITANCE
// ═══════════════════════════════════════════════════════════════════════════════

class Animal {
  constructor(name) {
    this.name = name;
  }

  speak() {
    return `${this.name} makes a sound`;
  }

  move() {
    return `${this.name} is moving`;
  }
}

class Dog extends Animal {
  constructor(name, breed) {
    // MUST call super() before using 'this'
    super(name);  // Calls Animal's constructor
    this.breed = breed;
  }

  // Override parent method
  speak() {
    return `${this.name} barks!`;
  }

  // New method specific to Dog
  fetch() {
    return `${this.name} fetches the ball`;
  }
}

const dog = new Dog('Rex', 'German Shepherd');

console.log('A:', dog.name);     // Rex (from Animal)
console.log('B:', dog.breed);    // German Shepherd (from Dog)
console.log('C:', dog.speak());  // Rex barks! (overridden)
console.log('D:', dog.move());   // Rex is moving (inherited)
console.log('E:', dog.fetch());  // Rex fetches the ball (new)

/**
 * OUTPUT:
 *   A: Rex
 *   B: German Shepherd
 *   C: Rex barks!
 *   D: Rex is moving
 *   E: Rex fetches the ball
 */


// ═══════════════════════════════════════════════════════════════════════════════
// CALLING PARENT METHODS WITH super
// ═══════════════════════════════════════════════════════════════════════════════

/**
 * ┌─────────────────────────────────────────────────────────────────────────────┐
 * │ WHEN TO USE super.method()                                                  │
 * ├─────────────────────────────────────────────────────────────────────────────┤
 * │                                                                             │
 * │ Use when you want to EXTEND parent behavior, not REPLACE it:                │
 * │                                                                             │
 * │ 1. Add extra functionality while keeping parent behavior                    │
 * │ 2. Logging or debugging parent operations                                   │
 * │ 3. Pre/post processing around parent logic                                  │
 * │                                                                             │
 * └─────────────────────────────────────────────────────────────────────────────┘
 */

class Employee {
  constructor(name, salary) {
    this.name = name;
    this.salary = salary;
  }

  getDetails() {
    return `${this.name}, Salary: $${this.salary}`;
  }

  calculateBonus() {
    return this.salary * 0.1;  // 10% bonus
  }
}

class Manager extends Employee {
  constructor(name, salary, department) {
    super(name, salary);
    this.department = department;
  }

  // Extend parent method
  getDetails() {
    // Call parent method and add more info
    return `${super.getDetails()}, Department: ${this.department}`;
  }

  // Override with different calculation
  calculateBonus() {
    // Get base bonus + extra for managers
    return super.calculateBonus() + 5000;
  }
}

const manager = new Manager('Alice', 100000, 'Engineering');

console.log('F:', manager.getDetails());
console.log('G:', manager.calculateBonus());

/**
 * OUTPUT:
 *   F: Alice, Salary: $100000, Department: Engineering
 *   G: 15000
 */


// ═══════════════════════════════════════════════════════════════════════════════
// super() MUST COME BEFORE 'this' - COMMON INTERVIEW TRAP
// ═══════════════════════════════════════════════════════════════════════════════

class Parent {
  constructor() {
    this.created = Date.now();
  }
}

class Child extends Parent {
  constructor(name) {
    // This would throw: ReferenceError!
    // this.name = name;  // ERROR: Must call super first

    super();  // Must come first!
    this.name = name;  // Now 'this' is available
  }
}

const child = new Child('Bob');
console.log('H:', child.name);
console.log('I:', child.created);

/**
 * OUTPUT:
 *   H: Bob
 *   I: [timestamp]
 *
 *
 * ┌─────────────────────────────────────────────────────────────────────────────┐
 * │ WHY super() MUST COME FIRST                                                 │
 * ├─────────────────────────────────────────────────────────────────────────────┤
 * │                                                                             │
 * │ In class inheritance, the PARENT constructor creates 'this'.                │
 * │ Until super() runs, 'this' doesn't exist yet!                               │
 * │                                                                             │
 * │   new Child('Bob')                                                          │
 * │     │                                                                       │
 * │     ▼                                                                       │
 * │   Child constructor runs                                                    │
 * │     │                                                                       │
 * │     ├── 'this' doesn't exist yet!                                           │
 * │     │                                                                       │
 * │     ▼                                                                       │
 * │   super() → calls Parent constructor                                        │
 * │     │                                                                       │
 * │     ▼                                                                       │
 * │   Parent constructor creates 'this' object                                  │
 * │     │                                                                       │
 * │     ▼                                                                       │
 * │   Returns to Child constructor                                              │
 * │     │                                                                       │
 * │     ├── NOW 'this' exists!                                                  │
 * │     ▼                                                                       │
 * │   this.name = name  // Works!                                               │
 * │                                                                             │
 * └─────────────────────────────────────────────────────────────────────────────┘
 */


// ═══════════════════════════════════════════════════════════════════════════════
// MULTI-LEVEL INHERITANCE
// ═══════════════════════════════════════════════════════════════════════════════

class Creature {
  constructor(name) {
    this.name = name;
    this.isAlive = true;
  }

  die() {
    this.isAlive = false;
    return `${this.name} has died`;
  }
}

class Pet extends Creature {
  constructor(name, owner) {
    super(name);
    this.owner = owner;
  }

  greet() {
    return `${this.name} belongs to ${this.owner}`;
  }
}

class Cat extends Pet {
  constructor(name, owner, color) {
    super(name, owner);
    this.color = color;
  }

  meow() {
    return `${this.color} cat ${this.name} says Meow!`;
  }
}

const cat = new Cat('Whiskers', 'Alice', 'Orange');

console.log('J:', cat.name);        // Whiskers (from Creature)
console.log('K:', cat.owner);       // Alice (from Pet)
console.log('L:', cat.color);       // Orange (from Cat)
console.log('M:', cat.isAlive);     // true (from Creature)
console.log('N:', cat.greet());     // Whiskers belongs to Alice
console.log('O:', cat.meow());      // Orange cat Whiskers says Meow!
console.log('P:', cat.die());       // Whiskers has died

// instanceof checks the whole chain
console.log('Q:', cat instanceof Cat);       // true
console.log('R:', cat instanceof Pet);       // true
console.log('S:', cat instanceof Creature);  // true
console.log('T:', cat instanceof Object);    // true

/**
 * OUTPUT:
 *   J: Whiskers
 *   K: Alice
 *   L: Orange
 *   M: true
 *   N: Whiskers belongs to Alice
 *   O: Orange cat Whiskers says Meow!
 *   P: Whiskers has died
 *   Q: true
 *   R: true
 *   S: true
 *   T: true
 */


// ═══════════════════════════════════════════════════════════════════════════════
// EXTENDING BUILT-IN CLASSES
// ═══════════════════════════════════════════════════════════════════════════════

/**
 * ┌─────────────────────────────────────────────────────────────────────────────┐
 * │ WHEN TO EXTEND BUILT-INS                                                    │
 * ├─────────────────────────────────────────────────────────────────────────────┤
 * │                                                                             │
 * │ GOOD USE CASES:                                                             │
 * │ 1. Custom Error types (ValidationError, NetworkError)                       │
 * │ 2. Specialized collections (ObservableArray, SortedArray)                   │
 * │ 3. Domain-specific types that truly ARE the built-in + more                 │
 * │                                                                             │
 * │ AVOID:                                                                      │
 * │ 1. Just to add utility methods (use helper functions instead)               │
 * │ 2. When composition would work (NumberWithFormat → use wrapper)             │
 * │                                                                             │
 * └─────────────────────────────────────────────────────────────────────────────┘
 */

// Custom Error - Most common use case
class ValidationError extends Error {
  constructor(message, field) {
    super(message);
    this.name = 'ValidationError';
    this.field = field;
  }
}

class DatabaseError extends Error {
  constructor(message, query) {
    super(message);
    this.name = 'DatabaseError';
    this.query = query;
  }
}

// Using custom errors
function validateUser(user) {
  if (!user.email) {
    throw new ValidationError('Email is required', 'email');
  }
}

try {
  validateUser({ name: 'Bob' });
} catch (e) {
  if (e instanceof ValidationError) {
    console.log('U:', `${e.name}: ${e.message} (field: ${e.field})`);
  }
}

/**
 * OUTPUT:
 *   U: ValidationError: Email is required (field: email)
 */


// ═══════════════════════════════════════════════════════════════════════════════
// EXTENDING ARRAY
// ═══════════════════════════════════════════════════════════════════════════════

class Stack extends Array {
  // Add stack-specific methods
  peek() {
    return this[this.length - 1];
  }

  isEmpty() {
    return this.length === 0;
  }

  // Override push to limit size
  push(...items) {
    if (this.length + items.length > 10) {
      throw new Error('Stack overflow! Max size is 10');
    }
    return super.push(...items);
  }
}

const stack = new Stack();
stack.push(1, 2, 3);

console.log('V:', stack.peek());     // 3
console.log('W:', stack.pop());      // 3 (inherited from Array)
console.log('X:', stack.isEmpty());  // false
console.log('Y:', stack.length);     // 2
console.log('Z:', stack instanceof Array);  // true

/**
 * OUTPUT:
 *   V: 3
 *   W: 3
 *   X: false
 *   Y: 2
 *   Z: true
 */


// ═══════════════════════════════════════════════════════════════════════════════
// PRE-ES6 INHERITANCE (For Understanding Legacy Code)
// ═══════════════════════════════════════════════════════════════════════════════

/**
 * ┌─────────────────────────────────────────────────────────────────────────────┐
 * │ ES5 vs ES6 INHERITANCE                                                      │
 * ├─────────────────────────────────────────────────────────────────────────────┤
 * │                                                                             │
 * │ ES5 (Constructor Functions):                                                │
 * │                                                                             │
 * │   function Animal(name) {                                                   │
 * │     this.name = name;                                                       │
 * │   }                                                                         │
 * │   Animal.prototype.speak = function() { return this.name + ' speaks'; };    │
 * │                                                                             │
 * │   function Dog(name, breed) {                                               │
 * │     Animal.call(this, name);  // Call parent constructor                    │
 * │     this.breed = breed;                                                     │
 * │   }                                                                         │
 * │   Dog.prototype = Object.create(Animal.prototype);  // Set up chain         │
 * │   Dog.prototype.constructor = Dog;  // Fix constructor reference            │
 * │                                                                             │
 * │                                                                             │
 * │ ES6 (Classes):                                                              │
 * │                                                                             │
 * │   class Animal {                                                            │
 * │     constructor(name) { this.name = name; }                                 │
 * │     speak() { return this.name + ' speaks'; }                               │
 * │   }                                                                         │
 * │                                                                             │
 * │   class Dog extends Animal {                                                │
 * │     constructor(name, breed) {                                              │
 * │       super(name);                                                          │
 * │       this.breed = breed;                                                   │
 * │     }                                                                       │
 * │   }                                                                         │
 * │                                                                             │
 * │ Much cleaner! ES6 classes handle all the prototype wiring for you.          │
 * │                                                                             │
 * └─────────────────────────────────────────────────────────────────────────────┘
 */


/**
 * ┌─────────────────────────────────────────────────────────────────────────────┐
 * │ INTERVIEW ANSWER                                                            │
 * ├─────────────────────────────────────────────────────────────────────────────┤
 * │                                                                             │
 * │ "ES6 inheritance uses 'extends' to create parent-child relationships and    │
 * │  'super' to call parent constructors and methods.                           │
 * │                                                                             │
 * │  Key rules:                                                                 │
 * │  1. super() MUST be called before using 'this' in child constructor         │
 * │     Because the parent creates 'this' - it doesn't exist until super runs   │
 * │                                                                             │
 * │  2. super.method() calls parent method (for extending, not replacing)       │
 * │                                                                             │
 * │  3. instanceof checks the entire prototype chain                            │
 * │                                                                             │
 * │  When to use inheritance:                                                   │
 * │  - True 'IS-A' relationships (Dog IS-A Animal)                              │
 * │  - Custom Error types (ValidationError extends Error)                       │
 * │  - Polymorphism (treat all shapes the same way)                             │
 * │                                                                             │
 * │  When to avoid:                                                             │
 * │  - 'HAS-A' relationships (Car HAS-A Engine - use composition)               │
 * │  - Deep hierarchies (more than 2-3 levels becomes hard to maintain)         │
 * │  - When you only need a few shared methods (use mixins/composition)         │
 * │                                                                             │
 * │  Extending built-ins:                                                       │
 * │  - Custom Error classes are the most common and useful                      │
 * │  - Custom Array types (Stack, Queue) when behavior truly extends Array      │
 * │  - Be careful - not all built-ins extend cleanly in all environments"       │
 * │                                                                             │
 * └─────────────────────────────────────────────────────────────────────────────┘
 *
 *
 * RUN: node docs/15-classes-oop/03-inheritance.js
 */
