// CHALLENGE 09: Callback Best Practices
//
// What prints for A, B, C, D?

// Best Practice 1: Always handle errors first
function safeOperation(callback) {
  setTimeout(function() {
    var error = null;
    var result = 42;
    // Always call callback with error first
    callback(error, result);
  }, 10);
}

safeOperation(function(err, result) {
  if (err) {
    console.log('A:', 'Error: ' + err.message);
    return;  // Early return on error
  }
  console.log('A:', result);
});

// Best Practice 2: Don't nest - use named functions
function step1(callback) {
  setTimeout(function() { callback(null, 1); }, 10);
}

function step2(prev, callback) {
  setTimeout(function() { callback(null, prev + 1); }, 10);
}

function step3(prev, callback) {
  setTimeout(function() { callback(null, prev + 1); }, 10);
}

// Named function handlers instead of nesting
function handleStep1(err, result) {
  if (err) return console.log('B:', err);
  step2(result, handleStep2);
}

function handleStep2(err, result) {
  if (err) return console.log('B:', err);
  step3(result, handleStep3);
}

function handleStep3(err, result) {
  if (err) return console.log('B:', err);
  console.log('B:', result);
}

step1(handleStep1);

// Best Practice 3: Use async library patterns
function waterfall(tasks, finalCallback) {
  var index = 0;

  function next(err, result) {
    if (err) return finalCallback(err);
    if (index >= tasks.length) return finalCallback(null, result);

    var task = tasks[index++];
    task(result, next);
  }

  next(null, null);
}

waterfall([
  function(_, cb) { cb(null, 10); },
  function(val, cb) { cb(null, val * 2); },
  function(val, cb) { cb(null, val + 5); }
], function(err, result) {
  console.log('C:', result);
});

console.log('D:', 'Sync runs first');
