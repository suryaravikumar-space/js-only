/**
 * TOPIC: Call Stack — How JavaScript Tracks Function Execution
 *
 * STORY:
 * Think of a stack of plates in a cafeteria. You can only add a plate
 * on top (push) and take a plate from the top (pop). When first() calls
 * second(), it's like putting a new plate on the stack. second() calls
 * third() — another plate. third() finishes — top plate removed. Now
 * second() can finish — next plate removed. Finally first() — last plate.
 *
 * CONCEPT:
 * The call stack is a LIFO (Last In, First Out) data structure.
 * Every time a function is called, it's PUSHED onto the stack.
 * When it returns, it's POPPED off the stack.
 *
 * JavaScript is SINGLE-THREADED:
 *   - Only ONE call stack
 *   - Only ONE function executing at a time
 *   - Must finish current function before returning to previous
 *
 * ┌────────────────────────────────────────────────────────────────┐
 * │ CALL STACK WHEN third() STARTS:                               │
 * │                                                                │
 * │    ┌─────────────┐                                            │
 * │    │   third()   │  ← top (currently running)                 │
 * │    ├─────────────┤                                            │
 * │    │  second()   │  ← waiting for third() to finish           │
 * │    ├─────────────┤                                            │
 * │    │   first()   │  ← waiting for second() to finish          │
 * │    ├─────────────┤                                            │
 * │    │   Global    │  ← always at bottom                        │
 * │    └─────────────┘                                            │
 * └────────────────────────────────────────────────────────────────┘
 */

function first() {
  console.log('first start');
  second();
  console.log('first end');
}

function second() {
  console.log('second start');
  third();
  console.log('second end');
}

function third() {
  console.log('third start');
  console.log('third end');
}

first();

/**
 * EXECUTION TRACE:
 *
 * 1. Script starts → Global Execution Context created
 * 2. first() called → pushed to stack
 * 3. "first start" printed
 * 4. second() called → pushed to stack
 * 5. "second start" printed
 * 6. third() called → pushed to stack
 * 7. "third start" printed
 * 8. "third end" printed
 * 9. third() returns → popped from stack
 * 10. "second end" printed
 * 11. second() returns → popped from stack
 * 12. "first end" printed
 * 13. first() returns → popped from stack
 * 14. Script ends
 *
 * OUTPUT:
 *   first start
 *   second start
 *   third start
 *   third end
 *   second end
 *   first end
 *
 * ┌────────────────────────────────────────────────────────────────┐
 * │ POP SEQUENCE (when functions finish):                         │
 * │                                                                │
 * │ third()  finishes → popped → back to second()                 │
 * │ second() finishes → popped → back to first()                  │
 * │ first()  finishes → popped → back to Global                   │
 * │ Global   finishes → script ends                               │
 * └────────────────────────────────────────────────────────────────┘
 *
 * KEY INSIGHT:
 * "second end" prints AFTER "third end" because second() is
 * waiting on the stack while third() executes. This is why
 * JavaScript is called "synchronous" — one thing at a time.
 *
 * INTERVIEW QUESTIONS:
 *
 * Q: "What is the call stack in JavaScript?"
 * A: The call stack is a LIFO data structure that tracks function execution.
 *    When a function is called, a new execution context is pushed onto the
 *    stack. When it returns, it's popped off. JS has only ONE call stack
 *    (single-threaded), so only one function runs at a time.
 *
 * Q: "What happens when the call stack is full?"
 * A: You get a "Maximum call stack size exceeded" error (stack overflow).
 *    This typically happens with infinite recursion — a function calling
 *    itself without a base case. The stack has a fixed size limit
 *    (varies by engine, roughly 10,000-15,000 frames in V8).
 *
 * Q: "How does async code work if JS is single-threaded?"
 * A: Async operations (setTimeout, fetch, etc.) are handed off to the
 *    browser/Node.js runtime (Web APIs, libuv). When they complete, their
 *    callbacks are placed in a task queue. The event loop checks if the
 *    call stack is empty, and if so, pushes the next callback from the
 *    queue onto the stack. So JS is single-threaded, but the runtime is not.
 *
 * RUN: node docs/javascript/01-execution-context/07-call-stack.js
 */
