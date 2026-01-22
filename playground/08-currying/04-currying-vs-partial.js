// CHALLENGE 04: Currying vs Partial Application
//
// What prints for A, B, C, D?

// Partial Application: Fix SOME arguments
function partial(fn, ...fixedArgs) {
  return function(...remainingArgs) {
    return fn(...fixedArgs, ...remainingArgs);
  };
}

function greet(greeting, punctuation, name) {
  return `${greeting}, ${name}${punctuation}`;
}

// Partial: fix first two args
var greetHello = partial(greet, 'Hello', '!');
console.log('A:', greetHello('Alice'));
console.log('B:', greetHello('Bob'));

// Currying: Transform into chain of single-arg functions
var curriedGreet = greeting => punctuation => name =>
  `${greeting}, ${name}${punctuation}`;

var greetHi = curriedGreet('Hi')('.');
console.log('C:', greetHi('Charlie'));

var greetHey = curriedGreet('Hey')('!');
console.log('D:', greetHey('Diana'));
