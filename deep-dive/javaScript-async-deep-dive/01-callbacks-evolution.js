/**
 * ╔══════════════════════════════════════════════════════════════════════════════╗
 * ║                                                                              ║
 * ║                    JAVASCRIPT ASYNC DEEP DIVE                                ║
 * ║                  PART 1: CALLBACKS - THE FOUNDATION                          ║
 * ║                                                                              ║
 * ╚══════════════════════════════════════════════════════════════════════════════╝
 *
 *
 * ╔══════════════════════════════════════════════════════════════════════════════╗
 * ║  🎤 1-2 MINUTE INTERVIEW EXPLANATION                                         ║
 * ╠══════════════════════════════════════════════════════════════════════════════╣
 * ║                                                                              ║
 * ║  "Callbacks are the foundation of async JavaScript. A callback is simply a  ║
 * ║   function passed as an argument to another function, to be executed later. ║
 * ║                                                                              ║
 * ║   JavaScript is SINGLE-THREADED, meaning it can only do one thing at a time.║
 * ║   But we need to handle operations like API calls, file reads, and timers   ║
 * ║   that take time. Instead of BLOCKING and waiting, JavaScript uses the      ║
 * ║   EVENT LOOP to handle these things asynchronously.                                ║
 * ║                                                                              ║
 * ║   When we call setTimeout or fetch, JavaScript:                             ║
 * ║   1. Hands off the task to Web APIs (browser) or libuv (Node)               ║
 * ║   2. Continues executing the rest of the code                               ║
 * ║   3. When the task completes, the callback is added to the TASK QUEUE       ║
 * ║   4. Event loop picks it(i.e. callback) up when the call stack is empty                    ║
 * ║                                                                              ║
 * ║   The problem with callbacks is CALLBACK HELL - deeply nested callbacks     ║
 * ║   that make code hard to read and maintain. This led to Promises and        ║
 * ║   async/await which we'll cover next."                                      ║
 * ║                                                                              ║
 * ║  KEY POINTS TO MENTION:                                                      ║
 * ║  • Callbacks = functions passed to other functions                           ║
 * ║  • JavaScript is single-threaded but NON-BLOCKING                           ║
 * ║  • Event loop enables async behavior                                         ║
 * ║  • Callback hell = nested callbacks = hard to maintain                       ║
 * ║  • Error-first pattern: callback(error, result)                              ║
 * ╚══════════════════════════════════════════════════════════════════════════════╝
 *
 *
 * ┌──────────────────────────────────────────────────────────────────────────────┐
 * │ WHAT IS ASYNC JAVASCRIPT?                                                    │
 * └──────────────────────────────────────────────────────────────────────────────┘
 *
 *   JavaScript is SINGLE-THREADED but needs to handle time-consuming operations
 *   without freezing. This is where ASYNCHRONOUS programming comes in!
 *
 *
 *   ┌─────────────────────────────────────────────────────────────────────────────┐
 *   │                    SYNCHRONOUS vs ASYNCHRONOUS                              │
 *   ├─────────────────────────────────────────────────────────────────────────────┤
 *   │                                                                             │
 *   │   SYNCHRONOUS (Blocking)           ASYNCHRONOUS (Non-Blocking)              │
 *   │   ========================         ============================             │
 *   │                                                                             │
 *   │   Task A ████████████              Task A ████                              │
 *   │                     │                        │                              │
 *   │   Task B ░░░░░░░░░░░░████████      Task B    ████████                       │
 *   │                               │                      │                      │
 *   │   Task C ░░░░░░░░░░░░░░░░░░░░░████  Task C          ████                    │
 *   │                                                                             │
 *   │   ░░░ = Waiting (Blocked)          Tasks run concurrently!                  │
 *   │   ███ = Executing                  (not parallel, but interleaved)          │
 *   │                                                                             │
 *   │   Total: Sum of all tasks          Total: Longest task                      │
 *   └─────────────────────────────────────────────────────────────────────────────┘
 *
 *
 *
 * ┌──────────────────────────────────────────────────────────────────────────────┐
 * │ CALLBACK ARCHITECTURE - COMPLETE VISUAL                                      │
 * └──────────────────────────────────────────────────────────────────────────────┘
 *
 *
 *   ╔════════════════════════════════════════════════════════════════════════════╗
 *   ║                    JAVASCRIPT RUNTIME ENVIRONMENT                          ║
 *   ╠════════════════════════════════════════════════════════════════════════════╣
 *   ║                                                                            ║
 *   ║  ┌────────────────────┐          ┌─────────────────────────────────────┐   ║
 *   ║  │    CALL STACK      │          │           WEB APIs / libuv          │   ║
 *   ║  │    (Single Thread) │          │         (Separate Threads)          │   ║
 *   ║  │                    │          │                                     │   ║
 *   ║  │  ┌──────────────┐  │          │  ┌─────────────┐  ┌─────────────┐   │   ║
 *   ║  │  │ setTimeout() │──┼──────────┼─▶│   Timer     │  │    HTTP     │   │   ║
 *   ║  │  └──────────────┘  │          │  │   Thread    │  │   Thread    │   │   ║
 *   ║  │  ┌──────────────┐  │          │  └──────┬──────┘  └──────┬──────┘   │   ║
 *   ║  │  │   main()     │  │          │         │                │          │   ║
 *   ║  │  └──────────────┘  │          │  ┌──────┴────────────────┴──────┐   │   ║
 *   ║  │                    │          │  │   When done, add callback    │   │   ║
 *   ║  └────────────────────┘          │  │   to appropriate queue       │   │   ║
 *   ║           ▲                      │  └──────────────┬───────────────┘   │   ║
 *   ║           │                      └─────────────────┼───────────────────┘   ║
 *   ║           │                                        │                       ║
 *   ║           │                                        ▼                       ║
 *   ║           │                      ┌─────────────────────────────────────┐   ║
 *   ║           │                      │          TASK QUEUES                │   ║
 *   ║           │                      │                                     │   ║
 *   ║           │                      │  ┌─────────────────────────────┐    │   ║
 *   ║           │                      │  │ MICROTASK QUEUE (Priority)  │    │   ║
 *   ║           │                      │  │ • Promise.then()            │    │   ║
 *   ║           │                      │  │ • queueMicrotask()          │    │   ║
 *   ║           │                      │  └─────────────────────────────┘    │   ║
 *   ║           │                      │                                     │   ║
 *   ║           │                      │  ┌─────────────────────────────┐    │   ║
 *   ║           │                      │  │ MACROTASK QUEUE             │    │   ║
 *   ║           │  ┌───────────────┐   │  │ • setTimeout/setInterval    │    │   ║
 *   ║           └──│  EVENT LOOP   │◀──┼──│ • I/O callbacks             │    │   ║
 *   ║              │               │   │  │ • setImmediate (Node)       │    │   ║
 *   ║              │ Continuously  │   │  └─────────────────────────────┘    │   ║
 *   ║              │ checks queues │   │                                     │   ║
 *   ║              └───────────────┘   └─────────────────────────────────────┘   ║
 *   ║                                                                            ║
 *   ╚════════════════════════════════════════════════════════════════════════════╝
 *
 *
 *
 * ┌──────────────────────────────────────────────────────────────────────────────┐
 * │ EXECUTION FLOW - STEP BY STEP                                                │
 * └──────────────────────────────────────────────────────────────────────────────┘
 *
 *   Let's trace: 
 *      console.log("A"); 
 *      setTimeout(() => console.log("B"), 0); 
 *      console.log("C");
 *
 *
 *   STEP 1: Execute console.log("A")
 *   ════════════════════════════════════════════════════════════════════════════
 *
 *      Call Stack              Web APIs              Task Queue
 *   ┌──────────────────┐    ┌──────────────────┐   ┌──────────────────┐
 *   │ console.log("A") │    │                  │   │                  │
 *   │ main()           │    │     (empty)      │   │     (empty)      │
 *   └──────────────────┘    └──────────────────┘   └──────────────────┘
 *
 *   OUTPUT: "A"
 *
 *
 *   STEP 2: Execute setTimeout() - Register callback with Web API
 *   ════════════════════════════════════════════════════════════════════════════
 *
 *      Call Stack              Web APIs              Task Queue
 *   ┌──────────────────┐    ┌──────────────────┐   ┌──────────────────┐
 *   │ setTimeout()     │───▶│ Timer: 0ms       │   │                  │
 *   │ main()           │    │ callback: log(B) │   │     (empty)      │
 *   └──────────────────┘    └──────────────────┘   └──────────────────┘
 *
 *   setTimeout returns immediately! (non-blocking)
 *
 *
 *   STEP 3: Execute console.log("C") - Timer completes in background
 *   ════════════════════════════════════════════════════════════════════════════
 *
 *      Call Stack              Web APIs              Task Queue
 *   ┌──────────────────┐    ┌──────────────────┐   ┌──────────────────┐
 *   │ console.log("C") │    │                  │   │  () => log("B")  │
 *   │ main()           │    │  Timer done! ────┼──▶│                  │
 *   └──────────────────┘    └──────────────────┘   └──────────────────┘
 *
 *   OUTPUT: "C"
 *
 *
 *   STEP 4: Call stack empty - Event loop picks up callback
 *   ════════════════════════════════════════════════════════════════════════════
 *
 *      Call Stack              Event Loop            Task Queue
 *   ┌──────────────────┐    ┌──────────────────┐   ┌──────────────────┐
 *   │                  │◀───│  Stack empty?    │───│  () => log("B")  │
 *   │     (empty)      │    │  Yes! Move task  │   │                  │
 *   └──────────────────┘    └──────────────────┘   └──────────────────┘
 *
 *
 *   STEP 5: Execute the callback
 *   ════════════════════════════════════════════════════════════════════════════
 *
 *      Call Stack              Event Loop            Task Queue
 *   ┌──────────────────┐    ┌──────────────────┐   ┌──────────────────┐
 *   │ console.log("B") │    │                  │   │                  │
 *   │ callback()       │    │                  │   │     (empty)      │
 *   └──────────────────┘    └──────────────────┘   └──────────────────┘
 *
 *   OUTPUT: "B"
 *
 *   ═══════════════════════════════════════════════════════════════════════════
 *   FINAL OUTPUT ORDER: "A", "C", "B"    (not A, B, C!)
 *   ═══════════════════════════════════════════════════════════════════════════
 *
 *
 *
 * ┌──────────────────────────────────────────────────────────────────────────────┐
 * │ WHAT IS A CALLBACK?                                                          │
 * └──────────────────────────────────────────────────────────────────────────────┘
 *
 *
 *   ┌─────────────────────────────────────────────────────────────────────────────┐
 *   │                        CALLBACK DEFINITION                                  │
 *   ├─────────────────────────────────────────────────────────────────────────────┤
 *   │                                                                             │
 *   │    A callback is a function passed as an argument to another function,      │
 *   │    to be invoked ("called back") at a later time.                           │
 *   │                                                                             │
 *   │    function doSomething(callback) {                                         │
 *   │        // ... do work ...                                                   │
 *   │        callback(result);    // "Call back" the function                     │
 *   │    }                                                                        │
 *   │                                                                             │
 *   │    doSomething(function(result) {                                           │
 *   │        console.log(result);  // This is the callback!                       │
 *   │    });                                                                      │
 *   │                                                                             │
 *   └─────────────────────────────────────────────────────────────────────────────┘
 *
 *
 *   ┌─────────────────────────────────────────────────────────────────────────────┐
 *   │               TWO TYPES OF CALLBACKS                                        │
 *   ├─────────────────────────────────────────────────────────────────────────────┤
 *   │                                                                             │
 *   │   SYNCHRONOUS CALLBACKS              ASYNCHRONOUS CALLBACKS                 │
 *   │   ═══════════════════════           ════════════════════════                │
 *   │                                                                             │
 *   │   Execute IMMEDIATELY               Execute LATER (after delay)             │
 *   │   in the same tick                  in a future tick                        │
 *   │                                                                             │
 *   │   Examples:                         Examples:                               │
 *   │   • array.forEach(cb)               • setTimeout(cb, ms)                    │
 *   │   • array.map(cb)                   • setInterval(cb, ms)                   │
 *   │   • array.filter(cb)                • fs.readFile(path, cb)                 │
 *   │   • array.reduce(cb, init)          • fetch().then(cb)                      │
 *   │   • array.sort(cb)                  • addEventListener(event, cb)           │
 *   │                                                                             │
 *   │   Blocking                          Non-blocking                            │
 *   │                                                                             │
 *   └─────────────────────────────────────────────────────────────────────────────┘
 *
 *
 */


