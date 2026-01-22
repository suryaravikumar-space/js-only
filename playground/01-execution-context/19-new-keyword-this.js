// CHALLENGE: The new Keyword and this
//
// What gets printed for each console.log?

function Person(name) {
  this.name = name;
  console.log(this);
}

var p1 = Person('John');      // WITHOUT new!
var p2 = new Person('Jane');  // WITH new

console.log('p1:', p1);
console.log('p2:', p2);
console.log('name:', name);
