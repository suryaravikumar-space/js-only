/**
 * CHALLENGE 03: Object.create
 *
 * ╔════════════════════════════════════════════════════════════════════════════╗
 * ║ THE GOLDEN RULE                                                            ║
 * ╠════════════════════════════════════════════════════════════════════════════╣
 * ║                                                                            ║
 * ║ Object.create(proto) creates a new object with [[Prototype]] = proto       ║
 * ║                                                                            ║
 * ║   Object.create(proto)    → new object with proto as prototype             ║
 * ║   Object.create(null)     → object with NO prototype (truly empty!)        ║
 * ║                                                                            ║
 * ║ This is the cleanest way to set up prototype chains.                       ║
 * ║                                                                            ║
 * ╚════════════════════════════════════════════════════════════════════════════╝
 */

var proto = {
  greet: function() {
    return 'Hello, ' + this.name;
  }
};

var obj1 = Object.create(proto);
obj1.name = 'Object 1';

var obj2 = Object.create(proto);
obj2.name = 'Object 2';

var obj3 = Object.create(null);
obj3.name = 'Object 3';

console.log('A:', obj1.greet());
console.log('B:', obj2.greet());
console.log('C:', obj1.greet === obj2.greet);
console.log('D:', obj3.hasOwnProperty);
console.log('E:', Object.getPrototypeOf(obj1) === proto);

