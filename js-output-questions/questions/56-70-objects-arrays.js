/**
 * Questions 56-70: Objects & Arrays
 *
 * Predict the output for each code snippet.
 */

// Question 56: Object reference
const obj1 = { a: 1 };
const obj2 = obj1;
obj2.a = 2;
console.log("Q56:", obj1.a, obj2.a);

// Question 57: Object spread (shallow copy)
const original = { a: 1, b: { c: 2 } };
const copy = { ...original };
copy.a = 10;
copy.b.c = 20;
console.log("Q57:", original.a, original.b.c);

// Question 58: Array reference
const arr1 = [1, 2, 3];
const arr2 = arr1;
arr2.push(4);
console.log("Q58:", arr1.length, arr2.length);

// Question 59: Array spread
const arr3 = [1, 2, 3];
const arr4 = [...arr3];
arr4.push(4);
console.log("Q59:", arr3.length, arr4.length);

// Question 60: Object comparison
const a = { x: 1 };
const b = { x: 1 };
const c = a;
console.log("Q60a:", a === b);
console.log("Q60b:", a === c);
console.log("Q60c:", JSON.stringify(a) === JSON.stringify(b));

// Question 61: Array methods - map vs forEach
const nums = [1, 2, 3];
const mapped = nums.map(x => x * 2);
const forEached = nums.forEach(x => x * 2);
console.log("Q61a:", mapped);
console.log("Q61b:", forEached);

// Question 62: Array holes (sparse arrays)
const sparse = [1, , 3];
console.log("Q62a:", sparse.length);
console.log("Q62b:", sparse[1]);
console.log("Q62c:", 1 in sparse);
sparse.forEach((x, i) => console.log("Q62d:", i, x));

// Question 63: delete operator on array
const arr = [1, 2, 3];
delete arr[1];
console.log("Q63a:", arr.length);
console.log("Q63b:", arr[1]);
console.log("Q63c:", arr);

// Question 64: Object.keys vs for...in
const parent = { a: 1 };
const child = Object.create(parent);
child.b = 2;
console.log("Q64a:", Object.keys(child));
for (let key in child) {
    console.log("Q64b:", key);
}

// Question 65: Array mutation
const numbers = [1, 2, 3, 4, 5];
numbers.splice(2, 1);
console.log("Q65a:", numbers);
const removed = numbers.slice(1, 3);
console.log("Q65b:", numbers);
console.log("Q65c:", removed);

// Question 66: Object property shorthand and computed
const name = "Alice";
const key = "dynamic";
const person = {
    name,
    [key]: "value",
    [key + "2"]: "value2"
};
console.log("Q66:", person);

// Question 67: Array destructuring
const [first, , third, fourth = "default"] = [1, 2, 3];
console.log("Q67:", first, third, fourth);

// Question 68: Object destructuring
const { x: renamed, y = 10, z } = { x: 1, z: 3 };
console.log("Q68:", renamed, y, z);

// Question 69: Nested destructuring
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
// console.log("Q69b:", user); // ReferenceError!

// Question 70: Array methods chaining
const result = [1, 2, 3, 4, 5]
    .filter(x => x > 2)
    .map(x => x * 2)
    .reduce((acc, x) => acc + x, 0);
console.log("Q70:", result);
