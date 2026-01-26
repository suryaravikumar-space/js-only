/**
 * Answer 18: Perfect Number
 *
 * Multiple approaches to solve this problem:
 */

// Approach 1: Basic Loop
function isPerfectNumber(num) {
    if (num <= 1) return false;

    let sum = 1;
    for (let i = 2; i < num; i++) {
        if (num % i === 0) {
            sum += i;
        }
    }

    return sum === num;
}

// Approach 2: Optimized - Check up to sqrt
function isPerfectNumberOptimized(num) {
    if (num <= 1) return false;

    let sum = 1;
    for (let i = 2; i * i <= num; i++) {
        if (num % i === 0) {
            sum += i;
            if (i !== num / i) {
                sum += num / i;
            }
        }
    }

    return sum === num;
}

// Get all divisors
function getDivisors(num) {
    const divisors = [];

    for (let i = 1; i <= Math.sqrt(num); i++) {
        if (num % i === 0) {
            divisors.push(i);
            if (i !== num / i && num / i !== num) {
                divisors.push(num / i);
            }
        }
    }

    return divisors.sort((a, b) => a - b).filter(d => d !== num);
}

// Perfect number breakdown
function perfectNumberInfo(num) {
    const divisors = getDivisors(num);
    const sum = divisors.reduce((a, b) => a + b, 0);

    return {
        number: num,
        divisors: divisors,
        sum: sum,
        isPerfect: sum === num,
        type: sum === num ? 'perfect' : sum < num ? 'deficient' : 'abundant'
    };
}

// Find perfect numbers in range
function findPerfectNumbers(start, end) {
    const perfect = [];

    for (let i = start; i <= end; i++) {
        if (isPerfectNumberOptimized(i)) {
            perfect.push(i);
        }
    }

    return perfect;
}

// Test cases
console.log("=== Basic Check ===");
console.log(isPerfectNumber(6)); // true
console.log(isPerfectNumber(28)); // true
console.log(isPerfectNumber(12)); // false

console.log("\n=== Optimized ===");
console.log(isPerfectNumberOptimized(496)); // true
console.log(isPerfectNumberOptimized(8128)); // true

console.log("\n=== Perfect Number Info ===");
console.log(perfectNumberInfo(6));
// { number: 6, divisors: [1,2,3], sum: 6, isPerfect: true, type: 'perfect' }
console.log(perfectNumberInfo(12));
// { number: 12, divisors: [1,2,3,4,6], sum: 16, isPerfect: false, type: 'abundant' }

console.log("\n=== Find Perfect Numbers 1-10000 ===");
console.log(findPerfectNumbers(1, 10000)); // [6, 28, 496, 8128]

/**
 * Time Complexity:
 * - Basic: O(n)
 * - Optimized: O(√n)
 *
 * Space Complexity: O(1) for checks, O(√n) for divisors
 */
