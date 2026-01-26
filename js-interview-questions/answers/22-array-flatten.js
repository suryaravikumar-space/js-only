/**
 * Answer 22: Flatten a Nested Array
 *
 * Multiple approaches to solve this problem:
 */

// Approach 1: Using flat() (ES2019)
function flattenArrayBuiltin(arr) {
    return arr.flat(Infinity);
}

// Approach 2: Recursive
function flattenArray(arr) {
    const result = [];

    function flatten(items) {
        for (let item of items) {
            if (Array.isArray(item)) {
                flatten(item);
            } else {
                result.push(item);
            }
        }
    }

    flatten(arr);
    return result;
}

// Approach 3: Using Reduce (Recursive)
function flattenArrayReduce(arr) {
    return arr.reduce((flat, item) => {
        return flat.concat(
            Array.isArray(item) ? flattenArrayReduce(item) : item
        );
    }, []);
}

// Approach 4: Iterative with Stack
function flattenArrayStack(arr) {
    const stack = [...arr];
    const result = [];

    while (stack.length) {
        const item = stack.pop();

        if (Array.isArray(item)) {
            stack.push(...item);
        } else {
            result.unshift(item);
        }
    }

    return result;
}

// Approach 5: Flatten to specific depth
function flattenToDepth(arr, depth = 1) {
    if (depth < 1) return [...arr];

    return arr.reduce((flat, item) => {
        return flat.concat(
            Array.isArray(item) && depth > 0
                ? flattenToDepth(item, depth - 1)
                : item
        );
    }, []);
}

// Approach 6: Using Generator
function* flattenGenerator(arr) {
    for (let item of arr) {
        if (Array.isArray(item)) {
            yield* flattenGenerator(item);
        } else {
            yield item;
        }
    }
}

// Test cases
console.log("=== Built-in flat() ===");
console.log(flattenArrayBuiltin([1, [2, 3], [4, [5, 6]]])); // [1, 2, 3, 4, 5, 6]

console.log("\n=== Recursive ===");
console.log(flattenArray([[1, 2], [3, 4]])); // [1, 2, 3, 4]

console.log("\n=== Using Reduce ===");
console.log(flattenArrayReduce([1, [2, [3, [4]]]])); // [1, 2, 3, 4]

console.log("\n=== Flatten to Depth ===");
console.log(flattenToDepth([1, [2, [3, [4]]]], 1)); // [1, 2, [3, [4]]]
console.log(flattenToDepth([1, [2, [3, [4]]]], 2)); // [1, 2, 3, [4]]

console.log("\n=== Generator ===");
console.log([...flattenGenerator([1, [2, [3, [4]]]])]); // [1, 2, 3, 4]

/**
 * Time Complexity: O(n) where n is total elements
 * Space Complexity:
 * - Recursive: O(d) where d is max depth (call stack)
 * - Stack: O(n)
 */
