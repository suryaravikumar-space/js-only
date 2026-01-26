/**
 * CLASSES & OOP: 01 - Constructor Functions (Pre-ES6)
 *
 * ╔════════════════════════════════════════════════════════════════════════════╗
 * ║ THE GOLDEN RULE                                                            ║
 * ╠════════════════════════════════════════════════════════════════════════════╣
 * ║                                                                            ║
 * ║ Constructor functions are the "old way" to create objects before ES6.     ║
 * ║ They are regular functions used with 'new' keyword.                        ║
 * ║                                                                            ║
 * ║   function Person(name) {   // Capital letter by convention                ║
 * ║     this.name = name;       // 'this' refers to new instance               ║
 * ║   }                                                                        ║
 * ║   var p = new Person('John');                                              ║
 * ║                                                                            ║
 * ╚════════════════════════════════════════════════════════════════════════════╝
 *
 *
 * ┌─────────────────────────────────────────────────────────────────────────────┐
 * │ WHY KNOW CONSTRUCTOR FUNCTIONS IN 2024+?                                    │
 * ├─────────────────────────────────────────────────────────────────────────────┤
 * │                                                                             │
 * │ 1. LEGACY CODE                                                              │
 * │    → Millions of lines of pre-ES6 code still in production                  │
 * │    → You WILL encounter this in real codebases                              │
 * │                                                                             │
 * │ 2. INTERVIEW QUESTIONS                                                      │
 * │    → "What happens when you call a function with 'new'?"                    │
 * │    → "What's the difference between class and constructor function?"        │
 * │    → Understanding this shows deep JavaScript knowledge                     │
 * │                                                                             │
 * │ 3. UNDERSTAND HOW CLASSES REALLY WORK                                       │
 * │    → ES6 classes compile down to constructor functions                      │
 * │    → Knowing the "old way" helps debug prototype issues                     │
 * │                                                                             │
 * │ 4. SOME PATTERNS STILL USE THEM                                             │
 * │    → Built-in constructors: Array, Object, Date, Error                      │
 * │    → Some libraries expose constructor functions                            │
 * │                                                                             │
 * └─────────────────────────────────────────────────────────────────────────────┘
 */


// ═══════════════════════════════════════════════════════════════════════════════
// BASIC CONSTRUCTOR FUNCTION
// ═══════════════════════════════════════════════════════════════════════════════

function Person(name, age) {
  // 'this' refers to the newly created object
  this.name = name;
  this.age = age;

  // BAD: Method inside constructor (copies to each instance)
  // this.greet = function() { return 'Hi ' + this.name; };
}

// GOOD: Method on prototype (shared by all instances)
Person.prototype.greet = function() {
  return 'Hi, I am ' + this.name;
};

Person.prototype.getAge = function() {
  return this.age;
};

var person1 = new Person('Alice', 30);
var person2 = new Person('Bob', 25);

console.log('A:', person1.greet());
console.log('B:', person2.greet());
console.log('C:', person1.greet === person2.greet);  // true - same function!

/**
 * OUTPUT:
 *   A: Hi, I am Alice
 *   B: Hi, I am Bob
 *   C: true
 */


// ═══════════════════════════════════════════════════════════════════════════════
// WHAT 'new' DOES - STEP BY STEP
// ═══════════════════════════════════════════════════════════════════════════════

/**
 * ┌─────────────────────────────────────────────────────────────────────────────┐
 * │ THE 4 STEPS OF 'new' KEYWORD                                                │
 * ├─────────────────────────────────────────────────────────────────────────────┤
 * │                                                                             │
 * │   var p = new Person('Alice', 30);                                          │
 * │                                                                             │
 * │   STEP 1: Create empty object                                               │
 * │   ─────────────────────────────                                             │
 * │   var obj = {};                                                             │
 * │                                                                             │
 * │                                                                             │
 * │   STEP 2: Link to prototype                                                 │
 * │   ───────────────────────────                                               │
 * │   obj.__proto__ = Person.prototype;                                         │
 * │   // or: Object.setPrototypeOf(obj, Person.prototype)                       │
 * │                                                                             │
 * │                                                                             │
 * │   STEP 3: Call constructor with 'this' bound to new object                  │
 * │   ──────────────────────────────────────────────────────                    │
 * │   var result = Person.call(obj, 'Alice', 30);                               │
 * │   // 'this.name = name' sets obj.name = 'Alice'                             │
 * │   // 'this.age = age' sets obj.age = 30                                     │
 * │                                                                             │
 * │                                                                             │
 * │   STEP 4: Return the object (unless constructor returns another object)     │
 * │   ───────────────────────────────────────────────────────────────────       │
 * │   return (typeof result === 'object' && result !== null) ? result : obj;    │
 * │                                                                             │
 * └─────────────────────────────────────────────────────────────────────────────┘
 */

