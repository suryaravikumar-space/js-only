/**
 * TOPIC: Constructor Functions
 *
 * ╔════════════════════════════════════════════════════════════════════════════╗
 * ║ THE GOLDEN RULE                                                            ║
 * ╠════════════════════════════════════════════════════════════════════════════╣
 * ║                                                                            ║
 * ║ When you call new Constructor():                                           ║
 * ║   1. Create new empty object                                               ║
 * ║   2. Set its __proto__ to Constructor.prototype                            ║
 * ║   3. Call Constructor with this = new object                               ║
 * ║   4. Return the new object (unless constructor returns an object)          ║
 * ║                                                                            ║
 * ║ Methods on Constructor.prototype are SHARED by all instances.              ║
 * ║                                                                            ║
 * ╚════════════════════════════════════════════════════════════════════════════╝
 *
 * STORY: Think of a constructor function like a cookie cutter. The cookie
 * cutter (Person) stamps out cookies (instances) that all have the same shape.
 * Each cookie gets its own decoration (name), but they all share the same
 * recipe book (prototype methods) — you don't photocopy the recipe for each cookie.
 */

function Person(name) {
  this.name = name;
}

Person.prototype.greet = function() {
  return `Hello, I am ${this.name}`;
};

const alice = new Person('Alice'); // ES6: const
const bob = new Person('Bob'); // ES6: const

console.log('A:', alice.name);
console.log('B:', alice.greet());
console.log('C:', bob.greet());
console.log('D:', alice.greet === bob.greet);
console.log('E:', alice instanceof Person);
console.log('F:', alice.constructor === Person);

