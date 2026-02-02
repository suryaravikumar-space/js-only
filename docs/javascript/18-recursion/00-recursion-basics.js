/**
 * RECURSION: 00 - Recursion Basics
 *
 * ╔════════════════════════════════════════════════════════════════════════════╗
 * ║ THE GOLDEN RULE                                                            ║
 * ╠════════════════════════════════════════════════════════════════════════════╣
 * ║                                                                            ║
 * ║ Recursion = A function that calls itself with a SMALLER problem            ║
 * ║             until it reaches a BASE CASE (stopping condition).             ║
 * ║                                                                            ║
 * ║   function recursiveFunc(problem) {                                        ║
 * ║     if (problem is simple) return solution;  // BASE CASE                  ║
 * ║     return recursiveFunc(smaller problem);   // RECURSIVE CASE             ║
 * ║   }                                                                        ║
 * ║                                                                            ║
 * ╚════════════════════════════════════════════════════════════════════════════╝
 *
 *
 * ┌─────────────────────────────────────────────────────────────────────────────┐
 * │ WHEN TO USE RECURSION - Real World Justification                            │
 * ├─────────────────────────────────────────────────────────────────────────────┤
 * │                                                                             │
 * │ 1. TREE/GRAPH STRUCTURES                                                    │
 * │    → DOM traversal                                                          │
 * │    → File system navigation                                                 │
 * │    → JSON parsing                                                           │
 * │    → Organization hierarchies                                               │
 * │                                                                             │
 * │ 2. DIVIDE AND CONQUER                                                       │
 * │    → Merge sort, Quick sort                                                 │
 * │    → Binary search                                                          │
 * │    → Finding subsets/combinations                                           │
 * │                                                                             │
 * │ 3. PROBLEMS WITH SELF-SIMILAR SUBPROBLEMS                                   │
 * │    → Factorial (n! = n × (n-1)!)                                            │
 * │    → Fibonacci                                                              │
 * │    → Tower of Hanoi                                                         │
 * │                                                                             │
 * │ 4. WHEN LOOP DEPTH IS UNKNOWN                                               │
 * │    → Nested arrays of unknown depth                                         │
 * │    → Directory trees                                                        │
 * │                                                                             │
 * └─────────────────────────────────────────────────────────────────────────────┘
 */


// ═══════════════════════════════════════════════════════════════════════════════
// THE TWO PARTS OF RECURSION
// ═══════════════════════════════════════════════════════════════════════════════

/**
 * ┌─────────────────────────────────────────────────────────────────────────────┐
 * │ EVERY RECURSIVE FUNCTION NEEDS:                                             │
 * ├─────────────────────────────────────────────────────────────────────────────┤
 * │                                                                             │
 * │ 1. BASE CASE (Stopping Condition)                                           │
 * │    → When the problem is small enough to solve directly                     │
 * │    → MUST be reached eventually (or infinite loop!)                         │
 * │                                                                             │
 * │ 2. RECURSIVE CASE (Make Progress)                                           │
 * │    → Break problem into smaller piece                                       │
 * │    → Call itself with the smaller piece                                     │
 * │    → Combine results if needed                                              │
 * │                                                                             │
 * └─────────────────────────────────────────────────────────────────────────────┘
 */


// ═══════════════════════════════════════════════════════════════════════════════
// EXAMPLE 1: COUNTDOWN
// ═══════════════════════════════════════════════════════════════════════════════

function countdown(n) {
  // BASE CASE: Stop when n reaches 0
  if (n <= 0) {
    console.log('Done!');
    return;
  }

  // RECURSIVE CASE: Print n, then count from n-1
  console.log(n);
  countdown(n - 1);  // Smaller problem!
}

console.log('A: Countdown:');
countdown(5);

/**
 * OUTPUT:
 *   A: Countdown:
 *   5
 *   4
 *   3
 *   2
 *   1
 *   Done!
 */


// ═══════════════════════════════════════════════════════════════════════════════
// EXAMPLE 2: SUM OF ARRAY
// ═══════════════════════════════════════════════════════════════════════════════

