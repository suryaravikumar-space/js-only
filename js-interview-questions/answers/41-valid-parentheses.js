/**
 * Answer 41: Valid Parentheses
 *
 * Classic stack-based problem:
 */

// Approach 1: Using Stack
function isValidParentheses(str) {
    const stack = [];
    const pairs = {
        '(': ')',
        '{': '}',
        '[': ']'
    };

    for (let char of str) {
        if (pairs[char]) {
            // Opening bracket - push to stack
            stack.push(char);
        } else {
            // Closing bracket - check if matches
            const last = stack.pop();
            if (pairs[last] !== char) {
                return false;
            }
        }
    }

    return stack.length === 0;
}

// Approach 2: Using Map
function isValidParenthesesMap(str) {
    const stack = [];
    const closeToOpen = new Map([
        [')', '('],
        ['}', '{'],
        [']', '[']
    ]);

    for (let char of str) {
        if (closeToOpen.has(char)) {
            if (stack.length === 0 || stack.pop() !== closeToOpen.get(char)) {
                return false;
            }
        } else {
            stack.push(char);
        }
    }

    return stack.length === 0;
}

// Approach 3: Replace pairs until empty
function isValidParenthesesReplace(str) {
    while (str.includes('()') || str.includes('{}') || str.includes('[]')) {
        str = str.replace('()', '').replace('{}', '').replace('[]', '');
    }
    return str.length === 0;
}

// Approach 4: Count-based (only for single type)
function isValidSingleType(str, open = '(', close = ')') {
    let count = 0;

    for (let char of str) {
        if (char === open) count++;
        if (char === close) count--;
        if (count < 0) return false;
    }

    return count === 0;
}

// Approach 5: Find longest valid substring
function longestValidParentheses(str) {
    let maxLen = 0;
    const stack = [-1];

    for (let i = 0; i < str.length; i++) {
        if (str[i] === '(') {
            stack.push(i);
        } else {
            stack.pop();
            if (stack.length === 0) {
                stack.push(i);
            } else {
                maxLen = Math.max(maxLen, i - stack[stack.length - 1]);
            }
        }
    }

    return maxLen;
}

// Approach 6: Generate all valid combinations
function generateParentheses(n) {
    const result = [];

    function backtrack(current, open, close) {
        if (current.length === n * 2) {
            result.push(current);
            return;
        }

        if (open < n) {
            backtrack(current + '(', open + 1, close);
        }
        if (close < open) {
            backtrack(current + ')', open, close + 1);
        }
    }

    backtrack('', 0, 0);
    return result;
}

// Test cases
console.log("=== Stack Method ===");
console.log(isValidParentheses("()")); // true
console.log(isValidParentheses("()[]{}")); // true
console.log(isValidParentheses("(]")); // false
console.log(isValidParentheses("([)]")); // false
console.log(isValidParentheses("{[]}")); // true

console.log("\n=== Replace Method ===");
console.log(isValidParenthesesReplace("{[()]}")); // true

console.log("\n=== Longest Valid ===");
console.log(longestValidParentheses("(()")); // 2
console.log(longestValidParentheses(")()())")); // 4

console.log("\n=== Generate Parentheses ===");
console.log(generateParentheses(3));
// ["((()))", "(()())", "(())()", "()(())", "()()()"]

/**
 * Time Complexity:
 * - Stack: O(n)
 * - Replace: O(n²)
 *
 * Space Complexity:
 * - Stack: O(n)
 */
