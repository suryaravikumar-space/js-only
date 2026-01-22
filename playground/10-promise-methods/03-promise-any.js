// CHALLENGE 03: Promise.any()
//
// What prints and in what order?

// Promise.any returns the first FULFILLED promise
var slow = new Promise(resolve => setTimeout(() => resolve('slow'), 300));
var fast = new Promise(resolve => setTimeout(() => resolve('fast'), 100));

Promise.any([slow, fast])
  .then(result => console.log('A:', result));

// Rejections are ignored unless ALL reject
var fail1 = new Promise((_, reject) => setTimeout(() => reject('fail1'), 50));
var fail2 = new Promise((_, reject) => setTimeout(() => reject('fail2'), 100));
var success = new Promise(resolve => setTimeout(() => resolve('success'), 150));

Promise.any([fail1, fail2, success])
  .then(result => console.log('B:', result));

// All rejections → AggregateError
Promise.any([
  Promise.reject('error1'),
  Promise.reject('error2')
])
  .catch(error => {
    console.log('C:', error.constructor.name);
    console.log('D:', error.errors.length);
  });
