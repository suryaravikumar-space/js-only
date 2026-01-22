/**
 * CHALLENGE 10: Ultimate Prototype Challenge
 *
 * ╔════════════════════════════════════════════════════════════════════════════╗
 * ║ THE FINAL TEST                                                             ║
 * ╠════════════════════════════════════════════════════════════════════════════╣
 * ║                                                                            ║
 * ║ This challenge combines ALL prototype concepts:                            ║
 * ║   • Constructor functions                                                  ║
 * ║   • Prototype chain                                                        ║
 * ║   • Inheritance                                                            ║
 * ║   • Method overriding                                                      ║
 * ║   • hasOwnProperty vs inherited                                            ║
 * ║   • instanceof                                                             ║
 * ║                                                                            ║
 * ╚════════════════════════════════════════════════════════════════════════════╝
 */

function Shape(color) {
  this.color = color;
}

Shape.prototype.getColor = function() {
  return this.color;
};

Shape.prototype.describe = function() {
  return 'A ' + this.color + ' shape';
};

function Rectangle(color, width, height) {
  Shape.call(this, color);
  this.width = width;
  this.height = height;
}

Rectangle.prototype = Object.create(Shape.prototype);
Rectangle.prototype.constructor = Rectangle;

Rectangle.prototype.getArea = function() {
  return this.width * this.height;
};

Rectangle.prototype.describe = function() {
  return 'A ' + this.color + ' rectangle ' + this.width + 'x' + this.height;
};

var rect = new Rectangle('blue', 10, 5);

console.log('A:', rect.color);
console.log('B:', rect.getColor());
console.log('C:', rect.getArea());
console.log('D:', rect.describe());
console.log('E:', rect instanceof Rectangle);
console.log('F:', rect instanceof Shape);
console.log('G:', rect.hasOwnProperty('getArea'));
console.log('H:', Rectangle.prototype.hasOwnProperty('getArea'));

