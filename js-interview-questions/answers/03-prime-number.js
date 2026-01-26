/**
 * Answer 3: Prime Number Check
 *
 * Multiple approaches to solve this problem:
 */

// Approach 1: Basic Method
function isPrimeBasic(num) {
    if (num <= 1) return false;
    if (num <= 3) return true;

    for (let i = 2; i < num; i++) {
        if (num % i === 0) return false;
    }
    return true;
}

// Approach 2: Optimized - Check up to square root
function isPrime(num) {
    if (num <= 1) return false;
    if (num <= 3) return true;
    if (num % 2 === 0 || num % 3 === 0) return false;

    for (let i = 5; i * i <= num; i += 6) {
        if (num % i === 0 || num % (i + 2) === 0) {
            return false;
        }
    }
    return true;
}

// Approach 3: Sieve of Eratosthenes - Find all primes up to n
function findPrimesUpTo(n) {
    if (n < 2) return [];

    const sieve = new Array(n + 1).fill(true);
    sieve[0] = sieve[1] = false;

    for (let i = 2; i * i <= n; i++) {
        if (sieve[i]) {
            for (let j = i * i; j <= n; j += i) {
                sieve[j] = false;
            }
        }
    }

    return sieve.reduce((primes, isPrime, num) => {
        if (isPrime) primes.push(num);
        return primes;
    }, []);
}

// Approach 4: Find nth Prime
function findNthPrime(n) {
    if (n < 1) return null;

    let count = 0;
    let num = 1;

    while (count < n) {
        num++;
        if (isPrime(num)) count++;
    }

    return num;
}

// Test cases
console.log("=== Basic Prime Check ===");
console.log(isPrime(2)); // true
console.log(isPrime(7)); // true
console.log(isPrime(10)); // false
console.log(isPrime(1)); // false
console.log(isPrime(97)); // true

console.log("\n=== Sieve of Eratosthenes ===");
console.log(findPrimesUpTo(30)); // [2, 3, 5, 7, 11, 13, 17, 19, 23, 29]

console.log("\n=== Find nth Prime ===");
console.log(findNthPrime(10)); // 29 (10th prime)

/**
 * Time Complexity:
 * - Basic: O(n) - check all numbers up to n
 * - Optimized: O(√n) - only check up to square root
 * - Sieve: O(n log log n) - for finding all primes
 *
 * Space Complexity:
 * - Basic/Optimized: O(1)
 * - Sieve: O(n) - boolean array of size n
 */
