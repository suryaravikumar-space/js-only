/**
 * CHALLENGE 02: Creating Custom Errors
 *
 * ╔════════════════════════════════════════════════════════════════════════════╗
 * ║ THE GOLDEN RULE                                                            ║
 * ╠════════════════════════════════════════════════════════════════════════════╣
 * ║                                                                            ║
 * ║ Custom errors make debugging EASIER and error handling MORE SPECIFIC.     ║
 * ║ Instead of generic "Error: something went wrong", you get:                 ║
 * ║ "ValidationError: Email format invalid" - much more actionable!           ║
 * ║                                                                            ║
 * ║   class CustomError extends Error {                                        ║
 * ║     constructor(message) {                                                 ║
 * ║       super(message);                                                      ║
 * ║       this.name = this.constructor.name;                                   ║
 * ║     }                                                                      ║
 * ║   }                                                                        ║
 * ║                                                                            ║
 * ╚════════════════════════════════════════════════════════════════════════════╝
 */


// ═══════════════════════════════════════════════════════════════════════════════
// 1. Basic Custom Error
// ═══════════════════════════════════════════════════════════════════════════════

console.log("═══ 1. Basic Custom Error ═══\n");

class ValidationError extends Error {
  constructor(message) {
    super(message);             // Call parent constructor
    this.name = 'ValidationError';  // Override name
  }
}

try {
  throw new ValidationError('Email format is invalid');
} catch (e) {
  console.log('A: Error name:', e.name);
  console.log('   Error message:', e.message);
  console.log('   Is ValidationError:', e instanceof ValidationError);
  console.log('   Is Error:', e instanceof Error);
}

console.log('');

/**
 * OUTPUT:
 *   A: Error name: ValidationError
 *      Error message: Email format is invalid
 *      Is ValidationError: true
 *      Is Error: true
 *
 *
 * ┌─────────────────────────────────────────────────────────────────────────────┐
 * │ WHY CUSTOM ERRORS?                                                          │
 * ├─────────────────────────────────────────────────────────────────────────────┤
 * │                                                                             │
 * │   WITHOUT custom errors:                                                    │
 * │   ┌─────────────────────────────────────────────────────────────────────┐   │
 * │   │  catch (error) {                                                    │   │
 * │   │    if (error.message.includes('validation')) { ... }               │   │
 * │   │    else if (error.message.includes('network')) { ... }             │   │
 * │   │    // Fragile! What if message changes?                            │   │
 * │   │  }                                                                  │   │
 * │   └─────────────────────────────────────────────────────────────────────┘   │
 * │                                                                             │
 * │   WITH custom errors:                                                       │
 * │   ┌─────────────────────────────────────────────────────────────────────┐   │
 * │   │  catch (error) {                                                    │   │
 * │   │    if (error instanceof ValidationError) { ... }                   │   │
 * │   │    else if (error instanceof NetworkError) { ... }                 │   │
 * │   │    // Robust! Type-based, not string-based                         │   │
 * │   │  }                                                                  │   │
 * │   └─────────────────────────────────────────────────────────────────────┘   │
 * │                                                                             │
 * └─────────────────────────────────────────────────────────────────────────────┘
 */


// ═══════════════════════════════════════════════════════════════════════════════
// 2. Custom Error with Additional Properties
// ═══════════════════════════════════════════════════════════════════════════════

console.log("═══ 2. Error with Extra Data ═══\n");

class HttpError extends Error {
  constructor(message, statusCode, response = null) {
    super(message);
    this.name = 'HttpError';
    this.statusCode = statusCode;
    this.response = response;
    this.timestamp = new Date();
  }

  get isClientError() {
    return this.statusCode >= 400 && this.statusCode < 500;
  }

  get isServerError() {
    return this.statusCode >= 500;
  }
}

try {
  throw new HttpError('Not Found', 404, { path: '/api/users/999' });
} catch (e) {
  console.log('B: Status:', e.statusCode);
  console.log('   Message:', e.message);
  console.log('   Response:', e.response);
  console.log('   Is Client Error:', e.isClientError);
  console.log('   Is Server Error:', e.isServerError);
}

console.log('');

/**
 * ┌─────────────────────────────────────────────────────────────────────────────┐
 * │ CUSTOM ERROR PROPERTIES                                                     │
 * ├─────────────────────────────────────────────────────────────────────────────┤
 * │                                                                             │
 * │   ┌──────────────────────────────────────────────────────────┐             │
 * │   │              HttpError                                    │             │
 * │   ├──────────────────────────────────────────────────────────┤             │
 * │   │  Inherited from Error:                                   │             │
 * │   │  • name                                                   │             │
 * │   │  • message                                                │             │
 * │   │  • stack                                                  │             │
 * │   ├──────────────────────────────────────────────────────────┤             │
 * │   │  Custom properties:                                       │             │
 * │   │  • statusCode: 404                                        │             │
 * │   │  • response: { path: '...' }                              │             │
 * │   │  • timestamp: Date                                        │             │
 * │   ├──────────────────────────────────────────────────────────┤             │
 * │   │  Computed getters:                                        │             │
 * │   │  • isClientError: boolean                                 │             │
 * │   │  • isServerError: boolean                                 │             │
 * │   └──────────────────────────────────────────────────────────┘             │
 * │                                                                             │
 * │   REAL-WORLD USE: APIs return status codes + error details!                │
 * │                                                                             │
 * └─────────────────────────────────────────────────────────────────────────────┘
 */