function sumArray(arr) {
  // BASE CASE: Empty array sums to 0
  if (arr.length === 0) {
    return 0;
  }

  // RECURSIVE CASE: First element + sum of rest
  return arr[0] + sumArray(arr.slice(1));
}

console.log('\nB: Sum of [1,2,3,4,5]:', sumArray([1, 2, 3, 4, 5]));
// 15

/**
 * ┌─────────────────────────────────────────────────────────────────────────────┐
 * │ HOW sumArray([1,2,3]) WORKS:                                                │
 * ├─────────────────────────────────────────────────────────────────────────────┤
 * │                                                                             │
 * │   sumArray([1,2,3])                                                         │
 * │     = 1 + sumArray([2,3])                                                   │
 * │     = 1 + (2 + sumArray([3]))                                               │
 * │     = 1 + (2 + (3 + sumArray([])))                                          │
 * │     = 1 + (2 + (3 + 0))    ← Base case returns 0                            │
 * │     = 1 + (2 + 3)          ← Unwinding begins                               │
 * │     = 1 + 5                                                                 │
 * │     = 6                                                                     │
 * │                                                                             │
 * └─────────────────────────────────────────────────────────────────────────────┘
 */


// ═══════════════════════════════════════════════════════════════════════════════
// EXAMPLE 3: FACTORIAL
// ═══════════════════════════════════════════════════════════════════════════════

/**
 * n! = n × (n-1) × (n-2) × ... × 2 × 1
 * 5! = 5 × 4 × 3 × 2 × 1 = 120
 */

function factorial(n) {
  // BASE CASE: 0! = 1 and 1! = 1
  if (n <= 1) {
    return 1;
  }

  // RECURSIVE CASE: n! = n × (n-1)!
  return n * factorial(n - 1);
}

console.log('\nC: 5! =', factorial(5));  // 120
console.log('D: 0! =', factorial(0));    // 1

/**
 * ┌─────────────────────────────────────────────────────────────────────────────┐
 * │ HOW factorial(5) WORKS:                                                     │
 * ├─────────────────────────────────────────────────────────────────────────────┤
 * │                                                                             │
 * │   factorial(5)                                                              │
 * │     = 5 * factorial(4)                                                      │
 * │     = 5 * (4 * factorial(3))                                                │
 * │     = 5 * (4 * (3 * factorial(2)))                                          │
 * │     = 5 * (4 * (3 * (2 * factorial(1))))                                    │
 * │     = 5 * (4 * (3 * (2 * 1)))  ← Base case                                  │
 * │     = 5 * (4 * (3 * 2))                                                     │
 * │     = 5 * (4 * 6)                                                           │
 * │     = 5 * 24                                                                │
 * │     = 120                                                                   │
 * │                                                                             │
 * └─────────────────────────────────────────────────────────────────────────────┘
 */


// ═══════════════════════════════════════════════════════════════════════════════
// EXAMPLE 4: FIBONACCI
// ═══════════════════════════════════════════════════════════════════════════════

/**
 * Fibonacci: 0, 1, 1, 2, 3, 5, 8, 13, 21, ...
 * Each number is sum of previous two
 */

function fibonacci(n) {
  // BASE CASES
  if (n === 0) return 0;
  if (n === 1) return 1;

  // RECURSIVE CASE: fib(n) = fib(n-1) + fib(n-2)
  return fibonacci(n - 1) + fibonacci(n - 2);
}

console.log('\nE: First 10 Fibonacci numbers:');
for (let i = 0; i < 10; i++) {
  process.stdout.write(fibonacci(i) + ' ');
}
console.log();
// 0 1 1 2 3 5 8 13 21 34


// ═══════════════════════════════════════════════════════════════════════════════
// COMMON MISTAKES
// ═══════════════════════════════════════════════════════════════════════════════

