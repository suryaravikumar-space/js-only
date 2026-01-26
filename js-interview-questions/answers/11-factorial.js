/**
 * Answer 11: Factorial
 *
 * Multiple approaches to solve this problem:
 */

// Approach 1: Iterative
function factorial(n) {
    if (n < 0) return undefined;
    if (n === 0 || n === 1) return 1;

    let result = 1;
    for (let i = 2; i <= n; i++) {
        result *= i;
    }
    return result;
}

// Approach 2: Recursive
function factorialRecursive(n) {
    if (n < 0) return undefined;
    if (n === 0 || n === 1) return 1;
    return n * factorialRecursive(n - 1);
}

// Approach 3: Tail Recursion (Optimized)
function factorialTailRecursive(n, acc = 1) {
    if (n < 0) return undefined;
    if (n === 0 || n === 1) return acc;
    return factorialTailRecursive(n - 1, n * acc);
}

// Approach 4: Using Reduce
function factorialReduce(n) {
    if (n < 0) return undefined;
    if (n === 0 || n === 1) return 1;

    return Array.from({ length: n }, (_, i) => i + 1)
        .reduce((acc, num) => acc * num, 1);
}

// Approach 5: Memoized Factorial (for repeated calls)
const factorialMemo = (() => {
    const cache = { 0: 1, 1: 1 };

    return function factorial(n) {
        if (n < 0) return undefined;
        if (cache[n] !== undefined) return cache[n];

        cache[n] = n * factorial(n - 1);
        return cache[n];
    };
})();

// Test cases
console.log("=== Iterative ===");
console.log(factorial(5)); // 120
console.log(factorial(0)); // 1

console.log("\n=== Recursive ===");
console.log(factorialRecursive(10)); // 3628800

console.log("\n=== Tail Recursive ===");
console.log(factorialTailRecursive(5)); // 120

console.log("\n=== Memoized ===");
console.log(factorialMemo(5)); // 120
console.log(factorialMemo(5)); // 120 (from cache)

/**
 * Time Complexity: O(n) for all approaches
 * Space Complexity:
 * - Iterative: O(1)
 * - Recursive: O(n) - call stack
 * - Memoized: O(n) - cache storage
 */
