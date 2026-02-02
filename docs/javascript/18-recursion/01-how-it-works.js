/**
 * RECURSION: 01 - How It Works (Call Stack)
 *
 * ╔════════════════════════════════════════════════════════════════════════════╗
 * ║ THE GOLDEN RULE                                                            ║
 * ╠════════════════════════════════════════════════════════════════════════════╣
 * ║                                                                            ║
 * ║ Each recursive call creates a new STACK FRAME with its own variables.      ║
 * ║ Calls PUSH onto stack going down, then POP returning back up.              ║
 * ║                                                                            ║
 * ║   ┌─────────────┐                                                          ║
 * ║   │ factorial(1)│ ← Base case reached, start popping                       ║
 * ║   ├─────────────┤                                                          ║
 * ║   │ factorial(2)│                                                          ║
 * ║   ├─────────────┤                                                          ║
 * ║   │ factorial(3)│ ← First call                                             ║
 * ║   └─────────────┘                                                          ║
 * ║                                                                            ║
 * ╚════════════════════════════════════════════════════════════════════════════╝
 */


// ═══════════════════════════════════════════════════════════════════════════════
// TRACING THE CALL STACK
// ═══════════════════════════════════════════════════════════════════════════════

function factorialWithTrace(n, depth = 0) {
  const indent = '  '.repeat(depth);
  console.log(`${indent}factorial(${n}) called`);

  // BASE CASE
  if (n <= 1) {
    console.log(`${indent}factorial(${n}) returns 1 (base case)`);
    return 1;
  }

  // RECURSIVE CASE
  const result = n * factorialWithTrace(n - 1, depth + 1);
  console.log(`${indent}factorial(${n}) returns ${result}`);
  return result;
}

console.log('A: Tracing factorial(4):\n');
const result = factorialWithTrace(4);
console.log(`\nFinal result: ${result}`);

/**
 * OUTPUT:
 *
 * factorial(4) called
 *   factorial(3) called
 *     factorial(2) called
 *       factorial(1) called
 *       factorial(1) returns 1 (base case)
 *     factorial(2) returns 2
 *   factorial(3) returns 6
 * factorial(4) returns 24
 *
 * Final result: 24
 */


// ═══════════════════════════════════════════════════════════════════════════════
// VISUAL: CALL STACK IN ACTION
// ═══════════════════════════════════════════════════════════════════════════════

