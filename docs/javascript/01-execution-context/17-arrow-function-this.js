/**
 * TOPIC: Arrow Functions and this Binding
 *
 * CONCEPT:
 * Arrow functions have a fundamentally different `this` behavior
 * compared to regular functions. This is the most important
 * distinction between arrow and regular functions.
 *
 * ╔════════════════════════════════════════════════════════════════╗
 * ║ THE GOLDEN RULE                                                ║
 * ╠════════════════════════════════════════════════════════════════╣
 * ║                                                                ║
 * ║  Regular function: `this` determined at CALL time             ║
 * ║  Arrow function:   `this` determined at DEFINITION time       ║
 * ║                                                                ║
 * ║  Arrow functions do NOT have their own `this`.                ║
 * ║  They INHERIT `this` from the enclosing SCOPE.                ║
 * ║                                                                ║
 * ╚════════════════════════════════════════════════════════════════╝
 */

var name = 'Global'; // ES6: use `const` (var used here to demonstrate global `this` binding behavior)

var person = { // ES6: use `const`
  name: 'John',
  regularMethod: function() {
    console.log(this.name);
  },
  arrowMethod: () => {
    console.log(this.name);
  }
};

person.regularMethod();
person.arrowMethod();

/**
 * OUTPUT (Node.js):
 *   John
 *   undefined
 *
 * OUTPUT (Browser):
 *   John
 *   Global
 *
 *
 * ╔════════════════════════════════════════════════════════════════╗
 * ║ CRITICAL INSIGHT: OBJECT LITERALS ARE NOT SCOPES!             ║
 * ╠════════════════════════════════════════════════════════════════╣
 * ║                                                                ║
 * ║ This is where most people get confused.                       ║
 * ║                                                                ║
 * ║ The `{ }` in an object literal does NOT create a new scope.   ║
 * ║ It's just syntax for creating an object.                      ║
 * ║                                                                ║
 * ║ So when arrowMethod is defined:                               ║
 * ║   - It looks for its parent SCOPE (not parent object!)        ║
 * ║   - The parent scope is GLOBAL, not person                    ║
 * ║   - Arrow function inherits global's `this`                   ║
 * ║                                                                ║
 * ╚════════════════════════════════════════════════════════════════╝
 *
 *
 * ┌────────────────────────────────────────────────────────────────┐
 * │ VISUAL: WHERE ARE FUNCTIONS DEFINED?                          │
 * ├────────────────────────────────────────────────────────────────┤
 * │                                                                │
 * │ ┌─────────────────────────────────────────────────────────┐   │
 * │ │ GLOBAL SCOPE                                            │   │
 * │ │                                                         │   │
 * │ │   var name = 'Global';                                  │   │
 * │ │                                                         │   │
 * │ │   var person = {        ← Object (NOT a scope!)         │   │
 * │ │     name: 'John',                                       │   │
 * │ │                                                         │   │
 * │ │     regularMethod: function() {                         │   │
 * │ │       // this = determined when CALLED                  │   │
 * │ │       // person.regularMethod() → this = person         │   │
 * │ │     },                                                  │   │
 * │ │                                                         │   │
 * │ │     arrowMethod: () => {                                │   │
 * │ │       // this = inherited from SCOPE where defined      │   │
 * │ │       // Defined in GLOBAL → this = global object       │   │
 * │ │     }                                                   │   │
 * │ │   };                                                    │   │
 * │ │                                                         │   │
 * │ └─────────────────────────────────────────────────────────┘   │
 * │                                                                │
 * │ Arrow function's parent SCOPE is global, not person!          │
 * │                                                                │
 * └────────────────────────────────────────────────────────────────┘
 *
 *
 * ┌────────────────────────────────────────────────────────────────┐
 * │ STEP-BY-STEP ANALYSIS                                         │
 * ├────────────────────────────────────────────────────────────────┤
 * │                                                                │
 * │ 1. person.regularMethod() is called                           │
 * │                                                                │
 * │    Regular function `this` rule:                              │
 * │    → Look at what's before the dot: `person`                  │
 * │    → this = person                                            │
 * │    → this.name = person.name = "John"                         │
 * │    → Output: "John"                                           │
 * │                                                                │
 * │                                                                │
 * │ 2. person.arrowMethod() is called                             │
 * │                                                                │
 * │    Arrow function `this` rule:                                │
 * │    → Ignore the call site (person.arrowMethod)                │
 * │    → Look at WHERE arrowMethod was DEFINED                    │
 * │    → Defined inside object literal at global level            │
 * │    → Object literals don't create scope                       │
 * │    → Parent scope = global                                    │
 * │    → this = global's this                                     │
 * │                                                                │
 * │    In Node.js:                                                │
 * │    → Top-level `this` = {} (module.exports)                   │
 * │    → {}.name = undefined                                      │
 * │                                                                │
 * │    In Browser:                                                │
 * │    → Top-level `this` = window                                │
 * │    → var name creates window.name = "Global"                  │
 * │    → this.name = "Global"                                     │
 * │                                                                │
 * └────────────────────────────────────────────────────────────────┘
 *
 *
 * ┌────────────────────────────────────────────────────────────────┐
 * │ NODE.JS vs BROWSER DIFFERENCE                                 │
 * ├────────────────────────────────────────────────────────────────┤
 * │                                                                │
 * │ BROWSER:                                                      │
 * │   - Top-level `this` = window                                 │
 * │   - `var name = 'Global'` creates window.name                 │
 * │   - Arrow function's this.name = "Global"                     │
 * │                                                                │
 * │ NODE.JS:                                                      │
 * │   - Top-level `this` = module.exports = {}                    │
 * │   - `var name = 'Global'` is module-scoped, NOT on `this`     │
 * │   - Arrow function's this.name = undefined                    │
 * │                                                                │
 * │ This is why output differs!                                   │
 * │                                                                │
 * └────────────────────────────────────────────────────────────────┘
 *
 *
 * ┌────────────────────────────────────────────────────────────────┐
 * │ COMMON CONFUSION: "Object is the parent"                      │
 * ├────────────────────────────────────────────────────────────────┤
 * │                                                                │
 * │ WRONG THINKING:                                               │
 * │   "arrowMethod is inside person object, so its parent is      │
 * │    person, so this = person"                                  │
 * │                                                                │
 * │ CORRECT THINKING:                                             │
 * │   "Object literals { } are NOT scopes. Arrow functions        │
 * │    inherit `this` from the enclosing SCOPE, not the           │
 * │    enclosing object. The enclosing scope is global."          │
 * │                                                                │
 * │ REMEMBER:                                                     │
 * │   - Scopes: function, block, module, global                   │
 * │   - NOT scopes: object literals { }                           │
 * │                                                                │
 * └────────────────────────────────────────────────────────────────┘
 *
 *
 * ┌────────────────────────────────────────────────────────────────┐
 * │ WHEN ARROW FUNCTIONS ARE USEFUL                               │
 * ├────────────────────────────────────────────────────────────────┤
 * │                                                                │
 * │ Arrow functions inherit `this` — this is a FEATURE!           │
 * │                                                                │
 * │ EXAMPLE: Callbacks inside methods                             │
 * │                                                                │
 * │   var person = {                                              │
 * │     name: 'John',                                             │
 * │     greetLater: function() {                                  │
 * │       // 'this' here = person                                 │
 * │                                                                │
 * │       setTimeout(() => {                                      │
 * │         // Arrow inherits 'this' from greetLater              │
 * │         // So 'this' = person                                 │
 * │         console.log('Hello, ' + this.name);                   │
 * │       }, 1000);                                               │
 * │     }                                                         │
 * │   };                                                          │
 * │                                                                │
 * │   person.greetLater();  // After 1s: "Hello, John"            │
 * │                                                                │
 * │ Without arrow function, you'd need:                           │
 * │   - var self = this; (old pattern)                            │
 * │   - .bind(this)                                               │
 * │                                                                │
 * └────────────────────────────────────────────────────────────────┘
 *
 *
 * ┌────────────────────────────────────────────────────────────────┐
 * │ COMPARISON TABLE                                              │
 * ├──────────────────────┬─────────────────────────────────────────┤
 * │ Aspect               │ Regular Function   │ Arrow Function    │
 * ├──────────────────────┼────────────────────┼───────────────────┤
 * │ `this` determined    │ At CALL time       │ At DEFINITION     │
 * │ `this` value         │ Object before dot  │ Inherited scope   │
 * │ Can use as method?   │ Yes                │ Avoid (loses obj) │
 * │ Can use as callback? │ Need bind/self     │ Yes (inherits)    │
 * │ obj.method()         │ this = obj         │ this = parent     │
 * │ Has own `this`?      │ Yes                │ No                │
 * │ Has `arguments`?     │ Yes                │ No                │
 * └──────────────────────┴────────────────────┴───────────────────┘
 *
 *
 * ┌────────────────────────────────────────────────────────────────┐
 * │ WHEN TO USE WHICH                                             │
 * ├────────────────────────────────────────────────────────────────┤
 * │                                                                │
 * │ USE REGULAR FUNCTION:                                         │
 * │   - Object methods (you want `this` to be the object)         │
 * │   - Constructors (new keyword)                                │
 * │   - When you need `arguments` object                          │
 * │                                                                │
 * │ USE ARROW FUNCTION:                                           │
 * │   - Callbacks inside methods (setTimeout, map, filter, etc.)  │
 * │   - When you want to preserve parent's `this`                 │
 * │   - Short one-liner functions                                 │
 * │   - Event handlers where you need parent's `this`             │
 * │                                                                │
 * └────────────────────────────────────────────────────────────────┘
 *
 *
 * ┌────────────────────────────────────────────────────────────────┐
 * │ SUMMARY: this BINDING RULES (COMPLETE)                        │
 * ├─────────────────────┬──────────────────────────────────────────┤
 * │ Call Pattern        │ this =                                  │
 * ├─────────────────────┼──────────────────────────────────────────┤
 * │ func() non-strict   │ global object (window/global)           │
 * │ func() strict       │ undefined                               │
 * │ obj.func()          │ obj (object before the dot)             │
 * │ func.call(obj)      │ obj (explicitly set)                    │
 * │ func.apply(obj)     │ obj (explicitly set)                    │
 * │ func.bind(obj)()    │ obj (permanently bound)                 │
 * │ new func()          │ new empty object                        │
 * │ arrow function      │ inherits from parent SCOPE (lexical)    │
 * └─────────────────────┴──────────────────────────────────────────┘
 *
 *
 * INTERVIEW QUESTIONS:
 *
 * Q: "Why does an arrow function used as an object method not get the object as `this`?"
 * A: regularMethod prints 'John' because regular functions determine `this` at call
 *    time -- since it's called as person.regularMethod(), `this` is person.
 *    arrowMethod prints undefined (Node.js) or 'Global' (browser) because arrow
 *    functions inherit `this` from the lexical scope where they're defined. Object
 *    literals don't create scope, so the parent scope is global, not person. This
 *    is a key reason why arrow functions shouldn't be used as object methods -- they
 *    lose the object reference. But they're perfect for callbacks inside methods
 *    where you want to preserve the outer `this`.
 *
 *
 * ES6 NOTE: Arrow functions (=>) are themselves an ES6 feature. They lexically
 *           bind `this`, replacing the old `var self = this` and `.bind(this)` patterns.
 *           Use `const` instead of `var` for object declarations.
 *
 * RUN: node docs/javascript/01-execution-context/17-arrow-function-this.js
 */
