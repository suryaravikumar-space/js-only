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
 * ┌────────────────────────────────────────────────────────────────┐
 * │ INTERVIEW ANSWER                                              │
 * ├────────────────────────────────────────────────────────────────┤
 * │                                                                │
 * │ "`this` is the third component of every Execution Context.    │
 * │  Unlike Variable Environment and Scope Chain which are set    │
 * │  at creation time, `this` is determined at CALL time based    │
 * │  on how the function is invoked:                              │
 * │                                                                │
 * │  - Standalone call: this = global (or undefined in strict)    │
 * │  - Method call: this = object before the dot                  │
 * │  - call/apply/bind: this = explicitly specified object        │
 * │  - new keyword: this = newly created object"                  │
 * │                                                                │
 * └────────────────────────────────────────────────────────────────┘
 *
 *
 * RUN: node docs/01-execution-context/12-this-binding.js
 */
