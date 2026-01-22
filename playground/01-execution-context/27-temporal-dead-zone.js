// CHALLENGE 27: Temporal Dead Zone (TDZ)
//
// What prints for A, B, C, D, E?

console.log('A:', typeof undeclaredVar);

var varVariable = 'var value';
console.log('B:', varVariable);

function testTDZ() {
  console.log('C:', typeof maybeExists);

  var hoistedVar = 'hoisted';
  console.log('D:', hoistedVar);
}

testTDZ();

function demonstrateLet() {
  var result = [];

  for (var i = 0; i < 3; i++) {
    result.push(function() { return i; });
  }

  return result[0]();
}

console.log('E:', demonstrateLet());

// NOTE: The following would throw ReferenceError if uncommented:
// console.log(letVar);  // ReferenceError: Cannot access 'letVar' before initialization
// let letVar = 'let value';
