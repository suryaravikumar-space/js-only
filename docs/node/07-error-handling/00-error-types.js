/**
 * TOPIC 00: Error Types in Node.js
 *
 * ╔════════════════════════════════════════════════════════════════════════════╗
 * ║ THE GOLDEN RULE                                                            ║
 * ╠════════════════════════════════════════════════════════════════════════════╣
 * ║                                                                            ║
 * ║ Every error in JavaScript is an OBJECT with message, stack, and name.     ║
 * ║ Know your error types: TypeError, RangeError, ReferenceError, etc.       ║
 * ║ Custom errors extend Error to add domain-specific meaning.               ║
 * ║                                                                            ║
 * ║   error.message  → What went wrong (human-readable)                      ║
 * ║   error.stack    → Where it went wrong (call trace)                      ║
 * ║   error.name     → Which type of error                                   ║
 * ║   error.code     → Node.js system error code (e.g., 'ENOENT')           ║
 * ║                                                                            ║
 * ╚════════════════════════════════════════════════════════════════════════════╝
 *
 *
 * ┌─────────────────────────────────────────────────────────────────────────────┐
 * │ STORY TO REMEMBER                                                          │
 * ├─────────────────────────────────────────────────────────────────────────────┤
 * │                                                                             │
 * │  Think of errors like DIFFERENT CAR PROBLEMS:                              │
 * │                                                                             │
 * │  TypeError      → Flat tire. You tried to DRIVE on something that         │
 * │                    isn't a wheel. (called a non-function, wrong type)      │
 * │                                                                             │
 * │  RangeError     → Wrong turn. You went OUT OF BOUNDS.                     │
 * │                    (array index, invalid length, stack overflow)            │
 * │                                                                             │
 * │  ReferenceError → Missing map. You looked for a ROAD that doesn't exist.  │
 * │                    (used a variable that was never declared)                │
 * │                                                                             │
 * │  SyntaxError    → Broken engine. The car can't even START.                │
 * │                    (malformed code, bad JSON parse)                         │
 * │                                                                             │
 * │  SystemError    → Engine failure. The ROAD itself is broken.              │
 * │                    (file not found, permission denied, network down)        │
 * │                                                                             │
 * │  "Each car problem has a DIFFERENT fix. Know the problem first."          │
 * │                                                                             │
 * └─────────────────────────────────────────────────────────────────────────────┘
 *
 *
 * ┌─────────────────────────────────────────────────────────────────────────────┐
 * │ VISUAL DIAGRAM: Error Hierarchy                                            │
 * ├─────────────────────────────────────────────────────────────────────────────┤
 * │                                                                             │
 * │                        Error (base class)                                  │
 * │                             │                                              │
 * │         ┌───────────┬───────┼────────┬──────────────┐                      │
 * │         │           │       │        │              │                      │
 * │    TypeError   RangeError   │   SyntaxError   SystemError                 │
 * │    (wrong       (out of     │   (bad code)    (OS-level)                   │
 * │     type)       bounds)     │                  │                           │
 * │                        ReferenceError      ┌───┴────┐                     │
 * │                        (undeclared         ENOENT  EACCES                 │
 * │                         variable)          ECONNREFUSED                    │
 * │                                                                             │
 * │   Every Error has:                                                         │
 * │   ┌────────────┬──────────────────────────────────────┐                    │
 * │   │ .message   │ "Cannot read property of undefined" │                    │
 * │   │ .name      │ "TypeError"                          │                    │
 * │   │ .stack     │ "TypeError: Cannot read...\n at..."  │                    │
 * │   │ .code      │ "ENOENT" (Node system errors only)  │                    │
 * │   └────────────┴──────────────────────────────────────┘                    │
 * │                                                                             │
 * └─────────────────────────────────────────────────────────────────────────────┘
 */

const fs = require('fs');

// ─── 1. TypeError: calling/accessing wrong types ───
console.log('=== 1. TypeError ===');
try {
  const num = 42;
  num.toUpperCase(); // number has no toUpperCase
} catch (err) {
  console.log('A:', err.name);       // TypeError
  console.log('B:', err.message);    // num.toUpperCase is not a function
}

try {
  const obj = undefined;
  obj.name; // cannot read property of undefined
} catch (err) {
  console.log('C:', err.name);       // TypeError
}

// ─── 2. RangeError: value out of valid range ───
console.log('\n=== 2. RangeError ===');
try {
  const arr = new Array(-1); // negative length
} catch (err) {
  console.log('D:', err.name);       // RangeError
  console.log('E:', err.message);    // Invalid array length
}

try {
  const num = 1.5;
  num.toFixed(200); // precision out of range
} catch (err) {
  console.log('F:', err.name);       // RangeError
}

// ─── 3. ReferenceError: accessing undeclared variables ───
console.log('\n=== 3. ReferenceError ===');
try {
  console.log(nonExistentVariable);
} catch (err) {
  console.log('G:', err.name);       // ReferenceError
  console.log('H:', err.message);    // nonExistentVariable is not defined
}

