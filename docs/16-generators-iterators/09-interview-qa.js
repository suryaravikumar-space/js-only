/**
 * GENERATORS & ITERATORS: 09 - Interview Q&A Summary
 *
 * ╔════════════════════════════════════════════════════════════════════════════╗
 * ║ COMPLETE INTERVIEW GUIDE FOR GENERATORS & ITERATORS                        ║
 * ╠════════════════════════════════════════════════════════════════════════════╣
 * ║                                                                            ║
 * ║ This file contains the most common interview questions with detailed       ║
 * ║ answers, plus a quick reference cheat sheet.                               ║
 * ║                                                                            ║
 * ╚════════════════════════════════════════════════════════════════════════════╝
 */


/**
 * ┌─────────────────────────────────────────────────────────────────────────────┐
 * │ Q1: What is the difference between an iterator and an iterable?             │
 * ├─────────────────────────────────────────────────────────────────────────────┤
 * │                                                                             │
 * │ "An ITERABLE is any object with a [Symbol.iterator] method that returns     │
 * │ an iterator. Examples: Array, String, Map, Set, NodeList.                   │
 * │                                                                             │
 * │ An ITERATOR is an object with a next() method that returns:                 │
 * │ { value: <any>, done: <boolean> }                                           │
 * │                                                                             │
 * │ The relationship:                                                           │
 * │   const arr = [1, 2, 3];           // Iterable                              │
 * │   const iter = arr[Symbol.iterator]();  // Get Iterator                     │
 * │   iter.next();  // { value: 1, done: false }                                │
 * │                                                                             │
 * │ Iterables enable:                                                           │
 * │ - for...of loops                                                            │
 * │ - Spread operator [...]                                                     │
 * │ - Array.from()                                                              │
 * │ - Destructuring"                                                            │
 * │                                                                             │
 * └─────────────────────────────────────────────────────────────────────────────┘
 */


/**
 * ┌─────────────────────────────────────────────────────────────────────────────┐
 * │ Q2: What is a generator and how does it differ from regular functions?      │
 * ├─────────────────────────────────────────────────────────────────────────────┤
 * │                                                                             │
 * │ "A generator is a special function that can PAUSE and RESUME execution.     │
 * │ It uses function* syntax and yield keyword.                                 │
 * │                                                                             │
 * │ Key differences:                                                            │
 * │                                                                             │
 * │ REGULAR FUNCTION:                                                           │
 * │ - Runs to completion when called                                            │
 * │ - Returns one value                                                         │
 * │ - Can't pause mid-execution                                                 │
 * │                                                                             │
 * │ GENERATOR FUNCTION:                                                         │
 * │ - Returns an iterator when called (doesn't run)                             │
 * │ - Can yield multiple values                                                 │
 * │ - Pauses at each yield, resumes with next()                                 │
 * │ - Maintains state between calls                                             │
 * │                                                                             │
 * │   function* gen() {                                                         │
 * │     yield 1;  // Pause, return { value: 1, done: false }                    │
 * │     yield 2;  // Pause, return { value: 2, done: false }                    │
 * │     return 3; // End, return { value: 3, done: true }                       │
 * │   }"                                                                        │
 * │                                                                             │
 * └─────────────────────────────────────────────────────────────────────────────┘
 */


/**
 * ┌─────────────────────────────────────────────────────────────────────────────┐
 * │ Q3: What is yield* and when would you use it?                               │
 * ├─────────────────────────────────────────────────────────────────────────────┤
 * │                                                                             │
 * │ "yield* delegates to another iterable or generator, yielding all its        │
 * │ values one by one.                                                          │
 * │                                                                             │
 * │ Difference:                                                                 │
 * │   yield [1, 2, 3]   → yields the array as ONE value                         │
 * │   yield* [1, 2, 3]  → yields 1, then 2, then 3                              │
 * │                                                                             │
 * │ Use cases:                                                                  │
 * │                                                                             │
 * │ 1. Compose generators:                                                      │
 * │    function* combined() {                                                   │
 * │      yield* generatorA();                                                   │
 * │      yield* generatorB();                                                   │
 * │    }                                                                        │
 * │                                                                             │
 * │ 2. Recursive traversal (trees, graphs):                                     │
 * │    function* traverse(node) {                                               │
 * │      yield node.value;                                                      │
 * │      for (const child of node.children) {                                   │
 * │        yield* traverse(child);  // Recursive!                               │
 * │      }                                                                      │
 * │    }                                                                        │
 * │                                                                             │
 * │ 3. Flatten nested structures                                                │
 * │                                                                             │
 * │ Bonus: yield* returns the return value of the delegated generator."         │
 * │                                                                             │
 * └─────────────────────────────────────────────────────────────────────────────┘
 */