// Manual implementation of 'new'
function myNew(Constructor, ...args) {
  // Step 1: Create empty object
  var obj = {};

  // Step 2: Link to prototype
  Object.setPrototypeOf(obj, Constructor.prototype);

  // Step 3: Call constructor
  var result = Constructor.apply(obj, args);

  // Step 4: Return appropriately
  return (typeof result === 'object' && result !== null) ? result : obj;
}

var person3 = myNew(Person, 'Charlie', 35);
console.log('D:', person3.greet());
console.log('E:', person3 instanceof Person);

/**
 * OUTPUT:
 *   D: Hi, I am Charlie
 *   E: true
 */


// ═══════════════════════════════════════════════════════════════════════════════
// FORGETTING 'new' - THE CLASSIC BUG
// ═══════════════════════════════════════════════════════════════════════════════

function Car(model) {
  this.model = model;
}

// Correct usage
var car1 = new Car('Tesla');
console.log('F:', car1.model);  // Tesla

// Incorrect - forgot 'new' (non-strict mode)
// In non-strict mode: 'this' is the global object!
// var car2 = Car('BMW');  // 'this.model' pollutes global!
// console.log(window.model);  // 'BMW' - Oops!

// In strict mode: 'this' is undefined, throws error
// 'use strict';
// var car2 = Car('BMW');  // TypeError: Cannot set property 'model' of undefined


// ═══════════════════════════════════════════════════════════════════════════════
// SAFE CONSTRUCTOR PATTERN
// ═══════════════════════════════════════════════════════════════════════════════

/**
 * ┌─────────────────────────────────────────────────────────────────────────────┐
 * │ WHEN TO USE: Protecting against missing 'new' in library code               │
 * ├─────────────────────────────────────────────────────────────────────────────┤
 * │                                                                             │
 * │ Use this pattern when:                                                      │
 * │ - Writing a library that others will use                                    │
 * │ - You want API flexibility (jQuery uses this!)                              │
 * │ - Defensive programming in critical code                                    │
 * │                                                                             │
 * └─────────────────────────────────────────────────────────────────────────────┘
 */

function SafeCar(model) {
  // Check if called with 'new'
  if (!(this instanceof SafeCar)) {
    return new SafeCar(model);  // Fix it automatically
  }
  this.model = model;
}

// Both work correctly!
var safecar1 = new SafeCar('Tesla');
var safecar2 = SafeCar('BMW');  // Works even without 'new'!

console.log('G:', safecar1.model);
console.log('H:', safecar2.model);
console.log('I:', safecar1 instanceof SafeCar);
console.log('J:', safecar2 instanceof SafeCar);

/**
 * OUTPUT:
 *   G: Tesla
 *   H: BMW
 *   I: true
 *   J: true
 */


// ═══════════════════════════════════════════════════════════════════════════════
// ES6 new.target
// ═══════════════════════════════════════════════════════════════════════════════

function ModernCar(model) {
  // new.target is undefined if called without 'new'
  if (!new.target) {
    throw new Error('ModernCar must be called with new');
  }
  this.model = model;
}

var modernCar = new ModernCar('Mercedes');
console.log('K:', modernCar.model);

try {
  var badCar = ModernCar('Audi');  // Throws error
} catch(e) {
  console.log('L:', e.message);
}

/**
 * OUTPUT:
 *   K: Mercedes
 *   L: ModernCar must be called with new
 */


// ═══════════════════════════════════════════════════════════════════════════════
// CONSTRUCTOR RETURNING VALUES
// ═══════════════════════════════════════════════════════════════════════════════

/**
 * ┌─────────────────────────────────────────────────────────────────────────────┐
 * │ RETURN VALUES FROM CONSTRUCTORS                                             │
 * ├─────────────────────────────────────────────────────────────────────────────┤
 * │                                                                             │
 * │ Return type        │ Result                                                 │
 * │ ───────────────────┼────────────────────────────────────────────────────    │
 * │ No return          │ Returns the new instance (normal behavior)             │
 * │ Return primitive   │ Ignored! Returns the new instance                      │
 * │ Return object      │ Returns that object instead of instance!               │
 * │                                                                             │
 * └─────────────────────────────────────────────────────────────────────────────┘
 */

