/**
 * TOPIC: Prototype Chain Lookup
 *
 * ╔════════════════════════════════════════════════════════════════════════════╗
 * ║ THE GOLDEN RULE                                                            ║
 * ╠════════════════════════════════════════════════════════════════════════════╣
 * ║                                                                            ║
 * ║ Property lookup traverses the ENTIRE prototype chain.                      ║
 * ║                                                                            ║
 * ║   child → parent → grandparent → Object.prototype → null                   ║
 * ║                                                                            ║
 * ║ First match wins. If not found anywhere, returns undefined.                ║
 * ║                                                                            ║
 * ╚════════════════════════════════════════════════════════════════════════════╝
 *
 * STORY: Imagine a family tree where each generation passes down traditions.
 * A grandchild asks "What's our surname?" — they don't know it themselves,
 * so they ask their parent, who also doesn't know, so they ask the grandparent
 * who says "Smith!" That's exactly how the prototype chain works — JavaScript
 * keeps asking up the chain until someone has the answer.
 */

const grandparent = { // ES6: const
  surname: 'Smith',
  getSurname() {
    return this.surname;
  }
};

const parent = Object.create(grandparent); // ES6: const
parent.firstName = 'John';

const child = Object.create(parent); // ES6: const
child.age = 10;

console.log('A:', child.age);
console.log('B:', child.firstName);
console.log('C:', child.surname);
console.log('D:', child.getSurname());
console.log('E:', child.hasOwnProperty('surname'));

