/**
 * CLASSES & OOP: 08 - Tricky Interview Examples
 *
 * ╔════════════════════════════════════════════════════════════════════════════╗
 * ║ THE GOLDEN RULE                                                            ║
 * ╠════════════════════════════════════════════════════════════════════════════╣
 * ║                                                                            ║
 * ║ Most class/OOP interview gotchas involve:                                  ║
 * ║   1. 'this' binding (loses context in callbacks)                           ║
 * ║   2. Prototype chain (where does the property live?)                       ║
 * ║   3. Static vs instance (called on class vs object)                        ║
 * ║   4. super() timing (must come before 'this' in constructor)               ║
 * ║                                                                            ║
 * ╚════════════════════════════════════════════════════════════════════════════╝
 */


// ═══════════════════════════════════════════════════════════════════════════════
// EXAMPLE 1: 'this' in Callback
// ═══════════════════════════════════════════════════════════════════════════════

class Button {
  constructor(label) {
    this.label = label;
  }

  click() {
    console.log(`${this.label} was clicked`);
  }
}

const btn = new Button('Submit');

// Direct call - works
btn.click();  // Submit was clicked

// Passed as callback - breaks!
const clickHandler = btn.click;
try {
  clickHandler();  // TypeError: Cannot read property 'label' of undefined
} catch (e) {
  console.log('A:', 'this is undefined in callback');
}

// Fix 1: bind
const boundClick = btn.click.bind(btn);
boundClick();  // Submit was clicked

// Fix 2: arrow wrapper
const arrowClick = () => btn.click();
arrowClick();  // Submit was clicked

/**
 * OUTPUT:
 *   Submit was clicked
 *   A: this is undefined in callback
 *   Submit was clicked
 *   Submit was clicked
 */


// ═══════════════════════════════════════════════════════════════════════════════
// EXAMPLE 2: Prototype vs Instance Property
// ═══════════════════════════════════════════════════════════════════════════════

/**
 * PREDICT THE OUTPUT:
 */

class Dog {
  constructor(name) {
    this.name = name;
  }
}

Dog.prototype.breed = 'Unknown';  // On prototype

const dog1 = new Dog('Rex');
const dog2 = new Dog('Max');

console.log('B:', dog1.breed);  // ?
console.log('C:', dog2.breed);  // ?

dog1.breed = 'German Shepherd';  // Creates instance property!

console.log('D:', dog1.breed);  // ?
console.log('E:', dog2.breed);  // ?
console.log('F:', dog1.hasOwnProperty('breed'));  // ?
console.log('G:', dog2.hasOwnProperty('breed'));  // ?

/**
 * OUTPUT:
 *   B: Unknown (from prototype)
 *   C: Unknown (from prototype)
 *   D: German Shepherd (instance property shadows prototype)
 *   E: Unknown (still from prototype - dog2 unchanged!)
 *   F: true (dog1 has OWN breed now)
 *   G: false (dog2 still uses prototype)
 *
 * KEY INSIGHT:
 * Setting dog1.breed creates a NEW property on dog1, it doesn't modify prototype!
 * dog2 still sees the prototype value.
 */


// ═══════════════════════════════════════════════════════════════════════════════
// EXAMPLE 3: Static vs Instance Method
// ═══════════════════════════════════════════════════════════════════════════════

/**
 * PREDICT THE OUTPUT:
 */

class Calculator {
  static add(a, b) {
    return a + b;
  }

  multiply(a, b) {
    return a * b;
  }
}

const calc = new Calculator();

console.log('H:', Calculator.add(2, 3));  // ?
console.log('I:', calc.multiply(2, 3));   // ?

try {
  console.log(calc.add(2, 3));  // ?
} catch (e) {
  console.log('J:', 'add is not on instance');
}

try {
  console.log(Calculator.multiply(2, 3));  // ?
} catch (e) {
  console.log('K:', 'multiply is not on class');
}

