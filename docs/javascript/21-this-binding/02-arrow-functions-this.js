/**
 * THIS BINDING: 02 - Arrow Functions and "this"
 *
 * ╔════════════════════════════════════════════════════════════════════════════╗
 * ║ THE GOLDEN RULE FOR ARROW FUNCTIONS                                        ║
 * ╠════════════════════════════════════════════════════════════════════════════╣
 * ║                                                                            ║
 * ║ Arrow functions DO NOT have their own "this".                              ║
 * ║ They INHERIT "this" from the enclosing lexical scope.                      ║
 * ║                                                                            ║
 * ║ This is called LEXICAL BINDING - "this" is determined by WHERE             ║
 * ║ the arrow function is DEFINED, not how it's called.                        ║
 * ║                                                                            ║
 * ╚════════════════════════════════════════════════════════════════════════════╝
 */


// ═══════════════════════════════════════════════════════════════════════════════
// ARROW FUNCTION vs REGULAR FUNCTION
// ═══════════════════════════════════════════════════════════════════════════════

console.log('=== Arrow vs Regular Function ===\n');

/**
 * ┌─────────────────────────────────────────────────────────────────────────────┐
 * │ KEY DIFFERENCE                                                              │
 * ├─────────────────────────────────────────────────────────────────────────────┤
 * │                                                                             │
 * │   REGULAR FUNCTION:                                                         │
 * │   ──────────────────────────────────────────────────────────────────        │
 * │   "this" is determined by HOW the function is CALLED                        │
 * │                                                                             │
 * │   function fn() { console.log(this); }                                      │
 * │   obj.fn();    // this = obj                                                │
 * │   fn();        // this = global/undefined                                   │
 * │                                                                             │
 * │                                                                             │
 * │   ARROW FUNCTION:                                                           │
 * │   ──────────────────────────────────────────────────────────────────        │
 * │   "this" is determined by WHERE the function is DEFINED                     │
 * │                                                                             │
 * │   const fn = () => { console.log(this); }                                   │
 * │   obj.fn();    // this = enclosing scope's this                             │
 * │   fn();        // this = enclosing scope's this (same!)                     │
 * │                                                                             │
 * │                                                                             │
 * │   ┌────────────────────────────────────────────────────────────────────┐    │
 * │   │         Regular Function          │          Arrow Function        │    │
 * │   │         ─────────────────         │          ──────────────        │    │
 * │   │         Has its own "this"        │          NO own "this"         │    │
 * │   │         Call-site binding         │          Lexical binding       │    │
 * │   │         Can use call/apply/bind   │          Ignores call/apply    │    │
 * │   │         Can be constructor        │          CANNOT be constructor │    │
 * │   └────────────────────────────────────────────────────────────────────┘    │
 * │                                                                             │
 * └─────────────────────────────────────────────────────────────────────────────┘
 */

const obj = {
  name: 'Object',

  regularMethod: function() {
    console.log('  Regular this.name:', this.name);
  },

  arrowMethod: () => {
    console.log('  Arrow this.name:', this.name);  // "this" from outer scope
  }
};

console.log('A: Method calls:');
obj.regularMethod();  // Object
obj.arrowMethod();    // undefined (this = global/module)


// ═══════════════════════════════════════════════════════════════════════════════
// LEXICAL SCOPING OF "this"
// ═══════════════════════════════════════════════════════════════════════════════

console.log('\n=== Lexical Scoping ===\n');

/**
 * ┌─────────────────────────────────────────────────────────────────────────────┐
 * │ ARROW FUNCTION INHERITS "this" FROM ENCLOSING SCOPE                         │
 * ├─────────────────────────────────────────────────────────────────────────────┤
 * │                                                                             │
 * │   const obj = {                                                             │
 * │     name: 'Obj',                                                            │
 * │     method() {                  ← "this" = obj                              │
 * │       const arrow = () => {                                                 │
 * │         console.log(this.name); ← Inherits "this" from method              │
 * │       };                                                                    │
 * │       arrow();                  ← Still uses obj as "this"                  │
 * │     }                                                                       │
 * │   };                                                                        │
 * │                                                                             │
 * └─────────────────────────────────────────────────────────────────────────────┘
 */

