/**
 * CLASSES & OOP: 09 - Interview Q&A Summary
 *
 * ╔════════════════════════════════════════════════════════════════════════════╗
 * ║ COMPLETE INTERVIEW GUIDE FOR CLASSES & OOP                                 ║
 * ╠════════════════════════════════════════════════════════════════════════════╣
 * ║                                                                            ║
 * ║ This file contains the most common interview questions with detailed       ║
 * ║ answers, plus a quick reference cheat sheet.                               ║
 * ║                                                                            ║
 * ╚════════════════════════════════════════════════════════════════════════════╝
 */


/**
 * ┌─────────────────────────────────────────────────────────────────────────────┐
 * │ Q1: What are ES6 classes and how do they differ from constructor functions? │
 * ├─────────────────────────────────────────────────────────────────────────────┤
 * │                                                                             │
 * │ "ES6 classes are syntactic sugar over JavaScript's prototype-based          │
 * │ inheritance. Under the hood, they still use prototypes.                     │
 * │                                                                             │
 * │ Key differences from constructor functions:                                 │
 * │                                                                             │
 * │ 1. MUST use 'new' - classes throw error without it                          │
 * │ 2. Not hoisted - classes are in Temporal Dead Zone                          │
 * │ 3. Strict mode - class body always runs in strict mode                      │
 * │ 4. Cleaner syntax - methods don't need 'function' keyword                   │
 * │ 5. Built-in extends/super - inheritance is simpler                          │
 * │ 6. Static keyword - for static methods/properties                           │
 * │ 7. Private fields - use # prefix (ES2022)                                   │
 * │                                                                             │
 * │ typeof MyClass === 'function' - proves it's still a function underneath."   │
 * │                                                                             │
 * └─────────────────────────────────────────────────────────────────────────────┘
 */


/**
 * ┌─────────────────────────────────────────────────────────────────────────────┐
 * │ Q2: Explain the prototype chain. What is __proto__ vs prototype?            │
 * ├─────────────────────────────────────────────────────────────────────────────┤
 * │                                                                             │
 * │ "Every JS object has a hidden [[Prototype]] link. When you access a         │
 * │ property, JS walks up this chain until it finds it or hits null.            │
 * │                                                                             │
 * │ .prototype - Property on FUNCTIONS (constructors/classes)                   │
 * │              This becomes the __proto__ of instances created with 'new'     │
 * │                                                                             │
 * │ __proto__ - Property on ALL OBJECTS                                         │
 * │             Points to the object it inherits from                           │
 * │             Modern: Object.getPrototypeOf(obj)                              │
 * │                                                                             │
 * │ Example:                                                                    │
 * │   function Dog() {}                                                         │
 * │   const d = new Dog();                                                      │
 * │                                                                             │
 * │   d.__proto__ === Dog.prototype  // true                                    │
 * │   Dog.prototype.__proto__ === Object.prototype  // true                     │
 * │   Object.prototype.__proto__ === null  // end of chain                      │
 * │                                                                             │
 * │ Methods on prototype are SHARED by all instances (memory efficient)."       │
 * │                                                                             │
 * └─────────────────────────────────────────────────────────────────────────────┘
 */


/**
 * ┌─────────────────────────────────────────────────────────────────────────────┐
 * │ Q3: What happens when you call a function with 'new'?                       │
 * ├─────────────────────────────────────────────────────────────────────────────┤
 * │                                                                             │
 * │ "The 'new' keyword does 4 things:                                           │
 * │                                                                             │
 * │ 1. Creates a new empty object: {}                                           │
 * │                                                                             │
 * │ 2. Sets its [[Prototype]] to Constructor.prototype                          │
 * │    obj.__proto__ = Constructor.prototype                                    │
 * │                                                                             │
 * │ 3. Calls the constructor with 'this' bound to the new object                │
 * │    Constructor.call(obj, ...args)                                           │
 * │                                                                             │
 * │ 4. Returns the new object (unless constructor returns another object)       │
 * │    - Primitive return values are IGNORED                                    │
 * │    - Object return values REPLACE the instance                              │
 * │                                                                             │
 * │ This is why forgetting 'new' with constructor functions is a bug:           │
 * │ - 'this' would be undefined (strict) or global (non-strict)                 │
 * │ - ES6 classes fix this by throwing an error"                                │
 * │                                                                             │
 * └─────────────────────────────────────────────────────────────────────────────┘
 */


