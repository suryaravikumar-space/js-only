/**
 * RECURSION: 02 - Classic Examples
 *
 * ╔════════════════════════════════════════════════════════════════════════════╗
 * ║ ESSENTIAL RECURSIVE PATTERNS FOR INTERVIEWS                                ║
 * ╠════════════════════════════════════════════════════════════════════════════╣
 * ║                                                                            ║
 * ║ These classic problems appear in almost every technical interview.         ║
 * ║ Master these patterns to handle any recursive problem.                     ║
 * ║                                                                            ║
 * ╚════════════════════════════════════════════════════════════════════════════╝
 */


// ═══════════════════════════════════════════════════════════════════════════════
// 1. FACTORIAL
// ═══════════════════════════════════════════════════════════════════════════════

/**
 * n! = n × (n-1) × (n-2) × ... × 1
 * 5! = 5 × 4 × 3 × 2 × 1 = 120
 */

function factorial(n) {
  if (n <= 1) return 1;
  return n * factorial(n - 1);
}

console.log('1. Factorial:');
console.log('   5! =', factorial(5));   // 120
console.log('   10! =', factorial(10)); // 3628800


// ═══════════════════════════════════════════════════════════════════════════════
// 2. FIBONACCI
// ═══════════════════════════════════════════════════════════════════════════════

/**
 * fib(0) = 0, fib(1) = 1
 * fib(n) = fib(n-1) + fib(n-2)
 */

// Naive (slow - O(2^n))
function fibNaive(n) {
  if (n <= 1) return n;
  return fibNaive(n - 1) + fibNaive(n - 2);
}

// Memoized (fast - O(n))
function fibonacci(n, memo = {}) {
  if (n in memo) return memo[n];
  if (n <= 1) return n;
  memo[n] = fibonacci(n - 1, memo) + fibonacci(n - 2, memo);
  return memo[n];
}

console.log('\n2. Fibonacci:');
console.log('   fib(10) =', fibonacci(10));  // 55
console.log('   fib(20) =', fibonacci(20));  // 6765


// ═══════════════════════════════════════════════════════════════════════════════
// 3. POWER / EXPONENTIATION
// ═══════════════════════════════════════════════════════════════════════════════

// Simple O(n)
function power(base, exp) {
  if (exp === 0) return 1;
  return base * power(base, exp - 1);
}

// Fast power O(log n)
function fastPower(base, exp) {
  if (exp === 0) return 1;
  if (exp % 2 === 0) {
    const half = fastPower(base, exp / 2);
    return half * half;
  } else {
    return base * fastPower(base, exp - 1);
  }
}

console.log('\n3. Power:');
console.log('   2^10 =', power(2, 10));       // 1024
console.log('   2^10 (fast) =', fastPower(2, 10)); // 1024


// ═══════════════════════════════════════════════════════════════════════════════
// 4. SUM OF ARRAY
// ═══════════════════════════════════════════════════════════════════════════════

function sumArray(arr, index = 0) {
  if (index >= arr.length) return 0;
  return arr[index] + sumArray(arr, index + 1);
}

console.log('\n4. Sum of Array:');
console.log('   sum([1,2,3,4,5]) =', sumArray([1, 2, 3, 4, 5]));  // 15


// ═══════════════════════════════════════════════════════════════════════════════
// 5. REVERSE STRING
// ═══════════════════════════════════════════════════════════════════════════════

function reverseString(str) {
  if (str.length <= 1) return str;
  return reverseString(str.slice(1)) + str[0];
}

console.log('\n5. Reverse String:');
console.log('   reverse("hello") =', reverseString('hello'));  // "olleh"


// ═══════════════════════════════════════════════════════════════════════════════
// 6. PALINDROME CHECK
// ═══════════════════════════════════════════════════════════════════════════════

function isPalindrome(str) {
  // Normalize: remove non-alphanumeric, lowercase
  str = str.toLowerCase().replace(/[^a-z0-9]/g, '');

  if (str.length <= 1) return true;
  if (str[0] !== str[str.length - 1]) return false;
  return isPalindrome(str.slice(1, -1));
}

console.log('\n6. Palindrome:');
console.log('   isPalindrome("racecar") =', isPalindrome('racecar'));  // true
console.log('   isPalindrome("hello") =', isPalindrome('hello'));      // false
console.log('   isPalindrome("A man a plan a canal Panama") =',
  isPalindrome('A man a plan a canal Panama'));  // true


// ═══════════════════════════════════════════════════════════════════════════════
// 7. BINARY SEARCH
// ═══════════════════════════════════════════════════════════════════════════════

