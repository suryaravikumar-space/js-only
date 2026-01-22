// CHALLENGE 00: Currying Basics
//
// What prints for A, B, C, D?

// Regular function
function add(a, b, c) {
  return a + b + c;
}

console.log('A:', add(1, 2, 3));

// Curried version - manual
function curriedAdd(a) {
  return function(b) {
    return function(c) {
      return a + b + c;
    };
  };
}

console.log('B:', curriedAdd(1)(2)(3));

// Partial application with currying
var add1 = curriedAdd(1);
var add1and2 = add1(2);
console.log('C:', add1and2(3));

// Arrow function currying
var curriedMultiply = a => b => c => a * b * c;
console.log('D:', curriedMultiply(2)(3)(4));
