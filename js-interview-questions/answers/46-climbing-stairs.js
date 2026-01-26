/**
 * Answer 46: Climbing Stairs
 *
 * Classic dynamic programming problem (similar to Fibonacci):
 */

// Approach 1: Dynamic Programming (Bottom-up)
function climbStairs(n) {
    if (n <= 2) return n;

    let prev = 1;
    let curr = 2;

    for (let i = 3; i <= n; i++) {
        [prev, curr] = [curr, prev + curr];
    }

    return curr;
}

// Approach 2: Memoization (Top-down)
function climbStairsMemo(n, memo = {}) {
    if (n <= 2) return n;
    if (memo[n]) return memo[n];

    memo[n] = climbStairsMemo(n - 1, memo) + climbStairsMemo(n - 2, memo);
    return memo[n];
}

// Approach 3: Recursive (Slow - for understanding)
function climbStairsRecursive(n) {
    if (n <= 2) return n;
    return climbStairsRecursive(n - 1) + climbStairsRecursive(n - 2);
}

// Approach 4: Tabulation
function climbStairsTab(n) {
    if (n <= 2) return n;

    const dp = new Array(n + 1);
    dp[1] = 1;
    dp[2] = 2;

    for (let i = 3; i <= n; i++) {
        dp[i] = dp[i - 1] + dp[i - 2];
    }

    return dp[n];
}

// Approach 5: With k steps allowed
function climbStairsK(n, k) {
    const dp = new Array(n + 1).fill(0);
    dp[0] = 1;

    for (let i = 1; i <= n; i++) {
        for (let j = 1; j <= k && j <= i; j++) {
            dp[i] += dp[i - j];
        }
    }

    return dp[n];
}

// Approach 6: Get all paths
function getAllPaths(n) {
    const paths = [];

    function backtrack(remaining, path) {
        if (remaining === 0) {
            paths.push([...path]);
            return;
        }

        for (let step of [1, 2]) {
            if (step <= remaining) {
                path.push(step);
                backtrack(remaining - step, path);
                path.pop();
            }
        }
    }

    backtrack(n, []);
    return paths;
}

// Approach 7: Min cost climbing stairs
function minCostClimbingStairs(cost) {
    const n = cost.length;
    const dp = new Array(n + 1);
    dp[0] = 0;
    dp[1] = 0;

    for (let i = 2; i <= n; i++) {
        dp[i] = Math.min(
            dp[i - 1] + cost[i - 1],
            dp[i - 2] + cost[i - 2]
        );
    }

    return dp[n];
}

// Test cases
console.log("=== Basic ===");
console.log(climbStairs(2)); // 2
console.log(climbStairs(3)); // 3
console.log(climbStairs(4)); // 5
console.log(climbStairs(5)); // 8

console.log("\n=== With Memoization ===");
console.log(climbStairsMemo(10)); // 89

console.log("\n=== K Steps Allowed ===");
console.log(climbStairsK(4, 3)); // 7 (with 1, 2, or 3 steps)

console.log("\n=== All Paths ===");
console.log(getAllPaths(4));
// [[1,1,1,1], [1,1,2], [1,2,1], [2,1,1], [2,2]]

console.log("\n=== Min Cost ===");
console.log(minCostClimbingStairs([10, 15, 20])); // 15

/**
 * Key Insight: f(n) = f(n-1) + f(n-2) (Fibonacci pattern)
 *
 * Time Complexity:
 * - DP/Memo: O(n)
 * - Recursive: O(2^n)
 *
 * Space Complexity:
 * - Optimized DP: O(1)
 * - Tabulation: O(n)
 */
