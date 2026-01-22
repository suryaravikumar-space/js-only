// CHALLENGE 00: Prototype Basics
//
// What prints for A, B, C, D, E?

var animal = {
  eats: true,
  walk: function() {
    return 'Walking';
  }
};

var rabbit = {
  jumps: true
};

rabbit.__proto__ = animal;

console.log('A:', rabbit.jumps);
console.log('B:', rabbit.eats);
console.log('C:', rabbit.walk());
console.log('D:', rabbit.hasOwnProperty('eats'));
console.log('E:', rabbit.hasOwnProperty('jumps'));
