/**
 * Answer 33: Flatten a Nested Object
 *
 * Multiple approaches to solve this problem:
 */

// Approach 1: Recursive with prefix
function flattenObject(obj, prefix = '', result = {}) {
    for (let key in obj) {
        if (!obj.hasOwnProperty(key)) continue;

        const newKey = prefix ? `${prefix}.${key}` : key;
        const value = obj[key];

        if (typeof value === 'object' && value !== null && !Array.isArray(value)) {
            flattenObject(value, newKey, result);
        } else if (Array.isArray(value)) {
            value.forEach((item, index) => {
                if (typeof item === 'object' && item !== null) {
                    flattenObject(item, `${newKey}.${index}`, result);
                } else {
                    result[`${newKey}.${index}`] = item;
                }
            });
        } else {
            result[newKey] = value;
        }
    }

    return result;
}

// Approach 2: Using Stack (Iterative)
function flattenObjectIterative(obj) {
    const result = {};
    const stack = [{ current: obj, prefix: '' }];

    while (stack.length > 0) {
        const { current, prefix } = stack.pop();

        for (let key in current) {
            if (!current.hasOwnProperty(key)) continue;

            const newKey = prefix ? `${prefix}.${key}` : key;
            const value = current[key];

            if (typeof value === 'object' && value !== null && !Array.isArray(value)) {
                stack.push({ current: value, prefix: newKey });
            } else {
                result[newKey] = value;
            }
        }
    }

    return result;
}

// Approach 3: Unflatten Object
function unflattenObject(obj) {
    const result = {};

    for (let key in obj) {
        const keys = key.split('.');
        let current = result;

        for (let i = 0; i < keys.length; i++) {
            const k = keys[i];
            const isLast = i === keys.length - 1;

            if (isLast) {
                current[k] = obj[key];
            } else {
                const nextKey = keys[i + 1];
                const isArrayIndex = !isNaN(parseInt(nextKey));

                if (!current[k]) {
                    current[k] = isArrayIndex ? [] : {};
                }
                current = current[k];
            }
        }
    }

    return result;
}

// Approach 4: Flatten with custom delimiter
function flattenWithDelimiter(obj, delimiter = '.', prefix = '') {
    return Object.keys(obj).reduce((acc, key) => {
        const newKey = prefix ? `${prefix}${delimiter}${key}` : key;

        if (typeof obj[key] === 'object' && obj[key] !== null && !Array.isArray(obj[key])) {
            Object.assign(acc, flattenWithDelimiter(obj[key], delimiter, newKey));
        } else {
            acc[newKey] = obj[key];
        }

        return acc;
    }, {});
}

// Approach 5: Get nested value by path
function getNestedValue(obj, path) {
    return path.split('.').reduce((current, key) => current?.[key], obj);
}

// Set nested value by path
function setNestedValue(obj, path, value) {
    const keys = path.split('.');
    let current = obj;

    for (let i = 0; i < keys.length - 1; i++) {
        if (!current[keys[i]]) {
            current[keys[i]] = {};
        }
        current = current[keys[i]];
    }

    current[keys[keys.length - 1]] = value;
    return obj;
}

// Test cases
console.log("=== Flatten Object ===");
console.log(flattenObject({ a: { b: { c: 1 } }, d: 2 }));
// { 'a.b.c': 1, 'd': 2 }

console.log("\n=== With Arrays ===");
console.log(flattenObject({ a: [1, 2, { b: 3 }] }));
// { 'a.0': 1, 'a.1': 2, 'a.2.b': 3 }

console.log("\n=== Unflatten ===");
console.log(unflattenObject({ 'a.b.c': 1, 'd': 2 }));
// { a: { b: { c: 1 } }, d: 2 }

console.log("\n=== Get Nested Value ===");
const nested = { a: { b: { c: 1 } } };
console.log(getNestedValue(nested, 'a.b.c')); // 1

console.log("\n=== Set Nested Value ===");
const obj = {};
setNestedValue(obj, 'a.b.c', 1);
console.log(obj); // { a: { b: { c: 1 } } }

/**
 * Time Complexity: O(n) where n is total properties
 * Space Complexity: O(n) for result + O(d) for recursion depth
 */
