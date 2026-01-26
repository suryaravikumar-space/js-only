/**
 * Answer 24: Two Sum Problem
 *
 * Multiple approaches to solve this problem:
 */

// Approach 1: Brute Force - O(n²)
function twoSumBruteForce(nums, target) {
    for (let i = 0; i < nums.length; i++) {
        for (let j = i + 1; j < nums.length; j++) {
            if (nums[i] + nums[j] === target) {
                return [i, j];
            }
        }
    }
    return [];
}

// Approach 2: Hash Map (Optimal) - O(n)
function twoSum(nums, target) {
    const map = new Map();

    for (let i = 0; i < nums.length; i++) {
        const complement = target - nums[i];

        if (map.has(complement)) {
            return [map.get(complement), i];
        }

        map.set(nums[i], i);
    }

    return [];
}

// Approach 3: Two Pointer (for sorted array)
function twoSumSorted(nums, target) {
    // Create array with original indices
    const indexed = nums.map((num, i) => ({ num, i }));
    indexed.sort((a, b) => a.num - b.num);

    let left = 0;
    let right = indexed.length - 1;

    while (left < right) {
        const sum = indexed[left].num + indexed[right].num;

        if (sum === target) {
            return [indexed[left].i, indexed[right].i].sort((a, b) => a - b);
        } else if (sum < target) {
            left++;
        } else {
            right--;
        }
    }

    return [];
}

// Approach 4: Find all pairs that sum to target
function findAllPairs(nums, target) {
    const pairs = [];
    const seen = new Set();

    for (let i = 0; i < nums.length; i++) {
        const complement = target - nums[i];

        for (let j = i + 1; j < nums.length; j++) {
            if (nums[j] === complement) {
                const pair = [Math.min(i, j), Math.max(i, j)].join(',');
                if (!seen.has(pair)) {
                    seen.add(pair);
                    pairs.push([i, j]);
                }
            }
        }
    }

    return pairs;
}

// Approach 5: Three Sum (bonus)
function threeSum(nums, target) {
    const result = [];
    nums.sort((a, b) => a - b);

    for (let i = 0; i < nums.length - 2; i++) {
        if (i > 0 && nums[i] === nums[i - 1]) continue;

        let left = i + 1;
        let right = nums.length - 1;

        while (left < right) {
            const sum = nums[i] + nums[left] + nums[right];

            if (sum === target) {
                result.push([nums[i], nums[left], nums[right]]);
                while (left < right && nums[left] === nums[left + 1]) left++;
                while (left < right && nums[right] === nums[right - 1]) right--;
                left++;
                right--;
            } else if (sum < target) {
                left++;
            } else {
                right--;
            }
        }
    }

    return result;
}

// Test cases
console.log("=== Hash Map (Optimal) ===");
console.log(twoSum([2, 7, 11, 15], 9)); // [0, 1]
console.log(twoSum([3, 2, 4], 6)); // [1, 2]

console.log("\n=== Brute Force ===");
console.log(twoSumBruteForce([3, 3], 6)); // [0, 1]

console.log("\n=== All Pairs ===");
console.log(findAllPairs([1, 2, 3, 4, 5], 5)); // [[0, 3], [1, 2]]

console.log("\n=== Three Sum ===");
console.log(threeSum([-1, 0, 1, 2, -1, -4], 0)); // [[-1, -1, 2], [-1, 0, 1]]

/**
 * Time Complexity:
 * - Brute Force: O(n²)
 * - Hash Map: O(n)
 * - Two Pointer: O(n log n) due to sorting
 *
 * Space Complexity:
 * - Brute Force: O(1)
 * - Hash Map: O(n)
 */
