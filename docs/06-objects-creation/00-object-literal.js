/**
 * CHALLENGE 00: Object Literal Syntax and Shorthand
 *
 * ╔════════════════════════════════════════════════════════════════════════════╗
 * ║ THE GOLDEN RULE                                                            ║
 * ╠════════════════════════════════════════════════════════════════════════════╣
 * ║                                                                            ║
 * ║ Object literals are the simplest way to create objects in JavaScript.      ║
 * ║                                                                            ║
 * ║   var obj = { key: value };                                                ║
 * ║                                                                            ║
 * ║ ES6 added powerful shorthand syntax:                                       ║
 * ║   - Property shorthand: { name } instead of { name: name }                 ║
 * ║   - Method shorthand: { greet() {} } instead of { greet: function() {} }   ║
 * ║   - Computed properties: { [expression]: value }                           ║
 * ║                                                                            ║
 * ╚════════════════════════════════════════════════════════════════════════════╝
 */

// Basic object literal
var person = {
  name: 'Alice',
  age: 25
};

console.log('A:', person.name);

// Property shorthand (ES6)
var name = 'Bob';
var age = 30;

var user = { name, age };
console.log('B:', user.name, user.age);

// Method shorthand (ES6)
var calculator = {
  value: 10,
  double() {
    return this.value * 2;
  },
  triple: function() {
    return this.value * 3;
  }
};

console.log('C:', calculator.double());

// Computed property names
var key = 'dynamicKey';
var obj = {
  [key]: 'dynamicValue',
  ['prefix_' + key]: 'prefixed'
};

console.log('D:', obj.dynamicKey);
console.log('E:', obj.prefix_dynamicKey);

/**
 * OUTPUT:
 *   A: Alice
 *   B: Bob 30
 *   C: 20
 *   D: dynamicValue
 *   E: prefixed
 *
 *
 * ╔════════════════════════════════════════════════════════════════════════════╗
 * ║ STEP-BY-STEP BREAKDOWN                                                     ║
 * ╠════════════════════════════════════════════════════════════════════════════╣
 * ║                                                                            ║
 * ║ A: Basic object literal                                                    ║
 * ║ ─────────────────────────                                                  ║
 * ║   person = { name: 'Alice', age: 25 }                                      ║
 * ║   person.name → 'Alice'                                                    ║
 * ║                                                                            ║
 * ║                                                                            ║
 * ║ B: Property shorthand                                                      ║
 * ║ ───────────────────────                                                    ║
 * ║   var name = 'Bob', age = 30;                                              ║
 * ║   { name, age } is equivalent to { name: name, age: age }                  ║
 * ║   user = { name: 'Bob', age: 30 }                                          ║
 * ║                                                                            ║
 * ║                                                                            ║
 * ║ C: Method shorthand                                                        ║
 * ║ ───────────────────                                                        ║
 * ║   double() {} is equivalent to double: function() {}                       ║
 * ║   this.value = 10, so double() returns 10 * 2 = 20                         ║
 * ║                                                                            ║
 * ║                                                                            ║
 * ║ D & E: Computed property names                                             ║
 * ║ ────────────────────────────────                                           ║
 * ║   key = 'dynamicKey'                                                       ║
 * ║   [key] evaluates to 'dynamicKey'                                          ║
 * ║   ['prefix_' + key] evaluates to 'prefix_dynamicKey'                       ║
 * ║   obj = { dynamicKey: 'dynamicValue', prefix_dynamicKey: 'prefixed' }      ║
 * ║                                                                            ║
 * ╚════════════════════════════════════════════════════════════════════════════╝
 *
 *
 * ┌─────────────────────────────────────────────────────────────────────────────┐
 * │ OBJECT LITERAL PATTERNS                                                     │
 * ├─────────────────────────────────────────────────────────────────────────────┤
 * │                                                                             │
 * │   // ES5 style                                                              │
 * │   var obj = {                                                               │
 * │     name: name,                                                             │
 * │     greet: function() { return 'Hi'; }                                      │
 * │   };                                                                        │
 * │                                                                             │
 * │   // ES6 shorthand                                                          │
 * │   const obj = {                                                             │
 * │     name,                          // Property shorthand                    │
 * │     greet() { return 'Hi'; },      // Method shorthand                      │
 * │     [dynamicKey]: value            // Computed property                     │
 * │   };                                                                        │
 * │                                                                             │
 * │   // Real-world example                                                     │
 * │   function createUser(name, email) {                                        │
 * │     return {                                                                │
 * │       name,                                                                 │
 * │       email,                                                                │
 * │       createdAt: Date.now(),                                                │
 * │       isActive: true                                                        │
 * │     };                                                                      │
 * │   }                                                                         │
 * │                                                                             │
 * └─────────────────────────────────────────────────────────────────────────────┘
 *
 *
 * ┌─────────────────────────────────────────────────────────────────────────────┐
 * │ INTERVIEW ANSWER                                                            │
 * ├─────────────────────────────────────────────────────────────────────────────┤
 * │                                                                             │
 * │ "Object literals are the most common way to create objects in JavaScript.   │
 * │  ES6 introduced several shorthand features:                                 │
 * │                                                                             │
 * │  1. Property shorthand: { name } when variable name matches key             │
 * │  2. Method shorthand: { greet() {} } instead of { greet: function() {} }    │
 * │  3. Computed properties: { [expression]: value } for dynamic keys           │
 * │                                                                             │
 * │  These make code more concise and readable. Object literals create          │
 * │  single instances; for multiple objects of the same shape, use              │
 * │  factory functions, constructor functions, or classes."                     │
 * │                                                                             │
 * └─────────────────────────────────────────────────────────────────────────────┘
 *
 *
 * RUN: node docs/06-objects-creation/00-object-literal.js
 */
