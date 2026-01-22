// CHALLENGE 24: Method Borrowing
//
// What prints for A, B, C, D, E, F?

var logger = {
  prefix: '[LOG]',
  log: function(msg) {
    return this.prefix + ' ' + msg;
  }
};

var errorLogger = { prefix: '[ERROR]' };
var warnLogger = { prefix: '[WARN]' };

console.log('A:', logger.log('System started'));
console.log('B:', logger.log.call(errorLogger, 'Something broke'));
console.log('C:', logger.log.call(warnLogger, 'Be careful'));

var borrowed = logger.log;
console.log('D:', borrowed('Test'));

function sum() {
  var args = Array.prototype.slice.call(arguments);
  return args.reduce(function(a, b) { return a + b; }, 0);
}

console.log('E:', sum(1, 2, 3));
console.log('F:', sum(1, 2, 3, 4, 5));
