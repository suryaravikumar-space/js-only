/**
 * PROXY & REFLECT: 02 - The Reflect API
 *
 * ╔════════════════════════════════════════════════════════════════════════════╗
 * ║ REFLECT - THE COMPANION TO PROXY                                          ║
 * ╠════════════════════════════════════════════════════════════════════════════╣
 * ║                                                                            ║
 * ║ Reflect is a built-in object that provides methods for interceptable       ║
 * ║ JavaScript operations. Every Proxy trap has a corresponding Reflect       ║
 * ║ method with the SAME signature.                                           ║
 * ║                                                                            ║
 * ╚════════════════════════════════════════════════════════════════════════════╝
 */


// ═══════════════════════════════════════════════════════════════════════════════
// WHY REFLECT EXISTS
// ═══════════════════════════════════════════════════════════════════════════════

console.log('=== Why Reflect Exists ===\n');

/**
 * ┌─────────────────────────────────────────────────────────────────────────────┐
 * │ PROBLEMS REFLECT SOLVES                                                     │
 * ├─────────────────────────────────────────────────────────────────────────────┤
 * │                                                                             │
 * │   1. CONSISTENCY:                                                           │
 * │      Before Reflect, object operations were scattered:                      │
 * │      • Object.keys(), Object.getPrototypeOf()                               │
 * │      • delete obj.prop, prop in obj                                         │
 * │      • Function.prototype.apply()                                           │
 * │                                                                             │
 * │      Reflect puts them all in one place with consistent signatures.         │
 * │                                                                             │
 * │   2. RETURN VALUES:                                                         │
 * │      • Object.defineProperty throws on failure                              │
 * │      • Reflect.defineProperty returns boolean                               │
 * │                                                                             │
 * │   3. PROXY TRAP DEFAULTS:                                                   │
 * │      Reflect methods do the "default" operation for each trap.              │
 * │      In a trap, use Reflect to forward to original behavior.                │
 * │                                                                             │
 * │                                                                             │
 * │   ┌────────────────────────────────────────────────────────────────────┐    │
 * │   │                                                                    │    │
 * │   │   Proxy Trap          ←───────────→         Reflect Method         │    │
 * │   │   (intercepts)                              (performs default)     │    │
 * │   │                                                                    │    │
 * │   │   get(target, prop)   ←───────────→   Reflect.get(target, prop)    │    │
 * │   │   set(target, prop)   ←───────────→   Reflect.set(target, prop)    │    │
 * │   │   has(target, prop)   ←───────────→   Reflect.has(target, prop)    │    │
 * │   │                                                                    │    │
 * │   └────────────────────────────────────────────────────────────────────┘    │
 * │                                                                             │
 * └─────────────────────────────────────────────────────────────────────────────┘
 */


// ═══════════════════════════════════════════════════════════════════════════════
// REFLECT METHODS OVERVIEW
// ═══════════════════════════════════════════════════════════════════════════════

console.log('=== Reflect Methods ===\n');

/**
 * ┌─────────────────────────────────────────────────────────────────────────────┐
 * │ ALL REFLECT METHODS (same as Proxy traps)                                   │
 * ├─────────────────────────────────────────────────────────────────────────────┤
 * │                                                                             │
 * │   Reflect.get(target, property, receiver)                                   │
 * │   Reflect.set(target, property, value, receiver)                            │
 * │   Reflect.has(target, property)                                             │
 * │   Reflect.deleteProperty(target, property)                                  │
 * │   Reflect.ownKeys(target)                                                   │
 * │   Reflect.getOwnPropertyDescriptor(target, property)                        │
 * │   Reflect.defineProperty(target, property, descriptor)                      │
 * │   Reflect.preventExtensions(target)                                         │
 * │   Reflect.isExtensible(target)                                              │
 * │   Reflect.getPrototypeOf(target)                                            │
 * │   Reflect.setPrototypeOf(target, prototype)                                 │
 * │   Reflect.apply(target, thisArg, args)                                      │
 * │   Reflect.construct(target, args, newTarget)                                │
 * │                                                                             │
 * └─────────────────────────────────────────────────────────────────────────────┘
 */


// ═══════════════════════════════════════════════════════════════════════════════
// REFLECT.GET & REFLECT.SET
// ═══════════════════════════════════════════════════════════════════════════════

console.log('=== Reflect.get & Reflect.set ===\n');

const user = {
  firstName: 'John',
  lastName: 'Doe',
  get fullName() {
    return `${this.firstName} ${this.lastName}`;
  }
};

// Reflect.get - same as obj[prop] but with receiver support
console.log('A: Reflect.get(user, "firstName"):', Reflect.get(user, 'firstName'));

