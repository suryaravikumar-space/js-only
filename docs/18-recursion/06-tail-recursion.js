/**
 * RECURSION: 06 - Tail Recursion
 *
 * ╔════════════════════════════════════════════════════════════════════════════╗
 * ║ THE GOLDEN RULE                                                            ║
 * ╠════════════════════════════════════════════════════════════════════════════╣
 * ║                                                                            ║
 * ║ Tail recursion = The recursive call is the LAST operation.                 ║
 * ║ No computation happens AFTER the recursive call returns.                   ║
 * ║                                                                            ║
 * ║   NOT TAIL:  return n * factorial(n-1)   // Must multiply AFTER            ║
 * ║   TAIL:      return factorial(n-1, n*acc) // Nothing after!                ║
 * ║                                                                            ║
 * ╚════════════════════════════════════════════════════════════════════════════╝
 */


// ═══════════════════════════════════════════════════════════════════════════════
// NON-TAIL RECURSIVE vs TAIL RECURSIVE
// ═══════════════════════════════════════════════════════════════════════════════

// ❌ NOT TAIL RECURSIVE
function factorial(n) {
  if (n <= 1) return 1;
  return n * factorial(n - 1);  // Must wait for result, then multiply
}

// ✅ TAIL RECURSIVE
function factorialTail(n, accumulator = 1) {
  if (n <= 1) return accumulator;
  return factorialTail(n - 1, n * accumulator);  // Nothing after!
}

console.log('A: factorial(5):', factorial(5));          // 120
console.log('B: factorialTail(5):', factorialTail(5));  // 120


/**
 * ┌─────────────────────────────────────────────────────────────────────────────┐
 * │ WHY TAIL RECURSION MATTERS                                                  │
 * ├─────────────────────────────────────────────────────────────────────────────┤
 * │                                                                             │
 * │ NON-TAIL RECURSIVE CALL STACK:                                              │
 * │ ┌─────────────────────────┐                                                 │
 * │ │ factorial(1) → returns 1│                                                 │
 * │ ├─────────────────────────┤                                                 │
 * │ │ factorial(2) → 2 * ?    │ waiting for result                              │
 * │ ├─────────────────────────┤                                                 │
 * │ │ factorial(3) → 3 * ?    │ waiting for result                              │
 * │ ├─────────────────────────┤                                                 │
 * │ │ factorial(4) → 4 * ?    │ waiting for result                              │
 * │ └─────────────────────────┘                                                 │
 * │ Stack grows with each call!                                                 │
 * │                                                                             │
 * │ TAIL RECURSIVE (with TCO):                                                  │
 * │ ┌─────────────────────────┐                                                 │
 * │ │ factorial(4, 1)         │ → factorial(3, 4)                               │
 * │ └─────────────────────────┘ → factorial(2, 12)                              │
 * │   Same frame reused!        → factorial(1, 24)                              │
 * │                             → 24                                            │
 * │ Stack stays constant size!                                                  │
 * │                                                                             │
 * └─────────────────────────────────────────────────────────────────────────────┘
 */


// ═══════════════════════════════════════════════════════════════════════════════
// MORE EXAMPLES: CONVERTING TO TAIL RECURSIVE
// ═══════════════════════════════════════════════════════════════════════════════

// SUM ARRAY

// ❌ NOT TAIL
function sum(arr, i = 0) {
  if (i >= arr.length) return 0;
  return arr[i] + sum(arr, i + 1);  // Must add AFTER
}

// ✅ TAIL
function sumTail(arr, i = 0, acc = 0) {
  if (i >= arr.length) return acc;
  return sumTail(arr, i + 1, acc + arr[i]);  // Nothing after!
}

console.log('\nC: sum([1,2,3,4,5]):', sum([1, 2, 3, 4, 5]));          // 15
console.log('D: sumTail([1,2,3,4,5]):', sumTail([1, 2, 3, 4, 5]));  // 15


// FIBONACCI

// ❌ NOT TAIL (tree recursion)
function fib(n) {
  if (n <= 1) return n;
  return fib(n - 1) + fib(n - 2);  // TWO calls, must add results
}

// ✅ TAIL (linear)
function fibTail(n, a = 0, b = 1) {
  if (n === 0) return a;
  if (n === 1) return b;
  return fibTail(n - 1, b, a + b);  // Nothing after!
}

console.log('\nE: fib(10):', fib(10));          // 55
console.log('F: fibTail(10):', fibTail(10));  // 55


// REVERSE STRING

// ❌ NOT TAIL
function reverse(str) {
  if (str.length <= 1) return str;
  return reverse(str.slice(1)) + str[0];  // Must concat AFTER
}

