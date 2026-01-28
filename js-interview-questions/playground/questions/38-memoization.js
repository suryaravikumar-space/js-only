/**
 * Question 38: Implement Memoization
 *
 * Memoization is an optimization technique that stores the results of
 * expensive function calls and returns the cached result when the same
 * inputs occur again.
 *
 * Task: Implement a memoize function that caches results.
 *
 * Example:
 * const expensiveFn = (n) => { console.log('Computing...'); return n * 2; }
 * const memoized = memoize(expensiveFn);
 * memoized(5) // Computing... 10
 * memoized(5) // 10 (from cache, no "Computing...")
 */

function memoize(fn) {
    // Your solution here
}

// Test cases
let callCount = 0;
const expensive = (n) => {
    callCount++;
    return n * n;
};
const memoized = memoize(expensive);
console.log(memoized(5)); // 25 (computed)
console.log(memoized(5)); // 25 (cached)
console.log(memoized(6)); // 36 (computed)
console.log(`Function called ${callCount} times`); // 2
