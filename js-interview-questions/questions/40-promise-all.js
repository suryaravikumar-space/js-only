/**
 * Question 40: Implement Promise.all, Promise.race, Promise.allSettled
 *
 * Task: Implement these Promise static methods:
 *
 * Promise.all: Resolves when all promises resolve, rejects if any rejects
 * Promise.race: Resolves/rejects with the first settled promise
 * Promise.allSettled: Resolves when all promises settle (resolve or reject)
 */

function promiseAll(promises) {
    // Your solution here
}

function promiseRace(promises) {
    // Your solution here
}

function promiseAllSettled(promises) {
    // Your solution here
}

// Test cases
const p1 = Promise.resolve(1);
const p2 = Promise.resolve(2);
const p3 = new Promise(resolve => setTimeout(() => resolve(3), 100));

promiseAll([p1, p2, p3]).then(console.log); // [1, 2, 3]
promiseRace([p1, p2, p3]).then(console.log); // 1 (first to resolve)
