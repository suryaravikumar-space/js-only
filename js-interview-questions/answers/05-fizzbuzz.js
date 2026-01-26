/**
 * Answer 5: FizzBuzz
 *
 * Multiple approaches to solve this problem:
 */

// Approach 1: Basic If-Else
function fizzBuzz(n) {
    for (let i = 1; i <= n; i++) {
        if (i % 3 === 0 && i % 5 === 0) {
            console.log("FizzBuzz");
        } else if (i % 3 === 0) {
            console.log("Fizz");
        } else if (i % 5 === 0) {
            console.log("Buzz");
        } else {
            console.log(i);
        }
    }
}

// Approach 2: String Concatenation
function fizzBuzzConcat(n) {
    for (let i = 1; i <= n; i++) {
        let output = "";
        if (i % 3 === 0) output += "Fizz";
        if (i % 5 === 0) output += "Buzz";
        console.log(output || i);
    }
}

// Approach 3: Return Array
function fizzBuzzArray(n) {
    const result = [];
    for (let i = 1; i <= n; i++) {
        if (i % 15 === 0) result.push("FizzBuzz");
        else if (i % 3 === 0) result.push("Fizz");
        else if (i % 5 === 0) result.push("Buzz");
        else result.push(i);
    }
    return result;
}

// Approach 4: Using Ternary Operator
function fizzBuzzTernary(n) {
    for (let i = 1; i <= n; i++) {
        console.log(
            i % 3 === 0
                ? i % 5 === 0
                    ? "FizzBuzz"
                    : "Fizz"
                : i % 5 === 0
                    ? "Buzz"
                    : i
        );
    }
}

// Approach 5: Extensible FizzBuzz (for more conditions)
function fizzBuzzExtensible(n, rules = [[3, "Fizz"], [5, "Buzz"]]) {
    for (let i = 1; i <= n; i++) {
        let output = "";
        rules.forEach(([divisor, word]) => {
            if (i % divisor === 0) output += word;
        });
        console.log(output || i);
    }
}

// Test cases
console.log("=== Basic FizzBuzz ===");
fizzBuzz(15);

console.log("\n=== FizzBuzz Array ===");
console.log(fizzBuzzArray(15));

console.log("\n=== Extensible FizzBuzz ===");
fizzBuzzExtensible(15, [[3, "Fizz"], [5, "Buzz"], [7, "Bazz"]]);

/**
 * Time Complexity: O(n) for all approaches
 * Space Complexity:
 * - Console log versions: O(1)
 * - Array version: O(n)
 */
