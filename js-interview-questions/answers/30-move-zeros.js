/**
 * Answer 30: Move Zeros to End
 *
 * Multiple approaches to solve this problem:
 */

// Approach 1: Two Pointer (Optimal - In-place)
function moveZeros(arr) {
    let insertPos = 0;

    // Move all non-zero elements to the front
    for (let i = 0; i < arr.length; i++) {
        if (arr[i] !== 0) {
            arr[insertPos] = arr[i];
            insertPos++;
        }
    }

    // Fill remaining positions with zeros
    while (insertPos < arr.length) {
        arr[insertPos] = 0;
        insertPos++;
    }

    return arr;
}

// Approach 2: Swap when non-zero found
function moveZerosSwap(arr) {
    let zeroIndex = 0;

    for (let i = 0; i < arr.length; i++) {
        if (arr[i] !== 0) {
            [arr[zeroIndex], arr[i]] = [arr[i], arr[zeroIndex]];
            zeroIndex++;
        }
    }

    return arr;
}

// Approach 3: Filter and Concat (Not in-place)
function moveZerosFilter(arr) {
    const nonZeros = arr.filter(num => num !== 0);
    const zeros = arr.filter(num => num === 0);
    return [...nonZeros, ...zeros];
}

// Approach 4: Using Reduce
function moveZerosReduce(arr) {
    return arr.reduce((result, num) => {
        if (num === 0) {
            result.push(num);
        } else {
            result.splice(result.filter(n => n !== 0).length, 0, num);
        }
        return result;
    }, []);
}

// Approach 5: Move zeros to beginning
function moveZerosToBeginning(arr) {
    let insertPos = arr.length - 1;

    for (let i = arr.length - 1; i >= 0; i--) {
        if (arr[i] !== 0) {
            arr[insertPos] = arr[i];
            insertPos--;
        }
    }

    while (insertPos >= 0) {
        arr[insertPos] = 0;
        insertPos--;
    }

    return arr;
}

// Approach 6: Count and rebuild
function moveZerosCount(arr) {
    let zeroCount = 0;
    let insertPos = 0;

    for (let num of arr) {
        if (num === 0) {
            zeroCount++;
        } else {
            arr[insertPos++] = num;
        }
    }

    while (zeroCount-- > 0) {
        arr[insertPos++] = 0;
    }

    return arr;
}

// Test cases
console.log("=== Two Pointer ===");
console.log(moveZeros([0, 1, 0, 3, 12])); // [1, 3, 12, 0, 0]

console.log("\n=== Swap Method ===");
console.log(moveZerosSwap([1, 2, 0, 0, 3])); // [1, 2, 3, 0, 0]

console.log("\n=== Filter Method ===");
console.log(moveZerosFilter([0, 0, 0, 1])); // [1, 0, 0, 0]

console.log("\n=== Move to Beginning ===");
console.log(moveZerosToBeginning([1, 0, 2, 0, 3])); // [0, 0, 1, 2, 3]

console.log("\n=== Count Method ===");
console.log(moveZerosCount([1, 2, 3])); // [1, 2, 3]

/**
 * Time Complexity: O(n) for all approaches
 * Space Complexity:
 * - In-place methods: O(1)
 * - Filter: O(n)
 */