/**
 * ┌─────────────────────────────────────────────────────────────────────────────┐
 * │ Q4: How does inheritance work with extends and super?                       │
 * ├─────────────────────────────────────────────────────────────────────────────┤
 * │                                                                             │
 * │ "'extends' sets up the prototype chain between classes.                     │
 * │ 'super' is used to call parent constructor and methods.                     │
 * │                                                                             │
 * │ CRITICAL RULE: In child constructor, super() MUST be called before 'this'   │
 * │ Why? Because the parent constructor creates 'this' - it doesn't exist yet!  │
 * │                                                                             │
 * │ class Animal {                                                              │
 * │   constructor(name) { this.name = name; }                                   │
 * │ }                                                                           │
 * │                                                                             │
 * │ class Dog extends Animal {                                                  │
 * │   constructor(name, breed) {                                                │
 * │     super(name);  // MUST come first!                                       │
 * │     this.breed = breed;                                                     │
 * │   }                                                                         │
 * │                                                                             │
 * │   speak() {                                                                 │
 * │     return super.speak() + ' with a bark';  // Call parent method           │
 * │   }                                                                         │
 * │ }                                                                           │
 * │                                                                             │
 * │ Use inheritance for true 'IS-A' relationships.                              │
 * │ Prefer composition for 'HAS-A' relationships."                              │
 * │                                                                             │
 * └─────────────────────────────────────────────────────────────────────────────┘
 */


/**
 * ┌─────────────────────────────────────────────────────────────────────────────┐
 * │ Q5: What are static methods? When would you use them?                       │
 * ├─────────────────────────────────────────────────────────────────────────────┤
 * │                                                                             │
 * │ "Static methods belong to the class itself, not instances.                  │
 * │ Call them on the class: ClassName.method(), not instance.method()           │
 * │                                                                             │
 * │ Use static methods for:                                                     │
 * │                                                                             │
 * │ 1. UTILITY FUNCTIONS - No instance data needed                              │
 * │    Math.max(), Validator.isEmail()                                          │
 * │                                                                             │
 * │ 2. FACTORY METHODS - Create instances in different ways                     │
 * │    User.fromJSON(), Date.now(), Array.from()                                │
 * │                                                                             │
 * │ 3. CONSTANTS - Shared configuration                                         │
 * │    HttpStatus.OK = 200                                                      │
 * │                                                                             │
 * │ 4. SINGLETON PATTERN                                                        │
 * │    Database.getInstance()                                                   │
 * │                                                                             │
 * │ 5. INSTANCE TRACKING                                                        │
 * │    User.count, Connection.getActiveCount()                                  │
 * │                                                                             │
 * │ Static methods ARE inherited by child classes.                              │
 * │ In static methods, 'this' refers to the class itself."                      │
 * │                                                                             │
 * └─────────────────────────────────────────────────────────────────────────────┘
 */


/**
 * ┌─────────────────────────────────────────────────────────────────────────────┐
 * │ Q6: What are getters and setters? When would you use them?                  │
 * ├─────────────────────────────────────────────────────────────────────────────┤
 * │                                                                             │
 * │ "Getters and setters are methods that look like properties.                 │
 * │ Access them without parentheses: obj.prop instead of obj.getProp()          │
 * │                                                                             │
 * │ GETTERS - Use for:                                                          │
 * │ - Computed properties (fullName = first + last)                             │
 * │ - Lazy evaluation with caching                                              │
 * │ - Clean API (obj.age instead of obj.getAge())                               │
 * │                                                                             │
 * │ SETTERS - Use for:                                                          │
 * │ - Validation (ensure age is positive)                                       │
 * │ - Side effects (notify observers, update DOM)                               │
 * │ - Transformation (trim, lowercase)                                          │
 * │                                                                             │
 * │ class User {                                                                │
 * │   get fullName() { return this.first + ' ' + this.last; }                   │
 * │   set fullName(v) { [this.first, this.last] = v.split(' '); }               │
 * │ }                                                                           │
 * │                                                                             │
 * │ user.fullName;           // Calls getter                                    │
 * │ user.fullName = 'John';  // Calls setter                                    │
 * │                                                                             │
 * │ Getter-only = read-only property (no setter means can't assign)."           │
 * │                                                                             │
 * └─────────────────────────────────────────────────────────────────────────────┘
 */


/**
 * ┌─────────────────────────────────────────────────────────────────────────────┐
 * │ Q7: What are private fields (#)? How do they differ from _underscore?       │
 * ├─────────────────────────────────────────────────────────────────────────────┤
 * │                                                                             │
 * │ "ES2022 introduced true private fields using the # prefix.                  │
 * │                                                                             │
 * │ #private (ES2022):                                                          │
 * │ - Language enforced - SyntaxError if accessed outside class                 │
 * │ - obj['#field'] doesn't work (it's a different property)                    │
 * │ - Doesn't show in Object.keys() or JSON                                     │
 * │ - NOT inherited by child classes                                            │
 * │                                                                             │
 * │ _underscore (convention):                                                   │
 * │ - Just a naming convention                                                  │
 * │ - Still accessible: obj._secret works                                       │
 * │ - Shows in Object.keys()                                                    │
 * │ - Works with inheritance                                                    │
 * │                                                                             │
 * │ Use #private for:                                                           │
 * │ - Sensitive data (passwords, tokens)                                        │
 * │ - Internal implementation details                                           │
 * │ - Library code where internals must be hidden                               │
 * │                                                                             │
 * │ Use _underscore for:                                                        │
 * │ - When inheritance needs access                                             │
 * │ - Older browser support                                                     │
 * │ - Team prefers convention over enforcement"                                 │
 * │                                                                             │
 * └─────────────────────────────────────────────────────────────────────────────┘
 */


