// CHALLENGE 06: Partial Application & Currying
//
// What prints for A, B, C, D, E?

// Partial Application
function multiply(a, b) {
  return a * b;
}

function partial(fn, a) {
  return function(b) {
    return fn(a, b);
  };
}

var double = partial(multiply, 2);
var triple = partial(multiply, 3);

console.log('A:', double(5));
console.log('B:', triple(5));

// Currying
function curry(fn) {
  return function(a) {
    return function(b) {
      return fn(a, b);
    };
  };
}

var curriedMultiply = curry(multiply);
console.log('C:', curriedMultiply(4)(5));

var multiplyBy10 = curriedMultiply(10);
console.log('D:', multiplyBy10(7));
console.log('E:', multiplyBy10(3));
