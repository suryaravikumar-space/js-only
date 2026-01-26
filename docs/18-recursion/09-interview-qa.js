/**
 * RECURSION: 09 - Interview Q&A Summary
 *
 * ╔════════════════════════════════════════════════════════════════════════════╗
 * ║ COMPLETE INTERVIEW GUIDE FOR RECURSION                                     ║
 * ╠════════════════════════════════════════════════════════════════════════════╣
 * ║                                                                            ║
 * ║ This file contains the most common interview questions with detailed       ║
 * ║ answers, plus a quick reference cheat sheet.                               ║
 * ║                                                                            ║
 * ╚════════════════════════════════════════════════════════════════════════════╝
 */


/**
 * ┌─────────────────────────────────────────────────────────────────────────────┐
 * │ Q1: What is recursion and what are its essential parts?                     │
 * ├─────────────────────────────────────────────────────────────────────────────┤
 * │                                                                             │
 * │ "Recursion is a programming technique where a function calls itself         │
 * │ to solve smaller versions of the same problem.                              │
 * │                                                                             │
 * │ Every recursive function needs TWO essential parts:                         │
 * │                                                                             │
 * │ 1. BASE CASE - The stopping condition                                       │
 * │    • Simplest version of problem with direct answer                         │
 * │    • Without it, you get infinite recursion → stack overflow                │
 * │                                                                             │
 * │ 2. RECURSIVE CASE - The self-call                                           │
 * │    • Breaks problem into smaller piece                                      │
 * │    • MUST make progress toward base case                                    │
 * │    • Combines results to build final answer                                 │
 * │                                                                             │
 * │ Example:                                                                    │
 * │   function factorial(n) {                                                   │
 * │     if (n <= 1) return 1;     // Base case                                  │
 * │     return n * factorial(n-1); // Recursive case                            │
 * │   }"                                                                        │
 * │                                                                             │
 * └─────────────────────────────────────────────────────────────────────────────┘
 */


/**
 * ┌─────────────────────────────────────────────────────────────────────────────┐
 * │ Q2: How does the call stack work with recursion?                            │
 * ├─────────────────────────────────────────────────────────────────────────────┤
 * │                                                                             │
 * │ "Each recursive call creates a new STACK FRAME with its own:                │
 * │ • Local variables                                                           │
 * │ • Function arguments                                                        │
 * │ • Return address                                                            │
 * │                                                                             │
 * │ Two phases:                                                                 │
 * │                                                                             │
 * │ 1. PUSHING (Going Down) - Stack grows as calls are made                     │
 * │    factorial(3) calls factorial(2) calls factorial(1)                       │
 * │                                                                             │
 * │ 2. POPPING (Going Back) - Stack shrinks as calls return                     │
 * │    factorial(1) returns 1, factorial(2) returns 2, factorial(3) returns 6   │
 * │                                                                             │
 * │ Stack overflow occurs when:                                                 │
 * │ • No base case                                                              │
 * │ • Base case never reached                                                   │
 * │ • Input too large for stack capacity"                                       │
 * │                                                                             │
 * └─────────────────────────────────────────────────────────────────────────────┘
 */


/**
 * ┌─────────────────────────────────────────────────────────────────────────────┐
 * │ Q3: When should you use recursion vs iteration?                             │
 * ├─────────────────────────────────────────────────────────────────────────────┤
 * │                                                                             │
 * │ "USE RECURSION when:                                                        │
 * │ • Problem has natural recursive structure (trees, graphs)                   │
 * │ • Unknown nesting depth (nested arrays, DOM)                                │
 * │ • Divide and conquer algorithms (merge sort, quick sort)                    │
 * │ • Code clarity is more important than performance                           │
 * │ • Backtracking problems (permutations, maze solving)                        │
 * │                                                                             │
 * │ USE ITERATION when:                                                         │
 * │ • Simple linear processing (sum, count)                                     │
 * │ • Performance is critical (no stack overhead)                               │
 * │ • Large input size (stack overflow risk)                                    │
 * │ • State doesn't need to be preserved between steps                          │
 * │                                                                             │
 * │ Key insight: Any recursion can be converted to iteration using a stack,     │
 * │ but recursive code is often cleaner for naturally recursive problems."      │
 * │                                                                             │
 * └─────────────────────────────────────────────────────────────────────────────┘
 */


