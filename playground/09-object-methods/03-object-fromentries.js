// CHALLENGE 03: Object.fromEntries()
//
// What prints for A, B, C, D, E?

var entries = [['name', 'Alice'], ['age', 25]];
console.log('A:', Object.fromEntries(entries));

var map = new Map([['x', 1], ['y', 2]]);
console.log('B:', Object.fromEntries(map));

// Transform: double all values
var prices = { apple: 1, banana: 2, orange: 3 };
var doubled = Object.fromEntries(
  Object.entries(prices).map(([k, v]) => [k, v * 2])
);
console.log('C:', doubled);

// Filter: keep values > 1
var filtered = Object.fromEntries(
  Object.entries(prices).filter(([k, v]) => v > 1)
);
console.log('D:', filtered);

// Swap keys and values
var swapped = Object.fromEntries(
  Object.entries({ a: '1', b: '2' }).map(([k, v]) => [v, k])
);
console.log('E:', swapped);