// ════════════════════════════════════════════════════════════════════════════════
// SECTION 1: SYNCHRONOUS vs ASYNCHRONOUS - EXECUTION DEMO
// ════════════════════════════════════════════════════════════════════════════════

console.log("═══ SECTION 1: SYNC vs ASYNC ═══\n");

/**
 * ┌─────────────────────────────────────────────────────────────────────────────┐
 * │ SYNCHRONOUS EXECUTION VISUALIZATION                                         │
 * └─────────────────────────────────────────────────────────────────────────────┘
 *
 *   Timeline:
 *   ─────────────────────────────────────────────────────────────────────────▶ time
 *
 *   Step 1 ████████████████
 *                         ↓
 *   Step 2                ████████████████
 *                                        ↓
 *   Step 3                               ████████████████
 *
 *   Each step WAITS for the previous to complete!
 */

function synchronousExample() {
    console.log("SYNC Step 1: Start");

    // Simulate heavy work (blocking)
    let result = 0;
    for (let i = 0; i < 100000; i++) {
        result += i;
    }
    console.log("SYNC Step 2: Calculation done");

    console.log("SYNC Step 3: End");
}

synchronousExample();

// Output: Step 1 → Step 2 → Step 3 (guaranteed order)


/**
 * ┌─────────────────────────────────────────────────────────────────────────────┐
 * │ ASYNCHRONOUS EXECUTION VISUALIZATION                                        │
 * └─────────────────────────────────────────────────────────────────────────────┘
 *
 *   Timeline:
 *   ─────────────────────────────────────────────────────────────────────────▶ time
 *
 *   Step 1 ████
 *              │
 *   Step 3     ████
 *                  │
 *   Step 2         │...waiting...│████  (callback executes later)
 *
 *   Step 3 doesn't wait for Step 2!
 */

