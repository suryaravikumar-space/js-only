// CHALLENGE 22: The apply() Method
//
// What prints for A, B, C, D, E, F?

var calculator = {
  value: 10,
  add: function(a, b, c) {
    return this.value + a + b + c;
  }
};

var another = { value: 100 };

console.log('A:', calculator.add(1, 2, 3));
console.log('B:', calculator.add.call(another, 1, 2, 3));
console.log('C:', calculator.add.apply(another, [1, 2, 3]));

var numbers = [5, 10, 15];
console.log('D:', calculator.add.apply(null, numbers));
console.log('E:', Math.max.apply(null, [3, 7, 2, 9, 4]));
console.log('F:', Math.min.apply(null, numbers));