/**
 * OUTPUT:
 *   A: Alice
 *   B: Hello, I am Alice
 *   C: Hello, I am Bob
 *   D: true
 *   E: true
 *   F: true
 *
 *
 * ╔════════════════════════════════════════════════════════════════════════════╗
 * ║ STEP-BY-STEP BREAKDOWN                                                     ║
 * ╠════════════════════════════════════════════════════════════════════════════╣
 * ║                                                                            ║
 * ║ new Person('Alice') does:                                                  ║
 * ║ ─────────────────────────                                                  ║
 * ║   1. Create {}                                                             ║
 * ║   2. Set {}.__proto__ = Person.prototype                                   ║
 * ║   3. Call Person('Alice') with this = {}                                   ║
 * ║   4. this.name = 'Alice' → { name: 'Alice' }                               ║
 * ║   5. Return { name: 'Alice' }                                              ║
 * ║                                                                            ║
 * ║                                                                            ║
 * ║ A: alice.name                                                              ║
 * ║ ─────────────                                                              ║
 * ║   • Check alice → found 'name: Alice'                                      ║
 * ║   • Returns 'Alice'                                                        ║
 * ║                                                                            ║
 * ║                                                                            ║
 * ║ B: alice.greet()                                                           ║
 * ║ ────────────────                                                           ║
 * ║   • Check alice → greet not found                                          ║
 * ║   • Check alice.__proto__ (Person.prototype) → found greet                 ║
 * ║   • Call greet with this = alice                                           ║
 * ║   • Returns 'Hello, I am Alice'                                            ║
 * ║                                                                            ║
 * ║                                                                            ║
 * ║ C: bob.greet()                                                             ║
 * ║ ──────────────                                                             ║
 * ║   • Same lookup, but this = bob                                            ║
 * ║   • Returns 'Hello, I am Bob'                                              ║
 * ║                                                                            ║
 * ║                                                                            ║
 * ║ D: alice.greet === bob.greet                                               ║
 * ║ ────────────────────────────                                               ║
 * ║   • Both reference the SAME function on Person.prototype                   ║
 * ║   • Returns true                                                           ║
 * ║                                                                            ║
 * ║   This is the memory efficiency of prototypes!                             ║
 * ║                                                                            ║
 * ║                                                                            ║
 * ║ E: alice instanceof Person                                                 ║
 * ║ ──────────────────────────                                                 ║
 * ║   • Checks if Person.prototype is in alice's prototype chain               ║
 * ║   • alice.__proto__ === Person.prototype                                   ║
 * ║   • Returns true                                                           ║
 * ║                                                                            ║
 * ║                                                                            ║
 * ║ F: alice.constructor === Person                                            ║
 * ║ ───────────────────────────────                                            ║
 * ║   • alice doesn't have constructor property                                ║
 * ║   • Check Person.prototype → has constructor: Person                       ║
 * ║   • Returns true                                                           ║
 * ║                                                                            ║
 * ╚════════════════════════════════════════════════════════════════════════════╝
 *
 *
 * ┌─────────────────────────────────────────────────────────────────────────────┐
 * │ VISUAL: Constructor & Prototype Relationship                                │
 * ├─────────────────────────────────────────────────────────────────────────────┤
 * │                                                                             │
 * │   ┌───────────────────────────────────────────────────────────────────┐     │
 * │   │  Person (function)                                                │     │
 * │   │                                                                   │     │
 * │   │  prototype ─────────────────────────────────────────────────┐     │     │
 * │   │                                                             │     │     │
 * │   └───────────────────────────────────────────────────────────────────┘     │
 * │                                                                 │           │
 * │                                                                 ▼           │
 * │   ┌───────────────────────────────────────────────────────────────────┐     │
 * │   │  Person.prototype                                                 │     │
 * │   │                                                                   │     │
 * │   │  constructor: Person ◄───────────────────────────────────────┐    │     │
 * │   │  greet: function                                             │    │     │
 * │   │                                                              │    │     │
 * │   └───────────────────────────────────────────────────────────────────┘     │
 * │                          ▲                        ▲                         │
 * │                          │                        │                         │
 * │   ┌──────────────────────┴───┐    ┌──────────────┴─────────┐               │
 * │   │  alice                   │    │  bob                   │               │
 * │   │                          │    │                        │               │
 * │   │  name: 'Alice'           │    │  name: 'Bob'           │               │
 * │   │  __proto__ ──────────────┘    │  __proto__ ────────────┘               │
 * │   │                          │    │                        │               │
 * │   └──────────────────────────┘    └────────────────────────┘               │
 * │                                                                             │
 * │   alice and bob SHARE the same greet function!                              │
 * │                                                                             │
 * └─────────────────────────────────────────────────────────────────────────────┘
 *
 *
 * ┌─────────────────────────────────────────────────────────────────────────────┐
 * │ INTERVIEW QUESTIONS:                                                        │
 * ├─────────────────────────────────────────────────────────────────────────────┤
 * │                                                                             │
 * │ Q1: What are the 4 steps that happen when you use the `new` keyword?        │
 * │ A1: 1) A new empty object is created. 2) Its __proto__ is linked to         │
 * │     Constructor.prototype. 3) The constructor runs with `this` set to       │
 * │     the new object. 4) The new object is returned (unless the constructor   │
 * │     explicitly returns a different object).                                 │
 * │                                                                             │
 * │ Q2: Why put methods on the prototype instead of inside the constructor?     │
 * │ A2: Memory efficiency. Methods on the prototype are shared by all           │
 * │     instances (alice.greet === bob.greet is true). If defined inside the    │
 * │     constructor with this.greet = function(){}, each instance gets its      │
 * │     own copy, wasting memory.                                               │
 * │                                                                             │
 * │ Q3: How does `instanceof` work under the hood?                              │
 * │ A3: `alice instanceof Person` checks whether Person.prototype exists        │
 * │     anywhere in alice's prototype chain. It walks up __proto__ links        │
 * │     until it finds a match or reaches null.                                 │
 * │                                                                             │
 * └─────────────────────────────────────────────────────────────────────────────┘
 *
 *
 * RUN: node docs/javascript/03-prototypes/02-constructor-functions.js
 */
