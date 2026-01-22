// CHALLENGE 04: ES6 Class Syntax
//
// What prints for A, B, C, D, E, F?

// ES6 Class
class Person {
  constructor(name, age) {
    this.name = name;
    this.age = age;
  }

  greet() {
    return 'Hello, I am ' + this.name;
  }

  static species() {
    return 'Homo sapiens';
  }
}

var alice = new Person('Alice', 25);

console.log('A:', alice.greet());
console.log('B:', Person.species());
console.log('C:', typeof Person);

// Class inheritance
class Employee extends Person {
  constructor(name, age, role) {
    super(name, age);
    this.role = role;
  }

  greet() {
    return super.greet() + ', a ' + this.role;
  }
}

var bob = new Employee('Bob', 30, 'Developer');

console.log('D:', bob.greet());
console.log('E:', bob instanceof Person);
console.log('F:', bob instanceof Employee);
