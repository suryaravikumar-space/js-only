/**
 * Answer 13: Reverse an Integer
 *
 * Multiple approaches to solve this problem:
 */

// Approach 1: Convert to String
function reverseInteger(num) {
    const sign = num < 0 ? -1 : 1;
    const reversed = parseInt(
        Math.abs(num).toString().split('').reverse().join('')
    );
    return sign * reversed;
}

// Approach 2: Mathematical Approach
function reverseIntegerMath(num) {
    const sign = num < 0 ? -1 : 1;
    let n = Math.abs(num);
    let reversed = 0;

    while (n > 0) {
        reversed = reversed * 10 + (n % 10);
        n = Math.floor(n / 10);
    }

    return sign * reversed;
}

// Approach 3: With Overflow Check (32-bit integer)
function reverseIntegerSafe(num) {
    const INT_MAX = 2147483647; // 2^31 - 1
    const INT_MIN = -2147483648; // -2^31

    const sign = num < 0 ? -1 : 1;
    let n = Math.abs(num);
    let reversed = 0;

    while (n > 0) {
        const digit = n % 10;
        n = Math.floor(n / 10);

        // Check for overflow
        if (reversed > Math.floor(INT_MAX / 10)) {
            return 0;
        }

        reversed = reversed * 10 + digit;
    }

    const result = sign * reversed;
    return result >= INT_MIN && result <= INT_MAX ? result : 0;
}

// Approach 4: Using Reduce
function reverseIntegerReduce(num) {
    const sign = num < 0 ? -1 : 1;
    const reversed = Math.abs(num)
        .toString()
        .split('')
        .reduce((acc, digit, index, arr) => {
            return acc + digit * Math.pow(10, index);
        }, 0);

    return sign * reversed;
}

// Test cases
console.log("=== String Method ===");
console.log(reverseInteger(123)); // 321
console.log(reverseInteger(-456)); // -654

console.log("\n=== Math Method ===");
console.log(reverseIntegerMath(1200)); // 21
console.log(reverseIntegerMath(0)); // 0

console.log("\n=== Safe Method (overflow check) ===");
console.log(reverseIntegerSafe(1534236469)); // 0 (overflow)
console.log(reverseIntegerSafe(123)); // 321

/**
 * Time Complexity: O(log n) - number of digits
 * Space Complexity:
 * - String: O(log n)
 * - Math: O(1)
 */
