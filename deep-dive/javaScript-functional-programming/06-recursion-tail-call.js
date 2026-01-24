/**
 * ═══════════════════════════════════════════════════════════════════════════
 * FUNCTIONAL PROGRAMMING - FILE 6: RECURSION & TAIL CALL OPTIMIZATION
 * ═══════════════════════════════════════════════════════════════════════════
 *
 * Recursion is fundamental to functional programming. Understanding how it
 * works and how to optimize it is crucial for writing efficient FP code.
 */

console.log("═══════════════════════════════════════════════════════════════════");
console.log("       RECURSION & TAIL CALL OPTIMIZATION                          ");
console.log("═══════════════════════════════════════════════════════════════════\n");

/**
 * ╔═══════════════════════════════════════════════════════════════════════════╗
 * ║                        WHAT IS RECURSION?                                  ║
 * ╠═══════════════════════════════════════════════════════════════════════════╣
 * ║                                                                            ║
 * ║  Recursion is when a function calls itself to solve smaller instances    ║
 * ║  of the same problem.                                                      ║
 * ║                                                                            ║
 * ║  ┌─────────────────────────────────────────────────────────────────────┐  ║
 * ║  │                                                                      │  ║
 * ║  │  Every recursive function has:                                       │  ║
 * ║  │                                                                      │  ║
 * ║  │  1. BASE CASE - When to stop (prevents infinite recursion)          │  ║
 * ║  │                                                                      │  ║
 * ║  │  2. RECURSIVE CASE - Calls itself with a smaller problem            │  ║
 * ║  │                                                                      │  ║
 * ║  │  factorial(5)                                                        │  ║
 * ║  │       │                                                              │  ║
 * ║  │       ▼                                                              │  ║
 * ║  │  5 * factorial(4)                                                    │  ║
 * ║  │           │                                                          │  ║
 * ║  │           ▼                                                          │  ║
 * ║  │      4 * factorial(3)                                                │  ║
 * ║  │               │                                                      │  ║
 * ║  │               ▼                                                      │  ║
 * ║  │          3 * factorial(2)                                            │  ║
 * ║  │                   │                                                  │  ║
 * ║  │                   ▼                                                  │  ║
 * ║  │              2 * factorial(1)                                        │  ║
 * ║  │                       │                                              │  ║
 * ║  │                       ▼                                              │  ║
 * ║  │                      1  ← BASE CASE                                  │  ║
 * ║  │                                                                      │  ║
 * ║  └─────────────────────────────────────────────────────────────────────┘  ║
 * ║                                                                            ║
 * ╚═══════════════════════════════════════════════════════════════════════════╝
 */

console.log("1️⃣  BASIC RECURSION\n");

// Classic factorial
function factorial(n) {
  // Base case
  if (n <= 1) return 1;
  // Recursive case
  return n * factorial(n - 1);
}

console.log("=== Factorial ===");
console.log("factorial(5) =", factorial(5));  // 120
console.log("factorial(0) =", factorial(0));  // 1


// Fibonacci sequence
function fibonacci(n) {
  if (n <= 1) return n;
  return fibonacci(n - 1) + fibonacci(n - 2);
}

console.log("\n=== Fibonacci ===");
console.log("First 10 Fibonacci numbers:");
for (let i = 0; i < 10; i++) {
  process.stdout.write(fibonacci(i) + " ");
}
console.log();


// Sum of array
function sum(arr) {
  if (arr.length === 0) return 0;
  const [first, ...rest] = arr;
  return first + sum(rest);
}

console.log("\n=== Sum Array ===");
console.log("sum([1, 2, 3, 4, 5]) =", sum([1, 2, 3, 4, 5]));


/**
 * ═══════════════════════════════════════════════════════════════════════════
 *                    RECURSION VS LOOPS
 * ═══════════════════════════════════════════════════════════════════════════
 */

console.log("\n" + "═".repeat(70));
console.log("2️⃣  RECURSION VS LOOPS\n");

/**
 * ┌───────────────────────────────────────────────────────────────────────────┐
 * │                     RECURSION vs ITERATION                                 │
 * ├───────────────────────────────────────────────────────────────────────────┤
 * │                                                                            │
 * │  Recursion:                          Iteration:                           │
 * │  • State in function parameters      • State in variables                 │
 * │  • Uses call stack                   • Uses loop constructs               │
 * │  • Can be more elegant               • Often more performant              │
 * │  • Risk of stack overflow            • No stack concerns                  │
 * │  • Natural for tree/graph traversal  • Better for simple counting         │
 * │                                                                            │
 * │  In FP, recursion is preferred because:                                   │
 * │  • No mutable variables              • Matches mathematical definitions   │
 * │  • Each call is independent          • Works with immutable data          │
 * │                                                                            │
 * └───────────────────────────────────────────────────────────────────────────┘
 */