/**
 * OUTPUT:
 *   H: 5 (static method on class)
 *   I: 6 (instance method)
 *   J: add is not on instance
 *   K: multiply is not on class
 */


// ═══════════════════════════════════════════════════════════════════════════════
// EXAMPLE 4: Constructor Return Value
// ═══════════════════════════════════════════════════════════════════════════════

/**
 * PREDICT THE OUTPUT:
 */

class ReturnPrimitive {
  constructor() {
    this.value = 'instance';
    return 42;  // Return primitive
  }
}

class ReturnObject {
  constructor() {
    this.value = 'instance';
    return { value: 'returned object' };  // Return object
  }
}

const prim = new ReturnPrimitive();
const obj = new ReturnObject();

console.log('L:', prim.value);  // ?
console.log('M:', obj.value);   // ?

/**
 * OUTPUT:
 *   L: instance (primitive return is IGNORED)
 *   M: returned object (object return REPLACES instance!)
 *
 * RULE: Constructor return value:
 * - Primitive (number, string, boolean, null, undefined) → IGNORED
 * - Object → REPLACES the created instance!
 */


// ═══════════════════════════════════════════════════════════════════════════════
// EXAMPLE 5: super() Must Come First
// ═══════════════════════════════════════════════════════════════════════════════

/**
 * PREDICT THE OUTPUT:
 */

class Parent {
  constructor() {
    this.parentValue = 'parent';
  }
}

class Child extends Parent {
  constructor() {
    // What happens if we use 'this' before super()?
    try {
      // this.childValue = 'before super';  // Uncommenting causes ReferenceError!
    } catch (e) {
      console.log('N:', 'Cannot use this before super');
    }

    super();  // Must come first!
    this.childValue = 'child';
  }
}

const child = new Child();
console.log('O:', child.parentValue);  // ?
console.log('P:', child.childValue);   // ?

/**
 * OUTPUT:
 *   O: parent
 *   P: child
 */


// ═══════════════════════════════════════════════════════════════════════════════
// EXAMPLE 6: 'this' in Nested Functions
// ═══════════════════════════════════════════════════════════════════════════════

/**
 * PREDICT THE OUTPUT:
 */

class Processor {
  constructor() {
    this.items = [1, 2, 3];
  }

  processWithRegularFunction() {
    return this.items.map(function(item) {
      return item * this.items.length;  // What is 'this' here?
    });
  }

  processWithArrow() {
    return this.items.map(item => {
      return item * this.items.length;  // What is 'this' here?
    });
  }
}

const processor = new Processor();

try {
  console.log('Q:', processor.processWithRegularFunction());
} catch (e) {
  console.log('Q:', 'ERROR - this is undefined in regular function');
}

console.log('R:', processor.processWithArrow());  // ?

/**
 * OUTPUT:
 *   Q: ERROR - this is undefined in regular function
 *   R: [3, 6, 9] (arrow inherits 'this' from enclosing scope)
 *
 * INSIGHT: Arrow functions inherit 'this', regular functions get their own 'this'
 */


// ═══════════════════════════════════════════════════════════════════════════════
// EXAMPLE 7: Prototype Chain Lookup
// ═══════════════════════════════════════════════════════════════════════════════

/**
 * PREDICT THE OUTPUT:
 */

class Animal {
  constructor(name) {
    this.name = name;
  }

  speak() {
    return `${this.name} speaks`;
  }
}

class Dog extends Animal {
  speak() {
    return `${this.name} barks`;
  }
}

class Cat extends Animal {
  // No speak() override - uses Animal's
}

const dog = new Dog('Rex');
const cat = new Cat('Whiskers');

console.log('S:', dog.speak());  // ?
console.log('T:', cat.speak());  // ?
console.log('U:', dog.hasOwnProperty('speak'));  // ?
console.log('V:', Dog.prototype.hasOwnProperty('speak'));  // ?

