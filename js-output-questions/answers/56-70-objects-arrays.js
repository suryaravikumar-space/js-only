/**
 * Answers 56-70: Objects & Arrays
 *
 * Detailed explanations for each question.
 */

// Question 56: Object reference
// Output: 2 2
const obj1 = { a: 1 };
const obj2 = obj1;
obj2.a = 2;
console.log("Q56:", obj1.a, obj2.a);
/**
 * Explanation:
 * Objects are assigned by REFERENCE, not value.
 * obj1 and obj2 point to the SAME object in memory.
 * Modifying obj2.a also modifies obj1.a.
 */

// Question 57: Object spread (shallow copy)
// Output: 1 20
const original = { a: 1, b: { c: 2 } };
const copy = { ...original };
copy.a = 10;
copy.b.c = 20;
console.log("Q57:", original.a, original.b.c);
/**
 * Explanation:
 * Spread creates a SHALLOW copy.
 * Top-level properties (a) are copied by value.
 * Nested objects (b) are still references!
 * copy.a = 10 doesn't affect original.a
 * copy.b.c = 20 DOES affect original.b.c (same reference)
 */

// Question 58: Array reference
// Output: 4 4
const arr1 = [1, 2, 3];
const arr2 = arr1;
arr2.push(4);
console.log("Q58:", arr1.length, arr2.length);
/**
 * Explanation:
 * Arrays are objects - same reference behavior.
 * arr1 and arr2 point to the same array.
 * Pushing to arr2 affects arr1.
 */

// Question 59: Array spread
// Output: 3 4
const arr3 = [1, 2, 3];
const arr4 = [...arr3];
arr4.push(4);
console.log("Q59:", arr3.length, arr4.length);
/**
 * Explanation:
 * Spread [...arr3] creates a NEW array (shallow copy).
 * arr3 and arr4 are different arrays.
 * Pushing to arr4 doesn't affect arr3.
 */

// Question 60: Object comparison
// Output: false, true, true
const a = { x: 1 };
const b = { x: 1 };
const c = a;
console.log("Q60a:", a === b);  // false
console.log("Q60b:", a === c);  // true
console.log("Q60c:", JSON.stringify(a) === JSON.stringify(b)); // true
/**
 * Explanation:
 * Q60a: a and b are different objects (different references) - false
 * Q60b: c points to same object as a - true
 * Q60c: Both stringify to '{"x":1}' - true
 *
 * === compares references for objects, not contents!
 */

// Question 61: Array methods - map vs forEach
// Output: [2, 4, 6], undefined
const nums = [1, 2, 3];
const mapped = nums.map(x => x * 2);
const forEached = nums.forEach(x => x * 2);
console.log("Q61a:", mapped);     // [2, 4, 6]
console.log("Q61b:", forEached);  // undefined
/**
 * Explanation:
 * map() returns a NEW array with transformed values.
 * forEach() returns undefined - it's for side effects only.
 * Use map when you need to transform data.
 * Use forEach when you just need to iterate.
 */

// Question 62: Array holes (sparse arrays)
// Output: 3, undefined, false, (skips index 1)
const sparse = [1, , 3];
console.log("Q62a:", sparse.length);   // 3
console.log("Q62b:", sparse[1]);       // undefined
console.log("Q62c:", 1 in sparse);     // false
sparse.forEach((x, i) => console.log("Q62d:", i, x)); // 0:1, 2:3
/**
 * Explanation:
 * [1, , 3] has a "hole" at index 1.
 * Length is still 3 (counts the hole).
 * sparse[1] returns undefined, but the slot doesn't exist!
 * "1 in sparse" returns false - the property doesn't exist.
 * forEach, map, filter SKIP holes (but not undefined values).
 */

// Question 63: delete operator on array
// Output: 3, undefined, [1, empty, 3]
const arr = [1, 2, 3];
delete arr[1];
console.log("Q63a:", arr.length);  // 3 (unchanged!)
console.log("Q63b:", arr[1]);      // undefined
console.log("Q63c:", arr);         // [1, <empty>, 3]
/**
 * Explanation:
 * delete removes the property but doesn't reindex.
 * Creates a hole (sparse array).
 * Length stays the same!
 * Use splice() to properly remove elements.
 */

