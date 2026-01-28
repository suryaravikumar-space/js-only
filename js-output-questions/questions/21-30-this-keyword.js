/**
 * Questions 21-30: 'this' Keyword
 *
 * Predict the output for each code snippet.
 */

// Question 21: Object method 'this'
const obj = {
    name: "Alice",
    greet: function() {
        return "Hello, " + this.name;
    }
};
console.log("Q21:", obj.greet());

// Question 22: Method assigned to variable
const obj2 = {
    name: "Bob",
    greet: function() {
        return "Hello, " + this.name;
    }
};
const greetFn = obj2.greet;
console.log("Q22:", greetFn());

// Question 23: Arrow function 'this'
const obj3 = {
    name: "Charlie",
    greet: () => {
        return "Hello, " + this.name;
    }
};
console.log("Q23:", obj3.greet());

// Question 24: Arrow function inside method
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

// Question 25: Nested function 'this'
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

// Question 26: Using call()
function introduce(greeting) {
    return greeting + ", I'm " + this.name;
}
const person = { name: "Frank" };
console.log("Q26:", introduce.call(person, "Hi"));

// Question 27: Using bind()
const obj6 = {
    name: "Grace",
    greet: function() {
        return "Hello, " + this.name;
    }
};
const boundGreet = obj6.greet.bind({ name: "Henry" });
console.log("Q27:", boundGreet());

// Question 28: Constructor 'this'
function Person(name) {
    this.name = name;
    this.greet = function() {
        return "Hello, " + this.name;
    };
}
const p = new Person("Ivy");
console.log("Q28:", p.greet());

// Question 29: Class method 'this'
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
// console.log("Q29b:", speak()); // Would throw error in strict mode

// Question 30: setTimeout and 'this'
const obj7 = {
    name: "Jack",
    greet: function() {
        setTimeout(function() {
            console.log("Q30a:", this.name);
        }, 100);
        setTimeout(() => {
            console.log("Q30b:", this.name);
        }, 100);
    }
};
obj7.greet();