console.log("\n--- Async Example ---");

function asynchronousExample() {
    console.log("ASYNC Step 1: Start");

    setTimeout(() => {
        console.log("ASYNC Step 2: Timeout callback (executes LAST!)");
    }, 0);  // Even 0ms delay!

    console.log("ASYNC Step 3: End (executes BEFORE Step 2!)");
}

asynchronousExample();
// Output: Step 1 → Step 3 → Step 2 (Step 2 is deferred!)


// ════════════════════════════════════════════════════════════════════════════════
// SECTION 2: SYNCHRONOUS CALLBACKS - Array Methods
// ════════════════════════════════════════════════════════════════════════════════

console.log("\n═══ SECTION 2: SYNCHRONOUS CALLBACKS ═══\n");

/**
 * ┌─────────────────────────────────────────────────────────────────────────────┐
 * │ SYNCHRONOUS CALLBACK EXECUTION FLOW                                         │
 * └─────────────────────────────────────────────────────────────────────────────┘
 *
 *   [1, 2, 3].forEach(callback)
 *
 *                    forEach(callback)
 *                          │
 *          ┌───────────────┼───────────────┐
 *          │               │               │
 *          ▼               ▼               ▼
 *     callback(1)    callback(2)    callback(3)
 *          │               │               │
 *          ▼               ▼               ▼
 *       return          return          return
 *          │               │               │
 *          └───────────────┴───────────────┘
 *                          │
 *                          ▼
 *                   forEach returns
 *                   (all callbacks done!)
 */

