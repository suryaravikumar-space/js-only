/**
 * THIS BINDING: 09 - Interview Questions & Answers
 *
 * ╔════════════════════════════════════════════════════════════════════════════╗
 * ║ COMPLETE INTERVIEW GUIDE - "this" in JavaScript                            ║
 * ╠════════════════════════════════════════════════════════════════════════════╣
 * ║                                                                            ║
 * ║ Everything you need to know about "this" for interviews                    ║
 * ║                                                                            ║
 * ╚════════════════════════════════════════════════════════════════════════════╝
 */


// ═══════════════════════════════════════════════════════════════════════════════
// Q1: What is "this" in JavaScript?
// ═══════════════════════════════════════════════════════════════════════════════

/**
 * ┌─────────────────────────────────────────────────────────────────────────────┐
 * │ Q1: What is "this" and how is it determined?                                │
 * ├─────────────────────────────────────────────────────────────────────────────┤
 * │                                                                             │
 * │ ANSWER:                                                                     │
 * │                                                                             │
 * │ "this" is a special keyword that refers to the execution context.           │
 * │ It's determined by HOW a function is CALLED, not where it's defined.        │
 * │                                                                             │
 * │ 4 RULES (in priority order):                                                │
 * │                                                                             │
 * │ 1. new binding:  new Fn() → this = new object                               │
 * │ 2. Explicit:     fn.call(obj) → this = obj                                  │
 * │ 3. Implicit:     obj.fn() → this = obj                                      │
 * │ 4. Default:      fn() → this = global (undefined in strict)                 │
 * │                                                                             │
 * │ Exception: Arrow functions inherit "this" from enclosing scope              │
 * │                                                                             │
 * └─────────────────────────────────────────────────────────────────────────────┘
 */


// ═══════════════════════════════════════════════════════════════════════════════
// Q2: Difference between call, apply, bind
// ═══════════════════════════════════════════════════════════════════════════════

/**
 * ┌─────────────────────────────────────────────────────────────────────────────┐
 * │ Q2: What's the difference between call(), apply(), and bind()?              │
 * ├─────────────────────────────────────────────────────────────────────────────┤
 * │                                                                             │
 * │ ANSWER:                                                                     │
 * │                                                                             │
 * │ All three set "this" explicitly:                                            │
 * │                                                                             │
 * │ call(thisArg, arg1, arg2):                                                  │
 * │ • Invokes immediately                                                       │
 * │ • Arguments as comma-separated list                                         │
 * │                                                                             │
 * │ apply(thisArg, [arg1, arg2]):                                               │
 * │ • Invokes immediately                                                       │
 * │ • Arguments as array                                                        │
 * │ • Mnemonic: A = Array                                                       │
 * │                                                                             │
 * │ bind(thisArg, arg1, arg2):                                                  │
 * │ • Returns NEW function (doesn't invoke)                                     │
 * │ • "this" is permanently fixed                                               │
 * │ • Can pre-fill arguments (partial application)                              │
 * │                                                                             │
 * │ EXAMPLE:                                                                    │
 * │ fn.call(obj, 1, 2)    // Runs immediately                                   │
 * │ fn.apply(obj, [1, 2]) // Runs immediately, args in array                    │
 * │ fn.bind(obj, 1)(2)    // Returns function, then call it                     │
 * │                                                                             │
 * └─────────────────────────────────────────────────────────────────────────────┘
 */


// ═══════════════════════════════════════════════════════════════════════════════
// Q3: Arrow functions and "this"
// ═══════════════════════════════════════════════════════════════════════════════

