// CHALLENGE 02: Array.filter() Internals
//
// What prints for A, B, C, D?

var numbers = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];

// Filter even numbers
var evens = numbers.filter(function(num) {
  return num % 2 === 0;
});
console.log('A:', evens);

// Filter with index
var firstHalf = numbers.filter(function(num, index) {
  return index < 5;
});
console.log('B:', firstHalf);

// Filter objects
var users = [
  { name: 'Alice', age: 25, active: true },
  { name: 'Bob', age: 30, active: false },
  { name: 'Charlie', age: 35, active: true }
];

var activeUsers = users.filter(user => user.active);
console.log('C:', activeUsers.map(u => u.name));

// Chaining filter and map
var result = numbers
  .filter(x => x % 2 === 0)
  .map(x => x * x);
console.log('D:', result);