console.log("Before forEach");

[1, 2, 3].forEach((num) => {
    console.log(`  forEach processing: ${num}`);
});

console.log("After forEach");



// Output: Before → 1 → 2 → 3 → After (synchronous!)


/**
 * ┌─────────────────────────────────────────────────────────────────────────────┐
 * │ COMMON ARRAY METHODS WITH CALLBACKS                                         │
 * ├─────────────────────────────────────────────────────────────────────────────┤
 * │                                                                             │
 * │   METHOD        CALLBACK SIGNATURE         RETURNS                          │
 * │   ══════════════════════════════════════════════════════                    │
 * │   forEach       (item, index, arr)         undefined                        │
 * │   map           (item, index, arr)         new array                        │
 * │   filter        (item, index, arr)         new array                        │
 * │   find          (item, index, arr)         item or undefined                │
 * │   findIndex     (item, index, arr)         index or -1                      │
 * │   some          (item, index, arr)         boolean                          │
 * │   every         (item, index, arr)         boolean                          │
 * │   reduce        (acc, item, index, arr)    accumulated value                │
 * │   sort          (a, b)                     mutated array                    │
 * │                                                                             │
 * └─────────────────────────────────────────────────────────────────────────────┘
 */

const numbers = [1, 3, 4, 5];

// map - transform each element
const doubled = numbers.map(n => n * 2);
console.log("map (doubled):", doubled);  // [2, 4, 6, 8, 10]

// filter - keep elements that pass test
const evens = numbers.filter(n => n % 2 === 0);
console.log("filter (evens):", evens);  // [2, 4]

// reduce - accumulate to single value
const sum = numbers.reduce((acc, n) => acc + n, 0);
console.log("reduce (sum):", sum);  // 15

// find - first element that passes test
const firstEven = numbers.find(n => n % 2 === 0);
console.log("find (first even):", firstEven);  // 2


// ════════════════════════════════════════════════════════════════════════════════
// SECTION 3: ASYNCHRONOUS CALLBACKS - Timers & Eventsr
// ════════════════════════════════════════════════════════════════════════════════

console.log("\n═══ SECTION 3: ASYNCHRONOUS CALLBACKS ═══\n");

/**
 * ┌─────────────────────────────────────────────────────────────────────────────┐
 * │ setTimeout EXECUTION FLOW                                                   │
 * └─────────────────────────────────────────────────────────────────────────────┘
 *
 *
 *   Code: setTimeout(callback, 1000)
 *
 *   ┌─────────────────────────────────────────────────────────────────────────┐
 *   │ CALL STACK                    │ WEB API                                 │
 *   │                               │                                         │
 *   │ setTimeout() ─────────────────┼──▶ Timer starts (1000ms)                │
 *   │       │                       │         │                               │
 *   │       ▼                       │         │ counting...                   │
 *   │  (returns immediately)        │         │                               │
 *   │                               │         ▼                               │
 *   │  Other code executes...       │    Timer done!                          │
 *   │                               │         │                               │
 *   │                               │         ▼                               │
 *   │                               │    callback ──▶ TASK QUEUE              │
 *   └─────────────────────────────────────────────────────────────────────────┘
 *
 *   EVENT LOOP: When call stack empty, move callback from queue to stack
 */

console.log("Timer Example:");
console.log("1. Setting timer...");

setTimeout(() => {
    console.log("3. Timer callback! (runs after stack is empty)");
}, 1000);

console.log("2. Timer set, continuing...");

// Output: 1 → 2 → 3


