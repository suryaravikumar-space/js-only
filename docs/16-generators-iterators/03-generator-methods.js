/**
 * GENERATORS & ITERATORS: 03 - Generator Methods (next, return, throw)
 *
 * ╔════════════════════════════════════════════════════════════════════════════╗
 * ║ THE GOLDEN RULE                                                            ║
 * ╠════════════════════════════════════════════════════════════════════════════╣
 * ║                                                                            ║
 * ║ Generator objects have 3 methods:                                          ║
 * ║                                                                            ║
 * ║   .next(value)   - Resume and optionally pass a value IN                   ║
 * ║   .return(value) - End generator early, like a return statement            ║
 * ║   .throw(error)  - Throw an error AT the yield point                       ║
 * ║                                                                            ║
 * ╚════════════════════════════════════════════════════════════════════════════╝
 */


// ═══════════════════════════════════════════════════════════════════════════════
// next() - Resume Execution
// ═══════════════════════════════════════════════════════════════════════════════

/**
 * ┌─────────────────────────────────────────────────────────────────────────────┐
 * │ HOW next(value) WORKS                                                       │
 * ├─────────────────────────────────────────────────────────────────────────────┤
 * │                                                                             │
 * │ 1. First next() - Starts generator, runs until first yield                  │
 * │    - Any value passed is IGNORED (nothing to receive it)                    │
 * │    - Returns { value: <yielded>, done: false }                              │
 * │                                                                             │
 * │ 2. Subsequent next(x) - Resumes from paused yield                           │
 * │    - x becomes the value of the yield expression                            │
 * │    - Returns { value: <next yield>, done: false }                           │
 * │                                                                             │
 * │ 3. Final next() - After return or end of function                           │
 * │    - Returns { value: <return value or undefined>, done: true }             │
 * │                                                                             │
 * └─────────────────────────────────────────────────────────────────────────────┘
 */

function* calculator() {
  console.log('  Starting calculator');

  // First yield - waits for initial value
  let total = yield 'Enter first number';
  console.log(`  Received first number: ${total}`);

  // Second yield - add to total
  let add = yield `Current total: ${total}. Enter number to add`;
  total += add;
  console.log(`  Added ${add}, total: ${total}`);

  // Third yield - multiply
  let mult = yield `Current total: ${total}. Enter multiplier`;
  total *= mult;

  return `Final result: ${total}`;
}

const calc = calculator();

console.log('A:', calc.next());        // Start, get first prompt
console.log('B:', calc.next(10));      // Send 10 as first number
console.log('C:', calc.next(5));       // Add 5
console.log('D:', calc.next(2));       // Multiply by 2

/**
 * OUTPUT:
 *   Starting calculator
 *   A: { value: 'Enter first number', done: false }
 *   Received first number: 10
 *   B: { value: 'Current total: 10. Enter number to add', done: false }
 *   Added 5, total: 15
 *   C: { value: 'Current total: 15. Enter multiplier', done: false }
 *   D: { value: 'Final result: 30', done: true }
 */


// ═══════════════════════════════════════════════════════════════════════════════
// return() - End Generator Early
// ═══════════════════════════════════════════════════════════════════════════════

/**
 * ┌─────────────────────────────────────────────────────────────────────────────┐
 * │ WHEN TO USE return()                                                        │
 * ├─────────────────────────────────────────────────────────────────────────────┤
 * │                                                                             │
 * │ 1. Cancel iteration early (like break but from outside)                     │
 * │ 2. Cleanup resources when done early                                        │
 * │ 3. Signal completion with a specific value                                  │
 * │                                                                             │
 * │ return(value) is like injecting "return value;" at the yield point          │
 * │                                                                             │
 * └─────────────────────────────────────────────────────────────────────────────┘
 */

function* countdown(start) {
  try {
    for (let i = start; i >= 0; i--) {
      console.log(`  Counting: ${i}`);
      yield i;
    }
    console.log('  Countdown complete!');
  } finally {
    // Cleanup always runs, even with return()
    console.log('  Cleanup in finally block');
  }
}

console.log('\nE: Normal iteration:');
const gen1 = countdown(3);
console.log(gen1.next());  // 3
console.log(gen1.next());  // 2
console.log(gen1.next());  // 1
console.log(gen1.next());  // 0
console.log(gen1.next());  // done

console.log('\nF: Early termination with return():');
const gen2 = countdown(3);
console.log(gen2.next());        // 3
console.log(gen2.next());        // 2
console.log(gen2.return('stopped'));  // Ends early, triggers finally
console.log(gen2.next());        // Already done

