/**
 * Answer 31: Deep Clone an Object
 *
 * Multiple approaches to solve this problem:
 */

// Approach 1: JSON Method (Simple but limited)
function deepCloneJSON(obj) {
    return JSON.parse(JSON.stringify(obj));
}
// Limitations: Can't handle functions, undefined, Date, RegExp, Map, Set, circular refs

// Approach 2: Recursive Deep Clone
function deepClone(obj) {
    if (obj === null || typeof obj !== 'object') {
        return obj;
    }

    if (obj instanceof Date) {
        return new Date(obj.getTime());
    }

    if (obj instanceof RegExp) {
        return new RegExp(obj);
    }

    if (Array.isArray(obj)) {
        return obj.map(item => deepClone(item));
    }

    const cloned = {};
    for (let key in obj) {
        if (obj.hasOwnProperty(key)) {
            cloned[key] = deepClone(obj[key]);
        }
    }

    return cloned;
}

// Approach 3: Handle Circular References
function deepCloneWithCircular(obj, hash = new WeakMap()) {
    if (obj === null || typeof obj !== 'object') {
        return obj;
    }

    if (hash.has(obj)) {
        return hash.get(obj);
    }

    if (obj instanceof Date) {
        return new Date(obj.getTime());
    }

    if (obj instanceof RegExp) {
        return new RegExp(obj);
    }

    if (obj instanceof Map) {
        const result = new Map();
        hash.set(obj, result);
        obj.forEach((value, key) => {
            result.set(deepCloneWithCircular(key, hash), deepCloneWithCircular(value, hash));
        });
        return result;
    }

    if (obj instanceof Set) {
        const result = new Set();
        hash.set(obj, result);
        obj.forEach(value => {
            result.add(deepCloneWithCircular(value, hash));
        });
        return result;
    }

    const cloned = Array.isArray(obj) ? [] : {};
    hash.set(obj, cloned);

    for (let key of Object.keys(obj)) {
        cloned[key] = deepCloneWithCircular(obj[key], hash);
    }

    return cloned;
}

// Approach 4: Using structuredClone (Modern browsers)
function deepCloneStructured(obj) {
    return structuredClone(obj);
}

// Approach 5: Object.assign for Shallow Clone (for comparison)
function shallowClone(obj) {
    return { ...obj }; // or Object.assign({}, obj)
}

// Test cases
console.log("=== Recursive Deep Clone ===");
const original = { a: 1, b: { c: 2 }, d: [1, 2, { e: 3 }] };
const cloned = deepClone(original);
cloned.b.c = 100;
cloned.d[2].e = 300;
console.log("Original b.c:", original.b.c); // 2
console.log("Cloned b.c:", cloned.b.c); // 100

console.log("\n=== With Dates and RegExp ===");
const withDate = { date: new Date(), pattern: /test/gi };
const clonedDate = deepClone(withDate);
console.log(clonedDate.date instanceof Date); // true

console.log("\n=== Circular Reference ===");
const circular = { a: 1 };
circular.self = circular;
const clonedCircular = deepCloneWithCircular(circular);
console.log(clonedCircular.self === clonedCircular); // true

console.log("\n=== Shallow vs Deep ===");
const shallow = shallowClone(original);
shallow.b.c = 999;
console.log("Original after shallow clone modification:", original.b.c); // 999 (modified!)

/**
 * Time Complexity: O(n) where n is total properties
 * Space Complexity: O(n) for the cloned object + O(d) for recursion depth
 */
