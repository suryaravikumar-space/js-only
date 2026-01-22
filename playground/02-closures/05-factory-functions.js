// CHALLENGE 05: Factory Functions
//
// What prints for A, B, C, D, E, F?

function createCounter(start) {
  var count = start || 0;

  return {
    increment: function() { return ++count; },
    decrement: function() { return --count; },
    getCount: function() { return count; }
  };
}

var counter1 = createCounter(0);
var counter2 = createCounter(100);

console.log('A:', counter1.increment());
console.log('B:', counter1.increment());
console.log('C:', counter2.increment());
console.log('D:', counter1.getCount());
console.log('E:', counter2.getCount());

counter1.count = 999;
console.log('F:', counter1.getCount());
