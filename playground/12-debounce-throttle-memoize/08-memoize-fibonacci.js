// CHALLENGE 08: Memoized Fibonacci
//
// Compare recursive vs memoized fibonacci

// Non-memoized (exponential time!)
function fib(n) {
  if (n <= 1) return n;
  return fib(n - 1) + fib(n - 2);
}

// Memoized (linear time)
function memoize(fn) {
  var cache = {};
  return function(n) {
    if (n in cache) return cache[n];
    var result = fn(n);
    cache[n] = result;
    return result;
  };
}

var fibMemo = memoize(function(n) {
  if (n <= 1) return n;
  return fibMemo(n - 1) + fibMemo(n - 2);
});

// Test small numbers
console.log('A:', fib(10));
console.log('B:', fibMemo(10));

// Memoized handles large numbers easily
console.log('C:', fibMemo(40));

// Count calls comparison
var normalCalls = 0;
var memoCalls = 0;

function fibCount(n) {
  normalCalls++;
  if (n <= 1) return n;
  return fibCount(n - 1) + fibCount(n - 2);
}

var fibMemoCount = (function() {
  var cache = {};
  return function fib(n) {
    memoCalls++;
    if (n in cache) return cache[n];
    if (n <= 1) return cache[n] = n;
    return cache[n] = fib(n - 1) + fib(n - 2);
  };
})();

fibCount(20);
fibMemoCount(20);

console.log('D: Normal calls:', normalCalls);
console.log('E: Memo calls:', memoCalls);
