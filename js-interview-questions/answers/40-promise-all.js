/**
 * Answer 40: Implement Promise.all, Promise.race, Promise.allSettled
 *
 * Custom implementations of Promise static methods:
 */

// Promise.all - Resolves when all resolve, rejects if any rejects
function promiseAll(promises) {
    return new Promise((resolve, reject) => {
        if (!Array.isArray(promises)) {
            return reject(new TypeError('Argument must be an array'));
        }

        if (promises.length === 0) {
            return resolve([]);
        }

        const results = [];
        let completed = 0;

        promises.forEach((promise, index) => {
            Promise.resolve(promise)
                .then(value => {
                    results[index] = value;
                    completed++;

                    if (completed === promises.length) {
                        resolve(results);
                    }
                })
                .catch(reject);
        });
    });
}

// Promise.race - First to settle wins
function promiseRace(promises) {
    return new Promise((resolve, reject) => {
        if (!Array.isArray(promises)) {
            return reject(new TypeError('Argument must be an array'));
        }

        promises.forEach(promise => {
            Promise.resolve(promise)
                .then(resolve)
                .catch(reject);
        });
    });
}

// Promise.allSettled - Wait for all to settle
function promiseAllSettled(promises) {
    return new Promise((resolve) => {
        if (!Array.isArray(promises)) {
            return resolve([]);
        }

        if (promises.length === 0) {
            return resolve([]);
        }

        const results = [];
        let completed = 0;

        promises.forEach((promise, index) => {
            Promise.resolve(promise)
                .then(value => {
                    results[index] = { status: 'fulfilled', value };
                })
                .catch(reason => {
                    results[index] = { status: 'rejected', reason };
                })
                .finally(() => {
                    completed++;
                    if (completed === promises.length) {
                        resolve(results);
                    }
                });
        });
    });
}

// Promise.any - First to fulfill wins (rejects if all reject)
function promiseAny(promises) {
    return new Promise((resolve, reject) => {
        if (!Array.isArray(promises)) {
            return reject(new TypeError('Argument must be an array'));
        }

        if (promises.length === 0) {
            return reject(new AggregateError([], 'All promises were rejected'));
        }

        const errors = [];
        let rejectedCount = 0;

        promises.forEach((promise, index) => {
            Promise.resolve(promise)
                .then(resolve)
                .catch(error => {
                    errors[index] = error;
                    rejectedCount++;

                    if (rejectedCount === promises.length) {
                        reject(new AggregateError(errors, 'All promises were rejected'));
                    }
                });
        });
    });
}

// Promisify - Convert callback-based function to Promise
function promisify(fn) {
    return function (...args) {
        return new Promise((resolve, reject) => {
            fn(...args, (error, result) => {
                if (error) {
                    reject(error);
                } else {
                    resolve(result);
                }
            });
        });
    };
}

// Sleep/Delay helper
function delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

// Test cases
console.log("=== Promise.all ===");
const p1 = Promise.resolve(1);
const p2 = Promise.resolve(2);
const p3 = new Promise(resolve => setTimeout(() => resolve(3), 100));

promiseAll([p1, p2, p3]).then(results => {
    console.log('All resolved:', results); // [1, 2, 3]
});

console.log("\n=== Promise.race ===");
promiseRace([
    new Promise(resolve => setTimeout(() => resolve('slow'), 200)),
    new Promise(resolve => setTimeout(() => resolve('fast'), 100))
]).then(result => {
    console.log('Race winner:', result); // "fast"
});

console.log("\n=== Promise.allSettled ===");
promiseAllSettled([
    Promise.resolve('success'),
    Promise.reject('error'),
    Promise.resolve('another success')
]).then(results => {
    console.log('All settled:', results);
    // [
    //   { status: 'fulfilled', value: 'success' },
    //   { status: 'rejected', reason: 'error' },
    //   { status: 'fulfilled', value: 'another success' }
    // ]
});

console.log("\n=== Promise.any ===");
promiseAny([
    Promise.reject('error1'),
    Promise.resolve('first success'),
    Promise.reject('error2')
]).then(result => {
    console.log('Any winner:', result); // "first success"
});

console.log("\n=== Promisify Example ===");
// Example callback-based function
function readFileCallback(path, callback) {
    setTimeout(() => callback(null, `Content of ${path}`), 100);
}

const readFilePromise = promisify(readFileCallback);
readFilePromise('test.txt').then(content => {
    console.log('Promisified result:', content);
});

/**
 * Summary:
 * - all: Wait for ALL, fail on ANY rejection
 * - race: First to settle (resolve OR reject)
 * - allSettled: Wait for ALL to settle
 * - any: First to FULFILL (ignore rejections unless all reject)
 *
 * Time Complexity: O(n) where n is number of promises
 * Space Complexity: O(n) for results array
 */
