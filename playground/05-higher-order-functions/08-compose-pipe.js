// CHALLENGE 08: Compose and Pipe
//
// What prints for A, B, C, D?

// Helper functions
var add10 = x => x + 10;
var multiply2 = x => x * 2;
var subtract5 = x => x - 5;

// Manual composition (right to left)
var result1 = subtract5(multiply2(add10(5)));
console.log('A:', result1);  // ((5 + 10) * 2) - 5

// Compose function (right to left)
function compose(...fns) {
  return function(x) {
    return fns.reduceRight(function(acc, fn) {
      return fn(acc);
    }, x);
  };
}

var composed = compose(subtract5, multiply2, add10);
console.log('B:', composed(5));

// Pipe function (left to right)
function pipe(...fns) {
  return function(x) {
    return fns.reduce(function(acc, fn) {
      return fn(acc);
    }, x);
  };
}

var piped = pipe(add10, multiply2, subtract5);
console.log('C:', piped(5));

// Different order gives different result
var piped2 = pipe(multiply2, add10, subtract5);
console.log('D:', piped2(5));  // ((5 * 2) + 10) - 5
