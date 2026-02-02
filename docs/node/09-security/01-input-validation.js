/**
 * TOPIC 01: Input Validation & Sanitization
 *
 * ╔════════════════════════════════════════════════════════════════════════════╗
 * ║ THE GOLDEN RULE                                                            ║
 * ╠════════════════════════════════════════════════════════════════════════════╣
 * ║                                                                            ║
 * ║ ALL input is GUILTY until proven INNOCENT.                                ║
 * ║ Validate type, length, format, and range BEFORE processing.              ║
 * ║                                                                            ║
 * ║   Validate = "Is this what I expect?" (reject if not)                    ║
 * ║   Sanitize = "Remove/escape anything dangerous" (clean it up)            ║
 * ║                                                                            ║
 * ╚════════════════════════════════════════════════════════════════════════════╝
 *
 *
 * ┌─────────────────────────────────────────────────────────────────────────────┐
 * │ STORY TO REMEMBER                                                          │
 * ├─────────────────────────────────────────────────────────────────────────────┤
 * │                                                                             │
 * │  Think of input validation like a BOUNCER AT A CLUB:                      │
 * │                                                                             │
 * │  1. CHECK ID (Type Validation)                                            │
 * │     - "Are you a string? A number? Show me your type."                    │
 * │     - Wrong type? Rejected at the door.                                   │
 * │                                                                             │
 * │  2. CHECK AGE (Range/Length Validation)                                    │
 * │     - "You must be between 18-99. Your name must be 1-50 chars."         │
 * │     - Out of range? Rejected.                                             │
 * │                                                                             │
 * │  3. CHECK DRESS CODE (Format/Pattern Validation)                          │
 * │     - "Email must have @. Phone must be digits only."                     │
 * │     - Wrong format? Rejected.                                             │
 * │                                                                             │
 * │  4. PAT DOWN (Sanitization)                                               │
 * │     - "Remove weapons (scripts), contraband (SQL), hidden items."        │
 * │     - Anything dangerous gets confiscated.                                │
 * │                                                                             │
 * │  "Never let ANYONE in without checking ALL four things."                  │
 * │                                                                             │
 * └─────────────────────────────────────────────────────────────────────────────┘
 *
 *
 * ┌─────────────────────────────────────────────────────────────────────────────┐
 * │ VISUAL DIAGRAM: Input Validation Flow                                      │
 * ├─────────────────────────────────────────────────────────────────────────────┤
 * │                                                                             │
 * │   DIRTY INPUT                                                              │
 * │       │                                                                    │
 * │       ▼                                                                    │
 * │   ┌──────────────┐     ┌────────┐                                         │
 * │   │ TYPE CHECK   │────▶│ REJECT │  "Expected string, got object"          │
 * │   │ (typeof/     │ ✗   └────────┘                                         │
 * │   │  instanceof) │                                                         │
 * │   └──────┬───────┘                                                         │
 * │          │ ✓                                                               │
 * │          ▼                                                                 │
 * │   ┌──────────────┐     ┌────────┐                                         │
 * │   │ LENGTH/RANGE │────▶│ REJECT │  "Too long / out of range"              │
 * │   │ CHECK        │ ✗   └────────┘                                         │
 * │   └──────┬───────┘                                                         │
 * │          │ ✓                                                               │
 * │          ▼                                                                 │
 * │   ┌──────────────┐     ┌────────┐                                         │
 * │   │ FORMAT CHECK │────▶│ REJECT │  "Invalid email/phone format"           │
 * │   │ (regex)      │ ✗   └────────┘                                         │
 * │   └──────┬───────┘                                                         │
 * │          │ ✓                                                               │
 * │          ▼                                                                 │
 * │   ┌──────────────┐                                                         │
 * │   │ SANITIZE     │  Strip HTML tags, escape special chars                 │
 * │   │ (clean)      │                                                         │
 * │   └──────┬───────┘                                                         │
 * │          │                                                                 │
 * │          ▼                                                                 │
 * │   CLEAN INPUT ✓                                                            │
 * │                                                                             │
 * └─────────────────────────────────────────────────────────────────────────────┘
 */

