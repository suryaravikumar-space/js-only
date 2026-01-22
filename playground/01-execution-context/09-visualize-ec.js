// CHALLENGE: Visualize Two Execution Contexts
//
// Trace through creation phase and execution phase.
// What's in each Variable Environment?
// What's on the call stack?

var x = 10;

function add(a, b) {
  var result = a + b;
  return result;
}

var sum = add(3, 4);
console.log(sum);
