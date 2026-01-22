// CHALLENGE 02: Promise.race()
//
// What prints and in what order?

// Promise.race returns the first settled promise (fulfilled OR rejected)
var fast = new Promise(resolve => setTimeout(() => resolve('fast'), 100));
var slow = new Promise(resolve => setTimeout(() => resolve('slow'), 300));

Promise.race([fast, slow])
  .then(result => console.log('A:', result));

// Race with rejection
var success = new Promise(resolve => setTimeout(() => resolve('success'), 200));
var failure = new Promise((_, reject) => setTimeout(() => reject('failure'), 100));

Promise.race([success, failure])
  .then(result => console.log('B:', result))
  .catch(error => console.log('C:', error));

// Already resolved wins immediately
var instant = Promise.resolve('instant');
var delayed = new Promise(resolve => setTimeout(() => resolve('delayed'), 100));

Promise.race([instant, delayed])
  .then(result => console.log('D:', result));