/**
 * ┌─────────────────────────────────────────────────────────────────────────────┐
 * │ Q3: How do arrow functions handle "this"?                                   │
 * ├─────────────────────────────────────────────────────────────────────────────┤
 * │                                                                             │
 * │ ANSWER:                                                                     │
 * │                                                                             │
 * │ Arrow functions DON'T have their own "this".                                │
 * │ They inherit "this" from the enclosing lexical scope.                       │
 * │                                                                             │
 * │ KEY POINTS:                                                                 │
 * │ • "this" determined at DEFINITION time, not call time                       │
 * │ • Cannot change with call/apply/bind                                        │
 * │ • Cannot be used as constructors                                            │
 * │                                                                             │
 * │ WHEN TO USE:                                                                │
 * │ ✓ Callbacks that need parent's "this"                                       │
 * │ ✓ Array methods (map, filter, forEach)                                      │
 * │ ✓ setTimeout/setInterval                                                    │
 * │                                                                             │
 * │ WHEN NOT TO USE:                                                            │
 * │ ✗ Object methods                                                            │
 * │ ✗ Prototype methods                                                         │
 * │ ✗ Constructors                                                              │
 * │ ✗ Event handlers (if you need target element)                               │
 * │                                                                             │
 * └─────────────────────────────────────────────────────────────────────────────┘
 */


// ═══════════════════════════════════════════════════════════════════════════════
// Q4: Implement bind()
// ═══════════════════════════════════════════════════════════════════════════════

/**
 * ┌─────────────────────────────────────────────────────────────────────────────┐
 * │ Q4: Implement your own bind() function                                      │
 * ├─────────────────────────────────────────────────────────────────────────────┤
 * │                                                                             │
 * │ ANSWER:                                                                     │
 * │                                                                             │
 * │ Function.prototype.myBind = function(thisArg, ...boundArgs) {               │
 * │   const fn = this;                                                          │
 * │   return function(...callArgs) {                                            │
 * │     return fn.apply(thisArg, [...boundArgs, ...callArgs]);                  │
 * │   };                                                                        │
 * │ };                                                                          │
 * │                                                                             │
 * │ KEY POINTS:                                                                 │
 * │ • Capture original function (this)                                          │
 * │ • Return new function                                                       │
 * │ • Use apply to set context and spread args                                  │
 * │ • Merge bound args with call-time args                                      │
 * │                                                                             │
 * └─────────────────────────────────────────────────────────────────────────────┘
 */

Function.prototype.myBind = function(thisArg, ...boundArgs) {
  const fn = this;
  return function(...callArgs) {
    return fn.apply(thisArg, [...boundArgs, ...callArgs]);
  };
};

// Test
function greet(greeting, punctuation) {
  return `${greeting}, ${this.name}${punctuation}`;
}
const person = { name: 'Alice' };
const boundGreet = greet.myBind(person, 'Hello');
console.log('Q4 Test:', boundGreet('!'));  // Hello, Alice!


// ═══════════════════════════════════════════════════════════════════════════════
// Q5: What's the output? (Common interview question)
// ═══════════════════════════════════════════════════════════════════════════════

/**
 * ┌─────────────────────────────────────────────────────────────────────────────┐
 * │ Q5: What's the output of this code?                                         │
 * ├─────────────────────────────────────────────────────────────────────────────┤
 * │                                                                             │
 * │ const obj = {                                                               │
 * │   name: 'Object',                                                           │
 * │   getName: function() {                                                     │
 * │     return this.name;                                                       │
 * │   },                                                                        │
 * │   getNameArrow: () => {                                                     │
 * │     return this.name;                                                       │
 * │   }                                                                         │
 * │ };                                                                          │
 * │                                                                             │
 * │ console.log(obj.getName());                                                 │
 * │ console.log(obj.getNameArrow());                                            │
 * │                                                                             │
 * │ const { getName, getNameArrow } = obj;                                      │
 * │ console.log(getName());                                                     │
 * │ console.log(getNameArrow());                                                │
 * │                                                                             │
 * │                                                                             │
 * │ ANSWER:                                                                     │
 * │                                                                             │
 * │ obj.getName()        → "Object"  (implicit binding)                         │
 * │ obj.getNameArrow()   → undefined (arrow inherits outer this)                │
 * │ getName()            → undefined (default binding)                          │
 * │ getNameArrow()       → undefined (still outer this)                         │
 * │                                                                             │
 * └─────────────────────────────────────────────────────────────────────────────┘
 */

const obj = {
  name: 'Object',
  getName: function() { return this.name; },
  getNameArrow: () => { return this.name; }
};

console.log('\nQ5 Test:');
console.log('obj.getName():', obj.getName());          // Object
console.log('obj.getNameArrow():', obj.getNameArrow()); // undefined

