/**
 * Answers 41-55: Async, Promises & Event Loop
 *
 * Detailed explanations for each question.
 */

// Question 41: Basic setTimeout order
// Output: Start, End, Timeout
console.log("Q41: Start");
setTimeout(() => console.log("Q41: Timeout"), 0);
console.log("Q41: End");
/**
 * Explanation:
 * 1. Synchronous code runs first (Start, End)
 * 2. setTimeout callback goes to macrotask queue
 * 3. After call stack is empty, event loop picks up timeout
 *
 * Even setTimeout(fn, 0) doesn't run immediately!
 */

// Question 42: Promise vs setTimeout
// Output: Start, End, Promise, Timeout
console.log("Q42: Start");
setTimeout(() => console.log("Q42: Timeout"), 0);
Promise.resolve().then(() => console.log("Q42: Promise"));
console.log("Q42: End");
/**
 * Explanation:
 * 1. Sync code: Start, End
 * 2. Promise.then goes to MICROTASK queue
 * 3. setTimeout goes to MACROTASK queue
 * 4. Microtasks have priority over macrotasks!
 *
 * Order: Sync -> Microtasks -> Macrotasks
 */

// Question 43: Multiple promises
// Output: 1, 2, 3
Promise.resolve(1)
    .then(x => {
        console.log("Q43:", x); // 1
        return x + 1;
    })
    .then(x => {
        console.log("Q43:", x); // 2
        return x + 1;
    })
    .then(x => {
        console.log("Q43:", x); // 3
    });
/**
 * Explanation:
 * Each .then returns a new promise with the returned value.
 * Chained .then's execute in sequence.
 * Return value becomes the input to next .then.
 */

// Question 44: Promise.resolve vs new Promise
// Output: Start, Inside Promise, End, Promise.resolve, new Promise then
console.log("Q44: Start");
Promise.resolve().then(() => console.log("Q44: Promise.resolve"));
new Promise(resolve => {
    console.log("Q44: Inside Promise"); // SYNC!
    resolve();
}).then(() => console.log("Q44: new Promise then"));
console.log("Q44: End");
/**
 * Explanation:
 * The Promise executor function runs SYNCHRONOUSLY!
 * "Inside Promise" prints during sync phase.
 * Both .then callbacks go to microtask queue in order.
 */

// Question 45: Nested setTimeout
// Output: Sync, Outer, Inner
setTimeout(() => {
    console.log("Q45: Outer");
    setTimeout(() => console.log("Q45: Inner"), 0);
}, 0);
console.log("Q45: Sync");
/**
 * Explanation:
 * 1. Sync runs first
 * 2. First timeout callback runs, schedules another timeout
 * 3. Second timeout runs in next event loop iteration
 */

// Question 46: async/await basic
// Output: Before, Inside async, After, Resolved
async function asyncFunc() {
    console.log("Q46: Inside async");
    return "Q46: Resolved";
}
console.log("Q46: Before");
asyncFunc().then(console.log);
console.log("Q46: After");
/**
 * Explanation:
 * async function executes synchronously until first await.
 * "Inside async" is sync (no await before it).
 * .then callback is async (microtask).
 */

// Question 47: await behavior
// Output: Start, 1, End, 2, 3
async function test() {
    console.log("Q47: 1");
    const result = await Promise.resolve("Q47: 2");
    console.log(result);
    console.log("Q47: 3");
}
console.log("Q47: Start");
test();
console.log("Q47: End");
/**
 * Explanation:
 * 1. "Start" - sync
 * 2. "1" - sync (inside async, before await)
 * 3. await pauses function, returns to caller
 * 4. "End" - sync
 * 5. "2", "3" - after await resolves (microtask)
 */

// Question 48: Promise with throw
// Output: First, Caught, After catch
Promise.resolve()
    .then(() => {
        console.log("Q48: First");
        throw new Error("Oops");
    })
    .then(() => console.log("Q48: Second")) // SKIPPED
    .catch(() => console.log("Q48: Caught"))
    .then(() => console.log("Q48: After catch"));