/**
 * ┌─────────────────────────────────────────────────────────────────────────────┐
 * │ Q8: Classes vs Factory Functions - when to use each?                        │
 * ├─────────────────────────────────────────────────────────────────────────────┤
 * │                                                                             │
 * │ "CLASSES:                                                                   │
 * │ + Methods shared on prototype (memory efficient for many instances)         │
 * │ + Supports inheritance with extends/super                                   │
 * │ + Works with instanceof                                                     │
 * │ - 'this' binding issues in callbacks                                        │
 * │ - Must use 'new' keyword                                                    │
 * │                                                                             │
 * │ FACTORIES:                                                                  │
 * │ + True privacy via closures                                                 │
 * │ + No 'this' binding issues                                                  │
 * │ + No 'new' keyword needed                                                   │
 * │ + Easy composition                                                          │
 * │ - Methods copied to each instance (more memory)                             │
 * │ - No instanceof support                                                     │
 * │                                                                             │
 * │ Decision guide:                                                             │
 * │ - Many instances → Classes (memory)                                         │
 * │ - Callbacks/handlers → Factories (no 'this' issues)                         │
 * │ - Inheritance → Classes                                                     │
 * │ - Composition → Factories                                                   │
 * │ - instanceof needed → Classes                                               │
 * │                                                                             │
 * │ React moved from classes to hooks (factory pattern) specifically to         │
 * │ avoid 'this' issues and enable better composition."                         │
 * │                                                                             │
 * └─────────────────────────────────────────────────────────────────────────────┘
 */


/**
 * ┌─────────────────────────────────────────────────────────────────────────────┐
 * │ Q9: Why do we lose 'this' in callbacks and how do we fix it?                │
 * ├─────────────────────────────────────────────────────────────────────────────┤
 * │                                                                             │
 * │ "When you pass a method as a callback, it loses its 'this' binding:         │
 * │                                                                             │
 * │ const btn = new Button('Submit');                                           │
 * │ setTimeout(btn.click, 100);  // 'this' is undefined!                        │
 * │                                                                             │
 * │ Why? Because 'this' is determined by HOW a function is called,              │
 * │ not WHERE it's defined. Passing as callback = calling without obj.          │
 * │                                                                             │
 * │ SOLUTIONS:                                                                  │
 * │                                                                             │
 * │ 1. .bind() - Create bound function                                          │
 * │    setTimeout(btn.click.bind(btn), 100);                                    │
 * │                                                                             │
 * │ 2. Arrow wrapper - Keep reference                                           │
 * │    setTimeout(() => btn.click(), 100);                                      │
 * │                                                                             │
 * │ 3. Arrow class field - Auto-binds (but creates copy per instance)           │
 * │    class Button {                                                           │
 * │      click = () => { ... };  // 'this' captured at creation                 │
 * │    }                                                                        │
 * │                                                                             │
 * │ 4. Bind in constructor                                                      │
 * │    constructor() {                                                          │
 * │      this.click = this.click.bind(this);                                    │
 * │    }                                                                        │
 * │                                                                             │
 * │ Factory functions avoid this entirely by using closures instead of 'this'." │
 * │                                                                             │
 * └─────────────────────────────────────────────────────────────────────────────┘
 */


/**
 * ┌─────────────────────────────────────────────────────────────────────────────┐
 * │ Q10: What is composition over inheritance?                                  │
 * ├─────────────────────────────────────────────────────────────────────────────┤
 * │                                                                             │
 * │ "It's a design principle: build complex objects by combining simpler        │
 * │ pieces rather than inheriting from a single parent.                         │
 * │                                                                             │
 * │ INHERITANCE (single parent):                                                │
 * │   class Dog extends Animal { ... }                                          │
 * │   Dog can only inherit from ONE class                                       │
 * │                                                                             │
 * │ COMPOSITION (multiple behaviors):                                           │
 * │   const dog = { ...canWalk, ...canBark, ...canEat };                        │
 * │   Mix any behaviors you need                                                │
 * │                                                                             │
 * │ Why prefer composition?                                                     │
 * │ - More flexible (mix any behaviors)                                         │
 * │ - Avoids deep hierarchy problems                                            │
 * │ - Easier to change (swap behaviors)                                         │
 * │ - Avoids 'gorilla holding banana' problem                                   │
 * │                                                                             │
 * │ Example:                                                                    │
 * │   const canSwim = (state) => ({ swim: () => state.pos += 5 });              │
 * │   const canFly = (state) => ({ fly: () => state.pos += 10 });               │
 * │                                                                             │
 * │   function createDuck() {                                                   │
 * │     const state = { pos: 0 };                                               │
 * │     return { ...canSwim(state), ...canFly(state) };                         │
 * │   }                                                                         │
 * │                                                                             │
 * │ React hooks = composition pattern for UI components."                       │
 * │                                                                             │
 * └─────────────────────────────────────────────────────────────────────────────┘
 */


