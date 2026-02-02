/**
 * CLASSES & OOP: 02 - Prototypes Deep Dive
 *
 * ╔════════════════════════════════════════════════════════════════════════════╗
 * ║ THE GOLDEN RULE                                                            ║
 * ╠════════════════════════════════════════════════════════════════════════════╣
 * ║                                                                            ║
 * ║ Every JavaScript object has a hidden [[Prototype]] link to another object. ║
 * ║ When you access a property, JS looks up the PROTOTYPE CHAIN.               ║
 * ║                                                                            ║
 * ║   obj.foo                                                                  ║
 * ║     → Does obj have foo? Yes → return it                                   ║
 * ║     → No? Check obj.__proto__                                              ║
 * ║     → No? Check obj.__proto__.__proto__                                    ║
 * ║     → ... until null (end of chain) → undefined                            ║
 * ║                                                                            ║
 * ╚════════════════════════════════════════════════════════════════════════════╝
 *
 *
 * ┌─────────────────────────────────────────────────────────────────────────────┐
 * │ WHY PROTOTYPES MATTER FOR HIGH-PAYING JOBS                                  │
 * ├─────────────────────────────────────────────────────────────────────────────┤
 * │                                                                             │
 * │ 1. INTERVIEW FAVORITE                                                       │
 * │    → "Explain prototype chain"                                              │
 * │    → "What's the difference between __proto__ and prototype?"               │
 * │    → "How does inheritance work in JS?"                                     │
 * │                                                                             │
 * │ 2. DEBUG PRODUCTION ISSUES                                                  │
 * │    → "Why is hasOwnProperty not working?"                                   │
 * │    → "Why did extending Array.prototype break the app?"                     │
 * │    → Understanding prototype helps fix inheritance bugs                     │
 * │                                                                             │
 * │ 3. UNDERSTAND FRAMEWORKS                                                    │
 * │    → React components, Vue mixins use prototype concepts                    │
 * │    → Polyfills work by adding to prototypes                                 │
 * │    → Type checking libraries rely on prototype chain                        │
 * │                                                                             │
 * │ 4. PERFORMANCE OPTIMIZATION                                                 │
 * │    → Methods on prototype = memory efficient                                │
 * │    → Methods on instance = faster access but more memory                    │
 * │                                                                             │
 * └─────────────────────────────────────────────────────────────────────────────┘
 */


// ═══════════════════════════════════════════════════════════════════════════════
// __proto__ vs prototype - THE CONFUSING PART
// ═══════════════════════════════════════════════════════════════════════════════

/**
 * ┌─────────────────────────────────────────────────────────────────────────────┐
 * │ THE KEY DISTINCTION (MEMORIZE THIS!)                                        │
 * ├─────────────────────────────────────────────────────────────────────────────┤
 * │                                                                             │
 * │   .prototype    →  Property on FUNCTIONS (specifically constructors)        │
 * │                    Becomes the __proto__ of instances created with 'new'    │
 * │                                                                             │
 * │   __proto__     →  Property on ALL OBJECTS                                  │
 * │                    Points to the object's prototype (where it inherits)     │
 * │                    Modern: Object.getPrototypeOf(obj)                       │
 * │                                                                             │
 * │                                                                             │
 * │   function Dog() {}                                                         │
 * │   Dog.prototype  ←── Only functions have .prototype                         │
 * │        │                                                                    │
 * │        ▼                                                                    │
 * │   var d = new Dog();                                                        │
 * │   d.__proto__ === Dog.prototype  ←── Instance's __proto__ links here        │
 * │                                                                             │
 * └─────────────────────────────────────────────────────────────────────────────┘
 */

function Animal(name) {
  this.name = name;
}

Animal.prototype.speak = function() {
  return this.name + ' makes a sound';
};

var dog = new Animal('Rex');

// Demonstrating the connection
console.log('A:', dog.__proto__ === Animal.prototype);           // true
console.log('B:', Object.getPrototypeOf(dog) === Animal.prototype); // true
console.log('C:', dog.hasOwnProperty('name'));                   // true
console.log('D:', dog.hasOwnProperty('speak'));                  // false
console.log('E:', Animal.prototype.hasOwnProperty('speak'));     // true

/**
 * OUTPUT:
 *   A: true
 *   B: true
 *   C: true
 *   D: false
 *   E: true
 */


// ═══════════════════════════════════════════════════════════════════════════════
// THE PROTOTYPE CHAIN
// ═══════════════════════════════════════════════════════════════════════════════

