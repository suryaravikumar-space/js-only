/**
 * Answer 47: Maximum Subarray Sum (Kadane's Algorithm)
 *
 * Classic dynamic programming problem:
 */

// Approach 1: Kadane's Algorithm
function maxSubArray(nums) {
    let maxSum = nums[0];
    let currentSum = nums[0];

    for (let i = 1; i < nums.length; i++) {
        currentSum = Math.max(nums[i], currentSum + nums[i]);
        maxSum = Math.max(maxSum, currentSum);
    }

    return maxSum;
}

// Approach 2: Return subarray with max sum
function maxSubArrayWithIndices(nums) {
    let maxSum = nums[0];
    let currentSum = nums[0];
    let start = 0, end = 0, tempStart = 0;

    for (let i = 1; i < nums.length; i++) {
        if (nums[i] > currentSum + nums[i]) {
            currentSum = nums[i];
            tempStart = i;
        } else {
            currentSum = currentSum + nums[i];
        }

        if (currentSum > maxSum) {
            maxSum = currentSum;
            start = tempStart;
            end = i;
        }
    }

    return {
        maxSum,
        subarray: nums.slice(start, end + 1),
        indices: [start, end]
    };
}

// Approach 3: Brute Force (for understanding)
function maxSubArrayBrute(nums) {
    let maxSum = nums[0];

    for (let i = 0; i < nums.length; i++) {
        let currentSum = 0;
        for (let j = i; j < nums.length; j++) {
            currentSum += nums[j];
            maxSum = Math.max(maxSum, currentSum);
        }
    }

    return maxSum;
}

// Approach 4: Divide and Conquer
function maxSubArrayDC(nums) {
    function maxCrossing(nums, left, mid, right) {
        let leftSum = -Infinity;
        let sum = 0;

        for (let i = mid; i >= left; i--) {
            sum += nums[i];
            leftSum = Math.max(leftSum, sum);
        }

        let rightSum = -Infinity;
        sum = 0;

        for (let i = mid + 1; i <= right; i++) {
            sum += nums[i];
            rightSum = Math.max(rightSum, sum);
        }

        return leftSum + rightSum;
    }

    function helper(nums, left, right) {
        if (left === right) return nums[left];

        const mid = Math.floor((left + right) / 2);

        return Math.max(
            helper(nums, left, mid),
            helper(nums, mid + 1, right),
            maxCrossing(nums, left, mid, right)
        );
    }

    return helper(nums, 0, nums.length - 1);
}

// Approach 5: Max Product Subarray (variation)
function maxProduct(nums) {
    let maxProd = nums[0];
    let minProd = nums[0];
    let result = nums[0];

    for (let i = 1; i < nums.length; i++) {
        const temp = maxProd;
        maxProd = Math.max(nums[i], maxProd * nums[i], minProd * nums[i]);
        minProd = Math.min(nums[i], temp * nums[i], minProd * nums[i]);
        result = Math.max(result, maxProd);
    }

    return result;
}

// Test cases
console.log("=== Kadane's Algorithm ===");
console.log(maxSubArray([-2, 1, -3, 4, -1, 2, 1, -5, 4])); // 6
console.log(maxSubArray([1])); // 1
console.log(maxSubArray([5, 4, -1, 7, 8])); // 23

console.log("\n=== With Subarray ===");
console.log(maxSubArrayWithIndices([-2, 1, -3, 4, -1, 2, 1, -5, 4]));
// { maxSum: 6, subarray: [4, -1, 2, 1], indices: [3, 6] }

console.log("\n=== All Negative ===");
console.log(maxSubArray([-3, -1, -2])); // -1

console.log("\n=== Max Product ===");
console.log(maxProduct([2, 3, -2, 4])); // 6
console.log(maxProduct([-2, 0, -1])); // 0

/**
 * Kadane's Algorithm Insight:
 * - At each position, decide: start new subarray or extend current
 * - currentSum = max(nums[i], currentSum + nums[i])
 *
 * Time Complexity:
 * - Kadane: O(n)
 * - Brute Force: O(n²)
 * - Divide & Conquer: O(n log n)
 *
 * Space Complexity: O(1) for Kadane
 */
