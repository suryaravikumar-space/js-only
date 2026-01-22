// CHALLENGE 04: Prototype Inheritance
//
// What prints for A, B, C, D, E, F?

function Animal(name) {
  this.name = name;
}

Animal.prototype.speak = function() {
  return this.name + ' makes a sound';
};

function Dog(name, breed) {
  Animal.call(this, name);
  this.breed = breed;
}

Dog.prototype = Object.create(Animal.prototype);
Dog.prototype.constructor = Dog;

Dog.prototype.speak = function() {
  return this.name + ' barks';
};

Dog.prototype.fetch = function() {
  return this.name + ' fetches the ball';
};

var dog = new Dog('Rex', 'German Shepherd');

console.log('A:', dog.name);
console.log('B:', dog.breed);
console.log('C:', dog.speak());
console.log('D:', dog.fetch());
console.log('E:', dog instanceof Dog);
console.log('F:', dog instanceof Animal);
