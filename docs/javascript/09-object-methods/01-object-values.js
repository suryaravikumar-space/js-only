/**
 * CHALLENGE 01: Object.values()
 *
 * ╔════════════════════════════════════════════════════════════════════════════╗
 * ║ THE GOLDEN RULE                                                            ║
 * ╠════════════════════════════════════════════════════════════════════════════╣
 * ║                                                                            ║
 * ║ Object.values(obj) returns an array of the object's OWN ENUMERABLE         ║
 * ║ property VALUES (in the same order as Object.keys()).                      ║
 * ║                                                                            ║
 * ║   - Only own property values (not inherited)                               ║
 * ║   - Only enumerable property values                                        ║
 * ║   - Excludes Symbol-keyed property values                                  ║
 * ║   - Order matches Object.keys(): integers sorted, then strings             ║
 * ║                                                                            ║
 * ╚════════════════════════════════════════════════════════════════════════════╝
 */

var person = { name: 'Alice', age: 25, city: 'NYC' };
console.log('A:', Object.values(person));

var arr = ['x', 'y', 'z'];
console.log('B:', Object.values(arr));

var mixed = { 2: 'two', b: 'bee', 1: 'one' };
console.log('C:', Object.values(mixed));

var withSymbol = { [Symbol('id')]: 123, name: 'test' };
console.log('D:', Object.values(withSymbol));

var proto = { inherited: 'value' };
var child = Object.create(proto);
child.own = 'mine';
console.log('E:', Object.values(child));

/**
 * OUTPUT:
 *   A: [ 'Alice', 25, 'NYC' ]
 *   B: [ 'x', 'y', 'z' ]
 *   C: [ 'one', 'two', 'bee' ]
 *   D: [ 'test' ]
 *   E: [ 'mine' ]
 *
 *
 * ╔════════════════════════════════════════════════════════════════════════════╗
 * ║ STEP-BY-STEP BREAKDOWN                                                     ║
 * ╠════════════════════════════════════════════════════════════════════════════╣
 * ║                                                                            ║
 * ║ A: Object.values(person)                                                   ║
 * ║ ────────────────────────                                                   ║
 * ║   Returns values of all own enumerable properties                          ║
 * ║   Order: insertion order for string keys                                   ║
 * ║   Result: ['Alice', 25, 'NYC']                                             ║
 * ║                                                                            ║
 * ║ B: Object.values(arr)                                                      ║
 * ║ ─────────────────────                                                      ║
 * ║   Arrays work too - returns array elements                                 ║
 * ║   Result: ['x', 'y', 'z']                                                  ║
 * ║                                                                            ║
 * ║ C: Object.values(mixed)                                                    ║
 * ║ ───────────────────────                                                    ║
 * ║   Integer keys sorted first: 1, 2, then string key 'b'                     ║
 * ║   Values follow key order: 'one', 'two', 'bee'                             ║
 * ║   Result: ['one', 'two', 'bee']                                            ║
 * ║                                                                            ║
 * ║ D: Object.values(withSymbol)                                               ║
 * ║ ────────────────────────────                                               ║
 * ║   Symbol keys are EXCLUDED from Object.values()                            ║
 * ║   Only string-keyed 'name' property included                               ║
 * ║   Result: ['test']                                                         ║
 * ║                                                                            ║
 * ║ E: Object.values(child)                                                    ║
 * ║ ───────────────────────                                                    ║
 * ║   Only OWN properties, inherited 'inherited' is excluded                   ║
 * ║   Result: ['mine']                                                         ║
 * ║                                                                            ║
 * ╚════════════════════════════════════════════════════════════════════════════╝
 *
 *
 * ┌─────────────────────────────────────────────────────────────────────────────┐
 * │ VISUAL: Object.keys() vs Object.values()                                    │
 * ├─────────────────────────────────────────────────────────────────────────────┤
 * │                                                                             │
 * │   const obj = { a: 1, b: 2, c: 3 };                                         │
 * │                                                                             │
 * │   ┌─────────────────────────────────────────────────────┐                   │
 * │   │  Object.keys(obj)    │  Object.values(obj)          │                   │
 * │   ├─────────────────────────────────────────────────────┤                   │
 * │   │  ['a', 'b', 'c']     │  [1, 2, 3]                   │                   │
 * │   └─────────────────────────────────────────────────────┘                   │
 * │                                                                             │
 * │   Same order, different content!                                            │
 * │                                                                             │
 * └─────────────────────────────────────────────────────────────────────────────┘
 *
 *
 * ┌─────────────────────────────────────────────────────────────────────────────┐
 * │ COMMON USE CASES                                                            │
 * ├─────────────────────────────────────────────────────────────────────────────┤
 * │                                                                             │
 * │   // Sum all numeric values                                                 │
 * │   const sum = Object.values(obj).reduce((a, b) => a + b, 0);                │
 * │                                                                             │
 * │   // Find max value                                                         │
 * │   const max = Math.max(...Object.values(scores));                           │
 * │                                                                             │
 * │   // Check if value exists                                                  │
 * │   const hasValue = Object.values(obj).includes('target');                   │
 * │                                                                             │
 * │   // Filter values                                                          │
 * │   const positives = Object.values(nums).filter(n => n > 0);                 │
 * │                                                                             │
 * └─────────────────────────────────────────────────────────────────────────────┘
 *
 *
 * ┌─────────────────────────────────────────────────────────────────────────────┐
 * │ INTERVIEW ANSWER                                                            │
 * ├─────────────────────────────────────────────────────────────────────────────┤
 * │                                                                             │
 * │ "Object.values() returns an array of an object's own enumerable            │
 * │  property values.                                                           │
 * │                                                                             │
 * │  Key characteristics:                                                       │
 * │  - Returns values in the same order as Object.keys() returns keys           │
 * │  - Only own properties (not inherited)                                      │
 * │  - Only enumerable properties                                               │
 * │  - Excludes Symbol-keyed properties                                         │
 * │                                                                             │
 * │  It's useful for:                                                           │
 * │  - Iterating over values without needing keys                               │
 * │  - Array operations on object values (map, filter, reduce)                  │
 * │  - Checking if a value exists in an object                                  │
 * │                                                                             │
 * │  Introduced in ES2017 (ES8) along with Object.entries()."                   │
 * │                                                                             │
 * └─────────────────────────────────────────────────────────────────────────────┘
 *
 *
 * RUN: node docs/06-object-methods/01-object-values.js
 */