// Iterative vs Recursive comparison
console.log("=== Sum: Iterative vs Recursive ===\n");

// Iterative (mutable state)
function sumIterative(arr) {
  let total = 0;
  for (let i = 0; i < arr.length; i++) {
    total += arr[i];
  }
  return total;
}

// Recursive (no mutation)
function sumRecursive(arr) {
  if (arr.length === 0) return 0;
  return arr[0] + sumRecursive(arr.slice(1));
}

const nums = [1, 2, 3, 4, 5];
console.log("Iterative sum:", sumIterative(nums));
console.log("Recursive sum:", sumRecursive(nums));


// Map implementation comparison
console.log("\n=== Map: Iterative vs Recursive ===\n");

function mapIterative(arr, fn) {
  const result = [];
  for (let i = 0; i < arr.length; i++) {
    result.push(fn(arr[i]));
  }
  return result;
}

function mapRecursive(arr, fn) {
  if (arr.length === 0) return [];
  const [first, ...rest] = arr;
  return [fn(first), ...mapRecursive(rest, fn)];
}

const double = x => x * 2;
console.log("Iterative map:", mapIterative([1, 2, 3], double));
console.log("Recursive map:", mapRecursive([1, 2, 3], double));


/**
 * ═══════════════════════════════════════════════════════════════════════════
 *                    THE CALL STACK
 * ═══════════════════════════════════════════════════════════════════════════
 */

console.log("\n" + "═".repeat(70));
console.log("3️⃣  THE CALL STACK\n");

/**
 * ┌───────────────────────────────────────────────────────────────────────────┐
 * │                        CALL STACK VISUALIZATION                            │
 * ├───────────────────────────────────────────────────────────────────────────┤
 * │                                                                            │
 * │  factorial(4) builds up the stack:                                        │
 * │                                                                            │
 * │  ┌─────────────────────────┐                                              │
 * │  │  factorial(1) = 1       │ ← Stack frame 4                              │
 * │  ├─────────────────────────┤                                              │
 * │  │  factorial(2) = 2 * ?   │ ← Stack frame 3                              │
 * │  ├─────────────────────────┤                                              │
 * │  │  factorial(3) = 3 * ?   │ ← Stack frame 2                              │
 * │  ├─────────────────────────┤                                              │
 * │  │  factorial(4) = 4 * ?   │ ← Stack frame 1                              │
 * │  └─────────────────────────┘                                              │
 * │                                                                            │
 * │  Then unwinds:                                                             │
 * │  factorial(1) = 1                                                         │
 * │  factorial(2) = 2 * 1 = 2                                                 │
 * │  factorial(3) = 3 * 2 = 6                                                 │
 * │  factorial(4) = 4 * 6 = 24                                                │
 * │                                                                            │
 * │  Problem: Deep recursion causes STACK OVERFLOW!                           │
 * │  Default stack size ~10,000 frames                                        │
 * │                                                                            │
 * └───────────────────────────────────────────────────────────────────────────┘
 */

console.log("=== Stack Overflow Demo ===\n");

function deepRecursion(n) {
  if (n === 0) return 0;
  return 1 + deepRecursion(n - 1);
}

console.log("deepRecursion(100) =", deepRecursion(100));
console.log("deepRecursion(1000) =", deepRecursion(1000));

// This would cause stack overflow:
// console.log(deepRecursion(100000));
console.log("deepRecursion(100000) would cause: RangeError: Maximum call stack size exceeded");


/**
 * ═══════════════════════════════════════════════════════════════════════════
 *                    TAIL RECURSION
 * ═══════════════════════════════════════════════════════════════════════════
 */

console.log("\n" + "═".repeat(70));
console.log("4️⃣  TAIL RECURSION\n");

