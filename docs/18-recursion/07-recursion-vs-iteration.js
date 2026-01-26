/**
 * RECURSION: 07 - Recursion vs Iteration
 *
 * ╔════════════════════════════════════════════════════════════════════════════╗
 * ║ THE GOLDEN RULE                                                            ║
 * ╠════════════════════════════════════════════════════════════════════════════╣
 * ║                                                                            ║
 * ║ Any recursion can be converted to iteration using an explicit stack.       ║
 * ║ Choose based on: clarity, performance, and problem structure.              ║
 * ║                                                                            ║
 * ╚════════════════════════════════════════════════════════════════════════════╝
 */


// ═══════════════════════════════════════════════════════════════════════════════
// FACTORIAL: BOTH WAYS
// ═══════════════════════════════════════════════════════════════════════════════

// Recursive
function factorialRecursive(n) {
  if (n <= 1) return 1;
  return n * factorialRecursive(n - 1);
}

// Iterative
function factorialIterative(n) {
  let result = 1;
  for (let i = 2; i <= n; i++) {
    result *= i;
  }
  return result;
}

console.log('A: Recursive factorial(5):', factorialRecursive(5));  // 120
console.log('B: Iterative factorial(5):', factorialIterative(5));  // 120


// ═══════════════════════════════════════════════════════════════════════════════
// FIBONACCI: BOTH WAYS
// ═══════════════════════════════════════════════════════════════════════════════

// Recursive (with memoization)
function fibRecursive(n, memo = {}) {
  if (n in memo) return memo[n];
  if (n <= 1) return n;
  memo[n] = fibRecursive(n - 1, memo) + fibRecursive(n - 2, memo);
  return memo[n];
}

// Iterative
function fibIterative(n) {
  if (n <= 1) return n;
  let a = 0, b = 1;
  for (let i = 2; i <= n; i++) {
    [a, b] = [b, a + b];
  }
  return b;
}

console.log('\nC: Recursive fib(20):', fibRecursive(20));  // 6765
console.log('D: Iterative fib(20):', fibIterative(20));  // 6765


// ═══════════════════════════════════════════════════════════════════════════════
// TREE TRAVERSAL: BOTH WAYS
// ═══════════════════════════════════════════════════════════════════════════════

const tree = {
  value: 1,
  children: [
    { value: 2, children: [{ value: 4, children: [] }] },
    { value: 3, children: [{ value: 5, children: [] }] }
  ]
};

// Recursive DFS
function dfsRecursive(node, result = []) {
  if (!node) return result;
  result.push(node.value);
  for (const child of node.children) {
    dfsRecursive(child, result);
  }
  return result;
}

// Iterative DFS (using stack)
function dfsIterative(root) {
  if (!root) return [];

  const result = [];
  const stack = [root];

  while (stack.length > 0) {
    const node = stack.pop();
    result.push(node.value);

    // Add children in reverse order for correct traversal
    for (let i = node.children.length - 1; i >= 0; i--) {
      stack.push(node.children[i]);
    }
  }

  return result;
}

console.log('\nE: Recursive DFS:', dfsRecursive(tree));  // [1, 2, 4, 3, 5]
console.log('F: Iterative DFS:', dfsIterative(tree));  // [1, 2, 4, 3, 5]


// ═══════════════════════════════════════════════════════════════════════════════
// COMPARISON TABLE
// ═══════════════════════════════════════════════════════════════════════════════

/**
 * ┌─────────────────────────────────────────────────────────────────────────────┐
 * │ RECURSION vs ITERATION                                                      │
 * ├─────────────────────────────────────────────────────────────────────────────┤
 * │                                                                             │
 * │ ┌────────────────────┬───────────────────┬───────────────────────────────┐  │
 * │ │ Aspect             │ Recursion         │ Iteration                     │  │
 * │ ├────────────────────┼───────────────────┼───────────────────────────────┤  │
 * │ │ Memory             │ Uses call stack   │ Uses variables (heap)         │  │
 * │ │ Stack overflow     │ Possible          │ Not possible                  │  │
 * │ │ Performance        │ Slower (overhead) │ Faster                        │  │
 * │ │ Code clarity       │ Often cleaner     │ Can be verbose                │  │
 * │ │ Tree problems      │ Natural fit       │ Needs explicit stack          │  │
 * │ │ Linear problems    │ Overkill          │ Natural fit                   │  │
 * │ │ State management   │ Automatic         │ Manual                        │  │
 * │ │ Debugging          │ Can be tricky     │ Usually easier                │  │
 * │ └────────────────────┴───────────────────┴───────────────────────────────┘  │
 * │                                                                             │
 * └─────────────────────────────────────────────────────────────────────────────┘
 */


// ═══════════════════════════════════════════════════════════════════════════════
// WHEN TO USE WHICH
// ═══════════════════════════════════════════════════════════════════════════════