/**
 * ┌─────────────────────────────────────────────────────────────────────────────┐
 * │ MISTAKE 1: NO BASE CASE → Infinite recursion!                               │
 * ├─────────────────────────────────────────────────────────────────────────────┤
 * │                                                                             │
 * │   function badCountdown(n) {                                                │
 * │     console.log(n);                                                         │
 * │     badCountdown(n - 1);  // Never stops!                                   │
 * │   }                                                                         │
 * │   // Results in: "RangeError: Maximum call stack size exceeded"             │
 * │                                                                             │
 * └─────────────────────────────────────────────────────────────────────────────┘
 *
 * ┌─────────────────────────────────────────────────────────────────────────────┐
 * │ MISTAKE 2: NOT MAKING PROGRESS                                              │
 * ├─────────────────────────────────────────────────────────────────────────────┤
 * │                                                                             │
 * │   function badSum(arr) {                                                    │
 * │     if (arr.length === 0) return 0;                                         │
 * │     return arr[0] + badSum(arr);  // Same array! Never shrinks!             │
 * │   }                                                                         │
 * │                                                                             │
 * └─────────────────────────────────────────────────────────────────────────────┘
 *
 * ┌─────────────────────────────────────────────────────────────────────────────┐
 * │ MISTAKE 3: WRONG BASE CASE                                                  │
 * ├─────────────────────────────────────────────────────────────────────────────┤
 * │                                                                             │
 * │   function badFactorial(n) {                                                │
 * │     if (n === 0) return 1;                                                  │
 * │     return n * badFactorial(n - 1);                                         │
 * │   }                                                                         │
 * │   badFactorial(-1);  // Infinite! Never reaches 0                           │
 * │                                                                             │
 * └─────────────────────────────────────────────────────────────────────────────┘
 */


// ═══════════════════════════════════════════════════════════════════════════════
// EXAMPLE 5: POWER FUNCTION
// ═══════════════════════════════════════════════════════════════════════════════

function power(base, exponent) {
  // BASE CASE: Anything to the power of 0 is 1
  if (exponent === 0) {
    return 1;
  }

  // RECURSIVE CASE: base^n = base × base^(n-1)
  return base * power(base, exponent - 1);
}

console.log('\nF: 2^10 =', power(2, 10));  // 1024
console.log('G: 3^4 =', power(3, 4));     // 81


// ═══════════════════════════════════════════════════════════════════════════════
// EXAMPLE 6: COUNT OCCURRENCES
// ═══════════════════════════════════════════════════════════════════════════════

function countOccurrences(arr, target) {
  // BASE CASE: Empty array
  if (arr.length === 0) {
    return 0;
  }

  // Check first element, then recurse on rest
  const countInFirst = arr[0] === target ? 1 : 0;
  return countInFirst + countOccurrences(arr.slice(1), target);
}

console.log('\nH: Count 2 in [1,2,3,2,4,2]:', countOccurrences([1, 2, 3, 2, 4, 2], 2));
// 3


/**
 * ┌─────────────────────────────────────────────────────────────────────────────┐
 * │ INTERVIEW ANSWER                                                            │
 * ├─────────────────────────────────────────────────────────────────────────────┤
 * │                                                                             │
 * │ "Recursion is when a function calls itself to solve a smaller version       │
 * │ of the same problem. Every recursive function needs two parts:              │
 * │                                                                             │
 * │ 1. BASE CASE - The simplest version that can be solved directly             │
 * │    Without this, you get infinite recursion and stack overflow              │
 * │                                                                             │
 * │ 2. RECURSIVE CASE - Break problem down and call itself with smaller input   │
 * │    Must make progress toward the base case                                  │
 * │                                                                             │
 * │ Use recursion for:                                                          │
 * │ • Tree/graph traversal (DOM, file systems)                                  │
 * │ • Problems with self-similar subproblems (factorial, fibonacci)             │
 * │ • Unknown nesting depth (flatten nested arrays)                             │
 * │ • Divide and conquer algorithms (merge sort, quick sort)                    │
 * │                                                                             │
 * │ Avoid recursion when:                                                       │
 * │ • Simple loop would work (performance overhead)                             │
 * │ • Very deep recursion (stack overflow risk)                                 │
 * │ • No natural base case exists"                                              │
 * │                                                                             │
 * └─────────────────────────────────────────────────────────────────────────────┘
 *
 *
 * RUN: node docs/18-recursion/00-recursion-basics.js
 */
