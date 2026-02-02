/**
 * CHALLENGE 10: Ultimate Object Creation Challenge
 *
 * ╔════════════════════════════════════════════════════════════════════════════╗
 * ║ THE GOLDEN RULE                                                            ║
 * ╠════════════════════════════════════════════════════════════════════════════╣
 * ║                                                                            ║
 * ║ Master all object creation patterns:                                       ║
 * ║                                                                            ║
 * ║ 1. Object.create() - sets up prototype chain                               ║
 * ║ 2. Constructor functions - uses 'new' and 'this'                           ║
 * ║ 3. ES6 Classes - syntactic sugar over prototypes                           ║
 * ║ 4. Factory functions - returns objects, enables private state              ║
 * ║ 5. Object.assign / spread - shallow copies                                 ║
 * ║ 6. Getters - computed values, NOT copied by assign/spread!                 ║
 * ║                                                                            ║
 * ╚════════════════════════════════════════════════════════════════════════════╝
 */

// Challenge 1: Prototype chain
var animal = { eats: true };
var rabbit = Object.create(animal);
rabbit.jumps = true;

var whiteRabbit = Object.create(rabbit);
whiteRabbit.color = 'white';

console.log('A:', whiteRabbit.eats);
console.log('B:', whiteRabbit.hasOwnProperty('eats'));

// Challenge 2: Constructor vs class
function PersonFn(name) {
  this.name = name;
}
PersonFn.prototype.greet = function() {
  return 'Hi, ' + this.name;
};

class PersonClass {
  constructor(name) {
    this.name = name;
  }
  greet() {
    return 'Hi, ' + this.name;
  }
}

var p1 = new PersonFn('Alice');
var p2 = new PersonClass('Bob');

console.log('C:', typeof PersonFn.prototype.greet);
console.log('D:', typeof PersonClass.prototype.greet);

// Challenge 3: Object.assign vs spread with getters
var source = {
  _value: 10,
  get value() {
    return this._value * 2;
  }
};

var assigned = Object.assign({}, source);
var spread = { ...source };

console.log('E:', assigned.value);
console.log('F:', typeof Object.getOwnPropertyDescriptor(spread, 'value').get);

// Challenge 4: Factory with private state
var createStack = function() {
  var items = [];
  return {
    push(item) { items.push(item); },
    pop() { return items.pop(); },
    get length() { return items.length; }
  };
};

var stack = createStack();
stack.push(1);
stack.push(2);
stack.push(3);
stack.pop();

console.log('G:', stack.length);

/**
 * OUTPUT:
 *   A: true
 *   B: false
 *   C: function
 *   D: function
 *   E: 20
 *   F: undefined
 *   G: 2
 *
 *
 * ╔════════════════════════════════════════════════════════════════════════════╗
 * ║ STEP-BY-STEP BREAKDOWN                                                     ║
 * ╠════════════════════════════════════════════════════════════════════════════╣
 * ║                                                                            ║
 * ║ A & B: Prototype chain lookup                                              ║
 * ║ ─────────────────────────────                                              ║
 * ║   whiteRabbit → rabbit → animal → Object.prototype                         ║
 * ║   whiteRabbit.eats: finds 'eats' on animal → true                          ║
 * ║   hasOwnProperty('eats'): checks OWN props only → false                    ║
 * ║                                                                            ║
 * ║                                                                            ║
 * ║ C & D: Constructor and class are equivalent                                ║
 * ║ ──────────────────────────────────────────────                             ║
 * ║   Both put greet() on prototype                                            ║
 * ║   typeof PersonFn.prototype.greet → 'function'                             ║
 * ║   typeof PersonClass.prototype.greet → 'function'                          ║
 * ║                                                                            ║
 * ║                                                                            ║
 * ║ E & F: TRICKY! Getters become values when copied                           ║
 * ║ ───────────────────────────────────────────────                            ║
 * ║   Object.assign/spread EVALUATE getters!                                   ║
 * ║   source.value (getter) returns 20                                         ║
 * ║   assigned.value = 20 (plain value, not getter!)                           ║
 * ║   spread.value = 20 (also plain value)                                     ║
 * ║   getOwnPropertyDescriptor(spread, 'value').get → undefined                ║
 * ║                                                                            ║
 * ║                                                                            ║
 * ║ G: Factory with closure                                                    ║
 * ║ ─────────────────────────                                                  ║
 * ║   items = [] is private (in closure)                                       ║
 * ║   push(1), push(2), push(3) → items = [1, 2, 3]                            ║
 * ║   pop() removes 3 → items = [1, 2]                                         ║
 * ║   stack.length (getter) → 2                                                ║
 * ║                                                                            ║
 * ╚════════════════════════════════════════════════════════════════════════════╝
 *
 *
 * ┌─────────────────────────────────────────────────────────────────────────────┐
 * │ INTERVIEW CHEAT SHEET                                                       │
 * ├─────────────────────────────────────────────────────────────────────────────┤
 * │                                                                             │
 * │   ┌──────────────────┬───────────────────────────────────────────────┐      │
 * │   │ Pattern          │ When to Use                                   │      │
 * │   ├──────────────────┼───────────────────────────────────────────────┤      │
 * │   │ Object literal   │ Simple one-off objects                        │      │
 * │   │ Factory function │ Private state, no 'this' issues               │      │
 * │   │ Constructor/new  │ instanceof checks, prototype methods          │      │
 * │   │ Class            │ Clean syntax, inheritance, static methods     │      │
 * │   │ Object.create    │ Direct prototype setup, Object.create(null)   │      │
 * │   │ Spread/assign    │ Shallow cloning, merging                      │      │
 * │   └──────────────────┴───────────────────────────────────────────────┘      │
 * │                                                                             │
 * │   KEY GOTCHAS:                                                              │
 * │   - assign/spread copy getter VALUES, not the getters themselves            │
 * │   - assign/spread are SHALLOW (nested objects shared)                       │
 * │   - hasOwnProperty only checks own props, not prototype                     │
 * │   - 'in' operator checks prototype chain                                    │
 * │                                                                             │
 * └─────────────────────────────────────────────────────────────────────────────┘
 *
 *
 * RUN: node docs/06-objects-creation/10-ultimate-creation-challenge.js
 */
