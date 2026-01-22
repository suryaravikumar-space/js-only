// CHALLENGE 01: Prototype Chain Lookup
//
// What prints for A, B, C, D, E?

var grandparent = {
  surname: 'Smith',
  getSurname: function() {
    return this.surname;
  }
};

var parent = Object.create(grandparent);
parent.firstName = 'John';

var child = Object.create(parent);
child.age = 10;

console.log('A:', child.age);
console.log('B:', child.firstName);
console.log('C:', child.surname);
console.log('D:', child.getSurname());
console.log('E:', child.hasOwnProperty('surname'));