function binarySearch(arr, target, left = 0, right = arr.length - 1) {
  if (left > right) return -1;

  const mid = Math.floor((left + right) / 2);

  if (arr[mid] === target) return mid;
  if (arr[mid] > target) return binarySearch(arr, target, left, mid - 1);
  return binarySearch(arr, target, mid + 1, right);
}

console.log('\n7. Binary Search:');
const sorted = [1, 3, 5, 7, 9, 11, 13, 15];
console.log('   find 7 in', sorted, '→ index', binarySearch(sorted, 7));  // 3
console.log('   find 6 in', sorted, '→ index', binarySearch(sorted, 6));  // -1


// ═══════════════════════════════════════════════════════════════════════════════
// 8. COUNT OCCURRENCES
// ═══════════════════════════════════════════════════════════════════════════════

function countOccurrences(arr, target, index = 0) {
  if (index >= arr.length) return 0;
  const count = arr[index] === target ? 1 : 0;
  return count + countOccurrences(arr, target, index + 1);
}

console.log('\n8. Count Occurrences:');
console.log('   count 2 in [1,2,3,2,4,2] =', countOccurrences([1, 2, 3, 2, 4, 2], 2));  // 3


// ═══════════════════════════════════════════════════════════════════════════════
// 9. FIND MAX
// ═══════════════════════════════════════════════════════════════════════════════

function findMax(arr, index = 0) {
  if (index === arr.length - 1) return arr[index];
  const maxOfRest = findMax(arr, index + 1);
  return arr[index] > maxOfRest ? arr[index] : maxOfRest;
}

console.log('\n9. Find Max:');
console.log('   max of [3,1,4,1,5,9,2,6] =', findMax([3, 1, 4, 1, 5, 9, 2, 6]));  // 9


// ═══════════════════════════════════════════════════════════════════════════════
// 10. FLATTEN NESTED ARRAY
// ═══════════════════════════════════════════════════════════════════════════════

function flatten(arr) {
  let result = [];

  for (const item of arr) {
    if (Array.isArray(item)) {
      result = result.concat(flatten(item));  // Recurse!
    } else {
      result.push(item);
    }
  }

  return result;
}

console.log('\n10. Flatten Array:');
console.log('    flatten([1,[2,[3,[4]],5]]) =', flatten([1, [2, [3, [4]], 5]]));
// [1, 2, 3, 4, 5]


// ═══════════════════════════════════════════════════════════════════════════════
// 11. GCD (Greatest Common Divisor) - EUCLIDEAN ALGORITHM
// ═══════════════════════════════════════════════════════════════════════════════

function gcd(a, b) {
  if (b === 0) return a;
  return gcd(b, a % b);
}

console.log('\n11. GCD:');
console.log('    gcd(48, 18) =', gcd(48, 18));  // 6
console.log('    gcd(100, 25) =', gcd(100, 25));  // 25


// ═══════════════════════════════════════════════════════════════════════════════
// 12. SUM OF DIGITS
// ═══════════════════════════════════════════════════════════════════════════════

function sumDigits(n) {
  if (n < 10) return n;
  return (n % 10) + sumDigits(Math.floor(n / 10));
}

console.log('\n12. Sum of Digits:');
console.log('    sumDigits(12345) =', sumDigits(12345));  // 15


/**
 * ┌─────────────────────────────────────────────────────────────────────────────┐
 * │ PATTERN SUMMARY                                                             │
 * ├─────────────────────────────────────────────────────────────────────────────┤
 * │                                                                             │
 * │ LINEAR RECURSION (one recursive call):                                      │
 * │ • Factorial, Sum, Reverse, Palindrome, CountOccurrences                     │
 * │ • O(n) time, O(n) space                                                     │
 * │                                                                             │
 * │ BINARY/DIVIDE (split problem in half):                                      │
 * │ • Binary Search, Fast Power                                                 │
 * │ • O(log n) time                                                             │
 * │                                                                             │
 * │ TREE RECURSION (multiple recursive calls):                                  │
 * │ • Fibonacci (naive), Tree traversal                                         │
 * │ • O(2^n) time without memoization!                                          │
 * │ • With memoization: O(n)                                                    │
 * │                                                                             │
 * │ NESTED STRUCTURE RECURSION:                                                 │
 * │ • Flatten, Deep clone, DOM traversal                                        │
 * │ • Depth depends on nesting level                                            │
 * │                                                                             │
 * └─────────────────────────────────────────────────────────────────────────────┘
 *
 *
 * RUN: node docs/18-recursion/02-classic-examples.js
 */
