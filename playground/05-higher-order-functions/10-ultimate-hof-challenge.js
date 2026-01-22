// CHALLENGE 10: Ultimate Higher-Order Functions Challenge
//
// What prints for A, B, C, D, E?

// Challenge 1: Nested HOFs
var numbers = [1, 2, 3, 4, 5];

var result1 = numbers
  .map(x => x * 2)
  .filter(x => x > 5)
  .reduce((a, b) => a + b, 0);

console.log('A:', result1);

// Challenge 2: HOF returning HOF
function multiply(a) {
  return function(b) {
    return function(c) {
      return a * b * c;
    };
  };
}

console.log('B:', multiply(2)(3)(4));

// Challenge 3: Reduce to implement map
function customMap(arr, fn) {
  return arr.reduce(function(acc, curr, index) {
    acc.push(fn(curr, index));
    return acc;
  }, []);
}

console.log('C:', customMap([1, 2, 3], x => x * 10));

// Challenge 4: Reduce to implement filter
function customFilter(arr, predicate) {
  return arr.reduce(function(acc, curr) {
    if (predicate(curr)) {
      acc.push(curr);
    }
    return acc;
  }, []);
}

console.log('D:', customFilter([1, 2, 3, 4, 5], x => x % 2 === 0));

// Challenge 5: Complex transformation
var data = [
  { category: 'A', value: 10 },
  { category: 'B', value: 20 },
  { category: 'A', value: 30 },
  { category: 'B', value: 40 }
];

var grouped = data.reduce(function(acc, item) {
  if (!acc[item.category]) {
    acc[item.category] = 0;
  }
  acc[item.category] += item.value;
  return acc;
}, {});

console.log('E:', grouped);