/**
 * ┌─────────────────────────────────────────────────────────────────────────────┐
 * │ PHASE 1: PUSHING (Going Down)                                               │
 * ├─────────────────────────────────────────────────────────────────────────────┤
 * │                                                                             │
 * │   factorial(4) is called                                                    │
 * │                                                                             │
 * │   Stack:  ┌────────────────┐                                                │
 * │           │ factorial(4)   │  n=4, waiting for factorial(3)                 │
 * │           └────────────────┘                                                │
 * │                                                                             │
 * │   Stack:  ┌────────────────┐                                                │
 * │           │ factorial(3)   │  n=3, waiting for factorial(2)                 │
 * │           ├────────────────┤                                                │
 * │           │ factorial(4)   │  n=4, still waiting                            │
 * │           └────────────────┘                                                │
 * │                                                                             │
 * │   Stack:  ┌────────────────┐                                                │
 * │           │ factorial(2)   │  n=2, waiting for factorial(1)                 │
 * │           ├────────────────┤                                                │
 * │           │ factorial(3)   │  n=3, still waiting                            │
 * │           ├────────────────┤                                                │
 * │           │ factorial(4)   │  n=4, still waiting                            │
 * │           └────────────────┘                                                │
 * │                                                                             │
 * │   Stack:  ┌────────────────┐                                                │
 * │           │ factorial(1)   │  n=1, BASE CASE! Returns 1                     │
 * │           ├────────────────┤                                                │
 * │           │ factorial(2)   │                                                │
 * │           ├────────────────┤                                                │
 * │           │ factorial(3)   │                                                │
 * │           ├────────────────┤                                                │
 * │           │ factorial(4)   │                                                │
 * │           └────────────────┘                                                │
 * │                                                                             │
 * └─────────────────────────────────────────────────────────────────────────────┘
 *
 * ┌─────────────────────────────────────────────────────────────────────────────┐
 * │ PHASE 2: POPPING (Going Back Up)                                            │
 * ├─────────────────────────────────────────────────────────────────────────────┤
 * │                                                                             │
 * │   factorial(1) returns 1, pops off                                          │
 * │                                                                             │
 * │   Stack:  ┌────────────────┐                                                │
 * │           │ factorial(2)   │  2 * 1 = 2, returns 2                          │
 * │           ├────────────────┤                                                │
 * │           │ factorial(3)   │                                                │
 * │           ├────────────────┤                                                │
 * │           │ factorial(4)   │                                                │
 * │           └────────────────┘                                                │
 * │                                                                             │
 * │   factorial(2) returns 2, pops off                                          │
 * │                                                                             │
 * │   Stack:  ┌────────────────┐                                                │
 * │           │ factorial(3)   │  3 * 2 = 6, returns 6                          │
 * │           ├────────────────┤                                                │
 * │           │ factorial(4)   │                                                │
 * │           └────────────────┘                                                │
 * │                                                                             │
 * │   factorial(3) returns 6, pops off                                          │
 * │                                                                             │
 * │   Stack:  ┌────────────────┐                                                │
 * │           │ factorial(4)   │  4 * 6 = 24, returns 24                        │
 * │           └────────────────┘                                                │
 * │                                                                             │
 * │   factorial(4) returns 24, pops off                                         │
 * │                                                                             │
 * │   Stack: EMPTY - Done!                                                      │
 * │                                                                             │
 * └─────────────────────────────────────────────────────────────────────────────┘
 */


// ═══════════════════════════════════════════════════════════════════════════════
// EACH CALL HAS ITS OWN VARIABLES
// ═══════════════════════════════════════════════════════════════════════════════

function sumWithVariables(arr, index = 0) {
  console.log(`  Call ${index + 1}: arr=${JSON.stringify(arr)}, index=${index}`);

  // BASE CASE
  if (index >= arr.length) {
    return 0;
  }

  // Each call has its own 'current' variable!
  const current = arr[index];
  const restSum = sumWithVariables(arr, index + 1);

  console.log(`  Returning: ${current} + ${restSum} = ${current + restSum}`);
  return current + restSum;
}

console.log('\n\nB: Each call has its own variables:');
console.log('Result:', sumWithVariables([10, 20, 30]));


// ═══════════════════════════════════════════════════════════════════════════════
// STACK OVERFLOW
// ═══════════════════════════════════════════════════════════════════════════════

/**
 * ┌─────────────────────────────────────────────────────────────────────────────┐
 * │ WHAT IS STACK OVERFLOW?                                                     │
 * ├─────────────────────────────────────────────────────────────────────────────┤
 * │                                                                             │
 * │ The call stack has a LIMITED SIZE (varies by browser/Node.js).              │
 * │                                                                             │
 * │ If recursion goes too deep without reaching base case:                      │
 * │   → Stack frames keep piling up                                             │
 * │   → Eventually no more space                                                │
 * │   → "RangeError: Maximum call stack size exceeded"                          │
 * │                                                                             │
 * │ Typical limits:                                                             │
 * │   Chrome: ~10,000 - 30,000 calls                                            │
 * │   Node.js: ~10,000 - 15,000 calls                                           │
 * │   Firefox: ~50,000 - 500,000 calls                                          │
 * │                                                                             │
 * └─────────────────────────────────────────────────────────────────────────────┘
 */

// This would cause stack overflow:
// function infiniteRecursion() {
//   return infiniteRecursion();
// }

