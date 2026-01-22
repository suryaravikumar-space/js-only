// CHALLENGE 23: The bind() Method
//
// What prints for A, B, C, D, E, F?

var person = {
  name: 'Alice',
  greet: function(greeting) {
    return greeting + ', ' + this.name;
  }
};

var bob = { name: 'Bob' };
var charlie = { name: 'Charlie' };

var boundToBob = person.greet.bind(bob);

console.log('A:', boundToBob('Hello'));
console.log('B:', boundToBob.call(charlie, 'Hi'));
console.log('C:', boundToBob.apply(person, ['Hey']));

var doubleBound = boundToBob.bind(charlie);
console.log('D:', doubleBound('Yo'));

var boundWithArg = person.greet.bind(bob, 'Fixed');
console.log('E:', boundWithArg());
console.log('F:', boundWithArg('Ignored'));
