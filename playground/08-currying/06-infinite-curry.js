// CHALLENGE 06: Infinite Currying (Interview Classic)
//
// What prints for A, B, C, D?

// Infinite curry with valueOf
function infiniteSum(a) {
  var sum = a;

  function inner(b) {
    sum += b;
    return inner;
  }

  inner.valueOf = function() {
    return sum;
  };

  inner.toString = function() {
    return sum;
  };

  return inner;
}

// Uses valueOf when converted to number
console.log('A:', +infiniteSum(1)(2)(3));
console.log('B:', +infiniteSum(1)(2)(3)(4)(5));

// Alternative: Return value when called with no args
function sum(a) {
  return function(b) {
    if (b === undefined) {
      return a;
    }
    return sum(a + b);
  };
}

console.log('C:', sum(1)(2)(3)());
console.log('D:', sum(10)(20)(30)(40)());