/**
 * ╔════════════════════════════════════════════════════════════════════════════╗
 * ║ CHEAT SHEET: Classes & OOP                                                 ║
 * ╠════════════════════════════════════════════════════════════════════════════╣
 * ║                                                                            ║
 * ║ CLASS BASICS:                                                              ║
 * ║   class User {                                                             ║
 * ║     constructor(name) { this.name = name; }                                ║
 * ║     greet() { return 'Hi ' + this.name; }                                  ║
 * ║   }                                                                        ║
 * ║   const u = new User('Alice');  // Must use 'new'                          ║
 * ║                                                                            ║
 * ║ PROTOTYPE:                                                                 ║
 * ║   obj.__proto__ === Constructor.prototype  // How inheritance works        ║
 * ║   obj.hasOwnProperty('x')  // Check if property is on instance vs proto    ║
 * ║   Object.create(proto)  // Create object with specific prototype           ║
 * ║                                                                            ║
 * ║ INHERITANCE:                                                               ║
 * ║   class Child extends Parent {                                             ║
 * ║     constructor(a, b) {                                                    ║
 * ║       super(a);  // MUST come before 'this'                                ║
 * ║       this.b = b;                                                          ║
 * ║     }                                                                      ║
 * ║     method() { return super.method() + ' more'; }  // Call parent          ║
 * ║   }                                                                        ║
 * ║                                                                            ║
 * ║ STATIC:                                                                    ║
 * ║   class Utils {                                                            ║
 * ║     static PI = 3.14;                                                      ║
 * ║     static double(x) { return x * 2; }                                     ║
 * ║   }                                                                        ║
 * ║   Utils.PI  // Access on class, not instance                               ║
 * ║                                                                            ║
 * ║ GETTERS/SETTERS:                                                           ║
 * ║   get fullName() { return this.first + ' ' + this.last; }                  ║
 * ║   set fullName(v) { [this.first, this.last] = v.split(' '); }              ║
 * ║   user.fullName  // No parentheses                                         ║
 * ║                                                                            ║
 * ║ PRIVATE FIELDS (ES2022):                                                   ║
 * ║   class Safe {                                                             ║
 * ║     #secret = 'hidden';  // Truly private                                  ║
 * ║     getSecret() { return this.#secret; }                                   ║
 * ║   }                                                                        ║
 * ║   safe.#secret  // SyntaxError!                                            ║
 * ║                                                                            ║
 * ║ FACTORY FUNCTION:                                                          ║
 * ║   function createUser(name) {                                              ║
 * ║     let secret = 'private';  // Closure = privacy                          ║
 * ║     return {                                                               ║
 * ║       name,                                                                ║
 * ║       greet: () => 'Hi ' + name  // No 'this' issues!                      ║
 * ║     };                                                                     ║
 * ║   }                                                                        ║
 * ║   const u = createUser('Alice');  // No 'new' needed                       ║
 * ║                                                                            ║
 * ║ FIX 'this' IN CALLBACKS:                                                   ║
 * ║   setTimeout(obj.method.bind(obj), 100);  // bind                          ║
 * ║   setTimeout(() => obj.method(), 100);    // arrow wrapper                 ║
 * ║   method = () => { ... };  // arrow class field                            ║
 * ║                                                                            ║
 * ║ INSTANCEOF:                                                                ║
 * ║   obj instanceof Class  // Checks entire prototype chain                   ║
 * ║   Array.isArray(arr)    // Better for arrays                               ║
 * ║                                                                            ║
 * ╚════════════════════════════════════════════════════════════════════════════╝
 *
 *
 * RUN: node docs/15-classes-oop/09-interview-qa.js
 */


// Verify file loads
console.log('Classes & OOP module complete!');
console.log('Topics covered:');
console.log('  00 - Class basics');
console.log('  01 - Constructor functions');
console.log('  02 - Prototypes');
console.log('  03 - Inheritance');
console.log('  04 - Static methods');
console.log('  05 - Getters and setters');
console.log('  06 - Private fields');
console.log('  07 - Class vs factory');
console.log('  08 - Tricky examples');
console.log('  09 - Interview Q&A');
console.log('\nNext: 16-generators-iterators');