/**
 * ┌───────────────────────────────────────────────────────────────────────────┐
 * │                     TAIL CALL vs NON-TAIL CALL                             │
 * ├───────────────────────────────────────────────────────────────────────────┤
 * │                                                                            │
 * │  NON-TAIL RECURSIVE:                                                       │
 * │  function factorial(n) {                                                  │
 * │    if (n <= 1) return 1;                                                  │
 * │    return n * factorial(n - 1);  ← Must remember 'n' after call          │
 * │  }                                                                         │
 * │                                                                            │
 * │  TAIL RECURSIVE:                                                           │
 * │  function factorial(n, acc = 1) {                                         │
 * │    if (n <= 1) return acc;                                                │
 * │    return factorial(n - 1, n * acc);  ← Nothing to do after call         │
 * │  }                                                                         │
 * │                                                                            │
 * │  Key difference:                                                           │
 * │  • Tail call: Recursive call is the LAST operation                        │
 * │  • No computation after the recursive call returns                        │
 * │  • Accumulator carries the result                                         │
 * │                                                                            │
 * └───────────────────────────────────────────────────────────────────────────┘
 */

// Non-tail recursive factorial
function factorialNonTail(n) {
  if (n <= 1) return 1;
  return n * factorialNonTail(n - 1);  // Must wait for result then multiply
}

// Tail recursive factorial
function factorialTail(n, accumulator = 1) {
  if (n <= 1) return accumulator;
  return factorialTail(n - 1, n * accumulator);  // Nothing after the call
}

console.log("=== Tail Recursion vs Non-Tail ===\n");
console.log("Non-tail factorial(5):", factorialNonTail(5));
console.log("Tail factorial(5):", factorialTail(5));


// Converting non-tail to tail recursive
console.log("\n=== Converting to Tail Recursion ===\n");

// Non-tail sum
function sumNonTail(arr) {
  if (arr.length === 0) return 0;
  return arr[0] + sumNonTail(arr.slice(1));  // + after recursive call
}

// Tail recursive sum
function sumTail(arr, acc = 0) {
  if (arr.length === 0) return acc;
  return sumTail(arr.slice(1), acc + arr[0]);  // Nothing after call
}

console.log("sumNonTail([1,2,3,4,5]):", sumNonTail([1, 2, 3, 4, 5]));
console.log("sumTail([1,2,3,4,5]):", sumTail([1, 2, 3, 4, 5]));


// Tail recursive fibonacci
function fibTail(n, a = 0, b = 1) {
  if (n === 0) return a;
  if (n === 1) return b;
  return fibTail(n - 1, b, a + b);
}

console.log("\nTail recursive Fibonacci(10):", fibTail(10));
console.log("Tail recursive Fibonacci(40):", fibTail(40)); // Fast!


/**
 * ═══════════════════════════════════════════════════════════════════════════
 *                    TAIL CALL OPTIMIZATION (TCO)
 * ═══════════════════════════════════════════════════════════════════════════
 */

console.log("\n" + "═".repeat(70));
console.log("5️⃣  TAIL CALL OPTIMIZATION (TCO)\n");

/**
 * ┌───────────────────────────────────────────────────────────────────────────┐
 * │                    TAIL CALL OPTIMIZATION                                  │
 * ├───────────────────────────────────────────────────────────────────────────┤
 * │                                                                            │
 * │  Without TCO:                              With TCO:                       │
 * │  ┌─────────────────────┐                  ┌─────────────────────┐         │
 * │  │  factorial(4, 1)    │                  │  factorial(4, 1)    │         │
 * │  ├─────────────────────┤                  │  → reuse frame →    │         │
 * │  │  factorial(3, 4)    │                  │  factorial(3, 4)    │         │
 * │  ├─────────────────────┤    TCO           │  → reuse frame →    │         │
 * │  │  factorial(2, 12)   │  ────────►       │  factorial(2, 12)   │         │
 * │  ├─────────────────────┤                  │  → reuse frame →    │         │
 * │  │  factorial(1, 24)   │                  │  factorial(1, 24)   │         │
 * │  └─────────────────────┘                  └─────────────────────┘         │
 * │                                                                            │
 * │  Stack grows           →                  Stack stays constant!           │
 * │  O(n) space            →                  O(1) space                      │
 * │                                                                            │
 * │  ⚠️ TCO is in ES6 spec but only Safari implements it!                    │
 * │  Node.js and most browsers do NOT support TCO.                            │
 * │                                                                            │
 * └───────────────────────────────────────────────────────────────────────────┘
 */

