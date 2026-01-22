// CHALLENGE 05: find, some, every
//
// What prints for A, B, C, D, E, F?

var numbers = [1, 2, 3, 4, 5];

// find - returns FIRST element that matches
var firstEven = numbers.find(function(num) {
  return num % 2 === 0;
});
console.log('A:', firstEven);

// find returns undefined if nothing matches
var greaterThan10 = numbers.find(num => num > 10);
console.log('B:', greaterThan10);

// some - returns true if ANY element matches
var hasEven = numbers.some(num => num % 2 === 0);
console.log('C:', hasEven);

var hasNegative = numbers.some(num => num < 0);
console.log('D:', hasNegative);

// every - returns true if ALL elements match
var allPositive = numbers.every(num => num > 0);
console.log('E:', allPositive);

var allEven = numbers.every(num => num % 2 === 0);
console.log('F:', allEven);
