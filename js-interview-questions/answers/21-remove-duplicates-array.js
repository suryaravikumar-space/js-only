/**
 * Answer 21: Remove Duplicates from Array
 *
 * Multiple approaches to solve this problem:
 */

// Approach 1: Using Set (Simplest)
function removeDuplicates(arr) {
    return [...new Set(arr)];
}

// Approach 2: Using Filter
function removeDuplicatesFilter(arr) {
    return arr.filter((item, index) => arr.indexOf(item) === index);
}

// Approach 3: Using Reduce
function removeDuplicatesReduce(arr) {
    return arr.reduce((unique, item) => {
        return unique.includes(item) ? unique : [...unique, item];
    }, []);
}

// Approach 4: Using Object/Map for O(n)
function removeDuplicatesMap(arr) {
    const seen = new Map();
    const result = [];

    for (let item of arr) {
        if (!seen.has(item)) {
            seen.set(item, true);
            result.push(item);
        }
    }

    return result;
}

// Approach 5: In-place for sorted array
function removeDuplicatesSorted(arr) {
    if (arr.length <= 1) return arr;

    let writeIndex = 1;

    for (let i = 1; i < arr.length; i++) {
        if (arr[i] !== arr[writeIndex - 1]) {
            arr[writeIndex] = arr[i];
            writeIndex++;
        }
    }

    arr.length = writeIndex;
    return arr;
}

// Remove duplicates from array of objects
function removeDuplicateObjects(arr, key) {
    const seen = new Set();
    return arr.filter(obj => {
        const value = obj[key];
        if (seen.has(value)) return false;
        seen.add(value);
        return true;
    });
}

// Test cases
console.log("=== Using Set ===");
console.log(removeDuplicates([1, 2, 2, 3, 4, 4, 5])); // [1, 2, 3, 4, 5]

console.log("\n=== Using Filter ===");
console.log(removeDuplicatesFilter(['a', 'b', 'a', 'c'])); // ['a', 'b', 'c']

console.log("\n=== Using Map ===");
console.log(removeDuplicatesMap([1, '1', 2, '2'])); // [1, '1', 2, '2']

console.log("\n=== Object Array ===");
const users = [
    { id: 1, name: 'John' },
    { id: 2, name: 'Jane' },
    { id: 1, name: 'Johnny' }
];
console.log(removeDuplicateObjects(users, 'id'));
// [{ id: 1, name: 'John' }, { id: 2, name: 'Jane' }]

/**
 * Time Complexity:
 * - Set: O(n)
 * - Filter with indexOf: O(n²)
 * - Reduce with includes: O(n²)
 * - Map: O(n)
 *
 * Space Complexity: O(n) for all approaches
 */
