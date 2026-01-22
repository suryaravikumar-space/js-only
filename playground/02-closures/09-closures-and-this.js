// CHALLENGE 09: Closures and `this` Interaction
//
// What prints for A, B, C, D?

var obj = {
  name: 'Object',

  regularClosure: function() {
    var self = this;
    return function() {
      return self.name;
    };
  },

  brokenClosure: function() {
    return function() {
      return this.name;
    };
  },

  arrowClosure: function() {
    return () => {
      return this.name;
    };
  }
};

var getName1 = obj.regularClosure();
var getName2 = obj.brokenClosure();
var getName3 = obj.arrowClosure();

console.log('A:', getName1());
console.log('B:', getName2());
console.log('C:', getName3());

var detached = obj.arrowClosure;
var getName4 = detached();
console.log('D:', getName4());
