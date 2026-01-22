// CHALLENGE 02: Constructor Functions
//
// What prints for A, B, C, D, E, F?

function Person(name) {
  this.name = name;
}

Person.prototype.greet = function() {
  return 'Hello, I am ' + this.name;
};

var alice = new Person('Alice');
var bob = new Person('Bob');

console.log('A:', alice.name);
console.log('B:', alice.greet());
console.log('C:', bob.greet());
console.log('D:', alice.greet === bob.greet);
console.log('E:', alice instanceof Person);
console.log('F:', alice.constructor === Person);
