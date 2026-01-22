// CHALLENGE: this Binding
//
// Questions:
// 1. What does sayName() print?
// 2. What does person.sayName() print?
// 3. Why different — same function?

var name = 'Global';

function sayName() {
  console.log(this.name);
}

var person = {
  name: 'John',
  sayName: sayName
};

sayName();           // What prints?
person.sayName();    // What prints?
