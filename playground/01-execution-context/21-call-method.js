// CHALLENGE 21: The call() Method
//
// What prints for A, B, C, D, E?

var person1 = {
  name: 'Alice',
  greet: function(greeting) {
    return greeting + ', ' + this.name;
  }
};

var person2 = { name: 'Bob' };
var person3 = { name: 'Charlie' };

console.log('A:', person1.greet('Hello'));
console.log('B:', person1.greet.call(person2, 'Hi'));
console.log('C:', person1.greet.call(person3, 'Hey'));

var greetFunc = person1.greet;
console.log('D:', greetFunc('Yo'));
console.log('E:', greetFunc.call(person1, 'Sup'));
