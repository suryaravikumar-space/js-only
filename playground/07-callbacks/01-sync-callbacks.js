// CHALLENGE 01: Synchronous Callbacks
//
// What prints for A, B, C, D, E?

// Array methods use synchronous callbacks
var numbers = [1, 2, 3, 4, 5];

// map - transform each element
var doubled = numbers.map(function(num) {
  return num * 2;
});
console.log('A:', doubled);

// filter - keep elements that pass test
var evens = numbers.filter(function(num) {
  return num % 2 === 0;
});
console.log('B:', evens);

// forEach - execute for each element
var sum = 0;
numbers.forEach(function(num) {
  sum += num;
});
console.log('C:', sum);

// reduce - accumulate to single value
var product = numbers.reduce(function(acc, num) {
  return acc * num;
}, 1);
console.log('D:', product);

// Execution order proof - all synchronous
console.log('E:', 'Start');
[1, 2].forEach(function(n) {
  console.log('E:', n);
});
console.log('E:', 'End');
