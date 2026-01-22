// CHALLENGE 03: Object.create() Method
//
// What prints for A, B, C, D, E?

// Object.create with prototype
var personProto = {
  greet() {
    return 'Hello, I am ' + this.name;
  },
  describe() {
    return this.name + ' is ' + this.age + ' years old';
  }
};

var alice = Object.create(personProto);
alice.name = 'Alice';
alice.age = 25;

console.log('A:', alice.greet());
console.log('B:', Object.getPrototypeOf(alice) === personProto);

// Object.create with property descriptors
var bob = Object.create(personProto, {
  name: {
    value: 'Bob',
    writable: true,
    enumerable: true,
    configurable: true
  },
  age: {
    value: 30,
    writable: false,
    enumerable: true,
    configurable: false
  }
});

bob.age = 100;  // Try to change non-writable property
console.log('C:', bob.age);

// Object.create(null) - pure dictionary
var dict = Object.create(null);
dict.key = 'value';

console.log('D:', dict.hasOwnProperty);
console.log('E:', 'key' in dict);
