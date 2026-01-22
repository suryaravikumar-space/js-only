// CHALLENGE 10: Ultimate Closure Challenge
//
// What prints for A, B, C, D, E, F, G?

function createTracker(name) {
  var count = 0;
  var history = [];

  return {
    name: name,

    track: function(event) {
      count++;
      history.push({ event: event, count: count });
      return this.name + ': ' + event + ' (#' + count + ')';
    },

    getHistory: function() {
      return history.slice();
    },

    createLogger: function() {
      var self = this;
      return function(msg) {
        return self.track('LOG: ' + msg);
      };
    }
  };
}

var tracker1 = createTracker('App');
var tracker2 = createTracker('DB');

console.log('A:', tracker1.track('start'));
console.log('B:', tracker1.track('process'));
console.log('C:', tracker2.track('connect'));

var logger = tracker1.createLogger();
console.log('D:', logger('user logged in'));

console.log('E:', tracker1.getHistory().length);
console.log('F:', tracker2.getHistory().length);

var trackMethod = tracker1.track;
try {
  console.log('G:', trackMethod('test'));
} catch(e) {
  console.log('G:', 'Error');
}
