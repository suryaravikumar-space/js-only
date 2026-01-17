// 'use strict'

const obj = {
  prop: 42,
};
obj.prop = 33;
Object.freeze(obj);

obj.prop = 422;
// Throws an error in strict mode

console.log(obj.prop);