/**
 * ┌─────────────────────────────────────────────────────────────────────────────┐
 * │ VISUAL: The Complete Prototype Chain                                        │
 * ├─────────────────────────────────────────────────────────────────────────────┤
 * │                                                                             │
 * │   var dog = new Animal('Rex');                                              │
 * │                                                                             │
 * │   ┌─────────────────────────┐                                               │
 * │   │ dog (instance)          │                                               │
 * │   │                         │                                               │
 * │   │ name: 'Rex'             │                                               │
 * │   │ __proto__ ──────────────┼──▶ ┌─────────────────────────┐                │
 * │   │                         │    │ Animal.prototype        │                │
 * │   └─────────────────────────┘    │                         │                │
 * │                                  │ speak: function()       │                │
 * │                                  │ constructor: Animal     │                │
 * │                                  │ __proto__ ──────────────┼──▶ ┌─────────┐ │
 * │                                  │                         │    │ Object  │ │
 * │                                  └─────────────────────────┘    │.prototype│
 * │                                                                 │          │
 * │                                               hasOwnProperty ◀──│          │
 * │                                               toString ◀────────│          │
 * │                                               valueOf ◀─────────│          │
 * │                                               __proto__ ────────┼──▶ null  │
 * │                                                                 └─────────┘ │
 * │                                                                             │
 * │   PROPERTY LOOKUP: dog.toString()                                           │
 * │   ─────────────────────────────                                             │
 * │   1. dog.toString? No                                                       │
 * │   2. dog.__proto__.toString (Animal.prototype)? No                          │
 * │   3. dog.__proto__.__proto__.toString (Object.prototype)? YES! Use it       │
 * │                                                                             │
 * └─────────────────────────────────────────────────────────────────────────────┘
 */

// Walking the prototype chain
console.log('F:', dog.toString());  // [object Object] - from Object.prototype!

// Check the chain
console.log('G:', dog.__proto__);                        // Animal.prototype
console.log('H:', dog.__proto__.__proto__);              // Object.prototype
console.log('I:', dog.__proto__.__proto__.__proto__);    // null (end of chain)

/**
 * OUTPUT:
 *   F: [object Object]
 *   G: Animal { speak: [Function] }
 *   H: {}
 *   I: null
 */


// ═══════════════════════════════════════════════════════════════════════════════
// PROPERTY SHADOWING
// ═══════════════════════════════════════════════════════════════════════════════

/**
 * ┌─────────────────────────────────────────────────────────────────────────────┐
 * │ WHEN TO USE: Override inherited behavior for specific instance              │
 * ├─────────────────────────────────────────────────────────────────────────────┤
 * │                                                                             │
 * │ If you add a property to an instance that exists on the prototype,          │
 * │ the instance property "shadows" (hides) the prototype property.             │
 * │                                                                             │
 * │ Use case: Custom behavior for one instance without affecting others         │
 * │                                                                             │
 * └─────────────────────────────────────────────────────────────────────────────┘
 */

function Car(model) {
  this.model = model;
}

Car.prototype.honk = function() {
  return 'Beep beep!';
};

var car1 = new Car('Toyota');
var car2 = new Car('Honda');

// Shadow the prototype method on car1 only
car1.honk = function() {
  return 'HOOOOONK!';  // Custom horn
};

console.log('J:', car1.honk());  // HOOOOONK! (instance method)
console.log('K:', car2.honk());  // Beep beep! (prototype method)

// Check where the method lives
console.log('L:', car1.hasOwnProperty('honk'));  // true - on instance
console.log('M:', car2.hasOwnProperty('honk'));  // false - on prototype

// Remove shadowing
delete car1.honk;
console.log('N:', car1.honk());  // Beep beep! (prototype method again)

/**
 * OUTPUT:
 *   J: HOOOOONK!
 *   K: Beep beep!
 *   L: true
 *   M: false
 *   N: Beep beep!
 */


// ═══════════════════════════════════════════════════════════════════════════════
// Object.create() - DIRECT PROTOTYPE CONTROL
// ═══════════════════════════════════════════════════════════════════════════════

/**
 * ┌─────────────────────────────────────────────────────────────────────────────┐
 * │ WHEN TO USE Object.create()                                                 │
 * ├─────────────────────────────────────────────────────────────────────────────┤
 * │                                                                             │
 * │ 1. Creating objects with specific prototype (not using constructor)         │
 * │ 2. Object-to-object inheritance (no classes needed)                         │
 * │ 3. Creating truly empty objects: Object.create(null)                        │
 * │ 4. Setting up inheritance chains manually                                   │
 * │                                                                             │
 * └─────────────────────────────────────────────────────────────────────────────┘
 */

// Object with specific prototype
var animalProto = {
  speak: function() {
    return this.name + ' speaks';
  },
  walk: function() {
    return this.name + ' walks';
  }
};

var cat = Object.create(animalProto);
cat.name = 'Whiskers';

console.log('O:', cat.speak());  // Whiskers speaks
console.log('P:', cat.walk());   // Whiskers walks
console.log('Q:', Object.getPrototypeOf(cat) === animalProto);  // true

/**
 * OUTPUT:
 *   O: Whiskers speaks
 *   P: Whiskers walks
 *   Q: true
 */


// ═══════════════════════════════════════════════════════════════════════════════
// Object.create(null) - TRUE EMPTY OBJECT
// ═══════════════════════════════════════════════════════════════════════════════

