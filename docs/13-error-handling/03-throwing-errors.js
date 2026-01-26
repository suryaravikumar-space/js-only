/**
 * CHALLENGE 03: Throwing Errors - When and How
 *
 * ╔════════════════════════════════════════════════════════════════════════════╗
 * ║ THE GOLDEN RULE                                                            ║
 * ╠════════════════════════════════════════════════════════════════════════════╣
 * ║                                                                            ║
 * ║ The "throw" statement stops execution and transfers control to the         ║
 * ║ nearest catch block. If no catch exists, the program crashes.              ║
 * ║                                                                            ║
 * ║   throw expression;    // expression becomes the error object              ║
 * ║                                                                            ║
 * ║   throw new Error('message');           // Most common                     ║
 * ║   throw new TypeError('wrong type');    // Specific type                   ║
 * ║   throw 'string error';                 // Works but NOT recommended       ║
 * ║   throw { code: 500 };                  // Works but NOT recommended       ║
 * ║                                                                            ║
 * ╚════════════════════════════════════════════════════════════════════════════╝
 */


// ═══════════════════════════════════════════════════════════════════════════════
// 1. Basic throw statement
// ═══════════════════════════════════════════════════════════════════════════════

console.log("═══ 1. Basic throw ═══\n");

function divide(a, b) {
  if (b === 0) {
    throw new Error('Division by zero');
  }
  return a / b;
}

try {
  console.log('A: 10 / 2 =', divide(10, 2));
  console.log('B: 10 / 0 =', divide(10, 0));
  console.log('C: This never runs');
} catch (e) {
  console.log('D: Error caught:', e.message);
}

console.log('');

/**
 * ┌─────────────────────────────────────────────────────────────────────────────┐
 * │ THROW EXECUTION FLOW                                                        │
 * ├─────────────────────────────────────────────────────────────────────────────┤
 * │                                                                             │
 * │   ┌───────────────────────────────────────────────────────────────┐        │
 * │   │  try {                                                         │        │
 * │   │    divide(10, 2)  ──► returns 5 ✓                             │        │
 * │   │    divide(10, 0)  ──► throw! ─────────────────────────────┐   │        │
 * │   │    // Skipped!                                             │   │        │
 * │   │  }                                                         │   │        │
 * │   └────────────────────────────────────────────────────────────│───┘        │
 * │                                                                 │            │
 * │   ┌────────────────────────────────────────────────────────────▼───┐        │
 * │   │  catch (e) {                                                   │        │
 * │   │    // Handle error here                                        │        │
 * │   │  }                                                             │        │
 * │   └───────────────────────────────────────────────────────────────┘        │
 * │                                                                             │
 * │   IMPORTANT: Code after throw NEVER executes!                              │
 * │                                                                             │
 * └─────────────────────────────────────────────────────────────────────────────┘
 */


// ═══════════════════════════════════════════════════════════════════════════════
// 2. What can you throw?
// ═══════════════════════════════════════════════════════════════════════════════

console.log("═══ 2. What You Can Throw ═══\n");

// You CAN throw anything...
const throwables = [
  () => { throw new Error('Error object'); },
  () => { throw new TypeError('TypeError'); },
  () => { throw 'a string'; },
  () => { throw 42; },
  () => { throw { message: 'object' }; },
  () => { throw ['array']; },
  () => { throw null; },
  () => { throw undefined; }
];

throwables.forEach((fn, i) => {
  try {
    fn();
  } catch (e) {
    console.log(`E${i}: Caught:`, typeof e, '-', e?.message || e);
  }
});

console.log('');

