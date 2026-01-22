// CHALLENGE 04: Promise.resolve() and Promise.reject()
//
// What prints for A, B, C, D, E?

// Promise.resolve with primitive
var p1 = Promise.resolve(42);
p1.then(val => console.log('A:', val));

// Promise.resolve with promise (returns same promise!)
var original = new Promise(resolve => resolve('original'));
var wrapped = Promise.resolve(original);
console.log('B:', original === wrapped);

// Promise.resolve with thenable
var thenable = {
  then: function(resolve) {
    resolve('from thenable');
  }
};
Promise.resolve(thenable)
  .then(val => console.log('C:', val));

// Promise.reject always wraps in rejected promise
Promise.reject('error message')
  .catch(err => console.log('D:', err));

// Note: Promise.reject does NOT unwrap promises
var rejectedPromise = Promise.reject(Promise.resolve('nested'));
rejectedPromise.catch(err => {
  console.log('E:', err instanceof Promise);
});
