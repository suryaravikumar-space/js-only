/**
 * CHALLENGE 02: Constructor Functions
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
 */

function Person(name) {
  this.name = name;
}

Person.prototype.greet = function() {
  return 'Hello, I am ' + this.name;
};

var alice = new Person('Alice');
var bob = new Person('Bob');

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
 * │ INTERVIEW ANSWER                                                            │
 * ├─────────────────────────────────────────────────────────────────────────────┤
 * │                                                                             │
 * │ "Constructor functions are the traditional way to create 'classes' in       │
 * │  JavaScript. When you call new Person(), JavaScript:                        │
 * │  1. Creates a new empty object                                              │
 * │  2. Links its __proto__ to Person.prototype                                 │
 * │  3. Runs the constructor with this = new object                             │
 * │  4. Returns the new object                                                  │
 * │                                                                             │
 * │  Methods defined on Constructor.prototype are shared by all instances.      │
 * │  This is memory efficient - alice.greet and bob.greet are the same          │
 * │  function reference, not copies.                                            │
 * │                                                                             │
 * │  Properties defined with this.property in the constructor are per-instance  │
 * │  (alice.name is separate from bob.name).                                    │
 * │                                                                             │
 * │  instanceof works by checking if Constructor.prototype appears in           │
 * │  the object's prototype chain. alice instanceof Person is true              │
 * │  because alice.__proto__ === Person.prototype."                             │
 * │                                                                             │
 * └─────────────────────────────────────────────────────────────────────────────┘
 *
 *
 * RUN: node docs/03-prototypes/02-constructor-functions.js
 */