/**
 * OUTPUT:
 *   A: Hello, Object 1
 *   B: Hello, Object 2
 *   C: true
 *   D: undefined
 *   E: true
 *
 *
 * ╔════════════════════════════════════════════════════════════════════════════╗
 * ║ STEP-BY-STEP BREAKDOWN                                                     ║
 * ╠════════════════════════════════════════════════════════════════════════════╣
 * ║                                                                            ║
 * ║ A: obj1.greet()                                                            ║
 * ║ ───────────────                                                            ║
 * ║   • Check obj1 → greet not found                                           ║
 * ║   • Check proto → greet found                                              ║
 * ║   • Call with this = obj1                                                  ║
 * ║   • this.name = 'Object 1'                                                 ║
 * ║   • Returns 'Hello, Object 1'                                              ║
 * ║                                                                            ║
 * ║                                                                            ║
 * ║ B: obj2.greet()                                                            ║
 * ║ ───────────────                                                            ║
 * ║   • Same lookup process                                                    ║
 * ║   • this = obj2                                                            ║
 * ║   • Returns 'Hello, Object 2'                                              ║
 * ║                                                                            ║
 * ║                                                                            ║
 * ║ C: obj1.greet === obj2.greet                                               ║
 * ║ ────────────────────────────                                               ║
 * ║   • Both reference the same function on proto                              ║
 * ║   • Returns true                                                           ║
 * ║                                                                            ║
 * ║                                                                            ║
 * ║ D: obj3.hasOwnProperty                                                     ║
 * ║ ──────────────────────                                                     ║
 * ║   • obj3 was created with Object.create(null)                              ║
 * ║   • It has NO prototype - not even Object.prototype!                       ║
 * ║   • hasOwnProperty comes from Object.prototype                             ║
 * ║   • obj3 doesn't have access to it                                         ║
 * ║   • Returns undefined                                                      ║
 * ║                                                                            ║
 * ║                                                                            ║
 * ║ E: Object.getPrototypeOf(obj1) === proto                                   ║
 * ║ ────────────────────────────────────────                                   ║
 * ║   • Object.getPrototypeOf returns the prototype                            ║
 * ║   • obj1's prototype is proto                                              ║
 * ║   • Returns true                                                           ║
 * ║                                                                            ║
 * ╚════════════════════════════════════════════════════════════════════════════╝
 *
 *
 * ┌─────────────────────────────────────────────────────────────────────────────┐
 * │ Object.create(null) - The Truly Empty Object                                │
 * ├─────────────────────────────────────────────────────────────────────────────┤
 * │                                                                             │
 * │ Normal object:                                                              │
 * │   var obj = {};                                                             │
 * │   obj.__proto__ → Object.prototype → null                                   │
 * │   obj.toString       // function (inherited)                                │
 * │   obj.hasOwnProperty // function (inherited)                                │
 * │                                                                             │
 * │ Object.create(null):                                                        │
 * │   var bare = Object.create(null);                                           │
 * │   bare.__proto__ → undefined/null (no prototype!)                           │
 * │   bare.toString       // undefined                                          │
 * │   bare.hasOwnProperty // undefined                                          │
 * │                                                                             │
 * │ USE CASES for Object.create(null):                                          │
 * │   • Safe dictionaries/maps without inherited properties                     │
 * │   • When you need 'hasOwnProperty' as a key                                 │
 * │   • Avoid prototype pollution attacks                                       │
 * │                                                                             │
 * │ EXAMPLE:                                                                    │
 * │   var dict = Object.create(null);                                           │
 * │   dict['hasOwnProperty'] = 'safe!';  // Works!                              │
 * │   dict['toString'] = 'also safe!';   // Works!                              │
 * │                                                                             │
 * └─────────────────────────────────────────────────────────────────────────────┘
 *
 *
 * ┌─────────────────────────────────────────────────────────────────────────────┐
 * │ Object.create() vs new Constructor()                                        │
 * ├─────────────────────────────────────────────────────────────────────────────┤
 * │                                                                             │
 * │ ┌─────────────────────────────┬────────────────────────────────────────┐    │
 * │ │ Object.create(proto)        │ new Constructor()                      │    │
 * │ ├─────────────────────────────┼────────────────────────────────────────┤    │
 * │ │ Sets __proto__ directly     │ Sets __proto__ to Constructor.prototype│    │
 * │ │ No constructor function     │ Runs constructor function              │    │
 * │ │ Clean & explicit            │ Traditional OOP style                  │    │
 * │ │ Can use null prototype      │ Always has Object.prototype in chain   │    │
 * │ └─────────────────────────────┴────────────────────────────────────────┘    │
 * │                                                                             │
 * │ EQUIVALENT CODE:                                                            │
 * │                                                                             │
 * │   // Using Object.create                                                    │
 * │   var proto = { greet: function() {} };                                     │
 * │   var obj = Object.create(proto);                                           │
 * │   obj.name = 'Alice';                                                       │
 * │                                                                             │
 * │   // Using constructor                                                      │
 * │   function Person(name) { this.name = name; }                               │
 * │   Person.prototype.greet = function() {};                                   │
 * │   var obj = new Person('Alice');                                            │
 * │                                                                             │
 * └─────────────────────────────────────────────────────────────────────────────┘
 *
 *
 * ┌─────────────────────────────────────────────────────────────────────────────┐
 * │ INTERVIEW ANSWER                                                            │
 * ├─────────────────────────────────────────────────────────────────────────────┤
 * │                                                                             │
 * │ "Object.create() is a clean way to set up prototype chains without          │
 * │  constructor functions. It takes a prototype object and creates a new       │
 * │  object that inherits from it.                                              │
 * │                                                                             │
 * │  The special case Object.create(null) creates an object with no             │
 * │  prototype at all - not even Object.prototype. This means no toString,      │
 * │  no hasOwnProperty, nothing inherited. This is useful for creating          │
 * │  safe dictionaries where you don't want inherited properties interfering.   │
 * │                                                                             │
 * │  In the example, obj3.hasOwnProperty is undefined because obj3 has          │
 * │  no prototype chain - hasOwnProperty normally comes from Object.prototype.  │
 * │                                                                             │
 * │  Object.getPrototypeOf() is the proper way to get an object's prototype,    │
 * │  as opposed to the deprecated __proto__ property."                          │
 * │                                                                             │
 * └─────────────────────────────────────────────────────────────────────────────┘
 *
 *
 * RUN: node docs/03-prototypes/03-object-create.js
 */
