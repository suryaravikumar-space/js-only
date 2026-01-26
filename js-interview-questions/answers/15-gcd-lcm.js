/**
 * Answer 15: GCD and LCM
 *
 * Multiple approaches to solve this problem:
 */

// Approach 1: Euclidean Algorithm (Iterative)
function gcd(a, b) {
    a = Math.abs(a);
    b = Math.abs(b);

    while (b !== 0) {
        [a, b] = [b, a % b];
    }

    return a;
}

// Approach 2: Euclidean Algorithm (Recursive)
function gcdRecursive(a, b) {
    a = Math.abs(a);
    b = Math.abs(b);

    if (b === 0) return a;
    return gcdRecursive(b, a % b);
}

// LCM using GCD: LCM(a, b) = |a * b| / GCD(a, b)
function lcm(a, b) {
    return Math.abs(a * b) / gcd(a, b);
}

// Approach 3: GCD of array of numbers
function gcdArray(arr) {
    return arr.reduce((acc, num) => gcd(acc, num));
}

// LCM of array of numbers
function lcmArray(arr) {
    return arr.reduce((acc, num) => lcm(acc, num));
}

// Approach 4: Extended Euclidean Algorithm
// Returns { gcd, x, y } such that ax + by = gcd(a, b)
function extendedGcd(a, b) {
    if (b === 0) {
        return { gcd: a, x: 1, y: 0 };
    }

    const result = extendedGcd(b, a % b);
    return {
        gcd: result.gcd,
        x: result.y,
        y: result.x - Math.floor(a / b) * result.y
    };
}

// Approach 5: Brute Force GCD (for understanding)
function gcdBruteForce(a, b) {
    a = Math.abs(a);
    b = Math.abs(b);

    let result = 1;
    for (let i = 1; i <= Math.min(a, b); i++) {
        if (a % i === 0 && b % i === 0) {
            result = i;
        }
    }
    return result;
}

// Test cases
console.log("=== GCD ===");
console.log(gcd(12, 18)); // 6
console.log(gcd(48, 18)); // 6

console.log("\n=== LCM ===");
console.log(lcm(4, 6)); // 12
console.log(lcm(3, 5)); // 15

console.log("\n=== GCD of Array ===");
console.log(gcdArray([12, 18, 24])); // 6

console.log("\n=== LCM of Array ===");
console.log(lcmArray([2, 3, 4])); // 12

console.log("\n=== Extended GCD ===");
console.log(extendedGcd(12, 18)); // { gcd: 6, x: -1, y: 1 }

/**
 * Time Complexity:
 * - Euclidean: O(log(min(a, b)))
 * - Brute Force: O(min(a, b))
 *
 * Space Complexity:
 * - Iterative: O(1)
 * - Recursive: O(log(min(a, b)))
 */