/**
 * OUTPUT:
 *   A: blue
 *   B: blue
 *   C: 50
 *   D: A blue rectangle 10x5
 *   E: true
 *   F: true
 *   G: false
 *   H: true
 *
 *
 * ╔════════════════════════════════════════════════════════════════════════════╗
 * ║ STEP-BY-STEP BREAKDOWN                                                     ║
 * ╠════════════════════════════════════════════════════════════════════════════╣
 * ║                                                                            ║
 * ║ SETUP - What new Rectangle('blue', 10, 5) does:                            ║
 * ║ ────────────────────────────────────────────────                           ║
 * ║   1. Create new empty object: {}                                           ║
 * ║   2. Set __proto__ to Rectangle.prototype                                  ║
 * ║   3. Call Rectangle with this = new object                                 ║
 * ║      - Shape.call(this, color) → this.color = 'blue'                       ║
 * ║      - this.width = 10                                                     ║
 * ║      - this.height = 5                                                     ║
 * ║   4. Return: { color: 'blue', width: 10, height: 5 }                       ║
 * ║                                                                            ║
 * ║                                                                            ║
 * ║ A: rect.color                                                              ║
 * ║ ─────────────                                                              ║
 * ║   • Found directly on rect (set by Shape.call)                             ║
 * ║   • Returns 'blue'                                                         ║
 * ║                                                                            ║
 * ║                                                                            ║
 * ║ B: rect.getColor()                                                         ║
 * ║ ──────────────────                                                         ║
 * ║   • getColor not on rect                                                   ║
 * ║   • Not on Rectangle.prototype                                             ║
 * ║   • Found on Shape.prototype                                               ║
 * ║   • this = rect, returns rect.color = 'blue'                               ║
 * ║                                                                            ║
 * ║                                                                            ║
 * ║ C: rect.getArea()                                                          ║
 * ║ ─────────────────                                                          ║
 * ║   • Found on Rectangle.prototype                                           ║
 * ║   • this.width * this.height = 10 * 5                                      ║
 * ║   • Returns 50                                                             ║
 * ║                                                                            ║
 * ║                                                                            ║
 * ║ D: rect.describe()                                                         ║
 * ║ ──────────────────                                                         ║
 * ║   • Found on Rectangle.prototype (OVERRIDES Shape's describe)              ║
 * ║   • Returns 'A blue rectangle 10x5'                                        ║
 * ║                                                                            ║
 * ║                                                                            ║
 * ║ E: rect instanceof Rectangle                                               ║
 * ║ ────────────────────────────                                               ║
 * ║   • Rectangle.prototype in rect's chain?                                   ║
 * ║   • rect.__proto__ === Rectangle.prototype ✓                               ║
 * ║   • Returns true                                                           ║
 * ║                                                                            ║
 * ║                                                                            ║
 * ║ F: rect instanceof Shape                                                   ║
 * ║ ────────────────────────                                                   ║
 * ║   • Shape.prototype in rect's chain?                                       ║
 * ║   • rect → Rectangle.prototype → Shape.prototype ✓                         ║
 * ║   • Returns true                                                           ║
 * ║                                                                            ║
 * ║                                                                            ║
 * ║ G: rect.hasOwnProperty('getArea')                                          ║
 * ║ ───────────────────────────────                                            ║
 * ║   • getArea is NOT on rect itself                                          ║
 * ║   • It's on Rectangle.prototype                                            ║
 * ║   • Returns false                                                          ║
 * ║                                                                            ║
 * ║                                                                            ║
 * ║ H: Rectangle.prototype.hasOwnProperty('getArea')                           ║
 * ║ ──────────────────────────────────────────────────                         ║
 * ║   • getArea IS on Rectangle.prototype                                      ║
 * ║   • Returns true                                                           ║
 * ║                                                                            ║
 * ╚════════════════════════════════════════════════════════════════════════════╝
 *
 *
 * ┌─────────────────────────────────────────────────────────────────────────────┐
 * │ VISUAL: Complete Prototype Chain                                            │
 * ├─────────────────────────────────────────────────────────────────────────────┤
 * │                                                                             │
 * │   ┌───────────────────────────────────────────────────────────────────┐     │
 * │   │  rect (instance)                                                  │     │
 * │   │                                                                   │     │
 * │   │  color: 'blue'   ← Own property (from Shape.call)                 │     │
 * │   │  width: 10       ← Own property                                   │     │
 * │   │  height: 5       ← Own property                                   │     │
 * │   │  __proto__ ───────────────────────────────────────────────┐       │     │
 * │   └───────────────────────────────────────────────────────────────────┘     │
 * │                                                               │             │
 * │                                                               ▼             │
 * │   ┌───────────────────────────────────────────────────────────────────┐     │
 * │   │  Rectangle.prototype                                              │     │
 * │   │                                                                   │     │
 * │   │  constructor: Rectangle                                           │     │
 * │   │  getArea: function                                                │     │
 * │   │  describe: function  ← Overrides Shape.prototype.describe         │     │
 * │   │  __proto__ ───────────────────────────────────────────────┐       │     │
 * │   └───────────────────────────────────────────────────────────────────┘     │
 * │                                                               │             │
 * │                                                               ▼             │
 * │   ┌───────────────────────────────────────────────────────────────────┐     │
 * │   │  Shape.prototype                                                  │     │
 * │   │                                                                   │     │
 * │   │  constructor: Shape                                               │     │
 * │   │  getColor: function                                               │     │
 * │   │  describe: function  ← Shadowed by Rectangle's                    │     │
 * │   │  __proto__ → Object.prototype                                     │     │
 * │   └───────────────────────────────────────────────────────────────────┘     │
 * │                                                                             │
 * └─────────────────────────────────────────────────────────────────────────────┘
 *
 *
 * ┌─────────────────────────────────────────────────────────────────────────────┐
 * │ PROTOTYPE MASTERY CHECKLIST                                                 │
 * ├─────────────────────────────────────────────────────────────────────────────┤
 * │                                                                             │
 * │ ✓ Understand prototype chain lookup                                         │
 * │ ✓ Know difference between __proto__ and prototype                           │
 * │ ✓ Use Object.create() for clean inheritance                                 │
 * │ ✓ Call parent constructor with Parent.call(this)                            │
 * │ ✓ Fix constructor reference after setting prototype                         │
 * │ ✓ Understand method overriding (shadowing)                                  │
 * │ ✓ Know when properties are own vs inherited                                 │
 * │ ✓ Use hasOwnProperty to check own properties                                │
 * │ ✓ Understand instanceof checks prototype chain                              │
 * │ ✓ Know ES6 classes are syntactic sugar                                      │
 * │                                                                             │
 * │ You're ready for prototype questions in interviews!                         │
 * │                                                                             │
 * └─────────────────────────────────────────────────────────────────────────────┘
 *
 *
 * ┌─────────────────────────────────────────────────────────────────────────────┐
 * │ INTERVIEW ANSWER                                                            │
 * ├─────────────────────────────────────────────────────────────────────────────┤
 * │                                                                             │
 * │ "This example demonstrates complete ES5 prototype inheritance:              │
 * │                                                                             │
 * │  1. Shape.call(this, color) - Calls parent constructor to initialize        │
 * │     inherited properties (color) on the child instance.                     │
 * │                                                                             │
 * │  2. Rectangle.prototype = Object.create(Shape.prototype) - Sets up          │
 * │     the prototype chain so Rectangle inherits Shape's methods.              │
 * │                                                                             │
 * │  3. Rectangle.prototype.constructor = Rectangle - Fixes the constructor     │
 * │     reference that Object.create() doesn't set.                             │
 * │                                                                             │
 * │  The prototype chain is: rect → Rectangle.prototype → Shape.prototype       │
 * │                                                                             │
 * │  - rect.color is an own property (set by Shape.call)                        │
 * │  - rect.getColor() is inherited from Shape.prototype                        │
 * │  - rect.describe() uses Rectangle's version (method overriding)             │
 * │  - instanceof works for both Rectangle and Shape                            │
 * │  - hasOwnProperty distinguishes own vs inherited properties                 │
 * │                                                                             │
 * │  This is exactly what ES6 'extends' does under the hood."                   │
 * │                                                                             │
 * └─────────────────────────────────────────────────────────────────────────────┘
 *
 *
 * RUN: node docs/03-prototypes/10-ultimate-prototype-challenge.js
 */
