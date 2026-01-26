/**
 * Answer 12: Fibonacci Sequence
 *
 * Multiple approaches to solve this problem:
 */

// Approach 1: Iterative (Get nth number)
function fibonacci(n) {
    if (n <= 0) return 0;
    if (n === 1) return 1;

    let prev = 0, curr = 1;
    for (let i = 2; i <= n; i++) {
        [prev, curr] = [curr, prev + curr];
    }
    return curr;
}

// Approach 2: Recursive (Slow - O(2^n))
function fibonacciRecursive(n) {
    if (n <= 0) return 0;
    if (n === 1) return 1;
    return fibonacciRecursive(n - 1) + fibonacciRecursive(n - 2);
}

// Approach 3: Memoized Recursive (Fast - O(n))
function fibonacciMemo(n, memo = {}) {
    if (n <= 0) return 0;
    if (n === 1) return 1;
    if (memo[n]) return memo[n];

    memo[n] = fibonacciMemo(n - 1, memo) + fibonacciMemo(n - 2, memo);
    return memo[n];
}

// Approach 4: Generate Sequence
function fibonacciSequence(n) {
    if (n <= 0) return [];
    if (n === 1) return [0];

    const sequence = [0, 1];
    for (let i = 2; i < n; i++) {
        sequence.push(sequence[i - 1] + sequence[i - 2]);
    }
    return sequence;
}

// Approach 5: Using Generator
function* fibGenerator() {
    let prev = 0, curr = 1;
    yield prev;
    yield curr;

    while (true) {
        [prev, curr] = [curr, prev + curr];
        yield curr;
    }
}

function getFibSequenceGenerator(n) {
    const gen = fibGenerator();
    return Array.from({ length: n }, () => gen.next().value);
}

// Approach 6: Matrix Exponentiation (O(log n))
function fibMatrix(n) {
    if (n <= 0) return 0;
    if (n === 1) return 1;

    const multiply = (a, b) => [
        [a[0][0] * b[0][0] + a[0][1] * b[1][0], a[0][0] * b[0][1] + a[0][1] * b[1][1]],
        [a[1][0] * b[0][0] + a[1][1] * b[1][0], a[1][0] * b[0][1] + a[1][1] * b[1][1]]
    ];

    const power = (m, p) => {
        if (p === 1) return m;
        if (p % 2 === 0) {
            const half = power(m, p / 2);
            return multiply(half, half);
        }
        return multiply(m, power(m, p - 1));
    };

    const base = [[1, 1], [1, 0]];
    return power(base, n)[0][1];
}

// Test cases
console.log("=== Iterative ===");
console.log(fibonacci(6)); // 8
console.log(fibonacci(10)); // 55

console.log("\n=== Memoized ===");
console.log(fibonacciMemo(20)); // 6765

console.log("\n=== Sequence ===");
console.log(fibonacciSequence(7)); // [0, 1, 1, 2, 3, 5, 8]

console.log("\n=== Generator ===");
console.log(getFibSequenceGenerator(10)); // [0, 1, 1, 2, 3, 5, 8, 13, 21, 34]

/**
 * Time Complexity:
 * - Iterative: O(n)
 * - Recursive: O(2^n) - exponential!
 * - Memoized: O(n)
 * - Matrix: O(log n)
 *
 * Space Complexity:
 * - Iterative: O(1)
 * - Recursive: O(n) - call stack
 * - Memoized: O(n)
 */