/**
 * OUTPUT:
 *   E: Normal iteration:
 *     Counting: 3
 *   { value: 3, done: false }
 *     Counting: 2
 *   { value: 2, done: false }
 *     Counting: 1
 *   { value: 1, done: false }
 *     Counting: 0
 *   { value: 0, done: false }
 *     Countdown complete!
 *     Cleanup in finally block
 *   { value: undefined, done: true }
 *
 *   F: Early termination with return():
 *     Counting: 3
 *   { value: 3, done: false }
 *     Counting: 2
 *   { value: 2, done: false }
 *     Cleanup in finally block
 *   { value: 'stopped', done: true }
 *   { value: undefined, done: true }
 */


// ═══════════════════════════════════════════════════════════════════════════════
// throw() - Inject Error into Generator
// ═══════════════════════════════════════════════════════════════════════════════

/**
 * ┌─────────────────────────────────────────────────────────────────────────────┐
 * │ HOW throw() WORKS                                                           │
 * ├─────────────────────────────────────────────────────────────────────────────┤
 * │                                                                             │
 * │ throw(error) is like injecting "throw error;" at the yield point            │
 * │                                                                             │
 * │ 1. If generator has try/catch at yield - error is caught inside             │
 * │ 2. If no try/catch - error propagates out to caller                         │
 * │ 3. finally blocks ALWAYS run (for cleanup)                                  │
 * │                                                                             │
 * │ Use cases:                                                                  │
 * │ - Signal errors to generator (network failure, timeout)                     │
 * │ - Cancel with error information                                             │
 * │ - Test error handling in generators                                         │
 * │                                                                             │
 * └─────────────────────────────────────────────────────────────────────────────┘
 */

function* resilientGenerator() {
  let attempts = 0;

  while (attempts < 3) {
    try {
      attempts++;
      console.log(`  Attempt ${attempts}`);
      const result = yield `Waiting for input (attempt ${attempts})`;
      console.log(`  Received: ${result}`);
      return `Success: ${result}`;
    } catch (error) {
      console.log(`  Caught error: ${error.message}`);
      if (attempts >= 3) {
        throw new Error('Max retries exceeded');
      }
      // Will continue loop and try again
    }
  }
}

console.log('\nG: Successful case:');
const gen3 = resilientGenerator();
console.log(gen3.next());        // Start
console.log(gen3.next('data'));  // Send data, completes

console.log('\nH: With errors and retry:');
const gen4 = resilientGenerator();
console.log(gen4.next());                           // Attempt 1
console.log(gen4.throw(new Error('Network fail'))); // Throw error, retry
console.log(gen4.next('success!'));                 // Attempt 2 succeeds

console.log('\nI: Max retries exceeded:');
const gen5 = resilientGenerator();
console.log(gen5.next());                            // Attempt 1
console.log(gen5.throw(new Error('Fail 1')));        // Attempt 2
console.log(gen5.throw(new Error('Fail 2')));        // Attempt 3
try {
  console.log(gen5.throw(new Error('Fail 3')));      // Exceeds max
} catch (e) {
  console.log('  Outer catch:', e.message);
}

/**
 * OUTPUT:
 *   G: Successful case:
 *     Attempt 1
 *   { value: 'Waiting for input (attempt 1)', done: false }
 *     Received: data
 *   { value: 'Success: data', done: true }
 *
 *   H: With errors and retry:
 *     Attempt 1
 *   { value: 'Waiting for input (attempt 1)', done: false }
 *     Caught error: Network fail
 *     Attempt 2
 *   { value: 'Waiting for input (attempt 2)', done: false }
 *     Received: success!
 *   { value: 'Success: success!', done: true }
 *
 *   I: Max retries exceeded:
 *     Attempt 1
 *   { value: 'Waiting for input (attempt 1)', done: false }
 *     Caught error: Fail 1
 *     Attempt 2
 *   { value: 'Waiting for input (attempt 2)', done: false }
 *     Caught error: Fail 2
 *     Attempt 3
 *   { value: 'Waiting for input (attempt 3)', done: false }
 *     Caught error: Fail 3
 *     Outer catch: Max retries exceeded
 */


// ═══════════════════════════════════════════════════════════════════════════════
// PRACTICAL: Resource Management
// ═══════════════════════════════════════════════════════════════════════════════

function* fileProcessor(filename) {
  console.log(`  Opening file: ${filename}`);
  // Simulate file handle

  try {
    yield 'Ready to read';

    const line1 = yield 'Reading line 1...';
    console.log(`  Processed line 1: ${line1}`);

    const line2 = yield 'Reading line 2...';
    console.log(`  Processed line 2: ${line2}`);

    return 'File processed successfully';

  } finally {
    // Cleanup ALWAYS runs
    console.log(`  Closing file: ${filename}`);
  }
}

