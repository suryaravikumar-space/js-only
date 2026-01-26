/**
 * Question 3: Prime Number Check
 *
 * A prime number is a natural number greater than 1 that has no positive
 * divisors other than 1 and itself.
 *
 * Examples:
 * - 2 -> true (first prime)
 * - 7 -> true
 * - 10 -> false (divisible by 2 and 5)
 * - 1 -> false (not prime by definition)
 *
 * Task: Write a function to check if a number is prime.
 *
 * Bonus: Write a function to find all primes up to n (Sieve of Eratosthenes)
 */

function isPrime(num) {
    // Your solution here
}

function findPrimesUpTo(n) {
    // Bonus: Your solution here
}

// Test cases
console.log(isPrime(2)); // true
console.log(isPrime(7)); // true
console.log(isPrime(10)); // false
console.log(isPrime(1)); // false
console.log(isPrime(97)); // true

console.log(findPrimesUpTo(30)); // [2, 3, 5, 7, 11, 13, 17, 19, 23, 29]
