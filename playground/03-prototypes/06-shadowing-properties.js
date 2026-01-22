// CHALLENGE 06: Shadowing Properties
//
// What prints for A, B, C, D, E?

var proto = {
  value: 100,
  getValue: function() {
    return this.value;
  }
};

var obj = Object.create(proto);

console.log('A:', obj.value);
console.log('B:', obj.getValue());

obj.value = 200;

console.log('C:', obj.value);
console.log('D:', proto.value);
console.log('E:', obj.hasOwnProperty('value'));
