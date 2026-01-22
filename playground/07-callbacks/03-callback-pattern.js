// CHALLENGE 03: Error-First Callback Pattern (Node.js style)
//
// What prints for A, B, C, D?

// Error-first callback: callback(error, result)
function divide(a, b, callback) {
  if (b === 0) {
    callback(new Error('Cannot divide by zero'), null);
  } else {
    callback(null, a / b);
  }
}

// Success case
divide(10, 2, function(err, result) {
  if (err) {
    console.log('A:', err.message);
  } else {
    console.log('A:', result);
  }
});

// Error case
divide(10, 0, function(err, result) {
  if (err) {
    console.log('B:', err.message);
  } else {
    console.log('B:', result);
  }
});

// Simulating async file read
function readFile(filename, callback) {
  setTimeout(function() {
    if (filename === 'missing.txt') {
      callback(new Error('File not found'), null);
    } else {
      callback(null, 'File contents: Hello World');
    }
  }, 10);
}

readFile('data.txt', function(err, data) {
  console.log('C:', err ? err.message : data);
});

readFile('missing.txt', function(err, data) {
  console.log('D:', err ? err.message : data);
});
