// CHALLENGE 00: Object Literal Syntax and Shorthand
//
// What prints for A, B, C, D, E?

// Basic object literal
var person = {
  name: 'Alice',
  age: 25
};

console.log('A:', person.name);

// Property shorthand (ES6)
var name = 'Bob';
var age = 30;

var user = { name, age };
console.log('B:', user.name, user.age);

// Method shorthand (ES6)
var calculator = {
  value: 10,
  double() {
    return this.value * 2;
  },
  triple: function() {
    return this.value * 3;
  }
};

console.log('C:', calculator.double());

// Computed property names
var key = 'dynamicKey';
var obj = {
  [key]: 'dynamicValue',
  ['prefix_' + key]: 'prefixed'
};

console.log('D:', obj.dynamicKey);
console.log('E:', obj.prefix_dynamicKey);
