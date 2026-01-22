// CHALLENGE 06: Converting Callbacks to Promises (Promisify)
//
// What prints for A, B, C, D?

// Original callback-based function
function fetchData(id, callback) {
  setTimeout(function() {
    if (id > 0) {
      callback(null, { id: id, name: 'Item ' + id });
    } else {
      callback(new Error('Invalid ID'), null);
    }
  }, 10);
}

// Manual promisification
function fetchDataPromise(id) {
  return new Promise(function(resolve, reject) {
    fetchData(id, function(err, data) {
      if (err) {
        reject(err);
      } else {
        resolve(data);
      }
    });
  });
}

// Generic promisify function
function promisify(fn) {
  return function(...args) {
    return new Promise(function(resolve, reject) {
      fn(...args, function(err, result) {
        if (err) {
          reject(err);
        } else {
          resolve(result);
        }
      });
    });
  };
}

var fetchDataP = promisify(fetchData);

// Using promisified function
fetchDataPromise(1).then(function(data) {
  console.log('A:', data.name);
});

fetchDataP(2).then(function(data) {
  console.log('B:', data.name);
});

fetchDataP(-1).catch(function(err) {
  console.log('C:', err.message);
});

// Node.js has built-in util.promisify
// const { promisify } = require('util');
console.log('D:', 'Sync code runs first');
