// CHALLENGE 00: Higher-Order Functions Basics
//
// What prints for A, B, C, D?

// A function is "higher-order" if it:
// 1. Takes a function as argument, OR
// 2. Returns a function

// Example 1: Function that takes a function
function repeat(n, action) {
  for (var i = 0; i < n; i++) {
    action(i);
  }
}

console.log('A:');
repeat(3, console.log);

// Example 2: Function that returns a function
function greaterThan(n) {
  return function(m) {
    return m > n;
  };
}

var greaterThan10 = greaterThan(10);
console.log('B:', greaterThan10(11));
console.log('C:', greaterThan10(9));

// Example 3: Both - takes AND returns a function
function noisy(fn) {
  return function(...args) {
    console.log('Calling with:', args);
    var result = fn(...args);
    console.log('Called with:', args, 'returned:', result);
    return result;
  };
}

var noisyMath = noisy(Math.min);
console.log('D:', noisyMath(3, 2, 1));
