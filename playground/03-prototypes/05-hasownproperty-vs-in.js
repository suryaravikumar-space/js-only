// CHALLENGE 05: hasOwnProperty vs in
//
// What prints for A, B, C, D, E, F?

var proto = {
  inherited: 'from proto'
};

var obj = Object.create(proto);
obj.own = 'my own';

console.log('A:', obj.hasOwnProperty('own'));
console.log('B:', obj.hasOwnProperty('inherited'));
console.log('C:', 'own' in obj);
console.log('D:', 'inherited' in obj);
console.log('E:', 'toString' in obj);
console.log('F:', obj.hasOwnProperty('toString'));
