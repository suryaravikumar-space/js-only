// CHALLENGE 05: Inversion of Control / Trust Issues
//
// What could go wrong with A, B, C?

// Problem 1: Callback might be called multiple times
function buggyProcess(data, callback) {
  callback(data);
  callback(data);  // Oops! Called twice
}

var count = 0;
buggyProcess('test', function(data) {
  count++;
  console.log('A:', 'Called ' + count + ' time(s)');
});

// Problem 2: Callback might never be called
function unreliableAPI(callback) {
  if (Math.random() > 0.5) {
    callback('Success');
  }
  // Callback might never execute!
}

// Problem 3: Callback called synchronously when expected async
function inconsistentAPI(cached, callback) {
  if (cached) {
    callback('From cache');  // Sync!
  } else {
    setTimeout(function() {
      callback('From server');  // Async!
    }, 10);
  }
}

console.log('B:', 'Before');
inconsistentAPI(true, function(result) {
  console.log('B:', result);
});
console.log('B:', 'After');

// Problem 4: Error handling - callback might throw
function riskyOperation(callback) {
  try {
    callback(null, 'data');
  } catch (e) {
    console.log('C:', 'Error caught: ' + e.message);
  }
}

riskyOperation(function(err, data) {
  throw new Error('Callback error');
});
