/**
 * TOPIC: Factory Function Pattern
 *
 * STORY: Think of a factory function like a pizza shop. You walk in, say "I want
 * pepperoni, large" and they hand you a fresh pizza. No special ritual needed --
 * no "new" keyword, no ceremony. Each pizza is independent. The shop's secret
 * recipe (closure) stays hidden; you only get the finished product.
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
const createPerson = (name, age) => ({ // ES6: function declaration -> arrow function
  name, // ES6: property shorthand
  age,  // ES6: property shorthand
  greet() {
    return `Hello, I am ${this.name}`; // ES6: string concatenation -> template literal
  }
});

const alice = createPerson('Alice', 25); // ES6: var -> const
const bob = createPerson('Bob', 30); // ES6: var -> const

console.log('A:', alice.greet());
console.log('B:', alice === bob);

// Factory with private state (closure)
function createCounter(initial) {
  let count = initial; // ES6: var -> let (mutated)

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

const counter = createCounter(10); // ES6: var -> const
counter.increment();
counter.increment();

console.log('C:', counter.getCount());
console.log('D:', counter.count);

// Factory with composition
const withLogging = (obj) => ({ // ES6: function expression -> arrow function
  ...obj,
  log() {
    console.log('E:', JSON.stringify(this));
  }
});

const loggedPerson = withLogging(createPerson('Charlie', 35)); // ES6: var -> const
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
 * │   const dog = createDog('Rex');                                             │
 * │                                                                             │
 * │   // Constructor: Uses 'new', uses 'this'                                   │
 * │   function Dog(name) {                                                      │
 * │     this.name = name;                                                       │
 * │     this.bark = function() { return 'Woof!'; };                             │
 * │   }                                                                         │
 * │   const dog = new Dog('Rex');                                               │
 * │                                                                             │
 * │   // Class: ES6 syntax, uses 'new'                                          │
 * │   class Dog {                                                               │
 * │     constructor(name) { this.name = name; }                                 │
 * │     bark() { return 'Woof!'; }                                              │
 * │   }                                                                         │
 * │   const dog = new Dog('Rex');                                               │
 * │                                                                             │
 * └─────────────────────────────────────────────────────────────────────────────┘
 *
 *
 * ┌─────────────────────────────────────────────────────────────────────────────┐
 * │ INTERVIEW QUESTIONS:                                                        │
 * ├─────────────────────────────────────────────────────────────────────────────┤
 * │                                                                             │
 * │ Q1: What is a factory function and how does it differ from a constructor?   │
 * │ A1: A factory function is a regular function that returns an object. Unlike │
 * │     constructors, it doesn't use 'new' or 'this', avoids prototype chain    │
 * │     issues, and can leverage closures for truly private state.              │
 * │                                                                             │
 * │ Q2: How do factory functions achieve encapsulation?                         │
 * │ A2: Through closures. Variables declared inside the factory but not on the  │
 * │     returned object are private -- accessible only via the returned methods │
 * │     (e.g., count in createCounter is hidden from outside).                  │
 * │                                                                             │
 * │ Q3: What is composition over inheritance in the context of factories?       │
 * │ A3: Instead of extending a class hierarchy, you compose behavior by mixing  │
 * │     objects together (e.g., withLogging(createPerson(...))). This avoids    │
 * │     tight coupling and the fragile base class problem.                      │
 * │                                                                             │
 * └─────────────────────────────────────────────────────────────────────────────┘
 *
 *
 * RUN: node docs/javascript/06-objects-creation/01-factory-functions.js
 */