const { getName, getNameArrow } = obj;
console.log('getName():', getName());                  // undefined
console.log('getNameArrow():', getNameArrow());        // undefined


// ═══════════════════════════════════════════════════════════════════════════════
// Q6: How to fix "this" in callbacks?
// ═══════════════════════════════════════════════════════════════════════════════

/**
 * ┌─────────────────────────────────────────────────────────────────────────────┐
 * │ Q6: How do you preserve "this" in callbacks?                                │
 * ├─────────────────────────────────────────────────────────────────────────────┤
 * │                                                                             │
 * │ ANSWER: Three solutions                                                     │
 * │                                                                             │
 * │ 1. BIND:                                                                    │
 * │    setTimeout(this.method.bind(this), 1000);                                │
 * │                                                                             │
 * │ 2. ARROW FUNCTION:                                                          │
 * │    setTimeout(() => this.method(), 1000);                                   │
 * │                                                                             │
 * │ 3. SAVE "this" TO VARIABLE:                                                 │
 * │    const self = this;                                                       │
 * │    setTimeout(function() { self.method(); }, 1000);                         │
 * │                                                                             │
 * │ For class methods:                                                          │
 * │ • Bind in constructor                                                       │
 * │ • Use arrow function class field                                            │
 * │                                                                             │
 * └─────────────────────────────────────────────────────────────────────────────┘
 */


// ═══════════════════════════════════════════════════════════════════════════════
// CHEAT SHEET
// ═══════════════════════════════════════════════════════════════════════════════

/**
 * ╔════════════════════════════════════════════════════════════════════════════╗
 * ║                        "this" INTERVIEW CHEAT SHEET                        ║
 * ╠════════════════════════════════════════════════════════════════════════════╣
 * ║                                                                            ║
 * ║  THE 4 BINDING RULES (in priority order):                                  ║
 * ║  ──────────────────────────────────────────────────────────────────        ║
 * ║  1. new fn()          → this = new object                                  ║
 * ║  2. call/apply/bind   → this = specified object                            ║
 * ║  3. obj.fn()          → this = obj                                         ║
 * ║  4. fn()              → this = global (undefined in strict)                ║
 * ║                                                                            ║
 * ║                                                                            ║
 * ║  ARROW FUNCTIONS:                                                          ║
 * ║  ──────────────────────────────────────────────────────────────────        ║
 * ║  • NO own "this" - inherits from enclosing scope                           ║
 * ║  • Cannot change with call/apply/bind                                      ║
 * ║  • Cannot be constructors                                                  ║
 * ║  • Use for callbacks, NOT for methods                                      ║
 * ║                                                                            ║
 * ║                                                                            ║
 * ║  call vs apply vs bind:                                                    ║
 * ║  ──────────────────────────────────────────────────────────────────        ║
 * ║  call(obj, a, b)    → Invoke now, args as list                             ║
 * ║  apply(obj, [a,b])  → Invoke now, args as array                            ║
 * ║  bind(obj, a, b)    → Return function, invoke later                        ║
 * ║                                                                            ║
 * ║                                                                            ║
 * ║  COMMON GOTCHAS:                                                           ║
 * ║  ──────────────────────────────────────────────────────────────────        ║
 * ║  • Extracted method: const fn = obj.method; fn() → loses binding           ║
 * ║  • setTimeout: Regular callback → global "this"                            ║
 * ║  • Array methods: Use arrow or pass thisArg                                ║
 * ║  • Event handlers: "this" is element, not your object                      ║
 * ║  • Nested functions: Regular loses context, arrow keeps it                 ║
 * ║                                                                            ║
 * ║                                                                            ║
 * ║  QUICK FIXES:                                                              ║
 * ║  ──────────────────────────────────────────────────────────────────        ║
 * ║  • .bind(this) on callbacks                                                ║
 * ║  • Arrow functions for callbacks                                           ║
 * ║  • const self = this; (old pattern)                                        ║
 * ║  • Arrow class fields                                                      ║
 * ║                                                                            ║
 * ╚════════════════════════════════════════════════════════════════════════════╝
 *
 *
 * RUN: node docs/21-this-binding/09-interview-qa.js
 */

console.log('\n=== Interview Q&A Complete ===');
console.log('Review the detailed answers in the comments above');
