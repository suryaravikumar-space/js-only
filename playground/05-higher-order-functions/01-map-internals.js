// CHALLENGE 01: Array.map() Internals
//
// What prints for A, B, C, D?

var numbers = [1, 2, 3, 4, 5];

// Using built-in map
var doubled = numbers.map(function(num) {
  return num * 2;
});
console.log('A:', doubled);

// Map with index
var withIndex = numbers.map(function(num, index) {
  return num + '-' + index;
});
console.log('B:', withIndex);

// Map with arrow function
var squared = numbers.map(num => num * num);
console.log('C:', squared);

// Chaining maps
var result = numbers
  .map(x => x * 2)
  .map(x => x + 1);
console.log('D:', result);