/**
 * ┌─────────────────────────────────────────────────────────────────────────────┐
 * │ Q4: What is memoization and why is it important for recursion?              │
 * ├─────────────────────────────────────────────────────────────────────────────┤
 * │                                                                             │
 * │ "Memoization is caching the results of expensive function calls to          │
 * │ avoid redundant computation.                                                │
 * │                                                                             │
 * │ Why it's critical:                                                          │
 * │ • Naive Fibonacci: fib(50) takes forever (O(2^n))                           │
 * │ • Memoized Fibonacci: fib(50) is instant (O(n))                             │
 * │                                                                             │
 * │ Pattern:                                                                    │
 * │   function fib(n, memo = {}) {                                              │
 * │     if (n in memo) return memo[n];  // Cache hit!                           │
 * │     if (n <= 1) return n;                                                   │
 * │     memo[n] = fib(n-1, memo) + fib(n-2, memo);                              │
 * │     return memo[n];                                                         │
 * │   }                                                                         │
 * │                                                                             │
 * │ Use memoization when:                                                       │
 * │ • Same subproblems are solved multiple times                                │
 * │ • Function is pure (same input = same output)                               │
 * │ • Overlapping subproblems pattern (dynamic programming)"                    │
 * │                                                                             │
 * └─────────────────────────────────────────────────────────────────────────────┘
 */


/**
 * ┌─────────────────────────────────────────────────────────────────────────────┐
 * │ Q5: What is tail recursion and tail call optimization?                      │
 * ├─────────────────────────────────────────────────────────────────────────────┤
 * │                                                                             │
 * │ "Tail recursion is when the recursive call is the LAST operation.           │
 * │                                                                             │
 * │ NOT TAIL RECURSIVE (normal):                                                │
 * │   function factorial(n) {                                                   │
 * │     if (n <= 1) return 1;                                                   │
 * │     return n * factorial(n-1);  // Must multiply AFTER call returns         │
 * │   }                                                                         │
 * │                                                                             │
 * │ TAIL RECURSIVE:                                                             │
 * │   function factorial(n, acc = 1) {                                          │
 * │     if (n <= 1) return acc;                                                 │
 * │     return factorial(n-1, n * acc);  // Nothing after the call!             │
 * │   }                                                                         │
 * │                                                                             │
 * │ Tail Call Optimization (TCO):                                               │
 * │ • Some engines can reuse the same stack frame                               │
 * │ • Avoids stack overflow for deep recursion                                  │
 * │ • Only Safari reliably implements TCO in JavaScript                         │
 * │ • Node.js/Chrome don't guarantee it                                         │
 * │                                                                             │
 * │ Practical advice: Don't rely on TCO in JavaScript; use iteration            │
 * │ for very deep recursion."                                                   │
 * │                                                                             │
 * └─────────────────────────────────────────────────────────────────────────────┘
 */


/**
 * ┌─────────────────────────────────────────────────────────────────────────────┐
 * │ Q6: How do you debug recursive functions?                                   │
 * ├─────────────────────────────────────────────────────────────────────────────┤
 * │                                                                             │
 * │ "Debugging recursion requires tracking the call stack:                      │
 * │                                                                             │
 * │ 1. ADD DEPTH PARAMETER for indented logging                                 │
 * │    function solve(n, depth = 0) {                                           │
 * │      console.log('  '.repeat(depth) + `solve(${n})`);                       │
 * │      ...                                                                    │
 * │    }                                                                        │
 * │                                                                             │
 * │ 2. LOG ENTRY AND EXIT                                                       │
 * │    console.log(`Entering solve(${n})`);                                     │
 * │    const result = ...                                                       │
 * │    console.log(`Exiting solve(${n}) = ${result}`);                          │
 * │                                                                             │
 * │ 3. TRACE WITH SMALL INPUTS                                                  │
 * │    Test with n=3 before n=100                                               │
 * │                                                                             │
 * │ 4. VISUALIZE THE CALL TREE                                                  │
 * │    Draw the calls on paper for complex recursion                            │
 * │                                                                             │
 * │ Common bugs:                                                                │
 * │ • Wrong/missing base case                                                   │
 * │ • Not making progress toward base case                                      │
 * │ • Off-by-one in indices                                                     │
 * │ • Mutating shared state between calls"                                      │
 * │                                                                             │
 * └─────────────────────────────────────────────────────────────────────────────┘
 */


