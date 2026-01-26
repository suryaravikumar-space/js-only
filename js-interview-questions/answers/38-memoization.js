/**
 * Answer 38: Implement Memoization
 *
 * Multiple approaches to implement memoization:
 */

// Approach 1: Basic Memoization (single argument)
function memoize(fn) {
    const cache = new Map();

    return function (arg) {
        if (cache.has(arg)) {
            return cache.get(arg);
        }

        const result = fn(arg);
        cache.set(arg, result);
        return result;
    };
}

// Approach 2: Multiple Arguments
function memoizeMultiple(fn) {
    const cache = new Map();

    return function (...args) {
        const key = JSON.stringify(args);

        if (cache.has(key)) {
            return cache.get(key);
        }

        const result = fn.apply(this, args);
        cache.set(key, result);
        return result;
    };
}

// Approach 3: Custom key resolver
function memoizeWithResolver(fn, resolver) {
    const cache = new Map();

    return function (...args) {
        const key = resolver ? resolver(...args) : JSON.stringify(args);

        if (cache.has(key)) {
            return cache.get(key);
        }

        const result = fn.apply(this, args);
        cache.set(key, result);
        return result;
    };
}

// Approach 4: LRU Cache (Limited size)
function memoizeLRU(fn, maxSize = 100) {
    const cache = new Map();

    return function (...args) {
        const key = JSON.stringify(args);

        if (cache.has(key)) {
            // Move to end (most recently used)
            const value = cache.get(key);
            cache.delete(key);
            cache.set(key, value);
            return value;
        }

        const result = fn.apply(this, args);

        if (cache.size >= maxSize) {
            // Remove oldest (first) entry
            const firstKey = cache.keys().next().value;
            cache.delete(firstKey);
        }

        cache.set(key, result);
        return result;
    };
}

// Approach 5: With expiration
function memoizeWithTTL(fn, ttl = 60000) {
    const cache = new Map();

    return function (...args) {
        const key = JSON.stringify(args);
        const cached = cache.get(key);

        if (cached && Date.now() - cached.timestamp < ttl) {
            return cached.value;
        }

        const result = fn.apply(this, args);
        cache.set(key, { value: result, timestamp: Date.now() });
        return result;
    };
}

// Approach 6: Async memoization
function memoizeAsync(fn) {
    const cache = new Map();

    return async function (...args) {
        const key = JSON.stringify(args);

        if (cache.has(key)) {
            return cache.get(key);
        }

        const result = await fn.apply(this, args);
        cache.set(key, result);
        return result;
    };
}

// Test cases
console.log("=== Basic Memoization ===");
let callCount = 0;
const expensive = (n) => {
    callCount++;
    return n * n;
};
const memoized = memoize(expensive);
console.log(memoized(5)); // 25
console.log(memoized(5)); // 25 (cached)
console.log(memoized(6)); // 36
console.log(`Called ${callCount} times`); // 2

console.log("\n=== Multiple Arguments ===");
const add = memoizeMultiple((a, b) => {
    console.log('Computing...');
    return a + b;
});
console.log(add(1, 2)); // Computing... 3
console.log(add(1, 2)); // 3 (cached)
console.log(add(2, 1)); // Computing... 3

console.log("\n=== Fibonacci with Memoization ===");
const fib = memoize(function fibonacci(n) {
    if (n <= 1) return n;
    return fib(n - 1) + fib(n - 2);
});
console.log(fib(40)); // Fast due to memoization

console.log("\n=== Custom Resolver ===");
const getUser = memoizeWithResolver(
    (user) => ({ ...user, processed: true }),
    (user) => user.id // Use only id as cache key
);
console.log(getUser({ id: 1, name: 'John' }));
console.log(getUser({ id: 1, name: 'Johnny' })); // Same cache hit

/**
 * Use Cases:
 * - Expensive calculations
 * - API calls
 * - Recursive functions (Fibonacci)
 *
 * Time Complexity: O(1) for cache lookup
 * Space Complexity: O(n) for cache storage
 */
