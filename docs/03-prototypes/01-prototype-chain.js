/**
 * CHALLENGE 01: Prototype Chain Lookup
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
 */

var grandparent = {
  surname: 'Smith',
  getSurname: function() {
    return this.surname;
  }
};

var parent = Object.create(grandparent);
parent.firstName = 'John';

var child = Object.create(parent);
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
 * │ INTERVIEW ANSWER                                                            │
 * ├─────────────────────────────────────────────────────────────────────────────┤
 * │                                                                             │
 * │ "When accessing a property on an object, JavaScript performs a lookup       │
 * │  that traverses the entire prototype chain. It first checks the object      │
 * │  itself, then its prototype, then that prototype's prototype, and so on     │
 * │  until it finds the property or reaches null.                               │
 * │                                                                             │
 * │  In this example, child.surname travels through child → parent →            │
 * │  grandparent before finding 'Smith'. The method getSurname() is also        │
 * │  found through this chain, but when called, 'this' refers to child          │
 * │  (the object before the dot), and this.surname again travels the chain.     │
 * │                                                                             │
 * │  Object.create() is the cleanest way to set up prototype chains.            │
 * │  It creates a new object with the specified prototype without needing       │
 * │  constructor functions.                                                     │
 * │                                                                             │
 * │  hasOwnProperty is essential for checking if a property belongs to          │
 * │  the object itself versus being inherited from the prototype chain."        │
 * │                                                                             │
 * └─────────────────────────────────────────────────────────────────────────────┘
 *
 *
 * RUN: node docs/03-prototypes/01-prototype-chain.js
 */
