/**
 * TOPIC: this Binding — The 3rd Component of Execution Context
 *
 * CONTEXT:
 * Every Execution Context has 3 components:
 *   1. Variable Environment  — where variables are stored
 *   2. Lexical Environment   — scope chain (link to parent)
 *   3. this Binding          — what `this` refers to ← THIS TOPIC
 *
 * We are NOT deviating from Execution Context.
 * `this` is PART of every Execution Context.
 *
 *
 * ╔════════════════════════════════════════════════════════════════╗
 * ║ THE GOLDEN RULE OF this                                       ║
 * ╠════════════════════════════════════════════════════════════════╣
 * ║                                                                ║
 * ║  `this` is determined by HOW the function is CALLED,          ║
 * ║   not WHERE it is defined.                                    ║
 * ║                                                                ║
 * ╚════════════════════════════════════════════════════════════════╝
 */

var name = 'Global';

function sayName() {
  console.log(this.name);
}

var person = {
  name: 'John',
  sayName: sayName   // storing reference to the same function
};

sayName();           // "Global" or undefined (Node.js)
person.sayName();    // "John"

/**
 * OUTPUT (Browser):
 *   Global
 *   John
 *
 * OUTPUT (Node.js):
 *   undefined (var at global doesn't attach to global object)
 *   John
 *
 *
 * ┌────────────────────────────────────────────────────────────────┐
 * │ WHY DIFFERENT OUTPUT — SAME FUNCTION?                         │
 * ├────────────────────────────────────────────────────────────────┤
 * │                                                                │
 * │ The function is IDENTICAL. What changes is the CALL PATTERN.  │
 * │                                                                │
 * │ sayName()         → called standalone                         │
 * │                   → this = global object (window/global)      │
 * │                                                                │
 * │ person.sayName()  → called as method of person                │
 * │                   → this = person (object before the dot)     │
 * │                                                                │
 * └────────────────────────────────────────────────────────────────┘
 *
 *
 * ┌────────────────────────────────────────────────────────────────┐
 * │ this BINDING RULES (4 Rules)                                  │
 * ├─────────────────────┬──────────────────────────────────────────┤
 * │ Call Pattern        │ this =                                  │
 * ├─────────────────────┼──────────────────────────────────────────┤
 * │ func()              │ global (window/global) or undefined*    │
 * │ obj.func()          │ obj (object before the dot)             │
 * │ func.call(obj)      │ obj (explicitly set)                    │
 * │ new func()          │ new empty object                        │
 * └─────────────────────┴──────────────────────────────────────────┘
 *
 * *In strict mode ('use strict'), standalone call gives undefined
 *
 *
 * ╔════════════════════════════════════════════════════════════════╗
 * ║ EXECUTION CONTEXT VIEW                                        ║
 * ╠════════════════════════════════════════════════════════════════╣
 * ║                                                                ║
 * ║ When sayName() is called standalone:                          ║
 * ║ ┌────────────────────────────────────────────────────────┐    ║
 * ║ │ sayName() Execution Context                            │    ║
 * ║ │                                                        │    ║
 * ║ │ Variable Environment: { }                              │    ║
 * ║ │ Lexical Environment:  → Global                         │    ║
 * ║ │ this:                 global object                    │    ║
 * ║ └────────────────────────────────────────────────────────┘    ║
 * ║                                                                ║
 * ║ When person.sayName() is called:                              ║
 * ║ ┌────────────────────────────────────────────────────────┐    ║
 * ║ │ sayName() Execution Context                            │    ║
 * ║ │                                                        │    ║
 * ║ │ Variable Environment: { }                              │    ║
 * ║ │ Lexical Environment:  → Global                         │    ║
 * ║ │ this:                 person object                    │    ║
 * ║ └────────────────────────────────────────────────────────┘    ║
 * ║                                                                ║
 * ║ SAME function, DIFFERENT this binding!                        ║
 * ║                                                                ║
 * ╚════════════════════════════════════════════════════════════════╝
 *
 *
 * ┌────────────────────────────────────────────────────────────────┐
 * │ SYNTAX CLARIFICATION: sayName: sayName                        │
 * ├────────────────────────────────────────────────────────────────┤
 * │                                                                │
 * │ var person = {                                                │
 * │   name: 'John',                                               │
 * │   sayName: sayName    ← What is this?                         │
 * │ };                                                            │
 * │                                                                │
 * │ Left side:  sayName:  = property name (key)                   │
 * │ Right side: sayName   = the function defined above (value)    │
 * │                                                                │
 * │ It's storing a REFERENCE to the function, not calling it.     │
 * │                                                                │
 * │ Equivalent to:                                                │
 * │ var person = {                                                │
 * │   name: 'John',                                               │
 * │   sayName: function() { console.log(this.name); }             │
 * │ };                                                            │
 * │                                                                │
 * └────────────────────────────────────────────────────────────────┘
 *
 *
 * ┌────────────────────────────────────────────────────────────────┐
 * │ WHEN this BINDING IS DETERMINED                               │
 * ├────────────────────────────────────────────────────────────────┤
 * │                                                                │
 * │ Variable Environment  → Creation phase (hoisting)             │
 * │ Lexical Environment   → Creation phase (scope chain set)      │
 * │ this Binding          → CALL TIME (when function is invoked)  │
 * │                                                                │
 * │ this is the ONLY component determined at CALL time,           │
 * │ not at creation/definition time.                              │
 * │                                                                │
 * └────────────────────────────────────────────────────────────────┘
 *
 *
 * INTERVIEW QUESTIONS:
 *
 * Q: "How is `this` determined in JavaScript?"
 * A: `this` is determined by HOW the function is CALLED, not where it's defined.
 *    Four rules (in order of precedence):
 *    1. `new func()` → `this` = newly created object
 *    2. `func.call(obj)` / `.apply(obj)` / `.bind(obj)` → `this` = obj
 *    3. `obj.func()` → `this` = obj (implicit binding)
 *    4. `func()` → `this` = global object (or `undefined` in strict mode)
 *
 * Q: "How does `this` work in arrow functions?" (ES6)
 * A: Arrow functions do NOT have their own `this`. They inherit `this` from
 *    the enclosing lexical scope (where they are DEFINED). This is called
 *    "lexical this" and is one of the main reasons arrow functions were
 *    introduced in ES6 — to avoid the common bug of losing `this` in callbacks.
 *    Example: `const obj = { name: 'A', greet: () => console.log(this.name) };`
 *    `obj.greet()` does NOT log 'A' — the arrow function uses the outer `this`.
 *
 * Q: "What is `this` inside a Node.js module at the top level?"
 * A: In Node.js, top-level `this` inside a module is `module.exports` (an empty
 *    object `{}`), NOT the `global` object. This is because Node wraps every
 *    file in a module function. `var` at top level does NOT attach to `global`.
 *
 * ES6 NOTE:
 * With ES6 shorthand method syntax:
 *   const person = { name: 'John', sayName() { console.log(this.name); } };
 * This is equivalent to `sayName: function()` but shorter.
 *
 * RUN: node docs/javascript/01-execution-context/12-this-binding.js
 */
