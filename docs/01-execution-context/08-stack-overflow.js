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
 * RUN: node docs/01-execution-context/08-stack-overflow.js
 */