/**
 * ┌─────────────────────────────────────────────────────────────────────────────┐
 * │ setInterval EXECUTION FLOW                                                  │
 * └─────────────────────────────────────────────────────────────────────────────┘
 *
 *   setInterval(callback, 500)
 *
 *   Timeline:
 *   ═══════════════════════════════════════════════════════════════════════▶ time
 *   │
 *   │  0ms      500ms     1000ms    1500ms    2000ms
 *   │   │         │          │         │         │
 *   │   │       ┌─┴─┐      ┌─┴─┐     ┌─┴─┐     ┌─┴─┐
 *   │   │       │ cb │     │ cb │    │ cb │    │ cb │   ← Repeats!
 *   │   │       └───┘      └───┘     └───┘     └───┘
 *   │   │
 *   └───┴── setInterval()
 *           returns ID
 */

let count = 0;
const intervalId = setInterval(() => {
    count++;
    console.log(`Interval tick ${count}`);

    if (count >= 3) {
        clearInterval(intervalId);  // Stop after 3 ticks
        console.log("Interval cleared!");
    }
}, 500);


// ════════════════════════════════════════════════════════════════════════════════
// SECTION 4: ERROR-FIRST CALLBACK PATTERN (Node.js Convention)
// ════════════════════════════════════════════════════════════════════════════════

console.log("\n═══ SECTION 4: ERROR-FIRST PATTERN ═══\n");

/**
 * ┌─────────────────────────────────────────────────────────────────────────────┐
 * │ ERROR-FIRST CALLBACK PATTERN                                                │
 * ├─────────────────────────────────────────────────────────────────────────────┤
 * │                                                                             │
 * │   callback(error, result)                                                   │
 * │             │       │                                                       │
 * │             │       └──── Second param: the data (if success)               │
 * │             │                                                               │
 * │             └──────────── First param: error object (null if success)       │
 * │                                                                             │
 * │                                                                             │
 * │   ┌─────────────────────────────────────────────────────────────────────┐   │
 * │   │ WHY ERROR FIRST?                                                    │   │
 * │   │                                                                     │   │
 * │   │ 1. Consistent pattern across all Node.js APIs                       │   │
 * │   │ 2. Forces error handling (can't ignore first param)                 │   │
 * │   │ 3. Easy to check: if (error) { handle } else { use result }         │   │
 * │   └─────────────────────────────────────────────────────────────────────┘   │
 * │                                                                             │
 * └─────────────────────────────────────────────────────────────────────────────┘
 *
 *
 *   DECISION FLOW:
 *
 *        callback(error, result)
 *                  │
 *                  ▼
 *        ┌─────────────────┐
 *        │  error truthy?  │
 *        └────────┬────────┘
 *                 │
 *         ┌──────┴──────┐
 *         │             │
 *        YES           NO
 *         │             │
 *         ▼             ▼
 *   ┌──────────┐  ┌──────────┐
 *   │  FAILED  │  │ SUCCESS  │
 *   │ Handle   │  │ Use      │
 *   │ error    │  │ result   │
 *   └──────────┘  └──────────┘
 */

// Simulating an async operation with error-first callback
function readFile(filename, callback) {
    setTimeout(() => {
        // Simulate error for certain filenames
        if (filename === "missing.txt") {
            callback(new Error("ENOENT: File not found"), null);
            return;
        }

        // Success case
        callback(null, `Contents of ${filename}`);
    }, 100);
}

// Using the error-first pattern
readFile("data.txt", (error, data) => {
    if (error) {
        console.error("Error reading file:", error.message);
        return;  // IMPORTANT: Return early on error!
    }
    console.log("File data:", data);
});

readFile("missing.txt", (error, data) => {
    if (error) {
        console.error("Error reading file:", error.message);
        return;
    }
    console.log("File data:", data);
});


// ════════════════════════════════════════════════════════════════════════════════
// SECTION 5: CALLBACK HELL (The Pyramid of Doom)
// ════════════════════════════════════════════════════════════════════════════════

console.log("\n═══ SECTION 5: CALLBACK HELL ═══\n");

/**
 * ┌─────────────────────────────────────────────────────────────────────────────┐
 * │ THE PYRAMID OF DOOM                                                         │
 * └─────────────────────────────────────────────────────────────────────────────┘
 *
 *   As async operations depend on each other, callbacks nest deeper:
 *
 *   operation1(function(result1) {
 *       operation2(result1, function(result2) {
 *           operation3(result2, function(result3) {
 *               operation4(result3, function(result4) {
 *                   operation5(result4, function(result5) {
 *                       // We're FIVE levels deep!
 *                       // This is CALLBACK HELL!
 *                   });
 *               });
 *           });
 *       });
 *   });
 *
 *
 *   VISUAL REPRESENTATION:
 *
 *   ┌──────────────────────────────────────────────────────────────────────────┐
 *   │ operation1 ────────────────────────────────────────────────────────────▶ │
 *   │     │                                                                    │
 *   │     └──▶ operation2 ────────────────────────────────────────────────▶   │
 *   │              │                                                           │
 *   │              └──▶ operation3 ────────────────────────────────────▶      │
 *   │                       │                                                  │
 *   │                       └──▶ operation4 ────────────────────────▶         │
 *   │                                │                                         │
 *   │                                └──▶ operation5 ────────────▶            │
 *   │                                         │                                │
 *   │                                         └──▶ final result               │
 *   └──────────────────────────────────────────────────────────────────────────┘
 *
 *   Code moves RIGHT instead of DOWN - hard to read!
 */

