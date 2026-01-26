/**
 * Answer 28: Implement Sorting Algorithms
 *
 * Various sorting algorithms:
 */

// 1. Bubble Sort - O(n²)
function bubbleSort(arr) {
    const result = [...arr];
    const n = result.length;

    for (let i = 0; i < n - 1; i++) {
        let swapped = false;

        for (let j = 0; j < n - i - 1; j++) {
            if (result[j] > result[j + 1]) {
                [result[j], result[j + 1]] = [result[j + 1], result[j]];
                swapped = true;
            }
        }

        if (!swapped) break; // Optimization: already sorted
    }

    return result;
}

// 2. Selection Sort - O(n²)
function selectionSort(arr) {
    const result = [...arr];
    const n = result.length;

    for (let i = 0; i < n - 1; i++) {
        let minIndex = i;

        for (let j = i + 1; j < n; j++) {
            if (result[j] < result[minIndex]) {
                minIndex = j;
            }
        }

        if (minIndex !== i) {
            [result[i], result[minIndex]] = [result[minIndex], result[i]];
        }
    }

    return result;
}

// 3. Insertion Sort - O(n²)
function insertionSort(arr) {
    const result = [...arr];

    for (let i = 1; i < result.length; i++) {
        const current = result[i];
        let j = i - 1;

        while (j >= 0 && result[j] > current) {
            result[j + 1] = result[j];
            j--;
        }

        result[j + 1] = current;
    }

    return result;
}

// 4. Quick Sort - O(n log n) average
function quickSort(arr) {
    if (arr.length <= 1) return arr;

    const pivot = arr[Math.floor(arr.length / 2)];
    const left = arr.filter(x => x < pivot);
    const middle = arr.filter(x => x === pivot);
    const right = arr.filter(x => x > pivot);

    return [...quickSort(left), ...middle, ...quickSort(right)];
}

// 5. Merge Sort - O(n log n)
function mergeSort(arr) {
    if (arr.length <= 1) return arr;

    const mid = Math.floor(arr.length / 2);
    const left = mergeSort(arr.slice(0, mid));
    const right = mergeSort(arr.slice(mid));

    return merge(left, right);
}

function merge(left, right) {
    const result = [];
    let i = 0, j = 0;

    while (i < left.length && j < right.length) {
        if (left[i] <= right[j]) {
            result.push(left[i++]);
        } else {
            result.push(right[j++]);
        }
    }

    return [...result, ...left.slice(i), ...right.slice(j)];
}

// 6. Quick Sort In-place
function quickSortInPlace(arr, low = 0, high = arr.length - 1) {
    if (low < high) {
        const pivotIndex = partition(arr, low, high);
        quickSortInPlace(arr, low, pivotIndex - 1);
        quickSortInPlace(arr, pivotIndex + 1, high);
    }
    return arr;
}

function partition(arr, low, high) {
    const pivot = arr[high];
    let i = low - 1;

    for (let j = low; j < high; j++) {
        if (arr[j] < pivot) {
            i++;
            [arr[i], arr[j]] = [arr[j], arr[i]];
        }
    }

    [arr[i + 1], arr[high]] = [arr[high], arr[i + 1]];
    return i + 1;
}

// Test cases
const testArr = [64, 34, 25, 12, 22, 11, 90];

console.log("=== Bubble Sort ===");
console.log(bubbleSort(testArr)); // [11, 12, 22, 25, 34, 64, 90]

console.log("\n=== Selection Sort ===");
console.log(selectionSort(testArr)); // [11, 12, 22, 25, 34, 64, 90]

console.log("\n=== Insertion Sort ===");
console.log(insertionSort(testArr)); // [11, 12, 22, 25, 34, 64, 90]

console.log("\n=== Quick Sort ===");
console.log(quickSort(testArr)); // [11, 12, 22, 25, 34, 64, 90]

console.log("\n=== Merge Sort ===");
console.log(mergeSort(testArr)); // [11, 12, 22, 25, 34, 64, 90]

/**
 * Time Complexity:
 * - Bubble/Selection/Insertion: O(n²)
 * - Quick Sort: O(n log n) average, O(n²) worst
 * - Merge Sort: O(n log n)
 *
 * Space Complexity:
 * - Bubble/Selection: O(1)
 * - Insertion: O(1)
 * - Quick Sort: O(log n) stack
 * - Merge Sort: O(n)
 */