// ═══════════════════════════════════════════════════════════════════════════════
// 3. Error Hierarchy
// ═══════════════════════════════════════════════════════════════════════════════

console.log("═══ 3. Error Hierarchy ═══\n");

// Base application error
class AppError extends Error {
  constructor(message, code = 'UNKNOWN') {
    super(message);
    this.name = this.constructor.name;
    this.code = code;
    this.isOperational = true;  // vs programming errors
  }
}

// Specific error types
class DatabaseError extends AppError {
  constructor(message, query = null) {
    super(message, 'DB_ERROR');
    this.query = query;
  }
}

class AuthenticationError extends AppError {
  constructor(message = 'Authentication failed') {
    super(message, 'AUTH_ERROR');
  }
}

class AuthorizationError extends AppError {
  constructor(message = 'Access denied') {
    super(message, 'AUTHZ_ERROR');
  }
}

// Usage
function authenticate(token) {
  if (!token) {
    throw new AuthenticationError('No token provided');
  }
  if (token === 'invalid') {
    throw new AuthenticationError('Token expired');
  }
  return { user: 'John' };
}

function checkPermission(user, action) {
  if (action === 'delete' && user !== 'admin') {
    throw new AuthorizationError(`User ${user} cannot ${action}`);
  }
}

try {
  authenticate('invalid');
} catch (e) {
  console.log('C: Error type:', e.constructor.name);
  console.log('   Code:', e.code);
  console.log('   Message:', e.message);
  console.log('   Is AppError:', e instanceof AppError);
}

console.log('');

/**
 * ┌─────────────────────────────────────────────────────────────────────────────┐
 * │ ERROR HIERARCHY PATTERN                                                     │
 * ├─────────────────────────────────────────────────────────────────────────────┤
 * │                                                                             │
 * │                        ┌─────────────┐                                      │
 * │                        │   Error     │                                      │
 * │                        │  (built-in) │                                      │
 * │                        └──────┬──────┘                                      │
 * │                               │                                             │
 * │                        ┌──────▼──────┐                                      │
 * │                        │  AppError   │ ◄── Your base error                  │
 * │                        └──────┬──────┘                                      │
 * │                               │                                             │
 * │        ┌──────────────────────┼──────────────────────┐                      │
 * │        │                      │                      │                      │
 * │        ▼                      ▼                      ▼                      │
 * │  ┌────────────┐      ┌───────────────┐      ┌───────────────┐              │
 * │  │ Database   │      │Authentication │      │Authorization  │              │
 * │  │ Error      │      │ Error         │      │ Error         │              │
 * │  └────────────┘      └───────────────┘      └───────────────┘              │
 * │                                                                             │
 * │   BENEFITS:                                                                 │
 * │   • catch (e instanceof AppError) catches all app errors                   │
 * │   • Each subtype has specific handling                                      │
 * │   • Easy to distinguish operational vs programming errors                  │
 * │                                                                             │
 * └─────────────────────────────────────────────────────────────────────────────┘
 */


// ═══════════════════════════════════════════════════════════════════════════════
// 4. Error with Cause (ES2022)
// ═══════════════════════════════════════════════════════════════════════════════

console.log("═══ 4. Error Chaining with cause ═══\n");

class ConfigError extends Error {
  constructor(message, options = {}) {
    super(message, options);  // Pass options to Error
    this.name = 'ConfigError';
  }
}

function loadConfig() {
  try {
    JSON.parse('{ invalid }');
  } catch (parseError) {
    // Wrap the original error with context
    throw new ConfigError('Failed to load config', { cause: parseError });
  }
}

try {
  loadConfig();
} catch (e) {
  console.log('D: Error:', e.message);
  console.log('   Caused by:', e.cause?.message);
  console.log('   Original error type:', e.cause?.name);
}

console.log('');

/**
 * ┌─────────────────────────────────────────────────────────────────────────────┐
 * │ ERROR CHAINING (ES2022)                                                     │
 * ├─────────────────────────────────────────────────────────────────────────────┤
 * │                                                                             │
 * │   new Error('High level', { cause: originalError })                        │
 * │                                                                             │
 * │   ┌───────────────────────────────────────────────────────────────┐        │
 * │   │  ConfigError                                                   │        │
 * │   │  message: "Failed to load config"                              │        │
 * │   │                                                                │        │
 * │   │  cause: ┌─────────────────────────────────────────────────┐   │        │
 * │   │         │  SyntaxError                                     │   │        │
 * │   │         │  message: "Expected property name..."            │   │        │
 * │   │         └─────────────────────────────────────────────────┘   │        │
 * │   └───────────────────────────────────────────────────────────────┘        │
 * │                                                                             │
 * │   WHY USE CAUSE?                                                            │
 * │   • Preserves original error context                                        │
 * │   • Adds high-level context for debugging                                   │
 * │   • Stack traces show both errors                                           │
 * │                                                                             │
 * └─────────────────────────────────────────────────────────────────────────────┘
 */