// Simulated async functions
function getUser(userId, callback) {
    setTimeout(() => {
        console.log("  → Got user");
        callback(null, { id: userId, name: "John" });
    }, 100);
}

function getPosts(userId, callback) {
    setTimeout(() => {
        console.log("  → Got posts");
        callback(null, [{ id: 1, title: "Hello World" }, { id: 2, title: "Async JS" }]);
    }, 100);
}

function getComments(postId, callback) {
    setTimeout(() => {
        console.log("  → Got comments");
        callback(null, [{ id: 1, text: "Great post!" }]);
    }, 100);
}

// THE CALLBACK HELL EXAMPLE:
console.log("Callback Hell Example:");

getUser(1, (err, user) => {
    if (err) return console.error(err);
    console.log("User:", user.name);

    getPosts(user.id, (err, posts) => {
        if (err) return console.error(err);
        console.log("First post:", posts[0].title);

        getComments(posts[0].id, (err, comments) => {
            if (err) return console.error(err);
            console.log("First comment:", comments[0].text);

            // Imagine more nesting here...
            // This is CALLBACK HELL!
        });
    });
});


/**
 * ┌─────────────────────────────────────────────────────────────────────────────┐
 * │ PROBLEMS WITH CALLBACK HELL                                                 │
 * ├─────────────────────────────────────────────────────────────────────────────┤
 * │                                                                             │
 * │   1. READABILITY                                                            │
 * │      • Code becomes pyramid-shaped                                          │
 * │      • Hard to follow the flow                                              │
 * │      • Logic is spread across many indentation levels                       │
 * │                                                                             │
 * │   2. ERROR HANDLING                                                         │
 * │      • Must handle errors at every level                                    │
 * │      • Easy to forget error checks                                          │
 * │      • No centralized error handling                                        │
 * │                                                                             │
 * │   3. MAINTAINABILITY                                                        │
 * │      • Hard to add/remove/reorder steps                                     │
 * │      • Debugging is difficult                                               │
 * │      • Refactoring requires careful nesting                                 │
 * │                                                                             │
 * │   4. INVERSION OF CONTROL                                                   │
 * │      • You give control to external function                                │
 * │      • What if they call callback twice?                                    │
 * │      • What if they never call it?                                          │
 * │                                                                             │
 * └─────────────────────────────────────────────────────────────────────────────┘
 */


// ════════════════════════════════════════════════════════════════════════════════
// SECTION 6: SOLUTIONS TO CALLBACK HELL
// ════════════════════════════════════════════════════════════════════════════════

console.log("\n═══ SECTION 6: SOLUTIONS TO CALLBACK HELL ═══\n");

/**
 * ┌─────────────────────────────────────────────────────────────────────────────┐
 * │ SOLUTION 1: NAMED FUNCTIONS (Flattening)                                    │
 * └─────────────────────────────────────────────────────────────────────────────┘
 *
 *   Instead of anonymous nested functions, use named functions:
 *
 *   BEFORE (nested):                    AFTER (flat):
 *
 *   op1((r1) => {                       function handleOp1(r1) {
 *       op2(r1, (r2) => {                   op2(r1, handleOp2);
 *           op3(r2, (r3) => {           }
 *               // deep!                function handleOp2(r2) {
 *           });                             op3(r2, handleOp3);
 *       });                             }
 *   });                                 function handleOp3(r3) {
 *                                           // flat!
 *                                       }
 *                                       op1(handleOp1);
 */

// Solution 1: Named Functions
function handleUser(err, user) {
    if (err) return console.error(err);
    console.log("(Named) User:", user.name);
    getPosts(user.id, handlePosts);
}

function handlePosts(err, posts) {
    if (err) return console.error(err);
    console.log("(Named) First post:", posts[0].title);
    getComments(posts[0].id, handleComments);
}

function handleComments(err, comments) {
    if (err) return console.error(err);
    console.log("(Named) First comment:", comments[0].text);
}

// Flat call!
setTimeout(() => {
    console.log("\nNamed Functions Solution:");
    getUser(1, handleUser);
}, 1500);


/**
 * ┌─────────────────────────────────────────────────────────────────────────────┐
 * │ SOLUTION 2: PROMISES (Modern Approach)                                      │
 * └─────────────────────────────────────────────────────────────────────────────┘
 *
 *   Promises allow chaining instead of nesting:
 *
 *   getUserPromise(1)
 *       .then(user => getPostsPromise(user.id))
 *       .then(posts => getCommentsPromise(posts[0].id))
 *       .then(comments => console.log(comments))
 *       .catch(error => console.error(error));  // One error handler!
 *
 *   ══════════════════════════════════════════════════════════════════════════
 *   COVERED IN DETAIL IN: 02-promises-internals.js
 *   ══════════════════════════════════════════════════════════════════════════
 */


