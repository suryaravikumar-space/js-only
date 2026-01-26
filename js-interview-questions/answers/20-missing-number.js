/**
 * Answer 20: Find Missing Number
 *
 * Multiple approaches to solve this problem:
 */

// Approach 1: Sum Formula (Most Efficient)
// Sum of 0 to n = n * (n + 1) / 2
function findMissingNumber(nums) {
    const n = nums.length;
    const expectedSum = (n * (n + 1)) / 2;
    const actualSum = nums.reduce((sum, num) => sum + num, 0);
    return expectedSum - actualSum;
}

// Approach 2: XOR Method (No overflow risk)
// XOR all numbers 0 to n, then XOR with array elements
// Duplicate XORs cancel out, leaving missing number
function findMissingNumberXOR(nums) {
    let xor = nums.length;

    for (let i = 0; i < nums.length; i++) {
        xor ^= i ^ nums[i];
    }

    return xor;
}

// Approach 3: Using Set
function findMissingNumberSet(nums) {
    const set = new Set(nums);
    const n = nums.length;

    for (let i = 0; i <= n; i++) {
        if (!set.has(i)) return i;
    }
}

// Approach 4: Sorting
function findMissingNumberSort(nums) {
    nums.sort((a, b) => a - b);

    for (let i = 0; i < nums.length; i++) {
        if (nums[i] !== i) return i;
    }

    return nums.length;
}

// Approach 5: Find multiple missing numbers
function findMissingNumbers(nums, n) {
    const set = new Set(nums);
    const missing = [];

    for (let i = 0; i <= n; i++) {
        if (!set.has(i)) {
            missing.push(i);
        }
    }

    return missing;
}

// Test cases
console.log("=== Sum Formula ===");
console.log(findMissingNumber([3, 0, 1])); // 2
console.log(findMissingNumber([0, 1])); // 2

console.log("\n=== XOR Method ===");
console.log(findMissingNumberXOR([9, 6, 4, 2, 3, 5, 7, 0, 1])); // 8

console.log("\n=== Set Method ===");
console.log(findMissingNumberSet([0])); // 1

console.log("\n=== Multiple Missing Numbers ===");
console.log(findMissingNumbers([0, 1, 4, 5], 6)); // [2, 3, 6]

/**
 * Time Complexity:
 * - Sum/XOR: O(n)
 * - Set: O(n)
 * - Sort: O(n log n)
 *
 * Space Complexity:
 * - Sum/XOR: O(1)
 * - Set: O(n)
 * - Sort: O(1) or O(n) depending on sort implementation
 */