// Safe way to test stack depth:
function measureStackDepth(depth = 0) {
  try {
    return measureStackDepth(depth + 1);
  } catch (e) {
    return depth;
  }
}

console.log('\n\nC: Max stack depth:', measureStackDepth());


// ═══════════════════════════════════════════════════════════════════════════════
// FIBONACCI CALL TREE
// ═══════════════════════════════════════════════════════════════════════════════

/**
 * ┌─────────────────────────────────────────────────────────────────────────────┐
 * │ FIBONACCI CREATES A TREE OF CALLS (Exponential!)                            │
 * ├─────────────────────────────────────────────────────────────────────────────┤
 * │                                                                             │
 * │                         fib(5)                                              │
 * │                       /        \                                            │
 * │                   fib(4)      fib(3)                                        │
 * │                  /     \      /    \                                        │
 * │              fib(3)  fib(2) fib(2) fib(1)                                   │
 * │              /   \    /  \   /  \                                           │
 * │          fib(2) fib(1) ...  ...                                             │
 * │           /  \                                                              │
 * │       fib(1) fib(0)                                                         │
 * │                                                                             │
 * │ Notice: fib(3) is calculated TWICE! fib(2) is calculated THREE times!       │
 * │ This is why naive Fibonacci is O(2^n) - extremely slow!                     │
 * │                                                                             │
 * └─────────────────────────────────────────────────────────────────────────────┘
 */

let fibCallCount = 0;

function fibWithCount(n) {
  fibCallCount++;

  if (n <= 1) return n;
  return fibWithCount(n - 1) + fibWithCount(n - 2);
}

console.log('\n\nD: Fibonacci call counts:');
for (const n of [5, 10, 15, 20]) {
  fibCallCount = 0;
  fibWithCount(n);
  console.log(`  fib(${n}) required ${fibCallCount} calls`);
}


// ═══════════════════════════════════════════════════════════════════════════════
// MEMOIZATION FIXES THE PROBLEM
// ═══════════════════════════════════════════════════════════════════════════════

function fibMemoized(n, memo = {}) {
  if (n in memo) return memo[n];
  if (n <= 1) return n;

  memo[n] = fibMemoized(n - 1, memo) + fibMemoized(n - 2, memo);
  return memo[n];
}

console.log('\n\nE: Memoized Fibonacci:');
console.log('  fib(50):', fibMemoized(50));  // Instant! (was impossible before)


/**
 * ┌─────────────────────────────────────────────────────────────────────────────┐
 * │ INTERVIEW ANSWER                                                            │
 * ├─────────────────────────────────────────────────────────────────────────────┤
 * │                                                                             │
 * │ "The call stack is how JavaScript tracks function calls. Each call          │
 * │ creates a STACK FRAME containing:                                           │
 * │                                                                             │
 * │ • Function's local variables                                                │
 * │ • Arguments passed to the function                                          │
 * │ • Return address (where to continue after return)                           │
 * │                                                                             │
 * │ In recursion:                                                               │
 * │ 1. Each call PUSHES a new frame onto the stack                              │
 * │ 2. When base case is reached, frames start POPPING                          │
 * │ 3. Each frame resumes and uses the returned value                           │
 * │                                                                             │
 * │ Stack overflow happens when:                                                │
 * │ • No base case (infinite recursion)                                         │
 * │ • Base case never reached (wrong condition)                                 │
 * │ • Input too large (legitimate deep recursion)                               │
 * │                                                                             │
 * │ Solutions:                                                                  │
 * │ • Memoization (cache results to avoid repeated calls)                       │
 * │ • Tail recursion (some engines optimize this)                               │
 * │ • Convert to iteration (uses heap instead of stack)"                        │
 * │                                                                             │
 * └─────────────────────────────────────────────────────────────────────────────┘
 *
 *
 * RUN: node docs/18-recursion/01-how-it-works.js
 */