console.log(`
TCO Status in JavaScript:

┌──────────────────────┬───────────────────────────────────────────────────┐
│ Runtime              │ TCO Support                                        │
├──────────────────────┼───────────────────────────────────────────────────┤
│ Safari               │ ✅ Yes (since 2016)                               │
│ Chrome/V8/Node.js    │ ❌ No (removed experimental support)              │
│ Firefox              │ ❌ No                                              │
│ Edge                 │ ❌ No                                              │
└──────────────────────┴───────────────────────────────────────────────────┘

Since TCO isn't widely supported, we need workarounds...
`);


/**
 * ═══════════════════════════════════════════════════════════════════════════
 *                    TRAMPOLINING
 * ═══════════════════════════════════════════════════════════════════════════
 */

console.log("═".repeat(70));
console.log("6️⃣  TRAMPOLINING - TCO WORKAROUND\n");

/**
 * ┌───────────────────────────────────────────────────────────────────────────┐
 * │                        TRAMPOLINING                                        │
 * ├───────────────────────────────────────────────────────────────────────────┤
 * │                                                                            │
 * │  Instead of calling itself, the function returns a thunk (suspended       │
 * │  computation). A trampoline loop executes the thunks.                     │
 * │                                                                            │
 * │  Normal recursion:       Trampolined:                                     │
 * │  f(n) → f(n-1) →         f(n) → thunk → trampoline executes →            │
 * │    f(n-2) → ...            f(n-1) → thunk → trampoline executes →        │
 * │    (stack grows)             f(n-2) → thunk → ...                        │
 * │                              (stack stays flat!)                          │
 * │                                                                            │
 * └───────────────────────────────────────────────────────────────────────────┘
 */

// Trampoline function
function trampoline(fn) {
  return function(...args) {
    let result = fn(...args);
    while (typeof result === 'function') {
      result = result();
    }
    return result;
  };
}

// Trampolined factorial
function factorialTrampoline(n, acc = 1) {
  if (n <= 1) return acc;
  // Return a thunk instead of recursing directly
  return () => factorialTrampoline(n - 1, n * acc);
}

const factorial2 = trampoline(factorialTrampoline);

console.log("=== Trampolined Factorial ===");
console.log("factorial2(5) =", factorial2(5));
console.log("factorial2(100) =", factorial2(100));

// Test with large number - no stack overflow!
console.log("factorial2(10000) = (computed successfully, too large to display)");
const bigResult = factorial2(10000);
console.log("First 50 digits:", bigResult.toString().slice(0, 50) + "...");


// Trampolined sum
function sumTrampoline(arr, acc = 0) {
  if (arr.length === 0) return acc;
  return () => sumTrampoline(arr.slice(1), acc + arr[0]);
}

const sumT = trampoline(sumTrampoline);

console.log("\n=== Trampolined Sum ===");
const bigArray = Array.from({ length: 10000 }, (_, i) => i + 1);
console.log("Sum of 1 to 10000:", sumT(bigArray));


/**
 * ═══════════════════════════════════════════════════════════════════════════
 *                    MUTUAL RECURSION
 * ═══════════════════════════════════════════════════════════════════════════
 */

console.log("\n" + "═".repeat(70));
console.log("7️⃣  MUTUAL RECURSION\n");

/**
 * ┌───────────────────────────────────────────────────────────────────────────┐
 * │                        MUTUAL RECURSION                                    │
 * ├───────────────────────────────────────────────────────────────────────────┤
 * │                                                                            │
 * │  Two or more functions that call each other.                              │
 * │                                                                            │
 * │  ┌────────┐                   ┌────────┐                                  │
 * │  │ isEven │ ────────────────► │ isOdd  │                                  │
 * │  │        │ ◄──────────────── │        │                                  │
 * │  └────────┘                   └────────┘                                  │
 * │                                                                            │
 * │  isEven(4) → isOdd(3) → isEven(2) → isOdd(1) → isEven(0) → true         │
 * │                                                                            │
 * └───────────────────────────────────────────────────────────────────────────┘
 */

function isEven(n) {
  if (n === 0) return true;
  return isOdd(Math.abs(n) - 1);
}

function isOdd(n) {
  if (n === 0) return false;
  return isEven(Math.abs(n) - 1);
}

console.log("=== Mutual Recursion: isEven/isOdd ===");
console.log("isEven(4):", isEven(4));
console.log("isEven(7):", isEven(7));
console.log("isOdd(5):", isOdd(5));
console.log("isOdd(10):", isOdd(10));


