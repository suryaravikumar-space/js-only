// CHALLENGE 26: `this` in Nested Objects
//
// What prints for A, B, C, D, E, F?

var outer = {
  name: 'Outer',
  inner: {
    name: 'Inner',
    getName: function() {
      return this.name;
    }
  },
  getInnerName: function() {
    return this.inner.getName();
  }
};

console.log('A:', outer.inner.getName());
console.log('B:', outer.getInnerName());

var getName = outer.inner.getName;
console.log('C:', getName());

var obj = {
  value: 100,
  nested: {
    value: 200,
    getValue: function() {
      return this.value;
    },
    getOuterValue: function() {
      var self = this;
      return function() {
        return self.value;
      };
    }
  }
};

console.log('D:', obj.nested.getValue());

var extracted = obj.nested.getValue;
console.log('E:', extracted());

console.log('F:', obj.nested.getOuterValue()());
