/**
 * THIS BINDING: 00 - The Basics
 *
 * ╔════════════════════════════════════════════════════════════════════════════╗
 * ║ THE GOLDEN RULE                                                            ║
 * ╠════════════════════════════════════════════════════════════════════════════╣
 * ║                                                                            ║
 * ║ "this" is determined by HOW a function is CALLED, not where it's defined.  ║
 * ║                                                                            ║
 * ║ The same function can have different "this" values depending on            ║
 * ║ the calling context!                                                       ║
 * ║                                                                            ║
 * ╚════════════════════════════════════════════════════════════════════════════╝
 */


// ═══════════════════════════════════════════════════════════════════════════════
// THE 4 RULES OF "this"
// ═══════════════════════════════════════════════════════════════════════════════

console.log('=== The 4 Rules of "this" ===\n');

/**
 * ┌─────────────────────────────────────────────────────────────────────────────┐
 * │ HOW TO DETERMINE "this" - Check in this order!                              │
 * ├─────────────────────────────────────────────────────────────────────────────┤
 * │                                                                             │
 * │   PRIORITY (highest to lowest):                                             │
 * │                                                                             │
 * │   1. NEW BINDING                                                            │
 * │      new fn()  →  this = new empty object                                   │
 * │                                                                             │
 * │   2. EXPLICIT BINDING                                                       │
 * │      fn.call(obj) / fn.apply(obj) / fn.bind(obj)  →  this = obj             │
 * │                                                                             │
 * │   3. IMPLICIT BINDING                                                       │
 * │      obj.fn()  →  this = obj (the object before the dot)                    │
 * │                                                                             │
 * │   4. DEFAULT BINDING                                                        │
 * │      fn()  →  this = global (or undefined in strict mode)                   │
 * │                                                                             │
 * │                                                                             │
 * │   SPECIAL CASE: Arrow functions                                             │
 * │      →  this = lexically inherited (from enclosing scope)                   │
 * │                                                                             │
 * └─────────────────────────────────────────────────────────────────────────────┘
 */


// ═══════════════════════════════════════════════════════════════════════════════
// RULE 1: DEFAULT BINDING
// ═══════════════════════════════════════════════════════════════════════════════

console.log('=== Rule 1: Default Binding ===\n');

/**
 * ┌─────────────────────────────────────────────────────────────────────────────┐
 * │ DEFAULT BINDING                                                             │
 * │ When function is called standalone (no object, call, apply, bind, or new)   │
 * ├─────────────────────────────────────────────────────────────────────────────┤
 * │                                                                             │
 * │   fn()  →  this = global object (window in browser, global in Node)         │
 * │                                                                             │
 * │   In STRICT MODE:                                                           │
 * │   fn()  →  this = undefined                                                 │
 * │                                                                             │
 * └─────────────────────────────────────────────────────────────────────────────┘
 */

function showThis() {
  console.log('  this:', this === global ? 'global' : this);
}

console.log('A: Standalone call:');
showThis();  // global (or undefined in strict mode)

// Strict mode example
function strictShowThis() {
  'use strict';
  console.log('  this (strict):', this);
}

console.log('B: Standalone call (strict mode):');
strictShowThis();  // undefined


// ═══════════════════════════════════════════════════════════════════════════════
// RULE 2: IMPLICIT BINDING
// ═══════════════════════════════════════════════════════════════════════════════

console.log('\n=== Rule 2: Implicit Binding ===\n');

/**
 * ┌─────────────────────────────────────────────────────────────────────────────┐
 * │ IMPLICIT BINDING                                                            │
 * │ When function is called as a method of an object                            │
 * ├─────────────────────────────────────────────────────────────────────────────┤
 * │                                                                             │
 * │   obj.fn()  →  this = obj                                                   │
 * │                                                                             │
 * │   The object "before the dot" becomes this!                                 │
 * │                                                                             │
 * │   ┌────────────────────────────────────────────────────────────────────┐    │
 * │   │                                                                    │    │
 * │   │   obj.method()                                                     │    │
 * │   │    ▲                                                               │    │
 * │   │    │                                                               │    │
 * │   │    └── this = obj                                                  │    │
 * │   │                                                                    │    │
 * │   │   obj1.obj2.method()                                               │    │
 * │   │         ▲                                                          │    │
 * │   │         │                                                          │    │
 * │   │         └── this = obj2 (immediate object before dot)              │    │
 * │   │                                                                    │    │
 * │   └────────────────────────────────────────────────────────────────────┘    │
 * │                                                                             │
 * └─────────────────────────────────────────────────────────────────────────────┘
 */

const person = {
  name: 'Alice',
  greet() {
    console.log(`  Hello, I'm ${this.name}`);
  }
};

console.log('C: Method call:');
person.greet();  // Hello, I'm Alice

// Nested object
const company = {
  name: 'TechCorp',
  department: {
    name: 'Engineering',
    showName() {
      console.log(`  Department: ${this.name}`);
    }
  }
};

console.log('D: Nested object method:');
company.department.showName();  // Department: Engineering (not TechCorp!)


// ═══════════════════════════════════════════════════════════════════════════════
// IMPLICIT BINDING LOSS (GOTCHA!)
// ═══════════════════════════════════════════════════════════════════════════════

console.log('\n=== Implicit Binding Loss (GOTCHA!) ===\n');

/**
 * ┌─────────────────────────────────────────────────────────────────────────────┐
 * │ BINDING LOSS - A Common Bug!                                                │
 * ├─────────────────────────────────────────────────────────────────────────────┤
 * │                                                                             │
 * │   When you EXTRACT a method from an object, you lose the binding!           │
 * │                                                                             │
 * │   const fn = obj.method;  // Extract reference                              │
 * │   fn();                   // Called standalone → DEFAULT binding!           │
 * │                                                                             │
 * │   This happens with:                                                        │
 * │   • Assigning method to variable                                            │
 * │   • Passing method as callback                                              │
 * │   • setTimeout/setInterval                                                  │
 * │   • Event handlers                                                          │
 * │                                                                             │
 * └─────────────────────────────────────────────────────────────────────────────┘
 */