/**
 * ┌─────────────────────────────────────────────────────────────────────────────┐
 * │ WHY ALWAYS THROW ERROR OBJECTS?                                             │
 * ├─────────────────────────────────────────────────────────────────────────────┤
 * │                                                                             │
 * │   WHAT YOU THROW           │ PROBLEMS                                      │
 * │   ─────────────────────────┼───────────────────────────────────────────────│
 * │   throw 'string'           │ No stack trace! Can't debug                   │
 * │   throw 42                 │ No message, no stack, confusing               │
 * │   throw { msg: '...' }     │ Not instanceof Error, no stack                │
 * │   throw null               │ catch(e) { e.message } will throw!            │
 * │   throw new Error('...')   │ ✓ Full stack trace, proper type              │
 * │                                                                             │
 * │   ╔═══════════════════════════════════════════════════════════════════╗     │
 * │   ║ ALWAYS throw Error objects or Error subclasses!                   ║     │
 * │   ║ They have: name, message, stack - essential for debugging         ║     │
 * │   ╚═══════════════════════════════════════════════════════════════════╝     │
 * │                                                                             │
 * └─────────────────────────────────────────────────────────────────────────────┘
 */


// ═══════════════════════════════════════════════════════════════════════════════
// 3. When should you throw?
// ═══════════════════════════════════════════════════════════════════════════════

console.log("═══ 3. When to Throw Errors ═══\n");

// Pattern 1: Validation
function createUser(data) {
  if (!data.email) {
    throw new Error('Email is required');
  }
  if (!data.email.includes('@')) {
    throw new TypeError('Invalid email format');
  }
  return { id: 1, ...data };
}

// Pattern 2: Preconditions (Guard clauses)
function processOrder(order) {
  if (!order) throw new Error('Order is required');
  if (!order.items?.length) throw new Error('Order has no items');
  if (order.total < 0) throw new RangeError('Total cannot be negative');

  // Main logic here...
  return { processed: true };
}

// Pattern 3: Unreachable code
function getStatus(code) {
  switch (code) {
    case 200: return 'OK';
    case 404: return 'Not Found';
    case 500: return 'Server Error';
    default:
      throw new Error(`Unknown status code: ${code}`);
  }
}

// Test each pattern
try {
  createUser({ name: 'John' });
} catch (e) {
  console.log('F: Validation error:', e.message);
}

try {
  processOrder({ items: [] });
} catch (e) {
  console.log('G: Precondition error:', e.message);
}

try {
  getStatus(999);
} catch (e) {
  console.log('H: Unreachable error:', e.message);
}

console.log('');

/**
 * ┌─────────────────────────────────────────────────────────────────────────────┐
 * │ WHEN TO THROW                                                               │
 * ├─────────────────────────────────────────────────────────────────────────────┤
 * │                                                                             │
 * │ THROW when:                                                                 │
 * │ ✓ Function receives invalid arguments                                       │
 * │ ✓ Required resource is missing                                              │
 * │ ✓ Operation cannot complete (network down, file not found)                  │
 * │ ✓ Code reaches "impossible" state (defense against bugs)                    │
 * │ ✓ User input violates business rules                                        │
 * │                                                                             │
 * │ DON'T THROW when:                                                           │
 * │ ✗ Value might not exist (use null/undefined return)                         │
 * │ ✗ Condition is expected (use boolean or result object)                      │
 * │ ✗ It's recoverable at the same level (handle inline)                        │
 * │                                                                             │
 * │ EXAMPLES:                                                                   │
 * │   array.find(x => x.id === 5)   // Returns undefined, don't throw          │
 * │   map.get('key')                // Returns undefined, don't throw          │
 * │   parseFloat('abc')             // Returns NaN, doesn't throw              │
 * │                                                                             │
 * └─────────────────────────────────────────────────────────────────────────────┘
 */


// ═══════════════════════════════════════════════════════════════════════════════
// 4. Re-throwing Errors
// ═══════════════════════════════════════════════════════════════════════════════

console.log("═══ 4. Re-throwing Errors ═══\n");

class DatabaseError extends Error {
  constructor(message) {
    super(message);
    this.name = 'DatabaseError';
  }
}

function handleOperation() {
  try {
    // Simulate some operation
    const random = Math.random();
    if (random < 0.33) throw new DatabaseError('Connection lost');
    if (random < 0.66) throw new TypeError('Invalid data type');
    throw new Error('Unknown error');

  } catch (e) {
    // Only handle DatabaseError, re-throw others
    if (e instanceof DatabaseError) {
      console.log('I: Recovered from DB error:', e.message);
      return { status: 'recovered' };
    }
    // Re-throw errors we can't handle
    throw e;
  }
}