/**
 * ┌─────────────────────────────────────────────────────────────────────────────┐
 * │ SOLUTION 3: ASYNC/AWAIT (Most Readable)                                     │
 * └─────────────────────────────────────────────────────────────────────────────┘
 *
 *   async function getData() {
 *       try {
 *           const user = await getUserPromise(1);
 *           const posts = await getPostsPromise(user.id);
 *           const comments = await getCommentsPromise(posts[0].id);
 *           console.log(comments);
 *       } catch (error) {
 *           console.error(error);
 *       }
 *   }
 *
 *   Looks like synchronous code!
 *
 *   ══════════════════════════════════════════════════════════════════════════
 *   COVERED IN DETAIL IN: 03-async-await-mechanics.js
 *   ══════════════════════════════════════════════════════════════════════════
 */


// ════════════════════════════════════════════════════════════════════════════════
// SECTION 7: HIGHER-ORDER FUNCTIONS WITH CALLBACKS
// ════════════════════════════════════════════════════════════════════════════════

console.log("\n═══ SECTION 7: HIGHER-ORDER FUNCTIONS ═══\n");

/**
 * ┌─────────────────────────────────────────────────────────────────────────────┐
 * │ HIGHER-ORDER FUNCTION DEFINITION                                            │
 * ├─────────────────────────────────────────────────────────────────────────────┤
 * │                                                                             │
 * │   A higher-order function is a function that:                               │
 * │                                                                             │
 * │   1. Takes one or more functions as arguments (callbacks)                   │
 * │      OR                                                                     │
 * │   2. Returns a function                                                     │
 * │                                                                             │
 * │                                                                             │
 * │   ┌───────────────────────┐     ┌───────────────────────┐                  │
 * │   │ Takes function as arg │     │ Returns a function    │                  │
 * │   │                       │     │                       │                  │
 * │   │  higherOrder(callback)│     │  higherOrder()        │                  │
 * │   │       │               │     │       │               │                  │
 * │   │       ▼               │     │       ▼               │                  │
 * │   │  callback(data)       │     │  return function(){}  │                  │
 * │   └───────────────────────┘     └───────────────────────┘                  │
 * │                                                                             │
 * └─────────────────────────────────────────────────────────────────────────────┘
 */

// Example 1: Function taking callbacks
function calculate(a, b, operation) {
    return operation(a, b);
}

const add = (x, y) => x + y;
const multiply = (x, y) => x * y;

console.log("calculate(5, 3, add):", calculate(5, 3, add));           // 8
console.log("calculate(5, 3, multiply):", calculate(5, 3, multiply)); // 15


// Example 2: Function returning a function (closure)
function createMultiplier(factor) {
    return function(number) {
        return number * factor;
    };
}

const double = createMultiplier(2);
const triple = createMultiplier(3);

console.log("double(5):", double(5));   // 10
console.log("triple(5):", triple(5));   // 15


// Example 3: Async wrapper
function delay(ms) {
    return function(callback) {
        setTimeout(callback, ms);
    };
}

const after500ms = delay(500);
after500ms(() => console.log("500ms later!"));


// ════════════════════════════════════════════════════════════════════════════════
// SECTION 8: CALLBACK BEST PRACTICES
// ════════════════════════════════════════════════════════════════════════════════

console.log("\n═══ SECTION 8: BEST PRACTICES ═══\n");

/**
 * ┌─────────────────────────────────────────────────────────────────────────────┐
 * │ CALLBACK BEST PRACTICES                                                     │
 * ├─────────────────────────────────────────────────────────────────────────────┤
 * │                                                                             │
 * │   1. ALWAYS HANDLE ERRORS                                                   │
 * │      ─────────────────────────────────────────────────────────────────────  │
 * │      doAsync((err, result) => {                                             │
 * │          if (err) {                                                         │
 * │              console.error(err);                                            │
 * │              return;  // Don't forget to return!                            │
 * │          }                                                                  │
 * │          // Use result                                                      │
 * │      });                                                                    │
 * │                                                                             │
 * │                                                                             │
 * │   2. DON'T CALL CALLBACK MULTIPLE TIMES                                     │
 * │      ─────────────────────────────────────────────────────────────────────  │
 * │                                                                             │
 * │      // BAD:                         // GOOD:                               │
 * │      function bad(cb) {              function good(cb) {                    │
 * │          if (x) cb(null, 1);             if (x) return cb(null, 1);         │
 * │          cb(null, 2); // Oops!           cb(null, 2);                       │
 * │      }                               }                                      │
 * │                                                                             │
 * │                                                                             │
 * │   3. KEEP ASYNC CONSISTENCY                                                 │
 * │      ─────────────────────────────────────────────────────────────────────  │
 * │      A function should be ALWAYS sync OR ALWAYS async, never both!          │
 * │                                                                             │
 * │      // BAD:                         // GOOD:                               │
 * │      function bad(cb) {              function good(cb) {                    │
 * │          if (cache) cb(cache);           if (cache) {                       │
 * │          else fetch(cb);                     setImmediate(() => cb(cache)); │
 * │      }                                   } else fetch(cb);                  │
 * │      // Sometimes sync,              }                                      │
 * │      // sometimes async!             // Always async!                       │
 * │                                                                             │
 * │                                                                             │
 * │   4. USE NAMED FUNCTIONS FOR READABILITY                                    │
 * │      ─────────────────────────────────────────────────────────────────────  │
 * │      Avoid deep nesting by extracting callbacks into named functions        │
 * │                                                                             │
 * └─────────────────────────────────────────────────────────────────────────────┘
 */


