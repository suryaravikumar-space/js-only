/**
 * Answers 81-90: ES6+ Features
 *
 * Detailed explanations for each question.
 */

// Question 81: Template literals
// Output: "Hello, World!", true, "3 is three"
const name = "World";
const greeting = `Hello, ${name}!`;
console.log("Q81a:", greeting);  // "Hello, World!"

const multiline = `Line 1
Line 2`;
console.log("Q81b:", multiline.includes("\n")); // true

const expr = `${1 + 2} is ${1 + 2 === 3 ? "three" : "not three"}`;
console.log("Q81c:", expr);  // "3 is three"
/**
 * Explanation:
 * Template literals use backticks (`).
 * ${} allows embedding expressions (not just variables).
 * Multiline strings preserve newlines.
 * Any JS expression works inside ${}.
 */

// Question 82: Default parameters
// Output: "Hello, Guest!", "Hello, Alice!", "Hi, Guest!", "Hey, null!"
function greet(name = "Guest", greeting = "Hello") {
    return `${greeting}, ${name}!`;
}
console.log("Q82a:", greet());                 // "Hello, Guest!"
console.log("Q82b:", greet("Alice"));          // "Hello, Alice!"
console.log("Q82c:", greet(undefined, "Hi"));  // "Hi, Guest!"
console.log("Q82d:", greet(null, "Hey"));      // "Hey, null!"
/**
 * Explanation:
 * Default values apply when argument is undefined.
 * null is NOT undefined - it's a deliberate value.
 * Q82c: undefined triggers default for name
 * Q82d: null does NOT trigger default
 */

// Question 83: Rest parameters
// Output: 15, 1, [2, 3, 4]
function sum(...numbers) {
    return numbers.reduce((a, b) => a + b, 0);
}
console.log("Q83a:", sum(1, 2, 3, 4, 5));  // 15

function combine(first, ...rest) {
    console.log("Q83b:", first);  // 1
    console.log("Q83c:", rest);   // [2, 3, 4]
}
combine(1, 2, 3, 4);
/**
 * Explanation:
 * ...rest collects remaining arguments into an array.
 * Must be the last parameter.
 * Unlike 'arguments', rest is a real array.
 */

// Question 84: Spread in function calls
// Output: 3, NaN, ["h", "e", "l", "l", "o"]
const nums = [1, 2, 3];
console.log("Q84a:", Math.max(...nums));  // 3
console.log("Q84b:", Math.max(nums));     // NaN

const str = "hello";
console.log("Q84c:", [...str]);  // ["h", "e", "l", "l", "o"]
/**
 * Explanation:
 * Q84a: Spread expands array into individual arguments
 * Q84b: Without spread, passes array as single argument
 *       Math.max([1,2,3]) = NaN (can't compare array)
 * Q84c: Spread works on any iterable (strings, arrays, Sets)
 */

// Question 85: Arrow functions and arguments
// Output: "Arrow functions don't have 'arguments'", "inherited"
const arrowFunc = () => {
    return "Arrow functions don't have 'arguments'";
};
console.log("Q85:", arrowFunc());

function regularFunc() {
    const arrow = () => arguments[0];
    return arrow();
}
console.log("Q85b:", regularFunc("inherited"));
/**
 * Explanation:
 * Arrow functions do NOT have their own 'arguments' object.
 * They inherit arguments from enclosing function.
 * Q85b: Arrow inside regularFunc accesses regularFunc's arguments.
 *
 * Use rest parameters instead: (...args) => args
 */

// Question 86: Symbol
// Output: false, "Symbol(desc)", true
const sym1 = Symbol("desc");
const sym2 = Symbol("desc");
console.log("Q86a:", sym1 === sym2);  // false
console.log("Q86b:", sym1.toString()); // "Symbol(desc)"

const sym3 = Symbol.for("shared");
const sym4 = Symbol.for("shared");
console.log("Q86c:", sym3 === sym4);  // true
/**
 * Explanation:
 * Each Symbol() call creates a UNIQUE symbol.
 * Description is just for debugging, not identity.
 * Q86a: Two symbols with same description are NOT equal.
 *
 * Symbol.for() uses global registry - same key = same symbol.
 * Q86c: Symbol.for("shared") always returns the same symbol.
 */

// Question 87: Map vs Object
// Output: 1, undefined, 3, 4
const map = new Map();
map.set("a", 1);
map.set("b", 2);
map.set({ key: "c" }, 3);

console.log("Q87a:", map.get("a"));        // 1
console.log("Q87b:", map.get({ key: "c" })); // undefined
console.log("Q87c:", map.size);            // 3

const objKey = { key: "d" };
map.set(objKey, 4);
console.log("Q87d:", map.get(objKey));     // 4
/**
 * Explanation:
 * Map can use ANY value as key (including objects).
 * BUT keys are compared by reference, not structure.
 *
 * Q87b: { key: "c" } creates a NEW object (different reference).
 * Q87d: We saved the reference, so we can retrieve it.
 *
 * Map advantages: any key type, maintains insertion order, has .size
 */

// Question 88: Set operations
// Output: 3, [1, 2, 3], 5, true
const set = new Set([1, 2, 2, 3, 3, 3]);
console.log("Q88a:", set.size);   // 3 (duplicates removed)
console.log("Q88b:", [...set]);   // [1, 2, 3]

set.add(4).add(4).add(5);
console.log("Q88c:", set.size);   // 5 (1, 2, 3, 4, 5)
console.log("Q88d:", set.has(3)); // true
/**
 * Explanation:
 * Set only stores UNIQUE values.
 * Adding duplicates has no effect.
 * .add() returns the Set, allowing chaining.
 * Great for removing duplicates: [...new Set(arr)]
 */

// Question 89: for...of vs for...in
// Output: for...in: "0", "1", "2", "custom"
//         for...of: "a", "b", "c"
const arr = ["a", "b", "c"];
arr.custom = "custom";

console.log("Q89 for...in:");
for (let key in arr) {
    console.log("  ", key);  // 0, 1, 2, custom
}

console.log("Q89 for...of:");
for (let val of arr) {
    console.log("  ", val);  // a, b, c
}
/**
 * Explanation:
 * for...in iterates over KEYS (including custom properties).
 * for...of iterates over VALUES (only iterable elements).
 *
 * for...in is for objects (keys).
 * for...of is for iterables (values).
 * for...of doesn't include non-index properties!
 */

// Question 90: Classes
// Output: "Rex barks", true, "Generic makes a sound"
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
        super(name);  // MUST call super before using this
        this.type = "dog";
    }
    speak() {
        return `${this.name} barks`;
    }
}

const dog = new Dog("Rex");
console.log("Q90a:", dog.speak());        // "Rex barks"
console.log("Q90b:", dog instanceof Animal); // true
console.log("Q90c:", Animal.create("Generic").speak()); // "Generic makes a sound"
/**
 * Explanation:
 * Q90a: Dog overrides speak() method
 * Q90b: Dog extends Animal, so dog instanceof Animal is true
 * Q90c: Static methods are called on the class, not instances
 *
 * dog.create() would throw TypeError - static methods aren't on instances.
 */

console.log("\n=== Summary ===");
console.log("1. Template literals: ${expr} for expressions, preserve newlines");
console.log("2. Default params only apply to undefined, not null");
console.log("3. Rest (...args) collects into array, spread expands");
console.log("4. Arrow functions: no own this, arguments, super");
console.log("5. Symbol: unique unless using Symbol.for()");
console.log("6. Map/Set: reference equality for object keys");
