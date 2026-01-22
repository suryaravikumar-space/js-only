// CHALLENGE 02: The Loop Closure Problem
//
// What prints for A, B, C?

function createFunctions() {
  var result = [];

  for (var i = 0; i < 3; i++) {
    result.push(function() {
      return i;
    });
  }

  return result;
}

var funcs = createFunctions();

console.log('A:', funcs[0]());
console.log('B:', funcs[1]());
console.log('C:', funcs[2]());
