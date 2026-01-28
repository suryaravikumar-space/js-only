/**
 * Questions 81-90: ES6+ Features
 *
 * Predict the output for each code snippet.
 */

// Question 81: Template literals
const name = "World";
const greeting = `Hello, ${name}!`;
console.log("Q81a:", greeting);

const multiline = `Line 1
Line 2`;
console.log("Q81b:", multiline.includes("\n"));

const expr = `${1 + 2} is ${1 + 2 === 3 ? "three" : "not three"}`;
console.log("Q81c:", expr);

// Question 82: Default parameters
function greet(name = "Guest", greeting = "Hello") {
    return `${greeting}, ${name}!`;
}
console.log("Q82a:", greet());
console.log("Q82b:", greet("Alice"));
console.log("Q82c:", greet(undefined, "Hi"));
console.log("Q82d:", greet(null, "Hey"));

// Question 83: Rest parameters
function sum(...numbers) {
    return numbers.reduce((a, b) => a + b, 0);
}
console.log("Q83a:", sum(1, 2, 3, 4, 5));

function combine(first, ...rest) {
    console.log("Q83b:", first);
    console.log("Q83c:", rest);
}
combine(1, 2, 3, 4);

// Question 84: Spread in function calls
const nums = [1, 2, 3];
console.log("Q84a:", Math.max(...nums));
console.log("Q84b:", Math.max(nums));

const str = "hello";
console.log("Q84c:", [...str]);

// Question 85: Arrow functions and arguments
const arrowFunc = () => {
    // console.log(arguments); // ReferenceError in strict mode
    return "Arrow functions don't have 'arguments'";
};
console.log("Q85:", arrowFunc());

function regularFunc() {
    const arrow = () => arguments[0];
    return arrow();
}
console.log("Q85b:", regularFunc("inherited"));

// Question 86: Symbol
const sym1 = Symbol("desc");
const sym2 = Symbol("desc");
console.log("Q86a:", sym1 === sym2);
console.log("Q86b:", sym1.toString());

const sym3 = Symbol.for("shared");
const sym4 = Symbol.for("shared");
console.log("Q86c:", sym3 === sym4);

// Question 87: Map vs Object
const map = new Map();
map.set("a", 1);
map.set("b", 2);
map.set({ key: "c" }, 3);

console.log("Q87a:", map.get("a"));
console.log("Q87b:", map.get({ key: "c" }));
console.log("Q87c:", map.size);

const objKey = { key: "d" };
map.set(objKey, 4);
console.log("Q87d:", map.get(objKey));

// Question 88: Set operations
const set = new Set([1, 2, 2, 3, 3, 3]);
console.log("Q88a:", set.size);
console.log("Q88b:", [...set]);

set.add(4).add(4).add(5);
console.log("Q88c:", set.size);
console.log("Q88d:", set.has(3));

// Question 89: for...of vs for...in
const arr = ["a", "b", "c"];
arr.custom = "custom";

console.log("Q89 for...in:");
for (let key in arr) {
    console.log("  ", key);
}

console.log("Q89 for...of:");
for (let val of arr) {
    console.log("  ", val);
}

// Question 90: Classes
class Animal {
    constructor(name) {
        this.name = name;
    }
    speak() {
        return `${this.name} makes a sound`;
    }
    static create(name) {
        return new Animal(name);
    }
}

class Dog extends Animal {
    constructor(name) {
        super(name);
        this.type = "dog";
    }
    speak() {
        return `${this.name} barks`;
    }
}

const dog = new Dog("Rex");
console.log("Q90a:", dog.speak());
console.log("Q90b:", dog instanceof Animal);
console.log("Q90c:", Animal.create("Generic").speak());
// console.log("Q90d:", dog.create("Test")); // TypeError