/**
 * ┌─────────────────────────────────────────────────────────────────────────────┐
 * │ WHEN TO USE Object.create(null)                                             │
 * ├─────────────────────────────────────────────────────────────────────────────┤
 * │                                                                             │
 * │ 1. Dictionary/Map-like objects (no inherited properties to worry about)     │
 * │ 2. Safe object keys (no "constructor" or "toString" collision)              │
 * │ 3. Caches where any string key should work                                  │
 * │                                                                             │
 * │ Regular object: { }                                                         │
 * │   → Inherits from Object.prototype                                          │
 * │   → Has hasOwnProperty, toString, constructor, etc.                         │
 * │                                                                             │
 * │ Null prototype: Object.create(null)                                         │
 * │   → No prototype at all                                                     │
 * │   → Pure data storage                                                       │
 * │                                                                             │
 * └─────────────────────────────────────────────────────────────────────────────┘
 */

var regularObj = {};
var nullProtoObj = Object.create(null);

console.log('R:', regularObj.hasOwnProperty);  // [Function]
console.log('S:', nullProtoObj.hasOwnProperty);  // undefined

// Safe to use any key
nullProtoObj['constructor'] = 'totally safe';
nullProtoObj['__proto__'] = 'also safe';

console.log('T:', nullProtoObj['constructor']);  // totally safe
console.log('U:', Object.getPrototypeOf(nullProtoObj));  // null

/**
 * OUTPUT:
 *   R: [Function: hasOwnProperty]
 *   S: undefined
 *   T: totally safe
 *   U: null
 */


// ═══════════════════════════════════════════════════════════════════════════════
// MODIFYING BUILT-IN PROTOTYPES (DANGER!)
// ═══════════════════════════════════════════════════════════════════════════════

/**
 * ┌─────────────────────────────────────────────────────────────────────────────┐
 * │ WARNING: When to NEVER modify built-in prototypes                           │
 * ├─────────────────────────────────────────────────────────────────────────────┤
 * │                                                                             │
 * │ DON'T modify Array.prototype, Object.prototype, String.prototype in:        │
 * │   - Production code (conflicts with other libraries)                        │
 * │   - Shared libraries (you don't control the environment)                    │
 * │   - Any code others might use                                               │
 * │                                                                             │
 * │ OKAY to modify in:                                                          │
 * │   - Polyfills (adding missing standard methods)                             │
 * │   - Learning/experiments                                                    │
 * │   - Very controlled environments                                            │
 * │                                                                             │
 * └─────────────────────────────────────────────────────────────────────────────┘
 */

// Example: Adding a polyfill (safe pattern)
if (!Array.prototype.myCustomFirst) {
  Array.prototype.myCustomFirst = function() {
    return this[0];
  };
}

var nums = [1, 2, 3];
console.log('V:', nums.myCustomFirst());  // 1

// Clean up (in real code, don't add custom methods to built-ins)
delete Array.prototype.myCustomFirst;


// ═══════════════════════════════════════════════════════════════════════════════
// CHECKING PROTOTYPE RELATIONSHIPS
// ═══════════════════════════════════════════════════════════════════════════════

function Parent() {}
function Child() {}
Child.prototype = Object.create(Parent.prototype);
Child.prototype.constructor = Child;

var instance = new Child();

// Different ways to check
console.log('W:', instance instanceof Child);   // true
console.log('X:', instance instanceof Parent);  // true
console.log('Y:', instance instanceof Object);  // true

console.log('Z:', Parent.prototype.isPrototypeOf(instance));  // true
console.log('AA:', Object.prototype.isPrototypeOf(instance)); // true

/**
 * OUTPUT:
 *   W: true
 *   X: true
 *   Y: true
 *   Z: true
 *   AA: true
 */


/**
 * ┌─────────────────────────────────────────────────────────────────────────────┐
 * │ INTERVIEW ANSWER                                                            │
 * ├─────────────────────────────────────────────────────────────────────────────┤
 * │                                                                             │
 * │ "JavaScript uses prototypal inheritance. Every object has a hidden          │
 * │  [[Prototype]] link (accessible via __proto__ or Object.getPrototypeOf).    │
 * │                                                                             │
 * │  The key distinction:                                                       │
 * │  - .prototype is on FUNCTIONS - it's what instances inherit from            │
 * │  - __proto__ is on ALL OBJECTS - it's where the object inherits from        │
 * │                                                                             │
 * │  When you access a property, JavaScript walks the prototype chain:          │
 * │  1. Check the object itself                                                 │
 * │  2. Check its __proto__                                                     │
 * │  3. Check __proto__.__proto__                                               │
 * │  4. Continue until null (end of chain)                                      │
 * │                                                                             │
 * │  Property shadowing: If an instance has the same property as its            │
 * │  prototype, the instance property 'shadows' (hides) the prototype one.      │
 * │                                                                             │
 * │  Object.create(proto) creates objects with a specific prototype.            │
 * │  Object.create(null) creates objects with no prototype - useful for         │
 * │  dictionary-like objects where any string key is safe.                      │
 * │                                                                             │
 * │  Never modify built-in prototypes (Array.prototype, etc.) in production     │
 * │  code - it can break other libraries. The only exception is polyfills       │
 * │  for missing standard methods."                                             │
 * │                                                                             │
 * └─────────────────────────────────────────────────────────────────────────────┘
 *
 *
 * RUN: node docs/15-classes-oop/02-prototypes.js
 */
