/**
 * CHALLENGE 09: Object.getPrototypeOf & setPrototypeOf
 *
 * ╔════════════════════════════════════════════════════════════════════════════╗
 * ║ THE GOLDEN RULE                                                            ║
 * ╠════════════════════════════════════════════════════════════════════════════╣
 * ║                                                                            ║
 * ║ Object.getPrototypeOf(obj)  →  Returns obj's prototype                     ║
 * ║ Object.setPrototypeOf(obj, proto)  →  Changes obj's prototype              ║
 * ║                                                                            ║
 * ║ These are the proper APIs (vs deprecated __proto__)                        ║
 * ║                                                                            ║
 * ║ WARNING: setPrototypeOf is slow and should be avoided in hot code!         ║
 * ║                                                                            ║
 * ╚════════════════════════════════════════════════════════════════════════════╝
 */

var proto1 = { x: 10 };
var proto2 = { x: 20, y: 30 };

var obj = Object.create(proto1);

console.log('A:', obj.x);
console.log('B:', Object.getPrototypeOf(obj) === proto1);

Object.setPrototypeOf(obj, proto2);

console.log('C:', obj.x);
console.log('D:', obj.y);
console.log('E:', Object.getPrototypeOf(obj) === proto2);

/**
 * OUTPUT:
 *   A: 10
 *   B: true
 *   C: 20
 *   D: 30
 *   E: true
 *
 *
 * ╔════════════════════════════════════════════════════════════════════════════╗
 * ║ STEP-BY-STEP BREAKDOWN                                                     ║
 * ╠════════════════════════════════════════════════════════════════════════════╣
 * ║                                                                            ║
 * ║ A: obj.x (before setPrototypeOf)                                           ║
 * ║ ────────────────────────────────                                           ║
 * ║   • obj was created with Object.create(proto1)                             ║
 * ║   • obj.__proto__ = proto1                                                 ║
 * ║   • obj.x → looks up chain → finds proto1.x = 10                           ║
 * ║   • Returns 10                                                             ║
 * ║                                                                            ║
 * ║                                                                            ║
 * ║ B: Object.getPrototypeOf(obj) === proto1                                   ║
 * ║ ────────────────────────────────────────────                               ║
 * ║   • getPrototypeOf returns the [[Prototype]]                               ║
 * ║   • obj's prototype is proto1                                              ║
 * ║   • Returns true                                                           ║
 * ║                                                                            ║
 * ║                                                                            ║
 * ║ C: obj.x (after setPrototypeOf)                                            ║
 * ║ ───────────────────────────────                                            ║
 * ║   • setPrototypeOf changed obj's prototype to proto2                       ║
 * ║   • obj.x → looks up chain → finds proto2.x = 20                           ║
 * ║   • Returns 20                                                             ║
 * ║                                                                            ║
 * ║                                                                            ║
 * ║ D: obj.y                                                                   ║
 * ║ ──────────                                                                 ║
 * ║   • proto2 has y: 30                                                       ║
 * ║   • obj.y → finds proto2.y                                                 ║
 * ║   • Returns 30                                                             ║
 * ║                                                                            ║
 * ║                                                                            ║
 * ║ E: Object.getPrototypeOf(obj) === proto2                                   ║
 * ║ ────────────────────────────────────────────                               ║
 * ║   • Confirms prototype was changed                                         ║
 * ║   • Returns true                                                           ║
 * ║                                                                            ║
 * ╚════════════════════════════════════════════════════════════════════════════╝
 *
 *
 * ┌─────────────────────────────────────────────────────────────────────────────┐
 * │ VISUAL: Changing Prototypes                                                 │
 * ├─────────────────────────────────────────────────────────────────────────────┤
 * │                                                                             │
 * │   BEFORE setPrototypeOf:                                                    │
 * │                                                                             │
 * │   ┌─────────────────┐                                                       │
 * │   │  obj            │                                                       │
 * │   │  (empty)        │                                                       │
 * │   │  __proto__ ─────┼───►  ┌─────────────────┐                              │
 * │   └─────────────────┘      │  proto1         │                              │
 * │                            │  x: 10          │                              │
 * │                            └─────────────────┘                              │
 * │                                                                             │
 * │   AFTER setPrototypeOf:                                                     │
 * │                                                                             │
 * │   ┌─────────────────┐      ┌─────────────────┐                              │
 * │   │  obj            │      │  proto1         │  ← No longer connected       │
 * │   │  (empty)        │      │  x: 10          │                              │
 * │   │  __proto__ ─────┼──┐   └─────────────────┘                              │
 * │   └─────────────────┘  │                                                    │
 * │                        │                                                    │
 * │                        └─►  ┌─────────────────┐                              │
 * │                            │  proto2         │                              │
 * │                            │  x: 20          │                              │
 * │                            │  y: 30          │                              │
 * │                            └─────────────────┘                              │
 * │                                                                             │
 * └─────────────────────────────────────────────────────────────────────────────┘
 *
 *
 * ┌─────────────────────────────────────────────────────────────────────────────┐
 * │ WHEN TO USE THESE METHODS                                                   │
 * ├─────────────────────────────────────────────────────────────────────────────┤
 * │                                                                             │
 * │ Object.getPrototypeOf(obj):                                                 │
 * │   • Check an object's prototype                                             │
 * │   • Debug prototype chains                                                  │
 * │   • Safe and commonly used                                                  │
 * │                                                                             │
 * │   EXAMPLE:                                                                  │
 * │   Object.getPrototypeOf([]) === Array.prototype  // true                    │
 * │   Object.getPrototypeOf({}) === Object.prototype // true                    │
 * │                                                                             │
 * │                                                                             │
 * │ Object.setPrototypeOf(obj, proto):                                          │
 * │   • ⚠️ AVOID IF POSSIBLE - very slow operation                             │
 * │   • Breaks JavaScript engine optimizations                                  │
 * │   • Use Object.create() instead when possible                               │
 * │                                                                             │
 * │   INSTEAD OF:                                                               │
 * │   var obj = { a: 1 };                                                       │
 * │   Object.setPrototypeOf(obj, proto);  // Slow!                              │
 * │                                                                             │
 * │   DO THIS:                                                                  │
 * │   var obj = Object.create(proto);                                           │
 * │   obj.a = 1;  // Much faster                                                │
 * │                                                                             │
 * └─────────────────────────────────────────────────────────────────────────────┘
 *
 *
 * ┌─────────────────────────────────────────────────────────────────────────────┐
 * │ INTERVIEW ANSWER                                                            │
 * ├─────────────────────────────────────────────────────────────────────────────┤
 * │                                                                             │
 * │ "Object.getPrototypeOf() and Object.setPrototypeOf() are the proper         │
 * │  APIs for working with prototypes, replacing the deprecated __proto__.      │
 * │                                                                             │
 * │  getPrototypeOf returns an object's prototype, useful for inspection        │
 * │  and debugging the prototype chain.                                         │
 * │                                                                             │
 * │  setPrototypeOf can dynamically change an object's prototype at runtime,    │
 * │  as shown in the example where obj.x changes from 10 to 20 after            │
 * │  switching prototypes.                                                      │
 * │                                                                             │
 * │  However, setPrototypeOf should be avoided in production code when          │
 * │  possible because:                                                          │
 * │  1. It's a slow operation                                                   │
 * │  2. It de-optimizes the object in JavaScript engines                        │
 * │  3. Object.create() at initialization time is preferred                     │
 * │                                                                             │
 * │  The general rule: set up prototype chains at creation time with            │
 * │  Object.create() or constructors, not dynamically with setPrototypeOf()."   │
 * │                                                                             │
 * └─────────────────────────────────────────────────────────────────────────────┘
 *
 *
 * RUN: node docs/03-prototypes/09-getprototypeof.js
 */