// The receiver matters for getters
const customReceiver = { firstName: 'Jane', lastName: 'Smith' };
console.log('B: Reflect.get with receiver:', Reflect.get(user, 'fullName', customReceiver));

// Reflect.set
const obj = { x: 1 };
const success = Reflect.set(obj, 'y', 2);
console.log('C: Reflect.set returned:', success);
console.log('D: obj.y:', obj.y);


// ═══════════════════════════════════════════════════════════════════════════════
// REFLECT.HAS & REFLECT.DELETEPROPERTY
// ═══════════════════════════════════════════════════════════════════════════════

console.log('\n=== Reflect.has & Reflect.deleteProperty ===\n');

const data = { a: 1, b: 2 };

// Reflect.has - same as "prop in obj"
console.log('E: Reflect.has(data, "a"):', Reflect.has(data, 'a'));     // true
console.log('F: Reflect.has(data, "c"):', Reflect.has(data, 'c'));     // false

// Reflect.deleteProperty - same as "delete obj[prop]"
console.log('G: Before delete:', Object.keys(data));
const deleted = Reflect.deleteProperty(data, 'b');
console.log('H: Reflect.deleteProperty returned:', deleted);
console.log('I: After delete:', Object.keys(data));


// ═══════════════════════════════════════════════════════════════════════════════
// REFLECT.OWNKEYS
// ═══════════════════════════════════════════════════════════════════════════════

console.log('\n=== Reflect.ownKeys ===\n');

/**
 * ┌─────────────────────────────────────────────────────────────────────────────┐
 * │ Reflect.ownKeys vs Object.keys                                              │
 * ├─────────────────────────────────────────────────────────────────────────────┤
 * │                                                                             │
 * │   Object.keys():     Only enumerable string keys                            │
 * │   Reflect.ownKeys(): ALL own keys (including Symbols, non-enumerable)       │
 * │                                                                             │
 * └─────────────────────────────────────────────────────────────────────────────┘
 */

const sym = Symbol('id');
const mixed = {
  visible: 1,
  [sym]: 'secret'
};

Object.defineProperty(mixed, 'hidden', {
  value: 2,
  enumerable: false
});

console.log('J: Object.keys:', Object.keys(mixed));           // ['visible']
console.log('K: Reflect.ownKeys:', Reflect.ownKeys(mixed));   // ['visible', 'hidden', Symbol(id)]


// ═══════════════════════════════════════════════════════════════════════════════
// REFLECT.DEFINEPROPERTY
// ═══════════════════════════════════════════════════════════════════════════════

console.log('\n=== Reflect.defineProperty ===\n');

/**
 * ┌─────────────────────────────────────────────────────────────────────────────┐
 * │ DIFFERENCE FROM Object.defineProperty                                       │
 * ├─────────────────────────────────────────────────────────────────────────────┤
 * │                                                                             │
 * │   Object.defineProperty:                                                    │
 * │   • Returns the object                                                      │
 * │   • THROWS on failure                                                       │
 * │                                                                             │
 * │   Reflect.defineProperty:                                                   │
 * │   • Returns true/false                                                      │
 * │   • NO throw on failure                                                     │
 * │                                                                             │
 * └─────────────────────────────────────────────────────────────────────────────┘
 */

const target = {};
Object.preventExtensions(target);  // Can't add new properties

// Object.defineProperty throws
try {
  Object.defineProperty(target, 'x', { value: 1 });
} catch (e) {
  console.log('L: Object.defineProperty threw:', e.message);
}

// Reflect.defineProperty returns false
const result = Reflect.defineProperty(target, 'y', { value: 2 });
console.log('M: Reflect.defineProperty returned:', result);  // false


// ═══════════════════════════════════════════════════════════════════════════════
// REFLECT.APPLY & REFLECT.CONSTRUCT
// ═══════════════════════════════════════════════════════════════════════════════

console.log('\n=== Reflect.apply & Reflect.construct ===\n');

// Reflect.apply - same as Function.prototype.apply
function greet(greeting) {
  return `${greeting}, ${this.name}!`;
}

const person = { name: 'Alice' };
console.log('N: Reflect.apply:', Reflect.apply(greet, person, ['Hello']));

// Reflect.construct - same as "new" operator
function Person(name, age) {
  this.name = name;
  this.age = age;
}

const alice = Reflect.construct(Person, ['Alice', 30]);
console.log('O: Reflect.construct:', alice);


// ═══════════════════════════════════════════════════════════════════════════════
// USING REFLECT IN PROXY TRAPS
// ═══════════════════════════════════════════════════════════════════════════════

console.log('\n=== Reflect in Proxy Traps ===\n');

