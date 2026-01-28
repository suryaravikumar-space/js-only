/**
 * Questions 41-55: Async, Promises & Event Loop
 *
 * Predict the output ORDER for each code snippet.
 */

// Question 41: Basic setTimeout order
console.log("Q41: Start");
setTimeout(() => console.log("Q41: Timeout"), 0);
console.log("Q41: End");

// Question 42: Promise vs setTimeout
console.log("Q42: Start");
setTimeout(() => console.log("Q42: Timeout"), 0);
Promise.resolve().then(() => console.log("Q42: Promise"));
console.log("Q42: End");

// Question 43: Multiple promises
Promise.resolve(1)
    .then(x => {
        console.log("Q43:", x);
        return x + 1;
    })
    .then(x => {
        console.log("Q43:", x);
        return x + 1;
    })
    .then(x => {
        console.log("Q43:", x);
    });

// Question 44: Promise.resolve vs new Promise
console.log("Q44: Start");
Promise.resolve().then(() => console.log("Q44: Promise.resolve"));
new Promise(resolve => {
    console.log("Q44: Inside Promise");
    resolve();
}).then(() => console.log("Q44: new Promise then"));
console.log("Q44: End");

// Question 45: Nested setTimeout
setTimeout(() => {
    console.log("Q45: Outer");
    setTimeout(() => console.log("Q45: Inner"), 0);
}, 0);
console.log("Q45: Sync");

// Question 46: async/await basic
async function asyncFunc() {
    console.log("Q46: Inside async");
    return "Q46: Resolved";
}
console.log("Q46: Before");
asyncFunc().then(console.log);
console.log("Q46: After");

// Question 47: await behavior
async function test() {
    console.log("Q47: 1");
    const result = await Promise.resolve("Q47: 2");
    console.log(result);
    console.log("Q47: 3");
}
console.log("Q47: Start");
test();
console.log("Q47: End");

// Question 48: Promise with throw
Promise.resolve()
    .then(() => {
        console.log("Q48: First");
        throw new Error("Oops");
    })
    .then(() => console.log("Q48: Second"))
    .catch(() => console.log("Q48: Caught"))
    .then(() => console.log("Q48: After catch"));

// Question 49: Promise.all
Promise.all([
    Promise.resolve(1),
    Promise.resolve(2),
    Promise.resolve(3)
]).then(values => console.log("Q49:", values));

// Question 50: Promise.race
Promise.race([
    new Promise(resolve => setTimeout(() => resolve("Q50: Slow"), 100)),
    new Promise(resolve => setTimeout(() => resolve("Q50: Fast"), 50))
]).then(console.log);

// Question 51: Microtask vs Macrotask queue
console.log("Q51: 1");
setTimeout(() => console.log("Q51: 2"), 0);
Promise.resolve().then(() => {
    console.log("Q51: 3");
    Promise.resolve().then(() => console.log("Q51: 4"));
});
console.log("Q51: 5");

// Question 52: setImmediate vs setTimeout vs Promise (Node.js)
// Note: setImmediate is Node.js specific
console.log("Q52: sync");
setTimeout(() => console.log("Q52: timeout"), 0);
Promise.resolve().then(() => console.log("Q52: promise"));
// setImmediate(() => console.log("Q52: immediate")); // Node.js only

// Question 53: async/await with Promise.all
async function parallel() {
    console.log("Q53: Start");
    const [a, b] = await Promise.all([
        Promise.resolve("Q53: A"),
        Promise.resolve("Q53: B")
    ]);
    console.log(a, b);
    console.log("Q53: End");
}
parallel();
console.log("Q53: After call");

// Question 54: Promise finally
Promise.resolve("Q54: Value")
    .then(val => {
        console.log(val);
        return "Q54: Modified";
    })
    .finally(() => {
        console.log("Q54: Finally");
        return "Q54: Ignored";
    })
    .then(val => console.log(val));

// Question 55: Complex event loop
console.log("Q55: 1");

setTimeout(() => {
    console.log("Q55: 2");
    Promise.resolve().then(() => console.log("Q55: 3"));
}, 0);

Promise.resolve().then(() => {
    console.log("Q55: 4");
    setTimeout(() => console.log("Q55: 5"), 0);
});

console.log("Q55: 6");
