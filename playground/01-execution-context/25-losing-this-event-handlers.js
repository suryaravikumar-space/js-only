// CHALLENGE 25: Losing `this` in Event Handlers
//
// What prints for A, B, C, D, E?

var button = {
  label: 'Submit',
  onClick: function() {
    return 'Clicked: ' + this.label;
  }
};

console.log('A:', button.onClick());

var handler = button.onClick;
console.log('B:', handler());

var boundHandler = button.onClick.bind(button);
console.log('C:', boundHandler());

function simulateClick(callback) {
  return callback();
}

console.log('D:', simulateClick(button.onClick));
console.log('E:', simulateClick(button.onClick.bind(button)));
