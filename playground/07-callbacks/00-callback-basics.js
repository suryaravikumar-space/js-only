// CHALLENGE 00: Callback Basics
//
// What prints for A, B, C, D?

// A callback is a function passed as an argument to another function
function greet(name, callback) {
  console.log('A:', 'Hello ' + name);
  callback();
}

greet('Alice', function() {
  console.log('B:', 'Callback executed');
});

// Callbacks can receive arguments
function calculate(a, b, callback) {
  var result = a + b;
  callback(result);
}

calculate(5, 3, function(sum) {
  console.log('C:', sum);
});

// Named function as callback
function logResult(value) {
  console.log('D:', value * 2);
}

calculate(10, 5, logResult);
