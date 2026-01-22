// CHALLENGE 03: Array.reduce() Internals
//
// What prints for A, B, C, D, E?

var numbers = [1, 2, 3, 4, 5];

// Sum all numbers
var sum = numbers.reduce(function(accumulator, current) {
  return accumulator + current;
}, 0);
console.log('A:', sum);

// Without initial value (first element becomes initial)
var sum2 = numbers.reduce(function(acc, curr) {
  return acc + curr;
});
console.log('B:', sum2);

// Find max value
var max = numbers.reduce(function(acc, curr) {
  return curr > acc ? curr : acc;
});
console.log('C:', max);

// Flatten array
var nested = [[1, 2], [3, 4], [5]];
var flat = nested.reduce(function(acc, curr) {
  return acc.concat(curr);
}, []);
console.log('D:', flat);

// Count occurrences
var words = ['apple', 'banana', 'apple', 'cherry', 'banana', 'apple'];
var count = words.reduce(function(acc, word) {
  acc[word] = (acc[word] || 0) + 1;
  return acc;
}, {});
console.log('E:', count);