/**
 * Explanation:
 * throw inside .then rejects the promise.
 * "Second" is skipped - goes to nearest .catch.
 * .catch returns resolved promise, so "After catch" runs.
 */

// Question 49: Promise.all
// Output: [1, 2, 3]
Promise.all([
    Promise.resolve(1),
    Promise.resolve(2),
    Promise.resolve(3)
]).then(values => console.log("Q49:", values));
/**
 * Explanation:
 * Promise.all waits for ALL promises to resolve.
 * Returns array of results in same order.
 * If any rejects, entire Promise.all rejects.
 */

// Question 50: Promise.race
// Output: "Q50: Fast"
Promise.race([
    new Promise(resolve => setTimeout(() => resolve("Q50: Slow"), 100)),
    new Promise(resolve => setTimeout(() => resolve("Q50: Fast"), 50))
]).then(console.log);
/**
 * Explanation:
 * Promise.race returns the FIRST promise to settle.
 * "Fast" resolves at 50ms, wins the race.
 * Other promises still run but are ignored.
 */

// Question 51: Microtask vs Macrotask queue
// Output: 1, 5, 3, 4, 2
console.log("Q51: 1");
setTimeout(() => console.log("Q51: 2"), 0);
Promise.resolve().then(() => {
    console.log("Q51: 3");
    Promise.resolve().then(() => console.log("Q51: 4"));
});
console.log("Q51: 5");
/**
 * Explanation:
 * 1. Sync: 1, 5
 * 2. Microtask: 3 (then schedules another microtask)
 * 3. New microtask: 4 (microtasks drain before macrotasks!)
 * 4. Macrotask: 2
 *
 * Key: ALL microtasks run before ANY macrotask!
 */

// Question 52: setImmediate vs setTimeout vs Promise (Node.js)
// Output: sync, promise, timeout
console.log("Q52: sync");
setTimeout(() => console.log("Q52: timeout"), 0);
Promise.resolve().then(() => console.log("Q52: promise"));
/**
 * Explanation:
 * Same as before: Sync -> Microtask -> Macrotask
 *
 * In Node.js with setImmediate:
 * - Promise (microtask) runs first
 * - setTimeout vs setImmediate order depends on timing
 */

// Question 53: async/await with Promise.all
// Output: Start, After call, A B, End
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
/**
 * Explanation:
 * 1. "Start" - sync inside async
 * 2. await pauses at Promise.all
 * 3. "After call" - sync in main
 * 4. "A B", "End" - after await resolves
 */

// Question 54: Promise finally
// Output: Value, Finally, Modified
Promise.resolve("Q54: Value")
    .then(val => {
        console.log(val);          // "Value"
        return "Q54: Modified";
    })
    .finally(() => {
        console.log("Q54: Finally");
        return "Q54: Ignored";     // Return is ignored!
    })
    .then(val => console.log(val)); // "Modified"
/**
 * Explanation:
 * finally() runs regardless of resolve/reject.
 * finally() does NOT receive a value.
 * finally()'s return value is IGNORED (passes through previous).
 * Great for cleanup (closing connections, etc.)
 */

// Question 55: Complex event loop
// Output: 1, 6, 4, 2, 3, 5
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
/**
 * Explanation:
 * 1. Sync: 1, 6
 * 2. Microtask: 4 (schedules timeout for 5)
 * 3. Macrotask: 2 (schedules microtask for 3)
 * 4. Microtask: 3 (microtasks drain after each macrotask!)
 * 5. Macrotask: 5
 *
 * After each macrotask, microtask queue is fully drained!
 */

console.log("\n=== Event Loop Summary ===");
console.log("1. Call Stack executes sync code");
console.log("2. Microtask Queue: Promises, queueMicrotask, MutationObserver");
console.log("3. Macrotask Queue: setTimeout, setInterval, I/O");
console.log("4. Order: Sync -> All Microtasks -> One Macrotask -> Repeat");
console.log("5. Microtasks can schedule more microtasks (all drain before macrotasks)");
