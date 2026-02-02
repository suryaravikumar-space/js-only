/**
 * CHALLENGE 05: Object.freeze() and isFrozen
 *
 * ╔════════════════════════════════════════════════════════════════════════════╗
 * ║ THE GOLDEN RULE                                                            ║
 * ╠════════════════════════════════════════════════════════════════════════════╣
 * ║                                                                            ║
 * ║ Object.freeze(obj) makes an object COMPLETELY IMMUTABLE:                   ║
 * ║                                                                            ║
 * ║   - Cannot ADD new properties                                              ║
 * ║   - Cannot DELETE existing properties                                      ║
 * ║   - Cannot MODIFY existing property values                                 ║
 * ║   - Cannot change property descriptors                                     ║
 * ║                                                                            ║
 * ║   BUT: It's SHALLOW! Nested objects can still be modified.                 ║
 * ║                                                                            ║
 * ║   Modifications silently fail (or throw in strict mode).                   ║
 * ║                                                                            ║
 * ╚════════════════════════════════════════════════════════════════════════════╝
 */

var frozen = Object.freeze({ name: 'Alice', age: 25 });
frozen.name = 'Bob';        // Silently fails
frozen.city = 'NYC';        // Silently fails
delete frozen.age;          // Silently fails
console.log('A:', frozen);

console.log('B:', Object.isFrozen(frozen));
console.log('B2:', Object.isFrozen({ x: 1 }));

// Shallow freeze!
var nested = Object.freeze({ outer: { inner: 1 } });
nested.outer.inner = 999;   // This works! Nested object isn't frozen
console.log('C:', nested.outer.inner);

// Note: The array example would throw TypeError: Cannot add property
// arr.push(4) fails because frozen arrays can't be modified
var arr = Object.freeze([1, 2, 3]);
// arr.push(4);  // Would throw: TypeError: Cannot add property 3
console.log('D:', arr);

// Empty object is frozen by default?
var empty = {};
console.log('E:', Object.isFrozen(empty));
Object.preventExtensions(empty);
console.log('E2:', Object.isFrozen(empty));