/**
 * ┌─────────────────────────────────────────────────────────────────────────────┐
 * │ Q4: What's the difference between for...of and for...in?                    │
 * ├─────────────────────────────────────────────────────────────────────────────┤
 * │                                                                             │
 * │ "for...of iterates over VALUES of iterables.                                │
 * │ for...in iterates over KEYS of objects (including inherited).               │
 * │                                                                             │
 * │ for...of:                                                                   │
 * │ - Works with: Array, String, Map, Set, any iterable                         │
 * │ - Gives you values directly                                                 │
 * │ - Does NOT work with plain objects                                          │
 * │ - Respects Symbol.iterator                                                  │
 * │                                                                             │
 * │ for...in:                                                                   │
 * │ - Works with any object                                                     │
 * │ - Gives you keys (as strings)                                               │
 * │ - Includes inherited enumerable properties                                  │
 * │ - AVOID for arrays (includes non-index properties)                          │
 * │                                                                             │
 * │   const arr = ['a', 'b']; arr.custom = 'x';                                 │
 * │   for (const v of arr) { }  // 'a', 'b'                                     │
 * │   for (const k in arr) { }  // '0', '1', 'custom'                           │
 * │                                                                             │
 * │ For objects, use Object.keys/values/entries with for...of."                 │
 * │                                                                             │
 * └─────────────────────────────────────────────────────────────────────────────┘
 */


/**
 * ┌─────────────────────────────────────────────────────────────────────────────┐
 * │ Q5: What are async generators and when would you use them?                  │
 * ├─────────────────────────────────────────────────────────────────────────────┤
 * │                                                                             │
 * │ "Async generators combine async/await with generators. They use             │
 * │ 'async function*' and are consumed with 'for await...of'.                   │
 * │                                                                             │
 * │   async function* fetchPages() {                                            │
 * │     let page = 1;                                                           │
 * │     while (hasMore) {                                                       │
 * │       const data = await fetchPage(page++);                                 │
 * │       yield* data.items;                                                    │
 * │     }                                                                       │
 * │   }                                                                         │
 * │                                                                             │
 * │   for await (const item of fetchPages()) {                                  │
 * │     process(item);                                                          │
 * │   }                                                                         │
 * │                                                                             │
 * │ Use cases:                                                                  │
 * │ - Paginated APIs (fetch pages lazily)                                       │
 * │ - Streaming data (WebSockets, SSE)                                          │
 * │ - Database cursors                                                          │
 * │ - Polling with delays                                                       │
 * │                                                                             │
 * │ Benefits:                                                                   │
 * │ - Memory efficient (lazy evaluation)                                        │
 * │ - Built-in backpressure                                                     │
 * │ - Clean async iteration without callbacks"                                  │
 * │                                                                             │
 * └─────────────────────────────────────────────────────────────────────────────┘
 */


/**
 * ┌─────────────────────────────────────────────────────────────────────────────┐
 * │ Q6: How do you make a custom object iterable?                               │
 * ├─────────────────────────────────────────────────────────────────────────────┤
 * │                                                                             │
 * │ "Add a [Symbol.iterator] method that returns an iterator. The cleanest      │
 * │ way is using a generator method:                                            │
 * │                                                                             │
 * │   const myObj = {                                                           │
 * │     items: [1, 2, 3],                                                       │
 * │     *[Symbol.iterator]() {                                                  │
 * │       yield* this.items;                                                    │
 * │     }                                                                       │
 * │   };                                                                        │
 * │                                                                             │
 * │   for (const item of myObj) { }  // Works!                                  │
 * │   [...myObj]  // [1, 2, 3]                                                  │
 * │                                                                             │
 * │ For classes:                                                                │
 * │   class LinkedList {                                                        │
 * │     *[Symbol.iterator]() {                                                  │
 * │       let node = this.head;                                                 │
 * │       while (node) {                                                        │
 * │         yield node.value;                                                   │
 * │         node = node.next;                                                   │
 * │       }                                                                     │
 * │     }                                                                       │
 * │   }                                                                         │
 * │                                                                             │
 * │ Plain objects {} are NOT iterable by default."                              │
 * │                                                                             │
 * └─────────────────────────────────────────────────────────────────────────────┘
 */


/**
 * ┌─────────────────────────────────────────────────────────────────────────────┐
 * │ Q7: What are the methods on a generator object?                             │
 * ├─────────────────────────────────────────────────────────────────────────────┤
 * │                                                                             │
 * │ "Generator objects have three methods:                                      │
 * │                                                                             │
 * │ next(value):                                                                │
 * │ - Resumes generator execution                                               │
 * │ - Optional value becomes the result of the yield expression                 │
 * │ - First next() value is IGNORED (nothing to receive it)                     │
 * │ - Returns { value, done }                                                   │
 * │                                                                             │
 * │ return(value):                                                              │
 * │ - Ends generator early                                                      │
 * │ - Like injecting 'return value' at yield point                              │
 * │ - Triggers finally blocks                                                   │
 * │ - Returns { value, done: true }                                             │
 * │                                                                             │
 * │ throw(error):                                                               │
 * │ - Throws error at current yield point                                       │
 * │ - Can be caught inside generator with try/catch                             │
 * │ - If not caught, propagates to caller                                       │
 * │ - Triggers finally blocks                                                   │
 * │                                                                             │
 * │ All three respect finally blocks for cleanup."                              │
 * │                                                                             │
 * └─────────────────────────────────────────────────────────────────────────────┘
 */


