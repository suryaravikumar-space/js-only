/**
 * RECURSION: 08 - Tricky Examples
 *
 * ╔════════════════════════════════════════════════════════════════════════════╗
 * ║ PREDICT THE OUTPUT - INTERVIEW GOTCHAS                                     ║
 * ╠════════════════════════════════════════════════════════════════════════════╣
 * ║                                                                            ║
 * ║ These examples test deep understanding of recursive execution.             ║
 * ║                                                                            ║
 * ╚════════════════════════════════════════════════════════════════════════════╝
 */


// ═══════════════════════════════════════════════════════════════════════════════
// GOTCHA 1: ORDER OF OPERATIONS
// ═══════════════════════════════════════════════════════════════════════════════

console.log('=== GOTCHA 1: Order of Operations ===\n');

function mystery1(n) {
  if (n === 0) return;
  console.log('Before:', n);
  mystery1(n - 1);
  console.log('After:', n);
}

console.log('A: mystery1(3):');
mystery1(3);

/**
 * PREDICT: ___
 *
 * ACTUAL:
 *   Before: 3
 *   Before: 2
 *   Before: 1
 *   After: 1
 *   After: 2
 *   After: 3
 *
 * WHY? "Before" logs as we go DOWN.
 *      "After" logs as we come back UP (stack unwinds).
 */


// ═══════════════════════════════════════════════════════════════════════════════
// GOTCHA 2: RETURN VALUES MATTER
// ═══════════════════════════════════════════════════════════════════════════════

console.log('\n=== GOTCHA 2: Return Values ===\n');

function mystery2(n) {
  if (n <= 0) return 0;
  mystery2(n - 1);  // NOT returning!
  return n;
}

console.log('B:', mystery2(5));

/**
 * PREDICT: ___
 *
 * ACTUAL: 5
 *
 * WHY? The recursive call result is IGNORED!
 *      It just returns n (5) at the end.
 */


// ═══════════════════════════════════════════════════════════════════════════════
// GOTCHA 3: ACCUMULATOR POSITION
// ═══════════════════════════════════════════════════════════════════════════════

console.log('\n=== GOTCHA 3: Accumulator Position ===\n');

function buildString1(n) {
  if (n === 0) return '';
  return n + buildString1(n - 1);  // n FIRST
}

function buildString2(n) {
  if (n === 0) return '';
  return buildString2(n - 1) + n;  // n LAST
}

console.log('C: buildString1(3):', buildString1(3));
console.log('D: buildString2(3):', buildString2(3));

/**
 * PREDICT: ___
 *
 * ACTUAL:
 *   C: "321"  (n added first, then recursion)
 *   D: "123"  (recursion first, then n added)
 */


// ═══════════════════════════════════════════════════════════════════════════════
// GOTCHA 4: MULTIPLE RECURSIVE CALLS
// ═══════════════════════════════════════════════════════════════════════════════

console.log('\n=== GOTCHA 4: Multiple Recursive Calls ===\n');

function mystery4(n) {
  if (n <= 0) return 0;
  if (n === 1) return 1;
  return mystery4(n - 1) + mystery4(n - 2) + 1;
}

console.log('E: mystery4(4):', mystery4(4));

/**
 * Call tree:
 *   mystery4(4)
 *     = mystery4(3) + mystery4(2) + 1
 *     = (mystery4(2) + mystery4(1) + 1) + (mystery4(1) + mystery4(0) + 1) + 1
 *     = ((mystery4(1) + mystery4(0) + 1) + 1 + 1) + (1 + 0 + 1) + 1
 *     = ((1 + 0 + 1) + 1 + 1) + 2 + 1
 *     = (2 + 2) + 3
 *     = 7
 */


// ═══════════════════════════════════════════════════════════════════════════════
// GOTCHA 5: MUTATING SHARED STATE
// ═══════════════════════════════════════════════════════════════════════════════

console.log('\n=== GOTCHA 5: Shared State ===\n');

let counter = 0;

function mystery5(n) {
  if (n === 0) return;
  counter++;
  mystery5(n - 1);
  counter++;
}

mystery5(3);
console.log('F: counter:', counter);

/**
 * PREDICT: ___
 *
 * ACTUAL: 6
 *
 * WHY? Counter++ happens twice per call (before and after recursion)
 *      3 calls × 2 = 6
 */


// ═══════════════════════════════════════════════════════════════════════════════
// GOTCHA 6: ARRAY MUTATION
// ═══════════════════════════════════════════════════════════════════════════════

console.log('\n=== GOTCHA 6: Array Mutation ===\n');

function mystery6(arr, n) {
  if (n === 0) return;
  arr.push(n);
  mystery6(arr, n - 1);
  arr.push(n);
}

