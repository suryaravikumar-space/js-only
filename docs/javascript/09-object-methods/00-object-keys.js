/**
 * TOPIC: Object.keys()
 *
 * STORY: Imagine a hotel front desk with a KEY RACK. Object.keys() is like
 * asking the receptionist: "Show me all the room keys that belong to THIS
 * floor only (own), that are currently ACTIVE (enumerable), and have
 * NUMBERED tags (string keys)." Keys from other floors (inherited) or
 * deactivated keys (non-enumerable) are not shown.
 *
 * ╔════════════════════════════════════════════════════════════════════════════╗
 * ║ THE GOLDEN RULE                                                            ║
 * ╠════════════════════════════════════════════════════════════════════════════╣
 * ║                                                                            ║
 * ║ Object.keys(obj) returns an array of the object's OWN ENUMERABLE          ║
 * ║ string-keyed property names.                                               ║
 * ║                                                                            ║
 * ║   - Only own properties (not inherited)                                    ║
 * ║   - Only enumerable properties                                             ║
 * ║   - Only string keys (not Symbol keys)                                     ║
 * ║   - Integer keys are sorted numerically, then string keys in order         ║
 * ║                                                                            ║
 * ╚════════════════════════════════════════════════════════════════════════════╝
 */

const person = { name: 'Alice', age: 25, city: 'NYC' }; // ES6: var -> const
console.log('A:', Object.keys(person));

const arr = ['a', 'b', 'c']; // ES6: var -> const
console.log('B:', Object.keys(arr));

const sparse = [1, , 3]; // ES6: var -> const
console.log('C:', Object.keys(sparse));

const obj = { 2: 'two', 1: 'one', 3: 'three' }; // ES6: var -> const
console.log('D:', Object.keys(obj));

const proto = { inherited: true }; // ES6: var -> const
const child = Object.create(proto); // ES6: var -> const
child.own = 'property';
console.log('E:', Object.keys(child));

