/**
 * CHALLENGE 00: Try-Catch Basics
 *
 * ╔════════════════════════════════════════════════════════════════════════════╗
 * ║ THE GOLDEN RULE                                                            ║
 * ╠════════════════════════════════════════════════════════════════════════════╣
 * ║                                                                            ║
 * ║ try-catch is JavaScript's way of handling runtime errors gracefully.      ║
 * ║ Without it, errors CRASH your program. With it, you CONTROL what happens. ║
 * ║                                                                            ║
 * ║   try {                                                                    ║
 * ║     // Code that might throw an error                                      ║
 * ║   } catch (error) {                                                        ║
 * ║     // Handle the error (log it, show message, recover)                    ║
 * ║   } finally {                                                              ║
 * ║     // ALWAYS runs - cleanup code (optional)                               ║
 * ║   }                                                                        ║
 * ║                                                                            ║
 * ╚════════════════════════════════════════════════════════════════════════════╝
 */

// Example 1: Basic try-catch
console.log("═══ Example 1: Basic Try-Catch ═══\n");

try {
  const data = JSON.parse('{ invalid json }');
  console.log(data);
} catch (error) {
  console.log('A: Caught error:', error.message);
}

console.log('B: Program continues running!\n');

/**
 * OUTPUT:
 *   A: Caught error: Expected property name or '}' in JSON at position 2
 *   B: Program continues running!
 *
 *
 * ╔════════════════════════════════════════════════════════════════════════════╗
 * ║ STEP-BY-STEP BREAKDOWN                                                     ║
 * ╠════════════════════════════════════════════════════════════════════════════╣
 * ║                                                                            ║
 * ║ 1. try block executes JSON.parse with invalid JSON                         ║
 * ║ 2. JSON.parse THROWS a SyntaxError                                         ║
 * ║ 3. Execution IMMEDIATELY jumps to catch block                              ║
 * ║ 4. catch block receives the error object                                   ║
 * ║ 5. We handle it (log the message)                                          ║
 * ║ 6. Program CONTINUES after try-catch (doesn't crash!)                      ║
 * ║                                                                            ║
 * ╚════════════════════════════════════════════════════════════════════════════╝
 */


// Example 2: The Error Object
console.log("═══ Example 2: Error Object Properties ═══\n");

try {
  undefinedFunction();
} catch (error) {
  console.log('C: error.name:', error.name);
  console.log('D: error.message:', error.message);
  console.log('E: error.stack (first line):', error.stack.split('\n')[0]);
}

console.log('');

/**
 * OUTPUT:
 *   C: error.name: ReferenceError
 *   D: error.message: undefinedFunction is not defined
 *   E: error.stack (first line): ReferenceError: undefinedFunction is not defined
 *
 *
 * ┌─────────────────────────────────────────────────────────────────────────────┐
 * │ ERROR OBJECT ANATOMY                                                        │
 * ├─────────────────────────────────────────────────────────────────────────────┤
 * │                                                                             │
 * │   ┌──────────────────────────────────────────────────────────┐             │
 * │   │              ERROR OBJECT                                 │             │
 * │   ├──────────────────────────────────────────────────────────┤             │
 * │   │                                                          │             │
 * │   │  name: "ReferenceError"     ← Type of error              │             │
 * │   │                                                          │             │
 * │   │  message: "x is not        ← Human-readable description  │             │
 * │   │           defined"                                        │             │
 * │   │                                                          │             │
 * │   │  stack: "ReferenceError:   ← Full stack trace            │             │
 * │   │         x is not defined                                  │             │
 * │   │         at file.js:10                                    │             │
 * │   │         at main (file.js:5)"                             │             │
 * │   │                                                          │             │
 * │   └──────────────────────────────────────────────────────────┘             │
 * │                                                                             │
 * │   INTERVIEW TIP: Always log error.stack in development!                    │
 * │   It shows you exactly WHERE the error happened.                           │
 * │                                                                             │
 * └─────────────────────────────────────────────────────────────────────────────┘
 */


