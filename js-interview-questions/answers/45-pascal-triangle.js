/**
 * Answer 45: Pascal's Triangle
 *
 * Multiple approaches:
 */

// Approach 1: Build row by row
function generatePascalTriangle(numRows) {
    if (numRows === 0) return [];

    const triangle = [[1]];

    for (let i = 1; i < numRows; i++) {
        const prevRow = triangle[i - 1];
        const newRow = [1];

        for (let j = 1; j < prevRow.length; j++) {
            newRow.push(prevRow[j - 1] + prevRow[j]);
        }

        newRow.push(1);
        triangle.push(newRow);
    }

    return triangle;
}

// Approach 2: Get specific row directly
function getRow(rowIndex) {
    const row = [1];

    for (let i = 1; i <= rowIndex; i++) {
        // Use formula: C(n, k) = C(n, k-1) * (n - k + 1) / k
        row.push(row[i - 1] * (rowIndex - i + 1) / i);
    }

    return row;
}

// Approach 3: Using recursion
function generateTriangleRecursive(numRows) {
    if (numRows === 0) return [];
    if (numRows === 1) return [[1]];

    const triangle = generateTriangleRecursive(numRows - 1);
    const prevRow = triangle[triangle.length - 1];
    const newRow = [1];

    for (let i = 1; i < prevRow.length; i++) {
        newRow.push(prevRow[i - 1] + prevRow[i]);
    }

    newRow.push(1);
    triangle.push(newRow);

    return triangle;
}

// Approach 4: Get element at specific position
function getPascalElement(row, col) {
    if (col === 0 || col === row) return 1;

    // Using combination formula: C(n, k) = n! / (k! * (n-k)!)
    let result = 1;
    for (let i = 0; i < col; i++) {
        result = result * (row - i) / (i + 1);
    }
    return result;
}

// Approach 5: Print Pascal's Triangle (formatted)
function printPascalTriangle(numRows) {
    const triangle = generatePascalTriangle(numRows);
    const maxWidth = triangle[numRows - 1].join(' ').length;

    triangle.forEach(row => {
        const rowStr = row.join(' ');
        const padding = ' '.repeat((maxWidth - rowStr.length) / 2);
        console.log(padding + rowStr);
    });
}

// Approach 6: Generate using map
function generateWithMap(numRows) {
    return Array.from({ length: numRows }, (_, rowIndex) => {
        return Array.from({ length: rowIndex + 1 }, (_, colIndex) => {
            return getPascalElement(rowIndex, colIndex);
        });
    });
}

// Test cases
console.log("=== Generate Triangle ===");
console.log(generatePascalTriangle(5));
// [[1], [1,1], [1,2,1], [1,3,3,1], [1,4,6,4,1]]

console.log("\n=== Get Specific Row ===");
console.log(getRow(4)); // [1, 4, 6, 4, 1]
console.log(getRow(6)); // [1, 6, 15, 20, 15, 6, 1]

console.log("\n=== Get Specific Element ===");
console.log(getPascalElement(4, 2)); // 6

console.log("\n=== Print Formatted ===");
printPascalTriangle(6);

console.log("\n=== Using Map ===");
console.log(generateWithMap(4));

/**
 * Properties of Pascal's Triangle:
 * - Each row sums to 2^n
 * - Row n contains binomial coefficients C(n, k)
 * - Symmetric around middle
 *
 * Time Complexity: O(n²) for generating n rows
 * Space Complexity: O(n²) for storing the triangle
 */
