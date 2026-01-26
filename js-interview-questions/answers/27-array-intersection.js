/**
 * Answer 27: Array Intersection and Union
 *
 * Multiple approaches to solve this problem:
 */

// Approach 1: Using Set and Filter
function intersection(arr1, arr2) {
    const set2 = new Set(arr2);
    return [...new Set(arr1)].filter(item => set2.has(item));
}

function union(arr1, arr2) {
    return [...new Set([...arr1, ...arr2])];
}

// Approach 2: Using Filter (with duplicates)
function intersectionWithDuplicates(arr1, arr2) {
    const arr2Copy = [...arr2];

    return arr1.filter(item => {
        const index = arr2Copy.indexOf(item);
        if (index !== -1) {
            arr2Copy.splice(index, 1);
            return true;
        }
        return false;
    });
}

// Approach 3: Using Map for counting
function intersectionCounted(arr1, arr2) {
    const count1 = new Map();
    const count2 = new Map();

    arr1.forEach(item => count1.set(item, (count1.get(item) || 0) + 1));
    arr2.forEach(item => count2.set(item, (count2.get(item) || 0) + 1));

    const result = [];
    count1.forEach((count, item) => {
        if (count2.has(item)) {
            const minCount = Math.min(count, count2.get(item));
            for (let i = 0; i < minCount; i++) {
                result.push(item);
            }
        }
    });

    return result;
}

// Approach 4: Difference (elements in first but not in second)
function difference(arr1, arr2) {
    const set2 = new Set(arr2);
    return arr1.filter(item => !set2.has(item));
}

// Approach 5: Symmetric Difference (elements in either but not both)
function symmetricDifference(arr1, arr2) {
    const set1 = new Set(arr1);
    const set2 = new Set(arr2);

    const diff1 = [...set1].filter(item => !set2.has(item));
    const diff2 = [...set2].filter(item => !set1.has(item));

    return [...diff1, ...diff2];
}

// Approach 6: Multiple array operations
function multiIntersection(...arrays) {
    if (arrays.length === 0) return [];

    return arrays.reduce((result, arr) => {
        const set = new Set(arr);
        return result.filter(item => set.has(item));
    });
}

function multiUnion(...arrays) {
    return [...new Set(arrays.flat())];
}

// Test cases
console.log("=== Intersection ===");
console.log(intersection([1, 2, 3], [2, 3, 4])); // [2, 3]

console.log("\n=== Union ===");
console.log(union([1, 2, 3], [2, 3, 4])); // [1, 2, 3, 4]

console.log("\n=== With Duplicates ===");
console.log(intersectionWithDuplicates([1, 2, 2, 3], [2, 2, 3, 4])); // [2, 2, 3]

console.log("\n=== Difference ===");
console.log(difference([1, 2, 3, 4], [2, 4])); // [1, 3]

console.log("\n=== Symmetric Difference ===");
console.log(symmetricDifference([1, 2, 3], [2, 3, 4])); // [1, 4]

console.log("\n=== Multiple Arrays ===");
console.log(multiIntersection([1, 2, 3], [2, 3, 4], [2, 3, 5])); // [2, 3]
console.log(multiUnion([1, 2], [2, 3], [3, 4])); // [1, 2, 3, 4]

/**
 * Time Complexity: O(n + m) for Set-based approaches
 * Space Complexity: O(n + m) for storing results
 */
