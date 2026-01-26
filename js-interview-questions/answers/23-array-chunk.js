/**
 * Answer 23: Chunk Array
 *
 * Multiple approaches to solve this problem:
 */

// Approach 1: Using Loop
function chunkArray(arr, size) {
    if (size <= 0) return [];

    const chunks = [];
    for (let i = 0; i < arr.length; i += size) {
        chunks.push(arr.slice(i, i + size));
    }
    return chunks;
}

// Approach 2: Using While Loop
function chunkArrayWhile(arr, size) {
    if (size <= 0) return [];

    const chunks = [];
    let index = 0;

    while (index < arr.length) {
        chunks.push(arr.slice(index, index + size));
        index += size;
    }

    return chunks;
}

// Approach 3: Using Reduce
function chunkArrayReduce(arr, size) {
    return arr.reduce((chunks, item, index) => {
        const chunkIndex = Math.floor(index / size);

        if (!chunks[chunkIndex]) {
            chunks[chunkIndex] = [];
        }

        chunks[chunkIndex].push(item);
        return chunks;
    }, []);
}

// Approach 4: Using Recursion
function chunkArrayRecursive(arr, size) {
    if (arr.length === 0) return [];
    return [arr.slice(0, size), ...chunkArrayRecursive(arr.slice(size), size)];
}

// Approach 5: Using Array.from
function chunkArrayFrom(arr, size) {
    return Array.from(
        { length: Math.ceil(arr.length / size) },
        (_, index) => arr.slice(index * size, index * size + size)
    );
}

// Approach 6: Generator Function
function* chunkGenerator(arr, size) {
    for (let i = 0; i < arr.length; i += size) {
        yield arr.slice(i, i + size);
    }
}

// Test cases
console.log("=== Loop Method ===");
console.log(chunkArray([1, 2, 3, 4, 5], 2)); // [[1, 2], [3, 4], [5]]

console.log("\n=== Reduce Method ===");
console.log(chunkArrayReduce([1, 2, 3, 4], 3)); // [[1, 2, 3], [4]]

console.log("\n=== Recursive ===");
console.log(chunkArrayRecursive([1, 2, 3], 1)); // [[1], [2], [3]]

console.log("\n=== Array.from ===");
console.log(chunkArrayFrom([1, 2, 3], 5)); // [[1, 2, 3]]

console.log("\n=== Generator ===");
console.log([...chunkGenerator([1, 2, 3, 4, 5, 6], 2)]);
// [[1, 2], [3, 4], [5, 6]]

/**
 * Time Complexity: O(n) for all approaches
 * Space Complexity: O(n) for the chunks array
 */
