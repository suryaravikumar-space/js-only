// CHALLENGE 10: Ultimate Currying Challenge
//
// What prints for A, B, C, D, E?

// Challenge 1: Implement curry from scratch
function curry(fn) {
  return function curried(...args) {
    if (args.length >= fn.length) {
      return fn(...args);
    }
    return (...moreArgs) => curried(...args, ...moreArgs);
  };
}

var multiply3 = curry((a, b, c) => a * b * c);
console.log('A:', multiply3(2)(3)(4));

// Challenge 2: Curried pipe
var pipe = (...fns) => x => fns.reduce((v, f) => f(v), x);

var add = a => b => a + b;
var mult = a => b => a * b;

var process = pipe(
  add(10),
  mult(2),
  add(-5)
);

console.log('B:', process(5));  // ((5+10)*2)-5

// Challenge 3: Curried object access
var prop = key => obj => obj[key];
var map = fn => arr => arr.map(fn);

var users = [
  { name: 'Alice', age: 25 },
  { name: 'Bob', age: 30 },
  { name: 'Charlie', age: 35 }
];

var getNames = map(prop('name'));
console.log('C:', getNames(users));

// Challenge 4: Curried conditional
var ifElse = predicate => onTrue => onFalse => value =>
  predicate(value) ? onTrue(value) : onFalse(value);

var isEven = n => n % 2 === 0;
var double = n => n * 2;
var triple = n => n * 3;

var processNumber = ifElse(isEven)(double)(triple);

console.log('D:', processNumber(4));  // even: 4*2=8
console.log('E:', processNumber(5));  // odd: 5*3=15
