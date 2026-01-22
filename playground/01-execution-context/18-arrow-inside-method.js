// CHALLENGE: Arrow Functions Inside Methods
//
// What does each one print?

var person = {
  name: 'John',

  greetWithRegular: function() {
    setTimeout(function() {
      console.log('Regular:', this.name);
    }, 100);
  },

  greetWithArrow: function() {
    setTimeout(() => {
      console.log('Arrow:', this.name);
    }, 100);
  }
};

person.greetWithRegular();
person.greetWithArrow();