const counter = {
  count: 0,

  // Regular method - "this" is counter
  increment() {
    console.log('  Before:', this.count);

    // Arrow function inside method inherits "this"
    const addOne = () => {
      this.count++;  // "this" is still counter!
    };

    addOne();
    console.log('  After:', this.count);
  }
};

console.log('B: Arrow inside method:');
counter.increment();  // Before: 0, After: 1


// ═══════════════════════════════════════════════════════════════════════════════
// CALLBACKS - THE MAIN USE CASE
// ═══════════════════════════════════════════════════════════════════════════════

console.log('\n=== Callbacks (Main Use Case) ===\n');

/**
 * ┌─────────────────────────────────────────────────────────────────────────────┐
 * │ ARROW FUNCTIONS SOLVE THE CALLBACK "this" PROBLEM                           │
 * ├─────────────────────────────────────────────────────────────────────────────┤
 * │                                                                             │
 * │   PROBLEM with regular functions:                                           │
 * │   ──────────────────────────────────────────────────────────────────        │
 * │                                                                             │
 * │   const obj = {                                                             │
 * │     name: 'Timer',                                                          │
 * │     start() {                                                               │
 * │       setTimeout(function() {                                               │
 * │         console.log(this.name);  // undefined! "this" is global             │
 * │       }, 1000);                                                             │
 * │     }                                                                       │
 * │   };                                                                        │
 * │                                                                             │
 * │                                                                             │
 * │   SOLUTION with arrow functions:                                            │
 * │   ──────────────────────────────────────────────────────────────────        │
 * │                                                                             │
 * │   const obj = {                                                             │
 * │     name: 'Timer',                                                          │
 * │     start() {                                                               │
 * │       setTimeout(() => {                                                    │
 * │         console.log(this.name);  // 'Timer'! Arrow inherits "this"          │
 * │       }, 1000);                                                             │
 * │     }                                                                       │
 * │   };                                                                        │
 * │                                                                             │
 * └─────────────────────────────────────────────────────────────────────────────┘
 */

// Problem: Regular function callback
const timerBad = {
  name: 'BadTimer',
  start() {
    console.log('C: Regular callback in setTimeout:');
    setTimeout(function() {
      console.log('  this.name:', this.name);  // undefined
    }, 0);
  }
};

// Solution: Arrow function callback
const timerGood = {
  name: 'GoodTimer',
  start() {
    console.log('D: Arrow callback in setTimeout:');
    setTimeout(() => {
      console.log('  this.name:', this.name);  // GoodTimer
    }, 10);
  }
};

timerBad.start();
timerGood.start();

// Array methods with arrow functions
console.log('\nE: Array methods with arrow functions:');
const team = {
  name: 'Developers',
  members: ['Alice', 'Bob', 'Charlie'],

  showMembers() {
    // Arrow function keeps "this" as team
    this.members.forEach(member => {
      console.log(`  ${member} is on team ${this.name}`);
    });
  }
};

team.showMembers();


// ═══════════════════════════════════════════════════════════════════════════════
// ARROW FUNCTIONS IGNORE call/apply/bind
// ═══════════════════════════════════════════════════════════════════════════════

console.log('\n=== Arrow Functions Ignore call/apply/bind ===\n');

/**
 * ┌─────────────────────────────────────────────────────────────────────────────┐
 * │ CANNOT CHANGE "this" ON ARROW FUNCTIONS                                     │
 * ├─────────────────────────────────────────────────────────────────────────────┤
 * │                                                                             │
 * │   const arrow = () => this;                                                 │
 * │                                                                             │
 * │   arrow.call({ x: 1 });   // Still returns outer "this"                     │
 * │   arrow.apply({ x: 1 });  // Still returns outer "this"                     │
 * │   arrow.bind({ x: 1 })(); // Still returns outer "this"                     │
 * │                                                                             │
 * │   The "this" in arrow functions is PERMANENTLY FIXED to the lexical scope   │
 * │                                                                             │
 * └─────────────────────────────────────────────────────────────────────────────┘
 */

const arrowFn = () => {
  return this;
};

const someObj = { name: 'someObj' };

console.log('F: Trying to change arrow "this":');
console.log('  call():', arrowFn.call(someObj) === someObj);     // false
console.log('  apply():', arrowFn.apply(someObj) === someObj);   // false
console.log('  bind():', arrowFn.bind(someObj)() === someObj);   // false