/**
 * OUTPUT:
 *   A: { name: 'Alice', age: 25 }
 *   B: true
 *   B2: false
 *   C: 999
 *   D: [ 1, 2, 3 ]
 *   E: false
 *   E2: true
 *
 * Note: In strict mode, modifications to frozen objects throw TypeError
 *
 *
 * ╔════════════════════════════════════════════════════════════════════════════╗
 * ║ STEP-BY-STEP BREAKDOWN                                                     ║
 * ╠════════════════════════════════════════════════════════════════════════════╣
 * ║                                                                            ║
 * ║ A: Freeze operations                                                       ║
 * ║ ────────────────────                                                       ║
 * ║   frozen.name = 'Bob'    → Silently fails, still 'Alice'                   ║
 * ║   frozen.city = 'NYC'    → Silently fails, no 'city' property              ║
 * ║   delete frozen.age      → Silently fails, 'age' still exists              ║
 * ║   Result: { name: 'Alice', age: 25 } (unchanged)                           ║
 * ║                                                                            ║
 * ║ B: Object.isFrozen()                                                       ║
 * ║ ────────────────────                                                       ║
 * ║   frozen object → true                                                     ║
 * ║   regular object → false                                                   ║
 * ║                                                                            ║
 * ║ C: Shallow freeze trap!                                                    ║
 * ║ ───────────────────────                                                    ║
 * ║   nested.outer = { ... } would fail (can't reassign)                       ║
 * ║   nested.outer.inner = 999 succeeds! (nested object not frozen)            ║
 * ║   Result: 999                                                              ║
 * ║                                                                            ║
 * ║ D: Frozen arrays                                                           ║
 * ║ ───────────────                                                            ║
 * ║   push/pop/etc. throw TypeError on frozen arrays                           ║
 * ║   The array remains [1, 2, 3]                                              ║
 * ║                                                                            ║
 * ║ E: Empty object special case                                               ║
 * ║ ──────────────────────────                                                 ║
 * ║   Empty {} is NOT frozen by default                                        ║
 * ║   After preventExtensions: empty object IS frozen!                         ║
 * ║   (No properties to change, can't add new ones = frozen)                   ║
 * ║                                                                            ║
 * ╚════════════════════════════════════════════════════════════════════════════╝
 *
 *
 * ┌─────────────────────────────────────────────────────────────────────────────┐
 * │ DEEP FREEZE IMPLEMENTATION                                                  │
 * ├─────────────────────────────────────────────────────────────────────────────┤
 * │                                                                             │
 * │   function deepFreeze(obj) {                                                │
 * │     // Get all property names                                               │
 * │     const propNames = Object.getOwnPropertyNames(obj);                      │
 * │                                                                             │
 * │     // Freeze nested objects first                                          │
 * │     for (const name of propNames) {                                         │
 * │       const value = obj[name];                                              │
 * │       if (value && typeof value === 'object') {                             │
 * │         deepFreeze(value);                                                  │
 * │       }                                                                     │
 * │     }                                                                       │
 * │                                                                             │
 * │     // Then freeze the object itself                                        │
 * │     return Object.freeze(obj);                                              │
 * │   }                                                                         │
 * │                                                                             │
 * └─────────────────────────────────────────────────────────────────────────────┘
 *
 *
 * ┌─────────────────────────────────────────────────────────────────────────────┐
 * │ FREEZE vs SEAL vs PREVENTEXTENSIONS                                         │
 * ├─────────────────────────────────────────────────────────────────────────────┤
 * │                                                                             │
 * │   ┌────────────────────┬────────┬────────┬───────────────────┐              │
 * │   │ Operation          │ freeze │ seal   │ preventExtensions │              │
 * │   ├────────────────────┼────────┼────────┼───────────────────┤              │
 * │   │ Add properties     │   No   │   No   │        No         │              │
 * │   │ Delete properties  │   No   │   No   │        Yes        │              │
 * │   │ Modify values      │   No   │  Yes   │        Yes        │              │
 * │   │ Reconfigure props  │   No   │   No   │        Yes        │              │
 * │   └────────────────────┴────────┴────────┴───────────────────┘              │
 * │                                                                             │
 * │   freeze: Most restrictive (nothing allowed)                                │
 * │   seal: Can modify existing, can't add/delete                               │
 * │   preventExtensions: Only blocks adding                                     │
 * │                                                                             │
 * └─────────────────────────────────────────────────────────────────────────────┘
 *
 *
 * ┌─────────────────────────────────────────────────────────────────────────────┐
 * │ INTERVIEW ANSWER                                                            │
 * ├─────────────────────────────────────────────────────────────────────────────┤
 * │                                                                             │
 * │ "Object.freeze() makes an object completely immutable - you cannot add,    │
 * │  delete, or modify properties. Modifications silently fail in sloppy mode   │
 * │  or throw TypeError in strict mode.                                         │
 * │                                                                             │
 * │  Critical gotcha: freeze is SHALLOW!                                        │
 * │  Nested objects can still be modified. For deep immutability, you need      │
 * │  a recursive deepFreeze function or libraries like Immer.                   │
 * │                                                                             │
 * │  Object.isFrozen() checks if an object is frozen.                           │
 * │                                                                             │
 * │  Interesting edge case: an empty object that's non-extensible IS frozen,    │
 * │  because there are no properties to modify.                                 │
 * │                                                                             │
 * │  Use cases: constants, configuration objects, preventing accidental         │
 * │  mutations in functional programming patterns."                             │
 * │                                                                             │
 * └─────────────────────────────────────────────────────────────────────────────┘
 *
 *
 * RUN: node docs/06-object-methods/05-object-freeze.js
 */