/**
 * ┌─────────────────────────────────────────────────────────────────────────────┐
 * │ BEST PRACTICE: Use Reflect in Proxy Traps                                   │
 * ├─────────────────────────────────────────────────────────────────────────────┤
 * │                                                                             │
 * │   // Without Reflect (problematic)                                          │
 * │   get(target, prop) {                                                       │
 * │     console.log('get', prop);                                               │
 * │     return target[prop];  // Doesn't handle receivers correctly!            │
 * │   }                                                                         │
 * │                                                                             │
 * │   // With Reflect (correct)                                                 │
 * │   get(target, prop, receiver) {                                             │
 * │     console.log('get', prop);                                               │
 * │     return Reflect.get(target, prop, receiver);  // Handles getters!        │
 * │   }                                                                         │
 * │                                                                             │
 * └─────────────────────────────────────────────────────────────────────────────┘
 */

// Example: Logging proxy using Reflect
const logged = {
  value: 42,
  get doubled() {
    return this.value * 2;
  }
};

const loggingProxy = new Proxy(logged, {
  get(target, property, receiver) {
    console.log(`  [GET] ${property}`);
    return Reflect.get(target, property, receiver);  // Correct!
  },
  set(target, property, value, receiver) {
    console.log(`  [SET] ${property} = ${value}`);
    return Reflect.set(target, property, value, receiver);
  }
});

console.log('P: Reading through proxy:');
console.log('  value:', loggingProxy.value);
console.log('  doubled:', loggingProxy.doubled);  // Getter works correctly!

console.log('\nQ: Writing through proxy:');
loggingProxy.value = 100;


// ═══════════════════════════════════════════════════════════════════════════════
// RECEIVER PARAMETER EXPLAINED
// ═══════════════════════════════════════════════════════════════════════════════

console.log('\n=== The Receiver Parameter ===\n');

/**
 * ┌─────────────────────────────────────────────────────────────────────────────┐
 * │ WHY RECEIVER MATTERS                                                        │
 * ├─────────────────────────────────────────────────────────────────────────────┤
 * │                                                                             │
 * │   The receiver is the "this" value when a getter is invoked.                │
 * │   It matters for inheritance and proxy chains.                              │
 * │                                                                             │
 * │   const parent = {                                                          │
 * │     get value() { return this.x; }                                          │
 * │   };                                                                        │
 * │                                                                             │
 * │   const child = Object.create(parent);                                      │
 * │   child.x = 10;                                                             │
 * │                                                                             │
 * │   // When accessing child.value:                                            │
 * │   // • target = parent (where getter is defined)                            │
 * │   // • receiver = child (what we accessed through)                          │
 * │                                                                             │
 * │   Reflect.get(parent, 'value', child);  // this.x refers to child.x = 10    │
 * │                                                                             │
 * └─────────────────────────────────────────────────────────────────────────────┘
 */

const parent = {
  x: 5,
  get value() {
    return this.x;
  }
};

const child = Object.create(parent);
child.x = 10;

console.log('R: Without receiver (uses parent.x):', Reflect.get(parent, 'value'));         // 5
console.log('S: With child as receiver (uses child.x):', Reflect.get(parent, 'value', child)); // 10


/**
 * ┌─────────────────────────────────────────────────────────────────────────────┐
 * │ INTERVIEW ANSWER                                                            │
 * ├─────────────────────────────────────────────────────────────────────────────┤
 * │                                                                             │
 * │ "Reflect is a built-in object that provides methods for interceptable       │
 * │ JavaScript operations - one method for each Proxy trap.                     │
 * │                                                                             │
 * │ Why use Reflect:                                                            │
 * │                                                                             │
 * │ 1. CONSISTENCY: All object operations in one place with consistent API     │
 * │                                                                             │
 * │ 2. BETTER RETURNS: Returns boolean instead of throwing (e.g.,               │
 * │    Reflect.defineProperty returns false instead of throwing)                │
 * │                                                                             │
 * │ 3. PROXY DEFAULT BEHAVIOR: In proxy traps, Reflect methods perform          │
 * │    the default operation. Always use Reflect in traps to handle             │
 * │    getters/setters and inheritance correctly.                               │
 * │                                                                             │
 * │ 4. RECEIVER SUPPORT: Reflect.get/set take a receiver parameter              │
 * │    that becomes 'this' in getters/setters - critical for inheritance.       │
 * │                                                                             │
 * │ Best practice in Proxy trap:                                                │
 * │   get(target, prop, receiver) {                                             │
 * │     // Custom logic here                                                    │
 * │     return Reflect.get(target, prop, receiver);  // Forward correctly       │
 * │   }"                                                                        │
 * │                                                                             │
 * └─────────────────────────────────────────────────────────────────────────────┘
 *
 *
 * RUN: node docs/23-proxy-reflect/02-reflect-api.js
 */
