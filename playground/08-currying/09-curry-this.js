// CHALLENGE 09: Currying and this Binding
//
// What prints for A, B, C, D?

// Currying with this context
function curryThis(fn) {
  return function curried(...args) {
    if (args.length >= fn.length) {
      return fn.apply(this, args);
    }
    return curried.bind(this, ...args);
  };
}

var obj = {
  multiplier: 10,
  multiply: curryThis(function(a, b) {
    return a * b * this.multiplier;
  })
};

console.log('A:', obj.multiply(2, 3));
console.log('B:', obj.multiply(2)(3));

// Be careful with method extraction
var extracted = obj.multiply;
// console.log(extracted(2, 3));  // Would fail - lost this

// Fix with bind
var bound = obj.multiply.bind(obj);
console.log('C:', bound(2)(3));

// Arrow functions don't have their own this
var objArrow = {
  value: 5,
  getCurried: function() {
    return a => b => a + b + this.value;
  }
};

var curriedFn = objArrow.getCurried();
console.log('D:', curriedFn(1)(2));  // Works because arrow uses lexical this
