// CHALLENGE 08: Closure Memory & References
//
// What prints for A, B, C? What about memory?

function createHeavyObject() {
  var heavyData = new Array(1000000).fill('data');
  var id = Math.random();

  return {
    getId: function() {
      return id;
    }
    // Note: heavyData is NOT used in returned object
  };
}

var obj1 = createHeavyObject();
console.log('A:', obj1.getId() > 0);

// Question: Is heavyData garbage collected?
console.log('B:', 'heavyData may be retained in closure');

function createOptimized() {
  var heavyData = new Array(1000000).fill('data');
  var id = Math.random();
  var length = heavyData.length; // Extract what we need

  heavyData = null; // Allow GC

  return {
    getId: function() { return id; },
    getLength: function() { return length; }
  };
}

var obj2 = createOptimized();
console.log('C:', obj2.getLength());
