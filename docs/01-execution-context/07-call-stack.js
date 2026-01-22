/**
 * TOPIC: Call Stack — How JavaScript Tracks Function Execution
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
 * RUN: node docs/01-execution-context/07-call-stack.js
 */
