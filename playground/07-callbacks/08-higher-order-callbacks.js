// CHALLENGE 08: Callbacks in Higher-Order Functions
//
// What prints for A, B, C, D, E?

// Higher-order function that accepts callback
function repeat(n, callback) {
  for (var i = 0; i < n; i++) {
    callback(i);
  }
}

var result = [];
repeat(3, function(i) {
  result.push(i * 2);
});
console.log('A:', result);

// Function that returns a function (callback factory)
function createMultiplier(factor) {
  return function(num) {
    return num * factor;
  };
}

var double = createMultiplier(2);
var triple = createMultiplier(3);
console.log('B:', [1, 2, 3].map(double));
console.log('C:', [1, 2, 3].map(triple));

// Composing callbacks
function compose(f, g) {
  return function(x) {
    return f(g(x));
  };
}

var addOne = function(x) { return x + 1; };
var square = function(x) { return x * x; };

var addThenSquare = compose(square, addOne);
console.log('D:', addThenSquare(4));  // square(addOne(4)) = square(5) = 25

// Callback with context
var counter = {
  count: 0,
  increment: function() {
    this.count++;
  }
};

function doThrice(callback, context) {
  for (var i = 0; i < 3; i++) {
    callback.call(context);
  }
}

doThrice(counter.increment, counter);
console.log('E:', counter.count);