const user = {
  name: 'Bob',
  sayName() {
    console.log(`  Name: ${this.name}`);
  }
};

console.log('E: Direct method call:');
user.sayName();  // Name: Bob

console.log('F: Extracted method call:');
const extracted = user.sayName;
extracted();  // Name: undefined (this = global, global.name = undefined)

// setTimeout example
console.log('G: setTimeout loses binding (simulated):');
// setTimeout(user.sayName, 100);  // Would print: Name: undefined

// Fix with bind:
const bound = user.sayName.bind(user);
bound();  // Name: Bob


// ═══════════════════════════════════════════════════════════════════════════════
// RULE 3: EXPLICIT BINDING
// ═══════════════════════════════════════════════════════════════════════════════

console.log('\n=== Rule 3: Explicit Binding ===\n');

/**
 * ┌─────────────────────────────────────────────────────────────────────────────┐
 * │ EXPLICIT BINDING                                                            │
 * │ Manually set "this" using call(), apply(), or bind()                        │
 * ├─────────────────────────────────────────────────────────────────────────────┤
 * │                                                                             │
 * │   fn.call(thisArg, arg1, arg2)     →  Calls immediately, args as list       │
 * │   fn.apply(thisArg, [arg1, arg2])  →  Calls immediately, args as array      │
 * │   fn.bind(thisArg, arg1, arg2)     →  Returns new function, doesn't call    │
 * │                                                                             │
 * │                                                                             │
 * │   VISUAL:                                                                   │
 * │   ┌────────────────────────────────────────────────────────────────────┐    │
 * │   │                                                                    │    │
 * │   │   function greet(greeting) {                                       │    │
 * │   │     console.log(`${greeting}, ${this.name}`);                      │    │
 * │   │   }                                                                │    │
 * │   │                                                                    │    │
 * │   │   greet.call(person, 'Hello')    → "Hello, Alice"                  │    │
 * │   │              ▲        ▲                                            │    │
 * │   │              │        │                                            │    │
 * │   │              │        └── argument                                 │    │
 * │   │              └── this = person                                     │    │
 * │   │                                                                    │    │
 * │   └────────────────────────────────────────────────────────────────────┘    │
 * │                                                                             │
 * └─────────────────────────────────────────────────────────────────────────────┘
 */

function greet(greeting, punctuation) {
  console.log(`  ${greeting}, ${this.name}${punctuation}`);
}

const alice = { name: 'Alice' };
const bob = { name: 'Bob' };

console.log('H: Using call():');
greet.call(alice, 'Hello', '!');  // Hello, Alice!
greet.call(bob, 'Hi', '?');       // Hi, Bob?

console.log('I: Using apply():');
greet.apply(alice, ['Howdy', '!']);  // Howdy, Alice!

console.log('J: Using bind():');
const greetAlice = greet.bind(alice, 'Hey');
greetAlice('!');  // Hey, Alice!


// ═══════════════════════════════════════════════════════════════════════════════
// RULE 4: NEW BINDING
// ═══════════════════════════════════════════════════════════════════════════════

console.log('\n=== Rule 4: new Binding ===\n');

/**
 * ┌─────────────────────────────────────────────────────────────────────────────┐
 * │ NEW BINDING                                                                 │
 * │ When function is called with "new" keyword                                  │
 * ├─────────────────────────────────────────────────────────────────────────────┤
 * │                                                                             │
 * │   new Fn()  →  this = brand new empty object                                │
 * │                                                                             │
 * │   What "new" does:                                                          │
 * │   1. Creates a new empty object {}                                          │
 * │   2. Sets prototype: {}.__proto__ = Fn.prototype                            │
 * │   3. Calls Fn() with this = {}                                              │
 * │   4. Returns the object (unless Fn returns an object)                       │
 * │                                                                             │
 * └─────────────────────────────────────────────────────────────────────────────┘
 */

function Person(name) {
  // this = {} (new empty object)
  this.name = name;
  console.log(`  Constructing ${this.name}`);
  // implicit return this;
}

console.log('K: Using new:');
const charlie = new Person('Charlie');  // Constructing Charlie
console.log('L: charlie.name:', charlie.name);  // Charlie


/**
 * ┌─────────────────────────────────────────────────────────────────────────────┐
 * │ INTERVIEW ANSWER                                                            │
 * ├─────────────────────────────────────────────────────────────────────────────┤
 * │                                                                             │
 * │ "'this' in JavaScript is determined by HOW a function is called, not        │
 * │ where it's defined. There are 4 rules in order of precedence:               │
 * │                                                                             │
 * │ 1. new binding: new Fn() - this is the new object                           │
 * │ 2. Explicit binding: call/apply/bind - this is the specified object         │
 * │ 3. Implicit binding: obj.fn() - this is the object before the dot           │
 * │ 4. Default binding: fn() - this is global or undefined (strict mode)        │
 * │                                                                             │
 * │ Arrow functions are an exception - they don't have their own 'this',        │
 * │ they inherit it from the enclosing scope.                                   │
 * │                                                                             │
 * │ A common gotcha is implicit binding loss - when you extract a method        │
 * │ and call it standalone: const fn = obj.method; fn(); - this becomes         │
 * │ global/undefined. Fix with bind() or arrow functions."                      │
 * │                                                                             │
 * └─────────────────────────────────────────────────────────────────────────────┘
 *
 *
 * RUN: node docs/21-this-binding/00-this-basics.js
 */