console.log('\nJ: Complete file processing:');
const file1 = fileProcessor('data.txt');
console.log(file1.next());
console.log(file1.next());
console.log(file1.next('Hello'));
console.log(file1.next('World'));

console.log('\nK: Early termination:');
const file2 = fileProcessor('data.txt');
console.log(file2.next());
console.log(file2.return('Cancelled'));  // Still closes file!

console.log('\nL: Error during processing:');
const file3 = fileProcessor('data.txt');
console.log(file3.next());
console.log(file3.next());
try {
  console.log(file3.throw(new Error('Read error')));
} catch (e) {
  console.log('  Caught outside:', e.message);
}

/**
 * OUTPUT:
 *   J: Complete file processing:
 *     Opening file: data.txt
 *   { value: 'Ready to read', done: false }
 *   { value: 'Reading line 1...', done: false }
 *     Processed line 1: Hello
 *   { value: 'Reading line 2...', done: false }
 *     Processed line 2: World
 *     Closing file: data.txt
 *   { value: 'File processed successfully', done: true }
 *
 *   K: Early termination:
 *     Opening file: data.txt
 *   { value: 'Ready to read', done: false }
 *     Closing file: data.txt
 *   { value: 'Cancelled', done: true }
 *
 *   L: Error during processing:
 *     Opening file: data.txt
 *   { value: 'Ready to read', done: false }
 *   { value: 'Reading line 1...', done: false }
 *     Closing file: data.txt
 *     Caught outside: Read error
 */


// ═══════════════════════════════════════════════════════════════════════════════
// METHOD SUMMARY
// ═══════════════════════════════════════════════════════════════════════════════

/**
 * ┌─────────────────────────────────────────────────────────────────────────────┐
 * │ GENERATOR METHODS SUMMARY                                                   │
 * ├─────────────────────────────────────────────────────────────────────────────┤
 * │                                                                             │
 * │ ┌─────────────────┬───────────────────────────────────────────────────────┐ │
 * │ │ Method          │ Behavior                                              │ │
 * │ ├─────────────────┼───────────────────────────────────────────────────────┤ │
 * │ │ next()          │ Resume generator                                      │ │
 * │ │ next(value)     │ Resume, value becomes yield result                    │ │
 * │ │ return()        │ End generator, done: true                             │ │
 * │ │ return(value)   │ End with specific value                               │ │
 * │ │ throw(error)    │ Throw error at yield point                            │ │
 * │ └─────────────────┴───────────────────────────────────────────────────────┘ │
 * │                                                                             │
 * │ KEY POINTS:                                                                 │
 * │                                                                             │
 * │ 1. First next() value is always ignored (nothing to receive it)            │
 * │ 2. return() triggers finally blocks before ending                          │
 * │ 3. throw() can be caught inside generator if try/catch wraps yield         │
 * │ 4. After done: true, further calls return { value: undefined, done: true } │
 * │                                                                             │
 * └─────────────────────────────────────────────────────────────────────────────┘
 */


/**
 * ┌─────────────────────────────────────────────────────────────────────────────┐
 * │ INTERVIEW ANSWER                                                            │
 * ├─────────────────────────────────────────────────────────────────────────────┤
 * │                                                                             │
 * │ "Generator objects have three methods for control:                          │
 * │                                                                             │
 * │ next(value):                                                                │
 * │ - Resumes the generator from where it paused                                │
 * │ - Optional value becomes the result of the yield expression                 │
 * │ - First next() value is ignored (generator hasn't reached yield yet)        │
 * │ - Returns { value, done }                                                   │
 * │                                                                             │
 * │ return(value):                                                              │
 * │ - Ends the generator early, like a return statement at the yield           │
 * │ - Triggers finally blocks for cleanup                                       │
 * │ - Returns { value, done: true }                                             │
 * │ - Used for cancellation or early completion                                 │
 * │                                                                             │
 * │ throw(error):                                                               │
 * │ - Throws an error at the current yield point                                │
 * │ - If generator has try/catch, error can be handled internally               │
 * │ - If not caught, propagates to caller                                       │
 * │ - Triggers finally blocks either way                                        │
 * │ - Used for error injection and retry patterns                               │
 * │                                                                             │
 * │ All three methods respect finally blocks for resource cleanup."             │
 * │                                                                             │
 * └─────────────────────────────────────────────────────────────────────────────┘
 *
 *
 * RUN: node docs/16-generators-iterators/03-generator-methods.js
 */
