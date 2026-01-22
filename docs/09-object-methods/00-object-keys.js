/**
 * CHALLENGE 00: Object.keys()
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

var person = { name: 'Alice', age: 25, city: 'NYC' };
console.log('A:', Object.keys(person));

var arr = ['a', 'b', 'c'];
console.log('B:', Object.keys(arr));

var sparse = [1, , 3];
console.log('C:', Object.keys(sparse));

var obj = { 2: 'two', 1: 'one', 3: 'three' };
console.log('D:', Object.keys(obj));

var proto = { inherited: true };
var child = Object.create(proto);
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
 * │ INTERVIEW ANSWER                                                            │
 * ├─────────────────────────────────────────────────────────────────────────────┤
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
 * RUN: node docs/06-object-methods/00-object-keys.js
 */
