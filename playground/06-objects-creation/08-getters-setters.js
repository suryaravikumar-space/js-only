// CHALLENGE 08: Accessor Properties (Getters and Setters)
//
// What prints for A, B, C, D, E?

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
