/**
 * CHALLENGE 02: Object.entries()
 *
 * ╔════════════════════════════════════════════════════════════════════════════╗
 * ║ THE GOLDEN RULE                                                            ║
 * ╠════════════════════════════════════════════════════════════════════════════╣
 * ║                                                                            ║
 * ║ Object.entries(obj) returns an array of [key, value] pairs for the         ║
 * ║ object's OWN ENUMERABLE string-keyed properties.                           ║
 * ║                                                                            ║
 * ║   Object.entries({ a: 1, b: 2 })  →  [['a', 1], ['b', 2]]                  ║
 * ║                                                                            ║
 * ║   Perfect for:                                                             ║
 * ║   - for...of loops with destructuring                                      ║
 * ║   - Converting objects to Maps                                             ║
 * ║   - Transforming objects with map/filter                                   ║
 * ║                                                                            ║
 * ╚════════════════════════════════════════════════════════════════════════════╝
 */

var person = { name: 'Alice', age: 25 };
console.log('A:', Object.entries(person));

var obj = { 2: 'two', 1: 'one' };
console.log('B:', Object.entries(obj));

// Destructuring with entries
var scores = { math: 90, science: 85 };
for (var [subject, score] of Object.entries(scores)) {
  console.log('C:', subject, score);
}

// Converting to Map
var map = new Map(Object.entries({ x: 1, y: 2 }));
console.log('D:', map.get('x'));

var arr = ['a', 'b'];
console.log('E:', Object.entries(arr));

/**
 * OUTPUT:
 *   A: [ [ 'name', 'Alice' ], [ 'age', 25 ] ]
 *   B: [ [ '1', 'one' ], [ '2', 'two' ] ]
 *   C: math 90
 *   C: science 85
 *   D: 1
 *   E: [ [ '0', 'a' ], [ '1', 'b' ] ]
 *
 *
 * ╔════════════════════════════════════════════════════════════════════════════╗
 * ║ STEP-BY-STEP BREAKDOWN                                                     ║
 * ╠════════════════════════════════════════════════════════════════════════════╣
 * ║                                                                            ║
 * ║ A: Object.entries(person)                                                  ║
 * ║ ─────────────────────────                                                  ║
 * ║   Returns array of [key, value] pairs                                      ║
 * ║   Result: [['name', 'Alice'], ['age', 25]]                                 ║
 * ║                                                                            ║
 * ║ B: Object.entries({ 2: 'two', 1: 'one' })                                  ║
 * ║ ─────────────────────────────────────────                                  ║
 * ║   Integer keys sorted numerically                                          ║
 * ║   Result: [['1', 'one'], ['2', 'two']]                                     ║
 * ║   Note: Keys are always strings!                                           ║
 * ║                                                                            ║
 * ║ C: for...of with destructuring                                             ║
 * ║ ──────────────────────────────                                             ║
 * ║   [subject, score] destructures each [key, value] pair                     ║
 * ║   First iteration: subject='math', score=90                                ║
 * ║   Second iteration: subject='science', score=85                            ║
 * ║                                                                            ║
 * ║ D: Converting to Map                                                       ║
 * ║ ────────────────────                                                       ║
 * ║   new Map() accepts iterable of [key, value] pairs                         ║
 * ║   Object.entries() provides exactly that format!                           ║
 * ║   map.get('x') returns 1                                                   ║
 * ║                                                                            ║
 * ║ E: Object.entries(arr)                                                     ║
 * ║ ──────────────────────                                                     ║
 * ║   Arrays work too - indices become string keys                             ║
 * ║   Result: [['0', 'a'], ['1', 'b']]                                         ║
 * ║                                                                            ║
 * ╚════════════════════════════════════════════════════════════════════════════╝
 *
 *
 * ┌─────────────────────────────────────────────────────────────────────────────┐
 * │ VISUAL: Object.entries() Structure                                          │
 * ├─────────────────────────────────────────────────────────────────────────────┤
 * │                                                                             │
 * │   const obj = { a: 1, b: 2 };                                               │
 * │                                                                             │
 * │   Object.entries(obj) returns:                                              │
 * │                                                                             │
 * │   [                                                                         │
 * │     ['a', 1],    ← First entry: [key, value]                                │
 * │     ['b', 2]     ← Second entry: [key, value]                               │
 * │   ]                                                                         │
 * │                                                                             │
 * │   Perfect for destructuring: for (const [key, val] of Object.entries(obj))  │
 * │                                                                             │
 * └─────────────────────────────────────────────────────────────────────────────┘
 *
 *
 * ┌─────────────────────────────────────────────────────────────────────────────┐
 * │ COMMON USE CASES                                                            │
 * ├─────────────────────────────────────────────────────────────────────────────┤
 * │                                                                             │
 * │   // Transform object values                                                │
 * │   const doubled = Object.fromEntries(                                       │
 * │     Object.entries(obj).map(([k, v]) => [k, v * 2])                         │
 * │   );                                                                        │
 * │                                                                             │
 * │   // Filter object by value                                                 │
 * │   const filtered = Object.fromEntries(                                      │
 * │     Object.entries(obj).filter(([k, v]) => v > 10)                          │
 * │   );                                                                        │
 * │                                                                             │
 * │   // Object to Map                                                          │
 * │   const map = new Map(Object.entries(obj));                                 │
 * │                                                                             │
 * │   // Iterate with both key and value                                        │
 * │   for (const [key, value] of Object.entries(obj)) {                         │
 * │     console.log(`${key}: ${value}`);                                        │
 * │   }                                                                         │
 * │                                                                             │
 * └─────────────────────────────────────────────────────────────────────────────┘
 *
 *
 * ┌─────────────────────────────────────────────────────────────────────────────┐
 * │ INTERVIEW ANSWER                                                            │
 * ├─────────────────────────────────────────────────────────────────────────────┤
 * │                                                                             │
 * │ "Object.entries() returns an array of [key, value] pairs for an object's   │
 * │  own enumerable string-keyed properties.                                    │
 * │                                                                             │
 * │  Key characteristics:                                                       │
 * │  - Returns array of arrays: [[key1, val1], [key2, val2], ...]               │
 * │  - Same ordering as Object.keys() and Object.values()                       │
 * │  - Only own, enumerable, string-keyed properties                            │
 * │                                                                             │
 * │  It's particularly useful for:                                              │
 * │  - Converting objects to Maps: new Map(Object.entries(obj))                 │
 * │  - Destructuring in loops: for (const [k, v] of Object.entries(obj))        │
 * │  - Object transformations with map/filter/reduce                            │
 * │                                                                             │
 * │  Pairs with Object.fromEntries() for round-trip transformations.            │
 * │  Introduced in ES2017 (ES8)."                                               │
 * │                                                                             │
 * └─────────────────────────────────────────────────────────────────────────────┘
 *
 *
 * RUN: node docs/06-object-methods/02-object-entries.js
 */
