// CHALLENGE 07: Event Listener Callbacks
//
// What prints for A, B, C, D?

// Simple EventEmitter implementation
function EventEmitter() {
  this.events = {};
}

EventEmitter.prototype.on = function(event, callback) {
  if (!this.events[event]) {
    this.events[event] = [];
  }
  this.events[event].push(callback);
};

EventEmitter.prototype.emit = function(event, data) {
  var callbacks = this.events[event];
  if (callbacks) {
    callbacks.forEach(function(cb) {
      cb(data);
    });
  }
};

EventEmitter.prototype.once = function(event, callback) {
  var self = this;
  function wrapper(data) {
    callback(data);
    self.off(event, wrapper);
  }
  this.on(event, wrapper);
};

EventEmitter.prototype.off = function(event, callback) {
  var callbacks = this.events[event];
  if (callbacks) {
    this.events[event] = callbacks.filter(function(cb) {
      return cb !== callback;
    });
  }
};

// Usage
var emitter = new EventEmitter();

emitter.on('data', function(value) {
  console.log('A:', value);
});

emitter.on('data', function(value) {
  console.log('B:', value * 2);
});

emitter.once('special', function(value) {
  console.log('C:', 'Once: ' + value);
});

emitter.emit('data', 5);
emitter.emit('special', 'First');
emitter.emit('special', 'Second');  // Won't trigger - once only
console.log('D:', 'Done');