// Multiple attempts to show both outcomes
for (let i = 0; i < 3; i++) {
  try {
    const result = handleOperation();
    console.log('J: Operation result:', result);
    break;
  } catch (e) {
    console.log('K: Unhandled error bubbled up:', e.name);
  }
}

console.log('');

/**
 * ┌─────────────────────────────────────────────────────────────────────────────┐
 * │ RE-THROWING PATTERN                                                         │
 * ├─────────────────────────────────────────────────────────────────────────────┤
 * │                                                                             │
 * │   catch (error) {                                                           │
 * │     if (canHandle(error)) {                                                 │
 * │       // Handle it                                                          │
 * │       return recovered;                                                     │
 * │     }                                                                       │
 * │                                                                             │
 * │     // Can't handle? Let it bubble up!                                      │
 * │     throw error;                                                            │
 * │   }                                                                         │
 * │                                                                             │
 * │   ╔═══════════════════════════════════════════════════════════════════╗     │
 * │   ║ Don't catch errors you can't properly handle!                     ║     │
 * │   ║ "Swallowing" errors hides bugs and makes debugging impossible.   ║     │
 * │   ╚═══════════════════════════════════════════════════════════════════╝     │
 * │                                                                             │
 * │   ANTI-PATTERN:                                                             │
 * │   catch (e) {                                                               │
 * │     console.log('error');  // Swallowed! Who knows what happened?          │
 * │   }                                                                         │
 * │                                                                             │
 * └─────────────────────────────────────────────────────────────────────────────┘
 */


// ═══════════════════════════════════════════════════════════════════════════════
// 5. Wrapping Errors (Add Context)
// ═══════════════════════════════════════════════════════════════════════════════

console.log("═══ 5. Wrapping Errors ═══\n");

class ServiceError extends Error {
  constructor(message, originalError) {
    super(message);
    this.name = 'ServiceError';
    this.cause = originalError;
    this.originalMessage = originalError?.message;
  }
}

function lowLevelOperation() {
  throw new TypeError('Cannot read property "x" of undefined');
}

function midLevelService() {
  try {
    lowLevelOperation();
  } catch (e) {
    // Wrap with context
    throw new ServiceError('User service failed', e);
  }
}

function highLevelHandler() {
  try {
    midLevelService();
  } catch (e) {
    console.log('L: High-level error:', e.message);
    console.log('   Original cause:', e.originalMessage);
    console.log('   Error chain: ServiceError -> TypeError');
  }
}

highLevelHandler();
console.log('');

/**
 * ┌─────────────────────────────────────────────────────────────────────────────┐
 * │ ERROR WRAPPING VISUALIZATION                                                │
 * ├─────────────────────────────────────────────────────────────────────────────┤
 * │                                                                             │
 * │   Layer 1: Low Level                                                        │
 * │   ┌───────────────────────────────────────────────────────────┐            │
 * │   │  TypeError: Cannot read property 'x' of undefined         │            │
 * │   │  (Technical detail - not user friendly)                   │            │
 * │   └───────────────────────────────────────────────────────────┘            │
 * │                              │                                              │
 * │                         wrap │                                              │
 * │                              ▼                                              │
 * │   Layer 2: Service                                                          │
 * │   ┌───────────────────────────────────────────────────────────┐            │
 * │   │  ServiceError: User service failed                        │            │
 * │   │    └── cause: TypeError (original error preserved)        │            │
 * │   └───────────────────────────────────────────────────────────┘            │
 * │                              │                                              │
 * │                    handle    │                                              │
 * │                              ▼                                              │
 * │   Layer 3: Handler                                                          │
 * │   ┌───────────────────────────────────────────────────────────┐            │
 * │   │  Log both errors, show user-friendly message              │            │
 * │   └───────────────────────────────────────────────────────────┘            │
 * │                                                                             │
 * └─────────────────────────────────────────────────────────────────────────────┘
 */


// ═══════════════════════════════════════════════════════════════════════════════
// 6. Conditional throwing (Optional chaining alternative)
// ═══════════════════════════════════════════════════════════════════════════════

