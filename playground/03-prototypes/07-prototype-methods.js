// CHALLENGE 07: Prototype Methods vs Instance
//
// What prints for A, B, C, D, E?

function Counter(start) {
  this.count = start;

  // Instance method - new function for each instance
  this.incrementInstance = function() {
    return ++this.count;
  };
}

// Prototype method - shared by all instances
Counter.prototype.incrementProto = function() {
  return ++this.count;
};

var c1 = new Counter(0);
var c2 = new Counter(100);

console.log('A:', c1.incrementInstance === c2.incrementInstance);
console.log('B:', c1.incrementProto === c2.incrementProto);
console.log('C:', c1.incrementProto());
console.log('D:', c2.incrementProto());
console.log('E:', c1.count);