// Example 3: The Finally Block
console.log("═══ Example 3: Finally Block ═══\n");

function processFile() {
  let fileHandle = 'FILE_OPENED';
  console.log('F:', fileHandle);

  try {
    // Simulate file processing that fails
    throw new Error('File corrupted!');
  } catch (error) {
    console.log('G: Error:', error.message);
  } finally {
    // ALWAYS runs - perfect for cleanup!
    fileHandle = 'FILE_CLOSED';
    console.log('H:', fileHandle);
  }

  console.log('I: After try-catch-finally');
}

processFile();
console.log('');

/**
 * OUTPUT:
 *   F: FILE_OPENED
 *   G: Error: File corrupted!
 *   H: FILE_CLOSED
 *   I: After try-catch-finally
 *
 *
 * ┌─────────────────────────────────────────────────────────────────────────────┐
 * │ FINALLY - THE CLEANUP GUARANTEE                                             │
 * ├─────────────────────────────────────────────────────────────────────────────┤
 * │                                                                             │
 * │   finally ALWAYS RUNS, no matter what:                                      │
 * │                                                                             │
 * │   ┌─────────────────────────────────────────────────────────────────────┐   │
 * │   │  Scenario               │  try  │  catch  │  finally               │   │
 * │   ├─────────────────────────┼───────┼─────────┼────────────────────────┤   │
 * │   │  No error               │  ✓    │  ✗     │  ✓ RUNS                │   │
 * │   │  Error caught           │  ✓    │  ✓     │  ✓ RUNS                │   │
 * │   │  Error rethrown         │  ✓    │  ✓     │  ✓ RUNS (before throw) │   │
 * │   │  return in try          │  ✓    │  ✗     │  ✓ RUNS (before return)│   │
 * │   │  return in catch        │  ✓    │  ✓     │  ✓ RUNS (before return)│   │
 * │   └─────────────────────────┴───────┴─────────┴────────────────────────┘   │
 * │                                                                             │
 * │   USE CASES:                                                                │
 * │   • Close file handles                                                      │
 * │   • Release database connections                                            │
 * │   • Clear timers/intervals                                                  │
 * │   • Hide loading spinners                                                   │
 * │   • Restore UI state                                                        │
 * │                                                                             │
 * └─────────────────────────────────────────────────────────────────────────────┘
 */


// Example 4: Finally runs even with return!
console.log("═══ Example 4: Finally with Return ═══\n");

function earlyReturn() {
  try {
    console.log('J: In try');
    return 'from try';
  } finally {
    console.log('K: Finally runs BEFORE return!');
  }
}

const result = earlyReturn();
console.log('L: Result:', result);
console.log('');

/**
 * OUTPUT:
 *   J: In try
 *   K: Finally runs BEFORE return!
 *   L: Result: from try
 */


// Example 5: Catch without error variable (ES2019+)
console.log("═══ Example 5: Optional Catch Binding ═══\n");

try {
  JSON.parse('invalid');
} catch {  // No (error) - we don't need it!
  console.log('M: Something went wrong, but we don\'t care what');
}

console.log('');

/**
 * ┌─────────────────────────────────────────────────────────────────────────────┐
 * │ COMMON CONFUSION POINTS                                                     │
 * ├─────────────────────────────────────────────────────────────────────────────┤
 * │                                                                             │
 * │ 1. "try-catch catches ALL errors"                                          │
 * │    ✗ WRONG! Only catches RUNTIME errors in SYNC code.                      │
 * │                                                                             │
 * │    try {                                                                    │
 * │      setTimeout(() => { throw new Error('Async!'); }, 0);                   │
 * │    } catch (e) {                                                            │
 * │      // NEVER catches the error! It's async!                                │
 * │    }                                                                        │
 * │                                                                             │
 * │ 2. "try-catch catches syntax errors"                                        │
 * │    ✗ WRONG! Syntax errors happen at PARSE time, not runtime.               │
 * │                                                                             │
 * │    try {                                                                    │
 * │      eval('let x = ;');  // This WILL be caught (runtime eval)             │
 * │    } catch (e) { ... }                                                      │
 * │                                                                             │
 * │    // But this WON'T compile at all:                                       │
 * │    // try { let x = ; } // <-- File won't even run!                        │
 * │                                                                             │
 * │ 3. "catch block must use the error"                                         │
 * │    ✗ WRONG! Since ES2019, (error) is optional.                             │
 * │                                                                             │
 * └─────────────────────────────────────────────────────────────────────────────┘
 */