// ============================================================================
// 1. TYPE CHECKING - First line of defense
// ============================================================================

console.log('=== 1. TYPE CHECKING ===\n');

const isString = (val) => typeof val === 'string';
const isNumber = (val) => typeof val === 'number' && !Number.isNaN(val) && Number.isFinite(val);
const isBoolean = (val) => typeof val === 'boolean';
const isObject = (val) => val !== null && typeof val === 'object' && !Array.isArray(val);
const isArray = (val) => Array.isArray(val);

const testValues = [
  { input: 'hello', expected: 'string' },
  { input: 42, expected: 'number' },
  { input: NaN, expected: 'NaN (invalid number)' },
  { input: Infinity, expected: 'Infinity (invalid number)' },
  { input: null, expected: 'null (not an object!)' },
  { input: undefined, expected: 'undefined' },
];

testValues.forEach(({ input, expected }) => {
  console.log(`A: ${String(input).padEnd(12)} → isString: ${isString(input)}, isNumber: ${isNumber(input)} (${expected})`);
});

// ============================================================================
// 2. LENGTH AND RANGE VALIDATION
// ============================================================================

console.log('\n=== 2. LENGTH & RANGE VALIDATION ===\n');

const validateLength = (str, min, max) => {
  if (!isString(str)) return { valid: false, error: 'Not a string' };
  if (str.length < min) return { valid: false, error: `Too short (min: ${min})` };
  if (str.length > max) return { valid: false, error: `Too long (max: ${max})` };
  return { valid: true };
};

const validateRange = (num, min, max) => {
  if (!isNumber(num)) return { valid: false, error: 'Not a valid number' };
  if (num < min) return { valid: false, error: `Below minimum (${min})` };
  if (num > max) return { valid: false, error: `Above maximum (${max})` };
  return { valid: true };
};

console.log('B:', 'Username "Jo":', validateLength('Jo', 3, 20));
console.log('C:', 'Username "John":', validateLength('John', 3, 20));
console.log('D:', 'Age 150:', validateRange(150, 1, 120));
console.log('E:', 'Age 25:', validateRange(25, 1, 120));

// ============================================================================
// 3. REGEX VALIDATION PATTERNS
// ============================================================================

console.log('\n=== 3. REGEX VALIDATION ===\n');

const patterns = {
  email: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
  phone: /^\+?[1-9]\d{6,14}$/,
  alphanumeric: /^[a-zA-Z0-9]+$/,
  slug: /^[a-z0-9]+(?:-[a-z0-9]+)*$/,
  ipv4: /^(?:(?:25[0-5]|2[0-4]\d|[01]?\d\d?)\.){3}(?:25[0-5]|2[0-4]\d|[01]?\d\d?)$/,
  username: /^[a-zA-Z][a-zA-Z0-9_]{2,19}$/,
};

const validate = (value, patternName) => {
  const pattern = patterns[patternName];
  if (!pattern) return { valid: false, error: 'Unknown pattern' };
  return { valid: pattern.test(value) };
};

console.log('F:', 'Email "user@test.com":', validate('user@test.com', 'email'));
console.log('G:', 'Email "not-an-email":', validate('not-an-email', 'email'));
console.log('H:', 'Phone "+14155551234":', validate('+14155551234', 'phone'));
console.log('I:', 'Username "a":', validate('a', 'username'));
console.log('J:', 'Username "john_doe":', validate('john_doe', 'username'));
console.log('K:', 'IPv4 "192.168.1.1":', validate('192.168.1.1', 'ipv4'));
console.log('L:', 'IPv4 "999.999.999.999":', validate('999.999.999.999', 'ipv4'));

// ============================================================================
// 4. SANITIZATION - Clean dangerous content
// ============================================================================