// ═══════════════════════════════════════════════════════════════════════════════
// 5. Common Mistake: Forgetting this.name
// ═══════════════════════════════════════════════════════════════════════════════

console.log("═══ 5. Common Mistake ═══\n");

// WRONG: Name is still "Error"
class BadCustomError extends Error {
  constructor(message) {
    super(message);
    // Forgot to set this.name!
  }
}

// CORRECT: Name matches class name
class GoodCustomError extends Error {
  constructor(message) {
    super(message);
    this.name = this.constructor.name;  // Dynamic - always correct!
  }
}

const badError = new BadCustomError('oops');
const goodError = new GoodCustomError('oops');

console.log('E: Bad error name:', badError.name);   // "Error"
console.log('F: Good error name:', goodError.name);  // "GoodCustomError"

console.log('');

/**
 * ┌─────────────────────────────────────────────────────────────────────────────┐
 * │ COMMON MISTAKES                                                             │
 * ├─────────────────────────────────────────────────────────────────────────────┤
 * │                                                                             │
 * │ 1. Forgetting this.name                                                     │
 * │    ✗ Without it, error.name is "Error"                                      │
 * │    ✓ Use this.name = this.constructor.name                                  │
 * │                                                                             │
 * │ 2. Not calling super(message)                                               │
 * │    ✗ Must call super() in constructor                                       │
 * │    ✗ error.message will be undefined                                        │
 * │                                                                             │
 * │ 3. Throwing non-Error objects                                               │
 * │    ✗ throw "string error"     // No stack trace!                            │
 * │    ✗ throw { message: '...' } // Not instanceof Error                       │
 * │    ✓ throw new Error('...')   // Full error object                          │
 * │                                                                             │
 * │ 4. Not preserving stack trace in older JS                                   │
 * │    For pre-ES6, use Error.captureStackTrace() in Node.js                   │
 * │                                                                             │
 * └─────────────────────────────────────────────────────────────────────────────┘
 */


// ═══════════════════════════════════════════════════════════════════════════════
// 6. Real-World Error Class System
// ═══════════════════════════════════════════════════════════════════════════════

console.log("═══ 6. Production Error System ═══\n");

// Base error with useful defaults
class BaseError extends Error {
  constructor(message, options = {}) {
    super(message);
    this.name = this.constructor.name;
    this.statusCode = options.statusCode || 500;
    this.isOperational = options.isOperational ?? true;
    this.code = options.code || 'INTERNAL_ERROR';

    // Capture stack trace (Node.js specific)
    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, this.constructor);
    }
  }

  toJSON() {
    return {
      name: this.name,
      message: this.message,
      code: this.code,
      statusCode: this.statusCode
    };
  }
}

// Specific errors for different scenarios
class NotFoundError extends BaseError {
  constructor(resource = 'Resource') {
    super(`${resource} not found`, {
      statusCode: 404,
      code: 'NOT_FOUND'
    });
  }
}

class BadRequestError extends BaseError {
  constructor(message = 'Bad request', errors = []) {
    super(message, {
      statusCode: 400,
      code: 'BAD_REQUEST'
    });
    this.errors = errors;  // Validation errors array
  }
}

// Usage in API handler
function getUser(id) {
  if (!id) {
    throw new BadRequestError('User ID is required', [
      { field: 'id', message: 'Required field' }
    ]);
  }
  if (id === 999) {
    throw new NotFoundError('User');
  }
  return { id, name: 'John' };
}

try {
  getUser(999);
} catch (e) {
  console.log('G: JSON output:', JSON.stringify(e.toJSON(), null, 2));
}

console.log('');


/**
 * ┌─────────────────────────────────────────────────────────────────────────────┐
 * │ INTERVIEW ANSWER                                                            │
 * ├─────────────────────────────────────────────────────────────────────────────┤
 * │                                                                             │
 * │ "Custom errors extend the built-in Error class to create application-      │
 * │  specific error types. They make error handling more robust by allowing    │
 * │  instanceof checks instead of fragile string matching.                     │
 * │                                                                             │
 * │  Key points when creating custom errors:                                    │
 * │  1. Always call super(message) first                                        │
 * │  2. Set this.name = this.constructor.name for proper error names           │
 * │  3. Add custom properties like statusCode, error codes, timestamps         │
 * │  4. Use ES2022 'cause' option for error chaining                           │
 * │                                                                             │
 * │  In production, I typically create a hierarchy:                             │
 * │  - BaseError with common properties (statusCode, toJSON, isOperational)    │
 * │  - Specific errors (ValidationError, NotFoundError, AuthError)             │
 * │                                                                             │
 * │  The isOperational flag distinguishes expected errors (bad user input)     │
 * │  from unexpected ones (programming bugs) - important for error reporting   │
 * │  and deciding whether to restart the process."                             │
 * │                                                                             │
 * └─────────────────────────────────────────────────────────────────────────────┘
 *
 *
 * RUN: node docs/13-error-handling/02-custom-errors.js
 */