// Trampolined mutual recursion
function isEvenT(n) {
  if (n === 0) return true;
  return () => isOddT(Math.abs(n) - 1);
}

function isOddT(n) {
  if (n === 0) return false;
  return () => isEvenT(Math.abs(n) - 1);
}

const isEvenSafe = trampoline(isEvenT);
const isOddSafe = trampoline(isOddT);

console.log("\n=== Trampolined Mutual Recursion ===");
console.log("isEvenSafe(10000):", isEvenSafe(10000));
console.log("isOddSafe(10001):", isOddSafe(10001));


/**
 * ═══════════════════════════════════════════════════════════════════════════
 *                    TREE RECURSION
 * ═══════════════════════════════════════════════════════════════════════════
 */

console.log("\n" + "═".repeat(70));
console.log("8️⃣  TREE RECURSION\n");

/**
 * ┌───────────────────────────────────────────────────────────────────────────┐
 * │                        TREE RECURSION                                      │
 * ├───────────────────────────────────────────────────────────────────────────┤
 * │                                                                            │
 * │  When a function makes multiple recursive calls (like Fibonacci).         │
 * │                                                                            │
 * │                    fib(5)                                                 │
 * │                   /      \                                                │
 * │               fib(4)      fib(3)                                          │
 * │              /    \       /    \                                          │
 * │          fib(3)  fib(2) fib(2) fib(1)                                    │
 * │          /    \                                                           │
 * │      fib(2)  fib(1)                                                       │
 * │                                                                            │
 * │  Problem: Exponential time complexity O(2^n)                              │
 * │  Many calls compute the same values repeatedly!                           │
 * │                                                                            │
 * └───────────────────────────────────────────────────────────────────────────┘
 */

// Naive tree recursion (exponential)
function fibNaive(n) {
  if (n <= 1) return n;
  return fibNaive(n - 1) + fibNaive(n - 2);
}

// With memoization (linear)
function memoize(fn) {
  const cache = new Map();
  return function(...args) {
    const key = JSON.stringify(args);
    if (!cache.has(key)) {
      cache.set(key, fn.apply(this, args));
    }
    return cache.get(key);
  };
}

const fibMemo = memoize(function fib(n) {
  if (n <= 1) return n;
  return fibMemo(n - 1) + fibMemo(n - 2);
});

console.log("=== Tree Recursion: Fibonacci ===\n");

console.time("Naive fib(35)");
console.log("fibNaive(35):", fibNaive(35));
console.timeEnd("Naive fib(35)");

console.time("Memoized fib(35)");
console.log("fibMemo(35):", fibMemo(35));
console.timeEnd("Memoized fib(35)");

console.time("Memoized fib(100)");
console.log("fibMemo(100):", fibMemo(100)); // Would take forever naively!
console.timeEnd("Memoized fib(100)");


// Tree traversal example
console.log("\n=== Tree Traversal ===\n");

const tree = {
  value: 1,
  children: [
    {
      value: 2,
      children: [
        { value: 4, children: [] },
        { value: 5, children: [] }
      ]
    },
    {
      value: 3,
      children: [
        { value: 6, children: [] }
      ]
    }
  ]
};

function sumTree(node) {
  return node.value + node.children.reduce(
    (sum, child) => sum + sumTree(child),
    0
  );
}

console.log("Sum of tree values:", sumTree(tree));

function findInTree(node, target) {
  if (node.value === target) return true;
  return node.children.some(child => findInTree(child, target));
}

console.log("Tree contains 5?", findInTree(tree, 5));
console.log("Tree contains 10?", findInTree(tree, 10));


/**
 * ═══════════════════════════════════════════════════════════════════════════
 *                        INTERVIEW QUESTIONS
 * ═══════════════════════════════════════════════════════════════════════════
 */

console.log("\n" + "═".repeat(70));
console.log("📋  RECURSION - INTERVIEW QUESTIONS\n");