console.log("═══ 6. Throw vs Return ═══\n");

// Approach 1: Throw on error
function getUserOrThrow(id) {
  const users = { 1: 'Alice', 2: 'Bob' };
  if (!users[id]) {
    throw new Error(`User ${id} not found`);
  }
  return users[id];
}

// Approach 2: Return null on error
function getUserOrNull(id) {
  const users = { 1: 'Alice', 2: 'Bob' };
  return users[id] || null;
}

// Approach 3: Return Result object
function getUserResult(id) {
  const users = { 1: 'Alice', 2: 'Bob' };
  if (!users[id]) {
    return { success: false, error: `User ${id} not found` };
  }
  return { success: true, data: users[id] };
}

// Usage comparison
console.log('M: Throw approach:');
try {
  console.log('   Found:', getUserOrThrow(1));
  console.log('   Found:', getUserOrThrow(99));
} catch (e) {
  console.log('   Error:', e.message);
}

console.log('N: Null approach:');
console.log('   Found:', getUserOrNull(1));
console.log('   Found:', getUserOrNull(99));  // null, no error

console.log('O: Result approach:');
console.log('   Result:', getUserResult(1));
console.log('   Result:', getUserResult(99));

console.log('');

/**
 * ┌─────────────────────────────────────────────────────────────────────────────┐
 * │ THROW vs RETURN - WHEN TO USE WHICH                                         │
 * ├─────────────────────────────────────────────────────────────────────────────┤
 * │                                                                             │
 * │   APPROACH        │ USE WHEN                      │ CALLER MUST             │
 * │   ────────────────┼───────────────────────────────┼─────────────────────────│
 * │   Throw           │ Exceptional conditions        │ Use try-catch           │
 * │                   │ Unrecoverable errors          │                         │
 * │                   │ "This SHOULD work"            │                         │
 * │   ────────────────┼───────────────────────────────┼─────────────────────────│
 * │   Return null     │ Missing values are normal     │ Check for null          │
 * │                   │ Optional lookups              │                         │
 * │                   │ "Might not exist"             │                         │
 * │   ────────────────┼───────────────────────────────┼─────────────────────────│
 * │   Result object   │ Need error details            │ Check success flag      │
 * │                   │ Complex outcomes              │                         │
 * │                   │ Functional style              │                         │
 * │                                                                             │
 * │   RULE OF THUMB:                                                            │
 * │   - DB not responding? THROW (exceptional)                                  │
 * │   - User not found? RETURN NULL (expected case)                             │
 * │   - Form validation? RESULT OBJECT (need field errors)                      │
 * │                                                                             │
 * └─────────────────────────────────────────────────────────────────────────────┘
 */


/**
 * ┌─────────────────────────────────────────────────────────────────────────────┐
 * │ INTERVIEW ANSWER                                                            │
 * ├─────────────────────────────────────────────────────────────────────────────┤
 * │                                                                             │
 * │ "The throw statement stops execution and transfers control to the          │
 * │  nearest catch block. You can throw anything in JavaScript, but you        │
 * │  should always throw Error objects because they include a stack trace      │
 * │  for debugging.                                                            │
 * │                                                                             │
 * │  I throw errors for:                                                        │
 * │  - Invalid function arguments                                               │
 * │  - Failed preconditions (guard clauses)                                     │
 * │  - Unreachable code (defensive programming)                                 │
 * │  - Operations that can't complete (network failures)                        │
 * │                                                                             │
 * │  For recoverable situations, I use return values instead:                   │
 * │  - Return null for optional lookups                                         │
 * │  - Return result objects { success, data, error } for complex outcomes      │
 * │                                                                             │
 * │  Re-throwing is important - catch only errors you can handle, let          │
 * │  others bubble up. Error wrapping adds context while preserving            │
 * │  the original error for debugging."                                        │
 * │                                                                             │
 * └─────────────────────────────────────────────────────────────────────────────┘
 *
 *
 * RUN: node docs/13-error-handling/03-throwing-errors.js
 */