/**
 * ╔════════════════════════════════════════════════════════════════════════════╗
 * ║ CHEAT SHEET: Recursion                                                     ║
 * ╠════════════════════════════════════════════════════════════════════════════╣
 * ║                                                                            ║
 * ║ TEMPLATE:                                                                  ║
 * ║   function solve(input) {                                                  ║
 * ║     if (baseCase) return simpleResult;    // BASE CASE                     ║
 * ║     return combine(solve(smaller));       // RECURSIVE CASE                ║
 * ║   }                                                                        ║
 * ║                                                                            ║
 * ║ CLASSIC EXAMPLES:                                                          ║
 * ║   factorial(n):  n <= 1 ? 1 : n * factorial(n-1)                           ║
 * ║   fibonacci(n):  n <= 1 ? n : fib(n-1) + fib(n-2)                          ║
 * ║   sum(arr):      arr.length === 0 ? 0 : arr[0] + sum(arr.slice(1))         ║
 * ║   reverse(str):  str.length <= 1 ? str : reverse(str.slice(1)) + str[0]   ║
 * ║                                                                            ║
 * ║ MEMOIZATION PATTERN:                                                       ║
 * ║   function solve(n, memo = {}) {                                           ║
 * ║     if (n in memo) return memo[n];                                         ║
 * ║     if (baseCase) return simpleResult;                                     ║
 * ║     memo[n] = solve(smaller, memo);                                        ║
 * ║     return memo[n];                                                        ║
 * ║   }                                                                        ║
 * ║                                                                            ║
 * ║ TAIL RECURSION:                                                            ║
 * ║   function factorial(n, acc = 1) {                                         ║
 * ║     if (n <= 1) return acc;                                                ║
 * ║     return factorial(n - 1, n * acc);  // Last operation is the call       ║
 * ║   }                                                                        ║
 * ║                                                                            ║
 * ║ TREE TRAVERSAL:                                                            ║
 * ║   function traverse(node) {                                                ║
 * ║     if (!node) return;                                                     ║
 * ║     process(node);                                                         ║
 * ║     for (const child of node.children) traverse(child);                    ║
 * ║   }                                                                        ║
 * ║                                                                            ║
 * ║ FLATTEN NESTED ARRAY:                                                      ║
 * ║   function flatten(arr) {                                                  ║
 * ║     return arr.reduce((acc, item) =>                                       ║
 * ║       acc.concat(Array.isArray(item) ? flatten(item) : item), []);         ║
 * ║   }                                                                        ║
 * ║                                                                            ║
 * ║ COMMON PITFALLS:                                                           ║
 * ║   • Missing base case → stack overflow                                     ║
 * ║   • Base case never reached → stack overflow                               ║
 * ║   • Not shrinking input → infinite loop                                    ║
 * ║   • Mutating shared state → unexpected results                             ║
 * ║   • No memoization for overlapping subproblems → O(2^n)                    ║
 * ║                                                                            ║
 * ║ TIME COMPLEXITY:                                                           ║
 * ║   Linear recursion (1 call):     O(n)                                      ║
 * ║   Binary recursion (split):      O(log n)                                  ║
 * ║   Tree recursion (2+ calls):     O(2^n) without memo, O(n) with memo       ║
 * ║                                                                            ║
 * ║ WHEN TO USE:                                                               ║
 * ║   ✓ Trees/graphs, nested structures, divide & conquer                      ║
 * ║   ✓ Unknown depth, backtracking, when code clarity matters                 ║
 * ║   ✗ Simple linear processing (use loops)                                   ║
 * ║   ✗ Very deep recursion without TCO (use iteration with stack)             ║
 * ║                                                                            ║
 * ╚════════════════════════════════════════════════════════════════════════════╝
 *
 *
 * RUN: node docs/18-recursion/09-interview-qa.js
 */


// Verify file loads
console.log('Recursion module complete!');
console.log('Topics covered:');
console.log('  00 - Recursion basics');
console.log('  01 - How it works (call stack)');
console.log('  02 - Classic examples');
console.log('  03 - Array recursion');
console.log('  04 - Tree recursion');
console.log('  05 - String recursion');
console.log('  06 - Tail recursion');
console.log('  07 - Recursion vs iteration');
console.log('  08 - Tricky examples');
console.log('  09 - Interview Q&A');
console.log('\nNext: 19-type-coercion');