// ─── 4. SyntaxError: bad code structure (at parse time or JSON.parse) ───
console.log('\n=== 4. SyntaxError ===');
try {
  JSON.parse('{ invalid json }');
} catch (err) {
  console.log('I:', err.name);       // SyntaxError
  console.log('J:', err.message);    // Unexpected token i...
}

// ─── 5. System Errors (Node.js specific - have .code) ───
console.log('\n=== 5. SystemError (Node.js) ===');
try {
  fs.readFileSync('/path/that/does/not/exist.txt');
} catch (err) {
  console.log('K:', err.name);       // Error
  console.log('L:', err.code);       // ENOENT
  console.log('M:', err.message.includes('no such file')); // true
}

// ─── 6. Error properties: message, stack, name ───
console.log('\n=== 6. Error Properties ===');
try {
  throw new Error('Something broke');
} catch (err) {
  console.log('N:', err.name);       // Error
  console.log('O:', err.message);    // Something broke
  console.log('P:', typeof err.stack); // string
  console.log('Q:', err.stack.split('\n')[0]); // Error: Something broke
}

// ─── 7. Custom Errors ───
console.log('\n=== 7. Custom Errors ===');

class ValidationError extends Error {
  constructor(field, value) {
    super(`Invalid value "${value}" for field "${field}"`);
    this.name = 'ValidationError';
    this.field = field;
    this.value = value;
    this.code = 'ERR_VALIDATION';
  }
}

class NotFoundError extends Error {
  constructor(resource, id) {
    super(`${resource} with id "${id}" not found`);
    this.name = 'NotFoundError';
    this.statusCode = 404;
    this.code = 'ERR_NOT_FOUND';
  }
}

try {
  throw new ValidationError('email', 'not-an-email');
} catch (err) {
  console.log('R:', err.name);           // ValidationError
  console.log('S:', err.message);        // Invalid value "not-an-email" for field "email"
  console.log('T:', err.field);          // email
  console.log('U:', err.code);           // ERR_VALIDATION
  console.log('V:', err instanceof ValidationError); // true
  console.log('W:', err instanceof Error);           // true
}

try {
  throw new NotFoundError('User', '123');
} catch (err) {
  console.log('X:', err.name);           // NotFoundError
  console.log('Y:', err.statusCode);     // 404
  console.log('Z:', err.code);           // ERR_NOT_FOUND
}

// ─── 8. Checking error types with instanceof ───
console.log('\n=== 8. instanceof checks ===');

const handleError = (err) => {
  if (err instanceof ValidationError) {
    console.log('AA:', `Validation failed on ${err.field}`);
  } else if (err instanceof NotFoundError) {
    console.log('AA:', `Resource not found: ${err.message}`);
  } else if (err.code === 'ENOENT') {
    console.log('AA:', 'File not found');
  } else {
    console.log('AA:', `Unknown error: ${err.message}`);
  }
};

handleError(new ValidationError('age', -5));
handleError(new NotFoundError('Product', '999'));

/**
 * OUTPUT:
 *   === 1. TypeError ===
 *   A: TypeError
 *   B: num.toUpperCase is not a function
 *   C: TypeError
 *
 *   === 2. RangeError ===
 *   D: RangeError
 *   E: Invalid array length
 *   F: RangeError
 *
 *   === 3. ReferenceError ===
 *   G: ReferenceError
 *   H: nonExistentVariable is not defined
 *
 *   === 4. SyntaxError ===
 *   I: SyntaxError
 *   J: Unexpected token i in JSON at position 2
 *
 *   === 5. SystemError (Node.js) ===
 *   K: Error
 *   L: ENOENT
 *   M: true
 *
 *   === 6. Error Properties ===
 *   N: Error
 *   O: Something broke
 *   P: string
 *   Q: Error: Something broke
 *
 *   === 7. Custom Errors ===
 *   R: ValidationError
 *   S: Invalid value "not-an-email" for field "email"
 *   T: email
 *   U: ERR_VALIDATION
 *   V: true
 *   W: true
 *   X: NotFoundError
 *   Y: 404
 *   Z: ERR_NOT_FOUND
 *
 *   === 8. instanceof checks ===
 *   AA: Validation failed on age
 *   AA: Resource not found: Product with id "999" not found
 *
 *
 * ┌─────────────────────────────────────────────────────────────────────────────┐
 * │ INTERVIEW ANSWER                                                            │
 * ├─────────────────────────────────────────────────────────────────────────────┤
 * │                                                                             │
 * │ "JavaScript has several built-in error types: TypeError for wrong types,   │
 * │  RangeError for out-of-bounds values, ReferenceError for undeclared        │
 * │  variables, and SyntaxError for malformed code. Node.js adds system        │
 * │  errors with a .code property like ENOENT or EACCES. Every error has      │
 * │  .message, .name, and .stack. For domain-specific errors, I extend the    │
 * │  Error class to create custom errors with additional properties like       │
 * │  statusCode or field names, and use instanceof to handle them."           │
 * │                                                                             │
 * └─────────────────────────────────────────────────────────────────────────────┘
 *
 *
 * RUN: node docs/node/07-error-handling/00-error-types.js
 */
