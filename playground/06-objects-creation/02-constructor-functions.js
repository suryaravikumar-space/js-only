// CHALLENGE 02: Constructor Functions with new
//
// What prints for A, B, C, D, E?

// Constructor function
function Person(name, age) {
  this.name = name;
  this.age = age;
  this.greet = function() {
    return 'Hello, I am ' + this.name;
  };
}

var alice = new Person('Alice', 25);

console.log('A:', alice.greet());
console.log('B:', alice instanceof Person);
console.log('C:', alice.constructor === Person);

// What happens without new?
function Car(model) {
  this.model = model;
  return this;
}

var honda = Car('Honda');  // No 'new' keyword!

console.log('D:', typeof honda);
console.log('E:', honda === globalThis || honda === global || honda === window || honda.model === 'Honda');

// Constructor returning an object
function Robot(name) {
  this.name = name;
  return { name: 'Override', type: 'robot' };
}

var r1 = new Robot('R2D2');
console.log('F:', r1.name);
