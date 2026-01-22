// CHALLENGE 06: sort as Higher-Order Function
//
// What prints for A, B, C, D?

// Default sort - converts to strings!
var numbers = [10, 5, 8, 1, 7, 100, 25];
console.log('A:', [...numbers].sort());

// Numeric sort with comparator function
var numericSort = [...numbers].sort(function(a, b) {
  return a - b;  // ascending
});
console.log('B:', numericSort);

// Descending sort
var descending = [...numbers].sort(function(a, b) {
  return b - a;
});
console.log('C:', descending);

// Sort objects by property
var users = [
  { name: 'Charlie', age: 35 },
  { name: 'Alice', age: 25 },
  { name: 'Bob', age: 30 }
];

var byAge = [...users].sort((a, b) => a.age - b.age);
console.log('D:', byAge.map(u => u.name));
