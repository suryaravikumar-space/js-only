/**
 * Answer 34: Deep Merge Objects
 *
 * Multiple approaches to solve this problem:
 */

// Approach 1: Recursive Deep Merge
function deepMerge(...objects) {
    const isObject = obj => obj && typeof obj === 'object' && !Array.isArray(obj);

    return objects.reduce((result, obj) => {
        if (!isObject(obj)) return result;

        Object.keys(obj).forEach(key => {
            const resultVal = result[key];
            const objVal = obj[key];

            if (isObject(resultVal) && isObject(objVal)) {
                result[key] = deepMerge(resultVal, objVal);
            } else if (Array.isArray(resultVal) && Array.isArray(objVal)) {
                result[key] = [...objVal]; // Replace array
            } else {
                result[key] = objVal;
            }
        });

        return result;
    }, {});
}

// Approach 2: With array merging option
function deepMergeWithArrays(...objects) {
    const isObject = obj => obj && typeof obj === 'object' && !Array.isArray(obj);

    return objects.reduce((result, obj) => {
        Object.keys(obj).forEach(key => {
            const resultVal = result[key];
            const objVal = obj[key];

            if (Array.isArray(resultVal) && Array.isArray(objVal)) {
                result[key] = [...resultVal, ...objVal]; // Concat arrays
            } else if (isObject(resultVal) && isObject(objVal)) {
                result[key] = deepMergeWithArrays(resultVal, objVal);
            } else {
                result[key] = objVal;
            }
        });

        return result;
    }, {});
}

// Approach 3: Using Object.assign (Shallow)
function shallowMerge(...objects) {
    return Object.assign({}, ...objects);
}

// Approach 4: Using Spread (Shallow)
function spreadMerge(...objects) {
    return objects.reduce((result, obj) => ({ ...result, ...obj }), {});
}

// Approach 5: Merge with custom handler
function deepMergeCustom(target, source, customizer = (a, b) => b) {
    const isObject = obj => obj && typeof obj === 'object' && !Array.isArray(obj);
    const result = { ...target };

    Object.keys(source).forEach(key => {
        const targetVal = result[key];
        const sourceVal = source[key];

        if (isObject(targetVal) && isObject(sourceVal)) {
            result[key] = deepMergeCustom(targetVal, sourceVal, customizer);
        } else {
            result[key] = customizer(targetVal, sourceVal);
        }
    });

    return result;
}

// Approach 6: Immutable merge (returns new objects)
function immutableMerge(obj1, obj2) {
    const isObject = obj => obj && typeof obj === 'object' && !Array.isArray(obj);

    if (!isObject(obj1) || !isObject(obj2)) {
        return obj2;
    }

    const result = {};

    const allKeys = new Set([...Object.keys(obj1), ...Object.keys(obj2)]);

    allKeys.forEach(key => {
        if (key in obj2) {
            if (isObject(obj1[key]) && isObject(obj2[key])) {
                result[key] = immutableMerge(obj1[key], obj2[key]);
            } else {
                result[key] = obj2[key];
            }
        } else {
            result[key] = obj1[key];
        }
    });

    return result;
}

// Test cases
console.log("=== Deep Merge ===");
const obj1 = { a: 1, b: { c: 2 } };
const obj2 = { b: { d: 3 }, e: 4 };
console.log(deepMerge(obj1, obj2));
// { a: 1, b: { c: 2, d: 3 }, e: 4 }

console.log("\n=== Multiple Objects ===");
console.log(deepMerge({ a: 1 }, { b: 2 }, { c: 3 }));
// { a: 1, b: 2, c: 3 }

console.log("\n=== With Arrays (Replace) ===");
console.log(deepMerge({ arr: [1, 2] }, { arr: [3, 4] }));
// { arr: [3, 4] }

console.log("\n=== With Arrays (Concat) ===");
console.log(deepMergeWithArrays({ arr: [1, 2] }, { arr: [3, 4] }));
// { arr: [1, 2, 3, 4] }

console.log("\n=== Shallow Merge Comparison ===");
const nested1 = { a: { b: 1 } };
const nested2 = { a: { c: 2 } };
console.log("Shallow:", shallowMerge(nested1, nested2)); // { a: { c: 2 } }
console.log("Deep:", deepMerge(nested1, nested2)); // { a: { b: 1, c: 2 } }

/**
 * Time Complexity: O(n) where n is total properties
 * Space Complexity: O(n) for merged object
 */