function ReturnPrimitive(name) {
  this.name = name;
  return 42;  // Ignored!
}

function ReturnObject(name) {
  this.name = name;
  return { custom: 'object' };  // This is returned instead!
}

var prim = new ReturnPrimitive('test');
var obj = new ReturnObject('test');

console.log('M:', prim);         // { name: 'test' }
console.log('N:', prim.name);    // 'test'
console.log('O:', obj);          // { custom: 'object' }
console.log('P:', obj.name);     // undefined!

/**
 * OUTPUT:
 *   M: ReturnPrimitive { name: 'test' }
 *   N: test
 *   O: { custom: 'object' }
 *   P: undefined
 */


// ═══════════════════════════════════════════════════════════════════════════════
// COMPARISON: CONSTRUCTOR vs CLASS
// ═══════════════════════════════════════════════════════════════════════════════

/**
 * ┌─────────────────────────────────────────────────────────────────────────────┐
 * │ CONSTRUCTOR FUNCTION vs ES6 CLASS                                           │
 * ├─────────────────────────────────────────────────────────────────────────────┤
 * │                                                                             │
 * │ CONSTRUCTOR FUNCTION (ES5):          ES6 CLASS:                             │
 * │                                                                             │
 * │ function User(name) {                class User {                           │
 * │   this.name = name;                    constructor(name) {                  │
 * │ }                                        this.name = name;                  │
 * │                                        }                                    │
 * │ User.prototype.greet = function() {    greet() {                            │
 * │   return 'Hi ' + this.name;              return 'Hi ' + this.name;          │
 * │ };                                     }                                    │
 * │                                      }                                      │
 * │                                                                             │
 * │ ┌──────────────────────┬────────────────────┬──────────────────────────┐    │
 * │ │ Feature              │ Constructor        │ Class                    │    │
 * │ ├──────────────────────┼────────────────────┼──────────────────────────┤    │
 * │ │ Hoisted              │ Yes (function decl)│ No (TDZ)                 │    │
 * │ │ Can call without new │ Yes (buggy)        │ No (throws error)        │    │
 * │ │ Strict mode          │ Only if declared   │ Always                   │    │
 * │ │ Syntax               │ Verbose            │ Cleaner                  │    │
 * │ │ Static methods       │ Manual assignment  │ static keyword           │    │
 * │ │ Private fields       │ Closures only      │ # syntax (ES2022)        │    │
 * │ └──────────────────────┴────────────────────┴──────────────────────────┘    │
 * │                                                                             │
 * └─────────────────────────────────────────────────────────────────────────────┘
 */


/**
 * ┌─────────────────────────────────────────────────────────────────────────────┐
 * │ INTERVIEW ANSWER                                                            │
 * ├─────────────────────────────────────────────────────────────────────────────┤
 * │                                                                             │
 * │ "Constructor functions are the pre-ES6 way to create objects with shared    │
 * │  methods. They're regular functions called with the 'new' keyword.          │
 * │                                                                             │
 * │  When 'new' is used, four things happen:                                    │
 * │  1. A new empty object is created                                           │
 * │  2. Its __proto__ is linked to the constructor's prototype                  │
 * │  3. 'this' inside the constructor refers to the new object                  │
 * │  4. The new object is returned (unless constructor returns another object)  │
 * │                                                                             │
 * │  The biggest gotcha is forgetting 'new':                                    │
 * │  - Without 'new', 'this' is the global object (non-strict) or undefined     │
 * │  - ES6 classes fix this by throwing an error if you forget 'new'            │
 * │                                                                             │
 * │  Patterns to protect against this:                                          │
 * │  - Use instanceof check: if (!(this instanceof Car)) return new Car(...)    │
 * │  - Use new.target: if (!new.target) throw new Error(...)                    │
 * │                                                                             │
 * │  Why still know this in 2024+?                                              │
 * │  - Legacy codebases (lots of ES5 code in production)                        │
 * │  - Interview questions about 'new' and prototypes                           │
 * │  - Understanding how ES6 classes work under the hood                        │
 * │  - Built-in constructors like Array, Error, Date still use this pattern"   │
 * │                                                                             │
 * └─────────────────────────────────────────────────────────────────────────────┘
 *
 *
 * RUN: node docs/15-classes-oop/01-constructor-functions.js
 */
