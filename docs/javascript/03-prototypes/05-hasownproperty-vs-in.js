/**
 * CHALLENGE 05: hasOwnProperty vs in
 *
 * ╔════════════════════════════════════════════════════════════════════════════╗
 * ║ THE GOLDEN RULE                                                            ║
 * ╠════════════════════════════════════════════════════════════════════════════╣
 * ║                                                                            ║
 * ║   hasOwnProperty  →  Checks ONLY the object itself                         ║
 * ║   'prop' in obj   →  Checks object AND entire prototype chain              ║
 * ║                                                                            ║
 * ║   obj.hasOwnProperty('x')  // Is 'x' directly on obj?                      ║
 * ║   'x' in obj               // Does obj or any prototype have 'x'?          ║
 * ║                                                                            ║
 * ╚════════════════════════════════════════════════════════════════════════════╝
 */

var proto = {
  inherited: 'from proto'
};

var obj = Object.create(proto);
obj.own = 'my own';

console.log('A:', obj.hasOwnProperty('own'));
console.log('B:', obj.hasOwnProperty('inherited'));
console.log('C:', 'own' in obj);
console.log('D:', 'inherited' in obj);
console.log('E:', 'toString' in obj);
console.log('F:', obj.hasOwnProperty('toString'));

/**
 * OUTPUT:
 *   A: true
 *   B: false
 *   C: true
 *   D: true
 *   E: true
 *   F: false
 *
 *
 * ╔════════════════════════════════════════════════════════════════════════════╗
 * ║ STEP-BY-STEP BREAKDOWN                                                     ║
 * ╠════════════════════════════════════════════════════════════════════════════╣
 * ║                                                                            ║
 * ║ A: obj.hasOwnProperty('own')                                               ║
 * ║ ────────────────────────────                                               ║
 * ║   • 'own' is defined directly on obj                                       ║
 * ║   • hasOwnProperty returns true                                            ║
 * ║                                                                            ║
 * ║                                                                            ║
 * ║ B: obj.hasOwnProperty('inherited')                                         ║
 * ║ ──────────────────────────────────                                         ║
 * ║   • 'inherited' is NOT on obj itself                                       ║
 * ║   • It's on proto (obj's prototype)                                        ║
 * ║   • hasOwnProperty returns false                                           ║
 * ║                                                                            ║
 * ║                                                                            ║
 * ║ C: 'own' in obj                                                            ║
 * ║ ───────────────                                                            ║
 * ║   • 'in' checks obj first                                                  ║
 * ║   • 'own' found on obj                                                     ║
 * ║   • Returns true                                                           ║
 * ║                                                                            ║
 * ║                                                                            ║
 * ║ D: 'inherited' in obj                                                      ║
 * ║ ─────────────────────                                                      ║
 * ║   • 'in' checks obj - not found                                            ║
 * ║   • 'in' checks proto - found!                                             ║
 * ║   • Returns true                                                           ║
 * ║                                                                            ║
 * ║                                                                            ║
 * ║ E: 'toString' in obj                                                       ║
 * ║ ────────────────────                                                       ║
 * ║   • 'in' checks obj - not found                                            ║
 * ║   • 'in' checks proto - not found                                          ║
 * ║   • 'in' checks Object.prototype - found!                                  ║
 * ║   • Returns true                                                           ║
 * ║                                                                            ║
 * ║                                                                            ║
 * ║ F: obj.hasOwnProperty('toString')                                          ║
 * ║ ─────────────────────────────────                                          ║
 * ║   • 'toString' is NOT on obj itself                                        ║
 * ║   • It's inherited from Object.prototype                                   ║
 * ║   • hasOwnProperty returns false                                           ║
 * ║                                                                            ║
 * ╚════════════════════════════════════════════════════════════════════════════╝
 *
 *
 * ┌─────────────────────────────────────────────────────────────────────────────┐
 * │ VISUAL: What Each Method Checks                                             │
 * ├─────────────────────────────────────────────────────────────────────────────┤
 * │                                                                             │
 * │   ┌─────────────────────────────────────────────────────────────────┐       │
 * │   │  obj                                                            │       │
 * │   │                                                                 │       │
 * │   │  own: 'my own'  ◄───── hasOwnProperty checks ONLY here          │       │
 * │   │                                                                 │       │
 * │   └───────────────────────────────────────────┬─────────────────────┘       │
 * │                                               │                             │
 * │                                               ▼                             │
 * │   ┌─────────────────────────────────────────────────────────────────┐       │
 * │   │  proto                                                          │       │
 * │   │                                                                 │       │
 * │   │  inherited: 'from proto'  ◄───┐                                 │       │
 * │   │                               │                                 │       │
 * │   └───────────────────────────────┬─────────────────────────────────┘       │
 * │                                   │                                         │
 * │                                   ▼                                         │
 * │   ┌─────────────────────────────────────────────────────────────────┐       │
 * │   │  Object.prototype             │                                 │       │
 * │   │                               │                                 │       │
 * │   │  toString: function  ◄────────┤                                 │       │
 * │   │  hasOwnProperty: function     │                                 │       │
 * │   │                               │                                 │       │
 * │   └───────────────────────────────┴─────────────────────────────────┘       │
 * │                                   │                                         │
 * │                                   │                                         │
 * │                      'in' operator checks ALL of these                      │
 * │                                                                             │
 * └─────────────────────────────────────────────────────────────────────────────┘
 *
 *
 * ┌─────────────────────────────────────────────────────────────────────────────┐
 * │ WHEN TO USE WHICH                                                           │
 * ├─────────────────────────────────────────────────────────────────────────────┤
 * │                                                                             │
 * │ USE hasOwnProperty WHEN:                                                    │
 * │   • Iterating over object's own properties                                  │
 * │   • Checking if property was set on this specific object                    │
 * │   • Filtering out inherited properties                                      │
 * │                                                                             │
 * │   for (var key in obj) {                                                    │
 * │     if (obj.hasOwnProperty(key)) {                                          │
 * │       // Only own properties                                                │
 * │     }                                                                       │
 * │   }                                                                         │
 * │                                                                             │
 * │                                                                             │
 * │ USE 'in' WHEN:                                                              │
 * │   • Checking if property exists anywhere (own or inherited)                 │
 * │   • Checking if an object has a capability (method)                         │
 * │                                                                             │
 * │   if ('forEach' in array) {                                                 │
 * │     // Has forEach method (could be inherited)                              │
 * │   }                                                                         │
 * │                                                                             │
 * │                                                                             │
 * │ SAFER hasOwnProperty:                                                       │
 * │   Object.prototype.hasOwnProperty.call(obj, 'prop')                         │
 * │   // Works even if obj.hasOwnProperty was overwritten                       │
 * │                                                                             │
 * └─────────────────────────────────────────────────────────────────────────────┘
 *
 *
 * ┌─────────────────────────────────────────────────────────────────────────────┐
 * │ INTERVIEW ANSWER                                                            │
 * ├─────────────────────────────────────────────────────────────────────────────┤
 * │                                                                             │
 * │ "hasOwnProperty and the 'in' operator both check for property existence,    │
 * │  but with different scopes:                                                 │
 * │                                                                             │
 * │  - hasOwnProperty checks ONLY the object itself, ignoring the prototype     │
 * │    chain. It answers: 'Does this specific object have this property?'       │
 * │                                                                             │
 * │  - The 'in' operator checks the object AND its entire prototype chain.      │
 * │    It answers: 'Can this property be accessed on this object?'              │
 * │                                                                             │
 * │  In the example, 'inherited' in obj returns true because it's found on      │
 * │  the prototype, but obj.hasOwnProperty('inherited') returns false           │
 * │  because it's not directly on obj.                                          │
 * │                                                                             │
 * │  This distinction is crucial when iterating with for...in loops,            │
 * │  where you often want to filter out inherited properties using              │
 * │  hasOwnProperty to only process the object's own properties."               │
 * │                                                                             │
 * └─────────────────────────────────────────────────────────────────────────────┘
 *
 *
 * RUN: node docs/03-prototypes/05-hasownproperty-vs-in.js
 */
