// CHALLENGE 09: Building Custom Higher-Order Functions
//
// What prints for A, B, C, D?

// Custom once - function can only be called once
function once(fn) {
  var called = false;
  var result;
  return function(...args) {
    if (!called) {
      called = true;
      result = fn(...args);
    }
    return result;
  };
}

var initializeOnce = once(function(name) {
  console.log('Initializing:', name);
  return 'Initialized ' + name;
});

console.log('A:', initializeOnce('App'));
console.log('B:', initializeOnce('Again'));  // Won't log "Initializing"

// Custom after - function only runs after n calls
function after(n, fn) {
  var count = 0;
  return function(...args) {
    count++;
    if (count >= n) {
      return fn(...args);
    }
  };
}

var runAfter3 = after(3, function() {
  return 'Finally running!';
});

console.log('C:', runAfter3());  // undefined
runAfter3();  // undefined
console.log('D:', runAfter3());  // 'Finally running!'