// ═══════════════════════════════════════════════════════════════════════════════
// WHEN NOT TO USE ARROW FUNCTIONS
// ═══════════════════════════════════════════════════════════════════════════════

console.log('\n=== When NOT to Use Arrow Functions ===\n');

/**
 * ┌─────────────────────────────────────────────────────────────────────────────┐
 * │ AVOID ARROW FUNCTIONS IN THESE CASES                                        │
 * ├─────────────────────────────────────────────────────────────────────────────┤
 * │                                                                             │
 * │   1. OBJECT METHODS (that need "this"):                                     │
 * │   ──────────────────────────────────────────────────────────────────        │
 * │                                                                             │
 * │   const obj = {                                                             │
 * │     name: 'Obj',                                                            │
 * │     greet: () => console.log(this.name)  // ✗ BAD                           │
 * │   };                                                                        │
 * │                                                                             │
 * │                                                                             │
 * │   2. PROTOTYPE METHODS:                                                     │
 * │   ──────────────────────────────────────────────────────────────────        │
 * │                                                                             │
 * │   Person.prototype.greet = () => {...}   // ✗ BAD                           │
 * │                                                                             │
 * │                                                                             │
 * │   3. CONSTRUCTORS:                                                          │
 * │   ──────────────────────────────────────────────────────────────────        │
 * │                                                                             │
 * │   const Person = (name) => { this.name = name; }                            │
 * │   new Person('Alice');  // ✗ TypeError: Person is not a constructor         │
 * │                                                                             │
 * │                                                                             │
 * │   4. EVENT HANDLERS (when you need event target):                           │
 * │   ──────────────────────────────────────────────────────────────────        │
 * │                                                                             │
 * │   button.addEventListener('click', () => {                                  │
 * │     console.log(this);  // ✗ Not the button!                                │
 * │   });                                                                       │
 * │                                                                             │
 * └─────────────────────────────────────────────────────────────────────────────┘
 */

// Bad: Arrow as object method
const badObj = {
  name: 'BadObj',
  greet: () => {
    console.log(`  Hello, ${this.name}`);  // this.name is undefined
  }
};

console.log('G: Arrow as object method (BAD):');
badObj.greet();  // Hello, undefined

// Good: Regular function as object method
const goodObj = {
  name: 'GoodObj',
  greet() {
    console.log(`  Hello, ${this.name}`);
  }
};

console.log('H: Regular function as object method (GOOD):');
goodObj.greet();  // Hello, GoodObj

// Cannot use as constructor
console.log('\nI: Arrow functions cannot be constructors:');
const ArrowClass = () => {};
try {
  new ArrowClass();
} catch (e) {
  console.log('  Error:', e.message);  // ArrowClass is not a constructor
}


/**
 * ┌─────────────────────────────────────────────────────────────────────────────┐
 * │ INTERVIEW ANSWER                                                            │
 * ├─────────────────────────────────────────────────────────────────────────────┤
 * │                                                                             │
 * │ "Arrow functions don't have their own 'this' - they inherit it from the     │
 * │ enclosing lexical scope. This is called lexical binding.                    │
 * │                                                                             │
 * │ Key differences from regular functions:                                     │
 * │ • 'this' determined by WHERE defined, not HOW called                        │
 * │ • Cannot change 'this' with call/apply/bind                                 │
 * │ • Cannot be used as constructors (no 'new')                                 │
 * │ • No 'arguments' object                                                     │
 * │                                                                             │
 * │ Main use case: Callbacks and closures that need to preserve 'this':         │
 * │   setTimeout(() => this.doSomething(), 1000);                               │
 * │   array.map(item => this.transform(item));                                  │
 * │                                                                             │
 * │ Avoid arrow functions for:                                                  │
 * │ • Object methods that need their own 'this'                                 │
 * │ • Prototype methods                                                         │
 * │ • Constructors                                                              │
 * │ • Event handlers when you need the target element                           │
 * │                                                                             │
 * │ The general rule: use arrow functions for callbacks, regular functions      │
 * │ for methods."                                                               │
 * │                                                                             │
 * └─────────────────────────────────────────────────────────────────────────────┘
 *
 *
 * RUN: node docs/21-this-binding/02-arrow-functions-this.js
 */
