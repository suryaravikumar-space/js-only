// CHALLENGE 05: Currying with Function Composition
//
// What prints for A, B, C?

// Curried utilities
var add = a => b => a + b;
var multiply = a => b => a * b;

// Compose function
var compose = (...fns) => x => fns.reduceRight((acc, fn) => fn(acc), x);

// Create composed operations
var add5 = add(5);
var multiplyBy2 = multiply(2);

var add5ThenDouble = compose(multiplyBy2, add5);
var doubleThenAdd5 = compose(add5, multiplyBy2);

console.log('A:', add5ThenDouble(10));  // (10 + 5) * 2
console.log('B:', doubleThenAdd5(10));  // (10 * 2) + 5

// More complex composition
var subtract = a => b => b - a;
var subtract3 = subtract(3);

var complexOp = compose(subtract3, multiplyBy2, add5);
console.log('C:', complexOp(10));  // ((10 + 5) * 2) - 3