/**
 * ┌─────────────────────────────────────────────────────────────────────────────┐
 * │ Q8: What are real-world use cases for generators?                           │
 * ├─────────────────────────────────────────────────────────────────────────────┤
 * │                                                                             │
 * │ "1. LAZY SEQUENCES                                                          │
 * │    - Infinite sequences (fibonacci, counters)                               │
 * │    - Process large datasets without loading all into memory                 │
 * │                                                                             │
 * │ 2. DATA PIPELINES                                                           │
 * │    - Chain filter/map/take lazily                                           │
 * │    - No intermediate arrays                                                 │
 * │                                                                             │
 * │ 3. STATE MACHINES                                                           │
 * │    - Wizards, game states, connection states                                │
 * │    - yield pauses at each state, next(input) transitions                    │
 * │                                                                             │
 * │ 4. CUSTOM ITERABLES                                                         │
 * │    - Make LinkedList, Tree, Graph iterable                                  │
 * │    - Multiple traversal strategies (DFS, BFS)                               │
 * │                                                                             │
 * │ 5. ASYNC FLOW CONTROL                                                       │
 * │    - Redux-Saga for side effects                                            │
 * │    - async/await is built on generators                                     │
 * │                                                                             │
 * │ 6. UNDO/REDO                                                                │
 * │    - Maintain history state                                                 │
 * │    - yield current state, next(action) to modify"                           │
 * │                                                                             │
 * └─────────────────────────────────────────────────────────────────────────────┘
 */


/**
 * ╔════════════════════════════════════════════════════════════════════════════╗
 * ║ CHEAT SHEET: Generators & Iterators                                        ║
 * ╠════════════════════════════════════════════════════════════════════════════╣
 * ║                                                                            ║
 * ║ ITERATOR PROTOCOL:                                                         ║
 * ║   { next() { return { value, done }; } }                                   ║
 * ║                                                                            ║
 * ║ ITERABLE PROTOCOL:                                                         ║
 * ║   { [Symbol.iterator]() { return iterator; } }                             ║
 * ║                                                                            ║
 * ║ BUILT-IN ITERABLES:                                                        ║
 * ║   Array, String, Map, Set, TypedArray, NodeList, arguments                 ║
 * ║   NOT: Plain objects {}, numbers, booleans                                 ║
 * ║                                                                            ║
 * ║ GENERATOR SYNTAX:                                                          ║
 * ║   function* gen() { yield 1; yield 2; return 3; }                          ║
 * ║   const g = gen();                                                         ║
 * ║   g.next()        → { value: 1, done: false }                              ║
 * ║   g.next()        → { value: 2, done: false }                              ║
 * ║   g.next()        → { value: 3, done: true }                               ║
 * ║                                                                            ║
 * ║ PASSING VALUES IN:                                                         ║
 * ║   function* gen() { const x = yield 'question'; }                          ║
 * ║   g.next()        → { value: 'question' }  // Start                        ║
 * ║   g.next('answer')  // x becomes 'answer'                                  ║
 * ║   NOTE: First next() value is IGNORED!                                     ║
 * ║                                                                            ║
 * ║ yield vs yield*:                                                           ║
 * ║   yield [1,2,3]   → yields the array as one value                          ║
 * ║   yield* [1,2,3]  → yields 1, then 2, then 3                               ║
 * ║                                                                            ║
 * ║ for...of vs for...in:                                                      ║
 * ║   for (const v of iterable) { }  // VALUES                                 ║
 * ║   for (const k in object) { }    // KEYS (strings)                         ║
 * ║                                                                            ║
 * ║ ASYNC GENERATOR:                                                           ║
 * ║   async function* asyncGen() { yield await fetch(url); }                   ║
 * ║   for await (const item of asyncGen()) { }                                 ║
 * ║                                                                            ║
 * ║ MAKE OBJECT ITERABLE:                                                      ║
 * ║   const obj = {                                                            ║
 * ║     *[Symbol.iterator]() { yield 1; yield 2; }                             ║
 * ║   };                                                                       ║
 * ║                                                                            ║
 * ║ GOTCHAS:                                                                   ║
 * ║   • return value NOT in for...of (done: true is skipped)                   ║
 * ║   • Generators are ONE-TIME use (exhausted after done)                     ║
 * ║   • First next() value is ignored                                          ║
 * ║   • {} is NOT iterable (use Object.entries)                                ║
 * ║                                                                            ║
 * ╚════════════════════════════════════════════════════════════════════════════╝
 *
 *
 * RUN: node docs/16-generators-iterators/09-interview-qa.js
 */


// Verify file loads
console.log('Generators & Iterators module complete!');
console.log('Topics covered:');
console.log('  00 - Iterator basics');
console.log('  01 - for...of loop');
console.log('  02 - Generator basics');
console.log('  03 - Generator methods');
console.log('  04 - yield* delegation');
console.log('  05 - Async generators');
console.log('  06 - Real world use cases');
console.log('  07 - Custom iterables');
console.log('  08 - Tricky examples');
console.log('  09 - Interview Q&A');
console.log('\nNext: 17-map-set-weakmap');
