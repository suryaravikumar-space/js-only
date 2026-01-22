// CHALLENGE 08: ES6 Class Syntax
//
// What prints for A, B, C, D, E, F?

class Animal {
  constructor(name) {
    this.name = name;
  }

  speak() {
    return this.name + ' makes a sound';
  }

  static isAnimal(obj) {
    return obj instanceof Animal;
  }
}

class Dog extends Animal {
  constructor(name, breed) {
    super(name);
    this.breed = breed;
  }

  speak() {
    return this.name + ' barks';
  }
}

var dog = new Dog('Rex', 'Husky');

console.log('A:', dog.speak());
console.log('B:', dog instanceof Dog);
console.log('C:', dog instanceof Animal);
console.log('D:', Animal.isAnimal(dog));
console.log('E:', typeof Animal);
console.log('F:', dog.hasOwnProperty('speak'));
