// CHALLENGE: Arrow Functions and this
//
// What does each one print?
// Think: Arrow functions have a special rule for this.

var name = 'Global';

var person = {
  name: 'John',
  regularMethod: function() {
    console.log(this.name);
  },
  arrowMethod: () => {
    console.log(this.name);
  }
};

person.regularMethod();
person.arrowMethod();