/**
 * OUTPUT:
 *   S: Rex barks (Dog's speak)
 *   T: Whiskers speaks (inherited from Animal)
 *   U: false (speak is on prototype, not instance)
 *   V: true (speak is on Dog.prototype)
 */


// ═══════════════════════════════════════════════════════════════════════════════
// EXAMPLE 8: instanceof with Inheritance
// ═══════════════════════════════════════════════════════════════════════════════

/**
 * PREDICT THE OUTPUT:
 */

class Vehicle {}
class Car extends Vehicle {}
class Tesla extends Car {}

const myTesla = new Tesla();

console.log('W:', myTesla instanceof Tesla);    // ?
console.log('X:', myTesla instanceof Car);      // ?
console.log('Y:', myTesla instanceof Vehicle);  // ?
console.log('Z:', myTesla instanceof Object);   // ?
console.log('AA:', myTesla instanceof Array);   // ?

/**
 * OUTPUT:
 *   W: true
 *   X: true
 *   Y: true
 *   Z: true (everything inherits from Object)
 *   AA: false (Tesla doesn't extend Array)
 *
 * INSIGHT: instanceof checks the entire prototype chain!
 */


// ═══════════════════════════════════════════════════════════════════════════════
// EXAMPLE 9: Arrow Functions in Classes
// ═══════════════════════════════════════════════════════════════════════════════

/**
 * PREDICT THE OUTPUT:
 */

class Counter {
  count = 0;

  // Regular method
  incrementRegular() {
    this.count++;
  }

  // Arrow function as class field
  incrementArrow = () => {
    this.count++;
  };
}

const counter1 = new Counter();
const counter2 = new Counter();

// Are the methods shared?
console.log('AB:', counter1.incrementRegular === counter2.incrementRegular);  // ?
console.log('AC:', counter1.incrementArrow === counter2.incrementArrow);      // ?

/**
 * OUTPUT:
 *   AB: true (regular methods on prototype - shared)
 *   AC: false (arrow fields on instance - separate copies!)
 *
 * INSIGHT: Arrow function class fields are created on EACH instance,
 * not on the prototype. They use more memory!
 */


// ═══════════════════════════════════════════════════════════════════════════════
// EXAMPLE 10: Getters and Deletion
// ═══════════════════════════════════════════════════════════════════════════════

/**
 * PREDICT THE OUTPUT:
 */

class Person {
  constructor(first, last) {
    this.first = first;
    this.last = last;
  }

  get fullName() {
    return `${this.first} ${this.last}`;
  }
}

const person = new Person('John', 'Doe');

console.log('AD:', person.fullName);  // ?

delete person.first;  // Delete property

console.log('AE:', person.fullName);  // ?
console.log('AF:', person.first);     // ?

/**
 * OUTPUT:
 *   AD: John Doe
 *   AE: undefined Doe (first is undefined now)
 *   AF: undefined
 */


// ═══════════════════════════════════════════════════════════════════════════════
// EXAMPLE 11: Class Expression Hoisting
// ═══════════════════════════════════════════════════════════════════════════════

/**
 * PREDICT THE OUTPUT:
 */

try {
  const instance = new MyClass();  // Use before declaration
} catch (e) {
  console.log('AG:', 'Cannot use class before declaration');
}

class MyClass {
  constructor() {
    this.value = 42;
  }
}

const instance2 = new MyClass();  // After declaration - works
console.log('AH:', instance2.value);  // ?

/**
 * OUTPUT:
 *   AG: Cannot use class before declaration
 *   AH: 42
 *
 * INSIGHT: Classes are NOT hoisted like function declarations!
 * They're in the Temporal Dead Zone until declaration.
 */


// ═══════════════════════════════════════════════════════════════════════════════
// EXAMPLE 12: Static Inheritance
// ═══════════════════════════════════════════════════════════════════════════════

/**
 * PREDICT THE OUTPUT:
 */