const result6 = [];
mystery6(result6, 3);
console.log('G:', result6);

/**
 * PREDICT: ___
 *
 * ACTUAL: [3, 2, 1, 1, 2, 3]
 *
 * WHY? Push before recursion (going down): 3, 2, 1
 *      Push after recursion (coming up): 1, 2, 3
 */


// ═══════════════════════════════════════════════════════════════════════════════
// GOTCHA 7: OFF BY ONE
// ═══════════════════════════════════════════════════════════════════════════════

console.log('\n=== GOTCHA 7: Off By One ===\n');

function sum1(n) {
  if (n === 0) return 0;
  return n + sum1(n - 1);
}

function sum2(n) {
  if (n === 1) return 1;  // Different base case!
  return n + sum2(n - 1);
}

console.log('H: sum1(5):', sum1(5));  // 1+2+3+4+5 = 15
console.log('I: sum2(5):', sum2(5));  // 1+2+3+4+5 = 15

// But what about sum2(0)?
try {
  console.log('J: sum2(0):', sum2(0));
} catch (e) {
  console.log('J: sum2(0) causes:', e.message);
}

/**
 * sum2(0) causes infinite recursion because it never reaches base case!
 */


// ═══════════════════════════════════════════════════════════════════════════════
// GOTCHA 8: REFERENCE VS VALUE
// ═══════════════════════════════════════════════════════════════════════════════

console.log('\n=== GOTCHA 8: Reference vs Value ===\n');

function mystery8a(arr) {
  if (arr.length === 0) return;
  arr.pop();  // Mutates original!
  mystery8a(arr);
}

const arr8a = [1, 2, 3];
mystery8a(arr8a);
console.log('K: arr8a after mystery8a:', arr8a);

// With slice (no mutation)
function mystery8b(arr) {
  if (arr.length === 0) return;
  mystery8b(arr.slice(0, -1));  // Creates new array
}

const arr8b = [1, 2, 3];
mystery8b(arr8b);
console.log('L: arr8b after mystery8b:', arr8b);

/**
 * ACTUAL:
 *   K: []      (original mutated)
 *   L: [1,2,3] (original unchanged)
 */


// ═══════════════════════════════════════════════════════════════════════════════
// GOTCHA 9: EARLY RETURN
// ═══════════════════════════════════════════════════════════════════════════════

console.log('\n=== GOTCHA 9: Early Return ===\n');

function find(arr, target, i = 0) {
  if (i >= arr.length) return -1;
  if (arr[i] === target) return i;

  const result = find(arr, target, i + 1);
  console.log(`  Checked index ${i}, result so far: ${result}`);
  return result;
}

console.log('M: find([1,2,3,4,5], 3):');
console.log('   Found at:', find([1, 2, 3, 4, 5], 3));

/**
 * Notice: The log shows unwinding AFTER finding!
 * The result (2) propagates back through all returns.
 */


// ═══════════════════════════════════════════════════════════════════════════════
// GOTCHA 10: FIBONACCI CALL COUNT
// ═══════════════════════════════════════════════════════════════════════════════

console.log('\n=== GOTCHA 10: Fibonacci Explosion ===\n');

let fibCalls = 0;

function fib(n) {
  fibCalls++;
  if (n <= 1) return n;
  return fib(n - 1) + fib(n - 2);
}

fib(10);
console.log('N: fib(10) took', fibCalls, 'calls');

fibCalls = 0;
fib(20);
console.log('O: fib(20) took', fibCalls, 'calls');

/**
 * ACTUAL:
 *   N: 177 calls
 *   O: 21891 calls
 *
 * This is why memoization is CRITICAL for overlapping subproblems!
 */


/**
 * ┌─────────────────────────────────────────────────────────────────────────────┐
 * │ KEY GOTCHAS SUMMARY                                                         │
 * ├─────────────────────────────────────────────────────────────────────────────┤
 * │                                                                             │
 * │ 1. Code BEFORE recursion runs going DOWN                                    │
 * │ 2. Code AFTER recursion runs coming back UP                                 │
 * │ 3. Forgetting to RETURN recursive call loses result                         │
 * │ 4. n + recurse() vs recurse() + n gives different order                     │
 * │ 5. Multiple calls create exponential growth                                 │
 * │ 6. Mutating shared state affects all calls                                  │
 * │ 7. Wrong base case can cause infinite recursion                             │
 * │ 8. Arrays passed by reference can be mutated                                │
 * │ 9. Results propagate back through all returns                               │
 * │ 10. Without memoization, overlapping subproblems explode                    │
 * │                                                                             │
 * └─────────────────────────────────────────────────────────────────────────────┘
 *
 *
 * RUN: node docs/18-recursion/08-tricky-examples.js
 */
