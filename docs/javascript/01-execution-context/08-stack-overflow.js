/**
 * TOPIC: Stack Overflow — When the Call Stack Exceeds Its Limit
 *
 * CONCEPT:
 * The call stack has a LIMITED size (varies by environment).
 * Each function call PUSHES a new frame onto the stack.
 * If you never POP (never return), the stack fills up → crash.
 *
 * ┌────────────────────────────────────────────────────────────────┐
 * │ WHAT HAPPENS:                                                  │
 * │                                                                │
 * │    ┌─────────────┐                                            │
 * │    │ recursive() │  ← call #10000+                            │
 * │    ├─────────────┤                                            │
 * │    │ recursive() │                                            │
 * │    ├─────────────┤                                            │
 * │    │    ...      │  ← thousands of frames                     │
 * │    ├─────────────┤                                            │
 * │    │ recursive() │  ← call #1                                 │
 * │    ├─────────────┤                                            │
 * │    │   Global    │                                            │
 * │    └─────────────┘                                            │
 * │                                                                │
 * │    Stack keeps growing... until LIMIT → CRASH                 │
 * └────────────────────────────────────────────────────────────────┘
 */

function recursive() {
  recursive();
}

// recursive();  // Uncomment to see the error

/**
 * ERROR:
 *   RangeError: Maximum call stack size exceeded
 *
 * WHY:
 *   - recursive() calls recursive()
 *   - Each call pushes a new frame to stack
 *   - Function never returns (no base case)
 *   - Stack grows infinitely
 *   - Hits memory limit → RangeError
 *
 * ┌────────────────────────────────────────────────────────────────┐
 * │ STACK SIZE LIMITS (approximate):                              │
 * │                                                                │
 * │ Chrome/V8:    ~10,000 - 20,000 frames                         │
 * │ Firefox:      ~50,000 - 90,000 frames                         │
 * │ Safari:       ~30,000 - 50,000 frames                         │
 * │ Node.js:      ~10,000 - 15,000 frames (depends on config)     │
 * └────────────────────────────────────────────────────────────────┘
 *
 * THE FIX — Always have a BASE CASE:
 *
 * function countdown(n) {
 *   if (n <= 0) return;  // BASE CASE — stops recursion
 *   console.log(n);
 *   countdown(n - 1);
 * }
 *
 * KEY INSIGHT:
 * Every recursive function needs:
 *   1. BASE CASE — when to stop
 *   2. PROGRESS — moving toward the base case
 *
 * Without both → Stack Overflow
 *
 * ES6 NOTE:
 * ES6 specifies "Tail Call Optimization" (TCO) — if the recursive call
 * is the LAST thing a function does, the engine can reuse the current
 * stack frame instead of creating a new one. However, only Safari
 * implements TCO as of 2025. V8/Node.js does NOT support it.
 *
 * Example of tail-call form:
 *   function factorial(n, acc = 1) {
 *     if (n <= 1) return acc;
 *     return factorial(n - 1, n * acc); // tail position
 *   }
 *
 * INTERVIEW QUESTIONS:
 *
 * Q: "What causes a stack overflow in JavaScript?"
 * A: Infinite or excessively deep recursion. Each function call pushes a
 *    frame onto the call stack. If there's no base case or the recursion
 *    depth exceeds the engine's limit (~10,000-15,000 in V8), you get
 *    RangeError: "Maximum call stack size exceeded".
 *
 * Q: "How do you prevent stack overflow in recursive functions?"
 * A: 1. Always have a base case that stops recursion.
 *    2. Ensure each recursive call makes progress toward the base case.
 *    3. For very deep recursion, convert to iteration or use a trampoline
 *       pattern (a while loop that repeatedly calls returned functions).
 *
 * RUN: node docs/javascript/01-execution-context/08-stack-overflow.js
 */
