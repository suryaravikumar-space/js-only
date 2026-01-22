// CHALLENGE 28: IIFE Pattern
//
// What prints for A, B, C, D, E?

var result = (function() {
  var secret = 'hidden';
  return secret.toUpperCase();
})();

console.log('A:', result);

var counter = (function() {
  var count = 0;
  return {
    increment: function() { count++; return count; },
    decrement: function() { count--; return count; },
    getCount: function() { return count; }
  };
})();

console.log('B:', counter.increment());
console.log('C:', counter.increment());
console.log('D:', counter.decrement());

var module = (function() {
  var privateData = 'I am private';

  function privateMethod() {
    return privateData;
  }

  return {
    publicMethod: function() {
      return 'Public: ' + privateMethod();
    }
  };
})();

console.log('E:', module.publicMethod());

// NOTE: This would be undefined:
// console.log(typeof counter.count);  // undefined - count is private!