// Question 64: Object.keys vs for...in
// Output: ['b'], then 'b', 'a'
const parent = { a: 1 };
const child = Object.create(parent);
child.b = 2;
console.log("Q64a:", Object.keys(child));  // ['b']
for (let key in child) {
    console.log("Q64b:", key);  // 'b', then 'a'
}
/**
 * Explanation:
 * Object.keys() returns only OWN enumerable properties.
 * for...in iterates over OWN AND INHERITED enumerable properties.
 * child has 'b' (own) and 'a' (inherited from parent).
 */

// Question 65: Array mutation
// Output: [1, 2, 4, 5], [1, 2, 4, 5], [2, 4]
const numbers = [1, 2, 3, 4, 5];
numbers.splice(2, 1);  // Remove 1 element at index 2
console.log("Q65a:", numbers);  // [1, 2, 4, 5]
const removed = numbers.slice(1, 3);  // Extract index 1-2
console.log("Q65b:", numbers);  // [1, 2, 4, 5] (unchanged)
console.log("Q65c:", removed);  // [2, 4]
/**
 * Explanation:
 * splice() MUTATES the original array.
 * slice() returns a NEW array (doesn't mutate).
 * splice(2, 1) = at index 2, remove 1 element
 * slice(1, 3) = copy from index 1 up to (not including) 3
 */

// Question 66: Object property shorthand and computed
// Output: { name: 'Alice', dynamic: 'value', dynamic2: 'value2' }
const name = "Alice";
const key = "dynamic";
const person = {
    name,           // Shorthand: name: name
    [key]: "value", // Computed: dynamic: "value"
    [key + "2"]: "value2"
};
console.log("Q66:", person);
/**
 * Explanation:
 * Property shorthand: { name } = { name: name }
 * Computed properties: [expression] evaluates to key name
 * [key] becomes "dynamic", [key + "2"] becomes "dynamic2"
 */

// Question 67: Array destructuring
// Output: 1 3 "default"
const [first, , third, fourth = "default"] = [1, 2, 3];
console.log("Q67:", first, third, fourth);
/**
 * Explanation:
 * first = 1
 * (skip 2 with empty slot)
 * third = 3
 * fourth = undefined in array, so default "default" is used
 */

// Question 68: Object destructuring
// Output: 1 10 3
const { x: renamed, y = 10, z } = { x: 1, z: 3 };
console.log("Q68:", renamed, y, z);
/**
 * Explanation:
 * x: renamed = rename x to renamed, value = 1
 * y = 10 = default value since y doesn't exist
 * z = 3 = normal destructuring
 * Note: x is not defined, only renamed is!
 */

// Question 69: Nested destructuring
// Output: "Bob" "NYC"
const data = {
    user: {
        name: "Bob",
        address: {
            city: "NYC"
        }
    }
};
const { user: { name: userName, address: { city } } } = data;
console.log("Q69a:", userName, city);
/**
 * Explanation:
 * Nested destructuring extracts deeply nested values.
 * user: { ... } doesn't create 'user' variable!
 * It only extracts from user object.
 * userName = "Bob", city = "NYC"
 * 'user' is not defined (it's just a path)
 */

// Question 70: Array methods chaining
// Output: 24
const result = [1, 2, 3, 4, 5]
    .filter(x => x > 2)     // [3, 4, 5]
    .map(x => x * 2)        // [6, 8, 10]
    .reduce((acc, x) => acc + x, 0);  // 6 + 8 + 10 = 24
console.log("Q70:", result);
/**
 * Explanation:
 * filter: keep elements > 2 → [3, 4, 5]
 * map: multiply each by 2 → [6, 8, 10]
 * reduce: sum all values → 24
 *
 * Method chaining works because each method returns an array.
 */

console.log("\n=== Summary ===");
console.log("1. Objects/arrays are assigned by reference");
console.log("2. Spread creates shallow copies only");
console.log("3. === compares references, not contents");
console.log("4. map returns new array, forEach returns undefined");
console.log("5. delete creates holes, use splice to remove");
console.log("6. for...in includes inherited, Object.keys doesn't");