/**
 * ┌─────────────────────────────────────────────────────────────────────────────┐
 * │ USE RECURSION WHEN:                                                         │
 * ├─────────────────────────────────────────────────────────────────────────────┤
 * │                                                                             │
 * │ ✓ Problem is naturally recursive (trees, graphs, nested structures)         │
 * │ ✓ Divide and conquer algorithms (merge sort, quick sort)                    │
 * │ ✓ Backtracking (permutations, combinations, maze solving)                   │
 * │ ✓ Code clarity is more important than micro-optimization                    │
 * │ ✓ Depth is bounded and manageable                                           │
 * │                                                                             │
 * └─────────────────────────────────────────────────────────────────────────────┘
 *
 * ┌─────────────────────────────────────────────────────────────────────────────┐
 * │ USE ITERATION WHEN:                                                         │
 * ├─────────────────────────────────────────────────────────────────────────────┤
 * │                                                                             │
 * │ ✓ Linear processing (sum, count, find)                                      │
 * │ ✓ Performance is critical                                                   │
 * │ ✓ Deep recursion is possible (stack overflow risk)                          │
 * │ ✓ State doesn't need to be preserved between steps                          │
 * │ ✓ Algorithm is naturally iterative (loops, counters)                        │
 * │                                                                             │
 * └─────────────────────────────────────────────────────────────────────────────┘
 */


// ═══════════════════════════════════════════════════════════════════════════════
// CONVERTING RECURSION TO ITERATION
// ═══════════════════════════════════════════════════════════════════════════════

/**
 * General pattern:
 * 1. Create an explicit stack
 * 2. Push initial state
 * 3. While stack not empty:
 *    - Pop current state
 *    - Process
 *    - Push new states (what would be recursive calls)
 */

// Example: Flatten nested array

// Recursive
function flattenRecursive(arr) {
  let result = [];
  for (const item of arr) {
    if (Array.isArray(item)) {
      result = [...result, ...flattenRecursive(item)];
    } else {
      result.push(item);
    }
  }
  return result;
}

// Iterative
function flattenIterative(arr) {
  const result = [];
  const stack = [...arr];  // Copy to stack

  while (stack.length > 0) {
    const item = stack.pop();
    if (Array.isArray(item)) {
      stack.push(...item);  // Add items back
    } else {
      result.push(item);
    }
  }

  return result.reverse();  // Correct order
}

const nested = [1, [2, [3, [4]], 5]];
console.log('\nG: Recursive flatten:', flattenRecursive(nested));
console.log('H: Iterative flatten:', flattenIterative(nested));


// ═══════════════════════════════════════════════════════════════════════════════
// PRACTICAL EXAMPLE: BINARY SEARCH
// ═══════════════════════════════════════════════════════════════════════════════

// Recursive
function binarySearchRecursive(arr, target, left = 0, right = arr.length - 1) {
  if (left > right) return -1;

  const mid = Math.floor((left + right) / 2);

  if (arr[mid] === target) return mid;
  if (arr[mid] > target) return binarySearchRecursive(arr, target, left, mid - 1);
  return binarySearchRecursive(arr, target, mid + 1, right);
}

// Iterative
function binarySearchIterative(arr, target) {
  let left = 0;
  let right = arr.length - 1;

  while (left <= right) {
    const mid = Math.floor((left + right) / 2);

    if (arr[mid] === target) return mid;
    if (arr[mid] > target) right = mid - 1;
    else left = mid + 1;
  }

  return -1;
}

const sorted = [1, 3, 5, 7, 9, 11, 13, 15];
console.log('\nI: Recursive binary search for 7:', binarySearchRecursive(sorted, 7));
console.log('J: Iterative binary search for 7:', binarySearchIterative(sorted, 7));


/**
 * ┌─────────────────────────────────────────────────────────────────────────────┐
 * │ INTERVIEW TIP                                                               │
 * ├─────────────────────────────────────────────────────────────────────────────┤
 * │                                                                             │
 * │ When asked to choose between recursion and iteration:                       │
 * │                                                                             │
 * │ 1. Consider the problem structure                                           │
 * │    Trees/graphs → Recursion                                                 │
 * │    Linear data → Iteration                                                  │
 * │                                                                             │
 * │ 2. Consider constraints                                                     │
 * │    Deep recursion → Use iteration                                           │
 * │    Time critical → Usually iteration                                        │
 * │                                                                             │
 * │ 3. Consider clarity                                                         │
 * │    Natural recursive problem → Recursion                                    │
 * │    Complex state management → Recursion                                     │
 * │                                                                             │
 * │ Show you can do BOTH and explain trade-offs!                                │
 * │                                                                             │
 * └─────────────────────────────────────────────────────────────────────────────┘
 *
 *
 * RUN: node docs/18-recursion/07-recursion-vs-iteration.js
 */