// ✅ TAIL
function reverseTail(str, acc = '') {
  if (str.length === 0) return acc;
  return reverseTail(str.slice(1), str[0] + acc);  // Nothing after!
}

console.log('\nG: reverse("hello"):', reverse('hello'));          // "olleh"
console.log('H: reverseTail("hello"):', reverseTail('hello'));  // "olleh"


// ═══════════════════════════════════════════════════════════════════════════════
// THE ACCUMULATOR PATTERN
// ═══════════════════════════════════════════════════════════════════════════════

/**
 * ┌─────────────────────────────────────────────────────────────────────────────┐
 * │ HOW TO CONVERT TO TAIL RECURSIVE                                            │
 * ├─────────────────────────────────────────────────────────────────────────────┤
 * │                                                                             │
 * │ 1. Add an ACCUMULATOR parameter (default to identity value)                 │
 * │    • For multiplication: acc = 1                                            │
 * │    • For addition: acc = 0                                                  │
 * │    • For strings: acc = ''                                                  │
 * │    • For arrays: acc = []                                                   │
 * │                                                                             │
 * │ 2. Move computation INTO the recursive call                                 │
 * │    • Before: return x + recurse(...)                                        │
 * │    • After:  return recurse(..., acc + x)                                   │
 * │                                                                             │
 * │ 3. Return accumulator in base case                                          │
 * │                                                                             │
 * └─────────────────────────────────────────────────────────────────────────────┘
 */


// LENGTH OF ARRAY (tail recursive)
function length(arr, i = 0, acc = 0) {
  if (i >= arr.length) return acc;
  return length(arr, i + 1, acc + 1);
}

console.log('\nI: length([1,2,3,4,5]):', length([1, 2, 3, 4, 5]));  // 5


// ═══════════════════════════════════════════════════════════════════════════════
// JAVASCRIPT'S TCO REALITY
// ═══════════════════════════════════════════════════════════════════════════════

/**
 * ┌─────────────────────────────────────────────────────────────────────────────┐
 * │ TAIL CALL OPTIMIZATION (TCO) IN JAVASCRIPT                                  │
 * ├─────────────────────────────────────────────────────────────────────────────┤
 * │                                                                             │
 * │ ES6 specifies TCO, BUT...                                                   │
 * │                                                                             │
 * │ ❌ Chrome/V8: Not implemented                                               │
 * │ ❌ Firefox: Not implemented                                                 │
 * │ ❌ Node.js: Not implemented                                                 │
 * │ ✅ Safari: Implemented!                                                     │
 * │                                                                             │
 * │ PRACTICAL ADVICE:                                                           │
 * │ • Don't rely on TCO in JavaScript                                           │
 * │ • For deep recursion, use ITERATION instead                                 │
 * │ • Or use a TRAMPOLINE pattern                                               │
 * │                                                                             │
 * └─────────────────────────────────────────────────────────────────────────────┘
 */


// ═══════════════════════════════════════════════════════════════════════════════
// TRAMPOLINE PATTERN (Works everywhere!)
// ═══════════════════════════════════════════════════════════════════════════════

function trampoline(fn) {
  return function(...args) {
    let result = fn(...args);
    while (typeof result === 'function') {
      result = result();
    }
    return result;
  };
}

// Return a function instead of calling recursively
function factorialTramp(n, acc = 1) {
  if (n <= 1) return acc;
  return () => factorialTramp(n - 1, n * acc);  // Return function!
}

const safeFact = trampoline(factorialTramp);

console.log('\nJ: safeFact(5):', safeFact(5));  // 120
console.log('K: safeFact(10000): (no stack overflow!)');  // Works!
// console.log(safeFact(10000));  // Would work without stack overflow


/**
 * ┌─────────────────────────────────────────────────────────────────────────────┐
 * │ INTERVIEW TIP                                                               │
 * ├─────────────────────────────────────────────────────────────────────────────┤
 * │                                                                             │
 * │ If asked about tail recursion:                                              │
 * │                                                                             │
 * │ 1. Know the definition: recursive call is LAST operation                    │
 * │ 2. Know how to convert: use accumulator pattern                             │
 * │ 3. Know the reality: JS doesn't reliably support TCO                        │
 * │ 4. Know alternatives: iteration or trampoline                               │
 * │                                                                             │
 * │ Show you understand the concept even if you can't rely on it!               │
 * │                                                                             │
 * └─────────────────────────────────────────────────────────────────────────────┘
 *
 *
 * RUN: node docs/18-recursion/06-tail-recursion.js
 */
