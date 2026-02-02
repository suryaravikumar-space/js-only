/**
 * TOPIC: Object Literal Syntax and Shorthand
 *
 * STORY: Think of an object literal like filling out a form at a hotel check-in.
 * You write your name, age, and preferences directly on the paper. ES6 shorthand
 * is like the hotel already having your info on file -- you just confirm "yes,
 * same name, same email" instead of writing it all out again.
 *
 * ╔════════════════════════════════════════════════════════════════════════════╗
 * ║ THE GOLDEN RULE                                                            ║
 * ╠════════════════════════════════════════════════════════════════════════════╣
 * ║                                                                            ║
 * ║ Object literals are the simplest way to create objects in JavaScript.      ║
 * ║                                                                            ║
 * ║   const obj = { key: value };                                              ║
 * ║                                                                            ║
 * ║ ES6 added powerful shorthand syntax:                                       ║
 * ║   - Property shorthand: { name } instead of { name: name }                 ║
 * ║   - Method shorthand: { greet() {} } instead of { greet: function() {} }   ║
 * ║   - Computed properties: { [expression]: value }                           ║
 * ║                                                                            ║
 * ╚════════════════════════════════════════════════════════════════════════════╝
 */

// Basic object literal
const person = { // ES6: var -> const (not reassigned)
  name: 'Alice',
  age: 25
};

console.log('A:', person.name);

// Property shorthand (ES6)
const name = 'Bob'; // ES6: var -> const
const age = 30; // ES6: var -> const

const user = { name, age }; // ES6: var -> const
console.log('B:', user.name, user.age);

// Method shorthand (ES6)
const calculator = { // ES6: var -> const
  value: 10,
  double() {
    return this.value * 2;
  },
  triple() { // ES6: function expression -> method shorthand
    return this.value * 3;
  }
};

console.log('C:', calculator.double());

// Computed property names
const key = 'dynamicKey'; // ES6: var -> const
const obj = { // ES6: var -> const
  [key]: 'dynamicValue',
  [`prefix_${key}`]: 'prefixed' // ES6: string concatenation -> template literal
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
 * ║   const name = 'Bob', age = 30;                                            ║
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
 * │ INTERVIEW QUESTIONS:                                                        │
 * ├─────────────────────────────────────────────────────────────────────────────┤
 * │                                                                             │
 * │ Q1: What ES6 shorthand features are available for object literals?          │
 * │ A1: Property shorthand ({ name } when variable name matches key),           │
 * │     method shorthand ({ greet() {} } instead of { greet: function() {} }),  │
 * │     and computed properties ({ [expression]: value } for dynamic keys).     │
 * │                                                                             │
 * │ Q2: When would you use an object literal vs a class or factory function?    │
 * │ A2: Object literals create single instances and are great for config        │
 * │     objects, option bags, or one-off data. For multiple objects of the      │
 * │     same shape, use factory functions, constructor functions, or classes.    │
 * │                                                                             │
 * │ Q3: What are computed property names and when are they useful?              │
 * │ A3: Computed properties use [expression] as the key, evaluated at runtime.  │
 * │     They're useful for dynamic keys, e.g., building objects from variables  │
 * │     or creating keys based on user input or API responses.                  │
 * │                                                                             │
 * │ ORIGINAL ANSWER:                                                            │
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
 * RUN: node docs/javascript/06-objects-creation/00-object-literal.js
 */
