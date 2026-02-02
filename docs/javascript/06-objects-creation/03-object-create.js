/**
 * CHALLENGE 03: Object.create() Method
 *
 * ╔════════════════════════════════════════════════════════════════════════════╗
 * ║ THE GOLDEN RULE                                                            ║
 * ╠════════════════════════════════════════════════════════════════════════════╣
 * ║                                                                            ║
 * ║ Object.create(proto, [propertyDescriptors])                                ║
 * ║                                                                            ║
 * ║ Creates a new object with the specified prototype.                         ║
 * ║                                                                            ║
 * ║   var child = Object.create(parent);                                       ║
 * ║   // child.[[Prototype]] = parent                                          ║
 * ║                                                                            ║
 * ║ Special case: Object.create(null)                                          ║
 * ║   Creates an object with NO prototype - a "pure dictionary"                ║
 * ║                                                                            ║
 * ╚════════════════════════════════════════════════════════════════════════════╝
 */

// Object.create with prototype
var personProto = {
  greet() {
    return 'Hello, I am ' + this.name;
  },
  describe() {
    return this.name + ' is ' + this.age + ' years old';
  }
};

var alice = Object.create(personProto);
alice.name = 'Alice';
alice.age = 25;

console.log('A:', alice.greet());
console.log('B:', Object.getPrototypeOf(alice) === personProto);

// Object.create with property descriptors
var bob = Object.create(personProto, {
  name: {
    value: 'Bob',
    writable: true,
    enumerable: true,
    configurable: true
  },
  age: {
    value: 30,
    writable: false,
    enumerable: true,
    configurable: false
  }
});

bob.age = 100;  // Try to change non-writable property
console.log('C:', bob.age);

// Object.create(null) - pure dictionary
var dict = Object.create(null);
dict.key = 'value';

console.log('D:', dict.hasOwnProperty);
console.log('E:', 'key' in dict);

/**
 * OUTPUT:
 *   A: Hello, I am Alice
 *   B: true
 *   C: 30
 *   D: undefined
 *   E: true
 *
 *
 * ╔════════════════════════════════════════════════════════════════════════════╗
 * ║ STEP-BY-STEP BREAKDOWN                                                     ║
 * ╠════════════════════════════════════════════════════════════════════════════╣
 * ║                                                                            ║
 * ║ A: Object.create sets up prototype chain                                   ║
 * ║ ──────────────────────────────────────────                                 ║
 * ║   alice.[[Prototype]] = personProto                                        ║
 * ║   alice.greet() finds greet on prototype                                   ║
 * ║   'this' inside greet is alice                                             ║
 * ║   Returns 'Hello, I am Alice'                                              ║
 * ║                                                                            ║
 * ║                                                                            ║
 * ║ B: Verifying prototype                                                     ║
 * ║ ────────────────────────                                                   ║
 * ║   Object.getPrototypeOf(alice) returns personProto                         ║
 * ║   personProto === personProto → true                                       ║
 * ║                                                                            ║
 * ║                                                                            ║
 * ║ C: Non-writable property                                                   ║
 * ║ ─────────────────────────                                                  ║
 * ║   bob.age was created with writable: false                                 ║
 * ║   bob.age = 100 silently fails (or throws in strict mode)                  ║
 * ║   bob.age is still 30                                                      ║
 * ║                                                                            ║
 * ║                                                                            ║
 * ║ D: Object.create(null) has no prototype                                    ║
 * ║ ──────────────────────────────────────────                                 ║
 * ║   dict has NO prototype (not even Object.prototype)                        ║
 * ║   dict.hasOwnProperty → undefined (doesn't exist!)                         ║
 * ║   No inherited methods at all                                              ║
 * ║                                                                            ║
 * ║                                                                            ║
 * ║ E: 'in' operator still works                                               ║
 * ║ ─────────────────────────────                                              ║
 * ║   'key' in dict checks if property exists                                  ║
 * ║   dict.key = 'value' was set                                               ║
 * ║   Returns true                                                             ║
 * ║                                                                            ║
 * ╚════════════════════════════════════════════════════════════════════════════╝
 *
 *
 * ┌─────────────────────────────────────────────────────────────────────────────┐
 * │ WHEN TO USE Object.create(null)                                             │
 * ├─────────────────────────────────────────────────────────────────────────────┤
 * │                                                                             │
 * │   // Problem: Regular objects have inherited properties                     │
 * │   var config = {};                                                          │
 * │   config['constructor'];     // [Function: Object] - inherited!            │
 * │   config['hasOwnProperty'];  // [Function] - inherited!                    │
 * │                                                                             │
 * │   // Solution: Pure dictionary                                              │
 * │   var config = Object.create(null);                                         │
 * │   config['constructor'];     // undefined - clean!                         │
 * │   config['hasOwnProperty'];  // undefined - clean!                         │
 * │                                                                             │
 * │   // Use cases:                                                             │
 * │   // - Hash maps / dictionaries                                             │
 * │   // - Configuration objects                                                │
 * │   // - Caching (keys might conflict with inherited properties)              │
 * │                                                                             │
 * └─────────────────────────────────────────────────────────────────────────────┘
 *
 *
 * RUN: node docs/06-objects-creation/03-object-create.js
 */