console.log(`
┌─────────────────────────────────────────────────────────────────────────────┐
│ Q1: What are the two parts of every recursive function?                     │
├─────────────────────────────────────────────────────────────────────────────┤
│ A: 1. Base case - The terminating condition that stops recursion           │
│    2. Recursive case - Where the function calls itself with smaller input  │
│                                                                              │
│    Missing a base case = infinite recursion = stack overflow!               │
└─────────────────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────────────────┐
│ Q2: What is tail recursion?                                                 │
├─────────────────────────────────────────────────────────────────────────────┤
│ A: A recursive call is in "tail position" when it's the last operation     │
│    in the function - nothing needs to be done after it returns.             │
│                                                                              │
│    // NOT tail recursive - must multiply after call                        │
│    return n * factorial(n - 1);                                             │
│                                                                              │
│    // Tail recursive - nothing after call                                   │
│    return factorial(n - 1, n * acc);                                        │
└─────────────────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────────────────┐
│ Q3: What is Tail Call Optimization (TCO)?                                   │
├─────────────────────────────────────────────────────────────────────────────┤
│ A: An optimization where the runtime reuses the current stack frame for    │
│    a tail call instead of creating a new one.                               │
│                                                                              │
│    • Converts O(n) stack space to O(1)                                     │
│    • Prevents stack overflow                                                │
│    • Only Safari supports it in JavaScript!                                 │
└─────────────────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────────────────┐
│ Q4: What is trampolining?                                                   │
├─────────────────────────────────────────────────────────────────────────────┤
│ A: A technique to achieve constant stack space without TCO:                 │
│    1. Instead of calling itself, function returns a thunk                   │
│    2. A trampoline loop executes thunks in a while loop                    │
│    3. Stack stays flat because we return to trampoline each time           │
│                                                                              │
│    function trampoline(fn) {                                                │
│      return (...args) => {                                                  │
│        let result = fn(...args);                                            │
│        while (typeof result === 'function') result = result();             │
│        return result;                                                       │
│      };                                                                      │
│    }                                                                         │
└─────────────────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────────────────┐
│ Q5: How do you convert non-tail to tail recursion?                          │
├─────────────────────────────────────────────────────────────────────────────┤
│ A: Use an accumulator parameter:                                            │
│                                                                              │
│    // Non-tail                                                              │
│    function sum(arr) {                                                      │
│      if (arr.length === 0) return 0;                                        │
│      return arr[0] + sum(arr.slice(1));                                     │
│    }                                                                         │
│                                                                              │
│    // Tail (with accumulator)                                               │
│    function sum(arr, acc = 0) {                                             │
│      if (arr.length === 0) return acc;                                      │
│      return sum(arr.slice(1), acc + arr[0]);                                │
│    }                                                                         │
└─────────────────────────────────────────────────────────────────────────────┘
`);


/**
 * ═══════════════════════════════════════════════════════════════════════════
 *                           CHEAT SHEET
 * ═══════════════════════════════════════════════════════════════════════════
 */

console.log("═".repeat(70));
console.log("📝  RECURSION CHEAT SHEET\n");

console.log(`
╔═══════════════════════════════════════════════════════════════════════════╗
║                       RECURSION QUICK REFERENCE                            ║
╠═══════════════════════════════════════════════════════════════════════════╣
║                                                                            ║
║  STRUCTURE:                                                                ║
║    function recursive(input) {                                             ║
║      if (baseCase) return baseValue;  // Base case                        ║
║      return recursive(smallerInput);  // Recursive case                   ║
║    }                                                                       ║
║                                                                            ║
║  TAIL RECURSION (use accumulator):                                        ║
║    function factorial(n, acc = 1) {                                        ║
║      if (n <= 1) return acc;                                              ║
║      return factorial(n - 1, n * acc);  // Nothing after call            ║
║    }                                                                       ║
║                                                                            ║
║  TRAMPOLINING (prevent stack overflow):                                    ║
║    const trampoline = fn => (...args) => {                                ║
║      let result = fn(...args);                                            ║
║      while (typeof result === 'function') result = result();             ║
║      return result;                                                       ║
║    };                                                                      ║
║                                                                            ║
║    function factorial(n, acc = 1) {                                        ║
║      if (n <= 1) return acc;                                              ║
║      return () => factorial(n - 1, n * acc);  // Return thunk            ║
║    }                                                                       ║
║                                                                            ║
║  MEMOIZATION (avoid repeated work):                                        ║
║    const memo = new Map();                                                 ║
║    function fib(n) {                                                       ║
║      if (memo.has(n)) return memo.get(n);                                 ║
║      const result = n <= 1 ? n : fib(n-1) + fib(n-2);                     ║
║      memo.set(n, result);                                                 ║
║      return result;                                                       ║
║    }                                                                       ║
║                                                                            ║
╚═══════════════════════════════════════════════════════════════════════════╝
`);

console.log("\n═══ FILE 6 COMPLETE ═══");
console.log("Run: node 07-practical-fp.js");