class Parent2 {
  static type = 'parent';

  static getType() {
    return this.type;
  }
}

class Child2 extends Parent2 {
  static type = 'child';
}

console.log('AI:', Parent2.getType());  // ?
console.log('AJ:', Child2.getType());   // ?
console.log('AK:', Child2.type);        // ?
console.log('AL:', Parent2.type);       // ?

/**
 * OUTPUT:
 *   AI: parent
 *   AJ: child (Child2 inherits getType, but 'this' is Child2)
 *   AK: child
 *   AL: parent (Parent2's own type unchanged)
 *
 * INSIGHT: Static methods ARE inherited, and 'this' refers to the class
 * they're called on (Child2), not the class they're defined on (Parent2)
 */


// ═══════════════════════════════════════════════════════════════════════════════
// EXAMPLE 13: Modifying Prototype After Creation
// ═══════════════════════════════════════════════════════════════════════════════

/**
 * PREDICT THE OUTPUT:
 */

class Bird {
  fly() {
    return 'Flying!';
  }
}

const bird1 = new Bird();
console.log('AM:', bird1.fly());  // ?

// Add method to prototype AFTER instance creation
Bird.prototype.swim = function() {
  return 'Swimming!';
};

console.log('AN:', bird1.swim());  // ?

// Create new instance
const bird2 = new Bird();
console.log('AO:', bird2.swim());  // ?

/**
 * OUTPUT:
 *   AM: Flying!
 *   AN: Swimming! (bird1 can use new method!)
 *   AO: Swimming!
 *
 * INSIGHT: Prototype changes affect ALL instances, even existing ones!
 * This is why modifying built-in prototypes is dangerous.
 */


/**
 * ┌─────────────────────────────────────────────────────────────────────────────┐
 * │ INTERVIEW ANSWER - Common OOP Gotchas                                       │
 * ├─────────────────────────────────────────────────────────────────────────────┤
 * │                                                                             │
 * │ "The most common class/OOP interview traps:                                 │
 * │                                                                             │
 * │ 1. 'this' BINDING                                                           │
 * │    - Lost when method passed as callback                                    │
 * │    - Fix: .bind(), arrow functions, or arrow class fields                   │
 * │                                                                             │
 * │ 2. PROTOTYPE vs INSTANCE                                                    │
 * │    - Setting property on instance shadows prototype, doesn't change it      │
 * │    - hasOwnProperty() tells you where property actually lives               │
 * │                                                                             │
 * │ 3. STATIC vs INSTANCE                                                       │
 * │    - Static: ClassName.method() - not on instances                          │
 * │    - Instance: new ClassName().method() - not on class                      │
 * │                                                                             │
 * │ 4. CONSTRUCTOR RETURN                                                       │
 * │    - Return primitive → ignored, returns instance                           │
 * │    - Return object → replaces instance!                                     │
 * │                                                                             │
 * │ 5. super() MUST COME FIRST                                                  │
 * │    - In child constructor, can't use 'this' before super()                  │
 * │    - Because parent creates 'this'                                          │
 * │                                                                             │
 * │ 6. ARROW FUNCTIONS IN CLASSES                                               │
 * │    - Arrow class fields: fix 'this', but NOT on prototype (memory cost)     │
 * │    - Regular methods: on prototype (shared), but 'this' issues              │
 * │                                                                             │
 * │ 7. CLASS HOISTING                                                           │
 * │    - Classes are NOT hoisted (unlike function declarations)                 │
 * │    - Cannot use before declaration (Temporal Dead Zone)                     │
 * │                                                                             │
 * │ 8. instanceof                                                               │
 * │    - Checks entire prototype chain                                          │
 * │    - myDog instanceof Animal → true if Dog extends Animal"                  │
 * │                                                                             │
 * └─────────────────────────────────────────────────────────────────────────────┘
 *
 *
 * RUN: node docs/15-classes-oop/08-tricky-examples.js
 */
