/**
 * Answer 32: Deep Compare Objects
 *
 * Multiple approaches to solve this problem:
 */

// Approach 1: Recursive Deep Comparison
function deepEqual(obj1, obj2) {
    // Check strict equality first
    if (obj1 === obj2) return true;

    // Check if both are objects and not null
    if (typeof obj1 !== 'object' || typeof obj2 !== 'object') return false;
    if (obj1 === null || obj2 === null) return false;

    // Check if both are arrays or both are not
    if (Array.isArray(obj1) !== Array.isArray(obj2)) return false;

    // Get keys
    const keys1 = Object.keys(obj1);
    const keys2 = Object.keys(obj2);

    // Check if same number of keys
    if (keys1.length !== keys2.length) return false;

    // Check each key recursively
    for (let key of keys1) {
        if (!keys2.includes(key)) return false;
        if (!deepEqual(obj1[key], obj2[key])) return false;
    }

    return true;
}

// Approach 2: JSON Stringify (Simple but limited)
function deepEqualJSON(obj1, obj2) {
    return JSON.stringify(obj1) === JSON.stringify(obj2);
}
// Note: Doesn't work with undefined, functions, or different key orders

// Approach 3: Handle special types
function deepEqualAdvanced(obj1, obj2) {
    if (obj1 === obj2) return true;

    if (obj1 instanceof Date && obj2 instanceof Date) {
        return obj1.getTime() === obj2.getTime();
    }

    if (obj1 instanceof RegExp && obj2 instanceof RegExp) {
        return obj1.toString() === obj2.toString();
    }

    if (typeof obj1 !== 'object' || typeof obj2 !== 'object') {
        return false;
    }

    if (obj1 === null || obj2 === null) return false;

    if (Object.prototype.toString.call(obj1) !== Object.prototype.toString.call(obj2)) {
        return false;
    }

    const keys1 = Object.keys(obj1);
    const keys2 = Object.keys(obj2);

    if (keys1.length !== keys2.length) return false;

    return keys1.every(key =>
        keys2.includes(key) && deepEqualAdvanced(obj1[key], obj2[key])
    );
}

// Approach 4: Shallow Equal (for comparison)
function shallowEqual(obj1, obj2) {
    if (obj1 === obj2) return true;

    const keys1 = Object.keys(obj1);
    const keys2 = Object.keys(obj2);

    if (keys1.length !== keys2.length) return false;

    return keys1.every(key => obj1[key] === obj2[key]);
}

// Approach 5: Array-specific comparison
function arraysEqual(arr1, arr2) {
    if (arr1.length !== arr2.length) return false;
    return arr1.every((item, index) => deepEqual(item, arr2[index]));
}

// Test cases
console.log("=== Deep Equal ===");
console.log(deepEqual({ a: 1 }, { a: 1 })); // true
console.log(deepEqual({ a: { b: 2 } }, { a: { b: 2 } })); // true
console.log(deepEqual([1, 2, 3], [1, 2, 3])); // true
console.log(deepEqual({ a: 1 }, { a: 2 })); // false

console.log("\n=== Edge Cases ===");
console.log(deepEqual(null, null)); // true
console.log(deepEqual(undefined, undefined)); // true
console.log(deepEqual({ a: 1 }, { a: 1, b: 2 })); // false
console.log(deepEqual([], [])); // true

console.log("\n=== Advanced (Date, RegExp) ===");
console.log(deepEqualAdvanced(new Date(2023, 1, 1), new Date(2023, 1, 1))); // true
console.log(deepEqualAdvanced(/test/gi, /test/gi)); // true

console.log("\n=== Shallow Equal ===");
const nested1 = { a: { b: 1 } };
const nested2 = { a: { b: 1 } };
console.log(shallowEqual(nested1, nested2)); // false (different object refs)
console.log(deepEqual(nested1, nested2)); // true

/**
 * Time Complexity: O(n) where n is total properties
 * Space Complexity: O(d) where d is nesting depth
 */