/**
 * OUTPUT:
 *   A: [ 'name', 'age', 'city' ]
 *   B: [ '0', '1', '2' ]
 *   C: [ '0', '2' ]
 *   D: [ '1', '2', '3' ]
 *   E: [ 'own' ]
 *
 *
 * ╔════════════════════════════════════════════════════════════════════════════╗
 * ║ STEP-BY-STEP BREAKDOWN                                                     ║
 * ╠════════════════════════════════════════════════════════════════════════════╣
 * ║                                                                            ║
 * ║ A: Object.keys(person)                                                     ║
 * ║ ──────────────────────                                                     ║
 * ║   Returns all own enumerable string keys                                   ║
 * ║   Result: ['name', 'age', 'city']                                          ║
 * ║                                                                            ║
 * ║ B: Object.keys(arr)                                                        ║
 * ║ ───────────────────                                                        ║
 * ║   Arrays are objects! Indices become string keys                           ║
 * ║   Result: ['0', '1', '2'] (not numbers, strings!)                          ║
 * ║                                                                            ║
 * ║ C: Object.keys(sparse)                                                     ║
 * ║ ──────────────────────                                                     ║
 * ║   Sparse array [1, empty, 3] - empty slot has no key!                      ║
 * ║   Result: ['0', '2'] (index 1 is missing)                                  ║
 * ║                                                                            ║
 * ║ D: Object.keys({ 2: 'two', 1: 'one', 3: 'three' })                         ║
 * ║ ──────────────────────────────────────────────────                         ║
 * ║   Integer keys are sorted numerically (ascending)                          ║
 * ║   Result: ['1', '2', '3'] (sorted, not insertion order!)                   ║
 * ║                                                                            ║
 * ║ E: Object.keys(child)                                                      ║
 * ║ ─────────────────────                                                      ║
 * ║   Only OWN properties, not inherited from prototype                        ║
 * ║   Result: ['own'] (inherited property excluded)                            ║
 * ║                                                                            ║
 * ╚════════════════════════════════════════════════════════════════════════════╝
 *
 *
 * ┌─────────────────────────────────────────────────────────────────────────────┐
 * │ KEY ORDERING RULES                                                          │
 * ├─────────────────────────────────────────────────────────────────────────────┤
 * │                                                                             │
 * │   Object property order in ES6+:                                            │
 * │                                                                             │
 * │   1. Integer indices (0, 1, 2...) - sorted ascending                        │
 * │   2. String keys - insertion order                                          │
 * │   3. Symbol keys - insertion order (not in Object.keys!)                    │
 * │                                                                             │
 * │   const obj = { b: 1, 2: 2, a: 3, 1: 4 };                                   │
 * │   Object.keys(obj); // ['1', '2', 'b', 'a']                                 │
 * │                      //  ↑ints↑  ↑strings↑                                  │
 * │                                                                             │
 * └─────────────────────────────────────────────────────────────────────────────┘
 *
 *
 * ┌─────────────────────────────────────────────────────────────────────────────┐
 * │ COMMON USE CASES                                                            │
 * ├─────────────────────────────────────────────────────────────────────────────┤
 * │                                                                             │
 * │   // Count properties                                                       │
 * │   const count = Object.keys(obj).length;                                    │
 * │                                                                             │
 * │   // Check if empty                                                         │
 * │   const isEmpty = Object.keys(obj).length === 0;                            │
 * │                                                                             │
 * │   // Iterate over keys                                                      │
 * │   Object.keys(obj).forEach(key => console.log(key, obj[key]));              │
 * │                                                                             │
 * │   // Transform to array of values                                           │
 * │   const values = Object.keys(obj).map(key => obj[key]);                     │
 * │                                                                             │
 * └─────────────────────────────────────────────────────────────────────────────┘
 *
 *
 * ┌─────────────────────────────────────────────────────────────────────────────┐
 * │ INTERVIEW QUESTIONS:                                                        │
 * ├─────────────────────────────────────────────────────────────────────────────┤
 * │                                                                             │
 * │ Q1: What does Object.keys() return and what does it exclude?                │
 * │ A1: Object.keys() returns an array of an object's own enumerable            │
 * │     string-keyed property names. It excludes inherited properties,          │
 * │     non-enumerable properties, and Symbol keys.                             │
 * │                                                                             │
 * │ Q2: How are keys ordered in the returned array?                             │
 * │ A2: Integer keys are sorted numerically (ascending) first, then             │
 * │     string keys appear in insertion order. Symbol keys are excluded          │
 * │     entirely from Object.keys().                                            │
 * │                                                                             │
 * │ Q3: How would you get inherited properties if Object.keys() only            │
 * │     returns own properties?                                                 │
 * │ A3: Use a for...in loop to iterate over both own and inherited              │
 * │     enumerable properties. For non-enumerable own properties, use           │
 * │     Object.getOwnPropertyNames().                                           │
 * │                                                                             │
 * │ ── Original Interview Answer ──                                             │
 * │                                                                             │
 * │ "Object.keys() returns an array of an object's own enumerable              │
 * │  string-keyed property names.                                               │
 * │                                                                             │
 * │  Key characteristics:                                                       │
 * │  - Only own properties (not inherited from prototype)                       │
 * │  - Only enumerable properties                                               │
 * │  - Only string keys (Symbol keys are excluded)                              │
 * │  - Integer keys are sorted numerically, string keys in insertion order      │
 * │                                                                             │
 * │  Common uses: counting properties, checking if object is empty,             │
 * │  iterating over object properties, and converting objects to arrays.        │
 * │                                                                             │
 * │  For inherited properties, use for...in loop.                               │
 * │  For non-enumerable properties, use Object.getOwnPropertyNames()."          │
 * │                                                                             │
 * └─────────────────────────────────────────────────────────────────────────────┘
 *
 *
 * RUN: node docs/javascript/09-object-methods/00-object-keys.js
 */
