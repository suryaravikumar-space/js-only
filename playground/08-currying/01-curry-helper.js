// CHALLENGE 01: Generic Curry Helper
//
// What prints for A, B, C, D?

// Generic curry function
function curry(fn) {
  return function curried(...args) {
    if (args.length >= fn.length) {
      return fn.apply(this, args);
    } else {
      return function(...moreArgs) {
        return curried.apply(this, args.concat(moreArgs));
      };
    }
  };
}

// Regular function
function sum(a, b, c) {
  return a + b + c;
}

var curriedSum = curry(sum);

// Multiple ways to call
console.log('A:', curriedSum(1, 2, 3));      // All at once
console.log('B:', curriedSum(1)(2)(3));      // One at a time
console.log('C:', curriedSum(1, 2)(3));      // Mixed
console.log('D:', curriedSum(1)(2, 3));      // Mixed other way
