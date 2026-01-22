/**
 * CHALLENGE 06: Converting Callbacks to Promises (Promisify)
 *
 * ╔════════════════════════════════════════════════════════════════════════════╗
 * ║ THE GOLDEN RULE                                                            ║
 * ╠════════════════════════════════════════════════════════════════════════════╣
 * ║                                                                            ║
 * ║ Promisify: Wrap a callback-based function to return a Promise.             ║
 * ║                                                                            ║
 * ║   function promisify(fn) {                                                 ║
 * ║     return (...args) => new Promise((resolve, reject) => {                 ║
 * ║       fn(...args, (err, result) => err ? reject(err) : resolve(result));   ║
 * ║     });                                                                    ║
 * ║   }                                                                        ║
 * ║                                                                            ║
 * ╚════════════════════════════════════════════════════════════════════════════╝
 */

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

/**
 * OUTPUT:
 *   D: Sync code runs first
 *   A: Item 1
 *   B: Item 2
 *   C: Invalid ID
 *
 *
 * ╔════════════════════════════════════════════════════════════════════════════╗
 * ║ PROMISIFY IMPLEMENTATION                                                   ║
 * ╠════════════════════════════════════════════════════════════════════════════╣
 * ║                                                                            ║
 * ║   // Generic promisify for error-first callbacks                           ║
 * ║   function promisify(fn) {                                                 ║
 * ║     return function(...args) {                                             ║
 * ║       return new Promise((resolve, reject) => {                            ║
 * ║         // Add our callback as the last argument                           ║
 * ║         fn(...args, (err, result) => {                                     ║
 * ║           if (err) reject(err);                                            ║
 * ║           else resolve(result);                                            ║
 * ║         });                                                                ║
 * ║       });                                                                  ║
 * ║     };                                                                     ║
 * ║   }                                                                        ║
 * ║                                                                            ║
 * ║   // Node.js built-in                                                      ║
 * ║   const { promisify } = require('util');                                   ║
 * ║   const readFileAsync = promisify(fs.readFile);                            ║
 * ║                                                                            ║
 * ╚════════════════════════════════════════════════════════════════════════════╝
 *
 *
 * ┌─────────────────────────────────────────────────────────────────────────────┐
 * │ INTERVIEW ANSWER                                                            │
 * ├─────────────────────────────────────────────────────────────────────────────┤
 * │                                                                             │
 * │ "Promisification wraps callback-based functions to return Promises.        │
 * │                                                                             │
 * │  The pattern: Create a new Promise, call the original function with        │
 * │  a callback that calls resolve() on success or reject() on error.          │
 * │                                                                             │
 * │  Node.js provides util.promisify() built-in. Many libraries now            │
 * │  provide Promise-based APIs by default (fs.promises in Node.js)."          │
 * │                                                                             │
 * └─────────────────────────────────────────────────────────────────────────────┘
 *
 *
 * RUN: node docs/07-callbacks/06-callback-to-promise.js
 */
