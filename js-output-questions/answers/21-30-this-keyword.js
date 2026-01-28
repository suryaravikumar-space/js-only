/**
 * Answers 21-30: 'this' Keyword
 *
 * Detailed explanations for each question.
 */

// Question 21: Object method 'this'
// Output: "Hello, Alice"
const obj = {
    name: "Alice",
    greet: function() {
        return "Hello, " + this.name;
    }
};
console.log("Q21:", obj.greet());
/**
 * Explanation:
 * When a function is called as a method (obj.greet()),
 * 'this' refers to the object before the dot (obj).
 */

// Question 22: Method assigned to variable
// Output: "Hello, undefined" (or global name in non-strict)
const obj2 = {
    name: "Bob",
    greet: function() {
        return "Hello, " + this.name;
    }
};
const greetFn = obj2.greet;
console.log("Q22:", greetFn());
/**
 * Explanation:
 * When you assign a method to a variable and call it,
 * the connection to the object is lost.
 * 'this' becomes global object (window/global) or undefined (strict mode).
 * In strict mode: this.name = undefined
 */

// Question 23: Arrow function 'this'
// Output: "Hello, undefined"
const obj3 = {
    name: "Charlie",
    greet: () => {
        return "Hello, " + this.name;
    }
};
console.log("Q23:", obj3.greet());
/**
 * Explanation:
 * Arrow functions do NOT have their own 'this'.
 * They inherit 'this' from the enclosing scope.
 * Here, the enclosing scope is global, so this.name = undefined.
 * This is why arrow functions should NOT be used as methods!
 */

// Question 24: Arrow function inside method
// Output: "Hello, David"
const obj4 = {
    name: "David",
    greet: function() {
        const inner = () => {
            return "Hello, " + this.name;
        };
        return inner();
    }
};
console.log("Q24:", obj4.greet());
/**
 * Explanation:
 * The arrow function inherits 'this' from greet().
 * greet() is called as obj4.greet(), so this = obj4.
 * The arrow function preserves that 'this'.
 */

// Question 25: Nested function 'this'
// Output: "Hello, undefined"
const obj5 = {
    name: "Eve",
    greet: function() {
        function inner() {
            return "Hello, " + this.name;
        }
        return inner();
    }
};
console.log("Q25:", obj5.greet());
/**
 * Explanation:
 * Regular nested functions have their own 'this'.
 * inner() is called without an object, so 'this' = global/undefined.
 * This is different from arrow functions!
 * Fix: use arrow function, .bind(this), or save 'this' to a variable.
 */

// Question 26: Using call()
// Output: "Hi, I'm Frank"
function introduce(greeting) {
    return greeting + ", I'm " + this.name;
}
const person = { name: "Frank" };
console.log("Q26:", introduce.call(person, "Hi"));
/**
 * Explanation:
 * call() lets you explicitly set 'this'.
 * First argument to call() becomes 'this'.
 * Remaining arguments are passed to the function.
 */

// Question 27: Using bind()
// Output: "Hello, Henry"
const obj6 = {
    name: "Grace",
    greet: function() {
        return "Hello, " + this.name;
    }
};
const boundGreet = obj6.greet.bind({ name: "Henry" });
console.log("Q27:", boundGreet());
/**
 * Explanation:
 * bind() creates a NEW function with 'this' permanently set.
 * Even though it came from obj6, it's now bound to { name: "Henry" }.
 */

// Question 28: Constructor 'this'
// Output: "Hello, Ivy"
function Person(name) {
    this.name = name;
    this.greet = function() {
        return "Hello, " + this.name;
    };
}
const p = new Person("Ivy");
console.log("Q28:", p.greet());
/**
 * Explanation:
 * When using 'new', a new object is created and 'this' refers to it.
 * Properties are added to this new object.
 * The new object is returned automatically.
 */

// Question 29: Class method 'this'
// Output: Q29a: "Rex makes a sound"
// Q29b: Would throw TypeError in strict mode
class Animal {
    constructor(name) {
        this.name = name;
    }
    speak() {
        return this.name + " makes a sound";
    }
}
const dog = new Animal("Rex");
const speak = dog.speak;
console.log("Q29a:", dog.speak());
/**
 * Explanation:
 * Classes use strict mode by default.
 * dog.speak() - 'this' = dog (works)
 * speak() - 'this' = undefined (strict mode), throws error
 * Same problem as Q22 but stricter.
 */

// Question 30: setTimeout and 'this'
// Output: Q30a: undefined, Q30b: "Jack"
const obj7 = {
    name: "Jack",
    greet: function() {
        setTimeout(function() {
            console.log("Q30a:", this.name); // undefined
        }, 100);
        setTimeout(() => {
            console.log("Q30b:", this.name); // "Jack"
        }, 100);
    }
};
obj7.greet();
/**
 * Explanation:
 * setTimeout's regular callback: 'this' = global (or undefined strict)
 * setTimeout's arrow callback: 'this' = inherited from greet() = obj7
 * This is why arrow functions are perfect for callbacks!
 */

console.log("\n=== Summary ===");
console.log("1. Object method: this = object before the dot");
console.log("2. Function alone: this = global/undefined");
console.log("3. Arrow function: this = inherited from outer scope");
console.log("4. call/apply/bind: this = explicitly set");
console.log("5. new keyword: this = the new object being created");
console.log("6. Event handler: this = element that received event");
