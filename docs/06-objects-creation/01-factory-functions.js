/**
 * CHALLENGE 01: Factory Function Pattern
 *
 * ╔════════════════════════════════════════════════════════════════════════════╗
 * ║ THE GOLDEN RULE                                                            ║
 * ╠════════════════════════════════════════════════════════════════════════════╣
 * ║                                                                            ║
 * ║ Factory functions are regular functions that return new objects.           ║
 * ║ No 'new' keyword needed!                                                   ║
 * ║                                                                            ║
 * ║   function createThing(params) {                                           ║
 * ║     return { ...properties, ...methods };                                  ║
 * ║   }                                                                        ║
 * ║                                                                            ║
 * ║ Benefits:                                                                  ║
 * ║   - Can create private state via closures                                  ║
 * ║   - No 'this' binding issues                                               ║
 * ║   - Easy composition over inheritance                                      ║
 * ║                                                                            ║
 * ╚════════════════════════════════════════════════════════════════════════════╝
 */

// Basic factory function
function createPerson(name, age) {
  return {
    name: name,
    age: age,
    greet() {
      return 'Hello, I am ' + this.name;
    }
  };
}

var alice = createPerson('Alice', 25);
var bob = createPerson('Bob', 30);

console.log('A:', alice.greet());
console.log('B:', alice === bob);

// Factory with private state (closure)
function createCounter(initial) {
  var count = initial;

  return {
    increment() {
      count++;
      return count;
    },
    decrement() {
      count--;
      return count;
    },
    getCount() {
      return count;
    }
  };
}

var counter = createCounter(10);
counter.increment();
counter.increment();

console.log('C:', counter.getCount());
console.log('D:', counter.count);

// Factory with composition
function withLogging(obj) {
  return {
    ...obj,
    log() {
      console.log('E:', JSON.stringify(this));
    }
  };
}

var loggedPerson = withLogging(createPerson('Charlie', 35));
loggedPerson.log();

/**
 * OUTPUT:
 *   A: Hello, I am Alice
 *   B: false
 *   C: 12
 *   D: undefined
 *   E: {"name":"Charlie","age":35}
 *
 *
 * ╔════════════════════════════════════════════════════════════════════════════╗
 * ║ STEP-BY-STEP BREAKDOWN                                                     ║
 * ╠════════════════════════════════════════════════════════════════════════════╣
 * ║                                                                            ║
 * ║ A: Factory creates new object each call                                    ║
 * ║ ──────────────────────────────────────                                     ║
 * ║   alice = { name: 'Alice', age: 25, greet: fn }                            ║
 * ║   alice.greet() → 'Hello, I am Alice'                                      ║
 * ║                                                                            ║
 * ║                                                                            ║
 * ║ B: Each call creates a NEW object                                          ║
 * ║ ────────────────────────────────────                                       ║
 * ║   alice !== bob (different object references)                              ║
 * ║   Returns false                                                            ║
 * ║                                                                            ║
 * ║                                                                            ║
 * ║ C: Private state via closure                                               ║
 * ║ ─────────────────────────────                                              ║
 * ║   count starts at 10                                                       ║
 * ║   increment() → 11, increment() → 12                                       ║
 * ║   getCount() returns 12                                                    ║
 * ║                                                                            ║
 * ║                                                                            ║
 * ║ D: count is private!                                                       ║
 * ║ ─────────────────────                                                      ║
 * ║   counter.count → undefined (not exposed on object)                        ║
 * ║   count variable is only in closure scope                                  ║
 * ║                                                                            ║
 * ║                                                                            ║
 * ║ E: Composition pattern                                                     ║
 * ║ ─────────────────────                                                      ║
 * ║   withLogging() takes an object and adds log method                        ║
 * ║   Returns new object with all original props + log                         ║
 * ║                                                                            ║
 * ╚════════════════════════════════════════════════════════════════════════════╝
 *
 *
 * ┌─────────────────────────────────────────────────────────────────────────────┐
 * │ FACTORY vs CONSTRUCTOR vs CLASS                                             │
 * ├─────────────────────────────────────────────────────────────────────────────┤
 * │                                                                             │
 * │   // Factory: No 'new', returns object                                      │
 * │   function createDog(name) {                                                │
 * │     return { name, bark() { return 'Woof!'; } };                            │
 * │   }                                                                         │
 * │   var dog = createDog('Rex');                                               │
 * │                                                                             │
 * │   // Constructor: Uses 'new', uses 'this'                                   │
 * │   function Dog(name) {                                                      │
 * │     this.name = name;                                                       │
 * │     this.bark = function() { return 'Woof!'; };                             │
 * │   }                                                                         │
 * │   var dog = new Dog('Rex');                                                 │
 * │                                                                             │
 * │   // Class: ES6 syntax, uses 'new'                                          │
 * │   class Dog {                                                               │
 * │     constructor(name) { this.name = name; }                                 │
 * │     bark() { return 'Woof!'; }                                              │
 * │   }                                                                         │
 * │   var dog = new Dog('Rex');                                                 │
 * │                                                                             │
 * └─────────────────────────────────────────────────────────────────────────────┘
 *
 *
 * RUN: node docs/06-objects-creation/01-factory-functions.js
 */
