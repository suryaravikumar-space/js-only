// CHALLENGE 30: Ultimate Combined Challenge
//
// What prints for A, B, C, D, E, F, G, H?

var app = {
  name: 'MyApp',
  config: {
    name: 'Config',
    getAppName: function() {
      return this.name;
    }
  },
  start: function() {
    return 'Starting ' + this.name;
  }
};

console.log('A:', app.config.getAppName());
console.log('B:', app.config.getAppName.call(app));

var startApp = app.start;
console.log('C:', startApp());

var boundStart = app.start.bind(app);
console.log('D:', boundStart.call({ name: 'Other' }));

var counter = (function() {
  var count = 0;
  return {
    add: function(n) { count += n; return count; },
    get: function() { return count; }
  };
})();

console.log('E:', counter.add(5));
console.log('F:', counter.add(3));

function Calculator(initial) {
  this.value = initial;
}

Calculator.prototype.add = function(n) {
  this.value += n;
  return this;
};

Calculator.prototype.getValue = function() {
  return this.value;
};

var calc = new Calculator(10);
console.log('G:', calc.add(5).add(3).getValue());

var addMethod = calc.add;
try {
  addMethod(10);
  console.log('H:', 'No error');
} catch (e) {
  console.log('H:', 'Error - this.value is undefined');
}