// ════════════════════════════════════════════════════════════════════════════════
// SECTION 9: INTERVIEW QUESTIONS
// ════════════════════════════════════════════════════════════════════════════════

console.log("\n═══ SECTION 9: INTERVIEW QUESTIONS ═══\n");

/**
 * ┌─────────────────────────────────────────────────────────────────────────────┐
 * │ COMMON INTERVIEW QUESTIONS                                                  │
 * └─────────────────────────────────────────────────────────────────────────────┘
 *
 *
 * Q1: What is a callback function?
 * ──────────────────────────────────────────────────────────────────────────────
 * A: A callback is a function passed as an argument to another function,
 *    to be executed later, either synchronously or asynchronously.
 *
 *
 * Q2: What is callback hell and how do you avoid it?
 * ──────────────────────────────────────────────────────────────────────────────
 * A: Callback hell is deeply nested callbacks forming a pyramid shape.
 *    Solutions:
 *    1. Use named functions (flatten the pyramid)
 *    2. Use Promises (chaining instead of nesting)
 *    3. Use async/await (looks like sync code)
 *    4. Use control flow libraries (async.js)
 *
 *
 * Q3: What is the error-first callback pattern?
 * ──────────────────────────────────────────────────────────────────────────────
 * A: A Node.js convention where callbacks receive error as the first argument.
 *    callback(error, result)
 *    - If error is truthy: operation failed
 *    - If error is null: success, use result
 *
 *
 * Q4: What's the difference between synchronous and asynchronous callbacks?
 * ──────────────────────────────────────────────────────────────────────────────
 * A: Synchronous callbacks execute immediately (array.map, array.forEach).
 *    Asynchronous callbacks are scheduled for later (setTimeout, fs.readFile).
 *
 *
 * Q5: TRICKY QUESTION - What's the output?
 * ──────────────────────────────────────────────────────────────────────────────
 */

console.log("Interview Question Output:");
console.log("A");

setTimeout(() => console.log("B"), 0);

Promise.resolve().then(() => console.log("C"));

console.log("D");

/**
 * OUTPUT: A, D, C, B
 *
 * WHY?
 * - "A" and "D" are synchronous (run first)
 * - Promise.then is a MICROTASK (higher priority)
 * - setTimeout is a MACROTASK (lower priority)
 * - Microtasks run before macrotasks!
 */


/**
 * ════════════════════════════════════════════════════════════════════════════════
 * SUMMARY
 * ════════════════════════════════════════════════════════════════════════════════
 *
 *
 *   ┌─────────────────────────────────────────────────────────────────────────────┐
 *   │                          KEY TAKEAWAYS                                      │
 *   ├─────────────────────────────────────────────────────────────────────────────┤
 *   │                                                                             │
 *   │   CALLBACKS                                                                 │
 *   │   ├── Definition: Functions passed to other functions                       │
 *   │   ├── Synchronous: Execute immediately (array methods)                      │
 *   │   ├── Asynchronous: Execute later (timers, I/O)                             │
 *   │   └── Pattern: Error-first callback(error, result)                          │
 *   │                                                                             │
 *   │   EVENT LOOP                                                                │
 *   │   ├── Single-threaded but non-blocking                                      │
 *   │   ├── Web APIs handle async operations                                      │
 *   │   ├── Task Queue holds callbacks                                            │
 *   │   └── Event loop moves tasks to call stack when empty                       │
 *   │                                                                             │
 *   │   CALLBACK HELL                                                             │
 *   │   ├── Problem: Deeply nested callbacks                                      │
 *   │   ├── Hard to read, maintain, debug                                         │
 *   │   └── Solutions: Named functions, Promises, async/await                     │
 *   │                                                                             │
 *   │   EVOLUTION                                                                 │
 *   │   │                                                                         │
 *   │   │   Callbacks ──▶ Promises ──▶ async/await                                │
 *   │   │      │              │              │                                    │
 *   │   │   Nesting       Chaining      Synchronous-looking                       │
 *   │   │                                                                         │
 *   │   └─────────────────────────────────────────────────────────────────────────│
 *   │                                                                             │
 *   └─────────────────────────────────────────────────────────────────────────────┘
 *
 *
 *   NEXT: 02-promises-internals.js - How Promises solve callback hell!
 */

console.log("\n═══ FILE 1 COMPLETE ═══");
console.log("Run: node 02-promises-internals.js");
