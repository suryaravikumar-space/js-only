/**
 * CHALLENGE 08: Accessor Properties (Getters and Setters)
 *
 * ╔════════════════════════════════════════════════════════════════════════════╗
 * ║ THE GOLDEN RULE                                                            ║
 * ╠════════════════════════════════════════════════════════════════════════════╣
 * ║                                                                            ║
 * ║ Getters and setters let you define computed properties.                    ║
 * ║                                                                            ║
 * ║   var obj = {                                                              ║
 * ║     get propName() { return ...; },   // Called on read                    ║
 * ║     set propName(value) { ... }       // Called on write                   ║
 * ║   };                                                                       ║
 * ║                                                                            ║
 * ║ Use cases:                                                                 ║
 * ║   - Computed values (fullName from firstName + lastName)                   ║
 * ║   - Validation on assignment                                               ║
 * ║   - Lazy evaluation                                                        ║
 * ║   - Read-only properties (getter only)                                     ║
 * ║                                                                            ║
 * ╚════════════════════════════════════════════════════════════════════════════╝
 */

// Basic getter and setter
var person = {
  firstName: 'John',
  lastName: 'Doe',

  get fullName() {
    return this.firstName + ' ' + this.lastName;
  },

  set fullName(value) {
    var parts = value.split(' ');
    this.firstName = parts[0];
    this.lastName = parts[1];
  }
};

console.log('A:', person.fullName);

person.fullName = 'Jane Smith';
console.log('B:', person.firstName);

// Getter-only (read-only property)
var circle = {
  radius: 5,

  get area() {
    return Math.PI * this.radius * this.radius;
  }
};

console.log('C:', Math.round(circle.area));

// Setter with validation
var account = {
  _balance: 100,

  get balance() {
    return this._balance;
  },

  set balance(value) {
    if (value < 0) {
      console.log('D:', 'Invalid balance');
      return;
    }
    this._balance = value;
  }
};

account.balance = -50;
console.log('E:', account.balance);

/**
 * OUTPUT:
 *   A: John Doe
 *   B: Jane
 *   C: 79
 *   D: Invalid balance
 *   E: 100
 *
 *
 * ╔════════════════════════════════════════════════════════════════════════════╗
 * ║ STEP-BY-STEP BREAKDOWN                                                     ║
 * ╠════════════════════════════════════════════════════════════════════════════╣
 * ║                                                                            ║
 * ║ A: Getter computes fullName                                                ║
 * ║ ─────────────────────────────                                              ║
 * ║   person.fullName triggers get fullName()                                  ║
 * ║   Returns 'John' + ' ' + 'Doe' = 'John Doe'                                ║
 * ║                                                                            ║
 * ║                                                                            ║
 * ║ B: Setter parses and assigns                                               ║
 * ║ ─────────────────────────────                                              ║
 * ║   person.fullName = 'Jane Smith' triggers set fullName()                   ║
 * ║   Splits 'Jane Smith' → ['Jane', 'Smith']                                  ║
 * ║   firstName = 'Jane', lastName = 'Smith'                                   ║
 * ║                                                                            ║
 * ║                                                                            ║
 * ║ C: Computed property                                                       ║
 * ║ ─────────────────────                                                      ║
 * ║   circle.area triggers get area()                                          ║
 * ║   π * 5² = 78.54... → rounded = 79                                         ║
 * ║                                                                            ║
 * ║                                                                            ║
 * ║ D & E: Validation in setter                                                ║
 * ║ ─────────────────────────────                                              ║
 * ║   account.balance = -50 triggers set balance(-50)                          ║
 * ║   -50 < 0 → logs 'Invalid balance', returns early                          ║
 * ║   _balance unchanged, still 100                                            ║
 * ║                                                                            ║
 * ╚════════════════════════════════════════════════════════════════════════════╝
 *
 *
 * ┌─────────────────────────────────────────────────────────────────────────────┐
 * │ GETTER/SETTER PATTERNS                                                      │
 * ├─────────────────────────────────────────────────────────────────────────────┤
 * │                                                                             │
 * │   // 1. Computed property                                                   │
 * │   get fullName() { return this.first + ' ' + this.last; }                   │
 * │                                                                             │
 * │   // 2. Validation                                                          │
 * │   set age(value) { if (value >= 0) this._age = value; }                     │
 * │                                                                             │
 * │   // 3. Read-only (getter only)                                             │
 * │   get id() { return this._id; }                                             │
 * │                                                                             │
 * │   // 4. Private-like (_underscore convention)                               │
 * │   get balance() { return this._balance; }                                   │
 * │   set balance(v) { this._balance = v; }                                     │
 * │                                                                             │
 * │   // 5. Lazy initialization                                                 │
 * │   get data() {                                                              │
 * │     if (!this._data) this._data = expensiveComputation();                   │
 * │     return this._data;                                                      │
 * │   }                                                                         │
 * │                                                                             │
 * └─────────────────────────────────────────────────────────────────────────────┘
 *
 *
 * RUN: node docs/06-objects-creation/08-getters-setters.js
 */
