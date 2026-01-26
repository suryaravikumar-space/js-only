/**
 * Answer 36: Implement Function.prototype.bind
 *
 * Understanding call, apply, and bind:
 */

// Implement bind
Function.prototype.myBind = function (context, ...boundArgs) {
    const fn = this;

    return function (...args) {
        return fn.apply(context, [...boundArgs, ...args]);
    };
};

// Implement call
Function.prototype.myCall = function (context, ...args) {
    context = context || globalThis;
    const uniqueKey = Symbol('fn');
    context[uniqueKey] = this;
    const result = context[uniqueKey](...args);
    delete context[uniqueKey];
    return result;
};

// Implement apply
Function.prototype.myApply = function (context, args = []) {
    context = context || globalThis;
    const uniqueKey = Symbol('fn');
    context[uniqueKey] = this;
    const result = context[uniqueKey](...args);
    delete context[uniqueKey];
    return result;
};

// Advanced bind with new keyword support
Function.prototype.myBindAdvanced = function (context, ...boundArgs) {
    const fn = this;

    const boundFn = function (...args) {
        // Check if called with new keyword
        const isNew = this instanceof boundFn;
        return fn.apply(isNew ? this : context, [...boundArgs, ...args]);
    };

    // Maintain prototype chain
    boundFn.prototype = Object.create(fn.prototype);

    return boundFn;
};

// Test cases
console.log("=== myBind ===");
const obj = { x: 10 };
function add(y, z) {
    return this.x + y + z;
}
const boundAdd = add.myBind(obj, 5);
console.log(boundAdd(3)); // 18

console.log("\n=== myCall ===");
function greet(greeting, punctuation) {
    return `${greeting}, ${this.name}${punctuation}`;
}
const person = { name: 'John' };
console.log(greet.myCall(person, 'Hello', '!')); // "Hello, John!"

console.log("\n=== myApply ===");
console.log(greet.myApply(person, ['Hi', '?'])); // "Hi, John?"

console.log("\n=== Partial Application ===");
function multiply(a, b, c) {
    return a * b * c;
}
const double = multiply.myBind(null, 2);
console.log(double(3, 4)); // 24

console.log("\n=== With Constructor ===");
function Person(name, age) {
    this.name = name;
    this.age = age;
}
const BoundPerson = Person.myBindAdvanced({ ignored: true }, 'John');
const john = new BoundPerson(30);
console.log(john.name, john.age); // "John" 30

/**
 * Key Points:
 * - bind returns a new function
 * - call executes immediately with comma-separated args
 * - apply executes immediately with array of args
 *
 * Time Complexity: O(1)
 * Space Complexity: O(n) for bound arguments
 */
