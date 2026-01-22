// CHALLENGE 10: Ultimate Callback Challenge
//
// What prints for A, B, C, D, E, F in order?

console.log('A:', 'Script start');

// Challenge 1: Mixed sync and async callbacks
var arr = [1, 2, 3];
arr.forEach(function(n) {
  console.log('B:', n);
});

setTimeout(function() {
  console.log('C:', 'Timeout 1');
}, 0);

// Challenge 2: Callback execution order
function asyncTask(name, delay, callback) {
  setTimeout(function() {
    callback(name);
  }, delay);
}

asyncTask('First', 30, function(name) {
  console.log('D:', name);
});

asyncTask('Second', 10, function(name) {
  console.log('E:', name);
});

// Challenge 3: Nested callbacks with different timings
setTimeout(function() {
  console.log('F:', 'Outer timeout');
  setTimeout(function() {
    console.log('F:', 'Inner timeout');
  }, 0);
}, 20);

// Challenge 4: Implement parallel execution
function parallel(tasks, finalCallback) {
  var results = [];
  var completed = 0;

  tasks.forEach(function(task, index) {
    task(function(result) {
      results[index] = result;
      completed++;
      if (completed === tasks.length) {
        finalCallback(results);
      }
    });
  });
}

parallel([
  function(cb) { setTimeout(function() { cb('a'); }, 15); },
  function(cb) { setTimeout(function() { cb('b'); }, 5); },
  function(cb) { setTimeout(function() { cb('c'); }, 10); }
], function(results) {
  console.log('G:', results);  // Order preserved despite timing
});

console.log('H:', 'Script end');
