// CHALLENGE 06: Memoization Basics
//
// What prints for A, B, C?

function memoize(fn) {
  var cache = {};
  
  return function(...args) {
    var key = JSON.stringify(args);
    
    if (key in cache) {
      console.log('Cache hit for:', key);
      return cache[key];
    }
    
    console.log('Computing for:', key);
    var result = fn.apply(this, args);
    cache[key] = result;
    return result;
  };
}

// Test: Expensive calculation
var expensiveAdd = memoize((a, b) => {
  return a + b;
});

console.log('A:', expensiveAdd(1, 2));  // Computing
console.log('B:', expensiveAdd(1, 2));  // Cache hit
console.log('C:', expensiveAdd(2, 3));  // Computing (different args)