/**
 * OUTPUT:
 *   A: 10
 *   B: John
 *   C: Smith
 *   D: Smith
 *   E: false
 *
 *
 * ╔════════════════════════════════════════════════════════════════════════════╗
 * ║ STEP-BY-STEP BREAKDOWN                                                     ║
 * ╠════════════════════════════════════════════════════════════════════════════╣
 * ║                                                                            ║
 * ║ A: child.age                                                               ║
 * ║ ────────────                                                               ║
 * ║   • Check child → found 'age: 10'                                          ║
 * ║   • Returns 10                                                             ║
 * ║                                                                            ║
 * ║                                                                            ║
 * ║ B: child.firstName                                                         ║
 * ║ ──────────────────                                                         ║
 * ║   • Check child → not found                                                ║
 * ║   • Check parent → found 'firstName: John'                                 ║
 * ║   • Returns 'John'                                                         ║
 * ║                                                                            ║
 * ║                                                                            ║
 * ║ C: child.surname                                                           ║
 * ║ ────────────────                                                           ║
 * ║   • Check child → not found                                                ║
 * ║   • Check parent → not found                                               ║
 * ║   • Check grandparent → found 'surname: Smith'                             ║
 * ║   • Returns 'Smith'                                                        ║
 * ║                                                                            ║
 * ║                                                                            ║
 * ║ D: child.getSurname()                                                      ║
 * ║ ─────────────────────                                                      ║
 * ║   • Check child → not found                                                ║
 * ║   • Check parent → not found                                               ║
 * ║   • Check grandparent → found getSurname function                          ║
 * ║   • Call it with this = child                                              ║
 * ║   • Inside: return this.surname                                            ║
 * ║   • this.surname looks up chain → finds 'Smith'                            ║
 * ║   • Returns 'Smith'                                                        ║
 * ║                                                                            ║
 * ║                                                                            ║
 * ║ E: child.hasOwnProperty('surname')                                         ║
 * ║ ────────────────────────────────────                                       ║
 * ║   • hasOwnProperty checks ONLY child                                       ║
 * ║   • 'surname' is on grandparent, not child                                 ║
 * ║   • Returns false                                                          ║
 * ║                                                                            ║
 * ╚════════════════════════════════════════════════════════════════════════════╝
 *
 *
 * ┌─────────────────────────────────────────────────────────────────────────────┐
 * │ VISUAL: The Prototype Chain                                                 │
 * ├─────────────────────────────────────────────────────────────────────────────┤
 * │                                                                             │
 * │   child.surname lookup:                                                     │
 * │                                                                             │
 * │   ┌─────────────────┐                                                       │
 * │   │  child          │ ← 1. Check here first                                 │
 * │   │  age: 10        │    surname? NO                                        │
 * │   │  __proto__ ─────┼───┐                                                   │
 * │   └─────────────────┘   │                                                   │
 * │                         ▼                                                   │
 * │   ┌─────────────────┐                                                       │
 * │   │  parent         │ ← 2. Check here                                       │
 * │   │  firstName: John│    surname? NO                                        │
 * │   │  __proto__ ─────┼───┐                                                   │
 * │   └─────────────────┘   │                                                   │
 * │                         ▼                                                   │
 * │   ┌─────────────────────────────┐                                           │
 * │   │  grandparent                │ ← 3. Check here                           │
 * │   │  surname: 'Smith' ◄─────────┼── FOUND! Return 'Smith'                   │
 * │   │  getSurname: function       │                                           │
 * │   │  __proto__ ─────────────────┼───┐                                       │
 * │   └─────────────────────────────┘   │                                       │
 * │                                     ▼                                       │
 * │   ┌─────────────────────────────┐                                           │
 * │   │  Object.prototype           │ ← 4. Would check here if not found        │
 * │   │  __proto__ → null           │                                           │
 * │   └─────────────────────────────┘                                           │
 * │                                                                             │
 * └─────────────────────────────────────────────────────────────────────────────┘
 *
 *
 * ┌─────────────────────────────────────────────────────────────────────────────┐
 * │ Object.create() EXPLAINED                                                   │
 * ├─────────────────────────────────────────────────────────────────────────────┤
 * │                                                                             │
 * │ Object.create(proto) creates a new object with:                             │
 * │   - Empty own properties                                                    │
 * │   - __proto__ set to the provided prototype                                 │
 * │                                                                             │
 * │ EXAMPLE:                                                                    │
 * │   var proto = { x: 10 };                                                    │
 * │   var obj = Object.create(proto);                                           │
 * │                                                                             │
 * │   obj.x;                    // 10 (from proto)                              │
 * │   obj.hasOwnProperty('x');  // false (not on obj itself)                    │
 * │   obj.__proto__ === proto;  // true                                         │
 * │                                                                             │
 * │                                                                             │
 * │ SPECIAL CASE - Object.create(null):                                         │
 * │   var bare = Object.create(null);                                           │
 * │   bare.toString;  // undefined (no Object.prototype!)                       │
 * │   // Creates a truly empty object with no prototype                         │
 * │                                                                             │
 * └─────────────────────────────────────────────────────────────────────────────┘
 *
 *
 * ┌─────────────────────────────────────────────────────────────────────────────┐
 * │ INTERVIEW QUESTIONS:                                                        │
 * ├─────────────────────────────────────────────────────────────────────────────┤
 * │                                                                             │
 * │ Q1: How does JavaScript's prototype chain work for property lookup?         │
 * │ A1: When accessing a property, JS checks the object itself first, then      │
 * │     its prototype, then that prototype's prototype, continuing up the       │
 * │     chain until the property is found or null is reached (returning         │
 * │     undefined). The first match wins.                                       │
 * │                                                                             │
 * │ Q2: What does `this` refer to when a method is found via the               │
 * │     prototype chain?                                                        │
 * │ A2: `this` refers to the object that called the method (the object before   │
 * │     the dot), NOT the object where the method is defined. So                │
 * │     child.getSurname() sets `this` to child, even though getSurname         │
 * │     lives on grandparent.                                                   │
 * │                                                                             │
 * │ Q3: What is Object.create() and how does it relate to prototype chains?     │
 * │ A3: Object.create(proto) creates a new empty object whose __proto__ is      │
 * │     set to the given prototype. It's the cleanest way to set up prototype   │
 * │     chains without constructor functions. Object.create(null) creates an    │
 * │     object with no prototype at all.                                        │
 * │                                                                             │
 * └─────────────────────────────────────────────────────────────────────────────┘
 *
 *
 * RUN: node docs/javascript/03-prototypes/01-prototype-chain.js
 */
