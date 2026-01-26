/**
 * Answer 17: Power of Two
 *
 * Multiple approaches to solve this problem:
 */

// Approach 1: Bitwise (Most Efficient)
// Power of 2 in binary has only one bit set: 8 = 1000
// n & (n-1) clears the lowest set bit
function isPowerOfTwo(num) {
    if (num <= 0) return false;
    return (num & (num - 1)) === 0;
}

// Approach 2: Loop Division
function isPowerOfTwoLoop(num) {
    if (num <= 0) return false;

    while (num > 1) {
        if (num % 2 !== 0) return false;
        num = num / 2;
    }

    return true;
}

// Approach 3: Logarithm
function isPowerOfTwoLog(num) {
    if (num <= 0) return false;
    const log = Math.log2(num);
    return Number.isInteger(log);
}

// Approach 4: Check power of any number
function isPowerOf(num, base) {
    if (num <= 0 || base <= 1) return false;

    while (num > 1) {
        if (num % base !== 0) return false;
        num = num / base;
    }

    return true;
}

// Approach 5: Using Logarithm for any base
function isPowerOfLog(num, base) {
    if (num <= 0 || base <= 1) return false;
    const log = Math.log(num) / Math.log(base);
    return Math.abs(log - Math.round(log)) < 1e-10;
}

// Get the power/exponent
function getExponent(num, base = 2) {
    if (!isPowerOf(num, base)) return null;

    let exp = 0;
    while (num > 1) {
        num = num / base;
        exp++;
    }

    return exp;
}

// Test cases
console.log("=== Bitwise (Power of 2) ===");
console.log(isPowerOfTwo(16)); // true
console.log(isPowerOfTwo(18)); // false
console.log(isPowerOfTwo(1)); // true

console.log("\n=== Loop Method ===");
console.log(isPowerOfTwoLoop(1024)); // true

console.log("\n=== Power of Any Number ===");
console.log(isPowerOf(27, 3)); // true (3^3)
console.log(isPowerOf(64, 4)); // true (4^3)
console.log(isPowerOf(100, 10)); // true (10^2)

console.log("\n=== Get Exponent ===");
console.log(getExponent(16, 2)); // 4
console.log(getExponent(27, 3)); // 3

/**
 * Time Complexity:
 * - Bitwise: O(1)
 * - Loop: O(log n)
 * - Logarithm: O(1)
 *
 * Space Complexity: O(1) for all
 */
