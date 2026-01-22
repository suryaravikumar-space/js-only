// CHALLENGE 03: Currying with Array Methods
//
// What prints for A, B, C, D?

// Curried multiply
var multiply = a => b => a * b;

var double = multiply(2);
var triple = multiply(3);

var numbers = [1, 2, 3, 4, 5];

console.log('A:', numbers.map(double));
console.log('B:', numbers.map(triple));

// Curried filter helper
var greaterThan = min => num => num > min;

console.log('C:', numbers.filter(greaterThan(2)));
console.log('D:', numbers.filter(greaterThan(3)));