// Example 6: Nested try-catch
console.log("═══ Example 6: Nested Try-Catch ═══\n");

try {
  console.log('N: Outer try');

  try {
    console.log('O: Inner try');
    throw new Error('Inner error');
  } catch (innerError) {
    console.log('P: Inner catch:', innerError.message);
    throw new Error('Re-thrown from inner');  // Propagate up!
  }

  console.log('Q: This never runs');
} catch (outerError) {
  console.log('R: Outer catch:', outerError.message);
}

console.log('');

/**
 * OUTPUT:
 *   N: Outer try
 *   O: Inner try
 *   P: Inner catch: Inner error
 *   R: Outer catch: Re-thrown from inner
 *
 *
 * ┌─────────────────────────────────────────────────────────────────────────────┐
 * │ ERROR PROPAGATION FLOW                                                      │
 * ├─────────────────────────────────────────────────────────────────────────────┤
 * │                                                                             │
 * │   ┌─────────────────────────────────────────────────────────────┐           │
 * │   │  OUTER TRY                                                  │           │
 * │   │  ┌─────────────────────────────────────────────────────┐   │           │
 * │   │  │  INNER TRY                                          │   │           │
 * │   │  │                                                     │   │           │
 * │   │  │  throw Error('Inner') ─────────┐                    │   │           │
 * │   │  │                                 │                    │   │           │
 * │   │  └─────────────────────────────────│────────────────────┘   │           │
 * │   │                                    ▼                        │           │
 * │   │  ┌─────────────────────────────────────────────────────┐   │           │
 * │   │  │  INNER CATCH                                        │   │           │
 * │   │  │                                                     │   │           │
 * │   │  │  throw Error('Re-thrown') ──────────────────────────│───│──┐        │
 * │   │  │                                                     │   │  │        │
 * │   │  └─────────────────────────────────────────────────────┘   │  │        │
 * │   └────────────────────────────────────────────────────────────┘  │        │
 * │                                                                    ▼        │
 * │   ┌─────────────────────────────────────────────────────────────────────┐  │
 * │   │  OUTER CATCH                                                         │  │
 * │   │  catches "Re-thrown from inner"                                      │  │
 * │   └─────────────────────────────────────────────────────────────────────┘  │
 * │                                                                             │
 * └─────────────────────────────────────────────────────────────────────────────┘
 */


/**
 * ┌─────────────────────────────────────────────────────────────────────────────┐
 * │ INTERVIEW ANSWER                                                            │
 * ├─────────────────────────────────────────────────────────────────────────────┤
 * │                                                                             │
 * │ "try-catch-finally is JavaScript's error handling mechanism. The try       │
 * │  block contains code that might throw an error. If an error occurs,        │
 * │  execution immediately jumps to the catch block, where we can handle       │
 * │  it gracefully instead of crashing the program.                            │
 * │                                                                             │
 * │  The catch block receives an error object with name, message, and          │
 * │  stack properties. Since ES2019, the error parameter is optional           │
 * │  if you don't need it.                                                     │
 * │                                                                             │
 * │  The finally block always runs - whether there was an error or not.        │
 * │  It's perfect for cleanup code like closing connections or files.          │
 * │                                                                             │
 * │  Important limitations:                                                     │
 * │  - Only catches synchronous errors (async needs .catch() or try with await)│
 * │  - Can't catch syntax errors (they happen at parse time)                   │
 * │  - Errors propagate up if not caught"                                      │
 * │                                                                             │
 * └─────────────────────────────────────────────────────────────────────────────┘
 *
 *
 * RUN: node docs/13-error-handling/00-try-catch-basics.js
 */
