// CHALLENGE 00: Promise.all() - Wait for All
//
// What prints and in what order?

console.log('A');

var p1 = new Promise(function(resolve) {
  setTimeout(function() {
    console.log('B');
    resolve('first');
  }, 100);
});

var p2 = new Promise(function(resolve) {
  setTimeout(function() {
    console.log('C');
    resolve('second');
  }, 50);
});

var p3 = Promise.resolve('third');

Promise.all([p1, p2, p3]).then(function(results) {
  console.log('D:', results);
});

console.log('E');