console.log('\n=== 4. SANITIZATION ===\n');

// Strip HTML tags
const stripHtml = (str) => String(str).replace(/<[^>]*>/g, '');

// Escape HTML entities
const escapeHtml = (str) => {
  const map = { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#x27;' };
  return String(str).replace(/[&<>"']/g, (c) => map[c]);
};

// Remove null bytes (used in null byte injection)
const removeNullBytes = (str) => String(str).replace(/\0/g, '');

// Trim and normalize whitespace
const normalizeWhitespace = (str) => String(str).trim().replace(/\s+/g, ' ');

const dirtyInput = '  <script>alert("xss")</script>  Hello   World  ';

console.log('M:', 'Original:', JSON.stringify(dirtyInput));
console.log('N:', 'stripHtml:', JSON.stringify(stripHtml(dirtyInput)));
console.log('O:', 'escapeHtml:', escapeHtml(dirtyInput));
console.log('P:', 'normalized:', JSON.stringify(normalizeWhitespace(stripHtml(dirtyInput))));

// ============================================================================
// 5. AVOIDING EVAL() AND DANGEROUS FUNCTIONS
// ============================================================================

console.log('\n=== 5. NEVER USE eval() ===\n');

// DANGEROUS - eval executes arbitrary code:
// eval(userInput)           ← NEVER
// new Function(userInput)   ← NEVER
// setTimeout(userInput, 0)  ← NEVER with string arg
// setInterval(userInput, 0) ← NEVER with string arg

// SAFE alternative - use a whitelist/map
const operations = {
  add: (a, b) => a + b,
  subtract: (a, b) => a - b,
  multiply: (a, b) => a * b,
  divide: (a, b) => (b === 0 ? 'Error: division by zero' : a / b),
};

const safeCalculate = (operation, a, b) => {
  if (!isString(operation) || !operations[operation]) {
    return { error: `Unknown operation: ${operation}` };
  }
  if (!isNumber(a) || !isNumber(b)) {
    return { error: 'Invalid operands' };
  }
  return { result: operations[operation](a, b) };
};

console.log('Q:', 'add(5, 3):', safeCalculate('add', 5, 3));
console.log('R:', 'divide(10, 0):', safeCalculate('divide', 10, 0));
console.log('S:', 'evil("rm -rf /", 1, 2):', safeCalculate('evil("rm -rf /")', 1, 2));

// ============================================================================
// 6. PARAMETERIZED QUERY CONCEPT
// ============================================================================

console.log('\n=== 6. PARAMETERIZED QUERIES (Concept) ===\n');

// Simulate a parameterized query builder
const buildQuery = (template, params) => {
  // In real apps, your DB driver does this safely
  // This is just to illustrate the concept
  const escapedParams = params.map((p) => {
    if (isString(p)) return `'${p.replace(/'/g, "''")}'`;
    if (isNumber(p)) return String(p);
    return 'NULL';
  });
  return { template, params: escapedParams, safe: true };
};

console.log('T:', 'Safe query:', buildQuery(
  'SELECT * FROM users WHERE email = ? AND age > ?',
  ['user@test.com', 18]
));

console.log('U:', 'With injection attempt:', buildQuery(
  'SELECT * FROM users WHERE email = ?',
  ["'; DROP TABLE users; --"]
));
console.log('V:', '^^^ The malicious input is treated as a string VALUE, not SQL code');

// ============================================================================
// 7. FULL VALIDATION PIPELINE
// ============================================================================

console.log('\n=== 7. COMPLETE VALIDATION PIPELINE ===\n');

const validateUserInput = (input) => {
  const errors = [];

  // Step 1: Type check
  if (!isObject(input)) return { valid: false, errors: ['Input must be an object'] };

  // Step 2: Required fields
  const required = ['username', 'email', 'age'];
  required.forEach((field) => {
    if (input[field] === undefined || input[field] === null) {
      errors.push(`Missing required field: ${field}`);
    }
  });
  if (errors.length > 0) return { valid: false, errors };

  // Step 3: Type + format validation
  if (!isString(input.username)) errors.push('Username must be a string');
  else if (!patterns.username.test(input.username)) errors.push('Username: 3-20 chars, alphanumeric + underscore');

  if (!isString(input.email)) errors.push('Email must be a string');
  else if (!patterns.email.test(input.email)) errors.push('Invalid email format');

  if (!isNumber(input.age)) errors.push('Age must be a number');
  else if (input.age < 1 || input.age > 120) errors.push('Age must be 1-120');

  if (errors.length > 0) return { valid: false, errors };

  // Step 4: Sanitize
  return {
    valid: true,
    sanitized: {
      username: normalizeWhitespace(input.username).toLowerCase(),
      email: normalizeWhitespace(input.email).toLowerCase(),
      age: Math.floor(input.age),
    },
  };
};

console.log('W:', validateUserInput({ username: 'John_Doe', email: 'john@test.com', age: 25 }));
console.log('X:', validateUserInput({ username: 'a', email: 'bad', age: 200 }));
console.log('Y:', validateUserInput('not an object'));
console.log('Z:', validateUserInput({ username: '<script>alert(1)</script>', email: 'x', age: 'old' }));

/**
 * OUTPUT:
 *   === 1. TYPE CHECKING ===
 *
 *   A: hello        → isString: true, isNumber: false (string)
 *   A: 42           → isString: false, isNumber: true (number)
 *   A: NaN          → isString: false, isNumber: false (NaN (invalid number))
 *   A: Infinity     → isString: false, isNumber: false (Infinity (invalid number))
 *   A: null         → isString: false, isNumber: false (null (not an object!))
 *   A: undefined    → isString: false, isNumber: false (undefined)
 *
 *   === 2. LENGTH & RANGE VALIDATION ===
 *
 *   B: Username "Jo": { valid: false, error: 'Too short (min: 3)' }
 *   C: Username "John": { valid: true }
 *   D: Age 150: { valid: false, error: 'Above maximum (120)' }
 *   E: Age 25: { valid: true }
 *
 *   === 3. REGEX VALIDATION ===
 *
 *   F: Email "user@test.com": { valid: true }
 *   G: Email "not-an-email": { valid: false }
 *   ... (remaining validation outputs)
 *
 *   === 4. SANITIZATION ===
 *
 *   M: Original: "  <script>alert(\"xss\")</script>  Hello   World  "
 *   N: stripHtml: "  alert(\"xss\")  Hello   World  "
 *   O: escapeHtml: (escaped version)
 *   P: normalized: "alert(\"xss\") Hello World"
 *
 *   === 5. NEVER USE eval() ===
 *   ... (calculation outputs)
 *
 *   === 6. PARAMETERIZED QUERIES (Concept) ===
 *   ... (query outputs)
 *
 *   === 7. COMPLETE VALIDATION PIPELINE ===
 *   ... (pipeline outputs)
 *
 *
 * ┌─────────────────────────────────────────────────────────────────────────────┐
 * │ INTERVIEW ANSWER                                                            │
 * ├─────────────────────────────────────────────────────────────────────────────┤
 * │                                                                             │
 * │ "Input validation is the first line of defense. I follow a pipeline:      │
 * │  1) Type check - reject wrong types immediately.                          │
 * │  2) Length/range check - enforce boundaries.                              │
 * │  3) Format check - use regex for emails, phones, etc.                     │
 * │  4) Sanitize - strip HTML, escape special chars, normalize whitespace.    │
 * │  Never use eval() or string concatenation in queries. Always use          │
 * │  parameterized queries and whitelisted operations. Validate on both       │
 * │  client AND server - client validation is for UX, server is for safety." │
 * │                                                                             │
 * └─────────────────────────────────────────────────────────────────────────────┘
 *
 *
 * RUN: node docs/node/09-security/01-input-validation.js
 */
