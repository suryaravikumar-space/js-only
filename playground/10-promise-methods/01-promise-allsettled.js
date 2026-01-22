// CHALLENGE 01: Promise.allSettled() - All Results Regardless of Status
//
// What prints and in what order?

console.log('A');

var p1 = Promise.resolve('success');

var p2 = Promise.reject('error');

var p3 = new Promise(function(resolve) {
  setTimeout(function() {
    console.log('B');
    resolve('delayed');
  }, 50);
});

Promise.allSettled([p1, p2, p3]).then(function(results) {
  console.log('C:', results.length);
  results.forEach(function(result, i) {
    console.log('D' + i + ':', result.status);
  });
});

console.log('E');
