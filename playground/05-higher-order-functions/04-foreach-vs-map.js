// CHALLENGE 04: forEach vs map
//
// What prints for A, B, C, D?

var numbers = [1, 2, 3];

// forEach - returns undefined, used for side effects
var forEachResult = numbers.forEach(function(num) {
  return num * 2;  // This return is ignored!
});
console.log('A:', forEachResult);

// map - returns new array
var mapResult = numbers.map(function(num) {
  return num * 2;
});
console.log('B:', mapResult);

// forEach with side effect
var doubled = [];
numbers.forEach(function(num) {
  doubled.push(num * 2);
});
console.log('C:', doubled);

// Original array unchanged in both
console.log('D:', numbers);
